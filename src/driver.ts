import {Driver} from "@cycle/run";
import {Config} from "pusher-js";
import Stream from "xstream";
import {PayloadInput, PusherSource} from "./interfaces";
import {MainPusherSource} from "./MainPusherSource";

const pusher = require("pusher-js");

export const makePusherDriver = (
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
