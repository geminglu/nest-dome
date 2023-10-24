import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExtraModels, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ResultData } from 'src/utils/result';
import { OpenaiService } from './openai.service';
import { ResServerErrorResponse, ResSuccess, ResUnauthorized } from 'src/utils/api.Response';
import { ProcessProps } from './dto/openai.dto';
import { Public } from 'src/decorators/public.decorator';
// import type { ChatGPTAPIOptions, ChatMessage, SendMessageOptions } from 'chatgpt';

@Controller({
  path: 'chatGpt',
  version: '1',
})
@ApiTags('chat')
@Public()
@ResServerErrorResponse()
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  // @Post('chat-process')
  // @ResSuccess()
  // async process(@Body() body: ProcessProps, @Res() res: Response) {
  //   const { prompt, options = {}, systemMessage, temperature, top_p } = body;
  //   console.log(prompt, options, systemMessage, temperature, top_p);

  //   res.setHeader('Content-type', 'application/octet-stream');
  //   try {
  //     let firstChunk = true;
  //     await this.openaiService.chatReplyProcess({
  //       message: prompt,
  //       lastContext: options,
  //       process: (chat: ChatMessage) => {
  //         res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`);
  //         firstChunk = false;
  //       },
  //       systemMessage,
  //       temperature,
  //       top_p,
  //     });
  //   } catch (error) {
  //     res.write(JSON.stringify(error));
  //   } finally {
  //     res.end();
  //   }
  // }

  @Post('chat-process')
  @HttpCode(200)
  @ResSuccess()
  async process(@Body() body: ProcessProps, @Res() res: Response) {
    const { prompt, options = {}, systemMessage, temperature, top_p } = body;
    try {
      res.setHeader('Content-type', 'application/octet-stream');
      await this.openaiService.chatReplyProcess();
      res.end();
    } catch (error) {
      throw new Error(error.message);
    } finally {
    }
  }
}
