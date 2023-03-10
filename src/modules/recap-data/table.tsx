import { Button, Modal, Select, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import React, { useContext } from "react";

import ButtonDownload from "components/common/button-donwload";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import { BasePaginationResponse } from "models";
import moment from "moment";
import { ImWarning } from "react-icons/im";
import { UseQueryResult } from "react-query";
import { useSearchParams } from "react-router-dom";
import { FINANCE_STATE } from "utils/constant";
import { TDataRecapData } from "./models";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickLockBudget: (data: T, callback: () => void) => void;
    onClickPaid: (data: { dt: T; status: number }, callback: () => void) => void;
};

const RecapDataTable = <T extends TDataRecapData>({ fetcher, onClickLockBudget, onClickPaid }: Props<T>) => {
    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "data_recap" });

    const [params, setParams] = useSearchParams();

    const onClickLockBudgetHandler = (data: T) => {
        Modal.confirm({
            title: "Lock",
            icon: <ImWarning className="text-red-400" />,
            content: `${data.lock_budget === 1 ? "Unlock" : "Lock"} anggaran (${data.about_justification})?`,
            onOk() {
                return new Promise((resolve, reject) => {
                    onClickLockBudget(data, () => {
                        resolve(true);
                    });
                });
            },
            onCancel() {},
            okButtonProps: {
                danger: true,
            },
        });
    };

    const handleTableChange = (pagination: TablePaginationConfig) => {
        params.set("page", pagination.current?.toString() || "1");
        setParams(params);
    };

    const onClickPaidHandler = (data: T, status: number) => {
        Modal.confirm({
            title: "Data Rekap",
            icon: <ImWarning className="text-red-400" />,
            content: `Ubah data baris ini?`,
            onOk() {
                return new Promise((resolve, reject) => {
                    onClickPaid({ dt: data, status }, () => {
                        resolve(true);
                    });
                });
            },
            onCancel() {},
            okButtonProps: {
                danger: true,
            },
        });
    };

    const columns: ColumnsType<T> = [
        {
            width: "50px",
            title: "No",
            dataIndex: "-",
            render: (text, record, i) => <p className="capitalize m-0">{((fetcher.data?.current_page || 1) - 1) * 10 + (i + 1)}</p>,
        },
        {
            title: "No Agenda",
            dataIndex: "no_agenda",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "No Justifikasi",
            dataIndex: "no_justification",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Perihal Justifikasi",
            dataIndex: "about_justification",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Bulan penagihan",
            dataIndex: "estimation_paydate",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format("MMM yyyy") : "-"}</p>,
        },

        {
            title: "Nilai",
            dataIndex: "value",
            render: (text) => <p className="capitalize m-0">{!Number.isNaN(text) ? Number(text).ToIndCurrency("Rp") : "-"}</p>,
        },
        {
            title: "Jenis Beban",
            dataIndex: "load_name",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Sub Unit",
            dataIndex: "subunit_name",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "No Kontrak",
            dataIndex: "no_contract",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Berita Acara",
            dataIndex: "",
            width: "500px",
            render: (text, record) => (
                <div className="flex gap-4 justify-between">
                    <div className="">
                        <p className="capitalize m-0">
                            <span className="text-gray-400 text-xs">No BAP:</span> {record.no_bap || "-"}
                        </p>
                        {record.file_bap ? <ButtonDownload url={record.file_bap} name={`${record.no_bap}-file-bap`} /> : "No File"}
                    </div>
                    <div className="">
                        <p className="capitalize m-0">
                            <span className="text-gray-400 text-xs">No BAPP:</span> {record.no_bapp || "-"}
                        </p>
                        {record.file_bapp ? <ButtonDownload url={record.file_bapp} name={`${record.no_bapp}-file-bapp`} /> : "No File"}
                    </div>
                    <div className="">
                        <p className="capitalize m-0">
                            <span className="text-gray-400 text-xs">No BAR:</span> {record.no_bar || "-"}
                        </p>
                        {record.file_bar ? <ButtonDownload url={record.file_bar} name={`${record.no_bar}-file-bar`} /> : "No File"}
                    </div>
                </div>
            ),
        },
    ];

    const action: ColumnsType<T>[0] = {
        width: "270px",
        title: "Action",
        key: "action",
        fixed: "right",
        render: (_, record) => (
            <Space size="middle" direction="horizontal">
                <Button onClick={() => onClickLockBudgetHandler(record)} type={record.lock_budget ? "default" : "primary"}>
                    {record?.lock_budget === 1 ? "Unlock" : "Lock"}
                </Button>
                <Select
                    className="w-[150px]"
                    defaultValue={record.is_paid}
                    onChange={(value) => onClickPaidHandler(record, value)}
                    options={FINANCE_STATE}
                />
            </Space>
        ),
    };

    if (!isForbidden) {
        columns.push(action);
    }

    return (
        <Table
            scroll={{ x: 2000 }}
            size="small"
            loading={fetcher.isLoading}
            columns={columns}
            dataSource={fetcher.data?.list || []}
            className="w-full"
            pagination={{
                current: fetcher.data?.current_page || 1,
                pageSize: 10, // nanti minta be untuk buat
                total: fetcher.data?.total_data || 0,
                showSizeChanger: false,
            }}
            onChange={handleTableChange}
        />
    );
};

export default RecapDataTable;
