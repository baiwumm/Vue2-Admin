/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-08-19 16:41:16
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-08-19 16:46:57
 * @Description: 保存菜单数据 Dto
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class SaveMenuDto {
  @ApiProperty({
    type: String,
    description: '父级id',
    default: '0c01ef7d-2f6f-440a-b642-62564d41f473',
    required: false,
  })
  @IsOptional()
  @IsUUID('all', { message: 'parentId 参数不正确' })
  parentId?: string;

  @ApiProperty({
    type: String,
    description: '路由名称',
    default: 'home',
    required: false,
  })
  name?: string;

  @ApiProperty({
    type: String,
    description: '路由路径',
    default: '/home',
    required: false,
  })
  path?: string;

  @ApiProperty({
    type: String,
    description: '组件路径',
    default: 'home/index',
    required: false,
  })
  component?: string;

  @ApiProperty({
    type: String,
    description: '重定向地址',
    default: 'home/index',
    required: false,
  })
  redirect?: string;

  @ApiProperty({
    type: Boolean,
    description: '是否隐藏',
    default: false,
    required: false,
  })
  hidden?: boolean;

  @ApiProperty({
    type: Object,
    description: '路由元信息',
    default: {
      title: 'menu.home',
      icon: 'home',
      keepAlive: true,
    },
    required: false,
  })
  meta?: CommonType.RouteMeta;

  @ApiProperty({
    type: Number,
    description: '排序',
    default: 1,
  })
  @IsNumber(
    {},
    {
      message: '排序必须为数字',
    },
  )
  sort: number;
}
