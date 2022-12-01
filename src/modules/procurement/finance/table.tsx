import React from "react";
import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse } from "models";
import { ImWarning } from "react-icons/im";
import moment from "moment";
import { FORMAT_SHOW_DATE } from "utils/constant";
import ButtonDownload from "components/common/button-donwload";
import Utils from "utils";
import { TDataFinance } from "./models";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
    onClickPaid: (data: T, callback: () => void) => void;
};

const FinanceTable = <T extends TDataFinance>({ fetcher, onClickPaid, onClickEdit }: Props<T>) => {
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
            title: "Tanggal TEL21/SPB",
            dataIndex: "tel21_date",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Tanggal SPB Finance",
            dataIndex: "spb_date",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Tanggal pembayaran",
            dataIndex: "payment_date",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Nilai Pembayaran",
            dataIndex: "value_payment",
            render: (text) => <p className="capitalize m-0">{parseInt(text || 0, 10).ToIndCurrency("Rp")}</p>,
        },
        {
            title: "Catatan",
            dataIndex: "note",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text}</p>,
        },
        {
            title: "Berkas Tagihan",
            dataIndex: "invoice_file",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Finance-Tagihan_${record.id}` })} />;
            },
        },
        {
            title: "Lampiran berkas",
            dataIndex: "attachment_file",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Finance-Lampiran_${record.id}` })} />;
            },
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
            scroll={{ x: 1400 }}
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

export default FinanceTable;
