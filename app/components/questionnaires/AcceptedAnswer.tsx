import { FC } from "react";
import { TUserResponse } from "@/lib/features/user-response/types";
import { Typography, Paper, Box } from "@mui/material";
import { DateOver24HoursTimeLessThan } from "../common/format/DateOver24HoursTimeLessThan";

interface AcceptedAnswerProps {
  answer: TUserResponse;
}

export const AcceptedAnswer: FC<AcceptedAnswerProps> = ({ answer }) => {
  const AcceptedAnswerUserResponse = ({ answer }: AcceptedAnswerProps) => {
    switch (answer.userResponseType) {
      case "one-of-4":
        return (
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
            }}
          >
            {answer.userResponse.text}
          </Typography>
        );
      case "any-of":
        return (
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
            }}
          >
            {
              // @ts-ignore - userResponseType does not seem to include non text values?
              answer.userResponse.selectedOptions?.join(", ")
            }
          </Typography>
        );
      case "one-of-2":
      case "free-text-255":
        return (
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
            }}
          >
            {answer.userResponse.text}
          </Typography>
        );
      // case "one-of-2":
      //   return (
      //     <Typography variant="body1">
      //       {
      //         // @ts-ignore - userResponseType does not seem to include non text values?
      //         answer.userResponse.selectedOption
      //       }
      //     </Typography>
      //   );
      default:
        return (
          <Typography variant="body1" color="error">
            Unknown response type: {answer.userResponseType}
            <br />
            JSON {JSON.stringify(answer)}
          </Typography>
        );
    }

    // return <Typography variant="body1">{answer.userResponse.text}</Typography>;
  };

  return (
    <>
      <Typography variant="subtitle2" color="textSecondary">
        Accepted Answer (submitted{" "}
        <DateOver24HoursTimeLessThan
          inputDate={new Date(answer.systemAcceptTimeUtc || 0)}
        />
        )
        {/* {new Date(answer.systemAcceptTimeUtc || 0).toLocaleDateString()}): */}
      </Typography>
      <AcceptedAnswerUserResponse answer={answer} />
    </>
  );
};
