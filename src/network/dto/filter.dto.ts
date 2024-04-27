import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import _ from 'lodash';
import { BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

export enum FilterType {
  CONTAINS = 'CONTAINS',
  BETWEEN_DATES = 'BETWEEN_DATES',
  EQUALS = 'EQUALS',
  OBJECT_ID = 'OBJECT_ID',
  IS_NULL = 'IS_NULL',
  IS_NOT_SET = 'IS_NOT_SET'
}

export class FilterDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  field: string;

  @ApiProperty({ type: 'enum', enum: FilterType })
  @IsEnum(FilterType)
  type: FilterType;

  @ApiProperty({ type: 'string', isArray: true })
  @IsString({ each: true })
  value: string[];

  static toQuery(filters: FilterDto[]) {
    if (filters.length < 1) {
      return undefined;
    }

    return filters.reduce(
      (memo, current) => {
        const orConditions =
          current.type === FilterType.BETWEEN_DATES
            ? [
                {
                  [current.field]: FilterDto.convertValue(
                    current.type,
                    current.value
                  )
                }
              ]
            : current.value.map((v) => ({
                [current.field]: FilterDto.convertValue(current.type, v)
              }));

        if (orConditions.length) {
          memo.$and.push({
            $or: orConditions
          });
        }

        return memo;
      },
      {
        $and: [] as Array<
          | Record<string, ReturnType<(typeof FilterDto)['convertValue']>>
          | {
              $or: Array<
                Record<string, ReturnType<(typeof FilterDto)['convertValue']>>
              >;
            }
        >
      }
    );
  }

  private static convertValue(type: FilterType, value: unknown) {
    switch (type) {
      case FilterType.EQUALS:
        return value;
      case FilterType.CONTAINS:
        return new RegExp(`.*${_.escapeRegExp(String(value))}.*`, 'i');
      case FilterType.BETWEEN_DATES: {
        if (!Array.isArray(value)) {
          throw new BadRequestException(
            'Invalid value for BETWEEN_DATES filter'
          );
        }

        if (value.length === 1) {
          const [gte, lte] = JSON.parse(String(value[0]));
          return { $gte: new Date(gte), $lte: new Date(lte) };
        }

        if (value.length === 2) {
          const [gte, lte] = value;
          return { $gte: new Date(gte), $lte: new Date(lte) };
        }

        throw new BadRequestException('Invalid value for BETWEEN_DATES filter');
      }
      case FilterType.OBJECT_ID:
        return ObjectId.createFromHexString(String(value));
      case FilterType.IS_NULL:
        return null;
      case FilterType.IS_NOT_SET:
        return { $exists: false };
    }
  }
}
