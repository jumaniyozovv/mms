import { cookies } from "next/headers";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const DEFAULT_OPTIONS: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

function getTokenAge(token: string): number {
  try {
    const base64Payload = token.split(".")[1];
    // JWT uses base64url, but we need to handle both base64 and base64url
    const payload = JSON.parse(
      Buffer.from(base64Payload, "base64").toString("utf-8")
    );
    return Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
  } catch (error) {
    console.error("Failed to parse token for maxAge:", error);
    // Return a default maxAge instead of 0 (which would delete the cookie)
    return 3600; // 1 hour fallback
  }
}

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value ?? null;
}

export async function setCookie(
  name: string,
  value: string,
  options?: Partial<ResponseCookie>
) {
  const cookieStore = await cookies();
  cookieStore.set(name, value, { ...DEFAULT_OPTIONS, ...options });
}

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
}

export async function saveTokens(accessToken: string, refreshToken: string) {
  await setCookie("access_token", accessToken, {
    maxAge: getTokenAge(accessToken),
  });
  await setCookie("refresh_token", refreshToken, {
    maxAge: getTokenAge(refreshToken),
  });
}

export async function clearTokens() {
  await deleteCookie("access_token");
  await deleteCookie("refresh_token");
}
