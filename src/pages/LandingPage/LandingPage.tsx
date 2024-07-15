import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { registerUser } from "../../services/register";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm, SubmitHandler } from "react-hook-form";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const LandingPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (isRegistering) {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      try {
        const registrationData = {
          username: data.username,
          password: data.password,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
        };
        await registerUser(registrationData);
        toast.success("Registration successful! Please log in.");
        setIsRegistering(false);
        reset();
      } catch (error) {
        toast.error("Registration failed");
      }
    } else {
      try {
        const authResponse = await authService.login({ username: data.username, password: data.password });
        login(authResponse.jwt);
        navigate("/waitingroom");
      } catch (error) {
        toast.error("Login failed");
      }
    }
  };

  return (
    <>
      <div className="flex justify-center gap-1 bg-stick bg-cover w-screen h-screen overflow-hidden">
        <div className="flex flex-col items-center flex-1">
          <h1 className="text-[117px] font-bold text-center -mt-4 ml-2 font-sketch">
            Drawn Together
          </h1>
          <img src="pencil.png" alt="logo" className="w-8/12 ml-10 -mt-10" />
        </div>
        <div className="w-1/3 mr-2 flex flex-col justify-center">
          <form
            className="flex flex-col bg-white pt-3 pb-3 p-5 rounded-lg border border-gray-300 shadow-2xl w-11/12"
            onSubmit={handleSubmit(onSubmit)}
          >
            {isRegistering && (
              <>
                <div className="flex gap-2">
                  <div className="flex flex-col w-1/2">
                    <label
                      htmlFor="firstName"
                      className="text-3xl font-semibold text-black font-sketch"
                    >
                      First Name:
                    </label>
                    <input
                      id="firstName"
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      className={`p-2 border ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      } rounded-md text-1xl`}
                    />
                    {errors.firstName && (
                      <span className="text-red-500">
                        {errors.firstName.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-1/2 h-24">
                    <label
                      htmlFor="lastName"
                      className="text-3xl font-semibold text-black font-sketch"
                    >
                      Last Name:
                    </label>
                    <input
                      id="lastName"
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      className={`p-2 border ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      } rounded-md text-1xl`}
                    />
                    {errors.lastName && (
                      <span className="text-red-500">
                        {errors.lastName.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col h-24">
                  <label
                    htmlFor="email"
                    className="text-3xl font-semibold text-black font-sketch"
                  >
                    Email:
                  </label>
                  <input
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    className={`p-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md text-1xl`}
                  />
                  {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                  )}
                </div>
              </>
            )}
            <div className="flex flex-col h-24">
              <label
                htmlFor="username"
                className="text-3xl font-semibold text-black font-sketch"
              >
                Username:
              </label>
              <input
                id="username"
                {...register("username", { required: "Username is required" })}
                className={`p-2 border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded-md text-1xl`}
              />
              {errors.username && (
                <span className="text-red-500">{errors.username.message}</span>
              )}
            </div>
            <div className="flex flex-col h-24">
              <label
                htmlFor="password"
                className="text-3xl font-semibold text-gray-800 font-sketch tracking-wider"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                {...register("password", { required: "Password is required" })}
                className={`p-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md text-1xl`}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>
            {isRegistering && (
              <div className="flex flex-col h-24">
                <label
                  htmlFor="confirmPassword"
                  className="text-3xl font-semibold text-gray-800 font-sketch tracking-wider"
                >
                  Confirm Password:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                  })}
                  className={`p-2 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md text-1xl`}
                />
                {errors.confirmPassword && (
                  <span className="text-red-500">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 ml-20 mt-2 rounded-md font-wild text-opacity-85 text-4xl tracking-wider w-1/2 hover:bg-blue-600 transform transition duration-700 hover:scale-105"
            >
              {isRegistering ? "Register" : "Login"}
            </button>
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-blue-500 text-1xl mt-1 italic transform transition duration-700 hover:scale-110"
            >
              {isRegistering
                ? "Already have an account? Login here!"
                : "Don't have an account? Register here!"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
