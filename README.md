# cycle-pusher
[![npm version](https://badge.fury.io/js/cycle-pusher.svg)](https://badge.fury.io/js/cycle-pusher)
[![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/unhappychoice/cycle-pusher.svg)](https://libraries.io/github/unhappychoice/cycle-pusher)
![npm bundle size](https://img.shields.io/bundlephobia/min/cycle-pusher.svg)
![npm](https://img.shields.io/npm/dt/cycle-pusher.svg)
![GitHub](https://img.shields.io/github/license/unhappychoice/cycle-pusher.svg)

cycle-pusher is pusher client for [cycle.js](https://cycle.js.org/)

### Types
```typescript
const makePusherDirver = (app_key: string, configuration: Config): Driver<Stream<PayloadInput>, PusherSource>

interface PusherSource {
    select(channelName: string, eventName: string): Stream<any>;
    selectMembers(channelName: string): Stream<Member[]>;
    selectMemberAdded(channelName: string): Stream<Member>;
    selectMemberRemoved(channelName: string): Stream<Member>;
}

interface Member {
    id: string;
    info: any;
}

interface PayloadOutput {
    channelName: string;
    eventName: string;
    data: any;
}

interface PayloadInput {
    channelName: string;
    eventName: string;
    data: any;
}
```

### Usage

```typescript
function main(sources) {
    const content$ = sources.pusher.select("channel1", "event1") // Receive messages

    const payload$ = Stream.of({ // Send messages
        channelName: "channel1",
        eventName: "client-event1",
        data: { "key": "value" }
    });

    return {
        pusher: payload$
    };
}

const app_key = "";
const config = { // See pusher document
    encrypted: true
};

run(main, {
    pusher: makePusherDirver(app_key, config)
});

```

### Presence channels

`selectMembers`, `selectMemberAdded` and `selectMemberRemoved` observe the members of a
[presence channel](https://pusher.com/docs/channels/using_channels/presence-channels/).

```typescript
function main(sources) {
    // Current members; emits on subscription and whenever a member joins or leaves
    const members$ = sources.pusher.selectMembers("presence-room");

    // Individual membership changes
    const joined$ = sources.pusher.selectMemberAdded("presence-room");
    const left$ = sources.pusher.selectMemberRemoved("presence-room");

    // ...
}
```

Subscribing to a presence channel requires an authorization endpoint (see `channelAuthorization` in the pusher options).

### Isolation

The source supports [`@cycle/isolate`](https://cycle.js.org/api/isolate.html). An isolated component gets
its own channel namespace: the scope is put in front of every channel name it selects or triggers on,
separated by a `.`. Pusher's `private-`, `private-encrypted-` and `presence-` prefixes stay at the front,
so the channel type does not change.

```typescript
const chat = isolate(Chat, "room1");

// Inside Chat:
sources.pusher.select("messages", "new");                   // listens on "room1.messages"
sources.pusher.select("presence-members", "pusher:member_added"); // listens on "presence-room1.members"
// A sink payload with channelName "private-messages" triggers on "private-room1.messages"
```

Nested isolation stacks the scopes from the outside in (`outer.inner.messages`). Your channel
authorization endpoint has to accept the scoped names.

see example directory for real usage.

### License

see [LICENSE](./LICENSE)

## Author

[@unhappychoice](https://unhappychoice.com)
