import { env } from "@repo/env";
import jwt from "jsonwebtoken";

export enum TOKEN_TYPE {
  USER,
  EXTENSION,
}

export const createToken = (id: string, type: TOKEN_TYPE) => {
  let token: string;
  switch (type) {
    case TOKEN_TYPE.USER:
      token = jwt.sign({ id }, env.JWT_USER_SECRET, {
        expiresIn: Number(env.JWT_EXPIRES_IN),
      });
      break;
    case TOKEN_TYPE.EXTENSION:
      token = jwt.sign({ id }, env.JWT_EXT_SECRET);
      break;
  }
  return token;
};
