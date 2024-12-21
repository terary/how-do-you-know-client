import { useSetUserResponseMutation } from "@/lib/features/user-response/userResponseApiSlice";
import {
  clearDraftResponse,
  commitArrayValueDraftResponse,
  setArrayValueDraftResponse,
} from "@/lib/features/user-response/userResponseSlice";
import { RootState } from "@/lib/store";
import { type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import type {
  TChoiceOption,
  TQuestionUserResponseOneOf4,
} from "../../questionnaires/types";

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
} from "@mui/material";

type SelectedOptions = {
  [optionId: string]: { optionId: string; value: boolean; labelText: string };
};

export const UserResponseAnyOf: FC<{
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

  const handleDraftChange = (option: string, isChecked: boolean) => {
    const draftOptions =
      // @ts-ignore - "selectedOptions" is not a property of draftResponses[question.questionId]
      (draftResponses[question.questionId]?.selectedOptions || []) as string[];

    const selectedOptions = isChecked
      ? (draftOptions || []).concat([option])
      : draftOptions.filter((o) => o !== option);

    dispatch(
      setArrayValueDraftResponse({
        questionId: question.questionId,
        selectedOptions,
      })
    );
  };

  const handleSubmit = async (questionId: string) => {
    const selectedOptions =
      // @ts-ignore - "selectedOptions" is not a property of draftResponses[question.questionId]
      (draftResponses[question.questionId]?.selectedOptions || []) as string[];
    try {
      const theResponse = await setUserResponse({
        questionId,
        userResponseType: "any-of",
        userResponse: {
          selectedOptions: selectedOptions,
        },
      });
      const systemSelectedOptions =
        theResponse?.data?.userResponse.selectedOptions;
      console.log({
        handleSubmit: { theResponse, systemSelectedOptions, selectedOptions },
      });

      // updates backend
      dispatch(
        setArrayValueDraftResponse({
          questionId: question.questionId,
          selectedOptions: systemSelectedOptions || [],
        })
      );

      // updates the "committed draft" (application source of truth)
      dispatch(commitArrayValueDraftResponse(theResponse.data as any));

      // updates the "working draft" (control's local copy)
      dispatch(
        setArrayValueDraftResponse({
          questionId: question.questionId,
          // @ts-ignore
          selectedOptions: systemSelectedOptions,
        })
      );
    } catch (error) {
      console.error("Failed to submit response:", error);
    }
  };

  return (
    <FormControl>
      <FormGroup>
        {question.choices.map((option) => {
          return (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={(
                    (draftResponses[question.questionId] as any)
                      ?.selectedOptions || []
                  ).includes(option.value)}
                  onChange={(e) =>
                    handleDraftChange(option.value, e.target.checked)
                  }
                  name={option.value}
                />
              }
              label={option.labelText}
            />
          );
        })}
      </FormGroup>
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
