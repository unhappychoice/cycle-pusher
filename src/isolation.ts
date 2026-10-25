import Stream from "xstream";
import {PayloadInput, PusherSource} from "./interfaces";
import {scopeChannelName, scopePayload} from "./scope";

export const isolatePusherSink = (sink: Stream<PayloadInput>, scope: string): Stream<PayloadInput> =>
    sink.map(scopePayload(scope));

export const isolatePusherSource = (source: PusherSource, scope: string): PusherSource =>
    new ScopedPusherSource(source, scope);

class ScopedPusherSource implements PusherSource {
    private source: PusherSource;
    private scope: string;

    constructor(source: PusherSource, scope: string) {
        this.source = source;
        this.scope = scope;
    }

    public select(channelName: string, eventName: string): Stream<any> {
        return this.source.select(scopeChannelName(this.scope)(channelName), eventName);
    }

    public isolateSink(sink: Stream<PayloadInput>, scope: string): Stream<PayloadInput> {
        return isolatePusherSink(sink, scope);
    }

    public isolateSource(source: PusherSource, scope: string): PusherSource {
        return isolatePusherSource(source, scope);
    }
}
