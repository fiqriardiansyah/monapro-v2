import React, { FC, useState } from "react";
import { Layout as LayoutAntd } from "antd";
import { useLocation } from "react-router-dom";
import { PAGES_WITHOUT_LAYOUT } from "utils/routes";
import Sidebar from "./sidebar";
import ScrollToTop from "./scroll-to-top";

type Props = {
    children: any;
};

const Layout = ({ children }: Props) => {
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);

    if (!PAGES_WITHOUT_LAYOUT.indexOf(location.pathname)) {
        return children;
    }

    return (
        <>
            <ScrollToTop />
            <LayoutAntd className="w-full flex min-h-screen">
                <LayoutAntd.Sider
                    className="!overflow-auto !h-screen !fixed !left-0 !top-0 !bottom-0"
                    theme="light"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                    width={300}
                >
                    <Sidebar collapse={collapsed} />
                </LayoutAntd.Sider>
                <LayoutAntd style={{ marginLeft: collapsed ? 80 : 300, transition: "all .4s" }} className="w-screen">
                    <LayoutAntd.Content>{children}</LayoutAntd.Content>
                </LayoutAntd>
            </LayoutAntd>
        </>
    );
};

export default Layout;
