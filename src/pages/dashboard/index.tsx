/* eslint-disable react/no-array-index-key */
import { Alert, Divider, Progress, Skeleton, Tooltip } from "antd";
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
