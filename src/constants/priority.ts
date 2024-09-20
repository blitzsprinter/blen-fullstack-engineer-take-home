import content from "@/data/content.json";
import { Priority } from "@/lib/enums";

export const priorityDetails: Record<number, { text: string; color: string }> = {
  [Priority.Urgent]: {
    text: content.priority.urgent.text,
    color: content.priority.urgent.color,
  },
  [Priority.High]: {
    text: content.priority.high.text,
    color: content.priority.high.color,
  },
  [Priority.Medium]: {
    text: content.priority.medium.text,
    color: content.priority.medium.color,
  },
  [Priority.Low]: {
    text: content.priority.low.text,
    color: content.priority.low.color,
  },
};

export const priorityOptions = Object.keys(Priority)
  .filter((key) => isNaN(Number(key)))
  .map((key) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(), // Capitalize the label
    value: Priority[key as keyof typeof Priority],
  }));
