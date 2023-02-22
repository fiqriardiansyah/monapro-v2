/* eslint-disable no-shadow */
import { Button } from "antd";
import Header from "components/common/header";
import { StateContext } from "context/state";
import { UserContext } from "context/user";
import AgendaActivity from "modules/profile/activities/agenda";
import CashCarryActivity from "modules/profile/activities/cash-carry";
import ContractActivity from "modules/profile/activities/contract";
import JustificationActivity from "modules/profile/activities/justification";
import NewsActivity from "modules/profile/activities/news";
import React, { useContext } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const MyActivity = () => {
    const { setState, state } = useContext(UserContext);
    const { notificationInstance } = useContext(StateContext);

    return (
        <div className="min-h-screen px-10">
            <Header
                search={false}
                back={() => (
                    <Link to="/">
                        <Button type="text" icon={<IoMdArrowBack className="text-xl mr-3" />} className="!flex !items-center !bg-gray-200">
                            Kembali
                        </Button>
                    </Link>
                )}
            />
            <h1 className="capitalize text-xl font-semibold m-0 mb-5">my activity</h1>

            <JustificationActivity />
            <CashCarryActivity />
            <AgendaActivity />
            <ContractActivity />
            <NewsActivity />
        </div>
    );
};

export default MyActivity;
