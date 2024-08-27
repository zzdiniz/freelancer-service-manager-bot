import TelegramBot from "node-telegram-bot-api";
import updateConversation from "../services/updateConversation";
import Provider from "../types/Provider";

interface HandleServiceRequestProps{
    bot: TelegramBot;
    chatId: number;
    clientId: number;
    provider: Provider;
} 

const handleServiceRequest = async ({bot,chatId,clientId,provider}:HandleServiceRequestProps) =>{
    console.log('rodou handle service request')
    const conversationOptions = [
        [
            {
                text: 'Consultar dúvidas frequentes(faq)',
                callback_data: 'faq_request'
            }
        ],
        [
            {
                text: 'Enviar pergunta diretamente ao prestador',
                callback_data: 'human_response__request'
            }
        ],
        [
            {
                text: 'Cancelar agendamento',
                callback_data: 'cancel_appointment'
            }
        ]
    ]

    const options = {
        reply_markup: {
          inline_keyboard: conversationOptions,
        },
    };

    const message = "Olá, essas são as opções que você tem nesse momento. Vale ressaltar que, se você deseja enviar uma mensagem diretamente para o prestador, talvez seja interessante verificar se sua dúvida não foi respondida na sessão 'dúvidas frequentes'"

    await bot.sendMessage(
        chatId,
        message,
        options
      );

    const providerId = provider.id;
    if(!providerId){
        return
    }
    
    await updateConversation({clientId,conversationState:'options_available',providerId})
}

export default handleServiceRequest