import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const TeacherContext = createContext();

const TeacherContextProvider = (props) => {
    const [ttoken, setttoken] = useState(localStorage.getItem("tToken") || "");
    const [teachers, setteachers] = useState([]);
    const backendUrl = "http://localhost:5000";

    const getAllTeachers = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/all-teachers`,
                {},
                { headers: { Authorization: `Bearer ${ttoken}` } }
            );

            if (data.success) {
                setteachers(data.teachers);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    
    const value = {
        ttoken,
        setttoken,
        backendUrl,
        teachers,
        getAllTeachers
    };

    return <TeacherContext.Provider value={value}>{props.children}</TeacherContext.Provider>;
};

export default TeacherContextProvider;