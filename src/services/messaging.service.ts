import type {MessagingEvents} from "@/types/messaging.types.ts";
import {TypedEventEmitter} from "@/utils/types.ts";

declare global {
    interface Window {
        inboundKyndraMessage: (message: any) => void;
        sendKyndraMessage?: (message: any) => void;
    }
}

export interface Messaging {
    send<E extends keyof MessagingEvents>(event: E, data?: any): void;
    listen(callback: (event: string, data?: any) => void): void;
}

class WebMessageChannel implements Messaging {
    private port: MessagePort | null = null;
    private messageCallback: ((event: string, data?: any) => void) | null = null;

    constructor() {
        window.addEventListener('message', this.onWindowMessage.bind(this), false);
    }

    private onWindowMessage(event: MessageEvent) {
        if (event.ports?.[0] != null) this.registerPort(event.ports[0]);
        if (event.data && typeof event.data === 'string') {
            try {
                const parsed = JSON.parse(event.data);
                if (parsed.event && this.messageCallback) {
                    this.messageCallback(parsed.event, parsed.data);
                }
            } catch (e) {
                // Ignore non-JSON messages
            }
        }
    }

    private registerPort(port: MessagePort) {
        console.log('Setting up WebMessageChannel communication');
        this.port = port;
        this.port.addEventListener('message', (event) => {
            try {
                const parsed = JSON.parse(event.data);
                if (parsed.event && this.messageCallback) {
                    this.messageCallback(parsed.event, parsed.data);
                }
            } catch (e) {
                console.log("Error parsing port message:", e);
            }
        });
        this.port.start();
        this.send('connected');
    }

    listen(callback: (event: string, data?: any) => void): void {
        this.messageCallback = callback;
    }

    send<E extends keyof MessagingEvents>(event: E, data: any = null) {
        if (this.port) {
            this.port.postMessage(JSON.stringify({event, data}));
        } else {
            window.postMessage(JSON.stringify({event, data}), '*');
        }
    }
}

class JavaScriptHandler implements Messaging {
    private static _instance: JavaScriptHandler;
    private messageCallback: ((event: string, data?: any) => void) | null = null;

    constructor() {
        // Make this a singleton to ensure only one instance handles the messages
        if (JavaScriptHandler._instance) {
            return JavaScriptHandler._instance;
        }
        JavaScriptHandler._instance = this;

        // Set up the global message handler for incoming commands
        window.inboundKyndraMessage = (message: any) => {
            if (message.event && this.messageCallback) {
                this.messageCallback(message.event, message.data);
            }
        };

        this.send('connected');
    }

    listen(callback: (event: string, data?: any) => void): void {
        this.messageCallback = callback;
    }

    send<E extends keyof MessagingEvents>(event: E, data: any = null) {
        window.sendKyndraMessage && window.sendKyndraMessage({event, data});
    }
}

export class MessageRouter extends TypedEventEmitter<MessagingEvents> implements Messaging {
    private channels: Array<Messaging>;

    constructor() {
        super();
        this.channels = [
            new WebMessageChannel(),
            new JavaScriptHandler(),
        ];

        // Set up listeners for all channels to handle inbound commands
        this.channels.forEach(channel => {
            channel.listen((event: string, data?: any) => {
                // Emit the event through the TypedEventEmitter so components can listen to it
                this.emit(event as keyof MessagingEvents, data);
            });
        });
    }

    listen(callback: (event: string, data?: any) => void): void {
        // MessageRouter uses the TypedEventEmitter pattern, so this method
        // can be used for direct callback registration if needed
        this.channels.forEach(channel => channel.listen(callback));
    }

    send<E extends keyof MessagingEvents>(event: E, ...data: Parameters<MessagingEvents[E]>) {
        this.channels.forEach((channel: Messaging) => channel.send(event, data?.[0] ?? null))
    }
}
