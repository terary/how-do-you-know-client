import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type ApiError = FetchBaseQueryError | SerializedError;

export const handleApiError = (error: ApiError) => {
  if ("status" in error) {
    // FetchBaseQueryError
    const status = error.status;
    if (status === "FETCH_ERROR") {
      console.error("Network error:", error.error);
    } else if (status === "PARSING_ERROR") {
      console.error("Parsing error:", error.error);
    } else if (typeof status === "number") {
      console.error(`Server error ${status}:`, error.data);
    }
  } else {
    // SerializedError
    console.error("API error:", error.message);
  }
};
