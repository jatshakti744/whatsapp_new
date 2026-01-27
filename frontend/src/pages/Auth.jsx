import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { LoginApi } from "../services/AuthServices";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
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
      const role = data.Role == 1 ? "admin" : "member";
      const userData = {
        id: data.id,
        FullName: data.FullName,
        Email: data.Email,
        PhoneNo: data.PhoneNo,
        role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", data.token);
      localStorage.setItem("uid", data.id);
      localStorage.setItem("tokenjwt", data.tokenjwt);
      localStorage.setItem("phoneno", data.PhoneNo);
      localStorage.setItem("email", data.Email);
      localStorage.setItem("name", data.FullName);
      localStorage.setItem("role", data.Role == 1 ? "admin" : "member");

      login(userData);

      toast({
        title: "Login successful!",
        description: `Welcome ${data.FullName}`,
      });

      role === "admin"
        ? navigate("/dashboard/allclients")
        : navigate("/member/clients");
    } catch (err) {
      toast({
        title: "Login Error",
        description: res?.message || "Server error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 ">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">Chat Flow</span>
        </Link>

        <Card className="shadow-medium border-border/50 backdrop-blur-sm bg-card/95">
          <Tabs defaultValue="login" className="w-full">
            <CardContent>
              <TabsContent value="login" className="mt-0">
                <div className="space-y-4">
                  <CardTitle className="text-xl mt-6">Welcome back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>

                  <form onSubmit={handleLogin} className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="username"></Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="Enter your Username"
                          className="pl-10"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                        />
                      </div>
                    </div>

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

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                      <ArrowRight className="w-4 h-4 ml-2" />

                      {/* <ArrowRight className="w-4 h-4" /> */}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
