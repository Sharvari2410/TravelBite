import { cityHighlights, foodSpots } from "../utils/constants";
import { byField, wait } from "../utils/helpers";

export const getCities = async () => {
  await wait(250);
  return cityHighlights;
};

export const searchCities = async (query = "") => {
  await wait(250);
  return byField(cityHighlights, "name", query);
};

export const getCitySpotlight = async () => {
  await wait(200);
  return foodSpots.slice(0, 3);
};