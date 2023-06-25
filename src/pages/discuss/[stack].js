
import stacks from "@/data/stacks.json";
import { useEffect, useRef, useState } from "react";

import Header from '@/components/Header';
import Message from '@/components/Message';
import Prompt from '@/components/Prompt';

export default function Stack({stack, stackKey}) {
    const [messages, setMessages] = useState([]);
    const chatRef = useRef(null);

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
                    avatar: "https://thrangra.sirv.com/Avatar2.png",
                    text: prompt
                }
            ]
        });

        const response = await fetch("/api/completion", {
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
            <hr className="my-4" />
            <div ref={chatRef} className="chat flex flex-col h-full overflow-scroll">
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

export async function getStaticPaths() {
    const paths = Object.keys(stacks).map((key) => ({params: {stack: key}}));

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({params}) {
    return {
        props: {
            stack: stacks[params.stack],
            stackKey: params.stack
        }
    }
}