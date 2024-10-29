import getLatestAppointment from "../services/getLatestAppointment";
import updateAppointmentStatus from "../services/updateAppointment";
import getServiceById from "../services/getServiceById";
import updateConversation from "../services/updateConversation";
import sendMessageRequest from "../services/sendMessageRequest";
import { NextFunction, Request, Response } from "express";

const handleOptionsAvailable = async (
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
  const message = res.locals.message;

  const options = res.locals.options

  if (conversation.conversationState === "options_available") {

    if (!callback_query && message?.reply_to_message?.text !=="O que gostaria de perguntar?") {
      return bot.sendMessage(
        chatId,
        "Por favor selecione uma das opções disponíveis para que possamos continuar",
        options
      );
    }
    const latestAppointment = await getLatestAppointment(
      provider.id as number,
      clientId
    );
    if (callback_query?.data === "cancel_appointment") {
      try {
        await updateAppointmentStatus({
          id: latestAppointment.id,
          status: "canceled",
        });
        await updateConversation({
          providerId: provider.id,
          clientId,
          conversationState: "initial_message",
        });
        return bot.sendMessage(chatId, "Serviço cancelado");
      } catch (error) {
        return bot.sendMessage(chatId, JSON.stringify(error));
      }
    }

    if (callback_query?.data === "faq_request") {

      try {
        const service = await getServiceById(
          latestAppointment.serviceId as number
        );
        const faq = service.faq
          ? (
              JSON.parse(service.faq) as {
                question: string;
                response: string;
              }[]
            ).map((item, index) => {
              return `${index + 1}- ${item.question} R: ${item.response}.\n`;
            })
          : "faq não encontrado";

        return bot.sendMessage(chatId, faq.toString());
      } catch (error) {
        return bot.sendMessage(chatId, "faq não encontrado");
      }
    }

    if (callback_query?.data === "human_response__request") {
      return bot.sendMessage(chatId, "O que gostaria de perguntar?", {
        reply_markup: {
          force_reply: true,
        },
      });
    }
    if (message) {
      try {
        await sendMessageRequest({
          providerId: provider.id,
          clientId,
          message: message.text,
        });
      } catch (error) {
        return;
      }
    }
  }
  next();
};

export default handleOptionsAvailable;
