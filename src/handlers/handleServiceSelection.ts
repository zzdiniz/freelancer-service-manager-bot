import getAvailableDates from "../services/getAvailableDates";
import { NextFunction, Request, Response } from "express";
import getServicesByProviderId from "../services/getServicesbyProviderId";
import updateConversation from "../services/updateConversation";

const handleServiceSelection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientId = res.locals.clientId;
  const bot = res.locals.bot;
  const chatId = res.locals.chatId;
  const callback_query = res.locals.callback_query;
  const conversation = res.locals.conversation;

  if (conversation.conversationState === "service_selection") {
    const providerId = res.locals.provider.id;

    if (!providerId) {
      console.error("Missing provider id");
      res.status(200).send("Missing provider id at service selection");
      return
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
      res.status(200).send("Missing callback in service selection");
      return;
    }

    const callbackData = callback_query.data;

    // Verifique se a callbackData é válida e processe-a
    if (callbackData?.startsWith("service_")) {
      const serviceId = callbackData.split("_")[1];
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
      res.status(200).send("Service selected");
      return;
    }
  }
  next();
};

export default handleServiceSelection;
