"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Alert,
  Button,
} from "@mui/material";
import {
  Timer as TimerIcon,
  Warning as WarningIcon,
  RemoveRedEye as EyeIcon,
  Block as BlockIcon,
  Flag as FlagIcon,
  PlayCircle as PlayCircleIcon,
  PauseCircle as PauseCircleIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

// Mock data
const mockActiveExams = [
  {
    id: 1,
    name: "Final Mathematics Exam",
    course: "Advanced Mathematics",
    startTime: "2024-03-11T09:00:00Z",
    duration: 180, // minutes
    activeStudents: 42,
    totalStudents: 45,
    status: "in-progress",
    flags: 2,
  },
  {
    id: 2,
    name: "Physics Midterm",
    course: "Physics Fundamentals",
    startTime: "2024-03-11T10:30:00Z",
    duration: 120,
    activeStudents: 35,
    totalStudents: 38,
    status: "starting-soon",
    flags: 0,
  },
  {
    id: 3,
    name: "Chemistry Lab Final",
    course: "Chemistry Lab",
    startTime: "2024-03-11T08:00:00Z",
    duration: 150,
    activeStudents: 40,
    totalStudents: 42,
    status: "ending-soon",
    flags: 1,
  },
];

const mockStudentAlerts = [
  {
    id: 1,
    studentName: "John Smith",
    examName: "Final Mathematics Exam",
    type: "suspicious-activity",
    timestamp: "2024-03-11T09:15:00Z",
    description: "Multiple tab switches detected",
  },
  {
    id: 2,
    studentName: "Emma Wilson",
    examName: "Chemistry Lab Final",
    type: "technical-issue",
    timestamp: "2024-03-11T08:30:00Z",
    description: "Connection stability issues",
  },
  {
    id: 3,
    studentName: "Michael Brown",
    examName: "Final Mathematics Exam",
    type: "question-flag",
    timestamp: "2024-03-11T09:20:00Z",
    description: "Question #5 flagged for review",
  },
];

const mockUpcomingExams = [
  {
    id: 1,
    name: "Biology Midterm",
    course: "Biology 101",
    scheduledStart: "2024-03-11T13:00:00Z",
    expectedStudents: 50,
  },
  {
    id: 2,
    name: "Computer Science Quiz",
    course: "Programming Fundamentals",
    scheduledStart: "2024-03-11T14:30:00Z",
    expectedStudents: 35,
  },
];

export default function ProctorDashboard() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format time remaining
  const formatTimeRemaining = (startTime: string, durationMinutes: number) => {
    const start = new Date(startTime);
    const now = new Date();
    const end = new Date(start.getTime() + durationMinutes * 60000);
    const remaining = end.getTime() - now.getTime();

    if (remaining < 0) return "Ended";

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Format scheduled time
  const formatScheduledTime = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(dateString));
    } catch (e) {
      return dateString;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "success";
      case "starting-soon":
        return "info";
      case "ending-soon":
        return "warning";
      default:
        return "default";
    }
  };

  // Get alert severity
  const getAlertSeverity = (type: string) => {
    switch (type) {
      case "suspicious-activity":
        return "error";
      case "technical-issue":
        return "warning";
      case "question-flag":
        return "info";
      default:
        return "info";
    }
  };

  // Format alert time
  const formatAlertTime = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "numeric",
      }).format(new Date(dateString));
    } catch (e) {
      return dateString;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("dashboard.proctorWelcome")}
      </Typography>

      <Grid container spacing={3}>
        {/* Active Exams */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <TimerIcon color="primary" />
                {t("dashboard.activeExams")}
              </Typography>
              <Grid container spacing={2}>
                {mockActiveExams.map((exam) => (
                  <Grid item xs={12} md={4} key={exam.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Typography variant="h6">{exam.name}</Typography>
                          <Chip
                            label={t(
                              `dashboard.status.${exam.status.replace("-", "")}`
                            )}
                            color={getStatusColor(exam.status)}
                            size="small"
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {exam.course}
                        </Typography>
                        <Box sx={{ my: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            {t("dashboard.timeRemaining")}:{" "}
                            {formatTimeRemaining(exam.startTime, exam.duration)}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            {t("dashboard.activeStudents")}:{" "}
                            {exam.activeStudents}/{exam.totalStudents}
                          </Typography>
                          {exam.flags > 0 && (
                            <Typography variant="body2" color="error">
                              {t("dashboard.activeFlags")}: {exam.flags}
                            </Typography>
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            justifyContent: "flex-end",
                          }}
                        >
                          <IconButton size="small" color="primary">
                            <EyeIcon />
                          </IconButton>
                          <IconButton size="small" color="warning">
                            <PauseCircleIcon />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <BlockIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts and Flags */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <WarningIcon color="primary" />
                {t("dashboard.alertsAndFlags")}
              </Typography>
              <List>
                {mockStudentAlerts.map((alert) => (
                  <ListItem key={alert.id} sx={{ mb: 2 }}>
                    <Alert
                      severity={getAlertSeverity(alert.type)}
                      action={
                        <Button color="inherit" size="small">
                          {t("dashboard.review")}
                        </Button>
                      }
                      sx={{ width: "100%" }}
                    >
                      <Typography variant="subtitle2">
                        {alert.examName} - {alert.studentName}
                      </Typography>
                      <Typography variant="body2">
                        {alert.description} ({formatAlertTime(alert.timestamp)})
                      </Typography>
                    </Alert>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Exams */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <PlayCircleIcon color="primary" />
                {t("dashboard.upcomingExams")}
              </Typography>
              <List>
                {mockUpcomingExams.map((exam) => (
                  <ListItem
                    key={exam.id}
                    divider
                    secondaryAction={
                      <IconButton edge="end" color="primary">
                        <PlayCircleIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={exam.name}
                      secondary={
                        <>
                          <Typography
                            variant="body2"
                            component="span"
                            display="block"
                          >
                            {exam.course}
                          </Typography>
                          <Typography
                            variant="body2"
                            component="span"
                            display="block"
                          >
                            {t("dashboard.startsAt")}:{" "}
                            {formatScheduledTime(exam.scheduledStart)}
                          </Typography>
                          <Typography
                            variant="body2"
                            component="span"
                            display="block"
                          >
                            {t("dashboard.expectedStudents")}:{" "}
                            {exam.expectedStudents}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
