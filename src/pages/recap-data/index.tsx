import Header from "components/common/header";
import RecapDataTable from "modules/recap-data/table";
import React from "react";
import { useQuery } from "react-query";

const RecapDataPage = () => {
    // crud fetcher
    const getList = useQuery([], async () => {
        return {} as any;
    });

    return (
        <div className="min-h-screen px-10">
            <Header title="Data Rekapan" />
            {/* {errors.map((el) => (el.error ? <Alert message={(el.error as any)?.message || el.error} type="error" className="!my-2" /> : null))} */}
            <RecapDataTable fetcher={getList} />
        </div>
    );
};

export default RecapDataPage;
