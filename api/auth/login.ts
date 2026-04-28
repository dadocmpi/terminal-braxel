import {
  ACCESS_COOKIE_NAME,
  buildAccessCookie,
  createAccessToken,
  normalizeRedirectPath,
} from "../../src/lib/access-control";

type LoginPayload = {
  next?: string;
  password?: string;
};

export async function POST(request: Request) {
  const accessPassword = process.env.APP_ACCESS_PASSWORD;

  if (!accessPassword) {
    return Response.json(
      { message: "APP_ACCESS_PASSWORD is not configured on Vercel." },
      { status: 500 },
    );
  }

  let payload: LoginPayload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Invalid request payload." }, { status: 400 });
  }

  if (typeof payload.password !== "string" || payload.password.length === 0) {
    return Response.json({ message: "Informe a senha." }, { status: 400 });
  }

  if (payload.password !== accessPassword) {
    return Response.json({ message: "Senha invalida." }, { status: 401 });
  }

  const token = await createAccessToken(accessPassword);
  const headers = new Headers({
    "content-type": "application/json",
  });

  headers.append(
    "Set-Cookie",
    buildAccessCookie(token, {
      maxAge: 60 * 60 * 24 * 7,
      secure: new URL(request.url).protocol === "https:",
    }),
  );

  return new Response(
    JSON.stringify({
      ok: true,
      redirectTo: normalizeRedirectPath(payload.next),
    }),
    {
      status: 200,
      headers,
    },
  );
}

export function GET() {
  return Response.json({ message: "Method not allowed." }, { status: 405 });
}
