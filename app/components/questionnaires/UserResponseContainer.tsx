import { FC, useState } from "react";
import { TQuestionAny } from "@/app/questionnaires/types";
import { UserResponse } from "./UserResponse";
import { AcceptedAnswer } from "./AcceptedAnswer";
import { PreviousAnswers } from "./PreviousAnswers";
import { Button, Box } from "@mui/material";

interface UserResponseContainerProps {
  question: TQuestionAny;
}

export const UserResponseContainer: FC<UserResponseContainerProps> = ({
  question,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const history = question.userResponseHistory || [];

  if (history.length === 0) {
    return <UserResponse question={question} />;
  }

  const currentAnswer = history[history.length - 1];
  const previousAnswers = history.slice(0, -1);

  return (
    <Box sx={{ mt: 2 }}>
      <AcceptedAnswer answer={currentAnswer} />

      {isEditing ? (
        <Box sx={{ mt: 2 }}>
          <UserResponse question={question} />
          <Button
            variant="outlined"
            onClick={() => setIsEditing(false)}
            sx={{ mt: 1 }}
          >
            Cancel Edit
          </Button>
        </Box>
      ) : (
        <Button
          variant="contained"
          onClick={() => setIsEditing(true)}
          sx={{ mb: 2 }}
        >
          Edit Answer
        </Button>
      )}

      {previousAnswers.length > 0 && (
        <PreviousAnswers answers={previousAnswers} />
      )}
    </Box>
  );
};
