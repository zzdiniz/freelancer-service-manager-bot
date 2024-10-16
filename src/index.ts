import express, { Request, Response } from "express";
import handleInitialMessage from "./handlers/handleInitialMessage";
import handleServiceSelection from "./handlers/handleServiceSelection";
import handleDateSelection from "./handlers/handleDateSelection";
import handleServiceRequest from "./handlers/handleServiceRequest";
import handleOptionsAvailable from "./handlers/handleOptionsAvailable";
import TelegramBot from "node-telegram-bot-api";

const app = express();
const PORT = 5000;
//ngrok http http://localhost:5000
/*const ngrok_url = "https://96ca-2804-14c-4e2-42d4-ce0e-c6e-5bf2-7303.ngrok-free.app";
const ferrarezzo_url = "https://ferrarezzo.loca.lt"
const almirtoken = "7315270892:AAEEX-DjOIIIssVfn1-QPYyhV7729YelfeU";
const leveneToken = "7545404995:AAECIB4OZlKLyBfu8P8ctLLzKbP2Pbb7fvw"
const newbot = new TelegramBot(leveneToken,{polling:false})
const testeProviderId = 8
newbot.setWebHook(`${ngrok_url}/webhook/${testeProviderId}`)*/
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
