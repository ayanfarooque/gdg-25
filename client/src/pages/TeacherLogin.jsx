import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios";
import * as LoginContext from "./LoginContext"; // Styled components
import "./style.css"; // Shared styles
import { toast, ToastContainer } from "react-toastify"; // Import Toastify for pop-up error/success messages
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS for pop-up error/success messages

function TeacherLogin() {
    const [isTeacherSignIn, toggleTeacher] = useState(true); // State for toggling between sign-in and sign-up forms
    const [email, setEmail] = useState(""); // State for email input
    const [password, setPassword] = useState(""); // State for password input
   // const { setatoken, backendUrl } = useContext(TeacherContext); // Context for backend URL and token setter
    const navigate = useNavigate(); // React Router's useNavigate hook for navigation

    const onSubmitHandler = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        console.log("Submitting to:", `${backendUrl}/api/Teacher/login`); // Log the backend URL for debugging
        console.log("Email:", email, "Password:", password); // Log the entered email and password for debugging

        try {
            // Sending email and password in the request body
            const { data } = await axios.post(`${backendUrl}/api/Teacher/login`, { email, password });
            if (data.success) {
                console.log("Login successful, token:", data.token); // Log success and the received token
                localStorage.setItem("aToken", data.token); // Save token in local storage for persistent login
                setatoken(data.token); // Save token in context
                toast.success("Login successful!"); // Show success toast notification
            } else {
                toast.error(data.message || "Invalid credentials"); // Show error toast for invalid credentials
            }
        } catch (error) {
            console.error("Error logging in:", error.response?.data || error.message); // Log error details
            toast.error("An error occurred during login. Please try again."); // Show error toast for request failure
        }
    };

    return (
        <LoginContext.PageWrapper>
            <button
                className="back-button"
                onClick={() => navigate("/")} // Navigate to home page on click
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                Back
            </button>

            <LoginContext.Container>
                {/* Sign-Up Form */}
                <LoginContext.SignUpContainer signinIn={isTeacherSignIn}>
                    <LoginContext.Form onSubmit={onSubmitHandler}>
                        <LoginContext.Title>Create Teacher Account</LoginContext.Title>
                        <LoginContext.Input type="text" placeholder="Teacher Name" />
                        <LoginContext.Input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Teacher Email"
                        />
                        <LoginContext.Input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                        />
                        <LoginContext.Button type="submit">Sign Up</LoginContext.Button>
                    </LoginContext.Form>
                </LoginContext.SignUpContainer>

                {/* Sign-In Form */}
                <LoginContext.SignInContainer signinIn={isTeacherSignIn}>
                    <LoginContext.Form onSubmit={onSubmitHandler}>
                        <LoginContext.Title>Teacher Sign In</LoginContext.Title>
                        <LoginContext.Input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Teacher Email"
                        />
                        <LoginContext.Input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                        />
                        <LoginContext.Anchor href="#">Forgot your password?</LoginContext.Anchor>
                        <LoginContext.Button type="submit">Sign In</LoginContext.Button>
                    </LoginContext.Form>
                </LoginContext.SignInContainer>

                {/* Overlay */}
                <LoginContext.OverlayContainer signinIn={isTeacherSignIn}>
                    <LoginContext.Overlay signinIn={isTeacherSignIn}>
                        {/* Left Panel */}
                        <LoginContext.LeftOverlayPanel signinIn={isTeacherSignIn}>
                            <LoginContext.Title>Welcome Back, Teacher!</LoginContext.Title>
                            <LoginContext.Paragraph>
                                To stay connected with us, please log in with your Teacher credentials.
                            </LoginContext.Paragraph>
                            <LoginContext.GhostButton onClick={() => toggleTeacher(true)}>
                                Sign In
                            </LoginContext.GhostButton>
                        </LoginContext.LeftOverlayPanel>

                        {/* Right Panel */}
                        <LoginContext.RightOverlayPanel signinIn={isTeacherSignIn}>
                            <LoginContext.Title>Hello, Teacher!</LoginContext.Title>
                            <LoginContext.Paragraph>
                                Enter your details and start managing your platform effectively.
                            </LoginContext.Paragraph>
                            <LoginContext.GhostButton onClick={() => toggleTeacher(false)}>
                                Sign Up
                            </LoginContext.GhostButton>
                        </LoginContext.RightOverlayPanel>
                    </LoginContext.Overlay>
                </LoginContext.OverlayContainer>
            </LoginContext.Container>
            <ToastContainer /> {/* Include ToastContainer for displaying notifications */}
        </LoginContext.PageWrapper>
    );
}

export default TeacherLogin;
