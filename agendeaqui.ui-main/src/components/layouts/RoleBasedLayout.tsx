/* import React from "react";
import TopMenu from "./menu/TopMenu";
import DoctorSideMenu from "./menu/DoctorSideMenu";

interface RoleBasedLayoutProps {
    role: string;
    children: React.ReactNode;
}

const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ role, children }) => {
    if (role === "DOCTOR") {
        return (
            <div className="flex">
                
                <DoctorSideMenu className="fixed top-0 left-0 w-14 h-screen bg-gray-50 z-10" />
                
                <div className="flex-1 ml-14">{children}</div>
            </div>
        );
    }
    return (
        <>
            <TopMenu />
            <div>{children}</div>
        </>
    );
};

export default RoleBasedLayout;
 */
