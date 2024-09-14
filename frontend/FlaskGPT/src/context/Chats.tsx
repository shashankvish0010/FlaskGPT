import { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Contextvalue {
  id: string;
  createChatId: () => void;
  message: string | undefined;
  activePrompt: boolean;
  setActivePrompt: any;
  chatArray: string[] | undefined;
  prompt: any;
  chatquery: queryType;
  setChatquery: any;
  chat: ChatType;
  selectedFile: File | null;
  handlepromptChange: () => void;
  handleAddPrompt: () => void;
  handleSearch: () => void;
  handleChange: () => void;
  handleSubmit: () => void;
  handleFileSelect: () => void;
  togglePdfView: () => void;
  sideNav: boolean;
  showPdf: boolean;
  setSideNav: any;
}

interface ChatType {
  question: string;
  file: File | null;
}

interface queryType {
  query: "";
}

export const ChatContext = createContext<Contextvalue | null>(null);

export const ChatProvider = (props: any) => {
  const [id, setId] = useState<string>("");
  const [chatArray, setchatArray] = useState<string[]>();
  const [activePrompt, setActivePrompt] = useState<boolean>(false);
  const [sideNav, setSideNav] = useState(true);

  const [chat, setChat] = useState<ChatType>({
    question: "",
    file: null,
  });
  const [prompt, setPrompt] = useState<any>({
    prompt_name: "",
    promptq: "",
  });
  const [chatquery, setChatquery] = useState<any>({
    query: "",
  });
  const [message, setMessage] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPdf, setShowPdf] = useState<boolean>(false);

  const createChatId = () => {
    setId(uuidv4());
  };

  const togglePdfView = () => {
    setShowPdf((prev) => !prev);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(null);
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setShowPdf(false);
    }
  };

  const handleAddPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    const { prompt_name, promptq } = prompt;
    console.log(prompt_name, promptq);
    try {
      const response = await fetch("http://localhost:5000/save/prompt/" + id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt_name,
          promptq,
        }),
      });
      if (response) {
        const data = await response.json();
        if (data.success == true) {
          console.log(data);

          setMessage(data.message);
          setActivePrompt(false);
        } else {
          setActivePrompt(false);
          setMessage(data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChat((prevChat) => ({
      ...prevChat,
      [name]: value,
    }));
  };

  const handlepromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt((prevPrompt: any) => ({
      ...prevPrompt,
      prompt_name: e.target.value,
      promptq: chat.question,
    }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const { query } = chatquery;
    try {
      const response = await fetch(
        "http://localhost:5000/chat/search/" + usercontext?.curruser?._id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        }
      );
      if (response) {
        const data = await response.json();
        if (data.success == true) {
          setchatArray(data.searchArray);
        } else {
          setMessage(data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { question } = chat;
    if (selectedFile) {
      setChat({
        question,
        file: selectedFile,
      });
    }
    id ? null : createChatId();
    try {
      const formData = new FormData();
      selectedFile && formData.append("pdf", selectedFile);
      const response = await fetch(
        // "/chat/ai/" + usercontext?.curruser?._id + "/" + id,
        "http://localhost:5000/uploadFile",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response) {
        const data = await response.json();
        if (data.success == true) {
          setchatArray(data.text);
        } else {
          setMessage(data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const info = {
    id,
    createChatId,
    message,
    activePrompt,
    setActivePrompt,
    sideNav,
    setSideNav,
    chatArray,
    chat,
    prompt,
    chatquery,
    selectedFile,
    showPdf,
    setChatquery,
    handlepromptChange,
    handleAddPrompt,
    handleChange,
    handleSearch,
    handleSubmit,
    handleFileSelect,
    togglePdfView,
  };

  return (
    <ChatContext.Provider value={info}>{props.children}</ChatContext.Provider>
  );
};
