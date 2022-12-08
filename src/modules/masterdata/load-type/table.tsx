import React from "react";
import { Button, List, Modal, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse } from "models";
import { ImWarning } from "react-icons/im";
import { TDataLoadType } from "./models";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
    onClickDelete: (data: T, callback: () => void) => void;
    onClickDetail: (data: T) => void;
};

const LoadTypeTable = <T extends TDataLoadType>({ fetcher, onClickDelete, onClickEdit, onClickDetail }: Props<T>) => {
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
                    onClickDelete(data, () => {
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
            title: "Nama Beban",
            dataIndex: "load_name",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Januari",
            dataIndex: "january",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Februari",
            dataIndex: "february",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Maret",
            dataIndex: "maret",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "April",
            dataIndex: "april",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Mei",
            dataIndex: "mei",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Juni",
            dataIndex: "juny",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "July",
            dataIndex: "july",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Agustus",
            dataIndex: "august",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "September",
            dataIndex: "september",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Oktober",
            dataIndex: "october",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "November",
            dataIndex: "november",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Desember",
            dataIndex: "desember",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Tahun",
            dataIndex: "year",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Action",
            key: "action",
            width: "200px",
            fixed: "right",
            render: (_, record) => (
                <Space size="middle" direction="horizontal">
                    <Button type="text" onClick={() => onClickEdit(record)}>
                        Edit
                    </Button>
                    <Button type="primary" className="BTN-DELETE" onClick={() => onClickDlt(record)}>
                        Hapus
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Table
            scroll={{ x: 1500 }}
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

export default LoadTypeTable;
