const FormError = (props) => {
  return <div className={'text-danger mb-2 ' + props.className}>{props.children}</div>
}

export default FormError;
