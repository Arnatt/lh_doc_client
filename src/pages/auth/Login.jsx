import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRequestStore from '../../store/request-store'; // Import Zustand store

const Login = () => {
    const [idNumber, setIdNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();
    const { actionLogin, loading, error } = useRequestStore(); // Get actions and state from the store

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (!idNumber || !phoneNumber) {
            alert('กรุณากรอกเลขบัตรประชาชนและเบอร์โทรศัพท์');
            return;
        }

        try {
            await actionLogin(idNumber, phoneNumber, navigate);
            // If login is successful, the navigate function in actionLogin will handle redirection
        } catch (err) {
            // Handle login error here (e.g., display error message to the user)
            console.error('Login failed in component:', err);
            alert(error || 'เข้าสู่ระบบไม่สำเร็จ'); // Show error from store or a generic message
        }
    };

    const baseInputStyles = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";
    const inputClasses = `${baseInputStyles}`;
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1"; // ชิดซ้าย, เล็กลงเล็กน้อย
    const buttonClasses = "w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out";

    return (
        // จัดกลางหน้าจอ พื้นหลังเทา
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {/* การ์ดเนื้อหา */}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">

                {/* ส่วน QR Code */}
                <div className="text-center mb-6">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                        เข้าสู่ระบบด้วย ThaiID
                    </h1>
                    {/* แสดง QR Code จริง หรือ Placeholder */}
                    <div className="flex justify-center mb-4">
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=ExampleLoginDataHere" // ใช้ URL จริง หรือสร้าง QR จาก library
                            alt="QR Code สำหรับ ThaiID Login"
                            className="border p-1 rounded-md" // เพิ่มกรอบให้ QR code
                            width="180"
                            height="180"
                        />
                    </div>
                    <p className="text-sm text-gray-500">สแกน QR Code นี้ด้วยแอปพลิเคชัน ThaiID</p>
                </div>

                {/* เส้นคั่น หรือ ข้อความ "หรือ" */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-gray-500">
                            หรือ
                        </span>
                    </div>
                </div>

                {/* ฟอร์ม Login ด้วยเลขบัตรและเบอร์โทร */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="idNumber" className={labelClasses}>
                            เลขบัตรประชาชน
                        </label>
                        <input
                            type="text" // ใช้ text ก่อน อาจเพิ่ม pattern หรือ masking ทีหลัง
                            id="idNumber"
                            name="idNumber"
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            className={inputClasses}
                            placeholder="กรอกเลขบัตร 13 หลัก"
                            required
                            maxLength={13} // จำกัด 13 หลัก
                            // pattern="\d{13}" // ตัวอย่าง pattern (อาจจะต้องปรับ)
                        />
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className={labelClasses}>
                            เบอร์โทรศัพท์
                        </label>
                        <input
                            type="tel" // ใช้ type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className={inputClasses}
                            placeholder="กรอกเบอร์โทรศัพท์ที่ลงทะเบียน"
                            required
                            maxLength={10} // จำกัด 10 หลัก (สำหรับเบอร์มือถือไทย)
                            // pattern="\d{10}" // ตัวอย่าง pattern
                        />
                    </div>

                    <div className="pt-2"> {/* เพิ่มช่องว่างด้านบนปุ่มเล็กน้อย */}
                        <button
                            type="submit"
                            className={buttonClasses}
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                        {error && <p className="mt-2 text-sm text-red-100">{error}</p>} {/* Display error message */}
                    </div>
                </form>

            </div> {/* ปิดการ์ดเนื้อหา */}
        </div> // ปิด container หลัก
    );
};

export default Login;