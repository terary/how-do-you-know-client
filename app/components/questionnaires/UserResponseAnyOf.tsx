import { useEffect, type FC } from "react";
import type {
  TQuestionUserResponseOneOf4,
  TChoiceOption,
} from "../../questionnaires/types";
import {
  useGetUserAnswersQuery,
  useSetUserResponseMutation,
} from "@/lib/features/user-response/userResponseApiSlice";
import {
  setDraftResponse,
  setArrayValueDraftResponse,
  clearDraftResponse,
  commitArrayValueDraftResponse,
} from "@/lib/features/user-response/userResponseSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import type {
  UserResponseTextType,
  UserResponseArraySelectType,
  AcceptedUserResponse,
} from "@/lib/features/user-response/userResponseSlice";

import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from "@mui/material";
import { FormLabel } from "@mui/material";
import { FormControl } from "@mui/material";

type SelectedOptions = {
  [optionId: string]: { optionId: string; value: boolean; labelText: string };
};
const buildOptionSelectFromQuestionChoices = (
  choices: TChoiceOption[]
): SelectedOptions => {
  return choices.reduce((acc, cur) => {
    acc[cur.value] = {
      optionId: cur?.value,
      value: false,
      labelText: cur.labelText,
    };

    return acc;
  }, {} as SelectedOptions);
};

export const UserResponseAnyOf: FC<{
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

  const handleDraftChange = (option: string, isChecked: boolean) => {
    const draftOptions =
      // @ts-ignore - "selectedOptions" is not a property of draftResponses[question.questionId]
      (draftResponses[question.questionId]?.selectedOptions ||
        //        allAcceptedAnswers ||
        []) as string[];

    console.log({ draftOptions });
    const selectedOptions = isChecked
      ? (draftOptions || []).concat([option])
      : draftOptions.filter((o) => o !== option);

    console.log({
      selectedOptions,
      draftOptions,
      isChecked,
    });
    dispatch(
      setArrayValueDraftResponse({
        questionId: question.questionId,
        selectedOptions,
      })
    );
  };

  const handleSubmit = async (questionId: string) => {
    // const draftText = draftResponses[questionId] as unknown as SelectedOptions;
    // const selectedOptions = Object.values(draftText)
    //   .filter((option) => option.value)
    //   .map((option) => option.optionId);
    const selectedOptions =
      // @ts-ignore - "selectedOptions" is not a property of draftResponses[question.questionId]
      (draftResponses[question.questionId]?.selectedOptions || []) as string[];
    `

    I think UserResponse* and UserResponseAny use draftResponses differently?
    The shape, I think, should be:

  {
    [questionId]: {
      userResponse: {
          ["text":"selectedOptions"]...
      }
    }  
  
  }
// **maybe** "userResponse" isn't necessary but "text" | "selectedOptions" is necessary


`;

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
      JSON:{" "}
      {JSON.stringify({
        "draftResponses[questionId]": draftResponses[
          question.questionId
        ] as unknown as SelectedOptions,
      })}
      <FormGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        // value={draftResponses[question.questionId] || ""}
        // onChange={(e) => handleDraftChange(question.questionId, e.target.value)}
      >
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
      {/* Debug information 
      
      
      Trying to dispatch value array
      
      
      
      */}
      <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#666" }}>
        <div>
          Current Draft: {JSON.stringify(draftResponses[question.questionId])}
        </div>
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
