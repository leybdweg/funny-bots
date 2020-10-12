import {Controller, Delete, Get, Param, Post, Put, Req, Res} from '@nestjs/common';
import {BotService} from "./services/bot.service";
import {Request, Response} from 'express';

@Controller()
export class AppController {
    private readonly botService: BotService

    constructor(botService: BotService) {
        this.botService = botService;

    }

    @Get('api/v1/bots')
    async getBots(
        @Res() res: Response,
        @Req() req: Request,
        @Param() params: any
    ): Promise<void> {
        const bots = await this.botService.getBots();
        res.json(bots)
    }

    @Get('api/v1/bots/:botId')
    async getBot(
        @Res() res: Response,
        @Req() req: Request,
        @Param() params: any
    ): Promise<void> {
        const response = await this.botService.getBot(params.botId);
        console.log(response);
        res.json(response);
    }

    @Post('api/v1/bots/:botId')
    async engageBot(
        @Res() res: Response,
        @Req() req: Request,
        @Param() params: any
    ): Promise<void> {
        const response = await this.botService.engageBot(params.botId);
        console.log(response);
        res.json(response);
    }

    @Get('api/v1/bots/:botId/help')
    async askBot(
        @Res() res: Response,
        @Req() req: Request,
        @Param() params: any
    ): Promise<void> {
        const response = await this.botService.getBot(params.botId);
        console.log(response.answer);
        res.send(response.answer);
    }

    @Put('api/v1/bots/:botId/disengage')
    async disengageBot(
        @Res() res: Response,
        @Req() req: Request,
        @Param() params: any) {
        const response = await this.botService.disengageBot(params.botId);
        res.status(200);
        res.send('disengaged');
    }
}
