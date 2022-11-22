import { Alert, Descriptions, Image, Modal } from "antd";
import { Role } from "models";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { DEFAULT_ERROR_MESSAGE, IMAGE_FALLBACK } from "utils/constant";

type ChildrenProps = {
    isModalOpen: boolean;
    openModal: () => void;
    openModalWithData: (data: string | undefined) => void;
    closeModal: () => void;
};

type Props = {
    children: (data: ChildrenProps) => void;
};

const DetailRole = ({ children }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const detailMutation = useMutation(async (id: any) => {
        return {} as Role;
    });

    const openModalWithData = (data: string | undefined) => {
        if (data) {
            const parse = JSON.parse(data) as Role;
            detailMutation.mutate(parse.id);
            openModal();
        }
    };

    const childrenData: ChildrenProps = {
        isModalOpen,
        openModal,
        openModalWithData,
        closeModal,
    };

    return (
        <>
            <Modal title="Detail" open={isModalOpen} onCancel={closeModal} footer={null}>
                {detailMutation.isLoading ? (
                    <h1 className="">Mengambil data...</h1>
                ) : (
                    <Descriptions
                        title={detailMutation.data?.full_name}
                        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                        colon={false}
                        labelStyle={{ color: "#919EAB", width: 200 }}
                        bordered
                    >
                        <Descriptions.Item label="ID">{detailMutation.data?.id}</Descriptions.Item>
                        <Descriptions.Item label="Nama">{detailMutation.data?.full_name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{detailMutation.data?.email}</Descriptions.Item>
                        <Descriptions.Item label="Status">{detailMutation.data?.role_id}</Descriptions.Item>
                        <Descriptions.Item label="Status">{detailMutation.data?.role_name}</Descriptions.Item>
                    </Descriptions>
                )}
                {detailMutation.error ? (
                    <Alert message={(detailMutation.error as any)?.message || detailMutation.error} type="error" className="!my-2" />
                ) : null}
            </Modal>
            {children(childrenData)}
        </>
    );
};

export default DetailRole;
