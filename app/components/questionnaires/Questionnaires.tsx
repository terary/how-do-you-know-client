"use client";
import { useGetQuestionnaireQuery } from "../../../lib/features/user-response/userResponseApiSlice";

import { RootState } from "@/lib/store";
import { CardActions, CardContent } from "@mui/material";
import Card from "@mui/material/Card";
import { useSelector } from "react-redux";
import { QuestionAny } from "./QuestionAny";
import styles from "./Questionnaires.module.css";
import { UserResponse } from "./UserResponse";
import { QuestionList } from "./QuestionList";
export const Questionnaires = () => {
  // - so what is the point of this?

  `
    This control actually does the API call to get all the questions
    from that data, the questions are created, the stateUI then calls to update question.history
    So the history on the whole questionaire changes but not the local question (I think).

    We we're going to resolve this by exploiting the fact we store objects... This should be fine
    because the 'history' we're searching for is part of the question (should require more 'effort' than that)
    but to update the api state

    Effectively the question/userResponse update, response should update question 




`;

  const { data, error, isError, isLoading, isSuccess } =
    useGetQuestionnaireQuery({ questionnaireId: "_THE_QUESTIONNAIRE_ID_" });

  if (isError) {
    return (
      <div>
        <pre>
          {JSON.stringify(
            {
              isError,
              isSuccess,
              isLoading,
              data: data || null,
              error: error || null,
            },
            null,
            2
          )}
        </pre>
        <h1>There was an error!</h1>
      </div>
    );
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isSuccess && data) {
    return (
      <div
        className={styles.container}
        style={{ backgroundColor: "rgba(0,0,0, 0.5)" }}
      >
        Total Questions: {(data.questions || []).length}
        <br />
        <QuestionList />
      </div>
    );
  }

  return null;
};
