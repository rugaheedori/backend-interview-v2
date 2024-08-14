import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { MyLogger } from '../utils/logger';

@Injectable()
export class ReviewRepository {
  constructor(private dbService: DbService, private lgger: MyLogger) {}
}
