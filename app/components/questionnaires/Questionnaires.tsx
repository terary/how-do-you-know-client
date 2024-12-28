"use client";
import { useGetQuestionnaireQuery } from "../../../lib/features/user-response/userResponseApiSlice";

import { QuestionList } from "./QuestionList";
import styles from "./Questionnaires.module.css";
export const Questionnaires = () => {
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
        // style={{ backgroundColor: "rgba(0,0,0, 0.5)" }}
      >
        Total Questions: {(data.questions || []).length}
        <br />
        <QuestionList />
      </div>
    );
  }

  return null;
};
