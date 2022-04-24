const TableHeader = (props) => {
  return <th scope={props.scope}>{props.children}</th>;
};

export default TableHeader;
