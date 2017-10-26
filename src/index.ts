import Driver from "@cycle/run";
import {Config} from "pusher-js";
import Stream from "xstream";

const pusher = require("pusher-js");

export interface PusherSource {
    select(channelName: string, eventName: string): Stream<any>;
    isolateSink(sink: Stream<PayloadInput>, scope: string): Stream<PayloadInput>;
    isolateSource(source: PusherSource, scope: string): PusherSource;
}

class MainPusherSource implements PusherSource {
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

export interface PayloadOutput {
    channelName: string;
    eventName: string;
    data: any;
}

export interface PayloadInput {
    channelName: string;
    eventName: string;
    data: any;
}

export const makePusherDirver = (
    app_key: string, channelNames: string[], configuration: Config
): Driver<Stream<PayloadInput>, PusherSource> => {
    const socket = new pusher(app_key, configuration);
    const channels = channelNames.reduce((obj, name) => {
        obj[name] = socket.subscribe(name);
        return obj;
    }, {});

    return (payload$: Stream<PayloadInput|null>): PusherSource => {
        payload$.subscribe({
            next: (payload) => {
                if (payload) {
                    channels[payload.channelName].trigger(payload.eventName, payload.data);
                }
            },
            error: (_) => {},
            complete: () => {}
        });
        return new MainPusherSource(channels);
    };
};
