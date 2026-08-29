import type { ApiClient } from "src/services/api/types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";

function isApiErrorResponse(value: unknown) {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    value.status === "error" &&
    "data" in value
  );
}

async function request<TResponse>(
  path: string,
  options?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (response.status === 204) {
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return undefined as TResponse;
  }

  const data = (await response.json()) as unknown;

  if (!response.ok && !isApiErrorResponse(data)) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return data as TResponse;
}

export const restClient: ApiClient = {
  activateAccount(token) {
    return request("/auth/activate", {
      body: JSON.stringify({ token }),
      method: "POST",
    });
  },

  getPersonPreview() {
    return request("/discovery/profile");
  },

  getChatMatches() {
    return request("/chats/matches");
  },

  getChatThread(matchId) {
    return request(`/chats/matches/${matchId}`);
  },

  login(data) {
    return request("/auth/login", {
      body: JSON.stringify(data),
      method: "POST",
    });
  },

  register(data) {
    return request("/auth/register", {
      body: JSON.stringify(data),
      method: "POST",
    });
  },

  sendChatMessage(matchId, data) {
    return request(`/chats/matches/${matchId}/messages`, {
      body: JSON.stringify(data),
      method: "POST",
    });
  },

  updateDiscoverySettings(data) {
    return request("/discovery/settings", {
      body: JSON.stringify(data),
      method: "PUT",
    });
  },

  updatePassword(data) {
    return request("/profile/password", {
      body: JSON.stringify(data),
      method: "PUT",
    });
  },

  updateProfile(data) {
    return request("/profile", {
      body: JSON.stringify(data),
      method: "PUT",
    });
  },

  async submitPersonPreviewAction(personPreviewId, action) {
    await request(`/discovery/profiles/${personPreviewId}/action`, {
      body: JSON.stringify({ action }),
      method: "POST",
    });
  },
};
