import express, { Request, Response } from "express";
import TelegramBot, { CallbackQuery, Message} from "node-telegram-bot-api";
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
import handleOptionsAvailable from "./handlers/handleOptionsAvailable";

const app = express();
const PORT = 5000;

/*const ngrok_url = "https://83f5-2804-14c-4e2-42d4-f1c-2511-b7a7-6fef.ngrok-free.app";
//const ferrarezzo_url = "https://ferrarezzo.loca.lt"
const almirtoken = "7315270892:AAEEX-DjOIIIssVfn1-QPYyhV7729YelfeU";
const newbot = new TelegramBot(almirtoken,{polling:false})
newbot.setWebHook(`${ngrok_url}/webhook/3`)*/
app.use(express.json());

app.post("/webhook/:id",handleInitialMessage, async (req: Request, res: Response) => {

  const clientId = res.locals.clientId
  const provider = res.locals.provider
  const bot = res.locals.bot
  const chatId = res.locals.chatId
  const callback = res.locals.callback_query
  const conversation = res.locals.conversation
  const message = res.locals.message

  if (conversation.conversationState === "service_selection") {
    return await handleServiceSelection({
      clientId,
      provider,
      bot,
      chatId,
      callback_query:callback,
      res,
    });
  }

  if (conversation.conversationState === "date_selection") {
    return await handleDateSelection({
      bot,
      callback_query:callback,
      chatId,
      clientId,
      provider,
      res,
    });
  }

  if(conversation.conversationState === "service_request"){
    return await handleServiceRequest({bot,chatId,clientId,provider})
  }

  if(conversation.conversationState === "options_available"){
    return await handleOptionsAvailable({bot,callback_query:callback,chatId,clientId,provider,message})
  }
});

app.listen(PORT, () => {
  console.log(`Running bot on port: ${PORT}`);
});
