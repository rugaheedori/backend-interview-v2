import { IsNotEmpty, IsUUID } from "class-validator";

export class GetProductInfo {
    @IsUUID()
    @IsNotEmpty()
    product_id: string;
}