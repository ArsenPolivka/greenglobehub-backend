import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  private readonly supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }

  async create(createEventDto: CreateEventDto) {
    const { data, error } = await this.supabase
      .from('events')
      .insert([createEventDto])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const newEvent = data;

    const { data: initiativeData, error: initiativeError } = await this.supabase
      .from('initiatives')
      .select('events')
      .eq('id', newEvent.initiativeId)
      .single();

    if (initiativeError) {
      throw new Error(initiativeError.message);
    }

    const updatedEvents = initiativeData.events ? [...initiativeData.events, newEvent.id] : [newEvent.id];

    const { error: updateError } = await this.supabase
      .from('initiatives')
      .update({ events: updatedEvents })
      .eq('id', newEvent.initiativeId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return newEvent;
  }

  async findAll() {
    const { data, error } = await this.supabase.from('events').select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException(`Event #${id} not found`);
    }

    return data;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const { data, error } = await this.supabase
      .from('events')
      .update(updateEventDto)
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
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: `Event ${id} deleted successfully`,
    };
  }
}
