const H5Header = (props) => {
  return (
    <div className='row'>
      <div className='col-8'>
        <h5>{props.h5}</h5>
      </div>
      <div className='col-4 text-right'>
        {props.children}
      </div>
    </div>
  );
};

export default H5Header;
