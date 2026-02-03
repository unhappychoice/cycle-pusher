import {Driver} from "@cycle/run";
import Pusher, {Options} from "pusher-js";
import Stream from "xstream";
import {PayloadInput, PusherSource} from "./interfaces";
import {MainPusherSource} from "./MainPusherSource";

export const makePusherDriver = (
    app_key: string, configuration: Options
): Driver<Stream<PayloadInput>, PusherSource> => {
    const socket = new Pusher(app_key, configuration);

    return (payload$: Stream<PayloadInput|null>): PusherSource => {
        payload$.subscribe({
            next: (payload) => {
                if (payload) {
                    socket.channel(payload.channelName).trigger(payload.eventName, payload.data);
                }
            },
            error: (_) => {},
            complete: () => {}
        });
        return new MainPusherSource(socket);
    };
};
