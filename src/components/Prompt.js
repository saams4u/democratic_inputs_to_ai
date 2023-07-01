
import { useState } from "react";

export default function Prompt({onSubmit}) {
    const [promptInput, setPromptInput] = useState("");

    return (
        <textarea 
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    onSubmit(promptInput);
                    setPromptInput("");
                }
            }}
            rows="4"
            className="w-full ml-44 mr-44 p-2.5 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{ fontSize: 16, fontFamily: "Roboto, sans-serif" }} 
            placeholder="Write your prompt here..."
            value={promptInput}
        />
    )
}