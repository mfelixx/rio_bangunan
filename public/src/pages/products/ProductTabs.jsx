/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/apiSlice";
import SmallProduct from "./SmallProduct";
import toast from "react-hot-toast";
import "../../index.css";
import moment from "moment";
import "moment-timezone";

const ProductTabs = ({
  isReviewLoading,
  submitHandler,
  userInfo,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading: isTopProductLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);
  const [clickReview, setClickReview] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const reviewsPerPage = 3;

  if (isTopProductLoading)
    return <div className="loader bg-black text-white"></div>;

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const clickTabReview = (reviewId) => {
    if (clickReview === reviewId) return setClickReview(null);
    setClickReview(reviewId);
  };

  const handlePrevClick = () => {
    if (startIndex - reviewsPerPage >= 0) {
      setStartIndex(startIndex - reviewsPerPage);
    }
  };

  const handleNextClick = () => {
    if (startIndex + reviewsPerPage < product.reviews.length) {
      setStartIndex(startIndex + reviewsPerPage);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <section className="mr-[5rem]">
        <div
          className={`flex-1 p-2 cursor-pointer text-lg ${
            activeTab === 1 ? "font-bold" : ""
          }`}
          onClick={() => handleTabClick(1)}
        >
          Write Your Review :
        </div>
        <div
          className={`flex-1 p-2 cursor-pointer text-lg ${
            activeTab === 2 ? "font-bold" : ""
          }`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews :
        </div>
        <div
          className={`flex-1 p-2 cursor-pointer text-lg ${
            activeTab === 3 ? "font-bold" : ""
          }`}
          onClick={() => handleTabClick(3)}
        >
          Related Products :
        </div>
      </section>

      <section>
        {activeTab === 1 && (
          <div className="border p-3 rounded-lg">
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <span>
                  <label htmlFor="rating" className="text-lg mb-1 mr-3">
                    Rating :
                  </label>

                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </span>

                <div className="my-2">
                  <label htmlFor="comment" className="block text-lg mb-2">
                    Comment :
                  </label>
                  <textarea
                    name="comment"
                    id="comment"
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border rounded-lg xl:w-[40rem] text-block"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isReviewLoading}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>
                <Link to="/login" className="text-blue-500 hover:underline">
                  Sign In First
                </Link>
              </p>
            )}
          </div>
        )}
      </section>

      <section>
        {activeTab === 2 && (
          <>
            <div>{product.reviews.length === 0 && <p>No reviews</p>}</div>

            <div>
              {product.reviews
                .slice(startIndex, startIndex + reviewsPerPage)
                .map((review) => (
                  <div
                    key={review._id}
                    onClick={() => clickTabReview(review._id)}
                    className="rounded-lg xl:ml-[2rem] sm:ml-[0rem] xl:w-[50rem] sm:w-[25rem] mb-1"
                  >
                    <div className="flex justify-between p-3 bg-gray-400">
                      <strong className="text-white">{review.name}</strong>
                      <p className="text-white">
                        {moment
                          .tz(review.createdAt, "Asia/Jakarta")
                          .format("LL")}
                      </p>
                    </div>
                    {clickReview === review._id && (
                      <div className="border-2 border-gray-400 px-3">
                        <p className="my-4">{review.comment}</p>
                      </div>
                    )}
                  </div>
                ))}

              <div className="flex justify-between rounded-lg xl:ml-[2rem] sm:ml-[0rem] xl:w-[5rem] sm:w-[2.5rem] text-blue-500 hover:underline">
                {startIndex > 0 && (
                  <button onClick={handlePrevClick}>Prev</button>
                )}
                {startIndex + reviewsPerPage < product.reviews.length && (
                  <button onClick={handleNextClick}>Next</button>
                )}
              </div>
            </div>
          </>
        )}
      </section>

      <section>
        {activeTab === 3 && (
          <section className="ml-[4rem] flex flex-wrap">
            {!data ? (
              <div className="loader2"></div>
            ) : (
              data.map((product) => (
                <div key={product._id}>
                  <SmallProduct product={product} />
                </div>
              ))
            )}
          </section>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
