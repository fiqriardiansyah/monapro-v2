import { Alert, message } from "antd";
import Header from "components/common/header";
import { RecapData, RecapIsPaidData, RecapLockBudgetData } from "models";
import RecapDataTable from "modules/recap-data/table";
import React from "react";
import { useMutation, useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import recapDataService from "services/api-endpoints/recap-data";

const SopPage = () => {
    return (
        <div className="min-h-screen px-10">
            <Header search={false} />
            <h1>Penggunaan Dashboard</h1>
            <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptas minus illum delectus tempore repellendus, saepe aut itaque
                sequi natus dignissimos neque dolorum velit! Similique, architecto temporibus? At, minima iste?
            </p>
            <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellat voluptas minus illum delectus tempore repellendus, saepe aut itaque
                sequi natus dignissimos neque dolorum velit! Similique, architecto temporibus? At, minima iste?
            </p>
        </div>
    );
};

export default SopPage;
