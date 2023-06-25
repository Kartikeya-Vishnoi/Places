import { useContext } from "react";
import {useNavigate} from "react-router-dom";

import Input from "../../shared/FormElements/Input";
import "./PlaceForm.css";
import { VALIDATOR_REQUIRE } from "../../shared/utils/validators";
import { VALIDATOR_MINLENGTH } from "../../shared/utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import Button from "../../../src/shared/FormElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/authcontext";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/FormElements/ImageUpload"
//Yahan ke reducers oveall form ki validity ko

function NewPlace() {
  const [formState, inputHandler] = useForm(
    {
        title: {
          value: "",
          isValid: false,
        },
        description: {
          value: "",
          isValid: false,
        },
        address: {
          value: "",
          isValid: false,
        },
        image: {
          value: null,
          isValid: false
        }
    },
    false
  );
  const {isLoading, sendRequest, error, clearError} = useHttpClient();
  const auth = useContext(AuthContext);
  const navigate = useNavigate()

  const placeSubmitHandler = async(event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('address', formState.inputs.address.value);
      formData.append('image', formState.inputs.image.value);
      await sendRequest('http://localhost:5000/api/places', 'POST', formData, {
        Authorization: 'Bearer ' + auth.token
      });
      navigate("/");
    } catch (error) {
      
    }

  }

  return (
    <>
    <ErrorModal error={error} onClear={clearError}/>
    {isLoading && <LoadingSpinner asOverlay/>}
    <form className="place-form">
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        onInput={inputHandler}
      />

      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description of (at least 5 characters)."
        onInput={inputHandler}
      />

      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />
      <ImageUpload id="image" onInput={inputHandler} errorText="Please provide an image."/>
      <Button type="submit" disabled={!formState.isValid} onClick={placeSubmitHandler}>
        ADD PLACE
      </Button>
    </form>
    </>
  );
}

export default NewPlace;