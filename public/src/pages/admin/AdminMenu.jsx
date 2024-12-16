import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <>
      <button
        className={`${
          isMenuOpen ? "top-2 right-2" : "top-5 right-7"
        } p-2 fixed rounded-lg border-2 border-gray-400 bg-white z-10`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes color="gray" />
        ) : (
          <>
            <div className="w-6 h-0.5 bg-gray-400 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-400 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-400 my-1"></div>
          </>
        )}
      </button>

      {isMenuOpen && (
        <section className="border-gray-400 border-2 bg-white p-2 fixed right-7 top-5 rounded-lg">
          <ul className="list-none mt-2">
            <li>
              <NavLink
                to="/admin/dashboard"
                className=" py-1 px-3 block mb-1 rounded-sm hover:bg-gray-200"
                style={({ isActive }) => ({
                  color: isActive ? "rgb(244 114 182)" : "gray",
                })}
              >
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/categorylist"
                className=" py-1 px-3 block mb-1 rounded-sm hover:bg-gray-200"
                style={({ isActive }) => ({
                  color: isActive ? "rgb(244 114 182)" : "gray",
                })}
              >
                Create Category
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/productlist"
                className=" py-1 px-3 block mb-1 rounded-sm hover:bg-gray-200"
                style={({ isActive }) => ({
                  color: isActive ? "rgb(244 114 182)" : "gray",
                })}
              >
                Create Product
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/allproductslist"
                className=" py-1 px-3 block mb-1 rounded-sm hover:bg-gray-200"
                style={({ isActive }) => ({
                  color: isActive ? "rgb(244 114 182)" : "gray",
                })}
              >
                All Product
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/userlist"
                className=" py-1 px-3 block mb-1 rounded-sm hover:bg-gray-200"
                style={({ isActive }) => ({
                  color: isActive ? "rgb(244 114 182)" : "gray",
                })}
              >
                Manage Users
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/admin/orderlist"
                className=" py-1 px-3 block mb-1 rounded-sm hover:bg-gray-200"
                style={({ isActive }) => ({
                  color: isActive ? "rgb(244 114 182)" : "gray",
                })}
              >
                Manage Orders
              </NavLink>
            </li>
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;
