import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import Provider from "../types/Provider";
import { Response } from "express";
import addAppointment from "../services/addAppointment";
import updateConversation from "../services/updateConversation";

interface HandleDateSelectionProps {
  provider: Provider;
  bot: TelegramBot;
  clientId: number;
  chatId: number;
  res: Response;
  callback_query: CallbackQuery | undefined;
}

const handleDateSelection = async ({
  bot,
  callback_query,
  chatId,
  clientId,
  provider,
  res,
}: HandleDateSelectionProps) => {
  if (!callback_query || !callback_query.data) {
    res.status(422).json({ message: "Callbackquery not found" });
  }

  try {
    const appointment = JSON.parse(callback_query?.data as string);

    if (!appointment.date || !appointment.serviceId) {
      return bot.sendMessage(chatId, "Por favor, selecione uma data válida!");
    }
    const defaultdate = (appointment.date as string).split(" ")[0].split("-");
    console.log("defaultDate", defaultdate);
    const providerId = provider.id;

    if (!providerId) {
      return res.status(422).json({ message: "Missing provider id" });
    }

    await addAppointment({
      datetime: `${defaultdate[2]}/${defaultdate[1]}/${defaultdate[0]} ${
        appointment.date.split(" ")[1]
      }`,
      providerId,
      serviceId: parseInt(appointment.serviceId),
      status: "scheduled",
      clientId,
    });

    await updateConversation({
      providerId,
      clientId,
      conversationState: "service_request",
    });

    console.log("appointment", appointment);
  } catch (error) {
    console.error("Error parsing callback_query.data", error);
    await bot.sendMessage(
      chatId,
      "Erro ao processar sua seleção. Tente novamente."
    );
  }
};

export default handleDateSelection;
