/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DASHBOARD_PATH } from "utils/routes";

import BlueWaveImage from "assets/svgs/blue-wave.svg";
import GreenWaveImage from "assets/svgs/green-wave.svg";
import OrangeWaveImage from "assets/svgs/orange-wave.svg";
import { AnalyticSubUnit } from "models";
import { useMutation, UseQueryResult } from "react-query";
import dashboardSubUnitService, { SaveNote } from "services/api-endpoints/dashboard/subunit-detail";
import { Button, Input } from "antd";

type Props = {
    data: AnalyticSubUnit;
    fetcher: UseQueryResult<AnalyticSubUnit[], unknown>;
};

const SubUnitAnalytic = ({ data, fetcher }: Props) => {
    const [note, setNote] = useState(data.note || "");
    const [isEdit, setIsEdit] = useState(false);

    const saveNote = useMutation(
        [dashboardSubUnitService.saveNote, data.subunit_id],
        async (data: SaveNote) => {
            return (await dashboardSubUnitService.SaveNote(data)).data.data;
        },
        {
            onSuccess: () => {
                setIsEdit(false);
                fetcher.refetch();
            },
        }
    );

    const onSaveNote = () => {
        saveNote.mutate({ subunit_id: data.subunit_id, note });
    };

    const onCancel = () => {
        setIsEdit(false);
        setNote(data.note || "");
    };

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
                                    <p className="m-0 font-medium text-gray-400">Plan Budget</p>
                                    <p className="m-0 text-blue-400 font-medium text-lg my-3">
                                        {!Number.isNaN(analytic.plan_budget) ? Number(analytic.plan_budget).ToIndCurrency("Rp") : "-"}
                                    </p>
                                    <img src={BlueWaveImage} alt="" className="w-full" />
                                </div>
                                <div className="bg-white p-3 rounded-md flex flex-col items-center">
                                    <p className="m-0 font-medium text-gray-400">Sudah Bayar</p>
                                    <p className="m-0 text-orange-400 font-medium text-lg my-3">
                                        {!Number.isNaN(analytic.total_usage) ? Number(analytic.total_usage).ToIndCurrency("Rp") : "-"}
                                    </p>
                                    <img src={OrangeWaveImage} alt="" className="w-full" />
                                </div>
                                <div className="bg-white p-3 rounded-md flex flex-col items-center">
                                    <p className="m-0 font-medium text-gray-400">Belum Bayar</p>
                                    <p className="m-0 text-green-400 font-medium text-lg my-3">
                                        {!Number.isNaN(analytic.not_paid) ? Number(analytic.not_paid).ToIndCurrency("Rp") : "-"}
                                    </p>
                                    <img src={GreenWaveImage} alt="" className="w-full" />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className="col-span-1 h-full">
                    <div className="bg-white p-3 rounded-md h-full flex flex-col justify-between">
                        <div className="">
                            <p className="m-0 font-medium text-gray-400">Notes</p>
                            {isEdit ? (
                                <Input.TextArea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Your notes here..."
                                    className="w-full h-full"
                                />
                            ) : (
                                <p>{note}</p>
                            )}
                        </div>
                        {isEdit ? (
                            <div className="self-end justify-self-end">
                                <Button onClick={onCancel} type="link" className="mt-4 self-end justify-self-end">
                                    Cancel
                                </Button>
                                <Button loading={saveNote.isLoading} onClick={onSaveNote} type="default" className="mt-4 ">
                                    Save
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={() => setIsEdit(true)} type="link" className="mt-4 self-end justify-self-end">
                                Edit
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubUnitAnalytic;
