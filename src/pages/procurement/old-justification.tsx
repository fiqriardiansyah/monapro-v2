import { Card, message } from "antd";
import Header from "components/common/header";
import AddOldJustificationProcurement from "modules/procurement/justification/add-old";
import { FDataJustificationOld } from "modules/procurement/justification/models";
import React from "react";
import { useMutation } from "react-query";
import justificationService from "services/api-endpoints/procurement/justification";

const OldJustificationPage = <T extends any>() => {
    const createMutate = useMutation(
        [justificationService.createOldJustification],
        async (data: FDataJustificationOld) => {
            return (await justificationService.CreateOldJustification(data)).data.data;
        },
        {
            onSuccess: () => {
                message.success("Justifikasi Lama dibuat");
            },
        }
    );

    const onSubmit = async (data: FDataJustificationOld, callback: () => void) => {
        createMutate.mutateAsync(data).finally(callback);
    };

    return (
        <div className="min-h-screen px-10">
            <Header title="Justifikasi Lama" search={false} />
            <Card>
                <AddOldJustificationProcurement loading={createMutate.isLoading} onSubmit={onSubmit} />
            </Card>
        </div>
    );
};

export default OldJustificationPage;
