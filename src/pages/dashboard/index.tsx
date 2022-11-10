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

const dataRevenueDefault = {
    labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Des"],
    datasets: [
        {
            label: "Statistik",
            data: [100000, 120000, 154500, 193000, 123000, 144000, 210000, 160400, 189000, 164000, 200000, 180000],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
        },
    ],
    options: {
        responsive: true,
    },
};

const DashboardPage = () => {
    if (typeof window !== "undefined") {
        Chart.register(...registerables);
    }

    const [dataRevenue, setDataRevenue] = useState(dataRevenueDefault);

    const getTopBus = [
        {
            subUnit: "unit 1",
            budget: 20,
        },
        {
            subUnit: "unit 2",
            budget: 95,
        },
        {
            subUnit: "unit 3",
            budget: 40,
        },
        {
            subUnit: "unit 4",
            budget: 95,
        },
    ];

    return (
        <div className="min-h-screen px-10">
            <Header title="Dashboard" />
            <div className="grid grid-cols-3 grid-rows-3 gap-4">
                <div className="p-3 bg-white rounded-md flex flex-col">
                    <p className="m-0 font-medium text-gray-400">Total Pemakaian</p>
                    <div className="flex items-center justify-center my-2">
                        <p className="m-0 text-2xl font-bold">75%</p>
                        <div className="h-full bg-gray-300 mx-3" style={{ width: "1px" }} />
                        <p className="m-0 text-lg font-semibold">Rp. 400.000.000</p>
                    </div>
                    <Progress percent={75} showInfo={false} />
                </div>
                <div className="p-3 bg-white rounded-md flex flex-col">
                    <p className="m-0 font-medium text-gray-400">Sisa Pemakaian</p>
                    <div className="flex items-center justify-center my-2">
                        <p className="m-0 text-2xl font-bold">25%</p>
                        <div className="h-full bg-gray-300 mx-3" style={{ width: "1px" }} />
                        <p className="m-0 text-lg font-semibold">Rp. 20.000.000</p>
                    </div>
                    <Progress percent={25} showInfo={false} />
                </div>
                <div className="p-3 bg-white rounded-md flex flex-col justify-between">
                    <p className="m-0 font-medium text-gray-400">Total Aktivitas</p>
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
                                <Progress percent={el.budget} showInfo={false} />
                            </div>
                        </Tooltip>
                    ))}
                </div>
            </div>
            <div className="flex items-center w-full justify-between">
                <h1 className="capitalize text-xl font-bold text-gray-600 m-0 my-4">sub unit program & partnership</h1>
                <Link to="/">Lihat detail</Link>
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
                <Link to="/">Lihat detail</Link>
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
