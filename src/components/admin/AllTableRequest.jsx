import React, { useState, useEffect } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import useRequestStore from '../../store/request-store';
import { Link } from 'react-router-dom';

const AllTableRequest = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const { token, allRequests, fetchAllRequests, loadingRequests, errorRequests } = useRequestStore();
    const [statusOptions, setStatusOptions] = useState([]);

    useEffect(() => {
        if (token) {
            fetchAllRequests();
        }
    }, [token, fetchAllRequests]);

    useEffect(() => {
        if (allRequests && Array.isArray(allRequests) && allRequests.length > 0) {
            const uniqueStatuses = [...new Set(allRequests.map(req => req.status))];
            setStatusOptions(['', ...uniqueStatuses]);
        } else {
            setStatusOptions(['']);
        }
    }, [allRequests]);

    const filteredRequests = Array.isArray(allRequests)
        ? allRequests.filter(request => {
            const searchMatch =
                String(request?.req_id).includes(searchTerm) ||
                String(request?.fname)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(request?.lname)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(request?.doc_type)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(request?.status).toLowerCase().includes(searchTerm.toLowerCase());

            const statusMatch = filterStatus ? request?.status === filterStatus : true;

            const requestDate = new Date(request?.request_date);
            const startDate = filterStartDate ? new Date(filterStartDate) : null;
            const endDate = filterEndDate ? new Date(filterEndDate) : null;
            const dateMatch =
                (!startDate || requestDate >= startDate) &&
                (!endDate || requestDate <= endDate);

            return searchMatch && statusMatch && dateMatch;
        })
        : [];

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setFilterStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setFilterEndDate(e.target.value);
    };

    const handleStatusChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setFilterStartDate('');
        setFilterEndDate('');
        setFilterStatus('');
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">จัดการคำร้องทั้งหมด</h2>

                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label htmlFor="search" className="block text-gray-700 text-sm font-bold mb-1">ค้นหา:</label>
                        <input
                            type="text"
                            id="search"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md w-full"
                            placeholder="คำที่ต้องการค้นหา..."
                            value={searchTerm}
                            onChange={handleSearchTermChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="start-date" className="block text-gray-700 text-sm font-bold mb-1">วันที่เริ่มต้น:</label>
                        <input
                            type="date"
                            id="start-date"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md w-full"
                            value={filterStartDate}
                            onChange={handleStartDateChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-gray-700 text-sm font-bold mb-1">วันที่สิ้นสุด:</label>
                        <input
                            type="date"
                            id="end-date"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md w-full"
                            value={filterEndDate}
                            onChange={handleEndDateChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="status-filter" className="block text-gray-700 text-sm font-bold mb-1">สถานะ:</label>
                        <select
                            id="status-filter"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md w-full"
                            value={filterStatus}
                            onChange={handleStatusChange}
                        >
                            <option value="">ทั้งหมด</option>
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>{status || 'ทั้งหมด'}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleResetFilters}
                    >
                        รีเซ็ตฟิลเตอร์
                    </button>
                </div>

                {loadingRequests && <p className="text-gray-500">กำลังโหลดข้อมูล...</p>}
                {errorRequests && <p className="text-red-500">{errorRequests}</p>}

                {!loadingRequests && !errorRequests && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden border-collapse">
                            <thead className="bg-gray-300 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">No.</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap">วันที่ร้องขอ</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap">ชื่อผู้ร้องขอ</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">เอกสารที่ร้องขอ</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider whitespace-nowrap">วันที่รับเอกสาร</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">สถานะ</th>
                                    <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold uppercase tracking-wider">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {filteredRequests.map((request, index) => (
                                    <tr key={request?.req_id}>
                                        <td className="px-4 py-4 border-b border-gray-200 text-sm">{index + 1}</td>
                                        <td className="px-4 py-4 border-b border-gray-200 text-sm whitespace-nowrap">{new Date(request?.request_date).toLocaleDateString()}</td>
                                        <td className="px-4 py-4 border-b border-gray-200 text-sm whitespace-nowrap">{request?.fname} {request?.lname}</td>
                                        <td className="px-4 py-4 border-b border-gray-200 text-sm">{request?.doc_type || '-'}</td>
                                        <td className="px-4 py-4 border-b border-gray-200 text-sm whitespace-nowrap">
                                            {request?.receive_date ? new Date(request?.receive_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-4 py-4 border-b border-gray-200 text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${request?.status === 'รอดำเนินการ' ? 'yellow-100 text-yellow-800' :
                                                request?.status === 'กำลังดำเนินการ' ? 'blue-100 text-blue-800' :
                                                    request?.status === 'ดำเนินการเรียบร้อย' ? 'green-100 text-green-800' :
                                                        'gray-100 text-gray-800'
                                                }`}>
                                                {request?.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 border-b border-gray-200 text-sm">
                                            <Link to={`/admin/request/${request?.req_id}`} className="text-blue-500 hover:text-blue-700">
                                                <PencilSquareIcon className="h-5 w-5" />
                                            </Link>
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
                )}
            </div>
        </div>
    );
};

export default AllTableRequest;