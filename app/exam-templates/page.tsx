"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  useGetExamTemplatesQuery,
  useDeleteExamTemplateMutation,
  type ExamTemplate,
} from "@/lib/features/exam-templates/examTemplatesApiSlice";
import { useRouter } from "next/navigation";

export default function ExamTemplatesPage() {
  const router = useRouter();
  const { data: templates = [], isLoading } = useGetExamTemplatesQuery();
  const [deleteTemplate] = useDeleteExamTemplateMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id).unwrap();
    } catch (error) {
      console.error("Failed to delete template:", error);
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4">Exam Templates</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/exam-templates/new")}
        >
          Create Template
        </Button>
      </Box>

      {templates.length === 0 ? (
        <Typography>No exam templates found</Typography>
      ) : (
        <Box sx={{ display: "grid", gap: 2 }}>
          {templates.map((template: ExamTemplate) => (
            <Card key={template.id}>
              <CardContent>
                <Typography variant="h6">{template.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {template.description}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    Type: {template.examExclusivityType.replace(/-/g, " ")}
                  </Typography>
                  <Typography variant="body2">
                    Available from:{" "}
                    {new Date(
                      template.availability_start_date
                    ).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    Available until:{" "}
                    {new Date(
                      template.availability_end_date
                    ).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => router.push(`/exam-templates/${template.id}`)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(template.id)}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() =>
                    router.push(`/exam-templates/${template.id}/preview`)
                  }
                >
                  <PreviewIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
