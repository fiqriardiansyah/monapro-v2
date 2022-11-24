/* eslint-disable react/no-array-index-key */
import { Button, Divider, Progress, Tooltip } from "antd";
import Header from "components/common/header";
import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";

import BlueWaveImage from "assets/svgs/blue-wave.svg";
import GreenWaveImage from "assets/svgs/green-wave.svg";
import OrangeWaveImage from "assets/svgs/orange-wave.svg";
import { Link, useParams } from "react-router-dom";
import { dataRevenueDefault, dataRevenueDefault1, mainBudget } from "modules/dashboard/data";
import RemainingBudget from "modules/dashboard/component/remaining-budget";
import ProgressCustome from "modules/dashboard/component/progress-custome";
import { IoMdArrowBack } from "react-icons/io";
import { DASHBOARD_PATH } from "utils/routes";
import AgendaDataTable from "modules/agenda/data/table";
import { BasePaginationResponse } from "models";
import { useQuery } from "react-query";
import JustificationTable from "modules/procurement/justification/table";

const DashboardDetail = () => {
    if (typeof window !== "undefined") {
        Chart.register(...registerables);
    }

    const params = useParams();

    const getList = useQuery([""], async () => {
        return {} as BasePaginationResponse<any>;
    });

    const onClickEdit = (data: any) => {};
    const onClickDetail = (data: any) => {};
    const onClickDelete = (data: any, callback: () => void) => {};
    const onClickLockBudget = (data: any, callback: () => void) => {};
    const onClickPaid = (data: any, callback: () => void) => {};
    return (
        <div className="min-h-screen px-10">
            <Header
                back={() => (
                    <Link to="/">
                        <Button type="text" icon={<IoMdArrowBack className="text-xl mr-3" />} className="!flex !items-center">
                            Kembali
                        </Button>
                    </Link>
                )}
                title={params?.id?.toString()?.split("-")?.join(" ") || ""}
            />
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
            <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-white rounded-md col-span-2 row-span-2">
                    <Line data={dataRevenueDefault1} />
                </div>
                <div className="p-3 bg-white rounded-md flex flex-col justify-center relative">
                    <p className="m-0 font-medium text-gray-400 mb-2 absolute top-4 left-4">Sisa Pemakaian</p>
                    <p className="text-orange-400 m-0 text-3xl xl:text-4xl 2xl:text-7xl font-semibold">Rp. 20.000.000</p>
                </div>
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
            </div>
            <p className="capitalize font-semibold text-xl mt-8 mb-4">data agenda</p>
            <AgendaDataTable onClickLockBudget={onClickLockBudget} onClickEdit={onClickEdit} fetcher={getList} />
            <p className="capitalize font-semibold text-xl mt-8 mb-4">data justifikasi</p>
            <JustificationTable onClickLockBudget={onClickPaid} onClickEdit={onClickEdit} fetcher={getList} />
        </div>
    );
};

export default DashboardDetail;
