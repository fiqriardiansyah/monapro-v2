import { Alert, Button } from "antd";
import Header from "components/common/header";
import { BasePaginationResponse, Justification } from "models";
import AddJustification from "modules/procurement/justification/add";
import EditJustification from "modules/procurement/justification/edit";
import { FDataJustification, TDataJustification } from "modules/procurement/justification/models";
import JustificationTable from "modules/procurement/justification/table";
import React, { useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import justificationService from "services/api-endpoints/procurement/justification";
import Utils from "utils";

const JustificationPage = <T extends TDataJustification>() => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const editTriggerRef = useRef<HTMLButtonElement | null>(null);
    const detailTriggerRef = useRef<HTMLButtonElement | null>(null);

    // crud fetcher
    const getList = useQuery([""], async () => {
        const res = await justificationService.GetAll<Justification>({ page });
        return Utils.toBaseTable<Justification, T>(res.data.data);
    });

    const deleteMutation = useMutation(async ({ id, callback }: { id: string; callback: () => void }) => {});

    const createMutation = useMutation(async ({ data, callback }: { data: Justification; callback: () => void }) => {});

    const editMutation = useMutation(async ({ data, callback }: { data: Justification; callback: () => void }) => {});

    // crud handler
    const onClickDelete = (data: T, callback: () => void) => {
        deleteMutation.mutate({
            id: data.id as any,
            callback,
        });
    };
    const onClickDetail = (data: T) => {
        if (detailTriggerRef.current) {
            detailTriggerRef.current.dataset.data = JSON.stringify(data);
            detailTriggerRef.current.click();
        }
    };
    const onClickEdit = (data: T) => {
        if (editTriggerRef.current) {
            editTriggerRef.current.dataset.data = JSON.stringify(data);
            editTriggerRef.current.click();
        }
    };
    const addHandler = (data: FDataJustification, callback: () => void) => {
        // createMutation.mutate({
        //     data,
        //     callback: () => {
        //         callback();
        //     },
        // });
    };
    const editHandler = (data: Justification, callback: () => void) => {
        editMutation.mutate({
            data,
            callback: () => {
                callback();
            },
        });
    };

    const errors = [getList, deleteMutation, createMutation, editMutation];

    return (
        <div className="min-h-screen px-10">
            <EditJustification loading={editMutation.isLoading} onSubmit={editHandler}>
                {(data) => (
                    <button
                        type="button"
                        ref={editTriggerRef}
                        onClick={() => data.openModalWithData(editTriggerRef.current?.dataset.data)}
                        className="hidden"
                    >
                        edit
                    </button>
                )}
            </EditJustification>
            <Header
                title="Justifikasi"
                action={
                    <AddJustification loading={createMutation.isLoading} onSubmit={addHandler}>
                        {(data) => (
                            <Button onClick={data.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                                Tambah Justifikasi
                            </Button>
                        )}
                    </AddJustification>
                }
            />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <JustificationTable onClickEdit={onClickEdit} onClickDetail={onClickDetail} onClickDelete={onClickDelete} fetcher={getList} />
        </div>
    );
};

export default JustificationPage;
