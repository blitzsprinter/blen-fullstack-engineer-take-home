import TaskForm from "@/components/TaskForm";
import { OperationType } from "@/lib/enums";
import { render, screen } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@/db/actions", () => ({
  addTask: jest.fn(),
}));

describe("TaskForm", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      refresh: jest.fn(),
    });

    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue("redirect-url"),
    });
  });

  it("should render the form with default values", () => {
    render(<TaskForm type={OperationType.Create} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });
});
