import Driver from "@cycle/run";
import Stream from "xstream";

export interface PusherSource {
    isolateSink(sink: Stream<PayloadInput>, scope: string): Stream<PayloadInput>;
    isolateSource(source: PusherSource, scope: string): PusherSource;
}

class MainPusherSource implements PusherSource {
    public isolateSink(sink: Stream<PayloadInput>, scope: string): Stream<PayloadInput> {

    }

    public isolateSource(source: PusherSource, scope: string): PusherSource {

    }
}

export interface PayloadInput {

}

export const makePusherDirver = (): Driver<Stream<PayloadInput>, PusherSource> => {
    const pusherDriver = (): PusherSource => {

    };
    return pusherDriver();
};
