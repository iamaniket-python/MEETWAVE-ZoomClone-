import { useEffect } from "react";
import { useNavigate } from "react-router";
const Auth = (WrappedComponent) => {
  const Authcomponent = (props) => {
    const router = useNavigate();

    const isAuthnticated = () => {
      if (localStorage.getItem("token")) {
        return true;
      }
      return false;
    };

    useEffect(() => {
      if (!isAuthnticated()) {
        router("/auth");
      }
    }, []);
    return <WrappedComponent {...props} />;
  };
  return Authcomponent;
};

export default Auth;
