import { buildAccessCookie } from "../../src/lib/access-control";

export async function POST(request: Request) {
  const headers = new Headers({
    "content-type": "application/json",
  });

  headers.append(
    "Set-Cookie",
    buildAccessCookie("", {
      maxAge: 0,
      secure: new URL(request.url).protocol === "https:",
    }),
  );

  return new Response(JSON.stringify({ ok: true, redirectTo: "/access" }), {
    status: 200,
    headers,
  });
}

export function GET() {
  return Response.json({ message: "Method not allowed." }, { status: 405 });
}
