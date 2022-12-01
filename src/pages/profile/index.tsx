import { Alert, Button, Card, Input, Skeleton } from "antd";
import Header from "components/common/header";
import State from "components/common/state";
import { StateContext } from "context/state";
import { Role } from "models";
import { TDataRoleManagement } from "modules/profile/models";
import RoleManagementTable from "modules/profile/role-table";
import React, { useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoMdArrowBack } from "react-icons/io";
import { useMutation, useQuery } from "react-query";
import { Link, useSearchParams } from "react-router-dom";
import profileService from "services/api-endpoints/profile";

const ProfilePage = () => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const query = searchParams.get("query") || "";

    const getProfile = useQuery([profileService.getProfile], async () => {
        const res = await profileService.GetProfile();
        return res.data.data;
    });

    const getRole = useQuery([profileService.getRole, page], async () => {
        const res = await profileService.GetRole({ page });
        return res.data.data;
    });

    const editRole = useMutation(
        async (data: Role) => {
            await profileService.EditRole(data);
        },
        {
            onSuccess: () => {
                getRole.refetch();
            },
        }
    );

    const onClickEditHandler = (data: Role) => {
        console.log(data);
        editRole.mutate(data);
    };

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
            <State data={getProfile.data} isLoading={getProfile.isLoading} isError={getProfile.isError}>
                {(state) => (
                    <>
                        <State.Data state={state}>
                            <h1 className="capitalize text-xl font-bold text-gray-600 m-0">profile</h1>
                            <span className="">Hi, {getProfile.data?.full_name} selamat datang kembali</span>
                            <Card className="!mt-6 !w-full">
                                <div className="w-full flex items-center gap-6">
                                    {getProfile.data?.profile_image ? (
                                        <img src={getProfile.data.profile_image} alt="" className="w-36 h-36 bg-gray-200 rounded-full" />
                                    ) : (
                                        <FaUserCircle className="w-36 h-36 text-gray-300 cursor-pointer" />
                                    )}
                                    <div className="grid grid-cols-2 gap-6 flex-1">
                                        <Input disabled value={getProfile.data?.full_name} name="full_name" />
                                        <Input disabled value={getProfile.data?.email} name="email" />
                                    </div>
                                </div>
                            </Card>
                        </State.Data>
                        <State.Loading state={state}>
                            <Skeleton paragraph={{ rows: 2 }} />
                            <Skeleton avatar paragraph={{ rows: 4 }} className="mt-4" />
                        </State.Loading>
                        <State.Error state={state}>
                            <Alert message={(getProfile.error as any)?.message} type="error" />
                        </State.Error>
                    </>
                )}
            </State>

            <h1 className="capitalize text-xl font-semibold text-gray-600 m-0 mt-10 mb-5">data role management</h1>
            <RoleManagementTable loading={editRole.isLoading} fetcher={getRole} onClickEdit={onClickEditHandler} />
        </div>
    );
};

export default ProfilePage;
