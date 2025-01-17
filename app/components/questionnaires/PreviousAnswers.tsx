import { FC, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  AcceptedUserResponse,
  UserResponseTextType,
  UserResponseArraySelectType,
} from "@/lib/features/user-response/types";

interface PreviousAnswersProps {
  answers: AcceptedUserResponse<
    UserResponseTextType | UserResponseArraySelectType
  >[];
}

export const PreviousAnswers: FC<PreviousAnswersProps> = ({ answers }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  // Handle undefined answers prop and sort by date
  const previousAnswers = (answers || [])
    .slice(0, -1) // Exclude the most recent answer
    .sort((a, b) => {
      const timeA = a.systemAcceptTime || 0;
      const timeB = b.systemAcceptTime || 0;
      return timeB - timeA; // Sort in reverse chronological order
    });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Box>
      Previous Answers
      <Button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? t("singleword.hide") : t("singleword.show")}
      </Button>
      {isExpanded && (
        <Box sx={{ mt: 2 }}>
          {previousAnswers.map((answer, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 1 }}>
              accepted at: {formatDate(answer.systemAcceptTime || 0)}'
              {JSON.stringify(answer.userResponse)}'
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};
