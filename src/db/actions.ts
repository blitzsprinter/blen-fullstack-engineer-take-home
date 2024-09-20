"use server";

import content from "@/data/content.json";
import { ActionResponse } from "@/lib/types";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { NewTask, Task, tasks } from "./schema";

export async function getTasks(): Promise<Task[]> {
  const allTasks = db.select().from(tasks).all();
  return allTasks;
}

export async function getTaskById(id: number): Promise<Task | null> {
  const task = db.select().from(tasks).where(eq(tasks.id, id)).get();
  return task || null;
}

export async function addTask(task: NewTask): Promise<ActionResponse> {
  try {
    db.insert(tasks).values(task).run();

    return {
      success: true,
      message: content.message.createSuccess,
    };
  } catch (error) {
    console.error(content.message.error, error);

    return {
      success: false,
      message: content.message.createFailure,
    };
  }
}

export async function updateTask(id: number, task: Partial<Task>): Promise<ActionResponse> {
  try {
    db.update(tasks).set(task).where(eq(tasks.id, id)).run();

    return {
      success: true,
      message: content.message.updateSuccess,
    };
  } catch (error) {
    console.error(content.message.error, error);

    return {
      success: false,
      message: content.message.updateFailure,
    };
  }
}

export async function markAsCompleted(id: number): Promise<ActionResponse> {
  try {
    db.update(tasks).set({ isCompleted: true }).where(eq(tasks.id, id)).run();

    return {
      success: true,
      message: content.message.markAsCompleted,
    };
  } catch (error) {
    console.error(content.message.error, error);

    return {
      success: false,
      message: content.message.markFailure,
    };
  }
}

export async function markAsIncomplete(id: number): Promise<ActionResponse> {
  try {
    db.update(tasks).set({ isCompleted: false }).where(eq(tasks.id, id)).run();

    return {
      success: true,
      message: content.message.markAsIncomplete,
    };
  } catch (error) {
    console.error(content.message.error, error);

    return {
      success: false,
      message: content.message.markFailure,
    };
  }
}

export async function deleteTask(id: number): Promise<ActionResponse> {
  try {
    db.delete(tasks).where(eq(tasks.id, id)).run();

    return {
      success: true,
      message: content.message.deleteSuccess,
    };
  } catch (error) {
    console.error(content.message.error, error);

    return {
      success: false,
      message: content.message.deleteFailure,
    };
  }
}

export async function deleteTasksById(ids: number[]): Promise<ActionResponse> {
  try {
    for (const id of ids) {
      db.delete(tasks).where(eq(tasks.id, id)).run();
    }

    return {
      success: true,
      message: content.message.multipleDeletionSuccess,
    };
  } catch (error) {
    console.error(content.message.error, error);

    return {
      success: false,
      message: content.message.multipleDeletionFailure,
    };
  }
}
