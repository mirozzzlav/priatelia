import { Flex, type FlexProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

type SurfacePillProps = Omit<FlexProps, "children"> & {
  children: ReactNode;
};

const styles = {
  root: {
    align: "center",
    justify: "center",
    w: "fit-content",
    maxW: "100%",
    px: "10px",
    py: "5px",
    border: "1px solid",
    borderColor: "app.white",
    borderRadius: "999px",
    bg: "rgba(255, 255, 255, 0.92)",
    boxShadow: "0 8px 20px rgba(53, 87, 45, 0.08)",
  },
} as const;

export function SurfacePill({ children, ...props }: SurfacePillProps) {
  return (
    <Flex {...styles.root} {...props}>
      {children}
    </Flex>
  );
}
