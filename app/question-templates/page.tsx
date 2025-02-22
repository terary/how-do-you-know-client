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
  ListSubheader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
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
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { ProtectedRoute } from "@/lib/features/auth/components/ProtectedRoute";
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
  type MediaDto,
  type ValidAnswerDto,
} from "@/lib/features/question-templates/questionTemplatesApiSlice";
import { useGetFodderPoolsQuery } from "@/lib/features/fodder-pools/fodderPoolsApiSlice";
import { QuestionPreview } from "../components/question-preview/QuestionPreview";

interface ExtendedCreateTemplateDto
  extends Omit<CreateTemplateDto, "validAnswers"> {
  validAnswers: { text: string; fodderPoolId: string }[];
}

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

interface QuestionPreviewProps {
  template: CreateTemplateDto;
}

const PREVIEW_UNAVAILABLE_IMAGE = "/assets/images/preview-unavailable.svg";

const TextPrompt: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1">{text}</Typography>
    </Box>
  );
};

const MultimediaPrompt: React.FC<{ text: string; media?: MediaDto[] }> = ({
  text,
  media,
}) => {
  const renderMediaItem = (mediaItem: MediaDto, index: number) => {
    return (
      <Box
        key={index}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        {/* Media content */}
        <Box
          component="img"
          src={
            mediaItem.mediaContentType.startsWith("image/")
              ? mediaItem.url
              : PREVIEW_UNAVAILABLE_IMAGE
          }
          alt={`${text} - media ${index + 1}`}
          width={mediaItem.width || undefined}
          height={mediaItem.height || undefined}
          sx={{
            maxWidth: "100%",
            maxHeight: "400px",
            objectFit: "contain",
          }}
        />

        {/* Special instructions */}
        {mediaItem.specialInstructionText && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontStyle: "italic",
              bgcolor: "background.paper",
              p: 1,
              borderRadius: 1,
              width: "100%",
              textAlign: "center",
            }}
          >
            {mediaItem.specialInstructionText}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Paper
        sx={{
          p: 2,
          bgcolor: "action.hover",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {media?.map((item, index) => renderMediaItem(item, index))}
        <Typography variant="body1">{text}</Typography>
      </Paper>
    </Box>
  );
};

const QuestionActualDemo = ({ template }: { template: CreateTemplateDto }) => {
  return <QuestionPreview template={template} />;
};

const TemplateDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: TemplateDialogProps) => {
  const { t } = useTranslation();
  const { data: fodderPools = [] } = useGetFodderPoolsQuery();
  const [formData, setFormData] = useState<ExtendedCreateTemplateDto>({
    userPromptType: "text",
    userResponseType: "free-text-255",
    exclusivityType: "practice-only",
    userPromptText: "",
    instructionText: "",
    validAnswers: [],
    media: [],
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
        validAnswers:
          initialData?.validAnswers ||
          (initialData?.userResponseType === "multiple-choice-4"
            ? [{ text: "", fodderPoolId: "" }]
            : []),
        media: initialData?.media || [],
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
    const newResponseType = e.target.value as UserResponseType;
    setFormData((prev) => {
      // If switching to multiple-choice-4, try to restore previous validAnswers if they exist
      if (newResponseType === "multiple-choice-4") {
        return {
          ...prev,
          userResponseType: newResponseType,
          // Keep existing validAnswers if they exist, otherwise initialize with empty
          validAnswers: prev.validAnswers?.length
            ? prev.validAnswers
            : [{ text: "", fodderPoolId: "" }],
        };
      }

      // For other types, keep the validAnswers in state but don't show them
      return {
        ...prev,
        userResponseType: newResponseType,
      };
    });
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

  const guessMediaType = (url: string): MediaDto["mediaContentType"] | null => {
    // Convert to lowercase for case-insensitive matching
    const lowercaseUrl = url.toLowerCase();

    // Extract the filename part before any query parameters
    const urlWithoutQuery = lowercaseUrl.split("?")[0];

    // Helper function to check file extension
    const hasExtension = (ext: string): boolean => {
      const pattern = new RegExp(`\\.${ext}(?:\\?|$)`);
      return pattern.test(lowercaseUrl);
    };

    // Image types
    if (hasExtension("jpe?g")) return "image/jpeg";
    if (hasExtension("png")) return "image/png";
    if (hasExtension("gif")) return "image/gif";
    if (hasExtension("webp")) return "image/webp";
    if (hasExtension("svg")) return "image/svg+xml";

    // Audio types
    if (hasExtension("mp3")) return "audio/mpeg";
    if (hasExtension("wav")) return "audio/wav";
    if (hasExtension("ogg")) return "audio/ogg";
    if (hasExtension("aac")) return "audio/aac";
    if (hasExtension("weba")) return "audio/webm";

    // Video types
    if (hasExtension("mp4")) return "video/mp4";
    if (hasExtension("webm")) return "video/webm";
    if (hasExtension("ogv")) return "video/ogg";
    if (hasExtension("avi")) return "video/avi";
    if (hasExtension("mov|qt")) return "video/quicktime";

    return null;
  };

  const handleAddMedia = () => {
    setFormData((prev) => ({
      ...prev,
      media: [
        ...(prev.media || []),
        {
          mediaContentType: "application/octet-stream",
          height: 0,
          width: 0,
          url: "",
        },
      ],
    }));
  };

  const handleRemoveMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media?.filter((_, i) => i !== index),
    }));
  };

  const handleMediaChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // If URL is being changed, try to guess the media type
    if (name === "url") {
      const guessedType = guessMediaType(value);
      if (guessedType) {
        console.log("Guessed media type:", guessedType, "for URL:", value);
      } else {
        console.log("Could not guess media type for URL:", value);
      }

      // Keep the panel expanded
      setExpandedPanels((prev) => ({
        ...prev,
        [index]: true,
      }));

      setFormData((prev) => {
        const newMedia = [...(prev.media || [])];
        newMedia[index] = {
          ...newMedia[index],
          mediaContentType:
            guessedType ||
            newMedia[index]?.mediaContentType ||
            "application/octet-stream",
          height: newMedia[index]?.height || 0,
          width: newMedia[index]?.width || 0,
          url: value,
        };
        return {
          ...prev,
          media: newMedia,
        };
      });
      return;
    }

    setFormData((prev) => {
      const newMedia = [...(prev.media || [])];
      newMedia[index] = {
        ...newMedia[index],
        mediaContentType:
          newMedia[index]?.mediaContentType || "application/octet-stream",
        height: newMedia[index]?.height || 0,
        width: newMedia[index]?.width || 0,
        url: newMedia[index]?.url || "",
        [name]:
          name === "height" ||
          name === "width" ||
          name === "duration" ||
          name === "fileSize"
            ? Number(value) || 0
            : value,
      };

      return {
        ...prev,
        media: newMedia,
      };
    });
  };

  const handleMediaTypeChange = (index: number, e: SelectChangeEvent) => {
    setFormData((prev) => {
      const newMedia = [...(prev.media || [])];
      newMedia[index] = {
        ...newMedia[index],
        mediaContentType: e.target.value as MediaDto["mediaContentType"],
        height: newMedia[index]?.height || 0,
        width: newMedia[index]?.width || 0,
        url: newMedia[index]?.url || "",
      };

      return {
        ...prev,
        media: newMedia,
      };
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const [expandedPanels, setExpandedPanels] = useState<{
    [key: number]: boolean;
  }>({});

  const handleAccordionChange =
    (index: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPanels((prev) => ({
        ...prev,
        [index]: isExpanded,
      }));
    };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {initialData
          ? t("questionTemplates.editTemplate")
          : t("questionTemplates.createTemplate")}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          {/* Top section: Question Editor and Preview side by side */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Left side: Question Editor */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Question Editor
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>{t("questionTemplates.promptType")}</InputLabel>
                  <Select
                    value={formData.userPromptType}
                    onChange={handlePromptTypeChange}
                    label={t("questionTemplates.promptType")}
                    required
                  >
                    {USER_PROMPT_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {t(`questionTemplates.promptTypes.${type}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>{t("questionTemplates.responseType")}</InputLabel>
                  <Select
                    value={formData.userResponseType}
                    onChange={handleResponseTypeChange}
                    label={t("questionTemplates.responseType")}
                    required
                  >
                    {USER_RESPONSE_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {t(`questionTemplates.responseTypes.${type}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>
                    {t("questionTemplates.exclusivityType")}
                  </InputLabel>
                  <Select
                    value={formData.exclusivityType}
                    onChange={handleExclusivityTypeChange}
                    label={t("questionTemplates.exclusivityType")}
                    required
                  >
                    {EXCLUSIVITY_TYPES.map((type) => (
                      <MenuItem key={type} value={type}>
                        {t(`questionTemplates.exclusivityTypes.${type}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label={t("questionTemplates.promptText")}
                  value={formData.userPromptText}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userPromptText: e.target.value,
                    }))
                  }
                  required
                  multiline
                  rows={3}
                />

                <TextField
                  fullWidth
                  label={t("questionTemplates.instructionText")}
                  value={formData.instructionText}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instructionText: e.target.value,
                    }))
                  }
                  multiline
                  rows={2}
                />

                {formData.userResponseType === "multiple-choice-4" && (
                  <>
                    <FormControl fullWidth>
                      <InputLabel>
                        {t("questionTemplates.fodderPool")}
                      </InputLabel>
                      <Select
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
                      label={t("questionTemplates.validAnswerText")}
                      value={formData.validAnswers[0]?.text || ""}
                      onChange={(e) => {
                        const poolId = formData.validAnswers[0]?.fodderPoolId;
                        setFormData((prev) => ({
                          ...prev,
                          validAnswers: [
                            {
                              fodderPoolId: poolId,
                              text: e.target.value,
                            },
                          ],
                        }));
                      }}
                      sx={{ mt: 2 }}
                    />
                  </>
                )}
              </Box>
            </Box>

            {/* Right side: Question Preview */}
            <Box sx={{ flex: 1 }}>
              <QuestionPreview template={formData} />
            </Box>
          </Box>

          {/* Bottom section: Media Editor */}
          {formData.userPromptType === "multimedia" && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Media Editor</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddMedia}
                  variant="outlined"
                  size="small"
                >
                  {t("questionTemplates.addMedia")}
                </Button>
              </Box>

              {formData.media?.map((mediaItem, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}
                  >
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveMedia(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Accordion
                    expanded={expandedPanels[index] ?? !mediaItem.url}
                    onChange={handleAccordionChange(index)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          width: "100%",
                          minHeight: 50,
                        }}
                      >
                        {mediaItem.url && (
                          <Box
                            component="img"
                            src={
                              mediaItem.mediaContentType.startsWith("image/")
                                ? mediaItem.url
                                : PREVIEW_UNAVAILABLE_IMAGE
                            }
                            alt=""
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: "contain",
                              borderRadius: 1,
                              bgcolor: "background.paper",
                            }}
                          />
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: 1,
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: "medium" }}
                          >
                            Media {index + 1}
                          </Typography>
                          {mediaItem.specialInstructionText && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {mediaItem.specialInstructionText}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <TextField
                          fullWidth
                          label={t("questionTemplates.mediaUrl")}
                          name="url"
                          value={mediaItem.url}
                          onChange={(e) =>
                            handleMediaChange(
                              index,
                              e as React.ChangeEvent<HTMLInputElement>
                            )
                          }
                          required
                        />

                        <FormControl fullWidth>
                          <InputLabel>
                            {t("questionTemplates.mediaContentType")}
                          </InputLabel>
                          <Select
                            name="mediaContentType"
                            value={mediaItem.mediaContentType}
                            onChange={(e) => handleMediaTypeChange(index, e)}
                            label={t("questionTemplates.mediaContentType")}
                            required
                          >
                            <MenuItem value="application/octet-stream">
                              Generic Binary
                            </MenuItem>
                            <ListSubheader>Images</ListSubheader>
                            <MenuItem value="image/jpeg">JPEG Image</MenuItem>
                            <MenuItem value="image/png">PNG Image</MenuItem>
                            <MenuItem value="image/gif">GIF Image</MenuItem>
                            <MenuItem value="image/webp">WebP Image</MenuItem>
                            <MenuItem value="image/svg+xml">SVG Image</MenuItem>
                            <MenuItem value="image/*">Any Image</MenuItem>
                            <ListSubheader>Audio</ListSubheader>
                            <MenuItem value="audio/mpeg">MP3 Audio</MenuItem>
                            <MenuItem value="audio/wav">WAV Audio</MenuItem>
                            <MenuItem value="audio/ogg">OGG Audio</MenuItem>
                            <MenuItem value="audio/aac">AAC Audio</MenuItem>
                            <MenuItem value="audio/webm">WebM Audio</MenuItem>
                            <MenuItem value="audio/*">Any Audio</MenuItem>
                            <ListSubheader>Video</ListSubheader>
                            <MenuItem value="video/mp4">MP4 Video</MenuItem>
                            <MenuItem value="video/webm">WebM Video</MenuItem>
                            <MenuItem value="video/ogg">OGG Video</MenuItem>
                            <MenuItem value="video/avi">AVI Video</MenuItem>
                            <MenuItem value="video/quicktime">
                              QuickTime Video
                            </MenuItem>
                            <MenuItem value="video/*">Any Video</MenuItem>
                          </Select>
                        </FormControl>

                        <Box sx={{ display: "flex", gap: 2 }}>
                          <TextField
                            fullWidth
                            type="number"
                            label={t("questionTemplates.mediaWidth")}
                            name="width"
                            value={mediaItem.width}
                            onChange={(e) =>
                              handleMediaChange(
                                index,
                                e as React.ChangeEvent<HTMLInputElement>
                              )
                            }
                          />
                          <TextField
                            fullWidth
                            type="number"
                            label={t("questionTemplates.mediaHeight")}
                            name="height"
                            value={mediaItem.height}
                            onChange={(e) =>
                              handleMediaChange(
                                index,
                                e as React.ChangeEvent<HTMLInputElement>
                              )
                            }
                          />
                        </Box>

                        <TextField
                          fullWidth
                          label={t("questionTemplates.mediaInstructions")}
                          name="specialInstructionText"
                          value={mediaItem.specialInstructionText || ""}
                          onChange={(e) =>
                            handleMediaChange(
                              index,
                              e as React.ChangeEvent<HTMLInputElement>
                            )
                          }
                          multiline
                          rows={2}
                        />

                        {mediaItem.mediaContentType.startsWith("video/") && (
                          <TextField
                            fullWidth
                            label={t("questionTemplates.thumbnailUrl")}
                            name="thumbnailUrl"
                            value={mediaItem.thumbnailUrl || ""}
                            onChange={(e) =>
                              handleMediaChange(
                                index,
                                e as React.ChangeEvent<HTMLInputElement>
                              )
                            }
                          />
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("singleword.cancel")}</Button>
        <Button onClick={handleSubmit} variant="contained">
          {t("singleword.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function QuestionTemplatesPage() {
  const { t } = useTranslation();
  const { data: templates = [], isLoading } =
    useGetQuestionTemplatesQuery(undefined);
  const [createTemplate] = useCreateQuestionTemplateMutation();
  const [updateTemplate] = useUpdateQuestionTemplateMutation();
  const [deleteTemplate] = useDeleteQuestionTemplateMutation();
  const { data: fodderPools = [] } = useGetFodderPoolsQuery(undefined);

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
                  ...((selectedTemplate as any).media && {
                    media: (selectedTemplate as any).media,
                  }),
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
