import Client from "../types/Client";

const addClient = async ({ id, name, username }: Client): Promise<void> => {
  const response = await fetch(`http://localhost:3000/client/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, name, username }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add client: ${response.statusText}`);
  }

  return;
};

export default addClient;
