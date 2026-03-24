"use client";

import { useActionState } from "react";
import { createTaskAction } from "@/app/actions/task-actions";
import type { ActionState } from "@/lib/types";
import styles from "./task-form.module.css";

const initialState: ActionState = {
  success: false,
  message: "",
};

export function TaskForm() {
  const [state, formAction, pending] = useActionState(
    createTaskAction,
    initialState,
  );

  return (
    <form action={formAction} className={styles.form}>
      <h2 className={styles.heading}>Create a task</h2>

      <div className={styles.group}>
        <label htmlFor="title" className={styles.label}>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={styles.input}
          placeholder="Enter task title"
        />
        {state.errors?.title && (
          <p className={styles.error}>{state.errors.title[0]}</p>
        )}
      </div>

      <div className={styles.group}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className={styles.textarea}
          placeholder="Enter task description"
        />
        {state.errors?.description && (
          <p className={styles.error}>{state.errors.description[0]}</p>
        )}
      </div>

      <button type="submit" disabled={pending} className={styles.button}>
        {pending ? "Creating..." : "Create task"}
      </button>

      {state.message ? (
        <p className={state.success ? styles.success : styles.errorMessage}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
