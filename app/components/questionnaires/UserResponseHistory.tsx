import { useState, type FC } from "react";
import type { TUserResponse } from "@/lib/features/user-response/types";
import { TQuestionAny } from "@/app/questionnaires/types";

const MultipleHistoryItems: FC<{
  // userResponseHistory: TUserResponse[];
  question: TQuestionAny;
}> = ({ question }) => {
  const userResponseHistory = (question?.userResponseHistory || [])
    .slice()
    .reverse();

  return (
    <>
      {userResponseHistory.map((response, index) => (
        <div key={`${response.questionId}-${index}`}>
          <p>Response #{userResponseHistory.length - index}</p>
          <p>Question ID: {response.questionId}</p>
          <p>Type: {response.userResponseType}</p>
          <p>systemAcceptTimeUtc: {response.systemAcceptTimeUtc}</p>
          <p>Response: {JSON.stringify(response.userResponse)}</p>
          <hr />
        </div>
      ))}
    </>
  );
};

export const UserResponseHistory: FC<{
  // userResponseHistory: TUserResponse[];
  question: TQuestionAny;
}> = ({ question }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Guard clause for undefined question
  if (!question) {
    return (
      <div>
        <h4>
          Response History
          <span className="ml-2">(0)</span>
        </h4>
      </div>
    );
  }

  const userResponseHistory = (question.userResponseHistory || [])
    .slice()
    .reverse();

  const SingularHistoryItem = (historyItem: TUserResponse) => {
    return <>Answered: {historyItem.userResponse.text}</>;
  };

  return (
    <div>
      <h4>
        Response History{" "}
        <a onClick={() => setIsExpanded(!isExpanded)} style={{ color: "blue" }}>
          ({userResponseHistory.length})
        </a>
      </h4>
      {isExpanded && userResponseHistory.length > 1 && (
        <MultipleHistoryItems question={question} />
      )}
    </div>
  );
};
