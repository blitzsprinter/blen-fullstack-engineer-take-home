import TaskForm from "@/components/TaskForm";
import { getTaskById } from "@/db/actions";
import { Task } from "@/db/schema";
import { OperationType } from "@/lib/enums";

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function Edit({ params }: EditPageProps) {
  const { id } = params;
  const task: Task | null = await getTaskById(Number(id));

  return (
    <div className="container flex min-h-screen w-full items-center justify-center p-6">
      <TaskForm type={OperationType.Update} defaultValues={task} />
    </div>
  );
}
