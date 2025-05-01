import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import useRequestStore from '../../store/request-store';

const HeaderAdmin = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { currentAdmin, fetchCurrentAdmin, clearToken, clearCurrentAdmin } = useRequestStore();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        console.log("HeaderAdmin: currentAdmin on mount", currentAdmin);
        if (!currentAdmin && localStorage.getItem('request-store')) {
            console.log("HeaderAdmin: fetching currentAdmin");
            fetchCurrentAdmin();
        }
    }, [currentAdmin, fetchCurrentAdmin]);

    useEffect(() => {
        console.log("HeaderAdmin: currentAdmin after potential fetch", currentAdmin);
    }, [currentAdmin]);

    const handleLogout = () => {
        clearToken();
        clearCurrentAdmin();
        setDropdownOpen(false);
        navigate('/home');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    const adminName = currentAdmin && currentAdmin.fname && currentAdmin.lname
        ? `${currentAdmin.fname} ${currentAdmin.lname}`
        : currentAdmin && currentAdmin.username
            ? currentAdmin.username
            : 'Admin';

    return (
        <header className='bg-white h-16 flex items-center justify-end px-6 sm:px-8 border-b border-gray-200 shadow-sm'>
            <div className='relative' ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className='flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors hover:bg-gray-100'
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    id="admin-menu-button"
                >
                    <span>{adminName}</span>
                    <ChevronDownIcon
                        className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                    />
                </button>
                <div
                    className={`
                        absolute top-full right-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden z-20
                        transition ease-out duration-100 transform origin-top-right
                        ${dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                    `}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="admin-menu-button"
                >
                    <div className="py-1" role="none">
                        <button
                            onClick={handleLogout}
                            className='w-full flex items-center space-x-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:bg-red-50 transition-colors'
                            role="menuitem"
                        >
                            <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
                            <span>ออกจากระบบ</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderAdmin;