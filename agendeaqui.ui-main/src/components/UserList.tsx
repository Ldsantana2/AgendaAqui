// src/components/UsersList.tsx
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../services/api";

const UsersList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get("token");
      if (!token) {
        console.error("Token não encontrado!");
        setError("Token não encontrado!");
        return;
      }

      console.log("Token:", token);

      try {
        const response = await api.get("/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Usuários:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        setError("Erro ao buscar usuários.");
      }
    };

    fetchUsers();
  }, []); // O array vazio faz a requisição ser feita uma vez, ao carregar a página

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* Exibindo o erro, se houver */}
      <ul>
        {users.length > 0 ? (
          users.map((user) => <li key={user.id}>{user.email}</li>)
        ) : (
          <p>Nenhum usuário encontrado.</p>
        )}
      </ul>
    </div>
  );
};

export default UsersList;
