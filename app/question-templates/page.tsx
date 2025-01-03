"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import {
  useGetQuestionTemplatesQuery,
  useCreateQuestionTemplateMutation,
  useUpdateQuestionTemplateMutation,
  useDeleteQuestionTemplateMutation,
  type QuestionTemplate,
  type CreateTemplateDto,
  type UpdateTemplateDto,
  type UserPromptType,
  type UserResponseType,
  type ExclusivityType,
} from "@/lib/features/question-templates/questionTemplatesApiSlice";
import { useGetFodderPoolsQuery } from "@/lib/features/fodder-pools/fodderPoolsApiSlice";

interface TemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTemplateDto) => Promise<void>;
  initialData?: Partial<CreateTemplateDto>;
}

const USER_PROMPT_TYPES: UserPromptType[] = ["text", "multimedia"];
const USER_RESPONSE_TYPES: UserResponseType[] = [
  "free-text-255",
  "multiple-choice-4",
  "true-false",
];
const EXCLUSIVITY_TYPES: ExclusivityType[] = [
  "exam-only",
  "practice-only",
  "exam-practice-both",
];

const TemplateDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: TemplateDialogProps) => {
  const { t } = useTranslation();
  const { data: fodderPools = [] } = useGetFodderPoolsQuery();
  const [formData, setFormData] = useState<CreateTemplateDto>({
    userPromptType: "text",
    userResponseType: "free-text-255",
    exclusivityType: "practice-only",
    userPromptText: "",
    instructionText: "",
    validAnswers: [],
  });

  // Update form data when dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      setFormData({
        userPromptType: initialData?.userPromptType || "text",
        userResponseType: initialData?.userResponseType || "free-text-255",
        exclusivityType: initialData?.exclusivityType || "practice-only",
        userPromptText: initialData?.userPromptText || "",
        instructionText: initialData?.instructionText || "",
        validAnswers: initialData?.validAnswers || [],
      });
    }
  }, [open, initialData]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePromptTypeChange = (e: SelectChangeEvent<UserPromptType>) => {
    setFormData((prev) => ({
      ...prev,
      userPromptType: e.target.value as UserPromptType,
    }));
  };

  const handleResponseTypeChange = (e: SelectChangeEvent<UserResponseType>) => {
    setFormData((prev) => ({
      ...prev,
      userResponseType: e.target.value as UserResponseType,
      // Reset validAnswers when changing response type
      validAnswers: [],
    }));
  };

  const handleExclusivityTypeChange = (
    e: SelectChangeEvent<ExclusivityType>
  ) => {
    setFormData((prev) => ({
      ...prev,
      exclusivityType: e.target.value as ExclusivityType,
    }));
  };

  const handleFodderPoolChange = (e: SelectChangeEvent<string>) => {
    const poolId = e.target.value;
    const selectedPool = fodderPools.find((pool) => pool.id === poolId);
    setFormData((prev) => ({
      ...prev,
      validAnswers: [
        {
          fodderPoolId: poolId,
          text: selectedPool?.name || "",
        },
      ],
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData
          ? t("questionTemplates.editTemplate")
          : t("questionTemplates.createTemplate")}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>{t("questionTemplates.userPromptType")}</InputLabel>
            <Select
              name="userPromptType"
              value={formData.userPromptType}
              onChange={handlePromptTypeChange}
              label={t("questionTemplates.userPromptType")}
            >
              {USER_PROMPT_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {t(`questionTemplates.promptTypes.${type}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>{t("questionTemplates.userResponseType")}</InputLabel>
            <Select
              name="userResponseType"
              value={formData.userResponseType}
              onChange={handleResponseTypeChange}
              label={t("questionTemplates.userResponseType")}
            >
              {USER_RESPONSE_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {t(`questionTemplates.responseTypes.${type}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>{t("questionTemplates.exclusivityType")}</InputLabel>
            <Select
              name="exclusivityType"
              value={formData.exclusivityType}
              onChange={handleExclusivityTypeChange}
              label={t("questionTemplates.exclusivityType")}
            >
              {EXCLUSIVITY_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {t(`questionTemplates.exclusivityTypes.${type}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {formData.userResponseType === "multiple-choice-4" && (
            <>
              <FormControl fullWidth>
                <InputLabel>{t("questionTemplates.fodderPool")}</InputLabel>
                <Select
                  name="fodderPool"
                  value={formData.validAnswers[0]?.fodderPoolId || ""}
                  onChange={handleFodderPoolChange}
                  label={t("questionTemplates.fodderPool")}
                >
                  {fodderPools.map((pool) => (
                    <MenuItem key={pool.id} value={pool.id}>
                      {pool.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label={t("questionTemplates.validAnswer")}
                name="validAnswer"
                value={formData.validAnswers[0]?.text || ""}
                onChange={(e) => {
                  const text = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    validAnswers: [
                      {
                        ...prev.validAnswers[0],
                        text,
                      },
                    ],
                  }));
                }}
                required
              />
            </>
          )}

          <TextField
            fullWidth
            label={t("questionTemplates.userPromptText")}
            name="userPromptText"
            value={formData.userPromptText}
            onChange={handleTextChange}
            multiline
            rows={3}
            required
          />

          <TextField
            fullWidth
            label={t("questionTemplates.instructionText")}
            name="instructionText"
            value={formData.instructionText}
            onChange={handleTextChange}
            multiline
            rows={2}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("singleword.cancel")}</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.userPromptText.trim()}
        >
          {t("singleword.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function QuestionTemplatesPage() {
  const { t } = useTranslation();
  const { data: templates = [], isLoading } = useGetQuestionTemplatesQuery();
  const [createTemplate] = useCreateQuestionTemplateMutation();
  const [updateTemplate] = useUpdateQuestionTemplateMutation();
  const [deleteTemplate] = useDeleteQuestionTemplateMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<
    QuestionTemplate | undefined
  >();
  const [error, setError] = useState<string | null>(null);

  const handleCreateSubmit = async (data: CreateTemplateDto): Promise<void> => {
    try {
      if (selectedTemplate) {
        await updateTemplate({
          id: selectedTemplate.id,
          template: data,
        }).unwrap();
      } else {
        await createTemplate(data).unwrap();
      }
      setDialogOpen(false);
      setSelectedTemplate(undefined);
    } catch (error) {
      console.error("Failed to save template:", error);
      setError("Failed to save template");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id).unwrap();
    } catch (error) {
      console.error("Failed to delete template:", error);
      setError("Failed to delete template");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "userPromptType",
      headerName: t("questionTemplates.userPromptType"),
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<QuestionTemplate, UserPromptType>
      ) => (
        <Chip
          label={t(`questionTemplates.promptTypes.${params.value}`)}
          size="small"
        />
      ),
    },
    {
      field: "userResponseType",
      headerName: t("questionTemplates.userResponseType"),
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<QuestionTemplate, UserResponseType>
      ) => (
        <Chip
          label={t(`questionTemplates.responseTypes.${params.value}`)}
          size="small"
        />
      ),
    },
    {
      field: "exclusivityType",
      headerName: t("questionTemplates.exclusivityType"),
      flex: 1,
      renderCell: (
        params: GridRenderCellParams<QuestionTemplate, ExclusivityType>
      ) => (
        <Chip
          label={t(`questionTemplates.exclusivityTypes.${params.value}`)}
          size="small"
        />
      ),
    },
    {
      field: "userPromptText",
      headerName: t("questionTemplates.userPromptText"),
      flex: 2,
    },
    {
      field: "actions",
      type: "actions",
      headerName: t("questionTemplates.actions"),
      getActions: (params: GridRowParams<QuestionTemplate>) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label={t("singleword.edit")}
          onClick={() => {
            setSelectedTemplate(params.row);
            setDialogOpen(true);
          }}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label={t("singleword.delete")}
          onClick={() => handleDelete(params.row.id)}
        />,
      ],
    },
  ];

  return (
    <ProtectedRoute>
      <Box sx={{ height: "100%", width: "100%", p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h1">
              {t("questionTemplates.title")}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              {t("questionTemplates.createTemplate")}
            </Button>
          </Box>

          <DataGrid
            rows={templates}
            columns={columns}
            getRowId={(row) => row.id}
            loading={isLoading}
            autoHeight
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
          />
        </Paper>

        <TemplateDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedTemplate(undefined);
          }}
          onSubmit={handleCreateSubmit}
          initialData={
            selectedTemplate
              ? {
                  userPromptType: selectedTemplate.userPromptType,
                  userResponseType: selectedTemplate.userResponseType,
                  exclusivityType: selectedTemplate.exclusivityType,
                  userPromptText: selectedTemplate.userPromptText,
                  instructionText: selectedTemplate.instructionText,
                  validAnswers: selectedTemplate.validAnswers,
                }
              : undefined
          }
        />

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ProtectedRoute>
  );
}
