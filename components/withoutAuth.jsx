import { useRouter } from "next/router";

const withoutAuth = (WrappedComponent) => {
  return (props) => {
    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const router = useRouter();

      const user = localStorage.getItem("user");

      // If there is access token we redirect to "/" page.
      if (user) {
        router.replace("/");
        return null;
      }

      // If this is an user we just render the component that was passed with all its props

      return <WrappedComponent {...props} />;
    }

    // If we are on server, return null
    return null;
  };
};

export default withoutAuth;
