import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import { useGetUsersQuery } from "../../redux/api/apiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/apiSlice";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import {
  FaHandHoldingDollar,
  FaCartShopping,
  FaUserGroup,
} from "react-icons/fa6";

const AdminDashboard = () => {
  function formatHarga(harga) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  }

  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customer, isLoading: isLoadingCustomer } = useGetUsersQuery();
  const { data: order, isLoading: isLoadingOrder } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Total Sales",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markes: {
        size: 1,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offssetY: -25,
        offsetX: -5,
      },
    },
    series: [
      {
        name: "Sales",
        date: [],
      },
    ],
  });

  useEffect(() => {
    if (salesDetail) {
      const formatSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formatSalesDate.map((item) => item.x),
          },
        },
        series: [
          {
            name: "Sales",
            data: formatSalesDate.map((item) => item.y),
          },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />
      <section className="xl:ml-[4rem] md:ml-[0rem]">
        <div className="w-[80%] flex justify-around flex-wrap">
          <div className="rounded-lg p-5 w-[20rem] mt-5 border-2">
            <div className="font-bold rounded-full w-[3rem] bg-blue-500 text-center text-white p-3">
              <FaHandHoldingDollar size={25} />
            </div>
            <p className="mt-5">Sales</p>
            <h1 className="text-xl font-bold">
              {isLoading ? (
                <div className="loader2"></div>
              ) : (
                formatHarga(sales.totalSales)
              )}
            </h1>
          </div>

          <div className="rounded-lg p-5 w-[20rem] mt-5 border-2">
            <div className="font-bold rounded-full w-[3rem] text-white bg-blue-500 text-center p-3">
              <FaUserGroup size={25} />
            </div>
            <p className="mt-5">Customers</p>
            <h1 className="text-xl font-bold">
              {isLoadingCustomer ? (
                <div className="loader2"></div>
              ) : (
                customer.length
              )}
            </h1>
          </div>

          <div className="rounded-lg p-5 w-[20rem] mt-5 border-2">
            <div className="font-bold rounded-full w-[3rem] text-white bg-blue-500 text-center p-3">
              <FaCartShopping size={25} />
            </div>
            <p className="mt-5">All Orders</p>
            <h1 className="text-xl font-bold">
              {isLoadingOrder ? (
                <div className="loader2"></div>
              ) : (
                order.totalOrders
              )}
            </h1>
          </div>
        </div>

        <div className="ml-[10rem] mt-[4rem]">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="70%"
          />
        </div>

        <div className="mt-[4rem]">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
