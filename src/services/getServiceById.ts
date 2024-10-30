import Service from "../types/Service";

const getServiceById = async (id: number): Promise<Service> => {
  const response = await fetch(
    `${process.env.BASE_URL}service/${id}`
  );
  return await response.json();
};

export default getServiceById;
