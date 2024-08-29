import Service from "../types/Service";

const getServiceById = async (id: number): Promise<Service> => {
  const response = await fetch(
    `http://localhost:3000/service/${id}`
  );
  return await response.json();
};

export default getServiceById;
