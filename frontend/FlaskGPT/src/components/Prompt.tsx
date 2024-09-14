import React, { useContext } from "react";
import { ChatContext } from "../context/Chats";

const Prompt: React.FC = () => {
  const chatcontext = useContext(ChatContext);
  return (
    <div className="absolute bg-slate-800 w-max h-max flex flex-col justify-evenly gap-5 p-5 shadow-md rounded-md">
      <h1 className="text-2xl font-semibold text-white">Save Prompt</h1>
      <span className="w-[100%] h-[0.2rem] bg-purple-600 rounded"></span>
      <form
        method="POST"
        className="flex flex-col justify-around items-center gap-3"
      >
        <span className="flex flex-col gap-1">
          <p className="text-sm text-white">Prompt Name</p>
          <input
            className="px-2 h-[2.25rem] w-[65vw] md:w-[35vw] border rounded"
            type="text"
            name="prompt_name"
            value={chatcontext?.prompt?.prompt_name}
            onChange={chatcontext?.handlepromptChange}
          />
        </span>
        <span className="flex flex-col gap-1">
          <p className="text-sm text-white">Prompt</p>
          <input
            className="px-2 h-[2.25rem] w-[65vw] md:w-[35vw] border rounded"
            type="text"
            name="promptq"
            value={chatcontext?.chat?.question}
          />
        </span>
      </form>
      <span className="w-[100%] flex items-center justify-evenly"></span>
      <button
        onClick={chatcontext?.handleAddPrompt}
        className="bg-purple-600 p-2 font-medium text-white rounded"
      >
        Save
      </button>
    </div>
  );
};

export default Prompt;
