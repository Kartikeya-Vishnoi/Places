import { useState, React, useEffect } from "react";

import UserList from "../components/UserList";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";


function Users() {

  const[loadedUsers, setLoadedUsers] = useState(); 
  const {isLoading, error, sendRequest, clearError} = useHttpClient()
  
  useEffect(() => {
    const fetchUsers = async() =>{
      try {
        const responseData = await sendRequest('http://localhost:5000/api/users');
        setLoadedUsers(responseData.users);
      } catch (error) {
        
      }
    }
    fetchUsers()
  
  }, [sendRequest])

  return (
    <>
      <ErrorModal error={error} onClear={clearError}/>
      {isLoading && 
      <div className="center">
      <LoadingSpinner/>  
      </div>}
      {!isLoading && loadedUsers && <UserList items={loadedUsers}/>}
    </>
  );
}

export default Users;
