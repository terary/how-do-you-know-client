import type { FC } from "react";
import type { TQuestionText } from "../../questionnaires/types";

export const QuestionText: FC<{ question: TQuestionText }> = ({ question }) => {
  return (
    <div>
      <p>{question.userPromptText}</p>
    </div>
  );
};
