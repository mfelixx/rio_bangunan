import toast from "react-hot-toast";
import { useCreateOrderMutation } from "../../redux/api/apiSlice";
import { useNavigate } from "react-router";

const CreateOrderHandler = () => {
  const [createOrder] = useCreateOrderMutation();
  const navigate = useNavigate();

  const createOrderHandler = async ({ data }) => {
    try {
      console.log(data);
      const res = await createOrder(data).unwrap();
      navigate(`/orders/${res._id}`);
      toast.success(res.msg);
    } catch (error) {
      toast.error(error.data.error);
    }
  };
  return { createOrderHandler };
};

export default CreateOrderHandler;
