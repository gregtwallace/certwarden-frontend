import InputText from './InputText';
import FormInformation from './FormInformation';
import Button from '../Button/Button';

const InputTextArray = (props) => {
  
  // instead of a state update, send the new array
  // to parent (parent should have state)
  // emulate event object so handlers can treat
  // this input similar to other inputs
  const updateParent = (newArray) => {
    const event = {};
    event.target = {};

    event.target.id = props.id;
    event.target.value = newArray;

    props.onChange(event);
  }

  // input handler
  const inputHandler = (event, i) => {
    var newArray = [...props.value];
    newArray[i] = event.target.value;
  
    updateParent(newArray)
  };

  // add another input field
  const addFieldHandler = (event) => {
    event.preventDefault();

    var newArray = [...props.value];
    newArray.push('');
    
    updateParent(newArray)
  };

  // remove a string
  const removeFieldHandler = (event) => {
    event.preventDefault();

    var newArray = [...props.value];
    newArray.pop();

    updateParent(newArray)
  };

  return (
    <div className='form-group'>
      <label htmlFor={props.id}>{props.label}</label>
      {props.value.length === 0 ? (
        <FormInformation>None</FormInformation>
      ) : (
        props.value.map((m, i) => (
          <InputText
            id={i}
            name={i}
            key={i}
            value={m}
            onChange={(event) => inputHandler(event, i)}
          />
        ))
      )}
      <Button type='success' onClick={addFieldHandler}>
        Add
      </Button>
      <Button type='danger' onClick={removeFieldHandler}>
        Rem
      </Button>
    </div>
  );
};

export default InputTextArray;
