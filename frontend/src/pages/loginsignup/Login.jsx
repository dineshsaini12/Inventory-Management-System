import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    Boxes,
    User,
    Lock,
    Eye,
    EyeOff,
    Loader2
} from "lucide-react";


const Login = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ========================================================
    // LOGIN
    // ========================================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");


        if (!username || !password) {

            setError(
                "Username and password are required"
            );

            return;

        }


        try {

            setLoading(true);


            const response = await axios.post(

                "http://localhost:5000/api/auth/login",

                {
                    username,
                    password
                }

            );


            if (response.data.success) {

                // ------------------------------------------------
                // SAVE TOKEN
                // ------------------------------------------------

                localStorage.setItem(
                    "token",
                    response.data.token
                );


                // ------------------------------------------------
                // SAVE USER
                // ------------------------------------------------

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        response.data.user
                    )
                );


                // ------------------------------------------------
                // GO TO DASHBOARD
                // ------------------------------------------------

                navigate("/dashboard");

            }

        }

        catch (error) {

            console.error(
                "Login error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Invalid username or password"
            );

        }

        finally {

            setLoading(false);

        }

    };


    return (

        <div className="
            min-h-screen
            bg-gradient-to-br
            from-slate-950
            via-blue-950
            to-violet-950
            flex
            items-center
            justify-center
            px-4
        ">


            <div className="
                w-full
                max-w-md
                rounded-3xl
                bg-white
                p-7
                shadow-2xl
                sm:p-9
            ">


                {/* LOGO */}

                <div className="
                    mb-8
                    flex
                    flex-col
                    items-center
                ">

                    <div className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-gradient-to-br
                        from-blue-600
                        to-violet-600
                        text-white
                        shadow-lg
                    ">

                        <Boxes size={29} />

                    </div>


                    <h1 className="
                        mt-4
                        text-2xl
                        font-extrabold
                        text-gray-900
                    ">

                        Welcome Back

                    </h1>


                    <p className="
                        mt-1
                        text-sm
                        text-gray-500
                    ">

                        Login to your inventory system

                    </p>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="
                        mb-5
                        rounded-xl
                        border
                        border-red-200
                        bg-red-50
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-red-600
                    ">

                        {error}

                    </div>

                )}


                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >


                    {/* USERNAME */}

                    <div>

                        <label className="
                            mb-1.5
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">

                            Username

                        </label>


                        <div className="relative">

                            <User
                                size={18}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />


                            <input
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter username"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    py-3
                                    pl-10
                                    pr-4
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            />

                        </div>

                    </div>


                    {/* PASSWORD */}

                    <div>

                        <label className="
                            mb-1.5
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">

                            Password

                        </label>


                        <div className="relative">

                            <Lock
                                size={18}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                "
                            />


                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter password"
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    py-3
                                    pl-10
                                    pr-11
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            />


                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-gray-400
                                    hover:text-gray-700
                                "
                            >

                                {showPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />
                                }

                            </button>

                        </div>

                    </div>


                    {/* LOGIN */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-gradient-to-r
                            from-blue-600
                            to-violet-600
                            py-3
                            text-sm
                            font-bold
                            text-white
                            shadow-lg
                            shadow-blue-500/20
                            transition
                            hover:from-blue-700
                            hover:to-violet-700
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >

                        {loading ? (

                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />

                                Logging in...

                            </>

                        ) : (

                            "Login"

                        )}

                    </button>

                </form>


                {/* SIGNUP */}

                <p className="
                    mt-6
                    text-center
                    text-sm
                    text-gray-500
                ">

                    Don't have an account?

                    {" "}

                    <Link
                        to="/signup"
                        className="
                            font-bold
                            text-blue-600
                            hover:text-blue-700
                        "
                    >

                        Create Account

                    </Link>

                </p>

            </div>

        </div>

    );

};


export default Login;