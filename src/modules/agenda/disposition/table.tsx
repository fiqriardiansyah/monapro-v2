import React from "react";
import { Button, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AgendaDisposition, BasePaginationResponse } from "models";
import moment from "moment";
import { FORMAT_SHOW_DATE } from "utils/constant";
import ButtonDownload from "components/common/button-donwload";
import Utils from "utils";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
};

const AgendaDispositionTable = <T extends AgendaDisposition>({ fetcher, onClickEdit }: Props<T>) => {
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
            title: "No Agenda sekretariat",
            dataIndex: "no_agenda_secretariat",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "No Agenda disposisi",
            dataIndex: "no_agenda_disposition",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Disposisi kepada",
            dataIndex: "disposition_to",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "No Surat",
            dataIndex: "letter_no",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Perihal",
            dataIndex: "about",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text}</p>,
        },
        {
            title: "Pengirim",
            dataIndex: "sender",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Tanggal disposisi",
            dataIndex: "disposition_date",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Catatan",
            dataIndex: "note",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text}</p>,
        },
        {
            title: "Catatan disposisi",
            dataIndex: "disposition_date",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Dokumen",
            dataIndex: "disposition_doc",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Agenda-Disposisi_${record.id}` })} />;
            },
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

export default AgendaDispositionTable;
