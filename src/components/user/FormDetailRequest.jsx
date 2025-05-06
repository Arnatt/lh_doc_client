import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useRequestStore from '../../store/request-store';

const documentOptions = [
    { label: 'ประวัติการรักษาพยาบาล', key: 'treatment_history' },
    { label: 'ใบรายงานผล X-Ray', key: 'xray_report' },
    { label: 'ใบรายงานผล MRI', key: 'mri_report' },
    { label: 'ใบรายงานผล CT Scan', key: 'ct_report' },
    { label: 'แผ่น CD X-Ray', key: 'cd_xray' },
    { label: 'แผ่น CD MRI', key: 'cd_mri' },
    { label: 'แผ่น CD CT Scan', key: 'cd_ct' },
    { label: 'ผลตรวจจากห้องปฏิบัติการ LAB', key: 'lab' },
    { label: 'แผ่นเนื้อชิ้นเนื้อ', key: 'tissue_slide' },
    { label: 'Block/Slide (ชิ้นเนื้อ)', key: 'block_slide' },
    { label: 'ใบสรุปค่าใช้จ่าย', key: 'summary_cost' },
];

const RequestDateSelector = ({ requestDateRange, onRequestDateChange }) => (
    <div className="p-4 border border-gray-200 rounded-md bg-gray-50 space-y-3">
        <p className="text-sm font-medium text-gray-700">ระบุช่วงวันที่สำหรับเอกสารที่เลือก:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="requestDateFrom" className="block text-xs font-medium text-gray-500 mb-1">จากวันที่</label>
                <input
                    id="requestDateFrom"
                    type="date"
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm"
                    value={requestDateRange.from}
                    onChange={(e) => onRequestDateChange('from', e.target.value)}
                    aria-label="วันที่เริ่มต้นสำหรับเอกสารที่เลือก"
                />
            </div>
            <div>
                <label htmlFor="requestDateTo" className="block text-xs font-medium text-gray-500 mb-1">ถึงวันที่</label>
                <input
                    id="requestDateTo"
                    type="date"
                    className="border border-gray-300 p-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm"
                    value={requestDateRange.to}
                    onChange={(e) => onRequestDateChange('to', e.target.value)}
                    aria-label="วันที่สิ้นสุดสำหรับเอกสารที่เลือก"
                />
            </div>
        </div>
    </div>
);

