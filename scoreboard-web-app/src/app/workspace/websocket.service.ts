// websocket.service.ts

import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    private socket$: WebSocketSubject<any>;

    constructor() {
        // Connect to your WebSocket server (replace with your server URL)
        this.socket$ = webSocket('ws://localhost:8081');
    }

    // Send a message to the server
    sendMessage(message: string): void {
        this.socket$.next({ type: 'message', content: message });
    }

    // Listen for incoming messages
    receiveMessage(): WebSocketSubject<any> {
        return this.socket$;
    }
}
