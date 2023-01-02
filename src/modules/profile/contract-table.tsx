import React, { useContext } from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse, ContractSpNopes } from "models";
import moment from "moment";
import { FORMAT_SHOW_DATE } from "utils/constant";
import ButtonDownload from "components/common/button-donwload";
import Utils from "utils";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
};

const ContractSpNopesTable = <T extends ContractSpNopes>({ fetcher }: Props<T>) => {
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
            title: "No Justifikasi",
            dataIndex: "no_justification",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Perihal Justifikasi",
            dataIndex: "about_justification",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text || "-"}</p>,
        },
        {
            title: "No Kontrak",
            dataIndex: "no_contract",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "Perihal Data Manage",
            dataIndex: "about_manage",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text || "-"}</p>,
        },
        {
            title: "Tanggal",
            dataIndex: "date",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Nilai",
            dataIndex: "value",
            render: (text) => <p className="capitalize m-0">{parseInt(text || 0, 10).ToIndCurrency("Rp")}</p>,
        },
        {
            title: "Dokumen",
            dataIndex: "doc",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Kontrak-SP-NOPES_${record.id}` })} />;
            },
        },
    ];

    return (
        <Table
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

export default ContractSpNopesTable;
