// import type { FC } from "react";
// import type { TQuestionText } from "../../questionnaires/types";

// export const QuestionText: FC<{ question: TQuestionText }> = ({ question }) => {
//   return (
//     <div>
//       <p>{question.userPromptText}</p>
//     </div>
//   );
// };

import type { FC } from "react";
import type { TQuestionAny, TQuestionText } from "../../questionnaires/types";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Paper, Typography } from "@mui/material";
import { UserResponse } from "./UserResponse";
import { UserResponseHistory } from "./UserResponseHistory";

export const QuestionText: FC<{ question: TQuestionText }> = ({ question }) => {
  return (
    <Paper elevation={3} sx={{ padding: "5px" }}>
      <Typography
        variant="h5"
        component="div"
        sx={{ padding: "1em 1em 2em 1em" }}
        gutterBottom
      >
        {question.userPromptText}
      </Typography>
      <UserResponse question={question as TQuestionAny} />
      <UserResponseHistory
        question={question as TQuestionAny}
        // userResponseHistory={(question as any).userResponseHistory || []}
      />
    </Paper>
  );
};
