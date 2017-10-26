import {run} from '@cycle/run';
import {div, DOMSource, makeDOMDriver, VNode} from '@cycle/dom';
import Stream from "xstream";
import {makePusherDirver, PayloadInput, PusherSource} from "cycle-pusher";

interface Sources {
    DOM: DOMSource;
    pusher: PusherSource;
}

interface Sinks {
    DOM: Stream<VNode>;
    pusher: Stream<PayloadInput>;
}

function main(sources: Sources): Sinks {
    const vdom$ = sources.pusher.select("channel1", "event1")
        .map(content => JSON.stringify(content))
        .map(content => div(".pusher-event", {}, content));

    const payload$ = Stream.periodic(1000)
        .mapTo(1)
        .fold((acc, number) => acc + number, 0)
        .map(number => ({
            channelName: "channel1",
            eventName: "client-event1",
            data: number.toString()
        }));

    return {
        DOM: vdom$,
        pusher: payload$
    };
}

const app_key = "";
const config = {
    encrypted: true
};

run(main, {
    DOM: makeDOMDriver('#main-container'),
    pusher: makePusherDirver(app_key, ["channel1"], config)
});
