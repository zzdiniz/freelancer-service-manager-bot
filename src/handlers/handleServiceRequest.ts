import updateConversation from "../services/updateConversation";
import { NextFunction, Request, Response } from "express";

const handleServiceRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientId = res.locals.clientId;
  const provider = res.locals.provider;
  const bot = res.locals.bot;
  const chatId = res.locals.chatId;
  const conversation = res.locals.conversation;

  if (conversation.conversationState === "service_request") {
    const conversationOptions = [
      [
        {
          text: "Consultar dúvidas frequentes(faq)",
          callback_data: "faq_request",
        },
      ],
      [
        {
          text: "Enviar pergunta diretamente ao prestador",
          callback_data: "human_response__request",
        },
      ],
      [
        {
          text: "Cancelar agendamento",
          callback_data: "cancel_appointment",
        },
      ],
    ];

    const options = {
      reply_markup: {
        inline_keyboard: conversationOptions,
      },
    };

    const message =
      "Olá, essas são as opções que você tem nesse momento. Vale ressaltar que, se você deseja enviar uma mensagem diretamente para o prestador, talvez seja interessante verificar se sua dúvida não foi respondida na sessão 'dúvidas frequentes'";

    await bot.sendMessage(chatId, message, options);

    const providerId = provider.id;
    if (!providerId) {
      return;
    }

    await updateConversation({
      clientId,
      conversationState: "options_available",
      providerId,
    });
  }
  next();
};

export default handleServiceRequest;
