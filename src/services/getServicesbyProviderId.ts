import Service from "../types/Service";

const getServicesByProviderId = async (id: number): Promise<Service[]> => {
  const response = await fetch(
    `${process.env.BASE_URL}service/get-by-provider/${id}`
  );
  return await response.json();
};

export default getServicesByProviderId;
