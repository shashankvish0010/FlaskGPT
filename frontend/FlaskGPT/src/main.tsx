import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { UserauthProvider } from "./context/User";
import { ChatProvider } from "./context/Chats";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserauthProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </UserauthProvider>
  </React.StrictMode>
);
