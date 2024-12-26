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
import { styled } from "@mui/material/styles";

import {
  Button,
  Card,
  FormControl,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
const Item = styled(Card)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export const UserResponseText: FC<{
  question: TQuestionUserResponseText;
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

  const handleDraftChange = (questionId: string, text: string) => {
    dispatch(setDraftResponse({ questionId, text }));
  };

  const handleSubmit = async (questionId: string) => {
    const draftText = draftResponses[questionId];

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

  `
  If you're going to get this work as is, with history and current answer in state.

  If there is no history
   display input
  If there is history
   display static most recent 
   display edit/update -> the actual control


`;

  return (
    <FormControl sx={{ width: "100%" }}>
      <Stack>
        {/* <Item> */}
        <TextField
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
          onChange={(e) =>
            handleDraftChange(question.questionId, e.target.value)
          }
        />
        {/* </Item>
        <Item> */}
        <Button
          variant="contained"
          onClick={() => handleSubmit(question.questionId)}
          disabled={isEditing}
        >
          Save
        </Button>
        {/* </Item> */}
      </Stack>
    </FormControl>
  );
};
