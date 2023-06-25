import "./Input.css";
import { useEffect, useReducer } from "react";
import { validate } from "../utils/validators";

//Yahan ke reducers input states ke individual error ko dekhte hain aur har input ki state ko change hote hi isValid ko update karte hain

const inputReudcer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCHED":
      return {
        ...state,
        istouched: true,
      };
    default: {
      return state;
    }
  }
};

function Input(props) {
  const [inputState, dispatch] = useReducer(inputReudcer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    istouched: false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;
  useEffect(() => {
    onInput(id, value, isValid);
  }, [onInput, id, value, isValid]);

  const onChangeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = (event) => {
    dispatch({ type: "TOUCHED" });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={onChangeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={onChangeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.istouched && "form-control--invalid"
      }`}
    >
      <label htmlFor="props.id">{props.label}</label>
      {element}
      {!inputState.isValid && inputState.istouched && <p>{props.errorText}</p>}
    </div>
  );
}

export default Input;