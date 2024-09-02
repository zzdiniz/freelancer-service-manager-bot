export interface Message {
  update_id: number;
  message_id: number;
  from: From;
  chat: Chat;
  date: number;
  text: string;
  reply_markup?: any
}

export interface From {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  language_code: string;
}

interface Chat {
  id: number;
  first_name: string;
  username: string;
  type: string;
}
