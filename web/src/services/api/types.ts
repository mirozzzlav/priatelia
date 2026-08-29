import type { LoginFormData } from "src/features/login";
import type { DiscoverySettingsData } from "src/features/discovery-settings";
import type { EditableProfileData } from "src/features/profile";
import type {
  PersonPreview,
  PersonPreviewAction,
} from "src/features/person-preview";
import type { RegistrationFormData } from "src/features/registration";

export type DataSource = "mock" | "rest";

export type UserSession = {
  nickname: string;
  token: string;
};

export type FormFieldErrors<TFormData> = Partial<
  Record<keyof TFormData, string>
>;

export type ApiResponse<TSuccessData, TErrorData> =
  | {
      data: TSuccessData;
      status: "success";
    }
  | {
      data: TErrorData;
      status: "error";
    };

export type LoginFieldErrors = FormFieldErrors<LoginFormData>;

export type LoginErrorData = {
  errors: LoginFieldErrors;
};

export type LoginResponse = ApiResponse<UserSession, LoginErrorData>;

export type MutationSuccessData = {
  saved: true;
};

export type ChatMatch = {
  id: string;
  age: string;
  lastMessage: string | null;
  lastMessageAt: string | null;
  location: string;
  name: string;
  photo: string;
  unreadCount: number;
};

export type ChatMessage = {
  id: string;
  matchId: string;
  sender: "current-user" | "match";
  sentAt: string;
  text: string;
};

export type ChatThread = {
  match: ChatMatch;
  messages: ChatMessage[];
};

export type SendChatMessageData = {
  text: string;
};

export type RegistrationFieldErrors = FormFieldErrors<RegistrationFormData>;

export type RegistrationErrorData = {
  errors: RegistrationFieldErrors;
};

export type RegistrationResponse = ApiResponse<
  UserSession,
  RegistrationErrorData
>;

export type ProfileFieldErrors = FormFieldErrors<EditableProfileData>;

export type ProfileErrorData = {
  errors: ProfileFieldErrors;
};

export type ProfileResponse = ApiResponse<
  MutationSuccessData,
  ProfileErrorData
>;

export type PasswordFormData = {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
};

export type PasswordFieldErrors = FormFieldErrors<PasswordFormData>;

export type PasswordErrorData = {
  errors: PasswordFieldErrors;
};

export type PasswordResponse = ApiResponse<
  MutationSuccessData,
  PasswordErrorData
>;

export type DiscoverySettingsFieldErrors =
  FormFieldErrors<DiscoverySettingsData>;

export type DiscoverySettingsErrorData = {
  errors: DiscoverySettingsFieldErrors;
};

export type DiscoverySettingsResponse = ApiResponse<
  MutationSuccessData,
  DiscoverySettingsErrorData
>;

export type ApiClient = {
  activateAccount: (token: string | null) => Promise<UserSession>;
  getChatMatches: () => Promise<ChatMatch[]>;
  getChatThread: (matchId: string) => Promise<ChatThread>;
  getPersonPreview: () => Promise<PersonPreview>;
  login: (data: LoginFormData) => Promise<LoginResponse>;
  register: (data: RegistrationFormData) => Promise<RegistrationResponse>;
  sendChatMessage: (
    matchId: string,
    data: SendChatMessageData,
  ) => Promise<ChatMessage>;
  updateDiscoverySettings: (
    data: DiscoverySettingsData,
  ) => Promise<DiscoverySettingsResponse>;
  updatePassword: (data: PasswordFormData) => Promise<PasswordResponse>;
  updateProfile: (data: EditableProfileData) => Promise<ProfileResponse>;
  submitPersonPreviewAction: (
    personPreviewId: string,
    action: PersonPreviewAction,
  ) => Promise<void>;
};
