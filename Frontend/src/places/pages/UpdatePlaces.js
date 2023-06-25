import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Input from "../../shared/FormElements/Input";
import "./PlaceForm.css";
import Button from "../../shared/FormElements/Button";
import Card from "../../shared/UIElements/Card";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/authcontext";

function UpdatePlaces() {
  const placeId = useParams().placeId;
  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState(null);
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const navigate = useNavigate();
  const auth = useContext(AuthContext)

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: 'Bearer ' + auth.token
        }
      );
      navigate(`/${auth.userId}/places`)
    } catch (error) {}
  };

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        if (responseData.place) {
          setLoadedPlace(responseData.place);
          setFormData(
            {
              title: {
                value: responseData.place.title,
                isValid: true,
              },
              description: {
                value: responseData.place.description,
                isValid: true,
              },
            },
            true
          );
        }
      } catch (error) {}
    };
    getPlaces();
  }, [sendRequest, placeId, setFormData]);

  if (isLoading) {
    return (
      <>
        {isLoading && (
          <div className="center">
            <LoadingSpinner />
          </div>
        )}
      </>
    );
  }

  if (!loadedPlace && !isLoading) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form">
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button
            type="submit"
            disabled={!formState.isValid}
            onClick={placeUpdateSubmitHandler}
          >
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
}
//AMul malai paneer

export default UpdatePlaces;
