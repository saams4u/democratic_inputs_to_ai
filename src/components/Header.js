
import Image from "next/image";

export default function Header({logo, name, topic}) {
  return (
    <div className="header flex bg-slate-200 p-4 rounded-2xl">
      <div className="flex mr-4 justify-center items-center">
        <Image 
            src={logo}
            width={200}
            height={200}
            alt={name} 
            style={{ borderRadius: '10px' }} 
        />
      </div>
      <div
        className="flex font-bold justify-center items-center text-center text-sm"
        style={{ fontSize: 16 }}
      >
        {topic}
      </div>
    </div>
  )
}