import test from "ava";
import { AdminKinds, Context, setupEventContext } from "../shared/test_helpers";
import {
  EventContext,
  ListenersCollector,
  ListernerPlacement,
  TajribaEvent,
} from "./events";

test.serial("ListenersCollector tracks listeners", async (t) => {
  const listeners = new ListenersCollector<Context, AdminKinds>();

  /* c8 ignore next */
  const startCB = (_: EventContext<Context, AdminKinds>) => {};
  listeners.on("start", startCB);
  t.deepEqual(listeners.starts, [
    { placement: ListernerPlacement.None, callback: startCB },
  ]);

  /* c8 ignore next */
  const tajCB = (_: EventContext<Context, AdminKinds>) => {};
  listeners.on(TajribaEvent.ParticipantConnect, tajCB);
  t.deepEqual(listeners.tajEvents, [
    {
      placement: ListernerPlacement.None,
      event: TajribaEvent.ParticipantConnect,
      callback: tajCB,
    },
  ]);

  /* c8 ignore next */
  const kindCB = (_: EventContext<Context, AdminKinds>) => {};
  listeners.on("game", kindCB);
  t.deepEqual(listeners.kindListeners, [
    { placement: ListernerPlacement.None, kind: "game", callback: kindCB },
  ]);

  /* c8 ignore next */
  const attribCB = (_: EventContext<Context, AdminKinds>) => {};
  listeners.on("game", "something", attribCB);
  t.deepEqual(listeners.attributeListeners, [
    {
      placement: ListernerPlacement.None,
      kind: "game",
      key: "something",
      callback: attribCB,
    },
  ]);
});

test.serial("ListenersCollector tracks before listeners", async (t) => {
  const listeners = new ListenersCollector<Context, AdminKinds>();

  /* c8 ignore next */
  const startCB = (_: EventContext<Context, AdminKinds>) => {};
  listeners.before("start", startCB);
  t.deepEqual(listeners.starts, [
    { placement: ListernerPlacement.Before, callback: startCB },
  ]);

  /* c8 ignore next */
  const tajCB = (_: EventContext<Context, AdminKinds>) => {};
  listeners.before(TajribaEvent.ParticipantConnect, tajCB);
  t.deepEqual(listeners.tajEvents, [
    {
      placement: ListernerPlacement.Before,
      event: TajribaEvent.ParticipantConnect,
      callback: tajCB,
    },
  ]);

  /* c8 ignore next */
  const kindCB = (_: EventContext<Context, AdminKinds>) => {};
  listeners.before("game", kindCB);
  t.deepEqual(listeners.kindListeners, [
    { placement: ListernerPlacement.Before, kind: "game", callback: kindCB },
  ]);

  /* c8 ignore next */
  const attribCB = (_: EventContext<Context, AdminKinds>) => {};
  listeners.before("game", "something", attribCB);
  t.deepEqual(listeners.attributeListeners, [
    {
      placement: ListernerPlacement.Before,
      kind: "game",
      key: "something",
      callback: attribCB,
    },
  ]);
});

test.serial("ListenersCollector tracks after listeners", async (t) => {
  const listeners = new ListenersCollector<Context, AdminKinds>();

  /* c8 ignore next */
  const startCB = (_: EventContext<Context, AdminKinds>) => {};
  listeners.after("start", startCB);
  t.deepEqual(listeners.starts, [
    { placement: ListernerPlacement.After, callback: startCB },
  ]);

  /* c8 ignore next */
  const tajCB = (_: EventContext<Context, AdminKinds>) => {};
  listeners.after(TajribaEvent.ParticipantConnect, tajCB);
  t.deepEqual(listeners.tajEvents, [
    {
      placement: ListernerPlacement.After,
      event: TajribaEvent.ParticipantConnect,
      callback: tajCB,
    },
  ]);

  /* c8 ignore next */
  const kindCB = (_: EventContext<Context, AdminKinds>) => {};
  listeners.after("game", kindCB);
  t.deepEqual(listeners.kindListeners, [
    { placement: ListernerPlacement.After, kind: "game", callback: kindCB },
  ]);

  /* c8 ignore next */
  const attribCB = (_: EventContext<Context, AdminKinds>) => {};
  listeners.after("game", "something", attribCB);
  t.deepEqual(listeners.attributeListeners, [
    {
      placement: ListernerPlacement.After,
      kind: "game",
      key: "something",
      callback: attribCB,
    },
  ]);
});

test.serial("ListenersCollector fails with wrong start", async (t) => {
  const listeners = new ListenersCollector<Context, AdminKinds>();

  /* c8 ignore next */
  const startCB = (_: EventContext<Context, AdminKinds>) => {};

  t.throws(
    () => {
      // @ts-ignore
      listeners.on("start", startCB, startCB);
      /* c8 ignore next */
    },
    { message: /only accepts 2 arguments/ }
  );

  t.throws(
    () => {
      // @ts-ignore
      listeners.on("start", "nope");
      /* c8 ignore next */
    },
    { message: /be a callback/ }
  );
});

test.serial("ListenersCollector fails with wrong tajriba event", async (t) => {
  const listeners = new ListenersCollector<Context, AdminKinds>();

  t.throws(
    () => {
      // @ts-ignore
      listeners.on(TajribaEvent.ParticipantConnect, 1);
      /* c8 ignore next */
    },
    { message: /be a callback/ }
  );
});

test.serial(
  "ListenersCollector fails with wrong attribute event",
  async (t) => {
    const listeners = new ListenersCollector<Context, AdminKinds>();

    t.throws(
      () => {
        // @ts-ignore
        listeners.on("game", 1);
        /* c8 ignore next */
      },
      { message: /be an attribute key/ }
    );

    t.throws(
      () => {
        // @ts-ignore
        listeners.on("game", "somekey", "nope");
        /* c8 ignore next */
      },
      { message: /be a callback/ }
    );
  }
);

test.serial("EventContext ", async (t) => {
  const { res, ctx } = setupEventContext();

  t.is(res.participantsSub, 0);
  ctx.participantsSub();
  t.is(res.participantsSub, 1);

  ctx.scopeSub({ ids: ["123"] });
  t.deepEqual(res.scopeSub, [{ ids: ["123"] }]);

  ctx.scopeSub({ ids: ["abc"] }, { ids: ["xyz"] });
  t.deepEqual(res.scopeSub, [
    { ids: ["123"] },
    { ids: ["abc"] },
    { ids: ["xyz"] },
  ]);

  ctx.transitionsSub("1");
  t.deepEqual(res.transitionsSub, ["1"]);

  ctx.transitionsSub("2");
  t.deepEqual(res.transitionsSub, ["1", "2"]);
});
