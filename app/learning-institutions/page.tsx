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
  useGetLearningInstitutionsQuery,
  useDeleteLearningInstitutionMutation,
} from "@/lib/features/learning-institutions/learningInstitutionsApiSlice";
import { LearningInstitutionDialog } from "./LearningInstitutionDialog";
import { toast } from "react-toastify";
import { RoleProtectedRoute } from "@/lib/features/auth/components/RoleProtectedRoute";
import { REQUIRED_ROLES } from "@/lib/features/auth/roles";

export default function LearningInstitutionsPage() {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data: institutions,
    isLoading,
    error,
  } = useGetLearningInstitutionsQuery();
  const [deleteInstitution] = useDeleteLearningInstitutionMutation();

  if (isLoading) {
    return (
      <Container>
        <Typography>{t("Loading...")}</Typography>
      </Container>
    );
  }

  if (error) {
    toast.error(t("learningInstitutions.loadError"));
    return (
      <Container>
        <Typography color="error">{t("Error loading institutions")}</Typography>
      </Container>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteInstitution(id);
      toast.success(t("learningInstitutions.deleteSuccess"));
    } catch (error) {
      console.error("Failed to delete institution:", error);
      toast.error(t("learningInstitutions.deleteError"));
    }
  };

  return (
    <RoleProtectedRoute roles={REQUIRED_ROLES.LEARNING_INSTITUTIONS}>
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
            {t("Learning Institutions")}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            {t("Add Institution")}
          </Button>
        </div>

        <Grid container spacing={3}>
          {institutions?.map((institution) => (
            <Grid item xs={12} sm={6} md={4} key={institution.id}>
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
                      {institution.name}
                    </Typography>
                    <div>
                      <IconButton
                        size="small"
                        onClick={() => console.log("Edit", institution.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(institution.id)}
                        data-testid="delete-institution-button"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {institution.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{t("Website")}:</strong> {institution.website}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{t("Email")}:</strong> {institution.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{t("Phone")}:</strong> {institution.phone}
                  </Typography>
                  {institution.address && (
                    <Typography variant="body2">
                      <strong>{t("Address")}:</strong> {institution.address}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <LearningInstitutionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </Container>
    </RoleProtectedRoute>
  );
}
