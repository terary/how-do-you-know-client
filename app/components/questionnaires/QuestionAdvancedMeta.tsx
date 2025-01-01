import { FC, useState } from "react";
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
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const feMeta = question.feMeta || {
    isSkipped: false,
    isUserFlagged: false,
    userFlags: "",
    userSortPosition: 0,
  };

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
            <FormControlLabel
              control={
                <Checkbox
                  checked={feMeta.isUserFlagged}
                  onChange={(e) =>
                    handleMetaChange({ isUserFlagged: e.target.checked })
                  }
                />
              }
              label={t("questionnaire.flagQuestion")}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label={t("questionnaire.userNotes")}
              multiline
              rows={2}
              value={feMeta.userFlags}
              onChange={(e) => handleMetaChange({ userFlags: e.target.value })}
              size="small"
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label={t("questionnaire.sortPosition")}
              type="number"
              value={feMeta.userSortPosition}
              onChange={(e) =>
                handleMetaChange({
                  userSortPosition:
                    e.target.value === "" ? 0 : parseInt(e.target.value, 10),
                })
              }
              size="small"
            />
          </Box>
        </Stack>
      </Collapse>
    </Box>
  );
};
