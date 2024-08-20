
const getAvailableDates = async (providerId: number): Promise<string[]> => {
  const response = await fetch(`http://localhost:3000/appointment/get-available-dates?providerId=${providerId}`);
  return await response.json();
};

export default getAvailableDates ;
