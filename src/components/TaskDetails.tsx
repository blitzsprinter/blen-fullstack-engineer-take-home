"use client";

import { format } from "date-fns";
import { ArrowLeft, Check, Edit, Trash, Undo } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AlertDialogWrapper from "@/components/AlertDialogWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { priorityDetails } from "@/constants/priority";
import content from "@/data/content.json";
import { deleteTask, markAsCompleted, markAsIncomplete } from "@/db/actions";
import { Task } from "@/db/schema";

const TaskDetails = ({ task }: { task: Task }) => {
  const priorityText = priorityDetails[task.priority].text ?? "Unknown";
  const priorityColor = priorityDetails[task.priority].color ?? "#EEEEEE";

  const router = useRouter();

  const handleCheck = async () => {
    const response = task.isCompleted
      ? await markAsIncomplete(task.id)
      : await markAsCompleted(task.id);
    toast(response.message);

    if (response.success) {
      router.refresh();
    }
  };

  const handleDelete = async () => {
    const response = await deleteTask(task.id);
    toast(response.message);

    if (response.success) {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col gap-4 py-8">
      <div className="flex flex-wrap gap-2">
        <Link href={"/"}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> {content.button.back}
          </Button>
        </Link>

        <Button
          data-testid="action-mark-toggle"
          aria-label={task.isCompleted ? content.button.unMark : content.button.mark}
          variant="outline"
          onClick={handleCheck}>
          {task.isCompleted ? (
            <>
              <Undo className="mr-2 h-4 w-4" /> {content.button.unMark}
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" /> {content.button.mark}
            </>
          )}
        </Button>

        <Button
          data-testid="action-edit"
          aria-label={content.button.edit}
          variant="outline"
          onClick={() => router.push(`/${task.id}/edit?redirect=/${task.id}`)}>
          <Edit className="mr-2 h-4 w-4" /> {content.button.edit}
        </Button>

        <AlertDialogWrapper onContinue={handleDelete}>
          <Button
            data-testid="action-delete"
            aria-label={content.button.delete}
            variant="destructive">
            <Trash className="mr-2 h-4 w-4" /> {content.button.delete}
          </Button>
        </AlertDialogWrapper>
      </div>

      <h1 className="mt-8 text-3xl">{task.title}</h1>

      <div className="flex gap-2">
        {task.isCompleted ? (
          <Badge style={{ backgroundColor: content.page.details.completed.color }}>
            {content.page.details.completed.text}
          </Badge>
        ) : (
          <Badge style={{ backgroundColor: content.page.details.todo.color }}>
            {content.page.details.todo.text}
          </Badge>
        )}

        <Badge style={{ backgroundColor: `${priorityColor}` }}>{priorityText}</Badge>
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <p>
          <b>{content.page.details.dueDate}</b>
          <time dateTime={task.dueDate}>{format(task.dueDate, "PP")}</time>
        </p>
        <p>
          <b>{content.page.details.createdAt}</b>
          <time dateTime={task.createdAt}>{format(task.createdAt, "PP")}</time>
        </p>
        <p>
          <b>{content.page.details.updatedAt}</b>
          <time dateTime={task.updatedAt}>{format(task.updatedAt, "PP")}</time>
        </p>
      </div>

      <p className="mt-4 whitespace-pre-line rounded-md bg-white p-4">{task.description}</p>
    </div>
  );
};

export default TaskDetails;
