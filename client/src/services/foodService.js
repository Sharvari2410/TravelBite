import { foodSpots, mapRegions } from "../utils/constants";
import { byField, wait } from "../utils/helpers";

export const getFoodSpots = async () => {
  await wait(250);
  return foodSpots;
};

export const searchFoodSpots = async (query = "") => {
  await wait(250);
  const byTitle = byField(foodSpots, "title", query);
  if (byTitle.length > 0 || !query.trim()) return byTitle;
  return foodSpots.filter((spot) =>
    [spot.city, spot.cuisine, spot.mustTry]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );
};

export const getRegionalFoodMap = async () => {
  await wait(200);
  return mapRegions;
};