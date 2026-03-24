import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .max(300, "Description must be at most 300 characters")
    .optional()
    .or(z.literal("")),
});

export const updateTaskSchema = z.object({
  id: z.string().min(1, "Task id is required"),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .max(300, "Description must be at most 300 characters")
    .optional()
    .or(z.literal("")),
});

export const taskIdSchema = z.object({
  id: z.string().min(1, "Task id is required"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
