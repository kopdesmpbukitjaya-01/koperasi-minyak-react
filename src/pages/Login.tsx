import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { FaSignInAlt } from "react-icons/fa";
import logo from "../assets/logo_crop.png";
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-700 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-8">

  <img
    src={logo}
    alt="Logo Pertashop KDMP Bukit Jaya"
    className="w-28 h-28 object-contain mx-auto mb-4"
  />

  <h1 className="text-3xl font-bold text-gray-800">
    Pertashop KDMP Bukit Jaya
  </h1>

  <p className="text-gray-500 mt-2">
    Koperasi Desa Merah Putih Bukit Jaya
  </p>

</div>

        <div className="space-y-5">

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Masukkan Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
  onClick={login}
  className="w-full bg-red-600 hover:bg-red-700 transition text-white font-semibold py-3 rounded-xl"
>
  Login
</button>

        </div>

      </div>

    </div>
  );
}