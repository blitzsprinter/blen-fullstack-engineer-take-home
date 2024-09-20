import { z } from "zod";
import { Priority } from "./enums";

export const taskSchema = z.object({
  id: z.number().optional(), // Primary key, will be auto-incremented, so optional in insert
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.nativeEnum(Priority).default(Priority.Low),
  dueDate: z.string().min(1, "Due date is required"),
  isCompleted: z.boolean().default(false),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const newTaskSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
