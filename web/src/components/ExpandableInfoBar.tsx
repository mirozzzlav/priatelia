import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Text,
} from "@chakra-ui/react";
import type { ReactElement, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export type ExpandableInfoBarItem = {
  collapsedContent: ReactNode;
  expandedContent: ReactNode;
  icon: ReactElement;
  id: string;
  label: string;
};

type ExpandableInfoBarProps = {
  collapsedHeight?: string;
  defaultItemId?: string;
  expandedMaxWidth?: string;
  items: ExpandableInfoBarItem[];
  topOffset?: number;
};

const styles = {
  root: (
    isExpanded: boolean,
    expandedTop: number | null,
    collapsedHeight: string,
    expandedMaxWidth: string,
    topOffset: number,
  ) =>
    ({
      position: isExpanded ? "fixed" : "relative",
      top: isExpanded ? `${expandedTop ?? topOffset}px` : undefined,
      left: isExpanded ? "50%" : undefined,
      zIndex: isExpanded ? 30 : 1,
      w: isExpanded
        ? expandedMaxWidth
        : { base: "calc(100% + 24px)", sm: "calc(100% + 32px)" },
      h: isExpanded
        ? `calc(100dvh - ${expandedTop ?? topOffset}px)`
        : collapsedHeight,
      mx: isExpanded ? undefined : { base: "-12px", sm: "-16px" },
      bg: "app.white",
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "rgba(38, 57, 111, 0.14)",
      boxShadow: isExpanded
        ? "0 18px 42px rgba(38, 57, 111, 0.18)"
        : "0 18px 42px rgba(38, 57, 111, 0.12)",
      color: "app.text",
      overflow: "hidden",
      transform: isExpanded ? "translateX(-50%)" : undefined,
      transition:
        "height 220ms ease, box-shadow 220ms ease, background 220ms ease",
    }) as const,
  summaryRow: (collapsedHeight: string) =>
    ({
      align: "center",
      justify: "space-between",
      w: "100%",
      h: collapsedHeight,
      px: "18px",
      gap: "16px",
    }) as const,
  summaryButton: {
    align: "center",
    display: "flex",
    flex: 1,
    gap: "10px",
    minW: 0,
    h: "100%",
    overflow: "hidden",
    pr: "8px",
    textAlign: "left",
    _hover: { bg: "transparent" },
    _active: { bg: "transparent" },
  },
  summaryText: {
    display: "block",
    maxW: "100%",
    overflow: "hidden",
    fontSize: "sm",
    fontWeight: "semibold",
    lineHeight: 1.25,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  chevron: (isExpanded: boolean) =>
    ({
      flexShrink: 0,
      color: "app.text",
      opacity: 0.86,
      transform: isExpanded ? "rotate(180deg)" : undefined,
      transition: "transform 160ms ease, opacity 160ms ease",
    }) as const,
  iconList: {
    flexShrink: 0,
    spacing: "6px",
  },
  iconButton: (isSelected: boolean) =>
    ({
      display: "grid",
      placeItems: "center",
      boxSize: "34px",
      minW: "34px",
      border: "1px solid",
      borderColor: "app.text",
      borderRadius: "999px",
      color: "app.text",
      bg: isSelected ? "app.bgAux" : "app.white",
      transition: "background 140ms ease, border-color 140ms ease",
      _hover: { bg: isSelected ? "app.bgAux" : "app.white" },
      _active: { bg: isSelected ? "app.bgAux" : "app.white" },
    }) as const,
  content: (collapsedHeight: string) =>
    ({
      h: `calc(100% - ${collapsedHeight})`,
      overflowY: "auto",
      px: "18px",
      pt: "22px",
      pb: "32px",
    }) as const,
} as const;

function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <Icon
      viewBox="0 0 24 24"
      boxSize="18px"
      aria-hidden="true"
      {...styles.chevron(isExpanded)}
    >
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.4"
      />
    </Icon>
  );
}

export function ExpandableInfoBar({
  collapsedHeight = "56px",
  defaultItemId,
  expandedMaxWidth = "min(100%, 460px)",
  items,
  topOffset = 64,
}: ExpandableInfoBarProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeItemId, setActiveItemId] = useState(
    defaultItemId ?? items[0]?.id ?? "",
  );
  const [expandedTop, setExpandedTop] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const activeId = useMemo(() => {
    const hasActiveItem = items.some((item) => item.id === activeItemId);

    if (hasActiveItem) {
      return activeItemId;
    }

    return defaultItemId ?? items[0]?.id ?? "";
  }, [activeItemId, defaultItemId, items]);
  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded((current) => {
      if (!current) {
        setExpandedTop(
          rootRef.current?.getBoundingClientRect().top ?? topOffset,
        );
      }

      return !current;
    });
  };

  const selectItem = (itemId: string) => {
    if (itemId === activeId) {
      return;
    }

    setActiveItemId(itemId);
    setIsExpanded(false);
  };

  if (!activeItem) {
    return null;
  }

  return (
    <Box
      ref={rootRef}
      {...styles.root(
        isExpanded,
        expandedTop,
        collapsedHeight,
        expandedMaxWidth,
        topOffset,
      )}
      aria-live="polite"
    >
      <Flex {...styles.summaryRow(collapsedHeight)}>
        <Flex
          as="button"
          type="button"
          aria-expanded={isExpanded}
          aria-label={
            isExpanded
              ? `Zbaliť obsah: ${activeItem.label}`
              : `Rozbaliť obsah: ${activeItem.label}`
          }
          onClick={toggleExpanded}
          {...styles.summaryButton}
        >
          <ChevronIcon isExpanded={isExpanded} />
          <Text as="span" {...styles.summaryText}>
            {activeItem.collapsedContent}
          </Text>
        </Flex>

        <HStack {...styles.iconList}>
          {items.map((item) => {
            const isSelected = item.id === activeItem.id;

            return (
              <IconButton
                key={item.id}
                aria-label={`Zobraziť obsah: ${item.label}`}
                aria-pressed={isSelected}
                icon={item.icon}
                onClick={() => selectItem(item.id)}
                {...styles.iconButton(isSelected)}
              />
            );
          })}
        </HStack>
      </Flex>

      <Box {...styles.content(collapsedHeight)}>
        {activeItem.expandedContent}
      </Box>
    </Box>
  );
}
