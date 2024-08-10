import express, { Request, Response } from "express";
import TelegramBot from "node-telegram-bot-api";
import Message from "./types/Message";
import Bot from "./types/Bot";
import getBotById from "./services/getBotById";
import getServicesByProviderId from "./services/getServicesbyProviderId";
import getClientById from "./services/getClientById";
import addClient from "./services/addClient";
import addConversation from "./services/addConversation";
import getConversation from "./services/getConversation";

const app = express();
const PORT = 5000;
const PUBLIC_URL = "https://ferrarezzo.loca.lt/";
app.use(express.json());

app.post("/webhook/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message } = req.body as { message: Message };

  if (!id) {
    return res.status(422).json({ message: "Id not provided" });
  }
  if (!message) {
    return res.status(422).json({ message: "Message not provided" });
  }

  const botResponse: Bot = await getBotById(parseInt(id));
  if (!botResponse) {
    return res.status(404).json({ message: "Bot not found" });
  }
  const client = await getClientById(message.from.id);
  const clientId = message.from.id;
  const providerId = botResponse.providerId;
  if (!client) {
    const name = message.from.first_name;
    const username = message.from.username;

    await addClient({ id: clientId, name, username });
  }
  const conversation = await getConversation(providerId, clientId);

  if (!conversation) {
    await addConversation({ providerId, clientId });
  }

  const bot = new TelegramBot(botResponse.token);
  //const services = await getServicesByProviderId(botResponse.providerId);
  bot.sendMessage(
    message.chat.id,
    `Você disse: ${message.text} e você está neste estado da conversa: ${conversation?.conversationState}`
  );

  return res.status(200).json({ message: `Id retornado: ${id}` });
});
app.listen(PORT, () => {
  console.log(`Runing bot on port: ${PORT}`);
});
