import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const StudentContext = createContext();

const StudentContextProvider = (props) => {
    const [stoken, setstoken] = useState(localStorage.getItem("sToken") || "");
    const [Students, setStudents] = useState([]);
    const backendUrl = "http://localhost:5000";
    const getAllStudents = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/all-Students`,
                {},
                { headers: { Authorization: `Bearer ${stoken}` } }
            );

            if (data.success) {
                setStudents(data.Students);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    
    const value = {
        stoken,
        setstoken,
        backendUrl,
        Students,
        getAllStudents
    };

    return <StudentContext.Provider value={value}>{props.children}</StudentContext.Provider>;
};

export default StudentContextProvider;