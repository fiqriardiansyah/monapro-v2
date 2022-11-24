/* eslint-disable react/no-array-index-key */
import { Divider, Progress, Tooltip } from "antd";
import Header from "components/common/header";
import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";

import BlueWaveImage from "assets/svgs/blue-wave.svg";
import GreenWaveImage from "assets/svgs/green-wave.svg";
import OrangeWaveImage from "assets/svgs/orange-wave.svg";
import { Link } from "react-router-dom";
import { dataRevenueDefault, mainBudget } from "modules/dashboard/data";
import RemainingBudget from "modules/dashboard/component/remaining-budget";
import ProgressCustome from "modules/dashboard/component/progress-custome";
import { DASHBOARD_PATH } from "utils/routes";

const DashboardPage = () => {
    if (typeof window !== "undefined") {
        Chart.register(...registerables);
    }

    const [dataRevenue, setDataRevenue] = useState(dataRevenueDefault);

    const getTopBus = [
        {
            subUnit: "unit 1",
            budget: 20,
            color: "rgb(197, 57, 180)",
        },
        {
            subUnit: "unit 2",
            budget: 95,
            color: "rgb(239, 154, 83)",
        },
        {
            subUnit: "unit 3",
            budget: 40,
            color: "rgb(70, 73, 255)",
        },
    ];

    return (
        <div className="min-h-screen px-10">
            <Header title="Dashboard" />
            <div className="grid grid-cols-3 grid-rows-3 gap-4">
                {mainBudget.map((budget) => (
                    <RemainingBudget data={budget} key={budget.title} />
                ))}
                <div className="p-3 bg-white rounded-md flex flex-col justify-center relative">
                    <p className="m-0 font-medium text-gray-400 absolute top-4 left-4">Total Aktivitas</p>
                    <div className="w-full flex justify-between items-center">
                        <p className="m-0 font-medium">Sponsorship</p>
                        <p className="m-0 font-bold text-gray-500 text-xl">Rp. 200.000.000</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <p className="m-0 font-medium">Procurement</p>
                        <p className="m-0 font-bold text-gray-500 text-xl">Rp. 350.000.000</p>
                    </div>
                </div>
                <div className="p-3 bg-white rounded-md col-span-2 row-span-2">
                    <Line data={dataRevenue} />
                </div>
                <div className="p-3 bg-white rounded-md row-span-2">
                    <p className="m-0 font-medium text-gray-400 mb-2">Sisa Anggaran Tiap Sub Unit</p>
                    {getTopBus?.map((el, i) => (
                        <Tooltip placement="left" title={`Sisa Anggaran: ${`${el.budget}00000`}`} key={i}>
                            <div className="flex flex-col w-full mb-3">
                                <p className="m-0 text-gray-400 capitalize font-medium">{el.subUnit}</p>
                                <Progress percent={el.budget} showInfo={false} status="active" strokeColor={{ from: el.color, to: el.color }} />
                            </div>
                        </Tooltip>
                    ))}
                </div>
            </div>
            <div className="flex items-center w-full justify-between">
                <h1 className="capitalize text-xl font-bold text-gray-600 m-0 my-4">sub unit program & partnership</h1>
                <Link to={`${DASHBOARD_PATH}/sub-unit-program-partnership`}>Lihat detail</Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded-md flex flex-col items-center">
                            <p className="m-0 font-medium text-gray-400">PEMAKAIAN</p>
                            <p className="m-0 text-blue-400 font-bold text-xl my-3">Rp. 200.000.000</p>
                            <img src={BlueWaveImage} alt="" className="w-full" />
                        </div>
                        <div className="bg-white p-3 rounded-md flex flex-col items-center">
                            <p className="m-0 font-medium text-gray-400">SUDAH DIBAYAR</p>
                            <p className="m-0 text-orange-400 font-bold text-xl my-3">Rp. 400.000.000</p>
                            <img src={OrangeWaveImage} alt="" className="w-full" />
                        </div>
                        <div className="bg-white p-3 rounded-md flex flex-col items-center">
                            <p className="m-0 font-medium text-gray-400">BELUM DIBAYAR</p>
                            <p className="m-0 text-green-400 font-bold text-xl my-3">Rp. 240.000.000</p>
                            <img src={GreenWaveImage} alt="" className="w-full" />
                        </div>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white p-3 rounded-md">
                        <p className="m-0 font-medium text-gray-400">Recently News</p>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, voluptatum tempora id inventore veniam accusantium
                            commodi explicabo officiis. Voluptas nam illo enim laborum quas pariatur esse sint architecto labore odio!
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-center w-full justify-between">
                <h1 className="capitalize text-xl font-bold text-gray-600 m-0 my-4">sub unit corporate communication</h1>
                <Link to={`${DASHBOARD_PATH}/sub-unit-corporate-communication`}>Lihat detail</Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded-md flex flex-col items-center">
                            <p className="m-0 font-medium text-gray-400">PEMAKAIAN</p>
                            <p className="m-0 text-blue-400 font-bold text-xl my-3">Rp. 200.000.000</p>
                            <img src={BlueWaveImage} alt="" className="w-full" />
                        </div>
                        <div className="bg-white p-3 rounded-md flex flex-col items-center">
                            <p className="m-0 font-medium text-gray-400">SUDAH DIBAYAR</p>
                            <p className="m-0 text-orange-400 font-bold text-xl my-3">Rp. 400.000.000</p>
                            <img src={OrangeWaveImage} alt="" className="w-full" />
                        </div>
                        <div className="bg-white p-3 rounded-md flex flex-col items-center">
                            <p className="m-0 font-medium text-gray-400">BELUM DIBAYAR</p>
                            <p className="m-0 text-green-400 font-bold text-xl my-3">Rp. 240.000.000</p>
                            <img src={GreenWaveImage} alt="" className="w-full" />
                        </div>
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white p-3 rounded-md">
                        <p className="m-0 font-medium text-gray-400">Recently News</p>
                        <p className="mt-2">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, voluptatum tempora id inventore veniam accusantium
                            commodi explicabo officiis. Voluptas nam illo enim laborum quas pariatur esse sint architecto labore odio!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
