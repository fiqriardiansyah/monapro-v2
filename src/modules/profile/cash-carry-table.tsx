import React, { useContext } from "react";
import { Button, Modal, Select, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse, CashCarry } from "models";
import moment from "moment";
import { FORMAT_SHOW_DATE, STATUS_CASH_CARRY } from "utils/constant";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import ButtonDownload from "components/common/button-donwload";
import Utils from "utils";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
};

const CashCarryTable = <T extends CashCarry>({ fetcher, onClickEdit }: Props<T>) => {
    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "justification" });

    const [params, setParams] = useSearchParams();

    const handleTableChange = (pagination: TablePaginationConfig) => {
        params.set("page_cc", pagination.current?.toString() || "1");
        setParams(params);
    };

    const columns: ColumnsType<T> = [
        {
            width: "50px",
            title: "No",
            dataIndex: "-",
            render: (text, record, i) => <p className="capitalize m-0">{((fetcher.data?.current_page || 1) - 1) * 10 + (i + 1)}</p>,
        },
        {
            title: "Tanggal pengajuan",
            dataIndex: "submission_date",
            width: "250px",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format(FORMAT_SHOW_DATE) : "-"}</p>,
        },
        {
            title: "Nilai pengajuan",
            dataIndex: "submission_value",
            width: "250px",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{Number(text)?.ToIndCurrency("Rp")}</p>,
        },
        {
            title: "Jenis beban",
            dataIndex: "load_name",
            width: "150px",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Sub unit",
            dataIndex: "subunit_name",
            width: "150px",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Bulan penagihan",
            dataIndex: "billing_month",
            width: "150px",
            render: (text) => <p className="capitalize m-0">{text ? moment(text).format("MMM yyyy") : "-"}</p>,
        },
        {
            title: "Perihal",
            dataIndex: "about",
            width: "200px",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Dokumen",
            dataIndex: "file_document",
            width: "200px",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Cash_Carry_${record.id}` })} />;
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            width: "200px",
            render: (text) => <p className="capitalize m-0 leading-3 text-xs">{STATUS_CASH_CARRY.find((el) => el.value === text)?.label}</p>,
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
            scroll={{ x: 1300 }}
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

export default CashCarryTable;
