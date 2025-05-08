import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class CattleGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('newLocation')
    handleNewLocation(@MessageBody() data: any) {
        console.log('Ubicación recibida del collar:', data);

        this.server.emit('location_update', data);
    }
}
