import type { FC } from "react";
import type {
  TQuestionAny,
  TQuestionUserResponseOneOf4,
  TQuestionUserResponseText,
} from "../../questionnaires/types";
import { useState } from "react";
import { UserResponse1Of4 } from "./UserResponse1Of4";
import { UserResponseText } from "./UserResponseText";
import { UserResponseAnyOf } from "./UserResponseAnyOf";
import { UserResponseHistory } from "./UserResponseHistory";
import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));
export const UserResponse: FC<{ question: TQuestionAny }> = ({ question }) => {
  const renderResponseControl = () => {
    switch (question.userResponseType) {
      case "free-text-255":
        return (
          <UserResponseText question={question as TQuestionUserResponseText} />
        );

      case "one-of-2":
        return (
          <UserResponse1Of4
            question={question as TQuestionUserResponseOneOf4}
          />
        );

      case "one-of-4":
        return (
          <UserResponse1Of4
            question={question as TQuestionUserResponseOneOf4}
          />
        );
      case "any-of":
        return (
          <UserResponseAnyOf
            question={question as TQuestionUserResponseOneOf4}
          />
        );

      default:
        return <p>Unsupported response type: {question.userResponseType}</p>;
    }
  };

  return <div className="mt-2">{renderResponseControl()}</div>;
};
