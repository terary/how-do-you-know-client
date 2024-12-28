import { FC, useState } from "react";
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

  if (history.length === 0) {
    return <UserResponse question={question} />;
  }

  const currentAnswer = history[history.length - 1];
  const previousAnswers = history.slice(0, -1);

  return (
    // <Box sx={{ mt: 2 }}>
    <Stack>
      <StackItem>
        <AcceptedAnswer answer={currentAnswer} />
      </StackItem>
      <StackItem>
        {isEditing ? (
          <Box sx={{ mt: 2 }}>
            <UserResponse question={question} />
            <Button
              variant="outlined"
              onClick={() => setIsEditing(false)}
              sx={{ mt: 1 }}
            >
              {t("questionnaires.cancelEdit")}
            </Button>
          </Box>
        ) : (
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
            sx={{ mb: 2 }}
          >
            {t("questionnaires.changeAnswer")}
          </Button>
        )}
        {previousAnswers.length > 0 && (
          <PreviousAnswers answers={previousAnswers} />
        )}
      </StackItem>
      {/* <StackItem>
        {previousAnswers.length > 0 && (
          <PreviousAnswers answers={previousAnswers} />
        )}
      </StackItem> */}
    </Stack>
  );
};
