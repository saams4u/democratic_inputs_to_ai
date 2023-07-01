
import Image from "next/image";

export default function Header({logo, name, topic}) {
  return (
    <div className="w-full header flex items-center justify-between bg-slate-200 p-4">
      <Image 
        src={logo}
        width={150} // specify a fixed width
        height={150} // specify a fixed height
        alt={name} 
        className="rounded-lg p-4 ml-40" // add padding with tailwind class
      />
      <div
        className="font-bold ml-24 mr-auto text-center px-4 my-2 mx-auto text-lg leading-7 max-w-5xl" 
        style={{ fontFamily: "Calibri", fontSize: 20 }}
      >
        {topic}
      </div>
    </div>
  )
}