import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories() {
    return await this.categoriesService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.getCategoryById(id);
  }

  @Get('subcategories')
  async getAllSubcategories() {
    return this.categoriesService.getAllSubcategories();
  }

  @Get('subcategories/:id')
  async getSubcategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getSubcategoryById(id);
  }

  @Get(':id/subcategories')
  async getSubcategoriesByCategoryId(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getSubcategoriesByCategoryId(+id);
  }
}
