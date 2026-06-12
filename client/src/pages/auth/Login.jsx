// src/pages/Login.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../redux/features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginThunk({ email, password }));
      console.log(resultAction);

      if (loginThunk.fulfilled.match(resultAction)) {
        const role = resultAction.payload.user.role;
        console.log(role);

        if (role === "Admin") navigate("/");
        else if (role === "FieldOfficer") navigate("/field/dashboard");
        else if (role === "Coordinator") navigate("/coordinator/dashboard");
        else if (role === "TechnicalManager") navigate("/tm/dashboard");
        else if (role === "RegionalManager") navigate("/rtm/dashboard");
        else if (role === "Accountant") navigate("/accountant/dashboard");
        else navigate("/");
      }

      toast.success("Login Successful");
    } catch (err) {
      console.log("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-6 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? <Spin /> : "Login"}
        </button>
      </form>
    </div>
  );
};
export default Login;
