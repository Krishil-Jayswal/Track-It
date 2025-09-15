import { env } from "@repo/env";
import jwt from "jsonwebtoken";

export enum TOKEN_TYPE {
  USER,
  EXTENSION,
}

export const createToken = (id: string, type: TOKEN_TYPE) => {
  try {
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
  } catch (error) {
    console.error(
      `Error in creating ${type} token: ${(error as Error).message}`,
    );
    throw error;
  }
};

export const verifyToken = (token: string, type: TOKEN_TYPE) => {
  try {
    const decoded = jwt.verify(
      token,
      type === TOKEN_TYPE.USER ? env.JWT_USER_SECRET : env.JWT_EXT_SECRET,
    ) as jwt.JwtPayload & { id: string };
    return decoded;
  } catch (error) {
    console.error(
      `Error in verifying ${type} token: ${(error as Error).message}`,
    );
    throw error;
  }
};
