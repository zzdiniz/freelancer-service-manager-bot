import express, { Request, Response } from "express";
import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import { Message } from "./types/Message";
import Bot from "./types/Bot";
import getBotById from "./services/getBotById";
import getServicesByProviderId from "./services/getServicesbyProviderId";
import getClientById from "./services/getClientById";
import addClient from "./services/addClient";
import addConversation from "./services/addConversation";
import getConversation from "./services/getConversation";
import getProviderById from "./services/getProviderById";
import updateConversation from "./services/updateConversation";

const app = express();
const PORT = 5000;
const PUBLIC_URL = "https://ferrarezzo.loca.lt/";
app.use(express.json());

app.post("/webhook/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message, callback_query } = req.body as {
    message: Message;
    callback_query: CallbackQuery;
  };

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

  const clientId = message.from.id;
  const client = await getClientById(message.from.id);
  const providerId = botResponse.providerId;
  const provider = await getProviderById(providerId);

  if (!client) {
    const name = message.from.first_name;
    const username = message.from.username;

    await addClient({ id: clientId, name, username });
  }
  const conversation = await getConversation(providerId, clientId);
  // CRIAR O CONVERSATION CASOS ELE NÂO EXISTA(FAZER A LóGICAif(!conversation)...addConversation)
  const bot = new TelegramBot(botResponse.token, {
    polling: false,
  });
  if (!conversation || conversation.conversationState === "initial_message") {
    const services = await getServicesByProviderId(botResponse.providerId);

    // Formatar a mensagem com detalhes dos serviços
    const messageFormatted = `
      Olá ${
        client?.name || "cliente"
      }, tudo bem? É um prazer te conhecer! Sou o bot do ${
      provider.name
    } e irei te ajudar no processo de escolher qual serviço você necessita.
      A seguir estão listados os serviços que oferecemos:
    `;

    // Gerar os botões de serviço com informações detalhadas
    const inlineKeyboard = services.map((service) => ({
      text: `${service.name} - R$${service.price}`,
      callback_data: `service_${service.id}`,
    }));

    const options = {
      reply_markup: {
        inline_keyboard: [inlineKeyboard],
      },
    };
    bot.sendMessage(message.chat.id, messageFormatted, options);
    await updateConversation({
      providerId,
      clientId,
      conversationState: "service_selection",
    });
    return res.status(200).json({ message: "Message sent" });
  }
  bot.sendMessage(
    message.chat.id,
    `estado retornado: ${conversation.conversationState}`
  );
  return res.status(200).json({ message: `Id retornado: ${id}` });
});

app.listen(PORT, () => {
  console.log(`Running bot on port: ${PORT}`);
});
