import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';

const HeaderAdmin = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const adminName = 'Admin Test'; // หรือดึงมาจาก state/context
  const dropdownRef = useRef(null); // Ref สำหรับตรวจจับการคลิกนอก Dropdown
  const navigate = useNavigate(); // Hook สำหรับ redirect

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // ฟังก์ชันสำหรับจัดการการ Logout (เหมือนกับ HeaderUser)
  const handleLogout = () => {
    console.log('Admin Logging out...'); // แสดงใน console เพื่อทดสอบ

    // --- ใส่ Logic การ Logout จริงที่นี่ ---
    // 1. ล้างข้อมูลการยืนยันตัวตน (เช่น token จาก localStorage/sessionStorage)
    // localStorage.removeItem('adminAuthToken');
    // sessionStorage.removeItem('adminAuthToken');

    // 2. Reset Admin State (ถ้าใช้ Context API หรือ Redux)
    // dispatch({ type: 'ADMIN_LOGOUT' });

    // 3. ปิด Dropdown
    setDropdownOpen(false);

    // 4. พา Admin กลับไปหน้า Login (หรือหน้าที่ต้องการ)
    navigate('/login-admin'); // หรือ path อื่นๆ ที่ต้องการ
    // ------------------------------------
  };

  // Effect สำหรับจัดการการคลิกนอก Dropdown เพื่อปิดเมนู (เหมือนกับ HeaderUser)
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

  return (
    <header className='bg-white h-16 flex items-center justify-end px-4 sm:px-6 border-b border-gray-200 shadow-sm relative'>
      {/* User Menu / Logout (ปรับตำแหน่งให้ชิดขวา) */}
      <div className='relative' ref={dropdownRef}> {/* ผูก Ref ที่นี่ */}
        {/* Admin Button */}
        <button
          onClick={toggleDropdown}
          className='flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          id="admin-menu-button" // เพิ่ม ID สำหรับ aria-labelledby ใน dropdown
        >
          <span>{adminName}</span>
          <ChevronDownIcon
            className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`
            absolute top-full right-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden z-20
            transition ease-out duration-100 transform
            ${dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
          `}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="admin-menu-button" // อ้างอิง ID ของ button หลัก
        >
          <div className="py-1" role="none">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className='w-full flex items-center space-x-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:bg-red-50 transition-colors'
              role="menuitem"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
              <span>Logout</span>
            </button>
            {/* สามารถเพิ่มรายการเมนูอื่นๆ สำหรับ Admin ได้ที่นี่ */}
            {/* <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</Link> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;