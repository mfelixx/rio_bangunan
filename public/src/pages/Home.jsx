import { useGetProductsQuery } from "../redux/api/apiSlice";
import Header from "../components/Header";
import "../index.css";
import { useEffect } from "react";

const Home = () => {
  const { data: products, isLoading, refetch } = useGetProductsQuery({});

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <h1 className="w-screen mx-20 flex justify-start text-4xl font-bold">
        KANG TUKANG
      </h1>
      {isLoading ? (
        <div className="w-full mx-5 h-[45rem] flex justify-center items-center ">
          <div className="loader2"></div>
        </div>
      ) : products ? (
        <Header />
      ) : (
        <div className="text-red-500 py-5 italic w-screen flex justify-center">
          No product data
        </div>
      )}
    </>
  );
};

export default Home;
