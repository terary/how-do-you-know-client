import { FC, useState } from "react";
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
  clearFilters,
} from "@/lib/features/question-filter/questionFilterSlice";
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

  const handleShowSkipped = () => {
    dispatch(setShowSkipped(!showSkipped));
  };

  const handleShowAll = () => {
    dispatch(setShowSkipped(true));
    dispatch(setTagFilter(""));
  };

  const handleClearAllMeta = () => {
    dispatch(clearFilters());
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
              <Button type="submit" variant="contained">
                {t("singleword.apply")}
              </Button>
            </Stack>
          </form>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={handleShowSkipped}
            color={showSkipped ? "primary" : "inherit"}
          >
            {t("questionnaire.showSkipped")}
          </Button>

          <Button variant="outlined" onClick={handleShowAll}>
            {t("questionnaire.showAll")}
          </Button>

          <Button
            variant="outlined"
            color="warning"
            onClick={handleClearAllMeta}
          >
            {t("questionnaire.clearAllMeta")}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

`
    This is looking pretty good.
    So far it filters skipped ands 'shows skipped'.
    
    Next do the tag filter. (first fix tests)

    user notes are a great idea, as a study aide.  However, those answer should persist and possible allow edit
    based on questionId 

`;
