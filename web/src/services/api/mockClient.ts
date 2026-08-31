import type {
  ApiClient,
  ChatMatch,
  ChatMessage,
  DiscoverySettingsFieldErrors,
  LoginFieldErrors,
  PasswordFieldErrors,
  ProfileFieldErrors,
  RegistrationFieldErrors,
} from "src/services/api/types";
import {
  mockChatMessagesByMatchId,
  mockIncomingLikePersonPreviewIds,
  mockInitialChatMatchIds,
  mockPersonPreviews,
} from "src/services/api/mockData";
import { interestOptions } from "src/constants/interests";

type PersonPreviewDecision = {
  action: Parameters<ApiClient["submitPersonPreviewAction"]>[1];
  personPreviewId: string;
  submittedAt: string;
};

const getMockDelay = () => 1500 + Math.floor(Math.random() * 1501);

const delay = () =>
  new Promise((resolve) => {
    window.setTimeout(resolve, getMockDelay());
  });

const submittedPersonPreviewDecisions: PersonPreviewDecision[] = [];
const submittedPersonPreviewIds = new Set<string>();
const chatMatchIds = new Set(mockInitialChatMatchIds);
const chatMessagesByMatchId: Record<string, ChatMessage[]> = {
  ...mockChatMessagesByMatchId,
};
let currentProfile = {
  bio: "Rád spoznávam ľudí cez dobré jedlo, výlety a pokojné rozhovory.",
  birthDate: "1996-04-18",
  interests: [
    { id: "cestovanie", name: "Cestovanie" },
    { id: "kava", name: "Káva" },
    { id: "turistika", name: "Turistika" },
  ],
  location: "Bratislava",
  nickname: "demo",
  password: "",
  passwordConfirmation: "",
  photos: [
    {
      id: "mock-current-profile-photo",
      isPrimary: true,
      name: "profile-photo.jpg",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
    },
  ],
};

