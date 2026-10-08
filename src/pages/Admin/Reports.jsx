"use client"

import { BarChart3, TrendingUp, Users, DollarSign, Download, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { getAdminReportsData } from "../../services/api"

const Reports = () => {
    const [reportData, setReportData] = useState({
        totalRevenue: 0,
        newRegistrations: 0,
        profits: 0,
        revenueData: [],
        topInstructors: [],
        revenueIncrement: 0,
        registrationsIncrement: 0,
        profitsIncrement: 0,
        monthlyRevenue: 0,
        monthlyRegistrations: 0,
        monthlyProfits: 0
    })

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getAdminReportsData()
                setReportData(data)
            } catch (error) {
                console.error("Failed to fetch reports data:", error)
            }
        }
        fetchReports()
    }, [])

    const { 
        totalRevenue, 
        newRegistrations, 
        profits, 
        revenueData, 
        topInstructors,
        revenueIncrement,
        registrationsIncrement,
        profitsIncrement,
        monthlyRevenue,
        monthlyRegistrations,
        monthlyProfits
    } = reportData
    const maxRevenueAmount = Math.max(...revenueData.map(d => d.amount), 1)

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
                        <p className="text-text-secondary">Track platform performance and statistics</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary transition-transform group-hover:scale-110">
                                <DollarSign size={28} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`font-semibold text-xs px-2.5 py-1 rounded-full ${Number(revenueIncrement) >= 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
                                    {Number(revenueIncrement) >= 0 ? "+" : ""}{revenueIncrement}%
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium mt-1">vs last month</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm font-semibold mb-1">Monthly Revenue</p>
                        <h3 className="text-3xl font-bold text-gray-900">${(monthlyRevenue || 0).toLocaleString()}</h3>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 bg-purple-50 rounded-2xl text-purple-600 transition-transform group-hover:scale-110">
                                <Users size={28} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`font-semibold text-xs px-2.5 py-1 rounded-full ${Number(registrationsIncrement) >= 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
                                    {Number(registrationsIncrement) >= 0 ? "+" : ""}{registrationsIncrement}%
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium mt-1">vs last month</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm font-semibold mb-1">Monthly Registrations</p>
                        <h3 className="text-3xl font-bold text-gray-900">{(monthlyRegistrations || 0).toLocaleString()}</h3>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-4 bg-green-50 rounded-2xl text-green-600 transition-transform group-hover:scale-110">
                                <TrendingUp size={28} />
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`font-semibold text-xs px-2.5 py-1 rounded-full ${Number(profitsIncrement) >= 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
                                    {Number(profitsIncrement) >= 0 ? "+" : ""}{profitsIncrement}%
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium mt-1">vs last month</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm font-semibold mb-1">Monthly Profits</p>
                        <h3 className="text-3xl font-bold text-gray-900">${Math.round(monthlyProfits || 0).toLocaleString()}</h3>
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-10">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Revenue Statistics</h2>
                            <p className="text-sm text-gray-400 font-medium">Monitoring platform-wide financial performance</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
                            <Calendar size={14} />
                            <span>Active Forecast (6M)</span>
                        </div>
                    </div>

                    {revenueData && revenueData.length > 0 ? (
                        <div className="h-80 flex items-end justify-between px-4 pb-4 border-b border-gray-100 gap-4">
                            {revenueData.map((item, index) => {
                                const maxValue = Math.max(...revenueData.map(d => d.amount), 1);
                                const percentage = (item.amount / maxValue) * 100;
                                
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                        <div className="absolute top-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-4 group-hover:-translate-y-8 z-10 pointer-events-none">
                                            <div className="bg-gray-900 text-white text-[10px] font-bold py-2 px-3 rounded-lg shadow-xl">
                                                ${item.amount.toLocaleString()}
                                            </div>
                                            <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1 shadow-lg"></div>
                                        </div>
                                        
                                        <div 
                                            className="w-full max-w-[60px] bg-[#3399ff]/50 rounded-2xl transition-all duration-500 relative cursor-pointer hover:shadow-2xl hover:shadow-[#3399ff]/20 group-hover:scale-x-105 border border-[#3399ff]/30 shadow-sm"
                                            style={{ height: `${Math.max(percentage, 4)}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                                        </div>
                                        
                                        <span className="text-[10px] font-bold text-gray-400 mt-4">{item.month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <BarChart3 className="text-gray-300 mb-4" size={48} />
                            <p className="text-gray-500 font-bold">No revenue data captured yet.</p>
                        </div>
                    )}
                </div>

                {/* Top Instructors Table */}
                <div className="bg-white rounded-lg card-shadow overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-foreground">Top Performing Instructors</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Instructor</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Courses</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Students</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Revenue</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topInstructors.map((instructor, idx) => (
                                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-foreground">{instructor.name}</td>
                                        <td className="px-6 py-4 text-text-secondary">{instructor.courses}</td>
                                        <td className="px-6 py-4 text-text-secondary">{instructor.students.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-success font-semibold">${instructor.revenue.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${instructor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {instructor.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reports
