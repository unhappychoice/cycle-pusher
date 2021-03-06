import Stream from "xstream";
import {PayloadInput, PayloadOutput, PusherSource} from "./interfaces";
import {Pusher} from "pusher-js";

export class MainPusherSource implements PusherSource {
    private events: Stream<PayloadOutput>;
    private pusher: Pusher;
    private subscriptions: string[] = [];

    constructor(pusher: Pusher) {
        this.events = Stream.create<PayloadOutput>();
        this.pusher = pusher;
    }

    public select(channelName: string, eventName: string): Stream<any> {
        this.bindChannel(channelName, eventName);

        return this.events
            .filter(event => event.channelName == channelName)
            .filter(event => event.eventName == eventName)
            .map(event => event.data);
    }

    public isolateSink(sink: Stream<PayloadInput>, _: string): Stream<PayloadInput> {
        return sink;
    }

    public isolateSource(source: PusherSource, _: string): PusherSource {
        return source;
    }

    private bindChannel(channelName: string, eventName: string) {
        const identifier  = `${channelName}/${eventName}`;
        if(this.subscriptions.indexOf(identifier) !== -1) return;
        const channel = this.pusher.subscribe(channelName) as any;

        channel.bind_global((_: any, data: any) => {
            this.events.shamefullySendNext({ channelName, eventName, data })
        });

        this.subscriptions.push(identifier);
    }
}
