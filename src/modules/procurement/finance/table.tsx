import React, { useContext } from "react";
import { Button, Modal, Select, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse } from "models";
import { ImWarning } from "react-icons/im";
import moment from "moment";
import { FINANCE_STATE, FORMAT_SHOW_DATE } from "utils/constant";
import ButtonDownload from "components/common/button-donwload";
import Utils from "utils";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import { TDataFinance } from "./models";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
    onClickPaid: (data: { dt: T; status: number }, callback: () => void) => void;
};

const FinanceTable = <T extends TDataFinance>({ fetcher, onClickPaid, onClickEdit }: Props<T>) => {
    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "justification" });

    const location = useLocation();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const onClickPaidHandler = (data: T, status: number) => {
        Modal.confirm({
            title: "Finance",
            icon: <ImWarning className="text-red-400" />,
            content: `Ubah data dengan id ${data.id}?`,
            onOk() {
                return new Promise((resolve, reject) => {
                    onClickPaid({ dt: data, status }, () => {
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
            width: "250px",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Perihal Justifikasi",
            dataIndex: "about_justification",
            width: "250px",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text}</p>,
        },
        {
            title: "Tanggal TEL21/SPB",
            dataIndex: "tel21_date",
            width: "150px",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Tanggal SPB Finance",
            dataIndex: "spb_date",
            width: "150px",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Tanggal pembayaran",
            dataIndex: "payment_date",
            width: "150px",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Nilai Pembayaran",
            dataIndex: "value_payment",
            width: "200px",
            render: (text) => <p className="capitalize m-0">{parseInt(text || 0, 10).ToIndCurrency("Rp")}</p>,
        },
        {
            title: "Catatan",
            dataIndex: "note",
            width: "200px",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{text}</p>,
        },
        {
            title: "Berkas Tagihan",
            dataIndex: "invoice_file",
            width: "150px",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Finance-Tagihan_${record.id}` })} />;
            },
        },
        {
            title: "Lampiran berkas",
            dataIndex: "attachment_file",
            width: "150px",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Finance-Lampiran_${record.id}` })} />;
            },
        },
    ];

    const action: ColumnsType<T>[0] = {
        width: "250px",
        title: "Action",
        key: "action",
        fixed: "right",
        render: (_, record) => (
            <Space size="middle" direction="horizontal">
                <Button type="text" onClick={() => onClickEdit(record)}>
                    Edit
                </Button>
                <Select
                    className="w-[150px]"
                    defaultValue={record.is_paid}
                    onChange={(value) => onClickPaidHandler(record, value)}
                    options={FINANCE_STATE}
                />
            </Space>
        ),
    };

    if (state.user?.role_id === 1) {
        columns.push(action);
    }

    return (
        <Table
            scroll={{ x: 1600 }}
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

export default FinanceTable;
