import executeQuery from "../../config/db";

export default async (req, res) => {
  if (req.method !== "POST") return;

  const { username, password, role } = req.body;

  const result = await executeQuery({
    query: `SELECT id, username${role !== "admin" ? ", nama" : ""} 
            FROM ${role} 
            WHERE username = '${username}' 
            AND password = md5('${password}')`,
  });
  if (!result.length) {
    return res.json({
      error: true,
      message: "Akun tidak ditemukan",
    });
  }
  const user = {
    id: result[0].id,
    username: result[0].username,
    nama: result[0].nama ?? "Admin",
    role,
  };

  res.json(user);
};
