"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { priorityOptions } from "@/constants/priority";
import content from "@/data/content.json";
import { addTask, updateTask } from "@/db/actions";
import { Task } from "@/db/schema";
import { OperationType, Priority } from "@/lib/enums";
import { revalidate } from "@/lib/helpers";
import { taskSchema } from "@/lib/validations";

interface TaskFormProps {
  type: OperationType;
  defaultValues?: Task | null;
}

const TaskForm = ({
  type,
  defaultValues = {
    id: 0,
    title: "",
    description: "",
    priority: Priority.Low,
    dueDate: new Date().toISOString(),
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
}: TaskFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: defaultValues?.title,
      description: defaultValues?.description,
      priority: defaultValues?.priority,
      isCompleted: defaultValues?.isCompleted,
      dueDate: defaultValues?.dueDate,
    },
  });

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    const response =
      type === OperationType.Create
        ? await addTask(values)
        : await updateTask(defaultValues?.id ?? 0, { ...defaultValues, ...values });
    toast(response.message);

    if (response.success) {
      form.reset();
      await revalidate("/");
      router.push(redirect ?? "/");
    }
  };

  return (
    <Card className="w-[512px]">
      <CardHeader>
        <CardTitle>
          {type === OperationType.Create ? content.page.add.title : content.page.update.title}
        </CardTitle>

        <CardDescription>
          {type === OperationType.Create
            ? content.page.add.description
            : content.page.update.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-center gap-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="title">{content.label.title.text}</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      aria-describedby="title-error"
                      placeholder={content.label.title.placeholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="title-error" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description">{content.label.description.text}</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      aria-describedby="description-error"
                      placeholder={content.label.description.placeholder}
                      rows={10}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage id="description-error" />
                </FormItem>
              )}
            />

            {/* Priority */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="priority">{content.label.priority.text}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value.toString()}>
                      <SelectTrigger id="priority" aria-describedby="priority-error">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage id="priority-error" />
                </FormItem>
              )}
            />

            {/* Due Date Field */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => {
                const [popoverOpen, setPopoverOpen] = useState(false);

                return (
                  <FormItem>
                    <FormLabel htmlFor="dueDate">{content.label.dueDate.text}</FormLabel>

                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          id="dueDate"
                          aria-label={content.label.dueDate.text}
                          aria-describedby="dueDate-error"
                          variant="outline"
                          className="w-full justify-start text-left font-normal text-muted-foreground"
                          onClick={() => setPopoverOpen(true)}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "PP")
                          ) : (
                            <span>{content.label.dueDate.placeholder}</span>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date?.toISOString());
                            setPopoverOpen(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage id="dueDate-error" />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => router.push(redirect ?? "/")}>
          {content.button.cancel}
        </Button>

        <Button
          data-testid="submit"
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={!form.formState.isValid}>
          {type === OperationType.Create ? content.button.create : content.button.edit}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskForm;
