import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRequestById, updateRequest } from '../../api/admin';
import useRequestStore from '../../store/request-store';

const FormEditRequest = () => {
    const { id: requestId } = useParams();
    const navigate = useNavigate();
    const { token } = useRequestStore();

    const [requestInfo, setRequestInfo] = useState(null);
    const [documentDetails, setDocumentDetails] = useState([]);
    const [status, setStatus] = useState('');
    const [receiveDate, setReceiveDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequest = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getRequestById(token, requestId);
                console.log('Response from getRequestById:', response);

                if (response && response.data) {
                    setRequestInfo(response.data.data.requestInfo);
                    setDocumentDetails(response.data.data.documentDetails || []);
                    setStatus(response.data.data.status || '');
                    setReceiveDate(
                        response.data.data.receiveDate
                            ? new Date(response.data.data.receiveDate).toISOString().split('T')[0]
                            : ''
                    );
                } else {
                    setError('ไม่พบข้อมูลคำร้อง');
                }
            } catch (err) {
                setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลคำร้อง');
            } finally {
                setLoading(false);
            }
        };

        fetchRequest();
    }, [token, requestId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await updateRequest(token, requestId, {
                status,
                receive_date: receiveDate,
            });

            if (response?.data?.message === 'Request updated successfully') {
                navigate('/admin/requests');
            } else {
                setError(response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดต');
            }
        } catch (err) {
            setError(err.message || 'เกิดข้อผิดพลาดในการอัปเดตคำร้อง');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>กำลังโหลดข้อมูล...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!requestInfo) return <div>ไม่พบข้อมูลคำร้อง</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">จัดการคำร้อง #{requestInfo?.requester_fname}</h2>

            <div>
                <h3 className="font-semibold mb-2">ข้อมูลคำร้อง</h3>
                <p><strong>ชื่อผู้ร้องขอ:</strong> {requestInfo?.requester_fname} {requestInfo?.requester_lname}</p>
                <p><strong>วันที่ร้องขอ:</strong> {requestInfo?.request_date ? new Date(requestInfo.request_date).toLocaleDateString() : '-'}</p>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold mb-2">เอกสารที่ขอ</h3>
                {documentDetails && documentDetails.length > 0 ? (
                    <ul className="list-disc list-inside bg-gray-100 p-2 rounded">
                        {documentDetails.map((doc) => (
                            <li key={doc.doc_detail_id}>
                                <strong>เอกสาร:</strong> {doc.document_name || '-'}
                                {doc.related_patient_name && <span>, <strong>ผู้ป่วย:</strong> {doc.related_patient_name}</span>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="bg-gray-100 p-2 rounded">ไม่มีเอกสารที่เกี่ยวข้อง</p>
                )}
            </div>

            {documentDetails && documentDetails.length > 0 && (
                <div className="mt-4 bg-gray-100 p-2 rounded">
                    <h3 className="font-semibold mb-2">ช่วงวันที่เอกสาร</h3>
                    <ul className="list-inside">
                        {documentDetails.map((doc, index) => (
                            <li key={`date-${doc.doc_detail_id}`}>
                                {doc.from_date && (
                                    <span><strong>วันที่เริ่มต้น {index + 1}:</strong> {new Date(doc.from_date).toLocaleDateString()}</span>
                                )}
                                {doc.to_date && (
                                    <span className="ml-4"><strong>วันที่สิ้นสุด {index + 1}:</strong> {new Date(doc.to_date).toLocaleDateString()}</span>
                                )}
                                {!doc.from_date && !doc.to_date && (
                                    <span><strong>ช่วงวันที่ {index + 1}:</strong> -</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div>
                    <label htmlFor="status" className="block font-medium mb-1">สถานะคำร้อง</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">-- เลือกสถานะ --</option>
                        <option value="รอดำเนินการ">รอดำเนินการ</option>
                        <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                        <option value="ดำเนินการเรียบร้อย">ดำเนินการเรียบร้อย</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="receive_date" className="block font-medium mb-1">วันที่เข้ารับเอกสาร</label>
                    <input
                        type="date"
                        id="receive_date"
                        value={receiveDate}
                        onChange={(e) => setReceiveDate(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                        onClick={() => navigate('/admin/requests')}
                    >
                        ยกเลิก
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormEditRequest;