import { Body, Controller, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserReq } from '../auth/type';
import { EnrollProduct } from './dto/enroll-product.dto';
import { ModifyProduct } from './dto/modify-product.dto';
import { ProductService } from './product.service';
import { RemoveProduct } from './dto/remove-product.dto';

@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post('enroll')
  async enrollProduct(
    @Req() req: UserReq,
    @Body() data: EnrollProduct,
  ): Promise<{ success: boolean }> {
    await this.productService.enrollProduct(req.user.id, data);

    return { success: true };
  }

  @UseGuards(AuthGuard)
  @Put('modify')
  async modifyProduct(
    @Req() req: UserReq,
    @Body() data: ModifyProduct,
  ): Promise<{ success: boolean }> {
    await this.productService.modifyProduct(req.user.id, data);

    return { success: true };
  }

  @UseGuards(AuthGuard)
  @Patch('remove')
  async removeProduct(
    @Req() req: UserReq,
    @Body() data: RemoveProduct,
  ): Promise<{ success: boolean }> {
    await this.productService.removeProduct(req.user.id, data.product_id);

    return { success: true };
  }
}
