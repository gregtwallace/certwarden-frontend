const ApiError = (props) => {
  return (
    <>
      <p>API error has occurred.</p>
      <p>Message: {props.message}</p>
    </>
  );
};

export default ApiError;
