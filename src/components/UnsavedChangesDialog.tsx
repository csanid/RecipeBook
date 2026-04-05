import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'

interface UnsavedChangesDialogProps {
  isOpen: boolean
  onKeepEditing: () => void
  onDiscard: () => void
}

export function UnsavedChangesDialog({ isOpen, onKeepEditing, onDiscard }: UnsavedChangesDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onKeepEditing}>
      <AlertDialogContent data-testid="discard-changes-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Are you sure you want to close this window and lose your changes?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onKeepEditing} data-testid="unsaved-changes-cancel">
            Keep Editing
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDiscard}
            className="bg-red-500 hover:bg-red-600"
            data-testid="unsaved-changes-confirm"
          >
            Discard Changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
