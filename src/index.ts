import express, { Request, Response } from "express";
import handleInitialMessage from "./handlers/handleInitialMessage";
import handleServiceSelection from "./handlers/handleServiceSelection";
import handleDateSelection from "./handlers/handleDateSelection";
import handleServiceRequest from "./handlers/handleServiceRequest";
import handleOptionsAvailable from "./handlers/handleOptionsAvailable";

const app = express();
const PORT = 5000;

app.use(express.json());

app.post(
  "/webhook/:id",
  handleInitialMessage,
  handleServiceSelection,
  handleDateSelection,
  handleServiceRequest,
  handleOptionsAvailable,
  async (req: Request, res: Response) => {
    return res.status(200).send("end of the line");
  }
);

app.listen(PORT, () => {
  console.log(`Running bot on port: ${PORT}`);
});
