import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import App from "src/App";
import { appConfig } from "src/config.js";
import { theme } from "src/theme";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

document.title = appConfig.name;

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </StrictMode>,
);
