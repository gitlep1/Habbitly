import "./Error.scss";

export const ErrorDisplay = ({ error }) => {
  return (
    <div className="error">
      <p className="error-text">{error}</p>
    </div>
  );
};
