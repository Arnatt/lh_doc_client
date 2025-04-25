import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { ChevronDownIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import Logo from '../../assets/LH-logo.png'


const HeaderUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userName = 'User Test'; // หรือดึงมาจาก state/context
  const dropdownRef = useRef(null); // Ref สำหรับตรวจจับการคลิกนอก Dropdown
  const navigate = useNavigate(); // Hook สำหรับ redirect

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // ฟังก์ชันสำหรับจัดการการ Logout
  const handleLogout = () => {
    console.log('Logging out...'); // แสดงใน console เพื่อทดสอบ

    // --- ใส่ Logic การ Logout จริงที่นี่ ---
    // 1. ล้างข้อมูลการยืนยันตัวตน (เช่น token จาก localStorage/sessionStorage)
    // localStorage.removeItem('authToken');
    // sessionStorage.removeItem('authToken');

    // 2. Reset User State (ถ้าใช้ Context API หรือ Redux)
    // dispatch({ type: 'LOGOUT' });

    // 3. ปิด Dropdown
    setDropdownOpen(false);

    // 4. พาผู้ใช้กลับไปหน้า Login (ตัวอย่าง)
    navigate('/login'); // หรือ path อื่นๆ ที่ต้องการ
    // ------------------------------------
  };

  // Effect สำหรับจัดการการคลิกนอก Dropdown เพื่อปิดเมนู
  useEffect(() => {
    const handleClickOutside = (event) => {
      // ตรวจสอบว่า ref ถูกผูกกับ element และ element ที่คลิกไม่ได้อยู่ในขอบเขตของ ref
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // ปิด Dropdown
      }
    };

    // เพิ่ม event listener เมื่อ Dropdown เปิด
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // ลบ event listener เมื่อ Dropdown ปิด
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function: ลบ event listener เมื่อ component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]); // Dependency array: ให้ effect ทำงานใหม่เมื่อ dropdownOpen เปลี่ยนค่า

  return (
    <header className='bg-white h-16 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200 shadow-sm relative'>
      {/* Link to Home */}
      <Link to="/home" className="text-xl sm:text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
        <img src={Logo} alt="Logo โรงพยาบาล" className="h-8 w-auto mr-2" />
      </Link>

      {/* User Menu / Logout */}
      <div className='relative' ref={dropdownRef}> {/* ผูก Ref ที่นี่ */}
        {/* User Button */}
        <button
          onClick={toggleDropdown}
          className='flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <span>{userName}</span>
          <ChevronDownIcon
            className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''
              }`}
            aria-hidden="true"
          />
        </button>

        {/* Dropdown Menu */}
        {/* ใช้ transition classes ของ Tailwind */}
        <div
          className={`
                absolute top-full right-0 mt-2 w-48 bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden z-20
                transition ease-out duration-100 transform
                ${dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
            `}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button" // ควรมี id="user-menu-button" ที่ button หลัก
        >
          <div className="py-1" role="none">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className='w-full flex items-center space-x-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:bg-red-50 transition-colors'
              role="menuitem" // ระบุ role ให้ชัดเจน
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" aria-hidden="true" />
              <span>Logout</span>
            </button>
            {/* สามารถเพิ่มรายการเมนูอื่นๆ ได้ที่นี่ */}
            {/* <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Profile</Link> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderUser