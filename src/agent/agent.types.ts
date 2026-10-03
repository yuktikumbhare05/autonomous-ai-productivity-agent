export type AgentRole = "agent" | "user";

export type AgentStatus = "online" | "thinking" | "offline";

export type AgentMessage = {
  id: string;
  role: AgentRole;
  content: string;
};

export type SuggestedAction = {
  id: string;
  label: string;
  response: string;
};