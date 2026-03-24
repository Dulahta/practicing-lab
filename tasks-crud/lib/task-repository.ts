import { prisma } from "@/lib/prisma";
import type { CreateTaskInput, UpdateTaskInput } from "@/schemas/task.schema";

export async function getTasks() {
  return prisma.task.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      completed: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createTask(data: CreateTaskInput) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
    },
  });
}

export async function updateTask(data: UpdateTaskInput) {
  return prisma.task.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title,
      description: data.description || null,
    },
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: {
      id,
    },
  });
}

export async function toggleTask(id: string, completed: boolean) {
  return prisma.task.update({
    where: {
      id,
    },
    data: {
      completed,
    },
  });
}
