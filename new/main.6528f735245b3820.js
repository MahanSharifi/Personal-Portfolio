"use strict";
(self.webpackChunkwebsite = self.webpackChunkwebsite || []).push([
  [179],
  {
    271: () => {
      function oe(e) {
        return "function" == typeof e;
      }
      function Zr(e) {
        const n = e((r) => {
          Error.call(r), (r.stack = new Error().stack);
        });
        return (
          (n.prototype = Object.create(Error.prototype)),
          (n.prototype.constructor = n),
          n
        );
      }
      const si = Zr(
        (e) =>
          function (n) {
            e(this),
              (this.message = n
                ? `${n.length} errors occurred during unsubscription:\n${n
                    .map((r, o) => `${o + 1}) ${r.toString()}`)
                    .join("\n  ")}`
                : ""),
              (this.name = "UnsubscriptionError"),
              (this.errors = n);
          },
      );
      function Yr(e, t) {
        if (e) {
          const n = e.indexOf(t);
          0 <= n && e.splice(n, 1);
        }
      }
      class st {
        constructor(t) {
          (this.initialTeardown = t),
            (this.closed = !1),
            (this._parentage = null),
            (this._teardowns = null);
        }
        unsubscribe() {
          let t;
          if (!this.closed) {
            this.closed = !0;
            const { _parentage: n } = this;
            if (n)
              if (((this._parentage = null), Array.isArray(n)))
                for (const i of n) i.remove(this);
              else n.remove(this);
            const { initialTeardown: r } = this;
            if (oe(r))
              try {
                r();
              } catch (i) {
                t = i instanceof si ? i.errors : [i];
              }
            const { _teardowns: o } = this;
            if (o) {
              this._teardowns = null;
              for (const i of o)
                try {
                  Uc(i);
                } catch (s) {
                  (t = null != t ? t : []),
                    s instanceof si ? (t = [...t, ...s.errors]) : t.push(s);
                }
            }
            if (t) throw new si(t);
          }
        }
        add(t) {
          var n;
          if (t && t !== this)
            if (this.closed) Uc(t);
            else {
              if (t instanceof st) {
                if (t.closed || t._hasParent(this)) return;
                t._addParent(this);
              }
              (this._teardowns =
                null !== (n = this._teardowns) && void 0 !== n ? n : []).push(
                t,
              );
            }
        }
        _hasParent(t) {
          const { _parentage: n } = this;
          return n === t || (Array.isArray(n) && n.includes(t));
        }
        _addParent(t) {
          const { _parentage: n } = this;
          this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
        }
        _removeParent(t) {
          const { _parentage: n } = this;
          n === t ? (this._parentage = null) : Array.isArray(n) && Yr(n, t);
        }
        remove(t) {
          const { _teardowns: n } = this;
          n && Yr(n, t), t instanceof st && t._removeParent(this);
        }
      }
      st.EMPTY = (() => {
        const e = new st();
        return (e.closed = !0), e;
      })();
      const Hc = st.EMPTY;
      function Vc(e) {
        return (
          e instanceof st ||
          (e && "closed" in e && oe(e.remove) && oe(e.add) && oe(e.unsubscribe))
        );
      }
      function Uc(e) {
        oe(e) ? e() : e.unsubscribe();
      }
      const Tn = {
          onUnhandledError: null,
          onStoppedNotification: null,
          Promise: void 0,
          useDeprecatedSynchronousErrorHandling: !1,
          useDeprecatedNextContext: !1,
        },
        ai = {
          setTimeout(...e) {
            const { delegate: t } = ai;
            return ((null == t ? void 0 : t.setTimeout) || setTimeout)(...e);
          },
          clearTimeout(e) {
            const { delegate: t } = ai;
            return ((null == t ? void 0 : t.clearTimeout) || clearTimeout)(e);
          },
          delegate: void 0,
        };
      function $c(e) {
        ai.setTimeout(() => {
          const { onUnhandledError: t } = Tn;
          if (!t) throw e;
          t(e);
        });
      }
      function li() {}
      const nD = Js("C", void 0, void 0);
      function Js(e, t, n) {
        return { kind: e, value: t, error: n };
      }
      let An = null;
      function ui(e) {
        if (Tn.useDeprecatedSynchronousErrorHandling) {
          const t = !An;
          if ((t && (An = { errorThrown: !1, error: null }), e(), t)) {
            const { errorThrown: n, error: r } = An;
            if (((An = null), n)) throw r;
          }
        } else e();
      }
      class Zs extends st {
        constructor(t) {
          super(),
            (this.isStopped = !1),
            t
              ? ((this.destination = t), Vc(t) && t.add(this))
              : (this.destination = sD);
        }
        static create(t, n, r) {
          return new Ys(t, n, r);
        }
        next(t) {
          this.isStopped ? ea(Js("N", t, void 0), this) : this._next(t);
        }
        error(t) {
          this.isStopped
            ? ea(Js("E", void 0, t), this)
            : ((this.isStopped = !0), this._error(t));
        }
        complete() {
          this.isStopped
            ? ea(nD, this)
            : ((this.isStopped = !0), this._complete());
        }
        unsubscribe() {
          this.closed ||
            ((this.isStopped = !0),
            super.unsubscribe(),
            (this.destination = null));
        }
        _next(t) {
          this.destination.next(t);
        }
        _error(t) {
          try {
            this.destination.error(t);
          } finally {
            this.unsubscribe();
          }
        }
        _complete() {
          try {
            this.destination.complete();
          } finally {
            this.unsubscribe();
          }
        }
      }
      class Ys extends Zs {
        constructor(t, n, r) {
          let o;
          if ((super(), oe(t))) o = t;
          else if (t) {
            let i;
            ({ next: o, error: n, complete: r } = t),
              this && Tn.useDeprecatedNextContext
                ? ((i = Object.create(t)),
                  (i.unsubscribe = () => this.unsubscribe()))
                : (i = t),
              (o = null == o ? void 0 : o.bind(i)),
              (n = null == n ? void 0 : n.bind(i)),
              (r = null == r ? void 0 : r.bind(i));
          }
          this.destination = {
            next: o ? Xs(o) : li,
            error: Xs(null != n ? n : qc),
            complete: r ? Xs(r) : li,
          };
        }
      }
      function Xs(e, t) {
        return (...n) => {
          try {
            e(...n);
          } catch (r) {
            Tn.useDeprecatedSynchronousErrorHandling
              ? (function (e) {
                  Tn.useDeprecatedSynchronousErrorHandling &&
                    An &&
                    ((An.errorThrown = !0), (An.error = e));
                })(r)
              : $c(r);
          }
        };
      }
      function qc(e) {
        throw e;
      }
      function ea(e, t) {
        const { onStoppedNotification: n } = Tn;
        n && ai.setTimeout(() => n(e, t));
      }
      const sD = { closed: !0, next: li, error: qc, complete: li },
        ta =
          ("function" == typeof Symbol && Symbol.observable) || "@@observable";
      function Pn(e) {
        return e;
      }
      let ae = (() => {
        class e {
          constructor(n) {
            n && (this._subscribe = n);
          }
          lift(n) {
            const r = new e();
            return (r.source = this), (r.operator = n), r;
          }
          subscribe(n, r, o) {
            const i = (function (e) {
              return (
                (e && e instanceof Zs) ||
                ((function (e) {
                  return e && oe(e.next) && oe(e.error) && oe(e.complete);
                })(e) &&
                  Vc(e))
              );
            })(n)
              ? n
              : new Ys(n, r, o);
            return (
              ui(() => {
                const { operator: s, source: a } = this;
                i.add(
                  s
                    ? s.call(i, a)
                    : a
                    ? this._subscribe(i)
                    : this._trySubscribe(i),
                );
              }),
              i
            );
          }
          _trySubscribe(n) {
            try {
              return this._subscribe(n);
            } catch (r) {
              n.error(r);
            }
          }
          forEach(n, r) {
            return new (r = Gc(r))((o, i) => {
              let s;
              s = this.subscribe(
                (a) => {
                  try {
                    n(a);
                  } catch (l) {
                    i(l), null == s || s.unsubscribe();
                  }
                },
                i,
                o,
              );
            });
          }
          _subscribe(n) {
            var r;
            return null === (r = this.source) || void 0 === r
              ? void 0
              : r.subscribe(n);
          }
          [ta]() {
            return this;
          }
          pipe(...n) {
            return (function (e) {
              return 0 === e.length
                ? Pn
                : 1 === e.length
                ? e[0]
                : function (n) {
                    return e.reduce((r, o) => o(r), n);
                  };
            })(n)(this);
          }
          toPromise(n) {
            return new (n = Gc(n))((r, o) => {
              let i;
              this.subscribe(
                (s) => (i = s),
                (s) => o(s),
                () => r(i),
              );
            });
          }
        }
        return (e.create = (t) => new e(t)), e;
      })();
      function Gc(e) {
        var t;
        return null !== (t = null != e ? e : Tn.Promise) && void 0 !== t
          ? t
          : Promise;
      }
      const uD = Zr(
        (e) =>
          function () {
            e(this),
              (this.name = "ObjectUnsubscribedError"),
              (this.message = "object unsubscribed");
          },
      );
      let Gt = (() => {
        class e extends ae {
          constructor() {
            super(),
              (this.closed = !1),
              (this.observers = []),
              (this.isStopped = !1),
              (this.hasError = !1),
              (this.thrownError = null);
          }
          lift(n) {
            const r = new Wc(this, this);
            return (r.operator = n), r;
          }
          _throwIfClosed() {
            if (this.closed) throw new uD();
          }
          next(n) {
            ui(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                const r = this.observers.slice();
                for (const o of r) o.next(n);
              }
            });
          }
          error(n) {
            ui(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                (this.hasError = this.isStopped = !0), (this.thrownError = n);
                const { observers: r } = this;
                for (; r.length; ) r.shift().error(n);
              }
            });
          }
          complete() {
            ui(() => {
              if ((this._throwIfClosed(), !this.isStopped)) {
                this.isStopped = !0;
                const { observers: n } = this;
                for (; n.length; ) n.shift().complete();
              }
            });
          }
          unsubscribe() {
            (this.isStopped = this.closed = !0), (this.observers = null);
          }
          get observed() {
            var n;
            return (
              (null === (n = this.observers) || void 0 === n
                ? void 0
                : n.length) > 0
            );
          }
          _trySubscribe(n) {
            return this._throwIfClosed(), super._trySubscribe(n);
          }
          _subscribe(n) {
            return (
              this._throwIfClosed(),
              this._checkFinalizedStatuses(n),
              this._innerSubscribe(n)
            );
          }
          _innerSubscribe(n) {
            const { hasError: r, isStopped: o, observers: i } = this;
            return r || o ? Hc : (i.push(n), new st(() => Yr(i, n)));
          }
          _checkFinalizedStatuses(n) {
            const { hasError: r, thrownError: o, isStopped: i } = this;
            r ? n.error(o) : i && n.complete();
          }
          asObservable() {
            const n = new ae();
            return (n.source = this), n;
          }
        }
        return (e.create = (t, n) => new Wc(t, n)), e;
      })();
      class Wc extends Gt {
        constructor(t, n) {
          super(), (this.destination = t), (this.source = n);
        }
        next(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.next) ||
            void 0 === r ||
            r.call(n, t);
        }
        error(t) {
          var n, r;
          null ===
            (r =
              null === (n = this.destination) || void 0 === n
                ? void 0
                : n.error) ||
            void 0 === r ||
            r.call(n, t);
        }
        complete() {
          var t, n;
          null ===
            (n =
              null === (t = this.destination) || void 0 === t
                ? void 0
                : t.complete) ||
            void 0 === n ||
            n.call(t);
        }
        _subscribe(t) {
          var n, r;
          return null !==
            (r =
              null === (n = this.source) || void 0 === n
                ? void 0
                : n.subscribe(t)) && void 0 !== r
            ? r
            : Hc;
        }
      }
      function Qc(e) {
        return oe(null == e ? void 0 : e.lift);
      }
      function Se(e) {
        return (t) => {
          if (Qc(t))
            return t.lift(function (n) {
              try {
                return e(n, this);
              } catch (r) {
                this.error(r);
              }
            });
          throw new TypeError("Unable to lift unknown Observable type");
        };
      }
      class Ie extends Zs {
        constructor(t, n, r, o, i) {
          super(t),
            (this.onFinalize = i),
            (this._next = n
              ? function (s) {
                  try {
                    n(s);
                  } catch (a) {
                    t.error(a);
                  }
                }
              : super._next),
            (this._error = o
              ? function (s) {
                  try {
                    o(s);
                  } catch (a) {
                    t.error(a);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._error),
            (this._complete = r
              ? function () {
                  try {
                    r();
                  } catch (s) {
                    t.error(s);
                  } finally {
                    this.unsubscribe();
                  }
                }
              : super._complete);
        }
        unsubscribe() {
          var t;
          const { closed: n } = this;
          super.unsubscribe(),
            !n &&
              (null === (t = this.onFinalize) || void 0 === t || t.call(this));
        }
      }
      function Y(e, t) {
        return Se((n, r) => {
          let o = 0;
          n.subscribe(
            new Ie(r, (i) => {
              r.next(e.call(t, i, o++));
            }),
          );
        });
      }
      function xn(e) {
        return this instanceof xn ? ((this.v = e), this) : new xn(e);
      }
      function fD(e, t, n) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var o,
          r = n.apply(e, t || []),
          i = [];
        return (
          (o = {}),
          s("next"),
          s("throw"),
          s("return"),
          (o[Symbol.asyncIterator] = function () {
            return this;
          }),
          o
        );
        function s(f) {
          r[f] &&
            (o[f] = function (h) {
              return new Promise(function (m, D) {
                i.push([f, h, m, D]) > 1 || a(f, h);
              });
            });
        }
        function a(f, h) {
          try {
            !(function (f) {
              f.value instanceof xn
                ? Promise.resolve(f.value.v).then(u, c)
                : d(i[0][2], f);
            })(r[f](h));
          } catch (m) {
            d(i[0][3], m);
          }
        }
        function u(f) {
          a("next", f);
        }
        function c(f) {
          a("throw", f);
        }
        function d(f, h) {
          f(h), i.shift(), i.length && a(i[0][0], i[0][1]);
        }
      }
      function hD(e) {
        if (!Symbol.asyncIterator)
          throw new TypeError("Symbol.asyncIterator is not defined.");
        var n,
          t = e[Symbol.asyncIterator];
        return t
          ? t.call(e)
          : ((e = (function (e) {
              var t = "function" == typeof Symbol && Symbol.iterator,
                n = t && e[t],
                r = 0;
              if (n) return n.call(e);
              if (e && "number" == typeof e.length)
                return {
                  next: function () {
                    return (
                      e && r >= e.length && (e = void 0),
                      { value: e && e[r++], done: !e }
                    );
                  },
                };
              throw new TypeError(
                t
                  ? "Object is not iterable."
                  : "Symbol.iterator is not defined.",
              );
            })(e)),
            (n = {}),
            r("next"),
            r("throw"),
            r("return"),
            (n[Symbol.asyncIterator] = function () {
              return this;
            }),
            n);
        function r(i) {
          n[i] =
            e[i] &&
            function (s) {
              return new Promise(function (a, l) {
                !(function (i, s, a, l) {
                  Promise.resolve(l).then(function (u) {
                    i({ value: u, done: a });
                  }, s);
                })(a, l, (s = e[i](s)).done, s.value);
              });
            };
        }
      }
      const Yc = (e) =>
        e && "number" == typeof e.length && "function" != typeof e;
      function Xc(e) {
        return oe(null == e ? void 0 : e.then);
      }
      function ed(e) {
        return oe(e[ta]);
      }
      function td(e) {
        return (
          Symbol.asyncIterator &&
          oe(null == e ? void 0 : e[Symbol.asyncIterator])
        );
      }
      function nd(e) {
        return new TypeError(
          `You provided ${
            null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`
          } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
        );
      }
      const rd =
        "function" == typeof Symbol && Symbol.iterator
          ? Symbol.iterator
          : "@@iterator";
      function od(e) {
        return oe(null == e ? void 0 : e[rd]);
      }
      function id(e) {
        return fD(this, arguments, function* () {
          const n = e.getReader();
          try {
            for (;;) {
              const { value: r, done: o } = yield xn(n.read());
              if (o) return yield xn(void 0);
              yield yield xn(r);
            }
          } finally {
            n.releaseLock();
          }
        });
      }
      function sd(e) {
        return oe(null == e ? void 0 : e.getReader);
      }
      function Wt(e) {
        if (e instanceof ae) return e;
        if (null != e) {
          if (ed(e))
            return (function (e) {
              return new ae((t) => {
                const n = e[ta]();
                if (oe(n.subscribe)) return n.subscribe(t);
                throw new TypeError(
                  "Provided object does not correctly implement Symbol.observable",
                );
              });
            })(e);
          if (Yc(e))
            return (function (e) {
              return new ae((t) => {
                for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                t.complete();
              });
            })(e);
          if (Xc(e))
            return (function (e) {
              return new ae((t) => {
                e.then(
                  (n) => {
                    t.closed || (t.next(n), t.complete());
                  },
                  (n) => t.error(n),
                ).then(null, $c);
              });
            })(e);
          if (td(e)) return ad(e);
          if (od(e))
            return (function (e) {
              return new ae((t) => {
                for (const n of e) if ((t.next(n), t.closed)) return;
                t.complete();
              });
            })(e);
          if (sd(e))
            return (function (e) {
              return ad(id(e));
            })(e);
        }
        throw nd(e);
      }
      function ad(e) {
        return new ae((t) => {
          (function (e, t) {
            var n, r, o, i;
            return (function (e, t, n, r) {
              return new (n || (n = Promise))(function (i, s) {
                function a(c) {
                  try {
                    u(r.next(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function l(c) {
                  try {
                    u(r.throw(c));
                  } catch (d) {
                    s(d);
                  }
                }
                function u(c) {
                  c.done
                    ? i(c.value)
                    : (function (i) {
                        return i instanceof n
                          ? i
                          : new n(function (s) {
                              s(i);
                            });
                      })(c.value).then(a, l);
                }
                u((r = r.apply(e, t || [])).next());
              });
            })(this, void 0, void 0, function* () {
              try {
                for (n = hD(e); !(r = yield n.next()).done; )
                  if ((t.next(r.value), t.closed)) return;
              } catch (s) {
                o = { error: s };
              } finally {
                try {
                  r && !r.done && (i = n.return) && (yield i.call(n));
                } finally {
                  if (o) throw o.error;
                }
              }
              t.complete();
            });
          })(e, t).catch((n) => t.error(n));
        });
      }
      function Qt(e, t, n, r = 0, o = !1) {
        const i = t.schedule(function () {
          n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
        }, r);
        if ((e.add(i), !o)) return i;
      }
      function Ee(e, t, n = 1 / 0) {
        return oe(t)
          ? Ee((r, o) => Y((i, s) => t(r, i, o, s))(Wt(e(r, o))), n)
          : ("number" == typeof t && (n = t),
            Se((r, o) =>
              (function (e, t, n, r, o, i, s, a) {
                const l = [];
                let u = 0,
                  c = 0,
                  d = !1;
                const f = () => {
                    d && !l.length && !u && t.complete();
                  },
                  h = (D) => (u < r ? m(D) : l.push(D)),
                  m = (D) => {
                    u++;
                    let _ = !1;
                    Wt(n(D, c++)).subscribe(
                      new Ie(
                        t,
                        (w) => {
                          t.next(w);
                        },
                        () => {
                          _ = !0;
                        },
                        void 0,
                        () => {
                          if (_)
                            try {
                              for (u--; l.length && u < r; ) {
                                const w = l.shift();
                                m(w);
                              }
                              f();
                            } catch (w) {
                              t.error(w);
                            }
                        },
                      ),
                    );
                  };
                return (
                  e.subscribe(
                    new Ie(t, h, () => {
                      (d = !0), f();
                    }),
                  ),
                  () => {}
                );
              })(r, o, e, n),
            ));
      }
      function Xr(e = 1 / 0) {
        return Ee(Pn, e);
      }
      const Kt = new ae((e) => e.complete());
      function ra(e) {
        return e[e.length - 1];
      }
      function eo(e) {
        return (function (e) {
          return e && oe(e.schedule);
        })(ra(e))
          ? e.pop()
          : void 0;
      }
      function ld(e, t = 0) {
        return Se((n, r) => {
          n.subscribe(
            new Ie(
              r,
              (o) => Qt(r, e, () => r.next(o), t),
              () => Qt(r, e, () => r.complete(), t),
              (o) => Qt(r, e, () => r.error(o), t),
            ),
          );
        });
      }
      function ud(e, t = 0) {
        return Se((n, r) => {
          r.add(e.schedule(() => n.subscribe(r), t));
        });
      }
      function cd(e, t) {
        if (!e) throw new Error("Iterable cannot be null");
        return new ae((n) => {
          Qt(n, t, () => {
            const r = e[Symbol.asyncIterator]();
            Qt(
              n,
              t,
              () => {
                r.next().then((o) => {
                  o.done ? n.complete() : n.next(o.value);
                });
              },
              0,
              !0,
            );
          });
        });
      }
      function Te(e, t) {
        return t
          ? (function (e, t) {
              if (null != e) {
                if (ed(e))
                  return (function (e, t) {
                    return Wt(e).pipe(ud(t), ld(t));
                  })(e, t);
                if (Yc(e))
                  return (function (e, t) {
                    return new ae((n) => {
                      let r = 0;
                      return t.schedule(function () {
                        r === e.length
                          ? n.complete()
                          : (n.next(e[r++]), n.closed || this.schedule());
                      });
                    });
                  })(e, t);
                if (Xc(e))
                  return (function (e, t) {
                    return Wt(e).pipe(ud(t), ld(t));
                  })(e, t);
                if (td(e)) return cd(e, t);
                if (od(e))
                  return (function (e, t) {
                    return new ae((n) => {
                      let r;
                      return (
                        Qt(n, t, () => {
                          (r = e[rd]()),
                            Qt(
                              n,
                              t,
                              () => {
                                let o, i;
                                try {
                                  ({ value: o, done: i } = r.next());
                                } catch (s) {
                                  return void n.error(s);
                                }
                                i ? n.complete() : n.next(o);
                              },
                              0,
                              !0,
                            );
                        }),
                        () => oe(null == r ? void 0 : r.return) && r.return()
                      );
                    });
                  })(e, t);
                if (sd(e))
                  return (function (e, t) {
                    return cd(id(e), t);
                  })(e, t);
              }
              throw nd(e);
            })(e, t)
          : Wt(e);
      }
      function ci(e) {
        return e <= 0
          ? () => Kt
          : Se((t, n) => {
              let r = 0;
              t.subscribe(
                new Ie(n, (o) => {
                  ++r <= e && (n.next(o), e <= r && n.complete());
                }),
              );
            });
      }
      function oa(e, t, ...n) {
        return !0 === t
          ? (e(), null)
          : !1 === t
          ? null
          : t(...n)
              .pipe(ci(1))
              .subscribe(() => e());
      }
      function ee(e) {
        for (let t in e) if (e[t] === ee) return t;
        throw Error("Could not find renamed property on target object.");
      }
      function J(e) {
        if ("string" == typeof e) return e;
        if (Array.isArray(e)) return "[" + e.map(J).join(", ") + "]";
        if (null == e) return "" + e;
        if (e.overriddenName) return `${e.overriddenName}`;
        if (e.name) return `${e.name}`;
        const t = e.toString();
        if (null == t) return "" + t;
        const n = t.indexOf("\n");
        return -1 === n ? t : t.substring(0, n);
      }
      function sa(e, t) {
        return null == e || "" === e
          ? null === t
            ? ""
            : t
          : null == t || "" === t
          ? e
          : e + " " + t;
      }
      const FD = ee({ __forward_ref__: ee });
      function aa(e) {
        return (
          (e.__forward_ref__ = aa),
          (e.toString = function () {
            return J(this());
          }),
          e
        );
      }
      function H(e) {
        return (function (e) {
          return (
            "function" == typeof e &&
            e.hasOwnProperty(FD) &&
            e.__forward_ref__ === aa
          );
        })(e)
          ? e()
          : e;
      }
      class Qe extends Error {
        constructor(t, n) {
          super(
            (function (e, t) {
              return `${e ? `NG0${e}: ` : ""}${t}`;
            })(t, n),
          ),
            (this.code = t);
        }
      }
      function k(e) {
        return "string" == typeof e ? e : null == e ? "" : String(e);
      }
      function Le(e) {
        return "function" == typeof e
          ? e.name || e.toString()
          : "object" == typeof e && null != e && "function" == typeof e.type
          ? e.type.name || e.type.toString()
          : k(e);
      }
      function di(e, t) {
        const n = t ? ` in ${t}` : "";
        throw new Qe("201", `No provider for ${Le(e)} found${n}`);
      }
      function Je(e, t) {
        null == e &&
          (function (e, t, n, r) {
            throw new Error(
              `ASSERTION ERROR: ${e}` +
                (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`),
            );
          })(t, e, null, "!=");
      }
      function V(e) {
        return {
          token: e.token,
          providedIn: e.providedIn || null,
          factory: e.factory,
          value: void 0,
        };
      }
      function Pt(e) {
        return { providers: e.providers || [], imports: e.imports || [] };
      }
      function ua(e) {
        return fd(e, fi) || fd(e, pd);
      }
      function fd(e, t) {
        return e.hasOwnProperty(t) ? e[t] : null;
      }
      function hd(e) {
        return e && (e.hasOwnProperty(ca) || e.hasOwnProperty(UD))
          ? e[ca]
          : null;
      }
      const fi = ee({ ɵprov: ee }),
        ca = ee({ ɵinj: ee }),
        pd = ee({ ngInjectableDef: ee }),
        UD = ee({ ngInjectorDef: ee });
      var j = (() => (
        ((j = j || {})[(j.Default = 0)] = "Default"),
        (j[(j.Host = 1)] = "Host"),
        (j[(j.Self = 2)] = "Self"),
        (j[(j.SkipSelf = 4)] = "SkipSelf"),
        (j[(j.Optional = 8)] = "Optional"),
        j
      ))();
      let da;
      function dn(e) {
        const t = da;
        return (da = e), t;
      }
      function gd(e, t, n) {
        const r = ua(e);
        return r && "root" == r.providedIn
          ? void 0 === r.value
            ? (r.value = r.factory())
            : r.value
          : n & j.Optional
          ? null
          : void 0 !== t
          ? t
          : void di(J(e), "Injector");
      }
      function fn(e) {
        return { toString: e }.toString();
      }
      var mt = (() => (
          ((mt = mt || {})[(mt.OnPush = 0)] = "OnPush"),
          (mt[(mt.Default = 1)] = "Default"),
          mt
        ))(),
        xt = (() => {
          return (
            ((e = xt || (xt = {}))[(e.Emulated = 0)] = "Emulated"),
            (e[(e.None = 2)] = "None"),
            (e[(e.ShadowDom = 3)] = "ShadowDom"),
            xt
          );
          var e;
        })();
      const qD = "undefined" != typeof globalThis && globalThis,
        zD = "undefined" != typeof window && window,
        GD =
          "undefined" != typeof self &&
          "undefined" != typeof WorkerGlobalScope &&
          self instanceof WorkerGlobalScope &&
          self,
        X = qD || ("undefined" != typeof global && global) || zD || GD,
        Jn = {},
        te = [],
        hi = ee({ ɵcmp: ee }),
        fa = ee({ ɵdir: ee }),
        ha = ee({ ɵpipe: ee }),
        md = ee({ ɵmod: ee }),
        Zt = ee({ ɵfac: ee }),
        to = ee({ __NG_ELEMENT_ID__: ee });
      let WD = 0;
      function Ae(e) {
        return fn(() => {
          const n = {},
            r = {
              type: e.type,
              providersResolver: null,
              decls: e.decls,
              vars: e.vars,
              factory: null,
              template: e.template || null,
              consts: e.consts || null,
              ngContentSelectors: e.ngContentSelectors,
              hostBindings: e.hostBindings || null,
              hostVars: e.hostVars || 0,
              hostAttrs: e.hostAttrs || null,
              contentQueries: e.contentQueries || null,
              declaredInputs: n,
              inputs: null,
              outputs: null,
              exportAs: e.exportAs || null,
              onPush: e.changeDetection === mt.OnPush,
              directiveDefs: null,
              pipeDefs: null,
              selectors: e.selectors || te,
              viewQuery: e.viewQuery || null,
              features: e.features || null,
              data: e.data || {},
              encapsulation: e.encapsulation || xt.Emulated,
              id: "c",
              styles: e.styles || te,
              _: null,
              setInput: null,
              schemas: e.schemas || null,
              tView: null,
            },
            o = e.directives,
            i = e.features,
            s = e.pipes;
          return (
            (r.id += WD++),
            (r.inputs = Cd(e.inputs, n)),
            (r.outputs = Cd(e.outputs)),
            i && i.forEach((a) => a(r)),
            (r.directiveDefs = o
              ? () => ("function" == typeof o ? o() : o).map(yd)
              : null),
            (r.pipeDefs = s
              ? () => ("function" == typeof s ? s() : s).map(vd)
              : null),
            r
          );
        });
      }
      function yd(e) {
        return (
          Oe(e) ||
          (function (e) {
            return e[fa] || null;
          })(e)
        );
      }
      function vd(e) {
        return (function (e) {
          return e[ha] || null;
        })(e);
      }
      const Dd = {};
      function Yt(e) {
        return fn(() => {
          const t = {
            type: e.type,
            bootstrap: e.bootstrap || te,
            declarations: e.declarations || te,
            imports: e.imports || te,
            exports: e.exports || te,
            transitiveCompileScopes: null,
            schemas: e.schemas || null,
            id: e.id || null,
          };
          return null != e.id && (Dd[e.id] = e.type), t;
        });
      }
      function Cd(e, t) {
        if (null == e) return Jn;
        const n = {};
        for (const r in e)
          if (e.hasOwnProperty(r)) {
            let o = e[r],
              i = o;
            Array.isArray(o) && ((i = o[1]), (o = o[0])),
              (n[o] = r),
              t && (t[o] = i);
          }
        return n;
      }
      const xe = Ae;
      function Oe(e) {
        return e[hi] || null;
      }
      function at(e, t) {
        const n = e[md] || null;
        if (!n && !0 === t)
          throw new Error(`Type ${J(e)} does not have '\u0275mod' property.`);
        return n;
      }
      const U = 11;
      function Ot(e) {
        return Array.isArray(e) && "object" == typeof e[1];
      }
      function vt(e) {
        return Array.isArray(e) && !0 === e[1];
      }
      function ma(e) {
        return 0 != (8 & e.flags);
      }
      function yi(e) {
        return 2 == (2 & e.flags);
      }
      function vi(e) {
        return 1 == (1 & e.flags);
      }
      function Dt(e) {
        return null !== e.template;
      }
      function XD(e) {
        return 0 != (512 & e[2]);
      }
      function kn(e, t) {
        return e.hasOwnProperty(Zt) ? e[Zt] : null;
      }
      class nC {
        constructor(t, n, r) {
          (this.previousValue = t),
            (this.currentValue = n),
            (this.firstChange = r);
        }
        isFirstChange() {
          return this.firstChange;
        }
      }
      function Ln() {
        return wd;
      }
      function wd(e) {
        return e.type.prototype.ngOnChanges && (e.setInput = oC), rC;
      }
      function rC() {
        const e = Ed(this),
          t = null == e ? void 0 : e.current;
        if (t) {
          const n = e.previous;
          if (n === Jn) e.previous = t;
          else for (let r in t) n[r] = t[r];
          (e.current = null), this.ngOnChanges(t);
        }
      }
      function oC(e, t, n, r) {
        const o =
            Ed(e) ||
            (function (e, t) {
              return (e[bd] = t);
            })(e, { previous: Jn, current: null }),
          i = o.current || (o.current = {}),
          s = o.previous,
          a = this.declaredInputs[n],
          l = s[a];
        (i[a] = new nC(l && l.currentValue, t, s === Jn)), (e[r] = t);
      }
      Ln.ngInherit = !0;
      const bd = "__ngSimpleChanges__";
      function Ed(e) {
        return e[bd] || null;
      }
      let Da;
      function ue(e) {
        return !!e.listen;
      }
      const Id = {
        createRenderer: (e, t) =>
          void 0 !== Da
            ? Da
            : "undefined" != typeof document
            ? document
            : void 0,
      };
      function pe(e) {
        for (; Array.isArray(e); ) e = e[0];
        return e;
      }
      function ct(e, t) {
        return pe(t[e.index]);
      }
      function _a(e, t) {
        return e.data[t];
      }
      function Ye(e, t) {
        const n = t[e];
        return Ot(n) ? n : n[0];
      }
      function Td(e) {
        return 4 == (4 & e[2]);
      }
      function wa(e) {
        return 128 == (128 & e[2]);
      }
      function pn(e, t) {
        return null == t ? null : e[t];
      }
      function Ad(e) {
        e[18] = 0;
      }
      function ba(e, t) {
        e[5] += t;
        let n = e,
          r = e[3];
        for (
          ;
          null !== r && ((1 === t && 1 === n[5]) || (-1 === t && 0 === n[5]));

        )
          (r[5] += t), (n = r), (r = r[3]);
      }
      const F = {
        lFrame: Ld(null),
        bindingsEnabled: !0,
        isInCheckNoChangesMode: !1,
      };
      function Pd() {
        return F.bindingsEnabled;
      }
      function b() {
        return F.lFrame.lView;
      }
      function Z() {
        return F.lFrame.tView;
      }
      function De() {
        let e = xd();
        for (; null !== e && 64 === e.type; ) e = e.parent;
        return e;
      }
      function xd() {
        return F.lFrame.currentTNode;
      }
      function Rt(e, t) {
        const n = F.lFrame;
        (n.currentTNode = e), (n.isParent = t);
      }
      function Ea() {
        return F.lFrame.isParent;
      }
      function Ci() {
        return F.isInCheckNoChangesMode;
      }
      function _i(e) {
        F.isInCheckNoChangesMode = e;
      }
      function je() {
        const e = F.lFrame;
        let t = e.bindingRootIndex;
        return (
          -1 === t && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t
        );
      }
      function nr() {
        return F.lFrame.bindingIndex++;
      }
      function CC(e, t) {
        const n = F.lFrame;
        (n.bindingIndex = n.bindingRootIndex = e), Sa(t);
      }
      function Sa(e) {
        F.lFrame.currentDirectiveIndex = e;
      }
      function Nd() {
        return F.lFrame.currentQueryIndex;
      }
      function Ta(e) {
        F.lFrame.currentQueryIndex = e;
      }
      function wC(e) {
        const t = e[1];
        return 2 === t.type ? t.declTNode : 1 === t.type ? e[6] : null;
      }
      function Fd(e, t, n) {
        if (n & j.SkipSelf) {
          let o = t,
            i = e;
          for (
            ;
            !((o = o.parent),
            null !== o ||
              n & j.Host ||
              ((o = wC(i)), null === o || ((i = i[15]), 10 & o.type)));

          );
          if (null === o) return !1;
          (t = o), (e = i);
        }
        const r = (F.lFrame = kd());
        return (r.currentTNode = t), (r.lView = e), !0;
      }
      function wi(e) {
        const t = kd(),
          n = e[1];
        (F.lFrame = t),
          (t.currentTNode = n.firstChild),
          (t.lView = e),
          (t.tView = n),
          (t.contextLView = e),
          (t.bindingIndex = n.bindingStartIndex),
          (t.inI18n = !1);
      }
      function kd() {
        const e = F.lFrame,
          t = null === e ? null : e.child;
        return null === t ? Ld(e) : t;
      }
      function Ld(e) {
        const t = {
          currentTNode: null,
          isParent: !0,
          lView: null,
          tView: null,
          selectedIndex: -1,
          contextLView: null,
          elementDepthCount: 0,
          currentNamespace: null,
          currentDirectiveIndex: -1,
          bindingRootIndex: -1,
          bindingIndex: -1,
          currentQueryIndex: 0,
          parent: e,
          child: null,
          inI18n: !1,
        };
        return null !== e && (e.child = t), t;
      }
      function jd() {
        const e = F.lFrame;
        return (
          (F.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
        );
      }
      const Bd = jd;
      function bi() {
        const e = jd();
        (e.isParent = !0),
          (e.tView = null),
          (e.selectedIndex = -1),
          (e.contextLView = null),
          (e.elementDepthCount = 0),
          (e.currentDirectiveIndex = -1),
          (e.currentNamespace = null),
          (e.bindingRootIndex = -1),
          (e.bindingIndex = -1),
          (e.currentQueryIndex = 0);
      }
      function Be() {
        return F.lFrame.selectedIndex;
      }
      function gn(e) {
        F.lFrame.selectedIndex = e;
      }
      function ce() {
        const e = F.lFrame;
        return _a(e.tView, e.selectedIndex);
      }
      function Ei(e, t) {
        for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
          const i = e.data[n].type.prototype,
            {
              ngAfterContentInit: s,
              ngAfterContentChecked: a,
              ngAfterViewInit: l,
              ngAfterViewChecked: u,
              ngOnDestroy: c,
            } = i;
          s && (e.contentHooks || (e.contentHooks = [])).push(-n, s),
            a &&
              ((e.contentHooks || (e.contentHooks = [])).push(n, a),
              (e.contentCheckHooks || (e.contentCheckHooks = [])).push(n, a)),
            l && (e.viewHooks || (e.viewHooks = [])).push(-n, l),
            u &&
              ((e.viewHooks || (e.viewHooks = [])).push(n, u),
              (e.viewCheckHooks || (e.viewCheckHooks = [])).push(n, u)),
            null != c && (e.destroyHooks || (e.destroyHooks = [])).push(n, c);
        }
      }
      function Mi(e, t, n) {
        Hd(e, t, 3, n);
      }
      function Si(e, t, n, r) {
        (3 & e[2]) === n && Hd(e, t, n, r);
      }
      function Aa(e, t) {
        let n = e[2];
        (3 & n) === t && ((n &= 2047), (n += 1), (e[2] = n));
      }
      function Hd(e, t, n, r) {
        const i = null != r ? r : -1,
          s = t.length - 1;
        let a = 0;
        for (let l = void 0 !== r ? 65535 & e[18] : 0; l < s; l++)
          if ("number" == typeof t[l + 1]) {
            if (((a = t[l]), null != r && a >= r)) break;
          } else
            t[l] < 0 && (e[18] += 65536),
              (a < i || -1 == i) &&
                (xC(e, n, t, l), (e[18] = (4294901760 & e[18]) + l + 2)),
              l++;
      }
      function xC(e, t, n, r) {
        const o = n[r] < 0,
          i = n[r + 1],
          a = e[o ? -n[r] : n[r]];
        if (o) {
          if (e[2] >> 11 < e[18] >> 16 && (3 & e[2]) === t) {
            e[2] += 2048;
            try {
              i.call(a);
            } finally {
            }
          }
        } else
          try {
            i.call(a);
          } finally {
          }
      }
      class so {
        constructor(t, n, r) {
          (this.factory = t),
            (this.resolving = !1),
            (this.canSeeViewProviders = n),
            (this.injectImpl = r);
        }
      }
      function Ii(e, t, n) {
        const r = ue(e);
        let o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if ("number" == typeof i) {
            if (0 !== i) break;
            o++;
            const s = n[o++],
              a = n[o++],
              l = n[o++];
            r ? e.setAttribute(t, a, l, s) : t.setAttributeNS(s, a, l);
          } else {
            const s = i,
              a = n[++o];
            xa(s)
              ? r && e.setProperty(t, s, a)
              : r
              ? e.setAttribute(t, s, a)
              : t.setAttribute(s, a),
              o++;
          }
        }
        return o;
      }
      function Vd(e) {
        return 3 === e || 4 === e || 6 === e;
      }
      function xa(e) {
        return 64 === e.charCodeAt(0);
      }
      function Ti(e, t) {
        if (null !== t && 0 !== t.length)
          if (null === e || 0 === e.length) e = t.slice();
          else {
            let n = -1;
            for (let r = 0; r < t.length; r++) {
              const o = t[r];
              "number" == typeof o
                ? (n = o)
                : 0 === n ||
                  Ud(e, n, o, null, -1 === n || 2 === n ? t[++r] : null);
            }
          }
        return e;
      }
      function Ud(e, t, n, r, o) {
        let i = 0,
          s = e.length;
        if (-1 === t) s = -1;
        else
          for (; i < e.length; ) {
            const a = e[i++];
            if ("number" == typeof a) {
              if (a === t) {
                s = -1;
                break;
              }
              if (a > t) {
                s = i - 1;
                break;
              }
            }
          }
        for (; i < e.length; ) {
          const a = e[i];
          if ("number" == typeof a) break;
          if (a === n) {
            if (null === r) return void (null !== o && (e[i + 1] = o));
            if (r === e[i + 1]) return void (e[i + 2] = o);
          }
          i++, null !== r && i++, null !== o && i++;
        }
        -1 !== s && (e.splice(s, 0, t), (i = s + 1)),
          e.splice(i++, 0, n),
          null !== r && e.splice(i++, 0, r),
          null !== o && e.splice(i++, 0, o);
      }
      function $d(e) {
        return -1 !== e;
      }
      function rr(e) {
        return 32767 & e;
      }
      function or(e, t) {
        let n = (function (e) {
            return e >> 16;
          })(e),
          r = t;
        for (; n > 0; ) (r = r[15]), n--;
        return r;
      }
      let Oa = !0;
      function Ai(e) {
        const t = Oa;
        return (Oa = e), t;
      }
      let LC = 0;
      function lo(e, t) {
        const n = Na(e, t);
        if (-1 !== n) return n;
        const r = t[1];
        r.firstCreatePass &&
          ((e.injectorIndex = t.length),
          Ra(r.data, e),
          Ra(t, null),
          Ra(r.blueprint, null));
        const o = Pi(e, t),
          i = e.injectorIndex;
        if ($d(o)) {
          const s = rr(o),
            a = or(o, t),
            l = a[1].data;
          for (let u = 0; u < 8; u++) t[i + u] = a[s + u] | l[s + u];
        }
        return (t[i + 8] = o), i;
      }
      function Ra(e, t) {
        e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
      }
      function Na(e, t) {
        return -1 === e.injectorIndex ||
          (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
          null === t[e.injectorIndex + 8]
          ? -1
          : e.injectorIndex;
      }
      function Pi(e, t) {
        if (e.parent && -1 !== e.parent.injectorIndex)
          return e.parent.injectorIndex;
        let n = 0,
          r = null,
          o = t;
        for (; null !== o; ) {
          const i = o[1],
            s = i.type;
          if (((r = 2 === s ? i.declTNode : 1 === s ? o[6] : null), null === r))
            return -1;
          if ((n++, (o = o[15]), -1 !== r.injectorIndex))
            return r.injectorIndex | (n << 16);
        }
        return -1;
      }
      function xi(e, t, n) {
        !(function (e, t, n) {
          let r;
          "string" == typeof n
            ? (r = n.charCodeAt(0) || 0)
            : n.hasOwnProperty(to) && (r = n[to]),
            null == r && (r = n[to] = LC++);
          const o = 255 & r;
          t.data[e + (o >> 5)] |= 1 << o;
        })(e, t, n);
      }
      function Gd(e, t, n) {
        if (n & j.Optional) return e;
        di(t, "NodeInjector");
      }
      function Wd(e, t, n, r) {
        if (
          (n & j.Optional && void 0 === r && (r = null),
          0 == (n & (j.Self | j.Host)))
        ) {
          const o = e[9],
            i = dn(void 0);
          try {
            return o ? o.get(t, r, n & j.Optional) : gd(t, r, n & j.Optional);
          } finally {
            dn(i);
          }
        }
        return Gd(r, t, n);
      }
      function Qd(e, t, n, r = j.Default, o) {
        if (null !== e) {
          const i = (function (e) {
            if ("string" == typeof e) return e.charCodeAt(0) || 0;
            const t = e.hasOwnProperty(to) ? e[to] : void 0;
            return "number" == typeof t ? (t >= 0 ? 255 & t : HC) : t;
          })(n);
          if ("function" == typeof i) {
            if (!Fd(t, e, r)) return r & j.Host ? Gd(o, n, r) : Wd(t, n, r, o);
            try {
              const s = i(r);
              if (null != s || r & j.Optional) return s;
              di(n);
            } finally {
              Bd();
            }
          } else if ("number" == typeof i) {
            let s = null,
              a = Na(e, t),
              l = -1,
              u = r & j.Host ? t[16][6] : null;
            for (
              (-1 === a || r & j.SkipSelf) &&
              ((l = -1 === a ? Pi(e, t) : t[a + 8]),
              -1 !== l && Zd(r, !1)
                ? ((s = t[1]), (a = rr(l)), (t = or(l, t)))
                : (a = -1));
              -1 !== a;

            ) {
              const c = t[1];
              if (Jd(i, a, c.data)) {
                const d = VC(a, t, n, s, r, u);
                if (d !== Kd) return d;
              }
              (l = t[a + 8]),
                -1 !== l && Zd(r, t[1].data[a + 8] === u) && Jd(i, a, t)
                  ? ((s = c), (a = rr(l)), (t = or(l, t)))
                  : (a = -1);
            }
          }
        }
        return Wd(t, n, r, o);
      }
      const Kd = {};
      function HC() {
        return new ir(De(), b());
      }
      function VC(e, t, n, r, o, i) {
        const s = t[1],
          a = s.data[e + 8],
          c = Oi(
            a,
            s,
            n,
            null == r ? yi(a) && Oa : r != s && 0 != (3 & a.type),
            o & j.Host && i === a,
          );
        return null !== c ? uo(t, s, c, a) : Kd;
      }
      function Oi(e, t, n, r, o) {
        const i = e.providerIndexes,
          s = t.data,
          a = 1048575 & i,
          l = e.directiveStart,
          c = i >> 20,
          f = o ? a + c : e.directiveEnd;
        for (let h = r ? a : a + c; h < f; h++) {
          const m = s[h];
          if ((h < l && n === m) || (h >= l && m.type === n)) return h;
        }
        if (o) {
          const h = s[l];
          if (h && Dt(h) && h.type === n) return l;
        }
        return null;
      }
      function uo(e, t, n, r) {
        let o = e[n];
        const i = t.data;
        if (
          (function (e) {
            return e instanceof so;
          })(o)
        ) {
          const s = o;
          s.resolving &&
            (function (e, t) {
              throw new Qe(
                "200",
                `Circular dependency in DI detected for ${e}`,
              );
            })(Le(i[n]));
          const a = Ai(s.canSeeViewProviders);
          s.resolving = !0;
          const l = s.injectImpl ? dn(s.injectImpl) : null;
          Fd(e, r, j.Default);
          try {
            (o = e[n] = s.factory(void 0, i, e, r)),
              t.firstCreatePass &&
                n >= r.directiveStart &&
                (function (e, t, n) {
                  const {
                    ngOnChanges: r,
                    ngOnInit: o,
                    ngDoCheck: i,
                  } = t.type.prototype;
                  if (r) {
                    const s = wd(t);
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(e, s),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, s);
                  }
                  o &&
                    (n.preOrderHooks || (n.preOrderHooks = [])).push(0 - e, o),
                    i &&
                      ((n.preOrderHooks || (n.preOrderHooks = [])).push(e, i),
                      (
                        n.preOrderCheckHooks || (n.preOrderCheckHooks = [])
                      ).push(e, i));
                })(n, i[n], t);
          } finally {
            null !== l && dn(l), Ai(a), (s.resolving = !1), Bd();
          }
        }
        return o;
      }
      function Jd(e, t, n) {
        return !!(n[t + (e >> 5)] & (1 << e));
      }
      function Zd(e, t) {
        return !(e & j.Self || (e & j.Host && t));
      }
      class ir {
        constructor(t, n) {
          (this._tNode = t), (this._lView = n);
        }
        get(t, n, r) {
          return Qd(this._tNode, this._lView, t, r, n);
        }
      }
      function co(e) {
        return (function (e, t) {
          if ("class" === t) return e.classes;
          if ("style" === t) return e.styles;
          const n = e.attrs;
          if (n) {
            const r = n.length;
            let o = 0;
            for (; o < r; ) {
              const i = n[o];
              if (Vd(i)) break;
              if (0 === i) o += 2;
              else if ("number" == typeof i)
                for (o++; o < r && "string" == typeof n[o]; ) o++;
              else {
                if (i === t) return n[o + 1];
                o += 2;
              }
            }
          }
          return null;
        })(De(), e);
      }
      const ar = "__parameters__";
      function ur(e, t, n) {
        return fn(() => {
          const r = (function (e) {
            return function (...n) {
              if (e) {
                const r = e(...n);
                for (const o in r) this[o] = r[o];
              }
            };
          })(t);
          function o(...i) {
            if (this instanceof o) return r.apply(this, i), this;
            const s = new o(...i);
            return (a.annotation = s), a;
            function a(l, u, c) {
              const d = l.hasOwnProperty(ar)
                ? l[ar]
                : Object.defineProperty(l, ar, { value: [] })[ar];
              for (; d.length <= c; ) d.push(null);
              return (d[c] = d[c] || []).push(s), l;
            }
          }
          return (
            n && (o.prototype = Object.create(n.prototype)),
            (o.prototype.ngMetadataName = e),
            (o.annotationCls = o),
            o
          );
        });
      }
      class W {
        constructor(t, n) {
          (this._desc = t),
            (this.ngMetadataName = "InjectionToken"),
            (this.ɵprov = void 0),
            "number" == typeof n
              ? (this.__NG_ELEMENT_ID__ = n)
              : void 0 !== n &&
                (this.ɵprov = V({
                  token: this,
                  providedIn: n.providedIn || "root",
                  factory: n.factory,
                }));
        }
        toString() {
          return `InjectionToken ${this._desc}`;
        }
      }
      const zC = new W("AnalyzeForEntryComponents");
      function dt(e, t) {
        void 0 === t && (t = e);
        for (let n = 0; n < e.length; n++) {
          let r = e[n];
          Array.isArray(r)
            ? (t === e && (t = e.slice(0, n)), dt(r, t))
            : t !== e && t.push(r);
        }
        return t;
      }
      function Nt(e, t) {
        e.forEach((n) => (Array.isArray(n) ? Nt(n, t) : t(n)));
      }
      function Xd(e, t, n) {
        t >= e.length ? e.push(n) : e.splice(t, 0, n);
      }
      function Ri(e, t) {
        return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
      }
      const go = {},
        Ha = "__NG_DI_FLAG__",
        Fi = "ngTempTokenPath",
        t_ = /\n/gm,
        of = "__source",
        r_ = ee({ provide: String, useValue: ee });
      let mo;
      function sf(e) {
        const t = mo;
        return (mo = e), t;
      }
      function o_(e, t = j.Default) {
        if (void 0 === mo)
          throw new Error("inject() must be called from an injection context");
        return null === mo
          ? gd(e, void 0, t)
          : mo.get(e, t & j.Optional ? null : void 0, t);
      }
      function A(e, t = j.Default) {
        return (da || o_)(H(e), t);
      }
      function Va(e) {
        const t = [];
        for (let n = 0; n < e.length; n++) {
          const r = H(e[n]);
          if (Array.isArray(r)) {
            if (0 === r.length)
              throw new Error("Arguments array must have arguments.");
            let o,
              i = j.Default;
            for (let s = 0; s < r.length; s++) {
              const a = r[s],
                l = i_(a);
              "number" == typeof l
                ? -1 === l
                  ? (o = a.token)
                  : (i |= l)
                : (o = a);
            }
            t.push(A(o, i));
          } else t.push(A(r));
        }
        return t;
      }
      function yo(e, t) {
        return (e[Ha] = t), (e.prototype[Ha] = t), e;
      }
      function i_(e) {
        return e[Ha];
      }
      const vo = yo(
          ur("Inject", (e) => ({ token: e })),
          -1,
        ),
        Ft = yo(ur("Optional"), 8),
        dr = yo(ur("SkipSelf"), 4);
      class gf {
        constructor(t) {
          this.changingThisBreaksApplicationSecurity = t;
        }
        toString() {
          return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see https://g.co/ng/security#xss)`;
        }
      }
      const I_ =
          /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi,
        T_ =
          /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;
      var ge = (() => (
        ((ge = ge || {})[(ge.NONE = 0)] = "NONE"),
        (ge[(ge.HTML = 1)] = "HTML"),
        (ge[(ge.STYLE = 2)] = "STYLE"),
        (ge[(ge.SCRIPT = 3)] = "SCRIPT"),
        (ge[(ge.URL = 4)] = "URL"),
        (ge[(ge.RESOURCE_URL = 5)] = "RESOURCE_URL"),
        ge
      ))();
      function Ka(e) {
        const t = (function () {
          const e = b();
          return e && e[12];
        })();
        return t
          ? t.sanitize(ge.URL, e) || ""
          : (function (e, t) {
              const n = (function (e) {
                return (e instanceof gf && e.getTypeName()) || null;
              })(e);
              if (null != n && n !== t) {
                if ("ResourceURL" === n && "URL" === t) return !0;
                throw new Error(
                  `Required a safe ${t}, got a ${n} (see https://g.co/ng/security#xss)`,
                );
              }
              return n === t;
            })(e, "URL")
          ? (function (e) {
              return e instanceof gf
                ? e.changingThisBreaksApplicationSecurity
                : e;
            })(e)
          : (function (e) {
              return (e = String(e)).match(I_) || e.match(T_)
                ? e
                : "unsafe:" + e;
            })(k(e));
      }
      const Mf = "__ngContext__";
      function Ne(e, t) {
        e[Mf] = t;
      }
      function Za(e) {
        const t = (function (e) {
          return e[Mf] || null;
        })(e);
        return t ? (Array.isArray(t) ? t : t.lView) : null;
      }
      function Xa(e) {
        return e.ngOriginalError;
      }
      function Y_(e, ...t) {
        e.error(...t);
      }
      class pr {
        constructor() {
          this._console = console;
        }
        handleError(t) {
          const n = this._findOriginalError(t),
            r = ((e = t) && e.ngErrorLogger) || Y_;
          var e;
          r(this._console, "ERROR", t),
            n && r(this._console, "ORIGINAL ERROR", n);
        }
        _findOriginalError(t) {
          let n = t && Xa(t);
          for (; n && Xa(n); ) n = Xa(n);
          return n || null;
        }
      }
      const Pf = (() =>
        (
          ("undefined" != typeof requestAnimationFrame &&
            requestAnimationFrame) ||
          setTimeout
        ).bind(X))();
      function Lt(e) {
        return e instanceof Function ? e() : e;
      }
      var et = (() => (
        ((et = et || {})[(et.Important = 1)] = "Important"),
        (et[(et.DashCase = 2)] = "DashCase"),
        et
      ))();
      function tl(e, t) {
        return undefined(e, t);
      }
      function Eo(e) {
        const t = e[3];
        return vt(t) ? t[3] : t;
      }
      function nl(e) {
        return Ff(e[13]);
      }
      function rl(e) {
        return Ff(e[4]);
      }
      function Ff(e) {
        for (; null !== e && !vt(e); ) e = e[4];
        return e;
      }
      function mr(e, t, n, r, o) {
        if (null != r) {
          let i,
            s = !1;
          vt(r) ? (i = r) : Ot(r) && ((s = !0), (r = r[0]));
          const a = pe(r);
          0 === e && null !== n
            ? null == o
              ? Vf(t, n, a)
              : jn(t, n, a, o || null, !0)
            : 1 === e && null !== n
            ? jn(t, n, a, o || null, !0)
            : 2 === e
            ? (function (e, t, n) {
                const r = Vi(e, t);
                r &&
                  (function (e, t, n, r) {
                    ue(e) ? e.removeChild(t, n, r) : t.removeChild(n);
                  })(e, r, t, n);
              })(t, a, s)
            : 3 === e && t.destroyNode(a),
            null != i &&
              (function (e, t, n, r, o) {
                const i = n[7];
                i !== pe(n) && mr(t, e, r, i, o);
                for (let a = 10; a < n.length; a++) {
                  const l = n[a];
                  Mo(l[1], l, e, t, r, i);
                }
              })(t, e, i, n, o);
        }
      }
      function il(e, t, n) {
        return ue(e)
          ? e.createElement(t, n)
          : null === n
          ? e.createElement(t)
          : e.createElementNS(n, t);
      }
      function Lf(e, t) {
        const n = e[9],
          r = n.indexOf(t),
          o = t[3];
        1024 & t[2] && ((t[2] &= -1025), ba(o, -1)), n.splice(r, 1);
      }
      function sl(e, t) {
        if (e.length <= 10) return;
        const n = 10 + t,
          r = e[n];
        if (r) {
          const o = r[17];
          null !== o && o !== e && Lf(o, r), t > 0 && (e[n - 1][4] = r[4]);
          const i = Ri(e, 10 + t);
          !(function (e, t) {
            Mo(e, t, t[U], 2, null, null), (t[0] = null), (t[6] = null);
          })(r[1], r);
          const s = i[19];
          null !== s && s.detachView(i[1]),
            (r[3] = null),
            (r[4] = null),
            (r[2] &= -129);
        }
        return r;
      }
      function jf(e, t) {
        if (!(256 & t[2])) {
          const n = t[U];
          ue(n) && n.destroyNode && Mo(e, t, n, 3, null, null),
            (function (e) {
              let t = e[13];
              if (!t) return al(e[1], e);
              for (; t; ) {
                let n = null;
                if (Ot(t)) n = t[13];
                else {
                  const r = t[10];
                  r && (n = r);
                }
                if (!n) {
                  for (; t && !t[4] && t !== e; )
                    Ot(t) && al(t[1], t), (t = t[3]);
                  null === t && (t = e), Ot(t) && al(t[1], t), (n = t && t[4]);
                }
                t = n;
              }
            })(t);
        }
      }
      function al(e, t) {
        if (!(256 & t[2])) {
          (t[2] &= -129),
            (t[2] |= 256),
            (function (e, t) {
              let n;
              if (null != e && null != (n = e.destroyHooks))
                for (let r = 0; r < n.length; r += 2) {
                  const o = t[n[r]];
                  if (!(o instanceof so)) {
                    const i = n[r + 1];
                    if (Array.isArray(i))
                      for (let s = 0; s < i.length; s += 2) {
                        const a = o[i[s]],
                          l = i[s + 1];
                        try {
                          l.call(a);
                        } finally {
                        }
                      }
                    else
                      try {
                        i.call(o);
                      } finally {
                      }
                  }
                }
            })(e, t),
            (function (e, t) {
              const n = e.cleanup,
                r = t[7];
              let o = -1;
              if (null !== n)
                for (let i = 0; i < n.length - 1; i += 2)
                  if ("string" == typeof n[i]) {
                    const s = n[i + 1],
                      a = "function" == typeof s ? s(t) : pe(t[s]),
                      l = r[(o = n[i + 2])],
                      u = n[i + 3];
                    "boolean" == typeof u
                      ? a.removeEventListener(n[i], l, u)
                      : u >= 0
                      ? r[(o = u)]()
                      : r[(o = -u)].unsubscribe(),
                      (i += 2);
                  } else {
                    const s = r[(o = n[i + 1])];
                    n[i].call(s);
                  }
              if (null !== r) {
                for (let i = o + 1; i < r.length; i++) r[i]();
                t[7] = null;
              }
            })(e, t),
            1 === t[1].type && ue(t[U]) && t[U].destroy();
          const n = t[17];
          if (null !== n && vt(t[3])) {
            n !== t[3] && Lf(n, t);
            const r = t[19];
            null !== r && r.detachView(e);
          }
        }
      }
      function Bf(e, t, n) {
        return (function (e, t, n) {
          let r = t;
          for (; null !== r && 40 & r.type; ) r = (t = r).parent;
          if (null === r) return n[0];
          if (2 & r.flags) {
            const o = e.data[r.directiveStart].encapsulation;
            if (o === xt.None || o === xt.Emulated) return null;
          }
          return ct(r, n);
        })(e, t.parent, n);
      }
      function jn(e, t, n, r, o) {
        ue(e) ? e.insertBefore(t, n, r, o) : t.insertBefore(n, r, o);
      }
      function Vf(e, t, n) {
        ue(e) ? e.appendChild(t, n) : t.appendChild(n);
      }
      function Uf(e, t, n, r, o) {
        null !== r ? jn(e, t, n, r, o) : Vf(e, t, n);
      }
      function Vi(e, t) {
        return ue(e) ? e.parentNode(t) : t.parentNode;
      }
      let zf = function (e, t, n) {
        return 40 & e.type ? ct(e, n) : null;
      };
      function Ui(e, t, n, r) {
        const o = Bf(e, r, t),
          i = t[U],
          a = (function (e, t, n) {
            return zf(e, t, n);
          })(r.parent || t[6], r, t);
        if (null != o)
          if (Array.isArray(n))
            for (let l = 0; l < n.length; l++) Uf(i, o, n[l], a, !1);
          else Uf(i, o, n, a, !1);
      }
      function $i(e, t) {
        if (null !== t) {
          const n = t.type;
          if (3 & n) return ct(t, e);
          if (4 & n) return ul(-1, e[t.index]);
          if (8 & n) {
            const r = t.child;
            if (null !== r) return $i(e, r);
            {
              const o = e[t.index];
              return vt(o) ? ul(-1, o) : pe(o);
            }
          }
          if (32 & n) return tl(t, e)() || pe(e[t.index]);
          {
            const r = Wf(e, t);
            return null !== r
              ? Array.isArray(r)
                ? r[0]
                : $i(Eo(e[16]), r)
              : $i(e, t.next);
          }
        }
        return null;
      }
      function Wf(e, t) {
        return null !== t ? e[16][6].projection[t.projection] : null;
      }
      function ul(e, t) {
        const n = 10 + e + 1;
        if (n < t.length) {
          const r = t[n],
            o = r[1].firstChild;
          if (null !== o) return $i(r, o);
        }
        return t[7];
      }
      function cl(e, t, n, r, o, i, s) {
        for (; null != n; ) {
          const a = r[n.index],
            l = n.type;
          if (
            (s && 0 === t && (a && Ne(pe(a), r), (n.flags |= 4)),
            64 != (64 & n.flags))
          )
            if (8 & l) cl(e, t, n.child, r, o, i, !1), mr(t, e, o, a, i);
            else if (32 & l) {
              const u = tl(n, r);
              let c;
              for (; (c = u()); ) mr(t, e, o, c, i);
              mr(t, e, o, a, i);
            } else 16 & l ? Kf(e, t, r, n, o, i) : mr(t, e, o, a, i);
          n = s ? n.projectionNext : n.next;
        }
      }
      function Mo(e, t, n, r, o, i) {
        cl(n, r, e.firstChild, t, o, i, !1);
      }
      function Kf(e, t, n, r, o, i) {
        const s = n[16],
          l = s[6].projection[r.projection];
        if (Array.isArray(l))
          for (let u = 0; u < l.length; u++) mr(t, e, o, l[u], i);
        else cl(e, t, l, s[3], o, i, !0);
      }
      function Jf(e, t, n) {
        ue(e) ? e.setAttribute(t, "style", n) : (t.style.cssText = n);
      }
      function dl(e, t, n) {
        ue(e)
          ? "" === n
            ? e.removeAttribute(t, "class")
            : e.setAttribute(t, "class", n)
          : (t.className = n);
      }
      function Zf(e, t, n) {
        let r = e.length;
        for (;;) {
          const o = e.indexOf(t, n);
          if (-1 === o) return o;
          if (0 === o || e.charCodeAt(o - 1) <= 32) {
            const i = t.length;
            if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
          }
          n = o + 1;
        }
      }
      const Yf = "ng-template";
      function Sw(e, t, n) {
        let r = 0;
        for (; r < e.length; ) {
          let o = e[r++];
          if (n && "class" === o) {
            if (((o = e[r]), -1 !== Zf(o.toLowerCase(), t, 0))) return !0;
          } else if (1 === o) {
            for (; r < e.length && "string" == typeof (o = e[r++]); )
              if (o.toLowerCase() === t) return !0;
            return !1;
          }
        }
        return !1;
      }
      function Xf(e) {
        return 4 === e.type && e.value !== Yf;
      }
      function Iw(e, t, n) {
        return t === (4 !== e.type || n ? e.value : Yf);
      }
      function Tw(e, t, n) {
        let r = 4;
        const o = e.attrs || [],
          i = (function (e) {
            for (let t = 0; t < e.length; t++) if (Vd(e[t])) return t;
            return e.length;
          })(o);
        let s = !1;
        for (let a = 0; a < t.length; a++) {
          const l = t[a];
          if ("number" != typeof l) {
            if (!s)
              if (4 & r) {
                if (
                  ((r = 2 | (1 & r)),
                  ("" !== l && !Iw(e, l, n)) || ("" === l && 1 === t.length))
                ) {
                  if (Ct(r)) return !1;
                  s = !0;
                }
              } else {
                const u = 8 & r ? l : t[++a];
                if (8 & r && null !== e.attrs) {
                  if (!Sw(e.attrs, u, n)) {
                    if (Ct(r)) return !1;
                    s = !0;
                  }
                  continue;
                }
                const d = Aw(8 & r ? "class" : l, o, Xf(e), n);
                if (-1 === d) {
                  if (Ct(r)) return !1;
                  s = !0;
                  continue;
                }
                if ("" !== u) {
                  let f;
                  f = d > i ? "" : o[d + 1].toLowerCase();
                  const h = 8 & r ? f : null;
                  if ((h && -1 !== Zf(h, u, 0)) || (2 & r && u !== f)) {
                    if (Ct(r)) return !1;
                    s = !0;
                  }
                }
              }
          } else {
            if (!s && !Ct(r) && !Ct(l)) return !1;
            if (s && Ct(l)) continue;
            (s = !1), (r = l | (1 & r));
          }
        }
        return Ct(r) || s;
      }
      function Ct(e) {
        return 0 == (1 & e);
      }
      function Aw(e, t, n, r) {
        if (null === t) return -1;
        let o = 0;
        if (r || !n) {
          let i = !1;
          for (; o < t.length; ) {
            const s = t[o];
            if (s === e) return o;
            if (3 === s || 6 === s) i = !0;
            else {
              if (1 === s || 2 === s) {
                let a = t[++o];
                for (; "string" == typeof a; ) a = t[++o];
                continue;
              }
              if (4 === s) break;
              if (0 === s) {
                o += 4;
                continue;
              }
            }
            o += i ? 1 : 2;
          }
          return -1;
        }
        return (function (e, t) {
          let n = e.indexOf(4);
          if (n > -1)
            for (n++; n < e.length; ) {
              const r = e[n];
              if ("number" == typeof r) return -1;
              if (r === t) return n;
              n++;
            }
          return -1;
        })(t, e);
      }
      function eh(e, t, n = !1) {
        for (let r = 0; r < t.length; r++) if (Tw(e, t[r], n)) return !0;
        return !1;
      }
      function th(e, t) {
        return e ? ":not(" + t.trim() + ")" : t;
      }
      function Nw(e) {
        let t = e[0],
          n = 1,
          r = 2,
          o = "",
          i = !1;
        for (; n < e.length; ) {
          let s = e[n];
          if ("string" == typeof s)
            if (2 & r) {
              const a = e[++n];
              o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
            } else 8 & r ? (o += "." + s) : 4 & r && (o += " " + s);
          else
            "" !== o && !Ct(s) && ((t += th(i, o)), (o = "")),
              (r = s),
              (i = i || !Ct(r));
          n++;
        }
        return "" !== o && (t += th(i, o)), t;
      }
      const L = {};
      function E(e) {
        nh(Z(), b(), Be() + e, Ci());
      }
      function nh(e, t, n, r) {
        if (!r)
          if (3 == (3 & t[2])) {
            const i = e.preOrderCheckHooks;
            null !== i && Mi(t, i, n);
          } else {
            const i = e.preOrderHooks;
            null !== i && Si(t, i, 0, n);
          }
        gn(n);
      }
      function hh(e, t) {
        const n = e.contentQueries;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) {
            const o = n[r],
              i = n[r + 1];
            if (-1 !== i) {
              const s = e.data[i];
              Ta(o), s.contentQueries(2, t[i], i);
            }
          }
      }
      function So(e, t, n, r, o, i, s, a, l, u) {
        const c = t.blueprint.slice();
        return (
          (c[0] = o),
          (c[2] = 140 | r),
          Ad(c),
          (c[3] = c[15] = e),
          (c[8] = n),
          (c[10] = s || (e && e[10])),
          (c[U] = a || (e && e[U])),
          (c[12] = l || (e && e[12]) || null),
          (c[9] = u || (e && e[9]) || null),
          (c[6] = i),
          (c[16] = 2 == t.type ? e[16] : c),
          c
        );
      }
      function yr(e, t, n, r, o) {
        let i = e.data[t];
        if (null === i)
          (i = (function (e, t, n, r, o) {
            const i = xd(),
              s = Ea(),
              l = (e.data[t] = (function (e, t, n, r, o, i) {
                return {
                  type: n,
                  index: r,
                  insertBeforeIndex: null,
                  injectorIndex: t ? t.injectorIndex : -1,
                  directiveStart: -1,
                  directiveEnd: -1,
                  directiveStylingLast: -1,
                  propertyBindings: null,
                  flags: 0,
                  providerIndexes: 0,
                  value: o,
                  attrs: i,
                  mergedAttrs: null,
                  localNames: null,
                  initialInputs: void 0,
                  inputs: null,
                  outputs: null,
                  tViews: null,
                  next: null,
                  projectionNext: null,
                  child: null,
                  parent: t,
                  projection: null,
                  styles: null,
                  stylesWithoutHost: null,
                  residualStyles: void 0,
                  classes: null,
                  classesWithoutHost: null,
                  residualClasses: void 0,
                  classBindings: 0,
                  styleBindings: 0,
                };
              })(0, s ? i : i && i.parent, n, t, r, o));
            return (
              null === e.firstChild && (e.firstChild = l),
              null !== i &&
                (s
                  ? null == i.child && null !== l.parent && (i.child = l)
                  : null === i.next && (i.next = l)),
              l
            );
          })(e, t, n, r, o)),
            F.lFrame.inI18n && (i.flags |= 64);
        else if (64 & i.type) {
          (i.type = n), (i.value = r), (i.attrs = o);
          const s = (function () {
            const e = F.lFrame,
              t = e.currentTNode;
            return e.isParent ? t : t.parent;
          })();
          i.injectorIndex = null === s ? -1 : s.injectorIndex;
        }
        return Rt(i, !0), i;
      }
      function vr(e, t, n, r) {
        if (0 === n) return -1;
        const o = t.length;
        for (let i = 0; i < n; i++)
          t.push(r), e.blueprint.push(r), e.data.push(null);
        return o;
      }
      function Io(e, t, n) {
        wi(t);
        try {
          const r = e.viewQuery;
          null !== r && Ol(1, r, n);
          const o = e.template;
          null !== o && ph(e, t, o, 1, n),
            e.firstCreatePass && (e.firstCreatePass = !1),
            e.staticContentQueries && hh(e, t),
            e.staticViewQueries && Ol(2, e.viewQuery, n);
          const i = e.components;
          null !== i &&
            (function (e, t) {
              for (let n = 0; n < t.length; n++) mb(e, t[n]);
            })(t, i);
        } catch (r) {
          throw (
            (e.firstCreatePass &&
              ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
            r)
          );
        } finally {
          (t[2] &= -5), bi();
        }
      }
      function Dr(e, t, n, r) {
        const o = t[2];
        if (256 == (256 & o)) return;
        wi(t);
        const i = Ci();
        try {
          Ad(t),
            (function (e) {
              F.lFrame.bindingIndex = e;
            })(e.bindingStartIndex),
            null !== n && ph(e, t, n, 2, r);
          const s = 3 == (3 & o);
          if (!i)
            if (s) {
              const u = e.preOrderCheckHooks;
              null !== u && Mi(t, u, null);
            } else {
              const u = e.preOrderHooks;
              null !== u && Si(t, u, 0, null), Aa(t, 0);
            }
          if (
            ((function (e) {
              for (let t = nl(e); null !== t; t = rl(t)) {
                if (!t[2]) continue;
                const n = t[9];
                for (let r = 0; r < n.length; r++) {
                  const o = n[r],
                    i = o[3];
                  0 == (1024 & o[2]) && ba(i, 1), (o[2] |= 1024);
                }
              }
            })(t),
            (function (e) {
              for (let t = nl(e); null !== t; t = rl(t))
                for (let n = 10; n < t.length; n++) {
                  const r = t[n],
                    o = r[1];
                  wa(r) && Dr(o, r, o.template, r[8]);
                }
            })(t),
            null !== e.contentQueries && hh(e, t),
            !i)
          )
            if (s) {
              const u = e.contentCheckHooks;
              null !== u && Mi(t, u);
            } else {
              const u = e.contentHooks;
              null !== u && Si(t, u, 1), Aa(t, 1);
            }
          !(function (e, t) {
            const n = e.hostBindingOpCodes;
            if (null !== n)
              try {
                for (let r = 0; r < n.length; r++) {
                  const o = n[r];
                  if (o < 0) gn(~o);
                  else {
                    const i = o,
                      s = n[++r],
                      a = n[++r];
                    CC(s, i), a(2, t[i]);
                  }
                }
              } finally {
                gn(-1);
              }
          })(e, t);
          const a = e.components;
          null !== a &&
            (function (e, t) {
              for (let n = 0; n < t.length; n++) gb(e, t[n]);
            })(t, a);
          const l = e.viewQuery;
          if ((null !== l && Ol(2, l, r), !i))
            if (s) {
              const u = e.viewCheckHooks;
              null !== u && Mi(t, u);
            } else {
              const u = e.viewHooks;
              null !== u && Si(t, u, 2), Aa(t, 2);
            }
          !0 === e.firstUpdatePass && (e.firstUpdatePass = !1),
            i || (t[2] &= -73),
            1024 & t[2] && ((t[2] &= -1025), ba(t[3], -1));
        } finally {
          bi();
        }
      }
      function Jw(e, t, n, r) {
        const o = t[10],
          i = !Ci(),
          s = Td(t);
        try {
          i && !s && o.begin && o.begin(), s && Io(e, t, r), Dr(e, t, n, r);
        } finally {
          i && !s && o.end && o.end();
        }
      }
      function ph(e, t, n, r, o) {
        const i = Be(),
          s = 2 & r;
        try {
          gn(-1), s && t.length > 20 && nh(e, t, 20, Ci()), n(r, o);
        } finally {
          gn(i);
        }
      }
      function mh(e) {
        const t = e.tView;
        return null === t || t.incompleteFirstPass
          ? (e.tView = Wi(
              1,
              null,
              e.template,
              e.decls,
              e.vars,
              e.directiveDefs,
              e.pipeDefs,
              e.viewQuery,
              e.schemas,
              e.consts,
            ))
          : t;
      }
      function Wi(e, t, n, r, o, i, s, a, l, u) {
        const c = 20 + r,
          d = c + o,
          f = (function (e, t) {
            const n = [];
            for (let r = 0; r < t; r++) n.push(r < e ? null : L);
            return n;
          })(c, d),
          h = "function" == typeof u ? u() : u;
        return (f[1] = {
          type: e,
          blueprint: f,
          template: n,
          queries: null,
          viewQuery: a,
          declTNode: t,
          data: f.slice().fill(null, c),
          bindingStartIndex: c,
          expandoStartIndex: d,
          hostBindingOpCodes: null,
          firstCreatePass: !0,
          firstUpdatePass: !0,
          staticViewQueries: !1,
          staticContentQueries: !1,
          preOrderHooks: null,
          preOrderCheckHooks: null,
          contentHooks: null,
          contentCheckHooks: null,
          viewHooks: null,
          viewCheckHooks: null,
          destroyHooks: null,
          cleanup: null,
          contentQueries: null,
          components: null,
          directiveRegistry: "function" == typeof i ? i() : i,
          pipeRegistry: "function" == typeof s ? s() : s,
          firstChild: null,
          schemas: l,
          consts: h,
          incompleteFirstPass: !1,
        });
      }
      function Dh(e, t, n, r) {
        const o = Ah(t);
        null === n
          ? o.push(r)
          : (o.push(n), e.firstCreatePass && Ph(e).push(r, o.length - 1));
      }
      function Ch(e, t, n) {
        for (let r in e)
          if (e.hasOwnProperty(r)) {
            const o = e[r];
            (n = null === n ? {} : n).hasOwnProperty(r)
              ? n[r].push(t, o)
              : (n[r] = [t, o]);
          }
        return n;
      }
      function wh(e, t, n, r, o, i) {
        const s = i.hostBindings;
        if (s) {
          let a = e.hostBindingOpCodes;
          null === a && (a = e.hostBindingOpCodes = []);
          const l = ~t.index;
          (function (e) {
            let t = e.length;
            for (; t > 0; ) {
              const n = e[--t];
              if ("number" == typeof n && n < 0) return n;
            }
            return 0;
          })(a) != l && a.push(l),
            a.push(r, o, s);
        }
      }
      function bh(e, t) {
        null !== e.hostBindings && e.hostBindings(1, t);
      }
      function Eh(e, t) {
        (t.flags |= 2), (e.components || (e.components = [])).push(t.index);
      }
      function ub(e, t, n) {
        if (n) {
          if (t.exportAs)
            for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
          Dt(t) && (n[""] = e);
        }
      }
      function Mh(e, t, n) {
        (e.flags |= 1),
          (e.directiveStart = t),
          (e.directiveEnd = t + n),
          (e.providerIndexes = t);
      }
      function Sh(e, t, n, r, o) {
        e.data[r] = o;
        const i = o.factory || (o.factory = kn(o.type)),
          s = new so(i, Dt(o), null);
        (e.blueprint[r] = s),
          (n[r] = s),
          wh(e, t, 0, r, vr(e, n, o.hostVars, L), o);
      }
      function cb(e, t, n) {
        const r = ct(t, e),
          o = mh(n),
          i = e[10],
          s = Qi(
            e,
            So(
              e,
              o,
              null,
              n.onPush ? 64 : 16,
              r,
              t,
              i,
              i.createRenderer(r, n),
              null,
              null,
            ),
          );
        e[t.index] = s;
      }
      function jt(e, t, n, r, o, i) {
        const s = ct(e, t);
        !(function (e, t, n, r, o, i, s) {
          if (null == i)
            ue(e) ? e.removeAttribute(t, o, n) : t.removeAttribute(o);
          else {
            const a = null == s ? k(i) : s(i, r || "", o);
            ue(e)
              ? e.setAttribute(t, o, a, n)
              : n
              ? t.setAttributeNS(n, o, a)
              : t.setAttribute(o, a);
          }
        })(t[U], s, i, e.value, n, r, o);
      }
      function db(e, t, n, r, o, i) {
        const s = i[t];
        if (null !== s) {
          const a = r.setInput;
          for (let l = 0; l < s.length; ) {
            const u = s[l++],
              c = s[l++],
              d = s[l++];
            null !== a ? r.setInput(n, d, u, c) : (n[c] = d);
          }
        }
      }
      function fb(e, t) {
        let n = null,
          r = 0;
        for (; r < t.length; ) {
          const o = t[r];
          if (0 !== o)
            if (5 !== o) {
              if ("number" == typeof o) break;
              e.hasOwnProperty(o) &&
                (null === n && (n = []), n.push(o, e[o], t[r + 1])),
                (r += 2);
            } else r += 2;
          else r += 4;
        }
        return n;
      }
      function gb(e, t) {
        const n = Ye(t, e);
        if (wa(n)) {
          const r = n[1];
          80 & n[2] ? Dr(r, n, r.template, n[8]) : n[5] > 0 && Tl(n);
        }
      }
      function Tl(e) {
        for (let r = nl(e); null !== r; r = rl(r))
          for (let o = 10; o < r.length; o++) {
            const i = r[o];
            if (1024 & i[2]) {
              const s = i[1];
              Dr(s, i, s.template, i[8]);
            } else i[5] > 0 && Tl(i);
          }
        const n = e[1].components;
        if (null !== n)
          for (let r = 0; r < n.length; r++) {
            const o = Ye(n[r], e);
            wa(o) && o[5] > 0 && Tl(o);
          }
      }
      function mb(e, t) {
        const n = Ye(t, e),
          r = n[1];
        (function (e, t) {
          for (let n = t.length; n < e.blueprint.length; n++)
            t.push(e.blueprint[n]);
        })(r, n),
          Io(r, n, n[8]);
      }
      function Qi(e, t) {
        return e[13] ? (e[14][4] = t) : (e[13] = t), (e[14] = t), t;
      }
      function Al(e) {
        for (; e; ) {
          e[2] |= 64;
          const t = Eo(e);
          if (XD(e) && !t) return e;
          e = t;
        }
        return null;
      }
      function xl(e, t, n) {
        const r = t[10];
        r.begin && r.begin();
        try {
          Dr(e, t, e.template, n);
        } catch (o) {
          throw (Oh(t, o), o);
        } finally {
          r.end && r.end();
        }
      }
      function Th(e) {
        !(function (e) {
          for (let t = 0; t < e.components.length; t++) {
            const n = e.components[t],
              r = Za(n),
              o = r[1];
            Jw(o, r, o.template, n);
          }
        })(e[8]);
      }
      function Ol(e, t, n) {
        Ta(0), t(e, n);
      }
      const _b = (() => Promise.resolve(null))();
      function Ah(e) {
        return e[7] || (e[7] = []);
      }
      function Ph(e) {
        return e.cleanup || (e.cleanup = []);
      }
      function Oh(e, t) {
        const n = e[9],
          r = n ? n.get(pr, null) : null;
        r && r.handleError(t);
      }
      function Rh(e, t, n, r, o) {
        for (let i = 0; i < n.length; ) {
          const s = n[i++],
            a = n[i++],
            l = t[s],
            u = e.data[s];
          null !== u.setInput ? u.setInput(l, o, r, a) : (l[a] = o);
        }
      }
      function nn(e, t, n) {
        const r = (function (e, t) {
          return pe(t[e]);
        })(t, e);
        !(function (e, t, n) {
          ue(e) ? e.setValue(t, n) : (t.textContent = n);
        })(e[U], r, n);
      }
      function Ki(e, t, n) {
        let r = n ? e.styles : null,
          o = n ? e.classes : null,
          i = 0;
        if (null !== t)
          for (let s = 0; s < t.length; s++) {
            const a = t[s];
            "number" == typeof a
              ? (i = a)
              : 1 == i
              ? (o = sa(o, a))
              : 2 == i && (r = sa(r, a + ": " + t[++s] + ";"));
          }
        n ? (e.styles = r) : (e.stylesWithoutHost = r),
          n ? (e.classes = o) : (e.classesWithoutHost = o);
      }
      const Rl = new W("INJECTOR", -1);
      class Nh {
        get(t, n = go) {
          if (n === go) {
            const r = new Error(`NullInjectorError: No provider for ${J(t)}!`);
            throw ((r.name = "NullInjectorError"), r);
          }
          return n;
        }
      }
      const Nl = new W("Set Injector scope."),
        To = {},
        Eb = {};
      let Fl;
      function Fh() {
        return void 0 === Fl && (Fl = new Nh()), Fl;
      }
      function kh(e, t = null, n = null, r) {
        const o = Lh(e, t, n, r);
        return o._resolveInjectorDefTypes(), o;
      }
      function Lh(e, t = null, n = null, r) {
        return new Mb(e, n, t || Fh(), r);
      }
      class Mb {
        constructor(t, n, r, o = null) {
          (this.parent = r),
            (this.records = new Map()),
            (this.injectorDefTypes = new Set()),
            (this.onDestroy = new Set()),
            (this._destroyed = !1);
          const i = [];
          n && Nt(n, (a) => this.processProvider(a, t, n)),
            Nt([t], (a) => this.processInjectorType(a, [], i)),
            this.records.set(Rl, Cr(void 0, this));
          const s = this.records.get(Nl);
          (this.scope = null != s ? s.value : null),
            (this.source = o || ("object" == typeof t ? null : J(t)));
        }
        get destroyed() {
          return this._destroyed;
        }
        destroy() {
          this.assertNotDestroyed(), (this._destroyed = !0);
          try {
            this.onDestroy.forEach((t) => t.ngOnDestroy());
          } finally {
            this.records.clear(),
              this.onDestroy.clear(),
              this.injectorDefTypes.clear();
          }
        }
        get(t, n = go, r = j.Default) {
          this.assertNotDestroyed();
          const o = sf(this),
            i = dn(void 0);
          try {
            if (!(r & j.SkipSelf)) {
              let a = this.records.get(t);
              if (void 0 === a) {
                const l =
                  ("function" == typeof (e = t) ||
                    ("object" == typeof e && e instanceof W)) &&
                  ua(t);
                (a = l && this.injectableDefInScope(l) ? Cr(kl(t), To) : null),
                  this.records.set(t, a);
              }
              if (null != a) return this.hydrate(t, a);
            }
            return (r & j.Self ? Fh() : this.parent).get(
              t,
              (n = r & j.Optional && n === go ? null : n),
            );
          } catch (s) {
            if ("NullInjectorError" === s.name) {
              if (((s[Fi] = s[Fi] || []).unshift(J(t)), o)) throw s;
              return (function (e, t, n, r) {
                const o = e[Fi];
                throw (
                  (t[of] && o.unshift(t[of]),
                  (e.message = (function (e, t, n, r = null) {
                    e =
                      e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1)
                        ? e.substr(2)
                        : e;
                    let o = J(t);
                    if (Array.isArray(t)) o = t.map(J).join(" -> ");
                    else if ("object" == typeof t) {
                      let i = [];
                      for (let s in t)
                        if (t.hasOwnProperty(s)) {
                          let a = t[s];
                          i.push(
                            s +
                              ":" +
                              ("string" == typeof a ? JSON.stringify(a) : J(a)),
                          );
                        }
                      o = `{${i.join(", ")}}`;
                    }
                    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
                      t_,
                      "\n  ",
                    )}`;
                  })("\n" + e.message, o, n, r)),
                  (e.ngTokenPath = o),
                  (e[Fi] = null),
                  e)
                );
              })(s, t, "R3InjectorError", this.source);
            }
            throw s;
          } finally {
            dn(i), sf(o);
          }
          var e;
        }
        _resolveInjectorDefTypes() {
          this.injectorDefTypes.forEach((t) => this.get(t));
        }
        toString() {
          const t = [];
          return (
            this.records.forEach((r, o) => t.push(J(o))),
            `R3Injector[${t.join(", ")}]`
          );
        }
        assertNotDestroyed() {
          if (this._destroyed)
            throw new Error("Injector has already been destroyed.");
        }
        processInjectorType(t, n, r) {
          if (!(t = H(t))) return !1;
          let o = hd(t);
          const i = (null == o && t.ngModule) || void 0,
            s = void 0 === i ? t : i,
            a = -1 !== r.indexOf(s);
          if ((void 0 !== i && (o = hd(i)), null == o)) return !1;
          if (null != o.imports && !a) {
            let c;
            r.push(s);
            try {
              Nt(o.imports, (d) => {
                this.processInjectorType(d, n, r) &&
                  (void 0 === c && (c = []), c.push(d));
              });
            } finally {
            }
            if (void 0 !== c)
              for (let d = 0; d < c.length; d++) {
                const { ngModule: f, providers: h } = c[d];
                Nt(h, (m) => this.processProvider(m, f, h || te));
              }
          }
          this.injectorDefTypes.add(s);
          const l = kn(s) || (() => new s());
          this.records.set(s, Cr(l, To));
          const u = o.providers;
          if (null != u && !a) {
            const c = t;
            Nt(u, (d) => this.processProvider(d, c, u));
          }
          return void 0 !== i && void 0 !== t.providers;
        }
        processProvider(t, n, r) {
          let o = _r((t = H(t))) ? t : H(t && t.provide);
          const i =
            ((e = t),
            Bh(e)
              ? Cr(void 0, e.useValue)
              : Cr(
                  (function (e, t, n) {
                    let r;
                    if (_r(e)) {
                      const o = H(e);
                      return kn(o) || kl(o);
                    }
                    if (Bh(e)) r = () => H(e.useValue);
                    else if (
                      (function (e) {
                        return !(!e || !e.useFactory);
                      })(e)
                    )
                      r = () => e.useFactory(...Va(e.deps || []));
                    else if (
                      (function (e) {
                        return !(!e || !e.useExisting);
                      })(e)
                    )
                      r = () => A(H(e.useExisting));
                    else {
                      const o = H(e && (e.useClass || e.provide));
                      if (
                        !(function (e) {
                          return !!e.deps;
                        })(e)
                      )
                        return kn(o) || kl(o);
                      r = () => new o(...Va(e.deps));
                    }
                    return r;
                  })(e),
                  To,
                ));
          var e;
          if (_r(t) || !0 !== t.multi) this.records.get(o);
          else {
            let s = this.records.get(o);
            s ||
              ((s = Cr(void 0, To, !0)),
              (s.factory = () => Va(s.multi)),
              this.records.set(o, s)),
              (o = t),
              s.multi.push(t);
          }
          this.records.set(o, i);
        }
        hydrate(t, n) {
          return (
            n.value === To && ((n.value = Eb), (n.value = n.factory())),
            "object" == typeof n.value &&
              n.value &&
              null !== (e = n.value) &&
              "object" == typeof e &&
              "function" == typeof e.ngOnDestroy &&
              this.onDestroy.add(n.value),
            n.value
          );
          var e;
        }
        injectableDefInScope(t) {
          if (!t.providedIn) return !1;
          const n = H(t.providedIn);
          return "string" == typeof n
            ? "any" === n || n === this.scope
            : this.injectorDefTypes.has(n);
        }
      }
      function kl(e) {
        const t = ua(e),
          n = null !== t ? t.factory : kn(e);
        if (null !== n) return n;
        if (e instanceof W)
          throw new Error(`Token ${J(e)} is missing a \u0275prov definition.`);
        if (e instanceof Function)
          return (function (e) {
            const t = e.length;
            if (t > 0) {
              const r = (function (e, t) {
                const n = [];
                for (let r = 0; r < e; r++) n.push(t);
                return n;
              })(t, "?");
              throw new Error(
                `Can't resolve all parameters for ${J(e)}: (${r.join(", ")}).`,
              );
            }
            const n = (function (e) {
              const t = e && (e[fi] || e[pd]);
              if (t) {
                const n = (function (e) {
                  if (e.hasOwnProperty("name")) return e.name;
                  const t = ("" + e).match(/^function\s*([^\s(]+)/);
                  return null === t ? "" : t[1];
                })(e);
                return (
                  console.warn(
                    `DEPRECATED: DI is instantiating a token "${n}" that inherits its @Injectable decorator but does not provide one itself.\nThis will become an error in a future version of Angular. Please add @Injectable() to the "${n}" class.`,
                  ),
                  t
                );
              }
              return null;
            })(e);
            return null !== n ? () => n.factory(e) : () => new e();
          })(e);
        throw new Error("unreachable");
      }
      function Cr(e, t, n = !1) {
        return { factory: e, value: t, multi: n ? [] : void 0 };
      }
      function Bh(e) {
        return null !== e && "object" == typeof e && r_ in e;
      }
      function _r(e) {
        return "function" == typeof e;
      }
      let Fe = (() => {
        class e {
          static create(n, r) {
            var o;
            if (Array.isArray(n)) return kh({ name: "" }, r, n, "");
            {
              const i = null !== (o = n.name) && void 0 !== o ? o : "";
              return kh({ name: i }, n.parent, n.providers, i);
            }
          }
        }
        return (
          (e.THROW_IF_NOT_FOUND = go),
          (e.NULL = new Nh()),
          (e.ɵprov = V({ token: e, providedIn: "any", factory: () => A(Rl) })),
          (e.__NG_ELEMENT_ID__ = -1),
          e
        );
      })();
      function Vb(e, t) {
        Ei(Za(e)[1], De());
      }
      let Ji = null;
      function wr() {
        if (!Ji) {
          const e = X.Symbol;
          if (e && e.iterator) Ji = e.iterator;
          else {
            const t = Object.getOwnPropertyNames(Map.prototype);
            for (let n = 0; n < t.length; ++n) {
              const r = t[n];
              "entries" !== r &&
                "size" !== r &&
                Map.prototype[r] === Map.prototype.entries &&
                (Ji = r);
            }
          }
        }
        return Ji;
      }
      function Ao(e) {
        return (
          !!Hl(e) && (Array.isArray(e) || (!(e instanceof Map) && wr() in e))
        );
      }
      function Hl(e) {
        return null !== e && ("function" == typeof e || "object" == typeof e);
      }
      function Bt(e, t, n) {
        return (e[t] = n);
      }
      function ke(e, t, n) {
        return !Object.is(e[t], n) && ((e[t] = n), !0);
      }
      function Vl(e, t, n, r) {
        const o = b();
        return ke(o, nr(), t) && (Z(), jt(ce(), o, e, t, n, r)), Vl;
      }
      function T(e, t = j.Default) {
        const n = b();
        return null === n ? A(e, t) : Qd(De(), n, H(e), t);
      }
      function Gl() {
        throw new Error("invalid");
      }
      function Cn(e, t, n) {
        const r = b();
        return (
          ke(r, nr(), t) &&
            (function (e, t, n, r, o, i, s, a) {
              const l = ct(t, n);
              let c,
                u = t.inputs;
              !a && null != u && (c = u[r])
                ? (Rh(e, n, c, r, o),
                  yi(t) &&
                    (function (e, t) {
                      const n = Ye(t, e);
                      16 & n[2] || (n[2] |= 64);
                    })(n, t.index))
                : 3 & t.type &&
                  ((r = (function (e) {
                    return "class" === e
                      ? "className"
                      : "for" === e
                      ? "htmlFor"
                      : "formaction" === e
                      ? "formAction"
                      : "innerHtml" === e
                      ? "innerHTML"
                      : "readonly" === e
                      ? "readOnly"
                      : "tabindex" === e
                      ? "tabIndex"
                      : e;
                  })(r)),
                  (o = null != s ? s(o, t.value || "", r) : o),
                  ue(i)
                    ? i.setProperty(l, r, o)
                    : xa(r) ||
                      (l.setProperty ? l.setProperty(r, o) : (l[r] = o)));
            })(Z(), ce(), r, e, t, r[U], n, !1),
          Cn
        );
      }
      function Wl(e, t, n, r, o) {
        const s = o ? "class" : "style";
        Rh(e, n, t.inputs[s], s, r);
      }
      function p(e, t, n, r) {
        const o = b(),
          i = Z(),
          s = 20 + e,
          a = o[U],
          l = (o[s] = il(a, t, F.lFrame.currentNamespace)),
          u = i.firstCreatePass
            ? (function (e, t, n, r, o, i, s) {
                const a = t.consts,
                  u = yr(t, e, 2, o, pn(a, i));
                return (
                  (function (e, t, n, r) {
                    let o = !1;
                    if (Pd()) {
                      const i = (function (e, t, n) {
                          const r = e.directiveRegistry;
                          let o = null;
                          if (r)
                            for (let i = 0; i < r.length; i++) {
                              const s = r[i];
                              eh(n, s.selectors, !1) &&
                                (o || (o = []),
                                xi(lo(n, t), e, s.type),
                                Dt(s) ? (Eh(e, n), o.unshift(s)) : o.push(s));
                            }
                          return o;
                        })(e, t, n),
                        s = null === r ? null : { "": -1 };
                      if (null !== i) {
                        (o = !0), Mh(n, e.data.length, i.length);
                        for (let c = 0; c < i.length; c++) {
                          const d = i[c];
                          d.providersResolver && d.providersResolver(d);
                        }
                        let a = !1,
                          l = !1,
                          u = vr(e, t, i.length, null);
                        for (let c = 0; c < i.length; c++) {
                          const d = i[c];
                          (n.mergedAttrs = Ti(n.mergedAttrs, d.hostAttrs)),
                            Sh(e, n, t, u, d),
                            ub(u, d, s),
                            null !== d.contentQueries && (n.flags |= 8),
                            (null !== d.hostBindings ||
                              null !== d.hostAttrs ||
                              0 !== d.hostVars) &&
                              (n.flags |= 128);
                          const f = d.type.prototype;
                          !a &&
                            (f.ngOnChanges || f.ngOnInit || f.ngDoCheck) &&
                            ((e.preOrderHooks || (e.preOrderHooks = [])).push(
                              n.index,
                            ),
                            (a = !0)),
                            !l &&
                              (f.ngOnChanges || f.ngDoCheck) &&
                              ((
                                e.preOrderCheckHooks ||
                                (e.preOrderCheckHooks = [])
                              ).push(n.index),
                              (l = !0)),
                            u++;
                        }
                        !(function (e, t) {
                          const r = t.directiveEnd,
                            o = e.data,
                            i = t.attrs,
                            s = [];
                          let a = null,
                            l = null;
                          for (let u = t.directiveStart; u < r; u++) {
                            const c = o[u],
                              d = c.inputs,
                              f = null === i || Xf(t) ? null : fb(d, i);
                            s.push(f),
                              (a = Ch(d, u, a)),
                              (l = Ch(c.outputs, u, l));
                          }
                          null !== a &&
                            (a.hasOwnProperty("class") && (t.flags |= 16),
                            a.hasOwnProperty("style") && (t.flags |= 32)),
                            (t.initialInputs = s),
                            (t.inputs = a),
                            (t.outputs = l);
                        })(e, n);
                      }
                      s &&
                        (function (e, t, n) {
                          if (t) {
                            const r = (e.localNames = []);
                            for (let o = 0; o < t.length; o += 2) {
                              const i = n[t[o + 1]];
                              if (null == i)
                                throw new Qe(
                                  "301",
                                  `Export of name '${t[o + 1]}' not found!`,
                                );
                              r.push(t[o], i);
                            }
                          }
                        })(n, r, s);
                    }
                    n.mergedAttrs = Ti(n.mergedAttrs, n.attrs);
                  })(t, n, u, pn(a, s)),
                  null !== u.attrs && Ki(u, u.attrs, !1),
                  null !== u.mergedAttrs && Ki(u, u.mergedAttrs, !0),
                  null !== t.queries && t.queries.elementStart(t, u),
                  u
                );
              })(s, i, o, 0, t, n, r)
            : i.data[s];
        Rt(u, !0);
        const c = u.mergedAttrs;
        null !== c && Ii(a, l, c);
        const d = u.classes;
        null !== d && dl(a, l, d);
        const f = u.styles;
        null !== f && Jf(a, l, f),
          64 != (64 & u.flags) && Ui(i, o, l, u),
          0 === F.lFrame.elementDepthCount && Ne(l, o),
          F.lFrame.elementDepthCount++,
          vi(u) &&
            ((function (e, t, n) {
              !Pd() ||
                ((function (e, t, n, r) {
                  const o = n.directiveStart,
                    i = n.directiveEnd;
                  e.firstCreatePass || lo(n, t), Ne(r, t);
                  const s = n.initialInputs;
                  for (let a = o; a < i; a++) {
                    const l = e.data[a],
                      u = Dt(l);
                    u && cb(t, n, l);
                    const c = uo(t, e, a, n);
                    Ne(c, t),
                      null !== s && db(0, a - o, c, l, 0, s),
                      u && (Ye(n.index, t)[8] = c);
                  }
                })(e, t, n, ct(n, t)),
                128 == (128 & n.flags) &&
                  (function (e, t, n) {
                    const r = n.directiveStart,
                      o = n.directiveEnd,
                      s = n.index,
                      a = F.lFrame.currentDirectiveIndex;
                    try {
                      gn(s);
                      for (let l = r; l < o; l++) {
                        const u = e.data[l],
                          c = t[l];
                        Sa(l),
                          (null !== u.hostBindings ||
                            0 !== u.hostVars ||
                            null !== u.hostAttrs) &&
                            bh(u, c);
                      }
                    } finally {
                      gn(-1), Sa(a);
                    }
                  })(e, t, n));
            })(i, o, u),
            (function (e, t, n) {
              if (ma(t)) {
                const o = t.directiveEnd;
                for (let i = t.directiveStart; i < o; i++) {
                  const s = e.data[i];
                  s.contentQueries && s.contentQueries(1, n[i], i);
                }
              }
            })(i, u, o)),
          null !== r &&
            (function (e, t, n = ct) {
              const r = t.localNames;
              if (null !== r) {
                let o = t.index + 1;
                for (let i = 0; i < r.length; i += 2) {
                  const s = r[i + 1],
                    a = -1 === s ? n(t, e) : e[s];
                  e[o++] = a;
                }
              }
            })(o, u);
      }
      function g() {
        let e = De();
        Ea() ? (F.lFrame.isParent = !1) : ((e = e.parent), Rt(e, !1));
        const t = e;
        F.lFrame.elementDepthCount--;
        const n = Z();
        n.firstCreatePass && (Ei(n, e), ma(e) && n.queries.elementEnd(e)),
          null != t.classesWithoutHost &&
            (function (e) {
              return 0 != (16 & e.flags);
            })(t) &&
            Wl(n, t, b(), t.classesWithoutHost, !0),
          null != t.stylesWithoutHost &&
            (function (e) {
              return 0 != (32 & e.flags);
            })(t) &&
            Wl(n, t, b(), t.stylesWithoutHost, !1);
      }
      function C(e, t, n, r) {
        p(e, t, n, r), g();
      }
      function Xi(e) {
        return !!e && "function" == typeof e.then;
      }
      const _p = function (e) {
        return !!e && "function" == typeof e.subscribe;
      };
      function Ve(e, t, n, r) {
        const o = b(),
          i = Z(),
          s = De();
        return (
          (function (e, t, n, r, o, i, s, a) {
            const l = vi(r),
              c = e.firstCreatePass && Ph(e),
              d = t[8],
              f = Ah(t);
            let h = !0;
            if (3 & r.type || a) {
              const _ = ct(r, t),
                w = a ? a(_) : _,
                y = f.length,
                I = a ? (O) => a(pe(O[r.index])) : r.index;
              if (ue(n)) {
                let O = null;
                if (
                  (!a &&
                    l &&
                    (O = (function (e, t, n, r) {
                      const o = e.cleanup;
                      if (null != o)
                        for (let i = 0; i < o.length - 1; i += 2) {
                          const s = o[i];
                          if (s === n && o[i + 1] === r) {
                            const a = t[7],
                              l = o[i + 2];
                            return a.length > l ? a[l] : null;
                          }
                          "string" == typeof s && (i += 2);
                        }
                      return null;
                    })(e, t, o, r.index)),
                  null !== O)
                )
                  ((O.__ngLastListenerFn__ || O).__ngNextListenerFn__ = i),
                    (O.__ngLastListenerFn__ = i),
                    (h = !1);
                else {
                  i = Ql(r, t, d, i, !1);
                  const K = n.listen(w, o, i);
                  f.push(i, K), c && c.push(o, I, y, y + 1);
                }
              } else
                (i = Ql(r, t, d, i, !0)),
                  w.addEventListener(o, i, s),
                  f.push(i),
                  c && c.push(o, I, y, s);
            } else i = Ql(r, t, d, i, !1);
            const m = r.outputs;
            let D;
            if (h && null !== m && (D = m[o])) {
              const _ = D.length;
              if (_)
                for (let w = 0; w < _; w += 2) {
                  const it = t[D[w]][D[w + 1]].subscribe(i),
                    Kn = f.length;
                  f.push(i, it), c && c.push(o, r.index, Kn, -(Kn + 1));
                }
            }
          })(i, o, o[U], s, e, t, !!n, r),
          Ve
        );
      }
      function Ep(e, t, n, r) {
        try {
          return !1 !== n(r);
        } catch (o) {
          return Oh(e, o), !1;
        }
      }
      function Ql(e, t, n, r, o) {
        return function i(s) {
          if (s === Function) return r;
          const a = 2 & e.flags ? Ye(e.index, t) : t;
          0 == (32 & t[2]) && Al(a);
          let l = Ep(t, 0, r, s),
            u = i.__ngNextListenerFn__;
          for (; u; ) (l = Ep(t, 0, u, s) && l), (u = u.__ngNextListenerFn__);
          return o && !1 === l && (s.preventDefault(), (s.returnValue = !1)), l;
        };
      }
      function v(e, t = "") {
        const n = b(),
          r = Z(),
          o = e + 20,
          i = r.firstCreatePass ? yr(r, o, 1, t, null) : r.data[o],
          s = (n[o] = (function (e, t) {
            return ue(e) ? e.createText(t) : e.createTextNode(t);
          })(n[U], t));
        Ui(r, n, s, i), Rt(i, !1);
      }
      function P(e) {
        return N("", e, ""), P;
      }
      function N(e, t, n) {
        const r = b(),
          o = (function (e, t, n, r) {
            return ke(e, nr(), n) ? t + k(n) + r : L;
          })(r, e, t, n);
        return o !== L && nn(r, Be(), o), N;
      }
      const Hn = void 0;
      var pE = [
        "en",
        [["a", "p"], ["AM", "PM"], Hn],
        [["AM", "PM"], Hn, Hn],
        [
          ["S", "M", "T", "W", "T", "F", "S"],
          ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        ],
        Hn,
        [
          ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
          [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
        ],
        Hn,
        [
          ["B", "A"],
          ["BC", "AD"],
          ["Before Christ", "Anno Domini"],
        ],
        0,
        [6, 0],
        ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"],
        ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"],
        ["{1}, {0}", Hn, "{1} 'at' {0}", Hn],
        [
          ".",
          ",",
          ";",
          "%",
          "+",
          "-",
          "E",
          "\xd7",
          "\u2030",
          "\u221e",
          "NaN",
          ":",
        ],
        ["#,##0.###", "#,##0%", "\xa4#,##0.00", "#E0"],
        "USD",
        "$",
        "US Dollar",
        {},
        "ltr",
        function (e) {
          const n = Math.floor(Math.abs(e)),
            r = e.toString().replace(/^[^.]*\.?/, "").length;
          return 1 === n && 0 === r ? 1 : 5;
        },
      ];
      let Nr = {};
      function gg(e) {
        return (
          e in Nr ||
            (Nr[e] =
              X.ng &&
              X.ng.common &&
              X.ng.common.locales &&
              X.ng.common.locales[e]),
          Nr[e]
        );
      }
      var S = (() => (
        ((S = S || {})[(S.LocaleId = 0)] = "LocaleId"),
        (S[(S.DayPeriodsFormat = 1)] = "DayPeriodsFormat"),
        (S[(S.DayPeriodsStandalone = 2)] = "DayPeriodsStandalone"),
        (S[(S.DaysFormat = 3)] = "DaysFormat"),
        (S[(S.DaysStandalone = 4)] = "DaysStandalone"),
        (S[(S.MonthsFormat = 5)] = "MonthsFormat"),
        (S[(S.MonthsStandalone = 6)] = "MonthsStandalone"),
        (S[(S.Eras = 7)] = "Eras"),
        (S[(S.FirstDayOfWeek = 8)] = "FirstDayOfWeek"),
        (S[(S.WeekendRange = 9)] = "WeekendRange"),
        (S[(S.DateFormat = 10)] = "DateFormat"),
        (S[(S.TimeFormat = 11)] = "TimeFormat"),
        (S[(S.DateTimeFormat = 12)] = "DateTimeFormat"),
        (S[(S.NumberSymbols = 13)] = "NumberSymbols"),
        (S[(S.NumberFormats = 14)] = "NumberFormats"),
        (S[(S.CurrencyCode = 15)] = "CurrencyCode"),
        (S[(S.CurrencySymbol = 16)] = "CurrencySymbol"),
        (S[(S.CurrencyName = 17)] = "CurrencyName"),
        (S[(S.Currencies = 18)] = "Currencies"),
        (S[(S.Directionality = 19)] = "Directionality"),
        (S[(S.PluralCase = 20)] = "PluralCase"),
        (S[(S.ExtraData = 21)] = "ExtraData"),
        S
      ))();
      const ts = "en-US";
      let mg = ts;
      class Vg {}
      class yM {
        resolveComponentFactory(t) {
          throw (function (e) {
            const t = Error(
              `No component factory found for ${J(
                e,
              )}. Did you add it to @NgModule.entryComponents?`,
            );
            return (t.ngComponent = e), t;
          })(t);
        }
      }
      let kr = (() => {
        class e {}
        return (e.NULL = new yM()), e;
      })();
      function vM() {
        return Lr(De(), b());
      }
      function Lr(e, t) {
        return new _n(ct(e, t));
      }
      let _n = (() => {
        class e {
          constructor(n) {
            this.nativeElement = n;
          }
        }
        return (e.__NG_ELEMENT_ID__ = vM), e;
      })();
      function DM(e) {
        return e instanceof _n ? e.nativeElement : e;
      }
      class $g {}
      let ss = (() => {
          class e {}
          return (
            (e.__NG_ELEMENT_ID__ = () =>
              (function () {
                const e = b(),
                  n = Ye(De().index, e);
                return (function (e) {
                  return e[U];
                })(Ot(n) ? n : e);
              })()),
            e
          );
        })(),
        wM = (() => {
          class e {}
          return (
            (e.ɵprov = V({
              token: e,
              providedIn: "root",
              factory: () => null,
            })),
            e
          );
        })();
      class as {
        constructor(t) {
          (this.full = t),
            (this.major = t.split(".")[0]),
            (this.minor = t.split(".")[1]),
            (this.patch = t.split(".").slice(2).join("."));
        }
      }
      const bM = new as("13.1.0"),
        ru = {};
      function ls(e, t, n, r, o = !1) {
        for (; null !== n; ) {
          const i = t[n.index];
          if ((null !== i && r.push(pe(i)), vt(i)))
            for (let a = 10; a < i.length; a++) {
              const l = i[a],
                u = l[1].firstChild;
              null !== u && ls(l[1], l, u, r);
            }
          const s = n.type;
          if (8 & s) ls(e, t, n.child, r);
          else if (32 & s) {
            const a = tl(n, t);
            let l;
            for (; (l = a()); ) r.push(l);
          } else if (16 & s) {
            const a = Wf(t, n);
            if (Array.isArray(a)) r.push(...a);
            else {
              const l = Eo(t[16]);
              ls(l[1], l, a, r, !0);
            }
          }
          n = o ? n.projectionNext : n.next;
        }
        return r;
      }
      class ko {
        constructor(t, n) {
          (this._lView = t),
            (this._cdRefInjectingView = n),
            (this._appRef = null),
            (this._attachedToViewContainer = !1);
        }
        get rootNodes() {
          const t = this._lView,
            n = t[1];
          return ls(n, t, n.firstChild, []);
        }
        get context() {
          return this._lView[8];
        }
        set context(t) {
          this._lView[8] = t;
        }
        get destroyed() {
          return 256 == (256 & this._lView[2]);
        }
        destroy() {
          if (this._appRef) this._appRef.detachView(this);
          else if (this._attachedToViewContainer) {
            const t = this._lView[3];
            if (vt(t)) {
              const n = t[8],
                r = n ? n.indexOf(this) : -1;
              r > -1 && (sl(t, r), Ri(n, r));
            }
            this._attachedToViewContainer = !1;
          }
          jf(this._lView[1], this._lView);
        }
        onDestroy(t) {
          Dh(this._lView[1], this._lView, null, t);
        }
        markForCheck() {
          Al(this._cdRefInjectingView || this._lView);
        }
        detach() {
          this._lView[2] &= -129;
        }
        reattach() {
          this._lView[2] |= 128;
        }
        detectChanges() {
          xl(this._lView[1], this._lView, this.context);
        }
        checkNoChanges() {
          !(function (e, t, n) {
            _i(!0);
            try {
              xl(e, t, n);
            } finally {
              _i(!1);
            }
          })(this._lView[1], this._lView, this.context);
        }
        attachToViewContainerRef() {
          if (this._appRef)
            throw new Error(
              "This view is already attached directly to the ApplicationRef!",
            );
          this._attachedToViewContainer = !0;
        }
        detachFromAppRef() {
          var t;
          (this._appRef = null),
            Mo(this._lView[1], (t = this._lView), t[U], 2, null, null);
        }
        attachToAppRef(t) {
          if (this._attachedToViewContainer)
            throw new Error(
              "This view is already attached to a ViewContainer!",
            );
          this._appRef = t;
        }
      }
      class EM extends ko {
        constructor(t) {
          super(t), (this._view = t);
        }
        detectChanges() {
          Th(this._view);
        }
        checkNoChanges() {
          !(function (e) {
            _i(!0);
            try {
              Th(e);
            } finally {
              _i(!1);
            }
          })(this._view);
        }
        get context() {
          return null;
        }
      }
      class qg extends kr {
        constructor(t) {
          super(), (this.ngModule = t);
        }
        resolveComponentFactory(t) {
          const n = Oe(t);
          return new ou(n, this.ngModule);
        }
      }
      function zg(e) {
        const t = [];
        for (let n in e)
          e.hasOwnProperty(n) && t.push({ propName: e[n], templateName: n });
        return t;
      }
      const SM = new W("SCHEDULER_TOKEN", {
        providedIn: "root",
        factory: () => Pf,
      });
      class ou extends Vg {
        constructor(t, n) {
          super(),
            (this.componentDef = t),
            (this.ngModule = n),
            (this.componentType = t.type),
            (this.selector = t.selectors.map(Nw).join(",")),
            (this.ngContentSelectors = t.ngContentSelectors
              ? t.ngContentSelectors
              : []),
            (this.isBoundToModule = !!n);
        }
        get inputs() {
          return zg(this.componentDef.inputs);
        }
        get outputs() {
          return zg(this.componentDef.outputs);
        }
        create(t, n, r, o) {
          const i = (o = o || this.ngModule)
              ? (function (e, t) {
                  return {
                    get: (n, r, o) => {
                      const i = e.get(n, ru, o);
                      return i !== ru || r === ru ? i : t.get(n, r, o);
                    },
                  };
                })(t, o.injector)
              : t,
            s = i.get($g, Id),
            a = i.get(wM, null),
            l = s.createRenderer(null, this.componentDef),
            u = this.componentDef.selectors[0][0] || "div",
            c = r
              ? (function (e, t, n) {
                  if (ue(e)) return e.selectRootElement(t, n === xt.ShadowDom);
                  let r = "string" == typeof t ? e.querySelector(t) : t;
                  return (r.textContent = ""), r;
                })(l, r, this.componentDef.encapsulation)
              : il(
                  s.createRenderer(null, this.componentDef),
                  u,
                  (function (e) {
                    const t = e.toLowerCase();
                    return "svg" === t
                      ? "http://www.w3.org/2000/svg"
                      : "math" === t
                      ? "http://www.w3.org/1998/MathML/"
                      : null;
                  })(u),
                ),
            d = this.componentDef.onPush ? 576 : 528,
            f = (function (e, t) {
              return {
                components: [],
                scheduler: e || Pf,
                clean: _b,
                playerHandler: t || null,
                flags: 0,
              };
            })(),
            h = Wi(0, null, null, 1, 0, null, null, null, null, null),
            m = So(null, h, f, d, null, null, s, l, a, i);
          let D, _;
          wi(m);
          try {
            const w = (function (e, t, n, r, o, i) {
              const s = n[1];
              n[20] = e;
              const l = yr(s, 20, 2, "#host", null),
                u = (l.mergedAttrs = t.hostAttrs);
              null !== u &&
                (Ki(l, u, !0),
                null !== e &&
                  (Ii(o, e, u),
                  null !== l.classes && dl(o, e, l.classes),
                  null !== l.styles && Jf(o, e, l.styles)));
              const c = r.createRenderer(e, t),
                d = So(
                  n,
                  mh(t),
                  null,
                  t.onPush ? 64 : 16,
                  n[20],
                  l,
                  r,
                  c,
                  i || null,
                  null,
                );
              return (
                s.firstCreatePass &&
                  (xi(lo(l, n), s, t.type), Eh(s, l), Mh(l, n.length, 1)),
                Qi(n, d),
                (n[20] = d)
              );
            })(c, this.componentDef, m, s, l);
            if (c)
              if (r) Ii(l, c, ["ng-version", bM.full]);
              else {
                const { attrs: y, classes: I } = (function (e) {
                  const t = [],
                    n = [];
                  let r = 1,
                    o = 2;
                  for (; r < e.length; ) {
                    let i = e[r];
                    if ("string" == typeof i)
                      2 === o
                        ? "" !== i && t.push(i, e[++r])
                        : 8 === o && n.push(i);
                    else {
                      if (!Ct(o)) break;
                      o = i;
                    }
                    r++;
                  }
                  return { attrs: t, classes: n };
                })(this.componentDef.selectors[0]);
                y && Ii(l, c, y), I && I.length > 0 && dl(l, c, I.join(" "));
              }
            if (((_ = _a(h, 20)), void 0 !== n)) {
              const y = (_.projection = []);
              for (let I = 0; I < this.ngContentSelectors.length; I++) {
                const O = n[I];
                y.push(null != O ? Array.from(O) : null);
              }
            }
            (D = (function (e, t, n, r, o) {
              const i = n[1],
                s = (function (e, t, n) {
                  const r = De();
                  e.firstCreatePass &&
                    (n.providersResolver && n.providersResolver(n),
                    Sh(e, r, t, vr(e, t, 1, null), n));
                  const o = uo(t, e, r.directiveStart, r);
                  Ne(o, t);
                  const i = ct(r, t);
                  return i && Ne(i, t), o;
                })(i, n, t);
              if (
                (r.components.push(s),
                (e[8] = s),
                o && o.forEach((l) => l(s, t)),
                t.contentQueries)
              ) {
                const l = De();
                t.contentQueries(1, s, l.directiveStart);
              }
              const a = De();
              return (
                !i.firstCreatePass ||
                  (null === t.hostBindings && null === t.hostAttrs) ||
                  (gn(a.index),
                  wh(n[1], a, 0, a.directiveStart, a.directiveEnd, t),
                  bh(t, s)),
                s
              );
            })(w, this.componentDef, m, f, [Vb])),
              Io(h, m, null);
          } finally {
            bi();
          }
          return new AM(this.componentType, D, Lr(_, m), m, _);
        }
      }
      class AM extends class {} {
        constructor(t, n, r, o, i) {
          super(),
            (this.location = r),
            (this._rootLView = o),
            (this._tNode = i),
            (this.instance = n),
            (this.hostView = this.changeDetectorRef = new EM(o)),
            (this.componentType = t);
        }
        get injector() {
          return new ir(this._tNode, this._rootLView);
        }
        destroy() {
          this.hostView.destroy();
        }
        onDestroy(t) {
          this.hostView.onDestroy(t);
        }
      }
      class rn {}
      class Gg {}
      const jr = new Map();
      class Kg extends rn {
        constructor(t, n) {
          super(),
            (this._parent = n),
            (this._bootstrapComponents = []),
            (this.injector = this),
            (this.destroyCbs = []),
            (this.componentFactoryResolver = new qg(this));
          const r = at(t);
          (this._bootstrapComponents = Lt(r.bootstrap)),
            (this._r3Injector = Lh(
              t,
              n,
              [
                { provide: rn, useValue: this },
                { provide: kr, useValue: this.componentFactoryResolver },
              ],
              J(t),
            )),
            this._r3Injector._resolveInjectorDefTypes(),
            (this.instance = this.get(t));
        }
        get(t, n = Fe.THROW_IF_NOT_FOUND, r = j.Default) {
          return t === Fe || t === rn || t === Rl
            ? this
            : this._r3Injector.get(t, n, r);
        }
        destroy() {
          const t = this._r3Injector;
          !t.destroyed && t.destroy(),
            this.destroyCbs.forEach((n) => n()),
            (this.destroyCbs = null);
        }
        onDestroy(t) {
          this.destroyCbs.push(t);
        }
      }
      class iu extends Gg {
        constructor(t) {
          super(),
            (this.moduleType = t),
            null !== at(t) &&
              (function (e) {
                const t = new Set();
                !(function n(r) {
                  const o = at(r, !0),
                    i = o.id;
                  null !== i &&
                    ((function (e, t, n) {
                      if (t && t !== n)
                        throw new Error(
                          `Duplicate module registered for ${e} - ${J(
                            t,
                          )} vs ${J(t.name)}`,
                        );
                    })(i, jr.get(i), r),
                    jr.set(i, r));
                  const s = Lt(o.imports);
                  for (const a of s) t.has(a) || (t.add(a), n(a));
                })(e);
              })(t);
        }
        create(t) {
          return new Kg(this.moduleType, t);
        }
      }
      function Br(e, t, n, r) {
        return (function (e, t, n, r, o, i) {
          const s = t + n;
          return ke(e, s, o)
            ? Bt(e, s + 1, i ? r.call(i, o) : r(o))
            : (function (e, t) {
                const n = e[t];
                return n === L ? void 0 : n;
              })(e, s + 1);
        })(b(), je(), e, t, n, r);
      }
      function su(e) {
        return (t) => {
          setTimeout(e, void 0, t);
        };
      }
      const $e = class extends Gt {
        constructor(t = !1) {
          super(), (this.__isAsync = t);
        }
        emit(t) {
          super.next(t);
        }
        subscribe(t, n, r) {
          var o, i, s;
          let a = t,
            l = n || (() => null),
            u = r;
          if (t && "object" == typeof t) {
            const d = t;
            (a = null === (o = d.next) || void 0 === o ? void 0 : o.bind(d)),
              (l = null === (i = d.error) || void 0 === i ? void 0 : i.bind(d)),
              (u =
                null === (s = d.complete) || void 0 === s ? void 0 : s.bind(d));
          }
          this.__isAsync && ((l = su(l)), a && (a = su(a)), u && (u = su(u)));
          const c = super.subscribe({ next: a, error: l, complete: u });
          return t instanceof st && t.add(c), c;
        }
      };
      function QM() {
        return this._results[wr()]();
      }
      class au {
        constructor(t = !1) {
          (this._emitDistinctChangesOnly = t),
            (this.dirty = !0),
            (this._results = []),
            (this._changesDetected = !1),
            (this._changes = null),
            (this.length = 0),
            (this.first = void 0),
            (this.last = void 0);
          const n = wr(),
            r = au.prototype;
          r[n] || (r[n] = QM);
        }
        get changes() {
          return this._changes || (this._changes = new $e());
        }
        get(t) {
          return this._results[t];
        }
        map(t) {
          return this._results.map(t);
        }
        filter(t) {
          return this._results.filter(t);
        }
        find(t) {
          return this._results.find(t);
        }
        reduce(t, n) {
          return this._results.reduce(t, n);
        }
        forEach(t) {
          this._results.forEach(t);
        }
        some(t) {
          return this._results.some(t);
        }
        toArray() {
          return this._results.slice();
        }
        toString() {
          return this._results.toString();
        }
        reset(t, n) {
          const r = this;
          r.dirty = !1;
          const o = dt(t);
          (this._changesDetected = !(function (e, t, n) {
            if (e.length !== t.length) return !1;
            for (let r = 0; r < e.length; r++) {
              let o = e[r],
                i = t[r];
              if ((n && ((o = n(o)), (i = n(i))), i !== o)) return !1;
            }
            return !0;
          })(r._results, o, n)) &&
            ((r._results = o),
            (r.length = o.length),
            (r.last = o[this.length - 1]),
            (r.first = o[0]));
        }
        notifyOnChanges() {
          this._changes &&
            (this._changesDetected || !this._emitDistinctChangesOnly) &&
            this._changes.emit(this);
        }
        setDirty() {
          this.dirty = !0;
        }
        destroy() {
          this.changes.complete(), this.changes.unsubscribe();
        }
      }
      Symbol;
      let on = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = ZM), e;
      })();
      const KM = on,
        JM = class extends KM {
          constructor(t, n, r) {
            super(),
              (this._declarationLView = t),
              (this._declarationTContainer = n),
              (this.elementRef = r);
          }
          createEmbeddedView(t) {
            const n = this._declarationTContainer.tViews,
              r = So(
                this._declarationLView,
                n,
                t,
                16,
                null,
                n.declTNode,
                null,
                null,
                null,
                null,
              );
            r[17] = this._declarationLView[this._declarationTContainer.index];
            const i = this._declarationLView[19];
            return (
              null !== i && (r[19] = i.createEmbeddedView(n)),
              Io(n, r, t),
              new ko(r)
            );
          }
        };
      function ZM() {
        return us(De(), b());
      }
      function us(e, t) {
        return 4 & e.type ? new JM(t, e, Lr(e, t)) : null;
      }
      let Mt = (() => {
        class e {}
        return (e.__NG_ELEMENT_ID__ = YM), e;
      })();
      function YM() {
        return om(De(), b());
      }
      const XM = Mt,
        nm = class extends XM {
          constructor(t, n, r) {
            super(),
              (this._lContainer = t),
              (this._hostTNode = n),
              (this._hostLView = r);
          }
          get element() {
            return Lr(this._hostTNode, this._hostLView);
          }
          get injector() {
            return new ir(this._hostTNode, this._hostLView);
          }
          get parentInjector() {
            const t = Pi(this._hostTNode, this._hostLView);
            if ($d(t)) {
              const n = or(t, this._hostLView),
                r = rr(t);
              return new ir(n[1].data[r + 8], n);
            }
            return new ir(null, this._hostLView);
          }
          clear() {
            for (; this.length > 0; ) this.remove(this.length - 1);
          }
          get(t) {
            const n = rm(this._lContainer);
            return (null !== n && n[t]) || null;
          }
          get length() {
            return this._lContainer.length - 10;
          }
          createEmbeddedView(t, n, r) {
            const o = t.createEmbeddedView(n || {});
            return this.insert(o, r), o;
          }
          createComponent(t, n, r, o, i) {
            const s = t && !("function" == typeof t);
            let a;
            if (s) a = n;
            else {
              const d = n || {};
              (a = d.index),
                (r = d.injector),
                (o = d.projectableNodes),
                (i = d.ngModuleRef);
            }
            const l = s ? t : new ou(Oe(t)),
              u = r || this.parentInjector;
            if (!i && null == l.ngModule && u) {
              const d = u.get(rn, null);
              d && (i = d);
            }
            const c = l.create(u, o, void 0, i);
            return this.insert(c.hostView, a), c;
          }
          insert(t, n) {
            const r = t._lView,
              o = r[1];
            if (vt(r[3])) {
              const c = this.indexOf(t);
              if (-1 !== c) this.detach(c);
              else {
                const d = r[3],
                  f = new nm(d, d[6], d[3]);
                f.detach(f.indexOf(t));
              }
            }
            const i = this._adjustIndex(n),
              s = this._lContainer;
            !(function (e, t, n, r) {
              const o = 10 + r,
                i = n.length;
              r > 0 && (n[o - 1][4] = t),
                r < i - 10
                  ? ((t[4] = n[o]), Xd(n, 10 + r, t))
                  : (n.push(t), (t[4] = null)),
                (t[3] = n);
              const s = t[17];
              null !== s &&
                n !== s &&
                (function (e, t) {
                  const n = e[9];
                  t[16] !== t[3][3][16] && (e[2] = !0),
                    null === n ? (e[9] = [t]) : n.push(t);
                })(s, t);
              const a = t[19];
              null !== a && a.insertView(e), (t[2] |= 128);
            })(o, r, s, i);
            const a = ul(i, s),
              l = r[U],
              u = Vi(l, s[7]);
            return (
              null !== u &&
                (function (e, t, n, r, o, i) {
                  (r[0] = o), (r[6] = t), Mo(e, r, n, 1, o, i);
                })(o, s[6], l, r, u, a),
              t.attachToViewContainerRef(),
              Xd(lu(s), i, t),
              t
            );
          }
          move(t, n) {
            return this.insert(t, n);
          }
          indexOf(t) {
            const n = rm(this._lContainer);
            return null !== n ? n.indexOf(t) : -1;
          }
          remove(t) {
            const n = this._adjustIndex(t, -1),
              r = sl(this._lContainer, n);
            r && (Ri(lu(this._lContainer), n), jf(r[1], r));
          }
          detach(t) {
            const n = this._adjustIndex(t, -1),
              r = sl(this._lContainer, n);
            return r && null != Ri(lu(this._lContainer), n) ? new ko(r) : null;
          }
          _adjustIndex(t, n = 0) {
            return null == t ? this.length + n : t;
          }
        };
      function rm(e) {
        return e[8];
      }
      function lu(e) {
        return e[8] || (e[8] = []);
      }
      function om(e, t) {
        let n;
        const r = t[e.index];
        if (vt(r)) n = r;
        else {
          let o;
          if (8 & e.type) o = pe(r);
          else {
            const i = t[U];
            o = i.createComment("");
            const s = ct(e, t);
            jn(
              i,
              Vi(i, s),
              o,
              (function (e, t) {
                return ue(e) ? e.nextSibling(t) : t.nextSibling;
              })(i, s),
              !1,
            );
          }
          (t[e.index] = n =
            (function (e, t, n, r) {
              return new Array(e, !0, !1, t, null, 0, r, n, null, null);
            })(r, t, o, e)),
            Qi(t, n);
        }
        return new nm(n, e, t);
      }
      class uu {
        constructor(t) {
          (this.queryList = t), (this.matches = null);
        }
        clone() {
          return new uu(this.queryList);
        }
        setDirty() {
          this.queryList.setDirty();
        }
      }
      class cu {
        constructor(t = []) {
          this.queries = t;
        }
        createEmbeddedView(t) {
          const n = t.queries;
          if (null !== n) {
            const r =
                null !== t.contentQueries ? t.contentQueries[0] : n.length,
              o = [];
            for (let i = 0; i < r; i++) {
              const s = n.getByIndex(i);
              o.push(this.queries[s.indexInDeclarationView].clone());
            }
            return new cu(o);
          }
          return null;
        }
        insertView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        detachView(t) {
          this.dirtyQueriesWithMatches(t);
        }
        dirtyQueriesWithMatches(t) {
          for (let n = 0; n < this.queries.length; n++)
            null !== um(t, n).matches && this.queries[n].setDirty();
        }
      }
      class im {
        constructor(t, n, r = null) {
          (this.predicate = t), (this.flags = n), (this.read = r);
        }
      }
      class du {
        constructor(t = []) {
          this.queries = t;
        }
        elementStart(t, n) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].elementStart(t, n);
        }
        elementEnd(t) {
          for (let n = 0; n < this.queries.length; n++)
            this.queries[n].elementEnd(t);
        }
        embeddedTView(t) {
          let n = null;
          for (let r = 0; r < this.length; r++) {
            const o = null !== n ? n.length : 0,
              i = this.getByIndex(r).embeddedTView(t, o);
            i &&
              ((i.indexInDeclarationView = r),
              null !== n ? n.push(i) : (n = [i]));
          }
          return null !== n ? new du(n) : null;
        }
        template(t, n) {
          for (let r = 0; r < this.queries.length; r++)
            this.queries[r].template(t, n);
        }
        getByIndex(t) {
          return this.queries[t];
        }
        get length() {
          return this.queries.length;
        }
        track(t) {
          this.queries.push(t);
        }
      }
      class fu {
        constructor(t, n = -1) {
          (this.metadata = t),
            (this.matches = null),
            (this.indexInDeclarationView = -1),
            (this.crossesNgTemplate = !1),
            (this._appliesToNextNode = !0),
            (this._declarationNodeIndex = n);
        }
        elementStart(t, n) {
          this.isApplyingToNode(n) && this.matchTNode(t, n);
        }
        elementEnd(t) {
          this._declarationNodeIndex === t.index &&
            (this._appliesToNextNode = !1);
        }
        template(t, n) {
          this.elementStart(t, n);
        }
        embeddedTView(t, n) {
          return this.isApplyingToNode(t)
            ? ((this.crossesNgTemplate = !0),
              this.addMatch(-t.index, n),
              new fu(this.metadata))
            : null;
        }
        isApplyingToNode(t) {
          if (this._appliesToNextNode && 1 != (1 & this.metadata.flags)) {
            const n = this._declarationNodeIndex;
            let r = t.parent;
            for (; null !== r && 8 & r.type && r.index !== n; ) r = r.parent;
            return n === (null !== r ? r.index : -1);
          }
          return this._appliesToNextNode;
        }
        matchTNode(t, n) {
          const r = this.metadata.predicate;
          if (Array.isArray(r))
            for (let o = 0; o < r.length; o++) {
              const i = r[o];
              this.matchTNodeWithReadOption(t, n, nS(n, i)),
                this.matchTNodeWithReadOption(t, n, Oi(n, t, i, !1, !1));
            }
          else
            r === on
              ? 4 & n.type && this.matchTNodeWithReadOption(t, n, -1)
              : this.matchTNodeWithReadOption(t, n, Oi(n, t, r, !1, !1));
        }
        matchTNodeWithReadOption(t, n, r) {
          if (null !== r) {
            const o = this.metadata.read;
            if (null !== o)
              if (o === _n || o === Mt || (o === on && 4 & n.type))
                this.addMatch(n.index, -2);
              else {
                const i = Oi(n, t, o, !1, !1);
                null !== i && this.addMatch(n.index, i);
              }
            else this.addMatch(n.index, r);
          }
        }
        addMatch(t, n) {
          null === this.matches
            ? (this.matches = [t, n])
            : this.matches.push(t, n);
        }
      }
      function nS(e, t) {
        const n = e.localNames;
        if (null !== n)
          for (let r = 0; r < n.length; r += 2) if (n[r] === t) return n[r + 1];
        return null;
      }
      function oS(e, t, n, r) {
        return -1 === n
          ? (function (e, t) {
              return 11 & e.type ? Lr(e, t) : 4 & e.type ? us(e, t) : null;
            })(t, e)
          : -2 === n
          ? (function (e, t, n) {
              return n === _n
                ? Lr(t, e)
                : n === on
                ? us(t, e)
                : n === Mt
                ? om(t, e)
                : void 0;
            })(e, t, r)
          : uo(e, e[1], n, t);
      }
      function sm(e, t, n, r) {
        const o = t[19].queries[r];
        if (null === o.matches) {
          const i = e.data,
            s = n.matches,
            a = [];
          for (let l = 0; l < s.length; l += 2) {
            const u = s[l];
            a.push(u < 0 ? null : oS(t, i[u], s[l + 1], n.metadata.read));
          }
          o.matches = a;
        }
        return o.matches;
      }
      function hu(e, t, n, r) {
        const o = e.queries.getByIndex(n),
          i = o.matches;
        if (null !== i) {
          const s = sm(e, t, o, n);
          for (let a = 0; a < i.length; a += 2) {
            const l = i[a];
            if (l > 0) r.push(s[a / 2]);
            else {
              const u = i[a + 1],
                c = t[-l];
              for (let d = 10; d < c.length; d++) {
                const f = c[d];
                f[17] === f[3] && hu(f[1], f, u, r);
              }
              if (null !== c[9]) {
                const d = c[9];
                for (let f = 0; f < d.length; f++) {
                  const h = d[f];
                  hu(h[1], h, u, r);
                }
              }
            }
          }
        }
        return r;
      }
      function pu(e) {
        const t = b(),
          n = Z(),
          r = Nd();
        Ta(r + 1);
        const o = um(n, r);
        if (e.dirty && Td(t) === (2 == (2 & o.metadata.flags))) {
          if (null === o.matches) e.reset([]);
          else {
            const i = o.crossesNgTemplate ? hu(n, t, r, []) : sm(n, t, o, r);
            e.reset(i, DM), e.notifyOnChanges();
          }
          return !0;
        }
        return !1;
      }
      function gu(e, t, n, r) {
        const o = Z();
        if (o.firstCreatePass) {
          const i = De();
          (function (e, t, n) {
            null === e.queries && (e.queries = new du()),
              e.queries.track(new fu(t, n));
          })(o, new im(t, n, r), i.index),
            (function (e, t) {
              const n = e.contentQueries || (e.contentQueries = []);
              t !== (n.length ? n[n.length - 1] : -1) &&
                n.push(e.queries.length - 1, t);
            })(o, e),
            2 == (2 & n) && (o.staticContentQueries = !0);
        }
        !(function (e, t, n) {
          const r = new au(4 == (4 & n));
          Dh(e, t, r, r.destroy),
            null === t[19] && (t[19] = new cu()),
            t[19].queries.push(new uu(r));
        })(o, b(), n);
      }
      function mu() {
        return (e = b()), (t = Nd()), e[19].queries[t].queryList;
        var e, t;
      }
      function um(e, t) {
        return e.queries.getByIndex(t);
      }
      function fs(...e) {}
      const hs = new W("Application Initializer");
      let Vr = (() => {
        class e {
          constructor(n) {
            (this.appInits = n),
              (this.resolve = fs),
              (this.reject = fs),
              (this.initialized = !1),
              (this.done = !1),
              (this.donePromise = new Promise((r, o) => {
                (this.resolve = r), (this.reject = o);
              }));
          }
          runInitializers() {
            if (this.initialized) return;
            const n = [],
              r = () => {
                (this.done = !0), this.resolve();
              };
            if (this.appInits)
              for (let o = 0; o < this.appInits.length; o++) {
                const i = this.appInits[o]();
                if (Xi(i)) n.push(i);
                else if (_p(i)) {
                  const s = new Promise((a, l) => {
                    i.subscribe({ complete: a, error: l });
                  });
                  n.push(s);
                }
              }
            Promise.all(n)
              .then(() => {
                r();
              })
              .catch((o) => {
                this.reject(o);
              }),
              0 === n.length && r(),
              (this.initialized = !0);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(hs, 8));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Ho = new W("AppId"),
        IS = {
          provide: Ho,
          useFactory: function () {
            return `${wu()}${wu()}${wu()}`;
          },
          deps: [],
        };
      function wu() {
        return String.fromCharCode(97 + Math.floor(25 * Math.random()));
      }
      const Sm = new W("Platform Initializer"),
        ps = new W("Platform ID"),
        Im = new W("appBootstrapListener");
      let Tm = (() => {
        class e {
          log(n) {
            console.log(n);
          }
          warn(n) {
            console.warn(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const wn = new W("LocaleId"),
        Am = new W("DefaultCurrencyCode");
      class TS {
        constructor(t, n) {
          (this.ngModuleFactory = t), (this.componentFactories = n);
        }
      }
      let gs = (() => {
        class e {
          compileModuleSync(n) {
            return new iu(n);
          }
          compileModuleAsync(n) {
            return Promise.resolve(this.compileModuleSync(n));
          }
          compileModuleAndAllComponentsSync(n) {
            const r = this.compileModuleSync(n),
              i = Lt(at(n).declarations).reduce((s, a) => {
                const l = Oe(a);
                return l && s.push(new ou(l)), s;
              }, []);
            return new TS(r, i);
          }
          compileModuleAndAllComponentsAsync(n) {
            return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
          }
          clearCache() {}
          clearCacheFor(n) {}
          getModuleId(n) {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const PS = (() => Promise.resolve(0))();
      function bu(e) {
        "undefined" == typeof Zone
          ? PS.then(() => {
              e && e.apply(null, null);
            })
          : Zone.current.scheduleMicroTask("scheduleMicrotask", e);
      }
      class we {
        constructor({
          enableLongStackTrace: t = !1,
          shouldCoalesceEventChangeDetection: n = !1,
          shouldCoalesceRunChangeDetection: r = !1,
        }) {
          if (
            ((this.hasPendingMacrotasks = !1),
            (this.hasPendingMicrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new $e(!1)),
            (this.onMicrotaskEmpty = new $e(!1)),
            (this.onStable = new $e(!1)),
            (this.onError = new $e(!1)),
            "undefined" == typeof Zone)
          )
            throw new Error("In this configuration Angular requires Zone.js");
          Zone.assertZonePatched();
          const o = this;
          (o._nesting = 0),
            (o._outer = o._inner = Zone.current),
            Zone.TaskTrackingZoneSpec &&
              (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
            t &&
              Zone.longStackTraceZoneSpec &&
              (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
            (o.shouldCoalesceEventChangeDetection = !r && n),
            (o.shouldCoalesceRunChangeDetection = r),
            (o.lastRequestAnimationFrameId = -1),
            (o.nativeRequestAnimationFrame = (function () {
              let e = X.requestAnimationFrame,
                t = X.cancelAnimationFrame;
              if ("undefined" != typeof Zone && e && t) {
                const n = e[Zone.__symbol__("OriginalDelegate")];
                n && (e = n);
                const r = t[Zone.__symbol__("OriginalDelegate")];
                r && (t = r);
              }
              return {
                nativeRequestAnimationFrame: e,
                nativeCancelAnimationFrame: t,
              };
            })().nativeRequestAnimationFrame),
            (function (e) {
              const t = () => {
                !(function (e) {
                  e.isCheckStableRunning ||
                    -1 !== e.lastRequestAnimationFrameId ||
                    ((e.lastRequestAnimationFrameId =
                      e.nativeRequestAnimationFrame.call(X, () => {
                        e.fakeTopEventTask ||
                          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
                            "fakeTopEventTask",
                            () => {
                              (e.lastRequestAnimationFrameId = -1),
                                Mu(e),
                                (e.isCheckStableRunning = !0),
                                Eu(e),
                                (e.isCheckStableRunning = !1);
                            },
                            void 0,
                            () => {},
                            () => {},
                          )),
                          e.fakeTopEventTask.invoke();
                      })),
                    Mu(e));
                })(e);
              };
              e._inner = e._inner.fork({
                name: "angular",
                properties: { isAngularZone: !0 },
                onInvokeTask: (n, r, o, i, s, a) => {
                  try {
                    return Pm(e), n.invokeTask(o, i, s, a);
                  } finally {
                    ((e.shouldCoalesceEventChangeDetection &&
                      "eventTask" === i.type) ||
                      e.shouldCoalesceRunChangeDetection) &&
                      t(),
                      xm(e);
                  }
                },
                onInvoke: (n, r, o, i, s, a, l) => {
                  try {
                    return Pm(e), n.invoke(o, i, s, a, l);
                  } finally {
                    e.shouldCoalesceRunChangeDetection && t(), xm(e);
                  }
                },
                onHasTask: (n, r, o, i) => {
                  n.hasTask(o, i),
                    r === o &&
                      ("microTask" == i.change
                        ? ((e._hasPendingMicrotasks = i.microTask),
                          Mu(e),
                          Eu(e))
                        : "macroTask" == i.change &&
                          (e.hasPendingMacrotasks = i.macroTask));
                },
                onHandleError: (n, r, o, i) => (
                  n.handleError(o, i),
                  e.runOutsideAngular(() => e.onError.emit(i)),
                  !1
                ),
              });
            })(o);
        }
        static isInAngularZone() {
          return !0 === Zone.current.get("isAngularZone");
        }
        static assertInAngularZone() {
          if (!we.isInAngularZone())
            throw new Error("Expected to be in Angular Zone, but it is not!");
        }
        static assertNotInAngularZone() {
          if (we.isInAngularZone())
            throw new Error("Expected to not be in Angular Zone, but it is!");
        }
        run(t, n, r) {
          return this._inner.run(t, n, r);
        }
        runTask(t, n, r, o) {
          const i = this._inner,
            s = i.scheduleEventTask("NgZoneEvent: " + o, t, OS, fs, fs);
          try {
            return i.runTask(s, n, r);
          } finally {
            i.cancelTask(s);
          }
        }
        runGuarded(t, n, r) {
          return this._inner.runGuarded(t, n, r);
        }
        runOutsideAngular(t) {
          return this._outer.run(t);
        }
      }
      const OS = {};
      function Eu(e) {
        if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable)
          try {
            e._nesting++, e.onMicrotaskEmpty.emit(null);
          } finally {
            if ((e._nesting--, !e.hasPendingMicrotasks))
              try {
                e.runOutsideAngular(() => e.onStable.emit(null));
              } finally {
                e.isStable = !0;
              }
          }
      }
      function Mu(e) {
        e.hasPendingMicrotasks = !!(
          e._hasPendingMicrotasks ||
          ((e.shouldCoalesceEventChangeDetection ||
            e.shouldCoalesceRunChangeDetection) &&
            -1 !== e.lastRequestAnimationFrameId)
        );
      }
      function Pm(e) {
        e._nesting++,
          e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
      }
      function xm(e) {
        e._nesting--, Eu(e);
      }
      class FS {
        constructor() {
          (this.hasPendingMicrotasks = !1),
            (this.hasPendingMacrotasks = !1),
            (this.isStable = !0),
            (this.onUnstable = new $e()),
            (this.onMicrotaskEmpty = new $e()),
            (this.onStable = new $e()),
            (this.onError = new $e());
        }
        run(t, n, r) {
          return t.apply(n, r);
        }
        runGuarded(t, n, r) {
          return t.apply(n, r);
        }
        runOutsideAngular(t) {
          return t();
        }
        runTask(t, n, r, o) {
          return t.apply(n, r);
        }
      }
      let Su = (() => {
          class e {
            constructor(n) {
              (this._ngZone = n),
                (this._pendingCount = 0),
                (this._isZoneStable = !0),
                (this._didWork = !1),
                (this._callbacks = []),
                (this.taskTrackingZone = null),
                this._watchAngularEvents(),
                n.run(() => {
                  this.taskTrackingZone =
                    "undefined" == typeof Zone
                      ? null
                      : Zone.current.get("TaskTrackingZone");
                });
            }
            _watchAngularEvents() {
              this._ngZone.onUnstable.subscribe({
                next: () => {
                  (this._didWork = !0), (this._isZoneStable = !1);
                },
              }),
                this._ngZone.runOutsideAngular(() => {
                  this._ngZone.onStable.subscribe({
                    next: () => {
                      we.assertNotInAngularZone(),
                        bu(() => {
                          (this._isZoneStable = !0),
                            this._runCallbacksIfReady();
                        });
                    },
                  });
                });
            }
            increasePendingRequestCount() {
              return (
                (this._pendingCount += 1),
                (this._didWork = !0),
                this._pendingCount
              );
            }
            decreasePendingRequestCount() {
              if (((this._pendingCount -= 1), this._pendingCount < 0))
                throw new Error("pending async requests below zero");
              return this._runCallbacksIfReady(), this._pendingCount;
            }
            isStable() {
              return (
                this._isZoneStable &&
                0 === this._pendingCount &&
                !this._ngZone.hasPendingMacrotasks
              );
            }
            _runCallbacksIfReady() {
              if (this.isStable())
                bu(() => {
                  for (; 0 !== this._callbacks.length; ) {
                    let n = this._callbacks.pop();
                    clearTimeout(n.timeoutId), n.doneCb(this._didWork);
                  }
                  this._didWork = !1;
                });
              else {
                let n = this.getPendingTasks();
                (this._callbacks = this._callbacks.filter(
                  (r) =>
                    !r.updateCb ||
                    !r.updateCb(n) ||
                    (clearTimeout(r.timeoutId), !1),
                )),
                  (this._didWork = !0);
              }
            }
            getPendingTasks() {
              return this.taskTrackingZone
                ? this.taskTrackingZone.macroTasks.map((n) => ({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data,
                  }))
                : [];
            }
            addCallback(n, r, o) {
              let i = -1;
              r &&
                r > 0 &&
                (i = setTimeout(() => {
                  (this._callbacks = this._callbacks.filter(
                    (s) => s.timeoutId !== i,
                  )),
                    n(this._didWork, this.getPendingTasks());
                }, r)),
                this._callbacks.push({ doneCb: n, timeoutId: i, updateCb: o });
            }
            whenStable(n, r, o) {
              if (o && !this.taskTrackingZone)
                throw new Error(
                  'Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?',
                );
              this.addCallback(n, r, o), this._runCallbacksIfReady();
            }
            getPendingRequestCount() {
              return this._pendingCount;
            }
            findProviders(n, r, o) {
              return [];
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(we));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Om = (() => {
          class e {
            constructor() {
              (this._applications = new Map()), Iu.addToWindow(this);
            }
            registerApplication(n, r) {
              this._applications.set(n, r);
            }
            unregisterApplication(n) {
              this._applications.delete(n);
            }
            unregisterAllApplications() {
              this._applications.clear();
            }
            getTestability(n) {
              return this._applications.get(n) || null;
            }
            getAllTestabilities() {
              return Array.from(this._applications.values());
            }
            getAllRootElements() {
              return Array.from(this._applications.keys());
            }
            findTestabilityInTree(n, r = !0) {
              return Iu.findTestabilityInTree(this, n, r);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      class kS {
        addToWindow(t) {}
        findTestabilityInTree(t, n, r) {
          return null;
        }
      }
      let St,
        Iu = new kS();
      const Rm = new W("AllowMultipleToken");
      class Nm {
        constructor(t, n) {
          (this.name = t), (this.token = n);
        }
      }
      function Fm(e, t, n = []) {
        const r = `Platform: ${t}`,
          o = new W(r);
        return (i = []) => {
          let s = km();
          if (!s || s.injector.get(Rm, !1))
            if (e) e(n.concat(i).concat({ provide: o, useValue: !0 }));
            else {
              const a = n
                .concat(i)
                .concat(
                  { provide: o, useValue: !0 },
                  { provide: Nl, useValue: "platform" },
                );
              !(function (e) {
                if (St && !St.destroyed && !St.injector.get(Rm, !1))
                  throw new Qe("400", "");
                St = e.get(Lm);
                const t = e.get(Sm, null);
                t && t.forEach((n) => n());
              })(Fe.create({ providers: a, name: r }));
            }
          return (function (e) {
            const t = km();
            if (!t) throw new Qe("401", "");
            return t;
          })();
        };
      }
      function km() {
        return St && !St.destroyed ? St : null;
      }
      let Lm = (() => {
        class e {
          constructor(n) {
            (this._injector = n),
              (this._modules = []),
              (this._destroyListeners = []),
              (this._destroyed = !1);
          }
          bootstrapModuleFactory(n, r) {
            const a = (function (e, t) {
                let n;
                return (
                  (n =
                    "noop" === e
                      ? new FS()
                      : ("zone.js" === e ? void 0 : e) ||
                        new we({
                          enableLongStackTrace: !1,
                          shouldCoalesceEventChangeDetection: !!(null == t
                            ? void 0
                            : t.ngZoneEventCoalescing),
                          shouldCoalesceRunChangeDetection: !!(null == t
                            ? void 0
                            : t.ngZoneRunCoalescing),
                        })),
                  n
                );
              })(r ? r.ngZone : void 0, {
                ngZoneEventCoalescing: (r && r.ngZoneEventCoalescing) || !1,
                ngZoneRunCoalescing: (r && r.ngZoneRunCoalescing) || !1,
              }),
              l = [{ provide: we, useValue: a }];
            return a.run(() => {
              const u = Fe.create({
                  providers: l,
                  parent: this.injector,
                  name: n.moduleType.name,
                }),
                c = n.create(u),
                d = c.injector.get(pr, null);
              if (!d) throw new Qe("402", "");
              return (
                a.runOutsideAngular(() => {
                  const f = a.onError.subscribe({
                    next: (h) => {
                      d.handleError(h);
                    },
                  });
                  c.onDestroy(() => {
                    Tu(this._modules, c), f.unsubscribe();
                  });
                }),
                (function (e, t, n) {
                  try {
                    const r = n();
                    return Xi(r)
                      ? r.catch((o) => {
                          throw (
                            (t.runOutsideAngular(() => e.handleError(o)), o)
                          );
                        })
                      : r;
                  } catch (r) {
                    throw (t.runOutsideAngular(() => e.handleError(r)), r);
                  }
                })(d, a, () => {
                  const f = c.injector.get(Vr);
                  return (
                    f.runInitializers(),
                    f.donePromise.then(
                      () => (
                        (function (e) {
                          Je(e, "Expected localeId to be defined"),
                            "string" == typeof e &&
                              (mg = e.toLowerCase().replace(/_/g, "-"));
                        })(c.injector.get(wn, ts) || ts),
                        this._moduleDoBootstrap(c),
                        c
                      ),
                    )
                  );
                })
              );
            });
          }
          bootstrapModule(n, r = []) {
            const o = jm({}, r);
            return (function (e, t, n) {
              const r = new iu(n);
              return Promise.resolve(r);
            })(0, 0, n).then((i) => this.bootstrapModuleFactory(i, o));
          }
          _moduleDoBootstrap(n) {
            const r = n.injector.get(Vo);
            if (n._bootstrapComponents.length > 0)
              n._bootstrapComponents.forEach((o) => r.bootstrap(o));
            else {
              if (!n.instance.ngDoBootstrap) throw new Qe("403", "");
              n.instance.ngDoBootstrap(r);
            }
            this._modules.push(n);
          }
          onDestroy(n) {
            this._destroyListeners.push(n);
          }
          get injector() {
            return this._injector;
          }
          destroy() {
            if (this._destroyed) throw new Qe("404", "");
            this._modules.slice().forEach((n) => n.destroy()),
              this._destroyListeners.forEach((n) => n()),
              (this._destroyed = !0);
          }
          get destroyed() {
            return this._destroyed;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(Fe));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function jm(e, t) {
        return Array.isArray(t)
          ? t.reduce(jm, e)
          : Object.assign(Object.assign({}, e), t);
      }
      let Vo = (() => {
        class e {
          constructor(n, r, o, i, s) {
            (this._zone = n),
              (this._injector = r),
              (this._exceptionHandler = o),
              (this._componentFactoryResolver = i),
              (this._initStatus = s),
              (this._bootstrapListeners = []),
              (this._views = []),
              (this._runningTick = !1),
              (this._stable = !0),
              (this.componentTypes = []),
              (this.components = []),
              (this._onMicrotaskEmptySubscription =
                this._zone.onMicrotaskEmpty.subscribe({
                  next: () => {
                    this._zone.run(() => {
                      this.tick();
                    });
                  },
                }));
            const a = new ae((u) => {
                (this._stable =
                  this._zone.isStable &&
                  !this._zone.hasPendingMacrotasks &&
                  !this._zone.hasPendingMicrotasks),
                  this._zone.runOutsideAngular(() => {
                    u.next(this._stable), u.complete();
                  });
              }),
              l = new ae((u) => {
                let c;
                this._zone.runOutsideAngular(() => {
                  c = this._zone.onStable.subscribe(() => {
                    we.assertNotInAngularZone(),
                      bu(() => {
                        !this._stable &&
                          !this._zone.hasPendingMacrotasks &&
                          !this._zone.hasPendingMicrotasks &&
                          ((this._stable = !0), u.next(!0));
                      });
                  });
                });
                const d = this._zone.onUnstable.subscribe(() => {
                  we.assertInAngularZone(),
                    this._stable &&
                      ((this._stable = !1),
                      this._zone.runOutsideAngular(() => {
                        u.next(!1);
                      }));
                });
                return () => {
                  c.unsubscribe(), d.unsubscribe();
                };
              });
            this.isStable = (function (...e) {
              const t = eo(e),
                n = (function (e, t) {
                  return "number" == typeof ra(e) ? e.pop() : 1 / 0;
                })(e),
                r = e;
              return r.length
                ? 1 === r.length
                  ? Wt(r[0])
                  : Xr(n)(Te(r, t))
                : Kt;
            })(
              a,
              l.pipe(
                (function (e = {}) {
                  const {
                    connector: t = () => new Gt(),
                    resetOnError: n = !0,
                    resetOnComplete: r = !0,
                    resetOnRefCountZero: o = !0,
                  } = e;
                  return (i) => {
                    let s = null,
                      a = null,
                      l = null,
                      u = 0,
                      c = !1,
                      d = !1;
                    const f = () => {
                        null == a || a.unsubscribe(), (a = null);
                      },
                      h = () => {
                        f(), (s = l = null), (c = d = !1);
                      },
                      m = () => {
                        const D = s;
                        h(), null == D || D.unsubscribe();
                      };
                    return Se((D, _) => {
                      u++, !d && !c && f();
                      const w = (l = null != l ? l : t());
                      _.add(() => {
                        u--, 0 === u && !d && !c && (a = oa(m, o));
                      }),
                        w.subscribe(_),
                        s ||
                          ((s = new Ys({
                            next: (y) => w.next(y),
                            error: (y) => {
                              (d = !0), f(), (a = oa(h, n, y)), w.error(y);
                            },
                            complete: () => {
                              (c = !0), f(), (a = oa(h, r)), w.complete();
                            },
                          })),
                          Te(D).subscribe(s));
                    })(i);
                  };
                })(),
              ),
            );
          }
          bootstrap(n, r) {
            if (!this._initStatus.done) throw new Qe("405", "");
            let o;
            (o =
              n instanceof Vg
                ? n
                : this._componentFactoryResolver.resolveComponentFactory(n)),
              this.componentTypes.push(o.componentType);
            const i = (function (e) {
                return e.isBoundToModule;
              })(o)
                ? void 0
                : this._injector.get(rn),
              a = o.create(Fe.NULL, [], r || o.selector, i),
              l = a.location.nativeElement,
              u = a.injector.get(Su, null),
              c = u && a.injector.get(Om);
            return (
              u && c && c.registerApplication(l, u),
              a.onDestroy(() => {
                this.detachView(a.hostView),
                  Tu(this.components, a),
                  c && c.unregisterApplication(l);
              }),
              this._loadComponent(a),
              a
            );
          }
          tick() {
            if (this._runningTick) throw new Qe("101", "");
            try {
              this._runningTick = !0;
              for (let n of this._views) n.detectChanges();
            } catch (n) {
              this._zone.runOutsideAngular(() =>
                this._exceptionHandler.handleError(n),
              );
            } finally {
              this._runningTick = !1;
            }
          }
          attachView(n) {
            const r = n;
            this._views.push(r), r.attachToAppRef(this);
          }
          detachView(n) {
            const r = n;
            Tu(this._views, r), r.detachFromAppRef();
          }
          _loadComponent(n) {
            this.attachView(n.hostView),
              this.tick(),
              this.components.push(n),
              this._injector
                .get(Im, [])
                .concat(this._bootstrapListeners)
                .forEach((o) => o(n));
          }
          ngOnDestroy() {
            this._views.slice().forEach((n) => n.destroy()),
              this._onMicrotaskEmptySubscription.unsubscribe();
          }
          get viewCount() {
            return this._views.length;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(we), A(Fe), A(pr), A(kr), A(Vr));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function Tu(e, t) {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
      }
      let Hm = !0,
        Au = (() => {
          class e {}
          return (e.__NG_ELEMENT_ID__ = WS), e;
        })();
      function WS(e) {
        return (function (e, t, n) {
          if (yi(e) && !n) {
            const r = Ye(e.index, t);
            return new ko(r, r);
          }
          return 47 & e.type ? new ko(t[16], t) : null;
        })(De(), b(), 16 == (16 & e));
      }
      class Wm {
        constructor() {}
        supports(t) {
          return Ao(t);
        }
        create(t) {
          return new eI(t);
        }
      }
      const XS = (e, t) => t;
      class eI {
        constructor(t) {
          (this.length = 0),
            (this._linkedRecords = null),
            (this._unlinkedRecords = null),
            (this._previousItHead = null),
            (this._itHead = null),
            (this._itTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._movesHead = null),
            (this._movesTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null),
            (this._identityChangesHead = null),
            (this._identityChangesTail = null),
            (this._trackByFn = t || XS);
        }
        forEachItem(t) {
          let n;
          for (n = this._itHead; null !== n; n = n._next) t(n);
        }
        forEachOperation(t) {
          let n = this._itHead,
            r = this._removalsHead,
            o = 0,
            i = null;
          for (; n || r; ) {
            const s = !r || (n && n.currentIndex < Km(r, o, i)) ? n : r,
              a = Km(s, o, i),
              l = s.currentIndex;
            if (s === r) o--, (r = r._nextRemoved);
            else if (((n = n._next), null == s.previousIndex)) o++;
            else {
              i || (i = []);
              const u = a - o,
                c = l - o;
              if (u != c) {
                for (let f = 0; f < u; f++) {
                  const h = f < i.length ? i[f] : (i[f] = 0),
                    m = h + f;
                  c <= m && m < u && (i[f] = h + 1);
                }
                i[s.previousIndex] = c - u;
              }
            }
            a !== l && t(s, a, l);
          }
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousItHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachMovedItem(t) {
          let n;
          for (n = this._movesHead; null !== n; n = n._nextMoved) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        forEachIdentityChange(t) {
          let n;
          for (
            n = this._identityChangesHead;
            null !== n;
            n = n._nextIdentityChange
          )
            t(n);
        }
        diff(t) {
          if ((null == t && (t = []), !Ao(t)))
            throw new Error(
              `Error trying to diff '${J(
                t,
              )}'. Only arrays and iterables are allowed`,
            );
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let o,
            i,
            s,
            n = this._itHead,
            r = !1;
          if (Array.isArray(t)) {
            this.length = t.length;
            for (let a = 0; a < this.length; a++)
              (i = t[a]),
                (s = this._trackByFn(a, i)),
                null !== n && Object.is(n.trackById, s)
                  ? (r && (n = this._verifyReinsertion(n, i, s, a)),
                    Object.is(n.item, i) || this._addIdentityChange(n, i))
                  : ((n = this._mismatch(n, i, s, a)), (r = !0)),
                (n = n._next);
          } else
            (o = 0),
              (function (e, t) {
                if (Array.isArray(e))
                  for (let n = 0; n < e.length; n++) t(e[n]);
                else {
                  const n = e[wr()]();
                  let r;
                  for (; !(r = n.next()).done; ) t(r.value);
                }
              })(t, (a) => {
                (s = this._trackByFn(o, a)),
                  null !== n && Object.is(n.trackById, s)
                    ? (r && (n = this._verifyReinsertion(n, a, s, o)),
                      Object.is(n.item, a) || this._addIdentityChange(n, a))
                    : ((n = this._mismatch(n, a, s, o)), (r = !0)),
                  (n = n._next),
                  o++;
              }),
              (this.length = o);
          return this._truncate(n), (this.collection = t), this.isDirty;
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._movesHead ||
            null !== this._removalsHead ||
            null !== this._identityChangesHead
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              t = this._previousItHead = this._itHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._additionsHead; null !== t; t = t._nextAdded)
              t.previousIndex = t.currentIndex;
            for (
              this._additionsHead = this._additionsTail = null,
                t = this._movesHead;
              null !== t;
              t = t._nextMoved
            )
              t.previousIndex = t.currentIndex;
            (this._movesHead = this._movesTail = null),
              (this._removalsHead = this._removalsTail = null),
              (this._identityChangesHead = this._identityChangesTail = null);
          }
        }
        _mismatch(t, n, r, o) {
          let i;
          return (
            null === t ? (i = this._itTail) : ((i = t._prev), this._remove(t)),
            null !==
            (t =
              null === this._unlinkedRecords
                ? null
                : this._unlinkedRecords.get(r, null))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._reinsertAfter(t, i, o))
              : null !==
                (t =
                  null === this._linkedRecords
                    ? null
                    : this._linkedRecords.get(r, o))
              ? (Object.is(t.item, n) || this._addIdentityChange(t, n),
                this._moveAfter(t, i, o))
              : (t = this._addAfter(new tI(n, r), i, o)),
            t
          );
        }
        _verifyReinsertion(t, n, r, o) {
          let i =
            null === this._unlinkedRecords
              ? null
              : this._unlinkedRecords.get(r, null);
          return (
            null !== i
              ? (t = this._reinsertAfter(i, t._prev, o))
              : t.currentIndex != o &&
                ((t.currentIndex = o), this._addToMoves(t, o)),
            t
          );
        }
        _truncate(t) {
          for (; null !== t; ) {
            const n = t._next;
            this._addToRemovals(this._unlink(t)), (t = n);
          }
          null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
            null !== this._additionsTail &&
              (this._additionsTail._nextAdded = null),
            null !== this._movesTail && (this._movesTail._nextMoved = null),
            null !== this._itTail && (this._itTail._next = null),
            null !== this._removalsTail &&
              (this._removalsTail._nextRemoved = null),
            null !== this._identityChangesTail &&
              (this._identityChangesTail._nextIdentityChange = null);
        }
        _reinsertAfter(t, n, r) {
          null !== this._unlinkedRecords && this._unlinkedRecords.remove(t);
          const o = t._prevRemoved,
            i = t._nextRemoved;
          return (
            null === o ? (this._removalsHead = i) : (o._nextRemoved = i),
            null === i ? (this._removalsTail = o) : (i._prevRemoved = o),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _moveAfter(t, n, r) {
          return (
            this._unlink(t),
            this._insertAfter(t, n, r),
            this._addToMoves(t, r),
            t
          );
        }
        _addAfter(t, n, r) {
          return (
            this._insertAfter(t, n, r),
            (this._additionsTail =
              null === this._additionsTail
                ? (this._additionsHead = t)
                : (this._additionsTail._nextAdded = t)),
            t
          );
        }
        _insertAfter(t, n, r) {
          const o = null === n ? this._itHead : n._next;
          return (
            (t._next = o),
            (t._prev = n),
            null === o ? (this._itTail = t) : (o._prev = t),
            null === n ? (this._itHead = t) : (n._next = t),
            null === this._linkedRecords && (this._linkedRecords = new Qm()),
            this._linkedRecords.put(t),
            (t.currentIndex = r),
            t
          );
        }
        _remove(t) {
          return this._addToRemovals(this._unlink(t));
        }
        _unlink(t) {
          null !== this._linkedRecords && this._linkedRecords.remove(t);
          const n = t._prev,
            r = t._next;
          return (
            null === n ? (this._itHead = r) : (n._next = r),
            null === r ? (this._itTail = n) : (r._prev = n),
            t
          );
        }
        _addToMoves(t, n) {
          return (
            t.previousIndex === n ||
              (this._movesTail =
                null === this._movesTail
                  ? (this._movesHead = t)
                  : (this._movesTail._nextMoved = t)),
            t
          );
        }
        _addToRemovals(t) {
          return (
            null === this._unlinkedRecords &&
              (this._unlinkedRecords = new Qm()),
            this._unlinkedRecords.put(t),
            (t.currentIndex = null),
            (t._nextRemoved = null),
            null === this._removalsTail
              ? ((this._removalsTail = this._removalsHead = t),
                (t._prevRemoved = null))
              : ((t._prevRemoved = this._removalsTail),
                (this._removalsTail = this._removalsTail._nextRemoved = t)),
            t
          );
        }
        _addIdentityChange(t, n) {
          return (
            (t.item = n),
            (this._identityChangesTail =
              null === this._identityChangesTail
                ? (this._identityChangesHead = t)
                : (this._identityChangesTail._nextIdentityChange = t)),
            t
          );
        }
      }
      class tI {
        constructor(t, n) {
          (this.item = t),
            (this.trackById = n),
            (this.currentIndex = null),
            (this.previousIndex = null),
            (this._nextPrevious = null),
            (this._prev = null),
            (this._next = null),
            (this._prevDup = null),
            (this._nextDup = null),
            (this._prevRemoved = null),
            (this._nextRemoved = null),
            (this._nextAdded = null),
            (this._nextMoved = null),
            (this._nextIdentityChange = null);
        }
      }
      class nI {
        constructor() {
          (this._head = null), (this._tail = null);
        }
        add(t) {
          null === this._head
            ? ((this._head = this._tail = t),
              (t._nextDup = null),
              (t._prevDup = null))
            : ((this._tail._nextDup = t),
              (t._prevDup = this._tail),
              (t._nextDup = null),
              (this._tail = t));
        }
        get(t, n) {
          let r;
          for (r = this._head; null !== r; r = r._nextDup)
            if (
              (null === n || n <= r.currentIndex) &&
              Object.is(r.trackById, t)
            )
              return r;
          return null;
        }
        remove(t) {
          const n = t._prevDup,
            r = t._nextDup;
          return (
            null === n ? (this._head = r) : (n._nextDup = r),
            null === r ? (this._tail = n) : (r._prevDup = n),
            null === this._head
          );
        }
      }
      class Qm {
        constructor() {
          this.map = new Map();
        }
        put(t) {
          const n = t.trackById;
          let r = this.map.get(n);
          r || ((r = new nI()), this.map.set(n, r)), r.add(t);
        }
        get(t, n) {
          const o = this.map.get(t);
          return o ? o.get(t, n) : null;
        }
        remove(t) {
          const n = t.trackById;
          return this.map.get(n).remove(t) && this.map.delete(n), t;
        }
        get isEmpty() {
          return 0 === this.map.size;
        }
        clear() {
          this.map.clear();
        }
      }
      function Km(e, t, n) {
        const r = e.previousIndex;
        if (null === r) return r;
        let o = 0;
        return n && r < n.length && (o = n[r]), r + t + o;
      }
      class Jm {
        constructor() {}
        supports(t) {
          return t instanceof Map || Hl(t);
        }
        create() {
          return new rI();
        }
      }
      class rI {
        constructor() {
          (this._records = new Map()),
            (this._mapHead = null),
            (this._appendAfter = null),
            (this._previousMapHead = null),
            (this._changesHead = null),
            (this._changesTail = null),
            (this._additionsHead = null),
            (this._additionsTail = null),
            (this._removalsHead = null),
            (this._removalsTail = null);
        }
        get isDirty() {
          return (
            null !== this._additionsHead ||
            null !== this._changesHead ||
            null !== this._removalsHead
          );
        }
        forEachItem(t) {
          let n;
          for (n = this._mapHead; null !== n; n = n._next) t(n);
        }
        forEachPreviousItem(t) {
          let n;
          for (n = this._previousMapHead; null !== n; n = n._nextPrevious) t(n);
        }
        forEachChangedItem(t) {
          let n;
          for (n = this._changesHead; null !== n; n = n._nextChanged) t(n);
        }
        forEachAddedItem(t) {
          let n;
          for (n = this._additionsHead; null !== n; n = n._nextAdded) t(n);
        }
        forEachRemovedItem(t) {
          let n;
          for (n = this._removalsHead; null !== n; n = n._nextRemoved) t(n);
        }
        diff(t) {
          if (t) {
            if (!(t instanceof Map || Hl(t)))
              throw new Error(
                `Error trying to diff '${J(
                  t,
                )}'. Only maps and objects are allowed`,
              );
          } else t = new Map();
          return this.check(t) ? this : null;
        }
        onDestroy() {}
        check(t) {
          this._reset();
          let n = this._mapHead;
          if (
            ((this._appendAfter = null),
            this._forEach(t, (r, o) => {
              if (n && n.key === o)
                this._maybeAddToChanges(n, r),
                  (this._appendAfter = n),
                  (n = n._next);
              else {
                const i = this._getOrCreateRecordForKey(o, r);
                n = this._insertBeforeOrAppend(n, i);
              }
            }),
            n)
          ) {
            n._prev && (n._prev._next = null), (this._removalsHead = n);
            for (let r = n; null !== r; r = r._nextRemoved)
              r === this._mapHead && (this._mapHead = null),
                this._records.delete(r.key),
                (r._nextRemoved = r._next),
                (r.previousValue = r.currentValue),
                (r.currentValue = null),
                (r._prev = null),
                (r._next = null);
          }
          return (
            this._changesTail && (this._changesTail._nextChanged = null),
            this._additionsTail && (this._additionsTail._nextAdded = null),
            this.isDirty
          );
        }
        _insertBeforeOrAppend(t, n) {
          if (t) {
            const r = t._prev;
            return (
              (n._next = t),
              (n._prev = r),
              (t._prev = n),
              r && (r._next = n),
              t === this._mapHead && (this._mapHead = n),
              (this._appendAfter = t),
              t
            );
          }
          return (
            this._appendAfter
              ? ((this._appendAfter._next = n), (n._prev = this._appendAfter))
              : (this._mapHead = n),
            (this._appendAfter = n),
            null
          );
        }
        _getOrCreateRecordForKey(t, n) {
          if (this._records.has(t)) {
            const o = this._records.get(t);
            this._maybeAddToChanges(o, n);
            const i = o._prev,
              s = o._next;
            return (
              i && (i._next = s),
              s && (s._prev = i),
              (o._next = null),
              (o._prev = null),
              o
            );
          }
          const r = new oI(t);
          return (
            this._records.set(t, r),
            (r.currentValue = n),
            this._addToAdditions(r),
            r
          );
        }
        _reset() {
          if (this.isDirty) {
            let t;
            for (
              this._previousMapHead = this._mapHead, t = this._previousMapHead;
              null !== t;
              t = t._next
            )
              t._nextPrevious = t._next;
            for (t = this._changesHead; null !== t; t = t._nextChanged)
              t.previousValue = t.currentValue;
            for (t = this._additionsHead; null != t; t = t._nextAdded)
              t.previousValue = t.currentValue;
            (this._changesHead = this._changesTail = null),
              (this._additionsHead = this._additionsTail = null),
              (this._removalsHead = null);
          }
        }
        _maybeAddToChanges(t, n) {
          Object.is(n, t.currentValue) ||
            ((t.previousValue = t.currentValue),
            (t.currentValue = n),
            this._addToChanges(t));
        }
        _addToAdditions(t) {
          null === this._additionsHead
            ? (this._additionsHead = this._additionsTail = t)
            : ((this._additionsTail._nextAdded = t), (this._additionsTail = t));
        }
        _addToChanges(t) {
          null === this._changesHead
            ? (this._changesHead = this._changesTail = t)
            : ((this._changesTail._nextChanged = t), (this._changesTail = t));
        }
        _forEach(t, n) {
          t instanceof Map
            ? t.forEach(n)
            : Object.keys(t).forEach((r) => n(t[r], r));
        }
      }
      class oI {
        constructor(t) {
          (this.key = t),
            (this.previousValue = null),
            (this.currentValue = null),
            (this._nextPrevious = null),
            (this._next = null),
            (this._prev = null),
            (this._nextAdded = null),
            (this._nextRemoved = null),
            (this._nextChanged = null);
        }
      }
      function Zm() {
        return new Uo([new Wm()]);
      }
      let Uo = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (null != r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || Zm()),
              deps: [[e, new dr(), new Ft()]],
            };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (null != r) return r;
            throw new Error(
              `Cannot find a differ supporting object '${n}' of type '${(function (
                e,
              ) {
                return e.name || typeof e;
              })(n)}'`,
            );
          }
        }
        return (e.ɵprov = V({ token: e, providedIn: "root", factory: Zm })), e;
      })();
      function Ym() {
        return new Ur([new Jm()]);
      }
      let Ur = (() => {
        class e {
          constructor(n) {
            this.factories = n;
          }
          static create(n, r) {
            if (r) {
              const o = r.factories.slice();
              n = n.concat(o);
            }
            return new e(n);
          }
          static extend(n) {
            return {
              provide: e,
              useFactory: (r) => e.create(n, r || Ym()),
              deps: [[e, new dr(), new Ft()]],
            };
          }
          find(n) {
            const r = this.factories.find((o) => o.supports(n));
            if (r) return r;
            throw new Error(`Cannot find a differ supporting object '${n}'`);
          }
        }
        return (e.ɵprov = V({ token: e, providedIn: "root", factory: Ym })), e;
      })();
      const sI = [new Jm()],
        lI = new Uo([new Wm()]),
        uI = new Ur(sI),
        cI = Fm(null, "core", [
          { provide: ps, useValue: "unknown" },
          { provide: Lm, deps: [Fe] },
          { provide: Om, deps: [] },
          { provide: Tm, deps: [] },
        ]),
        gI = [
          { provide: Vo, useClass: Vo, deps: [we, Fe, pr, kr, Vr] },
          {
            provide: SM,
            deps: [we],
            useFactory: function (e) {
              let t = [];
              return (
                e.onStable.subscribe(() => {
                  for (; t.length; ) t.pop()();
                }),
                function (n) {
                  t.push(n);
                }
              );
            },
          },
          { provide: Vr, useClass: Vr, deps: [[new Ft(), hs]] },
          { provide: gs, useClass: gs, deps: [] },
          IS,
          {
            provide: Uo,
            useFactory: function () {
              return lI;
            },
            deps: [],
          },
          {
            provide: Ur,
            useFactory: function () {
              return uI;
            },
            deps: [],
          },
          {
            provide: wn,
            useFactory: function (e) {
              return (
                e || ("undefined" != typeof $localize && $localize.locale) || ts
              );
            },
            deps: [[new vo(wn), new Ft(), new dr()]],
          },
          { provide: Am, useValue: "USD" },
        ];
      let yI = (() => {
          class e {
            constructor(n) {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(Vo));
            }),
            (e.ɵmod = Yt({ type: e })),
            (e.ɵinj = Pt({ providers: gI })),
            e
          );
        })(),
        ys = null;
      function bn() {
        return ys;
      }
      const nt = new W("DocumentToken");
      let Un = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = V({
            token: e,
            factory: function () {
              return A(Xm);
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      const wI = new W("Location Initialized");
      let Xm = (() => {
        class e extends Un {
          constructor(n) {
            super(), (this._doc = n), this._init();
          }
          _init() {
            (this.location = window.location), (this._history = window.history);
          }
          getBaseHrefFromDOM() {
            return bn().getBaseHref(this._doc);
          }
          onPopState(n) {
            const r = bn().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("popstate", n, !1),
              () => r.removeEventListener("popstate", n)
            );
          }
          onHashChange(n) {
            const r = bn().getGlobalEventTarget(this._doc, "window");
            return (
              r.addEventListener("hashchange", n, !1),
              () => r.removeEventListener("hashchange", n)
            );
          }
          get href() {
            return this.location.href;
          }
          get protocol() {
            return this.location.protocol;
          }
          get hostname() {
            return this.location.hostname;
          }
          get port() {
            return this.location.port;
          }
          get pathname() {
            return this.location.pathname;
          }
          get search() {
            return this.location.search;
          }
          get hash() {
            return this.location.hash;
          }
          set pathname(n) {
            this.location.pathname = n;
          }
          pushState(n, r, o) {
            ey() ? this._history.pushState(n, r, o) : (this.location.hash = o);
          }
          replaceState(n, r, o) {
            ey()
              ? this._history.replaceState(n, r, o)
              : (this.location.hash = o);
          }
          forward() {
            this._history.forward();
          }
          back() {
            this._history.back();
          }
          historyGo(n = 0) {
            this._history.go(n);
          }
          getState() {
            return this._history.state;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(nt));
          }),
          (e.ɵprov = V({
            token: e,
            factory: function () {
              return new Xm(A(nt));
            },
            providedIn: "platform",
          })),
          e
        );
      })();
      function ey() {
        return !!window.history.pushState;
      }
      function Nu(e, t) {
        if (0 == e.length) return t;
        if (0 == t.length) return e;
        let n = 0;
        return (
          e.endsWith("/") && n++,
          t.startsWith("/") && n++,
          2 == n ? e + t.substring(1) : 1 == n ? e + t : e + "/" + t
        );
      }
      function ty(e) {
        const t = e.match(/#|\?|$/),
          n = (t && t.index) || e.length;
        return e.slice(0, n - ("/" === e[n - 1] ? 1 : 0)) + e.slice(n);
      }
      function sn(e) {
        return e && "?" !== e[0] ? "?" + e : e;
      }
      let $r = (() => {
        class e {
          historyGo(n) {
            throw new Error("Not implemented");
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = V({
            token: e,
            factory: function () {
              return (function (e) {
                const t = A(nt).location;
                return new ny(A(Un), (t && t.origin) || "");
              })();
            },
            providedIn: "root",
          })),
          e
        );
      })();
      const Fu = new W("appBaseHref");
      let ny = (() => {
          class e extends $r {
            constructor(n, r) {
              if (
                (super(),
                (this._platformLocation = n),
                (this._removeListenerFns = []),
                null == r && (r = this._platformLocation.getBaseHrefFromDOM()),
                null == r)
              )
                throw new Error(
                  "No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document.",
                );
              this._baseHref = r;
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n),
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            prepareExternalUrl(n) {
              return Nu(this._baseHref, n);
            }
            path(n = !1) {
              const r =
                  this._platformLocation.pathname +
                  sn(this._platformLocation.search),
                o = this._platformLocation.hash;
              return o && n ? `${r}${o}` : r;
            }
            pushState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + sn(i));
              this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              const s = this.prepareExternalUrl(o + sn(i));
              this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            historyGo(n = 0) {
              var r, o;
              null === (o = (r = this._platformLocation).historyGo) ||
                void 0 === o ||
                o.call(r, n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(Un), A(Fu, 8));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        MI = (() => {
          class e extends $r {
            constructor(n, r) {
              super(),
                (this._platformLocation = n),
                (this._baseHref = ""),
                (this._removeListenerFns = []),
                null != r && (this._baseHref = r);
            }
            ngOnDestroy() {
              for (; this._removeListenerFns.length; )
                this._removeListenerFns.pop()();
            }
            onPopState(n) {
              this._removeListenerFns.push(
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n),
              );
            }
            getBaseHref() {
              return this._baseHref;
            }
            path(n = !1) {
              let r = this._platformLocation.hash;
              return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r;
            }
            prepareExternalUrl(n) {
              const r = Nu(this._baseHref, n);
              return r.length > 0 ? "#" + r : r;
            }
            pushState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + sn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.pushState(n, r, s);
            }
            replaceState(n, r, o, i) {
              let s = this.prepareExternalUrl(o + sn(i));
              0 == s.length && (s = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, r, s);
            }
            forward() {
              this._platformLocation.forward();
            }
            back() {
              this._platformLocation.back();
            }
            historyGo(n = 0) {
              var r, o;
              null === (o = (r = this._platformLocation).historyGo) ||
                void 0 === o ||
                o.call(r, n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(Un), A(Fu, 8));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        ku = (() => {
          class e {
            constructor(n, r) {
              (this._subject = new $e()),
                (this._urlChangeListeners = []),
                (this._platformStrategy = n);
              const o = this._platformStrategy.getBaseHref();
              (this._platformLocation = r),
                (this._baseHref = ty(ry(o))),
                this._platformStrategy.onPopState((i) => {
                  this._subject.emit({
                    url: this.path(!0),
                    pop: !0,
                    state: i.state,
                    type: i.type,
                  });
                });
            }
            path(n = !1) {
              return this.normalize(this._platformStrategy.path(n));
            }
            getState() {
              return this._platformLocation.getState();
            }
            isCurrentPathEqualTo(n, r = "") {
              return this.path() == this.normalize(n + sn(r));
            }
            normalize(n) {
              return e.stripTrailingSlash(
                (function (e, t) {
                  return e && t.startsWith(e) ? t.substring(e.length) : t;
                })(this._baseHref, ry(n)),
              );
            }
            prepareExternalUrl(n) {
              return (
                n && "/" !== n[0] && (n = "/" + n),
                this._platformStrategy.prepareExternalUrl(n)
              );
            }
            go(n, r = "", o = null) {
              this._platformStrategy.pushState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + sn(r)),
                  o,
                );
            }
            replaceState(n, r = "", o = null) {
              this._platformStrategy.replaceState(o, "", n, r),
                this._notifyUrlChangeListeners(
                  this.prepareExternalUrl(n + sn(r)),
                  o,
                );
            }
            forward() {
              this._platformStrategy.forward();
            }
            back() {
              this._platformStrategy.back();
            }
            historyGo(n = 0) {
              var r, o;
              null === (o = (r = this._platformStrategy).historyGo) ||
                void 0 === o ||
                o.call(r, n);
            }
            onUrlChange(n) {
              this._urlChangeListeners.push(n),
                this._urlChangeSubscription ||
                  (this._urlChangeSubscription = this.subscribe((r) => {
                    this._notifyUrlChangeListeners(r.url, r.state);
                  }));
            }
            _notifyUrlChangeListeners(n = "", r) {
              this._urlChangeListeners.forEach((o) => o(n, r));
            }
            subscribe(n, r, o) {
              return this._subject.subscribe({
                next: n,
                error: r,
                complete: o,
              });
            }
          }
          return (
            (e.normalizeQueryParams = sn),
            (e.joinWithSlash = Nu),
            (e.stripTrailingSlash = ty),
            (e.ɵfac = function (n) {
              return new (n || e)(A($r), A(Un));
            }),
            (e.ɵprov = V({
              token: e,
              factory: function () {
                return new ku(A($r), A(Un));
              },
              providedIn: "root",
            })),
            e
          );
        })();
      function ry(e) {
        return e.replace(/\/index.html$/, "");
      }
      var me = (() => (
        ((me = me || {})[(me.Zero = 0)] = "Zero"),
        (me[(me.One = 1)] = "One"),
        (me[(me.Two = 2)] = "Two"),
        (me[(me.Few = 3)] = "Few"),
        (me[(me.Many = 4)] = "Many"),
        (me[(me.Other = 5)] = "Other"),
        me
      ))();
      const NI = function (e) {
        return (function (e) {
          const t = (function (e) {
            return e.toLowerCase().replace(/_/g, "-");
          })(e);
          let n = gg(t);
          if (n) return n;
          const r = t.split("-")[0];
          if (((n = gg(r)), n)) return n;
          if ("en" === r) return pE;
          throw new Error(`Missing locale data for the locale "${e}".`);
        })(e)[S.PluralCase];
      };
      class Is {}
      let uT = (() => {
        class e extends Is {
          constructor(n) {
            super(), (this.locale = n);
          }
          getPluralCategory(n, r) {
            switch (NI(r || this.locale)(n)) {
              case me.Zero:
                return "zero";
              case me.One:
                return "one";
              case me.Two:
                return "two";
              case me.Few:
                return "few";
              case me.Many:
                return "many";
              default:
                return "other";
            }
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(wn));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function fy(e, t) {
        t = encodeURIComponent(t);
        for (const n of e.split(";")) {
          const r = n.indexOf("="),
            [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
          if (o.trim() === t) return decodeURIComponent(i);
        }
        return null;
      }
      let my = (() => {
          class e {
            constructor(n, r, o) {
              (this._ngEl = n),
                (this._differs = r),
                (this._renderer = o),
                (this._ngStyle = null),
                (this._differ = null);
            }
            set ngStyle(n) {
              (this._ngStyle = n),
                !this._differ &&
                  n &&
                  (this._differ = this._differs.find(n).create());
            }
            ngDoCheck() {
              if (this._differ) {
                const n = this._differ.diff(this._ngStyle);
                n && this._applyChanges(n);
              }
            }
            _setStyle(n, r) {
              const [o, i] = n.split(".");
              null != (r = null != r && i ? `${r}${i}` : r)
                ? this._renderer.setStyle(this._ngEl.nativeElement, o, r)
                : this._renderer.removeStyle(this._ngEl.nativeElement, o);
            }
            _applyChanges(n) {
              n.forEachRemovedItem((r) => this._setStyle(r.key, null)),
                n.forEachAddedItem((r) =>
                  this._setStyle(r.key, r.currentValue),
                ),
                n.forEachChangedItem((r) =>
                  this._setStyle(r.key, r.currentValue),
                );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(_n), T(Ur), T(ss));
            }),
            (e.ɵdir = xe({
              type: e,
              selectors: [["", "ngStyle", ""]],
              inputs: { ngStyle: "ngStyle" },
            })),
            e
          );
        })(),
        vy = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Yt({ type: e })),
            (e.ɵinj = Pt({ providers: [{ provide: Is, useClass: uT }] })),
            e
          );
        })();
      let qT = (() => {
        class e {}
        return (
          (e.ɵprov = V({
            token: e,
            providedIn: "root",
            factory: () => new zT(A(nt), window),
          })),
          e
        );
      })();
      class zT {
        constructor(t, n) {
          (this.document = t), (this.window = n), (this.offset = () => [0, 0]);
        }
        setOffset(t) {
          this.offset = Array.isArray(t) ? () => t : t;
        }
        getScrollPosition() {
          return this.supportsScrolling()
            ? [this.window.pageXOffset, this.window.pageYOffset]
            : [0, 0];
        }
        scrollToPosition(t) {
          this.supportsScrolling() && this.window.scrollTo(t[0], t[1]);
        }
        scrollToAnchor(t) {
          if (!this.supportsScrolling()) return;
          const n = (function (e, t) {
            const n = e.getElementById(t) || e.getElementsByName(t)[0];
            if (n) return n;
            if (
              "function" == typeof e.createTreeWalker &&
              e.body &&
              (e.body.createShadowRoot || e.body.attachShadow)
            ) {
              const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
              let o = r.currentNode;
              for (; o; ) {
                const i = o.shadowRoot;
                if (i) {
                  const s =
                    i.getElementById(t) || i.querySelector(`[name="${t}"]`);
                  if (s) return s;
                }
                o = r.nextNode();
              }
            }
            return null;
          })(this.document, t);
          n && (this.scrollToElement(n), this.attemptFocus(n));
        }
        setHistoryScrollRestoration(t) {
          if (this.supportScrollRestoration()) {
            const n = this.window.history;
            n && n.scrollRestoration && (n.scrollRestoration = t);
          }
        }
        scrollToElement(t) {
          const n = t.getBoundingClientRect(),
            r = n.left + this.window.pageXOffset,
            o = n.top + this.window.pageYOffset,
            i = this.offset();
          this.window.scrollTo(r - i[0], o - i[1]);
        }
        attemptFocus(t) {
          return t.focus(), this.document.activeElement === t;
        }
        supportScrollRestoration() {
          try {
            if (!this.supportsScrolling()) return !1;
            const t =
              Cy(this.window.history) ||
              Cy(Object.getPrototypeOf(this.window.history));
            return !(!t || (!t.writable && !t.set));
          } catch (t) {
            return !1;
          }
        }
        supportsScrolling() {
          try {
            return (
              !!this.window &&
              !!this.window.scrollTo &&
              "pageXOffset" in this.window
            );
          } catch (t) {
            return !1;
          }
        }
      }
      function Cy(e) {
        return Object.getOwnPropertyDescriptor(e, "scrollRestoration");
      }
      class _y {}
      class Ku extends class extends class {} {
        constructor() {
          super(...arguments), (this.supportsDOMEvents = !0);
        }
      } {
        static makeCurrent() {
          var e;
          (e = new Ku()), ys || (ys = e);
        }
        onAndCancel(t, n, r) {
          return (
            t.addEventListener(n, r, !1),
            () => {
              t.removeEventListener(n, r, !1);
            }
          );
        }
        dispatchEvent(t, n) {
          t.dispatchEvent(n);
        }
        remove(t) {
          t.parentNode && t.parentNode.removeChild(t);
        }
        createElement(t, n) {
          return (n = n || this.getDefaultDocument()).createElement(t);
        }
        createHtmlDocument() {
          return document.implementation.createHTMLDocument("fakeTitle");
        }
        getDefaultDocument() {
          return document;
        }
        isElementNode(t) {
          return t.nodeType === Node.ELEMENT_NODE;
        }
        isShadowRoot(t) {
          return t instanceof DocumentFragment;
        }
        getGlobalEventTarget(t, n) {
          return "window" === n
            ? window
            : "document" === n
            ? t
            : "body" === n
            ? t.body
            : null;
        }
        getBaseHref(t) {
          const n =
            ((zo = zo || document.querySelector("base")),
            zo ? zo.getAttribute("href") : null);
          return null == n
            ? null
            : (function (e) {
                (Ts = Ts || document.createElement("a")),
                  Ts.setAttribute("href", e);
                const t = Ts.pathname;
                return "/" === t.charAt(0) ? t : `/${t}`;
              })(n);
        }
        resetBaseElement() {
          zo = null;
        }
        getUserAgent() {
          return window.navigator.userAgent;
        }
        getCookie(t) {
          return fy(document.cookie, t);
        }
      }
      let Ts,
        zo = null;
      const wy = new W("TRANSITION_ID"),
        ZT = [
          {
            provide: hs,
            useFactory: function (e, t, n) {
              return () => {
                n.get(Vr).donePromise.then(() => {
                  const r = bn(),
                    o = t.querySelectorAll(`style[ng-transition="${e}"]`);
                  for (let i = 0; i < o.length; i++) r.remove(o[i]);
                });
              };
            },
            deps: [wy, nt, Fe],
            multi: !0,
          },
        ];
      class Ju {
        static init() {
          var e;
          (e = new Ju()), (Iu = e);
        }
        addToWindow(t) {
          (X.getAngularTestability = (r, o = !0) => {
            const i = t.findTestabilityInTree(r, o);
            if (null == i)
              throw new Error("Could not find testability for element.");
            return i;
          }),
            (X.getAllAngularTestabilities = () => t.getAllTestabilities()),
            (X.getAllAngularRootElements = () => t.getAllRootElements()),
            X.frameworkStabilizers || (X.frameworkStabilizers = []),
            X.frameworkStabilizers.push((r) => {
              const o = X.getAllAngularTestabilities();
              let i = o.length,
                s = !1;
              const a = function (l) {
                (s = s || l), i--, 0 == i && r(s);
              };
              o.forEach(function (l) {
                l.whenStable(a);
              });
            });
        }
        findTestabilityInTree(t, n, r) {
          if (null == n) return null;
          const o = t.getTestability(n);
          return null != o
            ? o
            : r
            ? bn().isShadowRoot(n)
              ? this.findTestabilityInTree(t, n.host, !0)
              : this.findTestabilityInTree(t, n.parentElement, !0)
            : null;
        }
      }
      let YT = (() => {
        class e {
          build() {
            return new XMLHttpRequest();
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const As = new W("EventManagerPlugins");
      let Ps = (() => {
        class e {
          constructor(n, r) {
            (this._zone = r),
              (this._eventNameToPlugin = new Map()),
              n.forEach((o) => (o.manager = this)),
              (this._plugins = n.slice().reverse());
          }
          addEventListener(n, r, o) {
            return this._findPluginFor(r).addEventListener(n, r, o);
          }
          addGlobalEventListener(n, r, o) {
            return this._findPluginFor(r).addGlobalEventListener(n, r, o);
          }
          getZone() {
            return this._zone;
          }
          _findPluginFor(n) {
            const r = this._eventNameToPlugin.get(n);
            if (r) return r;
            const o = this._plugins;
            for (let i = 0; i < o.length; i++) {
              const s = o[i];
              if (s.supports(n)) return this._eventNameToPlugin.set(n, s), s;
            }
            throw new Error(`No event manager plugin found for event ${n}`);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(As), A(we));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class by {
        constructor(t) {
          this._doc = t;
        }
        addGlobalEventListener(t, n, r) {
          const o = bn().getGlobalEventTarget(this._doc, t);
          if (!o)
            throw new Error(`Unsupported event target ${o} for event ${n}`);
          return this.addEventListener(o, n, r);
        }
      }
      let Ey = (() => {
          class e {
            constructor() {
              this._stylesSet = new Set();
            }
            addStyles(n) {
              const r = new Set();
              n.forEach((o) => {
                this._stylesSet.has(o) || (this._stylesSet.add(o), r.add(o));
              }),
                this.onStylesAdded(r);
            }
            onStylesAdded(n) {}
            getAllStyles() {
              return Array.from(this._stylesSet);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Go = (() => {
          class e extends Ey {
            constructor(n) {
              super(),
                (this._doc = n),
                (this._hostNodes = new Map()),
                this._hostNodes.set(n.head, []);
            }
            _addStylesToHost(n, r, o) {
              n.forEach((i) => {
                const s = this._doc.createElement("style");
                (s.textContent = i), o.push(r.appendChild(s));
              });
            }
            addHost(n) {
              const r = [];
              this._addStylesToHost(this._stylesSet, n, r),
                this._hostNodes.set(n, r);
            }
            removeHost(n) {
              const r = this._hostNodes.get(n);
              r && r.forEach(My), this._hostNodes.delete(n);
            }
            onStylesAdded(n) {
              this._hostNodes.forEach((r, o) => {
                this._addStylesToHost(n, o, r);
              });
            }
            ngOnDestroy() {
              this._hostNodes.forEach((n) => n.forEach(My));
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(nt));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      function My(e) {
        bn().remove(e);
      }
      const Zu = {
          svg: "http://www.w3.org/2000/svg",
          xhtml: "http://www.w3.org/1999/xhtml",
          xlink: "http://www.w3.org/1999/xlink",
          xml: "http://www.w3.org/XML/1998/namespace",
          xmlns: "http://www.w3.org/2000/xmlns/",
        },
        Yu = /%COMP%/g;
      function xs(e, t, n) {
        for (let r = 0; r < t.length; r++) {
          let o = t[r];
          Array.isArray(o) ? xs(e, o, n) : ((o = o.replace(Yu, e)), n.push(o));
        }
        return n;
      }
      function Ty(e) {
        return (t) => {
          if ("__ngUnwrap__" === t) return e;
          !1 === e(t) && (t.preventDefault(), (t.returnValue = !1));
        };
      }
      let Xu = (() => {
        class e {
          constructor(n, r, o) {
            (this.eventManager = n),
              (this.sharedStylesHost = r),
              (this.appId = o),
              (this.rendererByCompId = new Map()),
              (this.defaultRenderer = new ec(n));
          }
          createRenderer(n, r) {
            if (!n || !r) return this.defaultRenderer;
            switch (r.encapsulation) {
              case xt.Emulated: {
                let o = this.rendererByCompId.get(r.id);
                return (
                  o ||
                    ((o = new o1(
                      this.eventManager,
                      this.sharedStylesHost,
                      r,
                      this.appId,
                    )),
                    this.rendererByCompId.set(r.id, o)),
                  o.applyToHost(n),
                  o
                );
              }
              case 1:
              case xt.ShadowDom:
                return new i1(this.eventManager, this.sharedStylesHost, n, r);
              default:
                if (!this.rendererByCompId.has(r.id)) {
                  const o = xs(r.id, r.styles, []);
                  this.sharedStylesHost.addStyles(o),
                    this.rendererByCompId.set(r.id, this.defaultRenderer);
                }
                return this.defaultRenderer;
            }
          }
          begin() {}
          end() {}
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(Ps), A(Go), A(Ho));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class ec {
        constructor(t) {
          (this.eventManager = t),
            (this.data = Object.create(null)),
            (this.destroyNode = null);
        }
        destroy() {}
        createElement(t, n) {
          return n
            ? document.createElementNS(Zu[n] || n, t)
            : document.createElement(t);
        }
        createComment(t) {
          return document.createComment(t);
        }
        createText(t) {
          return document.createTextNode(t);
        }
        appendChild(t, n) {
          t.appendChild(n);
        }
        insertBefore(t, n, r) {
          t && t.insertBefore(n, r);
        }
        removeChild(t, n) {
          t && t.removeChild(n);
        }
        selectRootElement(t, n) {
          let r = "string" == typeof t ? document.querySelector(t) : t;
          if (!r)
            throw new Error(`The selector "${t}" did not match any elements`);
          return n || (r.textContent = ""), r;
        }
        parentNode(t) {
          return t.parentNode;
        }
        nextSibling(t) {
          return t.nextSibling;
        }
        setAttribute(t, n, r, o) {
          if (o) {
            n = o + ":" + n;
            const i = Zu[o];
            i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
          } else t.setAttribute(n, r);
        }
        removeAttribute(t, n, r) {
          if (r) {
            const o = Zu[r];
            o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
          } else t.removeAttribute(n);
        }
        addClass(t, n) {
          t.classList.add(n);
        }
        removeClass(t, n) {
          t.classList.remove(n);
        }
        setStyle(t, n, r, o) {
          o & (et.DashCase | et.Important)
            ? t.style.setProperty(n, r, o & et.Important ? "important" : "")
            : (t.style[n] = r);
        }
        removeStyle(t, n, r) {
          r & et.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
        }
        setProperty(t, n, r) {
          t[n] = r;
        }
        setValue(t, n) {
          t.nodeValue = n;
        }
        listen(t, n, r) {
          return "string" == typeof t
            ? this.eventManager.addGlobalEventListener(t, n, Ty(r))
            : this.eventManager.addEventListener(t, n, Ty(r));
        }
      }
      class o1 extends ec {
        constructor(t, n, r, o) {
          super(t), (this.component = r);
          const i = xs(o + "-" + r.id, r.styles, []);
          n.addStyles(i),
            (this.contentAttr = "_ngcontent-%COMP%".replace(
              Yu,
              o + "-" + r.id,
            )),
            (this.hostAttr = "_nghost-%COMP%".replace(Yu, o + "-" + r.id));
        }
        applyToHost(t) {
          super.setAttribute(t, this.hostAttr, "");
        }
        createElement(t, n) {
          const r = super.createElement(t, n);
          return super.setAttribute(r, this.contentAttr, ""), r;
        }
      }
      class i1 extends ec {
        constructor(t, n, r, o) {
          super(t),
            (this.sharedStylesHost = n),
            (this.hostEl = r),
            (this.shadowRoot = r.attachShadow({ mode: "open" })),
            this.sharedStylesHost.addHost(this.shadowRoot);
          const i = xs(o.id, o.styles, []);
          for (let s = 0; s < i.length; s++) {
            const a = document.createElement("style");
            (a.textContent = i[s]), this.shadowRoot.appendChild(a);
          }
        }
        nodeOrShadowRoot(t) {
          return t === this.hostEl ? this.shadowRoot : t;
        }
        destroy() {
          this.sharedStylesHost.removeHost(this.shadowRoot);
        }
        appendChild(t, n) {
          return super.appendChild(this.nodeOrShadowRoot(t), n);
        }
        insertBefore(t, n, r) {
          return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
        }
        removeChild(t, n) {
          return super.removeChild(this.nodeOrShadowRoot(t), n);
        }
        parentNode(t) {
          return this.nodeOrShadowRoot(
            super.parentNode(this.nodeOrShadowRoot(t)),
          );
        }
      }
      let s1 = (() => {
        class e extends by {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return !0;
          }
          addEventListener(n, r, o) {
            return (
              n.addEventListener(r, o, !1),
              () => this.removeEventListener(n, r, o)
            );
          }
          removeEventListener(n, r, o) {
            return n.removeEventListener(r, o);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(nt));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Py = ["alt", "control", "meta", "shift"],
        l1 = {
          "\b": "Backspace",
          "\t": "Tab",
          "\x7f": "Delete",
          "\x1b": "Escape",
          Del: "Delete",
          Esc: "Escape",
          Left: "ArrowLeft",
          Right: "ArrowRight",
          Up: "ArrowUp",
          Down: "ArrowDown",
          Menu: "ContextMenu",
          Scroll: "ScrollLock",
          Win: "OS",
        },
        xy = {
          A: "1",
          B: "2",
          C: "3",
          D: "4",
          E: "5",
          F: "6",
          G: "7",
          H: "8",
          I: "9",
          J: "*",
          K: "+",
          M: "-",
          N: ".",
          O: "/",
          "`": "0",
          "\x90": "NumLock",
        },
        u1 = {
          alt: (e) => e.altKey,
          control: (e) => e.ctrlKey,
          meta: (e) => e.metaKey,
          shift: (e) => e.shiftKey,
        };
      let c1 = (() => {
        class e extends by {
          constructor(n) {
            super(n);
          }
          supports(n) {
            return null != e.parseEventName(n);
          }
          addEventListener(n, r, o) {
            const i = e.parseEventName(r),
              s = e.eventCallback(i.fullKey, o, this.manager.getZone());
            return this.manager
              .getZone()
              .runOutsideAngular(() => bn().onAndCancel(n, i.domEventName, s));
          }
          static parseEventName(n) {
            const r = n.toLowerCase().split("."),
              o = r.shift();
            if (0 === r.length || ("keydown" !== o && "keyup" !== o))
              return null;
            const i = e._normalizeKey(r.pop());
            let s = "";
            if (
              (Py.forEach((l) => {
                const u = r.indexOf(l);
                u > -1 && (r.splice(u, 1), (s += l + "."));
              }),
              (s += i),
              0 != r.length || 0 === i.length)
            )
              return null;
            const a = {};
            return (a.domEventName = o), (a.fullKey = s), a;
          }
          static getEventFullKey(n) {
            let r = "",
              o = (function (e) {
                let t = e.key;
                if (null == t) {
                  if (((t = e.keyIdentifier), null == t)) return "Unidentified";
                  t.startsWith("U+") &&
                    ((t = String.fromCharCode(parseInt(t.substring(2), 16))),
                    3 === e.location && xy.hasOwnProperty(t) && (t = xy[t]));
                }
                return l1[t] || t;
              })(n);
            return (
              (o = o.toLowerCase()),
              " " === o ? (o = "space") : "." === o && (o = "dot"),
              Py.forEach((i) => {
                i != o && u1[i](n) && (r += i + ".");
              }),
              (r += o),
              r
            );
          }
          static eventCallback(n, r, o) {
            return (i) => {
              e.getEventFullKey(i) === n && o.runGuarded(() => r(i));
            };
          }
          static _normalizeKey(n) {
            return "esc" === n ? "escape" : n;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(nt));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const g1 = Fm(cI, "browser", [
          { provide: ps, useValue: "browser" },
          {
            provide: Sm,
            useValue: function () {
              Ku.makeCurrent(), Ju.init();
            },
            multi: !0,
          },
          {
            provide: nt,
            useFactory: function () {
              return (e = document), (Da = e), document;
              var e;
            },
            deps: [],
          },
        ]),
        m1 = [
          { provide: Nl, useValue: "root" },
          {
            provide: pr,
            useFactory: function () {
              return new pr();
            },
            deps: [],
          },
          { provide: As, useClass: s1, multi: !0, deps: [nt, we, ps] },
          { provide: As, useClass: c1, multi: !0, deps: [nt] },
          { provide: Xu, useClass: Xu, deps: [Ps, Go, Ho] },
          { provide: $g, useExisting: Xu },
          { provide: Ey, useExisting: Go },
          { provide: Go, useClass: Go, deps: [nt] },
          { provide: Su, useClass: Su, deps: [we] },
          { provide: Ps, useClass: Ps, deps: [As, we] },
          { provide: _y, useClass: YT, deps: [] },
        ];
      let y1 = (() => {
        class e {
          constructor(n) {
            if (n)
              throw new Error(
                "BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.",
              );
          }
          static withServerTransition(n) {
            return {
              ngModule: e,
              providers: [
                { provide: Ho, useValue: n.appId },
                { provide: wy, useExisting: Ho },
                ZT,
              ],
            };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(e, 12));
          }),
          (e.ɵmod = Yt({ type: e })),
          (e.ɵinj = Pt({ providers: m1, imports: [vy, yI] })),
          e
        );
      })();
      function B(...e) {
        return Te(e, eo(e));
      }
      "undefined" != typeof window && window;
      class At extends Gt {
        constructor(t) {
          super(), (this._value = t);
        }
        get value() {
          return this.getValue();
        }
        _subscribe(t) {
          const n = super._subscribe(t);
          return !n.closed && t.next(this._value), n;
        }
        getValue() {
          const { hasError: t, thrownError: n, _value: r } = this;
          if (t) throw n;
          return this._throwIfClosed(), r;
        }
        next(t) {
          super.next((this._value = t));
        }
      }
      const { isArray: T1 } = Array,
        { getPrototypeOf: A1, prototype: P1, keys: x1 } = Object;
      const { isArray: N1 } = Array;
      function j1(...e) {
        const t = eo(e),
          n = (function (e) {
            return oe(ra(e)) ? e.pop() : void 0;
          })(e),
          { args: r, keys: o } = (function (e) {
            if (1 === e.length) {
              const t = e[0];
              if (T1(t)) return { args: t, keys: null };
              if (
                (function (e) {
                  return e && "object" == typeof e && A1(e) === P1;
                })(t)
              ) {
                const n = x1(t);
                return { args: n.map((r) => t[r]), keys: n };
              }
            }
            return { args: e, keys: null };
          })(e);
        if (0 === r.length) return Te([], t);
        const i = new ae(
          (function (e, t, n = Pn) {
            return (r) => {
              Ny(
                t,
                () => {
                  const { length: o } = e,
                    i = new Array(o);
                  let s = o,
                    a = o;
                  for (let l = 0; l < o; l++)
                    Ny(
                      t,
                      () => {
                        const u = Te(e[l], t);
                        let c = !1;
                        u.subscribe(
                          new Ie(
                            r,
                            (d) => {
                              (i[l] = d),
                                c || ((c = !0), a--),
                                a || r.next(n(i.slice()));
                            },
                            () => {
                              --s || r.complete();
                            },
                          ),
                        );
                      },
                      r,
                    );
                },
                r,
              );
            };
          })(
            r,
            t,
            o
              ? (s) =>
                  (function (e, t) {
                    return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
                  })(o, s)
              : Pn,
          ),
        );
        return n
          ? i.pipe(
              (function (e) {
                return Y((t) =>
                  (function (e, t) {
                    return N1(t) ? e(...t) : e(t);
                  })(e, t),
                );
              })(n),
            )
          : i;
      }
      function Ny(e, t, n) {
        e ? Qt(n, e, t) : t();
      }
      const Os = Zr(
        (e) =>
          function () {
            e(this),
              (this.name = "EmptyError"),
              (this.message = "no elements in sequence");
          },
      );
      function nc(...e) {
        return Xr(1)(Te(e, eo(e)));
      }
      function Fy(e) {
        return new ae((t) => {
          Wt(e()).subscribe(t);
        });
      }
      function ky() {
        return Se((e, t) => {
          let n = null;
          e._refCount++;
          const r = new Ie(t, void 0, void 0, void 0, () => {
            if (!e || e._refCount <= 0 || 0 < --e._refCount)
              return void (n = null);
            const o = e._connection,
              i = n;
            (n = null),
              o && (!i || o === i) && o.unsubscribe(),
              t.unsubscribe();
          });
          e.subscribe(r), r.closed || (n = e.connect());
        });
      }
      class V1 extends ae {
        constructor(t, n) {
          super(),
            (this.source = t),
            (this.subjectFactory = n),
            (this._subject = null),
            (this._refCount = 0),
            (this._connection = null),
            Qc(t) && (this.lift = t.lift);
        }
        _subscribe(t) {
          return this.getSubject().subscribe(t);
        }
        getSubject() {
          const t = this._subject;
          return (
            (!t || t.isStopped) && (this._subject = this.subjectFactory()),
            this._subject
          );
        }
        _teardown() {
          this._refCount = 0;
          const { _connection: t } = this;
          (this._subject = this._connection = null),
            null == t || t.unsubscribe();
        }
        connect() {
          let t = this._connection;
          if (!t) {
            t = this._connection = new st();
            const n = this.getSubject();
            t.add(
              this.source.subscribe(
                new Ie(
                  n,
                  void 0,
                  () => {
                    this._teardown(), n.complete();
                  },
                  (r) => {
                    this._teardown(), n.error(r);
                  },
                  () => this._teardown(),
                ),
              ),
            ),
              t.closed && ((this._connection = null), (t = st.EMPTY));
          }
          return t;
        }
        refCount() {
          return ky()(this);
        }
      }
      function $n(e, t) {
        return Se((n, r) => {
          let o = null,
            i = 0,
            s = !1;
          const a = () => s && !o && r.complete();
          n.subscribe(
            new Ie(
              r,
              (l) => {
                null == o || o.unsubscribe();
                let u = 0;
                const c = i++;
                Wt(e(l, c)).subscribe(
                  (o = new Ie(
                    r,
                    (d) => r.next(t ? t(l, d, c, u++) : d),
                    () => {
                      (o = null), a();
                    },
                  )),
                );
              },
              () => {
                (s = !0), a();
              },
            ),
          );
        });
      }
      function $1(e, t, n, r, o) {
        return (i, s) => {
          let a = n,
            l = t,
            u = 0;
          i.subscribe(
            new Ie(
              s,
              (c) => {
                const d = u++;
                (l = a ? e(l, c, d) : ((a = !0), c)), r && s.next(l);
              },
              o &&
                (() => {
                  a && s.next(l), s.complete();
                }),
            ),
          );
        };
      }
      function Ly(e, t) {
        return Se($1(e, t, arguments.length >= 2, !0));
      }
      function qn(e, t) {
        return Se((n, r) => {
          let o = 0;
          n.subscribe(new Ie(r, (i) => e.call(t, i, o++) && r.next(i)));
        });
      }
      function Mn(e) {
        return Se((t, n) => {
          let i,
            r = null,
            o = !1;
          (r = t.subscribe(
            new Ie(n, void 0, void 0, (s) => {
              (i = Wt(e(s, Mn(e)(t)))),
                r ? (r.unsubscribe(), (r = null), i.subscribe(n)) : (o = !0);
            }),
          )),
            o && (r.unsubscribe(), (r = null), i.subscribe(n));
        });
      }
      function qr(e, t) {
        return oe(t) ? Ee(e, t, 1) : Ee(e, 1);
      }
      function rc(e) {
        return e <= 0
          ? () => Kt
          : Se((t, n) => {
              let r = [];
              t.subscribe(
                new Ie(
                  n,
                  (o) => {
                    r.push(o), e < r.length && r.shift();
                  },
                  () => {
                    for (const o of r) n.next(o);
                    n.complete();
                  },
                  void 0,
                  () => {
                    r = null;
                  },
                ),
              );
            });
      }
      function jy(e = q1) {
        return Se((t, n) => {
          let r = !1;
          t.subscribe(
            new Ie(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => (r ? n.complete() : n.error(e())),
            ),
          );
        });
      }
      function q1() {
        return new Os();
      }
      function By(e) {
        return Se((t, n) => {
          let r = !1;
          t.subscribe(
            new Ie(
              n,
              (o) => {
                (r = !0), n.next(o);
              },
              () => {
                r || n.next(e), n.complete();
              },
            ),
          );
        });
      }
      function zr(e, t) {
        const n = arguments.length >= 2;
        return (r) =>
          r.pipe(
            e ? qn((o, i) => e(o, i, r)) : Pn,
            ci(1),
            n ? By(t) : jy(() => new Os()),
          );
      }
      function rt(e, t, n) {
        const r = oe(e) || t || n ? { next: e, error: t, complete: n } : e;
        return r
          ? Se((o, i) => {
              var s;
              null === (s = r.subscribe) || void 0 === s || s.call(r);
              let a = !0;
              o.subscribe(
                new Ie(
                  i,
                  (l) => {
                    var u;
                    null === (u = r.next) || void 0 === u || u.call(r, l),
                      i.next(l);
                  },
                  () => {
                    var l;
                    (a = !1),
                      null === (l = r.complete) || void 0 === l || l.call(r),
                      i.complete();
                  },
                  (l) => {
                    var u;
                    (a = !1),
                      null === (u = r.error) || void 0 === u || u.call(r, l),
                      i.error(l);
                  },
                  () => {
                    var l, u;
                    a &&
                      (null === (l = r.unsubscribe) ||
                        void 0 === l ||
                        l.call(r)),
                      null === (u = r.finalize) || void 0 === u || u.call(r);
                  },
                ),
              );
            })
          : Pn;
      }
      class ln {
        constructor(t, n) {
          (this.id = t), (this.url = n);
        }
      }
      class oc extends ln {
        constructor(t, n, r = "imperative", o = null) {
          super(t, n), (this.navigationTrigger = r), (this.restoredState = o);
        }
        toString() {
          return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class Wo extends ln {
        constructor(t, n, r) {
          super(t, n), (this.urlAfterRedirects = r);
        }
        toString() {
          return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
        }
      }
      class Hy extends ln {
        constructor(t, n, r) {
          super(t, n), (this.reason = r);
        }
        toString() {
          return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
        }
      }
      class W1 extends ln {
        constructor(t, n, r) {
          super(t, n), (this.error = r);
        }
        toString() {
          return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
        }
      }
      class Q1 extends ln {
        constructor(t, n, r, o) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = o);
        }
        toString() {
          return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class K1 extends ln {
        constructor(t, n, r, o) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = o);
        }
        toString() {
          return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class J1 extends ln {
        constructor(t, n, r, o, i) {
          super(t, n),
            (this.urlAfterRedirects = r),
            (this.state = o),
            (this.shouldActivate = i);
        }
        toString() {
          return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
        }
      }
      class Z1 extends ln {
        constructor(t, n, r, o) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = o);
        }
        toString() {
          return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Y1 extends ln {
        constructor(t, n, r, o) {
          super(t, n), (this.urlAfterRedirects = r), (this.state = o);
        }
        toString() {
          return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
        }
      }
      class Vy {
        constructor(t) {
          this.route = t;
        }
        toString() {
          return `RouteConfigLoadStart(path: ${this.route.path})`;
        }
      }
      class Uy {
        constructor(t) {
          this.route = t;
        }
        toString() {
          return `RouteConfigLoadEnd(path: ${this.route.path})`;
        }
      }
      class X1 {
        constructor(t) {
          this.snapshot = t;
        }
        toString() {
          return `ChildActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class eA {
        constructor(t) {
          this.snapshot = t;
        }
        toString() {
          return `ChildActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class tA {
        constructor(t) {
          this.snapshot = t;
        }
        toString() {
          return `ActivationStart(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class nA {
        constructor(t) {
          this.snapshot = t;
        }
        toString() {
          return `ActivationEnd(path: '${
            (this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ""
          }')`;
        }
      }
      class $y {
        constructor(t, n, r) {
          (this.routerEvent = t), (this.position = n), (this.anchor = r);
        }
        toString() {
          return `Scroll(anchor: '${this.anchor}', position: '${
            this.position ? `${this.position[0]}, ${this.position[1]}` : null
          }')`;
        }
      }
      const z = "primary";
      class rA {
        constructor(t) {
          this.params = t || {};
        }
        has(t) {
          return Object.prototype.hasOwnProperty.call(this.params, t);
        }
        get(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n[0] : n;
          }
          return null;
        }
        getAll(t) {
          if (this.has(t)) {
            const n = this.params[t];
            return Array.isArray(n) ? n : [n];
          }
          return [];
        }
        get keys() {
          return Object.keys(this.params);
        }
      }
      function Gr(e) {
        return new rA(e);
      }
      const qy = "ngNavigationCancelingError";
      function ic(e) {
        const t = Error("NavigationCancelingError: " + e);
        return (t[qy] = !0), t;
      }
      function iA(e, t, n) {
        const r = n.path.split("/");
        if (
          r.length > e.length ||
          ("full" === n.pathMatch && (t.hasChildren() || r.length < e.length))
        )
          return null;
        const o = {};
        for (let i = 0; i < r.length; i++) {
          const s = r[i],
            a = e[i];
          if (s.startsWith(":")) o[s.substring(1)] = a;
          else if (s !== a.path) return null;
        }
        return { consumed: e.slice(0, r.length), posParams: o };
      }
      function Ut(e, t) {
        const n = e ? Object.keys(e) : void 0,
          r = t ? Object.keys(t) : void 0;
        if (!n || !r || n.length != r.length) return !1;
        let o;
        for (let i = 0; i < n.length; i++)
          if (((o = n[i]), !zy(e[o], t[o]))) return !1;
        return !0;
      }
      function zy(e, t) {
        if (Array.isArray(e) && Array.isArray(t)) {
          if (e.length !== t.length) return !1;
          const n = [...e].sort(),
            r = [...t].sort();
          return n.every((o, i) => r[i] === o);
        }
        return e === t;
      }
      function Gy(e) {
        return Array.prototype.concat.apply([], e);
      }
      function Wy(e) {
        return e.length > 0 ? e[e.length - 1] : null;
      }
      function Pe(e, t) {
        for (const n in e) e.hasOwnProperty(n) && t(e[n], n);
      }
      function $t(e) {
        return _p(e) ? e : Xi(e) ? Te(Promise.resolve(e)) : B(e);
      }
      const lA = {
          exact: function Jy(e, t, n) {
            if (
              !Gn(e.segments, t.segments) ||
              !Rs(e.segments, t.segments, n) ||
              e.numberOfChildren !== t.numberOfChildren
            )
              return !1;
            for (const r in t.children)
              if (!e.children[r] || !Jy(e.children[r], t.children[r], n))
                return !1;
            return !0;
          },
          subset: Zy,
        },
        Qy = {
          exact: function (e, t) {
            return Ut(e, t);
          },
          subset: function (e, t) {
            return (
              Object.keys(t).length <= Object.keys(e).length &&
              Object.keys(t).every((n) => zy(e[n], t[n]))
            );
          },
          ignored: () => !0,
        };
      function Ky(e, t, n) {
        return (
          lA[n.paths](e.root, t.root, n.matrixParams) &&
          Qy[n.queryParams](e.queryParams, t.queryParams) &&
          !("exact" === n.fragment && e.fragment !== t.fragment)
        );
      }
      function Zy(e, t, n) {
        return Yy(e, t, t.segments, n);
      }
      function Yy(e, t, n, r) {
        if (e.segments.length > n.length) {
          const o = e.segments.slice(0, n.length);
          return !(!Gn(o, n) || t.hasChildren() || !Rs(o, n, r));
        }
        if (e.segments.length === n.length) {
          if (!Gn(e.segments, n) || !Rs(e.segments, n, r)) return !1;
          for (const o in t.children)
            if (!e.children[o] || !Zy(e.children[o], t.children[o], r))
              return !1;
          return !0;
        }
        {
          const o = n.slice(0, e.segments.length),
            i = n.slice(e.segments.length);
          return (
            !!(Gn(e.segments, o) && Rs(e.segments, o, r) && e.children[z]) &&
            Yy(e.children[z], t, i, r)
          );
        }
      }
      function Rs(e, t, n) {
        return t.every((r, o) => Qy[n](e[o].parameters, r.parameters));
      }
      class zn {
        constructor(t, n, r) {
          (this.root = t), (this.queryParams = n), (this.fragment = r);
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Gr(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return hA.serialize(this);
        }
      }
      class Q {
        constructor(t, n) {
          (this.segments = t),
            (this.children = n),
            (this.parent = null),
            Pe(n, (r, o) => (r.parent = this));
        }
        hasChildren() {
          return this.numberOfChildren > 0;
        }
        get numberOfChildren() {
          return Object.keys(this.children).length;
        }
        toString() {
          return Ns(this);
        }
      }
      class Qo {
        constructor(t, n) {
          (this.path = t), (this.parameters = n);
        }
        get parameterMap() {
          return (
            this._parameterMap || (this._parameterMap = Gr(this.parameters)),
            this._parameterMap
          );
        }
        toString() {
          return rv(this);
        }
      }
      function Gn(e, t) {
        return e.length === t.length && e.every((n, r) => n.path === t[r].path);
      }
      class Xy {}
      class ev {
        parse(t) {
          const n = new wA(t);
          return new zn(
            n.parseRootSegment(),
            n.parseQueryParams(),
            n.parseFragment(),
          );
        }
        serialize(t) {
          const n = `/${Ko(t.root, !0)}`,
            r = (function (e) {
              const t = Object.keys(e)
                .map((n) => {
                  const r = e[n];
                  return Array.isArray(r)
                    ? r.map((o) => `${Fs(n)}=${Fs(o)}`).join("&")
                    : `${Fs(n)}=${Fs(r)}`;
                })
                .filter((n) => !!n);
              return t.length ? `?${t.join("&")}` : "";
            })(t.queryParams);
          var e;
          return `${n}${r}${
            "string" == typeof t.fragment
              ? `#${((e = t.fragment), encodeURI(e))}`
              : ""
          }`;
        }
      }
      const hA = new ev();
      function Ns(e) {
        return e.segments.map((t) => rv(t)).join("/");
      }
      function Ko(e, t) {
        if (!e.hasChildren()) return Ns(e);
        if (t) {
          const n = e.children[z] ? Ko(e.children[z], !1) : "",
            r = [];
          return (
            Pe(e.children, (o, i) => {
              i !== z && r.push(`${i}:${Ko(o, !1)}`);
            }),
            r.length > 0 ? `${n}(${r.join("//")})` : n
          );
        }
        {
          const n = (function (e, t) {
            let n = [];
            return (
              Pe(e.children, (r, o) => {
                o === z && (n = n.concat(t(r, o)));
              }),
              Pe(e.children, (r, o) => {
                o !== z && (n = n.concat(t(r, o)));
              }),
              n
            );
          })(e, (r, o) =>
            o === z ? [Ko(e.children[z], !1)] : [`${o}:${Ko(r, !1)}`],
          );
          return 1 === Object.keys(e.children).length && null != e.children[z]
            ? `${Ns(e)}/${n[0]}`
            : `${Ns(e)}/(${n.join("//")})`;
        }
      }
      function tv(e) {
        return encodeURIComponent(e)
          .replace(/%40/g, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",");
      }
      function Fs(e) {
        return tv(e).replace(/%3B/gi, ";");
      }
      function sc(e) {
        return tv(e)
          .replace(/\(/g, "%28")
          .replace(/\)/g, "%29")
          .replace(/%26/gi, "&");
      }
      function ks(e) {
        return decodeURIComponent(e);
      }
      function nv(e) {
        return ks(e.replace(/\+/g, "%20"));
      }
      function rv(e) {
        return `${sc(e.path)}${(function (e) {
          return Object.keys(e)
            .map((t) => `;${sc(t)}=${sc(e[t])}`)
            .join("");
        })(e.parameters)}`;
      }
      const yA = /^[^\/()?;=#]+/;
      function Ls(e) {
        const t = e.match(yA);
        return t ? t[0] : "";
      }
      const vA = /^[^=?&#]+/,
        CA = /^[^&#]+/;
      class wA {
        constructor(t) {
          (this.url = t), (this.remaining = t);
        }
        parseRootSegment() {
          return (
            this.consumeOptional("/"),
            "" === this.remaining ||
            this.peekStartsWith("?") ||
            this.peekStartsWith("#")
              ? new Q([], {})
              : new Q([], this.parseChildren())
          );
        }
        parseQueryParams() {
          const t = {};
          if (this.consumeOptional("?"))
            do {
              this.parseQueryParam(t);
            } while (this.consumeOptional("&"));
          return t;
        }
        parseFragment() {
          return this.consumeOptional("#")
            ? decodeURIComponent(this.remaining)
            : null;
        }
        parseChildren() {
          if ("" === this.remaining) return {};
          this.consumeOptional("/");
          const t = [];
          for (
            this.peekStartsWith("(") || t.push(this.parseSegment());
            this.peekStartsWith("/") &&
            !this.peekStartsWith("//") &&
            !this.peekStartsWith("/(");

          )
            this.capture("/"), t.push(this.parseSegment());
          let n = {};
          this.peekStartsWith("/(") &&
            (this.capture("/"), (n = this.parseParens(!0)));
          let r = {};
          return (
            this.peekStartsWith("(") && (r = this.parseParens(!1)),
            (t.length > 0 || Object.keys(n).length > 0) && (r[z] = new Q(t, n)),
            r
          );
        }
        parseSegment() {
          const t = Ls(this.remaining);
          if ("" === t && this.peekStartsWith(";"))
            throw new Error(
              `Empty path url segment cannot have parameters: '${this.remaining}'.`,
            );
          return this.capture(t), new Qo(ks(t), this.parseMatrixParams());
        }
        parseMatrixParams() {
          const t = {};
          for (; this.consumeOptional(";"); ) this.parseParam(t);
          return t;
        }
        parseParam(t) {
          const n = Ls(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const o = Ls(this.remaining);
            o && ((r = o), this.capture(r));
          }
          t[ks(n)] = ks(r);
        }
        parseQueryParam(t) {
          const n = (function (e) {
            const t = e.match(vA);
            return t ? t[0] : "";
          })(this.remaining);
          if (!n) return;
          this.capture(n);
          let r = "";
          if (this.consumeOptional("=")) {
            const s = (function (e) {
              const t = e.match(CA);
              return t ? t[0] : "";
            })(this.remaining);
            s && ((r = s), this.capture(r));
          }
          const o = nv(n),
            i = nv(r);
          if (t.hasOwnProperty(o)) {
            let s = t[o];
            Array.isArray(s) || ((s = [s]), (t[o] = s)), s.push(i);
          } else t[o] = i;
        }
        parseParens(t) {
          const n = {};
          for (
            this.capture("(");
            !this.consumeOptional(")") && this.remaining.length > 0;

          ) {
            const r = Ls(this.remaining),
              o = this.remaining[r.length];
            if ("/" !== o && ")" !== o && ";" !== o)
              throw new Error(`Cannot parse url '${this.url}'`);
            let i;
            r.indexOf(":") > -1
              ? ((i = r.substr(0, r.indexOf(":"))),
                this.capture(i),
                this.capture(":"))
              : t && (i = z);
            const s = this.parseChildren();
            (n[i] = 1 === Object.keys(s).length ? s[z] : new Q([], s)),
              this.consumeOptional("//");
          }
          return n;
        }
        peekStartsWith(t) {
          return this.remaining.startsWith(t);
        }
        consumeOptional(t) {
          return (
            !!this.peekStartsWith(t) &&
            ((this.remaining = this.remaining.substring(t.length)), !0)
          );
        }
        capture(t) {
          if (!this.consumeOptional(t)) throw new Error(`Expected "${t}".`);
        }
      }
      class ov {
        constructor(t) {
          this._root = t;
        }
        get root() {
          return this._root.value;
        }
        parent(t) {
          const n = this.pathFromRoot(t);
          return n.length > 1 ? n[n.length - 2] : null;
        }
        children(t) {
          const n = ac(t, this._root);
          return n ? n.children.map((r) => r.value) : [];
        }
        firstChild(t) {
          const n = ac(t, this._root);
          return n && n.children.length > 0 ? n.children[0].value : null;
        }
        siblings(t) {
          const n = lc(t, this._root);
          return n.length < 2
            ? []
            : n[n.length - 2].children
                .map((o) => o.value)
                .filter((o) => o !== t);
        }
        pathFromRoot(t) {
          return lc(t, this._root).map((n) => n.value);
        }
      }
      function ac(e, t) {
        if (e === t.value) return t;
        for (const n of t.children) {
          const r = ac(e, n);
          if (r) return r;
        }
        return null;
      }
      function lc(e, t) {
        if (e === t.value) return [t];
        for (const n of t.children) {
          const r = lc(e, n);
          if (r.length) return r.unshift(t), r;
        }
        return [];
      }
      class un {
        constructor(t, n) {
          (this.value = t), (this.children = n);
        }
        toString() {
          return `TreeNode(${this.value})`;
        }
      }
      function Wr(e) {
        const t = {};
        return e && e.children.forEach((n) => (t[n.value.outlet] = n)), t;
      }
      class iv extends ov {
        constructor(t, n) {
          super(t), (this.snapshot = n), uc(this, t);
        }
        toString() {
          return this.snapshot.toString();
        }
      }
      function sv(e, t) {
        const n = (function (e, t) {
            const s = new js([], {}, {}, "", {}, z, t, null, e.root, -1, {});
            return new lv("", new un(s, []));
          })(e, t),
          r = new At([new Qo("", {})]),
          o = new At({}),
          i = new At({}),
          s = new At({}),
          a = new At(""),
          l = new Qr(r, o, s, a, i, z, t, n.root);
        return (l.snapshot = n.root), new iv(new un(l, []), n);
      }
      class Qr {
        constructor(t, n, r, o, i, s, a, l) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this._futureSnapshot = l);
        }
        get routeConfig() {
          return this._futureSnapshot.routeConfig;
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap ||
              (this._paramMap = this.params.pipe(Y((t) => Gr(t)))),
            this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap ||
              (this._queryParamMap = this.queryParams.pipe(Y((t) => Gr(t)))),
            this._queryParamMap
          );
        }
        toString() {
          return this.snapshot
            ? this.snapshot.toString()
            : `Future(${this._futureSnapshot})`;
        }
      }
      function av(e, t = "emptyOnly") {
        const n = e.pathFromRoot;
        let r = 0;
        if ("always" !== t)
          for (r = n.length - 1; r >= 1; ) {
            const o = n[r],
              i = n[r - 1];
            if (o.routeConfig && "" === o.routeConfig.path) r--;
            else {
              if (i.component) break;
              r--;
            }
          }
        return (function (e) {
          return e.reduce(
            (t, n) => ({
              params: Object.assign(Object.assign({}, t.params), n.params),
              data: Object.assign(Object.assign({}, t.data), n.data),
              resolve: Object.assign(
                Object.assign({}, t.resolve),
                n._resolvedData,
              ),
            }),
            { params: {}, data: {}, resolve: {} },
          );
        })(n.slice(r));
      }
      class js {
        constructor(t, n, r, o, i, s, a, l, u, c, d) {
          (this.url = t),
            (this.params = n),
            (this.queryParams = r),
            (this.fragment = o),
            (this.data = i),
            (this.outlet = s),
            (this.component = a),
            (this.routeConfig = l),
            (this._urlSegment = u),
            (this._lastPathIndex = c),
            (this._resolve = d);
        }
        get root() {
          return this._routerState.root;
        }
        get parent() {
          return this._routerState.parent(this);
        }
        get firstChild() {
          return this._routerState.firstChild(this);
        }
        get children() {
          return this._routerState.children(this);
        }
        get pathFromRoot() {
          return this._routerState.pathFromRoot(this);
        }
        get paramMap() {
          return (
            this._paramMap || (this._paramMap = Gr(this.params)), this._paramMap
          );
        }
        get queryParamMap() {
          return (
            this._queryParamMap || (this._queryParamMap = Gr(this.queryParams)),
            this._queryParamMap
          );
        }
        toString() {
          return `Route(url:'${this.url
            .map((r) => r.toString())
            .join("/")}', path:'${
            this.routeConfig ? this.routeConfig.path : ""
          }')`;
        }
      }
      class lv extends ov {
        constructor(t, n) {
          super(n), (this.url = t), uc(this, n);
        }
        toString() {
          return uv(this._root);
        }
      }
      function uc(e, t) {
        (t.value._routerState = e), t.children.forEach((n) => uc(e, n));
      }
      function uv(e) {
        const t =
          e.children.length > 0 ? ` { ${e.children.map(uv).join(", ")} } ` : "";
        return `${e.value}${t}`;
      }
      function cc(e) {
        if (e.snapshot) {
          const t = e.snapshot,
            n = e._futureSnapshot;
          (e.snapshot = n),
            Ut(t.queryParams, n.queryParams) ||
              e.queryParams.next(n.queryParams),
            t.fragment !== n.fragment && e.fragment.next(n.fragment),
            Ut(t.params, n.params) || e.params.next(n.params),
            (function (e, t) {
              if (e.length !== t.length) return !1;
              for (let n = 0; n < e.length; ++n) if (!Ut(e[n], t[n])) return !1;
              return !0;
            })(t.url, n.url) || e.url.next(n.url),
            Ut(t.data, n.data) || e.data.next(n.data);
        } else
          (e.snapshot = e._futureSnapshot), e.data.next(e._futureSnapshot.data);
      }
      function dc(e, t) {
        const n =
          Ut(e.params, t.params) &&
          (function (e, t) {
            return (
              Gn(e, t) && e.every((n, r) => Ut(n.parameters, t[r].parameters))
            );
          })(e.url, t.url);
        return (
          n &&
          !(!e.parent != !t.parent) &&
          (!e.parent || dc(e.parent, t.parent))
        );
      }
      function Jo(e, t, n) {
        if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
          const r = n.value;
          r._futureSnapshot = t.value;
          const o = (function (e, t, n) {
            return t.children.map((r) => {
              for (const o of n.children)
                if (e.shouldReuseRoute(r.value, o.value.snapshot))
                  return Jo(e, r, o);
              return Jo(e, r);
            });
          })(e, t, n);
          return new un(r, o);
        }
        {
          if (e.shouldAttach(t.value)) {
            const i = e.retrieve(t.value);
            if (null !== i) {
              const s = i.route;
              return (
                (s.value._futureSnapshot = t.value),
                (s.children = t.children.map((a) => Jo(e, a))),
                s
              );
            }
          }
          const r = (function (e) {
              return new Qr(
                new At(e.url),
                new At(e.params),
                new At(e.queryParams),
                new At(e.fragment),
                new At(e.data),
                e.outlet,
                e.component,
                e,
              );
            })(t.value),
            o = t.children.map((i) => Jo(e, i));
          return new un(r, o);
        }
      }
      function Bs(e) {
        return (
          "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        );
      }
      function Zo(e) {
        return "object" == typeof e && null != e && e.outlets;
      }
      function fc(e, t, n, r, o) {
        let i = {};
        return (
          r &&
            Pe(r, (s, a) => {
              i[a] = Array.isArray(s) ? s.map((l) => `${l}`) : `${s}`;
            }),
          new zn(n.root === e ? t : cv(n.root, e, t), i, o)
        );
      }
      function cv(e, t, n) {
        const r = {};
        return (
          Pe(e.children, (o, i) => {
            r[i] = o === t ? n : cv(o, t, n);
          }),
          new Q(e.segments, r)
        );
      }
      class dv {
        constructor(t, n, r) {
          if (
            ((this.isAbsolute = t),
            (this.numberOfDoubleDots = n),
            (this.commands = r),
            t && r.length > 0 && Bs(r[0]))
          )
            throw new Error("Root segment cannot have matrix parameters");
          const o = r.find(Zo);
          if (o && o !== Wy(r))
            throw new Error("{outlets:{}} has to be the last command");
        }
        toRoot() {
          return (
            this.isAbsolute &&
            1 === this.commands.length &&
            "/" == this.commands[0]
          );
        }
      }
      class hc {
        constructor(t, n, r) {
          (this.segmentGroup = t), (this.processChildren = n), (this.index = r);
        }
      }
      function fv(e, t, n) {
        if (
          (e || (e = new Q([], {})), 0 === e.segments.length && e.hasChildren())
        )
          return Hs(e, t, n);
        const r = (function (e, t, n) {
            let r = 0,
              o = t;
            const i = { match: !1, pathIndex: 0, commandIndex: 0 };
            for (; o < e.segments.length; ) {
              if (r >= n.length) return i;
              const s = e.segments[o],
                a = n[r];
              if (Zo(a)) break;
              const l = `${a}`,
                u = r < n.length - 1 ? n[r + 1] : null;
              if (o > 0 && void 0 === l) break;
              if (l && u && "object" == typeof u && void 0 === u.outlets) {
                if (!pv(l, u, s)) return i;
                r += 2;
              } else {
                if (!pv(l, {}, s)) return i;
                r++;
              }
              o++;
            }
            return { match: !0, pathIndex: o, commandIndex: r };
          })(e, t, n),
          o = n.slice(r.commandIndex);
        if (r.match && r.pathIndex < e.segments.length) {
          const i = new Q(e.segments.slice(0, r.pathIndex), {});
          return (
            (i.children[z] = new Q(e.segments.slice(r.pathIndex), e.children)),
            Hs(i, 0, o)
          );
        }
        return r.match && 0 === o.length
          ? new Q(e.segments, {})
          : r.match && !e.hasChildren()
          ? pc(e, t, n)
          : r.match
          ? Hs(e, 0, o)
          : pc(e, t, n);
      }
      function Hs(e, t, n) {
        if (0 === n.length) return new Q(e.segments, {});
        {
          const r = (function (e) {
              return Zo(e[0]) ? e[0].outlets : { [z]: e };
            })(n),
            o = {};
          return (
            Pe(r, (i, s) => {
              "string" == typeof i && (i = [i]),
                null !== i && (o[s] = fv(e.children[s], t, i));
            }),
            Pe(e.children, (i, s) => {
              void 0 === r[s] && (o[s] = i);
            }),
            new Q(e.segments, o)
          );
        }
      }
      function pc(e, t, n) {
        const r = e.segments.slice(0, t);
        let o = 0;
        for (; o < n.length; ) {
          const i = n[o];
          if (Zo(i)) {
            const l = NA(i.outlets);
            return new Q(r, l);
          }
          if (0 === o && Bs(n[0])) {
            r.push(new Qo(e.segments[t].path, hv(n[0]))), o++;
            continue;
          }
          const s = Zo(i) ? i.outlets[z] : `${i}`,
            a = o < n.length - 1 ? n[o + 1] : null;
          s && a && Bs(a)
            ? (r.push(new Qo(s, hv(a))), (o += 2))
            : (r.push(new Qo(s, {})), o++);
        }
        return new Q(r, {});
      }
      function NA(e) {
        const t = {};
        return (
          Pe(e, (n, r) => {
            "string" == typeof n && (n = [n]),
              null !== n && (t[r] = pc(new Q([], {}), 0, n));
          }),
          t
        );
      }
      function hv(e) {
        const t = {};
        return Pe(e, (n, r) => (t[r] = `${n}`)), t;
      }
      function pv(e, t, n) {
        return e == n.path && Ut(t, n.parameters);
      }
      class kA {
        constructor(t, n, r, o) {
          (this.routeReuseStrategy = t),
            (this.futureState = n),
            (this.currState = r),
            (this.forwardEvent = o);
        }
        activate(t) {
          const n = this.futureState._root,
            r = this.currState ? this.currState._root : null;
          this.deactivateChildRoutes(n, r, t),
            cc(this.futureState.root),
            this.activateChildRoutes(n, r, t);
        }
        deactivateChildRoutes(t, n, r) {
          const o = Wr(n);
          t.children.forEach((i) => {
            const s = i.value.outlet;
            this.deactivateRoutes(i, o[s], r), delete o[s];
          }),
            Pe(o, (i, s) => {
              this.deactivateRouteAndItsChildren(i, r);
            });
        }
        deactivateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if (o === i)
            if (o.component) {
              const s = r.getContext(o.outlet);
              s && this.deactivateChildRoutes(t, n, s.children);
            } else this.deactivateChildRoutes(t, n, r);
          else i && this.deactivateRouteAndItsChildren(n, r);
        }
        deactivateRouteAndItsChildren(t, n) {
          t.value.component &&
          this.routeReuseStrategy.shouldDetach(t.value.snapshot)
            ? this.detachAndStoreRouteSubtree(t, n)
            : this.deactivateRouteAndOutlet(t, n);
        }
        detachAndStoreRouteSubtree(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = Wr(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          if (r && r.outlet) {
            const s = r.outlet.detach(),
              a = r.children.onOutletDeactivated();
            this.routeReuseStrategy.store(t.value.snapshot, {
              componentRef: s,
              route: t,
              contexts: a,
            });
          }
        }
        deactivateRouteAndOutlet(t, n) {
          const r = n.getContext(t.value.outlet),
            o = r && t.value.component ? r.children : n,
            i = Wr(t);
          for (const s of Object.keys(i))
            this.deactivateRouteAndItsChildren(i[s], o);
          r &&
            r.outlet &&
            (r.outlet.deactivate(),
            r.children.onOutletDeactivated(),
            (r.attachRef = null),
            (r.resolver = null),
            (r.route = null));
        }
        activateChildRoutes(t, n, r) {
          const o = Wr(n);
          t.children.forEach((i) => {
            this.activateRoutes(i, o[i.value.outlet], r),
              this.forwardEvent(new nA(i.value.snapshot));
          }),
            t.children.length && this.forwardEvent(new eA(t.value.snapshot));
        }
        activateRoutes(t, n, r) {
          const o = t.value,
            i = n ? n.value : null;
          if ((cc(o), o === i))
            if (o.component) {
              const s = r.getOrCreateContext(o.outlet);
              this.activateChildRoutes(t, n, s.children);
            } else this.activateChildRoutes(t, n, r);
          else if (o.component) {
            const s = r.getOrCreateContext(o.outlet);
            if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
              const a = this.routeReuseStrategy.retrieve(o.snapshot);
              this.routeReuseStrategy.store(o.snapshot, null),
                s.children.onOutletReAttached(a.contexts),
                (s.attachRef = a.componentRef),
                (s.route = a.route.value),
                s.outlet && s.outlet.attach(a.componentRef, a.route.value),
                cc(a.route.value),
                this.activateChildRoutes(t, null, s.children);
            } else {
              const a = (function (e) {
                  for (let t = e.parent; t; t = t.parent) {
                    const n = t.routeConfig;
                    if (n && n._loadedConfig) return n._loadedConfig;
                    if (n && n.component) return null;
                  }
                  return null;
                })(o.snapshot),
                l = a ? a.module.componentFactoryResolver : null;
              (s.attachRef = null),
                (s.route = o),
                (s.resolver = l),
                s.outlet && s.outlet.activateWith(o, l),
                this.activateChildRoutes(t, null, s.children);
            }
          } else this.activateChildRoutes(t, null, r);
        }
      }
      class gc {
        constructor(t, n) {
          (this.routes = t), (this.module = n);
        }
      }
      function Sn(e) {
        return "function" == typeof e;
      }
      function Wn(e) {
        return e instanceof zn;
      }
      const Yo = Symbol("INITIAL_VALUE");
      function Xo() {
        return $n((e) =>
          j1(
            e.map((t) =>
              t.pipe(
                ci(1),
                (function (...e) {
                  const t = eo(e);
                  return Se((n, r) => {
                    (t ? nc(e, n, t) : nc(e, n)).subscribe(r);
                  });
                })(Yo),
              ),
            ),
          ).pipe(
            Ly((t, n) => {
              let r = !1;
              return n.reduce(
                (o, i, s) =>
                  o !== Yo
                    ? o
                    : (i === Yo && (r = !0),
                      r || (!1 !== i && s !== n.length - 1 && !Wn(i)) ? o : i),
                t,
              );
            }, Yo),
            qn((t) => t !== Yo),
            Y((t) => (Wn(t) ? t : !0 === t)),
            ci(1),
          ),
        );
      }
      class $A {
        constructor() {
          (this.outlet = null),
            (this.route = null),
            (this.resolver = null),
            (this.children = new ei()),
            (this.attachRef = null);
        }
      }
      class ei {
        constructor() {
          this.contexts = new Map();
        }
        onChildOutletCreated(t, n) {
          const r = this.getOrCreateContext(t);
          (r.outlet = n), this.contexts.set(t, r);
        }
        onChildOutletDestroyed(t) {
          const n = this.getContext(t);
          n && ((n.outlet = null), (n.attachRef = null));
        }
        onOutletDeactivated() {
          const t = this.contexts;
          return (this.contexts = new Map()), t;
        }
        onOutletReAttached(t) {
          this.contexts = t;
        }
        getOrCreateContext(t) {
          let n = this.getContext(t);
          return n || ((n = new $A()), this.contexts.set(t, n)), n;
        }
        getContext(t) {
          return this.contexts.get(t) || null;
        }
      }
      let qt = (() => {
        class e {
          constructor(n, r, o, i, s) {
            (this.parentContexts = n),
              (this.location = r),
              (this.resolver = o),
              (this.changeDetector = s),
              (this.activated = null),
              (this._activatedRoute = null),
              (this.activateEvents = new $e()),
              (this.deactivateEvents = new $e()),
              (this.attachEvents = new $e()),
              (this.detachEvents = new $e()),
              (this.name = i || z),
              n.onChildOutletCreated(this.name, this);
          }
          ngOnDestroy() {
            this.parentContexts.onChildOutletDestroyed(this.name);
          }
          ngOnInit() {
            if (!this.activated) {
              const n = this.parentContexts.getContext(this.name);
              n &&
                n.route &&
                (n.attachRef
                  ? this.attach(n.attachRef, n.route)
                  : this.activateWith(n.route, n.resolver || null));
            }
          }
          get isActivated() {
            return !!this.activated;
          }
          get component() {
            if (!this.activated) throw new Error("Outlet is not activated");
            return this.activated.instance;
          }
          get activatedRoute() {
            if (!this.activated) throw new Error("Outlet is not activated");
            return this._activatedRoute;
          }
          get activatedRouteData() {
            return this._activatedRoute
              ? this._activatedRoute.snapshot.data
              : {};
          }
          detach() {
            if (!this.activated) throw new Error("Outlet is not activated");
            this.location.detach();
            const n = this.activated;
            return (
              (this.activated = null),
              (this._activatedRoute = null),
              this.detachEvents.emit(n.instance),
              n
            );
          }
          attach(n, r) {
            (this.activated = n),
              (this._activatedRoute = r),
              this.location.insert(n.hostView),
              this.attachEvents.emit(n.instance);
          }
          deactivate() {
            if (this.activated) {
              const n = this.component;
              this.activated.destroy(),
                (this.activated = null),
                (this._activatedRoute = null),
                this.deactivateEvents.emit(n);
            }
          }
          activateWith(n, r) {
            if (this.isActivated)
              throw new Error("Cannot activate an already activated outlet");
            this._activatedRoute = n;
            const s = (r = r || this.resolver).resolveComponentFactory(
                n._futureSnapshot.routeConfig.component,
              ),
              a = this.parentContexts.getOrCreateContext(this.name).children,
              l = new qA(n, a, this.location.injector);
            (this.activated = this.location.createComponent(
              s,
              this.location.length,
              l,
            )),
              this.changeDetector.markForCheck(),
              this.activateEvents.emit(this.activated.instance);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(T(ei), T(Mt), T(kr), co("name"), T(Au));
          }),
          (e.ɵdir = xe({
            type: e,
            selectors: [["router-outlet"]],
            outputs: {
              activateEvents: "activate",
              deactivateEvents: "deactivate",
              attachEvents: "attach",
              detachEvents: "detach",
            },
            exportAs: ["outlet"],
          })),
          e
        );
      })();
      class qA {
        constructor(t, n, r) {
          (this.route = t), (this.childContexts = n), (this.parent = r);
        }
        get(t, n) {
          return t === Qr
            ? this.route
            : t === ei
            ? this.childContexts
            : this.parent.get(t, n);
        }
      }
      let gv = (() => {
        class e {}
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵcmp = Ae({
            type: e,
            selectors: [["ng-component"]],
            decls: 1,
            vars: 0,
            template: function (n, r) {
              1 & n && C(0, "router-outlet");
            },
            directives: [qt],
            encapsulation: 2,
          })),
          e
        );
      })();
      function mv(e, t = "") {
        for (let n = 0; n < e.length; n++) {
          const r = e[n];
          zA(r, GA(t, r));
        }
      }
      function zA(e, t) {
        e.children && mv(e.children, t);
      }
      function GA(e, t) {
        return t
          ? e || t.path
            ? e && !t.path
              ? `${e}/`
              : !e && t.path
              ? t.path
              : `${e}/${t.path}`
            : ""
          : e;
      }
      function mc(e) {
        const t = e.children && e.children.map(mc),
          n = t
            ? Object.assign(Object.assign({}, e), { children: t })
            : Object.assign({}, e);
        return (
          !n.component &&
            (t || n.loadChildren) &&
            n.outlet &&
            n.outlet !== z &&
            (n.component = gv),
          n
        );
      }
      function gt(e) {
        return e.outlet || z;
      }
      function yv(e, t) {
        const n = e.filter((r) => gt(r) === t);
        return n.push(...e.filter((r) => gt(r) !== t)), n;
      }
      const vv = {
        matched: !1,
        consumedSegments: [],
        lastChild: 0,
        parameters: {},
        positionalParamSegments: {},
      };
      function Vs(e, t, n) {
        var r;
        if ("" === t.path)
          return "full" === t.pathMatch && (e.hasChildren() || n.length > 0)
            ? Object.assign({}, vv)
            : {
                matched: !0,
                consumedSegments: [],
                lastChild: 0,
                parameters: {},
                positionalParamSegments: {},
              };
        const i = (t.matcher || iA)(n, e, t);
        if (!i) return Object.assign({}, vv);
        const s = {};
        Pe(i.posParams, (l, u) => {
          s[u] = l.path;
        });
        const a =
          i.consumed.length > 0
            ? Object.assign(
                Object.assign({}, s),
                i.consumed[i.consumed.length - 1].parameters,
              )
            : s;
        return {
          matched: !0,
          consumedSegments: i.consumed,
          lastChild: i.consumed.length,
          parameters: a,
          positionalParamSegments:
            null !== (r = i.posParams) && void 0 !== r ? r : {},
        };
      }
      function Us(e, t, n, r, o = "corrected") {
        if (
          n.length > 0 &&
          (function (e, t, n) {
            return n.some((r) => $s(e, t, r) && gt(r) !== z);
          })(e, n, r)
        ) {
          const s = new Q(
            t,
            (function (e, t, n, r) {
              const o = {};
              (o[z] = r),
                (r._sourceSegment = e),
                (r._segmentIndexShift = t.length);
              for (const i of n)
                if ("" === i.path && gt(i) !== z) {
                  const s = new Q([], {});
                  (s._sourceSegment = e),
                    (s._segmentIndexShift = t.length),
                    (o[gt(i)] = s);
                }
              return o;
            })(e, t, r, new Q(n, e.children)),
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = t.length),
            { segmentGroup: s, slicedSegments: [] }
          );
        }
        if (
          0 === n.length &&
          (function (e, t, n) {
            return n.some((r) => $s(e, t, r));
          })(e, n, r)
        ) {
          const s = new Q(
            e.segments,
            (function (e, t, n, r, o, i) {
              const s = {};
              for (const a of r)
                if ($s(e, n, a) && !o[gt(a)]) {
                  const l = new Q([], {});
                  (l._sourceSegment = e),
                    (l._segmentIndexShift =
                      "legacy" === i ? e.segments.length : t.length),
                    (s[gt(a)] = l);
                }
              return Object.assign(Object.assign({}, o), s);
            })(e, t, n, r, e.children, o),
          );
          return (
            (s._sourceSegment = e),
            (s._segmentIndexShift = t.length),
            { segmentGroup: s, slicedSegments: n }
          );
        }
        const i = new Q(e.segments, e.children);
        return (
          (i._sourceSegment = e),
          (i._segmentIndexShift = t.length),
          { segmentGroup: i, slicedSegments: n }
        );
      }
      function $s(e, t, n) {
        return (
          (!(e.hasChildren() || t.length > 0) || "full" !== n.pathMatch) &&
          "" === n.path
        );
      }
      function Dv(e, t, n, r) {
        return (
          !!(gt(e) === r || (r !== z && $s(t, n, e))) &&
          ("**" === e.path || Vs(t, e, n).matched)
        );
      }
      function Cv(e, t, n) {
        return 0 === t.length && !e.children[n];
      }
      class ti {
        constructor(t) {
          this.segmentGroup = t || null;
        }
      }
      class _v {
        constructor(t) {
          this.urlTree = t;
        }
      }
      function qs(e) {
        return new ae((t) => t.error(new ti(e)));
      }
      function wv(e) {
        return new ae((t) => t.error(new _v(e)));
      }
      function ZA(e) {
        return new ae((t) =>
          t.error(
            new Error(
              `Only absolute redirects can have named outlets. redirectTo: '${e}'`,
            ),
          ),
        );
      }
      class eP {
        constructor(t, n, r, o, i) {
          (this.configLoader = n),
            (this.urlSerializer = r),
            (this.urlTree = o),
            (this.config = i),
            (this.allowRedirects = !0),
            (this.ngModule = t.get(rn));
        }
        apply() {
          const t = Us(this.urlTree.root, [], [], this.config).segmentGroup,
            n = new Q(t.segments, t.children);
          return this.expandSegmentGroup(this.ngModule, this.config, n, z)
            .pipe(
              Y((i) =>
                this.createUrlTree(
                  yc(i),
                  this.urlTree.queryParams,
                  this.urlTree.fragment,
                ),
              ),
            )
            .pipe(
              Mn((i) => {
                if (i instanceof _v)
                  return (this.allowRedirects = !1), this.match(i.urlTree);
                throw i instanceof ti ? this.noMatchError(i) : i;
              }),
            );
        }
        match(t) {
          return this.expandSegmentGroup(this.ngModule, this.config, t.root, z)
            .pipe(
              Y((o) => this.createUrlTree(yc(o), t.queryParams, t.fragment)),
            )
            .pipe(
              Mn((o) => {
                throw o instanceof ti ? this.noMatchError(o) : o;
              }),
            );
        }
        noMatchError(t) {
          return new Error(
            `Cannot match any routes. URL Segment: '${t.segmentGroup}'`,
          );
        }
        createUrlTree(t, n, r) {
          const o = t.segments.length > 0 ? new Q([], { [z]: t }) : t;
          return new zn(o, n, r);
        }
        expandSegmentGroup(t, n, r, o) {
          return 0 === r.segments.length && r.hasChildren()
            ? this.expandChildren(t, n, r).pipe(Y((i) => new Q([], i)))
            : this.expandSegment(t, r, n, r.segments, o, !0);
        }
        expandChildren(t, n, r) {
          const o = [];
          for (const i of Object.keys(r.children))
            "primary" === i ? o.unshift(i) : o.push(i);
          return Te(o).pipe(
            qr((i) => {
              const s = r.children[i],
                a = yv(n, i);
              return this.expandSegmentGroup(t, a, s, i).pipe(
                Y((l) => ({ segment: l, outlet: i })),
              );
            }),
            Ly((i, s) => ((i[s.outlet] = s.segment), i), {}),
            (function (e, t) {
              const n = arguments.length >= 2;
              return (r) =>
                r.pipe(
                  e ? qn((o, i) => e(o, i, r)) : Pn,
                  rc(1),
                  n ? By(t) : jy(() => new Os()),
                );
            })(),
          );
        }
        expandSegment(t, n, r, o, i, s) {
          return Te(r).pipe(
            qr((a) =>
              this.expandSegmentAgainstRoute(t, n, r, a, o, i, s).pipe(
                Mn((u) => {
                  if (u instanceof ti) return B(null);
                  throw u;
                }),
              ),
            ),
            zr((a) => !!a),
            Mn((a, l) => {
              if (a instanceof Os || "EmptyError" === a.name) {
                if (Cv(n, o, i)) return B(new Q([], {}));
                throw new ti(n);
              }
              throw a;
            }),
          );
        }
        expandSegmentAgainstRoute(t, n, r, o, i, s, a) {
          return Dv(o, n, i, s)
            ? void 0 === o.redirectTo
              ? this.matchSegmentAgainstRoute(t, n, o, i, s)
              : a && this.allowRedirects
              ? this.expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s)
              : qs(n)
            : qs(n);
        }
        expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          return "**" === o.path
            ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, o, s)
            : this.expandRegularSegmentAgainstRouteUsingRedirect(
                t,
                n,
                r,
                o,
                i,
                s,
              );
        }
        expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, o) {
          const i = this.applyRedirectCommands([], r.redirectTo, {});
          return r.redirectTo.startsWith("/")
            ? wv(i)
            : this.lineralizeSegments(r, i).pipe(
                Ee((s) => {
                  const a = new Q(s, {});
                  return this.expandSegment(t, a, n, s, o, !1);
                }),
              );
        }
        expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
          const {
            matched: a,
            consumedSegments: l,
            lastChild: u,
            positionalParamSegments: c,
          } = Vs(n, o, i);
          if (!a) return qs(n);
          const d = this.applyRedirectCommands(l, o.redirectTo, c);
          return o.redirectTo.startsWith("/")
            ? wv(d)
            : this.lineralizeSegments(o, d).pipe(
                Ee((f) =>
                  this.expandSegment(t, n, r, f.concat(i.slice(u)), s, !1),
                ),
              );
        }
        matchSegmentAgainstRoute(t, n, r, o, i) {
          if ("**" === r.path)
            return r.loadChildren
              ? (r._loadedConfig
                  ? B(r._loadedConfig)
                  : this.configLoader.load(t.injector, r)
                ).pipe(Y((f) => ((r._loadedConfig = f), new Q(o, {}))))
              : B(new Q(o, {}));
          const { matched: s, consumedSegments: a, lastChild: l } = Vs(n, r, o);
          if (!s) return qs(n);
          const u = o.slice(l);
          return this.getChildConfig(t, r, o).pipe(
            Ee((d) => {
              const f = d.module,
                h = d.routes,
                { segmentGroup: m, slicedSegments: D } = Us(n, a, u, h),
                _ = new Q(m.segments, m.children);
              if (0 === D.length && _.hasChildren())
                return this.expandChildren(f, h, _).pipe(Y((O) => new Q(a, O)));
              if (0 === h.length && 0 === D.length) return B(new Q(a, {}));
              const w = gt(r) === i;
              return this.expandSegment(f, _, h, D, w ? z : i, !0).pipe(
                Y((I) => new Q(a.concat(I.segments), I.children)),
              );
            }),
          );
        }
        getChildConfig(t, n, r) {
          return n.children
            ? B(new gc(n.children, t))
            : n.loadChildren
            ? void 0 !== n._loadedConfig
              ? B(n._loadedConfig)
              : this.runCanLoadGuards(t.injector, n, r).pipe(
                  Ee((o) => {
                    return o
                      ? this.configLoader
                          .load(t.injector, n)
                          .pipe(Y((i) => ((n._loadedConfig = i), i)))
                      : ((e = n),
                        new ae((t) =>
                          t.error(
                            ic(
                              `Cannot load children because the guard of the route "path: '${e.path}'" returned false`,
                            ),
                          ),
                        ));
                    var e;
                  }),
                )
            : B(new gc([], t));
        }
        runCanLoadGuards(t, n, r) {
          const o = n.canLoad;
          return o && 0 !== o.length
            ? B(
                o.map((s) => {
                  const a = t.get(s);
                  let l;
                  if ((e = a) && Sn(e.canLoad)) l = a.canLoad(n, r);
                  else {
                    if (!Sn(a)) throw new Error("Invalid CanLoad guard");
                    l = a(n, r);
                  }
                  var e;
                  return $t(l);
                }),
              ).pipe(
                Xo(),
                rt((s) => {
                  if (!Wn(s)) return;
                  const a = ic(
                    `Redirecting to "${this.urlSerializer.serialize(s)}"`,
                  );
                  throw ((a.url = s), a);
                }),
                Y((s) => !0 === s),
              )
            : B(!0);
        }
        lineralizeSegments(t, n) {
          let r = [],
            o = n.root;
          for (;;) {
            if (((r = r.concat(o.segments)), 0 === o.numberOfChildren))
              return B(r);
            if (o.numberOfChildren > 1 || !o.children[z])
              return ZA(t.redirectTo);
            o = o.children[z];
          }
        }
        applyRedirectCommands(t, n, r) {
          return this.applyRedirectCreatreUrlTree(
            n,
            this.urlSerializer.parse(n),
            t,
            r,
          );
        }
        applyRedirectCreatreUrlTree(t, n, r, o) {
          const i = this.createSegmentGroup(t, n.root, r, o);
          return new zn(
            i,
            this.createQueryParams(n.queryParams, this.urlTree.queryParams),
            n.fragment,
          );
        }
        createQueryParams(t, n) {
          const r = {};
          return (
            Pe(t, (o, i) => {
              if ("string" == typeof o && o.startsWith(":")) {
                const a = o.substring(1);
                r[i] = n[a];
              } else r[i] = o;
            }),
            r
          );
        }
        createSegmentGroup(t, n, r, o) {
          const i = this.createSegments(t, n.segments, r, o);
          let s = {};
          return (
            Pe(n.children, (a, l) => {
              s[l] = this.createSegmentGroup(t, a, r, o);
            }),
            new Q(i, s)
          );
        }
        createSegments(t, n, r, o) {
          return n.map((i) =>
            i.path.startsWith(":")
              ? this.findPosParam(t, i, o)
              : this.findOrReturn(i, r),
          );
        }
        findPosParam(t, n, r) {
          const o = r[n.path.substring(1)];
          if (!o)
            throw new Error(
              `Cannot redirect to '${t}'. Cannot find '${n.path}'.`,
            );
          return o;
        }
        findOrReturn(t, n) {
          let r = 0;
          for (const o of n) {
            if (o.path === t.path) return n.splice(r), o;
            r++;
          }
          return t;
        }
      }
      function yc(e) {
        const t = {};
        for (const r of Object.keys(e.children)) {
          const i = yc(e.children[r]);
          (i.segments.length > 0 || i.hasChildren()) && (t[r] = i);
        }
        return (function (e) {
          if (1 === e.numberOfChildren && e.children[z]) {
            const t = e.children[z];
            return new Q(e.segments.concat(t.segments), t.children);
          }
          return e;
        })(new Q(e.segments, t));
      }
      class bv {
        constructor(t) {
          (this.path = t), (this.route = this.path[this.path.length - 1]);
        }
      }
      class zs {
        constructor(t, n) {
          (this.component = t), (this.route = n);
        }
      }
      function rP(e, t, n) {
        const r = e._root;
        return ni(r, t ? t._root : null, n, [r.value]);
      }
      function Gs(e, t, n) {
        const r = (function (e) {
          if (!e) return null;
          for (let t = e.parent; t; t = t.parent) {
            const n = t.routeConfig;
            if (n && n._loadedConfig) return n._loadedConfig;
          }
          return null;
        })(t);
        return (r ? r.module.injector : n).get(e);
      }
      function ni(
        e,
        t,
        n,
        r,
        o = { canDeactivateChecks: [], canActivateChecks: [] },
      ) {
        const i = Wr(t);
        return (
          e.children.forEach((s) => {
            (function (
              e,
              t,
              n,
              r,
              o = { canDeactivateChecks: [], canActivateChecks: [] },
            ) {
              const i = e.value,
                s = t ? t.value : null,
                a = n ? n.getContext(e.value.outlet) : null;
              if (s && i.routeConfig === s.routeConfig) {
                const l = (function (e, t, n) {
                  if ("function" == typeof n) return n(e, t);
                  switch (n) {
                    case "pathParamsChange":
                      return !Gn(e.url, t.url);
                    case "pathParamsOrQueryParamsChange":
                      return (
                        !Gn(e.url, t.url) || !Ut(e.queryParams, t.queryParams)
                      );
                    case "always":
                      return !0;
                    case "paramsOrQueryParamsChange":
                      return !dc(e, t) || !Ut(e.queryParams, t.queryParams);
                    default:
                      return !dc(e, t);
                  }
                })(s, i, i.routeConfig.runGuardsAndResolvers);
                l
                  ? o.canActivateChecks.push(new bv(r))
                  : ((i.data = s.data), (i._resolvedData = s._resolvedData)),
                  ni(e, t, i.component ? (a ? a.children : null) : n, r, o),
                  l &&
                    a &&
                    a.outlet &&
                    a.outlet.isActivated &&
                    o.canDeactivateChecks.push(new zs(a.outlet.component, s));
              } else
                s && ri(t, a, o),
                  o.canActivateChecks.push(new bv(r)),
                  ni(e, null, i.component ? (a ? a.children : null) : n, r, o);
            })(s, i[s.value.outlet], n, r.concat([s.value]), o),
              delete i[s.value.outlet];
          }),
          Pe(i, (s, a) => ri(s, n.getContext(a), o)),
          o
        );
      }
      function ri(e, t, n) {
        const r = Wr(e),
          o = e.value;
        Pe(r, (i, s) => {
          ri(i, o.component ? (t ? t.children.getContext(s) : null) : t, n);
        }),
          n.canDeactivateChecks.push(
            new zs(
              o.component && t && t.outlet && t.outlet.isActivated
                ? t.outlet.component
                : null,
              o,
            ),
          );
      }
      class mP {}
      function Ev(e) {
        return new ae((t) => t.error(e));
      }
      class vP {
        constructor(t, n, r, o, i, s) {
          (this.rootComponentType = t),
            (this.config = n),
            (this.urlTree = r),
            (this.url = o),
            (this.paramsInheritanceStrategy = i),
            (this.relativeLinkResolution = s);
        }
        recognize() {
          const t = Us(
              this.urlTree.root,
              [],
              [],
              this.config.filter((s) => void 0 === s.redirectTo),
              this.relativeLinkResolution,
            ).segmentGroup,
            n = this.processSegmentGroup(this.config, t, z);
          if (null === n) return null;
          const r = new js(
              [],
              Object.freeze({}),
              Object.freeze(Object.assign({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              z,
              this.rootComponentType,
              null,
              this.urlTree.root,
              -1,
              {},
            ),
            o = new un(r, n),
            i = new lv(this.url, o);
          return this.inheritParamsAndData(i._root), i;
        }
        inheritParamsAndData(t) {
          const n = t.value,
            r = av(n, this.paramsInheritanceStrategy);
          (n.params = Object.freeze(r.params)),
            (n.data = Object.freeze(r.data)),
            t.children.forEach((o) => this.inheritParamsAndData(o));
        }
        processSegmentGroup(t, n, r) {
          return 0 === n.segments.length && n.hasChildren()
            ? this.processChildren(t, n)
            : this.processSegment(t, n, n.segments, r);
        }
        processChildren(t, n) {
          const r = [];
          for (const i of Object.keys(n.children)) {
            const s = n.children[i],
              a = yv(t, i),
              l = this.processSegmentGroup(a, s, i);
            if (null === l) return null;
            r.push(...l);
          }
          const o = Mv(r);
          return (
            o.sort((t, n) =>
              t.value.outlet === z
                ? -1
                : n.value.outlet === z
                ? 1
                : t.value.outlet.localeCompare(n.value.outlet),
            ),
            o
          );
        }
        processSegment(t, n, r, o) {
          for (const i of t) {
            const s = this.processSegmentAgainstRoute(i, n, r, o);
            if (null !== s) return s;
          }
          return Cv(n, r, o) ? [] : null;
        }
        processSegmentAgainstRoute(t, n, r, o) {
          if (t.redirectTo || !Dv(t, n, r, o)) return null;
          let i,
            s = [],
            a = [];
          if ("**" === t.path) {
            const h = r.length > 0 ? Wy(r).parameters : {};
            i = new js(
              r,
              h,
              Object.freeze(Object.assign({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              Tv(t),
              gt(t),
              t.component,
              t,
              Sv(n),
              Iv(n) + r.length,
              Av(t),
            );
          } else {
            const h = Vs(n, t, r);
            if (!h.matched) return null;
            (s = h.consumedSegments),
              (a = r.slice(h.lastChild)),
              (i = new js(
                s,
                h.parameters,
                Object.freeze(Object.assign({}, this.urlTree.queryParams)),
                this.urlTree.fragment,
                Tv(t),
                gt(t),
                t.component,
                t,
                Sv(n),
                Iv(n) + s.length,
                Av(t),
              ));
          }
          const l = (e = t).children
              ? e.children
              : e.loadChildren
              ? e._loadedConfig.routes
              : [],
            { segmentGroup: u, slicedSegments: c } = Us(
              n,
              s,
              a,
              l.filter((h) => void 0 === h.redirectTo),
              this.relativeLinkResolution,
            );
          var e;
          if (0 === c.length && u.hasChildren()) {
            const h = this.processChildren(l, u);
            return null === h ? null : [new un(i, h)];
          }
          if (0 === l.length && 0 === c.length) return [new un(i, [])];
          const d = gt(t) === o,
            f = this.processSegment(l, u, c, d ? z : o);
          return null === f ? null : [new un(i, f)];
        }
      }
      function _P(e) {
        const t = e.value.routeConfig;
        return t && "" === t.path && void 0 === t.redirectTo;
      }
      function Mv(e) {
        const t = [],
          n = new Set();
        for (const r of e) {
          if (!_P(r)) {
            t.push(r);
            continue;
          }
          const o = t.find((i) => r.value.routeConfig === i.value.routeConfig);
          void 0 !== o ? (o.children.push(...r.children), n.add(o)) : t.push(r);
        }
        for (const r of n) {
          const o = Mv(r.children);
          t.push(new un(r.value, o));
        }
        return t.filter((r) => !n.has(r));
      }
      function Sv(e) {
        let t = e;
        for (; t._sourceSegment; ) t = t._sourceSegment;
        return t;
      }
      function Iv(e) {
        let t = e,
          n = t._segmentIndexShift ? t._segmentIndexShift : 0;
        for (; t._sourceSegment; )
          (t = t._sourceSegment),
            (n += t._segmentIndexShift ? t._segmentIndexShift : 0);
        return n - 1;
      }
      function Tv(e) {
        return e.data || {};
      }
      function Av(e) {
        return e.resolve || {};
      }
      function vc(e) {
        return $n((t) => {
          const n = e(t);
          return n ? Te(n).pipe(Y(() => t)) : B(t);
        });
      }
      class AP extends class {
        shouldDetach(t) {
          return !1;
        }
        store(t, n) {}
        shouldAttach(t) {
          return !1;
        }
        retrieve(t) {
          return null;
        }
        shouldReuseRoute(t, n) {
          return t.routeConfig === n.routeConfig;
        }
      } {}
      const Dc = new W("ROUTES");
      class Pv {
        constructor(t, n, r, o) {
          (this.injector = t),
            (this.compiler = n),
            (this.onLoadStartListener = r),
            (this.onLoadEndListener = o);
        }
        load(t, n) {
          if (n._loader$) return n._loader$;
          this.onLoadStartListener && this.onLoadStartListener(n);
          const o = this.loadModuleFactory(n.loadChildren).pipe(
            Y((i) => {
              this.onLoadEndListener && this.onLoadEndListener(n);
              const s = i.create(t);
              return new gc(
                Gy(s.injector.get(Dc, void 0, j.Self | j.Optional)).map(mc),
                s,
              );
            }),
            Mn((i) => {
              throw ((n._loader$ = void 0), i);
            }),
          );
          return (
            (n._loader$ = new V1(o, () => new Gt()).pipe(ky())), n._loader$
          );
        }
        loadModuleFactory(t) {
          return $t(t()).pipe(
            Ee((n) =>
              n instanceof Gg ? B(n) : Te(this.compiler.compileModuleAsync(n)),
            ),
          );
        }
      }
      class xP {
        shouldProcessUrl(t) {
          return !0;
        }
        extract(t) {
          return t;
        }
        merge(t, n) {
          return t;
        }
      }
      function OP(e) {
        throw e;
      }
      function RP(e, t, n) {
        return t.parse("/");
      }
      function xv(e, t) {
        return B(null);
      }
      const NP = {
          paths: "exact",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "exact",
        },
        FP = {
          paths: "subset",
          fragment: "ignored",
          matrixParams: "ignored",
          queryParams: "subset",
        };
      let ot = (() => {
        class e {
          constructor(n, r, o, i, s, a, l) {
            (this.rootComponentType = n),
              (this.urlSerializer = r),
              (this.rootContexts = o),
              (this.location = i),
              (this.config = l),
              (this.lastSuccessfulNavigation = null),
              (this.currentNavigation = null),
              (this.disposed = !1),
              (this.navigationId = 0),
              (this.currentPageId = 0),
              (this.isNgZoneEnabled = !1),
              (this.events = new Gt()),
              (this.errorHandler = OP),
              (this.malformedUriErrorHandler = RP),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1),
              (this.hooks = {
                beforePreactivation: xv,
                afterPreactivation: xv,
              }),
              (this.urlHandlingStrategy = new xP()),
              (this.routeReuseStrategy = new AP()),
              (this.onSameUrlNavigation = "ignore"),
              (this.paramsInheritanceStrategy = "emptyOnly"),
              (this.urlUpdateStrategy = "deferred"),
              (this.relativeLinkResolution = "corrected"),
              (this.canceledNavigationResolution = "replace"),
              (this.ngModule = s.get(rn)),
              (this.console = s.get(Tm));
            const d = s.get(we);
            (this.isNgZoneEnabled = d instanceof we && we.isInAngularZone()),
              this.resetConfig(l),
              (this.currentUrlTree = new zn(new Q([], {}), {}, null)),
              (this.rawUrlTree = this.currentUrlTree),
              (this.browserUrlTree = this.currentUrlTree),
              (this.configLoader = new Pv(
                s,
                a,
                (f) => this.triggerEvent(new Vy(f)),
                (f) => this.triggerEvent(new Uy(f)),
              )),
              (this.routerState = sv(
                this.currentUrlTree,
                this.rootComponentType,
              )),
              (this.transitions = new At({
                id: 0,
                targetPageId: 0,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.currentUrlTree,
                extractedUrl: this.urlHandlingStrategy.extract(
                  this.currentUrlTree,
                ),
                urlAfterRedirects: this.urlHandlingStrategy.extract(
                  this.currentUrlTree,
                ),
                rawUrl: this.currentUrlTree,
                extras: {},
                resolve: null,
                reject: null,
                promise: Promise.resolve(!0),
                source: "imperative",
                restoredState: null,
                currentSnapshot: this.routerState.snapshot,
                targetSnapshot: null,
                currentRouterState: this.routerState,
                targetRouterState: null,
                guards: { canActivateChecks: [], canDeactivateChecks: [] },
                guardsResult: null,
              })),
              (this.navigations = this.setupNavigations(this.transitions)),
              this.processNavigations();
          }
          get browserPageId() {
            var n;
            return null === (n = this.location.getState()) || void 0 === n
              ? void 0
              : n.ɵrouterPageId;
          }
          setupNavigations(n) {
            const r = this.events;
            return n.pipe(
              qn((o) => 0 !== o.id),
              Y((o) =>
                Object.assign(Object.assign({}, o), {
                  extractedUrl: this.urlHandlingStrategy.extract(o.rawUrl),
                }),
              ),
              $n((o) => {
                let i = !1,
                  s = !1;
                return B(o).pipe(
                  rt((a) => {
                    this.currentNavigation = {
                      id: a.id,
                      initialUrl: a.currentRawUrl,
                      extractedUrl: a.extractedUrl,
                      trigger: a.source,
                      extras: a.extras,
                      previousNavigation: this.lastSuccessfulNavigation
                        ? Object.assign(
                            Object.assign({}, this.lastSuccessfulNavigation),
                            { previousNavigation: null },
                          )
                        : null,
                    };
                  }),
                  $n((a) => {
                    const l = this.browserUrlTree.toString(),
                      u =
                        !this.navigated ||
                        a.extractedUrl.toString() !== l ||
                        l !== this.currentUrlTree.toString();
                    if (
                      ("reload" === this.onSameUrlNavigation || u) &&
                      this.urlHandlingStrategy.shouldProcessUrl(a.rawUrl)
                    )
                      return (
                        Ws(a.source) && (this.browserUrlTree = a.extractedUrl),
                        B(a).pipe(
                          $n((d) => {
                            const f = this.transitions.getValue();
                            return (
                              r.next(
                                new oc(
                                  d.id,
                                  this.serializeUrl(d.extractedUrl),
                                  d.source,
                                  d.restoredState,
                                ),
                              ),
                              f !== this.transitions.getValue()
                                ? Kt
                                : Promise.resolve(d)
                            );
                          }),
                          (function (e, t, n, r) {
                            return $n((o) =>
                              (function (e, t, n, r, o) {
                                return new eP(e, t, n, r, o).apply();
                              })(e, t, n, o.extractedUrl, r).pipe(
                                Y((i) =>
                                  Object.assign(Object.assign({}, o), {
                                    urlAfterRedirects: i,
                                  }),
                                ),
                              ),
                            );
                          })(
                            this.ngModule.injector,
                            this.configLoader,
                            this.urlSerializer,
                            this.config,
                          ),
                          rt((d) => {
                            this.currentNavigation = Object.assign(
                              Object.assign({}, this.currentNavigation),
                              { finalUrl: d.urlAfterRedirects },
                            );
                          }),
                          (function (e, t, n, r, o) {
                            return Ee((i) =>
                              (function (
                                e,
                                t,
                                n,
                                r,
                                o = "emptyOnly",
                                i = "legacy",
                              ) {
                                try {
                                  const s = new vP(
                                    e,
                                    t,
                                    n,
                                    r,
                                    o,
                                    i,
                                  ).recognize();
                                  return null === s ? Ev(new mP()) : B(s);
                                } catch (s) {
                                  return Ev(s);
                                }
                              })(
                                e,
                                t,
                                i.urlAfterRedirects,
                                n(i.urlAfterRedirects),
                                r,
                                o,
                              ).pipe(
                                Y((s) =>
                                  Object.assign(Object.assign({}, i), {
                                    targetSnapshot: s,
                                  }),
                                ),
                              ),
                            );
                          })(
                            this.rootComponentType,
                            this.config,
                            (d) => this.serializeUrl(d),
                            this.paramsInheritanceStrategy,
                            this.relativeLinkResolution,
                          ),
                          rt((d) => {
                            if ("eager" === this.urlUpdateStrategy) {
                              if (!d.extras.skipLocationChange) {
                                const h = this.urlHandlingStrategy.merge(
                                  d.urlAfterRedirects,
                                  d.rawUrl,
                                );
                                this.setBrowserUrl(h, d);
                              }
                              this.browserUrlTree = d.urlAfterRedirects;
                            }
                            const f = new Q1(
                              d.id,
                              this.serializeUrl(d.extractedUrl),
                              this.serializeUrl(d.urlAfterRedirects),
                              d.targetSnapshot,
                            );
                            r.next(f);
                          }),
                        )
                      );
                    if (
                      u &&
                      this.rawUrlTree &&
                      this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)
                    ) {
                      const {
                          id: f,
                          extractedUrl: h,
                          source: m,
                          restoredState: D,
                          extras: _,
                        } = a,
                        w = new oc(f, this.serializeUrl(h), m, D);
                      r.next(w);
                      const y = sv(h, this.rootComponentType).snapshot;
                      return B(
                        Object.assign(Object.assign({}, a), {
                          targetSnapshot: y,
                          urlAfterRedirects: h,
                          extras: Object.assign(Object.assign({}, _), {
                            skipLocationChange: !1,
                            replaceUrl: !1,
                          }),
                        }),
                      );
                    }
                    return (this.rawUrlTree = a.rawUrl), a.resolve(null), Kt;
                  }),
                  vc((a) => {
                    const {
                      targetSnapshot: l,
                      id: u,
                      extractedUrl: c,
                      rawUrl: d,
                      extras: { skipLocationChange: f, replaceUrl: h },
                    } = a;
                    return this.hooks.beforePreactivation(l, {
                      navigationId: u,
                      appliedUrlTree: c,
                      rawUrlTree: d,
                      skipLocationChange: !!f,
                      replaceUrl: !!h,
                    });
                  }),
                  rt((a) => {
                    const l = new K1(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot,
                    );
                    this.triggerEvent(l);
                  }),
                  Y((a) =>
                    Object.assign(Object.assign({}, a), {
                      guards: rP(
                        a.targetSnapshot,
                        a.currentSnapshot,
                        this.rootContexts,
                      ),
                    }),
                  ),
                  (function (e, t) {
                    return Ee((n) => {
                      const {
                        targetSnapshot: r,
                        currentSnapshot: o,
                        guards: {
                          canActivateChecks: i,
                          canDeactivateChecks: s,
                        },
                      } = n;
                      return 0 === s.length && 0 === i.length
                        ? B(
                            Object.assign(Object.assign({}, n), {
                              guardsResult: !0,
                            }),
                          )
                        : (function (e, t, n, r) {
                            return Te(e).pipe(
                              Ee((o) =>
                                (function (e, t, n, r, o) {
                                  const i =
                                    t && t.routeConfig
                                      ? t.routeConfig.canDeactivate
                                      : null;
                                  return i && 0 !== i.length
                                    ? B(
                                        i.map((a) => {
                                          const l = Gs(a, t, o);
                                          let u;
                                          if (
                                            (function (e) {
                                              return e && Sn(e.canDeactivate);
                                            })(l)
                                          )
                                            u = $t(l.canDeactivate(e, t, n, r));
                                          else {
                                            if (!Sn(l))
                                              throw new Error(
                                                "Invalid CanDeactivate guard",
                                              );
                                            u = $t(l(e, t, n, r));
                                          }
                                          return u.pipe(zr());
                                        }),
                                      ).pipe(Xo())
                                    : B(!0);
                                })(o.component, o.route, n, t, r),
                              ),
                              zr((o) => !0 !== o, !0),
                            );
                          })(s, r, o, e).pipe(
                            Ee((a) =>
                              a &&
                              (function (e) {
                                return "boolean" == typeof e;
                              })(a)
                                ? (function (e, t, n, r) {
                                    return Te(t).pipe(
                                      qr((o) =>
                                        nc(
                                          (function (e, t) {
                                            return (
                                              null !== e && t && t(new X1(e)),
                                              B(!0)
                                            );
                                          })(o.route.parent, r),
                                          (function (e, t) {
                                            return (
                                              null !== e && t && t(new tA(e)),
                                              B(!0)
                                            );
                                          })(o.route, r),
                                          (function (e, t, n) {
                                            const r = t[t.length - 1],
                                              i = t
                                                .slice(0, t.length - 1)
                                                .reverse()
                                                .map((s) =>
                                                  (function (e) {
                                                    const t = e.routeConfig
                                                      ? e.routeConfig
                                                          .canActivateChild
                                                      : null;
                                                    return t && 0 !== t.length
                                                      ? { node: e, guards: t }
                                                      : null;
                                                  })(s),
                                                )
                                                .filter((s) => null !== s)
                                                .map((s) =>
                                                  Fy(() =>
                                                    B(
                                                      s.guards.map((l) => {
                                                        const u = Gs(
                                                          l,
                                                          s.node,
                                                          n,
                                                        );
                                                        let c;
                                                        if (
                                                          (function (e) {
                                                            return (
                                                              e &&
                                                              Sn(
                                                                e.canActivateChild,
                                                              )
                                                            );
                                                          })(u)
                                                        )
                                                          c = $t(
                                                            u.canActivateChild(
                                                              r,
                                                              e,
                                                            ),
                                                          );
                                                        else {
                                                          if (!Sn(u))
                                                            throw new Error(
                                                              "Invalid CanActivateChild guard",
                                                            );
                                                          c = $t(u(r, e));
                                                        }
                                                        return c.pipe(zr());
                                                      }),
                                                    ).pipe(Xo()),
                                                  ),
                                                );
                                            return B(i).pipe(Xo());
                                          })(e, o.path, n),
                                          (function (e, t, n) {
                                            const r = t.routeConfig
                                              ? t.routeConfig.canActivate
                                              : null;
                                            if (!r || 0 === r.length)
                                              return B(!0);
                                            const o = r.map((i) =>
                                              Fy(() => {
                                                const s = Gs(i, t, n);
                                                let a;
                                                if (
                                                  (function (e) {
                                                    return (
                                                      e && Sn(e.canActivate)
                                                    );
                                                  })(s)
                                                )
                                                  a = $t(s.canActivate(t, e));
                                                else {
                                                  if (!Sn(s))
                                                    throw new Error(
                                                      "Invalid CanActivate guard",
                                                    );
                                                  a = $t(s(t, e));
                                                }
                                                return a.pipe(zr());
                                              }),
                                            );
                                            return B(o).pipe(Xo());
                                          })(e, o.route, n),
                                        ),
                                      ),
                                      zr((o) => !0 !== o, !0),
                                    );
                                  })(r, i, e, t)
                                : B(a),
                            ),
                            Y((a) =>
                              Object.assign(Object.assign({}, n), {
                                guardsResult: a,
                              }),
                            ),
                          );
                    });
                  })(this.ngModule.injector, (a) => this.triggerEvent(a)),
                  rt((a) => {
                    if (Wn(a.guardsResult)) {
                      const u = ic(
                        `Redirecting to "${this.serializeUrl(a.guardsResult)}"`,
                      );
                      throw ((u.url = a.guardsResult), u);
                    }
                    const l = new J1(
                      a.id,
                      this.serializeUrl(a.extractedUrl),
                      this.serializeUrl(a.urlAfterRedirects),
                      a.targetSnapshot,
                      !!a.guardsResult,
                    );
                    this.triggerEvent(l);
                  }),
                  qn(
                    (a) =>
                      !!a.guardsResult ||
                      (this.restoreHistory(a),
                      this.cancelNavigationTransition(a, ""),
                      !1),
                  ),
                  vc((a) => {
                    if (a.guards.canActivateChecks.length)
                      return B(a).pipe(
                        rt((l) => {
                          const u = new Z1(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot,
                          );
                          this.triggerEvent(u);
                        }),
                        $n((l) => {
                          let u = !1;
                          return B(l).pipe(
                            (function (e, t) {
                              return Ee((n) => {
                                const {
                                  targetSnapshot: r,
                                  guards: { canActivateChecks: o },
                                } = n;
                                if (!o.length) return B(n);
                                let i = 0;
                                return Te(o).pipe(
                                  qr((s) =>
                                    (function (e, t, n, r) {
                                      return (function (e, t, n, r) {
                                        const o = Object.keys(e);
                                        if (0 === o.length) return B({});
                                        const i = {};
                                        return Te(o).pipe(
                                          Ee((s) =>
                                            (function (e, t, n, r) {
                                              const o = Gs(e, t, r);
                                              return $t(
                                                o.resolve
                                                  ? o.resolve(t, n)
                                                  : o(t, n),
                                              );
                                            })(e[s], t, n, r).pipe(
                                              rt((a) => {
                                                i[s] = a;
                                              }),
                                            ),
                                          ),
                                          rc(1),
                                          Ee(() =>
                                            Object.keys(i).length === o.length
                                              ? B(i)
                                              : Kt,
                                          ),
                                        );
                                      })(e._resolve, e, t, r).pipe(
                                        Y(
                                          (i) => (
                                            (e._resolvedData = i),
                                            (e.data = Object.assign(
                                              Object.assign({}, e.data),
                                              av(e, n).resolve,
                                            )),
                                            null
                                          ),
                                        ),
                                      );
                                    })(s.route, r, e, t),
                                  ),
                                  rt(() => i++),
                                  rc(1),
                                  Ee((s) => (i === o.length ? B(n) : Kt)),
                                );
                              });
                            })(
                              this.paramsInheritanceStrategy,
                              this.ngModule.injector,
                            ),
                            rt({
                              next: () => (u = !0),
                              complete: () => {
                                u ||
                                  (this.restoreHistory(l),
                                  this.cancelNavigationTransition(
                                    l,
                                    "At least one route resolver didn't emit any value.",
                                  ));
                              },
                            }),
                          );
                        }),
                        rt((l) => {
                          const u = new Y1(
                            l.id,
                            this.serializeUrl(l.extractedUrl),
                            this.serializeUrl(l.urlAfterRedirects),
                            l.targetSnapshot,
                          );
                          this.triggerEvent(u);
                        }),
                      );
                  }),
                  vc((a) => {
                    const {
                      targetSnapshot: l,
                      id: u,
                      extractedUrl: c,
                      rawUrl: d,
                      extras: { skipLocationChange: f, replaceUrl: h },
                    } = a;
                    return this.hooks.afterPreactivation(l, {
                      navigationId: u,
                      appliedUrlTree: c,
                      rawUrlTree: d,
                      skipLocationChange: !!f,
                      replaceUrl: !!h,
                    });
                  }),
                  Y((a) => {
                    const l = (function (e, t, n) {
                      const r = Jo(e, t._root, n ? n._root : void 0);
                      return new iv(r, t);
                    })(
                      this.routeReuseStrategy,
                      a.targetSnapshot,
                      a.currentRouterState,
                    );
                    return Object.assign(Object.assign({}, a), {
                      targetRouterState: l,
                    });
                  }),
                  rt((a) => {
                    (this.currentUrlTree = a.urlAfterRedirects),
                      (this.rawUrlTree = this.urlHandlingStrategy.merge(
                        a.urlAfterRedirects,
                        a.rawUrl,
                      )),
                      (this.routerState = a.targetRouterState),
                      "deferred" === this.urlUpdateStrategy &&
                        (a.extras.skipLocationChange ||
                          this.setBrowserUrl(this.rawUrlTree, a),
                        (this.browserUrlTree = a.urlAfterRedirects));
                  }),
                  ((e, t, n) =>
                    Y(
                      (r) => (
                        new kA(
                          t,
                          r.targetRouterState,
                          r.currentRouterState,
                          n,
                        ).activate(e),
                        r
                      ),
                    ))(this.rootContexts, this.routeReuseStrategy, (a) =>
                    this.triggerEvent(a),
                  ),
                  rt({
                    next() {
                      i = !0;
                    },
                    complete() {
                      i = !0;
                    },
                  }),
                  (function (e) {
                    return Se((t, n) => {
                      try {
                        t.subscribe(n);
                      } finally {
                        n.add(e);
                      }
                    });
                  })(() => {
                    var a;
                    i ||
                      s ||
                      this.cancelNavigationTransition(
                        o,
                        `Navigation ID ${o.id} is not equal to the current navigation id ${this.navigationId}`,
                      ),
                      (null === (a = this.currentNavigation) || void 0 === a
                        ? void 0
                        : a.id) === o.id && (this.currentNavigation = null);
                  }),
                  Mn((a) => {
                    if (
                      ((s = !0),
                      (function (e) {
                        return e && e[qy];
                      })(a))
                    ) {
                      const l = Wn(a.url);
                      l || ((this.navigated = !0), this.restoreHistory(o, !0));
                      const u = new Hy(
                        o.id,
                        this.serializeUrl(o.extractedUrl),
                        a.message,
                      );
                      r.next(u),
                        l
                          ? setTimeout(() => {
                              const c = this.urlHandlingStrategy.merge(
                                  a.url,
                                  this.rawUrlTree,
                                ),
                                d = {
                                  skipLocationChange:
                                    o.extras.skipLocationChange,
                                  replaceUrl:
                                    "eager" === this.urlUpdateStrategy ||
                                    Ws(o.source),
                                };
                              this.scheduleNavigation(
                                c,
                                "imperative",
                                null,
                                d,
                                {
                                  resolve: o.resolve,
                                  reject: o.reject,
                                  promise: o.promise,
                                },
                              );
                            }, 0)
                          : o.resolve(!1);
                    } else {
                      this.restoreHistory(o, !0);
                      const l = new W1(
                        o.id,
                        this.serializeUrl(o.extractedUrl),
                        a,
                      );
                      r.next(l);
                      try {
                        o.resolve(this.errorHandler(a));
                      } catch (u) {
                        o.reject(u);
                      }
                    }
                    return Kt;
                  }),
                );
              }),
            );
          }
          resetRootComponentType(n) {
            (this.rootComponentType = n),
              (this.routerState.root.component = this.rootComponentType);
          }
          setTransition(n) {
            this.transitions.next(
              Object.assign(Object.assign({}, this.transitions.value), n),
            );
          }
          initialNavigation() {
            this.setUpLocationChangeListener(),
              0 === this.navigationId &&
                this.navigateByUrl(this.location.path(!0), { replaceUrl: !0 });
          }
          setUpLocationChangeListener() {
            this.locationSubscription ||
              (this.locationSubscription = this.location.subscribe((n) => {
                const r = "popstate" === n.type ? "popstate" : "hashchange";
                "popstate" === r &&
                  setTimeout(() => {
                    var o;
                    const i = { replaceUrl: !0 },
                      s = (
                        null === (o = n.state) || void 0 === o
                          ? void 0
                          : o.navigationId
                      )
                        ? n.state
                        : null;
                    if (s) {
                      const l = Object.assign({}, s);
                      delete l.navigationId,
                        delete l.ɵrouterPageId,
                        0 !== Object.keys(l).length && (i.state = l);
                    }
                    const a = this.parseUrl(n.url);
                    this.scheduleNavigation(a, r, s, i);
                  }, 0);
              }));
          }
          get url() {
            return this.serializeUrl(this.currentUrlTree);
          }
          getCurrentNavigation() {
            return this.currentNavigation;
          }
          triggerEvent(n) {
            this.events.next(n);
          }
          resetConfig(n) {
            mv(n),
              (this.config = n.map(mc)),
              (this.navigated = !1),
              (this.lastSuccessfulId = -1);
          }
          ngOnDestroy() {
            this.dispose();
          }
          dispose() {
            this.transitions.complete(),
              this.locationSubscription &&
                (this.locationSubscription.unsubscribe(),
                (this.locationSubscription = void 0)),
              (this.disposed = !0);
          }
          createUrlTree(n, r = {}) {
            const {
                relativeTo: o,
                queryParams: i,
                fragment: s,
                queryParamsHandling: a,
                preserveFragment: l,
              } = r,
              u = o || this.routerState.root,
              c = l ? this.currentUrlTree.fragment : s;
            let d = null;
            switch (a) {
              case "merge":
                d = Object.assign(
                  Object.assign({}, this.currentUrlTree.queryParams),
                  i,
                );
                break;
              case "preserve":
                d = this.currentUrlTree.queryParams;
                break;
              default:
                d = i || null;
            }
            return (
              null !== d && (d = this.removeEmptyProps(d)),
              (function (e, t, n, r, o) {
                if (0 === n.length) return fc(t.root, t.root, t, r, o);
                const i = (function (e) {
                  if ("string" == typeof e[0] && 1 === e.length && "/" === e[0])
                    return new dv(!0, 0, e);
                  let t = 0,
                    n = !1;
                  const r = e.reduce((o, i, s) => {
                    if ("object" == typeof i && null != i) {
                      if (i.outlets) {
                        const a = {};
                        return (
                          Pe(i.outlets, (l, u) => {
                            a[u] = "string" == typeof l ? l.split("/") : l;
                          }),
                          [...o, { outlets: a }]
                        );
                      }
                      if (i.segmentPath) return [...o, i.segmentPath];
                    }
                    return "string" != typeof i
                      ? [...o, i]
                      : 0 === s
                      ? (i.split("/").forEach((a, l) => {
                          (0 == l && "." === a) ||
                            (0 == l && "" === a
                              ? (n = !0)
                              : ".." === a
                              ? t++
                              : "" != a && o.push(a));
                        }),
                        o)
                      : [...o, i];
                  }, []);
                  return new dv(n, t, r);
                })(n);
                if (i.toRoot()) return fc(t.root, new Q([], {}), t, r, o);
                const s = (function (e, t, n) {
                    if (e.isAbsolute) return new hc(t.root, !0, 0);
                    if (-1 === n.snapshot._lastPathIndex) {
                      const i = n.snapshot._urlSegment;
                      return new hc(i, i === t.root, 0);
                    }
                    const r = Bs(e.commands[0]) ? 0 : 1;
                    return (function (e, t, n) {
                      let r = e,
                        o = t,
                        i = n;
                      for (; i > o; ) {
                        if (((i -= o), (r = r.parent), !r))
                          throw new Error("Invalid number of '../'");
                        o = r.segments.length;
                      }
                      return new hc(r, !1, o - i);
                    })(
                      n.snapshot._urlSegment,
                      n.snapshot._lastPathIndex + r,
                      e.numberOfDoubleDots,
                    );
                  })(i, t, e),
                  a = s.processChildren
                    ? Hs(s.segmentGroup, s.index, i.commands)
                    : fv(s.segmentGroup, s.index, i.commands);
                return fc(s.segmentGroup, a, t, r, o);
              })(u, this.currentUrlTree, n, d, null != c ? c : null)
            );
          }
          navigateByUrl(n, r = { skipLocationChange: !1 }) {
            const o = Wn(n) ? n : this.parseUrl(n),
              i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
            return this.scheduleNavigation(i, "imperative", null, r);
          }
          navigate(n, r = { skipLocationChange: !1 }) {
            return (
              (function (e) {
                for (let t = 0; t < e.length; t++) {
                  const n = e[t];
                  if (null == n)
                    throw new Error(
                      `The requested path contains ${n} segment at index ${t}`,
                    );
                }
              })(n),
              this.navigateByUrl(this.createUrlTree(n, r), r)
            );
          }
          serializeUrl(n) {
            return this.urlSerializer.serialize(n);
          }
          parseUrl(n) {
            let r;
            try {
              r = this.urlSerializer.parse(n);
            } catch (o) {
              r = this.malformedUriErrorHandler(o, this.urlSerializer, n);
            }
            return r;
          }
          isActive(n, r) {
            let o;
            if (
              ((o =
                !0 === r
                  ? Object.assign({}, NP)
                  : !1 === r
                  ? Object.assign({}, FP)
                  : r),
              Wn(n))
            )
              return Ky(this.currentUrlTree, n, o);
            const i = this.parseUrl(n);
            return Ky(this.currentUrlTree, i, o);
          }
          removeEmptyProps(n) {
            return Object.keys(n).reduce((r, o) => {
              const i = n[o];
              return null != i && (r[o] = i), r;
            }, {});
          }
          processNavigations() {
            this.navigations.subscribe(
              (n) => {
                (this.navigated = !0),
                  (this.lastSuccessfulId = n.id),
                  (this.currentPageId = n.targetPageId),
                  this.events.next(
                    new Wo(
                      n.id,
                      this.serializeUrl(n.extractedUrl),
                      this.serializeUrl(this.currentUrlTree),
                    ),
                  ),
                  (this.lastSuccessfulNavigation = this.currentNavigation),
                  n.resolve(!0);
              },
              (n) => {
                this.console.warn(`Unhandled Navigation Error: ${n}`);
              },
            );
          }
          scheduleNavigation(n, r, o, i, s) {
            var a, l, u;
            if (this.disposed) return Promise.resolve(!1);
            const c = this.transitions.value,
              d = Ws(r) && c && !Ws(c.source),
              f = c.rawUrl.toString() === n.toString(),
              h =
                c.id ===
                (null === (a = this.currentNavigation) || void 0 === a
                  ? void 0
                  : a.id);
            if (d && f && h) return Promise.resolve(!0);
            let D, _, w;
            s
              ? ((D = s.resolve), (_ = s.reject), (w = s.promise))
              : (w = new Promise((O, K) => {
                  (D = O), (_ = K);
                }));
            const y = ++this.navigationId;
            let I;
            return (
              "computed" === this.canceledNavigationResolution
                ? (0 === this.currentPageId && (o = this.location.getState()),
                  (I =
                    o && o.ɵrouterPageId
                      ? o.ɵrouterPageId
                      : i.replaceUrl || i.skipLocationChange
                      ? null !== (l = this.browserPageId) && void 0 !== l
                        ? l
                        : 0
                      : (null !== (u = this.browserPageId) && void 0 !== u
                          ? u
                          : 0) + 1))
                : (I = 0),
              this.setTransition({
                id: y,
                targetPageId: I,
                source: r,
                restoredState: o,
                currentUrlTree: this.currentUrlTree,
                currentRawUrl: this.rawUrlTree,
                rawUrl: n,
                extras: i,
                resolve: D,
                reject: _,
                promise: w,
                currentSnapshot: this.routerState.snapshot,
                currentRouterState: this.routerState,
              }),
              w.catch((O) => Promise.reject(O))
            );
          }
          setBrowserUrl(n, r) {
            const o = this.urlSerializer.serialize(n),
              i = Object.assign(
                Object.assign({}, r.extras.state),
                this.generateNgRouterState(r.id, r.targetPageId),
              );
            this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl
              ? this.location.replaceState(o, "", i)
              : this.location.go(o, "", i);
          }
          restoreHistory(n, r = !1) {
            var o, i;
            if ("computed" === this.canceledNavigationResolution) {
              const s = this.currentPageId - n.targetPageId;
              ("popstate" !== n.source &&
                "eager" !== this.urlUpdateStrategy &&
                this.currentUrlTree !==
                  (null === (o = this.currentNavigation) || void 0 === o
                    ? void 0
                    : o.finalUrl)) ||
              0 === s
                ? this.currentUrlTree ===
                    (null === (i = this.currentNavigation) || void 0 === i
                      ? void 0
                      : i.finalUrl) &&
                  0 === s &&
                  (this.resetState(n),
                  (this.browserUrlTree = n.currentUrlTree),
                  this.resetUrlToCurrentUrlTree())
                : this.location.historyGo(s);
            } else
              "replace" === this.canceledNavigationResolution &&
                (r && this.resetState(n), this.resetUrlToCurrentUrlTree());
          }
          resetState(n) {
            (this.routerState = n.currentRouterState),
              (this.currentUrlTree = n.currentUrlTree),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(
                this.currentUrlTree,
                n.rawUrl,
              ));
          }
          resetUrlToCurrentUrlTree() {
            this.location.replaceState(
              this.urlSerializer.serialize(this.rawUrlTree),
              "",
              this.generateNgRouterState(
                this.lastSuccessfulId,
                this.currentPageId,
              ),
            );
          }
          cancelNavigationTransition(n, r) {
            const o = new Hy(n.id, this.serializeUrl(n.extractedUrl), r);
            this.triggerEvent(o), n.resolve(!1);
          }
          generateNgRouterState(n, r) {
            return "computed" === this.canceledNavigationResolution
              ? { navigationId: n, ɵrouterPageId: r }
              : { navigationId: n };
          }
        }
        return (
          (e.ɵfac = function (n) {
            Gl();
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function Ws(e) {
        return "imperative" !== e;
      }
      let Cc = (() => {
          class e {
            constructor(n, r, o, i, s) {
              (this.router = n),
                (this.route = r),
                (this.tabIndexAttribute = o),
                (this.renderer = i),
                (this.el = s),
                (this.commands = null),
                (this.onChanges = new Gt()),
                this.setTabIndexIfNotOnNativeEl("0");
            }
            setTabIndexIfNotOnNativeEl(n) {
              if (null != this.tabIndexAttribute) return;
              const r = this.renderer,
                o = this.el.nativeElement;
              null !== n
                ? r.setAttribute(o, "tabindex", n)
                : r.removeAttribute(o, "tabindex");
            }
            ngOnChanges(n) {
              this.onChanges.next(this);
            }
            set routerLink(n) {
              null != n
                ? ((this.commands = Array.isArray(n) ? n : [n]),
                  this.setTabIndexIfNotOnNativeEl("0"))
                : ((this.commands = null),
                  this.setTabIndexIfNotOnNativeEl(null));
            }
            onClick() {
              if (null === this.urlTree) return !0;
              const n = {
                skipLocationChange: Jr(this.skipLocationChange),
                replaceUrl: Jr(this.replaceUrl),
                state: this.state,
              };
              return this.router.navigateByUrl(this.urlTree, n), !0;
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: Jr(this.preserveFragment),
                  });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(ot), T(Qr), co("tabindex"), T(ss), T(_n));
            }),
            (e.ɵdir = xe({
              type: e,
              selectors: [["", "routerLink", "", 5, "a", 5, "area"]],
              hostBindings: function (n, r) {
                1 & n &&
                  Ve("click", function () {
                    return r.onClick();
                  });
              },
              inputs: {
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                preserveFragment: "preserveFragment",
                skipLocationChange: "skipLocationChange",
                replaceUrl: "replaceUrl",
                state: "state",
                relativeTo: "relativeTo",
                routerLink: "routerLink",
              },
              features: [Ln],
            })),
            e
          );
        })(),
        Kr = (() => {
          class e {
            constructor(n, r, o) {
              (this.router = n),
                (this.route = r),
                (this.locationStrategy = o),
                (this.commands = null),
                (this.href = null),
                (this.onChanges = new Gt()),
                (this.subscription = n.events.subscribe((i) => {
                  i instanceof Wo && this.updateTargetUrlAndHref();
                }));
            }
            set routerLink(n) {
              this.commands = null != n ? (Array.isArray(n) ? n : [n]) : null;
            }
            ngOnChanges(n) {
              this.updateTargetUrlAndHref(), this.onChanges.next(this);
            }
            ngOnDestroy() {
              this.subscription.unsubscribe();
            }
            onClick(n, r, o, i, s) {
              if (
                0 !== n ||
                r ||
                o ||
                i ||
                s ||
                ("string" == typeof this.target && "_self" != this.target) ||
                null === this.urlTree
              )
                return !0;
              const a = {
                skipLocationChange: Jr(this.skipLocationChange),
                replaceUrl: Jr(this.replaceUrl),
                state: this.state,
              };
              return this.router.navigateByUrl(this.urlTree, a), !1;
            }
            updateTargetUrlAndHref() {
              this.href =
                null !== this.urlTree
                  ? this.locationStrategy.prepareExternalUrl(
                      this.router.serializeUrl(this.urlTree),
                    )
                  : null;
            }
            get urlTree() {
              return null === this.commands
                ? null
                : this.router.createUrlTree(this.commands, {
                    relativeTo:
                      void 0 !== this.relativeTo ? this.relativeTo : this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: Jr(this.preserveFragment),
                  });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(ot), T(Qr), T($r));
            }),
            (e.ɵdir = xe({
              type: e,
              selectors: [
                ["a", "routerLink", ""],
                ["area", "routerLink", ""],
              ],
              hostVars: 2,
              hostBindings: function (n, r) {
                1 & n &&
                  Ve("click", function (i) {
                    return r.onClick(
                      i.button,
                      i.ctrlKey,
                      i.shiftKey,
                      i.altKey,
                      i.metaKey,
                    );
                  }),
                  2 & n && Vl("target", r.target)("href", r.href, Ka);
              },
              inputs: {
                target: "target",
                queryParams: "queryParams",
                fragment: "fragment",
                queryParamsHandling: "queryParamsHandling",
                preserveFragment: "preserveFragment",
                skipLocationChange: "skipLocationChange",
                replaceUrl: "replaceUrl",
                state: "state",
                relativeTo: "relativeTo",
                routerLink: "routerLink",
              },
              features: [Ln],
            })),
            e
          );
        })();
      function Jr(e) {
        return "" === e || !!e;
      }
      let Ov = (() => {
        class e {
          constructor(n, r, o, i, s, a) {
            (this.router = n),
              (this.element = r),
              (this.renderer = o),
              (this.cdr = i),
              (this.link = s),
              (this.linkWithHref = a),
              (this.classes = []),
              (this.isActive = !1),
              (this.routerLinkActiveOptions = { exact: !1 }),
              (this.isActiveChange = new $e()),
              (this.routerEventsSubscription = n.events.subscribe((l) => {
                l instanceof Wo && this.update();
              }));
          }
          ngAfterContentInit() {
            B(this.links.changes, this.linksWithHrefs.changes, B(null))
              .pipe(Xr())
              .subscribe((n) => {
                this.update(), this.subscribeToEachLinkOnChanges();
              });
          }
          subscribeToEachLinkOnChanges() {
            var n;
            null === (n = this.linkInputChangesSubscription) ||
              void 0 === n ||
              n.unsubscribe();
            const r = [
              ...this.links.toArray(),
              ...this.linksWithHrefs.toArray(),
              this.link,
              this.linkWithHref,
            ]
              .filter((o) => !!o)
              .map((o) => o.onChanges);
            this.linkInputChangesSubscription = Te(r)
              .pipe(Xr())
              .subscribe((o) => {
                this.isActive !== this.isLinkActive(this.router)(o) &&
                  this.update();
              });
          }
          set routerLinkActive(n) {
            const r = Array.isArray(n) ? n : n.split(" ");
            this.classes = r.filter((o) => !!o);
          }
          ngOnChanges(n) {
            this.update();
          }
          ngOnDestroy() {
            var n;
            this.routerEventsSubscription.unsubscribe(),
              null === (n = this.linkInputChangesSubscription) ||
                void 0 === n ||
                n.unsubscribe();
          }
          update() {
            !this.links ||
              !this.linksWithHrefs ||
              !this.router.navigated ||
              Promise.resolve().then(() => {
                const n = this.hasActiveLinks();
                this.isActive !== n &&
                  ((this.isActive = n),
                  this.cdr.markForCheck(),
                  this.classes.forEach((r) => {
                    n
                      ? this.renderer.addClass(this.element.nativeElement, r)
                      : this.renderer.removeClass(
                          this.element.nativeElement,
                          r,
                        );
                  }),
                  this.isActiveChange.emit(n));
              });
          }
          isLinkActive(n) {
            const r = (function (e) {
              return !!e.paths;
            })(this.routerLinkActiveOptions)
              ? this.routerLinkActiveOptions
              : this.routerLinkActiveOptions.exact || !1;
            return (o) => !!o.urlTree && n.isActive(o.urlTree, r);
          }
          hasActiveLinks() {
            const n = this.isLinkActive(this.router);
            return (
              (this.link && n(this.link)) ||
              (this.linkWithHref && n(this.linkWithHref)) ||
              this.links.some(n) ||
              this.linksWithHrefs.some(n)
            );
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(T(ot), T(_n), T(ss), T(Au), T(Cc, 8), T(Kr, 8));
          }),
          (e.ɵdir = xe({
            type: e,
            selectors: [["", "routerLinkActive", ""]],
            contentQueries: function (n, r, o) {
              if ((1 & n && (gu(o, Cc, 5), gu(o, Kr, 5)), 2 & n)) {
                let i;
                pu((i = mu())) && (r.links = i),
                  pu((i = mu())) && (r.linksWithHrefs = i);
              }
            },
            inputs: {
              routerLinkActiveOptions: "routerLinkActiveOptions",
              routerLinkActive: "routerLinkActive",
            },
            outputs: { isActiveChange: "isActiveChange" },
            exportAs: ["routerLinkActive"],
            features: [Ln],
          })),
          e
        );
      })();
      class Rv {}
      class Nv {
        preload(t, n) {
          return B(null);
        }
      }
      let Fv = (() => {
          class e {
            constructor(n, r, o, i) {
              (this.router = n),
                (this.injector = o),
                (this.preloadingStrategy = i),
                (this.loader = new Pv(
                  o,
                  r,
                  (l) => n.triggerEvent(new Vy(l)),
                  (l) => n.triggerEvent(new Uy(l)),
                ));
            }
            setUpPreloading() {
              this.subscription = this.router.events
                .pipe(
                  qn((n) => n instanceof Wo),
                  qr(() => this.preload()),
                )
                .subscribe(() => {});
            }
            preload() {
              const n = this.injector.get(rn);
              return this.processRoutes(n, this.router.config);
            }
            ngOnDestroy() {
              this.subscription && this.subscription.unsubscribe();
            }
            processRoutes(n, r) {
              const o = [];
              for (const i of r)
                if (i.loadChildren && !i.canLoad && i._loadedConfig) {
                  const s = i._loadedConfig;
                  o.push(this.processRoutes(s.module, s.routes));
                } else
                  i.loadChildren && !i.canLoad
                    ? o.push(this.preloadConfig(n, i))
                    : i.children && o.push(this.processRoutes(n, i.children));
              return Te(o).pipe(
                Xr(),
                Y((i) => {}),
              );
            }
            preloadConfig(n, r) {
              return this.preloadingStrategy.preload(r, () =>
                (r._loadedConfig
                  ? B(r._loadedConfig)
                  : this.loader.load(n.injector, r)
                ).pipe(
                  Ee(
                    (i) => (
                      (r._loadedConfig = i),
                      this.processRoutes(i.module, i.routes)
                    ),
                  ),
                ),
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(ot), A(gs), A(Fe), A(Rv));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        _c = (() => {
          class e {
            constructor(n, r, o = {}) {
              (this.router = n),
                (this.viewportScroller = r),
                (this.options = o),
                (this.lastId = 0),
                (this.lastSource = "imperative"),
                (this.restoredId = 0),
                (this.store = {}),
                (o.scrollPositionRestoration =
                  o.scrollPositionRestoration || "disabled"),
                (o.anchorScrolling = o.anchorScrolling || "disabled");
            }
            init() {
              "disabled" !== this.options.scrollPositionRestoration &&
                this.viewportScroller.setHistoryScrollRestoration("manual"),
                (this.routerEventsSubscription = this.createScrollEvents()),
                (this.scrollEventsSubscription = this.consumeScrollEvents());
            }
            createScrollEvents() {
              return this.router.events.subscribe((n) => {
                n instanceof oc
                  ? ((this.store[this.lastId] =
                      this.viewportScroller.getScrollPosition()),
                    (this.lastSource = n.navigationTrigger),
                    (this.restoredId = n.restoredState
                      ? n.restoredState.navigationId
                      : 0))
                  : n instanceof Wo &&
                    ((this.lastId = n.id),
                    this.scheduleScrollEvent(
                      n,
                      this.router.parseUrl(n.urlAfterRedirects).fragment,
                    ));
              });
            }
            consumeScrollEvents() {
              return this.router.events.subscribe((n) => {
                n instanceof $y &&
                  (n.position
                    ? "top" === this.options.scrollPositionRestoration
                      ? this.viewportScroller.scrollToPosition([0, 0])
                      : "enabled" === this.options.scrollPositionRestoration &&
                        this.viewportScroller.scrollToPosition(n.position)
                    : n.anchor && "enabled" === this.options.anchorScrolling
                    ? this.viewportScroller.scrollToAnchor(n.anchor)
                    : "disabled" !== this.options.scrollPositionRestoration &&
                      this.viewportScroller.scrollToPosition([0, 0]));
              });
            }
            scheduleScrollEvent(n, r) {
              this.router.triggerEvent(
                new $y(
                  n,
                  "popstate" === this.lastSource
                    ? this.store[this.restoredId]
                    : null,
                  r,
                ),
              );
            }
            ngOnDestroy() {
              this.routerEventsSubscription &&
                this.routerEventsSubscription.unsubscribe(),
                this.scrollEventsSubscription &&
                  this.scrollEventsSubscription.unsubscribe();
            }
          }
          return (
            (e.ɵfac = function (n) {
              Gl();
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })();
      const Qn = new W("ROUTER_CONFIGURATION"),
        kv = new W("ROUTER_FORROOT_GUARD"),
        BP = [
          ku,
          { provide: Xy, useClass: ev },
          {
            provide: ot,
            useFactory: function (e, t, n, r, o, i, s = {}, a, l) {
              const u = new ot(null, e, t, n, r, o, Gy(i));
              return (
                a && (u.urlHandlingStrategy = a),
                l && (u.routeReuseStrategy = l),
                (function (e, t) {
                  e.errorHandler && (t.errorHandler = e.errorHandler),
                    e.malformedUriErrorHandler &&
                      (t.malformedUriErrorHandler = e.malformedUriErrorHandler),
                    e.onSameUrlNavigation &&
                      (t.onSameUrlNavigation = e.onSameUrlNavigation),
                    e.paramsInheritanceStrategy &&
                      (t.paramsInheritanceStrategy =
                        e.paramsInheritanceStrategy),
                    e.relativeLinkResolution &&
                      (t.relativeLinkResolution = e.relativeLinkResolution),
                    e.urlUpdateStrategy &&
                      (t.urlUpdateStrategy = e.urlUpdateStrategy),
                    e.canceledNavigationResolution &&
                      (t.canceledNavigationResolution =
                        e.canceledNavigationResolution);
                })(s, u),
                s.enableTracing &&
                  u.events.subscribe((c) => {
                    var d, f;
                    null === (d = console.group) ||
                      void 0 === d ||
                      d.call(console, `Router Event: ${c.constructor.name}`),
                      console.log(c.toString()),
                      console.log(c),
                      null === (f = console.groupEnd) ||
                        void 0 === f ||
                        f.call(console);
                  }),
                u
              );
            },
            deps: [
              Xy,
              ei,
              ku,
              Fe,
              gs,
              Dc,
              Qn,
              [class {}, new Ft()],
              [class {}, new Ft()],
            ],
          },
          ei,
          {
            provide: Qr,
            useFactory: function (e) {
              return e.routerState.root;
            },
            deps: [ot],
          },
          Fv,
          Nv,
          class {
            preload(t, n) {
              return n().pipe(Mn(() => B(null)));
            }
          },
          { provide: Qn, useValue: { enableTracing: !1 } },
        ];
      function HP() {
        return new Nm("Router", ot);
      }
      let wc = (() => {
        class e {
          constructor(n, r) {}
          static forRoot(n, r) {
            return {
              ngModule: e,
              providers: [
                BP,
                Lv(n),
                {
                  provide: kv,
                  useFactory: $P,
                  deps: [[ot, new Ft(), new dr()]],
                },
                { provide: Qn, useValue: r || {} },
                {
                  provide: $r,
                  useFactory: UP,
                  deps: [Un, [new vo(Fu), new Ft()], Qn],
                },
                { provide: _c, useFactory: VP, deps: [ot, qT, Qn] },
                {
                  provide: Rv,
                  useExisting:
                    r && r.preloadingStrategy ? r.preloadingStrategy : Nv,
                },
                { provide: Nm, multi: !0, useFactory: HP },
                [
                  bc,
                  { provide: hs, multi: !0, useFactory: WP, deps: [bc] },
                  { provide: jv, useFactory: QP, deps: [bc] },
                  { provide: Im, multi: !0, useExisting: jv },
                ],
              ],
            };
          }
          static forChild(n) {
            return { ngModule: e, providers: [Lv(n)] };
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(kv, 8), A(ot, 8));
          }),
          (e.ɵmod = Yt({ type: e })),
          (e.ɵinj = Pt({})),
          e
        );
      })();
      function VP(e, t, n) {
        return n.scrollOffset && t.setOffset(n.scrollOffset), new _c(e, t, n);
      }
      function UP(e, t, n = {}) {
        return n.useHash ? new MI(e, t) : new ny(e, t);
      }
      function $P(e) {
        return "guarded";
      }
      function Lv(e) {
        return [
          { provide: zC, multi: !0, useValue: e },
          { provide: Dc, multi: !0, useValue: e },
        ];
      }
      let bc = (() => {
        class e {
          constructor(n) {
            (this.injector = n),
              (this.initNavigation = !1),
              (this.destroyed = !1),
              (this.resultOfPreactivationDone = new Gt());
          }
          appInitializer() {
            return this.injector.get(wI, Promise.resolve(null)).then(() => {
              if (this.destroyed) return Promise.resolve(!0);
              let r = null;
              const o = new Promise((a) => (r = a)),
                i = this.injector.get(ot),
                s = this.injector.get(Qn);
              return (
                "disabled" === s.initialNavigation
                  ? (i.setUpLocationChangeListener(), r(!0))
                  : "enabled" === s.initialNavigation ||
                    "enabledBlocking" === s.initialNavigation
                  ? ((i.hooks.afterPreactivation = () =>
                      this.initNavigation
                        ? B(null)
                        : ((this.initNavigation = !0),
                          r(!0),
                          this.resultOfPreactivationDone)),
                    i.initialNavigation())
                  : r(!0),
                o
              );
            });
          }
          bootstrapListener(n) {
            const r = this.injector.get(Qn),
              o = this.injector.get(Fv),
              i = this.injector.get(_c),
              s = this.injector.get(ot),
              a = this.injector.get(Vo);
            n === a.components[0] &&
              (("enabledNonBlocking" === r.initialNavigation ||
                void 0 === r.initialNavigation) &&
                s.initialNavigation(),
              o.setUpPreloading(),
              i.init(),
              s.resetRootComponentType(a.componentTypes[0]),
              this.resultOfPreactivationDone.next(null),
              this.resultOfPreactivationDone.complete());
          }
          ngOnDestroy() {
            this.destroyed = !0;
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(Fe));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      function WP(e) {
        return e.appInitializer.bind(e);
      }
      function QP(e) {
        return e.bootstrapListener.bind(e);
      }
      const jv = new W("Router Initializer");
      class Bv {}
      class Hv {}
      class cn {
        constructor(t) {
          (this.normalizedNames = new Map()),
            (this.lazyUpdate = null),
            t
              ? (this.lazyInit =
                  "string" == typeof t
                    ? () => {
                        (this.headers = new Map()),
                          t.split("\n").forEach((n) => {
                            const r = n.indexOf(":");
                            if (r > 0) {
                              const o = n.slice(0, r),
                                i = o.toLowerCase(),
                                s = n.slice(r + 1).trim();
                              this.maybeSetNormalizedName(o, i),
                                this.headers.has(i)
                                  ? this.headers.get(i).push(s)
                                  : this.headers.set(i, [s]);
                            }
                          });
                      }
                    : () => {
                        (this.headers = new Map()),
                          Object.keys(t).forEach((n) => {
                            let r = t[n];
                            const o = n.toLowerCase();
                            "string" == typeof r && (r = [r]),
                              r.length > 0 &&
                                (this.headers.set(o, r),
                                this.maybeSetNormalizedName(n, o));
                          });
                      })
              : (this.headers = new Map());
        }
        has(t) {
          return this.init(), this.headers.has(t.toLowerCase());
        }
        get(t) {
          this.init();
          const n = this.headers.get(t.toLowerCase());
          return n && n.length > 0 ? n[0] : null;
        }
        keys() {
          return this.init(), Array.from(this.normalizedNames.values());
        }
        getAll(t) {
          return this.init(), this.headers.get(t.toLowerCase()) || null;
        }
        append(t, n) {
          return this.clone({ name: t, value: n, op: "a" });
        }
        set(t, n) {
          return this.clone({ name: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ name: t, value: n, op: "d" });
        }
        maybeSetNormalizedName(t, n) {
          this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
        }
        init() {
          this.lazyInit &&
            (this.lazyInit instanceof cn
              ? this.copyFrom(this.lazyInit)
              : this.lazyInit(),
            (this.lazyInit = null),
            this.lazyUpdate &&
              (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
              (this.lazyUpdate = null)));
        }
        copyFrom(t) {
          t.init(),
            Array.from(t.headers.keys()).forEach((n) => {
              this.headers.set(n, t.headers.get(n)),
                this.normalizedNames.set(n, t.normalizedNames.get(n));
            });
        }
        clone(t) {
          const n = new cn();
          return (
            (n.lazyInit =
              this.lazyInit && this.lazyInit instanceof cn
                ? this.lazyInit
                : this),
            (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
            n
          );
        }
        applyUpdate(t) {
          const n = t.name.toLowerCase();
          switch (t.op) {
            case "a":
            case "s":
              let r = t.value;
              if (("string" == typeof r && (r = [r]), 0 === r.length)) return;
              this.maybeSetNormalizedName(t.name, n);
              const o = ("a" === t.op ? this.headers.get(n) : void 0) || [];
              o.push(...r), this.headers.set(n, o);
              break;
            case "d":
              const i = t.value;
              if (i) {
                let s = this.headers.get(n);
                if (!s) return;
                (s = s.filter((a) => -1 === i.indexOf(a))),
                  0 === s.length
                    ? (this.headers.delete(n), this.normalizedNames.delete(n))
                    : this.headers.set(n, s);
              } else this.headers.delete(n), this.normalizedNames.delete(n);
          }
        }
        forEach(t) {
          this.init(),
            Array.from(this.normalizedNames.keys()).forEach((n) =>
              t(this.normalizedNames.get(n), this.headers.get(n)),
            );
        }
      }
      class JP {
        encodeKey(t) {
          return Vv(t);
        }
        encodeValue(t) {
          return Vv(t);
        }
        decodeKey(t) {
          return decodeURIComponent(t);
        }
        decodeValue(t) {
          return decodeURIComponent(t);
        }
      }
      const YP = /%(\d[a-f0-9])/gi,
        XP = {
          40: "@",
          "3A": ":",
          24: "$",
          "2C": ",",
          "3B": ";",
          "2B": "+",
          "3D": "=",
          "3F": "?",
          "2F": "/",
        };
      function Vv(e) {
        return encodeURIComponent(e).replace(YP, (t, n) => {
          var r;
          return null !== (r = XP[n]) && void 0 !== r ? r : t;
        });
      }
      function Uv(e) {
        return `${e}`;
      }
      class In {
        constructor(t = {}) {
          if (
            ((this.updates = null),
            (this.cloneFrom = null),
            (this.encoder = t.encoder || new JP()),
            t.fromString)
          ) {
            if (t.fromObject)
              throw new Error("Cannot specify both fromString and fromObject.");
            this.map = (function (e, t) {
              const n = new Map();
              return (
                e.length > 0 &&
                  e
                    .replace(/^\?/, "")
                    .split("&")
                    .forEach((o) => {
                      const i = o.indexOf("="),
                        [s, a] =
                          -1 == i
                            ? [t.decodeKey(o), ""]
                            : [
                                t.decodeKey(o.slice(0, i)),
                                t.decodeValue(o.slice(i + 1)),
                              ],
                        l = n.get(s) || [];
                      l.push(a), n.set(s, l);
                    }),
                n
              );
            })(t.fromString, this.encoder);
          } else
            t.fromObject
              ? ((this.map = new Map()),
                Object.keys(t.fromObject).forEach((n) => {
                  const r = t.fromObject[n];
                  this.map.set(n, Array.isArray(r) ? r : [r]);
                }))
              : (this.map = null);
        }
        has(t) {
          return this.init(), this.map.has(t);
        }
        get(t) {
          this.init();
          const n = this.map.get(t);
          return n ? n[0] : null;
        }
        getAll(t) {
          return this.init(), this.map.get(t) || null;
        }
        keys() {
          return this.init(), Array.from(this.map.keys());
        }
        append(t, n) {
          return this.clone({ param: t, value: n, op: "a" });
        }
        appendAll(t) {
          const n = [];
          return (
            Object.keys(t).forEach((r) => {
              const o = t[r];
              Array.isArray(o)
                ? o.forEach((i) => {
                    n.push({ param: r, value: i, op: "a" });
                  })
                : n.push({ param: r, value: o, op: "a" });
            }),
            this.clone(n)
          );
        }
        set(t, n) {
          return this.clone({ param: t, value: n, op: "s" });
        }
        delete(t, n) {
          return this.clone({ param: t, value: n, op: "d" });
        }
        toString() {
          return (
            this.init(),
            this.keys()
              .map((t) => {
                const n = this.encoder.encodeKey(t);
                return this.map
                  .get(t)
                  .map((r) => n + "=" + this.encoder.encodeValue(r))
                  .join("&");
              })
              .filter((t) => "" !== t)
              .join("&")
          );
        }
        clone(t) {
          const n = new In({ encoder: this.encoder });
          return (
            (n.cloneFrom = this.cloneFrom || this),
            (n.updates = (this.updates || []).concat(t)),
            n
          );
        }
        init() {
          null === this.map && (this.map = new Map()),
            null !== this.cloneFrom &&
              (this.cloneFrom.init(),
              this.cloneFrom
                .keys()
                .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
              this.updates.forEach((t) => {
                switch (t.op) {
                  case "a":
                  case "s":
                    const n =
                      ("a" === t.op ? this.map.get(t.param) : void 0) || [];
                    n.push(Uv(t.value)), this.map.set(t.param, n);
                    break;
                  case "d":
                    if (void 0 === t.value) {
                      this.map.delete(t.param);
                      break;
                    }
                    {
                      let r = this.map.get(t.param) || [];
                      const o = r.indexOf(Uv(t.value));
                      -1 !== o && r.splice(o, 1),
                        r.length > 0
                          ? this.map.set(t.param, r)
                          : this.map.delete(t.param);
                    }
                }
              }),
              (this.cloneFrom = this.updates = null));
        }
      }
      class ex {
        constructor() {
          this.map = new Map();
        }
        set(t, n) {
          return this.map.set(t, n), this;
        }
        get(t) {
          return (
            this.map.has(t) || this.map.set(t, t.defaultValue()),
            this.map.get(t)
          );
        }
        delete(t) {
          return this.map.delete(t), this;
        }
        has(t) {
          return this.map.has(t);
        }
        keys() {
          return this.map.keys();
        }
      }
      function $v(e) {
        return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer;
      }
      function qv(e) {
        return "undefined" != typeof Blob && e instanceof Blob;
      }
      function zv(e) {
        return "undefined" != typeof FormData && e instanceof FormData;
      }
      class oi {
        constructor(t, n, r, o) {
          let i;
          if (
            ((this.url = n),
            (this.body = null),
            (this.reportProgress = !1),
            (this.withCredentials = !1),
            (this.responseType = "json"),
            (this.method = t.toUpperCase()),
            (function (e) {
              switch (e) {
                case "DELETE":
                case "GET":
                case "HEAD":
                case "OPTIONS":
                case "JSONP":
                  return !1;
                default:
                  return !0;
              }
            })(this.method) || o
              ? ((this.body = void 0 !== r ? r : null), (i = o))
              : (i = r),
            i &&
              ((this.reportProgress = !!i.reportProgress),
              (this.withCredentials = !!i.withCredentials),
              i.responseType && (this.responseType = i.responseType),
              i.headers && (this.headers = i.headers),
              i.context && (this.context = i.context),
              i.params && (this.params = i.params)),
            this.headers || (this.headers = new cn()),
            this.context || (this.context = new ex()),
            this.params)
          ) {
            const s = this.params.toString();
            if (0 === s.length) this.urlWithParams = n;
            else {
              const a = n.indexOf("?");
              this.urlWithParams =
                n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s;
            }
          } else (this.params = new In()), (this.urlWithParams = n);
        }
        serializeBody() {
          return null === this.body
            ? null
            : $v(this.body) ||
              qv(this.body) ||
              zv(this.body) ||
              ("undefined" != typeof URLSearchParams &&
                this.body instanceof URLSearchParams) ||
              "string" == typeof this.body
            ? this.body
            : this.body instanceof In
            ? this.body.toString()
            : "object" == typeof this.body ||
              "boolean" == typeof this.body ||
              Array.isArray(this.body)
            ? JSON.stringify(this.body)
            : this.body.toString();
        }
        detectContentTypeHeader() {
          return null === this.body || zv(this.body)
            ? null
            : qv(this.body)
            ? this.body.type || null
            : $v(this.body)
            ? null
            : "string" == typeof this.body
            ? "text/plain"
            : this.body instanceof In
            ? "application/x-www-form-urlencoded;charset=UTF-8"
            : "object" == typeof this.body ||
              "number" == typeof this.body ||
              "boolean" == typeof this.body
            ? "application/json"
            : null;
        }
        clone(t = {}) {
          var n;
          const r = t.method || this.method,
            o = t.url || this.url,
            i = t.responseType || this.responseType,
            s = void 0 !== t.body ? t.body : this.body,
            a =
              void 0 !== t.withCredentials
                ? t.withCredentials
                : this.withCredentials,
            l =
              void 0 !== t.reportProgress
                ? t.reportProgress
                : this.reportProgress;
          let u = t.headers || this.headers,
            c = t.params || this.params;
          const d = null !== (n = t.context) && void 0 !== n ? n : this.context;
          return (
            void 0 !== t.setHeaders &&
              (u = Object.keys(t.setHeaders).reduce(
                (f, h) => f.set(h, t.setHeaders[h]),
                u,
              )),
            t.setParams &&
              (c = Object.keys(t.setParams).reduce(
                (f, h) => f.set(h, t.setParams[h]),
                c,
              )),
            new oi(r, o, s, {
              params: c,
              headers: u,
              context: d,
              reportProgress: l,
              responseType: i,
              withCredentials: a,
            })
          );
        }
      }
      var ve = (() => (
        ((ve = ve || {})[(ve.Sent = 0)] = "Sent"),
        (ve[(ve.UploadProgress = 1)] = "UploadProgress"),
        (ve[(ve.ResponseHeader = 2)] = "ResponseHeader"),
        (ve[(ve.DownloadProgress = 3)] = "DownloadProgress"),
        (ve[(ve.Response = 4)] = "Response"),
        (ve[(ve.User = 5)] = "User"),
        ve
      ))();
      class Ec {
        constructor(t, n = 200, r = "OK") {
          (this.headers = t.headers || new cn()),
            (this.status = void 0 !== t.status ? t.status : n),
            (this.statusText = t.statusText || r),
            (this.url = t.url || null),
            (this.ok = this.status >= 200 && this.status < 300);
        }
      }
      class Mc extends Ec {
        constructor(t = {}) {
          super(t), (this.type = ve.ResponseHeader);
        }
        clone(t = {}) {
          return new Mc({
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class Ks extends Ec {
        constructor(t = {}) {
          super(t),
            (this.type = ve.Response),
            (this.body = void 0 !== t.body ? t.body : null);
        }
        clone(t = {}) {
          return new Ks({
            body: void 0 !== t.body ? t.body : this.body,
            headers: t.headers || this.headers,
            status: void 0 !== t.status ? t.status : this.status,
            statusText: t.statusText || this.statusText,
            url: t.url || this.url || void 0,
          });
        }
      }
      class Gv extends Ec {
        constructor(t) {
          super(t, 0, "Unknown Error"),
            (this.name = "HttpErrorResponse"),
            (this.ok = !1),
            (this.message =
              this.status >= 200 && this.status < 300
                ? `Http failure during parsing for ${t.url || "(unknown url)"}`
                : `Http failure response for ${t.url || "(unknown url)"}: ${
                    t.status
                  } ${t.statusText}`),
            (this.error = t.error || null);
        }
      }
      function Sc(e, t) {
        return {
          body: t,
          headers: e.headers,
          context: e.context,
          observe: e.observe,
          params: e.params,
          reportProgress: e.reportProgress,
          responseType: e.responseType,
          withCredentials: e.withCredentials,
        };
      }
      let Wv = (() => {
        class e {
          constructor(n) {
            this.handler = n;
          }
          request(n, r, o = {}) {
            let i;
            if (n instanceof oi) i = n;
            else {
              let l, u;
              (l = o.headers instanceof cn ? o.headers : new cn(o.headers)),
                o.params &&
                  (u =
                    o.params instanceof In
                      ? o.params
                      : new In({ fromObject: o.params })),
                (i = new oi(n, r, void 0 !== o.body ? o.body : null, {
                  headers: l,
                  context: o.context,
                  params: u,
                  reportProgress: o.reportProgress,
                  responseType: o.responseType || "json",
                  withCredentials: o.withCredentials,
                }));
            }
            const s = B(i).pipe(qr((l) => this.handler.handle(l)));
            if (n instanceof oi || "events" === o.observe) return s;
            const a = s.pipe(qn((l) => l instanceof Ks));
            switch (o.observe || "body") {
              case "body":
                switch (i.responseType) {
                  case "arraybuffer":
                    return a.pipe(
                      Y((l) => {
                        if (null !== l.body && !(l.body instanceof ArrayBuffer))
                          throw new Error("Response is not an ArrayBuffer.");
                        return l.body;
                      }),
                    );
                  case "blob":
                    return a.pipe(
                      Y((l) => {
                        if (null !== l.body && !(l.body instanceof Blob))
                          throw new Error("Response is not a Blob.");
                        return l.body;
                      }),
                    );
                  case "text":
                    return a.pipe(
                      Y((l) => {
                        if (null !== l.body && "string" != typeof l.body)
                          throw new Error("Response is not a string.");
                        return l.body;
                      }),
                    );
                  default:
                    return a.pipe(Y((l) => l.body));
                }
              case "response":
                return a;
              default:
                throw new Error(
                  `Unreachable: unhandled observe type ${o.observe}}`,
                );
            }
          }
          delete(n, r = {}) {
            return this.request("DELETE", n, r);
          }
          get(n, r = {}) {
            return this.request("GET", n, r);
          }
          head(n, r = {}) {
            return this.request("HEAD", n, r);
          }
          jsonp(n, r) {
            return this.request("JSONP", n, {
              params: new In().append(r, "JSONP_CALLBACK"),
              observe: "body",
              responseType: "json",
            });
          }
          options(n, r = {}) {
            return this.request("OPTIONS", n, r);
          }
          patch(n, r, o = {}) {
            return this.request("PATCH", n, Sc(o, r));
          }
          post(n, r, o = {}) {
            return this.request("POST", n, Sc(o, r));
          }
          put(n, r, o = {}) {
            return this.request("PUT", n, Sc(o, r));
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(Bv));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      class Qv {
        constructor(t, n) {
          (this.next = t), (this.interceptor = n);
        }
        handle(t) {
          return this.interceptor.intercept(t, this.next);
        }
      }
      const Kv = new W("HTTP_INTERCEPTORS");
      let rx = (() => {
        class e {
          intercept(n, r) {
            return r.handle(n);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)();
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const ox = /^\)\]\}',?\n/;
      let Jv = (() => {
        class e {
          constructor(n) {
            this.xhrFactory = n;
          }
          handle(n) {
            if ("JSONP" === n.method)
              throw new Error(
                "Attempted to construct Jsonp request without HttpClientJsonpModule installed.",
              );
            return new ae((r) => {
              const o = this.xhrFactory.build();
              if (
                (o.open(n.method, n.urlWithParams),
                n.withCredentials && (o.withCredentials = !0),
                n.headers.forEach((h, m) => o.setRequestHeader(h, m.join(","))),
                n.headers.has("Accept") ||
                  o.setRequestHeader(
                    "Accept",
                    "application/json, text/plain, */*",
                  ),
                !n.headers.has("Content-Type"))
              ) {
                const h = n.detectContentTypeHeader();
                null !== h && o.setRequestHeader("Content-Type", h);
              }
              if (n.responseType) {
                const h = n.responseType.toLowerCase();
                o.responseType = "json" !== h ? h : "text";
              }
              const i = n.serializeBody();
              let s = null;
              const a = () => {
                  if (null !== s) return s;
                  const h = 1223 === o.status ? 204 : o.status,
                    m = o.statusText || "OK",
                    D = new cn(o.getAllResponseHeaders()),
                    _ =
                      (function (e) {
                        return "responseURL" in e && e.responseURL
                          ? e.responseURL
                          : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
                          ? e.getResponseHeader("X-Request-URL")
                          : null;
                      })(o) || n.url;
                  return (
                    (s = new Mc({
                      headers: D,
                      status: h,
                      statusText: m,
                      url: _,
                    })),
                    s
                  );
                },
                l = () => {
                  let { headers: h, status: m, statusText: D, url: _ } = a(),
                    w = null;
                  204 !== m &&
                    (w = void 0 === o.response ? o.responseText : o.response),
                    0 === m && (m = w ? 200 : 0);
                  let y = m >= 200 && m < 300;
                  if ("json" === n.responseType && "string" == typeof w) {
                    const I = w;
                    w = w.replace(ox, "");
                    try {
                      w = "" !== w ? JSON.parse(w) : null;
                    } catch (O) {
                      (w = I), y && ((y = !1), (w = { error: O, text: w }));
                    }
                  }
                  y
                    ? (r.next(
                        new Ks({
                          body: w,
                          headers: h,
                          status: m,
                          statusText: D,
                          url: _ || void 0,
                        }),
                      ),
                      r.complete())
                    : r.error(
                        new Gv({
                          error: w,
                          headers: h,
                          status: m,
                          statusText: D,
                          url: _ || void 0,
                        }),
                      );
                },
                u = (h) => {
                  const { url: m } = a(),
                    D = new Gv({
                      error: h,
                      status: o.status || 0,
                      statusText: o.statusText || "Unknown Error",
                      url: m || void 0,
                    });
                  r.error(D);
                };
              let c = !1;
              const d = (h) => {
                  c || (r.next(a()), (c = !0));
                  let m = { type: ve.DownloadProgress, loaded: h.loaded };
                  h.lengthComputable && (m.total = h.total),
                    "text" === n.responseType &&
                      !!o.responseText &&
                      (m.partialText = o.responseText),
                    r.next(m);
                },
                f = (h) => {
                  let m = { type: ve.UploadProgress, loaded: h.loaded };
                  h.lengthComputable && (m.total = h.total), r.next(m);
                };
              return (
                o.addEventListener("load", l),
                o.addEventListener("error", u),
                o.addEventListener("timeout", u),
                o.addEventListener("abort", u),
                n.reportProgress &&
                  (o.addEventListener("progress", d),
                  null !== i &&
                    o.upload &&
                    o.upload.addEventListener("progress", f)),
                o.send(i),
                r.next({ type: ve.Sent }),
                () => {
                  o.removeEventListener("error", u),
                    o.removeEventListener("abort", u),
                    o.removeEventListener("load", l),
                    o.removeEventListener("timeout", u),
                    n.reportProgress &&
                      (o.removeEventListener("progress", d),
                      null !== i &&
                        o.upload &&
                        o.upload.removeEventListener("progress", f)),
                    o.readyState !== o.DONE && o.abort();
                }
              );
            });
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(A(_y));
          }),
          (e.ɵprov = V({ token: e, factory: e.ɵfac })),
          e
        );
      })();
      const Ic = new W("XSRF_COOKIE_NAME"),
        Tc = new W("XSRF_HEADER_NAME");
      class Zv {}
      let sx = (() => {
          class e {
            constructor(n, r, o) {
              (this.doc = n),
                (this.platform = r),
                (this.cookieName = o),
                (this.lastCookieString = ""),
                (this.lastToken = null),
                (this.parseCount = 0);
            }
            getToken() {
              if ("server" === this.platform) return null;
              const n = this.doc.cookie || "";
              return (
                n !== this.lastCookieString &&
                  (this.parseCount++,
                  (this.lastToken = fy(n, this.cookieName)),
                  (this.lastCookieString = n)),
                this.lastToken
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(nt), A(ps), A(Ic));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        Ac = (() => {
          class e {
            constructor(n, r) {
              (this.tokenService = n), (this.headerName = r);
            }
            intercept(n, r) {
              const o = n.url.toLowerCase();
              if (
                "GET" === n.method ||
                "HEAD" === n.method ||
                o.startsWith("http://") ||
                o.startsWith("https://")
              )
                return r.handle(n);
              const i = this.tokenService.getToken();
              return (
                null !== i &&
                  !n.headers.has(this.headerName) &&
                  (n = n.clone({ headers: n.headers.set(this.headerName, i) })),
                r.handle(n)
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(Zv), A(Tc));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        ax = (() => {
          class e {
            constructor(n, r) {
              (this.backend = n), (this.injector = r), (this.chain = null);
            }
            handle(n) {
              if (null === this.chain) {
                const r = this.injector.get(Kv, []);
                this.chain = r.reduceRight(
                  (o, i) => new Qv(o, i),
                  this.backend,
                );
              }
              return this.chain.handle(n);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(Hv), A(Fe));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac })),
            e
          );
        })(),
        lx = (() => {
          class e {
            static disable() {
              return {
                ngModule: e,
                providers: [{ provide: Ac, useClass: rx }],
              };
            }
            static withOptions(n = {}) {
              return {
                ngModule: e,
                providers: [
                  n.cookieName ? { provide: Ic, useValue: n.cookieName } : [],
                  n.headerName ? { provide: Tc, useValue: n.headerName } : [],
                ],
              };
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Yt({ type: e })),
            (e.ɵinj = Pt({
              providers: [
                Ac,
                { provide: Kv, useExisting: Ac, multi: !0 },
                { provide: Zv, useClass: sx },
                { provide: Ic, useValue: "XSRF-TOKEN" },
                { provide: Tc, useValue: "X-XSRF-TOKEN" },
              ],
            })),
            e
          );
        })(),
        ux = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Yt({ type: e })),
            (e.ɵinj = Pt({
              providers: [
                Wv,
                { provide: Bv, useClass: ax },
                Jv,
                { provide: Hv, useExisting: Jv },
              ],
              imports: [
                [
                  lx.withOptions({
                    cookieName: "XSRF-TOKEN",
                    headerName: "X-XSRF-TOKEN",
                  }),
                ],
              ],
            })),
            e
          );
        })();
      let Pc = (() => {
          class e {
            constructor(n) {
              this.httpClient = n;
            }
            getapi() {
              return this.httpClient.get(
                "https://inspiring-quotes.p.rapidapi.com/random",
                {
                  headers: {
                    "x-rapidapi-host": "inspiring-quotes.p.rapidapi.com",
                    "x-rapidapi-key":
                      "17ce8a1f04msh4d6ff718c7bb4e8p114aafjsn0ab2e385bd68",
                  },
                },
              );
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(A(Wv));
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        hx = (() => {
          class e {
            constructor(n) {
              (this.apiService = n), (this.isLoading = !0);
            }
            ngOnInit() {
              this.getApi();
            }
            getApi() {
              (this.isLoading = !0),
                this.apiService.getapi().subscribe((n) => {
                  console.log(n), (this.isLoading = !0), (this.apiData = n);
                });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(Pc));
            }),
            (e.ɵcmp = Ae({
              type: e,
              selectors: [["app-api"]],
              decls: 9,
              vars: 2,
              consts: [
                [1, "container2", "scrollto", "clearfix", "argument"],
                [1, "quote"],
              ],
              template: function (n, r) {
                1 & n &&
                  (p(0, "div", 0),
                  p(1, "h2", 1),
                  p(2, "h1"),
                  v(3, "Motivational Quotes from Rapid API:"),
                  g(),
                  p(4, "h5"),
                  v(5),
                  g(),
                  p(6, "aside"),
                  v(7),
                  g(),
                  g(),
                  g(),
                  C(8, "router-outlet")),
                  2 & n &&
                    (E(5),
                    P(null == r.apiData ? null : r.apiData.author),
                    E(2),
                    P(null == r.apiData ? null : r.apiData.quote));
              },
              directives: [qt],
              styles: [
                ".section-title[_ngcontent-%COMP%], button[_ngcontent-%COMP%]{margin-left:50%}p[_ngcontent-%COMP%]{margin-left:20px}aside[_ngcontent-%COMP%]{font-style:italic}.container2[_ngcontent-%COMP%]{z-index:2;background:rgb(255,255,255);line-height:40px;font-weight:lighter;padding:40px;color:#000}.argument[_ngcontent-%COMP%]{animation:changeab 20s infinite}@keyframes changeab{0%,to{background-color:#fff}25%{background-color:#f0f8ff}50%{background-color:azure}75%{background-color:#dcf5ffee}}",
              ],
            })),
            e
          );
        })();
      const px = {
        header: {
          heading: "Mahan Sharifi",
          headingText: "Full Stack Software Developer",
        },
        title: { titleText: "Mahan Sharifi", titleHeader: "About Me" },
        University: {
          title: "University",
          about:
            "Computer Science @ The University of Waterloo. I am currently in my 2B term.",
        },
        tools: {
          title: "Tools",
          about:
            "Git, GitHub, Azure DevOps, VS, VSCode, SQL Server, Agile Methodoligies, Rapid API, BASH SHELL",
        },
        freeTime: {
          title: "Software Developer CO-OP @ Teranet",
          date: "Sep. 2021 -> Dec. 2021",
          about:
            "Developed, wrote, and tested a variety of code. For More Information,",
        },
        lang: {
          title: "Languages",
          about: "C++, C, C#, SQL, CSS/HTML/JS/TS, some Java",
        },
        biq: {
          title: "Biquadris",
          date: "August 2021",
          contentA:
            "-\tFully functional two-player object-oriented Tetris game with no memory leaks, and bonus features.",
          contentB:
            "-\tImplemented a decorator pattern to keep the code clean, easy to manage, and clear.",
          contentC:
            "-\tDesigned an MCV UML Diagram to organize project and understand relationships between each class. ",
          contentD:
            "-\tWorked with two group members over several weeks to accomplish the goal. ",
          caption: "Photo: Biquadris Game, Code Available upon request.",
        },
        contact: {
          title: "Contacts",
          data: "Please reach out to me via any of the social platforms or",
        },
        foot: { f: "Mahan Sharifi-Ghazvin 2021" },
        content: {
          data1:
            "I aspire to be a creative software developer as technology has been a passion of mine since I can remember and I love working backend and frontend. I am motivated to continue learning and expanding my repertoire.",
          data2:
            "I enjoy coding, playing soccer, and hanging out with my family and friend in my free time.",
          data3:
            "For my resume, please contact me via any of the social icons above, or email.",
        },
        dice: {
          title: "LED Dice",
          date: "February 2020",
          contentA:
            "Soldered a 555 time IC (NE555), 4017 counter IC, resistors (5mm: 330 x3, 470, 10k x3), diodes (D035-7), and LEDs (5mm) after having designed a schematic diagram on KiCad to organize the different pathways. The 555 timer provides clock pulses at 5kHz to allow the 4017 counter to have a total of 10 outputs. Output 6 is designed to reset as it is a dice. Battery clip for 9V, DIL sockets for ICs: 8-pin for 555 chip, 16-pin for 4017, push switch, capacitors (5mm, 0,01 uF, 0.1uF), solder.",
          caption: "Photo: Digital Electronic Dice",
        },
        jSon: {
          title: "JSON Parser Validator",
          date: "November 2021",
          tools:
            "C#, Dapper, Stored Procedures (SQL), JSON, VS., .Net Framework, Fluent Email",
          content:
            "Designed a JSON Parser Validator that was later deployed on batch machine using C# (Console app.) by executing stored procedures with Dapper, deserializing the object, and developing a particular set of configuration rules in JSON. Continuously completed functional tests after deployment.",
        },
        biqq: {
          title: "Biquadris",
          date: "August 2021",
          tools: "C++ (OOP), Windows X, X11, Design Patterns",
          content:
            "-\tFully functional two-player object-oriented Tetris game with no memory leaks, and bonus features.",
          contentB: "-\tImplemented a decorator and designed a MVC UML diagram",
        },
        web: {
          title: "Personal Website",
          date: "December 2021",
          tools: "Angular, CSS/HTML/JS/TS, Rapid API",
          content:
            "-\tA cross-platform fully responsive portfolio created with a great understanding of DOM.",
        },
        led: {
          title: "Digital Electronic Dice",
          date: "February 2020",
          tools: "KiCad",
          content:
            "Developed a schematic diagram on KiCad and then soldered in electric pieces to create an LED Dice with sequence designed to begin with output 2 to make the circuit more power efficient.",
        },
        vba: {
          title: "VBA Math Calculator",
          date: "September 2020",
          tools: "VBA, Excel, ActiveX Controls",
          content:
            "-\tDeveloped multiple mathematical calculator using VBA that helps users identify patterns and relationships in correspondence to their inputted data and function.",
          contentB:
            "-\tImplemented ActiveX controls (COM components) to improve ease of use and user functionality.",
        },
        rock: {
          title: "Rock Paper Scissors",
          date: "January 2021",
          tools: "Java",
          content:
            "Rock Paper Scissor game in Java where the user plays with the computer.",
          contentB: "Implemented cases to increase efficiency in code.",
        },
        tech: {
          title: "Tech/Volunteer Experiences",
          sub: "click any of the following below",
        },
        coop: {
          title: "Software Developer @ Teranet Corp.",
          contentA:
            "-\tExperience with all components of SDLC and agile development methodologies - involved in daily SCRUM meetings to keep track of ongoing project statuses.",
          contentB:
            "-\tDeveloped JSON Parser Validation Tool \u2013 wrote, deployed, and tested code.",
          contentC:
            "-\tFixed bugs on front-end webpage regularly on C# and completed analysis by validating Stored Procedures to front-end C# components to help team for future features/tasks.",
          contentD:
            "-\tCompleted integration, and black box testing as well as the daily merge.",
          date: "Fall 2021",
        },
        youth: {
          title: "Kitchener Youth Action Council",
          date: "Co-Chair 2019-2020, Member 2018-2019",
          content:
            "Attended weekly meetings diligently and took part in city council planning meetings. I also helped organize the Kitchener Youth awards in 2019. In 2020 (before Covid) my team and I were creating a workshop to help present the risks of nicotine and vaping to students.",
        },
        robot: {
          title: "First Robotics Club - Team 7722",
          date: "Programmer 2018-2020",
          content:
            "As a member of Resurrection Catholic Secondary Schools FRC Team we won a regional tournament as a rookie team in 2019. I contributed to the drivetrain of the robot in C++ and helped code an autonomous CAN program, involving encoders, and gyro sensors to continuously improve. I also designed an FRC game piece for our team to practice with.",
        },
        deca: {
          title: "Deca @ Resurrection CSS 2019/2020",
          date: "School Executive, Regional Winner",
          content:
            "Placed 1st @ Deca Regionals in Financial Team Decision Making in 2020.",
          contentB: "Participated at regionals.",
          contentC:
            "As a member and executive I created lesson plans for club members and helped developed critical thinking skills for those around me aswell as my self.",
        },
        football: {
          title: "Football For The World (FFTW)",
          date: "Licensed Part Time Coach 2018-2022",
          content:
            "Coached kids ranging from age 5-16 in technical and tactial sessions. My mission is to work with boys and girls of different soccer levels and increase their overall soccer IQ and individual performance on the pitch. By demonstraitng excellent proffesionalism, I have always been prepared for each session, organized teams, ran sessions on my own, distrubted apparal, and completed routinely report cards for each player. Not only do I coach soccer techniques, but my goal is teach respect, honesty, collaberation and care to each player as they continue to grow as players and people.",
        },
        vb: {
          title: "Visual Basics Math Calculator",
          date: "Janaury 2020",
          contentA:
            "Designed a math calculator for reciprocal, radical, and quadratic functions. The buttons were created using activeX controls to complete specific tasks (i.e. clear inputs, calculate inverse/transformation). Mathamtical equations were used on VBA to complete each calculation.",
          contentB:
            "How it works: User picks the function they need and input values in the specific boxes. By clicking a button, the values of each point in the transformation, inverse and other forms of the equation are presented to the user. A graph is also formed to allow the user to understand the image of the function clearly.",
          contentC:
            "Further improvments: Currently working on implementing Epsilon defintions and limits within a new sheet. ",
          caption:
            "Photo: VBA reciprocal code, Quadratic, Radical, and Recirocal sheet",
        },
      };
      let zt = (() => {
          class e {
            constructor() {
              this.config = px;
            }
            getConfig() {
              return this.config;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵprov = V({ token: e, factory: e.ɵfac, providedIn: "root" })),
            e
          );
        })(),
        gx = (() => {
          class e {
            constructor(n) {
              (this.config = n),
                (this.biq = {
                  title: "",
                  date: "",
                  contentA: "",
                  contentB: "",
                  contentC: "",
                  contentD: "",
                  caption: "",
                });
            }
            ngOnInit() {
              this.biq = this.config.getConfig().biq;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(zt));
            }),
            (e.ɵcmp = Ae({
              type: e,
              selectors: [["app-biquadris"]],
              decls: 24,
              vars: 7,
              consts: [
                [1, "container2"],
                ["id", "Biquadris", 1, "quote"],
                ["href", "mailto: mahan9879@gmail.com"],
                [1, "wow", "txt"],
                [
                  "src",
                  "assets/images/gallery-images/biquadris.jpg",
                  1,
                  "responsive",
                ],
                [1, "caption"],
              ],
              template: function (n, r) {
                1 & n &&
                  (p(0, "div", 0),
                  p(1, "div", 1),
                  p(2, "h3"),
                  v(3),
                  p(4, "p"),
                  v(5),
                  g(),
                  g(),
                  p(6, "h6"),
                  v(
                    7,
                    "For access to code, design pdf, and uml, please send me an ",
                  ),
                  p(8, "a", 2),
                  v(9, "email me"),
                  g(),
                  g(),
                  p(10, "p"),
                  v(11),
                  C(12, "br"),
                  v(13),
                  C(14, "br"),
                  v(15),
                  C(16, "br"),
                  v(17),
                  C(18, "br"),
                  g(),
                  p(19, "p", 3),
                  C(20, "img", 4),
                  g(),
                  p(21, "p", 5),
                  C(22, "br"),
                  v(23),
                  g(),
                  g(),
                  g()),
                  2 & n &&
                    (E(3),
                    P(r.biq.title),
                    E(2),
                    P(r.biq.date),
                    E(6),
                    N("", r.biq.contentA, " "),
                    E(2),
                    N(" ", r.biq.contentB, ""),
                    E(2),
                    N(" ", r.biq.contentC, " "),
                    E(2),
                    N(" ", r.biq.contentD, " "),
                    E(6),
                    P(r.biq.caption));
              },
              styles: [
                ".container2[_ngcontent-%COMP%]{z-index:2;background:rgb(255,255,255);line-height:40px;font-weight:lighter;padding:40px;color:#000;font-family:Open Sans,sans-serif,Arial,Helvetica}.container2[_ngcontent-%COMP%]{padding:10em 2em 2em;grid-gap:2em}.responsive[_ngcontent-%COMP%]{width:50%;height:auto}h3[_ngcontent-%COMP%]{padding-bottom:0!important;margin-bottom:0!important}h6[_ngcontent-%COMP%]{padding-top:0!important;margin-top:0!important}",
              ],
            })),
            e
          );
        })(),
        Yv = (() => {
          class e {
            constructor(n) {
              (this.config = n), (this.contact = { title: "", data: "" });
            }
            ngOnInit() {
              this.contact = this.config.getConfig().contact;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(zt));
            }),
            (e.ɵcmp = Ae({
              type: e,
              selectors: [["app-contact"]],
              decls: 21,
              vars: 2,
              consts: [
                [1, "container2"],
                ["id", "contact", 1, ""],
                [1, "argument", "txt"],
                ["href", "mailto: mahan9879@gmail.com"],
                [1, "social-icons"],
                [
                  "target",
                  "_blank",
                  "title",
                  "GitHub",
                  "href",
                  "https://github.com/MahanSharifi",
                ],
                [1, "fa", "fa-github"],
                [
                  "target",
                  "_blank",
                  "title",
                  "Linkedin",
                  "href",
                  "https://www.linkedin.com/in/mahan-sharifi-05447b1ab/",
                ],
                [1, "fa", "fa-linkedin", "fa-1x"],
              ],
              template: function (n, r) {
                1 & n &&
                  (p(0, "div", 0),
                  p(1, "section", 1),
                  p(2, "div", 2),
                  p(3, "h1"),
                  v(4),
                  g(),
                  p(5, "p"),
                  v(6),
                  p(7, "a", 3),
                  v(8, " email me"),
                  g(),
                  g(),
                  p(9, "ul", 4),
                  p(10, "li"),
                  p(11, "a", 5),
                  C(12, "i", 6),
                  p(13, "span"),
                  v(14, "GitHub"),
                  g(),
                  g(),
                  g(),
                  p(15, "li"),
                  p(16, "a", 7),
                  C(17, "i", 8),
                  p(18, "span"),
                  v(19, "Linkedin"),
                  g(),
                  g(),
                  g(),
                  g(),
                  g(),
                  g(),
                  g(),
                  C(20, "router-outlet")),
                  2 & n && (E(4), P(r.contact.title), E(2), P(r.contact.data));
              },
              directives: [qt],
              styles: [
                ".container2[_ngcontent-%COMP%]{z-index:2;background:rgb(255,255,255);line-height:40px;font-weight:lighter;padding:40px;color:#000;font-family:Open Sans,sans-serif,Arial,Helvetica}.container2[_ngcontent-%COMP%]{padding:10em 2em 2em;grid-gap:2em}.social-icons[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:none}.social-icons[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:hover{color:#fff!important}li[_ngcontent-%COMP%]{display:inline-block;list-style:none;margin:0}.social-icons[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{position:relative;display:block;width:30px;height:30px;margin:0 10px 0 0;border-radius:50%;text-align:center;line-height:30px;transition:.6s;box-shadow:0 5px 4px #00000080}.social-icons[_ngcontent-%COMP%]{display:inline-block;list-style:none}.social-icons[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:inline-block;width:32px;text-align:center;color:#639}.social-icons[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{transform:translateY(-10px)}.social-icons[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(1)   a[_ngcontent-%COMP%]:hover{background-color:#171515}.social-icons[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(2)   a[_ngcontent-%COMP%]:hover{background-color:#0077b5}",
              ],
            })),
            e
          );
        })(),
        mx = (() => {
          class e {
            constructor(n) {
              (this.config = n),
                (this.header = { heading: "", headingText: "" });
            }
            ngOnInit() {
              this.header = this.config.getConfig().header;
            }
            getHeader() {
              return this.config.getConfig().header;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(zt));
            }),
            (e.ɵcmp = Ae({
              type: e,
              selectors: [["app-header"]],
              decls: 11,
              vars: 2,
              consts: [
                [
                  "id",
                  "navHeader",
                  "data-enllax-ratio",
                  "0.5",
                  1,
                  "scrollto",
                  "clearfix",
                ],
                ["id", "navBanner-content", 1, "argument", "clearfix"],
                [1, "coll-Head"],
                [1, "headSection"],
                [1, "typewriter"],
                [1, "wow", "animate__animated", "animate__hinge"],
                ["href", "mailto: mahan9879@gmail.com", 1, "button"],
              ],
              template: function (n, r) {
                1 & n &&
                  (p(0, "header", 0),
                  p(1, "div", 1),
                  p(2, "div", 2),
                  p(3, "div", 3),
                  p(4, "h1", 4),
                  v(5),
                  g(),
                  p(6, "h2", 5),
                  v(7),
                  g(),
                  g(),
                  p(8, "a", 6),
                  v(9, "Email Me"),
                  g(),
                  g(),
                  g(),
                  g(),
                  C(10, "router-outlet")),
                  2 & n &&
                    (E(5), P(r.header.heading), E(2), P(r.header.headingText));
              },
              directives: [qt],
              styles: [
                '.coll-Head[_ngcontent-%COMP%]{width:50%!important;text-align:center!important;margin-left:25%;margin-right:25%;margin-top:5%}.typewriter[_ngcontent-%COMP%]{color:#fff;font-family:monospace;overflow:hidden;border-right:.15em solid rebeccapurple;white-space:nowrap;margin:0 auto;letter-spacing:.15em;animation:typing 3.5s steps(30,end),blink-caret .5s step-end infinite}@keyframes typing{0%{width:0}to{width:100%}}@keyframes blink-caret{0%,to{border-color:transparent}50%{border-color:#639}}.button[_ngcontent-%COMP%]{font-size:16px;margin:35px 0;padding:11px 16px;transition:.3s;display:inline-block;border-width:3px;border-style:solid;color:#639}.button[_ngcontent-%COMP%]:hover{transform:translateY(-10px)}[class*=coll-][_ngcontent-%COMP%]{text-align:center}.headSection[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]:before{background:rebeccapurple;content:"";display:block;width:30px;height:5.3px;margin-bottom:30px}',
              ],
            })),
            e
          );
        })(),
        Xv = (() => {
          class e {
            constructor(n) {
              (this.config = n),
                (this.title = { titleText: "", titleHeader: "" }),
                (this.University = { title: "", about: "" }),
                (this.tools = { title: "", about: "" }),
                (this.freeTime = { title: "", date: "", about: "" }),
                (this.lang = { title: "", about: "" }),
                (this.content = { data1: "", data2: "", data3: "" });
            }
            ngOnInit() {
              (this.title = this.config.getConfig().title),
                (this.University = this.config.getConfig().University),
                (this.tools = this.config.getConfig().tools),
                (this.freeTime = this.config.getConfig().freeTime),
                (this.lang = this.config.getConfig().lang),
                (this.content = this.config.getConfig().content);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(zt));
            }),
            (e.ɵcmp = Ae({
              type: e,
              selectors: [["app-intro"]],
              decls: 55,
              vars: 14,
              consts: [
                ["id", "about", 1, "container", "txt", "scrollto"],
                [1, "argument", "clearfix"],
                [1, "col-about"],
                [1, "aboutTitle"],
                [1, "col-about-content"],
                [
                  "data-wow-delay",
                  "0.1s",
                  1,
                  "col-content",
                  "wow",
                  "animate__animated",
                  "animate__pulse",
                  "quote3",
                ],
                [1, "iconAbout"],
                [1, "fas", "fa-university", "fa-2x"],
                [
                  "data-wow-delay",
                  "0.3s",
                  1,
                  "col-content",
                  "wow",
                  "animate__animated",
                  "animate__pulse",
                  "quote3",
                ],
                [1, "fas", "fa-toolbox", "fa-2x"],
                [
                  "data-wow-delay",
                  "0.5s",
                  1,
                  "col-content",
                  "wow",
                  "animate__animated",
                  "animate__pulse",
                  "quote3",
                ],
                [1, "fas", "fa-microchip", "fa-2x"],
                ["routerLink", "/TECH"],
                [
                  "data-wow-delay",
                  "0.7s",
                  1,
                  "col-content",
                  "wow",
                  "animate__animated",
                  "animate__pulse",
                  "quote3",
                ],
                [1, "fas", "fa-code", "fa-2x"],
              ],
              template: function (n, r) {
                1 & n &&
                  (p(0, "router-outlet"),
                  p(1, "section", 0),
                  p(2, "div", 1),
                  p(3, "div", 2),
                  p(4, "div"),
                  p(5, "h3"),
                  v(6),
                  g(),
                  p(7, "h2", 3),
                  v(8),
                  g(),
                  p(9, "p"),
                  v(10),
                  C(11, "br"),
                  C(12, "br"),
                  v(13),
                  C(14, "br"),
                  C(15, "br"),
                  v(16),
                  g(),
                  g(),
                  g(),
                  p(17, "div", 4),
                  p(18, "div", 5),
                  p(19, "div", 6),
                  C(20, "i", 7),
                  g(),
                  p(21, "div"),
                  p(22, "h4"),
                  v(23),
                  g(),
                  p(24, "p"),
                  v(25),
                  g(),
                  g(),
                  g(),
                  p(26, "div", 8),
                  p(27, "div", 6),
                  C(28, "i", 9),
                  g(),
                  p(29, "div"),
                  p(30, "h4"),
                  v(31),
                  g(),
                  p(32, "p"),
                  v(33),
                  g(),
                  g(),
                  g(),
                  p(34, "div", 10),
                  p(35, "div", 6),
                  C(36, "i", 11),
                  g(),
                  p(37, "div"),
                  p(38, "h4"),
                  v(39),
                  g(),
                  p(40, "p"),
                  v(41),
                  g(),
                  p(42, "p"),
                  v(43),
                  C(44, "br"),
                  p(45, "a", 12),
                  v(46, "CLICK ME"),
                  g(),
                  g(),
                  g(),
                  g(),
                  p(47, "div", 13),
                  p(48, "div", 6),
                  C(49, "i", 14),
                  g(),
                  p(50, "div"),
                  p(51, "h4"),
                  v(52),
                  g(),
                  p(53, "p"),
                  v(54),
                  g(),
                  g(),
                  g(),
                  g(),
                  g(),
                  g(),
                  g()),
                  2 & n &&
                    (E(6),
                    P(r.title.titleText),
                    E(2),
                    P(r.title.titleHeader),
                    E(2),
                    N(" ", r.content.data1, " "),
                    E(3),
                    N(" ", r.content.data2, " "),
                    E(3),
                    N(" ", r.content.data3, " "),
                    E(7),
                    P(r.University.title),
                    E(2),
                    P(r.University.about),
                    E(6),
                    P(r.tools.title),
                    E(2),
                    P(r.tools.about),
                    E(6),
                    P(r.freeTime.title),
                    E(2),
                    P(r.freeTime.date),
                    E(2),
                    N("", r.freeTime.about, " "),
                    E(9),
                    P(r.lang.title),
                    E(2),
                    P(r.lang.about));
              },
              directives: [qt, Kr],
              styles: [
                ".introduction[_ngcontent-%COMP%]   img.featured[_ngcontent-%COMP%]{padding:55px 0 0}.quote3[_ngcontent-%COMP%]{background-color:#fff;padding:2em;border-radius:1em;box-shadow:10px 10px 30px #0000004d;margin:1em;width:40%}",
              ],
            })),
            e
          );
        })(),
        yx = (() => {
          class e {
            constructor(n) {
              (this.config = n),
                (this.dice = {
                  title: "",
                  date: "",
                  contentA: "",
                  caption: "",
                });
            }
            ngOnInit() {
              this.dice = this.config.getConfig().dice;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(zt));
            }),
            (e.ɵcmp = Ae({
              type: e,
              selectors: [["app-leddice"]],
              decls: 13,
              vars: 4,
              consts: [
                [1, "container2"],
                ["id", "LEDDice", 1, "quote"],
                [1, "wow"],
                ["src", "assets/images/gallery-images/ED.jpg", 1, "responsive"],
                [1, "caption"],
              ],
              template: function (n, r) {
                1 & n &&
                  (p(0, "div", 0),
                  p(1, "div", 1),
                  p(2, "h3"),
                  v(3),
                  p(4, "p"),
                  v(5),
                  g(),
                  g(),
                  p(6, "p"),
                  v(7),
                  g(),
                  p(8, "p", 2),
                  C(9, "img", 3),
                  g(),
                  p(10, "p", 4),
                  C(11, "br"),
                  v(12),
                  g(),
                  g(),
                  g()),
                  2 & n &&
                    (E(3),
                    N("", r.dice.title, "s"),
                    E(2),
                    P(r.dice.date),
                    E(2),
                    N("", r.dice.contentA, " "),
                    E(5),
                    P(r.dice.caption));
              },
              styles: [
                ".container2[_ngcontent-%COMP%]{z-index:2;background:rgb(255,255,255);line-height:40px;font-weight:lighter;padding:40px;color:#000;font-family:Open Sans,sans-serif,Arial,Helvetica}.container2[_ngcontent-%COMP%]{padding:10em 2em 2em;grid-gap:2em}",
              ],
            })),
            e
          );
        })(),
        eD = (() => {
          class e {
            constructor(n) {
              (this.config = n),
                (this.jSon = { title: "", date: "", tools: "", content: "" }),
                (this.biqq = {
                  title: "",
                  date: "",
                  tools: "",
                  content: "",
                  contentB: "",
                }),
                (this.web = { title: "", date: "", tools: "", content: "" }),
                (this.led = { title: "", date: "", tools: "", content: "" }),
                (this.vba = {
                  title: "",
                  date: "",
                  tools: "",
                  content: "",
                  contentB: "",
                }),
                (this.rock = {
                  title: "",
                  date: "",
                  tools: "",
                  content: "",
                  contentB: "",
                });
            }
            ngOnInit() {
              (this.jSon = this.config.getConfig().jSon),
                (this.biqq = this.config.getConfig().biqq),
                (this.web = this.config.getConfig().web),
                (this.led = this.config.getConfig().led),
                (this.vba = this.config.getConfig().vba),
                (this.rock = this.config.getConfig().rock);
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(zt));
            }),
            (e.ɵcmp = Ae({
              type: e,
              selectors: [["app-projects"]],
              decls: 131,
              vars: 27,
              consts: [
                [
                  "id",
                  "Projects",
                  "data-enllax-ratio",
                  "0.2",
                  1,
                  "txt",
                  "scrollto",
                  "clearfix",
                ],
                ["data-enllax-ratio", "0.2", 1, "argument", "clearfix"],
                [1, "cont"],
                [
                  "data-wow-delay",
                  "0.4s",
                  1,
                  "projBox",
                  "col-about",
                  "wow",
                  "animate__animated",
                  "animate__pulse",
                ],
                [1, "projBoxContent"],
                [1, "projSub"],
                [1, "projContent"],
                [1, ""],
                ["src", "assets/images/gallery-images/JsonParser.jpg"],
                [1, "gitHub"],
                [
                  "data-wow-delay",
                  "0.6s",
                  1,
                  "projBox",
                  "col-about",
                  "wow",
                  "animate__animated",
                  "animate__pulse",
                ],
                ["routerLink", "/Biquadris"],
                ["src", "assets/images/gallery-images/biquadris.jpg"],
                [
                  "data-wow-delay",
                  "0.8s",
                  1,
                  "projBox",
                  "col-about",
                  "wow",
                  "animate__animated",
                  "animate__pulse",
                ],
                ["src", "assets/images/gallery-images/personalWeb.jpg"],
                [
                  "target",
                  "_blank",
                  "title",
                  "GitHub",
                  "href",
                  "https://github.com/MahanSharifi/PersonalWebsite3.0",
                ],
                [1, "fa", "fa-github", "fa-2x"],
                [1, "cont2"],
                [
                  "data-wow-delay",
                  "1.0s",
                  1,
                  "projBox",
                  "col-about",
                  "wow",
                  "animate__animated",
                  "animate__pulse",
                ],
                ["routerLink", "/LEDDice"],
                ["src", "assets/images/gallery-images/ED.jpg"],
                [
                  "target",
                  "_blank",
                  "title",
                  "GitHub",
                  "href",
                  "https://github.com/MahanSharifi/LED-Dice",
                ],
                [
                  "data-wow-delay",
                  "1.2s",
                  1,
                  "projBox",
                  "col-about",
                  "wow",
                  "animate__animated",
                  "animate__pulse",
                ],
                ["routerLink", "/VBA"],
                ["src", "assets/images/gallery-images/quad grid.jpg"],
                [
                  "target",
                  "_blank",
                  "title",
                  "GitHub",
                  "href",
                  "https://github.com/MahanSharifi/VBA-Math-Calculator",
                ],
                [
                  "data-wow-delay",
                  "1.4s",
                  1,
                  "projBox",
                  "col-about",
                  "wow",
                  "animate__animated",
                  "animate__pulse",
                ],
                [
                  "target",
                  "_blank",
                  "title",
                  "GitHub",
                  "href",
                  "https://github.com/MahanSharifi/Rock-Paper-Scissors",
                ],
              ],
              template: function (n, r) {
                1 & n &&
                  (p(0, "section", 0),
                  p(1, "div", 1),
                  p(2, "div"),
                  p(3, "h3"),
                  v(4, ":)(:"),
                  g(),
                  p(5, "h2"),
                  v(6, "Projects"),
                  g(),
                  p(7, "h6"),
                  v(
                    8,
                    "CLICK GITHUB FOR CODE OR CLICK PROJECT BOX FOR MORE DETAIL",
                  ),
                  g(),
                  g(),
                  p(9, "div", 2),
                  p(10, "div", 3),
                  p(11, "div", 4),
                  p(12, "h3"),
                  v(13),
                  g(),
                  p(14, "h6"),
                  v(15),
                  g(),
                  p(16, "p", 5),
                  v(17),
                  g(),
                  p(18, "div", 6),
                  p(19, "div", 7),
                  C(20, "img", 8),
                  g(),
                  p(21, "p"),
                  v(22),
                  C(23, "br"),
                  C(24, "br"),
                  C(25, "br"),
                  g(),
                  v(26, " CODE AVAILABLE UPON REQUEST "),
                  C(27, "BR"),
                  g(),
                  C(28, "div", 9),
                  g(),
                  g(),
                  p(29, "div", 10),
                  p(30, "div", 4),
                  p(31, "a", 11),
                  p(32, "h3"),
                  v(33),
                  g(),
                  p(34, "h6"),
                  v(35),
                  g(),
                  p(36, "p", 5),
                  v(37),
                  g(),
                  p(38, "div", 6),
                  p(39, "div", 7),
                  C(40, "img", 12),
                  g(),
                  p(41, "p"),
                  v(42),
                  C(43, "br"),
                  v(44),
                  C(45, "br"),
                  C(46, "br"),
                  C(47, "br"),
                  g(),
                  v(48, " CODE AVAILABLE UPON REQUEST "),
                  g(),
                  g(),
                  C(49, "div", 9),
                  g(),
                  g(),
                  p(50, "div", 13),
                  p(51, "div", 4),
                  p(52, "h3"),
                  v(53),
                  g(),
                  p(54, "h6"),
                  v(55),
                  g(),
                  p(56, "p", 5),
                  v(57),
                  g(),
                  p(58, "div", 6),
                  p(59, "div", 7),
                  C(60, "img", 14),
                  g(),
                  p(61, "p"),
                  v(62),
                  C(63, "br"),
                  C(64, "br"),
                  C(65, "br"),
                  g(),
                  v(66, " AS SEEN :) "),
                  g(),
                  p(67, "div", 9),
                  p(68, "a", 15),
                  C(69, "i", 16),
                  g(),
                  g(),
                  g(),
                  g(),
                  g(),
                  p(70, "div", 17),
                  p(71, "div", 18),
                  p(72, "div", 4),
                  p(73, "a", 19),
                  p(74, "h3"),
                  v(75),
                  g(),
                  p(76, "h6"),
                  v(77),
                  g(),
                  p(78, "p", 5),
                  v(79),
                  g(),
                  p(80, "div", 6),
                  p(81, "div", 7),
                  C(82, "img", 20),
                  g(),
                  p(83, "p"),
                  v(84),
                  g(),
                  C(85, "br"),
                  C(86, "br"),
                  v(87, " CLICK ME FOR MORE "),
                  g(),
                  g(),
                  p(88, "div", 9),
                  p(89, "a", 21),
                  C(90, "i", 16),
                  g(),
                  g(),
                  g(),
                  g(),
                  p(91, "div", 22),
                  p(92, "div", 4),
                  p(93, "a", 23),
                  p(94, "h3"),
                  v(95),
                  g(),
                  p(96, "h6"),
                  v(97),
                  g(),
                  p(98, "p", 5),
                  v(99),
                  g(),
                  p(100, "div", 6),
                  p(101, "div", 7),
                  C(102, "img", 24),
                  g(),
                  p(103, "p"),
                  v(104),
                  C(105, "br"),
                  v(106),
                  C(107, "br"),
                  g(),
                  C(108, "br"),
                  C(109, "br"),
                  v(110, " CLICK ME FOR MORE "),
                  g(),
                  g(),
                  p(111, "div", 9),
                  p(112, "a", 25),
                  C(113, "i", 16),
                  g(),
                  g(),
                  g(),
                  g(),
                  p(114, "div", 26),
                  p(115, "div", 4),
                  p(116, "h3"),
                  v(117),
                  g(),
                  p(118, "h6"),
                  v(119),
                  g(),
                  p(120, "p", 5),
                  v(121),
                  g(),
                  p(122, "div", 6),
                  p(123, "p"),
                  v(124),
                  C(125, "br"),
                  v(126),
                  g(),
                  g(),
                  p(127, "div", 9),
                  p(128, "a", 27),
                  C(129, "i", 16),
                  g(),
                  g(),
                  g(),
                  g(),
                  g(),
                  g(),
                  g(),
                  C(130, "router-outlet")),
                  2 & n &&
                    (E(13),
                    P(r.jSon.title),
                    E(2),
                    P(r.jSon.date),
                    E(2),
                    P(r.jSon.tools),
                    E(5),
                    N("", r.jSon.content, " "),
                    E(11),
                    P(r.biqq.title),
                    E(2),
                    P(r.biqq.date),
                    E(2),
                    P(r.biqq.tools),
                    E(5),
                    P(r.biqq.content),
                    E(2),
                    N(" ", r.biqq.contentB, ""),
                    E(9),
                    N("", r.web.title, " "),
                    E(2),
                    P(r.web.date),
                    E(2),
                    N(" ", r.web.tools, " "),
                    E(5),
                    N("", r.web.content, " "),
                    E(13),
                    P(r.led.title),
                    E(2),
                    P(r.led.date),
                    E(2),
                    N(" ", r.led.tools, " "),
                    E(5),
                    P(r.led.content),
                    E(11),
                    N("", r.vba.title, " "),
                    E(2),
                    P(r.vba.date),
                    E(2),
                    N("", r.vba.tools, " "),
                    E(5),
                    P(r.vba.content),
                    E(2),
                    N(" ", r.vba.contentB, ""),
                    E(11),
                    N("", r.rock.title, " "),
                    E(2),
                    P(r.rock.date),
                    E(2),
                    N("", r.rock.tools, " "),
                    E(3),
                    N("", r.rock.content, " "),
                    E(2),
                    N(" ", r.rock.contentB, ""));
              },
              directives: [Kr, qt],
              styles: [
                ".projBoxContent[_ngcontent-%COMP%]{background:#fff;padding:0;box-shadow:0 1px 100px #00000012;position:relative;border-top:10px solid #fff;border-bottom:10px solid #fff;border-right:10px solid #fff;border-left:10px solid #fff}.projBox[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:17px;text-transform:uppercase;padding-bottom:0}.projSub[_ngcontent-%COMP%]{font-style:italic;color:#ccc;margin:10px 0 25px}.projContent[_ngcontent-%COMP%]{background:#f5f5f5;padding:25px;position:relative;min-height:400px;color:#639}.projContent[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-style:italic;color:#b4b4b4;line-height:auto;margin:0;text-align:left}.gitHub[_ngcontent-%COMP%]{padding:10px;position:relative;background-color:#639;width:100%;margin-left:0%}.gitHub[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{color:azure}.cont[_ngcontent-%COMP%], .cont2[_ngcontent-%COMP%]{display:inline-block}h6[_ngcontent-%COMP%]{color:#639}",
              ],
            })),
            e
          );
        })();
      const ii = function (e) {
        return { display: e };
      };
      let tD = (() => {
        class e {
          constructor(n) {
            (this.config = n),
              (this.display0 = "none"),
              (this.display = "none"),
              (this.display2 = "none"),
              (this.display3 = "none"),
              (this.display4 = "none"),
              (this.tech = { title: "", sub: "" }),
              (this.coop = {
                title: "",
                contentA: "",
                contentB: "",
                contentC: "",
                contentD: "",
                date: "",
              }),
              (this.youth = { title: "", date: "", content: "" }),
              (this.robot = { title: "", date: "", content: "" }),
              (this.deca = {
                title: "",
                date: "",
                content: "",
                contentB: "",
                contentC: "",
              }),
              (this.football = { title: "", date: "", content: "" });
          }
          openModal0() {
            this.display0 = "block";
          }
          openModal() {
            this.display = "block";
          }
          openModal2() {
            this.display2 = "block";
          }
          openModal3() {
            this.display3 = "block";
          }
          openModal4() {
            this.display4 = "block";
          }
          onCloseHandled0() {
            this.display0 = "none";
          }
          onCloseHandled() {
            this.display = "none";
          }
          onCloseHandled2() {
            this.display2 = "none";
          }
          onCloseHandled3() {
            this.display3 = "none";
          }
          onCloseHandled4() {
            this.display4 = "none";
          }
          ngOnInit() {
            (this.coop = this.config.getConfig().coop),
              (this.tech = this.config.getConfig().tech),
              (this.youth = this.config.getConfig().youth),
              (this.robot = this.config.getConfig().robot),
              (this.deca = this.config.getConfig().deca),
              (this.football = this.config.getConfig().football);
          }
        }
        return (
          (e.ɵfac = function (n) {
            return new (n || e)(T(zt));
          }),
          (e.ɵcmp = Ae({
            type: e,
            selectors: [["app-tech-experiences"]],
            decls: 111,
            vars: 45,
            consts: [
              ["id", "TECH", 1, "container2", "txt"],
              [1, "modal2", 3, "ngStyle"],
              [1, "modal-dialog"],
              [1, "modal-content"],
              [1, "modal-header"],
              [1, "modal-title"],
              ["type", "button", "aria-label", "Close", 1, "close", 3, "click"],
              ["aria-hidden", "true"],
              [1, "modal-body"],
              [1, "modal-footer"],
              [
                "id",
                "button2",
                "data-wow-delay",
                "0.4s",
                "type",
                "button",
                1,
                "quote",
                "wow",
                "animate__animated",
                "animate__pulse",
                3,
                "click",
              ],
              [1, "modal", 3, "ngStyle"],
              [
                "data-wow-delay",
                "0.6s",
                "id",
                "button",
                "type",
                "button",
                1,
                "quote",
                "wow",
                "animate__animated",
                "animate__pulse",
                3,
                "click",
              ],
              [
                "data-wow-delay",
                "0.8s",
                "id",
                "button",
                "type",
                "button",
                1,
                "quote",
                "wow",
                "animate__animated",
                "animate__pulse",
                3,
                "click",
              ],
              [1, "modal-body", "quote"],
              [
                "data-wow-delay",
                "1.0s",
                "id",
                "button",
                "type",
                "button",
                1,
                "quote",
                "wow",
                "animate__animated",
                "animate__pulse",
                3,
                "click",
              ],
              [
                "data-wow-delay",
                "1.2s",
                "id",
                "button",
                "type",
                "button",
                1,
                "quote",
                "wow",
                "animate__animated",
                "animate__pulse",
                3,
                "click",
              ],
            ],
            template: function (n, r) {
              1 & n &&
                (p(0, "div", 0),
                p(1, "h1"),
                v(2),
                g(),
                p(3, "h6"),
                v(4),
                g(),
                p(5, "div", 1),
                p(6, "div", 2),
                p(7, "div", 3),
                p(8, "div", 4),
                p(9, "h4", 5),
                v(10),
                C(11, "br"),
                v(12),
                g(),
                p(13, "button", 6),
                Ve("click", function () {
                  return r.onCloseHandled0();
                }),
                p(14, "span", 7),
                v(15, "\xd7"),
                g(),
                g(),
                g(),
                p(16, "div", 8),
                p(17, "p"),
                v(18),
                C(19, "br"),
                v(20),
                C(21, "br"),
                v(22),
                C(23, "br"),
                v(24),
                g(),
                g(),
                C(25, "div", 9),
                g(),
                g(),
                g(),
                p(26, "button", 10),
                Ve("click", function () {
                  return r.openModal0();
                }),
                v(27),
                C(28, "br"),
                v(29),
                g(),
                p(30, "div", 11),
                p(31, "div", 2),
                p(32, "div", 3),
                p(33, "div", 4),
                p(34, "h4", 5),
                v(35),
                C(36, "br"),
                v(37),
                g(),
                p(38, "button", 6),
                Ve("click", function () {
                  return r.onCloseHandled();
                }),
                p(39, "span", 7),
                v(40, "\xd7"),
                g(),
                g(),
                g(),
                p(41, "div", 8),
                p(42, "p"),
                v(43),
                g(),
                g(),
                C(44, "div", 9),
                g(),
                g(),
                g(),
                p(45, "button", 12),
                Ve("click", function () {
                  return r.openModal();
                }),
                v(46),
                C(47, "br"),
                v(48),
                g(),
                p(49, "div", 11),
                p(50, "div", 2),
                p(51, "div", 3),
                p(52, "div", 4),
                p(53, "h4", 5),
                v(54),
                C(55, "br"),
                v(56),
                g(),
                p(57, "button", 6),
                Ve("click", function () {
                  return r.onCloseHandled2();
                }),
                p(58, "span", 7),
                v(59, "\xd7"),
                g(),
                g(),
                g(),
                p(60, "div", 8),
                p(61, "p"),
                v(62),
                g(),
                g(),
                C(63, "div", 9),
                g(),
                g(),
                g(),
                p(64, "button", 13),
                Ve("click", function () {
                  return r.openModal2();
                }),
                v(65),
                C(66, "br"),
                v(67),
                g(),
                p(68, "div", 11),
                p(69, "div", 2),
                p(70, "div", 3),
                p(71, "div", 4),
                p(72, "h4", 5),
                v(73),
                C(74, "br"),
                v(75),
                g(),
                p(76, "button", 6),
                Ve("click", function () {
                  return r.onCloseHandled3();
                }),
                p(77, "span", 7),
                v(78, "\xd7"),
                g(),
                g(),
                g(),
                p(79, "div", 14),
                p(80, "p"),
                v(81),
                C(82, "br"),
                v(83),
                C(84, "br"),
                v(85),
                g(),
                g(),
                C(86, "div", 9),
                g(),
                g(),
                g(),
                p(87, "button", 15),
                Ve("click", function () {
                  return r.openModal3();
                }),
                v(88, "Deca @ Resurrection CSS 2019/2020"),
                C(89, "br"),
                v(90, " School Executive, Regional Winner"),
                g(),
                p(91, "div", 11),
                p(92, "div", 2),
                p(93, "div", 3),
                p(94, "div", 4),
                p(95, "h4", 5),
                v(96),
                C(97, "br"),
                v(98),
                g(),
                p(99, "button", 6),
                Ve("click", function () {
                  return r.onCloseHandled4();
                }),
                p(100, "span", 7),
                v(101, "\xd7"),
                g(),
                g(),
                g(),
                p(102, "div", 8),
                p(103, "p"),
                v(104),
                g(),
                g(),
                C(105, "div", 9),
                g(),
                g(),
                g(),
                p(106, "button", 16),
                Ve("click", function () {
                  return r.openModal4();
                }),
                v(107),
                C(108, "br"),
                v(109),
                g(),
                g(),
                C(110, "router-outlet")),
                2 & n &&
                  (E(2),
                  P(r.tech.title),
                  E(2),
                  P(r.tech.sub),
                  E(1),
                  Cn("ngStyle", Br(35, ii, r.display0)),
                  E(5),
                  P(r.coop.title),
                  E(2),
                  N(" ", r.coop.date, ""),
                  E(6),
                  N(" ", r.coop.contentA, ""),
                  E(2),
                  N(" ", r.coop.contentB, " "),
                  E(2),
                  N(" ", r.coop.contentC, ""),
                  E(2),
                  N(" ", r.coop.contentD, " "),
                  E(3),
                  P(r.coop.title),
                  E(2),
                  N(" ", r.coop.date, ""),
                  E(1),
                  Cn("ngStyle", Br(37, ii, r.display)),
                  E(5),
                  N("", r.youth.title, " "),
                  E(2),
                  N(" ", r.youth.date, ""),
                  E(6),
                  P(r.youth.content),
                  E(3),
                  N("", r.youth.title, " "),
                  E(2),
                  N(" ", r.youth.date, ""),
                  E(1),
                  Cn("ngStyle", Br(39, ii, r.display2)),
                  E(5),
                  P(r.robot.title),
                  E(2),
                  N(" ", r.robot.date, ""),
                  E(6),
                  P(r.robot.content),
                  E(3),
                  N("", r.robot.title, " "),
                  E(2),
                  N(" ", r.robot.date, ""),
                  E(1),
                  Cn("ngStyle", Br(41, ii, r.display3)),
                  E(5),
                  P(r.deca.title),
                  E(2),
                  N(" ", r.deca.date, ""),
                  E(6),
                  P(r.deca.content),
                  E(2),
                  N(" ", r.deca.contentB, " "),
                  E(2),
                  N(" ", r.deca.contentC, ""),
                  E(6),
                  Cn("ngStyle", Br(43, ii, r.display4)),
                  E(5),
                  P(r.football.title),
                  E(2),
                  N(" ", r.football.date, " "),
                  E(6),
                  P(r.football.content),
                  E(3),
                  P(r.football.title),
                  E(2),
                  N(" ", r.football.date, " "));
            },
            directives: [my, qt],
            styles: [
              "button[_ngcontent-%COMP%]{display:relative;background-color:#37313b;color:#fff}#button2[_ngcontent-%COMP%]{background-color:#fff!important;color:#000}h4[_ngcontent-%COMP%]{color:#fff}.modal-header[_ngcontent-%COMP%]{padding:2px 16px;background-color:#37313b;color:#fff}.modal-body[_ngcontent-%COMP%]{padding:10px 16px;color:#000}.modal-footer[_ngcontent-%COMP%]{padding:10px 16px;background-color:#37313b;color:#fff}.modal-content[_ngcontent-%COMP%]{position:relative;background-color:#fefefe;margin:auto;padding:0;border:1px solid rgb(0,0,0);width:80%;box-shadow:0 4px 8px #0003,0 6px 20px #00000030;animation-name:animatetop;animation-duration:.4s;color:#fefefe}.quote[_ngcontent-%COMP%]:hover{opacity:30%}@keyframes animatetop{0%{top:-800px;opacity:0}to{top:0px;opacity:1}}.container2[_ngcontent-%COMP%]   .quote[_ngcontent-%COMP%]{margin-left:30px!important;margin-bottom:20px}.container2[_ngcontent-%COMP%]{z-index:2;background:rgb(255,255,255);line-height:40px;font-weight:lighter;padding:40px;color:#000;font-family:Open Sans,sans-serif,Arial,Helvetica}.container2[_ngcontent-%COMP%]{padding:10em 2em 2em;grid-gap:2em}",
            ],
          })),
          e
        );
      })();
      const vx = [
        { path: "", redirectTo: "/Home", pathMatch: "full" },
        {
          path: "Home",
          component: mx,
          children: [
            {
              path: "",
              component: Xv,
              children: [
                {
                  path: "",
                  component: hx,
                  children: [
                    {
                      path: "",
                      component: eD,
                      children: [
                        {
                          path: "",
                          component: tD,
                          children: [{ path: "", component: Yv }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        { path: "Contact", component: Yv },
        { path: "TECH", component: tD },
        { path: "About", component: Xv },
        { path: "Projects", component: eD },
        { path: "LEDDice", component: yx },
        {
          path: "VBA",
          component: (() => {
            class e {
              constructor(n) {
                (this.config = n),
                  (this.vb = {
                    title: "",
                    date: "",
                    contentA: "",
                    contentB: "",
                    contentC: "",
                    caption: "",
                  });
              }
              ngOnInit() {
                this.vb = this.config.getConfig().vb;
              }
            }
            return (
              (e.ɵfac = function (n) {
                return new (n || e)(T(zt));
              }),
              (e.ɵcmp = Ae({
                type: e,
                selectors: [["app-vba-calc"]],
                decls: 38,
                vars: 6,
                consts: [
                  ["id", "VBA", 1, "container2"],
                  [1, "quote2"],
                  [
                    "href",
                    "https://github.com/MahanSharifi/Math-Calculator-for-Different-Functions",
                    "target",
                    "_blank",
                  ],
                  [1, "slide-pager"],
                  [1, "slides"],
                  ["type", "radio", "name", "radio-btn", "id", "radio1"],
                  ["type", "radio", "name", "radio-btn", "id", "radio2"],
                  ["type", "radio", "name", "radio-btn", "id", "radio3"],
                  ["type", "radio", "name", "radio-btn", "id", "radio4"],
                  [1, "slide", "first"],
                  [
                    "src",
                    "assets/images/gallery-images/recip VBA.jpg",
                    "alt",
                    "",
                    1,
                    "responsive",
                  ],
                  [1, "slide"],
                  [
                    "src",
                    "assets/images/gallery-images/radical grid.jpg",
                    "alt",
                    "",
                    1,
                    "responsive",
                  ],
                  [
                    "src",
                    "assets/images/gallery-images/quad grid.jpg",
                    "alt",
                    "",
                    1,
                    "responsive",
                  ],
                  [
                    "src",
                    "assets/images/gallery-images/reciprocal grid.jpg",
                    "alt",
                    "",
                    1,
                    "responsive",
                  ],
                  [1, "navigation-manual"],
                  ["for", "radio1", 1, "manuel-btn"],
                  ["for", "radio2", 1, "manuel-btn"],
                  ["for", "radio3", 1, "manuel-btn"],
                  ["for", "radio4", 1, "manuel-btn"],
                  [1, "caption"],
                ],
                template: function (n, r) {
                  1 & n &&
                    (p(0, "div", 0),
                    p(1, "div", 1),
                    p(2, "h3"),
                    v(3),
                    p(4, "p"),
                    v(5),
                    g(),
                    g(),
                    p(6, "a", 2),
                    v(7, "GitHub Code "),
                    g(),
                    p(8, "p"),
                    v(9),
                    C(10, "br"),
                    v(11),
                    C(12, "br"),
                    v(13),
                    C(14, "br"),
                    g(),
                    p(15, "div", 3),
                    p(16, "div", 4),
                    C(17, "input", 5),
                    C(18, "input", 6),
                    C(19, "input", 7),
                    C(20, "input", 8),
                    p(21, "div", 9),
                    C(22, "img", 10),
                    g(),
                    p(23, "div", 11),
                    C(24, "img", 12),
                    g(),
                    p(25, "div", 11),
                    C(26, "img", 13),
                    g(),
                    p(27, "div", 11),
                    C(28, "img", 14),
                    g(),
                    g(),
                    p(29, "div", 15),
                    C(30, "label", 16),
                    C(31, "label", 17),
                    C(32, "label", 18),
                    C(33, "label", 19),
                    g(),
                    g(),
                    p(34, "p", 20),
                    C(35, "br"),
                    v(36),
                    g(),
                    g(),
                    g(),
                    C(37, "router-outlet")),
                    2 & n &&
                      (E(3),
                      P(r.vb.title),
                      E(2),
                      P(r.vb.date),
                      E(4),
                      N(" ", r.vb.contentA, " "),
                      E(2),
                      N(" ", r.vb.contentB, " "),
                      E(2),
                      N(" ", r.vb.contentC, " "),
                      E(23),
                      P(r.vb.caption));
                },
                directives: [qt],
                styles: [
                  ".slide-pager[_ngcontent-%COMP%]{justify-content:center;height:auto;border-radius:10px;overflow:hidden}.slides[_ngcontent-%COMP%]{width:500%;height:auto;display:flex}.slides[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{display:none}.slide[_ngcontent-%COMP%]{width:20%;transition:2s}.slide[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-height:500px;max-width:500px;position:relative;justify-content:center;margin-left:350px}.navigation-manual[_ngcontent-%COMP%]{display:flex;margin-left:520px}.navigation-manual[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{height:.5px;width:25px}.manuel-btn[_ngcontent-%COMP%]{border:1px solid black;padding:5px;border-radius:1000px;cursor:pointer;transition:1s}.manuel-btn[_ngcontent-%COMP%]:not(:last-child){margin-right:40px}.manuel-btn[_ngcontent-%COMP%]:hover{background:#0077B5}#radio1[_ngcontent-%COMP%]:checked ~ .first[_ngcontent-%COMP%]{margin-left:0}#radio2[_ngcontent-%COMP%]:checked ~ .first[_ngcontent-%COMP%]{margin-left:-20%}#radio3[_ngcontent-%COMP%]:checked ~ .first[_ngcontent-%COMP%]{margin-left:-40%}#radio4[_ngcontent-%COMP%]:checked ~ .first[_ngcontent-%COMP%]{margin-left:-60%}.quote2[_ngcontent-%COMP%]{background-color:#fff;padding:2em;border-radius:1em;box-shadow:10px 10px 30px #0000004d}.container2[_ngcontent-%COMP%]{z-index:2;background:rgb(255,255,255);line-height:40px;font-weight:lighter;padding:40px;color:#000;font-family:Open Sans,sans-serif,Arial,Helvetica}.container2[_ngcontent-%COMP%]{padding:10em 2em 2em;grid-gap:2em}",
                ],
              })),
              e
            );
          })(),
        },
        { path: "Biquadris", component: gx },
      ];
      let Dx = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Yt({ type: e })),
            (e.ɵinj = Pt({
              imports: [
                [vy, wc.forRoot(vx, { scrollPositionRestoration: "enabled" })],
                wc,
              ],
            })),
            e
          );
        })(),
        Cx = (() => {
          class e {
            constructor() {}
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Ae({
              type: e,
              selectors: [["app-social"]],
              decls: 18,
              vars: 0,
              consts: [
                [
                  "href",
                  "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
                  "rel",
                  "stylesheet",
                ],
                [1, "social-icons"],
                [
                  "target",
                  "_blank",
                  "title",
                  "GitHub",
                  "href",
                  "https://github.com/MahanSharifi",
                ],
                [1, "fa", "fa-github"],
                [
                  "target",
                  "_blank",
                  "title",
                  "Linkedin",
                  "href",
                  "https://www.linkedin.com/in/mahan-sharifi-05447b1ab/",
                ],
                [1, "fa", "fa-linkedin", "fa-1x"],
                [
                  "target",
                  "_blank",
                  "title",
                  "Mail",
                  "href",
                  "mailto: mahan9879@gmail.com",
                ],
                [1, "fa", "fa-mail-forward", "fa-1x"],
              ],
              template: function (n, r) {
                1 & n &&
                  (p(0, "aside"),
                  C(1, "link", 0),
                  p(2, "ul", 1),
                  p(3, "li"),
                  p(4, "a", 2),
                  C(5, "i", 3),
                  p(6, "span"),
                  v(7, "GitHub"),
                  g(),
                  g(),
                  g(),
                  p(8, "li"),
                  p(9, "a", 4),
                  C(10, "i", 5),
                  p(11, "span"),
                  v(12, "Linkedin"),
                  g(),
                  g(),
                  g(),
                  p(13, "li"),
                  p(14, "a", 6),
                  C(15, "i", 7),
                  p(16, "span"),
                  v(17, "Gmail"),
                  g(),
                  g(),
                  g(),
                  g(),
                  g());
              },
              styles: [
                "aside[_ngcontent-%COMP%]{float:right}aside[_ngcontent-%COMP%]{text-align:right}ul[_ngcontent-%COMP%]{text-align:center}li[_ngcontent-%COMP%]{display:inline-block;list-style:none;margin:0}.social-icons[_ngcontent-%COMP%]{display:inline-block;list-style:none}.social-icons[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:inline-block;width:32px;text-align:center}.social-icons[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, .social-icons[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:hover{opacity:100}.social-icons[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{display:none}.social-icons[_ngcontent-%COMP%]{margin-top:27px}.social-icons[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{list-style-type:none;margin:0 15px}.social-icons[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .fa[_ngcontent-%COMP%]{transition:.6s;line-height:30px}.social-icons[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:hover{color:#fff!important}.social-icons[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{position:relative;display:block;width:30px;height:30px;margin:0 10px 0 0;border-radius:50%;text-align:center;line-height:-10px;transition:.6s;box-shadow:0 5px 4px #00000080}.social-icons[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{transform:translateY(-10px)}.social-icons[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(1)   a[_ngcontent-%COMP%]:hover{background-color:#171515}.social-icons[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(2)   a[_ngcontent-%COMP%]:hover{background-color:#0077b5}.social-icons[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(3)   a[_ngcontent-%COMP%]:hover{background-color:#e4405f}.social-icons[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(4)   a[_ngcontent-%COMP%]:hover{background-color:#e4405f}",
              ],
            })),
            e
          );
        })();
      const _x = function () {
        return { exact: !0 };
      };
      let wx = (() => {
          class e {
            constructor() {}
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Ae({
              type: e,
              selectors: [["app-navigation"]],
              decls: 18,
              vars: 2,
              consts: [
                ["id", "nav-main"],
                [
                  "id",
                  "h",
                  "routerLink",
                  "/Home",
                  "routerLinkActive",
                  "active",
                  3,
                  "routerLinkActiveOptions",
                ],
                [
                  "routerLink",
                  "/About",
                  "href",
                  "#about",
                  "routerLinkActive",
                  "active",
                ],
                ["routerLink", "/Projects", "routerLinkActive", "active"],
                ["routerLink", "/TECH", "routerLinkActive", "active"],
                ["routerLink", "/Contact", "routerLinkActive", "active"],
              ],
              template: function (n, r) {
                1 & n &&
                  (p(0, "nav", 0),
                  p(1, "ul"),
                  p(2, "li"),
                  p(3, "a", 1),
                  v(4, "Home "),
                  C(5, "h2"),
                  g(),
                  g(),
                  p(6, "li"),
                  p(7, "a", 2),
                  v(8, "About"),
                  g(),
                  g(),
                  p(9, "li"),
                  p(10, "a", 3),
                  v(11, "Projects"),
                  g(),
                  g(),
                  p(12, "li"),
                  p(13, "a", 4),
                  v(14, "Experience"),
                  g(),
                  g(),
                  p(15, "li"),
                  p(16, "a", 5),
                  v(17, "Contact"),
                  g(),
                  g(),
                  g(),
                  g()),
                  2 & n &&
                    (E(3),
                    Cn(
                      "routerLinkActiveOptions",
                      (function (e, t, n) {
                        const r = je() + e,
                          o = b();
                        return o[r] === L
                          ? Bt(o, r, n ? t.call(n) : t())
                          : (function (e, t) {
                              return e[t];
                            })(o, r);
                      })(1, _x),
                    ));
              },
              directives: [Kr, Ov],
              styles: [
                "nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{text-transform:uppercase}nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{display:block;padding:0 10px}ul[_ngcontent-%COMP%]{text-align:center}li[_ngcontent-%COMP%]{display:inline-block;list-style:none;margin:0}#nav-main[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{list-style-type:none;margin:10px 15px}#nav-main[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .fa[_ngcontent-%COMP%]{transition:.6s;line-height:0px}#nav-main[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{position:relative;display:block;margin:10px;border-radius:0%;text-align:center;line-height:50px;height:50px;transition:.6s}#nav-main[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{transform:translateY(-10px)}#nav-main[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(1)   a[_ngcontent-%COMP%]:hover{color:#37313b}#nav-main[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(2)   a[_ngcontent-%COMP%]:hover{color:#37313b}#nav-main[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(3)   a[_ngcontent-%COMP%]:hover{color:#37313b}#nav-main[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(4)   a[_ngcontent-%COMP%]:hover{color:#37313b}#nav-main[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:nth-child(5)   a[_ngcontent-%COMP%]:hover{color:#37313b}#nav-main[_ngcontent-%COMP%]   .active[_ngcontent-%COMP%]{color:#639!important;-webkit-text-decoration:underline 5px;text-decoration:underline 5px}",
              ],
            })),
            e
          );
        })(),
        bx = (() => {
          class e {
            constructor() {}
            ngOnInit() {}
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵcmp = Ae({
              type: e,
              selectors: [["app-header-main"]],
              decls: 11,
              vars: 0,
              consts: [
                ["id", "header"],
                [1, "argument", "clearfix"],
                [1, "col-nav"],
                ["id", "logo"],
                [
                  "src",
                  "assets/images/logo-2.png",
                  "id",
                  "first-logo",
                  "alt",
                  "Landing Page",
                ],
                [
                  "src",
                  "assets/images/logo-2.png",
                  "id",
                  "second-logo",
                  "alt",
                  "Landing Page",
                ],
                ["id", "nav-box"],
                ["id", "nav-content-pages"],
              ],
              template: function (n, r) {
                1 & n &&
                  (p(0, "div", 0),
                  p(1, "div", 1),
                  p(2, "div", 2),
                  p(3, "div", 3),
                  C(4, "img", 4),
                  C(5, "img", 5),
                  g(),
                  C(6, "app-social"),
                  C(7, "app-navigation"),
                  p(8, "div", 6),
                  C(9, "span"),
                  g(),
                  C(10, "nav", 7),
                  g(),
                  g(),
                  g());
              },
              directives: [Cx, wx],
              styles: [
                "#header[_ngcontent-%COMP%]{font-size:13px;margin-top:-10px!important}#header[_ngcontent-%COMP%]{height:82px!important;overflow:visible;z-index:9999;width:100%;background:rgb(255,255,255);opacity:100}#header[_ngcontent-%COMP%]   .argument[_ngcontent-%COMP%]{padding:0}#logo[_ngcontent-%COMP%]{float:left;height:71px;line-height:71px;margin-left:15px;margin-top:2px}#second-logo[_ngcontent-%COMP%]{display:none}#logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{max-height:50px;vertical-align:middle;margin-right:15px}#header.nav-solid[_ngcontent-%COMP%]   [class*=col-][_ngcontent-%COMP%]{padding:0}#header.nav-solid[_ngcontent-%COMP%]{background:#fff;box-shadow:2px 0 3px #0003;position:fixed!important;left:0}#header.nav-solid[_ngcontent-%COMP%]   nav[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{border-bottom:3px solid;border-color:#fff}",
              ],
            })),
            e
          );
        })(),
        Ex = (() => {
          class e {
            constructor(n) {
              (this.config = n), (this.foot = { f: "" });
            }
            ngOnInit() {
              this.foot = this.config.getConfig().foot;
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(zt));
            }),
            (e.ɵcmp = Ae({
              type: e,
              selectors: [["app-footer"]],
              decls: 5,
              vars: 1,
              consts: [
                ["id", "foot-bottom", 1, "clearfix"],
                [1, "argument", "clearfix"],
                [1, "col-2"],
                [1, "fas", "fa-copyright"],
              ],
              template: function (n, r) {
                1 & n &&
                  (p(0, "footer", 0),
                  p(1, "div", 1),
                  p(2, "p", 2),
                  v(3),
                  C(4, "i", 3),
                  g(),
                  g(),
                  g()),
                  2 & n && (E(3), N(" ", r.foot.f, " "));
              },
              styles: [
                "#foot-bottom[_ngcontent-%COMP%]{clear:both;background-color:#000;color:#f0f8ff}#foot-bottom[_ngcontent-%COMP%]   .argument[_ngcontent-%COMP%]{padding:0}#foot-bottom[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0}#foot-bottom[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{list-style:none}#foot-bottom[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{display:inline-block}",
              ],
            })),
            e
          );
        })(),
        Mx = (() => {
          class e {
            constructor(n) {
              (this.apiService = n),
                (this.isLoading = !0),
                (this.title = "Mazzie");
            }
            onActivate() {
              window.scroll(0, 0);
            }
            ngOnInit() {
              this.getApi();
            }
            getApi() {
              (this.isLoading = !0),
                this.apiService.getapi().subscribe((n) => {
                  console.log(n), (this.isLoading = !0), (this.apiData = n);
                });
            }
          }
          return (
            (e.ɵfac = function (n) {
              return new (n || e)(T(Pc));
            }),
            (e.ɵcmp = Ae({
              type: e,
              selectors: [["app-root"]],
              decls: 14,
              vars: 0,
              consts: [
                [
                  "rel",
                  "stylesheet",
                  "href",
                  "https://use.fontawesome.com/releases/v5.7.0/css/all.css",
                ],
                [
                  "data-wow-duration",
                  "1.7s",
                  "data-wow-delay",
                  "1.2s",
                  1,
                  "FrontPageBorder",
                ],
                [
                  1,
                  "FrontPageTopBorder",
                  "animated",
                  2,
                  "visibility",
                  "visible",
                  "opacity",
                  "100%",
                ],
                [
                  1,
                  "FrontPageRightBorder",
                  "animated",
                  2,
                  "visibility",
                  "visible",
                ],
                [
                  1,
                  "FrontPageBottomBorder",
                  "animated",
                  2,
                  "visibility",
                  "visible",
                ],
                [
                  1,
                  "FrontPageLeftBorder",
                  "animated",
                  2,
                  "visibility",
                  "visible",
                ],
                ["id", "mazzie"],
                ["id", "wrapper"],
                ["id", "content"],
                [3, "activate"],
              ],
              template: function (n, r) {
                1 & n &&
                  (C(0, "link", 0),
                  p(1, "title"),
                  v(2, "Mahan Sharifi - Personal"),
                  g(),
                  p(3, "div", 1),
                  C(4, "div", 2),
                  C(5, "div", 3),
                  C(6, "div", 4),
                  C(7, "div", 5),
                  g(),
                  p(8, "div", 6),
                  p(9, "div", 7),
                  p(10, "main", 8),
                  p(11, "router-outlet", 9),
                  Ve("activate", function () {
                    return r.onActivate();
                  }),
                  C(12, "app-header-main"),
                  g(),
                  C(13, "app-footer"),
                  g(),
                  g(),
                  g());
              },
              directives: [qt, bx, Ex],
              styles: [
                ".FrontPageBorder[_ngcontent-%COMP%]{position:fixed;z-index:999999}.FrontPageBorder[_ngcontent-%COMP%]   .FrontPageBottomBorder[_ngcontent-%COMP%], .FrontPageBorder[_ngcontent-%COMP%]   .FrontPageLeftBorder[_ngcontent-%COMP%], .FrontPageBorder[_ngcontent-%COMP%]   .FrontPageRightBorder[_ngcontent-%COMP%]{position:fixed;z-index:9999;background:rgba(255,255,255,.897)}.FrontPageBorder[_ngcontent-%COMP%] > .FrontPageTopBorder[_ngcontent-%COMP%], .FrontPageBorder[_ngcontent-%COMP%] > .FrontPageRightBorder[_ngcontent-%COMP%], .FrontPageBorder[_ngcontent-%COMP%] > .FrontPageBottomBorder[_ngcontent-%COMP%], .FrontPageBorder[_ngcontent-%COMP%] > .FrontPageLeftBorder[_ngcontent-%COMP%]{padding:10px}.FrontPageBottomBorder[_ngcontent-%COMP%], .FrontPageTopBorder[_ngcontent-%COMP%]{width:100%;padding:10px}.FrontPageLeftBorder[_ngcontent-%COMP%], .FrontPageRightBorder[_ngcontent-%COMP%]{padding:10px;height:100%;margin-top:0}.FrontPageBorder[_ngcontent-%COMP%]   .FrontPageTopBorder[_ngcontent-%COMP%]{top:0}.FrontPageBorder[_ngcontent-%COMP%]   .FrontPageRightBorder[_ngcontent-%COMP%]{right:0}.FrontPageBorder[_ngcontent-%COMP%]   .FrontPageBottomBorder[_ngcontent-%COMP%]{bottom:0}.FrontPageBorder[_ngcontent-%COMP%]   .FrontPageLeftBorder[_ngcontent-%COMP%]{left:0}#wrapper[_ngcontent-%COMP%]{margin:0 10px;padding:10px 0;position:relative;background-color:#fff}.FrontPageTopBorder[_ngcontent-%COMP%]{color:#fff;opacity:900000%!important}",
              ],
            })),
            e
          );
        })(),
        Sx = (() => {
          class e {}
          return (
            (e.ɵfac = function (n) {
              return new (n || e)();
            }),
            (e.ɵmod = Yt({ type: e, bootstrap: [Mx] })),
            (e.ɵinj = Pt({
              providers: [zt, Pc],
              imports: [[y1, Dx, ux, wc.forRoot([])]],
            })),
            e
          );
        })();
      (Hm = !1),
        g1()
          .bootstrapModule(Sx)
          .catch((e) => console.error(e));
    },
  },
  (oe) => {
    oe((oe.s = 271));
  },
]);
