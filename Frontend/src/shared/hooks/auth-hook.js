import { useState, useEffect, useCallback } from "react";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [userId, setUserId] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
  
    const login = useCallback((uid, token, expirationDate) => {
      setToken(token);
      setUserId(uid);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 60*60*1000);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: token,
          expiration: tokenExpirationDate.toISOString(), //converts time to string, such that it can be again converted into a time object using new Date(),
        })
        //.stringify method converts the JSON data to string because to localstorage u can only write text or numbers as text
      );
    }, []);
    const logout = useCallback(() => {
      setToken(null);
      setUserId(null);
      setTokenExpirationDate(null);
      localStorage.removeItem("userData");
    }, []);
  
    useEffect(() => {
      if (token && tokenExpirationDate) {
        const remTime = tokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remTime);
      } else {
        clearTimeout(logoutTimer);
      }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem("userData"));
      //JSON.parse converts string back to JSON
      if (
        storedData &&
        storedData.token &&
        new Date(storedData.expiration > new Date())
      ) {
        login(
          storedData.userId,
          storedData.token,
          new Date(storedData.expiration)
        );
      }
    }, [login]);
    return {login, token, logout, userId};

}