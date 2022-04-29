const ApiError = (props) => {
  return (
    <>
      <p>An API error has occurred.</p>
      <p>{props.children}</p>
    </>
  );
};

export default ApiError;
