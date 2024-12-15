import type { FC } from "react";
import type { TQuestionUserResponseOneOf4 } from "../../questionnaires/types";
import { useState } from "react";
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FormLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import { before } from "node:test";
import { UserResponse } from "./UserResponse";

export const UserResponse1Of4: FC<{
  question: TQuestionUserResponseOneOf4;
}> = ({ question }) => {
  const [response, setResponse] = useState<string>("");
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={response}
        onChange={(e) => setResponse(e.target.value)}
      >
        {question.choices.map((option, index) => (
          <FormControlLabel
            key={
              // @ts-ignore - 'value' should always be present and unique
              option.value
            }
            value={
              // @ts-ignore - 'value' should always be present and unique
              option.value
            }
            control={<Radio />}
            label={
              // @ts-ignore - 'value' should always be present and unique
              option.labelText || option.labelText
            }
          />
        ))}
      </RadioGroup>
      <Button variant="contained" onClick={() => setResponse("")}>
        Reset
      </Button>
    </FormControl>
  );
};
