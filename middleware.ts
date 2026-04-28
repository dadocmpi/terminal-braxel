import { next } from "@vercel/functions";

export const config = {
  runtime: "edge",
};

export default async function middleware(request: Request) {
  return next();
}
