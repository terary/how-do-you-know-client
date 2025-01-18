import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  useGetQuestionsQuery,
  useBulkAddQuestionsMutation,
  Question,
  GetQuestionsParams,
} from "@/lib/features/exam-templates/examTemplatesApiSlice";

interface BulkQuestionsDialogProps {
  examId: string;
  sectionId: string;
  open: boolean;
  onClose: () => void;
}

type Difficulty = "easy" | "medium" | "hard";
type DifficultyFilter = Difficulty | "all";

export const BulkQuestionsDialog = ({
  examId,
  sectionId,
  open,
  onClose,
}: BulkQuestionsDialogProps) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<DifficultyFilter>("all");

  const { data: questions = [], isLoading } = useGetQuestionsQuery({
    search: searchTerm,
    difficulty: filter === "all" ? undefined : (filter as Difficulty),
  });

  const [bulkAddQuestions, { isLoading: isAdding }] =
    useBulkAddQuestionsMutation();

  const handleSubmit = async () => {
    try {
      await bulkAddQuestions({
        examId,
        sectionId,
        questionIds: selectedQuestions,
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to add questions:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Questions</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Search Questions"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={filter}
              label="Difficulty"
              onChange={(e) => setFilter(e.target.value as typeof filter)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Box>

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
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={selectedQuestions.length === 0 || isAdding}
        >
          Add Selected Questions
        </Button>
      </DialogActions>
    </Dialog>
  );
};
