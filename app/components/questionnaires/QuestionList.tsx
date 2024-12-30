import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { QuestionAny } from "./QuestionAny";
import { Card, CardContent } from "@mui/material";
import { UserResponseContainer } from "./UserResponseContainer";
import { TQuestionAny } from "@/app/questionnaires/types";

export const QuestionList: FC = () => {
  const questionMap = useSelector(
    (state: RootState) => state.userResponseUI.questionMap
  );

  return (
    <div>
      {Object.values(questionMap || {}).map((question) => (
        <Card
          key={question.questionId}
          variant="elevation"
          elevation={5}
          sx={{ margin: "10px" }}
        >
          <CardContent>
            <QuestionAny question={question} />
            <UserResponseContainer question={question as TQuestionAny} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
