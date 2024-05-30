import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { UpdateInitiativeDto } from './dto/update-initiative.dto';

@Injectable()
export class InitiativesService {
  private readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }

  async create(createInitiativeDto: CreateInitiativeDto) {
    const { data, error } = await this.supabase
      .from('initiatives')
      .insert([createInitiativeDto])
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.from('initiatives').select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('initiatives')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException(`Initiative ${id} not found`);
    }

    return data;
  }

  async findAllEventsById(id: string) {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('initiativeId', id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async update(id: string, updateInitiativeDto: UpdateInitiativeDto) {
    const { data, error } = await this.supabase
      .from('initiatives')
      .update(
        {
          ...updateInitiativeDto,
          updatedAt: new Date().toISOString(),
        },
      )
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .from('initiatives')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: `Initiative ${id} has been deleted successfully`,
    };
  }
}
