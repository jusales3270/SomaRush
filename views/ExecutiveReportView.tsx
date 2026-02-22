import React from 'react';
import { ExecutiveReport } from '../types';
import { ICONS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface Props {
    report: ExecutiveReport;
}

const ExecutiveReportView: React.FC<Props> = ({ report }) => {
    const getTier = (score: number) => {
        if (score >= 85) return "Industry Leader";
        if (score >= 70) return "Strong Contender";
        if (score >= 50) return "Emerging Player";
        return "Low Authority";
    };

    const chartData = report.history.map(h => ({
        name: new Date(h.calculatedAt).toLocaleDateString(),
        score: h.score
    })).slice(-10);

    return (
        <div id="executive-report-export" className="bg-[#050505] text-white p-12 font-sans w-[800px] mx-auto hidden-in-ui relative">
            {/* PAGE 1: Executive Summary */}
            <div className="report-page min-h-[1050px] flex flex-col mb-10">
                <div className="border-b-2 border-purple-500 pb-6 mb-10">
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 uppercase tracking-widest">
                        LLM Authority Report
                    </h1>
                    <div className="flex justify-between items-end mt-4">
                        <div>
                            <p className="text-gray-400 uppercase text-sm">Brand Analyzed</p>
                            <h2 className="text-3xl font-bold text-white mt-1">{report.brand}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 uppercase text-xs">Generated At</p>
                            <p className="font-mono text-cyan-400">{new Date(report.generatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-10">
                    <div className="bg-black/50 border border-purple-500/20 p-8 rounded-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl"></div>
                        <h3 className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-4">Model Authority Index (MAI)</h3>
                        <div className="text-7xl font-black text-white glow-text-purple">{report.mai.score}</div>
                        <div className="mt-4 inline-block bg-purple-900/40 text-purple-300 px-4 py-1 rounded-full text-sm outline outline-1 outline-purple-500/50 uppercase font-black tracking-wide">
                            {getTier(report.mai.score)}
                        </div>
                    </div>

                    <div className="bg-black/50 border border-cyan-500/20 p-8 rounded-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl"></div>
                        <h3 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-4">Share of Model (SOM)</h3>
                        <div className="text-7xl font-black text-white glow-text-cyan">{report.som.share}%</div>
                        <div className="mt-4 text-gray-400 text-sm">
                            Market presence across synthetic batch probing.
                        </div>
                    </div>
                </div>

                <h3 className="text-xl font-bold border-b border-gray-800 pb-2 mb-6 text-purple-400">MAI Breakdown</h3>
                <div className="grid grid-cols-5 gap-4 mb-auto">
                    {Object.entries(report.mai.breakdown).map(([key, val]) => (
                        <div key={key} className="bg-gray-900/50 p-4 border border-gray-800 rounded text-center">
                            <div className="text-xs text-gray-400 uppercase mb-2 truncate">{key}</div>
                            <div className="text-2xl font-black text-white">{val}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PAGE 2: Action Plan & Benchmark */}
            <div className="report-page min-h-[1050px] flex flex-col">
                <h3 className="text-2xl font-bold border-b border-gray-800 pb-2 mb-6 text-cyan-400">Strategic Action Plan</h3>

                <div className="space-y-6 mb-10">
                    <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="text-red-400 font-bold uppercase mb-2 text-sm tracking-wider">High Priority</h4>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                            {report.actionPlan.high.length > 0 ? report.actionPlan.high.map((item, i) => <li key={i}>{item}</li>) : <li>No critical issues detected.</li>}
                        </ul>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4">
                        <h4 className="text-yellow-400 font-bold uppercase mb-2 text-sm tracking-wider">Medium Priority</h4>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                            {report.actionPlan.medium.length > 0 ? report.actionPlan.medium.map((item, i) => <li key={i}>{item}</li>) : <li>No medium issues.</li>}
                        </ul>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="text-green-400 font-bold uppercase mb-2 text-sm tracking-wider">Low Priority / Maintain</h4>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                            {report.actionPlan.low.length > 0 ? report.actionPlan.low.map((item, i) => <li key={i}>{item}</li>) : <li>-</li>}
                        </ul>
                    </div>
                </div>

                {report.history.length > 0 && (
                    <div className="mb-10">
                        <h3 className="text-xl font-bold border-b border-gray-800 pb-2 mb-6 text-purple-400">Historical Authority Evolution</h3>
                        <div className="h-64 bg-gray-900/30 p-4 rounded border border-gray-800">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                    <XAxis dataKey="name" stroke="#666" fontSize={10} />
                                    <YAxis stroke="#666" fontSize={10} />
                                    <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

            </div>

            {/* Ensure absolute hidden styles if rendered in DOM but not meant to be seen */}
            <style>{`
        .hidden-in-ui {
          position: fixed;
          top: -9999px;
          left: -9999px;
          z-index: -1000;
        }
        .report-page {
          page-break-after: always;
        }
      `}</style>
        </div>
    );
};

export default ExecutiveReportView;
