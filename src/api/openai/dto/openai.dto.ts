import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import type { ChatMessage, FetchFn } from 'chatgpt';
import type fetch from 'node-fetch';

export class ProcessProps {
  @ApiProperty()
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  @IsString()
  prompt: string;

  @ApiPropertyOptional()
  @IsOptional()
  options?: ChatContext;

  @ApiProperty()
  @IsNotEmpty({ message: (v) => `'${v.property}'不能为空`, always: true })
  @IsString()
  systemMessage: string;

  @ApiPropertyOptional()
  @IsOptional()
  temperature?: number;

  @ApiPropertyOptional()
  @IsOptional()
  top_p?: number;
}

export interface ChatContext {
  conversationId?: string;
  parentMessageId?: string;
}

export interface RequestOptions {
  message: string;
  lastContext?: { conversationId?: string; parentMessageId?: string };
  process?: (chat: ChatMessage) => void;
  systemMessage?: string;
  temperature?: number;
  top_p?: number;
}

export interface SetProxyOptions {
  fetch?: typeof fetch;
}

export interface UsageResponse {
  total_usage: number;
}

export interface ChatContext {
  conversationId?: string;
  parentMessageId?: string;
}

export interface ChatGPTUnofficialProxyAPIOptions {
  accessToken: string;
  apiReverseProxyUrl?: string;
  model?: string;
  debug?: boolean;
  headers?: Record<string, string>;
  fetch?: FetchFn;
}

export interface ModelConfig {
  apiModel?: ApiModel;
  reverseProxy?: string;
  timeoutMs?: number;
  socksProxy?: string;
  httpsProxy?: string;
  usage?: string;
}

export type ApiModel = 'ChatGPTAPI' | 'ChatGPTUnofficialProxyAPI' | undefined;
