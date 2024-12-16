import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/apiSlice";
import { useGetAllCategoriesQuery } from "../../redux/api/apiSlice";
import toast from "react-hot-toast";
import _ from "lodash";
import AdminMenu from "./AdminMenu";

const UpdateProduct = () => {
  const params = useParams();
  const { data: productData, refetch } = useGetProductByIdQuery(params.id);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [countInStock, setCountInStock] = useState(productData?.countInStock);

  const navigate = useNavigate();
  const { data: categories = [] } = useGetAllCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setCountInStock(productData.countInStock);
      refetch();
    }
  }, [productData, refetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", countInStock);

      const { data } = await updateProduct({
        productId: params.id,
        productData,
      });
      if (data.error) {
        toast.error(data.error || "Update failed");
      } else {
        toast.success("Product successfully updated");
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.log(error?.data.error || error.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      let check = window.confirm(`Are you sure want to delete ${name}?`);

      if (!check) return;
      const { data } = await deleteProduct(params.id);
      if (data.error) {
        toast.error(data.error || "Delete failed");
      } else {
        toast.success("Product deleted successfully");
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      toast.error(error.data?.error || error.message || "Delete failed");
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      const data = await uploadProductImage(formData).unwrap();
      toast.success(data.msg);
      setImage(data.img);
    } catch (error) {
      toast.error("Error uploading image");
    }
  };
  return (
    <div>
      <div className="2xl:container xl:mx-[9rem] sm:mx-[0]">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-auto p-3">
            <div className="h-12">Create Product</div>

            {image && (
              <div className="text-center">
                <img
                  src={image}
                  alt="Product"
                  className="block mx-auto max-h-[150px]"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="border  px-4 block w-full text-center text-gray-400 rounded-lg cursor-pointer font-bold py-11">
                {image ? image.name : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadFileHandler}
                  className={!image ? "hidden" : ""}
                />
              </label>
            </div>

            <div className="p-3">
              <div className="flex flex-wrap">
                <div className="one">
                  <label htmlFor="name">Name</label>
                  <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[27rem] border rounded-lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="two ml-4">
                  <label htmlFor="name block">Price</label>
                  <br />
                  <input
                    type="number"
                    className="p-4 mb-3 w-[27rem] border rounded-lg"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap">
                <div className="one">
                  <label htmlFor="name">Quantity</label>
                  <br />
                  <input
                    type="number"
                    className="p-4 mb-3 w-[27rem] border rounded-lg"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="two ml-4">
                  <label htmlFor="name block">Brand</label>
                  <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[27rem] border rounded-lg"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <label htmlFor="" className="my-5">
                Description
              </label>
              <textarea
                type="text"
                className="p-2 mb-3 border rounded-lg w-[95%]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <div className="flex flex-wrap">
                <div>
                  <label htmlFor="name block">Stock</label>
                  <br />
                  <input
                    type="number"
                    className="p-4 mb-3 w-[27rem] border rounded-lg"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                </div>

                <div className="ml-4">
                  <label htmlFor="name block">Category</label>
                  <br />
                  <select
                    aria-placeholder="Choose Category"
                    className="p-4 mb-3 w-[27rem] border rounded-lg"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {_.capitalize(category.name)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer font-semibold py-2 px-4 my-[1rem] focus:ring-2"
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white rounded cursor-pointer font-semibold py-2 px-4 my-[1rem] focus:ring-2 ml-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
