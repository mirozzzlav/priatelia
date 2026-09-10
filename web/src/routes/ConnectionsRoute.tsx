import { Badge, Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { BackButton } from "src/components/formElements";
import { LoadingPill } from "src/components/LoadingPill";
import { PageHeader } from "src/components/PageHeader";
import { useChatMatches } from "src/context/chatMatches";
import type { ChatMatch } from "src/services/api";

const styles = {
  root: {
    minH: "calc(100vh - 64px)",
    px: { base: "12px", sm: "16px" },
    pb: "34px",
  },
  header: {
    position: "sticky",
    top: "64px",
    zIndex: 20,
  },
  content: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    pt: { base: "22px", sm: "28px" },
  },
  card: {
    position: "relative",
    overflow: "hidden",
    transition:
      "border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease",
    border: "1px solid",
    borderColor: "rgba(53, 87, 45, 0.16)",
    borderRadius: "8px",
    bg: "app.white",
    boxShadow: "0 9px 22px rgba(53, 87, 45, 0.1)",
    p: "6px",
    sx: {
      "&:has(.connection-thread-button:hover)": {
        borderColor: "rgba(197, 106, 24, 0.42)",
        boxShadow:
          "0 0 0 2px rgba(197, 106, 24, 0.24), 0 11px 26px rgba(53, 87, 45, 0.14)",
      },
      "&:has(.connection-thread-button:active)": {
        borderColor: "rgba(197, 106, 24, 0.5)",
        boxShadow:
          "0 0 0 2px rgba(197, 106, 24, 0.3), 0 8px 20px rgba(53, 87, 45, 0.12)",
        transform: "scale(0.997)",
      },
    },
  },
  threadButton: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    display: "block",
    h: "100%",
    minW: 0,
    p: 0,
    borderRadius: "8px",
    cursor: "pointer",
    _focusVisible: {
      boxShadow: "0 0 0 3px rgba(197, 106, 24, 0.28)",
    },
  },
  newBadge: {
    position: "absolute",
    top: "8px",
    right: "8px",
    zIndex: 2,
    pointerEvents: "none",
    border: "2px solid",
    borderColor: "app.white",
    borderRadius: "999px",
    bg: "app.base",
    color: "app.white",
    fontSize: "10px",
    fontWeight: "black",
    lineHeight: 1,
    px: "8px",
    py: "5px",
    textTransform: "none",
    boxShadow: "0 6px 14px rgba(53, 87, 45, 0.22)",
  },
  photo: {
    w: "100%",
    aspectRatio: "1",
    borderRadius: "6px",
    objectFit: "cover",
  },
  photoButton: {
    position: "relative",
    zIndex: 2,
    display: "block",
    h: "auto",
    minW: 0,
    p: 0,
    borderRadius: "6px",
    overflow: "hidden",
    _focusVisible: {
      boxShadow: "inset 0 0 0 3px rgba(79, 131, 68, 0.32)",
    },
  },
  cardBody: {
    display: "grid",
    gap: "10px",
    p: "12px",
  },
  name: {
    color: "app.text",
    fontSize: "md",
    fontWeight: "black",
    lineHeight: 1.1,
    noOfLines: 1,
  },
  nameButton: {
    position: "relative",
    zIndex: 2,
    display: "block",
    h: "auto",
    minW: 0,
    p: 0,
    textAlign: "left",
    _hover: {
      color: "app.baseDark",
      textDecoration: "underline",
    },
    _focusVisible: {
      boxShadow: "0 0 0 3px rgba(79, 131, 68, 0.22)",
    },
  },
  meta: {
    color: "app.text",
    fontSize: "xs",
    fontWeight: "bold",
    noOfLines: 1,
  },
  messageButton: {
    position: "relative",
    zIndex: 0,
    alignItems: "center",
    justifyContent: "center",
    h: "38px",
    px: "10px",
    borderRadius: "999px",
    bg: "app.base",
    color: "app.white",
    fontSize: "xs",
    fontWeight: "black",
    _hover: { bg: "app.baseDark" },
    _active: { bg: "app.baseDark" },
  },
  status: {
    gridColumn: "1 / -1",
    py: "34px",
    color: "app.text",
    fontSize: "sm",
    fontWeight: "extrabold",
    textAlign: "center",
  },
  loadingStatus: {
    gridColumn: "1 / -1",
    justify: "center",
    py: "34px",
  },
  backButton: {
    alignSelf: "start",
    justifySelf: "end",
    h: "34px",
    minW: "0",
    px: "10px",
    fontSize: "xs",
    iconSpacing: "5px",
  },
} as const;

