/**
 * @module gallery-event-custom-branch
 */
(function (Y) {
    'use strict';

    var _customEventPrototype = Y.CustomEvent.prototype,

        _customEventApplyConfigs = _customEventPrototype.applyConfig,
        _max = Math.max,
        _mix = Y.mix;

    _mix(_customEventPrototype, {
        applyConfig: function (object, force) {
            _customEventApplyConfigs.apply(this, arguments);

            if (object) {
                _mix(this, object, force, [
                    'branchPreventedFn',
                    'branchStoppedFn'
                ]);
            }
        },
        fireComplex: function (args) {
            var customEvent,
                differentEventStackType,
                eventFacade,
                events,
                eventStack,
                eventStackAfterQueue,
                host,
                me = this,
                next,
                oldBubble,
                postponed,
                queue,
                queuedItem,
                stack = me.stack,
                subs,
                type = me.type;

            if (stack) {
                if (me.queuable && type !== stack.next.type) {
                    me.log('queue ' + type);
                    stack.queue.push([
                        me,
                        args
                    ]);
                    return true;
                }
            }

            eventStack = stack || {
                afterQueue: new Y.Queue(),
                branchPrevented: 0,
                branchStopped: 0,
                bubbling: null,
                defaultTargetOnly: me.defaultTargetOnly,
                id: me.id,
                next: me,
                prevented: 0,
                queue: [],
                silent: me.silent,
                stopped: 0,
                type: type
            };

            differentEventStackType = type !== eventStack.type;

            host = me.host || me;
            subs = me.getSubs();

            me.branchPrevented = differentEventStackType ? 0 : eventStack.branchPrevented;
            me.branchStopped = differentEventStackType ? 0 : eventStack.branchStopped;
            me.stopped = differentEventStackType ? 0 : eventStack.stopped;
            me.prevented = differentEventStackType ? 0 : eventStack.prevented;

            me.target = me.target || host;

            events = new Y.EventTarget({
                fireOnce: true,
                context: host
            });

            if (me.branchStoppedFn) {
                events.on('branchStopped', me.branchStoppedFn);
            }

            if (me.stoppedFn) {
                events.on('stopped', me.stoppedFn);
            }

            me.currentTarget = host;
            me.details = args.slice();
            me.events = events;
            me.log('Firing ' + type);
            me._facade = null;

            eventFacade = me._getFacade(args);

            if (Y.Lang.isObject(args[0])) {
                args[0] = eventFacade;
            } else {
                args.unshift(eventFacade);
            }

            if (subs[0]) {
                me._procSubs(subs[0], args, eventFacade);
            }

            if (me.bubbles && host.bubble && !me.branchStopped && !me.stopped) {

                oldBubble = eventStack.bubbling;

                eventStack.bubbling = type;

                if (differentEventStackType) {
                    eventStack.branchPrevented = 0;
                    eventStack.branchStopped = 0;
                    eventStack.prevented = 0;
                    eventStack.stopped = 0;
                }

                host.bubble(me, args, null, eventStack);

                me.branchPrevented = _max(me.branchPrevented, eventStack.branchPrevented);
                me.branchStopped = _max(me.branchStopped, eventStack.branchStopped);
                me.prevented = _max(me.prevented, eventStack.prevented);
                me.stopped = _max(me.stopped, eventStack.stopped);

                eventStack.bubbling = oldBubble;
            }

            if (me.prevented && me.preventedFn) {
                me.preventedFn.apply(host, args);
            }

            if (me.branchPrevented) {
                if (me.branchPreventedFn) {
                    me.branchPreventedFn.apply(host, args);
                }
            } else if (me.defaultFn && (!(me.defaultTargetOnly || eventStack.defaultTargetOnly) || host === eventFacade.target)) {
                me.defaultFn.apply(host, args);
            }

            me._broadcast(args);

            if (subs[1] && !me.branchPrevented && me.branchStopped < 2 && me.stopped < 2) {
                eventStackAfterQueue = eventStack.afterQueue;

                if (eventStack.id === me.id || type !== host._yuievt.bubbling) {
                    me._procSubs(subs[1], args, eventFacade);
                    while ((next = eventStackAfterQueue.last())) {
                        next();
                    }
                } else {
                    postponed = subs[1];
                    if (eventStack.execDefaultCnt) {
                        postponed = Y.merge(postponed);
                        Y.each(postponed, function (s) {
                            s.postponed = true;
                        });
                    }

                    eventStackAfterQueue.add(function () {
                        me._procSubs(postponed, args, eventFacade);
                    });
                }
            }

            me.target = null;

            if (eventStack.id === me.id) {
                queue = eventStack.queue;

                while (queue.length) {
                    queuedItem = queue.pop();
                    customEvent = queuedItem[0];
                    eventStack.next = customEvent;
                    customEvent.fire.apply(customEvent, queuedItem[1]);
                }

                me.stack = null;
            }

            if (type !== host._yuievt.bubbling) {
                eventStack.branchPrevented = 0;
                eventStack.branchStopped = 0;
                eventStack.prevented = 0;
                eventStack.stopped = 0;
                me.branchPrevented = 0;
                me.branchStopped = 0;
                me.prevented = 0;
                me.stopped = 0;
            }

            return !me.stopped;
        },
        haltBranch: function (immediate) {
            var me = this;

            if (immediate) {
                me.stopImmediateBranchPropagation();
            } else {
                me.stopBranchPropagation();
            }

            me.preventBranchDefault();
        },
        preventBranchDefault: function () {
            var me = this,
                myStack = me.stack;

            if (me.preventable) {
                me.branchPrevented = 1;

                if (myStack) {
                    myStack.branchPrevented = 1;
                }
            }
        },
        preventDefault: function () {
            var me = this,
                myStack = me.stack;

            me.preventBranchDefault();

            if (me.preventable) {
                me.prevented = 1;

                if (myStack) {
                    myStack.prevented = 1;
                }
            }
        },
        resetBranch: function () {
            var me = this,
                myStack = me.stack;

            me.branchPrevented = 0;
            me.branchStopped = 0;

            if (myStack) {
                myStack.branchPrevented = 0;
                myStack.branchStopped = 0;
            }
        },
        stopBranchPropagation: function () {
            var me = this,
                myStack = me.stack;

            me.branchStopped = 1;

            if (myStack) {
                myStack.branchStopped = 1;
            }

            me.events.fire('branchStopped', me);
        },
        stopImmediateBranchPropagation: function () {
            var me = this,
                myStack = me.stack;

            me.branchStopped = 2;

            if (myStack) {
                myStack.branchStopped = 2;
            }

            me.events.fire('branchStopped', me);
        },
        _notify: function (subscriber, args) {
            var me = this;

            me.log(me.type + '->' + 'sub: ' + subscriber.id);

            if (subscriber.notify(args, me) === false) {
                me.stopped = 2;
            }

            if (me.branchStopped > 1 || me.stopped > 1) {
                me.log(me.type + ' cancelled by subscriber');
                return false;
            }

            return true;
        },
        _procSubs: function (subscribers, args) {
            var subscriber, i;

            for (i in subscribers) {
                if (subscribers.hasOwnProperty(i)) {
                    subscriber = subscribers[i];
                    if (subscriber && subscriber.fn) {
                        if (!this._notify(subscriber, args)) {
                            return false;
                        }
                    }
                }
            }

            return true;
        }
    }, true);

    _mix(Y.EventFacade.prototype, {
        haltBranch: function (immediate) {
            var me = this;

            me._event.haltBranch(immediate);
            me.prevented = 1;
            me.branchStopped = immediate ? 2 : 1;
        },
        preventBranchDefault: function () {
            this._event.preventBranchDefault();
            this.branchPrevented = 1;
        },
        preventDefault: function () {
            var me = this;

            me.preventBranchDefault();
            me._event.preventDefault();
            me.prevented = 1;
        },
        resetBranch: function () {
            var me = this;

            me._event.resetBranch();
            me.branchPrevented = 0;
            me.branchStopped = 0;
        },
        stopBranchPropagation: function () {
            this._event.stopBranchPropagation();
            this.branchStopped = 1;
        },
        stopImmediateBranchPropagation: function () {
            this._event.stopImmediateBranchPropagation();
            this.branchStopped = 2;
        }
    }, true);

    _mix(Y.EventTarget.prototype, {
        bubble: function (event, args, target, eventStack) {
            var broadcast,
                bubbleTarget,
                bubbleTargets = this._yuievt.targets,
                customEvent,
                customEvent2,
                i,
                oldBubble,
                originalBranchPrevented = event && event.branchPrevented,
                originalTarget = target || (event && event.target) || this,
                returnValue = true,
                type = event && event.type;

            if (!event || event.resetBranch() || !event.stopped && bubbleTargets) {
                for (i in bubbleTargets) {
                    if (bubbleTargets.hasOwnProperty(i)) {
                        bubbleTarget = bubbleTargets[i];
                        customEvent = bubbleTarget.getEvent(type, true);
                        customEvent2 = bubbleTarget.getSibling(type, customEvent);

                        if (customEvent2 && !customEvent) {
                            customEvent = bubbleTarget.publish(type);
                        }

                        oldBubble = bubbleTarget._yuievt.bubbling;
                        bubbleTarget._yuievt.bubbling = type;

                        if (!customEvent) {
                            if (bubbleTarget._yuievt.hasTargets) {
                                bubbleTarget.bubble(event, args, originalTarget, eventStack);
                            }
                        } else {
                            customEvent.sibling = customEvent2;

                            customEvent.target = originalTarget;
                            customEvent.originalTarget = originalTarget;
                            customEvent.currentTarget = bubbleTarget;
                            broadcast = customEvent.broadcast;
                            customEvent.broadcast = false;

                            customEvent.emitFacade = true;

                            customEvent.stack = eventStack;

                            returnValue = returnValue && customEvent.fire.apply(customEvent, args || event.details || []);
                            customEvent.broadcast = broadcast;
                            customEvent.originalTarget = null;
                            customEvent.resetBranch();

                            if (customEvent.stopped) {
                                break;
                            }
                        }

                        bubbleTarget._yuievt.bubbling = oldBubble;
                    }
                }

                if (originalBranchPrevented) {
                    event.preventBranchDefault();
                }
            }

            return returnValue;
        }
    }, true);
}(Y));