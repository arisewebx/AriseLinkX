/* eslint-disable react/prop-types */

import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {UrlState} from "@/context";
import CubeLoader from "./cube-loader";

function RequireAuth({children}) {
  const navigate = useNavigate();

  const {loading, isAuthenticated} = UrlState();

  useEffect(() => {
    if (!isAuthenticated && loading === false) navigate("/auth");
  }, [isAuthenticated, loading]);

  if (loading) return <CubeLoader />;

  if (isAuthenticated) return children;

  return null;
}

export default RequireAuth;