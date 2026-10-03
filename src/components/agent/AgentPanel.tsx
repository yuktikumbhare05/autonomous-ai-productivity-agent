"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  CalendarDays,
  CheckSquare,
  Mail,
  Paperclip,
  Send,
  Sparkles,
} from "lucide-react";

import type { AgentMessage } from "@/src/agent/agent.types";

import {
  initialAgentMessages,
  suggestedActions,
} from "@/src/agent/agent.mock";

import { sendAgentMessage } from "@/src/services/agent.service";

export default function AgentPanel() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] =
    useState<AgentMessage[]>(initialAgentMessages);

  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  const sendMessage = (text: string) => {
    const trimmedMessage = text.trim();

    if (!trimmedMessage || isThinking) {
      return;
    }

    const userMessage: AgentMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedMessage,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setMessage("");
    setIsThinking(true);

    setTimeout(async () => {
      try {
        const response = await sendAgentMessage({
          message: trimmedMessage,
          conversation: [...messages, userMessage],
        });

        setMessages((previousMessages) => [
          ...previousMessages,
          response.message,
        ]);
      } catch {
        const agentMessage: AgentMessage = {
          id: `agent-${Date.now()}`,
          role: "agent",
          content:
            "The AI backend is not connected yet. I'm continuing in demo mode for now.",
        };

        setMessages((previousMessages) => [
          ...previousMessages,
          agentMessage,
        ]);
      } finally {
        setIsThinking(false);
      }
    }, 500);
  };

  const handleSend = () => {
    sendMessage(message);
  };

  return (
    <aside className="app-agent-panel flex h-dvh w-[360px] shrink-0 flex-col border-l border-slate-200 bg-white">
      {/* Agent Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
          <Bot size={24} className="text-slate-800" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Productivity Agent
            </h2>

            <span className="h-2 w-2 rounded-full bg-green-500" />
          </div>

          <p className="mt-0.5 text-xs text-slate-500">
            Personal productivity assistant
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-green-600">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Online
        </div>
      </div>

      {/* Conversation */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-4 p-5">
          {messages.map((chatMessage) => {
            const isUser = chatMessage.role === "user";

            return (
              <div
                key={chatMessage.id}
                className={`chat-message-entry flex items-start gap-3 ${
                  isUser ? "justify-end" : ""
                }`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <Bot size={17} className="text-slate-800" />
                  </div>
                )}

                <div
                  className={`max-w-[260px] rounded-xl px-4 py-3 ${
                    isUser
                      ? "rounded-tr-sm bg-slate-900 text-white"
                      : "rounded-tl-sm bg-slate-100 text-slate-700"
                  }`}
                >
                  <p className="text-sm leading-6">
                    {chatMessage.content}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Thinking State */}
          {isThinking && (
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <Bot size={17} className="text-slate-800" />
              </div>

              <div className="rounded-xl rounded-tl-sm bg-slate-100 px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-500" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-500 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-500 [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Today's Highlights */}
        <div className="mx-5 mb-5 rounded-xl bg-slate-50 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={17} className="text-slate-700" />

            <h3 className="text-sm font-semibold text-slate-900">
              Today&apos;s Highlights
            </h3>
          </div>

          <div className="space-y-3">
            <HighlightItem
              icon={<Mail size={15} />}
              text="3 important emails need your attention"
            />

            <HighlightItem
              icon={<CalendarDays size={15} />}
              text="You have a team meeting at 11:00 AM"
            />

            <HighlightItem
              icon={<CheckSquare size={15} />}
              text="2 high-priority tasks are due today"
            />

            <HighlightItem
              icon={<CalendarDays size={15} />}
              text="No calendar conflicts detected"
            />
          </div>
        </div>

        {/* Suggested Actions */}
        <div className="space-y-2 px-5 pb-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
            Suggested actions
          </p>

          {suggestedActions.map((action) => {
            const Icon =
              action.id === "summarize-emails"
                ? Mail
                : action.id === "show-tasks"
                  ? CheckSquare
                  : action.id === "plan-day"
                    ? CalendarDays
                    : Sparkles;

            return (
              <button
                key={action.id}
                type="button"
                disabled={isThinking}
                onClick={() => sendMessage(action.label)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Icon size={16} />
                </span>

                <span className="text-xs font-medium text-slate-700">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message Composer */}
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="rounded-xl border border-slate-300 bg-white">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            rows={3}
            disabled={isThinking}
            className="w-full resize-none bg-transparent px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          />

          <div className="flex items-center justify-between px-3 pb-3">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Attach file"
            >
              <Paperclip size={17} />
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={!message.trim() || isThinking}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-[10px] text-slate-400">
          AI Agent is currently running in demo mode
        </p>
      </div>
    </aside>
  );
}

function HighlightItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
        {icon}
      </div>

      <p className="text-xs leading-5 text-slate-600">
        {text}
      </p>
    </div>
  );
}