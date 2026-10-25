import Pusher, {PresenceChannel} from "pusher-js";
import Stream from "xstream";
import {Member, PayloadInput, PayloadOutput, PusherSource} from "./interfaces";
import {isMembershipEvent, MEMBER_ADDED, MEMBER_REMOVED, toMembers} from "./members";

export class MainPusherSource implements PusherSource {
    private events: Stream<PayloadOutput>;
    private pusher: Pusher;
    private subscriptions: string[] = [];

    constructor(pusher: Pusher) {
        this.events = Stream.create<PayloadOutput>();
        this.pusher = pusher;
    }

    public select(channelName: string, eventName: string): Stream<any> {
        return this.channelEvents(channelName)
            .filter(event => event.eventName == eventName)
            .map(event => event.data);
    }

    public selectMembers(channelName: string): Stream<Member[]> {
        const changes$ = this.channelEvents(channelName).filter(event => isMembershipEvent(event.eventName));

        return Stream.merge(this.alreadySubscribed(channelName), changes$)
            .map(() => toMembers((this.pusher.channel(channelName) as PresenceChannel).members));
    }

    public selectMemberAdded(channelName: string): Stream<Member> {
        return this.select(channelName, MEMBER_ADDED);
    }

    public selectMemberRemoved(channelName: string): Stream<Member> {
        return this.select(channelName, MEMBER_REMOVED);
    }

    public isolateSink(sink: Stream<PayloadInput>, _: string): Stream<PayloadInput> {
        return sink;
    }

    public isolateSource(source: PusherSource, _: string): PusherSource {
        return source;
    }

    private channelEvents(channelName: string): Stream<PayloadOutput> {
        this.bindChannel(channelName);

        return this.events.filter(event => event.channelName == channelName);
    }

    private alreadySubscribed(channelName: string): Stream<any> {
        return Stream.of(null).filter(() => this.pusher.channel(channelName).subscribed);
    }

    private bindChannel(channelName: string) {
        if(this.subscriptions.indexOf(channelName) !== -1) return;
        const channel = this.pusher.subscribe(channelName);

        channel.bind_global((eventName: string, data: any) => {
            this.events.shamefullySendNext({ channelName, eventName, data })
        });

        this.subscriptions.push(channelName);
    }
}
