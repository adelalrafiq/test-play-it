interface TokenDetails {
  jwt: {
    token: string;
  };
}

const URL_AUTH = process.env.REACT_APP_URL_AUTH; 

export const saveToken = (tokenDetails: TokenDetails): void => {
  localStorage.setItem("userDetails", JSON.stringify(tokenDetails));
};

export const fetchToken = ()=> {
  try{
    let user = JSON.parse(localStorage.getItem("userDetails") as string);
     const token =  user.jwt.token    
    return token;
  } catch (error){
    console.error(error)
  }
};

export const login = async (email: string, password: string) => {
  return await fetch(`${URL_AUTH}`, {
    method: "POST",
    headers: {
      accept: "*/*",
      authorization: "Bearer null",
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({ email, password }),    
  });
};
