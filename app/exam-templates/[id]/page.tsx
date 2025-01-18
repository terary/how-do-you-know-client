"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import {
  useGetExamTemplateQuery,
  useDeleteExamTemplateMutation,
} from "@/lib/features/exam-templates/examTemplatesApiSlice";
import { ExamTemplateSections } from "../ExamTemplateSections";
import { useToast } from "@/lib/hooks/useToast";

export default function ExamTemplateDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const toast = useToast();
  const { data: template, isLoading } = useGetExamTemplateQuery(id);
  const [deleteTemplate] = useDeleteExamTemplateMutation();

  const handleDelete = async () => {
    try {
      await deleteTemplate(id).unwrap();
      toast.info("Exam template deleted successfully");
      router.push("/exam-templates");
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete exam template");
    }
  };

  if (!id) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Invalid template ID</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!template) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Template not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            {template.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {template.description}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
            sx={{ ml: 2 }}
          >
            Delete Template
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Template Details
        </Typography>
        <Typography variant="body2">
          Type: {template.examExclusivityType.replace(/-/g, " ")}
        </Typography>
        <Typography variant="body2">
          Available from:{" "}
          {new Date(template.availability_start_date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2">
          Available until:{" "}
          {new Date(template.availability_end_date).toLocaleDateString()}
        </Typography>
      </Paper>

      <ExamTemplateSections examId={id} />
    </Box>
  );
}
