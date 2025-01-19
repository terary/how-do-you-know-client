import {
  Box,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Divider,
} from "@mui/material";
import Image from "next/image";
import { Question } from "@/lib/features/exam-templates/examTemplatesApiSlice";

interface QuestionPreviewProps {
  question: Question;
}

export const QuestionPreview = ({ question }: QuestionPreviewProps) => {
  const renderMedia = () => {
    if (!question.media) return null;

    switch (question.media.type) {
      case "image":
        return (
          <Box sx={{ my: 2, position: "relative", height: 200 }}>
            <Image
              src={question.media.url}
              alt={question.media.alt || "Question image"}
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>
        );
      case "audio":
        return (
          <Box sx={{ my: 2 }}>
            <audio controls>
              <source src={question.media.url} type={question.media.mimeType} />
              Your browser does not support the audio element.
            </audio>
          </Box>
        );
      case "video":
        return (
          <Box sx={{ my: 2 }}>
            <video controls style={{ maxWidth: "100%", maxHeight: 300 }}>
              <source src={question.media.url} type={question.media.mimeType} />
              Your browser does not support the video element.
            </video>
          </Box>
        );
      default:
        return null;
    }
  };

  const renderAnswerOptions = () => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup>
              {question.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option.id}
                  control={<Radio />}
                  label={option.text}
                  disabled
                />
              ))}
            </RadioGroup>
          </FormControl>
        );
      case "true_false":
        return (
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <RadioGroup>
              <FormControlLabel
                value="true"
                control={<Radio />}
                label="True"
                disabled
              />
              <FormControlLabel
                value="false"
                control={<Radio />}
                label="False"
                disabled
              />
            </RadioGroup>
          </FormControl>
        );
      case "free_text":
        return (
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Student answer will go here"
            disabled
            sx={{ mt: 2 }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Question Type: {question.type.replace(/_/g, " ")}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Difficulty: {question.difficulty}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body1" gutterBottom>
        {question.text}
      </Typography>

      {renderMedia()}

      {question.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {question.description}
        </Typography>
      )}

      {renderAnswerOptions()}

      {question.explanation && (
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Explanation:
          </Typography>
          <Typography variant="body2">{question.explanation}</Typography>
        </Box>
      )}
    </Paper>
  );
};
