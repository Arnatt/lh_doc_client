import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRequestById, updateRequest } from '../../api/admin';
import useRequestStore from '../../store/request-store';
import { ArrowLeftIcon, DocumentTextIcon, CalendarDaysIcon, UserCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'; // Added UserCircleIcon

const FormEditRequest = () => {
    const { id: requestId } = useParams();
    const navigate = useNavigate();
    const { token } = useRequestStore();

    const [requestInfo, setRequestInfo] = useState(null);
    const [documentDetails, setDocumentDetails] = useState([]);
    const [status, setStatus] = useState('');
    const [receiveDate, setReceiveDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // --- Tailwind Class Definitions ---
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
    const baseInputStyles = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed";
    const inputClasses = `${baseInputStyles}`;
    const selectClasses = `${baseInputStyles}`;
    const buttonClassesPrimary = "inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";
    const buttonClassesSecondary = "inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out";

    // --- Date Formatting Options ---
    const thaiDateFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const shortThaiDateFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };


    // --- Fetch Data ---
    useEffect(() => {
        const fetchRequest = async () => {
            setLoading(true);
            setError(null);
            if (!token) {
                setError("ไม่ได้ยืนยันตัวตน (Missing Token)");
                setLoading(false);
                return;
            }
            if (!requestId) {
                setError("ไม่พบ ID ของคำร้อง");
                setLoading(false);
                navigate('/admin/requests');
                return;
            }
            try {
                const response = await getRequestById(token, requestId);
                const responseData = response?.data?.data;

                if (responseData && responseData.requestInfo) {
                    setRequestInfo(responseData.requestInfo);
                    setDocumentDetails(responseData.documentDetails || []);
                    setStatus(responseData.status || '');
                    setReceiveDate(
                        responseData.receiveDate
                            ? new Date(responseData.receiveDate).toISOString().split('T')[0]
                            : ''
                    );
                } else {
                    setError('ไม่พบข้อมูลคำร้อง หรือการตอบกลับไม่ถูกต้อง');
                }
            } catch (err) {
                console.error("Fetch request error:", err);
                setError(err?.response?.data?.message || err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลคำร้อง');
            } finally {
                setLoading(false);
            }
        };
        fetchRequest();
    }, [token, requestId, navigate]);

    // --- Handle Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const response = await updateRequest(token, requestId, {
                status,
                receive_date: receiveDate || null,
            });
            if (response?.data?.message === 'Request updated successfully') {
                alert('อัปเดตข้อมูลคำร้องเรียบร้อยแล้ว');
                navigate('/admin/requests');
            } else {
                setError(response?.data?.message || 'การอัปเดตล้มเหลว (การตอบกลับไม่สำเร็จ)');
            }
        } catch (err) {
            console.error("Update request error:", err);
            setError(err?.response?.data?.message || err.message || 'เกิดข้อผิดพลาดในการอัปเดตคำร้อง');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) { /* ... loading UI ... */
        return (<div className="flex justify-center items-center h-40"><p className="text-gray-500 text-lg">กำลังโหลดข้อมูลคำร้อง...</p></div>);
    }
    if (error && !submitting) { /* ... error UI ... */ // Only show fetch errors here
        return (
            <div className="max-w-2xl mx-auto p-6 my-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">เกิดข้อผิดพลาด!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
                <button onClick={() => navigate('/admin/requests')} className={`${buttonClassesSecondary} mt-4 inline-flex items-center gap-1`} >
                    <ArrowLeftIcon className="h-4 w-4" /> กลับไปหน้าหลัก
                </button>
            </div>
        );
    }
    if (!requestInfo && !loading) { /* ... not found UI ... */
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <p className="text-gray-600 text-lg">ไม่พบข้อมูลคำร้องที่ระบุ</p>
                <button onClick={() => navigate('/admin/requests')} className={`${buttonClassesSecondary} mt-4 inline-flex items-center gap-1`}>
                    <ArrowLeftIcon className="h-4 w-4" /> กลับไปหน้าหลัก
                </button>
            </div>
        );
    }

    // --- Render Main Form ---
    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white shadow-lg rounded-lg mt-4 mb-8">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4 mb-6 flex justify-between items-center flex-wrap gap-2"> {/* Added flex-wrap */}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    จัดการคำร้อง #{requestId}
                </h2>
                <button
                    onClick={() => navigate('/admin/requests')}
                    className={`${buttonClassesSecondary} text-xs sm:text-sm inline-flex items-center gap-1`}
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    กลับ
                </button>
            </div>

            {/* Request Info Section */}
            <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">ข้อมูลผู้ยื่นคำร้อง</h3>
                {/* Added null check for requestInfo */}
                {requestInfo && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="flex">
                            <dt className="w-28 font-medium text-gray-500 shrink-0">ชื่อ-สกุล:</dt>
                            <dd className="text-gray-900">{requestInfo.requester_fname} {requestInfo.requester_lname}</dd>
                        </div>
                        <div className="flex">
                            <dt className="w-28 font-medium text-gray-500 shrink-0">วันที่ร้องขอ:</dt>
                            <dd className="text-gray-900">
                                {requestInfo.request_date
                                    ? new Date(requestInfo.request_date).toLocaleDateString('th-TH', thaiDateFormatOptions)
                                    : '-'}
                            </dd>
                        </div>
                        <div className="flex">
                            <dt className="w-28 font-medium text-gray-500 shrink-0">เบอร์โทร:</dt>
                            <dd className="text-gray-900">{requestInfo.requester_phone || '-'}</dd>
                        </div>
                        <div className="flex sm:col-span-2">
                            <dt className="w-28 font-medium text-gray-500 shrink-0">วัตถุประสงค์:</dt>
                            <dd className="text-gray-900">
                                {(documentDetails && documentDetails.length > 0 && documentDetails[0].purpose)
                                    ? documentDetails[0].purpose
                                    : '-' /* แสดง '-' ถ้าไม่มีข้อมูล */}
                            </dd>
                        </div>
                    </div>
                )}
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">รายการเอกสารที่ขอ</h3>
                {documentDetails && documentDetails.length > 0 ? (
                    <ul className="space-y-4 border border-gray-200 rounded-md p-4">
                        {documentDetails.map((doc, index) => {
                            const patientFullname = [doc.related_patient_fname, doc.related_patient_lname].filter(Boolean).join(' ') || null;
                            const requesterFullname = [requestInfo?.requester_fname, requestInfo?.requester_lname].filter(Boolean).join(' ') || null;
                            const isPatientSameAsRequester = patientFullname && requesterFullname && patientFullname === requesterFullname;
                            const documentNames = doc.document_name
                                ? doc.document_name.split(',')
                                    .map(name => name.trim()) // Remove leading/trailing spaces from each name
                                    .filter(name => name && name !== '.') // Remove empty strings and stray dots
                                : ['(ไม่ระบุชื่อเอกสาร)'];
                            return (
                                <li key={doc.doc_detail_id || index} className="text-sm border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:gap-3">


                                        <div className='flex-grow'>
                                            {(doc.related_role || patientFullname) && (
                                                <div className="mb-1.5 p-2 bg-indigo-50 border border-indigo-100 rounded text-xs flex items-start gap-2">
                                                    <InformationCircleIcon className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-medium text-indigo-700">
                                                            {doc.related_role || 'ข้อมูลผู้เกี่ยวข้อง'}
                                                        </span>
                                                        {patientFullname && !isPatientSameAsRequester && (
                                                            <span className="text-indigo-600"> - {patientFullname}</span>
                                                        )}
                                                        {isPatientSameAsRequester && doc.related_role !== 'ผู้ป่วย' && (
                                                            <span className="text-indigo-600"> - {patientFullname}</span>
                                                        )}
                                                        {isPatientSameAsRequester && doc.related_role === 'ผู้ป่วย' && (
                                                            <span className="text-indigo-600"> (ข้อมูลตนเอง)</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {/* --- UPDATED Document Names List --- */}
                                            <div className="font-medium text-gray-800 mb-1 mt-1 pl-1">
                                                <p className="text-xs text-gray-500 mb-1">เอกสารที่เกี่ยวข้อง:</p>
                                                {documentNames.length > 0 && documentNames[0] !== '(ไม่ระบุชื่อเอกสาร)' ? (
                                                    <ul className="list-disc list-inside pl-4 space-y-0.5">
                                                        {documentNames.map((name, nameIndex) => (
                                                            <li key={nameIndex} className="text-gray-700">{name}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-gray-500 pl-4">{documentNames[0]}</p> // Show fallback text
                                                )}
                                            </div>
                                            {/* Date Range */}
                                            <div className="mt-2 text-xs text-gray-500 flex items-center gap-1 pl-1">
                                                <CalendarDaysIcon className="h-4 w-4" />
                                                <span>ช่วงวันที่: </span>
                                                {(doc.from_date || doc.to_date) ? (
                                                    <span>
                                                        {doc.from_date ? new Date(doc.from_date).toLocaleDateString('th-TH', shortThaiDateFormatOptions) : 'ไม่ระบุ'}
                                                        {' - '}
                                                        {doc.to_date ? new Date(doc.to_date).toLocaleDateString('th-TH', shortThaiDateFormatOptions) : 'ไม่ระบุ'}
                                                    </span>
                                                ) : (
                                                    <span>ไม่ระบุ</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-md p-4 text-center">ไม่มีรายละเอียดเอกสารที่ร้องขอ</p>
                )}
            </div>
            {/* Update Form Section */}
            <div className="border-t border-gray-200 mt-8 pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">อัปเดตสถานะคำร้อง</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="status" className={labelClasses}>สถานะคำร้อง</label>
                        <select id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClasses} required >
                            <option value="" disabled={!!status}>-- เลือกสถานะ --</option> {/* Improved disabled logic */}
                            <option value="รอดำเนินการ">รอดำเนินการ</option>
                            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                            <option value="ดำเนินการเรียบร้อย">ดำเนินการเรียบร้อย</option>
                            <option value="เอกสารไม่ครบ">เอกสารไม่ครบ</option>
                            <option value="ยกเลิก">ยกเลิก</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="receive_date" className={labelClasses}>วันที่คาดว่าจะเข้ารับเอกสาร (ถ้ามี)</label>
                        <input type="date" id="receive_date" name="receive_date" value={receiveDate} onChange={(e) => setReceiveDate(e.target.value)} className={inputClasses} min={new Date().toISOString().split('T')[0]} />
                        <p className="mt-1 text-xs text-gray-500">ปล่อยว่างหากยังไม่ทราบวันที่เข้ารับ</p>
                    </div>

                    {error && submitting && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm" role="alert">
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" className={buttonClassesSecondary} onClick={() => navigate('/admin/requests')} disabled={submitting} >
                            ยกเลิก
                        </button>
                        <button type="submit" className={buttonClassesPrimary} disabled={submitting || !status} >
                            {submitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormEditRequest;