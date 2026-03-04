// TOTP utilities for 2FA
import { generateSecret as otplibGenerateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";

export function generateSecret(): string {
  return otplibGenerateSecret();
}

export function generateOTPAuthUrl(email: string, secret: string, issuer = "ResumeDoctor"): string {
  return generateURI({
    secret,
    issuer,
    label: email,
  });
}

export async function generateQRCodeDataUrl(otpauthUrl: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl, { width: 200, margin: 2 });
}

export async function verifyToken(secret: string, token: string): Promise<boolean> {
  try {
    const result = await verify({ secret, token: token.replace(/\s/g, "") });
    return !!(result && (typeof result === "boolean" ? result : (result as { valid?: boolean }).valid));
  } catch {
    return false;
  }
}

export function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let i = 0; i < count; i++) {
    let code = "";
    for (let j = 0; j < 8; j++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    codes.push(code);
  }
  return codes;
}
