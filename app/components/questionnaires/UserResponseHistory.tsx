import { useState, type FC } from "react";
import type { TUserResponse } from "@/lib/features/user-response/types";
import { TQuestionAny } from "@/app/questionnaires/types";

`
    Think this through, then let AI do the work


    Have a solid plan first about History.length

    What/Who controls if history.length > 0, > 1, .. should that logic be in the History control? (probably not)




`;

const MultipleHistoryItems: FC<{
  // userResponseHistory: TUserResponse[];
  question: TQuestionAny;
}> = ({ question }) => {
  const userResponseHistory = (question.userResponseHistory || [])
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

const UserResponseHistory: FC<{
  // userResponseHistory: TUserResponse[];
  question: TQuestionAny;
}> = ({ question }) => {
  const userResponseHistory = question.userResponseHistory || [];
  const [isExpanded, setIsExpanded] = useState(false);
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

export { UserResponseHistory };
