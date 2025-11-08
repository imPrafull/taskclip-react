import { ChevronLeftIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export const SignUp = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="bg-white w-full flex flex-col relative">
      <main className="w-full flex-1 flex flex-col px-8 py-8 pt-8 max-w-md mx-auto">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 mb-[19px] -ml-2 self-start"
          onClick={() => navigate("/")}
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
          <Input
            type="text"
            placeholder="John Doe"
            defaultValue=""
            className="w-full"
          />

          <Input
            type="email"
            placeholder="noname@gmail.com"
            defaultValue=""
            className="w-full"
          />

          <div className="relative">
            <Input
              type="password"
              placeholder="************"
              defaultValue=""
              className="w-full"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-[10px] top-1/2 -translate-y-1/2 w-8 h-8"
            >
              <EyeOffIcon className="w-[17px] h-[17px] text-[#7c7c7c]" />
            </Button>
          </div>
        </div>

        <Button className="w-full" size="lg">
          Create Account
        </Button>

        <p className="mt-4 font-bold mx-auto">
          Already have an account? <button onClick={() => navigate("/")} className="text-primary hover:underline">Log in here.</button>
        </p>
      </main>
    </div>
  );
};
