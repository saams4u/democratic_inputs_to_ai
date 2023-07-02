
import Image from "next/image";
import { motion } from "framer-motion";

export default function Header({ logo, name, topic }) {
  return (
    <div className="w-full header flex items-center justify-between bg-gradient-to-r from-purple-500 via-blue-500 to-green-400 p-6">
      <motion.div 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Image
          title={name}
          src={logo}
          width={150} // slightly smaller logo
          height={150} 
          alt={name}
          className="rounded-full p-4 mt-8 ml-11 cursor-pointer" // round image and add padding
        />
      </motion.div>
      <div
        className="font-bold ml-auto mr-auto pr-44 text-center px-4 my-2 mx-auto text-xl leading-7 max-w-5xl text-white" 
        style={{ fontFamily: "Roboto", fontSize: 22 }} // slightly larger text
      >
        {topic}
      </div>
    </div>
  );
}
