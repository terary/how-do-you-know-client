import type { FC } from "react";
import type {
  TQuestionAny,
  TQuestionMultimedia,
} from "../../questionnaires/types";
import { QuestionText } from "./QuestionText";
import { QuestionMultimedia } from "./QuestionMultimedia";
import { UserResponseHistory } from "./UserResponseHistory";

export const QuestionAny: FC<{ question: TQuestionAny }> = ({ question }) => {
  switch (question.userPromptType) {
    case "text":
      return <QuestionText question={question} />;
    case "multimedia":
      return <QuestionMultimedia question={question as TQuestionMultimedia} />;
    default:
      return null;
  }
};
