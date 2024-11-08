/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-07-29 14:24:19
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-11-08 11:02:12
 * @Description: FileUploadController
 */
import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { responseMessage } from '@/utils';

import { FileUploadDto, SingleFileResponseDto } from './dto';

@ApiTags('文件上传')
@ApiHeader({
  name: 'Authorization',
  required: true,
  description: 'token令牌',
})
@ApiBearerAuth()
@Controller('upload')
export class FileUploadController {
  /**
   * @description: 上传单个文件
   */
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  @Post('single-file')
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: SingleFileResponseDto })
  @ApiBody({
    description: '单个文件上传',
    type: FileUploadDto,
  })
  uploadFile(@UploadedFile() file: Express.Multer.File): CommonType.Response<Express.Multer.File> {
    // 判断环境获取域名
    const hostname = process.env.NODE_ENV === 'production' ? process.env.DOMAIN_NAME : process.env.DEV_DOMAIN_NAME;
    file.path = `${hostname}/static${file.path.replace(/\\/g, '/').replace(/upload/g, '')}`;
    return responseMessage(file);
  }
}
