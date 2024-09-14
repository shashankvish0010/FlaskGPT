import React, { useContext } from "react";
import logo from "../assets/1681039084chatgpt-icon.webp";
import { Icon } from "@iconify/react";
import { ChatContext } from "../context/Chats";

const Sidenavbar: React.FC = () => {
  const chatcontext = useContext(ChatContext);
  return chatcontext?.sideNav === true ? (
    <div className="hidden h-screen w-screen md:flex items-center justify-between">
      <div className="bg-slate-800 h-screen w-[20vw] flex flex-col gap-5 p-3">
        <div className="h-max w-max p-3 flex items-center gap-5">
          <div className="hover:cursor-pointer">
            <Icon
              onClick={() => chatcontext?.setSideNav(false)}
              icon={"lucide:sidebar-close"}
              color="white"
              height="2rem"
            />
          </div>
          <div className="flex gap-2 items-center">
            <img
              className="md:block hidden"
              src={logo}
              alt="chatGPTLogo"
              width="60px"
            />
            <p className="text-2xl text-white font-semibold">Chat GPT</p>
          </div>
        </div>
        <span className="w-[100%] h-[.155rem] rounded-md bg-white"></span>
        <div className="h-max w-[100%] text-white flex flex-col gap-5 p-3">
          {chatcontext?.chat?.question ? (
            <span className="text-2xl text-white font-semibold">
              <p>{chatcontext.chat.question.slice(0, 10)}...</p>
            </span>
          ) : chatcontext?.selectedFile && chatcontext?.chat?.file != null ? (
            <span className="text-2xl text-white font-semibold">
              <p>{chatcontext.selectedFile.name.slice(0, 10)}...</p>
            </span>
          ) : null}
          <span
            onClick={() => chatcontext?.createChatId()}
            className="flex items-center gap-3"
          >
            <Icon icon="ri:add-line" color="white" height="3rem" />
            <p className="text-xl font-medium">New Chat</p>
          </span>
          <span className="flex items-center gap-3">
            <Icon
              icon="material-symbols-light:bookmark"
              color="white"
              height="3rem"
            />
            <p className="text-xl font-medium">Saved Prompts</p>
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="hover:cursor-pointer hidden md:block h-screen w-screen p-3">
      <Icon
        onClick={() => chatcontext?.setSideNav(true)}
        icon={"lucide:sidebar-close"}
        color="white"
        height="2rem"
      />
    </div>
  );
};

export default Sidenavbar;
