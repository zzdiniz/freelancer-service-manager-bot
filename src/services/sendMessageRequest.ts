import MessageRequest from "../types/MessageRequest";

const sendMessageRequest = async ({
  providerId,
  clientId,
  message
}: Partial<MessageRequest>): Promise<void> => {
  const response = await fetch(
    `http://localhost:3000/provider/send-message-request`,
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