function getConnectionSortKey(match: ChatMatch) {
  return `${match.isNew ? "0" : "1"}-${match.name}`;
}

export function ConnectionsRoute() {
  const navigate = useNavigate();
  const {
    isLoadingMatches,
    markMatchesSeen,
    matches,
    matchesError,
    newDiscoveryMatches,
  } = useChatMatches();
  const latestMarkMatchesSeenRef = useRef(markMatchesSeen);
  const newMatchIdsRef = useRef<string[]>([]);
  const canMarkSeenOnLeaveRef = useRef(false);
  const unstartedConnections = useMemo(
    () =>
      matches
        .filter((match) => !match.lastMessage)
        .sort((firstMatch, secondMatch) =>
          getConnectionSortKey(firstMatch).localeCompare(
            getConnectionSortKey(secondMatch),
          ),
        ),
    [matches],
  );

  useEffect(() => {
    latestMarkMatchesSeenRef.current = markMatchesSeen;
  }, [markMatchesSeen]);

  useEffect(() => {
    newMatchIdsRef.current = newDiscoveryMatches.map((match) => match.id);
  }, [newDiscoveryMatches]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      canMarkSeenOnLeaveRef.current = true;
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);

      if (!canMarkSeenOnLeaveRef.current) {
        return;
      }

      latestMarkMatchesSeenRef.current(newMatchIdsRef.current);
    };
  }, []);

  return (
    <Box {...styles.root}>
      <PageHeader
        intro="Ľudia, s ktorými ste si dali vzájomné áno a ešte ste nezačali konverzáciu."
        rightAction={
          <BackButton
            onClick={() => navigate("/discover")}
            {...styles.backButton}
          />
        }
        title="Tvoje prepojenia"
        {...styles.header}
      />

      <Box {...styles.content}>
        {isLoadingMatches && (
          <Flex {...styles.loadingStatus}>
            <LoadingPill text="Načítavam prepojenia." />
          </Flex>
        )}
        {matchesError && <Text {...styles.status}>{matchesError}</Text>}
        {!isLoadingMatches &&
          !matchesError &&
          unstartedConnections.length === 0 && (
            <Text {...styles.status}>
              Nemáš žiadne prepojenia bez začatej konverzácie.
            </Text>
          )}
        {!isLoadingMatches &&
          !matchesError &&
          unstartedConnections.map((match) => (
            <Box key={match.id} {...styles.card}>
              <Button
                aria-label={`Otvoriť konverzáciu s: ${match.name}`}
                className="connection-thread-button"
                onClick={() => navigate(`/messages/${match.id}`)}
                type="button"
                variant="unstyled"
                {...styles.threadButton}
              />
              {match.isNew && <Badge {...styles.newBadge}>Nové</Badge>}
              <Button
                aria-label={`Otvoriť profil: ${match.name}`}
                onClick={() =>
                  navigate(`/people/${match.id}`, {
                    state: { from: "/connections" },
                  })
                }
                type="button"
                variant="unstyled"
                {...styles.photoButton}
              >
                <Image src={match.photo} alt={match.name} {...styles.photo} />
              </Button>
              <Box {...styles.cardBody}>
                <Box>
                  <Button
                    onClick={() =>
                      navigate(`/people/${match.id}`, {
                        state: { from: "/connections" },
                      })
                    }
                    type="button"
                    variant="unstyled"
                    {...styles.nameButton}
                  >
                    <Text {...styles.name}>{match.name}</Text>
                  </Button>
                  <Text {...styles.meta}>
                    {match.age} · {match.location}
                  </Text>
                </Box>
                <Flex {...styles.messageButton}>
                  Napísať správu
                </Flex>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
}
