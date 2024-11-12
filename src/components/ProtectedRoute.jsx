import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const navigate = useNavigate();
    const checkToken = async () => {
      try {
        const response = await fetch(
          "http://localhost:8500/api/v1/protected/protected",
          { credentials: "include" }
        );
        if (response.ok) {
          const userData = await response.json();
          setUserType(userData.userType);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return userType ? children : null;
};

export default ProtectedRoute;
