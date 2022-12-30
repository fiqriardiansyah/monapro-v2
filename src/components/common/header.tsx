import { Button, Popover, Space } from "antd";
import { UserContext } from "context/user";
import React, { useContext, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import Utils from "utils";
import { PROFILE_PATH } from "utils/routes";

type Props = {
    title?: string;
    action?: React.ReactNode;
    placeholderInput?: string;
    search?: boolean;
    back?: () => void;
    additional?: () => void;
    onSubmitSearch?: (data: string) => void;
};

const Header = ({ additional, title, action, placeholderInput = "Search...", onSubmitSearch, search = true, back }: Props) => {
    const { state, setState } = useContext(UserContext);

    const [open, setOpen] = useState(false);

    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const logoutHandler = () => {
        hide();
        Utils.SignOut();
        if (setState) {
            setState((prev) => ({
                ...prev,
                user: null,
            }));
        }
    };

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (typeof onSubmitSearch === "function") {
            onSubmitSearch(e.target.elements.inputsearch.value);
        }
    };

    return (
        <div className="flex flex-col w-full 5 z-10 container mx-auto py-2 mt-5">
            <div className="w-full flex items-center justify-between">
                <>
                    {(search || back) && (
                        <Space className="">
                            <>
                                {back && back()}
                                {search ? (
                                    <form onSubmit={onSubmit} className="relative !w-[300px]">
                                        <input
                                            className="w-full bg-white py-2 px-5 pr-10 rounded-lg border-none focus:outline-primary"
                                            type="text"
                                            name="inputsearch"
                                            placeholder={placeholderInput}
                                        />
                                        <FiSearch className="text-xl text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" />
                                    </form>
                                ) : (
                                    <p />
                                )}
                            </>
                        </Space>
                    )}
                    {additional && additional()}
                    {title && !search && !additional && <h1 className="capitalize text-xl font-bold text-gray-600 m-0">{title}</h1>}
                    <Popover
                        content={
                            <div className="flex flex-col">
                                <p className="text-gray-400 m-0 lowercase">{state.user?.email}</p>
                                <Button onClick={logoutHandler} className="items-center flex mt-4">
                                    Logout
                                </Button>
                            </div>
                        }
                        title={state.user?.fullname}
                        trigger="hover"
                        open={open}
                        placement="leftTop"
                        onOpenChange={handleOpenChange}
                    >
                        <Link to={PROFILE_PATH}>
                            <Space direction="horizontal">
                                <p className="m-0 capitalize font-medium text-gray-600">Hello, {state.user?.fullname || ""}</p>
                                {state.user?.profile_image ? (
                                    <img
                                        src={state.user?.profile_image}
                                        alt="profile"
                                        className="w-9 h-9 cursor-pointer rounded-full object-cover border-solid border-white border"
                                    />
                                ) : (
                                    <div className="w-9 h-9 cursor-pointer rounded-full object-cover border-solid border-white border bg-gray-200" />
                                )}
                            </Space>
                        </Link>
                    </Popover>
                </>
            </div>
            <div className="w-full flex items-center justify-between mt-4">
                {search ? <h1 className="capitalize text-xl font-bold text-gray-600 m-0">{title}</h1> : <p />}
                <div className="">{action}</div>
            </div>
        </div>
    );
};

export default Header;
