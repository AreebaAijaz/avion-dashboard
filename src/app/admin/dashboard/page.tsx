

"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Swal from "sweetalert2";
import ProtectedRoute from "@/app/components/ProtectedRoute";

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  total: number;
  createdAt: string;
  status: string | null;
  cartItems: { product: string; image: string }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
          _id,
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          zipCode,
          total,
          createdAt,
          status,
          cartItems[]->{
            productName,
            image
          }
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire("Error!", "Something went wrong while deleting.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client
        .patch(orderId)
        .set({ status: newStatus })
        .commit();
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (newStatus === "dispatch") {
        Swal.fire("Dispatch", "The order is now dispatched.", "success");
      } else if (newStatus === "success") {
        Swal.fire("Success", "The order has been completed.", "success");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      Swal.fire("Error!", "Something went wrong while updating the status.", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-[#2A254B] text-white p-4 shadow-lg flex justify-between">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex space-x-4">
            {["All", "pending", "dispatch", "success"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === status ? "bg-white text-[#2A254B] font-bold" : "text-white"
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        {/* Orders Table */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Orders</h2>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-sm lg:text-base">
              <thead className="bg-gray-50 text-[#2A254B]">
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="cursor-pointer hover:bg-[#cbcada] transition-all "
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      <td>{order._id}</td>
                      <td>{order.firstName} {order.lastName}</td>
                      <td>{order.address}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>${order.total}</td>
                      <td>
                        <select
                          value={order.status || ""}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="bg-gray-100 p-1 rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="dispatch">Dispatch</option>
                          <option value="success">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(order._id);
                          }}
                          className="bg-[#2A254B] text-white px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {selectedOrderId === order._id && (
                      <tr>
                        <td colSpan={7} className="bg-gray-50 p-4 transition-all animate-fadeIn">
                          <h3 className="font-bold">Order Details</h3>
                          <p><strong>Phone:</strong> {order.phone}</p>
                          <p><strong>Email:</strong> {order.email}</p>
                          <p><strong>City:</strong> {order.city}</p>
                          <ul>
                            {order.cartItems.map((item, index) => (
                              <li key={`${order._id}-${index}`} className="flex items-center gap-2">
                                {item.product}
                                {item.image && (
                                  <Image src={urlFor(item.image).url()} alt="product-image" width={40} height={40} />
                                )}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}





// "use client";

// import React, { useEffect, useState } from "react";
// import { client } from "@/sanity/lib/client";
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";
// import Swal from "sweetalert2";
// import ProtectedRoute from "@/app/components/ProtectedRoute";
// import { Eye, Trash2, ChevronDown } from "lucide-react";

// interface Order {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   phone: string;
//   email: string;
//   address: string;
//   city: string;
//   zipCode: string;
//   total: number;
//   createdAt: string;
//   status: string | null;
//   cartItems: { product: string; image: string }[];
// }

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
//   const [filter, setFilter] = useState("All");

//   useEffect(() => {
//     client
//       .fetch(
//         `*[_type == "order"]{
//           _id,
//           firstName,
//           lastName,
//           phone,
//           email,
//           address,
//           city,
//           zipCode,
//           total,
//           createdAt,
//           status,
//           cartItems[]->{
//             productName,
//             image
//           }
//         }`
//       )
//       .then((data) => setOrders(data))
//       .catch((error) => console.error("Error fetching orders:", error));
//   }, []);

//   const filteredOrders =
//     filter === "All" ? orders : orders.filter((order) => order.status === filter);

//   const toggleOrderDetails = (orderId: string) => {
//     setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
//   };

//   const handleDelete = async (orderId: string) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       await client.delete(orderId);
//       setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
//       Swal.fire("Deleted!", "Your order has been deleted.", "success");
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       Swal.fire("Error!", "Something went wrong while deleting.", "error");
//     }
//   };

//   const handleStatusChange = async (orderId: string, newStatus: string) => {
//     try {
//       await client.patch(orderId).set({ status: newStatus }).commit();
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order._id === orderId ? { ...order, status: newStatus } : order
//         )
//       );
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       Swal.fire("Error!", "Something went wrong while updating the status.", "error");
//     }
//   };

//   return (
//     <ProtectedRoute>
//       <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 p-6">
//         {/* Filter Options */}
//         <div className="flex justify-end space-x-4 mb-4">
//           {["All", "pending", "dispatch", "success"].map((status) => (
//             <button
//               key={status}
//               className={`px-4 py-2 rounded ${
//                 filter === status ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"
//               }`}
//               onClick={() => setFilter(status)}
//             >
//               {status.charAt(0).toUpperCase() + status.slice(1)}
//             </button>
//           ))}
//         </div>

//         {/* Orders Table */}
//         <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
//           <table className="w-full text-sm text-gray-700 dark:text-gray-300">
//             <thead className="bg-gray-100 dark:bg-gray-700">
//               <tr>
//                 <th>ID</th>
//                 <th>Customer</th>
//                 <th>Total</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((order) => (
//                 <React.Fragment key={order._id}>
//                   <tr className="border-b">
//                     <td>{order._id}</td>
//                     <td>{order.firstName} {order.lastName}</td>
//                     <td>${order.total}</td>
//                     <td>
//                       <div className="relative">
//                         <select
//                           value={order.status || ""}
//                           onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                           className="bg-gray-100 dark:bg-gray-700 p-1 rounded"
//                         >
//                           <option value="pending">Pending</option>
//                           <option value="dispatch">Dispatch</option>
//                           <option value="success">Completed</option>
//                         </select>
//                         <ChevronDown className="absolute right-2 top-2 text-gray-500" />
//                       </div>
//                     </td>
//                     <td className="flex space-x-2">
//                       <button onClick={() => toggleOrderDetails(order._id)}>
//                         <Eye className="text-blue-500 h-5 w-5" />
//                       </button>
//                       <button onClick={() => handleDelete(order._id)}>
//                         <Trash2 className="text-red-500 h-5 w-5" />
//                       </button>
//                     </td>
//                   </tr>
//                   {selectedOrderId === order._id && (
//                     <tr>
//                       <td colSpan={5} className="bg-gray-50 dark:bg-gray-800 p-4">
//                         <h3 className="font-bold">Order Details</h3>
//                         <p><strong>Phone:</strong> {order.phone}</p>
//                         <p><strong>Email:</strong> {order.email}</p>
//                         <p><strong>Address:</strong> {order.address}, {order.city}</p>
//                         <ul>
//                           {order.cartItems.map((item, index) => (
//                             <li key={index} className="flex items-center gap-2">
//                               {item.product}
//                               {item.image && (
//                                 <Image src={urlFor(item.image).url()} alt="product" width={40} height={40} />
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

