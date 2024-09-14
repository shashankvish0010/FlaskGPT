import React, { useContext } from "react";
import { ChatContext } from "../../../context/Chats";

interface MessagesType {
  question: string;
  response: any[];
}

const Messages: React.FC<MessagesType> = (props: MessagesType) => {
  const chatcontext = useContext(ChatContext);
  const { question, response } = props;
  return (
    <div className="h-max w-[80vw] md:w-[70vw] flex flex-col gap-5 p-3 text-white">
      <div
        className="bg-orange-600 h-[2rem] ml-[50vw] w-max text-white font-semibold text-sm p-2 rounded cursor-pointer"
        onClick={chatcontext?.togglePdfView}
      >
        {chatcontext?.selectedFile?.name}
      </div>
      <span className="h-max w-[80vw] md:w-[60vw] text-base font-medium">
        <p className="w-[80vw] md:w-[60vw]">{question}</p>
      </span>
      {response.map((data: any) => (
        <span className="h-max w-[80vw] md:w-[60vw] text-base">
          {data.title !== data.content && (
            <p className="w-[80vw] md:w-[60vw]">{data.title}</p>
          )}
          {data.content && (
            <p className="w-[80vw] md:w-[60vw]">{data.content}</p>
          )}
        </span>
      ))}
      <span className="w-[90%] h-[.05rem] rounded-md bg-white"></span>
    </div>
  );
};

export default Messages;
