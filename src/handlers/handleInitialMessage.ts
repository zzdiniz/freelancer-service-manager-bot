import TelegramBot from "node-telegram-bot-api";
import Client from "../types/Client";
import Provider from "../types/Provider";
import getServicesByProviderId from "../services/getServicesbyProviderId";
import updateConversation from "../services/updateConversation";
import { Response } from "express";
interface HandleInitialMessageProps {
  client: Client | undefined;
  provider: Provider;
  bot: TelegramBot;
  clientId: number;
  chatId: number;
  res: Response;
}

const handleInitialMessage = async ({
  client,
  clientId,
  provider,
  bot,
  chatId,
  res,
}: HandleInitialMessageProps) => {
  const providerId = provider.id;

  if (!providerId) {
    return res.status(422).json({ message: "Missing provider id" });
  }

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
  return res.status(200).json({ message: "Message sent" });
};

export default handleInitialMessage;
