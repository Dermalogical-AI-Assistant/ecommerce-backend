import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { config } from 'dotenv';

config()

@Injectable()
export class WebsocketMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) { }

    use(socket: Socket, next: (err?: Error) => void) {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                console.log('No token provided');
                return next(new Error('Authentication error: No token provided'));
            }

            const payload = this.jwtService.verify(token, { secret: process.env.ACCESS_TOKEN_SECRET });

            if (!payload?.user) {
                throw new UnauthorizedException('You are not authenticated to do this');
            }
            socket.data.user = payload.user;

            console.log({JWT_Websocket_User: payload.user})

            next();
        } catch (err) {
            console.log('Authentication error:', err.message);
            next(new Error('Authentication error'));
        }
    }
}
