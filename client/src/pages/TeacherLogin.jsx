import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as LoginContext from "./LoginContext";
import "./style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TeacherContext } from "../context/TeacherContext"; 

function TeacherLogin() {
    const [isTeacherSignIn, toggleTeacher] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setttoken, backendUrl } = useContext(TeacherContext); 
    const navigate = useNavigate();

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        console.log("Submitting to:", `${backendUrl}/api/teachers/login`);
        console.log("Email:", email, "Password:", password);
    
        try {
            const response = await axios.post(`${backendUrl}/api/teachers/login`, { email, password });
    
            console.log("Full API Response:", response); // Log full response
            console.log("Response Data:", response.data); // Log response data only
    
            if (response.data.token) { // Ensure token exists
                localStorage.setItem("tToken", response.data.token);
                setttoken(response.data.token);
                toast.success("Login successful!");
                navigate("/teacher-home");
            } else {
                toast.error(response.data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error("Error logging in:", error.response?.data || error.message);
            toast.error("An error occurred during login. Please try again.");
        }
    };
    
    return (
        <LoginContext.PageWrapper>
            <button
                className="back-button"
                onClick={() => navigate("/")}
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

            <LoginContext.Container className=" h-[600px] text-xl">
                <LoginContext.SignUpContainer signinIn={isTeacherSignIn}>
                    <LoginContext.Form onSubmit={onSubmitHandler}>
                        <LoginContext.Title>Create Teacher Account</LoginContext.Title>
                        <LoginContext.Input className="w-full h-12 text-lg p-3 border rounded-md" type="text" placeholder="Teacher Name" />
                        <LoginContext.Input className="w-full h-12 text-lg p-3 border rounded-md" onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Teacher Email" />
                        <LoginContext.Input className="w-full h-12 text-lg p-3 border rounded-md" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                        <LoginContext.Button type="submit">Sign Up</LoginContext.Button>
                    </LoginContext.Form>
                </LoginContext.SignUpContainer>

                <LoginContext.SignInContainer signinIn={isTeacherSignIn}>
                    <LoginContext.Form onSubmit={onSubmitHandler}>
                        <LoginContext.Title>Teacher Sign In</LoginContext.Title>
                        <LoginContext.Input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Teacher Email" />
                        <LoginContext.Input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                        <LoginContext.Anchor href="#">Forgot your password?</LoginContext.Anchor>
                        <LoginContext.Button type="submit">Sign In</LoginContext.Button>
                    </LoginContext.Form>
                </LoginContext.SignInContainer>

                <LoginContext.OverlayContainer className="w-full h-full" signinIn={isTeacherSignIn}>
                    <LoginContext.Overlay signinIn={isTeacherSignIn}>
                        <LoginContext.LeftOverlayPanel signinIn={isTeacherSignIn}>
                            <LoginContext.Title>Welcome Back, Teacher!</LoginContext.Title>
                            <LoginContext.Paragraph>
                                To stay connected with us, please log in with your Teacher credentials.
                            </LoginContext.Paragraph>
                            <LoginContext.GhostButton onClick={() => toggleTeacher(true)}>Sign In</LoginContext.GhostButton>
                        </LoginContext.LeftOverlayPanel>

                        <LoginContext.RightOverlayPanel signinIn={isTeacherSignIn}>
                            <LoginContext.Title>Hello, Teacher!</LoginContext.Title>
                            <LoginContext.Paragraph>
                                Enter your details and start managing your platform effectively.
                            </LoginContext.Paragraph>
                            <LoginContext.GhostButton onClick={() => toggleTeacher(false)}>Sign Up</LoginContext.GhostButton>
                        </LoginContext.RightOverlayPanel>
                    </LoginContext.Overlay>
                </LoginContext.OverlayContainer>
            </LoginContext.Container>

            <ToastContainer />
        </LoginContext.PageWrapper>
    );
}

export default TeacherLogin;
