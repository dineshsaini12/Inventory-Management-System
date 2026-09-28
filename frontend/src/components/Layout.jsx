import React, { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">

            <Sidebar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            />


            {/* Main area */}

            <div className="lg:ml-72">

                {/* Mobile Navbar */}

                <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-200 bg-white px-4 lg:hidden">

                    <button
                        onClick={() => setIsOpen(true)}
                        className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
                    >
                        <Menu size={24} />
                    </button>

                    <h1 className="ml-3 font-semibold text-gray-800">
                        Inventory Management
                    </h1>

                </header>


                {/* Page content */}

                <main className="p-4 sm:p-6 lg:p-8">

                    {children}

                </main>

            </div>

        </div>
    );
};

export default Layout;