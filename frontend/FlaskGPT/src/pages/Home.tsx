import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import { UserContext } from "../context/User";
import Sidenavbar from "../components/Sidenavbar";
import { Icon } from "@iconify/react";
import { ChatContext } from "../context/Chats";
import Messages from "../components/HeroSection/components/Messages";
import Searchbar from "../components/HeroSection/components/Searchbar";
import Chatbar from "../components/HeroSection/components/Chatbar";
import Pdfviewer from "../components/HeroSection/components/Pdfviewer";
import Prompt from "../components/Prompt";
import HeroSection from "../components/HeroSection";

const Home: React.FC = () => {
  const usercontext = useContext(UserContext);
  const chatcontext = useContext(ChatContext);
  const [screenWidth, setScreenWidth] = useState("");

  useEffect(() => {
    if (!chatcontext?.id) {
      chatcontext?.createChatId();
    }
    console.log(chatcontext?.id);
  }, [chatcontext?.id, chatcontext?.createChatId]);

  useEffect(() => {
    if (chatcontext?.sideNav) {
      setScreenWidth("70vw");
    } else {
      setScreenWidth("90vw");
    }
  }, [chatcontext?.sideNav]);

  return (
    <div className="relative bg-slate-900 h-screen w-screen flex flex-col items-center justify-center">
      {chatcontext?.message && chatcontext?.activePrompt === false ? (
        <span className="absolute shadow p-1 mb-auto font-medium bg-purple-600 text-white">
          {chatcontext.message}
        </span>
      ) : null}

      {usercontext?.login === false ? (
        <div className="h-screen w-screen flex md:flex-row items-center">
          <Sidenavbar />
          <div className="h-screen w-screen p-3 flex flex-col gap-5 items-center">
            <div className="h-max p-3 w-screen md:w-[100%] flex flex-row items-center justify-evenly">
              <Searchbar />
              {/* <Icon
                className="lg:h-max md:h-max h-[4vh] cursor-pointer"
                height={"3rem"}
                color="white"
                icon="solar:logout-outline"
                onClick={() => {
                  usercontext.dispatch({ type: "LOGOUT" });
                }}
              /> */}
              <Icon
                onClick={() =>
                  chatcontext?.setActivePrompt(!chatcontext?.activePrompt)
                }
                className="cursor-pointer"
                icon="mingcute:save-fill"
                height="2rem"
                color="orange"
              />
            </div>
            <div
              className={`md:h-[60vh] h-[80vh] w-screen md:w-[${screenWidth}] flex flex-col items-center justify-between gap-5 overflow-y-scroll overflow-x-hidden`}
            >
              {chatcontext?.activePrompt === true ? <Prompt /> : null}

              {chatcontext?.showPdf && chatcontext?.selectedFile ? (
                <div className="h-[50vh] overflow-cover w-full flex justify-center items-center">
                  <Pdfviewer file={chatcontext.selectedFile} />
                </div>
              ) : null}
              {chatcontext?.chat?.file !== null &&
              chatcontext?.chatArray &&
              chatcontext.chatArray.length > 0 ? (
                <Messages question="" response={chatcontext.chatArray} />
              ) : (
                <span className="h-screen flex justify-center items-center w-screen md:w-[70vw] text-white text-3xl font-semibold p-2 text-center">
                  <p>Start your conversation with your AI companion.</p>
                </span>
              )}
            </div>
            <Chatbar />
          </div>
        </div>
      ) : (
        <>
          <Header />
          <HeroSection />
        </>
      )}
    </div>
  );
};

export default Home;
