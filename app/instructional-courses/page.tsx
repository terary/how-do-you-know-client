"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  useGetInstructionalCoursesQuery,
  useDeleteInstructionalCourseMutation,
} from "@/lib/features/instructional-courses/instructionalCoursesApiSlice";
import { InstructionalCourseDialog } from "./InstructionalCourseDialog";

export default function InstructionalCoursesPage() {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: courses, isLoading, error } = useGetInstructionalCoursesQuery();
  const [deleteCourse] = useDeleteInstructionalCourseMutation();

  if (isLoading) {
    return (
      <Container>
        <Typography>{t("Loading...")}</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{t("Error loading courses")}</Typography>
      </Container>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id);
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Typography variant="h4" component="h1">
          {t("Instructional Courses")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          {t("Add Course")}
        </Button>
      </div>

      <Grid container spacing={3}>
        {courses?.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="h6" component="h2" gutterBottom>
                    {course.name}
                  </Typography>
                  <div>
                    <IconButton
                      size="small"
                      onClick={() => console.log("Edit", course.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(course.id)}
                      data-testid="delete-course-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {course.description}
                </Typography>
                <Typography variant="body2">
                  <strong>{t("Institution")}:</strong>{" "}
                  {course.institution?.name || t("Not assigned")}
                </Typography>
                <Typography variant="body2">
                  <strong>{t("Instructor")}:</strong>{" "}
                  {`${course.instructor?.firstName} ${course.instructor?.lastName}` ||
                    t("Not assigned")}
                </Typography>
                <Typography variant="body2">
                  <strong>{t("Schedule")}:</strong>{" "}
                  {course.days_of_week.join(", ")}
                </Typography>
                <Typography variant="body2">
                  <strong>{t("Time")}:</strong> {course.start_time_utc}
                </Typography>
                <Typography variant="body2">
                  <strong>{t("Duration")}:</strong> {course.duration_minutes}{" "}
                  {t("minutes")}
                </Typography>
                <Typography variant="body2">
                  <strong>{t("Period")}:</strong>{" "}
                  {new Date(course.start_date).toLocaleDateString()} -{" "}
                  {new Date(course.finish_date).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <InstructionalCourseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </Container>
  );
}
