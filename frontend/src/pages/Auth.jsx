import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MessageSquare,
  Mail,
  Lock,
  User,
  ArrowRight,
  Shield,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoginApi } from "../services/AuthServices";

const Auth = () => {
  // global states
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState("admin");

  // login form states
  const [loginMethod, setLoginMethod] = useState("password"); // "password" | "otp"
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // OTP flow states
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);

  // signup states
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useUser();

const handleLogin = async (e) => {
  e.preventDefault();

  if (!identifier || !password) {
    toast({
      title: "Missing fields",
      description: "Please enter username and password.",
    });
    return;
  }

  setIsLoading(true);

  try {
    const payload = {
      UserName: identifier,
      password,
    };

    const res = await LoginApi(payload);

    if (!res?.status) {
      toast({
        title: "Login failed",
        description: res?.message || "Wrong username or password",
      });
      return;
    }

    const data = res.data;

    const role = data.Role === 1 ? "admin" : "member";

    const userData = {
      id: data.id,
      FullName: data.FullName,
      Email: data.Email,
      role,
    };

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);    
    localStorage.setItem("id", data.id);     // 🔥
    localStorage.setItem("tokenjwt", data.tokenjwt); // 🔥

    login(userData);

    toast({
      title: "Login successful!",
      description: `Welcome ${data.FullName}`,
    });

    // ✅ redirect
    role === "admin"
      ? navigate("/dashboard")
      : navigate("/member/dashboard");

  } catch (err) {
    toast({
      title: "Login Error",
      description: "Server error",
    });
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    let t;
    if (otpCooldown > 0) {
      t = setTimeout(() => setOtpCooldown((s) => s - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [otpCooldown]);

  // Simulate sending OTP (replace with API)
  const sendOtp = async () => {
    if (!identifier) {
      toast({
        title: "Enter email or phone",
        description: "Please enter your email or phone to receive OTP.",
      });
      return;
    }
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      setOtpSent(true);
      setOtpCooldown(60); // 60s cooldown
      // demo OTP stored only for simulation
      localStorage.setItem("mock_login_otp", "123456");
      toast({
        title: "OTP sent",
        description: `A 6-digit OTP has been sent to ${identifier} (simulated).`,
      });
    }, 900);
  };

  // Verify OTP and login (simulation)
  const verifyOtpAndLogin = async () => {
    if (!otp) {
      toast({
        title: "Enter OTP",
        description: "Please enter the OTP you received.",
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const saved = localStorage.getItem("mock_login_otp");
      if (otp === saved || otp === "123456") {
        const userData = {
          id: userRole === "admin" ? "admin-1" : "member-1",
          name: userRole === "admin" ? "Admin User" : "Member User",
          email: identifier.includes("@")
            ? identifier
            : `${identifier}@example.com`,
          role: userRole,
        };
        login(userData);
        toast({
          title: "Welcome back!",
          description: `Logged in via OTP as ${userData.name}`,
        });
        const redirectPath =
          userRole === "admin" ? "/dashboard" : "/member/dashboard";
        navigate(redirectPath);
      } else {
        toast({
          title: "Invalid OTP",
          description: "The OTP you entered is incorrect.",
        });
      }
    }, 900);
  };

  // Handle sign up (simulation)
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      toast({
        title: "Missing fields",
        description: "Please complete signup form.",
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    }, 900);
  };

  // Toggle between login methods via link (no radios)
  const toggleToOtp = () => {
    setLoginMethod("otp");
    setPassword("");
    setOtp("");
    setOtpSent(false);
  };
  const toggleToPassword = () => {
    setLoginMethod("password");
    setOtp("");
    setOtpSent(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      {/* Background decorations (optional) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 ">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">Chat Flow</span>
        </Link>

        <Card className="shadow-medium border-border/50 backdrop-blur-sm bg-card/95">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader className="pb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                {/* <TabsTrigger value="signup">Sign Up</TabsTrigger> */}
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* --------- LOGIN TAB --------- */}
              <TabsContent value="login" className="mt-0">
                <div className="space-y-4">
                  <CardTitle className="text-xl">Welcome back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>

                  <form onSubmit={handleLogin} className="space-y-4 mt-6">
                    {/* Role Select */}

                    {/* Identifier (email or phone) */}
                    <div className="space-y-2">
                      <Label htmlFor="identifier">
                        {loginMethod === "password"
                          ? "Email"
                          : "Email or Phone"}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="Enter your username"
                          className="pl-10"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Password or OTP UI */}
                    {loginMethod === "password" ? (
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="otp">OTP</Label>
                        <div className="flex gap-3 items-center">
                          <Input
                            id="otp"
                            type="text"
                            placeholder={
                              otpSent ? "Enter OTP" : "Click send OTP"
                            }
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={sendOtp}
                            disabled={otpLoading || otpCooldown > 0}
                          >
                            {otpCooldown > 0
                              ? `Resend in ${otpCooldown}s`
                              : otpSent
                              ? "Resend"
                              : "Send OTP"}
                          </Button>
                        </div>
                        {otpSent && (
                          <p className="text-xs text-muted-foreground">
                            OTP has been sent to the provided identifier
                            (simulated).
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {/* Method toggle link (no radios) */}
                      <div className="">
                        {loginMethod === "password" ? (
                          <button
                            type="button"
                            onClick={toggleToOtp}
                            className="text-sm text-primary hover:underline"
                          >
                            Login with OTP
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={toggleToPassword}
                            className="text-sm text-primary hover:underline"
                          >
                            Login with Password
                          </button>
                        )}
                      </div>
                      {/* <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded border-input" />
                        <span className="text-muted-foreground">Remember me</span>
                      </label> */}
                      <Link
                        to="/forgot"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? loginMethod === "otp"
                          ? "Verifying..."
                          : "Signing in..."
                        : loginMethod === "otp"
                        ? otpSent
                          ? "Verify & Sign In"
                          : "Send OTP"
                        : "Sign In"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </TabsContent>

              {/* --------- SIGNUP TAB --------- */}
              {/* <TabsContent value="signup" className="mt-0">
                <div className="space-y-4">
                  <CardTitle className="text-xl">Create an account</CardTitle>
                  <CardDescription>
                    Get started with ChatFlow today
                  </CardDescription>

                  <form onSubmit={handleSignup} className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          className="pl-10"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="name@company.com"
                          className="pl-10"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      By signing up, you agree to our{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>
                    </p>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </TabsContent> */}
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
