import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRequestStore from '../../store/request-store';

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
        village: '',
        alley: '',
        road: '',
    });

    const navigate = useNavigate();
    const userToken = useRequestStore(state => state.userToken);
    const fetchUserProfile = useRequestStore(state => state.fetchUserProfile);
    const currentUser = useRequestStore(state => state.currentUser);
    const setRequestInfo = useRequestStore(state => state.setRequestInfo);
    const updateUserProfile = useRequestStore(state => state.updateUserProfile);

    useEffect(() => {
        const fetchAddressData = async () => {
            try {
                setIsLoading(true);
                const res = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json');
                const fetchedData = await res.json();
                setData(fetchedData);
            } catch (error) {
                console.error("Error fetching address data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAddressData();
    }, []);

    useEffect(() => {
        if (userToken) {
            fetchUserProfile();
        }
    }, [userToken, fetchUserProfile]);

    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                title: currentUser.title || '',
                fname: currentUser.fname || '',
                lname: currentUser.lname || '',
                phone: currentUser.phone || '',
            }));
        }
    }, [currentUser]);

    const provinces = data;
    const amphures = provinceId ? provinces.find(p => p.id?.toString() === provinceId)?.amphure || [] : [];
    const tambons = amphureId ? amphures.find(a => a.id?.toString() === amphureId)?.tambon || [] : [];

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ดึงชื่อจังหวัด
        const selectedProvince = provinces.find(p => p.id?.toString() === provinceId);
        const provinceName = selectedProvince ? selectedProvince.name_th : '';

        // ดึงชื่ออำเภอ
        const selectedAmphure = amphures.find(a => a.id?.toString() === amphureId);
        const amphureName = selectedAmphure ? selectedAmphure.name_th : '';

        // ดึงชื่อตำบล
        const selectedTambon = tambons.find(t => t.id?.toString() === tambonId);
        const tambonName = selectedTambon ? selectedTambon.name_th : '';

        const updatedAddressData = {
            house_no: formData.address,
            village_no: formData.village,
            alley: formData.alley,
            street: formData.road,
            province: provinceName, // ใช้ชื่อจังหวัด
            district: amphureName,   // ใช้ชื่ออำเภอ
            subdistrict: tambonName, // ใช้ชื่อตำบล
            postal_code: zipCode,
            phone: formData.phone,
        };

        try {
            await updateUserProfile(updatedAddressData);
            setRequestInfo({ ...formData, ...updatedAddressData });
            navigate('/user/detail-request');
        } catch (error) {
            console.error("Error updating address info:", error);
        }
    };


    const baseInputStyles = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
    const inputClasses = `${baseInputStyles}`;
    const selectClasses = `${baseInputStyles}`;
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";
    const readOnlyInputClasses = `${baseInputStyles} bg-gray-100 cursor-default`;

    if (isLoading) {
        return <div className="container mx-auto p-6 text-center text-gray-500">กำลังโหลดข้อมูล...</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-4xl mt-4 mb-8">
            <h1 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">กรอกข้อมูลผู้ขอรับเอกสาร</h1>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" onSubmit={handleSubmit}>
                {/* ข้อมูลส่วนตัว */}
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
                        <input type="text" id="fname" name="fname" value={formData.fname} onChange={handleInputChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="lname" className={labelClasses}>นามสกุล</label>
                        <input type="text" id="lname" name="lname" value={formData.lname} onChange={handleInputChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="phone" className={labelClasses}>เบอร์โทรศัพท์</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className={inputClasses} />
                    </div>
                </div>

                {/* ข้อมูลที่อยู่ */}
                <div>
                    <label htmlFor="address" className={labelClasses}>บ้านเลขที่</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="village" className={labelClasses}>หมู่ที่</label>
                    <input type="text" id="village" name="village" value={formData.village} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="alley" className={labelClasses}>ตรอก/ซอย</label>
                    <input type="text" id="alley" name="alley" value={formData.alley} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="road" className={labelClasses}>ถนน</label>
                    <input type="text" id="road" name="road" value={formData.road} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                    <label htmlFor="province" className={labelClasses}>จังหวัด</label>
                    <select id="province" className={selectClasses} value={provinceId} onChange={handleProvinceChange} required>
                        <option value="" disabled>-- เลือกจังหวัด --</option>
                        {provinces.map(p => (
                            <option key={p.id} value={p.id}>{p.name_th}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="amphure" className={labelClasses}>เขต/อำเภอ</label>
                    <select id="amphure" className={selectClasses} value={amphureId} onChange={handleAmphureChange} required disabled={!provinceId}>
                        <option value="" disabled>-- เลือกเขต/อำเภอ --</option>
                        {amphures.map(a => (
                            <option key={a.id} value={a.id}>{a.name_th}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="tambon" className={labelClasses}>แขวง/ตำบล</label>
                    <select id="tambon" className={selectClasses} value={tambonId} onChange={handleTambonChange} required disabled={!amphureId}>
                        <option value="" disabled>-- เลือกแขวง/ตำบล --</option>
                        {tambons.map(t => (
                            <option key={t.id} value={t.id}>{t.name_th}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="zipcode" className={labelClasses}>รหัสไปรษณีย์</label>
                    <input type="text" id="zipcode" className={readOnlyInputClasses} value={zipCode} readOnly />
                </div>

                <div className="md:col-span-2 flex justify-center mt-6">
                    <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-md font-semibold text-sm shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
                        ถัดไป
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormRequest;
