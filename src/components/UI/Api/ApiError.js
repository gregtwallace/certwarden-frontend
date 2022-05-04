const ApiError = (props) => {
  return (
    <>
      <div className='text-danger mb-2'>
        <p>An API error has occurred.</p>
        <p>{props.children}</p>
      </div>
    </>
  );
};

export default ApiError;
