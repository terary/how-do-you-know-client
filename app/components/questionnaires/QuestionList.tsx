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

  const DevDebugQuestionMeta = ({ question }: { question: TQuestionAny }) => {
    return (
      <div style={{ fontWeight: "lighter", backgroundColor: "lightgray" }}>
        <div>Debug</div>
        <div>questionId: {question.questionId} </div>
        <div>userPromptType: {question.userPromptType} </div>
        <div>userResponseType: {question.userResponseType} </div>
      </div>
    );
  };
  return (
    <div>
      {Object.values(questionMap).map((question) => (
        <Card
          key={question.questionId}
          variant="elevation"
          elevation={5}
          sx={{ margin: "10px" }}
        >
          <CardContent>
            {/* <DevDebugQuestionMeta question={question} /> */}
            <QuestionAny question={question} />
            <UserResponseContainer question={question as TQuestionAny} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
