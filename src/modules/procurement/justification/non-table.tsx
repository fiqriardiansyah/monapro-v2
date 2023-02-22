import React, { useContext } from "react";
import { Button, message, Modal, Space, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

import { UseQueryResult } from "react-query";
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BasePaginationResponse } from "models";
import { ImWarning } from "react-icons/im";
import moment from "moment";
import ButtonDownload from "components/common/button-donwload";
import Utils from "utils";
import { UserContext } from "context/user";
import useIsForbidden from "hooks/useIsForbidden";
import { ROLE_SUPER_ADMIN, ROLE_USER } from "utils/constant";
import { TDataJustification } from "./models";

type Props<T> = {
    fetcher: UseQueryResult<BasePaginationResponse<T>, unknown>;
    onClickEdit: (data: T) => void;
    onClickLockBudget: (data: T, callback: () => void) => void;
    onClickDeleteJustif: (data: T, callback: () => void) => void;
};

const NonJustificationTable = <T extends TDataJustification>({ fetcher, onClickEdit, onClickLockBudget, onClickDeleteJustif }: Props<T>) => {
    const { state } = useContext(UserContext);
    const isForbidden = useIsForbidden({ roleAccess: state.user?.role_access, access: "justification" });

    const location = useLocation();
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const onClickDelete = (data: T) => {
        Modal.confirm({
            title: "Delete",
            icon: <ImWarning className="text-red-400" />,
            content: `Hapus data ${data.about_justification} ?`,
            onOk() {
                return new Promise((resolve, reject) => {
                    onClickDeleteJustif(data, () => {
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

    const onClickLockBudgetHandler = (data: T) => {
        if (!data.doc_justification) {
            message.error("Upload dokumen terlebih dahulu!");
            return;
        }
        Modal.confirm({
            title: "Lock",
            icon: <ImWarning className="text-red-400" />,
            content: `${data.lock_budget === 1 ? "Unlock" : "Lock"} anggaran ${data.about_justification}?`,
            onOk() {
                return new Promise((resolve, reject) => {
                    onClickLockBudget(data, () => {
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
            width: "100px",
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
            width: "80px",
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
                <Button type={record?.lock_budget !== 1 ? "primary" : "default"} onClick={() => onClickLockBudgetHandler(record)}>
                    {record?.lock_budget === 1 ? "Unlock" : "Lock"}
                </Button>
                <Button type="text" onClick={() => onClickDelete(record)} danger>
                    Delete
                </Button>
            </Space>
        ),
    };

    if (state.user?.role_id === ROLE_SUPER_ADMIN || state.user?.role_id === ROLE_USER) {
        if (!columns.find((el) => el.title === "Action")) {
            columns.push(action);
        }
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
                showSizeChanger: false,
            }}
            onChange={handleTableChange}
        />
    );
};

export default NonJustificationTable;
