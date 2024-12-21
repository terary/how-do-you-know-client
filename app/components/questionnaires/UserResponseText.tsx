import {
  // useGetUserAnswersQuery,
  useSetUserResponseMutation,
} from "@/lib/features/user-response/userResponseApiSlice";
import {
  commitDraftResponse,
  setDraftResponse,
} from "@/lib/features/user-response/userResponseSlice";
import { RootState } from "@/lib/store";
import type { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { TQuestionUserResponseText } from "../../questionnaires/types";

import { FormControl } from "@mui/material";

export const UserResponseText: FC<{
  question: TQuestionUserResponseText;
}> = ({ question }) => {
  const dispatch = useDispatch();
  // const { data: userAnswers } = useGetUserAnswersQuery(10);
  const [setUserResponse] = useSetUserResponseMutation();

  // Get local state
  const draftResponses = useSelector(
    (state: RootState) => state.userResponseUI.draftResponses
  );

  const isEditing = useSelector(
    (state: RootState) => state.userResponseUI.isEditing
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
        userResponse: { ...draftText },
      });
      dispatch(commitDraftResponse(theResponse.data as any));
    } catch (error) {
      console.error("Failed to submit response:", error);
    }
  };

  return (
    <FormControl>
      <div>
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
    </FormControl>
  );
};
