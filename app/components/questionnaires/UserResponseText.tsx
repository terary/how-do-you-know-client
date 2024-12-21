import {
  useGetUserAnswersQuery,
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

`
    Make sure this accepts/displays empty, non-answer and previous answers

    test takers should be able to revisit questions and change previous answers
     - how is that done currently??

     - FE is using 'acceptedAnswers' backend is placing 'userResponse' object as part of the "questions" "test" document.
       Should reconcile.  BE will generate unique tests.  It's reasonable to place answers object as part of test document 
       (which means current state model is goof'd with two lists )

       What will it take to change to placing userResponse as part of the 'test'?

`;

import { FormControl } from "@mui/material";

export const UserResponseText: FC<{
  question: TQuestionUserResponseText;
}> = ({ question }) => {
  const dispatch = useDispatch();
  const { data: userAnswers } = useGetUserAnswersQuery(10);
  const [setUserResponse] = useSetUserResponseMutation();

  // Get local state
  const draftResponses = useSelector(
    (state: RootState) => state.userResponseUI.draftResponses
  );

  const allAcceptedAnswers = useSelector(
    (state: RootState) => state.userResponseUI.acceptedResponses
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
        allAcceptedAnswers[questionId]:{" "}
        {JSON.stringify(allAcceptedAnswers[question.questionId])}
        UserResponseHistory:{" "}
        {(userAnswers?.UserResponseHistory || []).map((response) => (
          <div key={response.questionId}>
            <p>Submitted: {response.userResponse.text}</p>
            <input
              value={(draftResponses[response.questionId] as any).text || ""}
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
        // userAnswers: userAnswers || null,
        // isEditing,
        "draftResponses[questionId]": draftResponses[question.questionId],
        // question,
      })}
    </FormControl>
  );
};
