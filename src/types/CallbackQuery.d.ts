import {Message,From} from "./Message"
export interface CallbackQuery {
    id: string
    from: From
    message: Message
    chat_instance: string
    data: string
  }