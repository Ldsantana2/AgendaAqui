/* // DoctorSideMenu.tsx
import React from 'react';
import { FaHome, FaClipboardList, FaUserMd, FaComments, FaRegLightbulb, FaQuestionCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface DoctorSideMenuProps {
    className?: string;
}

const DoctorSideMenu: React.FC<DoctorSideMenuProps> = ({ className = "" }) => {
    const router = useRouter();

    const handleProfileClick = () => {
        router.push('/profile?menu=open');
    };

    const handleLogoutClick = () => {
        router.push('/login');
    };

    return (
        <div className={`bg-gray-50 h-screen w-14 flex flex-col items-center py-4 border-r border-gray-300 shadow-[2px_0px_8px_rgba(0,0,0,0.15)] ${className}`}>
            <div className="mb-6 cursor-pointer text-gray-600 hover:text-green-500">
                <FaHome size={21} />
            </div>
            <div className="mb-6 cursor-pointer text-gray-600 hover:text-green-500">
                <FaClipboardList size={21} />
            </div>
            <div onClick={handleProfileClick} className="mb-6 cursor-pointer text-gray-600 hover:text-green-500">
                <FaUserMd size={21} />
            </div>
            <div className="mb-6 cursor-pointer text-gray-600 hover:text-green-500">
                <FaComments size={21} />
            </div>
            <hr className="w-8 my-2 border-gray-300" />
            <div className="mb-6 cursor-pointer text-gray-600 hover:text-green-500">
                <FaRegLightbulb size={21} />
            </div>
            <div className="mb-6 cursor-pointer text-gray-600 hover:text-green-500">
                <FaQuestionCircle size={21} />
            </div>
            <hr className="w-8 my-2 border-gray-300" />
            <div className="mb-6 cursor-pointer text-gray-600 hover:text-green-500">
                <FaCog size={21} />
            </div>
            <div onClick={handleLogoutClick} className="mt-auto cursor-pointer text-gray-600 hover:text-green-500">
                <FaSignOutAlt size={21} />
            </div>
        </div>
    );
};

export default DoctorSideMenu;
 */
