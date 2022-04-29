const H2Header = (props) => {
  return (
    <div className='row'>
      <div className='col-8'>
        <h2>{props.h2}</h2>
      </div>
      <div className='col-4 text-right'>
        {props.children}
      </div>
    </div>
  );
};

export default H2Header;
