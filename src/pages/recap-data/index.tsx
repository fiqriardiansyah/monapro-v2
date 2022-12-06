import { Alert, message } from "antd";
import Header from "components/common/header";
import { RecapData, RecapIsPaidData, RecapLockBudgetData } from "models";
import RecapDataTable from "modules/recap-data/table";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import recapDataService from "services/api-endpoints/recap-data";

const RecapDataPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    // crud fetcher
    const getList = useQuery([recapDataService.getAll, page], async () => {
        const req = await recapDataService.GetAll({ page });
        return req.data.data;
    });

    const lockBudgetMutation = useMutation(
        async (data: RecapLockBudgetData) => {
            if (!data.justification_id) {
                throw new Error("Justification id belum terisi!");
            }
            await recapDataService.SetLockBudget(data);
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Budget Locked!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const paidMutation = useMutation(
        async (data: RecapIsPaidData) => {
            if (!data.finance_id) {
                throw new Error("Finance id belum terisi!");
            }
            await recapDataService.SetIsPaid(data);
        },
        {
            onSuccess: () => {
                getList.refetch();
                message.success("Set Bayar!");
            },
            onError: (error: any) => {
                message.error(error?.message);
            },
        }
    );

    const onClickLockBudget = async (data: RecapData, callback: () => void) => {
        await lockBudgetMutation
            .mutateAsync({ justification_id: data.justification_id, lock_budget: data.lock_budget === 1 ? 0 : 1 })
            .then(callback)
            .catch(callback);
    };

    const onClickPaid = async (data: RecapData, callback: () => void) => {
        await paidMutation
            .mutateAsync({ finance_id: data.finance_id as any, is_paid: 1 })
            .then(callback)
            .catch(callback);
    };

    const errors = [getList];

    return (
        <div className="min-h-screen px-10">
            <Header title="Data Rekapan" />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            <RecapDataTable onClickLockBudget={onClickLockBudget} onClickPaid={onClickPaid} fetcher={getList} />
        </div>
    );
};

export default RecapDataPage;
