import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import Provider from "../types/Provider";
import getAvailableDates from "../services/getAvailableDates";
import { Response } from "express";
import getServicesByProviderId from "../services/getServicesbyProviderId";
import updateConversation from "../services/updateConversation";

interface HandleServiceSelectionProps {
  provider: Provider;
  bot: TelegramBot;
  clientId: number;
  chatId: number;
  res: Response;
  callback_query: CallbackQuery | undefined;
}

const handleServiceSelection = async ({
  clientId,
  provider,
  bot,
  chatId,
  res,
  callback_query,
}: HandleServiceSelectionProps) => {
  const providerId = provider.id;

  if (!providerId) {
    return res.status(422).json({ message: "Missing provider id" });
  }

  const services = await getServicesByProviderId(providerId);

  const inlineKeyboard = services.map((service) => ({
    text: `${service.name} - R$${service.price}`,
    callback_data: `service_${service.id}`,
  }));

  const serviceOptions = {
    reply_markup: {
      inline_keyboard: [inlineKeyboard],
    },
  };

  if (!callback_query) {
    await bot.sendMessage(
      chatId,
      "Por favor selecione um serviço para que possamos continuar",
      serviceOptions
    );
    return res.status(200).json({ message: "Message sent" });
  }

  const callbackData = callback_query.data;

  // Verifique se a callbackData é válida e processe-a
  if (callbackData?.startsWith("service_")) {
    const serviceId = callbackData.split("_")[1];
    console.log(callbackData);
    // Você pode buscar detalhes do serviço ou prosseguir com a lógica desejada
    console.log("providerId", providerId);
    const availableDates = await getAvailableDates(providerId);
    const dateOptions = availableDates.map((date) => [
      {
        text: `${date.split(" ")[0].split("-").join("/")} às ${
          date.split(" ")[1]
        }`,
        callback_data: JSON.stringify({ date, serviceId }),
      },
    ]);
    const limitedOptions = dateOptions.slice(0, 5);
    const options = {
      reply_markup: {
        inline_keyboard: limitedOptions,
      },
    };

    console.log("available dates", availableDates);
    await updateConversation({
      providerId,
      clientId,
      conversationState: "date_selection",
    });
    await bot.sendMessage(
      chatId,
      `Perfeito! Agora por favor selecione a uma data e horário detre as opções a seguir:`,
      options
    );
    return res.status(200).json({ message: "Dates sent" });
  }
};

export default handleServiceSelection;
