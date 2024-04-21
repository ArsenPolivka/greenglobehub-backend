import { Injectable } from '@nestjs/common';
import { Category } from './models/category.model';
import { Subcategory } from './models/subcategory.model';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class CategoriesService {
  private supabase;

  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }

  async getAllCategories() {
    const { data, error } = await this.supabase
      .from('waste_types')
      .select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  async getCategoryById(id: number): Promise<Category> {
    const { data, error } = await this.supabase
      .from('waste_types')
      .select("*")
      .eq('id', id)

    if (error) throw new Error(error.message);

    return data;
  }

  async getAllSubcategories(): Promise<Subcategory[]> {
    const { data, error } = await this.supabase
      .from('waste_subtypes')
      .select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  async getSubcategoryById(id: number): Promise<Subcategory> {
    const { data, error } = await this.supabase
      .from('waste_subtypes')
      .select('*')
      .eq('id', id);

    if (error) throw new Error(error.message);

    return data;
  }

  async getSubcategoriesByCategoryId(categoryId: number): Promise<Subcategory[]> {
    const { data, error } = await this.supabase
      .from('waste_subtypes')
      .select('*')
      .eq('waste_type_id', categoryId);

    if (error) throw new Error(error.message);

    return data;
  }
}