const FormDetailRequest = () => {
    const navigate = useNavigate();
    const setRequestInfo = useRequestStore(state => state.setRequestInfo);
    const { submitRequestAction, setLoading, setError, loading, error } = useRequestStore();

    const [requesterType, setRequesterType] = useState('');
    const [selectedDocs, setSelectedDocs] = useState({});
    const [requestDateRange, setRequestDateRange] = useState({ from: '', to: '' });
    const [purpose, setPurpose] = useState('');
    const [otherPurpose, setOtherPurpose] = useState('');
    const [relatedPatientInfo, setRelatedPatientInfo] = useState({ name: '', idCard: '', relation: '', phone: '' });
    const [companyInfo, setCompanyInfo] = useState({ name: '', patientName: '', patientIdCard: '' });

    const isAnyDocSelected = Object.values(selectedDocs).some(value => value);
    const isAllDocsSelected = Object.values(selectedDocs).every(value => value);

    const toggleDoc = (docKey) => {
        setSelectedDocs(prev => ({ ...prev, [docKey]: !prev[docKey] }));
    };

    const handleSelectAll = () => {
        const newSelection = {};
        const shouldSelectAll = !isAllDocsSelected;
        documentOptions.forEach(doc => {
            newSelection[doc.key] = shouldSelectAll;
        });
        setSelectedDocs(newSelection);
        if (!shouldSelectAll) {
            setRequestDateRange({ from: '', to: '' });
        }
    };

    const handleRequestDateChange = (field, value) => {
        setRequestDateRange(prev => ({ ...prev, [field]: value }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (requesterType === 'relative') {
            setRelatedPatientInfo(prev => ({ ...prev, [name]: value }));
        } else if (requesterType === 'company') {
            setCompanyInfo(prev => ({ ...prev, [name]: value }));
        } else if (name === 'otherPurpose') {
            setOtherPurpose(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedDocumentKeys = Object.keys(selectedDocs).filter(key => selectedDocs[key]);
        const selectedDocumentLabels = selectedDocumentKeys.map(key => {
            const doc = documentOptions.find(option => option.key === key);
            return doc ? doc.label : '';
        }).filter(label => label !== '');

        const selectedDocumentsString = selectedDocumentLabels.join(', ');

        const requestData = {
            requesterType,
            patientDetails: {
                name: requesterType === 'patient' ? '' : relatedPatientInfo.name,
                idCard: requesterType === 'patient' ? '' : relatedPatientInfo.idCard,
                phone: requesterType === 'patient' ? '' : relatedPatientInfo.phone
            },
            selectedDocuments: selectedDocumentsString, // เปลี่ยนเป็น String
            requestDateRange,
            purpose,
            otherPurpose: purpose === 'other' ? otherPurpose : '',
            companyName: companyInfo.name,
            relativeRelation: relatedPatientInfo.relation,
        };

        try {
            await submitRequestAction(requestData, navigate);
        } catch (error) {
            console.error("Error submitting request:", error);
            setError(error.message || "Failed to submit request");
        }
    };

    // --- Tailwind Class Definitions ---
    const inputClasses = "border border-gray-300 p-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm";
    const radioCheckboxBaseClasses = "h-4 w-4 border-gray-300 focus:ring-blue-500";
    const radioClasses = `${radioCheckboxBaseClasses} text-blue-600`;
    const checkboxClasses = `${radioCheckboxBaseClasses} text-blue-600 rounded`;
    const fieldsetClasses = "space-y-6 mb-4";
    const sectionLabelClasses = "block text-lg font-semibold text-gray-700 mb-4";
    const itemLabelClasses = "flex items-center space-x-3 cursor-pointer";
    const itemTextClasses = "text-sm text-gray-700";
    const conditionalBlockClasses = "mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 space-y-4";
    const documentListClasses = "space-y-2";
    const selectAllLabelClasses = "flex items-center space-x-2 font-semibold text-gray-700";

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">รายละเอียดเอกสารที่ต้องการ</h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">เกิดข้อผิดพลาด!</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <fieldset className={fieldsetClasses}>
                    <legend className={sectionLabelClasses}>ความสัมพันธ์กับผู้ป่วย</legend>
                    <div className="space-y-3">
                        {[{ value: 'patient', label: 'ผู้ป่วย' }, { value: 'relative', label: 'ญาติผู้ป่วย' }, { value: 'company', label: 'ตัวแทนบริษัท' }].map(type => (
                            <label key={type.value} className={itemLabelClasses}>
                                <input
                                    type="radio"
                                    name="requesterType"
                                    value={type.value}
                                    checked={requesterType === type.value}
                                    onChange={(e) => setRequesterType(e.target.value)}
                                    className={radioClasses}
                                    required
                                />
                                <span className={itemTextClasses}>{type.label}</span>
                            </label>
                        ))}
                    </div>
                    {requesterType === 'relative' && (
                        <div className={conditionalBlockClasses}>
                            <h3 className="text-sm font-medium text-gray-600 mb-2">ข้อมูลเพิ่มเติมสำหรับญาติ</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className={inputClasses} placeholder="เกี่ยวข้องเป็น..." aria-label="ความสัมพันธ์กับผู้ป่วย" name="relation" value={relatedPatientInfo.relation} onChange={handleInputChange} required />
                                <input className={inputClasses} placeholder="ชื่อ-สกุลผู้ป่วย (ตามบัตรประชาชน)..." aria-label="ชื่อผู้ป่วย" name="name" value={relatedPatientInfo.name} onChange={handleInputChange} required />
                                <input className={inputClasses} placeholder="เลขบัตรประชาชนผู้ป่วย..." aria-label="เลขบัตรประชาชนผู้ป่วย" name="idCard" value={relatedPatientInfo.idCard} onChange={handleInputChange} required />
                                <input className={inputClasses} placeholder="เบอร์โทรผู้ป่วย..." aria-label="เบอร์โทรผู้ป่วย" name="phone" value={relatedPatientInfo.phone} onChange={handleInputChange} required />
                            </div>
                        </div>
                    )}
                    {requesterType === 'company' && (
                        <div className={conditionalBlockClasses}>
                            <h3 className="text-sm font-medium text-gray-600 mb-2">ข้อมูลเพิ่มเติมสำหรับตัวแทนบริษัท</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input className={inputClasses} placeholder="ชื่อตัวแทนบริษัท..." aria-label="ชื่อตัวแทนบริษัท" name="name" value={companyInfo.name} onChange={handleInputChange} required />
                                <input className={inputClasses} placeholder="ชื่อผู้ป่วย (ตามบัตรประชาชน)..." aria-label="ชื่อผู้ป่วย" name="patientName" value={companyInfo.patientName} onChange={handleInputChange} required />
                                <input className={inputClasses} placeholder="เลขบัตรประชาชนผู้ป่วย..." aria-label="เลขบัตรประชาชนผู้ป่วย" name="patientIdCard" value={companyInfo.patientIdCard} onChange={handleInputChange} required />
                            </div>
                        </div>
                    )}
                </fieldset>

                <fieldset className={fieldsetClasses}>
                    <legend className={sectionLabelClasses}>เลือกเอกสารที่ต้องการ</legend>
                    <div className="border border-gray-200 rounded-md p-4">
                        <label className={selectAllLabelClasses}>
                            <input
                                type="checkbox"
                                checked={isAllDocsSelected}
                                onChange={handleSelectAll}
                                className={checkboxClasses}
                                aria-label="เลือกเอกสารทั้งหมด"
                            />
                            <span>เลือกเอกสารทั้งหมด</span>
                        </label>
                        <div className={documentListClasses}>
                            {documentOptions.map(doc => (
                                <label key={doc.key} className={itemLabelClasses}>
                                    <input
                                        type="checkbox"
                                        checked={selectedDocs[doc.key] || false}
                                        onChange={() => toggleDoc(doc.key)}
                                        className={checkboxClasses}
                                        aria-label={doc.label}
                                    />
                                    <span className={itemTextClasses}>{doc.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {isAnyDocSelected && (
                        <div className="mt-4">
                            <RequestDateSelector
                                requestDateRange={requestDateRange}
                                onRequestDateChange={handleRequestDateChange}
                            />
                        </div>
                    )}
                </fieldset>

                <fieldset className={fieldsetClasses}>
                    <legend className={sectionLabelClasses}>วัตถุประสงค์ในการขอเอกสาร</legend>
                    <div className="space-y-3">
                        {[
                            { value: 'treatment', label: 'ประกอบการรักษาพยาบาล' },
                            { value: 'insurance', label: 'ประกอบการยื่นประกันชีวิต / ค่าสินไหมทดแทน / พ.ร.บ.' },
                            { value: 'other', label: 'อื่นๆ' },
                        ].map(p => (
                            <label key={p.value} className={itemLabelClasses}>
                                <input
                                    type="radio"
                                    name="purpose"
                                    value={p.value}
                                    checked={purpose === p.value}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    className={radioClasses}
                                    required
                                />
                                <span className={itemTextClasses}>{p.label}</span>
                            </label>
                        ))}
                        {purpose === 'other' && (
                            <div className="pl-7 pt-2">
                                <label htmlFor="otherPurposeInput" className="block text-xs font-medium text-gray-500 mb-1">กรุณาระบุวัตถุประสงค์</label>
                                <input
                                    id="otherPurposeInput"
                                    type="text"
                                    className={inputClasses}
                                    placeholder="ระบุวัตถุประสงค์อื่นๆ..."
                                    value={otherPurpose}
                                    onChange={handleInputChange}
                                    aria-label="ระบุวัตถุประสงค์อื่นๆ"
                                    name="otherPurpose"
                                    required
                                />
                            </div>
                        )}
                    </div>
                </fieldset>

                <div className="mt-6 text-center">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold text-sm shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                        disabled={loading}
                    >
                        บันทึกคำร้องขอเอกสาร
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormDetailRequest;