"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/types";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "@/schemas/task.schema";
import {
  createTask,
  deleteTask,
  toggleTask,
  updateTask,
} from "@/lib/task-repository";

export async function createTaskAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const parsed = createTaskSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await createTask(parsed.data);

    revalidatePath("/");

    return {
      success: true,
      message: "Task created successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to create task",
    };
  }
}

export async function updateTaskAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawData = {
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const parsed = updateTaskSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await updateTask(parsed.data);

    revalidatePath("/");

    return {
      success: true,
      message: "Task updated successfully",
    };
  } catch {
    return {
      success: false,
      message: "Failed to update task",
    };
  }
}

export async function deleteTaskAction(formData: FormData) {
  const rawData = {
    id: formData.get("id"),
  };

  const parsed = taskIdSchema.safeParse(rawData);

  if (!parsed.success) {
    return;
  }

  try {
    await deleteTask(parsed.data.id);
    revalidatePath("/");
  } catch {}
}

export async function toggleTaskAction(formData: FormData) {
  const rawId = formData.get("id");
  const rawCompleted = formData.get("completed");

  const parsed = taskIdSchema.safeParse({ id: rawId });

  if (!parsed.success) {
    return;
  }

  try {
    await toggleTask(parsed.data.id, rawCompleted === "true");
    revalidatePath("/");
  } catch {}
}
