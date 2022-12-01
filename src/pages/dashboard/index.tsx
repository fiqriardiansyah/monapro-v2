/* eslint-disable react/no-array-index-key */
import { Alert, Card, Divider, Progress, Skeleton, Tooltip } from "antd";
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
import { useQuery } from "react-query";
import dashboardService from "services/api-endpoints/dashboard";
import State from "components/common/state";
import { COLORS } from "utils/constant";
import Utils from "utils";
import SubUnitAnalytic from "modules/dashboard/index/subunit-analytic";

const DashboardPage = () => {
    if (typeof window !== "undefined") {
        Chart.register(...registerables);
    }

    const getAllHeader = useQuery([dashboardService.getAllHeader], async () => {
        const res = await dashboardService.GetAllHeader();
        return res.data.data;
    });

    const remainingBudgetQuery = useQuery([dashboardService.getRemainingBudget], async () => {
        const res = await dashboardService.GetRemainingBudget();
        return res.data.data;
    });

    const analyticSubUnit = useQuery([dashboardService.getAnalyticSubUnit], async () => {
        const res = await dashboardService.GetAnalyticSubUnit();
        return res.data.data;
    });

    const [dataRevenue, setDataRevenue] = useState(dataRevenueDefault);

    return (
        <div className="min-h-screen px-10">
            <Header title="Dashboard" />
            <div className="grid grid-cols-3 grid-rows-3 gap-4 mb-10">
                <State data={getAllHeader.data} isLoading={getAllHeader.isLoading} isError={getAllHeader.isError}>
                    {(state) => (
                        <>
                            <State.Data state={state}>
                                {getAllHeader.data?.total_usage &&
                                    getAllHeader.data.total_usage?.map((el, i) => (
                                        <RemainingBudget
                                            data={{ title: "Total Pemaikaian", budget: el.total_usage, percent: el.percentage_total }}
                                            key={i}
                                        />
                                    ))}
                                {getAllHeader.data?.remaining_usage &&
                                    getAllHeader.data.remaining_usage?.map((el, i) => (
                                        <RemainingBudget
                                            data={{ title: "Sisa Pemaikaian", budget: el.remaining_usage, percent: el.percentage_remaining }}
                                            key={i}
                                        />
                                    ))}
                            </State.Data>
                            <State.Loading state={state}>
                                <RemainingBudget.Loading title="Total Pemakaian" />
                                <RemainingBudget.Loading title="Sisa Pemakaian" />
                            </State.Loading>
                            <State.Error state={state}>
                                <Alert message={(getAllHeader.error as any)?.message} type="error" />
                            </State.Error>
                        </>
                    )}
                </State>
                <div className="p-3 bg-white rounded-md flex flex-col justify-center relative">
                    <State data={getAllHeader.data} isLoading={getAllHeader.isLoading} isError={getAllHeader.isError}>
                        {(state) => (
                            <>
                                <State.Data state={state}>
                                    <p className="m-0 font-medium text-gray-400 absolute top-4 left-4">Total Aktivitas</p>
                                    {getAllHeader.data?.total_activity &&
                                        getAllHeader.data?.total_activity?.map((el, i) => (
                                            <React.Fragment key={i}>
                                                <div className="w-full flex justify-between items-center">
                                                    <p className="m-0 font-medium">Sponsorship</p>
                                                    <p className="m-0 font-bold text-gray-500 text-xl">
                                                        {!Number.isNaN(el.sponsorship) ? Number(el.sponsorship).ToIndCurrency("Rp") : "-"}
                                                    </p>
                                                </div>
                                                <div className="w-full flex justify-between items-center">
                                                    <p className="m-0 font-medium">Procurement</p>
                                                    <p className="m-0 font-bold text-gray-500 text-xl">
                                                        {!Number.isNaN(el.procurement) ? Number(el.procurement).ToIndCurrency("Rp") : "-"}
                                                    </p>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                </State.Data>
                                <State.Loading state={state}>
                                    <RemainingBudget.Loading title="Total Aktifitas" />
                                </State.Loading>
                                <State.Error state={state}>
                                    <Alert message={(getAllHeader.error as any)?.message} type="error" />
                                </State.Error>
                            </>
                        )}
                    </State>
                </div>
                <div className="p-3 bg-white rounded-md col-span-2 row-span-2">
                    <Line data={dataRevenue} />
                </div>
                <div className="p-3 bg-white rounded-md row-span-2">
                    <p className="m-0 font-medium text-gray-400 mb-2">Sisa Anggaran Tiap Sub Unit</p>
                    <State data={remainingBudgetQuery.data} isLoading={remainingBudgetQuery.isLoading} isError={remainingBudgetQuery.isError}>
                        {(state) => (
                            <>
                                <State.Data state={state}>
                                    {remainingBudgetQuery.data?.map((el, i) => {
                                        return (
                                            <Tooltip
                                                placement="left"
                                                title={`Sisa Anggaran: ${el.remaining_budget ? el.remaining_budget.ToIndCurrency("Rp") : "-"} / ${
                                                    el.budget
                                                }`}
                                                key={el.id}
                                            >
                                                <div className="flex flex-col w-full mb-3">
                                                    <p className="m-0 text-gray-400 capitalize font-medium">{el.subunit_name}</p>
                                                    <Progress
                                                        percent={Math.floor(Utils.remainPercent(el.remaining_budget, el.budget))}
                                                        showInfo={false}
                                                        status="active"
                                                        strokeColor={{ from: COLORS[i], to: COLORS[i] }}
                                                    />
                                                </div>
                                            </Tooltip>
                                        );
                                    })}
                                </State.Data>
                                <State.Loading state={state}>
                                    <Skeleton active paragraph={{ rows: 5 }} />
                                </State.Loading>
                                <State.Error state={state}>
                                    <Alert message={(remainingBudgetQuery.error as any)?.message} />
                                </State.Error>
                            </>
                        )}
                    </State>
                </div>
            </div>
            {/* sub unit */}
            <State data={analyticSubUnit.data} isLoading={analyticSubUnit.isLoading} isError={analyticSubUnit.isError}>
                {(state) => (
                    <>
                        <State.Data state={state}>
                            {analyticSubUnit.data?.map((subUnit) => (
                                <SubUnitAnalytic data={subUnit} key={subUnit.subunit_id} />
                            ))}
                        </State.Data>
                        <State.Loading state={state}>
                            <Skeleton paragraph={{ rows: 10 }} />
                        </State.Loading>
                        <State.Error state={state}>
                            <Alert message={(analyticSubUnit.error as any)?.message} type="error" />
                        </State.Error>
                    </>
                )}
            </State>
        </div>
    );
};

export default DashboardPage;
