"use client"
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'


const Page = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get('id')
  const [ProductID, setProductID] = useState("");
  const [ProductName, setProductName] = useState("");

  const [ProductPrice, setProductPrice] = useState("");
  const [ProductStock, setProductStock] = useState("");
  const [ProductHSN, setProductHSN] = useState("")
  const [msg, setmsg] = useState("")



  function addProduct() {
    // Fetch data from the API
    const postData = {
      ProductID: ProductID,
      ProductName: ProductName,
      ProductPrice: ProductPrice,
      ProductStock: ProductStock,
      ProductHSN: ProductHSN,
    };


    fetch("/api/addProduct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data.Product);
          setProductName(data.Product.ProductName)
          setProductPrice(data.Product.ProductPrice)
          setProductStock(data.Product.ProductStock)
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
  auth();
  }, [])
  


  const router = useRouter();
  async function auth() {
    const fetch_api = await fetch("/api/auth/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await fetch_api.json();
    if (!data.success) {
      router.push("/login");
    }
  };


  return (
    <>
      <div className="mt-20">
        <h2 className="mb-5 text-2xl font-bold text-center">
          Add Product Details
        </h2>
      </div>
      <div class="max-w-sm mx-auto border border-3 rounded-lg p-5">
        {!msg ? ("") : (<div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
          {msg}
        </div>)}
        {/* <div class="mb-5">
          <label for="id" class="block mb-2 text-sm font-medium text-gray-900">
            Product ID
          </label>
          <input
            value={ProductID}
            onChange={(e) => setProductID(e.target.value)}
            type="text"
            id="id"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div> */}
        <div class="mb-5">
          <label
            for="name"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Name
          </label>
          <input
            type="text"
            value={ProductName}
            onChange={(e) => setProductName(e.target.value)}
            id="name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="class"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Price Number
          </label>
          <input
            value={ProductPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            type="text"
            id="class"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            placeholder="10A"
            required
          />
        </div>
        <div class="mb-5">
          <label
            for="Contact"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Stock
          </label>
          <input
            id="Contact"
            value={ProductStock}
            onChange={(e) => setProductStock(e.target.value)}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            placeholder="27657265"
            required
          />
        </div>

        <div class="mb-5">
          <label
            for="HSN"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            HSN Number
          </label>
          <input
            id="HSN"
            value={ProductHSN}
            onChange={(e) => setProductHSN(e.target.value)}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-0"
            placeholder="Enter HSN (Optional)"
            required
          />
        </div>

        {/* <div class="flex items-start mb-5">
    <div class="flex items-center h-5">
      <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" required/>
    </div>
    <label for="remember" class="ms-2 text-sm font-medium text-gray-900">Remember me</label>
  </div> */}
        <button

          onClick={addProduct}
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Save
        </button>
      </div>
    </>
  );
};

export default Page;
