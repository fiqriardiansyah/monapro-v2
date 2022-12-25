/* eslint-disable no-redeclare */
/* eslint-disable no-plusplus */
/* eslint-disable guard-for-in */
/* eslint-disable block-scoped-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-useless-concat */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import { message } from "antd";
import type { RcFile } from "antd/es/upload/interface";
import Cookies from "js-cookie";
import { BasePaginationResponse, BaseTableData } from "models";
import { DEFAULT_ERROR_MESSAGE, EMAIL_USER, locale, NAME_USER, ROLE_ACCESS, TOKEN_USER } from "./constant";

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

    static getBase64 = (file: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result as string));
        reader.readAsDataURL(file);
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
        Cookies.remove(NAME_USER);
        Cookies.remove(EMAIL_USER);
        localStorage.removeItem(ROLE_ACCESS);
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

    static createFileNameDownload({ url, text }: { url: string; text: string }): string {
        const extension = url.split('.')[url.split('.').length - 1];
        return `${text}.${extension}`;
    }

    static remainPercent(remaining: number, total: number) {
        const percent = 100
        return percent - ((total - remaining) / total * percent);
    }

    static getRandomIntRange(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static cleanObject = (obj: any) => {
        for (const propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined || !obj[propName]) {
                delete obj[propName];
            }
        }
        return obj
    }

    // json, title, showLabel
    static jsonToCSVConvertor({ json, title, showLabel }: { json: JSON, title: string, showLabel: boolean }) {
        // If json is not an object then JSON.parse will parse the JSON string in an Object
        const arrData = typeof json !== 'object' ? JSON.parse(json) : json;

        let CSV = 'sep=,' + '\r\n\n';

        // This condition will generate the Label/Header
        if (showLabel) {
            var row = "";

            // This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {

                // Now convert each value to string and comma-seprated
                row += `${index},`;
            }

            row = row.slice(0, -1);

            // append Label row with line break
            CSV += `${row}\r\n`;
        }

        // 1st loop is to extract each row
        for (let i = 0; i < arrData.length; i++) {
            var row = "";

            // 2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                row += `"${arrData[i][index]}",`;
            }

            row.slice(0, row.length - 1);

            // add a line break after each row
            CSV += `${row}\r\n`;
        }

        if (CSV === '') {
            alert("Invalid data");
            return;
        }

        // Generate a file name
        let fileName = "My Report ";
        // this will remove the blank-spaces from the title and replace it with an underscore
        fileName += title;

        // Initialize file format you want csv or xls
        const uri = `data:text/csv;charset=utf-8,${escape(CSV)}`;

        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    

        // this trick will generate a temp <a /> tag
        const link = document.createElement("a");
        link.href = uri;

        // set the visibility hidden so it will not effect on your web-layout
        link.style.visibility = "hidden";
        link.download = `${fileName}.csv`;

        // this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