function getRandomItem<TItem>(items: TItem[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomPersonPreview() {
  const availablePreviews = mockPersonPreviews.filter(
    (personPreview) => !submittedPersonPreviewIds.has(personPreview.id),
  );

  if (availablePreviews.length === 0) {
    submittedPersonPreviewIds.clear();
    return getRandomItem(mockPersonPreviews);
  }

  return getRandomItem(availablePreviews);
}

function getPersonPreviewById(personPreviewId: string) {
  return mockPersonPreviews.find(
    (personPreview) => personPreview.id === personPreviewId,
  );
}

function getChatMatch(personPreviewId: string): ChatMatch | null {
  const personPreview = getPersonPreviewById(personPreviewId);

  if (!personPreview) {
    return null;
  }

  const messages = chatMessagesByMatchId[personPreviewId] ?? [];
  const lastMessage = messages.at(-1) ?? null;

  return {
    id: personPreview.id,
    age: personPreview.age,
    lastMessage: lastMessage?.text ?? null,
    lastMessageAt: lastMessage?.sentAt ?? null,
    location: personPreview.meta[0] ?? "",
    name: personPreview.name,
    photo: personPreview.photo,
    unreadCount: messages.filter((message) => message.sender === "match")
      .length,
  };
}

function buildChatMatches() {
  return Array.from(chatMatchIds)
    .map(getChatMatch)
    .filter((match): match is ChatMatch => Boolean(match))
    .sort((firstMatch, secondMatch) => {
      const firstTimestamp = firstMatch.lastMessageAt ?? "";
      const secondTimestamp = secondMatch.lastMessageAt ?? "";

      return secondTimestamp.localeCompare(firstTimestamp);
    });
}

function ensureChatMatch(personPreviewId: string) {
  if (!mockIncomingLikePersonPreviewIds.has(personPreviewId)) {
    return;
  }

  chatMatchIds.add(personPreviewId);
  chatMessagesByMatchId[personPreviewId] ??= [
    {
      id: `mock-message-${personPreviewId}-intro`,
      matchId: personPreviewId,
      sender: "match",
      sentAt: new Date().toISOString(),
      text: "Aj ja som dala áno. Môžeme si napísať.",
    },
  ];
}

function getWordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function getLoginErrors(nickname: string, password: string): LoginFieldErrors {
  if (nickname.trim().length === 0 || password.length === 0) {
    return {
      nickname: "Nesprávna kombinácia mena a hesla.",
      password: "Nesprávna kombinácia mena a hesla.",
    };
  }

  return {};
}

function getRegistrationErrors(data: Parameters<ApiClient["register"]>[0]) {
  const errors: RegistrationFieldErrors = {};
  const bioWordCount = getWordCount(data.bio);

  if (data.nickname.trim().length === 0) {
    errors.nickname = "Vyplň nickname.";
  }

  if (data.email.trim().length === 0) {
    errors.email = "Vyplň email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Email nemá správny formát.";
  }

  if (data.password.length === 0) {
    errors.password = "Vyplň heslo.";
  } else if (data.password.length < 8) {
    errors.password = "Heslo musí mať aspoň 8 znakov.";
  }

  if (data.passwordConfirmation.length === 0) {
    errors.passwordConfirmation = "Zopakuj heslo.";
  } else if (data.password !== data.passwordConfirmation) {
    errors.passwordConfirmation = "Heslá sa nezhodujú.";
  }

  if (data.birthDate.length === 0) {
    errors.birthDate = "Vyplň dátum narodenia.";
  }

  if (data.location.trim().length === 0) {
    errors.location = "Vyplň polohu pre hľadanie priateľov.";
  }

  if (bioWordCount === 0) {
    errors.bio = "Vyplň krátke bio.";
  } else if (bioWordCount < 3) {
    errors.bio = "Bio musí obsahovať aspoň 3 slová.";
  }

  if (data.interests.length === 0) {
    errors.interests = "Pridaj aspoň jeden záujem.";
  }

  if (data.photos.length === 0) {
    errors.photos = "Pridaj aspoň jednu fotku.";
  }

  return errors;
}

function getProfileErrors(data: Parameters<ApiClient["updateProfile"]>[0]) {
  const errors: ProfileFieldErrors = {};
  const bioWordCount = getWordCount(data.bio);

  if (data.nickname.trim().length === 0) {
    errors.nickname = "Vyplň nickname.";
  }

  if (data.birthDate.length === 0) {
    errors.birthDate = "Vyplň dátum narodenia.";
  }

  if (data.location.trim().length === 0) {
    errors.location = "Vyplň polohu pre hľadanie priateľov.";
  }

  if (bioWordCount === 0) {
    errors.bio = "Vyplň krátke bio.";
  } else if (bioWordCount < 3) {
    errors.bio = "Bio musí obsahovať aspoň 3 slová.";
  }

  if (data.interests.length === 0) {
    errors.interests = "Pridaj aspoň jeden záujem.";
  }

  if (data.photos.length === 0) {
    errors.photos = "Pridaj aspoň jednu fotku.";
  }

  return errors;
}

function getPasswordErrors(data: Parameters<ApiClient["updatePassword"]>[0]) {
  const errors: PasswordFieldErrors = {};

  if (data.currentPassword.length === 0) {
    errors.currentPassword = "Vyplň aktuálne heslo.";
  }

  if (data.password.length === 0) {
    errors.password = "Vyplň nové heslo.";
  } else if (data.password.length < 8) {
    errors.password = "Heslo musí mať aspoň 8 znakov.";
  }

  if (data.passwordConfirmation.length === 0) {
    errors.passwordConfirmation = "Zopakuj nové heslo.";
  } else if (data.password !== data.passwordConfirmation) {
    errors.passwordConfirmation = "Heslá sa nezhodujú.";
  }

  return errors;
}

function getDiscoverySettingsErrors(
  data: Parameters<ApiClient["updateDiscoverySettings"]>[0],
) {
  const errors: DiscoverySettingsFieldErrors = {};
  const ageFrom = Number(data.ageFrom);
  const ageTo = Number(data.ageTo);

  if (data.location.trim().length === 0) {
    errors.location = "Vyplň lokalitu.";
  }

  if (data.ageFrom.length === 0) {
    errors.ageFrom = "Vyplň vek od.";
  } else if (!Number.isInteger(ageFrom)) {
    errors.ageFrom = "Vek od musí byť celé číslo.";
  } else if (ageFrom < 18) {
    errors.ageFrom = "Vek od musí byť aspoň 18.";
  }

  if (data.ageTo.length === 0) {
    errors.ageTo = "Vyplň vek do.";
  } else if (!Number.isInteger(ageTo)) {
    errors.ageTo = "Vek do musí byť celé číslo.";
  } else if (ageTo < ageFrom) {
    errors.ageTo = "Vek do nemôže byť menší ako vek od.";
  }

  return errors;
}

function createMutationResponse<TFieldErrors extends object>(
  errors: TFieldErrors,
) {
  if (Object.keys(errors).length > 0) {
    return {
      data: { errors },
      status: "error" as const,
    };
  }

  return {
    data: { saved: true as const },
    status: "success" as const,
  };
}

export const mockClient: ApiClient = {
  async activateAccount() {
    await delay();

    return {
      nickname: "aktivovany-pouzivatel",
      token: "mock-activation-session-token",
    };
  },

  async getPersonPreview() {
    await delay();

    return getRandomPersonPreview();
  },

  async getProfile() {
    await delay();

    return {
      ...currentProfile,
      interests: [...currentProfile.interests],
      photos: currentProfile.photos.map((photo) => ({ ...photo })),
    };
  },

  async searchInterests(query) {
    const normalizedQuery = query.trim().toLocaleLowerCase("sk");
    await delay();

    return interestOptions
      .filter((interest) => {
        return (
          normalizedQuery.length === 0 ||
          interest.id.includes(normalizedQuery) ||
          interest.name.toLocaleLowerCase("sk").includes(normalizedQuery)
        );
      })
      .slice(0, 12);
  },

  async getChatMatches() {
    await delay();

    return buildChatMatches();
  },

  async getChatThread(matchId) {
    await delay();

    const match = getChatMatch(matchId);

    if (!match) {
      throw new Error(`Chat match not found: ${matchId}`);
    }

    return {
      match,
      messages: chatMessagesByMatchId[matchId] ?? [],
    };
  },

  async login(data) {
    await delay();

    const errors = getLoginErrors(data.nickname, data.password);

    if (Object.keys(errors).length > 0) {
      return {
        data: { errors },
        status: "error",
      };
    }

    return {
      data: {
        nickname: data.nickname.trim(),
        token: "mock-session-token",
      },
      status: "success",
    };
  },

  async register(data) {
    await delay();

    const errors = getRegistrationErrors(data);

    if (Object.keys(errors).length > 0) {
      return {
        data: { errors },
        status: "error",
      };
    }

    currentProfile = {
      ...data,
      nickname: data.nickname.trim(),
      password: "",
      passwordConfirmation: "",
    };

    return {
      data: {
        registered: true,
      },
      status: "success",
    };
  },

  async uploadProfilePhoto(file) {
    await delay();

    return {
      name: file.name,
      url: URL.createObjectURL(file),
    };
  },

  async sendChatMessage(matchId, data) {
    await delay();

    const match = getChatMatch(matchId);

    if (!match) {
      throw new Error(`Chat match not found: ${matchId}`);
    }

    const message: ChatMessage = {
      id: `mock-message-${matchId}-${crypto.randomUUID()}`,
      matchId,
      sender: "current-user",
      sentAt: new Date().toISOString(),
      text: data.text.trim(),
    };

    chatMessagesByMatchId[matchId] = [
      ...(chatMessagesByMatchId[matchId] ?? []),
      message,
    ];

    return message;
  },

  async updateDiscoverySettings(data) {
    await delay();

    return createMutationResponse(getDiscoverySettingsErrors(data));
  },

  async updatePassword(data) {
    await delay();

    return createMutationResponse(getPasswordErrors(data));
  },

  async updateProfile(data) {
    await delay();

    const response = createMutationResponse(getProfileErrors(data));

    if (response.status === "success") {
      currentProfile = {
        ...data,
        nickname: data.nickname.trim(),
        password: "",
        passwordConfirmation: "",
      };
    }

    return response;
  },

  async submitPersonPreviewAction(personPreviewId, action) {
    await delay();

    submittedPersonPreviewDecisions.push({
      action,
      personPreviewId,
      submittedAt: new Date().toISOString(),
    });
    submittedPersonPreviewIds.add(personPreviewId);

    if (action === "like") {
      ensureChatMatch(personPreviewId);
    }
  },
};
