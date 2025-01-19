"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";
import {
  School as SchoolIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

// Move mock data outside component
const mockCourses = [
  {
    id: 1,
    name: "Advanced Mathematics",
    progress: 75,
    nextClass: "2024-03-12 10:00:00", // Use ISO date strings
    instructor: "Dr. Sarah Johnson",
  },
  {
    id: 2,
    name: "Physics Fundamentals",
    progress: 60,
    nextClass: "2024-03-13 14:00:00",
    instructor: "Prof. Michael Chen",
  },
  {
    id: 3,
    name: "Chemistry Lab",
    progress: 45,
    nextClass: "2024-03-14 13:00:00",
    instructor: "Dr. Emily Brown",
  },
];

const mockExams = [
  {
    id: 1,
    name: "Mathematics Midterm",
    date: "2024-03-15",
    type: "actual",
  },
  {
    id: 2,
    name: "Physics Practice Quiz",
    date: "2024-03-10",
    type: "practice",
  },
  {
    id: 3,
    name: "Chemistry Final",
    date: "2024-03-20",
    type: "actual",
  },
];

const mockStudyGuides = [
  {
    id: 1,
    name: "Calculus Review Guide",
    completionRate: 80,
    lastAccessed: "2024-03-11T10:00:00Z",
  },
  {
    id: 2,
    name: "Physics Formulas",
    completionRate: 65,
    lastAccessed: "2024-03-10T10:00:00Z",
  },
  {
    id: 3,
    name: "Chemistry Lab Procedures",
    completionRate: 45,
    lastAccessed: "2024-03-08T10:00:00Z",
  },
];

export default function StudentDashboard() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format the next class time
  const formatNextClass = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Calculate days left
  const calculateDaysLeft = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format last accessed time
  const formatLastAccessed = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffHours = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      );

      if (diffHours < 24) {
        return `${diffHours} hours ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} days ago`;
      }
    } catch (e) {
      return dateString;
    }
  };

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("dashboard.welcome")}
      </Typography>

      <Grid container spacing={3}>
        {/* Active Courses */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <SchoolIcon color="primary" />
                {t("dashboard.activeCourses")}
              </Typography>
              <List>
                {mockCourses.map((course) => (
                  <ListItem key={course.id} divider>
                    <ListItemText
                      primary={course.name}
                      secondary={
                        <Box component="span" sx={{ display: "block" }}>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            display="block"
                          >
                            {t("dashboard.nextClass")}:{" "}
                            {formatNextClass(course.nextClass)}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            display="block"
                          >
                            {t("dashboard.instructor")}: {course.instructor}
                          </Typography>
                          <Box
                            component="span"
                            sx={{ mt: 1, display: "block" }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={course.progress}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                    <Chip
                      label={`${course.progress}%`}
                      color="primary"
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <TimelineIcon color="primary" />
                {t("dashboard.upcomingExams")}
              </Typography>
              <List>
                {mockExams.map((exam) => (
                  <ListItem key={exam.id}>
                    <ListItemText
                      primary={exam.name}
                      secondary={`${calculateDaysLeft(exam.date)} ${t(
                        "dashboard.daysLeft"
                      )}`}
                    />
                    <Chip
                      label={t(`dashboard.examType.${exam.type}`)}
                      color={exam.type === "actual" ? "error" : "success"}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Study Guides */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <BookIcon color="primary" />
                {t("dashboard.studyGuides")}
              </Typography>
              <Grid container spacing={2}>
                {mockStudyGuides.map((guide) => (
                  <Grid item xs={12} md={4} key={guide.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {guide.name}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={guide.completionRate}
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            {guide.completionRate}% {t("dashboard.complete")}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {t("dashboard.lastAccessed")}:{" "}
                          {formatLastAccessed(guide.lastAccessed)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
