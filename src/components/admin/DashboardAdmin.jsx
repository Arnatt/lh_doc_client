import React, { useState, useEffect } from 'react';
import useRequestStore from '../../store/request-store';

const DashboardAdmin = () => {
    const { token, allRequests, fetchAllRequests, loadingRequests, errorRequests } = useRequestStore();
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
    const [completedRequestsCount, setCompletedRequestsCount] = useState(0);
    const [todayRequestsCount, setTodayRequestsCount] = useState(0);
    const [thisMonthRequestsCount, setThisMonthRequestsCount] = useState(0);

    useEffect(() => {
        if (token) {
            fetchAllRequests();
        }
    }, [token, fetchAllRequests]);

    useEffect(() => {
        if (allRequests && Array.isArray(allRequests)) {
            setPendingRequestsCount(allRequests.filter(req => req.status === 'รอดำเนินการ').length);
            setCompletedRequestsCount(allRequests.filter(req => req.status === 'ดำเนินการเรียบร้อย').length);

            // Calculate today's requests
            const today = new Date().toDateString();
            const todayRequests = allRequests.filter(req => new Date(req.request_date).toDateString() === today);
            setTodayRequestsCount(todayRequests.length);

            // Calculate this month's requests
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const thisMonthRequests = allRequests.filter(req => {
                const requestDate = new Date(req.request_date);
                return requestDate.getMonth() === currentMonth && requestDate.getFullYear() === currentYear;
            });
            setThisMonthRequestsCount(thisMonthRequests.length);

        } else {
            setPendingRequestsCount(0);
            setCompletedRequestsCount(0);
            setTodayRequestsCount(0);
            setThisMonthRequestsCount(0);
        }
    }, [allRequests]);

    if (loadingRequests) {
        return <div className="min-h-screen bg-gray-100 p-6"><div className="max-w-7xl mx-auto flex items-center justify-center">กำลังโหลดข้อมูล...</div></div>;
    }

    if (errorRequests) {
        return <div className="min-h-screen bg-gray-100 p-6"><div className="max-w-7xl mx-auto text-red-500 flex items-center justify-center">{errorRequests}</div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-blue-700 mb-2">แผงควบคุมผู้ดูแลระบบ</h1>
                    <p className="text-gray-600">ภาพรวมคำร้อง ณ วันที่ {new Date().toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}</p>
                </header>

                {/* Daily and Monthly Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Daily Requests Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">คำร้องวันนี้</h2>
                            <p className="text-4xl font-bold text-indigo-600">{todayRequestsCount}</p>
                            <p className="text-sm text-gray-500 mt-1">คำร้องใหม่ที่เข้ามาวันนี้</p>
                        </div>
                        <div className="text-indigo-400">
                            {/* You can add an icon here, e.g., <svg className="w-8 h-8 fill-current" viewBox="0 0 20 20"><path ... /></svg> */}
                            <svg className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2 10a8 8 0 0 1 16 0v8H2v-8zM10 2C6.69 2 4 4.69 4 8h12c0-3.31-2.69-6-6-6z"/></svg>
                        </div>
                    </div>

                    {/* Monthly Requests Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">คำร้องเดือนนี้</h2>
                            <p className="text-4xl font-bold text-orange-600">{thisMonthRequestsCount}</p>
                            <p className="text-sm text-gray-500 mt-1">จำนวนคำร้องทั้งหมดในเดือน {new Date().toLocaleDateString('th-TH', { month: 'long' })}</p>
                        </div>
                        <div className="text-orange-400">
                            {/* You can add an icon here */}
                            <svg className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M4 10V7a3 3 0 0 1 6 0v3h6v7H4v-7zm2 0h2V7a1 1 0 0 0-2 0v3zm8 0h2V7a1 1 0 0 0-2 0v3z"/></svg>
                        </div>
                    </div>
                </div>

                {/* Overall Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Pending Requests Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">คำร้องรอดำเนินการ</h2>
                        <p className="text-4xl font-bold text-blue-600">{pendingRequestsCount}</p>
                        <p className="text-sm text-gray-500 mt-1">คำร้องที่รอการดำเนินการ</p>
                    </div>

                    {/* Total Requests Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">คำร้องทั้งหมด</h2>
                        <p className="text-4xl font-bold text-green-600">{allRequests ? allRequests.length : 0}</p>
                        <p className="text-sm text-gray-500 mt-1">จำนวนคำร้องทั้งหมดในระบบ</p>
                    </div>

                    {/* Completed Requests Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">คำร้องที่สำเร็จ</h2>
                        <p className="text-4xl font-bold text-purple-600">{completedRequestsCount}</p>
                        <p className="text-sm text-gray-500 mt-1">คำร้องที่ดำเนินการเรียบร้อยแล้ว</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;