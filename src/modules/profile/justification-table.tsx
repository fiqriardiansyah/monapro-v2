import React, { useContext } from "react";
import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse } from "models";
import moment from "moment";
import ButtonDownload from "components/common/button-donwload";
import Utils from "utils";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import { TDataJustification } from "modules/procurement/justification/models";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
};

const JustificationTable = <T extends TDataJustification>({ fetcher }: Props<T>) => {
    const location = useLocation();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const detailHandler = (data: T) => {};

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
            width: "150px",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Tanggal Justifikasi",
            dataIndex: "justification_date",
            width: "150px",
            render: (text) => <p className="capitalize m-0">{moment(text).format("DD MMM yyy")}</p>,
        },
        {
            title: "Tipe",
            dataIndex: "-",
            width: "150px",
            render: (text, record) => <p className="capitalize m-0">{record.no_agenda ? "sponsorship" : "procurement"}</p>,
        },
        {
            title: "No Agenda",
            dataIndex: "no_agenda",
            width: "150px",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Perihal",
            dataIndex: "about_justification",
            width: "150px",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text}</p>,
        },
        {
            title: "Posisi",
            dataIndex: "position",
            width: "150px",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text}</p>,
        },
        {
            title: "Beban",
            dataIndex: "load_name",
            width: "150px",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Nilai",
            dataIndex: "value",
            width: "150px",
            render: (text) => <p className="capitalize m-0">{Number(text || "0").ToIndCurrency("Rp")}</p>,
        },
        {
            title: "Sub unit",
            dataIndex: "subunit_name",
            width: "150px",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text}</p>,
        },
        {
            title: "Pembuat",
            dataIndex: "creator",
            width: "150px",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Catatan",
            dataIndex: "note",
            width: "150px",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text}</p>,
        },
        {
            title: "Pelaksanaan acara",
            dataIndex: "event_date",
            width: "150px",
            render: (text) => <p className="capitalize m-0">{moment(text).format("DD MMM yyy")}</p>,
        },
        {
            title: "Bulan penagihan",
            dataIndex: "estimation_paydate",
            width: "150px",
            render: (text) => <p className="capitalize m-0">{moment(text).format("MMM yyyy")}</p>,
        },
        {
            title: "Dok Justifikasi",
            dataIndex: "doc_justification",
            width: "150px",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Justifikasi_${record.id}` })} />;
            },
        },
        // {
        //     width: "100px",
        //     title: "Action",
        //     key: "action",
        //     fixed: "right",
        //     render: (_, record) => (
        //         <Space size="middle" direction="horizontal">
        //             <Button type="text" onClick={() => detailHandler(record)}>
        //                 Detail
        //             </Button>
        //         </Space>
        //     ),
        // },
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

export default JustificationTable;
