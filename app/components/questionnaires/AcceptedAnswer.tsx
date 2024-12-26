import { FC } from "react";
import { TUserResponse } from "@/lib/features/user-response/types";
import { Typography, Paper, Box } from "@mui/material";

interface AcceptedAnswerProps {
  answer: TUserResponse;
}

export const AcceptedAnswer: FC<AcceptedAnswerProps> = ({ answer }) => {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
      <Typography variant="subtitle2" color="textSecondary">
        Accepted Answer
      </Typography>
      <Typography variant="body1">{answer.userResponse.text}</Typography>
      <Typography variant="caption" color="textSecondary">
        Submitted:{" "}
        {new Date(answer.systemAcceptTimeUtc || 0).toLocaleDateString()}
      </Typography>
    </Paper>
  );
};
