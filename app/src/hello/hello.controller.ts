import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { HelloService } from './hello.service';

@Controller('hello')
export class HelloController {
    constructor(private readonly helloService: HelloService) { }

    @Get('world')
    async helloWorld(@Res() res: Response): Promise<void> {
        const message = 'Hello, world!';
        console.log(message);
        res.status(200).send(message);
    }

    @Post('you')
    greetYou(@Body('name') name: string, @Res() res: Response) {
        if (!name) {
            res.status(400).send('Name is required');
            return;
        }

        const message = `Hello, ${name}!`;
        console.log(message);
        res.status(200).send(message);
    }


    @Post('who')
    async greetWho(@Body('name') name: string, @Res() res: Response) {
        if (!name) {
            // If no name is provided, try to get the value from cache
            console.log('getting value from cache')
            const who = await this.helloService.getWho();
            if (who) {
                const message = `Hello from cache, timestamp: ${who}`;
                console.log(message);
                res.status(200).send(message);
                return;
            } else {
                console.log('no value in cache')
                res.status(400).send('Name is required');
                return;
            }
        } else {
            await this.helloService.setWho(name);
            const message = `Hello, ${name}!`;
            console.log(message);
            res.status(200).send(message);
        }
    }
}
