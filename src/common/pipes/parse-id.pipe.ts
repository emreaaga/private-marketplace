import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const val = parseInt(value, 10);

    if (isNaN(val) || val <= 0) {
      throw new BadRequestException(
        `Invalid parameter "${metadata.data}". A positive integer is expected.`,
      );
    }

    return val;
  }
}
