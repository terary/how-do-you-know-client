import type { FC } from "react";
import type { TQuestionUserResponseText } from "../../questionnaires/types";
import {
  useGetUserAnswersQuery,
  useSetUserResponseMutation,
} from "@/lib/features/user-response/userResponseApiSlice";
import {
  setDraftResponse,
  clearDraftResponse,
  commitDraftResponse,
} from "@/lib/features/user-response/userResponseSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import { useState } from "react";
import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { FormLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import { before } from "node:test";
import { UserResponse } from "./UserResponse";

export const UserResponseText: FC<{
  question: TQuestionUserResponseText;
}> = ({ question }) => {
  const dispatch = useDispatch();
  const { data: userAnswers } = useGetUserAnswersQuery(10);
  const [setUserResponse] = useSetUserResponseMutation();

  // Get local state
  const draftResponses = useSelector(
    (state: RootState) => state.userResponse.draftResponses
  );

  const allAcceptedAnswers = useSelector(
    (state: RootState) => state.userResponse.acceptedResponses
  );

  const isEditing = useSelector(
    (state: RootState) => state.userResponse.isEditing
  );

  const handleDraftChange = (questionId: string, text: string) => {
    dispatch(setDraftResponse({ questionId, text }));
  };

  const handleSubmit = async (questionId: string) => {
    const draftText = draftResponses[questionId];
    //    if (!draftText) return;

    try {
      const theResponse = await setUserResponse({
        questionId,
        userResponseType: "free-text-255",
        userResponse: {
          text: draftText,
        },
      });
      // dispatch(clearDraftResponse(questionId));
      dispatch(commitDraftResponse(theResponse.data as any));

      console.log({ theResponse });
    } catch (error) {
      console.error("Failed to submit response:", error);
    }
  };

  return (
    <FormControl>
      <div>
        allAcceptedAnswers: {JSON.stringify(allAcceptedAnswers)}
        {(userAnswers?.UserResponses || []).map((response) => (
          <div key={response.questionId}>
            <p>Submitted: {response.userResponse.text}</p>
            <input
              value={draftResponses[response.questionId] || ""}
              onChange={(e) =>
                handleDraftChange(response.questionId, e.target.value)
              }
            />
            <button
              onClick={() => handleSubmit(response.questionId)}
              disabled={isEditing}
            >
              Submit
            </button>
          </div>
        ))}
        <div>
          <input
            onChange={(e) =>
              handleDraftChange(question.questionId, e.target.value)
            }
          />
        </div>
        <button
          onClick={() => handleSubmit(question.questionId)}
          disabled={isEditing}
        >
          Submit
        </button>
      </div>
      JSON:{" "}
      {JSON.stringify({
        userAnswers: userAnswers || null,
        isEditing,
        draftResponses,
        question,
      })}
    </FormControl>
  );
};
