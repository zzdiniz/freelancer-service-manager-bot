import express, { Request, Response } from "express";
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
