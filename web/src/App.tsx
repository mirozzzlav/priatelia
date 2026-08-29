import { Box, Heading, Text } from "@chakra-ui/react";
import { appConfig } from "src/config.js";

export default function App() {
  return (
    <Box minH="100vh" bg="app.base" color="app.white" px="24px" py="32px">
      <Heading as="h1" size="xl">
        {appConfig.name}
      </Heading>
      <Text mt="12px">Základ React aplikácie je pripravený.</Text>
    </Box>
  );
}
