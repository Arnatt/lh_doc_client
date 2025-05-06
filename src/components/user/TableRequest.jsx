import React, { useEffect } from 'react';
import useRequestStore from '../../store/request-store';

const TableRequest = () => {
  const {
    token,
    allRequests,
    loadingRequests,
    fetchUserRequests,
  } = useRequestStore();

  useEffect(() => {
    if (token) {
      fetchUserRequests(token, 10);
    }
  }, [token, fetchUserRequests]);

  if (!token) {
    return <div className="text-center text-lg mt-10 text-red-500">กรุณาเข้าสู่ระบบเพื่อดูคำร้อง</div>;
  }

  if (loadingRequests) {
    return <div className="text-center text-lg mt-10">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">รายการคำร้อง</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden border-collapse">
            <thead className="bg-gray-300 text-gray-700">
              <tr>
                <th className="px-2 sm:px-4 py-3 border-b-2 border-gray-200 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">วันที่ขอ</th>
                <th className="px-2 sm:px-4 py-3 border-b-2 border-gray-200 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">เอกสารที่ร้องขอ</th>
                <th className="px-2 sm:px-4 py-3 border-b-2 border-gray-200 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">ชื่อผู้ป่วย</th>
                <th className="px-2 sm:px-4 py-3 border-b-2 border-gray-200 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">สถานะ</th>
                <th className="px-2 sm:px-4 py-3 border-b-2 border-gray-200 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">วันที่รับเอกสาร</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {allRequests.map((req) => (
                <tr key={req.req_id}>
                  <td className="px-2 sm:px-4 py-4 border-b border-gray-200 text-xs sm:text-sm">
                    {new Intl.DateTimeFormat('en-GB').format(new Date(req.request_date))}
                  </td>
                  <td className="px-2 sm:px-4 py-4 border-b border-gray-200 text-xs sm:text-sm">{req.requested_documents}</td>
                  <td className="px-2 sm:px-4 py-4 border-b border-gray-200 text-xs sm:text-sm">{req.related_patients}</td>
                  <td className="px-2 sm:px-4 py-4 border-b border-gray-200 text-xs sm:text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${req.status === 'รอดำเนินการ' ? 'yellow-100 text-yellow-800' :
                      req.status === 'กำลังดำเนินการ' ? 'blue-100 text-blue-800' :
                        req.status === 'ดำเนินการเรียบร้อย' ? 'green-100 text-green-800' :
                          'gray-100 text-gray-800'
                      }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-4 border-b border-gray-200 text-xs sm:text-sm">
                    {req.receive_date
                      ? new Intl.DateTimeFormat('en-GB').format(new Date(req.receive_date))
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableRequest;