import { FC } from "react";
import {
  Box,
  Button,
  TextField,
  Stack,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowSkipped,
  setTagFilter,
} from "@/lib/features/question-filter/questionFilterSlice";
import {
  unSkipAllQuestions,
  resetAllFEMeta,
} from "@/lib/features/user-response/userResponseSlice";
import { RootState } from "@/lib/store";

export const AdvancedQuestionSortFilter: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { showSkipped, tagFilter } = useSelector(
    (state: RootState) => state.questionFilter
  );

  const handleTagFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setTagFilter(tagFilter));
  };

  const handleUnSkipAll = () => {
    dispatch(unSkipAllQuestions());
    dispatch(setShowSkipped(true));
  };

  const handleReset = () => {
    dispatch(resetAllFEMeta());
    dispatch(setShowSkipped(false));
    dispatch(setTagFilter(""));
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t("questionnaire.filterAndSort")}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>
        <Box>
          <form onSubmit={handleTagFilterSubmit}>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                label={t("questionnaire.filterByTag")}
                value={tagFilter}
                onChange={(e) => dispatch(setTagFilter(e.target.value))}
                placeholder={t("questionnaire.enterTagsSpaceSeparated")}
                helperText={t("questionnaire.useSpacesToSeparateTags")}
                fullWidth
              />
              {/* <Button type="submit" variant="contained">
                {t("singleword.apply")}
              </Button> */}
            </Stack>
          </form>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={handleUnSkipAll}>
            {t("questionnaire.unSkipQuestions")}
          </Button>

          <Button variant="outlined" onClick={handleReset}>
            {t("singleword.reset")}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};
