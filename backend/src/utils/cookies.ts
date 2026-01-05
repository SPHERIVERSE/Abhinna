import { Response } from "express";

// ✅ Define shared options to ensure "Clear" matches "Set"
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,      // REQUIRED for Cloudflare (HTTPS)
  sameSite: "none" as const, // REQUIRED for Tunnels
  path: "/",         // Explicitly set path to ensure matching
};

export function setAuthCookie(res: Response, token: string) {
  res.cookie("session", token, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days (Fixed 1-minute bug)
  });
}

export function clearAuthCookie(res: Response) {
  // To delete a cookie, we must pass the exact same options (excluding maxAge)
  res.clearCookie("session", COOKIE_OPTIONS);
}
