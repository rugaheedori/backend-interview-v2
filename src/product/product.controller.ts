import { Body, Controller, Get, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserReq } from '../auth/type';
import { EnrollProduct } from './dto/enroll-product.dto';
import { GetProductInfo } from './dto/get-proguct-detail.dto';
import { ModifyProduct } from './dto/modify-product.dto';
import { RemoveProduct } from './dto/remove-product.dto';
import { ProductService } from './product.service';
import { ProductInfo, ResProductList } from './type';
import { GetProductList } from './dto/get-product-list.dto';

@Controller('api/product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get('list')
  async getProductList(
    @Query() data: GetProductList,
  ): Promise<{ success: boolean; product_list: Array<ResProductList> }> {
    // filter와 정렬조건 들어가야 함
    const productList = await this.productService.getProductList(data);

    return { success: true, product_list: productList };
  }

  @Get('detail')
  async getProductDetail(
    @Query() data: GetProductInfo,
  ): Promise<{ success: boolean; product_info: ProductInfo }> {
    const productInfo = await this.productService.getProductDetail(data.product_id);

    return { success: true, product_info: productInfo };
  }

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
