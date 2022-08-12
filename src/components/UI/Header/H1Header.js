const H1Header = (props) => {
  return (
    <div className={'row ' + props.className}>
      <div className='col-8'>
        <h1>{props.h1}</h1>
      </div>
      <div className='col-4 text-right'>
        {props.children}
      </div>
    </div>
  );
};

export default H1Header;
