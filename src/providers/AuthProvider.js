import React, { useState } from "react";

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const [CurrentUser, setCurrentUser] = useState({});
  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  let [postBody, setPostBody] = useState({});

  return (
    <AuthContext.Provider
      value={{
        CurrentUser: CurrentUser,
        setCurrentUser: setCurrentUser,
        IsLoggedIn: IsLoggedIn,
        setIsLoggedIn: setIsLoggedIn,
        postBody: postBody,
        setPostBody: setPostBody,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
