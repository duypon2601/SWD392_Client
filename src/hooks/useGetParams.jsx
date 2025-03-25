import { use } from "react";
import {userLocation} from "react-router-dom";

function useGetParams() {
  const location = userLocation();
  const getParams = (param) =>{
    const data = new URLSearchParams(location.search);
    return data.get(param);
  };
  return getParams;
}

export default useGetParams;