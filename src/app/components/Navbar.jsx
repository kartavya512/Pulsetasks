import Link from "next/link";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import {X} from "lucide-react"

const Navbar = () => {
  const navitems = [
    { navitem: "Add a ToDo", href: "/" },
    { navitem: "My ToDos", href: "/mytodos" },
    { navitem: "Login", href: "/login" },
  ];

  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error.message);
    }
  };

  return (
    <div className="lg:relative">
      <div className="z-10 fixed dark:bg-black top-0 w-full shadow-lg  text-white">
        <div className="">
          <div className="lg:mx-12 lg:px-12 mt-6 dark:bg-black flex justify-between py-2 px-5 text-white">
            <div className="inline-flex  space-x-2 ">
              <span className="text-2xl font-bold">PulseTasks</span>
            </div>
            <div className="hidden lg:block">
              <ul className="inline-flex space-x-10 text-white">
                {navitems.map((item) => (
                  <li className="cursor-pointer text-white" key={item.navitem}>
                    {item.navitem === "Login" && user ? (
                      <span onClick={handleSignOut}>Signout</span>
                    ) : (
                      <Link href={item.href}>{item.navitem}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:hidden">
              <div
                onClick={toggleMenu}
                className="lg:h-6 lg:w-6 cursor-pointer"
              >
                Menu
              </div>
            </div>
            {isMenuOpen && (
              <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition lg:hidden">
                <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="px-5 pb-6 pt-2">
                    <div className="flex items-end justify-end">
                    <div className="">
                      <div ><button
                          type="button"
                          onClick={toggleMenu}
                          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                          <span className="sr-only">Close menu</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button></div></div>
                      
                    </div>
                    <div className="mt-2">
                      <nav className="grid gap-y-4">
                        {navitems.map((item) => (
                          <Link href={item.href}>
                            <span className="lg:ml-3 text-base font-medium text-gray-900">
                              {item.navitem === "Login" && user ? (
                                <span onClick={handleSignOut}>Signout</span>
                              ) : (
                                <Link href={item.href}>{item.navitem}</Link>
                              )}
                            </span>
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
