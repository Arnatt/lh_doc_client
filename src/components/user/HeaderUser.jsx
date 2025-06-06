import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import Logo from '../../assets/LH-logo.png'
import useRequestStore from '../../store/request-store';

const HeaderUser = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { currentUser, actionLogout, fetchCurrentUser } = useRequestStore();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    //Create Full Name
    const fullName = currentUser && currentUser.fname && currentUser.lname
        ? `${currentUser.fname} ${currentUser.lname}`
        : 'User';

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogoutClick = () => {
        setDropdownOpen(false);
        actionLogout(navigate);
    }

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

    useEffect(() => {
        fetchCurrentUser();
    }, [fetchCurrentUser]);

    return (
        <header className='bg-white h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 shadow-sm relative'>
            <Link to="/home" className="text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                <img src={Logo} alt="Logo โรงพยาบาล" className="h-8 w-auto mr-2" />
            </Link>

            <div className='relative' ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className='flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                >
                    <span>{fullName}</span>
                    <ChevronDownIcon
                        className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                    />
                </button>

                <div
                    className={`absolute top-full right-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden z-20 transition ease-out duration-100 transform ${dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                >
                    <div className="py-1" role="none">
                        <button
                            onClick={handleLogoutClick}
                            className='w-full flex items-center space-x-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:bg-red-50 transition-colors'
                            role="menuitem"
                        >
                            <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
export default HeaderUser