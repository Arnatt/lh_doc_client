import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DocumentMagnifyingGlassIcon,
  BookOpenIcon,
  CubeIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline'; // หรือใช้ solid ตามชอบ

const SidebarAdmin = () => {
  return (
    <div className="bg-gray-100 w-64 text-gray-800 flex flex-col h-screen shadow-md border-r border-gray-200">
      <div className="h-20 bg-white flex items-center justify-center text-xl font-semibold text-blue-600 border-b border-gray-200">
        Admin Panel
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        <NavLink
          to={"dashboard"}
          end
          className={({ isActive }) =>
            isActive
              ? "bg-blue-100 text-blue-800 px-4 py-3 rounded-md flex items-center font-medium"
              : "text-gray-600 px-4 py-3 hover:bg-gray-200 hover:text-gray-900 rounded-md flex items-center font-medium"
          }
        >
          <HomeIcon className="h-5 w-5 mr-3 text-gray-500" />
          Dashboard
        </NavLink>
        <NavLink
          to={"list-request"}
          className={({ isActive }) =>
            isActive
              ? "bg-blue-100 text-blue-800 px-4 py-3 rounded-md flex items-center font-medium"
              : "text-gray-600 px-4 py-3 hover:bg-gray-200 hover:text-gray-900 rounded-md flex items-center font-medium"
          }
        >
          <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-3 text-gray-500" />
          รายการร้องขอเอกสาร
        </NavLink>
        <NavLink
          to={"category"}
          className={({ isActive }) =>
            isActive
              ? "bg-blue-100 text-blue-800 px-4 py-3 rounded-md flex items-center font-medium"
              : "text-gray-600 px-4 py-3 hover:bg-gray-200 hover:text-gray-900 rounded-md flex items-center font-medium"
          }
        >
          <BookOpenIcon className="h-5 w-5 mr-3 text-gray-500" />
          คู่มือ
        </NavLink>
      </nav>

      <div className="p-4 mt-auto text-center text-gray-500 text-xs border-t border-gray-200">
        <p>&copy; 2025 Admin Panel</p>
      </div>
    </div>
  );
};

export default SidebarAdmin;