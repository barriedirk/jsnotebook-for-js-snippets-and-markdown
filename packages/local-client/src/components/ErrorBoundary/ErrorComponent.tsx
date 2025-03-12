import { ErrorInfo } from "react";

interface ErrorMessageProps {
  error: Error;
  errorInfo: ErrorInfo;
}

export default function ErrorMessage({ error, errorInfo }: ErrorMessageProps) {
  return (
    <section>
      <p>There was an error when tried to rendering a component</p>
      <p>{error.message}</p>
      {errorInfo.componentStack && (
        <div>
          <span>Component:</span>

          <p>{errorInfo.componentStack}</p>
        </div>
      )}
    </section>
  );
}
