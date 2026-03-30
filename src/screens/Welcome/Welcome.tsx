import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../api/auth";
import { Button } from "../../components/ui/Button";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { useTheme } from "../../hooks/useTheme";

export const Welcome = (): JSX.Element => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/tasks", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="relative bg-background w-full min-h-screen flex items-center justify-center">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="w-full flex flex-col md:flex-row md:max-w-6xl">
        {/* Image — top on mobile, left on desktop */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <img
            className="w-full max-w-[280px] md:max-w-[560px] h-auto dark:brightness-90 dark:contrast-95"
            alt="Productive mind illustration"
            src={theme === "dark" ? "/focus-dark.svg" : "/focus.svg"}
          />
        </div>

        {/* Content — bottom on mobile, right on desktop */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-md flex flex-col gap-6 text-center md:text-left">
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground">
              Productive Mind
            </h1>
            <p className="text-muted-foreground text-xl font-medium leading-relaxed">
              With only the features you need, Task Clip is customized for
              individuals seeking a stress-free way to stay focused on their
              goals, projects and tasks.
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate("/sign-in")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
