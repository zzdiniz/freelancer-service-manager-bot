import Provider from "../types/Provider";

const getProviderById = async (id: number): Promise<Provider> => {
  const response = await fetch(`http://localhost:3000/provider/${id}`);
  return await response.json();
};

export default getProviderById;
