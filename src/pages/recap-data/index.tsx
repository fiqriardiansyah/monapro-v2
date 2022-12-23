import { Alert, Card, Divider, message, Skeleton } from "antd";
import Header from "components/common/header";
import State from "components/common/state";
import { RecapData, RecapIsPaidData, RecapLockBudgetData } from "models";
import Filter from "modules/recap-data/filter";
import RecapDataTable from "modules/recap-data/table";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import recapDataService from "services/api-endpoints/recap-data";

const RecapDataPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const year = searchParams.get("year") || 0;
    const month = searchParams.get("month") || 0;
    const quartalId = searchParams.get("quartal_id") || 0;
    const loadTypeId = searchParams.get("load_type_id") || 0;
    const subunitId = searchParams.get("subunit_id") || 0;
    const query = searchParams.get("query") || "";

    const isFilter = year || month || quartalId || loadTypeId || subunitId;

    // crud fetcher
    const getListQuery = useQuery(
        [isFilter ? recapDataService.filter : recapDataService.getAll, page, year, month, quartalId, loadTypeId, subunitId, query],
        async () => {
            if (query) {
                return (await recapDataService.Search({ page, query })).data.data;
            }
            if (isFilter) {
                return (
                    await recapDataService.Filter({
                        page,
                        year,
                        month,
                        quartal_id: quartalId,
                        load_type_id: loadTypeId,
                        subunit_id: subunitId,
                    })
                ).data.data;
            }
            return (await recapDataService.GetAll({ page })).data.data;
        }
    );

    const lockBudgetMutation = useMutation(
        async (data: RecapLockBudgetData) => {
            if (!data.justification_id) {
                throw new Error("Justification id belum terisi!");
            }
            await recapDataService.SetLockBudget(data);
        },
        {
            onSuccess: () => {
                getListQuery.refetch();
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
                getListQuery.refetch();
                message.success("Data Diubah!");
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

    const onClickPaid = async (data: { dt: RecapData; status: number }, callback: () => void) => {
        await paidMutation
            .mutateAsync({ finance_id: data.dt.finance_id as any, is_paid: data.status })
            .then(callback)
            .catch(callback);
    };

    const errors = [getListQuery];

    const onSearchHandler = (qr: string) => {
        setSearchParams({ page: "1", query: qr });
    };

    return (
        <div className="min-h-screen px-10">
            <Header title="Data Rekapan" onSubmitSearch={onSearchHandler} />
            {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))}
            {isFilter ? (
                <Card>
                    <State data={getListQuery.data} isLoading={getListQuery.isLoading} isError={getListQuery.isError}>
                        {(state) => (
                            <>
                                <State.Data state={state}>
                                    <div className="w-full items-center flex">
                                        <div className="flex-1">
                                            <p className="m-0 capitalize text-gray-400 font-medium">total budget plan</p>
                                            <p className="m-0 text-gray-600 font-semibold">
                                                {Number((getListQuery.data as any)?.total_budget_plan || "0").ToIndCurrency("Rp")}
                                            </p>
                                        </div>
                                        <Divider orientation="center" type="vertical" />
                                        <div className="flex-1">
                                            <p className="m-0 capitalize text-gray-400 font-medium">total pemakaian</p>
                                            <p className="m-0 text-gray-600 font-semibold">
                                                {Number((getListQuery.data as any)?.total_usage || "0").ToIndCurrency("Rp")}
                                            </p>
                                        </div>
                                        <Divider orientation="center" type="vertical" />
                                        <div className="flex-1">
                                            <p className="m-0 capitalize text-gray-400 font-medium">total belum bayar</p>
                                            <p className="m-0 text-gray-600 font-semibold">
                                                {Number((getListQuery.data as any)?.total_not_paid || "0").ToIndCurrency("Rp")}
                                            </p>
                                        </div>
                                    </div>
                                </State.Data>
                                <State.Loading state={state}>
                                    <Skeleton paragraph={{ rows: 3 }} active />
                                </State.Loading>
                                <State.Error state={state}>
                                    <Alert type="error" message={(getListQuery.error as any)?.message} />
                                </State.Error>
                            </>
                        )}
                    </State>
                </Card>
            ) : null}
            <div className="h-4" />
            <Filter />
            <div className="h-4" />
            <RecapDataTable onClickLockBudget={onClickLockBudget} onClickPaid={onClickPaid} fetcher={getListQuery} />
        </div>
    );
};

export default RecapDataPage;
