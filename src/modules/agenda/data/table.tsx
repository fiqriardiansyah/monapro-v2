import React from "react";
import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse } from "models";
import { ImWarning } from "react-icons/im";
import moment from "moment";
import { DECISION, FOLLOW_UP } from "utils/constant";
import { TDataAgenda } from "./models";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
    onClickLockBudget: (data: T, callback: () => void) => void;
};

const AgendaDataTable = <T extends TDataAgenda>({ fetcher, onClickEdit, onClickLockBudget }: Props<T>) => {
    const location = useLocation();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const onClickLockBudgetHandler = (data: T) => {
        Modal.confirm({
            title: "Lock",
            icon: <ImWarning className="text-red-400" />,
            content: `Kunci anggaran dengan id ${data.id}?`,
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
            title: "No Agenda sekretariat",
            dataIndex: "no_agenda_secretariat",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "No Agenda disposisi",
            dataIndex: "no_agenda_disposition",
            render: (text) => <p className="capitalize m-0">{text || ""}</p>,
        },
        {
            title: "Tanggal",
            dataIndex: "date",
            render: (text) => <p className="capitalize m-0">{moment(text).format("DD MMM yyyy")}</p>,
        },
        {
            title: "Endorse",
            dataIndex: "endorse",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "No Surat",
            dataIndex: "letter_no",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Tanggal Surat",
            dataIndex: "letter_date",
            render: (text) => <p className="capitalize m-0">{moment(text).format("DD MMM yyyy")}</p>,
        },
        {
            title: "Pengirim",
            dataIndex: "sender",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Perihal",
            dataIndex: "about",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Sub unit",
            dataIndex: "subunit_name",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Tindak Lanjut",
            dataIndex: "follow_up",
            render: (text) => <p className="capitalize m-0">{FOLLOW_UP.find((el) => el.value === text)?.label}</p>,
        },
        {
            title: "Keputusan",
            dataIndex: "decision",
            render: (text) => <p className="capitalize m-0">{DECISION.find((el) => el.value === text)?.label}</p>,
        },
        {
            title: "Dokumen",
            dataIndex: "document",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Pelaksanaan acara",
            dataIndex: "event_date",
            render: (text) => <p className="capitalize m-0">{moment(text).format("DD MMM yyyy")}</p>,
        },
        {
            title: "Perkiraan bayar",
            dataIndex: "payment_estimation_date",
            render: (text) => <p className="capitalize m-0">{moment(text).format("DD MMM yyyy")}</p>,
        },
        {
            width: "200px",
            title: "Action",
            key: "action",
            fixed: "right",
            render: (_, record) => (
                <Space size="middle" direction="horizontal">
                    <Button type="text" onClick={() => onClickEdit(record)}>
                        Edit
                    </Button>
                    <Button disabled={record?.lock_budget === 1} type="primary" onClick={() => onClickLockBudgetHandler(record)}>
                        {record?.lock_budget === 1 ? "Locked" : "Lock budget"}
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

export default AgendaDataTable;
