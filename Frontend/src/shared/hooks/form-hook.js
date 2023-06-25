import { useReducer, useCallback } from "react";
//inputs formreducer ke state ki object array, this array is assigned to inputs via argument, i.e an object array consisting of information
//regarding the input types like email, description, password etc. and their coressponding fields of value and validity 
// inputs: {
//   email: {
//     value: "",
//     isValid: false,
//   },
//   password: {
//     value: "",
//     isValid: false,
//   },
// }
// bhai, action.id is used to tell about the input type while dispatching the action in the onChange of Input
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if(!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid,
          },
        },
        isValid: formIsValid,
      };
    case "SET_DATA":
      return{
        inputs: action.inputs,
        isValid: action.formIsValid
      }  
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialValidity,
  });

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type:'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity
    })
  }, [])

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      isValid: isValid,
      value: value,
      inputId: id,
    });
  }, []);
  return [formState, inputHandler, setFormData];
};