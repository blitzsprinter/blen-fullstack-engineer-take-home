import TodoListTable from "@/components/ToDoListTable";
import mockData from "@/data/mock.json";
import { Task } from "@/db/schema";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const toDoTasks: Task[] = mockData.filter((task) => !task.isCompleted);

describe("ToDoListTable", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      refresh: jest.fn(),
    });
  });

  it("should render the to do task list", () => {
    render(<TodoListTable data={toDoTasks} />);
    expect(screen.getByText(mockData[3].title)).toBeInTheDocument();
  });

  it("should render 'Mark As Completed' action button", () => {
    render(<TodoListTable data={toDoTasks} />);

    const taskId = 4;
    const markAsCompletedButton = screen.getByTestId(`action-mark-completed-${taskId}`);

    expect(markAsCompletedButton).toBeInTheDocument();
  });

  it("should render the edit action button", () => {
    render(<TodoListTable data={toDoTasks} />);

    const taskId = 4;
    const editButton = screen.getByTestId(`action-edit-${taskId}`);

    expect(editButton).toBeInTheDocument();
  });

  it("should render the delete action button with dialog popup", () => {
    render(<TodoListTable data={toDoTasks} />);

    const taskId = 4;
    const deleteButton = screen.getByTestId(`action-delete-${taskId}`);

    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByText(/Continue/i));
  });
});
