import { useState } from "react";
import { motion } from "framer-motion";

export default function Prompt({ onSubmit, disabled }) {
    const [promptInput, setPromptInput] = useState("");

    const handleButtonClick = () => {
        if (!disabled) {
            onSubmit(promptInput);
            setPromptInput("");
        }
    };

    return (
        <div className="relative ml-auto mr-auto w-5/6 p-4"> 
            <textarea 
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !disabled) {
                        e.preventDefault();
                        onSubmit(promptInput);
                        setPromptInput("");
                    }
                }}
                rows="3"
                className="w-full p-4 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                style={{ fontSize: 18, fontFamily: "Roboto, sans-serif", paddingRight: "90px" }} 
                placeholder="Write your prompt here..."
                value={promptInput}
                disabled={disabled ? "disabled" : ""}
            />
            <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleButtonClick} 
                className={`absolute mt-6 mb-6 ml-6 mr-6 right-6 bottom-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-full disabled:bg-gray-500 ${!disabled ? 'animate' : ''}`}
                style={{ fontFamily: "Roboto", fontSize: 18, transition: 'all 0.3s ease' }}
                disabled={disabled}>
                <img 
                    src="/upload.png"
                    alt="Submit"
                    style={{ width: "24px", height: "24px" }}
                />
            </motion.button>
        </div>
    );
}
