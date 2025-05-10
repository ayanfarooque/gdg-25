import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [atoken, setatoken] = useState(localStorage.getItem("aToken") || "");
    const [admin, setadmin] = useState([]);
    const backendUrl = "http://localhost:5000";
    const getAlladmin = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/admin/all-admin`,
                {},
                { headers: { Authorization: `Bearer ${atoken}` } }
            );

            if (data.success) {
                setadmin(data.admin);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    
    const value = {
        atoken,
        setatoken,
        backendUrl,
        admin,
        getAlladmin
    };

    return <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>;
};

export default AdminContextProvider;