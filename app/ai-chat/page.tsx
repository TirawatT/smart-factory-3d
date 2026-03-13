"use client";

import { Header } from "@/components/layout/header";
import { useAuthStore } from "@/stores/auth-store";
import { Bot, Loader2, Send, User, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "What are the current active alerts and their root causes?",
  "Which devices have the highest energy consumption today?",
  "Recommend a maintenance schedule for Zone A machines",
  "Explain what high vibration readings mean for CNC machines",
  "How do I optimize OEE for production lines?",
];

export default function AiChatPage() {
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const assistantMsg: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantMsg]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please check the API key configuration and try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: "#070d18" }}>
      <Header title="AI ASSISTANT" subtitle="Powered by Claude · Factory intelligence" />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-6 py-12">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, #0f2640, #1a3a5c)",
                  border: "1px solid #1e3c60",
                  boxShadow: "0 0 30px rgba(0,200,255,0.15)",
                }}
              >
                <Bot className="h-10 w-10" style={{ color: "#00c8ff", filter: "drop-shadow(0 0 8px rgba(0,200,255,0.5))" }} />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-bold" style={{ color: "#e0ecf7" }}>Smart Factory AI Assistant</h2>
                <p className="text-sm mt-1" style={{ color: "#4a6d8a" }}>Ask me about device alerts, OEE, energy, maintenance, or anything factory-related.</p>
              </div>
              {/* Quick prompts */}
              <div className="w-full max-w-lg space-y-2">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="w-full text-left rounded-lg px-4 py-2.5 text-sm transition-all duration-200 hover:border-[#1e3c60]"
                    style={{ background: "#0a1220", border: "1px solid #192e48", color: "#7fa3c2" }}
                  >
                    <Zap className="inline h-3.5 w-3.5 mr-2" style={{ color: "#00c8ff" }} />
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={
                  msg.role === "assistant"
                    ? { background: "linear-gradient(135deg, #0f2640, #1a3a5c)", border: "1px solid #1e3c60" }
                    : { background: "linear-gradient(135deg, #0f2640, #1a3a5c)", border: "1px solid #1e3c60" }
                }
              >
                {msg.role === "assistant"
                  ? <Bot className="h-4 w-4" style={{ color: "#00c8ff" }} />
                  : <User className="h-4 w-4" style={{ color: "#00ff9d" }} />
                }
              </div>

              {/* Bubble */}
              <div
                className="max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? { background: "rgba(0,200,255,0.1)", border: "1px solid rgba(0,200,255,0.2)", color: "#e0ecf7" }
                    : { background: "#0a1220", border: "1px solid #192e48", color: "#c8dff0" }
                }
              >
                {msg.content || (loading && i === messages.length - 1
                  ? <span className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: "#4a6d8a" }} /><span style={{ color: "#4a6d8a" }}>Thinking...</span></span>
                  : null
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div
          className="shrink-0 p-4 md:p-6"
          style={{ borderTop: "1px solid #192e48", background: "rgba(7,13,24,0.95)" }}
        >
          <div
            className="flex items-end gap-3 rounded-xl p-3"
            style={{ background: "#0a1220", border: "1px solid #192e48" }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about devices, alerts, OEE, energy…"
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-[#2d4a63]"
              style={{ color: "#e0ecf7", maxHeight: 120 }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-40"
              style={{
                background: input.trim() && !loading ? "linear-gradient(135deg, #0090c8, #00c8ff)" : "#192e48",
                color: input.trim() && !loading ? "#070d18" : "#4a6d8a",
              }}
            >
              {loading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Send className="h-4 w-4" />
              }
            </button>
          </div>
          <p className="text-[10px] mt-2 text-center" style={{ color: "#2d4a63" }}>
            Press Enter to send · Shift+Enter for new line · Powered by Claude
          </p>
        </div>
      </div>
    </div>
  );
}
