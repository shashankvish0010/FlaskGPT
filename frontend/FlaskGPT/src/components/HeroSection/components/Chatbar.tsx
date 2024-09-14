import React, { useContext } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChatContext } from "../../../context/Chats";

const Chatbar: React.FC = () => {
  const chatcontext = useContext(ChatContext);

  return (
    <div className="mt-auto mb-5 p-3 h-max w-screen md:w-[100%] flex flex-col items-center justify-center">
      {chatcontext?.selectedFile && chatcontext?.chat?.file === null ? (
        <div className="bg-slate-700 px-6 py-3 w-full h-max max-w-[80vw] md:max-w-[50vw] rounded-md flex-col space-x-3">
          <div
            className="bg-orange-600 h-[2rem] w-max text-white font-semibold text-sm p-2 rounded cursor-pointer ml-3"
            onClick={chatcontext?.togglePdfView}
          >
            {chatcontext?.selectedFile.name}
          </div>
          <div className="w-full p-2 max-w-[80vw] md:max-w-[50vw] rounded-full flex items-center space-x-3">
            <Icon
              onClick={() => document.getElementById("fileInput")?.click()}
              className="cursor-pointer"
              icon="icon-park-solid:add"
              height="2rem"
              color="yellow"
            />

            <input
              id="fileInput"
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={chatcontext?.handleFileSelect}
            />
            <input
              className="bg-slate-700 placeholder:text-gray-400 w-full placeholder:font-semibold focus-visible:outline-none text-white px-4 py-2 rounded-full flex-grow"
              type="text"
              placeholder="Messages to ChatGPT"
              name="question"
              value={chatcontext?.chat?.question}
              onChange={chatcontext?.handleChange}
            />
            <Icon
              onClick={chatcontext?.handleSubmit}
              className="cursor-pointer"
              icon="ic:baseline-send"
              height="2rem"
              color="lightgreen"
            />
          </div>
        </div>
      ) : (
        <div className="bg-slate-700 px-4 py-2 w-full h-max max-w-[80vw] md:max-w-[50vw] rounded-full flex-col space-x-3">
          <div className="w-full max-w-[80vw] md:max-w-[50vw] rounded-full flex items-center space-x-3">
            <Icon
              onClick={() => document.getElementById("fileInput")?.click()}
              className="cursor-pointer"
              icon="icon-park-solid:add"
              height="2rem"
              color="yellow"
            />

            <input
              id="fileInput"
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={chatcontext?.handleFileSelect}
            />
            <input
              className="bg-slate-700 placeholder:text-gray-400 w-full placeholder:font-semibold focus-visible:outline-none text-white px-4 py-2 rounded-full flex-grow"
              type="text"
              placeholder="Messages to ChatGPT"
              name="question"
              value={chatcontext?.chat?.question}
              onChange={chatcontext?.handleChange}
            />
            <Icon
              onClick={chatcontext?.handleSubmit}
              className="cursor-pointer"
              icon="ic:baseline-send"
              height="2rem"
              color="lightgreen"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbar;
