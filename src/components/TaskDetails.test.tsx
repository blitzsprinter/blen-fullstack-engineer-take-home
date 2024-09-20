import TaskDetails from "@/components/TaskDetails";
import mockData from "@/data/mock.json";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("TaskDetails", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      refresh: jest.fn(),
    });
  });

  it("should render the task details", () => {
    render(<TaskDetails task={mockData[0]} />);

    expect(screen.getByText(mockData[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockData[0].description)).toBeInTheDocument();
  });

  it("should render status toggle action button", () => {
    render(<TaskDetails task={mockData[0]} />);
    const markToggleButton = screen.getByTestId("action-mark-toggle");
    expect(markToggleButton).toBeInTheDocument();
  });

  it("should render the edit action button", () => {
    render(<TaskDetails task={mockData[0]} />);
    const editButton = screen.getByTestId("action-edit");
    expect(editButton).toBeInTheDocument();
  });

  it("should render the delete action button with dialog popup", () => {
    render(<TaskDetails task={mockData[0]} />);

    const deleteButton = screen.getByTestId("action-delete");

    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByText(/Continue/i));
  });
});
