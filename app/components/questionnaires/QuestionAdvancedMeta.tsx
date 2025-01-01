import { FC, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateQuestionFEMeta } from "@/lib/features/user-response/userResponseSlice";
import { IQuestionFEMeta, TQuestionAny } from "@/app/questionnaires/types";
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Stack,
  IconButton,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useTranslation } from "react-i18next";

interface QuestionAdvancedMetaProps {
  question: TQuestionAny;
}

export const QuestionAdvancedMeta: FC<QuestionAdvancedMetaProps> = ({
  question,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localTags, setLocalTags] = useState(question.feMeta?.userFlags || "");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const feMeta: IQuestionFEMeta = question.feMeta || {
    isSkipped: false,
    userFlags: "",
    userSortPosition: 0,
  };

  useEffect(() => {
    setLocalTags(question.feMeta?.userFlags || "");
  }, [question.feMeta?.userFlags]);

  const handleMetaChange = (updates: Partial<IQuestionFEMeta>) => {
    dispatch(
      updateQuestionFEMeta({
        questionId: question.questionId,
        feMeta: {
          ...feMeta,
          ...updates,
        },
      })
    );
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTags(e.target.value);
  };

  const handleTagsBlur = () => {
    handleMetaChange({ userFlags: localTags });
  };

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle2">
          {t("questionnaire.advanced")}
        </Typography>
        <IconButton
          onClick={() => setIsExpanded(!isExpanded)}
          size="small"
          sx={{ ml: 1 }}
        >
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={isExpanded}>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={feMeta.isSkipped}
                  onChange={(e) =>
                    handleMetaChange({ isSkipped: e.target.checked })
                  }
                />
              }
              label={t("questionnaire.skipQuestion")}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label={t("questionnaire.userTags")}
              multiline
              rows={2}
              value={localTags}
              onChange={handleTagsChange}
              onBlur={handleTagsBlur}
              size="small"
            />
          </Box>
        </Stack>
      </Collapse>
    </Box>
  );
};
