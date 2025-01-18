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
} from "@mui/material";
import { usePreviewTemplateMutation } from "@/lib/features/exam-templates/examTemplatesApiSlice";
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

export const ExamTemplateSectionPreview = ({
  examId,
  sectionId,
  open,
  onClose,
}: ExamTemplateSectionPreviewProps) => {
  const [previewTemplate] = usePreviewTemplateMutation();
  const [previewData, setPreviewData] = useState<any>(null);
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

  const loadPreview = async (format: "html" | "pdf" | "json") => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await previewTemplate({
        id: examId,
        format: { format },
      }).unwrap();
      setPreviewData(result);
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
              {previewData?.html && (
                <Paper sx={{ p: 2 }}>
                  <div dangerouslySetInnerHTML={{ __html: previewData.html }} />
                </Paper>
              )}
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              {previewData?.pdf && (
                <Box sx={{ height: "60vh" }}>
                  <iframe
                    src={`data:application/pdf;base64,${previewData.pdf}`}
                    width="100%"
                    height="100%"
                    title="PDF Preview"
                  />
                </Box>
              )}
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              {previewData?.json && (
                <Paper sx={{ p: 2 }}>
                  <pre>{JSON.stringify(previewData.json, null, 2)}</pre>
                </Paper>
              )}
            </TabPanel>
            <TabPanel value={selectedTab} index={3}>
              <ExamTemplateSectionQuestions
                examId={examId}
                sectionId={sectionId}
              />
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
