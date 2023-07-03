
import { useRef, useState, useEffect } from "react";
import { getSession } from "next-auth/react";

import Header from '@/components/Header';
import Message from '@/components/Message';
import Prompt from '@/components/Prompt';

export default function Stack({stack, stackKey}) {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false); 
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

        try {
            const response = await fetch(`/api/completion?stack=${stackKey}`, {
                method: "POST",
                body: JSON.stringify({prompt}),
                headers: {
                    "Content-type": "application/json"
                }
            });
    
            const json = response.data;
        
            setMessages((messages) => [
                ...messages,
                {
                    id: new Date().toISOString(),
                    author: "ai",
                    avatar: "/logos/openai.png",
                    text: json.result
                }
            ]);
            
        } catch (error) {
            console.error(error);
            setIsTyping(false); 
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
    
    const baseUrl = "https://democratic-inputs-to-ai-3bv6.vercel.app";

    const res = await fetch(`${baseUrl}/data/stacks.json`);
    const stacks = await res.json();

    return {
        stack: stacks[context.query.stack],
        stackKey: context.query.stack
    }
}  