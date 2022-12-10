/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
import { Alert, Button, Card, DatePicker, Divider, Progress, Select, Skeleton, Space, Tooltip } from "antd";
import Header from "components/common/header";
import React, { useEffect, useState } from "react";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";

import BlueWaveImage from "assets/svgs/blue-wave.svg";
import GreenWaveImage from "assets/svgs/green-wave.svg";
import OrangeWaveImage from "assets/svgs/orange-wave.svg";
import { Link } from "react-router-dom";
import { mainBudget, randomRevenue } from "modules/dashboard/data";
import RemainingBudget from "modules/dashboard/component/remaining-budget";
import ProgressCustome from "modules/dashboard/component/progress-custome";
import { DASHBOARD_PATH } from "utils/routes";
import { useQuery } from "react-query";
import dashboardService from "services/api-endpoints/dashboard";
import State from "components/common/state";
import { COLORS, QUARTAL, QUARTAL_MONTH } from "utils/constant";
import Utils from "utils";
import SubUnitAnalytic from "modules/dashboard/index/subunit-analytic";
import moment, { Moment } from "moment";

export const dataRevenueDefault = {
    labels: [],
    datasets: [],
    options: {
        responsive: true,
    },
};

const DashboardPage = () => {
    if (typeof window !== "undefined") {
        Chart.register(...registerables);
    }

    const [qtl, setQtl] = useState(1);
    const [year, setYear] = useState<Moment | null>(null);

    const [chartData, setChartData] = useState(dataRevenueDefault);

    const getAllHeader = useQuery([dashboardService.getAllHeader, qtl, year], async () => {
        const res = await dashboardService.GetAllHeader({ quartal_id: qtl, year: year ? moment(year).format("yyyy") : (0 as any) });
        return res.data.data;
    });

    const getSubHeader = useQuery([dashboardService.getSubHeader, qtl, year], async () => {
        const res = await dashboardService.GetSubHeader({ quartal_id: qtl, year: year ? moment(year).format("yyyy") : (0 as any) });
        return res.data.data;
    });

    const analyticSubUnit = useQuery([dashboardService.getAnalyticSubUnit], async () => {
        const res = await dashboardService.GetAnalyticSubUnit();
        return res.data.data;
    });

    // useEffect(() => {
    //     if (!getSubHeader.data) return;
    //     setChartData((prev) => ({
    //         ...prev,
    //         labels: QUARTAL_MONTH.find((el) => el.quartal === qtl)?.month as any,
    //         datasets: [...getSubHeader.data.list_subunit_usage].map((el, i) => ({
    //             label: el.subunit_name,
    //             data: randomRevenue[Utils.getRandomIntRange(0, randomRevenue.length - 1)] ?? randomRevenue[0],
    //             backgroundColor: COLORS[i],
    //             borderColor: COLORS[i],
    //             borderWidth: 1,
    //         })) as any,
    //     }));
    // }, [qtl, getSubHeader.data]);

    const onChangeYear = (moment: Moment | null) => {
        if (moment) {
            setYear(moment);
        }
    };

    return (
        <div className="min-h-screen px-10">
            <Header
                title="Dashboard"
                action={
                    <Space>
                        <DatePicker value={year} onChange={onChangeYear} picker="year" />
                        <Select value={qtl} onChange={(val) => setQtl(val)} options={QUARTAL} />
                    </Space>
                }
            />
            <div className="grid grid-cols-4 grid-rows-3 gap-4 mb-10">
                <State data={getAllHeader.data} isLoading={getAllHeader.isLoading} isError={getAllHeader.isError}>
                    {(state) => (
                        <>
                            <State.Data state={state}>
                                {getAllHeader.data?.plan_budget &&
                                    getAllHeader.data.plan_budget?.map((el, i: number) => (
                                        <RemainingBudget
                                            data={{ title: "Plan Budget", budget: el.plan_budget, percent: el.percentage_plan }}
                                            key={i}
                                        />
                                    ))}
                                {getAllHeader.data?.total_usage &&
                                    getAllHeader.data.total_usage?.map((el, i: number) => (
                                        <RemainingBudget
                                            data={{ title: "Total Pemakaian", budget: el.total_usage, percent: el.percentage_usage }}
                                            key={i}
                                        />
                                    ))}
                                {getAllHeader.data?.not_paid &&
                                    getAllHeader.data?.not_paid?.map((el, i: number) => (
                                        <RemainingBudget
                                            data={{ title: "Belum Bayar", budget: el.not_paid, percent: el.percentage_notpaid }}
                                            key={i}
                                        />
                                    ))}
                                {getAllHeader.data?.remaining_budget &&
                                    getAllHeader.data?.remaining_budget?.map((el, i: number) => (
                                        <RemainingBudget
                                            data={{ title: "Sisa Anggaran", budget: el.remaining_budget, percent: el.percentage_remaining }}
                                            key={i}
                                        />
                                    ))}
                            </State.Data>
                            <State.Loading state={state}>
                                <RemainingBudget.Loading title="Plan Budget" />
                                <RemainingBudget.Loading title="Total Pemakaian" />
                                <RemainingBudget.Loading title="Belum Bayar" />
                                <RemainingBudget.Loading title="Sisa Anggaran" />
                            </State.Loading>
                            <State.Error state={state}>
                                <Alert message={(getAllHeader.error as any)?.message} type="error" />
                            </State.Error>
                        </>
                    )}
                </State>
                <div className="p-3 bg-white rounded-md col-span-2 row-span-2">
                    <Line data={chartData} />
                </div>
                {/* <div className="p-3 bg-white rounded-md row-span-2">
                    <p className="m-0 font-medium text-gray-400 mb-6 capitalize">Pemakaian Sub Unit</p>
                    <State data={getSubHeader.data} isLoading={getSubHeader.isLoading} isError={getSubHeader.isError}>
                        {(state) => (
                            <>
                                <State.Data state={state}>
                                    {getSubHeader.data?.list_subunit_usage?.map((el, i: number) => {
                                        return (
                                            <Tooltip
                                                placement="left"
                                                title={`Anggaran Terpakai: ${
                                                    !Number.isNaN(el.subunit_usage) ? el.subunit_usage.ToIndCurrency("Rp") : "-"
                                                } / ${el.budget?.ToIndCurrency("Rp")}`}
                                                key={i}
                                            >
                                                <div className="flex flex-col w-full mb-3">
                                                    <p className="m-0 text-gray-400 capitalize text-xs">{el.subunit_name}</p>
                                                    <Progress
                                                        percent={Math.floor(Utils.remainPercent(el.subunit_usage, el.budget))}
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
                                    <Alert message={(getSubHeader.error as any)?.message} />
                                </State.Error>
                            </>
                        )}
                    </State>
                </div> */}
                <div className="p-3 bg-white rounded-md col-span-2 row-span-2">
                    <p className="m-0 font-medium text-gray-400 mb-6 capitalize">Jenis Aktivitas</p>
                    <State data={getSubHeader.data} isLoading={getSubHeader.isLoading} isError={getSubHeader.isError}>
                        {(state) => (
                            <>
                                <State.Data state={state}>
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {getSubHeader.data?.list_activity?.map((el, i: number) => {
                                            return (
                                                <div className="w-full flex items-center justify-between mb-2">
                                                    <p className="m-0 text-gray-400 text-xs">{el.load_name}</p>
                                                    <p className="m-0 text-gray-600 font-medium text-xs">{el.load_usage?.ToIndCurrency("Rp")}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </State.Data>
                                <State.Loading state={state}>
                                    <Skeleton active paragraph={{ rows: 5 }} />
                                </State.Loading>
                                <State.Error state={state}>
                                    <Alert message={(getSubHeader.error as any)?.message} />
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
                            {analyticSubUnit.data?.map((subUnit: any) => (
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
