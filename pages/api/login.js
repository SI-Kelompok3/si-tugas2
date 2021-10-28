export default async (req, res) => {
  const { username, password, role } = req.body;

  // TODO: Fetch user dari DB berdasarkan role
  // Kalo admin namanya kasih Admin aja
  const user = {
    username, role, nama: `${username} ${role}`, id: 'iduser',
  };

  res.json(user);
};
