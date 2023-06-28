
import Image from "next/image";

export default function Header({logo, name, topic}) {
  return (
    <div className="header grid grid-cols-3 bg-slate-200 p-4 rounded-2xl">
      <div className="justify-self-start">
        <Image 
            src={logo}
            width={100} // specify a fixed width
            height={100} // specify a fixed height
            alt={name} 
            style={{ borderRadius: '10px' }}
        />
      </div>
      <div
        className="grid font-bold place-self-center text-center text-sm col-span-2 mr-44"
        style={{ fontSize: 18, fontFamily: "Calibri" }}
      >
        {topic}
      </div>
    </div>
  )
}
