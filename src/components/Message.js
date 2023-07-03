
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function Message({text: initialText, avatar, idx, author}) {
    const [text, setText] = useState(author === "ai" ? "" : initialText);
    const messageEndRef = useRef(null);
    const blinkingCursorClass = initialText.length === text.length ? "" : "blinking-cursor";
    const bgColorClass = idx % 2 === 0 ? "bg-slate-100" : "bg-slate-200";
  
    useEffect(() => {
        const timeout = setTimeout(() => {
        setText(initialText.slice(0, text.length + 1));
      }, 1);
      return () => clearTimeout(timeout);
    }, [initialText, text]);
  
    useEffect(() => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [text]);

    return (
        <motion.div 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`w-full flex flex-row ${bgColorClass} p-4 border-b border-gray-200 shadow-sm transition-all scrollbar-hidden`}>
            <div className="w-[50px] relative">
                <Image 
                    src={avatar}
                    width={30}
                    height={30}
                    alt=""
                    className="rounded-md"
                />
            </div>
            <div className="w-full mt-auto mb-auto">
                <div 
                    className={`${blinkingCursorClass} text-black-700 font-medium text-lg`} 
                    style={{ fontFamily: "Roboto", fontSize: 16 }}>
                    {text}
                </div>
            </div>
            <div ref={messageEndRef} />
        </motion.div>
    )
}