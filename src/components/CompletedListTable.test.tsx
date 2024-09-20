import CompletedListTable from "@/components/CompletedListTable";
import mockData from "@/data/mock.json";
import { Task } from "@/db/schema";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const completedTasks: Task[] = mockData.filter((task) => task.isCompleted);

describe("CompletedListTable", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      refresh: jest.fn(),
    });
  });

  it("should render the completed task list", () => {
    render(<CompletedListTable data={completedTasks} />);
    expect(screen.getByText(mockData[6].title)).toBeInTheDocument();
  });

  it("should render 'Mark As To DO' action button", () => {
    render(<CompletedListTable data={completedTasks} />);

    const taskId = 7;
    const markAsToDoButton = screen.getByTestId(`action-mark-todo-${taskId}`);

    expect(markAsToDoButton).toBeInTheDocument();
  });

  it("should render the edit action button", () => {
    render(<CompletedListTable data={completedTasks} />);

    const taskId = 7;
    const editButton = screen.getByTestId(`action-edit-${taskId}`);

    expect(editButton).toBeInTheDocument();
  });

  it("should render the delete action button with dialog popup", () => {
    render(<CompletedListTable data={completedTasks} />);

    const taskId = 7;
    const deleteButton = screen.getByTestId(`action-delete-${taskId}`);

    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByText(/Continue/i));
  });
});
