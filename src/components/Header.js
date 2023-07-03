
import Image from "next/image";
import { motion } from "framer-motion";

export default function Header({ logo, name, topic }) {
  return (
    <div className="w-full header flex items-center justify-between bg-gradient-to-r from-purple-500 via-blue-500 to-green-400 p-6">
      <motion.div 
        whileHover={{ scale: 1.0 }}
        className="flex-grow-0 flex-shrink-0"
      >
        <Image
          title={name}
          src={logo}
          width={110} // slightly smaller logo
          height={110} 
          alt={name}
          className="rounded-xl p-0 mt-8 ml-36 shadow-custom" // round image and add padding, apply custom shadow class
        />
      </motion.div>
      <div
        className="font-bold mt-8 ml-auto mr-auto pr-44 text-center px-4 my-2 text-xl leading-7 max-w-5xl text-white flex-grow mx-4" 
        style={{ fontFamily: "Roboto", fontSize: 20 }} // slightly larger text
      >
        {topic}
      </div>
      <div className="flex-grow-0 flex-shrink-0"></div>
    </div>
  );
}
