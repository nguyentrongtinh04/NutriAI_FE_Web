import { RecaptchaVerifier, signInWithPhoneNumber, type Auth } from "firebase/auth";

function ensureContainer() {
  if (!document.getElementById("recaptcha-container")) {
    const d = document.createElement("div");
    d.id = "recaptcha-container";
    d.style.display = "none";
    document.body.appendChild(d);
  }
}

async function freshRecaptcha(auth: Auth) {
  ensureContainer();
  const w = window as any;
  if (w.recaptchaVerifier) {
    try { await w.recaptchaVerifier.clear?.(); } catch {}
    w.recaptchaVerifier = undefined;
  }
  const verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
  w.recaptchaVerifier = verifier;
  await verifier.render();                 // bắt buộc
  return verifier as RecaptchaVerifier;
}

export function toE164(phone: string) {
  const d = phone.replace(/[^\d+]/g, "");
  if (d.startsWith("+84")) return d;
  if (d.startsWith("84")) return `+${d}`;
  if (d.startsWith("0")) return `+84${d.slice(1)}`;
  return d.startsWith("+") ? d : `+${d}`;
}

export async function sendOtp(auth: Auth, rawPhone: string) {
  const phone = toE164(rawPhone);
  const verifier = await freshRecaptcha(auth);
  return await signInWithPhoneNumber(auth, phone, verifier);
}
