import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type DroppableProvided,
  type DraggableProvided,
  type DroppableStateSnapshot,
  type DraggableStateSnapshot,
} from "react-beautiful-dnd";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
  QuestionMark as QuestionIcon,
  DragIndicator as DragIndicatorIcon,
} from "@mui/icons-material";
import {
  useGetExamTemplateSectionsQuery,
  useCreateExamTemplateSectionMutation,
  useUpdateExamTemplateSectionMutation,
  useDeleteExamTemplateSectionMutation,
  type ExamTemplateSection,
  type CreateExamTemplateSectionDto,
  type UpdateExamTemplateSectionDto,
} from "@/lib/features/exam-templates/examTemplatesApiSlice";
import { ExamTemplateSectionPreview } from "./ExamTemplateSectionPreview";
import { BulkQuestionsDialog } from "./BulkQuestionsDialog";
import { SectionDialog } from "./SectionDialog";
import { StrictModeDroppable } from "./StrictModeDroppable";

interface ExamTemplateSectionsProps {
  examId: string;
}

export const ExamTemplateSections = ({ examId }: ExamTemplateSectionsProps) => {
  const { data: sections = [], isLoading } =
    useGetExamTemplateSectionsQuery(examId);
  const [createSection] = useCreateExamTemplateSectionMutation();
  const [updateSection] = useUpdateExamTemplateSectionMutation();
  const [deleteSection] = useDeleteExamTemplateSectionMutation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [bulkQuestionsOpen, setBulkQuestionsOpen] = useState(false);

  // Sort sections by position
  const orderedSections = useMemo(
    () => [...sections].sort((a, b) => a.position - b.position),
    [sections]
  );

  const handleCreateSubmit = async (data: CreateExamTemplateSectionDto) => {
    try {
      await createSection({
        examId,
        section: data,
      }).unwrap();
      setDialogOpen(false);
      setSelectedSection(null);
    } catch (error) {
      console.error("Failed to create section:", error);
    }
  };

  const handleUpdateSubmit = async (data: CreateExamTemplateSectionDto) => {
    if (!selectedSection) return;

    try {
      await updateSection({
        examId,
        sectionId: selectedSection,
        section: data,
      }).unwrap();
      setDialogOpen(false);
      setSelectedSection(null);
    } catch (error) {
      console.error("Failed to update section:", error);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await deleteSection({ examId, sectionId }).unwrap();
    } catch (error) {
      console.error("Failed to delete section:", error);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    try {
      const updatedSections = Array.from(orderedSections);
      const [movedSection] = updatedSections.splice(sourceIndex, 1);
      updatedSections.splice(destinationIndex, 0, movedSection);

      await Promise.all(
        updatedSections.map((section, index) =>
          updateSection({
            examId,
            sectionId: section.id,
            section: { position: index } as UpdateExamTemplateSectionDto,
          }).unwrap()
        )
      );
    } catch (error) {
      console.error("Failed to reorder sections:", error);
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
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            setSelectedSection(null);
            setDialogOpen(true);
          }}
        >
          Add Section
        </Button>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <StrictModeDroppable
          droppableId="sections"
          isDropDisabled={false}
          isCombineEnabled={false}
          ignoreContainerClipping={false}
        >
          {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ minHeight: 1 }}
            >
              {orderedSections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(
                    provided: DraggableProvided,
                    snapshot: DraggableStateSnapshot
                  ) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      sx={{
                        mb: 2,
                        opacity: snapshot.isDragging ? 0.8 : 1,
                      }}
                    >
                      <Card>
                        <CardContent>
                          <Box display="flex" alignItems="center">
                            <Box
                              {...provided.dragHandleProps}
                              component="span"
                              sx={{ cursor: "grab" }}
                            >
                              <DragIndicatorIcon />
                            </Box>
                            <Box ml={2} flexGrow={1}>
                              <Typography variant="h6">
                                {section.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {section.instructions}
                              </Typography>
                              {section.timeLimitSeconds && (
                                <Typography variant="body2">
                                  Time Limit: {section.timeLimitSeconds / 60}{" "}
                                  minutes
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Tooltip title="Edit Section">
                            <IconButton
                              onClick={() => {
                                setSelectedSection(section.id);
                                setDialogOpen(true);
                              }}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Section">
                            <IconButton
                              onClick={() => handleDeleteSection(section.id)}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Preview Section">
                            <IconButton
                              onClick={() => {
                                setSelectedSection(section.id);
                                setPreviewOpen(true);
                              }}
                              size="small"
                            >
                              <PreviewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Manage Questions">
                            <IconButton
                              onClick={() => {
                                setSelectedSection(section.id);
                                setBulkQuestionsOpen(true);
                              }}
                              size="small"
                            >
                              <QuestionIcon />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      <SectionDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedSection(null);
        }}
        onSubmit={selectedSection ? handleUpdateSubmit : handleCreateSubmit}
        initialData={orderedSections.find((s) => s.id === selectedSection)}
      />

      <ExamTemplateSectionPreview
        examId={examId}
        sectionId={selectedSection || ""}
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setSelectedSection(null);
        }}
      />

      <BulkQuestionsDialog
        examId={examId}
        sectionId={selectedSection || ""}
        open={bulkQuestionsOpen}
        onClose={() => {
          setBulkQuestionsOpen(false);
          setSelectedSection(null);
        }}
      />
    </Box>
  );
};
