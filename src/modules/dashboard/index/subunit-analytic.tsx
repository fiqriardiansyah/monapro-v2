/* eslint-disable react/no-array-index-key */
import React from "react";
import { Link } from "react-router-dom";
import { DASHBOARD_PATH } from "utils/routes";

import BlueWaveImage from "assets/svgs/blue-wave.svg";
import GreenWaveImage from "assets/svgs/green-wave.svg";
import OrangeWaveImage from "assets/svgs/orange-wave.svg";
import { AnalyticSubUnit } from "models";

type Props = {
    data: AnalyticSubUnit;
};

const SubUnitAnalytic = ({ data }: Props) => {
    return (
        <div className="w-full mb-5">
            <div className="flex items-center w-full justify-between">
                <h1 className="capitalize text-xl font-bold text-gray-600 m-0 my-4">{data.subunit_name}</h1>
                <Link to={`${DASHBOARD_PATH}/${data.subunit_id}`}>Lihat detail</Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <div className="grid grid-cols-3 gap-4">
                        {data.list_analytic?.map((analytic, i) => (
                            <React.Fragment key={i}>
                                <div className="bg-white p-3 rounded-md flex flex-col items-center">
                                    <p className="m-0 font-medium text-gray-400">PEMAKAIAN</p>
                                    <p className="m-0 text-blue-400 font-bold text-xl my-3">
                                        {!Number.isNaN(analytic.total_usage) ? Number(analytic.total_usage).ToIndCurrency("Rp") : "-"}
                                    </p>
                                    <img src={BlueWaveImage} alt="" className="w-full" />
                                </div>
                                <div className="bg-white p-3 rounded-md flex flex-col items-center">
                                    <p className="m-0 font-medium text-gray-400">SUDAH DIBAYAR</p>
                                    <p className="m-0 text-orange-400 font-bold text-xl my-3">
                                        {!Number.isNaN(analytic.total_paid) ? Number(analytic.total_paid).ToIndCurrency("Rp") : "-"}
                                    </p>
                                    <img src={OrangeWaveImage} alt="" className="w-full" />
                                </div>
                                <div className="bg-white p-3 rounded-md flex flex-col items-center">
                                    <p className="m-0 font-medium text-gray-400">BELUM DIBAYAR</p>
                                    <p className="m-0 text-green-400 font-bold text-xl my-3">
                                        {!Number.isNaN(analytic.not_paid) ? Number(analytic.not_paid).ToIndCurrency("Rp") : "-"}
                                    </p>
                                    <img src={GreenWaveImage} alt="" className="w-full" />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="bg-white p-3 rounded-md">
                        <p className="m-0 font-medium text-gray-400">Recently News</p>
                        <p className="mt-2">-</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubUnitAnalytic;
