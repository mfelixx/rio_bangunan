/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
import { Link } from "react-router-dom";

const SmallProduct = ({ product }) => {
  function formatHarga(harga) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  }
  return (
    <div className="w-[20rem] p-3">
      <Link to={`/product/${product._id}`} className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover h-40 w-full rounded shadow-lg shadow-gray-300"
        />

        <div className="p-54">
          <h2 className="flex justify-between items-center my-2">
            <div>{product.name}</div>
            <span className=" text-sm font-medium px-2.5 py-0.5 rounded-full">
              {formatHarga(product.price)}
            </span>
          </h2>
        </div>
      </Link>
    </div>
  );
};

export default SmallProduct;
