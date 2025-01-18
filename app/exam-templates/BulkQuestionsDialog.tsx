import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  useGetQuestionsQuery,
  useGetExamTemplateSectionsQuery,
  useBulkAddQuestionsMutation,
  useDeleteQuestionFromSectionMutation,
  Question,
} from "@/lib/features/exam-templates/examTemplatesApiSlice";
import { useToast } from "@/lib/hooks/useToast";

interface BulkQuestionsDialogProps {
  examId: string;
  sectionId: string;
  open: boolean;
  onClose: () => void;
}

export const BulkQuestionsDialog = ({
  examId,
  sectionId,
  open,
  onClose,
}: BulkQuestionsDialogProps) => {
  const { data: questions = [], isLoading } = useGetQuestionsQuery({});
  const { data: sections = [] } = useGetExamTemplateSectionsQuery(examId);
  const [addQuestions] = useBulkAddQuestionsMutation();
  const [deleteQuestion] = useDeleteQuestionFromSectionMutation();
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [targetSectionId, setTargetSectionId] = useState<string>("");
  const toast = useToast();

  // Reset selections when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedQuestions([]);
      setTargetSectionId("");
    }
  }, [open]);

  const handleAddQuestions = async () => {
    if (selectedQuestions.length === 0) {
      toast.error("Please select questions to add");
      return;
    }

    try {
      await addQuestions({
        examId,
        sectionId,
        questionIds: selectedQuestions,
      }).unwrap();
      toast.info(`Added ${selectedQuestions.length} questions to section`);
      onClose();
    } catch (error) {
      console.error("Failed to add questions:", error);
      toast.error("Failed to add questions to section");
    }
  };

  const handleMoveQuestions = async () => {
    if (selectedQuestions.length === 0) {
      toast.error("Please select questions to move");
      return;
    }

    if (!targetSectionId) {
      toast.error("Please select a target section");
      return;
    }

    try {
      // First, add questions to the target section
      await addQuestions({
        examId,
        sectionId: targetSectionId,
        questionIds: selectedQuestions,
      }).unwrap();

      // Then, delete them from the current section
      await Promise.all(
        selectedQuestions.map((questionId) =>
          deleteQuestion({
            examId,
            sectionId,
            questionId,
          }).unwrap()
        )
      );

      toast.info(
        `Moved ${selectedQuestions.length} questions to selected section`
      );
      onClose();
    } catch (error) {
      console.error("Failed to move questions:", error);
      toast.error("Failed to move questions between sections");
    }
  };

  const handleDeleteQuestions = async () => {
    if (selectedQuestions.length === 0) {
      toast.error("Please select questions to remove");
      return;
    }

    try {
      await Promise.all(
        selectedQuestions.map((questionId) =>
          deleteQuestion({
            examId,
            sectionId,
            questionId,
          }).unwrap()
        )
      );
      toast.info(`Removed ${selectedQuestions.length} questions from section`);
      onClose();
    } catch (error) {
      console.error("Failed to remove questions:", error);
      toast.error("Failed to remove questions from section");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Manage Questions</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Selected: {selectedQuestions.length} questions
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Move to Section</InputLabel>
            <Select
              value={targetSectionId}
              label="Move to Section"
              onChange={(e) => setTargetSectionId(e.target.value)}
            >
              {sections
                .filter((section) => section.id !== sectionId)
                .map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : questions.length === 0 ? (
          <Typography>No questions found</Typography>
        ) : (
          <Box sx={{ maxHeight: "50vh", overflow: "auto" }}>
            {questions.map((question: Question) => (
              <Box
                key={question.id}
                sx={{
                  p: 2,
                  mb: 1,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  cursor: "pointer",
                  bgcolor: selectedQuestions.includes(question.id)
                    ? "action.selected"
                    : "background.paper",
                }}
                onClick={() => {
                  setSelectedQuestions((prev) =>
                    prev.includes(question.id)
                      ? prev.filter((id) => id !== question.id)
                      : [...prev, question.id]
                  );
                }}
              >
                <Typography variant="subtitle1">{question.text}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Difficulty: {question.difficulty}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3 }}>
        <Box>
          <Button
            color="error"
            onClick={handleDeleteQuestions}
            disabled={selectedQuestions.length === 0}
          >
            Remove Selected
          </Button>
        </Box>
        <Box>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddQuestions}
            disabled={selectedQuestions.length === 0}
            sx={{ mr: 1 }}
          >
            Add Selected
          </Button>
          <Button
            variant="contained"
            onClick={handleMoveQuestions}
            disabled={selectedQuestions.length === 0 || !targetSectionId}
          >
            Move Selected
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
