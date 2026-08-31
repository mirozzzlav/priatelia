import type { UserSession } from "src/services/api/types";

const sessionStorageKey = "priatelia.session";

function isUserSession(value: unknown): value is UserSession {
  return (
    typeof value === "object" &&
    value !== null &&
    "nickname" in value &&
    typeof value.nickname === "string" &&
    "token" in value &&
    typeof value.token === "string"
  );
}

export function getStoredSession(): UserSession | null {
  const rawSession = window.localStorage.getItem(sessionStorageKey);

  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession) as unknown;

    if (!isUserSession(session)) {
      window.localStorage.removeItem(sessionStorageKey);
      return null;
    }

    return session;
  } catch {
    window.localStorage.removeItem(sessionStorageKey);
    return null;
  }
}

export function storeSession(session: UserSession) {
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem(sessionStorageKey);
}
