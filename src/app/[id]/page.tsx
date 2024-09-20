import TaskDetails from "@/components/TaskDetails";
import { getTaskById } from "@/db/actions";
import { Task } from "@/db/schema";

interface DetailsPageProps {
  params: {
    id: string;
  };
}

export default async function Details({ params }: DetailsPageProps) {
  const { id } = params;
  const task: Task | null = await getTaskById(Number(id));

  return <div className="container justify-center">{task && <TaskDetails task={task} />}</div>;
}
