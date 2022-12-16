import React, { useContext } from "react";
import { Button, Modal, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse } from "models";
import { ImWarning } from "react-icons/im";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import ButtonDownload from "components/common/button-donwload";
import Utils from "utils";
import { TDataSop } from "./models";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
    onClickDelete: (data: T, callback: () => void) => void;
};

const SopTable = <T extends TDataSop>({ fetcher, onClickDelete, onClickEdit }: Props<T>) => {
    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "master_data" });

    const location = useLocation();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const onClickDlt = (data: T) => {
        Modal.confirm({
            title: "Delete",
            icon: <ImWarning className="text-red-400" />,
            content: `Hapus data dengan id ${data.id} ?`,
            onOk() {
                return new Promise((resolve, reject) => {
                    onClickDelete(data, () => {
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
            title: "Nama Peraturan",
            dataIndex: "name",
            width: "200px",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Dokumen",
            dataIndex: "document",
            width: "150px",
            render: (url, record) => {
                if (!url) return "-";
                return <ButtonDownload url={url} name={Utils.createFileNameDownload({ url, text: `Peraturan_${record.name}` })} />;
            },
        },
    ];

    const action: ColumnsType<T>[0] = {
        title: "Action",
        key: "action",
        width: "200px",
        fixed: "right",
        render: (_, record) => (
            <Space size="middle" direction="horizontal">
                <Button type="text" onClick={() => onClickEdit(record)}>
                    Edit
                </Button>
                <Button type="primary" className="BTN-DELETE" onClick={() => onClickDlt(record)}>
                    Hapus
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
            }}
            onChange={handleTableChange}
        />
    );
};

export default SopTable;
