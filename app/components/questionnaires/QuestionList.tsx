import { FC } from "react";
import { useSelector } from "react-redux";
import { QuestionAny } from "./QuestionAny";
import { Card, CardContent } from "@mui/material";
import { TQuestionAny } from "@/app/questionnaires/types";
import { AdvancedQuestionSortFilter } from "./AdvancedQuestionSortFilter";
import { selectFilteredQuestions } from "@/lib/features/question-filter/questionFilterSlice";

export const QuestionList: FC = () => {
  const filteredQuestions = useSelector(selectFilteredQuestions);

  return (
    <div>
      <AdvancedQuestionSortFilter />
      {filteredQuestions.map((question) => (
        <Card
          key={question.questionId}
          variant="elevation"
          elevation={5}
          sx={{ margin: "10px" }}
        >
          <CardContent>
            <QuestionAny question={question as TQuestionAny} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
