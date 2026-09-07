import {
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import {
  FormSubmitButton,
  FormTextarea,
  SendIcon,
} from "src/components/formElements";
import { HeaderSurface } from "src/components/HeaderSurface";

type MessageComposerProps = {
  isSending: boolean;
  onSendMessage: (text: string) => Promise<void>;
};

const styles = {
  root: {
    display: "grid",
    alignItems: "end",
    flexShrink: 0,
    gridTemplateColumns: "1fr auto",
    gap: "8px",
  },
  input: {
    h: "48px",
    minH: "48px",
    maxH: "118px",
    py: "12px",
    resize: "none",
    overflowY: "auto",
  },
  sendButton: {
    h: "48px",
    px: "16px",
  },
} as const;

export function MessageComposer({
  isSending,
  onSendMessage,
}: MessageComposerProps) {
  const [messageText, setMessageText] = useState("");

  const sendMessage = async () => {
    const trimmedText = messageText.trim();

    if (trimmedText.length === 0 || isSending) {
      return;
    }

    await onSendMessage(trimmedText);
    setMessageText("");
  };

  const handleSubmit = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    await sendMessage();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();
    void sendMessage();
  };

  return (
    <HeaderSurface
      as="form"
      noValidate
      onSubmit={handleSubmit}
      {...styles.root}
    >
      <FormTextarea
        value={messageText}
        onChange={(event) => setMessageText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Napíš správu"
        rows={1}
        {...styles.input}
      />
      <FormSubmitButton
        isDisabled={messageText.trim().length === 0 || isSending}
        isLoading={isSending}
        loadingText=""
        rightIcon={<SendIcon />}
        {...styles.sendButton}
      >
        Poslať
      </FormSubmitButton>
    </HeaderSurface>
  );
}
