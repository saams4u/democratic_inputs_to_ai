
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

    const onSubmit = async (prompt) => {
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
    
        const response = await fetch(`/api/completion?stack=${stackKey}`, {
            method: "POST",
            body: JSON.stringify({prompt}),
            headers: {
            "Content-type": "application/json"
            }
        });
            
        if (response.ok) {
          const json = await response.json();
          setMessages((messages) => {
            return [
              ...messages,
              {
                id: new Date().toISOString(),
                author: "ai",
                avatar: "/logo-open-ai.png",
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
        const res = await fetch('/api/stacks', {method: "GET"});
        
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const stacksData = await res.json();
        
        const stacks = stacksData.reduce((obj, stack) => {
          obj[stack.key] = stack;
          return obj;
        }, {});

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