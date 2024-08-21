import express, { Request, Response } from "express";
import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import { Message } from "./types/Message";
import Bot from "./types/Bot";
import getBotById from "./services/getBotById";
import getServicesByProviderId from "./services/getServicesbyProviderId";
import getClientById from "./services/getClientById";
import addClient from "./services/addClient";
import addConversation from "./services/addConversation";
import getConversation from "./services/getConversation";
import getProviderById from "./services/getProviderById";
import updateConversation from "./services/updateConversation";
import getAvailableDates from "./services/getAvailableDates";
import addAppointment from "./services/addAppointment";

const app = express();
const PORT = 5000;
//const ngrok_url = "https://483a-2804-14c-4e2-42d4-fae3-9295-218b-62e5.ngrok-free.app";
//const ferrarezzo_url = "https://ferrarezzo.loca.lt"
//const almirtoken = "7315270892:AAEEX-DjOIIIssVfn1-QPYyhV7729YelfeU";
//const newbot = new TelegramBot(almirtoken)
//newbot.setWebHook(`${ngrok_url}/webhook/3`)
app.use(express.json());

app.post("/webhook/:id", async (req: Request, res: Response) => {
  console.log("Webhook received");
  const { id } = req.params;
  const { message, callback_query } = req.body as {
    message?: Message;
    callback_query?: CallbackQuery;
  };

  console.log("Request Data:", { message, callback_query });

  if (!id) {
    return res.status(422).json({ message: "Id not provided" });
  }

  const botResponse: Bot = await getBotById(parseInt(id));
  if (!botResponse) {
    return res.status(404).json({ message: "Bot not found" });
  }

  const clientId = message?.from?.id ?? callback_query?.message?.chat?.id;
  const chatId = message?.from?.id ?? callback_query?.message?.chat?.id;

  if (!clientId || !chatId) {
    return res.status(400).json({ message: "Invalid client or chat ID" });
  }

  const client = await getClientById(clientId);
  const providerId = botResponse.providerId;
  const provider = await getProviderById(providerId);

  if (!client) {
    const name =
      message?.from?.first_name ??
      (callback_query?.message?.chat.first_name as string);
    const username =
      message?.from?.username ??
      (callback_query?.message?.chat.username as string);

    await addClient({ id: clientId, name, username });
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

  const bot = new TelegramBot(botResponse.token, { polling: false });

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
  if (!conversation || conversation.conversationState === "initial_message") {
    const messageFormatted = `
      Olá ${
        client?.name || "cliente"
      }, tudo bem? É um prazer te conhecer! Sou o bot do ${
      provider.name
    } e irei te ajudar no processo de escolher qual serviço você necessita.
      A seguir estão listados os serviços que oferecemos:
    `;
    await bot.sendMessage(chatId, messageFormatted, options);
    await updateConversation({
      providerId,
      clientId,
      conversationState: "service_selection",
    });
    return res.status(200).json({ message: "Message sent" });
  }

  if (conversation.conversationState === "service_selection") {
    if (!callback_query) {
      await bot.sendMessage(
        chatId,
        "Por favor selecione um serviço para que possamos continuar",
        options
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
  }

  if (
    conversation.conversationState === "date_selection" &&
    callback_query?.data
  ) {
    try {
      const appointment = JSON.parse(callback_query?.data);
      const defaultdate = (appointment.date as string).split(' ')[0].split('-')
      console.log('defaultDate',defaultdate)
      await addAppointment({
        datetime: `${defaultdate[2]}/${defaultdate[1]}/${defaultdate[0]} ${appointment.date.split(" ")[1]}`,
        providerId,
        serviceId: parseInt(appointment.serviceId),
        status: "scheduled",
        clientId,
      });
      /*await updateConversation({
        providerId,
        clientId,
        conversationState: "service_request",
      });*/
      console.log("appointment", appointment);
    } catch (error) {
      console.error("Error parsing callback_query.data", error);
      await bot.sendMessage(
        chatId,
        "Erro ao processar sua seleção. Tente novamente."
      );
    }
  }

  return res.status(200).json({ message: `Id retornado: ${id}` });
});

app.listen(PORT, () => {
  console.log(`Running bot on port: ${PORT}`);
});
