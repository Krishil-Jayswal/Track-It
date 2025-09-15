import { Request, Response } from "express";
import { googleClient, scopes } from "../config/google.js";
import { KeyManager } from "@repo/redis/managers";
import { randomBytes } from "node:crypto";
import { redis } from "@repo/redis";
import { env } from "@repo/env";
import { OAUTH_TYPE, OAuthCallbackSchema } from "@repo/validation";
import { prisma } from "@repo/db";
import { createToken, TOKEN_TYPE } from "@repo/jwt";

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const state = randomBytes(16).toString("hex");
    const stateKey = KeyManager.oauthStateKey(state);
    await redis.setex(stateKey, 600, "YES");
    const url = googleClient.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      state,
      prompt: "consent",
    });
    res.redirect(url);
  } catch (error) {
    console.error("Error in google auth controller: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    const validation = OAuthCallbackSchema.safeParse(req.query);
    if (!validation.success) {
      res.redirect(`${env.CLIENT_URL}/callback`);
      return;
    }
    const { code, state } = validation.data;
    const stateKey = KeyManager.oauthStateKey(state);
    const exists = await redis.getdel(stateKey);
    if (exists !== "YES") {
      res.redirect(`${env.CLIENT_URL}/callback`);
      return;
    }
    const {
      tokens: { id_token },
    } = await googleClient.getToken(code);
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token!,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      res.redirect(`${env.CLIENT_URL}/callback`);
      return;
    }
    const user = await prisma.user.upsert({
      where: {
        oauth_type_oauth_id: {
          oauth_type: OAUTH_TYPE.GOOGLE,
          oauth_id: payload.sub,
        },
      },
      create: {
        name: payload.name!,
        email: payload.email!,
        avatar: payload.picture!,
        oauth_type: OAUTH_TYPE.GOOGLE,
        oauth_id: payload.sub,
      },
      update: {},
    });

    const token = createToken(user.id, TOKEN_TYPE.USER);

    res.redirect(`${env.CLIENT_URL}/callback?token=${token}`);
  } catch (error) {
    console.error(
      `Error in google auth callback controller: ${(error as Error).message}`,
    );
    res.redirect(`${env.CLIENT_URL}/callback`);
  }
};

export const getToken = async (req: Request, res: Response) => {
  try {
    const { id } = req.user!;
    const token = createToken(id, TOKEN_TYPE.EXTENSION);
    res.status(200).json({ token });
  } catch (error) {
    console.error(
      `Error in token creating controller: ${(error as Error).message}`,
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
