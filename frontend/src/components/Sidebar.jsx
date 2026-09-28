import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    Package,
    Boxes,
    Truck,
    Users,
    ShoppingCart,
    ClipboardList,
    LogOut,
    X,
    ArrowLeftRight,
    FileBarChart
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {

    const navigate = useNavigate();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
            section: "Workspace",
        },
        {
            name: "Products",
            path: "/products",
            icon: Package,
            section: "Operations",
        },
        {
            name: "Stock",
            path: "/stock",
            icon: Boxes,
            section: "Operations",
        },
        {
            name: "Suppliers",
            path: "/suppliers",
            icon: Truck,
            section: "Operations",
        },
        {
            name: "Customer Order",
            path: "/customers",
            icon: Users,
            section: "Transactions",
        },
        {
            name: "Purchases",
            path: "/purchases",
            icon: ShoppingCart,
            section: "Transactions",
        },
        {
            name: "Inventory Record",
            path: "/inventory",
            icon: ArrowLeftRight,
            section: "Records",
        },
        {
            name: "Reports",
            path: "/reports",
            icon: FileBarChart,
            section: "Records",
        },
    ];


    // ============================================================
    // LOGOUT
    // ============================================================

    const handleLogout = () => {

        // Remove logged-in user information
        localStorage.removeItem("user");

        // If you stored token separately
        localStorage.removeItem("token");

        // Close sidebar on mobile
        if (setIsOpen) {
            setIsOpen(false);
        }

        // Redirect to login page
        navigate("/login");
    };


    return (
        <>
            {/* ================= MOBILE OVERLAY ================= */}

            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="
                        fixed inset-0 z-40
                        bg-black/60
                        backdrop-blur-sm
                        lg:hidden
                    "
                />
            )}


            {/* ================= SIDEBAR ================= */}

            <aside
                className={`
                    fixed left-0 top-0 z-50
                    flex h-screen w-72 flex-col
                    overflow-hidden
                    text-white

                    bg-[#0b1120]

                    border-r border-white/10

                    shadow-[8px_0_30px_rgba(0,0,0,0.18)]

                    transition-transform duration-300 ease-in-out

                    lg:translate-x-0

                    ${isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >

                {/* ================= TOP DECORATION ================= */}

                <div
                    className="
                        absolute
                        -top-20
                        -right-20
                        h-48
                        w-48
                        rounded-full
                        bg-blue-600/20
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        top-32
                        -left-20
                        h-40
                        w-40
                        rounded-full
                        bg-violet-600/10
                        blur-3xl
                    "
                />


                {/* ================= LOGO ================= */}

                <div className="border-b border-gray-700 px-5 py-5">

                    <NavLink
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-3"
                    >

                        {/* Logo Icon */}

                        <div
                            className="
                                flex h-11 w-11 items-center justify-center
                                rounded-xl
                                bg-gradient-to-br
                                from-blue-500
                                to-purple-600
                                shadow-lg
                                shadow-blue-500/20
                                transition-all
                                duration-300
                                group-hover:scale-105
                                group-hover:shadow-purple-500/30
                            "
                        >
                            <Boxes
                                size={25}
                                className="text-white"
                            />
                        </div>


                        {/* Logo Text */}

                        <div>

                            <h1
                                className="
                                    text-xl
                                    font-extrabold
                                    tracking-wide
                                    text-white
                                    transition-colors
                                    group-hover:text-blue-400
                                "
                            >
                                Inventory
                            </h1>

                            <p
                                className="
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.18em]
                                    text-gray-400
                                "
                            >
                                Management System
                            </p>

                        </div>

                    </NavLink>


                    {/* Close button - mobile */}

                    <button
                        onClick={() => setIsOpen(false)}
                        className="
                            absolute
                            right-4
                            top-5
                            rounded-lg
                            p-2
                            text-gray-400
                            hover:bg-gray-800
                            hover:text-white
                            lg:hidden
                        "
                    >
                        <X size={22} />
                    </button>

                </div>


                {/* ================= NAVIGATION ================= */}

                <nav
                    className="
                        relative
                        flex-1
                        overflow-y-auto
                        px-3
                        py-5

                        scrollbar-thin
                        scrollbar-track-transparent
                        scrollbar-thumb-slate-700
                    "
                >

                    {menuItems.map((item, index) => {

                        const Icon = item.icon;

                        // Show section heading when section changes

                        const previousItem = menuItems[index - 1];

                        const showSection =
                            !previousItem ||
                            previousItem.section !== item.section;


                        return (
                            <React.Fragment key={item.path}>

                                {/* Section Heading */}

                                {showSection && (
                                    <div
                                        className="
                                            mb-2
                                            mt-5
                                            px-3
                                            first:mt-0
                                        "
                                    >

                                        <p
                                            className="
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-[0.2em]
                                                text-slate-500
                                            "
                                        >
                                            {item.section}
                                        </p>

                                    </div>
                                )}


                                {/* Navigation Item */}

                                <NavLink
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={({ isActive }) =>
                                        `
                                        group
                                        relative
                                        mb-1
                                        flex
                                        items-center
                                        gap-3
                                        overflow-hidden
                                        rounded-xl
                                        px-3
                                        py-3

                                        text-[14px]
                                        font-semibold

                                        transition-all
                                        duration-200

                                        ${isActive
                                            ? `
                                                    bg-gradient-to-r
                                                    from-blue-600
                                                    to-violet-600
                                                    text-white
                                                    shadow-lg
                                                    shadow-blue-600/20
                                                `
                                            : `
                                                    text-slate-400
                                                    hover:bg-white/[0.06]
                                                    hover:text-white
                                                `
                                        }
                                        `
                                    }
                                >

                                    {/* Active left indicator */}

                                    <span
                                        className="
                                            absolute
                                            left-0
                                            top-1/2
                                            h-7
                                            w-1
                                            -translate-y-1/2
                                            rounded-r-full
                                            bg-white
                                            opacity-0
                                            transition
                                            group-[.active]:opacity-100
                                        "
                                    />


                                    {/* Icon Box */}

                                    <span
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                            bg-white/[0.06]
                                            transition-all
                                            duration-200

                                            group-hover:bg-white/10
                                        "
                                    >

                                        <Icon
                                            size={19}
                                            strokeWidth={2}
                                        />

                                    </span>


                                    {/* Text */}

                                    <span className="truncate">
                                        {item.name}
                                    </span>

                                </NavLink>

                            </React.Fragment>
                        );
                    })}

                </nav>


                {/* ================= BOTTOM AREA ================= */}

                <div
                    className="
                        relative
                        shrink-0
                        border-t
                        border-white/10
                        p-3
                    "
                >

                    {/* System status */}

                    <div
                        className="
                            mb-3
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-emerald-500/[0.07]
                            px-3
                            py-2.5
                            border
                            border-emerald-500/10
                        "
                    >

                        <span
                            className="
                                h-2
                                w-2
                                rounded-full
                                bg-emerald-400
                                shadow-[0_0_8px_rgba(52,211,153,0.7)]
                            "
                        />

                        <span
                            className="
                                text-[11px]
                                font-medium
                                text-emerald-300
                            "
                        >
                            System Online
                        </span>

                    </div>


                    {/* ================= LOGOUT ================= */}

                    <button
                        onClick={handleLogout}
                        className="
                            group
                            flex
                            w-full
                            items-center
                            gap-3
                            rounded-xl
                            px-3
                            py-3

                            text-[14px]
                            font-semibold
                            text-slate-400

                            transition-all
                            duration-200

                            hover:bg-red-500/10
                            hover:text-red-400
                        "
                    >

                        <span
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                bg-white/[0.04]
                                transition

                                group-hover:bg-red-500/10
                            "
                        >

                            <LogOut size={19} />

                        </span>


                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </aside>
        </>
    );
};

export default Sidebar;