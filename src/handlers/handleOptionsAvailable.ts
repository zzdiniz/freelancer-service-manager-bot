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
      bot.sendMessage(
        chatId,
        "Por favor selecione uma das opções disponíveis para que possamos continuar",
        options
      );
      res.status(200).send("Missing query on options available");
      return
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
        bot.sendMessage(chatId, "Serviço cancelado");
        res.status(200).send("Service canceled");
        return
      } catch (error) {
        bot.sendMessage(chatId, "erro ao tentar cancelar serviço");
        res.status(200).send("Error trying to cancel service");
        return
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

        bot.sendMessage(chatId, faq.toString());
        res.status(200).send("Faq sent");
        return
      } catch (error) {
        bot.sendMessage(chatId, "faq não encontrado");
        res.status(200).send("Error trying to get faq");
        return
      }
    }

    if (callback_query?.data === "human_response__request") {
      bot.sendMessage(chatId, "O que gostaria de perguntar?", {
        reply_markup: {
          force_reply: true,
        },
      });
      res.status(200).send("Human response reply");
      return
    }
    if (message) {
      try {
        await sendMessageRequest({
          providerId: provider.id,
          clientId,
          message: message.text,
        });
        res.status(200).send("send message request");
        return
      } catch (error) {
        res.status(200).send("Error trying to send message request");
        return;
      }
    }
  }
  next();
};

export default handleOptionsAvailable;
