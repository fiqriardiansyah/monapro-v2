import React from "react";
import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse, Justification } from "models";
import { ImWarning } from "react-icons/im";
import moment from "moment";
import ButtonDownload from "components/common/button-donwload";
import Utils from "utils";

type Props = {
    fetcher: UseQueryResult<BasePaginationResponse<Justification>, unknown>;
};

const JustificationSubUnitTable = ({ fetcher }: Props) => {
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

    const columns: ColumnsType<Justification> = [
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
            title: "Tanggal Justifikasi",
            dataIndex: "justification_date",
            render: (text) => <p className="capitalize m-0">{moment(text).format("DD MMM yyy")}</p>,
        },
        {
            title: "No Agenda",
            dataIndex: "no_agenda",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Perihal",
            dataIndex: "about_justification",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Posisi",
            dataIndex: "position",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Beban",
            dataIndex: "load_name",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Nilai",
            dataIndex: "value",
            render: (text) => <p className="capitalize m-0">{parseInt(text || 0, 10).ToIndCurrency("Rp")}</p>,
        },
        {
            title: "Sub unit",
            dataIndex: "subunit_name",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Pembuat",
            dataIndex: "creator",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Catatan",
            dataIndex: "note",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Pelaksanaan acara",
            dataIndex: "event_date",
            render: (text) => <p className="capitalize m-0">{moment(text).format("DD MMM yyy")}</p>,
        },
        {
            title: "Bulan penagihan",
            dataIndex: "estimation_paydate",
            render: (text) => <p className="capitalize m-0">{moment(text).format("MMM yyy")}</p>,
        },
        {
            title: "Dok Justifikasi",
            dataIndex: "doc_justification",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Justifikasi_${record.id}` })} />;
            },
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
                showSizeChanger: false,
            }}
            onChange={handleTableChange}
        />
    );
};

export default JustificationSubUnitTable;
