const FormResponse = (props) => {
  return <div className={'text-success my-3 ' + props.className}>{props.children}</div>
}

export default FormResponse;
