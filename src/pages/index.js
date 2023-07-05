
import stacks from "@/data/stacks.json";
import Link from "next/link";
import Image from "next/image";
import { motion } from 'framer-motion';

import { withIronSession } from "next-iron-session";
import { useUser } from "@/lib/hooks";

function Home() {
  const { user } = useUser();

  const renderStacks = () => {
    if (user) { 
      return (
        <div className="grid grid-cols-4 gap-8">
          {Object.keys(stacks).map((stackKey) => {
            const stack = stacks[stackKey];
            return (
              <Link legacyBehavior key={stack.href} href={stack.href}>
                <motion.a 
                  whileHover={{ scale: 1.1 }}
                  className={`${stack.hoverClass} relative border-2 border-solid mr-4 mb-4 rounded-xl p-4 shadow-xl hover:shadow-xl transition-shadow duration-200 cursor-pointer`}>
                  <Image 
                    title={stack.name}
                    src={stack.logo} 
                    className="rounded-xl" 
                    alt={stack.name} 
                    width={120}
                    height={120}
                  />
                </motion.a>
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
    <div className="h-6/7 p-12 flex justify-center items-center flex-col text-gray-700 font-light">
      <a target="_blank" href="https://openai.com/blog/democratic-inputs-to-ai" className="text-blue-500 hover:text-blue-700 transition-colors">
        <h1 className="pt-2 text-4xl mt-2 font-semibold mb-6 tracking-wider" style={{ fontFamily: "Roboto" }}>Democratic Inputs to AI: Policy Topics</h1>
      </a>
      <div className="w-4/5 pb-12 text-center px-6 text-lg leading-relaxed" style={{ fontSize: 18, fontFamily: "Roboto" }}>
        Welcome to our initiative to democratize AI! OpenAI is launching a program 
        to fund experiments in setting up a democratic process for deciding what rules 
        AI systems should follow. We believe that AI behavior should be shaped by 
        diverse perspectives reflecting the public interest. Beyond legal frameworks, 
        we believe AI, much like society, needs more intricate and adaptive guidelines 
        for its conduct. No single individual, company, or even country should dictate 
        these decisions. We are seeking teams from across the world to develop proof-of-concepts 
        for this democratic process. We hope to learn from these experiments and use them 
        as the basis for a more global and ambitious process going forward. Let&apos;s work 
        together to ensure AGI benefits all of humanity. <span className="font-bold">Please 
        login or register to access the chatbot discussion topics that appear (or will appear) below.</span>
      </div>
      <div>
        {renderStacks()}
      </div>
    </div>
  )
}

export default withIronSession(Home, {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: "user-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});