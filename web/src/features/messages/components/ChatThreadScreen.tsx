import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";

import {
  BackIcon,
  FormSubmitButton,
  FormTextarea,
  SecondaryButton,
  SendIcon,
} from "src/components/formElements";
import { HeaderSurface } from "src/components/HeaderSurface";
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
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    h: "calc(100dvh - 64px)",
    minH: 0,
    overflow: "hidden",
    px: { base: "12px", sm: "16px" },
    pb: "18px",
  },
  header: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
  },
  backButton: {
    alignSelf: "start",
    flexShrink: 0,
    justifySelf: "end",
    h: "34px",
    minW: "0",
    px: "10px",
    fontSize: "xs",
    iconSpacing: "5px",
  },
  profileHeader: {
    alignItems: "center",
    gap: "12px",
    minW: 0,
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
    flex: "1 1 0",
    minH: 0,
    overflowY: "auto",
    pt: { base: "22px", sm: "28px" },
    pr: "10px",
    pb: "16px",
  },
  messagesContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: "10px",
    minH: "100%",
  },
  bubble: (sender: ChatMessage["sender"]) =>
    ({
      maxW: "82%",
      px: "13px",
      py: "10px",
      borderRadius: "14px",
      bg: sender === "current-user" ? "app.base" : "app.bgAux",
      color: sender === "current-user" ? "app.white" : "app.text",
      fontSize: "sm",
      lineHeight: 1.4,
      whiteSpace: "pre-wrap",
    }) as const,
  messageWrap: (sender: ChatMessage["sender"]) =>
    ({
      display: "grid",
      flexShrink: 0,
      justifyItems: sender === "current-user" ? "end" : "start",
      w: "100%",
    }) as const,
  deliveryStatus: {
    mt: "4px",
    pr: "4px",
    color: "rgba(53, 87, 45, 0.62)",
    fontSize: "11px",
    fontWeight: "bold",
    lineHeight: 1,
  },
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
    alignItems: "end",
    flexShrink: 0,
    gridTemplateColumns: "1fr auto",
    gap: "8px",
  },
  messageInput: {
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

function getDeliveryStatusLabel(status: ChatMessage["deliveryStatus"]) {
  if (status === "seen") {
    return "Videné";
  }

  if (status === "delivered") {
    return "Doručené";
  }

  return "Odoslané";
}

function getLastOutgoingMessageId(messages: ChatMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].sender === "current-user") {
      return messages[index].id;
    }
  }

  return undefined;
}

export function ChatThreadScreen({
  error,
  isLoading,
  isSending,
  onBack,
  onSendMessage,
  thread,
}: ChatThreadScreenProps) {
  const [messageText, setMessageText] = useState("");
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const messageCount = thread?.messages.length ?? 0;
  const lastOutgoingMessageId = thread
    ? getLastOutgoingMessageId(thread.messages)
    : undefined;

  useEffect(() => {
    const messagesElement = messagesRef.current;

    if (!messagesElement) {
      return;
    }

    messagesElement.scrollTop = messagesElement.scrollHeight;
  }, [messageCount]);

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

  const handleMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    void sendMessage();
  };

  return (
    <Box {...styles.root}>
      <HeaderSurface {...styles.header}>
        {thread && (
          <Flex {...styles.profileHeader}>
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
          </Flex>
        )}
        <SecondaryButton
          leftIcon={<BackIcon />}
          onClick={onBack}
          {...styles.backButton}
        >
          Späť
        </SecondaryButton>
      </HeaderSurface>

      {isLoading && (
        <Flex {...styles.loadingStatus}>
          <LoadingPill text="Načítavam konverzáciu." />
        </Flex>
      )}
      {error && <Text {...styles.status}>{error}</Text>}

      {!isLoading && !error && thread && (
        <>
          <Box ref={messagesRef} {...styles.messages}>
            <Box {...styles.messagesContent}>
              {thread.messages.length === 0 && (
                <Text {...styles.status}>Zatiaľ tu nie sú žiadne správy.</Text>
              )}
              {thread.messages.map((message) => {
                const shouldShowDeliveryStatus =
                  message.sender === "current-user" &&
                  message.id === lastOutgoingMessageId;

                return (
                  <Box key={message.id} {...styles.messageWrap(message.sender)}>
                    <Text {...styles.bubble(message.sender)}>
                      {message.text}
                    </Text>
                    {shouldShowDeliveryStatus && (
                      <Text {...styles.deliveryStatus}>
                        {getDeliveryStatusLabel(message.deliveryStatus)}
                      </Text>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>

          <HeaderSurface
            as="form"
            noValidate
            onSubmit={handleSubmit}
            {...styles.composer}
          >
            <FormTextarea
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              onKeyDown={handleMessageKeyDown}
              placeholder="Napíš správu"
              rows={1}
              {...styles.messageInput}
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
        </>
      )}
    </Box>
  );
}
