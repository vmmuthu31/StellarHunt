import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import navicon from "../assets/stellarhunt.png";
import Link from "next/link";

const navigation = [
  { name: "How it works", href: "https://stellarhunt.gitbook.io/stellarhunt" },
  { name: "Marketplace", href: "/optstore" },
];

<style jsx>{`
  @keyframes wobble {
    0%,
    100% {
      transform: translateX(0) rotate(0deg);
    }
    15% {
      transform: translateX(-5px) rotate(-5deg);
    }
    30% {
      transform: translateX(5px) rotate(5deg);
    }
    45% {
      transform: translateX(-5px) rotate(-5deg);
    }
    60% {
      transform: translateX(5px) rotate(5deg);
    }
    75% {
      transform: translateX(-5px) rotate(-5deg);
    }
    90% {
      transform: translateX(5px) rotate(5deg);
    }
  }

  .wobble-effect-ui {
    animation: wobble 1s infinite ease-in-out;
  }
`}</style>;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const howitworks = () => {
    const section = document.getElementById("howitworks");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <p className="playnowbtn text-white">{item.name}</p>
              </Link>
            ))}
          </div>

          <div className="flex lg:flex">
            <a href="#" className="-m-1.5 p-1.5">
              <img
                alt="StellarHunt"
                src={navicon}
                className="h-14 w-auto md:h-24"
              />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="hidden lg:flex  lg:justify-end">
            <Link href="/lobby">
              <p className="playnowbtn text-white wobble-effect-ui">
                Play Now!
              </p>
            </Link>
            <Link href="/Waitlist">
              <p
                className="bg-[#c9fa00] rounded-full text-xl px-10 py-3 text-black ml-4"
                style={{ cursor: "pointer" }}
              >
                Join Waitlist
              </p>
            </Link>
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#e79f2b] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">StellarHunt</span>
                <img alt="StellarHunt" src={navicon} className="h-10 w-auto" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link className="flex" key={item.name} href={item.href}>
                      <p className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800">
                        {item.name}
                      </p>
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    className="bg-[#c9fa00] rounded-xl text-lg px-5 py-1 text-black ml-1"
                    href="/Waitlist"
                  >
                    <p className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                      Join Waitlist
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  );
}
