import { randomInt } from "crypto";

export const generateCode = () => {
  return randomInt(100000, 999999).toString();
};
