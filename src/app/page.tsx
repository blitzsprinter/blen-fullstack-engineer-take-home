import TodoListTable from "@/components/ToDoListTable";
import content from "@/data/content.json";
import { getTasks } from "@/db/actions";
import { Task } from "@/db/schema";

export default async function Home() {
  const tasks = await getTasks();
  const incompleteTasks = tasks.filter((task: Task) => !task.isCompleted);

  return (
    <div className="container justify-center py-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">{content.page.list.title.incomplete}</h1>
        <TodoListTable data={incompleteTasks} />
      </div>
    </div>
  );
}
