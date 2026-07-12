import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../services/auth/authService";
import { loginSuccess } from "../features/auth/authSlice";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
  try {
    const response = await login(data.email, data.password);

    dispatch(loginSuccess(response));

    localStorage.setItem("token", response.token);

    localStorage.setItem(
      "user",
      JSON.stringify(response.user)
    );

    toast.success("Login Successful");

    navigate("/");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Login Failed"
    );
  }
};
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
            })}
            className="w-full border rounded-lg p-3"
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
            })}
            className="w-full border rounded-lg p-3"
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;