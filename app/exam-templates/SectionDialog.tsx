import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
} from "@mui/material";
import {
  type ExamTemplateSection,
  type CreateExamTemplateSectionDto,
  type UpdateExamTemplateSectionDto,
} from "@/lib/features/exam-templates/examTemplatesApiSlice";

interface SectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExamTemplateSectionDto) => Promise<void>;
  initialData?: Partial<ExamTemplateSection>;
}

export const SectionDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: SectionDialogProps) => {
  const [formData, setFormData] = useState<CreateExamTemplateSectionDto>({
    name: initialData?.name || "",
    instructions: initialData?.instructions || "",
    position: initialData?.position || 0,
    timeLimitSeconds: initialData?.timeLimitSeconds || 3600, // Default 1 hour
  });

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to save section:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData ? "Edit Section" : "Add Section"}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <TextField
            fullWidth
            label="Instructions"
            value={formData.instructions}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, instructions: e.target.value }))
            }
            required
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Time Limit (minutes)"
            type="number"
            value={Math.floor(formData.timeLimitSeconds / 60)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                timeLimitSeconds: Math.max(0, parseInt(e.target.value) * 60),
              }))
            }
            required
            inputProps={{ min: 0 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
