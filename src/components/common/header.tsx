import { Button, Popover } from "antd";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Utils from "utils";

type Props = {
    title: string;
    action?: React.ReactNode;
    placeholderInput?: string;
    search?: boolean;
    additional?: () => void;
    onSubmitSearch?: (data: string) => void;
};

const Header = ({ additional, title, action, placeholderInput = "Search...", onSubmitSearch, search = true }: Props) => {
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
    };

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (typeof onSubmitSearch === "function") {
            onSubmitSearch(e.target.elements.inputsearch.value);
        }
    };

    return (
        <div className="flex flex-col w-full mb-5 z-10 container mx-auto py-2 mt-5">
            <div className="w-full flex items-center justify-between">
                <>
                    {search && (
                        <form onSubmit={onSubmit} className="relative w-1/2">
                            <input
                                className="w-full bg-white py-2 px-5 pr-10 rounded-lg border-none focus:outline-primary"
                                type="text"
                                name="inputsearch"
                                placeholder={placeholderInput}
                            />
                            <FiSearch className="text-xl text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" />
                        </form>
                    )}
                    {additional && additional()}
                    {!search && !additional && <h1 className="capitalize text-xl font-bold text-gray-600 m-0">{title}</h1>}
                    <Popover
                        content={
                            <div className="flex flex-col">
                                <p className="text-gray-400 m-0 lowercase">fiqri@gmail.com</p>
                                <Button onClick={logoutHandler} className="items-center flex">
                                    Logout
                                </Button>
                            </div>
                        }
                        title="Fiqri ardiansyah"
                        trigger="click"
                        open={open}
                        placement="leftTop"
                        onOpenChange={handleOpenChange}
                    >
                        <FaUserCircle className="w-8 h-8 text-gray-400 cursor-pointer" />
                    </Popover>
                </>
            </div>
            <div className="w-full flex items-center justify-between mt-4">
                {search && <h1 className="capitalize text-xl font-bold text-gray-600 m-0">{title}</h1>}
                <div className="">{action}</div>
            </div>
        </div>
    );
};

export default Header;
