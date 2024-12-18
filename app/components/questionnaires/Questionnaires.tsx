"use client";
// import { useGetQuotesQuery } from "@/lib/features/quotes/quotesApiSlice";
// import { useGetQuestionsQuery } from "@/lib/features/questionnaires/questionnairesApiSlice";
import { useGetQuestionsQuery } from "../../../lib/features/questionnaires/questionnairesApiSlice";
import { useState } from "react";
import styles from "./Questionnaires.module.css";
import { QuestionAny } from "./QuestionAny";
import Card from "@mui/material/Card";
import { CardActions, CardContent } from "@mui/material";
import { UserResponse } from "./UserResponse";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export const Questionnaires = () => {
  const { data, error, isError, isLoading, isSuccess } =
    useGetQuestionsQuery(5);
  const allAcceptedAnswers = useSelector(
    (state: RootState) => state.userResponse.acceptedResponses
  );

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
