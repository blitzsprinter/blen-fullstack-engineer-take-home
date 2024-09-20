import content from "@/data/content.json";
import mockData from "@/data/mock.json";
import {
  addTask,
  deleteTask,
  deleteTasksById,
  getTaskById,
  getTasks,
  markAsCompleted,
  updateTask,
} from "@/db/actions";
import { db } from "@/db/client";
import { NewTask, tasks } from "@/db/schema";
import { Priority } from "@/lib/enums";

// Mocking Drizzle ORM methods
jest.mock("@/db/client", () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    run: jest.fn(),
  },
}));

describe("Task Actions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasks", () => {
    it("should return all tasks", async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          all: jest.fn().mockReturnValue(mockData),
        }),
      });

      const result = await getTasks();

      expect(db.select).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });
  });

  describe("getTaskById", () => {
    it("should return the task when found", async () => {
      const mockTask = mockData[0];

      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue(mockTask),
          }),
        }),
      });

      const result = await getTaskById(1);

      expect(db.select).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTask);
    });

    it("should return null when task not found", async () => {
      (db.select as jest.Mock).mockReturnValue({
        from: () => ({
          where: jest.fn().mockReturnValue({
            get: jest.fn().mockReturnValue(null),
          }),
        }),
      });

      const result = await getTaskById(10);

      expect(db.select).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe("addTask", () => {
    it("should add a new task successfully", async () => {
      const newTask: NewTask = {
        title: "New Task",
        description: "This is a new task description",
        dueDate: "2024-10-01T15:00:00Z",
        priority: Priority.Medium,
        isCompleted: false,
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          run: jest.fn(),
        }),
      });

      const result = await addTask(newTask);

      expect(db.insert).toHaveBeenCalledWith(tasks);
      expect(result).toEqual({
        success: true,
        message: content.message.createSuccess,
      });
    });

    it("should return failure when adding task fails", async () => {
      const newTask: NewTask = {
        title: "New Task",
        description: "This is a new task description",
        dueDate: "2024-10-01T15:00:00Z",
        priority: Priority.Medium,
        isCompleted: false,
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockImplementation(() => {
          throw new Error("DB Error");
        }),
      });

      const result = await addTask(newTask);

      expect(result).toEqual({
        success: false,
        message: content.message.createFailure,
      });
    });
  });

  describe("updateTask", () => {
    it("should update a task successfully", async () => {
      const updatedTask = {
        title: "Fix bug in payment system",
        description: "Resolve issue with payment gateway integration.",
        priority: Priority.High,
        dueDate: "2024-09-25T17:00:00Z",
      };

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            run: jest.fn(),
          }),
        }),
      });

      const result = await updateTask(1, updatedTask);

      expect(db.update).toHaveBeenCalledWith(tasks);
      expect(result).toEqual({
        success: true,
        message: content.message.updateSuccess,
      });
    });

    it("should return failure when updating task fails", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockImplementation(() => {
            throw new Error("DB Error");
          }),
        }),
      });

      const result = await updateTask(1, {
        title: "Fix bug in payment system",
        description: "Resolve issue with payment gateway integration.",
        priority: Priority.High,
        dueDate: "2024-09-25T17:00:00Z",
      });

      expect(result).toEqual({
        success: false,
        message: content.message.updateFailure,
      });
    });
  });

  describe("markAsCompleted", () => {
    it("should mark task as completed", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            run: jest.fn(),
          }),
        }),
      });

      const result = await markAsCompleted(1);

      expect(db.update).toHaveBeenCalledWith(tasks);
      expect(result).toEqual({
        success: true,
        message: content.message.markAsCompleted,
      });
    });

    it("should return failure when marking task as completed fails", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockImplementation(() => {
            throw new Error("DB Error");
          }),
        }),
      });

      const result = await markAsCompleted(1);

      expect(result).toEqual({
        success: false,
        message: content.message.markFailure,
      });
    });
  });

  describe("deleteTask", () => {
    it("should delete a task successfully", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          run: jest.fn(),
        }),
      });

      const result = await deleteTask(1);

      expect(db.delete).toHaveBeenCalledWith(tasks);
      expect(result).toEqual({
        success: true,
        message: content.message.deleteSuccess,
      });
    });

    it("should return failure when deleting task fails", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockImplementation(() => {
          throw new Error("DB Error");
        }),
      });

      const result = await deleteTask(1);

      expect(result).toEqual({
        success: false,
        message: content.message.deleteFailure,
      });
    });
  });

  describe("deleteTasksById", () => {
    it("should delete multiple tasks successfully", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockReturnValue({
          run: jest.fn(),
        }),
      });

      const result = await deleteTasksById([1, 2]);

      expect(db.delete).toHaveBeenCalledWith(tasks);
      expect(result).toEqual({
        success: true,
        message: content.message.multipleDeletionSuccess,
      });
    });

    it("should return failure when deleting multiple tasks fails", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockImplementation(() => {
          throw new Error("DB Error");
        }),
      });

      const result = await deleteTasksById([1, 2]);

      expect(result).toEqual({
        success: false,
        message: content.message.multipleDeletionFailure,
      });
    });
  });
});
