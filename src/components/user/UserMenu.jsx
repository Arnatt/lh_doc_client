import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentPlusIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'; // หรือใช้ solid ตามชอบ

const UserMenu = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">เมนูสำหรับผู้ใช้งาน</h2>
        <div className="mb-6">
          <Link
            to="/user/form-request"
            className="inline-flex items-center justify-center gap-2 w-full bg-blue-600 text-white text-lg py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            <DocumentPlusIcon className="h-5 w-5" aria-hidden="true" />
            เขียนคำร้องขอเอกสาร
          </Link>
        </div>
        <div>
          <Link
            to="/user/check-request"
            className="inline-flex items-center justify-center gap-2 w-full bg-green-600 text-white text-lg py-3 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          >
            <ClipboardDocumentCheckIcon className="h-5 w-5" aria-hidden="true" />
            ตรวจสอบสถานะคำร้อง
          </Link>
        </div>
        <div className="mt-8 text-xs text-gray-400">
          <p>ระบบจัดการคำร้องขอเอกสาร</p>
          <p>เวอร์ชัน 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;