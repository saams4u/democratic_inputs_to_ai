
import stacks from "@/data/stacks.json";
import Link from "next/link";
import Image from "next/image";

import { useSession } from 'next-auth/react';

function Home() {
  const { data: session } = useSession();

  const renderStacks = () => {
    if (session) { // Display stacks when user exists and data has finished loading
      return (
        <div className="grid grid-cols-4 gap-4">
          {Object.keys(stacks).map((stackKey) => {
            const stack = stacks[stackKey];
            return (
              <Link legacyBehavior key={stack.href} href={stack.href}>
                <a className={`${stack.hoverClass} relative border-4 border-solid mr-11 mb-2 rounded-lg`}>
                  <Image 
                    title={stack.name}
                    src={stack.logo} 
                    className="rounded-lg" 
                    alt={stack.name} 
                    width={135}
                    height={135}
                  />
                </a>
              </Link>
            );
          })}
        </div>
      )
    } else {
      return null;
    }
  }

  return (
    <div className="h-6/7 p-11 flex justify-center items-center flex-col text-gray-700">
      <a target="_blank" href="https://openai.com/blog/democratic-inputs-to-ai" className="text-blue-500 hover:text-blue-700 transition-colors">
        <h1 className="pt-4 pb-4 text-4xl font-semibold mb-4">Democratic Inputs to AI: Policy Topics</h1>
      </a>
      <div className="w-4/5 pb-11 text-center mb-8 px-4" style={{ fontSize: 18 }}>
        Welcome to our initiative to democratize AI! OpenAI is launching a program 
        to fund experiments in setting up a democratic process for deciding what rules 
        AI systems should follow. We believe that AI behavior should be shaped by 
        diverse perspectives reflecting the public interest. Beyond legal frameworks, 
        we believe AI, much like society, needs more intricate and adaptive guidelines 
        for its conduct. No single individual, company, or even country should dictate 
        these decisions. We are seeking teams from across the world to develop proof-of-concepts 
        for this democratic process. We hope to learn from these experiments and use them 
        as the basis for a more global and ambitious process going forward. Let&apos;s work 
        together to ensure AGI benefits all of humanity. <b>Please login or register to 
        access the chatbot discussion topics that appear (or will appear) below.</b>
      </div>
      <div>
        {renderStacks()}
      </div>
    </div>
  )
}

export default Home;