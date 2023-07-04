
import { useRef, useState, useEffect } from "react";
import { getSession } from "next-auth/react";

import Header from '@/components/Header';
import Message from '@/components/Message';
import Prompt from '@/components/Prompt';

export default function Stack({stack, stackKey}) {
    const [messages, setMessages] = useState([]);
    const chatRef = useRef(null);
    const baseUrl = "https://democratic-inputs-to-ai-3bv6.vercel.app";

    /* useEffect(() => {
        const cleanChatHistory = async () => {
          await fetch("/api/completion", {method: "DELETE"});
        }
        cleanChatHistory();
    }, []);  */  // Consider when you want to clear the chat history

    const onSubmit = async (prompt) => {
        if (prompt.trim().length === 0) {
          return;
        }
    
        setMessages((messages) => [
          ...messages,
          {
            id: new Date().toISOString(),
            author: "human",
            avatar: "https://thrangra.sirv.com/Avatar2.png",
            text: prompt
          }
        ]);

        const response = await fetch(`${baseUrl}/api/completion?stack=${stackKey}`, {
            method: "POST",
            body: JSON.stringify({prompt}),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
          const json = await response.json();
          setMessages((messages) => [
            ...messages,
            {
              id: new Date().toISOString(),
              author: "ai",
              avatar: "/logo-open-ai.png",
              text: json.result
            }
          ]);
        } else {
          console.error("Response not OK"); // Modify this line to handle errors as you see fit
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
                  <div ref={el => {
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                    }
                  }} />
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
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    try {
        const baseUrl = "https://democratic-inputs-to-ai-3bv6.vercel.app";
        const res = await fetch(`${baseUrl}/data/stacks.json`);

        if (!res.ok) {
            console.error(`Error: HTTP ${res.status}`);
            const text = await res.text();
            console.error(`Response text: ${text}`);
            throw new Error('Network response was not ok');
        }

        let stacks;
        try {
            stacks = await res.json();
        } catch(e) {
            console.error(`Error parsing JSON response: ${e}`);
            const text = await res.text();
            console.error(`Response text: ${text}`);
            throw e;
        }

        return {
            props: {
                stack: stacks[context.params.stack],
                stackKey: context.params.stack,
            },
        };

    } catch (error) {
        console.error(`Fetch Error: ${error}`);

        return {
            redirect: {
                destination: '/error',
                permanent: false,
            },
        };
    }
}