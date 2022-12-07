import React from "react";
import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse } from "models";
import { ImWarning } from "react-icons/im";
import moment from "moment";
import { DECISION, FOLLOW_UP, FORMAT_SHOW_DATE } from "utils/constant";
import ButtonDownload from "components/common/button-donwload";
import Utils from "utils";
import { TDataRecapData } from "./models";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickLockBudget: (data: T, callback: () => void) => void;
    onClickPaid: (data: T, callback: () => void) => void;
};

const RecapDataTable = <T extends TDataRecapData>({ fetcher, onClickLockBudget, onClickPaid }: Props<T>) => {
    const location = useLocation();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const onClickLockBudgetHandler = (data: T) => {
        Modal.confirm({
            title: "Lock",
            icon: <ImWarning className="text-red-400" />,
            content: `${data.lock_budget === 1 ? "Unlock" : "Lock"} anggaran dengan id justifikasi ${data.justification_id}?`,
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

    const onClickPaidHandler = (data: T) => {
        Modal.confirm({
            title: "Lock",
            icon: <ImWarning className="text-red-400" />,
            content: `Set Bayar dengan id justifikasi ${data.justification_id}?`,
            onOk() {
                return new Promise((resolve, reject) => {
                    onClickPaid(data, () => {
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
        navigate({
            pathname: location.pathname,
            search: `?${createSearchParams({
                ...(params.get("query") ? { query: params.get("query") || "" } : {}),
                page: pagination.current?.toString() || "1",
            })}`,
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
            title: "Justifikasi ID",
            dataIndex: "justification_id",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Finance ID",
            dataIndex: "finance_id",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
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
            title: "Tanggal Justifikasi",
            dataIndex: "justification_date",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Perihal Justifikasi",
            dataIndex: "about_justification",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Nilai",
            dataIndex: "value",
            render: (text) => <p className="capitalize m-0">{!Number.isNaN(text) ? Number(text).ToIndCurrency("Rp") : "-"}</p>,
        },
        {
            title: "Sub Unit",
            dataIndex: "subunit_name",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Jenis Beban",
            dataIndex: "load_type",
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

        {
            width: "270px",
            title: "Action",
            key: "action",
            fixed: "right",
            render: (_, record) => (
                <Space size="middle" direction="horizontal">
                    <Button onClick={() => onClickLockBudgetHandler(record)} type={record.lock_budget ? "text" : "primary"}>
                        {record?.lock_budget === 1 ? "UnLocked" : "Lock"}
                    </Button>
                    <Button disabled={!!record.is_paid} onClick={() => onClickPaidHandler(record)} type={record.is_paid ? "text" : "primary"}>
                        Bayar
                    </Button>
                </Space>
            ),
        },
    ];

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
            }}
            onChange={handleTableChange}
        />
    );
};

export default RecapDataTable;
