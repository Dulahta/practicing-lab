import { getTasks } from "@/lib/task-repository";
import styles from "./page.module.css";
import { TaskForm } from "@/components/taskForm/task-form";
import { TaskList } from "@/components/taskList/task-list";

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Tasks CRUD</h1>
        <TaskForm />
        <TaskList tasks={tasks} />
      </div>
    </main>
  );
}
