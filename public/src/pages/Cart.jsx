import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart } from "../redux/features/cart/cartSlice";
import { FaTrash } from "react-icons/fa";
const Cart = () => {
  function formatHarga(harga) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (products, qty) => {
    console.log(qty);
    dispatch(addToCart({ ...products, qty }));
  };

  const deleteFromCartHandler = (id) => {
    dispatch(deleteFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <div className="container flex justify-around items-start flex-wrap mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div>
            Your cart is empty, please add some items.{" "}
            <Link to="/shop" className="text-blue-500 hover:underline">
              Go to shop
            </Link>
          </div>
        ) : (
          <div className="flex flex-col w-[80%]">
            <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center mb-[1rem] pb-2">
                <div className="w-[5rem] h-[5rem]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                <div className="flex-1 ml-4">
                  <Link to={`/product/${item.id}`} className="text-blue-500">
                    {item.name}
                  </Link>

                  <div className="mt-2">{item.brand}</div>
                  <div className="mt-2">{formatHarga(item.price)}</div>
                </div>

                <div className="w-24">
                  <select
                    className="w-full p-1 border rounded text-black"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <button
                    className="text-red-500 mr-[5rem]"
                    onClick={() => deleteFromCartHandler(item._id)}
                  >
                    <FaTrash className="ml-[1rem] mt-[.5rem]" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-8 w-[40rem]">
              <div className="p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">
                  Items (
                  {cartItems.reduce((total, item) => total + item.qty, 0)})
                </h2>

                <div className="text-xl font-bold">
                  {" "}
                  {formatHarga(
                    cartItems.reduce(
                      (total, item) => total + item.qty * item.price,
                      0
                    )
                  )}
                </div>

                <button
                  className="bg-blue-500 mt-4 py-2 px-4 rounded-lg text-lg w-1/2 text-white"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Process to CheckOut
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
