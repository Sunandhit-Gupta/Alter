"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    rollNumber: "",
    batch: "",
    courseCodes: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/register", {
        ...formData,
        courseCodes: formData.courseCodes.split(","),
      });
      toast.success("Registration successful!");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Registration failed!");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-6 bg-white border border-borderGray rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center">
          Register
        </h2>
        <form onSubmit={handleRegister} className="mt-4 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-textDark bg-white border-borderGray focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-textDark bg-white border-borderGray focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-textDark bg-white border-borderGray focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-textDark bg-white border-borderGray focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          {formData.role === "student" && (
            <>
              <input
                type="text"
                name="rollNumber"
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md text-textDark bg-white border-borderGray focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="text"
                name="batch"
                placeholder="Batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-textDark bg-white border-borderGray focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="text"
                name="courseCodes"
                placeholder="Course Codes (comma separated)"
                value={formData.courseCodes}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-textDark bg-white border-borderGray focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 transition-all duration-300"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-textLight">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/auth/login")}
            className="text-blue-500 hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}