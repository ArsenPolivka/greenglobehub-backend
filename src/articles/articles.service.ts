import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as fs from 'fs-extra';

import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

import { sanitizeFilename } from 'src/utils/helpers';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ArticlesService {
  private supabase: SupabaseClient;
  private s3Client: S3Client;
  private authService: AuthService;

  constructor() {
    this.s3Client = new S3Client({
      forcePathStyle: true,
      region: process.env.REGION,
      endpoint: process.env.STORAGE_BUCKET,
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
        secretAccessKey: process.env.STORAGE_ACCESS_KEY,
      },
    });

    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

    this.authService = new AuthService();

    if (!this.supabase) {
      throw new Error('Supabase client could not be created. Check your environment variables.');
    }
  }

  async create(createArticleDto: CreateArticleDto) {
    const { token, ...articleData } = createArticleDto;

    const user = await this.authService.getUser(token);

    const { data, error } = await this.supabase
      .from('articles')
      .insert([
        {
          ...articleData,
          authorId: user.uniqueId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
      .select();

    if (error) {
      console.error(`Error creating article: ${error.message}`);
      throw new Error(`Error creating article: ${error.message}`);
    }

    return data;
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file provided');
    }

    const fileBuffer = await fs.readFile(file.path);

    const filename = `${sanitizeFilename(file.originalname)}_${new Date().getTime()}`;

    const uploadParams = {
      Bucket: process.env.STORAGE_BUCKET_NAME,
      Key: `public/${filename}`,
      Body: fileBuffer,
      ContentType: file.mimetype,
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      const data = await this.s3Client.send(command);
      const imageUrl = `${process.env.STORAGE_BUCKET_FILE_URL}/object/public/${process.env.STORAGE_BUCKET_NAME}/public/${filename}`;

      return { data, imageUrl };
    } catch (error) {
      console.error(`Error uploading image: ${error.message}`);
      throw new Error(`Error uploading image: ${error.message}`);
    } finally {
      await fs.remove(file.path);
    }
  }

  async findAll() {
    const { data, error } = await this.supabase
      .from('articles')
      .select('*');

    if (error) {
      throw new Error(`Error fetching articles: ${error.message}`);
    }

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Error fetching article with id ${id}: ${error.message}`);
    }

    return data;
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    const { data, error } = await this.supabase
      .from('articles')
      .update({
        ...updateArticleDto,
        updatedAt: new Date(),
      })
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(`Error updating article with id ${id}: ${error.message}`);
    }

    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .from('articles')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(`Error removing article with id ${id}: ${error.message}`);
    }

    return {
      message: 'Article removed successfully',
    };
  }

  async search(query: string) {
    const { data, error } = await this.supabase
      .from('articles')
      .select('*')
      .ilike('title', `%${query}%`);

    if (error) {
      throw new Error(`Error searching articles: ${error.message}`);
    }

    return data;
  }
}
