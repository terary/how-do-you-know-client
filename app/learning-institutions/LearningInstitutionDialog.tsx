"use client";

import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateLearningInstitutionMutation } from "@/lib/features/learning-institutions/learningInstitutionsApiSlice";
import type { CreateLearningInstitutionDto } from "@/lib/features/learning-institutions/learningInstitutionsApiSlice";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  website: z.string().url("Must be a valid URL"),
  email: z.string().email("Must be a valid email"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().optional(),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LearningInstitutionDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation();
  const [createInstitution] = useCreateLearningInstitutionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateLearningInstitutionDto>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: CreateLearningInstitutionDto) => {
    try {
      const result = await createInstitution(data);
      if ("data" in result) {
        onOpenChange(false);
        reset();
      }
    } catch (error) {
      console.error("Failed to create institution:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{t("Add Learning Institution")}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            fullWidth
            label={t("Name")}
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            margin="normal"
          />

          <TextField
            fullWidth
            label={t("Description")}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            fullWidth
            label={t("Website")}
            type="url"
            {...register("website")}
            error={!!errors.website}
            helperText={errors.website?.message}
            margin="normal"
          />

          <TextField
            fullWidth
            label={t("Email")}
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
          />

          <TextField
            fullWidth
            label={t("Phone")}
            type="tel"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            margin="normal"
          />

          <TextField
            fullWidth
            label={t("Address")}
            {...register("address")}
            error={!!errors.address}
            helperText={errors.address?.message}
            margin="normal"
            multiline
            rows={2}
          />

          <DialogActions>
            <Button onClick={() => onOpenChange(false)} variant="outlined">
              {t("Cancel")}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {t("Create")}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
