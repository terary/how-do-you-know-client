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
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider,
} from "@mui/material";
import {
  School as SchoolIcon,
  Group as GroupIcon,
  Class as ClassIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Mail as MailIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

// Mock data
const mockStudents = [
  {
    id: 1,
    name: "John Smith",
    course: "Advanced Mathematics",
    progress: 75,
    lastActive: "2024-03-11T10:00:00Z",
    avatar: "JS",
  },
  {
    id: 2,
    name: "Emma Wilson",
    course: "Physics Fundamentals",
    progress: 60,
    lastActive: "2024-03-11T09:30:00Z",
    avatar: "EW",
  },
  {
    id: 3,
    name: "Michael Brown",
    course: "Chemistry Lab",
    progress: 45,
    lastActive: "2024-03-10T15:20:00Z",
    avatar: "MB",
  },
];

const mockFaculty = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    department: "Mathematics",
    status: "online",
    avatar: "SJ",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    department: "Physics",
    status: "offline",
    avatar: "MC",
  },
  {
    id: 3,
    name: "Dr. Emily Brown",
    department: "Chemistry",
    status: "online",
    avatar: "EB",
  },
];

const mockCourseStats = [
  {
    id: 1,
    name: "Advanced Mathematics",
    totalStudents: 45,
    averageProgress: 78,
    upcomingDeadlines: 3,
  },
  {
    id: 2,
    name: "Physics Fundamentals",
    totalStudents: 38,
    averageProgress: 65,
    upcomingDeadlines: 2,
  },
  {
    id: 3,
    name: "Chemistry Lab",
    totalStudents: 42,
    averageProgress: 70,
    upcomingDeadlines: 4,
  },
];

export default function InstructorDashboard() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format last active time
  const formatLastActive = (dateString: string) => {
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
        {t("dashboard.instructorWelcome")}
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <GroupIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">125</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("dashboard.totalStudents")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <ClassIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h4">8</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("dashboard.activeCourses")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: "center" }}>
                  <AssignmentIcon
                    color="primary"
                    sx={{ fontSize: 40, mb: 1 }}
                  />
                  <Typography variant="h4">12</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("dashboard.pendingAssignments")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Student Activity */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <GroupIcon color="primary" />
                {t("dashboard.recentStudentActivity")}
              </Typography>
              <List>
                {mockStudents.map((student) => (
                  <ListItem
                    key={student.id}
                    divider
                    secondaryAction={
                      <IconButton edge="end" aria-label="contact">
                        <MailIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>{student.avatar}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={student.name}
                      secondary={
                        <Box component="span">
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            display="block"
                          >
                            {student.course}
                          </Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            display="block"
                          >
                            {t("dashboard.lastActive")}:{" "}
                            {formatLastActive(student.lastActive)}
                          </Typography>
                          <Box
                            component="span"
                            sx={{ mt: 1, display: "block" }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={student.progress}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Faculty Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <PersonIcon color="primary" />
                {t("dashboard.facultyStatus")}
              </Typography>
              <List>
                {mockFaculty.map((faculty) => (
                  <ListItem
                    key={faculty.id}
                    divider
                    secondaryAction={
                      <Chip
                        label={t(`dashboard.status.${faculty.status}`)}
                        color={
                          faculty.status === "online" ? "success" : "default"
                        }
                        size="small"
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>{faculty.avatar}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={faculty.name}
                      secondary={faculty.department}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Course Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <ClassIcon color="primary" />
                {t("dashboard.courseStatistics")}
              </Typography>
              <Grid container spacing={2}>
                {mockCourseStats.map((course) => (
                  <Grid item xs={12} md={4} key={course.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {course.name}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {t("dashboard.totalStudents")}:{" "}
                            {course.totalStudents}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {t("dashboard.averageProgress")}:{" "}
                            {course.averageProgress}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t("dashboard.upcomingDeadlines")}:{" "}
                            {course.upcomingDeadlines}
                          </Typography>
                        </Box>
                        <Box sx={{ mt: 2, textAlign: "right" }}>
                          <IconButton size="small" color="primary">
                            <ArrowForwardIcon />
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
      </Grid>
    </Box>
  );
}
