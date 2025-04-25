import React, { useState } from 'react';

const mockRequests = [
  { id: 1, submittedDate: '2025-04-20T10:00:00Z', documentType: 'ใบรับรองผลการเรียน', status: 'รอดำเนินการ' },
  { id: 2, submittedDate: '2025-04-21T14:30:00Z', documentType: 'ทรานสคริปต์', status: 'กำลังดำเนินการ' },
  { id: 3, submittedDate: '2025-04-23T09:15:00Z', documentType: 'หนังสือรับรองการเป็นนักศึกษา', status: 'สำเร็จ' },
  { id: 4, submittedDate: '2025-04-24T11:45:00Z', documentType: 'ใบรับรองผลการเรียน', status: 'รอดำเนินการ' },
  { id: 5, submittedDate: '2025-04-25T08:00:00Z', documentType: 'ใบรับรองการฝึกงาน', status: 'สำเร็จ' },
];

const TableRequest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredRequests = mockRequests.filter(request => {
    const searchMatch =
      String(request.id).includes(searchTerm) ||
      new Date(request.submittedDate).toLocaleDateString().includes(searchTerm) ||
      request.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus ? request.status === filterStatus : true;
    return searchMatch && statusMatch;
  });

  const statusOptions = [...new Set(mockRequests.map(req => req.status))];

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">สถานะคำร้องขอเอกสาร</h3>
            <div className="space-x-2">
              <input
                type="text"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
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
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">คำร้องที่</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">วันที่ร้องขอ</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">เอกสารที่ร้องขอ</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">สถานะ</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm"><p className="text-gray-900">{request.id}</p></td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm"><p className="text-gray-900">{new Date(request.submittedDate).toLocaleDateString()}</p></td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm"><p className="text-gray-900">{request.documentType}</p></td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm">
                      <span
                        className={
                          request.status === 'รอดำเนินการ'
                            ? 'px-2 py-1 rounded-full bg-yellow-100 text-yellow-800'
                            : request.status === 'กำลังดำเนินการ'
                            ? 'px-2 py-1 rounded-full bg-blue-100 text-blue-800'
                            : 'px-2 py-1 rounded-full bg-green-100 text-green-800'
                        }
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 text-sm"><p className="text-gray-900">-</p></td>
                  </tr>
                ))}
                {filteredRequests.length === 0 && (
                  <tr>
                    <td className="px-5 py-5 text-sm text-gray-500 text-center" colSpan={5}>ไม่พบคำร้องตามเงื่อนไข</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableRequest;