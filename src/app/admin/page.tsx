// "use client";

// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function AdminLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const router = useRouter();

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();


//     if (email === "areeba@gmail.com" && password === "areebaak") {
//       localStorage.setItem("isLoggedIn", "true");
//       router.push("/admin/dashboard");
//     } else {
//       alert("Invalid email or password");
//     }
    
//   };


//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
//         <h2 className="text-xl font-bold mb-4">Admin Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-3 mb-4 border border-gray-300 rounded"
//           value={email}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-3 mb-4 border border-gray-300 rounded"
//           value={password}
//         />
//         <button
//           type="submit"
//           className="bg-red-500 text-white px-4 py-2 rounded w-full"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "areeba@gmail.com" && password === "areebaak") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/admin/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#2A254B]">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#2A254B]">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2A254B]"
          value={email}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#2A254B]"
          value={password}
        />
        <button
          type="submit"
          className="bg-[#2A254B] text-white px-4 py-2 rounded w-full hover:bg-[#1F1B3A] transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
