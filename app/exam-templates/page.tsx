"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Preview as PreviewIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import {
  useGetExamTemplatesQuery,
  useDeleteExamTemplateMutation,
  usePreviewTemplateMutation,
  type ExamTemplate,
} from "@/lib/features/exam-templates/examTemplatesApiSlice";
import { useRouter } from "next/navigation";
import { ExamTemplateSectionQuestions } from "./ExamTemplateSectionQuestions";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`preview-tabpanel-${index}`}
      aria-labelledby={`preview-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export default function ExamTemplatesPage() {
  const { data: templates = [], isLoading } = useGetExamTemplatesQuery();
  const [deleteTemplate] = useDeleteExamTemplateMutation();
  const [previewTemplate] = usePreviewTemplateMutation();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTabChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedTab(newValue);
    if (selectedTemplate) {
      if (newValue === 3) {
        // Always load JSON format for Questions tab
        await loadPreview("json");
      } else if (newValue <= 2) {
        await loadPreview(
          newValue === 0 ? "html" : newValue === 1 ? "pdf" : "json"
        );
      }
    }
  };

  const loadPreview = async (format: "html" | "pdf" | "json") => {
    if (!selectedTemplate) return;

    try {
      setIsPreviewLoading(true);
      setError(null);
      const result = await previewTemplate({
        id: selectedTemplate,
        format: { format },
      }).unwrap();

      setPreviewData(result);
    } catch (error) {
      console.error("Failed to load preview:", error);
      setError("Failed to load preview");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate(id).unwrap();
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  const renderPreviewContent = () => {
    if (!previewData?.content) {
      return (
        <Typography color="text.secondary">
          No preview content available
        </Typography>
      );
    }

    switch (previewData.format) {
      case "html":
        return (
          <Paper sx={{ p: 2 }}>
            <div dangerouslySetInnerHTML={{ __html: previewData.content }} />
          </Paper>
        );
      case "pdf":
        return (
          <Box sx={{ height: "60vh" }}>
            <iframe
              src={`data:application/pdf;base64,${previewData.content}`}
              width="100%"
              height="100%"
              title="PDF Preview"
            />
          </Box>
        );
      case "json":
        return (
          <Paper sx={{ p: 2 }}>
            <pre>{previewData.content}</pre>
          </Paper>
        );
      default:
        return (
          <Typography color="error">Unsupported preview format</Typography>
        );
    }
  };

  const renderQuestionsContent = () => {
    if (!previewData?.content) {
      return (
        <Typography color="text.secondary">
          No preview content available
        </Typography>
      );
    }

    let data;
    try {
      // First try to parse if it's a string
      if (typeof previewData.content === "string") {
        try {
          data = JSON.parse(previewData.content);
        } catch (parseError) {
          console.error("Failed to parse preview data:", {
            error: parseError,
            content: previewData.content.substring(0, 200) + "...", // Log first 200 chars
          });
          return (
            <Typography color="error">
              Failed to parse preview data: Invalid JSON format
            </Typography>
          );
        }
      } else {
        // If not a string, use as is
        data = previewData.content;
      }

      // Validate data structure
      if (!data || typeof data !== "object") {
        console.error("Invalid preview data structure:", data);
        return (
          <Typography color="error">Invalid preview data structure</Typography>
        );
      }

      if (!data.sections || !Array.isArray(data.sections)) {
        console.error("Missing or invalid sections array:", data);
        return (
          <Typography color="text.secondary">
            No sections available in preview
          </Typography>
        );
      }

      if (data.sections.length === 0) {
        return (
          <Typography color="text.secondary">
            No sections in this template
          </Typography>
        );
      }

      // If we get here, we have valid data to render
      return (
        <Box>
          {data.sections.map((section: any) => (
            <Accordion key={section.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box>
                  <Typography variant="subtitle1">{section.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {section.instructions}
                  </Typography>
                  <Typography variant="body2">
                    Time Limit: {section.timeLimitSeconds / 60} minutes
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle2" gutterBottom>
                  Questions ({section.questions?.length || 0})
                </Typography>
                {section.questions?.length > 0 ? (
                  section.questions.map((question: any) => (
                    <Card key={question.id} sx={{ mb: 1 }}>
                      <CardContent>
                        <Typography>
                          {question.questionTemplate?.userPromptType === "text"
                            ? question.questionTemplate?.userPromptText
                            : question.questionTemplate?.userPromptType}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Response Type:{" "}
                          {question.questionTemplate?.userResponseType}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography color="text.secondary">
                    No questions in this section
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      );
    } catch (error) {
      console.error("Failed to render questions content:", error);
      return (
        <Typography color="error">Failed to load questions content</Typography>
      );
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/exam-templates/new")}
        >
          Create Template
        </Button>
      </Box>

      {templates.length === 0 ? (
        <Typography color="text.secondary">
          No exam templates yet. Click the button above to create one.
        </Typography>
      ) : (
        <Box>
          {templates.map((template) => (
            <Card key={template.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{template.name}</Typography>
                <Typography color="text.secondary">
                  {template.description}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  onClick={() =>
                    router.push(`/exam-templates/${template.id}/sections`)
                  }
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteTemplate(template.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setPreviewOpen(true);
                    loadPreview("html");
                  }}
                  size="small"
                >
                  <PreviewIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}

      <Dialog
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setSelectedTemplate(null);
          setPreviewData(null);
          setSelectedTab(0);
        }}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: "80vh" },
        }}
      >
        <DialogTitle>Template Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={selectedTab} onChange={handleTabChange}>
              <Tab label="HTML" />
              <Tab label="PDF" />
              <Tab label="JSON" />
              <Tab label="Questions" />
            </Tabs>
          </Box>

          {isPreviewLoading && selectedTab <= 2 ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error && selectedTab <= 2 ? (
            <Box sx={{ p: 2 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : (
            <>
              <TabPanel value={selectedTab} index={0}>
                {selectedTab === 0 && renderPreviewContent()}
              </TabPanel>
              <TabPanel value={selectedTab} index={1}>
                {selectedTab === 1 && renderPreviewContent()}
              </TabPanel>
              <TabPanel value={selectedTab} index={2}>
                {selectedTab === 2 && renderPreviewContent()}
              </TabPanel>
              <TabPanel value={selectedTab} index={3}>
                {selectedTab === 3 && renderQuestionsContent()}
              </TabPanel>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setPreviewOpen(false);
              setSelectedTemplate(null);
              setPreviewData(null);
              setSelectedTab(0);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
