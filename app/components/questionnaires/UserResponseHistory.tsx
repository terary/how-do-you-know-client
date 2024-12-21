import type { FC } from "react";
import type { TUserResponse } from "@/lib/features/user-response/types";

const UserResponseHistory: FC<{
  userResponseHistory: TUserResponse[];
}> = ({ userResponseHistory }) => {
  return (
    <div>
      <h3>Response History</h3>
      {userResponseHistory.map((response, index) => (
        <div key={`${response.questionId}-${index}`}>
          <p>Response #{index + 1}</p>
          <p>Question ID: {response.questionId}</p>
          <p>Type: {response.userResponseType}</p>
          <p>Response: {JSON.stringify(response.userResponse)}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export { UserResponseHistory };
