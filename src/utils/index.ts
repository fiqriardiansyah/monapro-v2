/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import { message } from "antd";
import type { RcFile } from "antd/es/upload/interface";
import Cookies from "js-cookie";
import { BasePaginationResponse, BaseTableData } from "models";
import { DEFAULT_ERROR_MESSAGE, locale, TOKEN_USER } from "./constant";

export default class Utils {
    static charCodeA = 65;

    static convertToStringFormat(num?: number | null): string {
        if (num === null || num === undefined) return "-";
        const mergeNum = num?.toString().split(".").join("");
        return mergeNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    static convertToIntFormat(str?: string): number {
        if (str === null || str === undefined) return 0;
        return parseInt(str.toString().split(".").join(""), 10);
    }

    static cutText(length: number, string?: string): string {
        if (!string) return "-";
        return string?.length > length ? `${string.slice(0, length)}...` : string;
    }

    static imageSafety(image: string | undefined | null): string {
        return image ?? "/images/placeholder.png";
    }

    static currencyFormatter = (selectedCurrOpt: any) => (value: any) => {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: selectedCurrOpt.split("::")[1],
        }).format(value);
    };

    static currencyParser = (val: any) => {
        try {
            // for when the input gets clears
            if (typeof val === "string" && !val.length) {
                val = "0.0";
            }

            // detecting and parsing between comma and dot
            const group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, "");
            const decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, "");
            let reversedVal = val.replace(new RegExp(`\\${group}`, "g"), "");
            reversedVal = reversedVal.replace(new RegExp(`\\${decimal}`, "g"), ".");
            //  => 1232.21 €

            // removing everything except the digits and dot
            reversedVal = reversedVal.replace(/[^0-9.]/g, "");
            //  => 1232.21

            // appending digits properly
            const digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
            const needsDigitsAppended = digitsAfterDecimalCount > 2;

            if (needsDigitsAppended) {
                reversedVal *= 10 ** (digitsAfterDecimalCount - 2);
            }

            return Number.isNaN(reversedVal) ? 0 : reversedVal;
        } catch (error) {
            console.error(error);
        }
    };

    static getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    static toBase64(file: File) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    static beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("Format gambar hanya boleh jpg/jpeg/png");
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("Ukuran gambar tidak boleh lebih dari 2MB!");
        }
        return isJpgOrPng && isLt2M;
    };

    static SignOut = () => {
        Cookies.remove(TOKEN_USER);
        window.location.href = "/";
    };

    static pause(time: number) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res(true);
            }, time);
        });
    }

    static async imageInfo(file: File) {
        try {
            const toBase64 = await this.toBase64(file);
            return {
                uri: URL.createObjectURL(new Blob([file], { type: "application/zip" })),
                fileBase64: toBase64 as string | ArrayBuffer | null,
                file,
            };
        } catch (e: any) {
            throw new Error("oops something went wrong converting image to base64");
        }
    }

    static toBaseTable<T extends { id: string | number }, R>(data: BasePaginationResponse<T>): BasePaginationResponse<R> {
        return {
            ...data,
            list: data.list?.map(
                (el) =>
                ({
                    ...el,
                    key: el.id,
                } as R)
            ),
        };
    }

}
