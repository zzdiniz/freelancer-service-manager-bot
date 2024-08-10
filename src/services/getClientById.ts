import Client from "../types/Client";

const getClientById = async (id: number): Promise<Client> => {
  const response = await fetch(`http://localhost:3000/client/${id}`);
  return await response.json();
};

export default getClientById;
