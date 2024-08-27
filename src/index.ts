import express, { Request, Response } from "express";
import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import { Message } from "./types/Message";
import Bot from "./types/Bot";
import getBotById from "./services/getBotById";
import getClientById from "./services/getClientById";
import addClient from "./services/addClient";
import addConversation from "./services/addConversation";
import getConversation from "./services/getConversation";
import getProviderById from "./services/getProviderById";
import handleInitialMessage from "./handlers/handleInitialMessage";
import handleServiceSelection from "./handlers/handleServiceSelection";
import handleDateSelection from "./handlers/handleDateSelection";
import handleServiceRequest from "./handlers/handleServiceRequest";

const app = express();
const PORT = 5000;
/*const ngrok_url = "https://899f-2804-14c-4e2-42d4-395f-f02a-48b2-e351.ngrok-free.app";
//const ferrarezzo_url = "https://ferrarezzo.loca.lt"
const almirtoken = "7315270892:AAEEX-DjOIIIssVfn1-QPYyhV7729YelfeU";
const newbot = new TelegramBot(almirtoken)
newbot.setWebHook(`${ngrok_url}/webhook/3`)*/
app.use(express.json());

app.post("/webhook/:id", async (req: Request, res: Response) => {
  console.log("Webhook received");
  const { id } = req.params;
  const { message, callback_query } = req.body as {
    message?: Message;
    callback_query?: CallbackQuery;
  };

  console.log("Request Data:", { message, callback_query });

  if (!id) {
    return res.status(422).json({ message: "Id not provided" });
  }

  const botResponse: Bot = await getBotById(parseInt(id));
  if (!botResponse) {
    return res.status(404).json({ message: "Bot not found" });
  }

  const clientId = message?.from?.id ?? callback_query?.message?.chat?.id;
  const chatId = message?.from?.id ?? callback_query?.message?.chat?.id;

  if (!clientId || !chatId) {
    return res.status(400).json({ message: "Invalid client or chat ID" });
  }

  const client = await getClientById(clientId);
  const providerId = botResponse.providerId;
  const provider = await getProviderById(providerId);

  if (!client) {
    const name =
      message?.from?.first_name ??
      (callback_query?.message?.chat.first_name as string);
    const username =
      message?.from?.username ??
      (callback_query?.message?.chat.username as string);

    await addClient({ id: clientId, name, username });
  }

  let conversation = await getConversation(providerId, clientId);

  if (!conversation) {
    await addConversation({
      providerId,
      clientId,
      conversationState: "initial_message",
    });
    conversation = await getConversation(providerId, clientId);
  }

  const bot = new TelegramBot(botResponse.token, { polling: false });

  console.log('conversation?.conversationState',conversation?.conversationState)

  if (!conversation || conversation.conversationState === "initial_message") {
    return await handleInitialMessage({
      client,
      clientId,
      provider,
      bot,
      chatId,
      res,
    });
  }

  if (conversation.conversationState === "service_selection") {
    return await handleServiceSelection({
      clientId,
      provider,
      bot,
      chatId,
      callback_query,
      res,
    });
  }

  if (conversation.conversationState === "date_selection") {
    return await handleDateSelection({
      bot,
      callback_query,
      chatId,
      clientId,
      provider,
      res,
    });
  }

  if(conversation.conversationState === "service_request"){
    return await handleServiceRequest({bot,chatId,clientId,provider})
  }

  return res.status(200).json({ message: `Id retornado: ${id}` });
});

app.listen(PORT, () => {
  console.log(`Running bot on port: ${PORT}`);
});
