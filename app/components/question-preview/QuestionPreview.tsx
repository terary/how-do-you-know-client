import {
  Box,
  Paper,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type CreateTemplateDto,
  type MediaDto,
} from "@/lib/features/question-templates/questionTemplatesApiSlice";

const PREVIEW_UNAVAILABLE_IMAGE = "/assets/images/preview-unavailable.svg";

interface QuestionPreviewProps {
  template: CreateTemplateDto;
}

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

const FreeTextResponse: React.FC = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box>
      <TextField
        fullWidth
        multiline
        rows={3}
        placeholder="Type your answer here..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!isEditing}
        sx={{
          mb: 2,
          bgcolor: "background.paper",
          "& .MuiOutlinedInput-root": {
            borderRadius: 1,
          },
        }}
      />
      <Button
        variant="contained"
        onClick={() => setIsEditing(!isEditing)}
        size="small"
      >
        {isEditing ? t("singleword.save") : t("singleword.edit")}
      </Button>
      {isEditing && (
        <Button
          variant="outlined"
          onClick={() => setIsEditing(false)}
          size="small"
          sx={{ ml: 1 }}
        >
          {t("singleword.cancel")}
        </Button>
      )}
    </Box>
  );
};

interface MultipleChoiceResponseProps {
  validAnswers?: Array<{
    fodderPoolId?: string;
    text?: string;
  }>;
}

const MultipleChoiceResponse: React.FC<MultipleChoiceResponseProps> = ({
  validAnswers = [],
}) => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const defaultChoices = ["A", "B", "C", "D"];

  return (
    <Box>
      <FormControl component="fieldset" sx={{ width: "100%", mb: 2 }}>
        <RadioGroup
          value={selectedValue}
          onChange={(e) => isEditing && setSelectedValue(e.target.value)}
        >
          {(validAnswers.length > 0
            ? validAnswers
            : defaultChoices.map((choice) => ({
                text: `Option ${choice}`,
                fodderPoolId: undefined,
              }))
          ).map((answer, index) => (
            <FormControlLabel
              key={index}
              value={answer.text || ""}
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="body1">{answer.text}</Typography>
                  <Typography
                    variant="body2"
                    color={answer.fodderPoolId ? "primary" : "text.secondary"}
                  >
                    Fodder Pool ID: {answer.fodderPoolId || "not available"}
                  </Typography>
                </Box>
              }
              sx={{
                mb: 1,
                p: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
                width: "100%",
              }}
              disabled={!isEditing}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Button
        variant="contained"
        onClick={() => setIsEditing(!isEditing)}
        size="small"
      >
        {isEditing ? t("singleword.save") : t("singleword.edit")}
      </Button>
      {isEditing && (
        <Button
          variant="outlined"
          onClick={() => setIsEditing(false)}
          size="small"
          sx={{ ml: 1 }}
        >
          {t("singleword.cancel")}
        </Button>
      )}
    </Box>
  );
};

const TrueFalseResponse: React.FC = () => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Box>
      <FormControl component="fieldset" sx={{ width: "100%", mb: 2 }}>
        <RadioGroup
          value={selectedValue}
          onChange={(e) => isEditing && setSelectedValue(e.target.value)}
          sx={{ display: "flex", flexDirection: "row", gap: 2 }}
        >
          {["True", "False"].map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              control={<Radio />}
              label={option}
              sx={{
                flex: 1,
                p: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
              }}
              disabled={!isEditing}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Button
        variant="contained"
        onClick={() => setIsEditing(!isEditing)}
        size="small"
      >
        {isEditing ? t("singleword.save") : t("singleword.edit")}
      </Button>
      {isEditing && (
        <Button
          variant="outlined"
          onClick={() => setIsEditing(false)}
          size="small"
          sx={{ ml: 1 }}
        >
          {t("singleword.cancel")}
        </Button>
      )}
    </Box>
  );
};

export const QuestionPreview: React.FC<QuestionPreviewProps> = ({
  template,
}) => {
  const renderPrompt = () => {
    switch (template.userPromptType) {
      case "text":
        return <TextPrompt text={template.userPromptText} />;
      case "multimedia":
        return (
          <MultimediaPrompt
            text={template.userPromptText}
            media={template.media}
          />
        );
      default:
        return null;
    }
  };

  const renderResponse = () => {
    switch (template.userResponseType) {
      case "free-text-255":
        return <FreeTextResponse />;
      case "multiple-choice-4":
        return <MultipleChoiceResponse validAnswers={template.validAnswers} />;
      case "true-false":
        return <TrueFalseResponse />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ height: "100%", p: 2, bgcolor: "background.paper" }}>
      <Typography variant="h6" gutterBottom>
        Question Preview
      </Typography>

      {/* Instruction text if present */}
      {template.instructionText && (
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            p: 1,
            bgcolor: "info.main",
            color: "info.contrastText",
            borderRadius: 1,
          }}
        >
          {template.instructionText}
        </Typography>
      )}

      {/* Question prompt with visual container */}
      <Paper sx={{ p: 2, mb: 2, border: 1, borderColor: "primary.main" }}>
        {renderPrompt()}
      </Paper>

      {/* Response area */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom color="text.secondary">
          Response Area:
        </Typography>
        {renderResponse()}
      </Box>
    </Box>
  );
};
