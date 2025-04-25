import React from 'react';
import { useNavigate } from 'react-router-dom';
// ตัวอย่างการ import ไอคอน (ต้องติดตั้ง @heroicons/react ก่อน: npm install @heroicons/react)
import { IdentificationIcon } from '@heroicons/react/24/outline'; // หรือใช้ solid ตามชอบ

const Home = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        // 1. Main container: เต็มจอ, จัดกลาง, พื้นหลังสีเทาอ่อน
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
            {/* 2. Content Card: พื้นหลังขาว,เงา,มุมมน, กำหนดความกว้างสูงสุด, จัดเนื้อหาตรงกลาง */}
            <div className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-md text-center transform transition-all hover:scale-[1.02] duration-300">

                {/* Optional: Logo or Icon */}
                {/* <img src="/path/to/your/logo.png" alt="Logo" className="mx-auto mb-6 h-16" /> */}
                {/* หรือใช้ Icon */}
                 <IdentificationIcon className="mx-auto h-16 w-16 text-blue-500 mb-5" />

                {/* 3. Title */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                    ระบบขอประวัติการรักษาออนไลน์
                </h1>

                {/* 4. Description */}
                <p className="text-gray-600 text-sm sm:text-base mb-8">
                    กรุณาเข้าสู่ระบบด้วย ThaiID เพื่อดำเนินการยื่นคำขอ หรือติดตามสถานะคำขอของคุณ
                </p>

                {/* 5. Login Button */}
                <button
                    onClick={handleLoginClick}
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white text-base sm:text-lg font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                    <IdentificationIcon className="h-5 w-5" aria-hidden="true" />
                    เข้าสู่ระบบด้วย ThaiID
                </button>

                 {/* Optional: Footer links or info */}
                 <div className="mt-8 text-xs text-gray-400">
                     <p>โรงพยาบาลตัวอย่าง</p>
                     <p>เวอร์ชัน 1.0.0</p>
                 </div>
            </div>
        </div>
    );
};

export default Home;