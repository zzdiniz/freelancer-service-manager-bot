import Client from "../types/Client";
import dotenv from "dotenv";
dotenv.config();

const addClient = async ({ id, name, username }: Client): Promise<void> => {

  const response = await fetch(`${process.env.BASE_URL}client/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, name, username:username??'' }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add client: ${response.statusText}`);
  }

  return;
};

export default addClient;
