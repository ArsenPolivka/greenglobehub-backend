import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategoty.entity'
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class CategoriesService {
  private supabase;

  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  }

  async getAllCategories() {
    const { data, error } = await this.supabase
      .from('waste_categories')
      .select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  async getCategoryById(id: number): Promise<Category> {
    const { data, error } = await this.supabase
      .from('waste_categories')
      .select("*")
      .eq('id', id)

    if (error) throw new Error(error.message);

    return data;
  }

  async getAllSubcategories(): Promise<Subcategory[]> {
    const { data, error } = await this.supabase
      .from('category_info')
      .select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  async getSubcategoryById(id: number): Promise<Subcategory> {
    const { data, error } = await this.supabase
      .from('category_info')
      .select('*')
      .eq('id', id);

    if (error) throw new Error(error.message);

    return data;
  }

  async getSubcategoriesByCategoryId(categoryId: number): Promise<Subcategory[]> {
    const { data, error } = await this.supabase
      .from('category_info')
      .select('*')
      .eq('waste_type_id', categoryId);

    if (error) throw new Error(error.message);

    return data;
  }
}
