import { ConsoleLogger, Injectable } from "@nestjs/common";

@Injectable()
export class MyLogger extends ConsoleLogger {
  log(message: any, ...optionalParams: any[]) {
    super.log(`🌈 ${message}`, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    super.error(`🚨 ${message}`, ...optionalParams);
  }
}