import { ChevronLeftIcon, EyeOffIcon, EyeIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/auth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { posthog } from "../../lib/posthog";

export const SignUp = (): JSX.Element => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/tasks", { replace: true });
    }
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const response = await authService.signUp(name, email, password);

    if (response.success) {
      const user = response.user;
      if (user) {
        posthog.identify(user.id, { email: user.email, name: user.name });
      }
      posthog.capture('user_signed_up', { email, name });
      navigate("/tasks", { replace: true });
    } else {
      posthog.capture('sign_up_failed', { email, error: response.error });
      setError(response.error || "Sign up failed");
    }

    setLoading(false);
  };

  return (
    <div className="bg-background w-full min-h-screen flex items-center justify-center">
      <div className="w-full flex flex-col md:flex-row md:max-w-6xl">
        {/* Left side - Image (desktop), Top (mobile) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <img
            className="w-full max-w-[260px] md:max-w-[560px] h-auto"
            alt="focus"
            src="/focus.svg"
          />
        </div>

        {/* Right side - Form (desktop), Bottom (mobile) */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <form onSubmit={handleSignUp} className="w-full max-w-md flex flex-col">
            <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Sign Up</h1>

            <div className="flex flex-col gap-[20px] mb-[20px]">
              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />

              <Input
                type="email"
                placeholder="noname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-[10px] top-1/2 -translate-y-1/2 w-8 h-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeIcon className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <EyeOffIcon className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="mt-4 font-bold text-lg text-center md:text-left">
              Already have an account? <button type="button" onClick={() => navigate("/sign-in")} className="text-primary hover:underline">Log in here.</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
