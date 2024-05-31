"use client"
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'


const Page = () => {
    const searchParams = useSearchParams();
    const orderid = searchParams.get('id')
    const [msg, setmsg] = useState("")

    const [Product, setProduct] = useState("")
    const [InvoiceDate, setInvoiceDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    const [Customer, setCustomer] = useState("")
    const [InvoiceNo, setInvoiceNo] = useState("")
    const [Tax, setTax] = useState(18)

    const [ProductList, setProductList] = useState([])

    const postData = {
        orderid: orderid,
        // Add other properties if needed
    };
    useEffect(() => {
        auth();
        fetch("/api/getOrder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.Product);
                    setProduct(data.Order)
                } else {
                    console.error("API request failed");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

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
    useEffect(() => {
        fetch("/api/getCustomer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ customerid: Product.CustomerID }),
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data);
                    setCustomer(data.customer)
                } else {
                    console.error("API request failed");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });



        fetch("/api/getProduct", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.products);
                    setProductList(data.products);
                } else {
                    console.error("API request failed");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });


        fetch("/api/getInvoice", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ invoiceid: orderid + "inv" }),
        }).then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    console.log(data.Invoice.Tax);
                    setTax(data.Invoice.Tax)
                    setInvoiceDate(data.Invoice.Date)
                    setInvoiceNo(data.Invoice.InvoiceNo)
                } else {
                    console.error("API request failed");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

    }, [Product])




    const getOrderDetails = () => {
        if (Product && Product.Products && Array.isArray(Product.Products)) {
            let subtotalAmount = 0;
            const taxRate = Tax / 100;

            const orderDetails = Product.Products.map(order => {
                const productDetails = ProductList.find(product => product.ProductID === order.productId);

                if (productDetails) {
                    const total = productDetails.ProductPrice * parseInt(order.quantity);
                    subtotalAmount += total;

                    return (
                        <div key={order.productId} className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            <div className="col-span-full sm:col-span-2">
                                <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Item</h5>
                                <p className="font-medium text-gray-800">{productDetails.ProductName}</p>
                            </div>
                            <div>
                                <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Qty</h5>
                                <p className="text-gray-800">{order.quantity}</p>
                            </div>
                            <div>
                                <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Rate</h5>
                                <p className="text-gray-800">{productDetails.ProductPrice}</p>
                            </div>
                            <div>
                                <h5 className="sm:hidden text-xs font-medium text-gray-500 uppercase">Amount</h5>
                                <p className="sm:text-end text-gray-800">₹{total.toFixed(2)}</p>
                            </div>
                        </div>
                    );
                }

                return null;
            });

            const taxAmount = subtotalAmount * taxRate;
            const totalAmount = subtotalAmount + taxAmount;

            // Additional JSX for tax and total
            const additionalDetails = (
                <div className="mt-8 flex sm:justify-end">
                    <div className="w-full max-w-2xl sm:text-end space-y-2">
                        <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                            <dl className="grid sm:grid-cols-5 gap-x-3">
                                <dt className="col-span-3 font-semibold text-gray-800 ">Subtotal:</dt>
                                <dd className="col-span-2 text-gray-500">₹{subtotalAmount.toFixed(2)}</dd>
                            </dl>

                            {/* <dl className="grid sm:grid-cols-5 gap-x-3">
              <dt className="col-span-3 font-semibold text-gray-800  ">Tax:</dt>
              <dd className="col-span-2 text-gray-500">₹{taxAmount.toFixed(2)}</dd>
            </dl> */}

                            <dl className="grid sm:grid-cols-5 gap-x-3">
                                <dt className="col-span-3 font-semibold text-gray-800">
                                    {(() => {
                                        switch (Product.TaxType) {
                                            case "i_GST12":
                                                return "i-GST 12%";
                                            case "i_GST5":
                                                return "i-GST 5%";
                                            case "i_GST18":
                                                return "i-GST 18%";
                                            default:
                                                return "";
                                        }
                                    })()}
                                </dt>

                                {(() => {
                                    switch (Product.TaxType) {
                                        case "sc_GST5":
                                            return (
                                                <>
                                                <dt className="col-span-3 font-semibold text-gray-800">Central GST 2.5%</dt>
                                                    <dd className="col-span-2 text-gray-500">₹{Product.GST / 2}</dd>
                                                <dt className="col-span-3 font-semibold text-gray-800">State GST 2.5%</dt>
                                                    <dd className="col-span-2 text-gray-500">₹{Product.GST / 2}</dd>
                                                </>
                                            );
                                        case "sc_GST12":
                                            return (
                                                <>
                                                <dt className="col-span-3 font-semibold text-gray-800">Central GST 6%</dt>
                                                    <dd className="col-span-2 text-gray-500">₹{Product.GST / 2}</dd>
                                                <dt className="col-span-3 font-semibold text-gray-800">State GST 6%</dt>
                                                    <dd className="col-span-2 text-gray-500">₹{Product.GST / 2}</dd>
                                                </>
                                            );
                                        case "sc_GST18":
                                            return (
                                                <>
                                                <dt className="col-span-3 font-semibold text-gray-800">Central GST 9%</dt>
                                                    <dd className="col-span-2 text-gray-500">₹{Product.GST / 2}</dd>
                                                <dt className="col-span-3 font-semibold text-gray-800">State GST 9%</dt>
                                                    <dd className="col-span-2 text-gray-500">₹{Product.GST / 2}</dd>
                                                </>
                                            );
                                        default:
                                            return <dd className="col-span-2 text-gray-500">₹{Product.GST}</dd>;
                                    }
                                })()}


                            </dl>
                            <dl className="grid sm:grid-cols-5 gap-x-3">
                                <dt className="col-span-3 font-semibold text-gray-800  ">Total Amount</dt>
                                <dd className="col-span-2 text-gray-500">₹{Product.Total}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            );

            return [orderDetails, additionalDetails];
        }

        return null;
    };




    const [printData, setPrintData] = useState({
        title: 'Printable Title',
        description: 'This is the content to be printed.',
    });

    const handlePrint = () => {
        const printableArea = document.getElementById('printableArea');

        if (printableArea) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write('<html><head><title>Print</title> <script src="https://cdn.tailwindcss.com"></script></head><body>');
            printWindow.document.write('<div class="flex justify-center items-center mt-3"><button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onclick="window.print()">Print</button></div>');
            printWindow.document.write('<div style="margin: 20px;">');
            printWindow.document.write(printableArea.innerHTML);
            printWindow.document.write('</div></body></html>');
            printWindow.document.close();
        }
    };


    return (
        <>

            <div className="mt-20">
                <h2 className="mb-5 text-2xl font-bold text-center">
                    {Product.OrderID} - ORDER DETAILS
                </h2>
                <div className="flex items-center justify-center mb-2">

                    <button onClick={handlePrint} href="" class="mx-3 relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white">
                        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                            Print PDF
                        </span>
                    </button>
                </div>
            </div>
            {/* <section >
                <div class="max-w-xl mx-auto border border-3 rounded-lg p-5">
                    {!msg ? ("") : (<div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                        {msg}
                    </div>)}
                    <h2 className="mb-5 text-2xl font-bold text-center">
                        Zbytes Invoice</h2>

                    <h2 class="mb-2 text-lg font-semibold text-gray-900 ">Order Details</h2>
                    <ul class="max-w-xl space-y-1 text-gray-500 list-disc list-inside ">
                        <li className="text-lg font-bold">
                            ORDER ID : {Product.OrderID}
                        </li>
                        <li className="text-lg font-bold">
                            Customer Name : {Customer.CustomerName}
                        </li>
                        <li className="text-lg font-bold">
                            Customer Phone : {Customer.CustomerPhone}
                        </li>
                        <li className="text-lg font-bold">
                            Customer Email : {Customer.CustomerEmail}
                        </li>
                        <li className="text-lg font-bold">
                            Address : {Product.Address}
                        </li>
                        <li className="text-lg font-bold">
                            Tracking ID : {Product.TrackingID}
                        </li>
                        <li className="text-lg font-bold">
                            Sales Channel : {Product.SalesChannel}
                        </li>
                    </ul>



                    <div>
                        <h2 className="mb-2 text-lg font-semibold text-gray-900 mt-8">Products Details</h2>
                        <table className="min-w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="border py-2 px-4">Product ID</th>
                                    <th className="border py-2 px-4">Product Name</th>
                                    <th className="border py-2 px-4">Quantity</th>
                                    <th className="border py-2 px-4">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getOrderDetails()}
                            </tbody>
                        </table>
                        <p className="mt-2">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </section>

          */}









            <div class="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10" id="printableArea">
                <div class="sm:w-11/12 lg:w-3/4 mx-auto">

                    <div class="flex flex-col p-4 sm:p-10 bg-white shadow-md rounded-xl border-4">

                        <div class="flex justify-between">
                            <div>
                                {/* <svg class="size-10" width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 26V13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13C25 19.6274 19.6274 25 13 25H12" class="stroke-blue-600 " stroke="currentColor" stroke-width="2"/>
              <path d="M5 26V13.16C5 8.65336 8.58172 5 13 5C17.4183 5 21 8.65336 21 13.16C21 17.6666 17.4183 21.32 13 21.32H12" class="stroke-blue-600 " stroke="currentColor" stroke-width="2"/>
              <circle cx="13" cy="13.0214" r="5" fill="currentColor" class="fill-blue-600 "/>
            </svg> */}

                                <h1 class="mt-2 text-xl md:text-2xl font-semibold text-blue-600 ">HandMakers</h1>
                            </div>

                            <div class="text-end">
                                <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 ">Invoice #</h2>
                                <span class="mt-1 block text-gray-500">{Product.OrderID}</span>

                                <address class="mt-4 not-italic text-gray-800 ">
                                    45 Towers city<br />
                                    Jaipur, Rajasthan<br />
                                    India<br />
                                </address>
                            </div>
                        </div>

                        <div class="mt-8 grid sm:grid-cols-2 gap-3">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-800 ">Bill to:</h3>
                                <h3 class="text-lg font-semibold text-gray-800 ">{Customer.CustomerName}</h3>
                                <address class="mt-2 not-italic text-gray-500">
                                    {Product.Address}<br />
                                    {Product.Pincode}<br />
                                    +91 {Customer.CustomerPhone}<br />
                                </address>
                            </div>

                            <div class="sm:text-end space-y-2">

                                <div class="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                                    <dl class="grid sm:grid-cols-5 gap-x-3">
                                        <dt class="col-span-3 font-semibold text-gray-800 ">Invoice date:</dt>
                                        <dd class="col-span-2 text-gray-500">{InvoiceDate}</dd>
                                    </dl>
                                    <dl class="grid sm:grid-cols-5 gap-x-3">
                                        <dt class="col-span-3 font-semibold text-gray-800 ">Invoice No.</dt>
                                        <dd class="col-span-2 text-gray-500">{InvoiceNo}</dd>
                                    </dl>
                                    <dl class="grid sm:grid-cols-5 gap-x-3">
                                        <dt class="col-span-3 font-semibold text-gray-800 ">Tracking Id</dt>
                                        <dd class="col-span-2 text-gray-500">#{Product.TrackingID}</dd>
                                    </dl>
                                </div>

                            </div>





                        </div>
                        <div class="mt-6">
                            <div class="border border-gray-200 p-4 rounded-lg space-y-4">
                                <div class="hidden sm:grid sm:grid-cols-5">
                                    <div class="sm:col-span-2 text-xs font-medium text-gray-500 uppercase">Item</div>
                                    <div class="text-start text-xs font-medium text-gray-500 uppercase">Qty</div>
                                    <div class="text-start text-xs font-medium text-gray-500 uppercase">Rate</div>
                                    <div class="text-end text-xs font-medium text-gray-500 uppercase">Amount</div>
                                </div>

                                <div class="hidden sm:block border-b border-gray-200"></div>

                                {/* Integrate getOrderDetails function here */}
                                {getOrderDetails()}

                            </div>
                        </div>


                        <div class="mt-8 sm:mt-12">
                            <h4 class="text-lg font-semibold text-gray-800  ">Thank you!</h4>

                        </div>

                    </div>

                </div>
            </div>


        </>
    );
};

export default Page;
