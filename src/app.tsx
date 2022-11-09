import React, { useContext } from "react";
import { Button, Spin } from "antd";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import Layout from "components/common/layout";
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
    SIGN_IN_PATH,
} from "utils/routes";

// pages
import SignInPage from "pages/auth/signin";
import DashboardPage from "pages/dashboard";
import SubUnitPage from "pages/masterdata/sub-unit";
import RoleManagementPage from "pages/masterdata/role-management";
import LoadTypePage from "pages/masterdata/load-type";
import ApprovalPositionPage from "pages/masterdata/approval-position";
import AgendaDataPage from "pages/agenda/data";
import AgendaDispositionPage from "pages/agenda/disposition";
import NegotiationPage from "pages/procurement/negotiation";
import ContractPage from "pages/procurement/contract";
import NewsPage from "pages/procurement/news";
import FinancePage from "pages/procurement/finance";
import JustificationPage from "pages/procurement/justification";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path={SIGN_IN_PATH} element={<SignInPage />} />
                    <Route path={MASTER_DATA_SUB_UNIT_PATH} element={<SubUnitPage />} />
                    <Route path={MASTER_DATA_ROLE_MANAGE_PATH} element={<RoleManagementPage />} />
                    <Route path={MASTER_DATA_LOAD_TYPE_PATH} element={<LoadTypePage />} />
                    <Route path={MASTER_DATA_APPROVAL_POSITION_PATH} element={<ApprovalPositionPage />} />
                    <Route path={AGENDA_DATA_PATH} element={<AgendaDataPage />} />
                    <Route path={AGENDA_DISPOSITION_PATH} element={<AgendaDispositionPage />} />
                    <Route path={PROCUREMENT_JUSTIFICATION_PATH} element={<JustificationPage />} />
                    <Route path={PROCUREMENT_NEGOTIATION_PATH} element={<NegotiationPage />} />
                    <Route path={PROCUREMENT_CONTRACT_PATH} element={<ContractPage />} />
                    <Route path={PROCUREMENT_NEWS_PATH} element={<NewsPage />} />
                    <Route path={PROCUREMENT_FINANCE_PATH} element={<FinancePage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
