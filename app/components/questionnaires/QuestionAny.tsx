import type { FC } from "react";
import type {
  TQuestionAny,
  TQuestionMultimedia,
} from "../../questionnaires/types";
import { QuestionText } from "./QuestionText";
import { QuestionMultimedia } from "./QuestionMultimedia";
import { QuestionAdvancedMeta } from "./QuestionAdvancedMeta";
import { UserResponseContainer } from "./UserResponseContainer";
import { Box, Stack } from "@mui/material";

export const QuestionAny: FC<{ question: TQuestionAny }> = ({ question }) => {
  const renderQuestion = () => {
    switch (question.userPromptType) {
      case "text":
        return <QuestionText question={question} />;
      case "multimedia":
        return (
          <QuestionMultimedia question={question as TQuestionMultimedia} />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      {renderQuestion()}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <UserResponseContainer question={question} />
        <QuestionAdvancedMeta question={question} />
      </Stack>
    </Box>
  );
};
