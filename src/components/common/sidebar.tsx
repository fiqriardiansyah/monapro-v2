import React from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { MdDashboard } from "react-icons/md";
import { AiFillDatabase } from "react-icons/ai";
import { BsFillCalendarCheckFill } from "react-icons/bs";

// utils
import { useLocation, useNavigate } from "react-router-dom";
import {
    AGENDA_DATA_PATH,
    AGENDA_DISPOSITION_PATH,
    DASHBOARD_PATH,
    MASTER_DATA_APPROVAL_POSITION_PATH,
    MASTER_DATA_LOAD_TYPE_PATH,
    MASTER_DATA_ROLE_MANAGE_PATH,
    MASTER_DATA_SUB_UNIT_PATH,
    PROCUREMENT_CONTRACT_PATH,
    PROCUREMENT_FINANCE_PATH,
    PROCUREMENT_JUSTIFICATION_PATH,
    PROCUREMENT_NEGOTIATION_PATH,
    PROCUREMENT_NEWS_PATH,
} from "utils/routes";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[], type?: "group"): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

type Props = {
    collapse: boolean;
};

function Sidebar({ collapse }: Props) {
    const navigate = useNavigate();
    const location = useLocation();

    const onClick: MenuProps["onClick"] = (e) => {
        navigate(e.key);
    };

    const items: MenuProps["items"] = [
        getItem("Dashboard", "/", <MdDashboard />),
        getItem("Master Data", "master-data", <AiFillDatabase />, [
            getItem("Sub Unit", MASTER_DATA_SUB_UNIT_PATH),
            getItem("Role Management", MASTER_DATA_ROLE_MANAGE_PATH),
            getItem("Load Type", MASTER_DATA_LOAD_TYPE_PATH),
            getItem("Approval Position", MASTER_DATA_APPROVAL_POSITION_PATH),
        ]),
        getItem("Agenda", "agenda", <BsFillCalendarCheckFill />, [
            getItem("Agenda Data", AGENDA_DATA_PATH),
            getItem("Agenda Disposition", AGENDA_DISPOSITION_PATH),
        ]),
        getItem("Procurement", "procurement", <AiFillDatabase />, [
            getItem("Justification", PROCUREMENT_JUSTIFICATION_PATH),
            getItem("Negotiation", PROCUREMENT_NEGOTIATION_PATH),
            getItem("Contract, Sp, Nopes", PROCUREMENT_CONTRACT_PATH),
            getItem("News", PROCUREMENT_NEWS_PATH),
            getItem("Finance", PROCUREMENT_FINANCE_PATH),
        ]),
    ];

    return (
        <div style={{ borderRight: "1px solid #e7e7e7" }} className="h-screen overflow-y-auto overflow-x-hidden">
            <div className="w-full relative p-5">
                <h1 className=" rounded-lg text-center">MONAPRO</h1>
            </div>
            <Menu onClick={onClick} defaultSelectedKeys={[DASHBOARD_PATH]} mode="inline" items={items} selectedKeys={[location.pathname]} />
        </div>
    );
}

export default Sidebar;
