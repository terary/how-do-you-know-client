"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  useCreateExamTemplateMutation,
  type CreateExamTemplateDto,
} from "@/lib/features/exam-templates/examTemplatesApiSlice";
import { useGetInstructionalCoursesQuery } from "@/lib/features/instructional-courses/instructionalCoursesApiSlice";
import { useToast } from "@/lib/hooks/useToast";

export default function NewExamTemplatePage() {
  const router = useRouter();
  const toast = useToast();
  const [createTemplate, { isLoading: isCreating }] =
    useCreateExamTemplateMutation();
  const { data: courses = [], isLoading: isLoadingCourses } =
    useGetInstructionalCoursesQuery();

  const [formData, setFormData] = useState<CreateExamTemplateDto>({
    name: "",
    description: "",
    course_id: "",
    availability_start_date: new Date().toISOString(),
    availability_end_date: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    examExclusivityType: "exam-practice-both",
  });

  const handleSubmit = async () => {
    try {
      await createTemplate(formData).unwrap();
      toast.info("Exam template created successfully");
      router.push("/exam-templates");
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Failed to create exam template";
      toast.error(errorMessage);
      console.error("Failed to create template:", error);
    }
  };

  if (isLoadingCourses) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Create New Exam Template
      </Typography>

      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 3, maxWidth: 600 }}
      >
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
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
          multiline
          rows={3}
        />

        <FormControl fullWidth required>
          <InputLabel>Course</InputLabel>
          <Select
            value={formData.course_id}
            label="Course"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, course_id: e.target.value }))
            }
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel>Type</InputLabel>
          <Select
            value={formData.examExclusivityType}
            label="Type"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                examExclusivityType: e.target
                  .value as CreateExamTemplateDto["examExclusivityType"],
              }))
            }
          >
            <MenuItem value="exam-only">Exam Only</MenuItem>
            <MenuItem value="practice-only">Practice Only</MenuItem>
            <MenuItem value="exam-practice-both">Exam and Practice</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Start Date"
          type="datetime-local"
          value={formData.availability_start_date.slice(0, 16)}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              availability_start_date: new Date(e.target.value).toISOString(),
            }))
          }
          required
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="End Date"
          type="datetime-local"
          value={formData.availability_end_date.slice(0, 16)}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              availability_end_date: new Date(e.target.value).toISOString(),
            }))
          }
          required
          InputLabelProps={{ shrink: true }}
        />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button onClick={() => router.back()}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Template"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
