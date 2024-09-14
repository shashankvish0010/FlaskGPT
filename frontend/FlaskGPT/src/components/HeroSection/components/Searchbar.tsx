import React, { useContext } from "react";
import { ChatContext } from "../../../context/Chats";
import { Icon } from "@iconify/react/dist/iconify.js";

const Searchbar: React.FC = () => {
  const chatcontext = useContext(ChatContext);
  return (
    <div className="bg-slate-700 px-3 h-max w-[80vw] md:w-[40vw] rounded-full text-base flex flex-row items-center justify-between">
      <input
        className="bg-slate-700 w-[80vw] md:w-[40vw] placeholder:text-gray-400 placeholder:font-semibold focus-visible:outline-none text-white p-3 rounded-full"
        type="text"
        placeholder="Search Your Chat"
        name="query"
        value={chatcontext?.chatquery?.query}
        onChange={(e) => chatcontext?.setChatquery({ query: e.target.value })}
      />
      <Icon
        onClick={chatcontext?.handleSearch}
        className="cursor-pointer"
        icon="majesticons:search-line"
        height="1.5rem"
        color="white"
      />
    </div>
  );
};

export default Searchbar;
