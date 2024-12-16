import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import moment from "moment";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/apiSlice";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import "../../index.css";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  function formatHarga(harga) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  }

  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: products,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: isReviewLoading }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const dataCreate = await createReview({
        id: productId,
        rating,
        comment,
      }).unwrap();

      setRating(0);
      setComment("");
      refetch();
      toast.success(dataCreate.msg || "Review submitted");
    } catch (error) {
      toast.error(
        error.data?.message ||
          error.data?.error ||
          error.message ||
          "Failed to submit review"
      );
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...products, qty }));
    navigate("/cart");
  };
  return (
    <>
      <div>
        <Link
          to="/"
          className="text-blue-500 font-semibold hover:underline ml-[10rem]"
        >
          back
        </Link>
      </div>

      {isLoading ? (
        <div className="loader2"></div>
      ) : error ? (
        toast.error(error.data?.message || error.data?.error || error.message)
      ) : (
        <>
          <div className="flex flex-wrap relative items-between ml-[10rem] mt-[2rem]">
            <div>
              <img
                src={products.image}
                alt={products.name}
                className="xl:w-[40rem] lg:w-[35rem] md:w-[20rem] sm:w-[10rem] mr-[1rem] shadow-gray-300 shadow-lg"
              />
            </div>

            <div className="flex flex-col justify-between">
              <h2 className="text-2xl font-semibold">{products.name}</h2>
              <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0] ">
                {products.description}
              </p>

              <p className="text-5xl my-4 font-semibold">
                {formatHarga(products.price)}
              </p>

              <div className="flex items-center justify-between w-[20rem]">
                <div className="one">
                  <h1 className="flex items-center mb-6">
                    <FaStore className="mr-2" /> Brand:{"\t"}
                    {products.brand}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[20rem]">
                    <FaClock className="mr-2" /> Added:{"\t"}
                    {moment(products.createdAt).fromNow()}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2" /> Review:{"\t"}
                    {products.numReviews}
                  </h1>
                </div>

                <div className="two">
                  <h1 className="flex items-center mb-6">
                    <FaStar className="mr-2" />
                    Rating: {"\t"} {parseFloat(products.rating).toFixed(2)}
                  </h1>
                  <h1 className="flex items-center mb-6">
                    <FaShoppingCart className="mr-2" />
                    Quantity: {"\t"} {products.quantity}
                  </h1>
                  <h1 className="flex items-center mb-6 w-[10rem]">
                    <FaBox className="mr-2" />
                    Stock: {"\t"}{" "}
                    {products.countInStock > 0 ? products.countInStock : 0}
                  </h1>
                </div>
              </div>

              <div className="flex justify-between flex-wrap">
                <Ratings
                  value={products.rating}
                  text={`${products.numReviews} reviews`}
                />

                {products.countInStock === 0 ? null : (
                  <div className="w-[6rem] rounded-lg text-block p-2">
                    <button onClick={() => setQty(qty > 0 ? qty - 1 : 0)}>
                      {
                        <FaMinus className="border rounded-full bg-black text-white p-0.25" />
                      }
                    </button>
                    <span className="mx-2">{qty}</span>
                    <button
                      onClick={() =>
                        setQty(
                          qty >= products.countInStock
                            ? products.countInStock
                            : qty + 1
                        )
                      }
                    >
                      {
                        <FaPlus className="border rounded-full bg-black text-white p-0.25" />
                      }
                    </button>
                  </div>
                )}
              </div>
              <div className="btn-container mt-4">
                <button
                  onClick={addToCartHandler}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                  // eslint-disable-next-line react/no-unknown-property
                  disabled={products.countInStock <= 0 && true}
                >
                  Add To Cart
                </button>
              </div>
            </div>

            <div className="mt-[5rem] containet flex flex-wrap items-start justify-between ml-[10rem]">
              <ProductTabs
                isReviewLoading={isReviewLoading}
                submitHandler={submitHandler}
                userInfo={userInfo}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                product={products}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetails;
