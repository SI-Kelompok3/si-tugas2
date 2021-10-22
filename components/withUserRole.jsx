import { useRouter } from "next/router";

//Harus dichain sama withAuth (contoh : withAuth(withUserRole(Component, "admin")))
const withUserRole = (WrappedComponent, role) => {
  return (props) => {
    // checks whether we are on client / browser or server.
    if (typeof window !== "undefined") {
      const router = useRouter();

      if (props.user.role !== role) {
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

export default withUserRole;
