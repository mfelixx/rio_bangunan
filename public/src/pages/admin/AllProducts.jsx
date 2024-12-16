import { Link } from "react-router-dom";
import moment from "moment-timezone";
import { useAllProductsQuery } from "../../redux/api/apiSlice";
import AdminMenu from "./AdminMenu";
import "moment/locale/id";
import { useEffect } from "react";

const AllProducts = () => {
  moment.locale("id");

  function formatHarga(harga) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  }

  const { data: products, isLoading, isError, refetch } = useAllProductsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <div className="loader"></div>;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }
  return (
    <div className="2xl:container mx-[9rem]">
      <div className="flex flx-col md:flex-row ">
        <div className="p-3">
          <div className="ml-[2rem] text-xl font-semibold h-12">
            All Products ({products.length})
          </div>

          <div className="flex flex-wrap justify-around items-center">
            {products.map((product) => (
              <div
                key={product._id}
                // to={`/admin/product/update/${product._id}`}
                className="block mb-4 overflow-hidden"
              >
                <div className="flex">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-[10rem] object-cover"
                  />

                  <div className="p-4 flex flex-col justify-around">
                    <div className="flex justify-between">
                      <h6 className="text-xl font-semibold mb-2">
                        {product?.name}
                      </h6>

                      <p className="text-gray-400 text-sm">
                        {moment
                          .tz(product.createdAt, "Asia/Jakarta")
                          .format("LL")}
                      </p>
                    </div>

                    <p className="text-gray-400 xl:w-[25rem] md:w-[15rem] sm:w-[5rem] text-sm mb-4">
                      {product?.description?.substring(0, 160)}...
                    </p>

                    <div className="flex justify-between">
                      <Link
                        to={`/admin/product/update/${product._id}`}
                        className="inline-flex items-center px-3 py-2 text-sm   font-medium text-center bg-blue-500 rounded-lg text-white hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        Update Product{" "}
                        <svg
                          className="w-3.5 h-3.5 ml-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 14 10"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                          />
                        </svg>
                      </Link>
                      <p>{formatHarga(product.price)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/4 p-3 mt-2">
          <AdminMenu />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
