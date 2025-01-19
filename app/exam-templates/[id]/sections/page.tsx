"use client";

import { Box, Typography, CircularProgress } from "@mui/material";
import { useParams } from "next/navigation";
import { useGetExamTemplateQuery } from "@/lib/features/exam-templates/examTemplatesApiSlice";
import { ExamTemplateSections } from "@/app/exam-templates/ExamTemplateSections";

export default function ExamTemplateSectionsPage() {
  const { id } = useParams();
  const { data: template, isLoading } = useGetExamTemplateQuery(id as string);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!template) {
    return <Typography color="error">Template not found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {template.name}
      </Typography>
      <ExamTemplateSections examId={template.id} />
    </Box>
  );
}
