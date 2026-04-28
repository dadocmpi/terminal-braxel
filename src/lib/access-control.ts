export const ACCESS_COOKIE_NAME = "braxel_terminal_access";

const ACCESS_TOKEN_NAMESPACE = "braxel-terminal-access";
const PUBLIC_FILE_PATTERN = /\.[a-zA-Z0-9]+$/;
const PUBLIC_PATHS = new Set([
  "/access",
  "/api/auth/login",
  "/api/auth/logout",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/site.webmanifest",
  "/manifest.webmanifest",
]);
const PUBLIC_PREFIXES = ["/assets/", "/.well-known/"];

export function normalizeRedirectPath(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export function parseCookies(cookieHeader?: string | null) {
  if (!cookieHeader) {
    return {} as Record<string, string>;
  }

  return cookieHeader.split(";").reduce<Record<string, string>>((allCookies, item) => {
    const [rawName, ...rawValueParts] = item.trim().split("=");

    if (!rawName) {
      return allCookies;
    }

    allCookies[rawName] = decodeURIComponent(rawValueParts.join("="));
    return allCookies;
  }, {});
}

export function isPublicPath(pathname: string) {
  return (
    PUBLIC_PATHS.has(pathname) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    PUBLIC_FILE_PATTERN.test(pathname)
  );
}

export async function createAccessToken(password: string) {
  const data = new TextEncoder().encode(`${ACCESS_TOKEN_NAMESPACE}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
}

export function buildAccessCookie(
  value: string,
  options: {
    maxAge: number;
    secure: boolean;
  },
) {
  const parts = [
    `${ACCESS_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${options.maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (options.secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}
