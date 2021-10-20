import withSession from "../../lib/session";

export default withSession(async (req, res) => {
  switch (req.method) {
    case "GET":
      const user = req.session.get("user");
      if (user) {
        res.json({
          isLoggedIn: true,
          ...user,
        });
      } else {
        res.json({
          isLoggedIn: false,
        });
      }
      break;
    case "POST":
      const { username, nama, password } = await req.body;
      console.log("Insert ke db peserta");
      //TODO: Insert ke db peserta
      const newUser = {
        id: "userIdBaru",
        username,
        nama,
        role: "peserta",
        isLoggedIn: true,
      };
      req.session.set("user", newUser);
      await req.session.save();
      res.status(200).json(newUser);
  }
});
