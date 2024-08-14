import { Body, Controller, Delete, Post, Query, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserReq } from '../auth/type';
import { Like } from '@prisma/client';
import { UnLike } from './dto/unlike.dto';

@Controller('api/like')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @UseGuards(AuthGuard)
  @Post()
  async likeContents(@Req() req: UserReq, @Body() data: Like): Promise<{ success: boolean }> {
    await this.likeService.like(req.user.id, data.product_id);

    return { success: true };
  }

  @UseGuards(AuthGuard)
  @Delete()
  async unLikeContents(@Req() req: UserReq, @Query() data: UnLike): Promise<{ success: boolean }> {
    await this.likeService.unLike(req.user.id, data.product_id);

    return { success: true };
  }
}
