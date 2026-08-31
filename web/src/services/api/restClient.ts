import type { ApiClient } from "src/services/api/types";
import type { EditableProfileData } from "src/features/profile";
import type { RegistrationPhoto } from "src/features/registration";
import { getStoredSession } from "src/services/api/sessionStorage";

type ProfileApiData = Omit<
  EditableProfileData,
  "password" | "passwordConfirmation"
>;

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
  const token = getStoredSession()?.token;
  const headers = new Headers(options?.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
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

async function uploadRequest<TResponse>(
  path: string,
  body: FormData,
): Promise<TResponse> {
  const token = getStoredSession()?.token;
  const headers = new Headers();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    body,
    headers,
    method: "POST",
  });
  const data = (await response.json()) as unknown;

  if (!response.ok) {
    throw new Error(`API upload failed: ${response.status}`);
  }

  return data as TResponse;
}

function stripLocalPhotoFile(photo: RegistrationPhoto): RegistrationPhoto {
  return {
    id: photo.id,
    isPrimary: photo.isPrimary,
    name: photo.name,
    url: photo.url,
  };
}

async function uploadLocalPhotos<TData extends { photos: RegistrationPhoto[] }>(
  data: TData,
): Promise<TData> {
  const photos = await Promise.all(
    data.photos.map(async (photo) => {
      if (!photo.file) {
        return stripLocalPhotoFile(photo);
      }

      const uploadedPhoto = await restClient.uploadProfilePhoto(photo.file);

      return {
        id: photo.id,
        isPrimary: photo.isPrimary,
        name: uploadedPhoto.name || photo.name,
        url: uploadedPhoto.url,
      };
    }),
  );

  return {
    ...data,
    photos,
  };
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

  async getProfile() {
    const profile = await request<ProfileApiData>("/profile");

    return {
      ...profile,
      password: "",
      passwordConfirmation: "",
    };
  },

  searchInterests(query) {
    const params = new URLSearchParams({ query });
    return request(`/interests?${params.toString()}`);
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

  async register(data) {
    const dataWithUploadedPhotos = await uploadLocalPhotos(data);

    return request("/auth/register", {
      body: JSON.stringify(dataWithUploadedPhotos),
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

  async updateProfile(data) {
    const dataWithUploadedPhotos = await uploadLocalPhotos(data);

    return request("/profile", {
      body: JSON.stringify(dataWithUploadedPhotos),
      method: "PUT",
    });
  },

  uploadProfilePhoto(file) {
    const formData = new FormData();
    formData.set("file", file);

    return uploadRequest("/media/profile-photos", formData);
  },

  async submitPersonPreviewAction(personPreviewId, action) {
    await request(`/discovery/profiles/${personPreviewId}/action`, {
      body: JSON.stringify({ action }),
      method: "POST",
    });
  },
};
