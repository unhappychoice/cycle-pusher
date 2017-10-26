import Stream from "xstream";
import {PayloadInput, PayloadOutput, PusherSource} from "./interfaces";

export class MainPusherSource implements PusherSource {
    private events: Stream<PayloadOutput>;

    constructor(channels: object) {
        this.events = Stream.create();

        Object.keys(channels).forEach((key) => {
            const channel = channels[key];
            channel.bind_global((event, data) => {
                const channelName = channel.name;
                const eventName = event;
                this.events.shamefullySendNext({ channelName, eventName, data })
            });
        });
    }

    public select(channelName: string, eventName: string): Stream<any> {
        return this.events
            .filter(event => event.channelName == channelName)
            .filter(event => event.eventName == eventName)
            .map(event => event.data);
    }

    public isolateSink(sink: Stream<PayloadInput>, scope: string): Stream<PayloadInput> {
        return sink;
    }

    public isolateSource(source: PusherSource, scope: string): PusherSource {
        return source;
    }
}
