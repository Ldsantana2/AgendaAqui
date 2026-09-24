/* import React from 'react';
import {useRouter} from "next/router";

interface ProfileOptionsMenuProps {
    className?: string;
}

const ProfileOptionsMenu: React.FC<ProfileOptionsMenuProps> = ({ className = "" }) => {
    const router = useRouter();

    const handleOptionClick = (panel: string) => {
        router.push(`/profile?panel=${panel}&menu=open`, undefined, { shallow: true });
    };


    return (
        <div
            className={`fixed top-0 left-14 w-48 h-screen bg-white border-l border-gray-300 shadow-[2px_0px_8px_rgba(0,0,0,0.15)] z-20 ${className}`}
        >
            <h2 className="text-xl font-semibold p-4 border-b border-gray-200">Perfil</h2>
            <ul className="py-2">
                <li>
                    <button onClick={() => handleOptionClick('addresses')} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left">
                         Endereços
                    </button>
                </li>
                <li>
                    <button onClick={() => handleOptionClick('edit')} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left">
                        Editar Perfil
                    </button>
                </li>
                <li>
                    <button onClick={() => handleOptionClick('dashboard')} className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left">
                        Dashboard
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default ProfileOptionsMenu;
 */
