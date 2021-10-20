// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// import fetchJson from "../../lib/fetchJson";
import withSession from "../../lib/session";

export default withSession(async (req, res) => {
  const { username, role } = await req.body;

  try {
    //TODO : Fetch dari db
    const user = {
      username,
      nama: role === "admin" ? "Admin" : `${role} salamuddin`,
      role,
      isLoggedIn: true,
    };
    req.session.set("user", user);
    await req.session.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
