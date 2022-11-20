import React from "react";
import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse } from "models";
import { ImWarning } from "react-icons/im";
import { TDataNegotiation } from "./models";
import { datatable } from "./data";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
    // onClickDelete: (data: T, callback: () => void) => void;
    // onClickDetail: (data: T) => void;
};

const NegotiationTable = <T extends TDataNegotiation>({
    fetcher,
    // onClickDelete,
    onClickEdit,
}: //  onClickDetail
Props<T>) => {
    const location = useLocation();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    // const onClickDlt = (data: T) => {
    //     Modal.confirm({
    //         title: "Delete",
    //         icon: <ImWarning className="text-red-400" />,
    //         content: `Hapus data dengan id ${data.id} ?`,
    //         onOk() {
    //             return new Promise((resolve, reject) => {
    //                 onClickDelete(data, () => resolve);
    //             });
    //         },
    //         onCancel() {},
    //         okButtonProps: {
    //             danger: true,
    //         },
    //     });
    // };

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
        {
            title: "No Justifikasi",
            dataIndex: "justification_no",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Perihal Justifikasi",
            dataIndex: "justification_regarding",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Tanggal Negosiasi",
            dataIndex: "date",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Catatan",
            dataIndex: "notes",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Dokumen",
            dataIndex: "document",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            width: "100px",
            title: "Action",
            key: "action",
            fixed: "right",
            render: (_, record) => (
                <Space size="middle" direction="horizontal">
                    <Button type="text" onClick={() => onClickEdit(record)}>
                        Edit
                    </Button>
                    {/* <Button type="primary" className="BTN-DELETE" onClick={() => onClickDlt(record)}>
                        Hapus
                    </Button> */}
                </Space>
            ),
        },
    ];

    return (
        <Table
            size="small"
            loading={fetcher.isLoading}
            columns={columns}
            // dataSource={fetcher.data?.list || []}
            dataSource={datatable as any}
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

export default NegotiationTable;
