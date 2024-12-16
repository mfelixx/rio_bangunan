import { useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
// import { useGetOrderDetailsQuery } from "../../redux/api/apiSlice";
import { usePayOrderMutation } from "../../redux/api/apiSlice";
import { useConfirmPaymentMutation } from "../../redux/api/apiSlice";
import { useDispatch } from "react-redux";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import {
  MIDTRANS_CLIENT_KEY,
  MIDTRANS_CLIENT_URL,
} from "../../redux/constants";

const PayOrders = () => {
  const { id: orderId } = useParams();
  // const { data: details } = useGetOrderDetailsQuery(orderId);
  const [confirmPayment] = useConfirmPaymentMutation();
  const [payOrder] = usePayOrderMutation();
  const [snapToken, setSnapToken] = useState(null);
  const [isSnapActive, setIsSnapActive] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = MIDTRANS_CLIENT_URL; // Gunakan URL sandbox untuk pengujian
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY);
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!orderId) return;

    const fetchSnapToken = async () => {
      try {
        const res = await payOrder(orderId).unwrap();
        setSnapToken(res.token);
      } catch (error) {
        console.error("Failed to fetch Snap token:", error.message);
      }
    };

    fetchSnapToken();
  }, [orderId, payOrder]);

  const updateConfirmPayment = useCallback(async () => {
    try {
      const res = await confirmPayment(orderId).unwrap();
      console.log(res.error);
    } catch (error) {
      console.log(error.message);
    }
  }, [confirmPayment, orderId]);

  useEffect(() => {
    if (!snapToken || isSnapActive) return;
    setIsSnapActive(true);

    window.snap.pay(snapToken, {
      onSuccess: (result) => {
        console.log("Payment successful:", result);
        dispatch(clearCartItems());
        updateConfirmPayment();
        setIsSnapActive(false);
      },
      onPending: (result) => {
        // Ketika pembayaran masih dalam proses (optional)
        console.log("Payment pending:", result);
        setIsSnapActive(false);
      },
      onError: (error) => {
        // Ketika pembayaran gagal
        console.error("Payment error:", error);
        setIsSnapActive(false);
      },
      onClose: () => {
        // Ketika widget ditutup tanpa selesaikan pembayaran
        console.log("Widget closed without payment");
        setIsSnapActive(false);
      },
    });
  }, [snapToken, dispatch, updateConfirmPayment, isSnapActive]);

  return <div>{snapToken && <div id="midtrans-snap"></div>}</div>;
};

export default PayOrders;
