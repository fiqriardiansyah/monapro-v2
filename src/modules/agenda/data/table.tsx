import React, { useContext, useRef } from "react";
import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse } from "models";
import { ImWarning } from "react-icons/im";
import moment from "moment";
import { DECISION, FOLLOW_UP, FORMAT_SHOW_DATE, STATUS_AGENDA } from "utils/constant";
import ButtonDownload from "components/common/button-donwload";
import Utils from "utils";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import { useReactToPrint } from "react-to-print";
import { TDataAgenda } from "./models";
import Print from "./print";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
    onClickPrint: (data: T) => void;
};

const AgendaDataTable = <T extends TDataAgenda>({ fetcher, onClickEdit, onClickPrint }: Props<T>) => {
    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "agenda" });

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
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "No Agenda CCIR",
            dataIndex: "no_agenda_ccir",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "No Agenda Direksi",
            dataIndex: "no_agenda_directors",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        // {
        //     title: "No Agenda disposisi",
        //     dataIndex: "no_agenda_disposition",
        //     render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        // },
        {
            title: "Tanggal",
            dataIndex: "date",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Inisiator",
            dataIndex: "endorse",
            render: (text) => <p className="capitalize m-0">{text || "-"}</p>,
        },
        {
            title: "No Surat",
            dataIndex: "letter_no",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Tanggal Surat",
            dataIndex: "letter_date",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Pengirim",
            dataIndex: "sender",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Perihal",
            dataIndex: "about",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text}</p>,
        },
        {
            title: "Sub unit",
            dataIndex: "subunit_name",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text}</p>,
        },
        {
            title: "Keputusan",
            dataIndex: "decision",
            render: (text) => <p className="capitalize m-0">{DECISION.find((el) => el.value === text)?.label}</p>,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text) => <p className="capitalize m-0">{STATUS_AGENDA.find((el) => el.value === text)?.label || "-"}</p>,
        },
        {
            title: "Dokumen",
            dataIndex: "document",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Agenda-Data_${record.id}` })} />;
            },
        },
        {
            title: "Pelaksanaan acara",
            dataIndex: "event_date",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
    ];

    const action: ColumnsType<T>[0] = {
        width: "200px",
        title: "Action",
        key: "action",
        fixed: "right",
        render: (_, record) => (
            <Space size="middle" direction="horizontal">
                <Button type="text" onClick={() => onClickEdit(record)}>
                    Edit
                </Button>
                <Print data={record}>
                    {(dt) => (
                        <Button type="primary" onClick={dt.clickPrint}>
                            Print
                        </Button>
                    )}
                </Print>
            </Space>
        ),
    };

    if (!isForbidden) {
        columns.push(action);
    }

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
