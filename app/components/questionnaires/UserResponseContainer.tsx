import { FC, useState, useEffect } from "react";
import { TQuestionAny } from "@/app/questionnaires/types";
import { UserResponse } from "./UserResponse";
import { AcceptedAnswer } from "./AcceptedAnswer";
import { PreviousAnswers } from "./PreviousAnswers";
import { Button, Box, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { StackItem } from "../common/layout/StackItem";

interface UserResponseContainerProps {
  question: TQuestionAny;
}

export const UserResponseContainer: FC<UserResponseContainerProps> = ({
  question,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const history = question.userResponseHistory || [];

  useEffect(() => {
    if (history.length > 0) {
      setIsEditing(false);
    }
  }, [history.length]);

  if (history.length === 0) {
    return <UserResponse question={question} />;
  }

  const currentAnswer = history[history.length - 1];
  const previousAnswers = history.slice(0, -1);

  return (
    <Stack>
      <StackItem>
        <AcceptedAnswer answer={currentAnswer} />
      </StackItem>
      <StackItem>
        {isEditing ? (
          <Box sx={{ mt: 2 }}>
            <UserResponse question={question} />
            <Button
              variant="contained"
              onClick={() => setIsEditing(false)}
              sx={{ mt: 1, width: "auto" }}
            >
              {t("questionnaires.cancelEdit")}
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
            sx={{ mb: 2, width: "auto" }}
          >
            {t("questionnaires.changeAnswer")}
          </Button>
        )}
        {previousAnswers.length > 0 && (
          <PreviousAnswers answers={previousAnswers} />
        )}
      </StackItem>
    </Stack>
  );
};
