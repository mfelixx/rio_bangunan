import { useGetTopProductsQuery } from "../../redux/api/apiSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import "../../index.css";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mt-10 mb-5 flex justify-center">
      {isLoading ? null : error ? (
        toast.error(
          "Something went wrong" ||
            error?.data?.error ||
            error?.data?.message ||
            error?.message
        )
      ) : (
        <Slider
          {...settings}
          className="xl:w-[60rem] lg:w-[60rem] md:w-[66rem] sm:block drop-shadow-lg shadow-gray-300"
        >
          {products.map((product) => (
            <div key={product._id}>
              <img
                src={product.image}
                className="w-full rounded-lg object-cover h-[30rem]"
                alt={product.name}
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
