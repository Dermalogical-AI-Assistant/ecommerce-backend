import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateImportFileCommand } from './createImportFile.command';
import { RoleType } from '@prisma/client';
import { Role } from 'src/common/role/role.decorator';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RoleGuard } from 'src/common/role/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';

@ApiTags('Product')
@Controller({
  path: 'import-file',
  version: '1',
})
@ApiBearerAuth()
@UseGuards(AuthenGuard, RoleGuard)
@Role(RoleType.ADMIN)
export class CreateImportFileEndpoint {
  constructor(private readonly commandBus: CommandBus) { }

  @Post()
  @ApiOperation({ summary: 'Create import file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'text/csv') {
        return cb(new Error('Only CSV files are allowed'), false);
      }
      cb(null, true);
    },
  }))
  async import(@UploadedFile() file: Express.Multer.File, @RequestUser() user: LoginUserDto) {
    return await this.commandBus.execute(
      new CreateImportFileCommand(file, user.id),
    );
  }
}
