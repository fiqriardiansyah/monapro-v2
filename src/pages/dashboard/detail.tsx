/* eslint-disable react/no-array-index-key */
import { Button, Divider, Progress, Select, Skeleton, Space, Tooltip } from "antd";
import Header from "components/common/header";
import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";

import BlueWaveImage from "assets/svgs/blue-wave.svg";
import GreenWaveImage from "assets/svgs/green-wave.svg";
import OrangeWaveImage from "assets/svgs/orange-wave.svg";
import { Link, useParams, useSearchParams } from "react-router-dom";
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
import { COLORS, QUARTAL, QUARTAL_MONTH } from "utils/constant";
import Utils from "utils";
import { randomRevenue } from "modules/dashboard/data";

// const color = COLORS[Math.round(Math.random() * (COLORS.length - 1))] || COLORS[0];

export const chartDataDefault = {
    labels: [],
    datasets: [],
    options: {
        responsive: true,
    },
};

const DashboardDetail = () => {
    if (typeof window !== "undefined") {
        Chart.register(...registerables);
    }

    const [qtl, setQtl] = useState(1);

    const [chartData, setChartData] = useState(chartDataDefault);

    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const pageAgenda = searchParams.get("page_agenda") || 1;
    const pageJustification = searchParams.get("page_justification") || 1;

    const getHeaderSubUnit = useQuery(
        [dashboardSubUnitService.getHeaderSubunit, id, qtl],
        async () => {
            const res = await dashboardSubUnitService.GetHeaderSubunit({ id: id as any });
            return res.data.data;
        },
        {
            enabled: !!id,
            onSuccess: (data) => {
                setChartData((prev) => ({
                    ...prev,
                    labels: QUARTAL_MONTH.find((el) => el.quartal === qtl)?.month as any,
                    datasets: [
                        {
                            label: data.subunit_name,
                            data: randomRevenue[Utils.getRandomIntRange(0, randomRevenue.length - 1)] ?? randomRevenue[0],
                            backgroundColor: [COLORS[Utils.getRandomIntRange(0, COLORS.length - 1)]],
                            borderColor: [COLORS[Utils.getRandomIntRange(0, COLORS.length - 1)]],
                            borderWidth: 1,
                        },
                    ] as any,
                }));
            },
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
                        <Button type="text" icon={<IoMdArrowBack className="text-xl mr-3" />} className="!flex !items-center !bg-gray-200">
                            Kembali
                        </Button>
                    </Link>
                )}
                title={getHeaderSubUnit.data?.subunit_name || "Getting data..."}
                action={
                    <Space>
                        <Select value={qtl} onChange={(val) => setQtl(val)} options={QUARTAL} />
                    </Space>
                }
            />
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <State data={getHeaderSubUnit.data} isLoading={getHeaderSubUnit.isLoading} isError={getHeaderSubUnit.isError}>
                        {(state) => (
                            <>
                                <State.Data state={state}>
                                    {getHeaderSubUnit.data?.list_analytic?.map((analytic, i) => (
                                        <React.Fragment key={i}>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="bg-white p-3 rounded-md flex flex-col items-center">
                                                    <p className="m-0 font-medium text-gray-400">Plan Budget</p>
                                                    <p className="m-0 text-blue-400 text-lg font-medium my-3">
                                                        {!Number.isNaN(analytic.plan_budget) ? Number(analytic.plan_budget).ToIndCurrency("Rp") : "-"}
                                                    </p>
                                                    <img src={BlueWaveImage} alt="" className="w-full" />
                                                </div>
                                                <div className="bg-white p-3 rounded-md flex flex-col items-center">
                                                    <p className="m-0 font-medium text-gray-400">Total Pemakaian</p>
                                                    <p className="m-0 text-orange-400 text-lg font-medium my-3">
                                                        {!Number.isNaN(analytic.total_usage) ? Number(analytic.total_usage).ToIndCurrency("Rp") : "-"}
                                                    </p>
                                                    <img src={OrangeWaveImage} alt="" className="w-full" />
                                                </div>
                                                <div className="bg-white p-3 rounded-md flex flex-col items-center">
                                                    <p className="m-0 font-medium text-gray-400">Belum Bayar</p>
                                                    <p className="m-0 text-green-400 text-lg font-medium my-3">
                                                        {!Number.isNaN(analytic.not_paid) ? Number(analytic.not_paid).ToIndCurrency("Rp") : "-"}
                                                    </p>
                                                    <img src={GreenWaveImage} alt="" className="w-full" />
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </State.Data>
                                <State.Loading state={state}>
                                    <Skeleton paragraph={{ rows: 4 }} active />
                                </State.Loading>
                            </>
                        )}
                    </State>
                </div>
                <div className="col-span-1 h-full">
                    <div className="bg-white p-3 rounded-md h-full">
                        <p className="m-0 font-medium text-gray-400">Recently News</p>
                        <p className="mt-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores architecto illo quia</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 ">
                <div className="p-3 bg-white rounded-md col-span-2 row-span-2">
                    <Bar data={chartData} />
                </div>
                <div className="p-3 bg-white rounded-md h-full">
                    <p className="m-0 font-medium text-gray-400 mb-2">Sisa Pemakaian</p>
                    <State data={getHeaderSubUnit.data} isLoading={getHeaderSubUnit.isLoading} isError={getHeaderSubUnit.isError}>
                        {(state) => (
                            <>
                                <State.Data state={state}>
                                    {getHeaderSubUnit.data?.list_activity?.map((el, i: number) => {
                                        return (
                                            <div className="w-full flex items-center justify-between mb-2">
                                                <p className="m-0 text-gray-400">{el.load_name}</p>
                                                <p className="m-0 text-gray-600 font-medium">{el.load_usage?.ToIndCurrency("Rp")}</p>
                                            </div>
                                        );
                                    })}
                                </State.Data>
                                <State.Loading state={state}>
                                    <Skeleton paragraph={{ rows: 4 }} active />
                                </State.Loading>
                            </>
                        )}
                    </State>
                </div>
            </div>
            <p className="capitalize font-semibold text-xl mt-8 mb-4">data rekapan</p>
        </div>
    );
};

export default DashboardDetail;
