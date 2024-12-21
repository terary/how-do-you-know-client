"use client";
import { useGetQuestionnaireQuery } from "../../../lib/features/user-response/userResponseApiSlice";

import { RootState } from "@/lib/store";
import { CardActions, CardContent } from "@mui/material";
import Card from "@mui/material/Card";
import { useSelector } from "react-redux";
import { QuestionAny } from "./QuestionAny";
import styles from "./Questionnaires.module.css";
import { UserResponse } from "./UserResponse";
export const Questionnaires = () => {
  // const {
  //   data: data2,
  //   error: error2,
  //   isError: isError2,
  //   isLoading: isLoading2,
  //   isSuccess: isSuccess2,
  // } = useGetQuestionsQuery(5);
  const {
    data: data,
    error: error,
    isError: isError,
    isLoading: isLoading,
    isSuccess: isSuccess,
  } = useGetQuestionnaireQuery({ questionnaireId: "_THE_QUESTIONNAIRE_ID_" });
  //} = useGetQuestionnaireQuery({ questionnaireId: "_QUESTIONNAIRE_ID_" });
  const allAcceptedAnswers = useSelector(
    (state: RootState) => state.userResponseUI.acceptedResponses
  );

  // useGetQuestionnaireQuery(5);
  // console.log({ data2, error2, isError2, isLoading2, isSuccess2 });
  console.log({ data, error, isError, isLoading, isSuccess });

  const QuestionAnswerStats = ({
    totalQuestions = -1,
    totalAnswers = -1,
    totalRemaining = -1,
  }: {
    totalQuestions: number;
    totalAnswers: number;
    totalRemaining: number;
  }) => {
    return (
      <div style={{ display: "table", width: "100%", marginBottom: "1rem" }}>
        <div style={{ display: "table-row" }}>
          <div style={{ display: "table-cell", padding: "0.5rem" }}>
            Number of questions {totalQuestions}
          </div>
        </div>
        <div style={{ display: "table-row" }}>
          <div style={{ display: "table-cell", padding: "0.5rem" }}>
            Number of questions answered {totalAnswers}
          </div>
        </div>
        <div style={{ display: "table-row" }}>
          <div style={{ display: "table-cell", padding: "0.5rem" }}>
            Number of questions remaining {totalRemaining}
          </div>
        </div>
      </div>
    );
  };

  if (isError) {
    return (
      <div>
        statues:{" "}
        {JSON.stringify({
          isError,
          isSuccess,
          isLoading,
          data: data || null,
          error: error || null,
        })}
        <h1>There was an error!!!</h1>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  if (isSuccess) {
    return (
      <div
        className={styles.container}
        style={{ backgroundColor: "rgba(0,0,0, 0.5)" }}
      >
        <QuestionAnswerStats
          totalAnswers={Object.keys(allAcceptedAnswers).length}
          totalQuestions={data.questions.length}
          totalRemaining={
            data.questions.length - Object.keys(allAcceptedAnswers).length
          }
        />
        {(data.questions || []).map((question) => (
          <Card
            // sx={{ maxWidth: 345, margin: "25px" }}
            key={question.questionId}
            variant="elevation"
          >
            <CardContent>
              questionId: {question.questionId}
              <br />
              userResponseHistory:{" "}
              {JSON.stringify({
                userResponseHistory: question.userResponseHistory || null,
              })}
              <QuestionAny key={question.questionId} question={question} />
            </CardContent>

            <CardActions>
              userResponseType: {question.userResponseType}{" "}
              <UserResponse question={question} />
            </CardActions>
          </Card>
        ))}
      </div>
    );
  }

  return null;
};
