import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
} from "@mui/material";
import {
  usePreviewTemplateMutation,
  useGetSectionQuestionsQuery,
} from "@/lib/features/exam-templates/examTemplatesApiSlice";
import { ExamTemplateSectionQuestions } from "./ExamTemplateSectionQuestions";

interface ExamTemplateSectionPreviewProps {
  examId: string;
  sectionId: string;
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Define expected response types
type PreviewFormat = "html" | "pdf" | "json";
interface PreviewResponse {
  content: string;
  format: PreviewFormat;
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

const PreviewQuestions = ({
  examId,
  sectionId,
}: {
  examId: string;
  sectionId: string;
}) => {
  const { data: questions = [], isLoading } = useGetSectionQuestionsQuery({
    examId,
    sectionId,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Questions ({questions.length})
      </Typography>

      {questions.length === 0 ? (
        <Typography color="text.secondary">
          No questions in this section.
        </Typography>
      ) : (
        <Box>
          {questions.map((question: any) => (
            <Card key={question.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography>
                  {question.questionTemplate?.userPromptType === "text"
                    ? question.questionTemplate?.userPromptText
                    : question.questionTemplate?.userPromptType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Response Type: {question.questionTemplate?.userResponseType}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export const ExamTemplateSectionPreview = ({
  examId,
  sectionId,
  open,
  onClose,
}: ExamTemplateSectionPreviewProps) => {
  const [previewTemplate] = usePreviewTemplateMutation();
  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = async (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setSelectedTab(newValue);
    if (newValue <= 2) {
      await loadPreview(
        newValue === 0 ? "html" : newValue === 1 ? "pdf" : "json"
      );
    }
  };

  const loadPreview = async (format: PreviewFormat) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await previewTemplate({
        id: examId,
        format: { format },
      }).unwrap();

      // Debug log to see the actual response structure
      console.log("Preview response:", { format, result });

      // Validate response structure
      if (!result || typeof result !== "object") {
        throw new Error("Invalid response format");
      }

      setPreviewData(result as PreviewResponse);
    } catch (error) {
      console.error("Failed to load preview:", error);
      setError("Failed to load preview");
    } finally {
      setIsLoading(false);
    }
  };

  // Load HTML preview when dialog opens
  useEffect(() => {
    if (open) {
      loadPreview("html");
    }
  }, [open]);

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: "80vh" },
      }}
    >
      <DialogTitle>Section Preview</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="HTML" />
            <Tab label="PDF" />
            <Tab label="JSON" />
            <Tab label="Questions" />
          </Tabs>
        </Box>

        {isLoading && selectedTab <= 2 ? (
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
              <PreviewQuestions examId={examId} sectionId={sectionId} />
            </TabPanel>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
