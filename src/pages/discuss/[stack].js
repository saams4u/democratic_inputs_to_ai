
import stacks from "@/data/stacks.json";
import { useEffect, useRef, useState } from "react";
import { getSession } from "next-auth/react";

import Header from '@/components/Header';
import Message from '@/components/Message';
import Prompt from '@/components/Prompt';

export default function Stack({stack, stackKey}) {
    const [messages, setMessages] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const [regenerate, setRegenerate] = useState(false);
    const [isTyping, setIsTyping] = useState(false); 
    const [key, setKey] = useState(0);  // Add this state to your component
    const chatRef = useRef(null);

    const onSubmit = async(prompt) => {
        if (prompt.trim().length === 0 || isTyping) { 
            return;
        }

        setIsTyping(true); 

        setMessages((messages) => [
            ...messages,
            {
                id: new Date().toISOString(),
                author: "human",
                avatar: "https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png",
                text: prompt
            }
        ]);

        const response = await fetch(`/api/completion?stack=${stackKey}`, {
            method: "POST",
            body: JSON.stringify({
                href: window.location.href,
                prompt
            }),
            headers: {
                "Content-type": "application/json"
            }
        });

        const json = await response.json();
        
        if (response.ok) {
            setMessages((messages) => [
                ...messages,
                {
                    id: new Date().toISOString(),
                    author: "ai",
                    avatar: "/logos/openai.png",
                    text: json.result
                }
            ]);
            setIsTyping(false); 
        } else {
            console.error(json?.error?.message);
        }
    }

    const onStop = () => {
        setIsPaused(prevIsPaused => !prevIsPaused);
    };
    
    const unpauseChat = () => {
        setKey(prevKey => prevKey + 1); // Increment the key when unpausing
    };    
    
    const onRegenerate = async () => {
        setRegenerate(true);
        setIsPaused(false);

        const response = await fetch(`/api/regenerate?stack=${stackKey}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            }
        });

        const json = await response.json();
        
        if (response.ok) {
            setMessages([]); // Clear existing messages
            setMessages((messages) => {
                return [
                    ...messages,
                    {
                        id: new Date().toISOString(),
                        author: "ai",
                        avatar: "/logos/openai.png",
                        text: json.result
                    }
                ]
            });
        } else {
            console.error(json?.error?.message);
        }

        setRegenerate(false);
    }

    return (
        <div className="h-full flex flex-col">
            <Header logo={stack.logo} name={stack.name} topic={stack.topic} />
            <div ref={chatRef} className="chat pl-44 pr-44 p-4 flex flex-col h-full overflow-scroll">
                { messages.length === 0 && 
                    <div className="bg-yellow-200 p-4 mt-4 ml-auto mr-auto rounded-xl" style={{ fontFamily: "Roboto", fontSize: 18 }}>
                        No messages yet. Ask about this topic, suggest a proposal, or inquire about our clusters...
                    </div>
                }
                {messages.map((message, i) => 
                    <Message
                        key={message.id}
                        idx={i}
                        author={message.author}
                        avatar={message.avatar}
                        text={message.text}
                        paused={isPaused && message.author === 'ai'}
                        regenerate={regenerate}
                        keyProp={key} // Pass the key to Message
                        onTypingDone={() => {
                            if (message.author === 'ai') {
                                setIsTyping(false);
                                if (isPaused) {
                                    unpauseChat();
                                } 
                            }
                        }}                        
                    />
                )}
            </div>
            <div className="flex p-4">
                <Prompt 
                    onSubmit={onSubmit}
                    disabled={isTyping} // Disable the prompt while typing
                />
            </div>
            {/* <div className="flex p-4 justify-center">
                <button onClick={onStop} className={`p-2 m-2 ${isPaused ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {isPaused ? 'Resume typing' : 'Pause typing'}
                </button>
                <button onClick={onRegenerate} className="p-2 m-2 bg-green-500 text-white">Regenerate</button>
            </div> */}
        </div>
        )
    }

export async function getServerSideProps(context) {
    const session = await getSession(context)
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }
    return {
        props: {
            stack: stacks[context.params.stack],
            stackKey: context.params.stack
        }
    }
}