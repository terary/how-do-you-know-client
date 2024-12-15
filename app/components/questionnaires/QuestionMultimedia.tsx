import type { FC } from "react";
import type { TQuestionMultimedia } from "../../questionnaires/types";

export const QuestionMultimedia: FC<{ question: TQuestionMultimedia }> = ({
  question,
}) => {
  return (
    <div>
      <p>{question.instructionText}</p>
      {question.links.map((link, index) => (
        <div key={index}>
          {link.mediaContentType === "link/youtube" && (
            <iframe
              width={link.width}
              height={link.height}
              src={link.url}
              title={link.specialInstructionText}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {link.mediaContentType === "link/image" && (
            <img
              src={link.url}
              width={link.width}
              height={link.height}
              alt={link.specialInstructionText}
            />
          )}
          <p>{link.specialInstructionText}</p>
        </div>
      ))}
    </div>
  );
};
