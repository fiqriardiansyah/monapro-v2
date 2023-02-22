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
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
};

const ContractSpNopesTable = <T extends ContractSpNopes>({ fetcher, onClickEdit }: Props<T>) => {
    const [params, setParams] = useSearchParams();
    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "justification" });

    const handleTableChange = (pagination: TablePaginationConfig) => {
        params.set("page_contract", pagination.current?.toString() || "1");
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

export default ContractSpNopesTable;
