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
import addReview from "../services/addReview";

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

  const bot = new TelegramBot(botResponse.token, { polling: false });

  if (!client.id) {

    const name =
      message?.from?.first_name ??
      (callback_query?.message?.chat.first_name as string);

    const username =
      message?.from?.username ??
      (callback_query?.message?.chat.username as string);

    await addClient({ id: clientId, name, username: username ?? '' });
    const messageFormatted = `Olá, tudo bem? É um prazer te conhecer! Sou o bot do ${provider.name}. Como posso te ajudar?`;

    await bot.sendMessage(chatId,messageFormatted);

    return
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

  res.locals.clientId = clientId;
  res.locals.provider = provider;
  res.locals.chatId = chatId;
  res.locals.callback_query = callback_query;
  res.locals.conversation = conversation;
  res.locals.message = message;
  res.locals.bot = bot;
  if (callback_query?.data?.startsWith("rating_")){
    const data = callback_query.data.split(":")
    const content = data[0]
    const appointmentId =data[1]
    const review = content.split("_")[1]

    await addReview(parseInt(appointmentId),parseInt(review))
  }
  if (!conversation || conversation.conversationState === "initial_message") {
    const messageFormatted = `${client?.name.concat(", ") || ""}a seguir estão listados os serviços que oferecemos:`;

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
