"use client";

import type { Task } from "@prisma/client";
import { deleteTaskAction, toggleTaskAction } from "@/app/actions/task-actions";
import styles from "./task-list.module.css";
import { TaskItem } from "../taskItem/task-item";

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p className={styles.empty}>No tasks yet.</p>;
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <li key={task.id} className={styles.card}>
          <div className={styles.topRow}>
            <TaskItem task={task} />

            <div className={styles.sideActions}>
              <form action={toggleTaskAction}>
                <input type="hidden" name="id" value={task.id} />
                <input
                  type="hidden"
                  name="completed"
                  value={String(!task.completed)}
                />
                <button type="submit" className={styles.actionButton}>
                  {task.completed ? "Undo" : "Done"}
                </button>
              </form>

              <form action={deleteTaskAction}>
                <input type="hidden" name="id" value={task.id} />
                <button type="submit" className={styles.deleteButton}>
                  Delete
                </button>
              </form>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
