import type { ClientConfig } from "src/services/api/types";

export const mockClientConfig: ClientConfig = {
  validation: {
    photos: {
      maxProfilePhotoCount: 7,
    },
    profile: {
      bioMaxLength: 500,
      lookingForMaxLength: 300,
      nicknameMaxLength: 15,
    },
  },
};
