import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { Role } from 'src/common/role/role.decorator';
import { AuthenGuard } from 'src/common/guard/authen.guard';
import { RoleGuard } from 'src/common/role/role.guard';
import { CommandBus } from '@nestjs/cqrs';
import { ImportProductsCommand } from './importProducts.command';
import { Express } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { RequestUser } from 'src/common/decorator/requestUser.decorator';
import { LoginUserDto } from 'src/common/dto/loginUser.dto';

@ApiTags('Product')
@Controller({
  path: 'import-products',
  version: '1',
})
@ApiBearerAuth()
// @UseGuards(AuthenGuard, RoleGuard)
// @Role(RoleType.ADMIN)
export class ImportProductsEndpoint {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Import products from uploaded CSV file' })
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
      destination: './uploads', // Files will be saved locally on disk in the ./uploads
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Get extension (.csv)
        // const name = path.basename(file.originalname, ext).replace(/\s/g, ''); // Remove whitespace from filename
        // cb(null, `${name}-${Date.now()}${ext}`);

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
  async import(@UploadedFile() file: Express.Multer.File, @RequestUser() user:LoginUserDto) {
    return await this.commandBus.execute(
      new ImportProductsCommand(file, 'eae0001e-c30c-450f-a41b-4934eabfc656'),
    );
  }
}
