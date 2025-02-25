import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams
import { useResetPasswordAPIMutation } from "../store/user/userApiSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();

  const [resetPasswordAPI, { isLoading, isSuccess, isError, error }] =
    useResetPasswordAPIMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error messages

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      const result = await resetPasswordAPI({
        password,
        confirmPassword,
        token,
      }).unwrap(); // unwrap to catch errors

      if (result.success) {
        // Handle success (e.g., show a success message, redirect to login)
        toast.success("Password reset successful!");
        navigate("/login"); // Redirect to login page
      } else {
        // Handle errors from the API response
        setErrorMessage(result.message || "Failed to reset password.");
      }
    } catch (err) {
      // Handle errors from the API call (network error, etc.)
      console.error("Reset password failed:", err);
      setErrorMessage(
        err?.data?.message || "An error occurred while resetting password."
      ); //Check if error exist and then display it.
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="reset-password-form">
        <div className="form-group">
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>

        {isError && (
          <div className="error-message">
            {error?.data?.message || "Failed to reset password."}
          </div>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
