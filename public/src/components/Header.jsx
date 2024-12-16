import ProductCarousel from "../pages/products/ProductCarousel";
import SmallProduct from "../pages/products/SmallProduct";
import { useAllProductsQuery } from "../redux/api/apiSlice";
import {
  MdOutlineWhatsapp,
  MdOutlineLocationOn,
  MdOutlineLocalPhone,
  MdOutlineMail,
} from "react-icons/md";
import { FaInstagram, FaFacebookSquare } from "react-icons/fa";

const Header = () => {
  const { data, isLoading, isError } = useAllProductsQuery();

  if (isLoading) return <div className="loader"></div>;
  if (isError) return <div>Something went wrong</div>;
  return (
    <>
      <ProductCarousel />
      <div className="flex justify-around">
        <div className="xl:block lg:hidden md:hidden sm:hidden">
          <div className="grid grid-cols-3">
            {data.map((product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center my-10">
        <div className="flex justify-between w-[70rem] mt-10">
          <div>
            <h4>Contact us</h4>
            <div className="flex flex-row items-center">
              <MdOutlineLocalPhone className="mr-2" />
              <p>+62 812 3456 7890</p>
            </div>
            <div className="flex flex-row items-center">
              <MdOutlineWhatsapp className="mr-2" />
              <p>+62 812 3456 7890</p>
            </div>
            <div className="flex flex-row items-center">
              <MdOutlineMail className="mr-2" />
              <p>riobangunan@gmail.com</p>
            </div>
          </div>
          <div>
            <h4>Follow us</h4>
            <div className="flex flex-row items-center">
              <FaInstagram className="mr-2" />
              <FaFacebookSquare />
            </div>
          </div>
          <div>
            <h4>Our location</h4>
            <div className="flex flex-row w-[20rem] justify-between">
              <MdOutlineLocationOn className="mr-2" size={30} />
              <p>
                {`Mendalo Darat, Kec. Jambi Luar Kota, Kabupaten Muaro Jambi, Jambi 36361`}
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex justify-center my-3">
        <h2 className="font-bold">
          © 2024 Rio Bangunan Material. All Rights Reserved
        </h2>
      </div>
    </>
  );
};

export default Header;
