import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Redirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");
    const tokenjwt = searchParams.get("tokenjwt");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    if (!tokenjwt || !uid) {
      navigate("/auth");
      return;
    }

    console.log("uid", uid);
    console.log("token", token);
    console.log("tokenjwt", tokenjwt);
    console.log("name", name);
    console.log("email", email);
    console.log("phone", phone);

    localStorage.setItem("uid", uid);
    localStorage.setItem("token", token || "");
    localStorage.setItem("tokenjwt", tokenjwt);
    localStorage.setItem("name", name || "");
    localStorage.setItem("email", email || "");
    localStorage.setItem("phone", phone || "");

    if (uid === "1") {
      localStorage.setItem("role", "admin");
      localStorage.setItem("uid", uid);
      localStorage.setItem("token", token || "");
      localStorage.setItem("tokenjwt", tokenjwt);
      localStorage.setItem("name", name || "");
      localStorage.setItem("email", email || "");
      localStorage.setItem("phone", phone || "");

      navigate("/dashboard/allclients");
    } else {
      localStorage.setItem("role", "member");
      navigate("/member/clients", { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="h-screen flex items-center justify-center text-muted-foreground">
      Redirecting...
    </div>
  );
};

export default Redirect;
