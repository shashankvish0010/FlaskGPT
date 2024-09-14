import React from "react";

const HeroSection: React.FC = () => {
  return (
    <div className="h-max w-screen p-3 flex-col items-center justify-center text-white">
      <span className="w-[90vw] text-3xl font-semibold p-2 text-center">
        <p>
          Unlock Meaningful Conversations Anytime, Anywhere with Our Reliable AI
          Companion
        </p>
      </span>
      <div className="h-max flex text-2xl justify-evenly font-medium">
        <span className="bg-green-400 h-max w-max p-2 rounded-xl shadow">
          ChatGPT3
        </span>
        <span className="bg-green-400 h-max w-max p-2 rounded-xl shadow">
          ChatGPT4
        </span>
      </div>
      <div className="h-[30vh] flex justify-center items-center mt-5">
        <div className="bg-purple-600 p-3 w-max cursor-pointer font-medium text-white text-xl rounded-full text-center">
          Get Started for FREE!
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
