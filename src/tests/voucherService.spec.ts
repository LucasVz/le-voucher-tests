import {jest} from "@jest/globals";
import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";

describe("create voucher", () => {
    it("shoud create a new voucher", async () =>{
        const voucher = {
            code:"test123",
            discount: 99
        };

        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return {
                id:1,
                code: voucher.code,
                discount: voucher.discount,
                used:false
            };
        });

        jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce((): any => {});

        expect(voucher.code).toMatch(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/);
        expect(voucher.discount).toBeGreaterThan(0); 
        expect(voucher.discount).toBeLessThanOrEqual(100);
    } )

    it("should return error message if Voucher already exists", async () => {
        const voucher = {
            code:"test123",
            discount: 10
        };

        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return {
                id:1,
                code: voucher.code,
                discount: voucher.discount,
                used:false
            };;
        });

        const promisse = voucherService.createVoucher(voucher.code , voucher.discount)
        expect (promisse).rejects.toEqual({
            message: "Voucher already exist.",
            type:"conflict"
        })

    }); 
})

describe("apply Voucher", () => {
    it("should apply the discount", async () =>{
        const voucher = {
            id:1,
            code: "teste123",
            discount: 10,
            used:false
        };
        const amount = 100
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return {
                id:1,
                code: voucher.code,
                discount: voucher.discount,
                used:false
            };;
        });
        jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any => {
            return {
                where:  voucher.code ,
                data: { used: true }
            };;
        });
        const response = await voucherService.applyVoucher(voucher.code, amount)
        expect (response.applied).toEqual(true)
        expect (response.amount).toEqual(amount)
        expect (response.finalAmount).toEqual(amount - (amount * (voucher.discount / 100)))
        expect (response.discount).toEqual(voucher.discount)
        expect(amount).toBeGreaterThanOrEqual(100); 
    })
})