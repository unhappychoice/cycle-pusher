import Stream from "xstream";

export interface PusherSource {
    select(channelName: string, eventName: string): Stream<any>;
    selectMembers(channelName: string): Stream<Member[]>;
    selectMemberAdded(channelName: string): Stream<Member>;
    selectMemberRemoved(channelName: string): Stream<Member>;
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

export interface Member {
    id: string;
    info: any;
}
