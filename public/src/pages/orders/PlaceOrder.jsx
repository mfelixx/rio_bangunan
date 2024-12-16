import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ProgressStep from "../../components/ProgressSteps";
// import { clearCartItems } from "../../redux/features/cart/cartSlice";
import "../../index.css";
import CreateOrderHandler from "./CreateOrderHandler";
const PlaceOrder = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { createOrderHandler } = CreateOrderHandler();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  // const dispatch = useDispatch();

  function formatHarga(harga) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  }

  const placeOrderHandler = async () => {
    try {
      const newOrder = {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      };

      createOrderHandler({ data: newOrder });
    } catch (error) {
      toast.error(error.data.error);
    }
  };
  return (
    <>
      <ProgressStep step1 step2 step3 />

      <div className="container mx-auto mt-8">
        {cart.cartItems.length === 0 ? (
          <div>Your cart is empty</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <td className="px-1 py-2 text-left align-top"></td>
                  <td className="px-1 py-2 text-left">Product</td>
                  <td className="px-1 py-2 text-left">Quantity</td>
                  <td className="px-1 py-2 text-left">Price</td>
                  <td className="px-1 py-2 text-left">Total</td>
                </tr>
              </thead>

              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    </td>

                    <td className="p-2">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">{formatHarga(item.price)}</td>
                    <td className="p-2">
                      {formatHarga(item.qty * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-40">
          <h2 className="text-xl font-semibold mb-4">Order Summary: </h2>
          <div>
            <ul className="text-lg">
              <li>
                <span className="font-semibold mb-2">Tax Shipping (1%): </span>{" "}
                {formatHarga(cart.taxPrice)}
              </li>
              <li>
                <span className="font-semibold mb-2">Items: </span>
                {formatHarga(cart.itemsPrice)}
              </li>
              <li>
                <span className="font-semibold mb-2">Total: </span>
                {formatHarga(cart.totalPrice)}
              </li>
              <li>
                <span className="font-semibold mb-2">Address: </span>
                {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.country}
              </li>
            </ul>

            {/* {error && toast.error(error.data?.message)} */}
          </div>

          <button
            type="button"
            className="bg-blue-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
            disabled={cart.cartItems === 0}
            onClick={placeOrderHandler}
          >
            Order
          </button>

          {/* {isLoading && <div className="loader"></div>} */}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
