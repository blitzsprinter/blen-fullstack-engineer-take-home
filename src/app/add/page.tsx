import TaskForm from "@/components/TaskForm";
import { OperationType } from "@/lib/enums";

export default function Add() {
  return (
    <div className="container flex min-h-screen w-full items-center justify-center p-6">
      <TaskForm type={OperationType.Create} />
    </div>
  );
}
