
import stacks from "@/data/stacks.json";
import { useRef, useState } from "react";
import { getSession } from "next-auth/react";

import Header from '@/components/Header';
import Message from '@/components/Message';
import Prompt from '@/components/Prompt';

export default function Stack({stack, stackKey}) {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false); 
    const chatRef = useRef(null);
    
    const baseUrl = "https://democratic-inputs-to-ai-3bv6-1kf531lwp-saams4u.vercel.app";

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

        const response = await fetch(`${baseUrl}/api/completion?stack=${stackKey}`, {
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

    return (
        <div className="h-full flex flex-col">
            <Header logo={stack.logo} name={stack.name} topic={stack.topic} />
            <div ref={chatRef} className="chat pl-44 pr-44 flex flex-col h-full overflow-scroll">
                { messages.length === 0 && 
                    <div 
                        className="bg-yellow-200 p-4 mt-4 ml-auto mr-auto rounded-xl" 
                        style={{ fontFamily: "Roboto", fontSize: 16 }}>
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
                        onTypingDone={() => {
                            if (message.author === 'ai') {
                                setIsTyping(false);
                            }
                        }}            
                    />
                )}
            </div>
            <div className="flex p-4">
                <Prompt 
                    onSubmit={onSubmit}
                    disabled={isTyping}
                />
            </div>
        </div>
        )
    }

    Stack.getInitialProps = async (context) => {
        const session = await getSession(context);
        if (!session) {
            context.res.writeHead(302, {
                Location: '/login',
            });
            context.res.end();
            return {};
        }
        return {
            stack: stacks[context.query.stack],
            stackKey: context.query.stack
        }
    }    