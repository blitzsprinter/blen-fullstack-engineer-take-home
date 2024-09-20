import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import content from "@/data/content.json";

const AlertDialogWrapper = ({
  children,
  onContinue,
}: {
  children: React.ReactNode;
  onContinue: () => void;
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{content.message.deleteConfirmation.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {content.message.deleteConfirmation.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel aria-label="Delete Dialog Confirm Cancel">
            {content.button.cancel}
          </AlertDialogCancel>
          <AlertDialogAction aria-label="Delete Dialog Confirm Button" onClick={onContinue}>
            {content.button.continue}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogWrapper;
