import { useState, type FormEvent } from "react";
import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

import {
  FormInput,
  FormSubmitButton,
  SecondaryButton,
} from "src/components/formElements";
import { LoadingPill } from "src/components/LoadingPill";
import type { ChatMessage, ChatThread } from "src/services/api";

type ChatThreadScreenProps = {
  error: string | null;
  isLoading: boolean;
  isSending: boolean;
  onBack: () => void;
  onSendMessage: (text: string) => Promise<void>;
  thread: ChatThread | null;
};

const styles = {
  root: {
    minH: "calc(100vh - 64px)",
    px: { base: "12px", sm: "16px" },
    pb: "18px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    pt: "16px",
    pb: "14px",
    borderBottom: "1px solid",
    borderColor: "app.bgAux",
  },
  backButton: {
    h: "42px",
    px: "12px",
    borderRadius: "12px",
  },
  photo: {
    boxSize: "46px",
    flexShrink: 0,
    borderRadius: "12px",
    objectFit: "cover",
  },
  titleWrap: {
    minW: 0,
  },
  title: {
    color: "app.text",
    fontSize: "xl",
    lineHeight: 1.1,
    letterSpacing: 0,
  },
  meta: {
    mt: "3px",
    color: "app.text",
    fontSize: "xs",
    fontWeight: "bold",
  },
  messages: {
    display: "grid",
    alignContent: "end",
    gap: "10px",
    minH: "calc(100vh - 236px)",
    py: "16px",
  },
  bubble: (sender: ChatMessage["sender"]) =>
    ({
      maxW: "82%",
      justifySelf: sender === "current-user" ? "end" : "start",
      px: "13px",
      py: "10px",
      borderRadius: "14px",
      bg: sender === "current-user" ? "app.base" : "app.bgAux",
      color: sender === "current-user" ? "app.white" : "app.textAlt",
      fontSize: "sm",
      lineHeight: 1.4,
    }) as const,
  status: {
    py: "34px",
    color: "app.text",
    fontSize: "sm",
    fontWeight: "extrabold",
    textAlign: "center",
  },
  loadingStatus: {
    justify: "center",
    py: "34px",
  },
  composer: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "8px",
    pt: "10px",
    borderTop: "1px solid",
    borderColor: "app.bgAux",
  },
  sendButton: {
    h: "48px",
    px: "16px",
  },
} as const;

export function ChatThreadScreen({
  error,
  isLoading,
  isSending,
  onBack,
  onSendMessage,
  thread,
}: ChatThreadScreenProps) {
  const [messageText, setMessageText] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedText = messageText.trim();

    if (trimmedText.length === 0 || isSending) {
      return;
    }

    await onSendMessage(trimmedText);
    setMessageText("");
  };

  return (
    <Box {...styles.root}>
      <Flex {...styles.header}>
        <SecondaryButton onClick={onBack} {...styles.backButton}>
          Späť
        </SecondaryButton>
        {thread && (
          <>
            <Image
              src={thread.match.photo}
              alt={thread.match.name}
              {...styles.photo}
            />
            <Box {...styles.titleWrap}>
              <Heading as="h1" {...styles.title}>
                {thread.match.name}
              </Heading>
              <Text {...styles.meta}>
                {thread.match.age} · {thread.match.location}
              </Text>
            </Box>
          </>
        )}
      </Flex>

      {isLoading && (
        <Flex {...styles.loadingStatus}>
          <LoadingPill text="Načítavam konverzáciu." />
        </Flex>
      )}
      {error && <Text {...styles.status}>{error}</Text>}

      {!isLoading && !error && thread && (
        <>
          <Box {...styles.messages}>
            {thread.messages.length === 0 && (
              <Text {...styles.status}>Zatiaľ tu nie sú žiadne správy.</Text>
            )}
            {thread.messages.map((message) => (
              <Text key={message.id} {...styles.bubble(message.sender)}>
                {message.text}
              </Text>
            ))}
          </Box>

          <Box
            as="form"
            noValidate
            onSubmit={handleSubmit}
            {...styles.composer}
          >
            <FormInput
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="Napíš správu"
            />
            <FormSubmitButton
              isDisabled={messageText.trim().length === 0 || isSending}
              isLoading={isSending}
              loadingText=""
              {...styles.sendButton}
            >
              Poslať
            </FormSubmitButton>
          </Box>
        </>
      )}
    </Box>
  );
}
