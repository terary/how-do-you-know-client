import type { FC } from "react";
import type {
  TQuestionAny,
  TQuestionUserResponseOneOf4,
  TQuestionUserResponseText,
} from "../../questionnaires/types";
import { useState } from "react";
import { UserResponse1Of4 } from "./UserResponse1Of4";
import { UserResponseText } from "./UserResponseText";

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
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name={`question-${question.questionId}`}
                value="1"
                checked={response === "1"}
                onChange={(e) => setResponse(e.target.value)}
                className="mr-2"
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name={`question-${question.questionId}`}
                value="0"
                checked={response === "0"}
                onChange={(e) => setResponse(e.target.value)}
                className="mr-2"
              />
              No
            </label>
          </div>
        );

      case "one-of-4":
        return (
          <UserResponse1Of4
            question={question as TQuestionUserResponseOneOf4}
          />

          // <div className="flex gap-4">
          //   JSON: {JSON.stringify(question)}
          //   {[1, 2, 3, 4].map((value) => (
          //     <label key={value} className="flex items-center">
          //       <input
          //         type="radio"
          //         name={`question-${question.questionId}`}
          //         value={value.toString()}
          //         checked={response === value.toString()}
          //         onChange={(e) => setResponse(e.target.value)}
          //         className="mr-2"
          //       />
          //       Option {value}
          //     </label>
          //   ))}
          // </div>
        );

      case "any-of":
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
