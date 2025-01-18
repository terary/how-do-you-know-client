import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "react-beautiful-dnd";
import {
  DragIndicator as DragIndicatorIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  useGetSectionQuestionsQuery,
  useReorderSectionQuestionsMutation,
  Question,
} from "@/lib/features/exam-templates/examTemplatesApiSlice";

interface ExamTemplateSectionQuestionsProps {
  examId: string;
  sectionId: string;
}

export const ExamTemplateSectionQuestions = ({
  examId,
  sectionId,
}: ExamTemplateSectionQuestionsProps) => {
  const { data: questions = [], isLoading } =
    useGetSectionQuestionsQuery(sectionId);
  const [reorderQuestions] = useReorderSectionQuestionsMutation();

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
          <Droppable droppableId={`section-${sectionId}-questions`}>
            {(provided: DroppableProvided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps}>
                {questions.map((question, index) => (
                  <Draggable
                    key={question.id}
                    draggableId={question.id}
                    index={index}
                  >
                    {(provided: DraggableProvided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ mb: 2 }}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center">
                            <Box {...provided.dragHandleProps}>
                              <DragIndicatorIcon />
                            </Box>
                            <Box ml={2} flexGrow={1}>
                              <Typography>{question.text}</Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                              >
                                Difficulty: {question.difficulty}
                              </Typography>
                            </Box>
                            <IconButton size="small">
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Box>
  );
};
