import React, { useContext } from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse } from "models";
import ButtonDownload from "components/common/button-donwload";
import Utils from "utils";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import moment from "moment";
import { TDataNews } from "./models";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
};

const NewsTable = <T extends TDataNews>({ fetcher, onClickEdit }: Props<T>) => {
    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "justification" });

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
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Perihal Justifikasi",
            dataIndex: "about_justification",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text}</p>,
        },
        {
            title: "Tanggal Berita Acara",
            dataIndex: "date_news",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text ? moment(text).format("DD MMM yyyy") : "-"}</p>,
        },
        {
            title: "No BAP",
            dataIndex: "no_bap",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "No BAR",
            dataIndex: "no_bar",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "No BAPP",
            dataIndex: "no_bapp",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "File BAP",
            dataIndex: "file_bap",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Bap_${record.id}` })} />;
            },
        },
        {
            title: "File BAR",
            dataIndex: "file_bar",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Bar_${record.id}` })} />;
            },
        },
        {
            title: "File BAPP",
            dataIndex: "file_bapp",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Bapp_${record.id}` })} />;
            },
        },
    ];

    const action: ColumnsType<T>[0] = {
        width: "100px",
        title: "Action",
        key: "action",
        fixed: "right",
        render: (_, record) => (
            <Space size="middle" direction="horizontal">
                <Button type="text" onClick={() => onClickEdit(record)}>
                    Edit
                </Button>
            </Space>
        ),
    };

    if (!isForbidden) {
        columns.push(action);
    }

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
                showSizeChanger: false,
            }}
            onChange={handleTableChange}
        />
    );
};

export default NewsTable;
