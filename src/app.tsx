import React, { useContext } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Layout from "components/common/layout";
import {
    AGENDA_CASH_CARRY_PATH,
    AGENDA_DATA_PATH,
    AGENDA_DISPOSITION_PATH,
    DASHBOARD_PATH,
    MASTER_DATA_APPROVAL_POSITION_PATH,
    MASTER_DATA_LOAD_TYPE_PATH,
    MASTER_DATA_SOP_PATH,
    MASTER_DATA_SUB_UNIT_PATH,
    PROCUREMENT_CONTRACT_PATH,
    PROCUREMENT_FINANCE_PATH,
    PROCUREMENT_JUSTIFICATION_PATH,
    PROCUREMENT_NEWS_PATH,
    PROFILE_PATH,
    RECAP_PATH,
} from "utils/routes";

// pages
import SignInPage from "pages/auth/signin";
import DashboardPage from "pages/dashboard";
import SubUnitPage from "pages/masterdata/sub-unit";
import LoadTypePage from "pages/masterdata/load-type";
import ApprovalPositionPage from "pages/masterdata/approval-position";
import AgendaDataPage from "pages/agenda/data";
import AgendaDispositionPage from "pages/agenda/disposition";
import ContractPage from "pages/procurement/contract";
import NewsPage from "pages/procurement/news";
import FinancePage from "pages/procurement/finance";
import JustificationPage from "pages/procurement/justification";
import DashboardDetail from "pages/dashboard/detail";
import { UserContext } from "context/user";
import ProfilePage from "pages/profile";
import RecapDataPage from "pages/recap-data";
import RegulationPage from "pages/masterdata/regulation";
import CashCarryPage from "pages/agenda/cash-carry";

function App() {
    const { state } = useContext(UserContext);

    return (
        <BrowserRouter>
            {!state.user?.token ? (
                <Routes>
                    <Route path="*" element={<SignInPage />} />
                </Routes>
            ) : (
                <Layout>
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path={PROFILE_PATH} element={<ProfilePage />} />
                        <Route path={`${DASHBOARD_PATH}/:id`} element={<DashboardDetail />} />
                        <Route path={MASTER_DATA_SUB_UNIT_PATH} element={<SubUnitPage />} />
                        <Route path={MASTER_DATA_LOAD_TYPE_PATH} element={<LoadTypePage />} />
                        <Route path={MASTER_DATA_APPROVAL_POSITION_PATH} element={<ApprovalPositionPage />} />
                        <Route path={MASTER_DATA_SOP_PATH} element={<RegulationPage />} />
                        <Route path={AGENDA_DATA_PATH} element={<AgendaDataPage />} />
                        <Route path={AGENDA_CASH_CARRY_PATH} element={<CashCarryPage />} />
                        <Route path={AGENDA_DISPOSITION_PATH} element={<AgendaDispositionPage />} />
                        <Route path={PROCUREMENT_JUSTIFICATION_PATH} element={<JustificationPage />} />
                        <Route path={PROCUREMENT_CONTRACT_PATH} element={<ContractPage />} />
                        <Route path={PROCUREMENT_NEWS_PATH} element={<NewsPage />} />
                        <Route path={PROCUREMENT_FINANCE_PATH} element={<FinancePage />} />
                        <Route path={RECAP_PATH} element={<RecapDataPage />} />
                    </Routes>
                </Layout>
            )}
        </BrowserRouter>
    );
}

export default App;
