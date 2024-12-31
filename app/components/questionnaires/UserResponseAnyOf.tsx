import { useSetUserResponseMutation } from "@/lib/features/user-response/userResponseApiSlice";
import {
  clearDraftResponse,
  commitArrayValueDraftResponse,
  setArrayValueDraftResponse,
  UserResponseArraySelectType,
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
import { useTranslation } from "react-i18next";

type SelectedOptions = {
  [optionId: string]: { optionId: string; value: boolean; labelText: string };
};

export const UserResponseAnyOf: FC<{
  question: TQuestionUserResponseOneOf4;
}> = ({ question }) => {
  const { t } = useTranslation();
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
    const selectedOptions = ((
      draftResponses[question.questionId] as UserResponseArraySelectType
    )?.selectedOptions || []) as string[];
    try {
      const theResponse = await setUserResponse({
        questionId,
        userResponseType: "any-of",
        userResponse: {
          selectedOptions: selectedOptions,
        },
      });

      // Only need to commit the response, which will clear the draft state
      dispatch(commitArrayValueDraftResponse(theResponse.data as any));
    } catch (error) {
      console.error("Failed to submit response:", error);
    }
  };
  // UserResponseArraySelectType
  return (
    <FormControl>
      <FormGroup>
        {question.choices.map((option) => (
          <FormControlLabel
            key={option?.value}
            control={
              <Checkbox
                checked={(
                  (
                    draftResponses[
                      question.questionId
                    ] as UserResponseArraySelectType
                  )?.selectedOptions || []
                ).includes(option?.value)}
                onChange={(e) =>
                  handleDraftChange(option?.value, e.target.checked)
                }
              />
            }
            label={option?.labelText}
          />
        ))}
      </FormGroup>

      <Button
        variant="contained"
        onClick={() => handleSubmit(question.questionId)}
        disabled={isEditing}
      >
        {t("singleword.save")}
      </Button>
    </FormControl>
  );
};
