import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../redux/api/apiSlice";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const [editUserId, setEditUserId] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteUserHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully", { duration: 2000 });
        refetch();
      } catch (error) {
        toast.error(error.message || error.data.error, { duration: 2000 });
      }
    } else {
      toast.error("User not deleted", { duration: 2000 });
    }
  };

  const toogleEdit = (id, username, email) => {
    setEditUserId(id);
    setEditUsername(username);
    setEditEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      if (editUsername.length > 8) {
        return toast.error("Username must be less than 8 characters", {});
      }
      await updateUser({
        userId: id,
        username: editUsername,
        email: editEmail,
      });

      setEditUserId(null);
      toast.success("User updated successfully", { duration: 2000 });
      refetch();
    } catch (error) {
      toast.error(error.data.error, { duration: 2000 });
    }
  };

  return (
    <div className="p-4 container mx-auto">
      <AdminMenu />
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {isLoading ? (
        <div className="loader"></div>
      ) : error ? (
        toast.error(error?.data.message || error.message)
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* Admin menu */}
          <table className="w-full md:w-4/5 mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">NAME</th>
                <th className="px-4 py-2 text-left">EMAIL</th>
                <th className="px-4 py-2 text-left">ADMIN</th>
                <th className="px-4 py-2 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2">{user._id}</td>
                  <td className="px-4 py-2">
                    {editUserId === user._id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-blue-500 px-4 py-2 rounded-lg text-white"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {user.username} {""}
                        <button
                          onClick={() =>
                            toogleEdit(user._id, user.username, user.email)
                          }
                        >
                          <FaEdit className="ml-[1rem]" />
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {editUserId === user._id ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full p-2 border rounded-lg"
                        />
                        <button
                          onClick={() => updateHandler(user._id)}
                          className="ml-2 bg-blue-500 px-4 py-2 rounded-lg text-white"
                        >
                          <FaCheck />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <p>{user.email}</p>
                        <button
                          onClick={() =>
                            toogleEdit(user._id, user.username, user.email)
                          }
                        >
                          <FaEdit className="ml-[1rem]" />
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>

                  <td className="px-4 py-2">
                    {!user.isAdmin && (
                      <div className="flex">
                        <button
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold text-white"
                          onClick={() => deleteUserHandler(user._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
