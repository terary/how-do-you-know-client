import { FC } from "react";
import {
  AcceptedUserResponse,
  UserResponseTextType,
  UserResponseArraySelectType,
} from "@/lib/features/user-response/types";
import { Typography, Paper, Box } from "@mui/material";

interface AcceptedAnswerProps {
  answer: AcceptedUserResponse<
    UserResponseTextType | UserResponseArraySelectType
  >;
}

export const AcceptedAnswer: FC<AcceptedAnswerProps> = ({ answer }) => {
  const renderUserResponse = () => {
    // Check if it's a text response
    if ("text" in answer.userResponse) {
      return (
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
          }}
        >
          {answer.userResponse.text}
        </Typography>
      );
    }

    // Check if it's an array select response
    if ("selectedOptions" in answer.userResponse) {
      return (
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
          }}
        >
          {answer.userResponse.selectedOptions?.join(", ") ||
            "No options selected"}
        </Typography>
      );
    }

    // Unknown response type
    return (
      <Typography variant="body1" color="error">
        Unknown response type
        <br />
        JSON {JSON.stringify(answer)}
      </Typography>
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp || 0);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Paper elevation={3}>
      <Box p={2}>
        <Typography variant="body2" color="textSecondary">
          Accepted Answer
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Accepted at: {formatDate(answer.systemAcceptTime)}
        </Typography>
        {renderUserResponse()}
      </Box>
    </Paper>
  );
};
