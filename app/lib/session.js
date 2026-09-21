// Signed session tokens (HMAC-SHA256) using Web Crypto, so it works in both
// the Node runtime (route handlers) and the proxy.
export const SESSION_COOKIE = 'session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET is not defined');
  }
  return 'dev-only-insecure-secret-change-me';
}

const enc = new TextEncoder();

function toB64Url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64Url(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmacKey() {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signSession({ uid, role }) {
  const payload = toB64Url(
    enc.encode(JSON.stringify({ uid, role, exp: Date.now() + SESSION_MAX_AGE * 1000 }))
  );
  const sig = await crypto.subtle.sign('HMAC', await hmacKey(), enc.encode(payload));
  return `${payload}.${toB64Url(new Uint8Array(sig))}`;
}

// Returns { uid, role } or null if missing / tampered / expired.
export async function verifySession(token) {
  try {
    if (!token) return null;
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return null;
    const ok = await crypto.subtle.verify(
      'HMAC',
      await hmacKey(),
      fromB64Url(sig),
      enc.encode(payload)
    );
    if (!ok) return null;
    const data = JSON.parse(new TextDecoder().decode(fromB64Url(payload)));
    if (!data.uid || !data.exp || data.exp < Date.now()) return null;
    return { uid: data.uid, role: data.role === 'admin' ? 'admin' : 'student' };
  } catch {
    return null;
  }
}
