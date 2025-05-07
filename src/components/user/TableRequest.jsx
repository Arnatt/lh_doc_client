import React, { useEffect, useState } from 'react';
import useRequestStore from '../../store/request-store';

const TableRequest = () => {
  const {
    token,
    allRequests,
    loadingRequests,
    fetchUserRequests,
    cancelRequest: cancelRequestAction, // เปลี่ยนชื่อเพื่อไม่ให้ซ้ำกับ state
  } = useRequestStore();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [requestIdToCancel, setRequestIdToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUserRequests(token, 10);
    }
  }, [token, fetchUserRequests]);

  const handleCancelClick = (reqId) => {
    setRequestIdToCancel(reqId);
    setShowCancelModal(true);
  };

  const confirmCancelRequest = async () => {
    setIsCancelling(true);
    setCancelError(null);
    try {
      if (token && requestIdToCancel) {
        console.log('กำลังเรียก cancelRequestAction ด้วย token:', token, 'และ requestId:', requestIdToCancel);
        await cancelRequestAction(token, requestIdToCancel);
        console.log('cancelRequestAction เสร็จสิ้น');
        setShowCancelModal(false);
        setRequestIdToCancel(null);
        console.log('กำลังเรียก fetchUserRequests');
        fetchUserRequests(token, 10);
        console.log('fetchUserRequests เสร็จสิ้น');
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      setCancelError('เกิดข้อผิดพลาดในการยกเลิกคำร้อง');
    } finally {
      setIsCancelling(false);
    }
  };


  const closeModal = () => {
    setShowCancelModal(false);
    setRequestIdToCancel(null);
    setCancelError(null);
  };

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
                <th className="px-2 sm:px-4 py-3 border-b-2 border-gray-200 text-center text-xs sm:text-sm font-semibold uppercase tracking-wider">จัดการ</th>
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
                          req.status === 'ยกเลิกคำร้อง' ? 'red-100 text-red-800' :
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
                  <td className="px-2 sm:px-4 py-4 border-b border-gray-200 text-center text-xs sm:text-sm">
                    {req.status !== 'ดำเนินการเรียบร้อย' && req.status !== 'ยกเลิกคำร้อง' && (
                      <button
                        onClick={() => handleCancelClick(req.req_id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        ยกเลิก
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    {/* Icon สำหรับยืนยันการลบ */}
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                      ยืนยันการยกเลิกคำร้อง
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำร้องนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้
                      </p>
                      {cancelError && (
                        <p className="text-red-500 text-sm mt-2">{cancelError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmCancelRequest}
                  disabled={isCancelling}
                >
                  {isCancelling ? 'กำลังยกเลิก...' : 'ยืนยัน'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                  disabled={isCancelling}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableRequest;