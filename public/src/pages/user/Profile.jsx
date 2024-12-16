import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import { useProfileMutation } from "../../redux/api/apiSlice";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useProfileMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.username, userInfo.email]);

  const updateProfileHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const data = await updateProfile({
          _id: userInfo._id,
          username,
          email,
          password,
        }).unwrap();
        dispatch(setCredientials({ ...data }));
        toast.success("Profile updated successfully");
        setPassword("");
        setConfirmPassword("");
      } catch (error) {
        toast.error(error.data.error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[6rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
          <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>

          <form onSubmit={updateProfileHandler}>
            <div className="mb-4">
              <label className="block mb-2">Username</label>
              <input
                type="text"
                className="form-input p-4 border rounded-sm w-full"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Email</label>
              <input
                type="email"
                className="form-input p-4 border rounded-sm w-full"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Password</label>
              <input
                type="password"
                className="form-input p-4 border rounded-sm w-full"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Confirm Password</label>
              <input
                type="password"
                className="form-input p-4 border rounded-sm w-full"
                placeholder="Enter Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                disabled={isLoading}
                type="submit"
                className=" bg-blue-500 hover:bg-blue-700 text-white rounded cursor-pointer font-semibold py-2 px-4 my-[1rem]"
              >
                {isLoading ? <div className="loader"></div> : "Update"}
              </button>

              {userInfo.isAdmin === false && (
                <Link
                  to="/user-orders"
                  className="rounded cursor-pointer font-semibold py-2 px-4 my-[1rem] text-blue-500 hover:underline"
                >
                  My Orders
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
