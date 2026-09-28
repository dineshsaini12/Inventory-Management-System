import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    Boxes,
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    Loader2
} from "lucide-react";


const Signup = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone_no: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ========================================================
    // HANDLE INPUT
    // ========================================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // ========================================================
    // SIGNUP
    // ========================================================

    const handleSignup = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // ----------------------------------------------------
        // PASSWORD CHECK
        // ----------------------------------------------------

        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError("Passwords do not match");

            return;

        }


        if (formData.password.length < 6) {

            setError(
                "Password must be at least 6 characters"
            );

            return;

        }


        try {

            setLoading(true);


            const response = await axios.post(

                "http://localhost:5000/api/auth/signup",

                {
                    username: formData.username,
                    email: formData.email,
                    phone_no: formData.phone_no,
                    password: formData.password
                }

            );


            if (response.data.success) {

                setSuccess(
                    "Account created successfully!"
                );


                setFormData({
                    username: "",
                    email: "",
                    phone_no: "",
                    password: "",
                    confirmPassword: ""
                });


                setTimeout(() => {

                    navigate("/login");

                }, 1200);

            }

        }

        catch (error) {

            console.error(
                "Signup error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to create account"
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
            py-8
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
                    mb-7
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
                        tracking-tight
                        text-gray-900
                    ">

                        Create Account

                    </h1>


                    <p className="
                        mt-1
                        text-sm
                        text-gray-500
                    ">

                        Join Inventory Management System

                    </p>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="
                        mb-4
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


                {/* SUCCESS */}

                {success && (

                    <div className="
                        mb-4
                        rounded-xl
                        border
                        border-green-200
                        bg-green-50
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-green-600
                    ">

                        {success}

                    </div>

                )}


                <form
                    onSubmit={handleSignup}
                    className="space-y-4"
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
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                required
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


                    {/* EMAIL */}

                    <div>

                        <label className="
                            mb-1.5
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">

                            Email

                        </label>


                        <div className="relative">

                            <Mail
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
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
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


                    {/* PHONE */}

                    <div>

                        <label className="
                            mb-1.5
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">

                            Phone Number

                        </label>


                        <div className="relative">

                            <Phone
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
                                type="tel"
                                name="phone_no"
                                value={formData.phone_no}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
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
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 6 characters"
                                required
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


                    {/* CONFIRM PASSWORD */}

                    <div>

                        <label className="
                            mb-1.5
                            block
                            text-sm
                            font-semibold
                            text-gray-700
                        ">

                            Confirm Password

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
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={handleChange}
                                placeholder="Confirm password"
                                required
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
                                    setShowConfirmPassword(
                                        !showConfirmPassword
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

                                {showConfirmPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />
                                }

                            </button>

                        </div>

                    </div>


                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            mt-2
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

                                Creating account...

                            </>

                        ) : (

                            "Create Account"

                        )}

                    </button>

                </form>


                {/* LOGIN LINK */}

                <p className="
                    mt-6
                    text-center
                    text-sm
                    text-gray-500
                ">

                    Already have an account?

                    {" "}

                    <Link
                        to="/login"
                        className="
                            font-bold
                            text-blue-600
                            hover:text-blue-700
                        "
                    >

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );

};


export default Signup;