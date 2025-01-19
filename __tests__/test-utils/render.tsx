import { render } from "@testing-library/react";
import { StoreProvider } from "@/app/StoreProvider";
import { TestWrapper } from "./TestWrapper";

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <StoreProvider>
      <TestWrapper>{ui}</TestWrapper>
    </StoreProvider>
  );
}
