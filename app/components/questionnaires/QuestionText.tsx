import type { FC } from "react";
import type { TQuestionAny, TQuestionText } from "../../questionnaires/types";
import { Paper, Typography } from "@mui/material";

const styles = {
  questionText: {
    color: "var(--text-color)",
  },
};

export const QuestionText: FC<{ question: TQuestionText }> = ({ question }) => {
  return (
    // <Paper elevation={3} sx={{ padding: "5px" }}>
    <Typography
      variant="h5"
      component="div"
      sx={{ padding: "1em 1em 2em 1em", ...styles.questionText }}
      gutterBottom
    >
      {question.userPromptText}
    </Typography>
    // </Paper>
  );
};
