import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Menu,UserCircle2,HardHat,Bell,TrainFront,UsersRound,AlarmClock } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import ADEXimge from "../assets/ADEXimge.jpg";

// Define parent and child variants
const parentVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      duration: 1.5,
      staggerChildren: 0.4, // 👈 this controls delay between children
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function Head() {
  return (
    <motion.div
      variants={parentVariants}
      initial="hidden"
      animate="show"
      className="w-full px-3 py-4 rounded-2xl border border-green-300 bg-gradient-to-br from-black to-green-300/10 flex flex-col justify-start items-center gap-4"
    >
      <motion.div
        variants={childVariants}
        className="flex justify-between items-start w-full"
      >
        <motion.div
          variants={childVariants}
          className="font-bold flex justify-center items-center"
        >
          <span className="w-10 h-10 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover rounded-full"
              src={ADEXimge}
              alt="ADEX logo"
            />
          </span>
          <span className="text-3xl bg-gradient-to-tl from-green-900 to-green-400 bg-clip-text text-transparent">
            DEX
          </span>
        </motion.div>

        <motion.div variants={childVariants}>
          <Menu className="text-green-400" size={30} />
        </motion.div>
      </motion.div>

      <motion.div
        variants={childVariants}
        className="flex justify-between items-center w-full"
      >
        <motion.div
          variants={childVariants}
          className="border border-green-400/30 rounded-md p-2 flex flex-col justify-center items-center"
        >
          <div className="flex justify-center items-center gap-2">
            <UserCircle2 className="text-green-400" size={30} />
            <p className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent text-xl">
              Daniel Anietie Ekanem
            </p>
          </div>
          <p className="text-sm text-green-900 w-full flex justify-end items-center">
            24/EG/CO/289
          </p>
        </motion.div>

        <motion.div
          variants={childVariants}
          className="flex justify-center items-center gap-2"
        >
          <span className="text-md text-green-400">CMPE</span>
          <HardHat className="text-green-400/40" size={25} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Body() {
  const sigRef = useRef();
  const [canvasSize, setCanvasSize] = useState({ width: 350, height: 200 });

  useEffect(() => {
    // Dynamically resize canvas based on screen size
    const handleResize = () => {
      const width = window.innerWidth < 500 ? 300 : 450;
      const height = window.innerWidth < 500 ? 180 : 250;
      setCanvasSize({ width, height });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const clearSignature = () => {
    sigRef.current.clear();
  };

  const saveSignature = () => {
    if (sigRef.current.isEmpty()) {
      alert("Please sign before saving!");
      return;
    }
    const dataURL = sigRef.current.toDataURL();
    console.log("Signature saved:", dataURL);
    // You can upload 'dataURL' to Firebase or Cloudinary later
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="flex flex-col justify-center items-center gap-5 p-2 w-full h-[50%] rounded-2xl bg-gradient-to-br from-black to-green-300/10 border border-green-300/20"
    >
      <div className="w-[40%] py-3 px-5 rounded-xl border border-green-300/20 bg-black text-green-400 flex justify-center items-center font-extrabold">
        PHY121
      </div>

      <p className="text-sm font-bold text-gray-600">Sign here 👇</p>

      <div className="w-[60%] aspect-square border border-green-300/40 rounded-xl bg-black flex flex-col justify-center items-center gap-2 p-3 overflow-hidden">
        <SignatureCanvas
          ref={sigRef}
          penColor="lime"
          backgroundColor="black"
          canvasProps={{
            width: canvasSize.width,
            height: canvasSize.height,
            className:
              "rounded-xl border border-green-500/30 shadow-lg shadow-green-900/20",
          }}
        />
        <div className="flex gap-3 my-4">
          <button
            onClick={clearSignature}
            className="px-5 py-1 bg-green-700/60 text-white rounded-md hover:bg-green-600"
          >
            Clear
          </button>
          <button
            onClick={saveSignature}
            className="px-6 py-1 bg-green-500 text-black font-bold rounded-md hover:bg-green-400"
          >
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Button(){
  return <motion.button 
  whileTap={{scale:1.1}}
  transition={{
    duration:1,
    stiffness:400,
    type:"spring"
  }}
  className="w-[60%] bg-gradient-to-tl from-green-500 to-green-300 px-4 py-2 rounded-2xl flex justify-center items-center text-black font-bold text-xl" >Mark Attendance</motion.button>
}

function Nav() {
  const [active, setActive] = useState("history");

  const tabs = [
    { id: "history", label: "View History", icon: AlarmClock },
    { id: "adex", label: "ADEX_I", icon: TrainFront },
    { id: "notify", label: "Notify Me", icon: Bell },
    { id: "marked", label: "Who Marked", icon: UsersRound },
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full bg-black flex justify-between items-center p-3 border-t border-green-900/30">
      {tabs.map(({ id, label, icon: Icon }) => (
        <motion.div
          key={id}
          onClick={() => setActive(id)}
          whileTap={{ scale: 0.9 }}
          animate={{ scale: active === id ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-[25%] flex flex-col justify-center items-center cursor-pointer select-none"
        >
          <Icon
            size={25}
            className={`transition-colors duration-300 ${
              active === id ? "text-green-400 drop-shadow-[0_0_6px_#22c55e]" : "text-gray-400"
            }`}
          />
          <p
            className={`text-xs font-bold mt-1 transition-colors duration-300 ${
              active === id ? "text-green-400" : "text-gray-600"
            }`}
          >
            {label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export default function Main(){
  
  return (
    <div className="relative flex flex-col justify-start items-center gap-10 bg-black max-w-3xl h-screen p-4" >
      <Head />
      <Body />
      <Button />
      <Nav />
    </div>
  )
}