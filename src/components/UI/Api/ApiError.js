const ApiError = (props) => {
  return (
    <>
      <p>An API error has occurred.</p>
      <p>{props.message}</p>
    </>
  );
};

export default ApiError;
