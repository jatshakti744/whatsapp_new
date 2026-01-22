// ForgotPassword.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: enter email, 2: verify OTP or link, 3: set new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const sendResetLink = () => {
    if (!email) {
      toast({ title: "Enter email", description: "Please enter your registered email." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Reset link sent", description: `A password reset link has been sent to ${email} (simulated).` });
      // for demo go to step 3 directly or stay step1
      // we'll keep user on step1 with notification
    }, 1000);
  };

  const sendOtp = () => {
    if (!email) {
      toast({ title: "Enter email", description: "Please enter your registered email." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setStep(2);
      localStorage.setItem("mock_forgot_otp", "654321"); // demo OTP
      toast({ title: "OTP sent", description: `A 6-digit OTP has been sent to ${email} (simulated).` });
    }, 1000);
  };

  const verifyOtp = () => {
    if (!otp) {
      toast({ title: "Enter OTP", description: "Please enter the OTP." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const saved = localStorage.getItem("mock_forgot_otp");
      if (otp === saved || otp === "654321") {
        toast({ title: "OTP verified", description: "You may now set a new password." });
        setStep(3);
      } else {
        toast({ title: "Invalid OTP", description: "The OTP entered is incorrect." });
      }
    }, 800);
  };

  const setNewPass = () => {
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "Weak password", description: "Please use at least 6 characters." });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Password updated", description: "Your password has been reset. Please login with new password." });
      navigate("/auth"); // go back to login
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-4">
      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-medium border-border/50">
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
          </CardHeader>

          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter your registered email. You can either receive a reset link or an OTP to reset your password.
                </p>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={sendResetLink} disabled={loading}>Send Reset Link</Button>
                  <Button onClick={sendOtp} disabled={loading} variant="outline">Send OTP</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Enter the OTP sent to your email.</p>

                <div className="space-y-2">
                  <Label>OTP</Label>
                  <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" />
                </div>

                <div className="flex gap-3">
                  <Button onClick={verifyOtp} disabled={loading}>Verify OTP</Button>
                  <Button onClick={sendOtp} disabled={loading} variant="outline">Resend</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Set your new password.</p>

                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-10" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={setNewPass} disabled={loading}>Set Password</Button>
                  <Button onClick={() => setStep(1)} variant="outline">Back</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
