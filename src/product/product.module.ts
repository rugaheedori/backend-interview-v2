import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MyLogger } from '../utils/logger';
import { ProductRepository } from './product.repository';
import { DbModule } from '../db/db.module';

@Module({
  imports: [DbModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, MyLogger]
})
export class ProductModule {}
