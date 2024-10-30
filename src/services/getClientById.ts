import Client from "../types/Client";

const getClientById = async (id: number): Promise<Client> => {
  const response = await fetch(`${process.env.BASE_URL}client/${id}`);
  return await response.json();
};

export default getClientById;
