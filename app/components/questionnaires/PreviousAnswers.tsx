import { FC, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  AcceptedUserResponse,
  UserResponseTextType,
} from "@/lib/features/user-response/types";
import { DateOver24HoursTimeLessThan } from "../shared/format/DateOver24HoursTimeLessThan";

interface PreviousAnswersProps {
  previousAnswers: AcceptedUserResponse<UserResponseTextType>[];
}

export const PreviousAnswers: FC<PreviousAnswersProps> = ({
  previousAnswers,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

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
              accepted at:{" "}
              <DateOver24HoursTimeLessThan
                inputDate={new Date(answer.systemAcceptTime)}
              />
              '{JSON.stringify(answer.userResponse)}'
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};
