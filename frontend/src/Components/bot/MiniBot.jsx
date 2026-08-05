import { motion } from "framer-motion";

export const MiniBot = ({ step, errors }) => {
  const defaultMessages = {
    1: "Hey! Let's name your project 💜",
    2: "Pick your tech stack 🚀",
    3: "Where will your data live?",
    4: "Time to connect the database 🔐",
    5: "Final touches! Almost done ✨",
  };

  const errorMessage = errors && Object.values(errors)[0];
  const message = errorMessage || defaultMessages[step];

  return (
    <motion.div
      key={message}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4 p-4 max-w-sm"
    >
      <div className="relative w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-[blink_4s_infinite]" />
          <div className="w-2 h-2 bg-white rounded-full animate-[blink_4s_infinite_0.1s]" />
        </div>
        <div className="absolute bottom-3 w-4 h-2 border-b-2 border-white rounded-full" />
      </div>

      <div
        className={`relative bg-white p-3 rounded-2xl shadow-md text-sm ${
          errorMessage ? "text-red-500 font-semibold" : "text-gray-800"
        }`}
      >
        <span className="absolute left-[-6px] top-4 w-0 h-0 
          border-t-8 border-b-8 border-r-8 
          border-t-transparent border-b-transparent border-r-white" />
        {message}
      </div>
    </motion.div>
  );
};
