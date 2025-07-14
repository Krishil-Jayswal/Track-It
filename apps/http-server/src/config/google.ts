import { env } from "@repo/env";
import { OAuth2Client } from "google-auth-library";

export const googleClient = new OAuth2Client({
  client_id: env.GOOGLE_CLIENT_ID,
  client_secret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${env.BASE_REDIRECT_URL}/google`,
});

export const scopes = ["openid", "profile", "email"];
