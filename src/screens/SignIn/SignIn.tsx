import { ChevronLeftIcon, EyeOffIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export const SignIn = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div className="bg-white w-full min-w-[390px] min-h-[844px] flex flex-col relative">
      <header className="w-full h-[47px] bg-[#d9d9d9] flex-shrink-0" />

      <main className="flex-1 flex flex-col px-[35px] pt-[39px] pb-0">
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

        <h1 className="[font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-3xl tracking-[0] leading-[normal] mb-[18px]">
          Sign up
        </h1>

        <div className="flex flex-col gap-[20px] mb-[20px]">
          <Input
            type="email"
            placeholder="noname@gmail.com"
            defaultValue=""
            className="h-[55px] bg-white rounded-[10px] border border-solid border-[#ebebeb] px-[10px] [font-family:'Darker_Grotesque',Helvetica] font-normal text-[#7c7c7c] text-[25px] tracking-[0] leading-[normal]"
          />

          <div className="relative">
            <Input
              type="password"
              placeholder="************"
              defaultValue=""
              className="h-[55px] bg-white rounded-[10px] border border-solid border-[#ebebeb] px-[10px] pr-[45px] [font-family:'Darker_Grotesque',Helvetica] font-normal text-[#7c7c7c] text-[25px] tracking-[0] leading-[normal]"
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

        <Button className="w-full h-[55px] bg-[#58419f] hover:bg-[#58419f]/90 rounded-[10px] [font-family:'Darker_Grotesque',Helvetica] font-bold text-white text-[25px] tracking-[0] leading-[normal] mb-[30px]">
          Sign up
        </Button>

        <div className="flex items-center gap-[15px] mb-[27px]">
          <div className="flex-1 h-px bg-[#d9d9d9]" />
          <span className="[font-family:'Darker_Grotesque',Helvetica] font-normal text-[#444444] text-[25px] tracking-[0] leading-[normal]">
            or
          </span>
          <div className="flex-1 h-px bg-[#d9d9d9]" />
        </div>

        <div className="flex justify-center gap-[65px] mb-[31px]">
          <Button variant="ghost" size="icon" className="w-[55px] h-[55px] p-0">
            <img
              className="w-[55px] h-[55px]"
              alt="Google original"
              src="/google---original.png"
            />
          </Button>
          <Button variant="ghost" size="icon" className="w-[55px] h-[55px] p-0">
            <img
              className="w-[55px] h-[55px]"
              alt="Facebook original"
              src="/facebook---original.svg"
            />
          </Button>
        </div>

        <p className="[font-family:'Darker_Grotesque',Helvetica] font-bold text-[#212529] text-[22px] tracking-[0] leading-[normal] text-center">
          Don&apos;t have an account? <button onClick={() => navigate("/sign-up")} className="text-[#58419f] hover:underline">Sign up here.</button>
        </p>
      </main>

      <footer className="w-full h-[34px] bg-[#d9d9d9] flex-shrink-0" />
    </div>
  );
};
