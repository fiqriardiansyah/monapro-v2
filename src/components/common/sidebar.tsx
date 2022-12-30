import React from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { MdDashboard } from "react-icons/md";
import { AiFillDatabase, AiOutlineDeploymentUnit } from "react-icons/ai";
import { BsClipboardData, BsFillCalendarCheckFill, BsPersonCheck } from "react-icons/bs";
import { HiClipboardDocumentCheck, HiOutlineBanknotes, HiScale } from "react-icons/hi2";
import { TfiHandPointUp, TfiWrite } from "react-icons/tfi";
import { CiMoneyBill } from "react-icons/ci";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { GrNotes } from "react-icons/gr";
import { CgNotes } from "react-icons/cg";
import { GiTakeMyMoney } from "react-icons/gi";
import { VscServerProcess } from "react-icons/vsc";

import MonaproImage from "assets/svgs/monapro.svg";
import MonaproIcon from "assets/svgs/monapro-icon.svg";

// utils
import { useLocation, useNavigate } from "react-router-dom";
import {
    AGENDA_CASH_CARRY_PATH,
    AGENDA_DATA_PATH,
    AGENDA_DISPOSITION_PATH,
    AGENDA_FINANCE_PATH,
    DASHBOARD_PATH,
    MASTER_DATA_APPROVAL_POSITION_PATH,
    MASTER_DATA_LOAD_TYPE_PATH,
    MASTER_DATA_ROLE_MANAGE_PATH,
    MASTER_DATA_SOP_PATH,
    MASTER_DATA_SUB_UNIT_PATH,
    PROCUREMENT_CONTRACT_PATH,
    PROCUREMENT_FINANCE_PATH,
    PROCUREMENT_JUSTIFICATION_PATH,
    PROCUREMENT_NEGOTIATION_PATH,
    PROCUREMENT_NEWS_PATH,
    RECAP_PATH,
    SOP_PATH,
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
        // getItem("Agenda", AGENDA_DATA_PATH, <GrNotes />),
        getItem("Agenda", "agenda", <BsFillCalendarCheckFill />, [
            getItem("Agenda Data", AGENDA_DATA_PATH, <GrNotes />),
            getItem("Cash & Carry", AGENDA_CASH_CARRY_PATH, <HiOutlineBanknotes />),
            // getItem("Disposisi Agenda", AGENDA_DISPOSITION_PATH, <CgNotes />), [IMPORTANT] not used
            // getItem("Finance Agenda", AGENDA_FINANCE_PATH, <HiOutlineBanknotes />), [IMPORTANT] not used
        ]),
        getItem("Procurement", "procurement", <HiClipboardDocumentCheck />, [
            getItem("Justifikasi", PROCUREMENT_JUSTIFICATION_PATH, <TfiHandPointUp />),
            // getItem("Negosiasi", PROCUREMENT_NEGOTIATION_PATH, <HiScale />), [IMPORTANT] not used
            getItem("Kontrak/SPK/NOPES", PROCUREMENT_CONTRACT_PATH, <IoDocumentAttachOutline />),
            getItem("Berita Acara", PROCUREMENT_NEWS_PATH, <TfiWrite />),
            getItem("Finance", PROCUREMENT_FINANCE_PATH, <CiMoneyBill />),
        ]),
        getItem("Data Rekap", RECAP_PATH, <BsClipboardData />),
        getItem("Master Data", "master-data", <AiFillDatabase />, [
            getItem("Sub Unit", MASTER_DATA_SUB_UNIT_PATH, <AiOutlineDeploymentUnit />),
            getItem("Jenis Anggaran", MASTER_DATA_LOAD_TYPE_PATH, <GiTakeMyMoney />),
            // getItem("Jabatan Approval", MASTER_DATA_APPROVAL_POSITION_PATH, <BsPersonCheck />), [IMPORTANT] not used
            getItem("Peraturan Internal", MASTER_DATA_SOP_PATH, <VscServerProcess />),
        ]),
    ];

    return (
        <div style={{ borderRight: "1px solid #e7e7e7" }} className="h-screen overflow-y-auto overflow-x-hidden pb-20">
            <div className="w-full relative p-5 flex justify-center">
                <img src={collapse ? MonaproIcon : MonaproImage} alt="monapro" className="h-[80px]" />
            </div>
            <Menu onClick={onClick} defaultSelectedKeys={[DASHBOARD_PATH]} mode="inline" items={items} selectedKeys={[location.pathname]} />
        </div>
    );
}

export default Sidebar;
