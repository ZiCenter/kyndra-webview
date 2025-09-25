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
}

class WebMessageChannel implements Messaging {
    private port: MessagePort | null = null;

    constructor(private readonly messageCallback: (event: string, data?: any) => void) {
        window.addEventListener('message', this.onWindowMessage.bind(this), false);
    }

    private onWindowMessage(event: MessageEvent) {
        // Ignore messages from the same origin (self-sent messages)
        if (event.source === window) return;

        if (event.ports?.[0] != null) this.registerPort(event.ports[0]);
        if (event.data && typeof event.data === 'string') {
            try {
                const parsed = JSON.parse(event.data);
                if (parsed.event) this.messageCallback(parsed.event, parsed.data);
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
                if (parsed.event) this.messageCallback(parsed.event, parsed.data);
            } catch (e) {
                console.log("Error parsing port message:", e);
            }
        });
        this.port.start();
        this.send('connected');
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

    constructor(private readonly messageCallback: (event: string, data?: any) => void) {
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

    send<E extends keyof MessagingEvents>(event: E, data: any = null) {
        window.sendKyndraMessage && window.sendKyndraMessage({event, data});
    }
}

export class MessageRouter extends TypedEventEmitter<MessagingEvents> implements Messaging {
    private channels: Array<Messaging>;

    constructor() {
        super();
        this.channels = [
            new WebMessageChannel(this.emit.bind(this) as any),
            new JavaScriptHandler(this.emit.bind(this) as any),
        ];
    }

    send<E extends keyof MessagingEvents>(event: E, ...data: Parameters<MessagingEvents[E]>) {
        this.channels.forEach((channel: Messaging) => channel.send(event, data?.[0] ?? null))
        this.emit(event, ...data);
    }
}
