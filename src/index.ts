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
import getAvailableDates from "./services/getAvailableDates";

const app = express();
const PORT = 5000;
const ngrok_url = "https://3b27-2804-14c-4e2-42d4-8da-1706-67f3-9f6b.ngrok-free.app";
const almirtoken = "7315270892:AAEEX-DjOIIIssVfn1-QPYyhV7729YelfeU";

app.use(express.json());

app.post("/webhook/:id", async (req: Request, res: Response) => {
  console.log('Webhook received');
  const { id } = req.params;
  const { message, callback_query } = req.body as {
    message?: Message;
    callback_query?: CallbackQuery;
  };

  console.log('Request Data:', { message, callback_query });

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
    const name = message?.from?.first_name ?? callback_query?.message?.chat.first_name as string;
    const username = message?.from?.username ?? callback_query?.message?.chat.username as string;

    await addClient({ id: clientId, name, username });
  }

  let conversation = await getConversation(providerId, clientId);

  if (!conversation) {
    await addConversation({ providerId, clientId, conversationState: "initial_message" });
    conversation = await getConversation(providerId, clientId);
  }

  const bot = new TelegramBot(botResponse.token, { polling: false });

  const services = await getServicesByProviderId(providerId);
  const inlineKeyboard = services.map((service) => ({
    text: `${service.name} - R$${service.price}`,
    callback_data: `service_${service.id}`,
  }));

  const options = {
    reply_markup: {
      inline_keyboard: [inlineKeyboard],
    },
  };
  if (!conversation || conversation.conversationState === "initial_message") {
    const messageFormatted = `
      Olá ${
        client?.name || "cliente"
      }, tudo bem? É um prazer te conhecer! Sou o bot do ${
      provider.name
    } e irei te ajudar no processo de escolher qual serviço você necessita.
      A seguir estão listados os serviços que oferecemos:
    `;
    await bot.sendMessage(chatId, messageFormatted, options);
    await updateConversation({
      providerId,
      clientId,
      conversationState: "service_selection",
    });
    return res.status(200).json({ message: "Message sent" });
  }

  if (conversation.conversationState === 'service_selection') {
    if (!callback_query) {
      await bot.sendMessage(chatId, 'Por favor selecione um serviço para que possamos continuar', options);
      return res.status(200).json({ message: "Message sent" });
    }

    const callbackData = callback_query.data;

    // Verifique se a callbackData é válida e processe-a
    if (callbackData?.startsWith('service_')) {
      const serviceId = callbackData.split('_')[1];
      // Você pode buscar detalhes do serviço ou prosseguir com a lógica desejada
      const availableDates = await getAvailableDates(providerId);
      console.log('available dates',availableDates)
      await bot.sendMessage(chatId, `Dates available: ${availableDates[0]}`);
      return res.status(200).json({ message: "Dates sent" });
    } else {
      await bot.sendMessage(chatId, 'Seleção inválida. Por favor, escolha um serviço da lista.', options);
      return res.status(400).json({ message: "Invalid selection" });
    }
  }

  return res.status(200).json({ message: `Id retornado: ${id}` });
});

app.listen(PORT, () => {
  console.log(`Running bot on port: ${PORT}`);
});
