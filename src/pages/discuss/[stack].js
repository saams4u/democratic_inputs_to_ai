
import Header from '@/components/Header';
import Message from '@/components/Message';
import Prompt from '@/components/Prompt';
import useUser from '@/hooks/useUser';

import { useRef, useState, useEffect } from "react";
import { getSession, applySession } from 'next-iron-session';

export default function Stack({stack, stackKey}) {

    const [messages, setMessages] = useState([]);    
    const [activeSession, setActiveSession] = useState("");
    const { user } = useUser();

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
    
        try {
            const response = await fetch(`/api/completion?stack=${stackKey}`, {
                method: "POST",
                body: JSON.stringify({prompt}),
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
    
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
        } catch (e) {
            console.error(e);
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
    await applySession(context.req, context.res, {
        password: process.env.SECRET_COOKIE_PASSWORD,
        cookieName: "user-session",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
            ttl: 60 * 60 * 24 // 24 hours
        },
    });

    const session = await getSession(context.req);
    
    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  
    try {
      const res = await fetch(`/data/stacks.json`);
  
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
          destination: `/error?message=${encodeURIComponent(error.message)}`,
          permanent: false,
        },
      };
    }
}