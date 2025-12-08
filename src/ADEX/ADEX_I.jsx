// Updated ADEX_I AI Page with Green Glossy Gen-Z UI
// Full modern redesign

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    AlignJustify,
    MessageCircleMore,
    BrainCircuit,
    BrainCog,
    Bot,
    MessagesSquare,
    ArrowUp,
    Mic,
    X,
    Settings,
    SunMedium,
    Moon,
    Copy
} from "lucide-react";

export default function ADEX_I() {
    const [dark, setDark] = useState(true);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sideBar, setSideBar] = useState(false);
    const [mic, setMic] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const textareaRef = useRef(null);

    /* Auto-scroll */
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    /* Mic Handler */
    const handleMic = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        if (!recognitionRef.current) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.lang = "en-US";

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput((prev) => prev + " " + transcript);
                setMic(false);
            };

            recognitionRef.current = recognition;
        }

        if (isListening) recognitionRef.current.stop();
        else recognitionRef.current.start();
    };

    const toggle = () => setDark(!dark);
    const sideBarToggle = () => setSideBar(!sideBar);

    /* Send Message */
    const sendMessage = async () => {
        if (!input.trim()) return;

        setMessages([...messages, { text: input, sender: "user" }]);
        const userInput = input;
        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setMic(true);

        try {
            const res = await fetch("https://frontback-livid.vercel.app/api/ai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ txt: userInput }),
            });

            const data = await res.json();

            setMessages((prev) => [...prev, { text: data.reply || "No reply.", sender: "ai" }]);
        } catch (err) {
            setMessages((prev) => [...prev, { text: "Server error.", sender: "ai" }]);
        }
    };

    const handleInput = (e) => {
        const value = e.target.value;
        setInput(value);
        setMic(value.trim() === "");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
        }
    };

    return (
        <div className={`${dark ? "dark" : ""}`}>
            <div
                className="h-screen w-full text-gray-900 dark:text-black flex flex-col pt-14"
                style={dark ? {
                    background:
                        "radial-gradient(circle at top right, #0f3f2550, #020d08, black)",
                } : { background: "white" }}
            >
                {/* HEADER */}
                <header className="fixed top-0 left-0 w-full flex justify-between items-center bg-black/20 dark:bg-black/40 p-5 border-b border-green-500/30 backdrop-blur-2xl shadow-[0_0_20px_rgba(0,255,150,0.25)]">
                    <AlignJustify
                        onClick={sideBarToggle}
                        size={25}
                        className="text-green-400 cursor-pointer"
                    />
                    <h1 className="font-extrabold text-4xl tracking-tight bg-gradient-to-r from-green-600 via-emerald-400 to-lime-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,100,0.5)] select-none">
                        ADEX_I
                    </h1>
                </header>

                {/* CHAT BODY */}
                <main className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messages.length === 0 ? (
                        <p className="text-center text-green-400/80 mt-20 text-lg font-light animate-pulse select-none">
                            Welcome to <span className="font-bold text-green-300">ADEX_I</span>.<br />
                            Ask anything.
                        </p>
                    ) : (
                        messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`p-4 rounded-2xl shadow-lg backdrop-blur-xl border ${msg.sender === "user"
                                        ? "bg-green-500/20 border-green-400/30 text-green-500 self-end ml-auto max-w-[75%] w-fit"
                                        : "bg-white/5 border-white/10 text-white/80 max-w-[85%] w-fit"
                                    }`}


                            >
                                <div className="prose prose-invert max-w-none dark:text-green-500 break-words [&_pre]:bg-black/40 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const codeText = String(children).replace(/\n$/, "");
                                                const isCodeBlock = !inline;

                                                const copyToClipboard = async () => {
                                                    try {
                                                        await navigator.clipboard.writeText(codeText);
                                                        alert("Copied");
                                                    } catch (err) {
                                                        alert("Failed to copy");
                                                    }
                                                };

                                                return isCodeBlock ? (
                                                    <div className="relative group">
                                                        <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto">
                                                            <code className={className} {...props}>
                                                                {codeText}
                                                            </code>
                                                        </pre>
                                                        <button
                                                            onClick={copyToClipboard}
                                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 bg-black/50 rounded-md"
                                                        >
                                                            <Copy size={15} className="text-green-300" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <code className="bg-black/40 px-1 py-0.5 rounded text-green-300">{children}</code>
                                                );
                                            },
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <div className="h-[10%] w-full" />

                {/* INPUT BAR */}
                <footer className="p-4 border-t border-green-500/20 bg-black/40 backdrop-blur-xl fixed bottom-0 left-0 w-full">
                    <div className="flex items-center gap-3 bg-black/40 border border-green-400/20 rounded-2xl px-4 py-2">
                        <textarea
                            ref={textareaRef}
                            placeholder="Ask ADEX_I..."
                            value={input}
                            onChange={handleInput}
                            rows={1}
                            style={{ minHeight: "2rem" }}
                            className="max-h-40 flex-1 resize-none bg-transparent outline-none text-green-200 leading-[1.6em] py-2"
                        ></textarea>

                        {mic && (
                            <div
                                tabIndex={0}
                                onClick={handleMic}
                                className={`rounded-full border p-2 cursor-pointer transition ${isListening
                                    ? "border-green-400 bg-green-900/40 text-green-300"
                                    : "border-green-400/30 text-green-300/60"
                                    }`}
                            >
                                <Mic />
                            </div>
                        )}

                        <div
                            tabIndex={0}
                            onClick={sendMessage}
                            className="rounded-full border border-green-400/30 hover:border-green-400 hover:bg-green-900/30 text-green-300 transition p-2 cursor-pointer"
                        >
                            <ArrowUp />
                        </div>
                    </div>
                </footer>

                {/* SIDEBAR */}
                <div
                    className={`fixed top-0 left-0 flex flex-col h-screen bg-black/50 border-r border-green-500/30 rounded-tr-2xl rounded-br-2xl shadow-[0_0_20px_rgba(0,255,100,0.3)] duration-300 backdrop-blur-2xl overflow-hidden ${sideBar ? "w-[65%] p-4" : "w-0"
                        }`}
                >
                    <div
                        onClick={sideBarToggle}
                        className="w-full flex justify-end items-end p-1 text-green-300 cursor-pointer"
                    >
                        <X />
                    </div>

                    <div className="flex items-center gap-4 mb-5 font-bold p-2 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 text-black cursor-pointer">
                        <MessagesSquare size={25} /> New Chat
                    </div>

                    <div className="text-green-300/80 flex items-center gap-4 mb-5 p-2 rounded-2xl hover:bg-green-900/30 cursor-pointer transition">
                        <Bot size={25} /> Chat Bot
                    </div>

                    <div className="text-green-300/80 flex items-center gap-4 mb-5 p-2 rounded-2xl hover:bg-green-900/30 cursor-pointer transition">
                        <BrainCog size={25} /> LLM-4
                    </div>

                    <div className="text-green-300/80 flex items-center gap-4 mb-5 p-2 rounded-2xl hover:bg-green-900/30 cursor-pointer transition">
                        <BrainCircuit size={25} /> LLM-5
                    </div>

                    <hr className="border-green-700/40 mb-4" />

                    <div className="flex flex-col justify-end flex-1">
                        <div className="text-green-300/80 flex items-center gap-4 mb-5 p-2 rounded-2xl hover:bg-green-900/30 cursor-pointer transition">
                            <Settings size={25} /> Settings
                        </div>

                        <div className="flex gap-1">
                            {dark ? (
                                <div
                                    onClick={toggle}
                                    className="text-green-300/80 flex items-center gap-4 mb-5 p-2 rounded-2xl hover:bg-green-900/30 cursor-pointer transition"
                                >
                                    <SunMedium /> Light
                                </div>
                            ) : (
                                <div
                                    onClick={toggle}
                                    className="text-green-300/80 flex items-center gap-4 mb-5 p-2 rounded-2xl hover:bg-green-900/30 cursor-pointer transition"
                                >
                                    <Moon /> Dark
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}