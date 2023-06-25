import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";

import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/UIElements/ErrorModal";

function UserPlaces() {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    const getPlaces = async () => {
      try {
        const response = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(response.places);
        console.log(loadedPlaces)
      } catch (error) {}
    };

    getPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler}/>}
    </>
  );
}

export default UserPlaces;
