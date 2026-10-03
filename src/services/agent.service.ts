import type { AgentMessage } from "@/src/agent/agent.types";

export type SendAgentMessageRequest = {
  message: string;
  conversation: AgentMessage[];
};

export type SendAgentMessageResponse = {
  message: AgentMessage;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function sendAgentMessage(
  request: SendAgentMessageRequest
): Promise<SendAgentMessageResponse> {
  const response = await fetch(`${API_BASE_URL}/api/agent/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to communicate with the AI agent.");
  }

  return response.json();
}