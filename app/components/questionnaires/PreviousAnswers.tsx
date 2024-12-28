import { FC, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TUserResponse } from "@/lib/features/user-response/types";
import { DateOver24HoursTimeLessThan } from "../common/format/DateOver24HoursTimeLessThan";

interface PreviousAnswersProps {
  answers: TUserResponse[];
}

export const PreviousAnswers: FC<PreviousAnswersProps> = ({ answers }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <Box>
      Previous Answers
      <Button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? t("singleword.hide") : t("singleword.show")}
      </Button>
      {isVisible && (
        <Box sx={{ mt: 2 }}>
          {answers.map((answer, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 1 }}>
              accepted at:{" "}
              <DateOver24HoursTimeLessThan
                inputDate={new Date(answer.systemAcceptTimeUtc || 0)}
              />
              '{JSON.stringify(answer.userResponse)}'
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};
