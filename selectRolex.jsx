import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "../components/Button"
import axios from "axios";

const RoleSelection = () => {
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/auth/check", { withCredentials: true });
                if (Array.isArray(res.data.role)) {
                    setRoles(res.data.role);
                } else {
                    navigate("/"); // redirect if only one role
                }
            } catch {
                navigate("/");
            }
        };

        fetchRoles();
    }, []);

    const handleSelect = (role) => {
        localStorage.setItem("selectedRole", role);
        window.location.href = "/";
    };

    return (
        <div className="w-full h-screen flex items-center justify-center flex-col">
            <h2 className="text-2xl font-medium">Select Your Role</h2>
            <div className="row flex gap-2 mt-2">
                {roles.map((role, index) => (
                    <Button key={index} handleFunction={() => handleSelect(role)} type={"bordered"} value={role} />
                ))}
            </div>
        </div>
    );
};

export default RoleSelection;