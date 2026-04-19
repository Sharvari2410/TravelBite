import { hiddenGems, mapRegions } from "../utils/constants";
import { wait } from "../utils/helpers";

export const getMapRegions = async () => {
  await wait(220);
  return mapRegions;
};

export const getHiddenGems = async () => {
  await wait(220);
  return hiddenGems;
};