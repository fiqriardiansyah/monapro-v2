import { Skeleton } from "antd";
import React from "react";
import { progressColor } from "../data";
import { RemainingBudgetType } from "../models";
import ProgressCustome from "./progress-custome";

type Props = {
    data: RemainingBudgetType;
};

const Loading = ({ title }: { title: string }) => {
    return (
        <div className="p-3 bg-white rounded-md flex flex-col justify-center relative">
            <p className="m-0 font-medium text-gray-400 absolute top-4 left-4">{title}</p>
            <Skeleton paragraph={{ rows: 3 }} className="mt-4" />
        </div>
    );
};

const RemainingBudget = ({ data }: Props) => {
    const color = progressColor.find((clr) => clr.min < (data.percent || 0));
    return (
        <div className="p-3 bg-white rounded-md flex flex-col justify-center relative">
            <p className="m-0 font-medium text-gray-400 absolute top-4 left-4">{data.title}</p>
            <div className="flex items-center justify-center my-2 mt-4 flex-col 2xl:flex-row">
                <p style={{ color: color?.color }} className="m-0 text-xl xl:text-2xl 2xl:text-3xl font-bold">
                    {data.percent}%
                </p>
                <div className="h-full bg-gray-300 mx-3" style={{ width: "1px" }} />
                <p className="m-0 text-base 2xl:text-xl font-semibold">{data.budget.ToIndCurrency("Rp")}</p>
            </div>
            <ProgressCustome percent={data.percent} showInfo={false} status="active" />
        </div>
    );
};

RemainingBudget.Loading = Loading;

export default RemainingBudget;
