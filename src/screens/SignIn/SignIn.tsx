import { ChevronLeftIcon, EyeOffIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../lib/authService";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export const SignIn = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/tasks", { replace: true });
    }
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const response = await authService.signIn(email, password);

    if (response.success) {
      navigate("/tasks", { replace: true });
    } else {
      setError(response.error || "Sign in failed");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white w-full flex flex-col relative">
      <main className="w-full flex flex-col px-8 py-8 pt-8 max-w-md mx-auto">
        <form onSubmit={handleSignIn} className="w-full flex flex-col">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 mb-[19px] -ml-2 self-start"
        >
          <ChevronLeftIcon className="w-6 h-6 text-[#212529]" />
        </Button>

        <div className="flex justify-center mb-[49px]">
          <img
            className="w-[256px] h-[220px]"
            alt="Leisure sport meditation yoga"
            src="/leisure--sport---meditation--meditate--relax--relaxation--yoga--.png"
          />
        </div>

        <div className="flex flex-col gap-[20px] mb-[20px]">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
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
              type="password"
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
            >
              <EyeOffIcon className="w-[17px] h-[17px] text-[#7c7c7c]" />
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Logging In..." : "Log In"}
        </Button>

        <p className="mt-4 font-bold text-lg mx-auto">
          Don&apos;t have an account? <button type="button" onClick={() => navigate("/sign-up")} className="text-primary hover:underline">Sign up here.</button>
        </p>
        </form>
      </main>
    </div>
  );
};
