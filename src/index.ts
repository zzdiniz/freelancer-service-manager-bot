import express, { Request, Response } from "express";
import handleInitialMessage from "./handlers/handleInitialMessage";
import handleServiceSelection from "./handlers/handleServiceSelection";
import handleDateSelection from "./handlers/handleDateSelection";
import handleServiceRequest from "./handlers/handleServiceRequest";
import handleOptionsAvailable from "./handlers/handleOptionsAvailable";
//import TelegramBot from "node-telegram-bot-api";

const app = express();
const PORT = 5000;

/*const ngrok_url = "https://56ba-2804-14c-4e2-42d4-5db8-3639-60b6-8e9b.ngrok-free.app";
const ferrarezzo_url = "https://ferrarezzo.loca.lt"
const almirtoken = "7315270892:AAEEX-DjOIIIssVfn1-QPYyhV7729YelfeU";
const newbot = new TelegramBot(almirtoken,{polling:false})
newbot.setWebHook(`${ngrok_url}/webhook/2`)*/
app.use(express.json());

app.post(
  "/webhook/:id",
  handleInitialMessage,
  handleServiceSelection,
  handleDateSelection,
  handleServiceRequest,
  handleOptionsAvailable,
  async (req: Request, res: Response) => {}
);

app.listen(PORT, () => {
  console.log(`Running bot on port: ${PORT}`);
});
