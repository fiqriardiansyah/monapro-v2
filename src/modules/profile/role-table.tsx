import React, { useState } from "react";
import { Button, Select, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse, Role } from "models";
import { ROLE } from "utils/constant";

type Props = {
    fetcher: UseQueryResult<BasePaginationResponse<Role>, unknown>;
    loading?: boolean;
    onClickEdit: (data: Role) => void;
};

const RoleManagementTable = <T extends Role>({ fetcher, onClickEdit, loading }: Props) => {
    const [role, setRole] = useState<Role | null>(null);

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

    const editHandler = (record: Role) => {
        if (!role) return;
        onClickEdit({
            ...record,
            role_id: role.role_id,
        });
        setRole(null);
    };

    const columns: ColumnsType<Role> = [
        {
            width: "50px",
            title: "No",
            dataIndex: "-",
            render: (text, record, i) => <p className="capitalize m-0">{((fetcher.data?.current_page || 1) - 1) * 10 + (i + 1)}</p>,
        },
        {
            title: "Full Name",
            dataIndex: "full_name",
            render: (text) => <p className="capitalize m-0">{text}</p>,
        },
        {
            title: "Role Name",
            dataIndex: "role_name",
            render: (text, record) => (
                <Select defaultValue={record.role_id} onChange={(value) => setRole({ ...record, role_id: value })} options={ROLE} />
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            render: (text) => <p className="lowercase m-0">{text}</p>,
        },
        {
            title: "Action",
            key: "action",
            fixed: "right",
            render: (_, record) => (
                <Space size="middle" direction="horizontal">
                    <Button type={role && role.email === record.email ? "primary" : "text"} onClick={() => editHandler(record)}>
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Table
            size="small"
            loading={fetcher.isLoading || loading}
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

export default RoleManagementTable;