import { Injectable } from '@nestjs/common';

@Injectable()
export default class AppService {
  // Disable the class-methods-use-this rule for this method
  // eslint-disable-next-line class-methods-use-this
  getHello(): string {
    return 'Hello World!';
  }
}
