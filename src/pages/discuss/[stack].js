
import { useRef, useState, useEffect } from "react";
import { getSession } from "next-auth/react";

import Header from '@/components/Header';
import Message from '@/components/Message';
import Prompt from '@/components/Prompt';

import useUser from "@/hooks/useUser";

export default function Stack({stack, stackKey}) {
    const [messages, setMessages] = useState([]);
    const [activeSession, setActiveSession] = useState("");
    const {user} = useUser();
    const chatRef = useRef(null);

    useEffect(() => {
        const cleanChatHistory = async () => {
            await fetch("/api/completion", {method: "DELETE"});
        }
        cleanChatHistory();
    }, []);

    useEffect(() => {
        if (user) {
          setActiveSession(user.uid);
        }
    }, [user]);

    useEffect(() => {
        chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
    }, [messages]);

    const onSubmit = async(prompt) => {
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

        try {
            const response = await fetch(`/api/completion?stack=${stackKey}`, {
                method: "POST",
                body: JSON.stringify({prompt}),
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
            } else {
                console.log('Response was not OK, or was empty.');
            }

        } catch (error) {
            console.error(error);
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
    const session = await getSession(context);
    
    if (!session) {
        context.res.writeHead(302, {
            Location: '/login',
        });
        context.res.end();
    }
    
    const baseUrl = "https://democratic-inputs-to-ai-3bv6.vercel.app";

    const res = await fetch(`${baseUrl}/data/stacks.json`);
    const stacks = await res.json();

    return {
        props: {
            stack: stacks[context.query.stack],
            stackKey: context.query.stack
        },
    }
}