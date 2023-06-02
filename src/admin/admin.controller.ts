import { Controller, Get, Render } from '@nestjs/common';

@Controller('admin-dimitriaef-nico-3005')
export class AdminController {
  @Get() // 2205088165 or B09ZYQRVQB
  @Render('admin')
  async getAdminIndex() {
    return {
      title: `Auto Edit ADMIN`
    }

  }
}
