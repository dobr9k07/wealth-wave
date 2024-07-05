"use client";
import React, { useState } from "react";
import Logo, { LogoMobile } from "./Logo";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { ThemeSwitcherBtn } from "./ThemeSwitcherBtn";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import SvgIcon from "./SvgIcon";
import { IconId } from "@/enums/iconSpriteId";
import LogoSvg from "./LogoSvg";

// Головний компонент NavBar, який містить як десктопну, так і мобільну навігацію
function NavBar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}

// Масив з елементами навігації
const items = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
];

// Компонент для десктопної версії навігації
function DesktopNavbar() {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          {/* <Logo /> */}

          <LogoSvg width={66} fill="#89169e" />

          {/* <SvgIcon
            className="stroke h-11 w-11 "
            iconId={IconId.IconLogoAuth}
            size={16}
          />
          <p className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
            Wealthe Wave
          </p> */}

          {/* <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            width="181.000000pt"
            height="181.000000pt"
            viewBox="0 0 181.000000 181.000000"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="translate(0.000000,181.000000) scale(0.100000,-0.100000)"
              fill="#d60606"
              stroke="none"
            >
              <path
                d="M1196 1369 c-70 -17 -156 -71 -210 -131 -45 -49 -58 -58 -87 -58
-140 -1 -300 -104 -364 -235 -19 -37 -37 -61 -54 -67 -137 -56 -204 -111 -258
-213 -33 -64 -68 -179 -58 -195 12 -19 24 -9 55 45 66 116 162 183 273 192
l63 5 2 -46 c2 -65 31 -124 80 -168 74 -66 102 -41 31 27 -50 49 -67 80 -71
131 l-3 39 92 5 c83 5 95 8 119 32 22 22 26 32 20 60 -11 60 -74 98 -162 98
-24 0 -45 4 -49 9 -6 11 63 61 115 82 34 14 204 19 216 6 4 -3 -1 -27 -10 -53
-21 -62 -21 -172 1 -226 24 -62 85 -148 106 -148 24 0 21 17 -8 56 -75 99 -98
231 -55 320 19 37 25 43 65 48 60 10 95 39 95 80 0 37 -30 81 -60 91 -30 10
-24 21 19 38 67 27 131 31 199 12 35 -10 65 -21 67 -26 3 -4 -9 -22 -26 -41
-95 -102 -126 -290 -68 -413 42 -88 159 -194 272 -245 52 -24 67 -25 67 -2 0
11 -25 30 -76 56 -93 48 -186 132 -222 200 -24 44 -27 63 -27 142 0 84 3 96
35 159 46 89 92 127 158 129 70 3 102 26 102 75 0 85 -85 132 -245 137 -55 2
-117 -1 -139 -7z m241 -44 c65 -19 103 -49 103 -81 0 -44 -37 -51 -138 -25
-190 49 -243 49 -338 1 -30 -15 -54 -24 -54 -20 0 12 76 78 112 96 86 45 219
57 315 29z m-369 -212 c35 -26 36 -63 2 -81 -19 -10 -44 -11 -100 -5 -137 14
-219 9 -280 -19 -30 -14 -64 -35 -74 -47 -25 -27 -40 -27 -25 0 20 38 100 109
151 135 70 35 112 43 211 40 69 -2 93 -6 115 -23z m-340 -275 c58 -18 78 -78
30 -94 -11 -3 -83 -3 -158 1 -156 8 -205 -2 -280 -56 -23 -17 -44 -28 -47 -25
-9 9 49 76 97 111 100 74 242 99 358 63z"
              />
              <path
                d="M1200 1145 c-22 -23 -22 -55 -1 -55 10 0 51 48 51 60 0 20 -30 16
-50 -5z"
              />
              <path
                d="M1056 918 c-20 -76 5 -208 40 -208 14 0 15 5 8 33 -5 17 -9 68 -10
112 -1 63 -4 81 -16 83 -9 2 -18 -7 -22 -20z"
              />
              <path d="M1154 865 c-7 -18 3 -35 22 -35 8 0 14 10 14 25 0 27 -27 35 -36 10z" />
              <path
                d="M1165 780 c-17 -28 59 -180 90 -180 22 0 18 24 -10 66 -14 20 -30 54
-36 75 -12 38 -33 57 -44 39z"
              />
              <path
                d="M795 670 c-9 -15 13 -75 35 -95 11 -10 26 -15 36 -11 15 6 15 8 0 29
-9 12 -23 37 -31 55 -16 33 -29 40 -40 22z"
              />
              <path
                d="M450 635 c0 -20 4 -26 18 -23 9 2 17 12 17 23 0 11 -8 21 -17 23 -14
3 -18 -3 -18 -23z"
              />
              <path
                d="M466 562 c-8 -13 32 -72 49 -72 20 0 19 24 -1 55 -16 25 -38 32 -48
17z"
              />
            </g>
          </svg> */}

          <div className="flex h-full">
            {items.map((item) => (
              <NavbarItem
                key={item.label}
                link={item.link}
                label={item.label}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
}

// Компонент для мобільної версії навігації
function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <Logo />
            <div className="flex flex-col gap-1 pt-4">
              {items.map((item) => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  clickCallback={() => setIsOpen((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <LogoMobile />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
}

// Компонент для окремого елемента навігації
function NavbarItem({
  link,
  label,
  clickCallback,
}: {
  link: string;
  label: string;
  clickCallback?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
      )}
    </div>
  );
}

export default NavBar;
