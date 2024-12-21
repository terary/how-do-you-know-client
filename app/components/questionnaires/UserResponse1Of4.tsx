import { useSetUserResponseMutation } from "@/lib/features/user-response/userResponseApiSlice";
import type {
  AcceptedUserResponse,
  UserResponseTextType,
} from "@/lib/features/user-response/userResponseSlice";
import type { FC } from "react";
import type { TQuestionUserResponseOneOf4 } from "../../questionnaires/types";

import {
  clearDraftResponse,
  commitDraftResponse,
  setDraftResponse,
} from "@/lib/features/user-response/userResponseSlice";
import { RootState } from "@/lib/store";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

export const UserResponse1Of4: FC<{
  question: TQuestionUserResponseOneOf4;
}> = ({ question }) => {
  const dispatch = useDispatch();
  const [setUserResponse] = useSetUserResponseMutation();

  // Get local state
  const draftResponses = useSelector(
    (state: RootState) => state.userResponseUI.draftResponses
  );

  const isEditing = useSelector(
    (state: RootState) => state.userResponseUI.isEditing
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
          // @ts-ignore
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
            key={option?.value}
            value={option?.value}
            control={<Radio />}
            label={option?.labelText}
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
    </FormControl>
  );
};
