import { next } from "@vercel/functions";
import {
  ACCESS_COOKIE_NAME,
  createAccessToken,
  isPublicPath,
  normalizeRedirectPath,
  parseCookies,
} from "./src/lib/access-control";

export const config = {
  runtime: "edge",
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);

  if (isPublicPath(url.pathname)) {
    return next();
  }

  const redirectUrl = new URL("/access", request.url);
  redirectUrl.searchParams.set("next", normalizeRedirectPath(`${url.pathname}${url.search}`));

  const accessPassword = process.env.APP_ACCESS_PASSWORD;
  if (!accessPassword) {
    redirectUrl.searchParams.set("reason", "config");
    return Response.redirect(redirectUrl, 307);
  }

  const cookies = parseCookies(request.headers.get("cookie"));
  const expectedToken = await createAccessToken(accessPassword);

  if (cookies[ACCESS_COOKIE_NAME] === expectedToken) {
    return next();
  }

  return Response.redirect(redirectUrl, 307);
}
