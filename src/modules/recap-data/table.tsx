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
};

// [IMPORTANT] kolom table belum bener

const RecapDataTable = <T extends TDataRecapData>({ fetcher }: Props<T>) => {
    const location = useLocation();
    const [params] = useSearchParams();
    const navigate = useNavigate();

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
            title: "No Agenda",
            dataIndex: "no_agenda",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "No Justifikasi",
            dataIndex: "no_justification",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Perihal Justifikasi",
            dataIndex: "about_justification",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Nilai Justifikasi",
            dataIndex: "value_justification",
            render: (text) => <p className="capitalize m-0">{text ? Number(text).ToIndCurrency("Rp") : "-"}</p>,
        },
        {
            title: "Sub Unit",
            dataIndex: "sub_unit",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Kontrak/SPK/NOPES",
            dataIndex: "contract",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Berita Acara",
            dataIndex: "news",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            width: "200px",
            title: "Action",
            key: "action",
            fixed: "right",
            render: (_, record) => (
                <Space size="middle" direction="horizontal">
                    <Button type="text">Lock</Button>
                    <Button type="text">Bayar</Button>
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

export default RecapDataTable;
