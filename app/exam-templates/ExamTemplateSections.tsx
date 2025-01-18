import { useState } from "react";
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
  DropResult,
  DroppableProvided,
  DraggableProvided,
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

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const section = sections[sourceIndex];
    const updates = sections
      .slice(
        Math.min(sourceIndex, destinationIndex),
        Math.max(sourceIndex, destinationIndex) + 1
      )
      .map((s, i) => ({
        id: s.id,
        position:
          sourceIndex < destinationIndex
            ? s.id === section.id
              ? destinationIndex
              : i + Math.min(sourceIndex, destinationIndex)
            : s.id === section.id
            ? destinationIndex
            : i + Math.min(sourceIndex, destinationIndex),
      }));

    try {
      await Promise.all(
        updates.map(({ id, position }) =>
          updateSection({
            examId,
            sectionId: id,
            section: { position } as UpdateExamTemplateSectionDto,
          }).unwrap()
        )
      );
    } catch (error) {
      console.error("Failed to reorder sections:", error);
    }
  };

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
        <Droppable droppableId="sections">
          {(provided: DroppableProvided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {sections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
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
                            <Typography variant="h6">{section.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      <SectionDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedSection(null);
        }}
        onSubmit={selectedSection ? handleUpdateSubmit : handleCreateSubmit}
        initialData={sections.find((s) => s.id === selectedSection)}
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
