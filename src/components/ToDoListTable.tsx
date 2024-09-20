"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Check, ChevronDown, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import AlertDialogWrapper from "@/components/AlertDialogWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { priorityDetails } from "@/constants/priority";
import content from "@/data/content.json";
import { deleteTask, deleteTasksById, markAsCompleted } from "@/db/actions";
import { Task } from "@/db/schema";
import { Priority } from "@/lib/enums";
import { ActionResponse } from "@/lib/types";

interface TodoListTableProps {
  data: Task[];
}

export default function TodoListTable({ data }: TodoListTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const router = useRouter();

  const columns: ColumnDef<Task>[] = [
    // Select column
    {
      id: content.label.select.accessorKey,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={content.label.select.ariaLabel.header}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={content.label.select.ariaLabel.cell}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // Title column
    {
      accessorKey: content.label.title.accessorKey,
      header: content.label.title.text,
      cell: ({ row }) => (
        <div className="min-w-80 max-w-96 capitalize">
          <Link href={`/${row.original.id}`} className="hover:underline">
            {row.getValue(content.label.title.accessorKey)}
          </Link>
        </div>
      ),
      enableHiding: false,
    },
    // Priority column
    {
      accessorKey: content.label.priority.accessorKey,
      header: content.label.priority.text,
      cell: ({ row }) => {
        const priority = row.getValue(content.label.priority.accessorKey) as Priority;
        const priorityText = priorityDetails[priority].text ?? "Unknown";
        const priorityColor = priorityDetails[priority].color ?? "#EEEEEE";

        return <Badge style={{ backgroundColor: `${priorityColor}` }}>{priorityText}</Badge>;
      },
    },
    // Due Date column
    {
      accessorKey: content.label.dueDate.accessorKey,
      header: () => <div className="text-right">{content.label.dueDate.text}</div>,
      cell: ({ row }) => {
        const dueDate: Date = row.getValue(content.label.dueDate.accessorKey);
        return <div className="text-right">{new Date(dueDate).toLocaleDateString()}</div>;
      },
    },
    // Created At column
    {
      accessorKey: content.label.createdAt.accessorKey,
      header: () => <div className="text-right">{content.label.createdAt.text}</div>,
      cell: ({ row }) => {
        const createdAt: Date = row.getValue(content.label.createdAt.accessorKey);
        return <div className="text-right">{new Date(createdAt).toLocaleDateString()}</div>;
      },
    },
    // Updated At column
    {
      accessorKey: content.label.updatedAt.accessorKey,
      header: () => <div className="text-right">{content.label.updatedAt.text}</div>,
      cell: ({ row }) => {
        const updatedAt: Date = row.getValue(content.label.updatedAt.accessorKey);
        return <div className="text-right">{new Date(updatedAt).toLocaleDateString()}</div>;
      },
    },
    // Actions column
    {
      id: content.label.actions.accessorKey,
      header: () => <div className="text-right">{content.label.actions.text}</div>,
      cell: ({ row }) => {
        const handleMarkAsCompleted = async () => {
          const response: ActionResponse = await markAsCompleted(row.original.id);
          toast(response.message);

          if (response.success) {
            router.refresh();
          }
        };

        const handleDeleteTask = async () => {
          const response: ActionResponse = await deleteTask(row.original.id);
          toast(response.message);

          if (response.success) {
            router.refresh();
          }
        };

        return (
          <div className="flex justify-end gap-2">
            <Button
              data-testid={`action-mark-completed-${row.original.id}`}
              variant="outline"
              size="icon"
              aria-label={content.button.mark}
              title={content.button.mark}
              onClick={handleMarkAsCompleted}>
              <Check className="h-4 w-4" />
            </Button>

            <Button
              data-testid={`action-edit-${row.original.id}`}
              variant="outline"
              size="icon"
              aria-label={content.button.edit}
              title={content.button.edit}
              onClick={() => router.push(`/${row.original.id}/edit?redirect=/`)}>
              <Edit className="h-4 w-4" />
            </Button>

            <AlertDialogWrapper onContinue={handleDeleteTask}>
              <Button
                data-testid={`action-delete-${row.original.id}`}
                variant="destructive"
                size="icon"
                aria-label={content.button.delete}
                title={content.button.delete}>
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogWrapper>
          </div>
        );
      },
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDeleteMultipleTasks = async () => {
    const selectedIds: number[] = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id);

    const response: ActionResponse = await deleteTasksById(selectedIds);

    toast(response.message);

    if (response.success) {
      router.refresh();
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder={content.page.list.filter}
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm bg-white"
        />

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {content.label.columns.text} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href={"/add?redirect=/"}>
            <Button>{content.button.create}</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border bg-white p-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} scope="col">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {content.page.list.empty}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground" aria-live="polite">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <AlertDialogWrapper onContinue={handleDeleteMultipleTasks}>
            <Button variant="destructive">{content.button.deleteSelection}</Button>
          </AlertDialogWrapper>
        )}
      </div>
    </div>
  );
}
