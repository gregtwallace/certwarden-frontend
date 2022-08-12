const Form = (props) => {
  return <form className={props.className} onSubmit={props.onSubmit}>{props.children}</form>;
};

export default Form;
