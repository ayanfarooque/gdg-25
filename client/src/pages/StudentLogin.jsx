import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as LoginContext from "./LoginContext";
import "./style.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StudentContext } from "../context/StudentContext";

function StudentLogin() {
    const [isStudentSignIn, toggleStudent] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
   const { setstoken, backendUrl } = useContext(StudentContext)
    const navigate = useNavigate();

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        console.log("Submitting to:", `${backendUrl}/api/Students/login`);
        console.log("Email:", email, "Password:", password);

        try {
            const response = await axios.post(`${backendUrl}/api/students/login`, { email, password });
    
            console.log("Full API Response:", response); // Log full response
            console.log("Response Data:", response.data); // Log response data only
    
            if (response.data.token) { // Ensure token exists
                localStorage.setItem("sToken", response.data.token);
                setstoken(response.data.token);
                toast.success("Login successful!");
                navigate("/Stu-Dash");
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
            

            <LoginContext.Container className="h-[600px] text-xl">
                <LoginContext.SignUpContainer signinIn={isStudentSignIn}>
                    <LoginContext.Form onSubmit={onSubmitHandler}>
                        <LoginContext.Title>Create Student Account</LoginContext.Title>
                        <LoginContext.Input type="text" placeholder="Student Name" />
                        <LoginContext.Input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Student Email"
                        />
                        <LoginContext.Input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Password"
                        />
                        <LoginContext.Button type="submit">Sign Up</LoginContext.Button>
                    </LoginContext.Form>
                </LoginContext.SignUpContainer>

                <LoginContext.SignInContainer signinIn={isStudentSignIn}>
                    <LoginContext.Form onSubmit={onSubmitHandler}>
                        <LoginContext.Title>Student Sign In</LoginContext.Title>
                        <LoginContext.Input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Student Email"
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

                <LoginContext.OverlayContainer signinIn={isStudentSignIn}>
                    <LoginContext.Overlay signinIn={isStudentSignIn}>
                        <LoginContext.LeftOverlayPanel signinIn={isStudentSignIn}>
                            <LoginContext.Title>Welcome Back, Student!</LoginContext.Title>
                            <LoginContext.Paragraph>
                                To stay connected with us, please log in with your Student credentials.
                            </LoginContext.Paragraph>
                            <LoginContext.GhostButton onClick={() => toggleStudent(true)}>
                                Sign In
                            </LoginContext.GhostButton>
                        </LoginContext.LeftOverlayPanel>

                        <LoginContext.RightOverlayPanel signinIn={isStudentSignIn}>
                            <LoginContext.Title>Hello, Student!</LoginContext.Title>
                            <LoginContext.Paragraph>
                                Enter your details and start accessing your student portal.
                            </LoginContext.Paragraph>
                            <LoginContext.GhostButton onClick={() => toggleStudent(false)}>
                                Sign Up
                            </LoginContext.GhostButton>
                        </LoginContext.RightOverlayPanel>
                    </LoginContext.Overlay>
                </LoginContext.OverlayContainer>
            </LoginContext.Container>
            <ToastContainer />
        </LoginContext.PageWrapper>
    );
}

export default StudentLogin;