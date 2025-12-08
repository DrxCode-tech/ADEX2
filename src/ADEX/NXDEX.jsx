import { useState } from "react";
import { motion } from "framer-motion";

function VideoPage() {
  return (
    <div className="relative w-full lg:w-[70%] h-screen bg-black flex flex-col justify-start items-center p-4 overflow-y-auto">
      {/* Video */}
      <div className="w-full max-w-4xl aspect-video bg-gray-800 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(0,255,150,0.2)]">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="NXDEX Player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between w-full max-w-4xl mt-6">
        {/* Left */}
        <div className="flex flex-col gap-4 text-white/70 text-xl select-none">
          <button className="hover:text-green-300 transition-all">❤️ Love</button>
          <button className="hover:text-green-300 transition-all">👍 Like</button>
          <button className="hover:text-green-300 transition-all">⭐ Star</button>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4 text-white/70 text-xl select-none">
          <button className="hover:text-green-300 transition-all">💬 Comment</button>
          <button className="hover:text-green-300 transition-all">❓ Query</button>
        </div>
      </div>
    </div>
  );
}

function CommentPage() {
  const comments = [
    { user: "AminaTech", text: "This class is fire!🔥🔥 Can't wait for the next module." },
    { user: "CodeBoy", text: "Bro explained it better than my lecturer 💀" },
    { user: "DevQueen", text: "NXDEX > YouTube for real." },
    { user: "GreenPlug", text: "Gen-Z UI going crazyyy 🤯" }
  ];

  return (
    <div className="hidden lg:flex w-[30%] h-screen bg-gray-950 border-l border-white/10 p-6 flex-col overflow-y-auto">
      <h2 className="text-white text-2xl font-bold mb-6 select-none">Comments</h2>
      <div className="flex flex-col gap-6">
        {comments.map((c, i) => (
          <div
            key={i}
            className="p-4 bg-white/5 rounded-xl border border-white/10 shadow-[0_0_20px_rgba(0,255,150,0.1)] hover:border-green-300/30 transition-all"
          >
            <div className="text-green-300 font-semibold">{c.user}</div>
            <div className="text-white/80 mt-1">{c.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NXDEX() {
  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-black">
      <VideoPage />
      <CommentPage />
    </div>
  );
}
