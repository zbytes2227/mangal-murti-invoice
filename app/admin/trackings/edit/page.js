"use client"
import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation'


const Page = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get('id')
  const [TrackingID, setTrackingID] = useState(search);

  const [TrackingCost, setTrackingCost] = useState("")
  const [TrackingURL, setTrackingURL] = useState("")
  const [OrderAmount, setOrderAmount] = useState('');
  const [msg, setmsg] = useState("")

  const postData = {
    trackingid: TrackingID,
    // Add other properties if needed
  };
  useEffect(() => {
    auth();
    fetch("/api/getTracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.Tracking);
          setTrackingCost(data.tracking.TrackingCost)
          setTrackingURL(data.tracking.trackingUrl)
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
  function updateDetails() {
    const postData = {
      TrackingID: TrackingID,
      trackingUrl: TrackingURL,
      TrackingCost: TrackingCost,
    };


    fetch("/api/editTracking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then((response) => response.json())
      .then((data) => {
        setmsg(data.msg)
        if (data.success) {
          console.log(data);
          setTimeout(() => {
            window.location.href = "/admin/trackings"; // Replace "/your-target-page" with the actual target page URL
          }, 1000);
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  return (
    <>
      <div className="mt-20  mx-auto container">

        <div id="Tracking-modal" class="ms-60 overflow-y-auto overflow-x-hidden justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
          <div class="relative p-4 w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow border-4">
              <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                <h3 class="text-xl font-semibold text-gray-900"> Tracking Details for order </h3>
                <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="Tracking-modal">
                  <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span class="sr-only">Close modal</span>
                </button>
              </div>
              <div class="p-4 md:p-5">
                <form class="space-y-4" action="#">
                  <div>
                    <label for="orderID" disabled class="block mb-2 text-sm font-medium text-gray-900">Tracking ID</label>
                    <input disabled value={TrackingID} onChange={(e) => setTrackingID(e.target.value)} type="text" name="orderID" id="orderID" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Tracking No" required />
                  </div>

                  {/* <div>
                    <label for="TrackingMode" class="block mb-2 text-sm font-medium text-gray-900">Tracking Status</label>
                    <select value={TrackingStatus} onChange={(e) => setTrackingStatus(e.target.value)} name="TrackingMode" id="TrackingMode" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
                    <option value="" disabled>Select</option>
                    <option value="partial">Partial</option>
                    <option value="full">Full</option>

                    </select>
                  </div> */}



                  <div>
                    <label for="orderAmount" class="block mb-2 text-sm font-medium text-gray-900">Tracking Amount</label>
                    <input value={TrackingCost} onChange={(e) => setTrackingCost(e.target.value)} type="text" name="orderAmount" id="orderAmount" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Tracking Amount" required />
                  </div>
                  <div>
                    <label for="orderAmount" class="block mb-2 text-sm font-medium text-gray-900">Tracking URL</label>
                    <input value={TrackingURL} onChange={(e) => setTrackingURL(e.target.value)} type="text" name="orderAmount" id="orderAmount" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Enter Tracking Amount" required />
                  </div>


                  {!msg ? ("") : (
                    <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                      {msg}
                    </div>)}
                  <button onClick={updateDetails} type="button" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Save Tracking Details</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
