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
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString()
    );
    return Math.max(0, payload.exp - Math.floor(Date.now() / 1000));
  } catch {
    return 0;
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
