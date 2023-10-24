import { Injectable } from '@nestjs/common';
import axios from 'axios';
import type { AxiosResponse, AxiosRequestConfig, AxiosInstance, AxiosError } from 'axios';
import type { ResultType } from 'src/types/request';
import { isNotEmptyString } from '../../utils/is';
import { Configuration, OpenAIApi } from 'openai';
import { ResultData } from 'src/utils/result';
import {
  RequestOptions,
  SetProxyOptions,
  UsageResponse,
  ApiModel,
  ChatContext,
  ChatGPTUnofficialProxyAPIOptions,
  ModelConfig,
} from './dto/openai.dto';
// import 'isomorphic-fetch';
// import { ChatGPTAPIOptions, ChatMessage, SendMessageOptions } from 'chatgpt';
// import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from 'chatgpt';
// import { SocksProxyAgent } from 'socks-proxy-agent';
// import httpsProxyAgent from 'https-proxy-agent';
// import fetch from 'node-fetch';

// const { HttpsProxyAgent } = httpsProxyAgent;

// const ErrorCodeMessage: Record<string, string> = {
//   401: '[OpenAI] 提供错误的API密钥 | Incorrect API key provided',
//   403: '[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later',
//   502: '[OpenAI] 错误的网关 |  Bad Gateway',
//   503: '[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later',
//   504: '[OpenAI] 网关超时 | Gateway Time-out',
//   500: '[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error',
// };

@Injectable()
export class OpenaiService {
  openaiService: AxiosInstance;
  baseURL: string;
  constructor() {
    this.baseURL = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com';
    this.openaiService = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        baseURL: this.baseURL,
      },
    });

    // 响应拦截器
    this.openaiService.interceptors.response.use(
      (response: AxiosResponse<ResultType>) => {
        return Promise.resolve(response);
      },
      (error: AxiosError<ResultType>) => {
        return Promise.reject(error);
      },
    );
  }

  requestOpenai<T = any>(config: AxiosRequestConfig) {
    return new Promise<ResultType<T>>((resolve, reject) => {
      this.openaiService
        .request<ResultType<T>>(config)
        .then((response: AxiosResponse<ResultType<T>>) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response);
        });
    });
  }

  async chatReplyProcess() {
    try {
      const result = await this.requestOpenai({
        url: `${this.baseURL}/v1/chat/completions`,
        method: 'post',
        data: {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'Hello world' },
          ],
        },
      });
      return ResultData.ok(result);
    } catch (error) {
      console.log(2312, error.data.error.message);
      return ResultData.ok(error.data.error.message);
    }
  }
}
