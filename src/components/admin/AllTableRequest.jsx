import React, { useState, useEffect } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline'; // Icon สำหรับ Edit

// สมมติว่ามี Array ของคำร้องทั้งหมด
const mockAllRequests = [
  { id: 1, userId: 101, submittedDate: '2025-04-20T10:00:00Z', documentType: 'ใบรับรองผลการเรียน', status: 'รอดำเนินการ' },
  { id: 2, userId: 102, submittedDate: '2025-04-21T14:30:00Z', documentType: 'ทรานสคริปต์', status: 'กำลังดำเนินการ' },
  { id: 3, userId: 101, submittedDate: '2025-04-23T09:15:00Z', documentType: 'หนังสือรับรองการเป็นนักศึกษา', status: 'สำเร็จ' },
  { id: 4, userId: 103, submittedDate: '2025-04-24T11:45:00Z', documentType: 'ใบรับรองผลการเรียน', status: 'รอดำเนินการ' },
  { id: 5, userId: 102, submittedDate: '2025-04-25T08:00:00Z', documentType: 'ใบรับรองการฝึกงาน', status: 'สำเร็จ' },
];

const AllTableRequest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [allRequests, setAllRequests] = useState(mockAllRequests); // ในของจริงควร Fetch จาก API
  const [statusOptions, setStatusOptions] = useState([]); // สำหรับ Dropdown Filter สถานะ

  useEffect(() => {
    // ในของจริง: Fetch สถานะที่เป็นไปได้จาก API
    const uniqueStatuses = [...new Set(mockAllRequests.map(req => req.status))];
    setStatusOptions(uniqueStatuses);
  }, []);

  const filteredRequests = allRequests.filter(request => {
    const searchMatch =
      String(request.id).includes(searchTerm) ||
      String(request.userId).includes(searchTerm) ||
      new Date(request.submittedDate).toLocaleDateString().includes(searchTerm) ||
      request.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus ? request.status === filterStatus : true;
    return searchMatch && statusMatch;
  });

  const handleStatusChange = (requestId, newStatus) => {
    // ในของจริง: ส่ง API Request เพื่ออัปเดตสถานะ
    const updatedRequests = allRequests.map(req =>
      req.id === requestId ? { ...req, status: newStatus } : req
    );
    setAllRequests(updatedRequests);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">จัดการคำร้องทั้งหมด</h2>

        <div className="mb-4 flex items-center space-x-4">
          <input
            type="text"
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md w-1/3"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">User ID</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">วันที่ร้องขอ</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">เอกสาร</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">สถานะ</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm">{request.id}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm">{request.userId}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm">{new Date(request.submittedDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm">{request.documentType}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm">
                    <select
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                    >
                      <option value="">-- เลือกสถานะ --</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm">
                    <button className="text-blue-500 hover:text-blue-700">
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    {/* อาจมีปุ่มลบหรือดูรายละเอียดเพิ่มเติม */}
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-sm text-gray-500 text-center" colSpan={6}>ไม่พบคำร้องตามเงื่อนไข</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllTableRequest;