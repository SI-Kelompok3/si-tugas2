export default async (req, res) => {
  const { username, password, role } = req.body;

  //TODO: Fetch user dari DB berdasarkan role
  const user = { username, role, nama: `${username} ${role}`, id: "iduser" };

  res.status(200).json(user);
};
