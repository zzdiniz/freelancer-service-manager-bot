import TelegramBot, { CallbackQuery } from "node-telegram-bot-api";
import Provider from "../types/Provider";
import getLatestAppointment from "../services/getLatestAppointment";
import updateAppointmentStatus from "../services/updateAppointment";

interface HandleOptionsAvailableProps{
    bot: TelegramBot;
    chatId: number;
    clientId: number;
    provider: Provider;
    callback_query: CallbackQuery | undefined;
}

const handleOptionsAvailable = async ({bot,chatId,clientId,provider,callback_query}:HandleOptionsAvailableProps)=>{
    if(!callback_query){
        return bot.sendMessage(chatId,'Por favor selecione uma das opções disponíveis para que possamos continuar')
    }
    if(callback_query.data === "cancel_appointment"){
        try {
            const latestAppointment = await getLatestAppointment(provider.id as number,clientId)
            await updateAppointmentStatus({id:latestAppointment.id,status:"canceled"})
            
            return bot.sendMessage(chatId, "Serviço cancelado")
        } catch (error) {
            return bot.sendMessage(chatId,JSON.stringify(error))
        }
    }
    return bot.sendMessage(chatId, `voce selecionou a opção${callback_query.data}`)
} 

export default handleOptionsAvailable