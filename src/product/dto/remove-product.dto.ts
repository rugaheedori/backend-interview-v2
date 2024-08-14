import { IsNotEmpty, IsUUID } from "class-validator";

export class RemoveProduct {
    @IsUUID()
    @IsNotEmpty()
    product_id: string;
}