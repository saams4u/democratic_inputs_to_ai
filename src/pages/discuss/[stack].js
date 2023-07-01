
import stacks from "@/data/stacks.json";
import { useEffect, useRef, useState } from "react";
import { getSession } from "next-auth/react";

import Header from '@/components/Header';
import Message from '@/components/Message';
import Prompt from '@/components/Prompt';

export default function Stack({stack, stackKey}) {
    const [messages, setMessages] = useState([]);
    const chatRef = useRef(null);

    useEffect(() => {
        const cleanChatHistory = async () => {
            await fetch("/api/completion", {method: "DELETE"});
        }
        cleanChatHistory();
    }, []);

    useEffect(() => {
        chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
    }, [messages]);

    const onSubmit = async(prompt) => {
        debugger
        if (prompt.trim().length === 0) {
            return;
        }

        setMessages((messages) => {
            return [
                ...messages,
                {
                    id: new Date().toISOString(),
                    author: "human",
                    avatar: "https://upload.wikimedia.org/wikipedia/commons/7/70/User_icon_BLACK-01.png",
                    text: prompt
                }
            ]
        });

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
    }

    return (
        <div className="h-full flex flex-col">
            <Header logo={stack.logo} name={stack.name} topic={stack.topic} />
            <div ref={chatRef} className="chat pl-44 pr-44 p-4 flex flex-col h-full overflow-scroll">
                { messages.length === 0 && 
                    <div className="bg-yellow-200 p-4 mr-auto rounded-xl">
                        No messages yet. Ask about this topic...
                    </div>
                }
                { messages.map((message, i) => 
                  <Message
                    key={message.id}
                    idx={i}
                    author={message.author}
                    avatar={message.avatar}
                    text={message.text}
                  />
                )}
            </div>
            <div className="flex p-4">
                <Prompt 
                    onSubmit={onSubmit}
                />
            </div>
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