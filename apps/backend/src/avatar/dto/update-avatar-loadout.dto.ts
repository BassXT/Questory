import { IsObject } from 'class-validator';

export class UpdateAvatarLoadoutDto {
  @IsObject()
  equippedItems!: Record<string, string>;
}
