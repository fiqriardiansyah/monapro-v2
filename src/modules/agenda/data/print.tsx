import moment from "moment";
import React from "react";
import { TDataAgenda } from "./models";

type Props = {
    data: TDataAgenda | null;
};

const Print = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
    return (
        <div ref={ref} className="w-full p-5">
            <h1 className="font-semibold text-center mb-2 text-xl">LEMBAR DISPOSISI</h1>
            <div className="w-full flex">
                <div className="w-[70%] ">
                    <p className="m-0  flex ">
                        <span className="!w-[130px] block">NOMOR AGENDA</span>
                        <span className="capitalize block">: {data?.no_agenda_disposition || "-"}</span>
                    </p>
                    <p className="m-0  flex ">
                        <span className="!w-[130px] block">NOMOR SURAT</span>
                        <span className="capitalize block">: {data?.letter_no || "-"}</span>
                    </p>
                    <p className="m-0  flex ">
                        <span className="!w-[130px] block">PENGIRIM</span>
                        <span className="capitalize block">: {data?.sender || "-"}</span>
                    </p>
                    <p className="m-0  flex ">
                        <span className="!w-[130px] block">PERIHAL</span>
                        <span className="capitalize block">: {data?.about || "-"}</span>
                    </p>
                </div>
                <div className="">
                    <p className="m-0  flex ">
                        <span className="!w-[130px] block">TANGGAL KIRIM :</span>
                        <span className="capitalize block">12-09-2000</span>
                    </p>
                    <p className="m-0  flex ">
                        <span className="!w-[130px] block">TANGGAL SURAT :</span>
                        <span className="capitalize block">{data?.letter_date ? moment(data.letter_date).format("DD-MM-yyyy") : "-"}</span>
                    </p>
                </div>
            </div>
            <div className="w-full">wkwkwk</div>
        </div>
    );
});

export default Print;
