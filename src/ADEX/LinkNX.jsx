import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LinkNX() {
    const navigate = useNavigate();
    return (
        <div className="relative bg-black flex flex-col justify-start items-center w-full min-h-screen overflow-hidden p-6">
            {/* Neon Gradient Orbs */}
            <div className="absolute w-[550px] h-[550px] bg-green-400/20 rounded-full blur-3xl -top-48 -left-32 animate-pulse" />
            <div className="absolute w-[450px] h-[450px] bg-cyan-400/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-700" />

            {/* Title */}
            <motion.h1
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,200,0.4)] select-none"
            >
                ADEX
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-gray-300 text-lg font-medium text-center mt-6 select-none"
            >
                How do you want to take the class?
            </motion.p>

            {/* Options */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.4 }}
                className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-4xl place-items-center"
            >
                {[
                    { label: "PDF", icon: "📄", link: "/pdf" },
                    { label: "AI", icon: "🤖", link: "/ai" },
                    { label: "NXDEX", icon: "🖥️", link: "/nxdex" },
                ].map((item, index) => (
                    <motion.div
                        tabIndex={0}
                        onClick={() => navigate(item.link)}
                        key={index}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-44 h-24 rounded-3xl border border-white/20 bg-white/5 backdrop-blur-2xl duration-300 shadow-[0_0_25px_rgba(0,255,180,0.15)] hover:shadow-[0_0_35px_rgba(0,255,180,0.45)] text-2xl text-white/70 hover:text-green-300 flex justify-center items-center cursor-pointer hover:border-green-300/40 transition-all"
                    >
                        {item.label} <span className="ml-2">{item.icon}</span>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}