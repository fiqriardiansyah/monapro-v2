import React from "react";
import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AgendaFinance, BasePaginationResponse } from "models";
import moment from "moment";
import { FORMAT_SHOW_DATE } from "utils/constant";
import { ImWarning } from "react-icons/im";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
    onClickPaid: (data: T, callback: () => void) => void;
};

const AgendaFinanceTable = <T extends AgendaFinance>({ fetcher, onClickEdit, onClickPaid }: Props<T>) => {
    const location = useLocation();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const onClickPaidHandler = (data: T) => {
        Modal.confirm({
            title: "Lock",
            icon: <ImWarning className="text-red-400" />,
            content: `Set Bayar dengan id ${data.id}?`,
            onOk() {
                return new Promise((resolve, reject) => {
                    onClickPaid(data, () => {
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
            title: "No Agenda sekretariat",
            dataIndex: "no_agenda_secretariat",
            render: (text) => <p className="capitalize m-0">{text}</p>,
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
            title: "Nomor Finnest",
            dataIndex: "finnest_no",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Tanggal Finnest",
            dataIndex: "finnest_date",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Beban",
            dataIndex: "load_name",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Tanggal",
            dataIndex: "date",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Nilai Pembayaran",
            dataIndex: "value_payment",
            render: (text) => <p className="capitalize m-0">{text ? Number(text).ToIndCurrency("Rp") : "-"}</p>,
        },
        {
            title: "Tanggal SPB",
            dataIndex: "spb_date",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Transfer Kepada",
            dataIndex: "transfer_to",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Nomor Rekening",
            dataIndex: "no_rekening",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Tanggal Pembayaran",
            dataIndex: "payment_date",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Catatan",
            dataIndex: "note",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text}</p>,
        },
        {
            width: "200px",
            title: "Action",
            key: "action",
            fixed: "right",
            render: (_, record) => (
                <Space size="middle" direction="horizontal">
                    <Button type="text" onClick={() => onClickEdit(record)}>
                        Edit
                    </Button>
                    <Button disabled={record?.is_paid === 1} type="primary" onClick={() => onClickPaidHandler(record)}>
                        Bayar
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

export default AgendaFinanceTable;
