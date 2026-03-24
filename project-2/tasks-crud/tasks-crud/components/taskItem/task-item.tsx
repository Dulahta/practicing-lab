"use client";

import { useActionState, useState } from "react";
import type { Task } from "@prisma/client";
import { updateTaskAction } from "@/app/actions/task-actions";
import type { ActionState } from "@/lib/types";
import styles from "./task-item.module.css";

const initialState: ActionState = {
  success: false,
  message: "",
};

export function TaskItem({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateTaskAction,
    initialState,
  );

  return (
    <div className={styles.item}>
      {!isEditing ? (
        <>
          <div className={styles.content}>
            <h3
              className={task.completed ? styles.completedTitle : styles.title}
            >
              {task.title}
            </h3>
            {task.description ? (
              <p className={styles.description}>{task.description}</p>
            ) : null}
          </div>

          <button
            type="button"
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </>
      ) : (
        <form action={formAction} className={styles.editForm}>
          <input type="hidden" name="id" value={task.id} />

          <div className={styles.group}>
            <label htmlFor={`title-${task.id}`} className={styles.label}>
              Title
            </label>
            <input
              id={`title-${task.id}`}
              name="title"
              defaultValue={task.title}
              className={styles.input}
            />
            {state.errors?.title && (
              <p className={styles.error}>{state.errors.title[0]}</p>
            )}
          </div>

          <div className={styles.group}>
            <label htmlFor={`description-${task.id}`} className={styles.label}>
              Description
            </label>
            <textarea
              id={`description-${task.id}`}
              name="description"
              defaultValue={task.description ?? ""}
              className={styles.textarea}
            />
            {state.errors?.description && (
              <p className={styles.error}>{state.errors.description[0]}</p>
            )}
          </div>

          {state.message ? (
            <p className={state.success ? styles.success : styles.error}>
              {state.message}
            </p>
          ) : null}

          <div className={styles.actions}>
            <button
              type="submit"
              disabled={pending}
              className={styles.saveButton}
            >
              {pending ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
