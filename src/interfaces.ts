import Stream from "xstream";

export interface PusherSource {
    select(channelName: string, eventName: string): Stream<any>;
    isolateSink(sink: Stream<PayloadInput>, scope: string): Stream<PayloadInput>;
    isolateSource(source: PusherSource, scope: string): PusherSource;
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
