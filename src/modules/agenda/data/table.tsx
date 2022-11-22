import React from "react";
import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse } from "models";
import { ImWarning } from "react-icons/im";
import { TDataAgenda } from "./models";
import { datatable } from "./data";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
    onClickDelete: (data: T, callback: () => void) => void;
    onClickDetail: (data: T) => void;
};

const AgendaDataTable = <T extends TDataAgenda>({ fetcher, onClickDelete, onClickEdit, onClickDetail }: Props<T>) => {
    const location = useLocation();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const onClickDlt = (data: T) => {
        Modal.confirm({
            title: "Delete",
            icon: <ImWarning className="text-red-400" />,
            content: `Hapus data dengan id ${data.id} ?`,
            onOk() {
                return new Promise((resolve, reject) => {
                    onClickDelete(data, () => resolve);
                });
            },
            onCancel() {},
            okButtonProps: {
                danger: true,
            },
        });
    };

    const onClickLockBudget = (data: T) => {
        Modal.confirm({
            title: "Lock",
            icon: <ImWarning className="text-red-400" />,
            content: `Kunci anggaran dengan id ${data.id}?`,
            onOk() {},
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
                query: params.get("query") || "",
                page: pagination.current?.toString() || "1",
            })}`,
        });
    };

    const columns: ColumnsType<T> = [
        {
            title: "No",
            dataIndex: "-",
            render: (text, record, i) => <p className="capitalize m-0">{((fetcher.data?.current_page || 1) - 1) * 10 + (i + 1)}</p>,
        },
        // {
        //     title: "Nama Beban",
        //     dataIndex: "load_name",
        //     render: (text, record, i) => (
        //         <Button onClick={() => onClickDetail(record)} className="capitalize" type="link">
        //             {text}
        //         </Button>
        //     ),
        // },
        {
            title: "No Agenda sekretariat",
            dataIndex: "no_secretariat",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "No Agenda disposisi",
            dataIndex: "no_disposition",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Tanggal",
            dataIndex: "date",
            render: (text) => <p className="capitalize m-0">{text}</p>,
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
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Pengirim",
            dataIndex: "sender",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Perihal",
            dataIndex: "regarding",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Sub Unit",
            dataIndex: "sub_unit",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Tindak Lanjut",
            dataIndex: "follow_up",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Keputusan",
            dataIndex: "decision",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Dokumen",
            dataIndex: "document",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Pelaksanaan acara",
            dataIndex: "event_date",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Perkiraan bayar",
            dataIndex: "payment_estimation_date",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            width: "300px",
            title: "Action",
            key: "action",
            fixed: "right",
            render: (_, record) => (
                <Space size="middle" direction="horizontal">
                    <Button type="text" onClick={() => onClickEdit(record)}>
                        Edit
                    </Button>
                    <Button type="primary" className="BTN-DELETE" onClick={() => onClickDlt(record)}>
                        Hapus
                    </Button>
                    <Button type="primary" onClick={() => onClickLockBudget(record)}>
                        Lock budget
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
