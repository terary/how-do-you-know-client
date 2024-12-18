import type { FC } from "react";
import type { TQuestionUserResponseOneOf4 } from "../../questionnaires/types";
import {
  useGetUserAnswersQuery,
  useSetUserResponseMutation,
} from "@/lib/features/user-response/userResponseApiSlice";
import type {
  UserResponseTextType,
  UserResponseArraySelectType,
  AcceptedUserResponse,
} from "@/lib/features/user-response/userResponseSlice";

import {
  setDraftResponse,
  clearDraftResponse,
  commitDraftResponse,
} from "@/lib/features/user-response/userResponseSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FormLabel } from "@mui/material";
import { FormControl } from "@mui/material";

export const UserResponse1Of4: FC<{
  question: TQuestionUserResponseOneOf4;
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

  const handleDraftChange = (questionId: string, value: string) => {
    dispatch(setDraftResponse({ questionId, text: value }));
  };

  const handleSubmit = async (questionId: string) => {
    const draftText = draftResponses[questionId];

    try {
      const theResponse = await setUserResponse({
        questionId,
        userResponseType: "one-of-4",
        userResponse: {
          text: draftText,
        },
      });
      dispatch(commitDraftResponse(theResponse.data as any));
    } catch (error) {
      console.error("Failed to submit response:", error);
    }
  };

  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={draftResponses[question.questionId] || ""}
        onChange={(e) => handleDraftChange(question.questionId, e.target.value)}
      >
        {question.choices.map((option) => (
          <FormControlLabel
            key={
              // @ts-ignore
              option?.value
            }
            value={
              // @ts-ignore
              option?.value
            }
            control={<Radio />}
            label={
              // @ts-ignore
              option?.labelText
            }
          />
        ))}
      </RadioGroup>

      <div>
        <Button
          variant="contained"
          onClick={() => handleSubmit(question.questionId)}
          disabled={isEditing}
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          onClick={() => dispatch(clearDraftResponse(question.questionId))}
        >
          Reset
        </Button>
      </div>

      {/* Debug information */}
      <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#666" }}>
        <div>Current Draft: {draftResponses[question.questionId]}</div>
        <div>
          Accepted Answer:{" "}
          {
            // Shouldn't be doing this as X<Y> the typing should be more straight forward (poor design?)
            JSON.stringify({
              userResponse: (
                allAcceptedAnswers[
                  question.questionId
                ] as AcceptedUserResponse<UserResponseTextType>
              )?.userResponse,
            })
          }
        </div>
      </div>
    </FormControl>
  );
};
