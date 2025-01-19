import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  DragDropContext,
  Draggable as RBDDraggable,
  type DropResult,
  type DroppableProvided,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from "react-beautiful-dnd";
import {
  DragIndicator as DragIndicatorIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
} from "@mui/icons-material";
import {
  useGetSectionQuestionsQuery,
  useReorderSectionQuestionsMutation,
  useDeleteQuestionFromSectionMutation,
  type Question,
} from "@/lib/features/exam-templates/examTemplatesApiSlice";
import { useToast } from "@/lib/hooks/useToast";
import { QuestionPreview } from "./QuestionPreview";
import { StrictModeDroppable } from "./StrictModeDroppable";

interface QuestionWithTemplate extends Question {
  questionTemplate: {
    userPromptType: "text" | "multimedia";
    userPromptText: string;
    userResponseType: string;
  };
}

const formatResponseType = (type: string): string => {
  switch (type) {
    case "one-of-4":
      return "Multiple Choice (4 options)";
    case "one-of-2":
      return "True/False";
    case "free-text-255":
      return "Short Answer";
    case "any-of":
      return "Multiple Select";
    default:
      return type;
  }
};

const formatExclusivityType = (type: string): string => {
  switch (type) {
    case "exam-only":
      return "Exam Only";
    case "practice-only":
      return "Practice Only";
    case "exam-practice-both":
      return "Exam & Practice";
    default:
      return type;
  }
};

interface ExamTemplateSectionQuestionsProps {
  examId: string;
  sectionId: string;
}

export const ExamTemplateSectionQuestions = ({
  examId,
  sectionId,
}: ExamTemplateSectionQuestionsProps) => {
  const { data: questions = [], isLoading } = useGetSectionQuestionsQuery({
    examId,
    sectionId,
  });
  const [reorderQuestions] = useReorderSectionQuestionsMutation();
  const [deleteQuestion] = useDeleteQuestionFromSectionMutation();
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const toast = useToast();

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    // Create new array with reordered questions
    const reorderedQuestions = Array.from(questions);
    const [removed] = reorderedQuestions.splice(sourceIndex, 1);
    reorderedQuestions.splice(destinationIndex, 0, removed);

    try {
      await reorderQuestions({
        examId,
        sectionId,
        questionIds: reorderedQuestions.map((q) => q.id),
      }).unwrap();
    } catch (error) {
      console.error("Failed to reorder questions:", error);
      toast.error("Failed to reorder questions");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion({
        examId,
        sectionId,
        questionId,
      }).unwrap();
      toast.info("Question removed from section");
    } catch (error) {
      console.error("Failed to delete question:", error);
      toast.error("Failed to remove question from section");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Questions ({questions.length})
      </Typography>

      {questions.length === 0 ? (
        <Typography color="text.secondary">
          No questions in this section. Use the bulk add button to add
          questions.
        </Typography>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <StrictModeDroppable
            droppableId={`section-${sectionId}-questions`}
            isDropDisabled={false}
            isCombineEnabled={false}
            ignoreContainerClipping={false}
          >
            {(provided: DroppableProvided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps}>
                {questions.map((question, index) => (
                  <RBDDraggable
                    key={question.id}
                    draggableId={question.id}
                    index={index}
                  >
                    {(
                      provided: DraggableProvided,
                      snapshot: DraggableStateSnapshot
                    ) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{
                          mb: 2,
                          opacity: snapshot.isDragging ? 0.5 : 1,
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Box
                              {...provided.dragHandleProps}
                              sx={{ cursor: "grab", display: "flex" }}
                            >
                              <DragIndicatorIcon
                                sx={{ color: "text.secondary" }}
                              />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography>
                                {(question as any).questionTemplate
                                  .userPromptType === "text"
                                  ? (question as any).questionTemplate
                                      .userPromptText
                                  : (question as any).questionTemplate
                                      .userPromptType}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Response Type:{" "}
                                {formatResponseType(
                                  (question as any).questionTemplate
                                    .userResponseType
                                )}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </RBDDraggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      )}

      <Dialog
        open={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Question Preview</DialogTitle>
        <DialogContent>
          {selectedQuestion && <QuestionPreview question={selectedQuestion} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedQuestion(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
