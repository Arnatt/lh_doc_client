import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRequestStore from '../../store/request-store';
import axios from 'axios'; // Make sure axios is imported

const FormRequest = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [provinceId, setProvinceId] = useState('');
    const [amphureId, setAmphureId] = useState('');
    const [tambonId, setTambonId] = useState('');
    const [zipCode, setZipCode] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        fname: '',
        lname: '',
        phone: '',
        address: '',
        village: '', // ค่าเริ่มต้นสำหรับหมู่ที่
        alley: '',
        road: '',
    });
    const navigate = useNavigate();
    const token = useRequestStore(state => state.token);
    const fetchUserProfile = useRequestStore(state => state.fetchUserProfile);
    const currentUser = useRequestStore(state => state.currentUser);

    // --- Fetch Address Data ---
    useEffect(() => {
        const fetchAddressData = async () => {
            try {
                setIsLoading(true);
                const res = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json');
                const fetchedData = await res.json();
                setData(fetchedData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching address data:", error);
                setIsLoading(false);
            }
        };
        fetchAddressData();
    }, []);

    // --- Fetch User Profile on component mount and token change ---
    useEffect(() => {
        if (token) {
            fetchUserProfile();
        }
    }, [token, fetchUserProfile]);

    const normalizeString = (str) => str?.trim().toLowerCase();

    // findProvinceId ใช้ชื่อจังหวัดเพื่อค้นหา id
    const findProvinceId = (provinceName) => {
        if (!provinceName || !data.length) return '';

        const normalizedProvinceName = normalizeString(provinceName);
        const province = data.find(p => normalizeString(p.name_th) === normalizedProvinceName);
        return province?.id?.toString() || '';
    };

    // findAmphureId ใช้ชื่ออำเภอและ provinceId เพื่อค้นหา id
    const findAmphureId = (districtName, currentProvinceId) => {
        if (!districtName || !currentProvinceId || !data.length) return '';

        const normalizedDistrictName = normalizeString(districtName);
        const province = data.find(p => p.id?.toString() === currentProvinceId);

        if (!province?.amphure) return '';

        const amphure = province.amphure.find(a =>
            normalizeString(a.name_th) === normalizedDistrictName
        );

        return amphure?.id?.toString() || '';
    };

    // findTambonId ใช้ชื่อตำบล provinceId และ amphureId เพื่อค้นหา id
    const findTambonId = (subdistrictName, currentProvinceId, currentAmphureId) => {
        if (!subdistrictName || !currentProvinceId || !currentAmphureId || !data.length) return '';

        const normalizedSubdistrictName = normalizeString(subdistrictName);
        const province = data.find(p => p.id?.toString() === currentProvinceId);

        if (!province?.amphure) return '';

        const amphure = province.amphure.find(a => a.id?.toString() === currentAmphureId);

        if (!amphure?.tambon) return '';

        const tambon = amphure.tambon.find(t =>
            normalizeString(t.name_th) === normalizedSubdistrictName
        );

        return tambon?.id?.toString() || '';
    };

    // กำหนดค่าเริ่มต้นจาก currentUser และโหลดข้อมูลที่อยู่
    useEffect(() => {
        if (currentUser && data.length > 0) {
            console.log("DEBUG: มีข้อมูล currentUser และ data แล้ว");
            console.log("DEBUG: currentUser Province:", currentUser.province);
            console.log("DEBUG: currentUser District:", currentUser.district);
            console.log("DEBUG: currentUser Subdistrict:", currentUser.subdistrict)
            // 1. กำหนดค่าข้อมูลพื้นฐาน
            setFormData(prev => ({
                ...prev,
                title: currentUser.title || '',
                fname: currentUser.fname || '',
                lname: currentUser.lname || '',
                phone: currentUser.phone || '',
                address: currentUser.house_no || '',
                village: currentUser.village_no || '',
                alley: currentUser.alley || '',
                road: currentUser.street || '',
            }));

            // 2. ค้นหาและกำหนดค่า provinceId
            const provinceIdFound = findProvinceId(currentUser.province);
            console.log("DEBUG: provinceId found:", provinceIdFound);

            if (provinceIdFound) {
                setProvinceId(provinceIdFound);

                // 3. เมื่อมี provinceId แล้ว ค้นหาและกำหนดค่า amphureId
                const amphureIdFound = findAmphureId(currentUser.district, provinceIdFound);
                console.log("DEBUG: amphureId found:", amphureIdFound);

                if (amphureIdFound) {
                    setAmphureId(amphureIdFound);

                    // 4. เมื่อมี provinceId และ amphureId แล้ว ค้นหาและกำหนดค่า tambonId
                    const tambonIdFound = findTambonId(
                        currentUser.subdistrict,
                        provinceIdFound,
                        amphureIdFound
                    );
                    console.log("DEBUG: tambonId found:", tambonIdFound);

                    if (tambonIdFound) {
                        setTambonId(tambonIdFound);
                    }
                }
            }
        }
    }, [currentUser, data]);

    // คำนวณตัวเลือกสำหรับ dropdowns
    const provinces = data;
    const amphures = provinceId ? provinces.find(p => p.id?.toString() === provinceId)?.amphure || [] : [];
    const tambons = amphureId ? amphures.find(a => a.id?.toString() === amphureId)?.tambon || [] : [];

    // กำหนดรหัสไปรษณีย์เมื่อ tambonId เปลี่ยน
    useEffect(() => {
        if (tambonId && tambons.length > 0) {
            const selectedTambon = tambons.find(t => t.id?.toString() === tambonId);
            setZipCode(selectedTambon ? selectedTambon.zip_code : '');
        } else {
            setZipCode('');
        }
    }, [tambonId, tambons]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProvinceChange = (e) => {
        const newProvinceId = e.target.value;
        setProvinceId(newProvinceId);
        setAmphureId('');
        setTambonId('');
    };

    const handleAmphureChange = (e) => {
        const newAmphureId = e.target.value;
        setAmphureId(newAmphureId);
        setTambonId('');
    };

    const handleTambonChange = (e) => {
        setTambonId(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", {
            ...formData,
            provinceId,
            amphureId,
            tambonId,
            zipCode
        });
        navigate('/user/detail-request');
    };

    const baseInputStyles = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
    const inputClasses = `${baseInputStyles}`;
    const selectClasses = `${baseInputStyles}`;
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";
    const readOnlyInputClasses = `${baseInputStyles} bg-gray-100 cursor-default`;

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 text-center text-gray-500">
                กำลังโหลดข้อมูล...
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-4xl mt-4 mb-8">
            <h1 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">กรอกข้อมูลผู้ขอรับเอกสาร</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" onSubmit={handleSubmit}>

                <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5">
                    <div>
                        <label htmlFor="title" className={labelClasses}>คำนำหน้า</label>
                        <select id="title" name="title" value={formData.title} onChange={handleInputChange} className={selectClasses} required>
                            <option value="" disabled>เลือก...</option>
                            <option value="นาย">นาย</option>
                            <option value="นาง">นาง</option>
                            <option value="นางสาว">นางสาว</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="fname" className={labelClasses}>ชื่อจริง</label>
                        <input type="text" id="fname" name="fname" value={formData.fname} onChange={handleInputChange} placeholder="ชื่อจริง" className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="lname" className={labelClasses}>นามสกุล</label>
                        <input type="text" id="lname" name="lname" value={formData.lname} onChange={handleInputChange} placeholder="นามสกุล" className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="phone" className={labelClasses}>เบอร์โทรศัพท์</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="08xxxxxxxx" className={inputClasses} />
                    </div>
                </div>
                <div>
                    <label htmlFor="address" className={labelClasses}>บ้านเลขที่</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="เลขที่บ้าน/อาคาร" className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="village" className={labelClasses}>หมู่ที่</label>
                    <input type="text" id="village" name="village" value={formData.village} onChange={handleInputChange} placeholder="หมู่ที่" className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="alley" className={labelClasses}>ตรอก/ซอย</label>
                    <input type="text" id="alley" name="alley" value={formData.alley} onChange={handleInputChange} placeholder="ตรอก หรือ ซอย" className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="road" className={labelClasses}>ถนน</label>
                    <input type="text" id="road" name="road" value={formData.road} onChange={handleInputChange} placeholder="ถนน" className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="province" className={labelClasses}>จังหวัด</label>
                    <select id="province" name="province" className={selectClasses} value={provinceId} onChange={handleProvinceChange} required>
                        <option value="" disabled>-- เลือกจังหวัด --</option>
                        {provinces.map(p => (
                            <option key={p.id} value={p.id}>{p.name_th}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="amphure" className={labelClasses}>เขต/อำเภอ</label>
                    <select id="amphure" name="amphure" className={selectClasses} value={amphureId} onChange={handleAmphureChange} disabled={!provinceId} required>
                        <option value="" disabled>-- เลือกเขต/อำเภอ --</option>
                        {amphures.map(a => (
                            <option key={a.id} value={a.id}>{a.name_th}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="tambon" className={labelClasses}>แขวง/ตำบล</label>
                    <select id="tambon" name="tambon" className={selectClasses} value={tambonId} onChange={handleTambonChange} disabled={!amphureId} required>
                        <option value="" disabled>-- เลือกแขวง/ตำบล --</option>
                        {tambons.map(t => (
                            <option key={t.id} value={t.id}>{t.name_th}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="zipcode" className={labelClasses}>รหัสไปรษณีย์</label>
                    <input type="text" id="zipcode" name="zipcode" className={readOnlyInputClasses} placeholder="รหัสไปรษณีย์" value={zipCode} readOnly />
                </div>
                <div className="md:col-span-2 flex justify-center mt-6">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-2.5 rounded-md font-semibold text-sm shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                        ถัดไป
                    </button>
                </div>

            </form>
        </div>
    );
};

export default FormRequest;