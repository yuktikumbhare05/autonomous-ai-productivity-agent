import type { AgentMessage, SuggestedAction } from "./agent.types";

export const initialAgentMessages: AgentMessage[] = [
  {
    id: "agent-1",
    role: "agent",
    content:
      "Good morning! I've checked your emails, calendar, and tasks. Here's a quick summary of what needs your attention today.",
  },
  {
    id: "agent-2",
    role: "agent",
    content: "How would you like to proceed?",
  },
];

export const suggestedActions: SuggestedAction[] = [
  {
    id: "summarize-emails",
    label: "Summarize my unread emails",
    response:
      "You have 8 unread emails. 3 appear to need your attention today, including 1 project update and 2 messages requiring a response.",
  },
  {
    id: "show-tasks",
    label: "Show today's tasks",
    response:
      "You have 12 tasks in total. 4 are due today, including 2 high-priority tasks.",
  },
  {
    id: "plan-day",
    label: "Help me plan my day",
    response:
      "You have meetings at 10:30 AM and 1:00 PM. I recommend using the available time before and after those meetings for your highest-priority tasks.",
  },
  {
    id: "create-task",
    label: "Create a new task",
    response:
      "Sure. Tell me what you would like the new task to be, and I can help you define its priority and due date.",
  },
];

export function getMockAgentResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  if (message.includes("email")) {
    return "You have 8 unread emails. 3 appear to need your attention today, including 1 project update and 2 messages requiring a response.";
  }

  if (message.includes("task")) {
    return "You have 12 tasks in total. 4 are due today, including 2 high-priority tasks.";
  }

  if (
    message.includes("plan") ||
    message.includes("schedule") ||
    message.includes("day")
  ) {
    return "You have meetings at 10:30 AM and 1:00 PM. Your available time can be used for focused work on your highest-priority tasks.";
  }

  if (
    message.includes("create") ||
    message.includes("add")
  ) {
    return "Sure. Tell me what you would like to create, and I'll help you define the details.";
  }

  return "I'm currently running in demo mode. Once the agent backend is connected, I'll be able to understand your request and take actions across your productivity workspace.";
}