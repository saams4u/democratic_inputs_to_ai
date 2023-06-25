
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Message({text: initialText, avatar, idx, author}) {

    const [text, setText] = useState(author === "ai" ? "" : initialText);
    const bgColorClass = idx % 2 === 0 ? "bg-slate-100" : "bg-slate-200";

    useEffect(() => {
        const timeout = setTimeout(() => {
            setText(initialText.slice(0, text.length + 1));
        }, 10);

        return () => clearTimeout(timeout);
    }, [initialText, text]);

    const blinkingCursorClass = initialText.length === text.length ? "" : "blinking-cursor";

    return (
        <div className={`flex flex-row ${bgColorClass} p-4`}>
            <div className="w-[30px] relative mr-4">
                <Image 
                    src={avatar}
                    width={30}
                    height={30}
                    alt=""
                    style={{ borderRadius: '5px' }}
                />
            </div>
            <div className="w-full">
                <div className={blinkingCursorClass}>
                    {text}
                </div>
            </div>
        </div>
    )
}