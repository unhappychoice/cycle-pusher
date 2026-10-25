import {Members} from "pusher-js";
import {Member} from "./interfaces";

export const SUBSCRIPTION_SUCCEEDED = "pusher:subscription_succeeded";
export const MEMBER_ADDED = "pusher:member_added";
export const MEMBER_REMOVED = "pusher:member_removed";

const MEMBERSHIP_EVENTS = [SUBSCRIPTION_SUCCEEDED, MEMBER_ADDED, MEMBER_REMOVED];

export const isMembershipEvent = (eventName: string): boolean =>
    MEMBERSHIP_EVENTS.indexOf(eventName) !== -1;

export const toMembers = (members: Members): Member[] =>
    Object.keys(members.members).map(id => ({ id, info: members.members[id] }));
