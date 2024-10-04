import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import getServicesByProviderId from "../services/getServicesbyProviderId";
import updateConversation from "../services/updateConversation";
import { NextFunction, Request, Response } from "express";
import Bot from "../types/Bot";
import addClient from "../services/addClient";
import addConversation from "../services/addConversation";
import getBotById from "../services/getBotById";
import getClientById from "../services/getClientById";
import getConversation from "../services/getConversation";
import getProviderById from "../services/getProviderById";
import getBotByProviderId from "../services/getBotByProviderId";

const handleInitialMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { message, callback_query } = req.body as {
    message?: Message;
    callback_query?: CallbackQuery;
  };

  if (message || callback_query) {
    res.status(200).send("ok");
  }
  if (!id) {
    return console.error("Provider id not provided");
  }

  const botResponse: Bot = await getBotByProviderId(parseInt(id));

  if (!botResponse) {
    return console.error("Bot not found");
  }

  const clientId = message?.from?.id ?? callback_query?.message?.chat?.id;
  const chatId = message?.from?.id ?? callback_query?.message?.chat?.id;

  if (!clientId || !chatId) {
    return console.error("Invalid client or chat ID");
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

  res.locals.clientId = clientId;
  res.locals.provider = provider;
  res.locals.chatId = chatId;
  res.locals.callback_query = callback_query;
  res.locals.conversation = conversation;
  res.locals.message = message;
  res.locals.bot = bot;

  if (!conversation || conversation.conversationState === "initial_message") {
    const messageFormatted = `
    Olá ${
      client?.name || ""
    }, tudo bem? É um prazer te conhecer! Sou o bot do ${
      provider.name
    } e irei te ajudar no processo de escolher qual serviço você necessita.
    A seguir estão listados os serviços que oferecemos:
  `;

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

    await bot.sendMessage(chatId, messageFormatted, options);
    await updateConversation({
      providerId,
      clientId,
      conversationState: "service_selection",
    });
    return;
  }

  next();
};

export default handleInitialMessage;
