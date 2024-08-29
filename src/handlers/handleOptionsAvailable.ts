import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import Provider from "../types/Provider";
import getLatestAppointment from "../services/getLatestAppointment";
import updateAppointmentStatus from "../services/updateAppointment";
import getServiceById from "../services/getServiceById";
import updateConversation from "../services/updateConversation";

interface HandleOptionsAvailableProps {
  bot: TelegramBot;
  chatId: number;
  clientId: number;
  provider: Provider;
  callback_query: CallbackQuery | undefined;
}

const handleOptionsAvailable = async ({
  bot,
  chatId,
  clientId,
  provider,
  callback_query,
}: HandleOptionsAvailableProps) => {
  if (!callback_query) {
    return bot.sendMessage(
      chatId,
      "Por favor selecione uma das opções disponíveis para que possamos continuar"
    );
  }
  const latestAppointment = await getLatestAppointment(
    provider.id as number,
    clientId
  );
  if (callback_query.data === "cancel_appointment") {
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
  if (callback_query.data === "faq_request") {

    try {
      const service = await getServiceById(
        latestAppointment.serviceId as number
      );
      const faq = service.faq
        ? (JSON.parse(service.faq) as { question: string; response: string }[]).map((item,index)=>{
            return `${index + 1}- ${item.question} R: ${item.response}.\n`
        })
        : "faq não encontrado";

      return bot.sendMessage(chatId, faq.toString());
    } catch (error) {
      return bot.sendMessage(chatId, JSON.stringify(error));
    }
  }
  return bot.sendMessage(
    chatId,
    `voce selecionou a opção${callback_query.data}`
  );
};

export default handleOptionsAvailable;
