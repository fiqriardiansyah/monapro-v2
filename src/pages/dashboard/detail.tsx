/* eslint-disable react/no-array-index-key */
import { Button, Divider, Progress, Skeleton, Tooltip } from "antd";
import Header from "components/common/header";
import React, { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";

import BlueWaveImage from "assets/svgs/blue-wave.svg";
import GreenWaveImage from "assets/svgs/green-wave.svg";
import OrangeWaveImage from "assets/svgs/orange-wave.svg";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { dataRevenueDefault, dataRevenueDefault1, mainBudget } from "modules/dashboard/data";
import RemainingBudget from "modules/dashboard/component/remaining-budget";
import ProgressCustome from "modules/dashboard/component/progress-custome";
import { IoMdArrowBack } from "react-icons/io";
import { DASHBOARD_PATH } from "utils/routes";
import AgendaDataTable from "modules/agenda/data/table";
import { BasePaginationResponse } from "models";
import { useQuery } from "react-query";
import JustificationTable from "modules/procurement/justification/table";
import dashboardSubUnitService from "services/api-endpoints/dashboard/subunit-detail";
import State from "components/common/state";
import AgendaSubUnitTable from "modules/dashboard/index/agenda-table";
import JustificationSubUnitTable from "modules/dashboard/index/justification-table";

const DashboardDetail = () => {
    if (typeof window !== "undefined") {
        Chart.register(...registerables);
    }

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const pageAgenda = searchParams.get("page_agenda") || 1;
    const pageJustification = searchParams.get("page_justification") || 1;

    const getHeaderSubUnit = useQuery(
        [dashboardSubUnitService.getHeaderSubunit, id],
        async () => {
            const res = await dashboardSubUnitService.GetHeaderSubunit({ id: id as any });
            return res.data.data;
        },
        {
            enabled: !!id,
        }
    );

    const getAgendaSubUnit = useQuery([dashboardSubUnitService.getAgendaSubunit, pageAgenda], async () => {
        const res = await dashboardSubUnitService.GetAgendaSubUnit({ id: id as any, page: pageAgenda });
        return res.data.data;
    });

    const getJustificationSubUnit = useQuery([dashboardSubUnitService.getJustificationSubunit, pageJustification], async () => {
        const res = await dashboardSubUnitService.GetJustificationSubunit({ id: id as any, page: pageJustification });
        return res.data.data;
    });

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
                title={getHeaderSubUnit.data?.subunit_name || "Getting data..."}
            />
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <State data={getHeaderSubUnit.data} isLoading={getHeaderSubUnit.isLoading} isError={getHeaderSubUnit.isError}>
                        {(state) => (
                            <>
                                <State.Data state={state}>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-white p-3 rounded-md flex flex-col items-center">
                                            <p className="m-0 font-medium text-gray-400">PEMAKAIAN</p>
                                            <p className="m-0 text-blue-400 font-bold text-xl my-3">
                                                {!Number.isNaN(getHeaderSubUnit.data?.total_usage)
                                                    ? Number(getHeaderSubUnit.data?.total_usage).ToIndCurrency("Rp")
                                                    : "-"}
                                            </p>
                                            <img src={BlueWaveImage} alt="" className="w-full" />
                                        </div>
                                        <div className="bg-white p-3 rounded-md flex flex-col items-center">
                                            <p className="m-0 font-medium text-gray-400">SUDAH DIBAYAR</p>
                                            <p className="m-0 text-orange-400 font-bold text-xl my-3">
                                                {!Number.isNaN(getHeaderSubUnit.data?.total_paid)
                                                    ? Number(getHeaderSubUnit.data?.total_paid).ToIndCurrency("Rp")
                                                    : "-"}
                                            </p>
                                            <img src={OrangeWaveImage} alt="" className="w-full" />
                                        </div>
                                        <div className="bg-white p-3 rounded-md flex flex-col items-center">
                                            <p className="m-0 font-medium text-gray-400">BELUM DIBAYAR</p>
                                            <p className="m-0 text-green-400 font-bold text-xl my-3">
                                                {!Number.isNaN(getHeaderSubUnit.data?.not_paid)
                                                    ? Number(getHeaderSubUnit.data?.not_paid).ToIndCurrency("Rp")
                                                    : "-"}
                                            </p>
                                            <img src={GreenWaveImage} alt="" className="w-full" />
                                        </div>
                                    </div>
                                </State.Data>
                                <State.Loading state={state}>
                                    <Skeleton paragraph={{ rows: 4 }} active />
                                </State.Loading>
                            </>
                        )}
                    </State>
                </div>
                <div className="col-span-1">
                    <div className="bg-white p-3 rounded-md">
                        <p className="m-0 font-medium text-gray-400">Recently News</p>
                        <p className="mt-2">-</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-white rounded-md col-span-2 row-span-2">
                    <Line data={dataRevenueDefault1} />
                </div>
                <div className="p-3 bg-white rounded-md flex flex-col justify-center relative">
                    <p className="m-0 font-medium text-gray-400 mb-2 absolute top-4 left-4">Sisa Pemakaian</p>
                    <p className="text-orange-400 m-0 text-3xl xl:text-3xl 2xl:text-5xl font-semibold">
                        {!Number.isNaN(getHeaderSubUnit.data?.remaining_usage)
                            ? Number(getHeaderSubUnit.data?.remaining_usage).ToIndCurrency("Rp")
                            : "-"}
                    </p>
                </div>
                <div className="p-3 bg-white rounded-md flex flex-col justify-center relative">
                    <p className="m-0 font-medium text-gray-400 absolute top-4 left-4">Total Aktivitas</p>
                    {getHeaderSubUnit.data?.list_activity?.map((activity, i) => (
                        <div className="mb-4" key={i}>
                            <div className="w-full flex justify-between items-center">
                                <p className="m-0 font-medium">Sponsorship</p>
                                <p className="m-0 font-bold text-gray-500 text-xl">
                                    {!Number.isNaN(activity.sponsorship) ? Number(activity.sponsorship).ToIndCurrency("Rp") : "-"}
                                </p>
                            </div>
                            <div className="w-full flex justify-between items-center">
                                <p className="m-0 font-medium">Procurement</p>
                                <p className="m-0 font-bold text-gray-500 text-xl">
                                    {!Number.isNaN(activity.procurement) ? Number(activity.procurement).ToIndCurrency("Rp") : "-"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <p className="capitalize font-semibold text-xl mt-8 mb-4">data agenda</p>
            <AgendaSubUnitTable fetcher={getAgendaSubUnit} />
            <p className="capitalize font-semibold text-xl mt-8 mb-4">data justifikasi</p>
            <JustificationSubUnitTable fetcher={getJustificationSubUnit} />
        </div>
    );
};

export default DashboardDetail;
