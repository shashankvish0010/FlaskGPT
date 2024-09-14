import React, { useContext } from "react";
import logo from "../assets/1681039084chatgpt-icon.webp";
import { UserContext } from "../context/User";
import { Icon } from "@iconify/react";

const Header: React.FC = () => {
  const usercontext = useContext(UserContext);
  return (
    <div className="bg-slate-900 h-[20vh] w-screen md:p-[5rem] p-3 flex items-center justify-between">
      <div className="h-max w-max p-3 flex items-center gap-3">
        <img
          className="md:block hidden"
          src={logo}
          alt="chatGPTLogo"
          width="100px"
        />
        <img
          className="md:hidden block"
          src={logo}
          alt="chatGPTLogo"
          width="70px"
        />
        <p className="text-2xl text-white font-semibold">Chat GPT</p>
      </div>
      {usercontext?.login == true ? (
        <Icon
          className="lg:h-max md:h-max h-[4vh] cursor-pointer"
          height={"6vh"}
          icon="solar:logout-outline"
          onClick={() => {
            usercontext.dispatch({ type: "LOGOUT" });
          }}
        />
      ) : (
        <div className="bg-purple-600 cursor-pointer p-2 w-[8rem] font-medium text-white text-xl rounded-full text-center">
          Sign Up
        </div>
      )}
    </div>
  );
};

export default Header;
