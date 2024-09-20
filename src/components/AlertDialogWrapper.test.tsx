import AlertDialogWrapper from "@/components/AlertDialogWrapper";
import { Button } from "@/components/ui/button";
import content from "@/data/content.json";
import { fireEvent, render, screen } from "@testing-library/react";

describe("AlertDialogWrapper", () => {
  it("renders the alert dialog when triggered", () => {
    const onContinueMock = jest.fn();

    render(
      <AlertDialogWrapper onContinue={onContinueMock}>
        <Button>{content.button.delete}</Button>
      </AlertDialogWrapper>
    );

    const triggerButton = screen.getByText(content.button.delete);
    expect(triggerButton).toBeInTheDocument();

    fireEvent.click(triggerButton);

    expect(screen.getByText(/Are you absolutely sure?/i)).toBeInTheDocument();
  });

  it("calls onContinue when continue button is clicked", () => {
    const onContinueMock = jest.fn();

    render(
      <AlertDialogWrapper onContinue={onContinueMock}>
        <Button>{content.button.delete}</Button>
      </AlertDialogWrapper>
    );

    fireEvent.click(screen.getByText(content.button.delete));
    fireEvent.click(screen.getByText(/Continue/i));

    expect(onContinueMock).toHaveBeenCalled();
  });
});
