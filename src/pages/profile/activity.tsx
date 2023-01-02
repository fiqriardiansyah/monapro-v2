/* eslint-disable no-shadow */
import { Alert, Button, Card, Input, message, Skeleton } from "antd";
import Header from "components/common/header";
import State from "components/common/state";
import { StateContext } from "context/state";
import { Role } from "models";
import { FDataUser, FEditUser, TDataRoleManagement } from "modules/profile/models";
import RoleManagementTable from "modules/profile/role-table";
import React, { useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useMutation, useQuery } from "react-query";
import { Link, useSearchParams } from "react-router-dom";
import profileService from "services/api-endpoints/profile";
import ProfileImage from "assets/profile.jpeg";
import { AiOutlinePlus } from "react-icons/ai";
import AddUser from "modules/profile/add";
import ModalEditProfile from "modules/profile/modal-edit-profile";
import JustificationTable from "modules/profile/justification-table";
import { UserContext } from "context/user";
import myActivityService from "services/api-endpoints/my-activity";
import CashCarryTable from "modules/profile/cash-carry-table";
import AgendaDataTable from "modules/profile/agenda-table";
import ContractSpNopesTable from "modules/profile/contract-table";
import NewsTable from "modules/profile/news-table";

const MyActivity = () => {
    const { setState, state } = useContext(UserContext);
    const [searchParams] = useSearchParams();
    const pageJustification = searchParams.get("page_justification") || 1;
    const pageCc = searchParams.get("page_cc") || 1;
    const pageAgenda = searchParams.get("page_agenda") || 1;
    const pageContract = searchParams.get("page_contract") || 1;
    const pageNews = searchParams.get("page_news") || 1;

    const myJustification = useQuery([myActivityService.getMyJustification, pageJustification], async () => {
        return (await myActivityService.GetMyJustification({ page: pageJustification })).data.data;
    });

    const myCashCarry = useQuery([myActivityService.getMyCashCarry, pageCc], async () => {
        return (await myActivityService.GetMyCashCarry({ page: pageCc })).data.data;
    });

    const myAgenda = useQuery([myActivityService.getMyAgenda, pageAgenda], async () => {
        return (await myActivityService.GetMyAgenda({ page: pageAgenda })).data.data;
    });

    const myContract = useQuery([myActivityService.getMyContract, pageContract], async () => {
        return (await myActivityService.GetMyContract({ page: pageContract })).data.data;
    });

    const myNews = useQuery([myActivityService.getMyNews, pageNews], async () => {
        return (await myActivityService.GetMyNews({ page: pageNews })).data.data;
    });

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
            <div className="flex items-center justify-between">
                <h1 className="capitalize text-xl font-semibold text-gray-600 m-0 mt-10 mb-5">justifikasi</h1>
            </div>
            <JustificationTable fetcher={myJustification} />

            <div className="flex items-center justify-between">
                <h1 className="capitalize text-xl font-semibold text-gray-600 m-0 mt-10 mb-5">cash dan carry</h1>
            </div>
            <CashCarryTable fetcher={myCashCarry} />

            <div className="flex items-center justify-between">
                <h1 className="capitalize text-xl font-semibold text-gray-600 m-0 mt-10 mb-5">agenda</h1>
            </div>
            <AgendaDataTable fetcher={myAgenda} />

            <div className="flex items-center justify-between">
                <h1 className="capitalize text-xl font-semibold text-gray-600 m-0 mt-10 mb-5">Kontrak/SPK/NOPES</h1>
            </div>
            <ContractSpNopesTable fetcher={myContract} />

            <div className="flex items-center justify-between">
                <h1 className="capitalize text-xl font-semibold text-gray-600 m-0 mt-10 mb-5">Berita Acara</h1>
            </div>
            <NewsTable fetcher={myNews} />
        </div>
    );
};

export default MyActivity;
