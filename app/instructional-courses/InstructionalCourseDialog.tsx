"use client";

import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Grid,
  Alert,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateInstructionalCourseMutation } from "@/lib/features/instructional-courses/instructionalCoursesApiSlice";
import { useGetLearningInstitutionsQuery } from "@/lib/features/learning-institutions/learningInstitutionsApiSlice";
import type {
  CreateInstructionalCourseDto,
  DayOfWeek,
} from "@/lib/features/instructional-courses/types";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { toast } from "react-toastify";

const DAYS_OF_WEEK: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  start_date: z.string().min(1, "Start date is required"),
  finish_date: z.string().min(1, "Finish date is required"),
  start_time_utc: z.string().min(1, "Start time is required"),
  duration_minutes: z.number().min(1, "Duration must be at least 1 minute"),
  days_of_week: z.array(z.string()).min(1, "At least one day must be selected"),
  institution_id: z.string().min(1, "Institution is required"),
  instructor_id: z.string().min(1, "Instructor is required"),
  proctor_ids: z.array(z.string()),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultValues: CreateInstructionalCourseDto = {
  name: "",
  description: "",
  start_date: "",
  finish_date: "",
  start_time_utc: "",
  duration_minutes: 0,
  days_of_week: [],
  institution_id: "",
  instructor_id: "",
  proctor_ids: [],
};

export function InstructionalCourseDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [createCourse, { isLoading }] = useCreateInstructionalCourseMutation();
  const { data: institutions } = useGetLearningInstitutionsQuery();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<CreateInstructionalCourseDto>({
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      finish_date: "",
      start_time_utc: "",
      duration_minutes: 0,
      days_of_week: [],
      institution_id: "",
      instructor_id: user?.id || "",
      proctor_ids: [],
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (user?.id) {
      form.setValue("instructor_id", user.id);
    }
  }, [user, form]);

  const onSubmit = async (data: CreateInstructionalCourseDto) => {
    console.log("Form submitted with data:", data);
    if (!user?.id) {
      setError("User must be logged in to create a course");
      toast.error(t("instructionalCourses.userNotLoggedIn"));
      return;
    }

    try {
      await createCourse(data);
      toast.success(t("instructionalCourses.createSuccess"));
      onOpenChange(false);
      form.reset();
    } catch (err) {
      console.error("Failed to create course:", err);
      setError("Failed to create course");
      toast.error(t("instructionalCourses.createError"));
    }
  };

  console.log("Current form errors:", form.formState.errors); // Debug log

  return (
    <Dialog
      open={open}
      onClose={() => {
        onOpenChange(false);
        form.reset();
        setError(null);
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{t("Add Instructional Course")}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form
          onSubmit={(e) => {
            console.log("Form submit event triggered"); // Debug log
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("Name")}
                    error={!!form.formState.errors.name}
                    helperText={form.formState.errors.name?.message}
                    margin="normal"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("Description")}
                    error={!!form.formState.errors.description}
                    helperText={form.formState.errors.description?.message}
                    margin="normal"
                    multiline
                    rows={3}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="start_date"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("Start Date")}
                    type="date"
                    error={!!form.formState.errors.start_date}
                    helperText={form.formState.errors.start_date?.message}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="finish_date"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("Finish Date")}
                    type="date"
                    error={!!form.formState.errors.finish_date}
                    helperText={form.formState.errors.finish_date?.message}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="start_time_utc"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("Start Time")}
                    type="time"
                    error={!!form.formState.errors.start_time_utc}
                    helperText={form.formState.errors.start_time_utc?.message}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="duration_minutes"
                control={form.control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("Duration (minutes)")}
                    type="number"
                    error={!!form.formState.errors.duration_minutes}
                    helperText={form.formState.errors.duration_minutes?.message}
                    margin="normal"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl
                fullWidth
                margin="normal"
                error={!!form.formState.errors.institution_id}
              >
                <InputLabel id="institution-label">
                  {t("Institution")}
                </InputLabel>
                <Controller
                  name="institution_id"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      error={!!form.formState.errors.institution_id}
                      label={t("Institution")}
                      value={field.value || ""}
                      labelId="institution-label"
                      data-testid="institution-select"
                    >
                      {institutions?.map((institution) => (
                        <MenuItem
                          key={institution.id}
                          value={institution.id}
                          data-testid={`institution-option-${institution.id}`}
                        >
                          {institution.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {form.formState.errors.institution_id && (
                  <FormHelperText error>
                    {form.formState.errors.institution_id.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl
                component="fieldset"
                error={!!form.formState.errors.days_of_week}
                margin="normal"
              >
                <InputLabel>{t("Days of Week")}</InputLabel>
                <FormGroup row>
                  <Controller
                    name="days_of_week"
                    control={form.control}
                    render={({ field }) => (
                      <>
                        {DAYS_OF_WEEK.map((day) => (
                          <FormControlLabel
                            key={day}
                            control={
                              <Checkbox
                                checked={field.value.includes(day)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, day]
                                    : field.value.filter((d) => d !== day);
                                  field.onChange(newValue);
                                }}
                              />
                            }
                            label={t(day)}
                          />
                        ))}
                      </>
                    )}
                  />
                </FormGroup>
                {form.formState.errors.days_of_week && (
                  <FormHelperText error>
                    {form.formState.errors.days_of_week.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <DialogActions>
            <Button
              onClick={() => {
                onOpenChange(false);
                form.reset();
                setError(null);
              }}
              variant="outlined"
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading || form.formState.isSubmitting}
              onClick={() => console.log("Submit button clicked")} // Debug log
            >
              {isLoading || form.formState.isSubmitting
                ? t("Creating...")
                : t("Create")}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
