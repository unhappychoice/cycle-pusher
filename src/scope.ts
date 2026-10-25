import {PayloadInput} from "./interfaces";

const RESERVED_PREFIXES = ["private-encrypted-", "private-", "presence-"];

export const scopeChannelName = (scope: string) => (channelName: string): string => {
    const prefix = reservedPrefixOf(channelName);

    return `${prefix}${scope}.${channelName.slice(prefix.length)}`;
};

export const scopePayload = (scope: string) => (payload: PayloadInput): PayloadInput =>
    ({ ...payload, channelName: scopeChannelName(scope)(payload.channelName) });

const reservedPrefixOf = (channelName: string): string =>
    RESERVED_PREFIXES.filter(prefix => channelName.indexOf(prefix) === 0)[0] || "";
