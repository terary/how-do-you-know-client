import { FC, useState } from "react";
import { TUserResponse } from "@/lib/features/user-response/types";
import {
  Typography,
  Paper,
  List,
  ListItem,
  Collapse,
  Button,
  Box,
} from "@mui/material";

interface PreviousAnswersProps {
  answers: TUserResponse[];
}

export const PreviousAnswers: FC<PreviousAnswersProps> = ({ answers }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="text"
        size="small"
      >
        {isExpanded ? "Hide" : "Show"} Previous Answers ({answers.length})
      </Button>

      <Collapse in={isExpanded}>
        <List>
          {answers.map((answer, index) => (
            <ListItem key={index}>
              <Paper elevation={1} sx={{ p: 1, width: "100%" }}>
                <Typography variant="body2">
                  {answer.userResponse.text}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Submitted:{" "}
                  {new Date(
                    answer.systemAcceptTimeUtc || 0
                  ).toLocaleDateString()}
                </Typography>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};
