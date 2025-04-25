import React, { useState } from 'react';

const FormDetailRequest = () => {
    const [requesterType, setRequesterType] = useState('');
    const [selectedDocs, setSelectedDocs] = useState({});
    const [dateRanges, setDateRanges] = useState({});
    const [allDateRange, setAllDateRange] = useState({ from: '', to: '' });
    const [purpose, setPurpose] = useState('');
    const [otherPurpose, setOtherPurpose] = useState('');

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
        { label: 'ประกอบการรักษา/ประกัน/อื่นๆ', key: 'other_purpose' },
    ];


    const selectableDocs = documentOptions;
    const isAllSelected = documentOptions.every(doc => selectedDocs[doc.key]);

    const toggleDoc = (docKey) => {
        setSelectedDocs(prev => {
            const newSelected = { ...prev, [docKey]: !prev[docKey] };

            // ถ้ากำลังยกเลิกเอกสารนี้ เราก็ลบ dateRange มันออกด้วย
            if (!newSelected[docKey]) {
                const updatedDateRanges = { ...dateRanges };
                delete updatedDateRanges[docKey];
                setDateRanges(updatedDateRanges);
            }

            return newSelected;
        });
    };

    const handleSelectAll = () => {
        const newSelection = {};
        if (!isAllSelected) {
            documentOptions.forEach(doc => {
                newSelection[doc.key] = true;
            });
        } else {
            // ถ้า uncheck 'เลือกทั้งหมด' ให้ล้าง date range รวมด้วย
            setAllDateRange({ from: '', to: ''});
            // พิจารณาว่าจะล้าง date range ของแต่ละรายการด้วยหรือไม่
            // setDateRanges({});
       }
        setSelectedDocs(newSelection);
    };

    const handleAllDateChange = (field, value) => {
        setAllDateRange(prev => ({ ...prev, [field]: value }));
    };

    const handleDateChange = (docKey, field, value) => {
        setDateRanges(prev => ({
            ...prev,
            [docKey]: { ...prev[docKey], [field]: value },
        }));
    };

    // --- Tailwind Class Definitions ---
    const inputClasses = "border border-gray-300 p-2 rounded-md w-full focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm";
    const dateInputClasses = `${inputClasses}`;
    const radioCheckboxBaseClasses = "h-4 w-4 border-gray-300 focus:ring-blue-500";
    const radioClasses = `${radioCheckboxBaseClasses} text-blue-600`; // Use form-radio with plugin
    const checkboxClasses = `${radioCheckboxBaseClasses} text-blue-600 rounded`; // Use form-checkbox with plugin
    const fieldsetClasses = "space-y-4"; // Group sections
    const sectionLabelClasses = "block text-base font-semibold text-gray-700 mb-3"; // Adjusted size and margin
    const itemLabelClasses = "flex items-center space-x-3 cursor-pointer";
    const itemTextClasses = "text-sm text-gray-700";
    const conditionalBlockClasses = "mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 space-y-4";
    const datePickerContainerClasses = "pl-7 mt-3 space-y-2"; // Indentation for date pickers
    const datePickerGridClasses = "grid grid-cols-1 sm:grid-cols-2 gap-4";
    const datePickerLabelClasses = "block text-xs font-medium text-gray-500 mb-1";

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-lg shadow-lg space-y-8">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4">รายละเอียดเอกสารที่ต้องการ</h2>

            {/* Section: ประเภทผู้ยื่นคำขอ */}
            <fieldset className={fieldsetClasses}>
                <legend className={sectionLabelClasses}>ความสัมพันธ์กับผู้ป่วย</legend>
                <div className="space-y-3">
                    {[
                        { value: 'patient', label: 'ผู้ป่วย' },
                        { value: 'relative', label: 'ญาติผู้ป่วย' },
                        { value: 'company', label: 'ตัวแทนบริษัท' },
                    ].map(type => (
                        <label key={type.value} className={itemLabelClasses}>
                            <input
                                type="radio"
                                name="requesterType"
                                value={type.value}
                                checked={requesterType === type.value}
                                onChange={(e) => setRequesterType(e.target.value)}
                                className={radioClasses}
                            />
                            <span className={itemTextClasses}>{type.label}</span>
                        </label>
                    ))}
                </div>

                {/* Conditional Fields for Requester Type */}
                {requesterType === 'relative' && (
                    <div className={conditionalBlockClasses}>
                         <h3 className="text-sm font-medium text-gray-600">ข้อมูลเพิ่มเติมสำหรับญาติ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className={inputClasses} placeholder="เกี่ยวข้องเป็น..." aria-label="ความสัมพันธ์กับผู้ป่วย" />
                            <input className={inputClasses} placeholder="เลขประชาชนผู้ยื่นคำขอ..." aria-label="เลขประชาชนผู้ยื่นคำขอ" />
                            <input className={inputClasses} placeholder="ชื่อผู้ป่วย (ตามบัตรประชาชน)..." aria-label="ชื่อผู้ป่วย" />
                            <input className={inputClasses} placeholder="เลขบัตรประชาชนผู้ป่วย..." aria-label="เลขบัตรประชาชนผู้ป่วย" />
                        </div>
                    </div>
                )}
                {requesterType === 'company' && (
                    <div className={conditionalBlockClasses}>
                         <h3 className="text-sm font-medium text-gray-600">ข้อมูลเพิ่มเติมสำหรับตัวแทนบริษัท</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className={inputClasses} placeholder="ชื่อตัวแทนบริษัท..." aria-label="ชื่อตัวแทนบริษัท" />
                            <input className={inputClasses} placeholder="เลขที่หนังสือมอบอำนาจ (ถ้ามี)..." aria-label="เลขที่หนังสือมอบอำนาจ"/>
                            <input className={inputClasses} placeholder="ชื่อผู้ป่วย (ตามบัตรประชาชน)..." aria-label="ชื่อผู้ป่วย" />
                            <input className={inputClasses} placeholder="เลขบัตรประชาชนผู้ป่วย..." aria-label="เลขบัตรประชาชนผู้ป่วย" />
                        </div>
                    </div>
                )}
            </fieldset>

            {/* Section: เอกสาร */}
            <fieldset className={fieldsetClasses}>
                <legend className={sectionLabelClasses}>เลือกเอกสารที่ต้องการ</legend>

                {/* Select All Option */}
                <div className="p-4 border border-gray-200 rounded-md bg-gray-50 space-y-3">
                    <label className={`${itemLabelClasses} font-medium`}>
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            className={checkboxClasses}
                            aria-label="เลือกเอกสารทั้งหมด"
                        />
                        <span className={itemTextClasses}>เลือกเอกสารทั้งหมด</span>
                    </label>

                    {isAllSelected && (
                        <div className={datePickerContainerClasses}>
                             <p className="text-xs text-gray-600">ระบุช่วงวันที่สำหรับเอกสารทั้งหมด:</p>
                            <div className={datePickerGridClasses}>
                                <div>
                                    <label htmlFor="allDateFrom" className={datePickerLabelClasses}>จากวันที่</label>
                                    <input
                                        id="allDateFrom"
                                        type="date"
                                        className={dateInputClasses}
                                        value={allDateRange.from}
                                        onChange={(e) => handleAllDateChange('from', e.target.value)}
                                        aria-label="วันที่เริ่มต้นสำหรับเอกสารทั้งหมด"
                                    />
                                </div>
                               <div>
                                    <label htmlFor="allDateTo" className={datePickerLabelClasses}>ถึงวันที่</label>
                                    <input
                                        id="allDateTo"
                                        type="date"
                                        className={dateInputClasses}
                                        value={allDateRange.to}
                                        onChange={(e) => handleAllDateChange('to', e.target.value)}
                                        aria-label="วันที่สิ้นสุดสำหรับเอกสารทั้งหมด"
                                    />
                               </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Document List */}
                <div className="space-y-4 pt-4">
                    {selectableDocs.map(doc => (
                        <div key={doc.key} className="border-b border-gray-100 pb-4 last:border-b-0">
                            <label className={itemLabelClasses}>
                                <input
                                    type="checkbox"
                                    checked={selectedDocs[doc.key] || false}
                                    onChange={() => toggleDoc(doc.key)}
                                    className={checkboxClasses}
                                    disabled={isAllSelected} // Disable when 'Select All' is active
                                    aria-label={doc.label}
                                />
                                {/* Apply lighter text color if disabled via 'Select All' */}
                                <span className={`${itemTextClasses} ${isAllSelected ? 'text-gray-400' : ''}`}>{doc.label}</span>
                            </label>

                            {/* Individual Date Range (Show only if selected AND 'Select All' is OFF) */}
                            {selectedDocs[doc.key] && !isAllSelected && (
                                <div className={datePickerContainerClasses}>
                                    <p className="text-xs text-gray-600">ระบุช่วงวันที่สำหรับ: {doc.label}</p>
                                    <div className={datePickerGridClasses}>
                                      <div>
                                        <label htmlFor={`${doc.key}-from`} className={datePickerLabelClasses}>จากวันที่</label>
                                        <input
                                            id={`${doc.key}-from`}
                                            type="date"
                                            className={dateInputClasses}
                                            value={dateRanges[doc.key]?.from || ''}
                                            onChange={(e) => handleDateChange(doc.key, 'from', e.target.value)}
                                            aria-label={`วันที่เริ่มต้นสำหรับ ${doc.label}`}
                                        />
                                      </div>
                                      <div>
                                          <label htmlFor={`${doc.key}-to`} className={datePickerLabelClasses}>ถึงวันที่</label>
                                          <input
                                            id={`${doc.key}-to`}
                                            type="date"
                                            className={dateInputClasses}
                                            value={dateRanges[doc.key]?.to || ''}
                                            onChange={(e) => handleDateChange(doc.key, 'to', e.target.value)}
                                            aria-label={`วันที่สิ้นสุดสำหรับ ${doc.label}`}
                                        />
                                      </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </fieldset>

            {/* Section: วัตถุประสงค์ในการขอเอกสาร */}
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
                            />
                            <span className={itemTextClasses}>{p.label}</span>
                        </label>
                    ))}

                    {purpose === 'other' && (
                        <div className="pl-7 pt-2">
                             <label htmlFor="otherPurposeInput" className={datePickerLabelClasses}>กรุณาระบุวัตถุประสงค์</label>
                            <input
                                id="otherPurposeInput"
                                type="text"
                                className={inputClasses} // Use consistent input style
                                placeholder="ระบุวัตถุประสงค์อื่นๆ..."
                                value={otherPurpose}
                                onChange={(e) => setOtherPurpose(e.target.value)}
                                aria-label="ระบุวัตถุประสงค์อื่นๆ"
                            />
                        </div>
                    )}
                </div>
            </fieldset>

            {/* Submit Button */}
            <div className="pt-6 text-center">
                <button
                    type="submit" // ควรระบุ type="submit" ถ้าเป็นปุ่มส่งฟอร์ม
                    className="bg-blue-600 text-white px-8 py-2.5 rounded-md font-semibold text-sm shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                    ถัดไป
                </button>
            </div>
        </div>
    );
};

export default FormDetailRequest;
