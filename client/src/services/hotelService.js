import { hotels } from "../utils/constants";
import { wait } from "../utils/helpers";

export const getHotels = async () => {
  await wait(250);
  return hotels;
};

export const filterHotelsByBudget = async (budget = "all") => {
  await wait(250);

  if (budget === "all") return hotels;

  const ranges = {
    budget: (rate) => rate < 6500,
    mid: (rate) => rate >= 6500 && rate <= 8500,
    premium: (rate) => rate > 8500
  };

  return hotels.filter((hotel) => ranges[budget](hotel.nightlyRate));
};