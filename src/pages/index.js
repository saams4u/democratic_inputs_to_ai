
import stacks from "@/data/stacks.json";

import Link from "next/link";
import Image from "next/image";

export default function Home() {

  const renderStacks = () => {
    return Object.keys(stacks).map((stackKey) => {
      const stack = stacks[stackKey];
      return (
        <Link 
          key={stack.href}
          href={stack.href} 
          className={`${stack.hoverClass} w-40 h-40 relative border-4 border-solid m-2 rounded-xl`}
        >
        <Image 
          src={stack.logo} 
          className="object-cover" 
          fill alt={stack.name} 
          style={{ borderRadius: '10px' }}
        />
        </Link>
      );
    })
  }

  return (
    <div className="h-full flex justify-center items-center flex-col">
      <a target="_blank" href="https://openai.com/blog/democratic-inputs-to-ai" style={{ color: '#0000EE', textDecoration: 'none' }}>
      <h1 style={{ fontSize: 50 }}>Democratic Inputs to AI</h1><br></br>
      </a>
      <div className="flex text-center">
        Welcome to our initiative to democratize AI! OpenAI is launching a program 
        to fund experiments in setting up a democratic process for deciding what rules 
        AI systems should follow. We believe that AI behavior should be shaped by 
        diverse perspectives reflecting the public interest. Beyond legal frameworks, 
        we believe AI, much like society, needs more intricate and adaptive guidelines 
        for its conduct. No single individual, company, or even country should dictate 
        these decisions. We are seeking teams from across the world to develop proof-of-concepts 
        for this democratic process. We hope to learn from these experiments and use them 
        as the basis for a more global and ambitious process going forward. Let's work 
        together to ensure AGI benefits all of humanity.
      </div><br></br>
      <div className="flex space-x-8">
        {renderStacks()}
      </div>
    </div>
  )
}