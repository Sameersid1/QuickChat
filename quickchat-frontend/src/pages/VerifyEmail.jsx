import { useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        await axios.get(
          `http://localhost:7000/api/v1/users/verify-email/${token}`
        );

        alert("Email verified successfully ✅");
        navigate("/login");
      } catch (error) {
        console.error(error);
        alert("Invalid or expired link ❌");
      }
    };

    verify();
  }, [token]);

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <h2>Verifying your email...</h2>
    </div>
  );
}

export default VerifyEmail;