import Provider from "../types/Provider";

const getProviderById = async (id: number): Promise<Provider> => {
  const response = await fetch(`${process.env.BASE_URL}provider/${id}`);
  return await response.json();
};

export default getProviderById;
