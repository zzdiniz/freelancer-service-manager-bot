import { NextFunction, Response, Request } from "express";
import addAppointment from "../services/addAppointment";
import updateConversation from "../services/updateConversation";

const handleDateSelection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientId = res.locals.clientId;
  const provider = res.locals.provider;
  const bot = res.locals.bot;
  const chatId = res.locals.chatId;
  const callback_query = res.locals.callback_query;
  const conversation = res.locals.conversation;

  if (conversation.conversationState === "date_selection") {
    if (!callback_query || !callback_query.data) {
      bot.sendMessage(
        chatId,
        "por favor selecione uma das opções anteriores"
      );
      res.status(200).send("No callback query");
      return
    }

    try {
      const appointment = JSON.parse(callback_query?.data as string);

      if (!appointment.date || !appointment.serviceId) {
        bot.sendMessage(chatId, "Por favor, selecione uma data válida!");
        res.status(200).send("Date not selected");
        return
      }
      const defaultdate = (appointment.date as string).split(" ")[0].split("-");
      const providerId = provider.id;

      if (!providerId) {
        console.error("Missing provider id");
        res.status(200).send("Missing provider id");
        return
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
      res.status(200).send("Date selected");
      return
    } catch (error) {
      console.error("Error parsing callback_query.data", error);
      await bot.sendMessage(
        chatId,
        "Erro ao processar sua seleção. Tente novamente."
      );
      res.status(200).send("Date selected error");
      return
    }
  }
  next();
};

export default handleDateSelection;
