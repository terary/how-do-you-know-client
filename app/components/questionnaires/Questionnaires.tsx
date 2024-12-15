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
import { TQuestionAny } from "@/app/questionnaires/types";
const options = [5, 10, 20, 30];

export const Questionnaires = () => {
  //  const [numberOfQuotes, setNumberOfQuotes] = useState(10);
  // Using a query hook automatically fetches data and returns query values
  const { data, error, isError, isLoading, isSuccess } =
    useGetQuestionsQuery(5);
  // const x = useGetQuestionsQuery(3);
  // x.error;

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
