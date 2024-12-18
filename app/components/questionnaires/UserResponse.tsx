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

export const UserResponse: FC<{ question: TQuestionAny }> = ({ question }) => {
  const [response, setResponse] = useState<string>("");

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
          //UserResponseAnyOf
          <UserResponseAnyOf
            question={question as TQuestionUserResponseOneOf4}
          />
          //  <UserR
          //   question={question as TQuestionUserResponseOneOf4}
          // />
        );

      case "xany-of":
        return (
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="w-full p-2 border rounded min-h-[100px]"
          />
        );

      default:
        return <p>Unsupported response type: {question.userResponseType}</p>;
    }
  };

  return <div className="mt-2">{renderResponseControl()}</div>;
};
