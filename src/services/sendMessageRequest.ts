import MessageRequest from "../types/MessageRequest";
import dotenv from "dotenv";
dotenv.config();

const sendMessageRequest = async ({
  providerId,
  clientId,
  message
}: Partial<MessageRequest>): Promise<void> => {
  const response = await fetch(
    `${process.env.BASE_URL}provider/send-message-request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ providerId, clientId,message}),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to send request: ${response.statusText}`);
  }

  return;
};

export default sendMessageRequest
