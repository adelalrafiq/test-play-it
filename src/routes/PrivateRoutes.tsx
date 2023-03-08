import { Outlet, Navigate } from "react-router-dom";
import { fetchToken } from "../utils/helpers";

export default function PrivateRoutes() {
  const data = fetchToken();  
    let token = !!data    
  return token ? <Outlet /> : <Navigate to="/" />;
}


