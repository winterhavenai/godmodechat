"use client";

import { useState, useRef, useEffect } from "react";

const OPENING_MESSAGE = `**Welcome.**

You can bring anything to Jesus right now â a worry, a decision, a fear, a celebration, a question, or a prayer for someone you love.

Nothing is too small. Nothing is too big.

**What would you like to bring to Him today?**`;

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: OPENING_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  async function sendMessage(e) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Build conversation history (skip the opening message for API)
      const apiMessages = updatedMessages
        .filter((m, i) => !(i === 0 && m.role === "assistant"))
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const assistantContent =
        data.content?.[0]?.text || data.content || "I'm here with you. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantContent },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry â something went wrong on my end. Please try again, and know that Jesus is with you right now regardless.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Simple markdown-ish rendering for bold and italic
  function renderContent(text) {
    // Split into paragraphs
    return text.split("\n\n").map((para, pi) => {
      if (!para.trim()) return null;
      // Handle lines within paragraph
      const lines = para.split("\n").map((line, li) => {
        // Bold
        let processed = line.replace(
          /\*\*(.+?)\*\*/g,
          "<strong>$1</strong>"
        );
        // Italic
        processed = processed.replace(/\*(.+?)\*/g, "<em>$1</em>");
        // Scripture dash lines
        processed = processed.replace(
          /^- \*(.+?)\*/,
          '<span style="display:block;margin:0.4rem 0">â <em>$1</em></span>'
        );
        return processed;
      });
      return (
        <p
          key={pi}
          style={{ marginBottom: "0.75rem" }}
          dangerouslySetInnerHTML={{ __html: lines.join("<br/>") }}
        />
      );
    });
  }

  return (
    <div className="chat-page">
      {/* Header */}
      <header className="chat-header">
        <h1>GodModeChat</h1>
        <a href="/">â Back to Home</a>
      </header>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${
              msg.role === "user" ? "message-user" : "message-assistant"
            }`}
          >
            {renderContent(msg.content)}
          </div>
        ))}

        {isLoading && (
          <div className="typing-indicator">
            Listening{" "}
            <span className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className="chat-input-area" onSubmit={sendMessage}>
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Bring anything to Jesus..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
