import Stream from "xstream";
import {Member, PayloadInput, PusherSource} from "./interfaces";
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
        return this.source.select(this.scoped(channelName), eventName);
    }

    public selectMembers(channelName: string): Stream<Member[]> {
        return this.source.selectMembers(this.scoped(channelName));
    }

    public selectMemberAdded(channelName: string): Stream<Member> {
        return this.source.selectMemberAdded(this.scoped(channelName));
    }

    public selectMemberRemoved(channelName: string): Stream<Member> {
        return this.source.selectMemberRemoved(this.scoped(channelName));
    }

    public isolateSink(sink: Stream<PayloadInput>, scope: string): Stream<PayloadInput> {
        return isolatePusherSink(sink, scope);
    }

    public isolateSource(source: PusherSource, scope: string): PusherSource {
        return isolatePusherSource(source, scope);
    }

    private scoped(channelName: string): string {
        return scopeChannelName(this.scope)(channelName);
    }
}
