import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/apiSlice";
import { useGetAllCategoriesQuery } from "../redux/api/apiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import ProductCard from "./products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const getAllCategories = useGetAllCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  useEffect(() => {
    if (!getAllCategories.isLoading) {
      dispatch(setCategories(getAllCategories.data));
    }
  }, [getAllCategories.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updateChecked = value
      ? [...checked, id]
      : checked.filter((item) => item !== id);
    dispatch(setChecked(updateChecked));
  };
  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <>
      <div className="container mx-20">
        <div className="flex md:flex-row">
          <div className="bg-blue-500 my-2 p-2">
            <h2 className="h4 text-center py-2 mb-2 px-2 rounded-full bg-white">
              Filter by Categories
            </h2>

            <div className="p-5 w-[15rem]">
              {categories?.map((category) => (
                <div key={category._id} className="mb-2">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id="black-checkbox"
                      onChange={(e) =>
                        handleCheck(e.target.checked, category._id)
                      }
                      className="w-3 h-3 text-white border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-white dark:ring-offset-white focus:ring-2"
                    />

                    <label
                      htmlFor="blue-checkbox"
                      className="ml-2 text-sm font-medium text-white"
                    >
                      {category.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-white rounded-full mb-2">
              Filter by Brands
            </h2>

            <div className="p-5">
              {uniqueBrands?.map((brand) => (
                <>
                  <div className="flex items-center mr-4 mb-4">
                    <input
                      className="border-3"
                      type="radio"
                      id={brand}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                    />

                    <label
                      htmlFor="blue-radio"
                      className="ml-2 text-sm font-medium text-white"
                    >
                      {brand}
                    </label>
                  </div>
                </>
              ))}
            </div>

            <h2 className="h4 text-center py-2 bg-white rounded-full mb-2">
              Filter by Price
            </h2>

            <div className="p-5 w-[15rem]">
              <input
                type="text"
                placeholder="Enter Price"
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full py-2 px-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring"
              />
            </div>

            <div className="p-4 flex justify-center pt-0">
              <button
                className="w-1/2 border my-4 text-white rounded-lg"
                onClick={() => window.location.reload()}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="p-3">
            <h2 className="text-center mb-2">{products.length} Products</h2>
            <div className="flex flex-wrap">
              {products.length === 0 ? (
                <div className="absolute top-1/2 left-1/2">
                  <div className="loader2"></div>
                </div>
              ) : (
                products?.map((product) => (
                  <div className="p-3" key={product._id}>
                    <ProductCard p={product} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
