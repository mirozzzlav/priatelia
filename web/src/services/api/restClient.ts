import type {
  ApiClient,
  ChatMatch,
  ChatThread,
  LoginResponse,
  ProfileActionResult,
  UploadedProfilePhoto,
} from "src/services/api/types";
import type { PersonPreview } from "src/features/person-preview";
import type { EditableProfileData } from "src/features/profile";
import type { RegistrationPhoto } from "src/features/registration";
import {
  getStoredSession,
  notifySessionExpired,
} from "src/services/api/sessionStorage";

type ProfileApiData = Omit<
  EditableProfileData,
  "lookingFor" | "password" | "passwordConfirmation"
> & {
  lookingFor?: string | null;
};

type ProfileUpdateApiData = Omit<EditableProfileData, "email">;

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "/api";
const mediaPathPrefix = "/profile-photos/";

function isApiErrorResponse(value: unknown) {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    value.status === "error" &&
    "data" in value
  );
}

function getResponseDetail(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "detail" in value &&
    typeof value.detail === "string"
  ) {
    return value.detail;
  }

  return null;
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

  if (response.status === 401) {
    notifySessionExpired();
    throw new Error("Unauthorized");
  }

  if (response.status === 204) {
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    return undefined as TResponse;
  }

  const data = response.headers
    .get("content-type")
    ?.includes("application/json")
    ? ((await response.json()) as unknown)
    : null;

  if (!response.ok && !isApiErrorResponse(data)) {
    throw new Error(
      getResponseDetail(data) ?? `API request failed: ${response.status}`,
    );
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

  if (response.status === 401) {
    notifySessionExpired();
    throw new Error("Unauthorized");
  }

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
    url: normalizeMediaUrl(photo.url),
  };
}

function normalizeMediaUrl(url: string) {
  const mediaPathIndex = url.indexOf(mediaPathPrefix);

  if (mediaPathIndex < 0) {
    return url;
  }

  return url.slice(mediaPathIndex);
}

function normalizeProfilePhoto(photo: RegistrationPhoto): RegistrationPhoto {
  return {
    ...photo,
    url: normalizeMediaUrl(photo.url),
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
        url: normalizeMediaUrl(uploadedPhoto.url),
      };
    }),
  );

  return {
    ...data,
    photos,
  };
}

function stripReadOnlyProfileFields(
  data: EditableProfileData,
): ProfileUpdateApiData {
  return {
    bio: data.bio,
    birthDate: data.birthDate,
    gender: data.gender,
    interests: data.interests,
    lookingFor: data.lookingFor,
    location: data.location,
    locationLatitude: data.locationLatitude,
    locationLongitude: data.locationLongitude,
    nickname: data.nickname,
    password: data.password,
    passwordConfirmation: data.passwordConfirmation,
    photos: data.photos,
  };
}

export const restClient: ApiClient = {
  async activateAccount(token) {
    const response = await request<LoginResponse>("/auth/activate", {
      body: JSON.stringify({ token }),
      method: "POST",
    });

    if (response.status === "error") {
      throw new Error("Account activation failed");
    }

    return response.data;
  },

  getPersonPreview() {
    return request<PersonPreview>("/discovery/profile").then((profile) => ({
      ...profile,
      photo: normalizeMediaUrl(profile.photo),
      photos: profile.photos.map(normalizeMediaUrl),
    }));
  },

  getDiscoverySettings() {
    return request("/discovery/settings");
  },

  async getProfile() {
    const profile = await request<ProfileApiData>("/profile");

    return {
      ...profile,
      lookingFor: profile.lookingFor ?? "",
      password: "",
      passwordConfirmation: "",
      photos: profile.photos.map(normalizeProfilePhoto),
    };
  },

  searchInterests(query) {
    const params = new URLSearchParams({ query });
    return request(`/interests?${params.toString()}`);
  },

  searchLocations(query) {
    const params = new URLSearchParams({ query });
    return request(`/locations?${params.toString()}`);
  },

  getChatMatches() {
    return request<ChatMatch[]>("/chats/matches").then((matches) =>
      matches.map((match) => ({
        ...match,
        photo: normalizeMediaUrl(match.photo),
      })),
    );
  },

  getChatMatchProfile(matchId) {
    return request<PersonPreview>(`/chats/matches/${matchId}/profile`).then(
      (profile) => ({
        ...profile,
        photo: normalizeMediaUrl(profile.photo),
        photos: profile.photos.map(normalizeMediaUrl),
      }),
    );
  },

  getChatThread(matchId) {
    return request<ChatThread>(`/chats/matches/${matchId}`).then((thread) => ({
      ...thread,
      match: {
        ...thread.match,
        photo: normalizeMediaUrl(thread.match.photo),
      },
    }));
  },

  async markChatMatchesSeen(matchIds) {
    await request("/chats/matches/seen", {
      body: JSON.stringify({ matchIds }),
      method: "POST",
    });
  },

  async markChatThreadRead(matchId) {
    await request(`/chats/matches/${matchId}/read`, {
      method: "POST",
    });
  },

  login(data) {
    return request("/auth/login", {
      body: JSON.stringify(data),
      method: "POST",
    });
  },

  requestPasswordReset(data) {
    return request("/auth/password-reset", {
      body: JSON.stringify(data),
      method: "POST",
    });
  },

  resetPassword(token, data) {
    return request("/auth/password-reset/confirm", {
      body: JSON.stringify({ ...data, token }),
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
    const dataWithUploadedPhotos = await uploadLocalPhotos(
      stripReadOnlyProfileFields(data),
    );

    return request("/profile", {
      body: JSON.stringify(dataWithUploadedPhotos),
      method: "PUT",
    });
  },

  uploadProfilePhoto(file) {
    const formData = new FormData();
    formData.set("file", file);

    return uploadRequest<UploadedProfilePhoto>(
      "/media/profile-photos",
      formData,
    ).then((photo) => ({
      ...photo,
      url: normalizeMediaUrl(photo.url),
    }));
  },

  submitPersonPreviewAction(personPreviewId, action) {
    return request<ProfileActionResult>(
      `/discovery/profiles/${personPreviewId}/action`,
      {
        body: JSON.stringify({ action }),
        method: "POST",
      },
    ).then((result) => ({
      ...result,
      match: result.match
        ? {
            ...result.match,
            photo: normalizeMediaUrl(result.match.photo),
          }
        : null,
    }));
  },
};
