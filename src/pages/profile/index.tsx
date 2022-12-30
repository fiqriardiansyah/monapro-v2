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

const ProfilePage = () => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || 1;
    const pageJustification = searchParams.get("page-justification") || 1;
    const query = searchParams.get("query") || "";

    const getProfile = useQuery([profileService.getProfile], async () => {
        const res = await profileService.GetProfile();
        return res.data.data;
    });

    const getRole = useQuery([profileService.getRole, page], async () => {
        const res = await profileService.GetRole({ page });
        return res.data.data;
    });

    const myJustification = useQuery([profileService.myJustification, pageJustification], async () => {
        const res = await profileService.MyJustification({ page: pageJustification });
        return res.data.data;
    });

    const addUser = useMutation(
        async (data: FDataUser) => {
            return (await profileService.AddUser(data)).data.data;
        },
        {
            onSuccess: () => {
                message.success("New user added!");
                getRole.refetch();
            },
            onError: (err: any) => {
                message.error(err?.message);
            },
        }
    );

    const editRole = useMutation(
        async (data: Role) => {
            await profileService.EditRole(data);
        },
        {
            onSuccess: () => {
                message.success("Role Edited!");
                getRole.refetch();
            },
            onError: (err: any) => {
                message.error(err?.message);
            },
        }
    );

    const editProfile = useMutation(
        async (data: FEditUser) => {
            await profileService.EditProfile(data);
        },
        {
            onSuccess: () => {
                message.success("Profile Edited!");
                getRole.refetch();
                getProfile.refetch();
            },
            onError: (err: any) => {
                message.error(err?.message);
            },
        }
    );

    const onClickEditHandler = (data: Role) => {
        editRole.mutate(data);
    };

    const onSubmitUser = (data: FDataUser, callback: () => void) => {
        addUser.mutateAsync(data).then(callback).catch(callback);
    };

    const onSubmitEditProfile = (data: FEditUser, callback: () => void) => {
        editProfile.mutateAsync(data).finally(callback);
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
                                <div className="w-full flex items-center gap-6 relative">
                                    {getProfile.data?.profile_image ? (
                                        <img src={getProfile.data.profile_image} alt="" className="w-36 h-36 bg-gray-200 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-36 h-36 bg-gray-200 rounded-full" />
                                    )}
                                    <div className="w-[400px] gap-4 flex flex-col">
                                        <Input disabled value={getProfile.data?.full_name} name="full_name" />
                                        <Input disabled value={getProfile.data?.email} name="email" />
                                    </div>
                                    <ModalEditProfile onSubmit={onSubmitEditProfile} loading={editProfile.isLoading}>
                                        {(dt) => (
                                            <Button onClick={dt.openModal} type="link" className="!absolute !top-0 !right-0">
                                                Edit
                                            </Button>
                                        )}
                                    </ModalEditProfile>
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

            <div className="flex items-center justify-between">
                <h1 className="capitalize text-xl font-semibold text-gray-600 m-0 mt-10 mb-5">data role management</h1>
                <AddUser onSubmit={onSubmitUser} loading={addUser.isLoading}>
                    {(dt) => (
                        <Button onClick={dt.openModal} type="default" icon={<AiOutlinePlus className="mr-2" />} className="BTN-ADD ">
                            Tambah User
                        </Button>
                    )}
                </AddUser>
            </div>
            <RoleManagementTable loading={editRole.isLoading} fetcher={getRole} onClickEdit={onClickEditHandler} />

            <div className="flex items-center justify-between">
                <h1 className="capitalize text-xl font-semibold text-gray-600 m-0 mt-10 mb-5">justifikasi {getProfile.data?.full_name}</h1>
            </div>
            <JustificationTable fetcher={myJustification} />
        </div>
    );
};

export default ProfilePage;
