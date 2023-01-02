import React, { useRef } from "react";

import TelkomImage from "assets/telkom.png";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { TDataAgenda } from "./models";

type Props = {
    data: TDataAgenda | null;
    children: (dt: { clickPrint: () => void }) => void;
};

const Print = React.forwardRef<HTMLDivElement, Props>(({ data, children }, ref) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current!,
        pageStyle: `@page { size: auto; }`,
    });

    const dataChildren = {
        clickPrint: handlePrint,
    };

    return (
        <>
            <div ref={componentRef} className="w-full bg-white px-10 py-5 print:block hidden">
                <div className="w-full flex items-center justify-between">
                    <p className="m-0 capitalize font-medium text-xs">
                        agenda surat <br />
                        kategori: surat masuk umum
                    </p>
                    <img src={TelkomImage} alt="" className="h-20" />
                </div>
                <p className="uppercase text-center font-semibold my-2 mb-4">lembar disposisi</p>
                <div className="grid grid-cols-5">
                    <p className="m-0 uppercase ">nomor agenda</p>
                    <p className="m-0 capitalize col-span-2">: {data?.no_agenda_secretariat}</p>

                    <p className="m-0 uppercase ">tanggal diterima</p>
                    <p className="m-0 capitalize">: {data?.date ? moment(data?.date).format("DD-MM-yyyy") : "-"}</p>

                    <p className="m-0 uppercase ">nomor surat</p>
                    <p className="m-0 capitalize col-span-2">: {data?.letter_no}</p>

                    <p className="m-0 uppercase ">tanggal surat</p>
                    <p className="m-0 capitalize">: {data?.letter_date ? moment(data?.letter_date).format("DD-MM-yyyy") : "-"}</p>

                    <p className="m-0 uppercase ">pengirim</p>
                    <p className="m-0 capitalize col-span-4">: {data?.sender || "-"}</p>

                    <p className="m-0 uppercase ">perihal</p>
                    <p className="m-0 capitalize col-span-4">: {data?.about || "-"}</p>
                </div>
                <div className="grid grid-cols-5 h-full border mt-10">
                    <div className="uppercase border border-solid border-black text-center">kepada</div>
                    <div className="uppercase border border-solid col-span-3 border-black text-center">catatan/nota tindakan</div>
                    <div className="uppercase border border-solid border-black text-center">keterangan</div>
                    <div className="uppercase border border-solid border-black text-center h-[700px]" />
                    <div className="uppercase border border-solid col-span-3 border-black text-center" />
                    <div className="uppercase border border-solid border-black text-center" />
                </div>
            </div>
            {children(dataChildren)}
        </>
    );
});

export default Print;
