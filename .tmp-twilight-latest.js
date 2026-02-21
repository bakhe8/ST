!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
      ? define(t)
      : ((e = "undefined" != typeof globalThis ? globalThis : e || self).Salla =
          t());
})(this, function () {
  "use strict";
  function e(e, t) {
    return (
      t.forEach(function (t) {
        t &&
          "string" != typeof t &&
          !Array.isArray(t) &&
          Object.keys(t).forEach(function (n) {
            if ("default" !== n && !(n in e)) {
              var r = Object.getOwnPropertyDescriptor(t, n);
              Object.defineProperty(
                e,
                n,
                r.get
                  ? r
                  : {
                      enumerable: !0,
                      get: function () {
                        return t[n];
                      },
                    },
              );
            }
          });
      }),
      Object.freeze(e)
    );
  }
  var t,
    n,
    r,
    i,
    o,
    a,
    s,
    l,
    u,
    c,
    d,
    h,
    p,
    f,
    g,
    m,
    v,
    y,
    b,
    w,
    D,
    F,
    S,
    _,
    E,
    A,
    C,
    k,
    x,
    P,
    O,
    I,
    j,
    T,
    R,
    L,
    B,
    U,
    N,
    q,
    z,
    $,
    M,
    H,
    J,
    W,
    G,
    V,
    K,
    Q,
    X,
    Y,
    Z,
    ee,
    te,
    ne,
    re,
    ie,
    oe,
    ae,
    se,
    le,
    ue,
    ce,
    de,
    he,
    pe,
    fe,
    ge,
    me,
    ve,
    ye,
    be,
    we,
    De,
    Fe,
    Se,
    _e,
    Ee,
    Ae,
    Ce,
    ke,
    xe,
    Pe,
    Oe,
    Ie,
    je,
    Te,
    Re,
    Le,
    Be,
    Ue,
    Ne,
    qe,
    ze,
    $e,
    Me,
    He,
    Je,
    We,
    Ge,
    Ve,
    Ke,
    Qe,
    Xe =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof window
          ? window
          : "undefined" != typeof global
            ? global
            : "undefined" != typeof self
              ? self
              : {};
  function Ye() {
    if (n) return t;
    n = 1;
    var e = Array.isArray;
    return (t = e);
  }
  function Ze() {
    if (a) return o;
    a = 1;
    var e = (function () {
        if (i) return r;
        i = 1;
        var e = "object" == typeof Xe && Xe && Xe.Object === Object && Xe;
        return (r = e);
      })(),
      t = "object" == typeof self && self && self.Object === Object && self,
      n = e || t || Function("return this")();
    return (o = n);
  }
  function et() {
    if (l) return s;
    l = 1;
    var e = Ze().Symbol;
    return (s = e);
  }
  function tt() {
    if (f) return p;
    f = 1;
    var e = et(),
      t = (function () {
        if (c) return u;
        c = 1;
        var e = et(),
          t = Object.prototype,
          n = t.hasOwnProperty,
          r = t.toString,
          i = e ? e.toStringTag : void 0;
        return (u = function (e) {
          var t = n.call(e, i),
            o = e[i];
          try {
            e[i] = void 0;
            var a = !0;
          } catch (e) {}
          var s = r.call(e);
          return (a && (t ? (e[i] = o) : delete e[i]), s);
        });
      })(),
      n = (function () {
        if (h) return d;
        h = 1;
        var e = Object.prototype.toString;
        return (d = function (t) {
          return e.call(t);
        });
      })(),
      r = e ? e.toStringTag : void 0;
    return (p = function (e) {
      return null == e
        ? void 0 === e
          ? "[object Undefined]"
          : "[object Null]"
        : r && r in Object(e)
          ? t(e)
          : n(e);
    });
  }
  function nt() {
    if (y) return v;
    y = 1;
    var e = tt(),
      t = m
        ? g
        : ((m = 1),
          (g = function (e) {
            return null != e && "object" == typeof e;
          }));
    return (v = function (n) {
      return "symbol" == typeof n || (t(n) && "[object Symbol]" == e(n));
    });
  }
  function rt() {
    if (F) return D;
    return (
      (F = 1),
      (D = function (e) {
        var t = typeof e;
        return null != e && ("object" == t || "function" == t);
      })
    );
  }
  function it() {
    if (k) return C;
    k = 1;
    var e,
      t = (function () {
        if (A) return E;
        A = 1;
        var e = Ze()["__core-js_shared__"];
        return (E = e);
      })(),
      n = (e = /[^.]+$/.exec((t && t.keys && t.keys.IE_PROTO) || ""))
        ? "Symbol(src)_1." + e
        : "";
    return (C = function (e) {
      return !!n && n in e;
    });
  }
  function ot() {
    if (I) return O;
    I = 1;
    var e = (function () {
        if (_) return S;
        _ = 1;
        var e = tt(),
          t = rt();
        return (S = function (n) {
          if (!t(n)) return !1;
          var r = e(n);
          return (
            "[object Function]" == r ||
            "[object GeneratorFunction]" == r ||
            "[object AsyncFunction]" == r ||
            "[object Proxy]" == r
          );
        });
      })(),
      t = it(),
      n = rt(),
      r = (function () {
        if (P) return x;
        P = 1;
        var e = Function.prototype.toString;
        return (x = function (t) {
          if (null != t) {
            try {
              return e.call(t);
            } catch (e) {}
            try {
              return t + "";
            } catch (e) {}
          }
          return "";
        });
      })(),
      i = /^\[object .+?Constructor\]$/,
      o = Function.prototype,
      a = Object.prototype,
      s = o.toString,
      l = a.hasOwnProperty,
      u = RegExp(
        "^" +
          s
            .call(l)
            .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
            .replace(
              /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
              "$1.*?",
            ) +
          "$",
      );
    return (O = function (o) {
      return !(!n(o) || t(o)) && (e(o) ? u : i).test(r(o));
    });
  }
  function at() {
    if (L) return R;
    L = 1;
    var e = ot(),
      t = T
        ? j
        : ((T = 1),
          (j = function (e, t) {
            return null == e ? void 0 : e[t];
          }));
    return (R = function (n, r) {
      var i = t(n, r);
      return e(i) ? i : void 0;
    });
  }
  function st() {
    if (U) return B;
    U = 1;
    var e = at()(Object, "create");
    return (B = e);
  }
  function lt() {
    if (Q) return K;
    Q = 1;
    var e = (function () {
        if (q) return N;
        q = 1;
        var e = st();
        return (N = function () {
          ((this.__data__ = e ? e(null) : {}), (this.size = 0));
        });
      })(),
      t = $
        ? z
        : (($ = 1),
          (z = function (e) {
            var t = this.has(e) && delete this.__data__[e];
            return ((this.size -= t ? 1 : 0), t);
          })),
      n = (function () {
        if (H) return M;
        H = 1;
        var e = st(),
          t = Object.prototype.hasOwnProperty;
        return (M = function (n) {
          var r = this.__data__;
          if (e) {
            var i = r[n];
            return "__lodash_hash_undefined__" === i ? void 0 : i;
          }
          return t.call(r, n) ? r[n] : void 0;
        });
      })(),
      r = (function () {
        if (W) return J;
        W = 1;
        var e = st(),
          t = Object.prototype.hasOwnProperty;
        return (J = function (n) {
          var r = this.__data__;
          return e ? void 0 !== r[n] : t.call(r, n);
        });
      })(),
      i = (function () {
        if (V) return G;
        V = 1;
        var e = st();
        return (G = function (t, n) {
          var r = this.__data__;
          return (
            (this.size += this.has(t) ? 0 : 1),
            (r[t] = e && void 0 === n ? "__lodash_hash_undefined__" : n),
            this
          );
        });
      })();
    function o(e) {
      var t = -1,
        n = null == e ? 0 : e.length;
      for (this.clear(); ++t < n; ) {
        var r = e[t];
        this.set(r[0], r[1]);
      }
    }
    return (
      (o.prototype.clear = e),
      (o.prototype.delete = t),
      (o.prototype.get = n),
      (o.prototype.has = r),
      (o.prototype.set = i),
      (K = o)
    );
  }
  function ut() {
    if (ne) return te;
    ne = 1;
    var e = ee
      ? Z
      : ((ee = 1),
        (Z = function (e, t) {
          return e === t || (e != e && t != t);
        }));
    return (te = function (t, n) {
      for (var r = t.length; r--; ) if (e(t[r][0], n)) return r;
      return -1;
    });
  }
  function ct() {
    if (he) return de;
    he = 1;
    var e = Y
        ? X
        : ((Y = 1),
          (X = function () {
            ((this.__data__ = []), (this.size = 0));
          })),
      t = (function () {
        if (ie) return re;
        ie = 1;
        var e = ut(),
          t = Array.prototype.splice;
        return (re = function (n) {
          var r = this.__data__,
            i = e(r, n);
          return !(
            i < 0 ||
            (i == r.length - 1 ? r.pop() : t.call(r, i, 1), --this.size, 0)
          );
        });
      })(),
      n = (function () {
        if (ae) return oe;
        ae = 1;
        var e = ut();
        return (oe = function (t) {
          var n = this.__data__,
            r = e(n, t);
          return r < 0 ? void 0 : n[r][1];
        });
      })(),
      r = (function () {
        if (le) return se;
        le = 1;
        var e = ut();
        return (se = function (t) {
          return e(this.__data__, t) > -1;
        });
      })(),
      i = (function () {
        if (ce) return ue;
        ce = 1;
        var e = ut();
        return (ue = function (t, n) {
          var r = this.__data__,
            i = e(r, t);
          return (i < 0 ? (++this.size, r.push([t, n])) : (r[i][1] = n), this);
        });
      })();
    function o(e) {
      var t = -1,
        n = null == e ? 0 : e.length;
      for (this.clear(); ++t < n; ) {
        var r = e[t];
        this.set(r[0], r[1]);
      }
    }
    return (
      (o.prototype.clear = e),
      (o.prototype.delete = t),
      (o.prototype.get = n),
      (o.prototype.has = r),
      (o.prototype.set = i),
      (de = o)
    );
  }
  function dt() {
    if (me) return ge;
    me = 1;
    var e = lt(),
      t = ct(),
      n = (function () {
        if (fe) return pe;
        fe = 1;
        var e = at()(Ze(), "Map");
        return (pe = e);
      })();
    return (ge = function () {
      ((this.size = 0),
        (this.__data__ = {
          hash: new e(),
          map: new (n || t)(),
          string: new e(),
        }));
    });
  }
  function ht() {
    if (we) return be;
    we = 1;
    var e = ye
      ? ve
      : ((ye = 1),
        (ve = function (e) {
          var t = typeof e;
          return "string" == t ||
            "number" == t ||
            "symbol" == t ||
            "boolean" == t
            ? "__proto__" !== e
            : null === e;
        }));
    return (be = function (t, n) {
      var r = t.__data__;
      return e(n) ? r["string" == typeof n ? "string" : "hash"] : r.map;
    });
  }
  function pt() {
    if (Pe) return xe;
    Pe = 1;
    var e = dt(),
      t = (function () {
        if (Fe) return De;
        Fe = 1;
        var e = ht();
        return (De = function (t) {
          var n = e(this, t).delete(t);
          return ((this.size -= n ? 1 : 0), n);
        });
      })(),
      n = (function () {
        if (_e) return Se;
        _e = 1;
        var e = ht();
        return (Se = function (t) {
          return e(this, t).get(t);
        });
      })(),
      r = (function () {
        if (Ae) return Ee;
        Ae = 1;
        var e = ht();
        return (Ee = function (t) {
          return e(this, t).has(t);
        });
      })(),
      i = (function () {
        if (ke) return Ce;
        ke = 1;
        var e = ht();
        return (Ce = function (t, n) {
          var r = e(this, t),
            i = r.size;
          return (r.set(t, n), (this.size += r.size == i ? 0 : 1), this);
        });
      })();
    function o(e) {
      var t = -1,
        n = null == e ? 0 : e.length;
      for (this.clear(); ++t < n; ) {
        var r = e[t];
        this.set(r[0], r[1]);
      }
    }
    return (
      (o.prototype.clear = e),
      (o.prototype.delete = t),
      (o.prototype.get = n),
      (o.prototype.has = r),
      (o.prototype.set = i),
      (xe = o)
    );
  }
  function ft() {
    if (Te) return je;
    Te = 1;
    var e = (function () {
      if (Ie) return Oe;
      Ie = 1;
      var e = pt();
      function t(n, r) {
        if ("function" != typeof n || (null != r && "function" != typeof r))
          throw new TypeError("Expected a function");
        var i = function e() {
          var t = arguments,
            i = r ? r.apply(this, t) : t[0],
            o = e.cache;
          if (o.has(i)) return o.get(i);
          var a = n.apply(this, t);
          return ((e.cache = o.set(i, a) || o), a);
        };
        return ((i.cache = new (t.Cache || e)()), i);
      }
      return ((t.Cache = e), (Oe = t));
    })();
    return (je = function (t) {
      var n = e(t, function (e) {
          return (500 === r.size && r.clear(), e);
        }),
        r = n.cache;
      return n;
    });
  }
  function gt() {
    if (qe) return Ne;
    qe = 1;
    var e = et(),
      t = Ue
        ? Be
        : ((Ue = 1),
          (Be = function (e, t) {
            for (
              var n = -1, r = null == e ? 0 : e.length, i = Array(r);
              ++n < r;
            )
              i[n] = t(e[n], n, e);
            return i;
          })),
      n = Ye(),
      r = nt(),
      i = e ? e.prototype : void 0,
      o = i ? i.toString : void 0;
    return (
      (Ne = function e(i) {
        if ("string" == typeof i) return i;
        if (n(i)) return t(i, e) + "";
        if (r(i)) return o ? o.call(i) : "";
        var a = i + "";
        return "0" == a && 1 / i == -1 / 0 ? "-0" : a;
      }),
      Ne
    );
  }
  function mt() {
    if (He) return Me;
    He = 1;
    var e = Ye(),
      t = (function () {
        if (w) return b;
        w = 1;
        var e = Ye(),
          t = nt(),
          n = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
          r = /^\w*$/;
        return (b = function (i, o) {
          if (e(i)) return !1;
          var a = typeof i;
          return (
            !(
              "number" != a &&
              "symbol" != a &&
              "boolean" != a &&
              null != i &&
              !t(i)
            ) ||
            r.test(i) ||
            !n.test(i) ||
            (null != o && i in Object(o))
          );
        });
      })(),
      n = (function () {
        if (Le) return Re;
        Le = 1;
        var e = ft(),
          t =
            /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
          n = /\\(\\)?/g,
          r = e(function (e) {
            var r = [];
            return (
              46 === e.charCodeAt(0) && r.push(""),
              e.replace(t, function (e, t, i, o) {
                r.push(i ? o.replace(n, "$1") : t || e);
              }),
              r
            );
          });
        return (Re = r);
      })(),
      r = (function () {
        if ($e) return ze;
        $e = 1;
        var e = gt();
        return (ze = function (t) {
          return null == t ? "" : e(t);
        });
      })();
    return (Me = function (i, o) {
      return e(i) ? i : t(i, o) ? [i] : n(r(i));
    });
  }
  function vt() {
    if (Ve) return Ge;
    Ve = 1;
    var e = mt(),
      t = (function () {
        if (We) return Je;
        We = 1;
        var e = nt();
        return (Je = function (t) {
          if ("string" == typeof t || e(t)) return t;
          var n = t + "";
          return "0" == n && 1 / t == -1 / 0 ? "-0" : n;
        });
      })();
    return (Ge = function (n, r) {
      for (var i = 0, o = (r = e(r, n)).length; null != n && i < o; )
        n = n[t(r[i++])];
      return i && i == o ? n : void 0;
    });
  }
  var yt,
    bt = (function () {
      if (Qe) return Ke;
      Qe = 1;
      var e = vt();
      return (Ke = function (t, n, r) {
        var i = null == t ? void 0 : e(t, n);
        return void 0 === i ? r : i;
      });
    })(),
    wt = { exports: {} };
  var Dt,
    Ft,
    St,
    _t,
    Et =
      (yt ||
        ((yt = 1),
        (function (e, t) {
          !(function (t) {
            var n = Object.hasOwnProperty,
              r = Array.isArray
                ? Array.isArray
                : function (e) {
                    return (
                      "[object Array]" === Object.prototype.toString.call(e)
                    );
                  },
              i =
                "object" == typeof process &&
                "function" == typeof process.nextTick,
              o = "function" == typeof Symbol,
              a = "object" == typeof Reflect,
              s = "function" == typeof setImmediate ? setImmediate : setTimeout,
              l = o
                ? a && "function" == typeof Reflect.ownKeys
                  ? Reflect.ownKeys
                  : function (e) {
                      var t = Object.getOwnPropertyNames(e);
                      return (
                        t.push.apply(t, Object.getOwnPropertySymbols(e)),
                        t
                      );
                    }
                : Object.keys;
            function u() {
              ((this._events = {}), this._conf && c.call(this, this._conf));
            }
            function c(e) {
              e &&
                ((this._conf = e),
                e.delimiter && (this.delimiter = e.delimiter),
                e.maxListeners !== t && (this._maxListeners = e.maxListeners),
                e.wildcard && (this.wildcard = e.wildcard),
                e.newListener && (this._newListener = e.newListener),
                e.removeListener && (this._removeListener = e.removeListener),
                e.verboseMemoryLeak &&
                  (this.verboseMemoryLeak = e.verboseMemoryLeak),
                e.ignoreErrors && (this.ignoreErrors = e.ignoreErrors),
                this.wildcard && (this.listenerTree = {}));
            }
            function d(e, t) {
              var n =
                "(node) warning: possible EventEmitter memory leak detected. " +
                e +
                " listeners added. Use emitter.setMaxListeners() to increase limit.";
              if (
                (this.verboseMemoryLeak && (n += " Event name: " + t + "."),
                "undefined" != typeof process && process.emitWarning)
              ) {
                var r = new Error(n);
                ((r.name = "MaxListenersExceededWarning"),
                  (r.emitter = this),
                  (r.count = e),
                  process.emitWarning(r));
              } else (console.error(n), console.trace && console.trace());
            }
            var h = function (e, t, n) {
              var r = arguments.length;
              switch (r) {
                case 0:
                  return [];
                case 1:
                  return [e];
                case 2:
                  return [e, t];
                case 3:
                  return [e, t, n];
                default:
                  for (var i = new Array(r); r--; ) i[r] = arguments[r];
                  return i;
              }
            };
            function p(e, n) {
              for (var r = {}, i = e.length, o = 0; o < i; o++)
                r[e[o]] = o < 0 ? n[o] : t;
              return r;
            }
            function f(e, t, n) {
              var r, i;
              if (
                ((this._emitter = e),
                (this._target = t),
                (this._listeners = {}),
                (this._listenersCount = 0),
                (n.on || n.off) && ((r = n.on), (i = n.off)),
                t.addEventListener
                  ? ((r = t.addEventListener), (i = t.removeEventListener))
                  : t.addListener
                    ? ((r = t.addListener), (i = t.removeListener))
                    : t.on && ((r = t.on), (i = t.off)),
                !r && !i)
              )
                throw Error("target does not implement any known event API");
              if ("function" != typeof r)
                throw TypeError("on method must be a function");
              if ("function" != typeof i)
                throw TypeError("off method must be a function");
              ((this._on = r), (this._off = i));
              var o = e._observers;
              o ? o.push(this) : (e._observers = [this]);
            }
            function g(e, r, i, o) {
              var a = Object.assign({}, r);
              if (!e) return a;
              if ("object" != typeof e)
                throw TypeError("options must be an object");
              var s,
                l,
                u,
                c = Object.keys(e),
                d = c.length;
              function h(e) {
                throw Error(
                  'Invalid "' +
                    s +
                    '" option value' +
                    (e ? ". Reason: " + e : ""),
                );
              }
              for (var p = 0; p < d; p++) {
                if (((s = c[p]), !n.call(r, s)))
                  throw Error('Unknown "' + s + '" option');
                (l = e[s]) !== t && ((u = i[s]), (a[s] = u ? u(l, h) : l));
              }
              return a;
            }
            function m(e, t) {
              return (
                ("function" == typeof e && e.hasOwnProperty("prototype")) ||
                  t("value must be a constructor"),
                e
              );
            }
            function v(e) {
              var t = "value must be type of " + e.join("|"),
                n = e.length,
                r = e[0],
                i = e[1];
              return 1 === n
                ? function (e, n) {
                    if (typeof e === r) return e;
                    n(t);
                  }
                : 2 === n
                  ? function (e, n) {
                      var o = typeof e;
                      if (o === r || o === i) return e;
                      n(t);
                    }
                  : function (r, i) {
                      for (var o = typeof r, a = n; a-- > 0; )
                        if (o === e[a]) return r;
                      i(t);
                    };
            }
            Object.assign(f.prototype, {
              subscribe: function (e, t, n) {
                var r = this,
                  i = this._target,
                  o = this._emitter,
                  a = this._listeners,
                  s = function () {
                    var r = h.apply(null, arguments),
                      a = { data: r, name: t, original: e };
                    n
                      ? !1 !== n.call(i, a) &&
                        o.emit.apply(o, [a.name].concat(r))
                      : o.emit.apply(o, [t].concat(r));
                  };
                if (a[e]) throw Error("Event '" + e + "' is already listening");
                (this._listenersCount++,
                  o._newListener && o._removeListener && !r._onNewListener
                    ? ((this._onNewListener = function (n) {
                        n === t &&
                          null === a[e] &&
                          ((a[e] = s), r._on.call(i, e, s));
                      }),
                      o.on("newListener", this._onNewListener),
                      (this._onRemoveListener = function (n) {
                        n === t &&
                          !o.hasListeners(n) &&
                          a[e] &&
                          ((a[e] = null), r._off.call(i, e, s));
                      }),
                      (a[e] = null),
                      o.on("removeListener", this._onRemoveListener))
                    : ((a[e] = s), r._on.call(i, e, s)));
              },
              unsubscribe: function (e) {
                var t,
                  n,
                  r,
                  i = this,
                  o = this._listeners,
                  a = this._emitter,
                  s = this._off,
                  u = this._target;
                if (e && "string" != typeof e)
                  throw TypeError("event must be a string");
                function c() {
                  i._onNewListener &&
                    (a.off("newListener", i._onNewListener),
                    a.off("removeListener", i._onRemoveListener),
                    (i._onNewListener = null),
                    (i._onRemoveListener = null));
                  var e = D.call(a, i);
                  a._observers.splice(e, 1);
                }
                if (e) {
                  if (!(t = o[e])) return;
                  (s.call(u, e, t), delete o[e], --this._listenersCount || c());
                } else {
                  for (r = (n = l(o)).length; r-- > 0; )
                    ((e = n[r]), s.call(u, e, o[e]));
                  ((this._listeners = {}), (this._listenersCount = 0), c());
                }
              },
            });
            var y = v(["function"]),
              b = v(["object", "function"]);
            function w(e, t, n) {
              var r,
                i,
                o,
                a = 0,
                s = new e(function (l, u, c) {
                  function d() {
                    (i && (i = null), a && (clearTimeout(a), (a = 0)));
                  }
                  ((n = g(
                    n,
                    { timeout: 0, overload: !1 },
                    {
                      timeout: function (e, t) {
                        return (
                          ("number" != typeof (e *= 1) ||
                            e < 0 ||
                            !Number.isFinite(e)) &&
                            t("timeout must be a positive number"),
                          e
                        );
                      },
                    },
                  )),
                    (r =
                      !n.overload &&
                      "function" == typeof e.prototype.cancel &&
                      "function" == typeof c));
                  var h = function (e) {
                      (d(), l(e));
                    },
                    p = function (e) {
                      (d(), u(e));
                    };
                  (r
                    ? t(h, p, c)
                    : ((i = [
                        function (e) {
                          p(e || Error("canceled"));
                        },
                      ]),
                      t(h, p, function (e) {
                        if (o)
                          throw Error(
                            "Unable to subscribe on cancel event asynchronously",
                          );
                        if ("function" != typeof e)
                          throw TypeError(
                            "onCancel callback must be a function",
                          );
                        i.push(e);
                      }),
                      (o = !0)),
                    n.timeout > 0 &&
                      (a = setTimeout(function () {
                        var e = Error("timeout");
                        ((e.code = "ETIMEDOUT"), (a = 0), s.cancel(e), u(e));
                      }, n.timeout)));
                });
              return (
                r ||
                  (s.cancel = function (e) {
                    if (i) {
                      for (var t = i.length, n = 1; n < t; n++) i[n](e);
                      (i[0](e), (i = null));
                    }
                  }),
                s
              );
            }
            function D(e) {
              var t = this._observers;
              if (!t) return -1;
              for (var n = t.length, r = 0; r < n; r++)
                if (t[r]._target === e) return r;
              return -1;
            }
            function F(e, t, n, r, i) {
              if (!n) return null;
              if (0 === r) {
                var o = typeof t;
                if ("string" === o) {
                  var a,
                    s,
                    u = 0,
                    c = 0,
                    d = this.delimiter,
                    h = d.length;
                  if (-1 !== (s = t.indexOf(d))) {
                    a = new Array(5);
                    do {
                      ((a[u++] = t.slice(c, s)), (c = s + h));
                    } while (-1 !== (s = t.indexOf(d, c)));
                    ((a[u++] = t.slice(c)), (t = a), (i = u));
                  } else ((t = [t]), (i = 1));
                } else "object" === o ? (i = t.length) : ((t = [t]), (i = 1));
              }
              var p,
                f,
                g,
                m,
                v,
                y,
                b,
                w = null,
                D = t[r],
                S = t[r + 1];
              if (r === i)
                n._listeners &&
                  ("function" == typeof n._listeners
                    ? (e && e.push(n._listeners), (w = [n]))
                    : (e && e.push.apply(e, n._listeners), (w = [n])));
              else {
                if ("*" === D) {
                  for (s = (y = l(n)).length; s-- > 0; )
                    "_listeners" !== (p = y[s]) &&
                      (b = F(e, t, n[p], r + 1, i)) &&
                      (w ? w.push.apply(w, b) : (w = b));
                  return w;
                }
                if ("**" === D) {
                  for (
                    (v = r + 1 === i || (r + 2 === i && "*" === S)) &&
                      n._listeners &&
                      (w = F(e, t, n, i, i)),
                      s = (y = l(n)).length;
                    s-- > 0;
                  )
                    "_listeners" !== (p = y[s]) &&
                      ("*" === p || "**" === p
                        ? (n[p]._listeners &&
                            !v &&
                            (b = F(e, t, n[p], i, i)) &&
                            (w ? w.push.apply(w, b) : (w = b)),
                          (b = F(e, t, n[p], r, i)))
                        : (b = F(e, t, n[p], p === S ? r + 2 : r, i)),
                      b && (w ? w.push.apply(w, b) : (w = b)));
                  return w;
                }
                n[D] && (w = F(e, t, n[D], r + 1, i));
              }
              if (((f = n["*"]) && F(e, t, f, r + 1, i), (g = n["**"])))
                if (r < i)
                  for (
                    g._listeners && F(e, t, g, i, i), s = (y = l(g)).length;
                    s-- > 0;
                  )
                    "_listeners" !== (p = y[s]) &&
                      (p === S
                        ? F(e, t, g[p], r + 2, i)
                        : p === D
                          ? F(e, t, g[p], r + 1, i)
                          : (((m = {})[p] = g[p]),
                            F(e, t, { "**": m }, r + 1, i)));
                else
                  g._listeners
                    ? F(e, t, g, i, i)
                    : g["*"] && g["*"]._listeners && F(e, t, g["*"], i, i);
              return w;
            }
            function S(e, t, n) {
              var r,
                i,
                o = 0,
                a = 0,
                s = this.delimiter,
                l = s.length;
              if ("string" == typeof e)
                if (-1 !== (r = e.indexOf(s))) {
                  i = new Array(5);
                  do {
                    ((i[o++] = e.slice(a, r)), (a = r + l));
                  } while (-1 !== (r = e.indexOf(s, a)));
                  i[o++] = e.slice(a);
                } else ((i = [e]), (o = 1));
              else ((i = e), (o = e.length));
              if (o > 1)
                for (r = 0; r + 1 < o; r++)
                  if ("**" === i[r] && "**" === i[r + 1]) return;
              var u,
                c = this.listenerTree;
              for (r = 0; r < o; r++)
                if (((c = c[(u = i[r])] || (c[u] = {})), r === o - 1))
                  return (
                    c._listeners
                      ? ("function" == typeof c._listeners &&
                          (c._listeners = [c._listeners]),
                        n ? c._listeners.unshift(t) : c._listeners.push(t),
                        !c._listeners.warned &&
                          this._maxListeners > 0 &&
                          c._listeners.length > this._maxListeners &&
                          ((c._listeners.warned = !0),
                          d.call(this, c._listeners.length, u)))
                      : (c._listeners = t),
                    !0
                  );
              return !0;
            }
            function _(e, t, n, r) {
              for (
                var i, o, a, s, u = l(e), c = u.length, d = e._listeners;
                c-- > 0;
              )
                ((i = e[(o = u[c])]),
                  (a = "_listeners" === o ? n : n ? n.concat(o) : [o]),
                  (s = r || "symbol" == typeof o),
                  d && t.push(s ? a : a.join(this.delimiter)),
                  "object" == typeof i && _.call(this, i, t, a, s));
              return t;
            }
            function E(e) {
              for (var t, n, r, i = l(e), o = i.length; o-- > 0; )
                (t = e[(n = i[o])]) &&
                  ((r = !0), "_listeners" === n || E(t) || delete e[n]);
              return r;
            }
            function A(e, t, n) {
              ((this.emitter = e), (this.event = t), (this.listener = n));
            }
            function C(e, n, r) {
              if (!0 === r) a = !0;
              else if (!1 === r) o = !0;
              else {
                if (!r || "object" != typeof r)
                  throw TypeError("options should be an object or true");
                var o = r.async,
                  a = r.promisify,
                  l = r.nextTick,
                  u = r.objectify;
              }
              if (o || l || a) {
                var c = n,
                  d = n._origin || n;
                if (l && !i) throw Error("process.nextTick is not supported");
                (a === t && (a = "AsyncFunction" === n.constructor.name),
                  (n = function () {
                    var e = arguments,
                      t = this,
                      n = this.event;
                    return a
                      ? l
                        ? Promise.resolve()
                        : new Promise(function (e) {
                            s(e);
                          }).then(function () {
                            return ((t.event = n), c.apply(t, e));
                          })
                      : (l ? process.nextTick : s)(function () {
                          ((t.event = n), c.apply(t, e));
                        });
                  }),
                  (n._async = !0),
                  (n._origin = d));
              }
              return [n, u ? new A(this, e, n) : this];
            }
            function k(e) {
              ((this._events = {}),
                (this._newListener = !1),
                (this._removeListener = !1),
                (this.verboseMemoryLeak = !1),
                c.call(this, e));
            }
            ((A.prototype.off = function () {
              return (this.emitter.off(this.event, this.listener), this);
            }),
              (k.EventEmitter2 = k),
              (k.prototype.listenTo = function (e, n, i) {
                if ("object" != typeof e)
                  throw TypeError("target musts be an object");
                var o = this;
                function a(t) {
                  if ("object" != typeof t)
                    throw TypeError("events must be an object");
                  var n,
                    r = i.reducers,
                    a = D.call(o, e);
                  n = -1 === a ? new f(o, e, i) : o._observers[a];
                  for (
                    var s,
                      u = l(t),
                      c = u.length,
                      d = "function" == typeof r,
                      h = 0;
                    h < c;
                    h++
                  )
                    ((s = u[h]), n.subscribe(s, t[s] || s, d ? r : r && r[s]));
                }
                return (
                  (i = g(
                    i,
                    { on: t, off: t, reducers: t },
                    { on: y, off: y, reducers: b },
                  )),
                  r(n)
                    ? a(p(n))
                    : a("string" == typeof n ? p(n.split(/\s+/)) : n),
                  this
                );
              }),
              (k.prototype.stopListeningTo = function (e, t) {
                var n = this._observers;
                if (!n) return !1;
                var r,
                  i = n.length,
                  o = !1;
                if (e && "object" != typeof e)
                  throw TypeError("target should be an object");
                for (; i-- > 0; )
                  ((r = n[i]),
                    (e && r._target !== e) || (r.unsubscribe(t), (o = !0)));
                return o;
              }),
              (k.prototype.delimiter = "."),
              (k.prototype.setMaxListeners = function (e) {
                e !== t &&
                  ((this._maxListeners = e),
                  this._conf || (this._conf = {}),
                  (this._conf.maxListeners = e));
              }),
              (k.prototype.getMaxListeners = function () {
                return this._maxListeners;
              }),
              (k.prototype.event = ""),
              (k.prototype.once = function (e, t, n) {
                return this._once(e, t, !1, n);
              }),
              (k.prototype.prependOnceListener = function (e, t, n) {
                return this._once(e, t, !0, n);
              }),
              (k.prototype._once = function (e, t, n, r) {
                return this._many(e, 1, t, n, r);
              }),
              (k.prototype.many = function (e, t, n, r) {
                return this._many(e, t, n, !1, r);
              }),
              (k.prototype.prependMany = function (e, t, n, r) {
                return this._many(e, t, n, !0, r);
              }),
              (k.prototype._many = function (e, t, n, r, i) {
                var o = this;
                if ("function" != typeof n)
                  throw new Error("many only accepts instances of Function");
                function a() {
                  return (0 == --t && o.off(e, a), n.apply(this, arguments));
                }
                return ((a._origin = n), this._on(e, a, r, i));
              }),
              (k.prototype.emit = function () {
                if (!this._events && !this._all) return !1;
                this._events || u.call(this);
                var e,
                  t,
                  n,
                  r,
                  i,
                  a,
                  s = arguments[0],
                  l = this.wildcard;
                if (
                  "newListener" === s &&
                  !this._newListener &&
                  !this._events.newListener
                )
                  return !1;
                if (
                  l &&
                  ((e = s),
                  "newListener" !== s &&
                    "removeListener" !== s &&
                    "object" == typeof s)
                ) {
                  if (((n = s.length), o))
                    for (r = 0; r < n; r++)
                      if ("symbol" == typeof s[r]) {
                        a = !0;
                        break;
                      }
                  a || (s = s.join(this.delimiter));
                }
                var c,
                  d = arguments.length;
                if (this._all && this._all.length)
                  for (r = 0, n = (c = this._all.slice()).length; r < n; r++)
                    switch (((this.event = s), d)) {
                      case 1:
                        c[r].call(this, s);
                        break;
                      case 2:
                        c[r].call(this, s, arguments[1]);
                        break;
                      case 3:
                        c[r].call(this, s, arguments[1], arguments[2]);
                        break;
                      default:
                        c[r].apply(this, arguments);
                    }
                if (l) ((c = []), F.call(this, c, e, this.listenerTree, 0, n));
                else {
                  if ("function" == typeof (c = this._events[s])) {
                    switch (((this.event = s), d)) {
                      case 1:
                        c.call(this);
                        break;
                      case 2:
                        c.call(this, arguments[1]);
                        break;
                      case 3:
                        c.call(this, arguments[1], arguments[2]);
                        break;
                      default:
                        for (t = new Array(d - 1), i = 1; i < d; i++)
                          t[i - 1] = arguments[i];
                        c.apply(this, t);
                    }
                    return !0;
                  }
                  c && (c = c.slice());
                }
                if (c && c.length) {
                  if (d > 3)
                    for (t = new Array(d - 1), i = 1; i < d; i++)
                      t[i - 1] = arguments[i];
                  for (r = 0, n = c.length; r < n; r++)
                    switch (((this.event = s), d)) {
                      case 1:
                        c[r].call(this);
                        break;
                      case 2:
                        c[r].call(this, arguments[1]);
                        break;
                      case 3:
                        c[r].call(this, arguments[1], arguments[2]);
                        break;
                      default:
                        c[r].apply(this, t);
                    }
                  return !0;
                }
                if (!this.ignoreErrors && !this._all && "error" === s)
                  throw arguments[1] instanceof Error
                    ? arguments[1]
                    : new Error("Uncaught, unspecified 'error' event.");
                return !!this._all;
              }),
              (k.prototype.emitAsync = function () {
                if (!this._events && !this._all) return !1;
                this._events || u.call(this);
                var e,
                  t,
                  n,
                  r,
                  i,
                  a,
                  s = arguments[0],
                  l = this.wildcard;
                if (
                  "newListener" === s &&
                  !this._newListener &&
                  !this._events.newListener
                )
                  return Promise.resolve([!1]);
                if (
                  l &&
                  ((e = s),
                  "newListener" !== s &&
                    "removeListener" !== s &&
                    "object" == typeof s)
                ) {
                  if (((r = s.length), o))
                    for (i = 0; i < r; i++)
                      if ("symbol" == typeof s[i]) {
                        t = !0;
                        break;
                      }
                  t || (s = s.join(this.delimiter));
                }
                var c,
                  d = [],
                  h = arguments.length;
                if (this._all)
                  for (i = 0, r = this._all.length; i < r; i++)
                    switch (((this.event = s), h)) {
                      case 1:
                        d.push(this._all[i].call(this, s));
                        break;
                      case 2:
                        d.push(this._all[i].call(this, s, arguments[1]));
                        break;
                      case 3:
                        d.push(
                          this._all[i].call(
                            this,
                            s,
                            arguments[1],
                            arguments[2],
                          ),
                        );
                        break;
                      default:
                        d.push(this._all[i].apply(this, arguments));
                    }
                if (
                  (l
                    ? ((c = []), F.call(this, c, e, this.listenerTree, 0))
                    : (c = this._events[s]),
                  "function" == typeof c)
                )
                  switch (((this.event = s), h)) {
                    case 1:
                      d.push(c.call(this));
                      break;
                    case 2:
                      d.push(c.call(this, arguments[1]));
                      break;
                    case 3:
                      d.push(c.call(this, arguments[1], arguments[2]));
                      break;
                    default:
                      for (n = new Array(h - 1), a = 1; a < h; a++)
                        n[a - 1] = arguments[a];
                      d.push(c.apply(this, n));
                  }
                else if (c && c.length) {
                  if (((c = c.slice()), h > 3))
                    for (n = new Array(h - 1), a = 1; a < h; a++)
                      n[a - 1] = arguments[a];
                  for (i = 0, r = c.length; i < r; i++)
                    switch (((this.event = s), h)) {
                      case 1:
                        d.push(c[i].call(this));
                        break;
                      case 2:
                        d.push(c[i].call(this, arguments[1]));
                        break;
                      case 3:
                        d.push(c[i].call(this, arguments[1], arguments[2]));
                        break;
                      default:
                        d.push(c[i].apply(this, n));
                    }
                } else if (!this.ignoreErrors && !this._all && "error" === s)
                  return arguments[1] instanceof Error
                    ? Promise.reject(arguments[1])
                    : Promise.reject("Uncaught, unspecified 'error' event.");
                return Promise.all(d);
              }),
              (k.prototype.on = function (e, t, n) {
                return this._on(e, t, !1, n);
              }),
              (k.prototype.prependListener = function (e, t, n) {
                return this._on(e, t, !0, n);
              }),
              (k.prototype.onAny = function (e) {
                return this._onAny(e, !1);
              }),
              (k.prototype.prependAny = function (e) {
                return this._onAny(e, !0);
              }),
              (k.prototype.addListener = k.prototype.on),
              (k.prototype._onAny = function (e, t) {
                if ("function" != typeof e)
                  throw new Error("onAny only accepts instances of Function");
                return (
                  this._all || (this._all = []),
                  t ? this._all.unshift(e) : this._all.push(e),
                  this
                );
              }),
              (k.prototype._on = function (e, n, r, i) {
                if ("function" == typeof e) return (this._onAny(e, n), this);
                if ("function" != typeof n)
                  throw new Error("on only accepts instances of Function");
                this._events || u.call(this);
                var o,
                  a = this;
                return (
                  i !== t && ((n = (o = C.call(this, e, n, i))[0]), (a = o[1])),
                  this._newListener && this.emit("newListener", e, n),
                  this.wildcard
                    ? (S.call(this, e, n, r), a)
                    : (this._events[e]
                        ? ("function" == typeof this._events[e] &&
                            (this._events[e] = [this._events[e]]),
                          r
                            ? this._events[e].unshift(n)
                            : this._events[e].push(n),
                          !this._events[e].warned &&
                            this._maxListeners > 0 &&
                            this._events[e].length > this._maxListeners &&
                            ((this._events[e].warned = !0),
                            d.call(this, this._events[e].length, e)))
                        : (this._events[e] = n),
                      a)
                );
              }),
              (k.prototype.off = function (e, t) {
                if ("function" != typeof t)
                  throw new Error(
                    "removeListener only takes instances of Function",
                  );
                var n,
                  i = [];
                if (this.wildcard) {
                  var o =
                    "string" == typeof e ? e.split(this.delimiter) : e.slice();
                  if (!(i = F.call(this, null, o, this.listenerTree, 0)))
                    return this;
                } else {
                  if (!this._events[e]) return this;
                  ((n = this._events[e]), i.push({ _listeners: n }));
                }
                for (var a = 0; a < i.length; a++) {
                  var s = i[a];
                  if (((n = s._listeners), r(n))) {
                    for (var l = -1, u = 0, c = n.length; u < c; u++)
                      if (
                        n[u] === t ||
                        (n[u].listener && n[u].listener === t) ||
                        (n[u]._origin && n[u]._origin === t)
                      ) {
                        l = u;
                        break;
                      }
                    if (l < 0) continue;
                    return (
                      this.wildcard
                        ? s._listeners.splice(l, 1)
                        : this._events[e].splice(l, 1),
                      0 === n.length &&
                        (this.wildcard
                          ? delete s._listeners
                          : delete this._events[e]),
                      this._removeListener && this.emit("removeListener", e, t),
                      this
                    );
                  }
                  (n === t ||
                    (n.listener && n.listener === t) ||
                    (n._origin && n._origin === t)) &&
                    (this.wildcard
                      ? delete s._listeners
                      : delete this._events[e],
                    this._removeListener && this.emit("removeListener", e, t));
                }
                return (this.listenerTree && E(this.listenerTree), this);
              }),
              (k.prototype.offAny = function (e) {
                var t,
                  n = 0,
                  r = 0;
                if (e && this._all && this._all.length > 0) {
                  for (n = 0, r = (t = this._all).length; n < r; n++)
                    if (e === t[n])
                      return (
                        t.splice(n, 1),
                        this._removeListener &&
                          this.emit("removeListenerAny", e),
                        this
                      );
                } else {
                  if (((t = this._all), this._removeListener))
                    for (n = 0, r = t.length; n < r; n++)
                      this.emit("removeListenerAny", t[n]);
                  this._all = [];
                }
                return this;
              }),
              (k.prototype.removeListener = k.prototype.off),
              (k.prototype.removeAllListeners = function (e) {
                if (e === t) return (!this._events || u.call(this), this);
                if (this.wildcard) {
                  var n,
                    r = F.call(this, null, e, this.listenerTree, 0);
                  if (!r) return this;
                  for (n = 0; n < r.length; n++) r[n]._listeners = null;
                  this.listenerTree && E(this.listenerTree);
                } else this._events && (this._events[e] = null);
                return this;
              }),
              (k.prototype.listeners = function (e) {
                var n,
                  r,
                  i,
                  o,
                  a,
                  s = this._events;
                if (e === t) {
                  if (this.wildcard)
                    throw Error("event name required for wildcard emitter");
                  if (!s) return [];
                  for (o = (n = l(s)).length, i = []; o-- > 0; )
                    "function" == typeof (r = s[n[o]])
                      ? i.push(r)
                      : i.push.apply(i, r);
                  return i;
                }
                if (this.wildcard) {
                  if (!(a = this.listenerTree)) return [];
                  var u = [],
                    c =
                      "string" == typeof e
                        ? e.split(this.delimiter)
                        : e.slice();
                  return (F.call(this, u, c, a, 0), u);
                }
                return s && (r = s[e])
                  ? "function" == typeof r
                    ? [r]
                    : r
                  : [];
              }),
              (k.prototype.eventNames = function (e) {
                var t = this._events;
                return this.wildcard
                  ? _.call(this, this.listenerTree, [], null, e)
                  : t
                    ? l(t)
                    : [];
              }),
              (k.prototype.listenerCount = function (e) {
                return this.listeners(e).length;
              }),
              (k.prototype.hasListeners = function (e) {
                if (this.wildcard) {
                  var n = [],
                    r =
                      "string" == typeof e
                        ? e.split(this.delimiter)
                        : e.slice();
                  return (
                    F.call(this, n, r, this.listenerTree, 0),
                    n.length > 0
                  );
                }
                var i = this._events,
                  o = this._all;
                return !!(
                  (o && o.length) ||
                  (i && (e === t ? l(i).length : i[e]))
                );
              }),
              (k.prototype.listenersAny = function () {
                return this._all ? this._all : [];
              }),
              (k.prototype.waitFor = function (e, n) {
                var r = this,
                  i = typeof n;
                return (
                  "number" === i
                    ? (n = { timeout: n })
                    : "function" === i && (n = { filter: n }),
                  w(
                    (n = g(
                      n,
                      {
                        timeout: 0,
                        filter: t,
                        handleError: !1,
                        Promise: Promise,
                        overload: !1,
                      },
                      { filter: y, Promise: m },
                    )).Promise,
                    function (t, i, o) {
                      function a() {
                        var o = n.filter;
                        if (!o || o.apply(r, arguments))
                          if ((r.off(e, a), n.handleError)) {
                            var s = arguments[0];
                            s ? i(s) : t(h.apply(null, arguments).slice(1));
                          } else t(h.apply(null, arguments));
                      }
                      (o(function () {
                        r.off(e, a);
                      }),
                        r._on(e, a, !1));
                    },
                    { timeout: n.timeout, overload: n.overload },
                  )
                );
              }));
            var x = k.prototype;
            (Object.defineProperties(k, {
              defaultMaxListeners: {
                get: function () {
                  return x._maxListeners;
                },
                set: function (e) {
                  if ("number" != typeof e || e < 0 || Number.isNaN(e))
                    throw TypeError("n must be a non-negative number");
                  x._maxListeners = e;
                },
                enumerable: !0,
              },
              once: {
                value: function (e, t, n) {
                  return w(
                    (n = g(
                      n,
                      { Promise: Promise, timeout: 0, overload: !1 },
                      { Promise: m },
                    )).Promise,
                    function (n, r, i) {
                      var o;
                      if ("function" == typeof e.addEventListener)
                        return (
                          (o = function () {
                            n(h.apply(null, arguments));
                          }),
                          i(function () {
                            e.removeEventListener(t, o);
                          }),
                          void e.addEventListener(t, o, { once: !0 })
                        );
                      var a,
                        s = function () {
                          (a && e.removeListener("error", a),
                            n(h.apply(null, arguments)));
                        };
                      ("error" !== t &&
                        ((a = function (n) {
                          (e.removeListener(t, s), r(n));
                        }),
                        e.once("error", a)),
                        i(function () {
                          (a && e.removeListener("error", a),
                            e.removeListener(t, s));
                        }),
                        e.once(t, s));
                    },
                    { timeout: n.timeout, overload: n.overload },
                  );
                },
                writable: !0,
                configurable: !0,
              },
            }),
              Object.defineProperties(x, {
                _maxListeners: { value: 10, writable: !0, configurable: !0 },
                _observers: { value: null, writable: !0, configurable: !0 },
              }),
              (e.exports = k));
          })();
        })(wt)),
      wt.exports);
  function At() {
    if (Ft) return Dt;
    Ft = 1;
    var e = Object.assign
        ? Object.assign
        : function (e, t, n, r) {
            for (var i = 1; i < arguments.length; i++)
              o(Object(arguments[i]), function (t, n) {
                e[n] = t;
              });
            return e;
          },
      t = (function () {
        if (Object.create)
          return function (t, n, r, o) {
            var a = i(arguments, 1);
            return e.apply(this, [Object.create(t)].concat(a));
          };
        {
          function t() {}
          return function (n, r, o, a) {
            var s = i(arguments, 1);
            return ((t.prototype = n), e.apply(this, [new t()].concat(s)));
          };
        }
      })(),
      n = String.prototype.trim
        ? function (e) {
            return String.prototype.trim.call(e);
          }
        : function (e) {
            return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
          },
      r = "undefined" != typeof window ? window : Xe;
    function i(e, t) {
      return Array.prototype.slice.call(e, t || 0);
    }
    function o(e, t) {
      a(e, function (e, n) {
        return (t(e, n), !1);
      });
    }
    function a(e, t) {
      if (s(e)) {
        for (var n = 0; n < e.length; n++) if (t(e[n], n)) return e[n];
      } else
        for (var r in e) if (e.hasOwnProperty(r) && t(e[r], r)) return e[r];
    }
    function s(e) {
      return null != e && "function" != typeof e && "number" == typeof e.length;
    }
    return (
      (Dt = {
        assign: e,
        create: t,
        trim: n,
        bind: function (e, t) {
          return function () {
            return t.apply(e, Array.prototype.slice.call(arguments, 0));
          };
        },
        slice: i,
        each: o,
        map: function (e, t) {
          var n = s(e) ? [] : {};
          return (
            a(e, function (e, r) {
              return ((n[r] = t(e, r)), !1);
            }),
            n
          );
        },
        pluck: a,
        isList: s,
        isFunction: function (e) {
          return e && "[object Function]" === {}.toString.call(e);
        },
        isObject: function (e) {
          return e && "[object Object]" === {}.toString.call(e);
        },
        Global: r,
      }),
      Dt
    );
  }
  var Ct,
    kt,
    xt = (function () {
      if (_t) return St;
      _t = 1;
      var e = At(),
        t = e.slice,
        n = e.pluck,
        r = e.each,
        i = e.bind,
        o = e.create,
        a = e.isList,
        s = e.isFunction,
        l = e.isObject,
        u = {
          version: "2.0.12",
          enabled: !1,
          get: function (e, t) {
            var n = this.storage.read(this._namespacePrefix + e);
            return this._deserialize(n, t);
          },
          set: function (e, t) {
            return void 0 === t
              ? this.remove(e)
              : (this.storage.write(
                  this._namespacePrefix + e,
                  this._serialize(t),
                ),
                t);
          },
          remove: function (e) {
            this.storage.remove(this._namespacePrefix + e);
          },
          each: function (e) {
            var t = this;
            this.storage.each(function (n, r) {
              e.call(
                t,
                t._deserialize(n),
                (r || "").replace(t._namespaceRegexp, ""),
              );
            });
          },
          clearAll: function () {
            this.storage.clearAll();
          },
          hasNamespace: function (e) {
            return this._namespacePrefix == "__storejs_" + e + "_";
          },
          createStore: function () {
            return c.apply(this, arguments);
          },
          addPlugin: function (e) {
            this._addPlugin(e);
          },
          namespace: function (e) {
            return c(this.storage, this.plugins, e);
          },
        };
      function c(e, c, d) {
        (d || (d = ""), e && !a(e) && (e = [e]), c && !a(c) && (c = [c]));
        var h = d ? "__storejs_" + d + "_" : "",
          p = d ? new RegExp("^" + h) : null;
        if (!/^[a-zA-Z0-9_\-]*$/.test(d))
          throw new Error(
            "store.js namespaces can only have alphanumerics + underscores and dashes",
          );
        var f = {
            _namespacePrefix: h,
            _namespaceRegexp: p,
            _testStorage: function (e) {
              try {
                var t = "__storejs__test__";
                e.write(t, t);
                var n = e.read(t) === t;
                return (e.remove(t), n);
              } catch (e) {
                return !1;
              }
            },
            _assignPluginFnProp: function (e, n) {
              var i = this[n];
              this[n] = function () {
                var n = t(arguments, 0),
                  o = this;
                var a = [
                  function () {
                    if (i)
                      return (
                        r(arguments, function (e, t) {
                          n[t] = e;
                        }),
                        i.apply(o, n)
                      );
                  },
                ].concat(n);
                return e.apply(o, a);
              };
            },
            _serialize: function (e) {
              return JSON.stringify(e);
            },
            _deserialize: function (e, t) {
              if (!e) return t;
              var n = "";
              try {
                n = JSON.parse(e);
              } catch (t) {
                n = e;
              }
              return void 0 !== n ? n : t;
            },
            _addStorage: function (e) {
              this.enabled ||
                (this._testStorage(e) &&
                  ((this.storage = e), (this.enabled = !0)));
            },
            _addPlugin: function (e) {
              var t = this;
              if (a(e))
                r(e, function (e) {
                  t._addPlugin(e);
                });
              else if (
                !n(this.plugins, function (t) {
                  return e === t;
                })
              ) {
                if ((this.plugins.push(e), !s(e)))
                  throw new Error(
                    "Plugins must be function values that return objects",
                  );
                var i = e.call(this);
                if (!l(i))
                  throw new Error(
                    "Plugins must return an object of function properties",
                  );
                r(i, function (n, r) {
                  if (!s(n))
                    throw new Error(
                      "Bad plugin property: " +
                        r +
                        " from plugin " +
                        e.name +
                        ". Plugins should only return functions.",
                    );
                  t._assignPluginFnProp(n, r);
                });
              }
            },
            addStorage: function (e) {
              (!(function () {
                var e = "undefined" == typeof console ? null : console;
                e && (e.warn ? e.warn : e.log).apply(e, arguments);
              })(
                "store.addStorage(storage) is deprecated. Use createStore([storages])",
              ),
                this._addStorage(e));
            },
          },
          g = o(f, u, { plugins: [] });
        return (
          (g.raw = {}),
          r(g, function (e, t) {
            s(e) && (g.raw[t] = i(g, e));
          }),
          r(e, function (e) {
            g._addStorage(e);
          }),
          r(c, function (e) {
            g._addPlugin(e);
          }),
          g
        );
      }
      return (St = { createStore: c });
    })();
  var Pt,
    Ot,
    It = (function () {
      if (kt) return Ct;
      kt = 1;
      var e = At().Global;
      function t() {
        return e.localStorage;
      }
      function n(e) {
        return t().getItem(e);
      }
      return (
        (Ct = {
          name: "localStorage",
          read: n,
          write: function (e, n) {
            return t().setItem(e, n);
          },
          each: function (e) {
            for (var r = t().length - 1; r >= 0; r--) {
              var i = t().key(r);
              e(n(i), i);
            }
          },
          remove: function (e) {
            return t().removeItem(e);
          },
          clearAll: function () {
            return t().clear();
          },
        }),
        Ct
      );
    })(),
    jt = e({ __proto__: null, default: It }, [It]);
  var Tt,
    Rt,
    Lt = (function () {
      if (Ot) return Pt;
      Ot = 1;
      var e = At().Global;
      function t() {
        return e.sessionStorage;
      }
      function n(e) {
        return t().getItem(e);
      }
      return (
        (Pt = {
          name: "sessionStorage",
          read: n,
          write: function (e, n) {
            return t().setItem(e, n);
          },
          each: function (e) {
            for (var r = t().length - 1; r >= 0; r--) {
              var i = t().key(r);
              e(n(i), i);
            }
          },
          remove: function (e) {
            return t().removeItem(e);
          },
          clearAll: function () {
            return t().clear();
          },
        }),
        Pt
      );
    })(),
    Bt = e({ __proto__: null, default: Lt }, [Lt]);
  var Ut,
    Nt,
    qt = (function () {
      if (Rt) return Tt;
      Rt = 1;
      var e = At(),
        t = e.Global,
        n = e.trim;
      Tt = {
        name: "cookieStorage",
        read: function (e) {
          if (!e || !a(e)) return null;
          var t =
            "(?:^|.*;\\s*)" +
            escape(e).replace(/[\-\.\+\*]/g, "\\$&") +
            "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*";
          return unescape(r.cookie.replace(new RegExp(t), "$1"));
        },
        write: function (e, t) {
          if (!e) return;
          r.cookie =
            escape(e) +
            "=" +
            escape(t) +
            "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
        },
        each: i,
        remove: o,
        clearAll: function () {
          i(function (e, t) {
            o(t);
          });
        },
      };
      var r = t.document;
      function i(e) {
        for (var t = r.cookie.split(/; ?/g), i = t.length - 1; i >= 0; i--)
          if (n(t[i])) {
            var o = t[i].split("="),
              a = unescape(o[0]);
            e(unescape(o[1]), a);
          }
      }
      function o(e) {
        e &&
          a(e) &&
          (r.cookie =
            escape(e) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/");
      }
      function a(e) {
        return new RegExp(
          "(?:^|;\\s*)" + escape(e).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=",
        ).test(r.cookie);
      }
      return Tt;
    })(),
    zt = e({ __proto__: null, default: qt }, [qt]);
  var $t = (function () {
      if (Nt) return Ut;
      ((Nt = 1),
        (Ut = {
          name: "memoryStorage",
          read: function (t) {
            return e[t];
          },
          write: function (t, n) {
            e[t] = n;
          },
          each: function (t) {
            for (var n in e) e.hasOwnProperty(n) && t(e[n], n);
          },
          remove: function (t) {
            delete e[t];
          },
          clearAll: function (t) {
            e = {};
          },
        }));
      var e = {};
      return Ut;
    })(),
    Mt = e({ __proto__: null, default: $t }, [$t]);
  function Ht(e, t) {
    (void 0 === t && (t = !1), (e += ""));
    for (
      var n,
        r = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"],
        i = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        o = (t =
          t || !Salla.config.get("store.settings.arabic_numbers_enabled"))
          ? r
          : i,
        a = t ? i : r,
        s = 0;
      s < o.length;
      s++
    )
      ((n = new RegExp(o[s], "g")), (e = e.replace(n, a[s])));
    return e.replace(t ? "٫" : ".", t ? "." : "٫");
  }
  function Jt(e) {
    var t = ("".concat(e).match(/\./g) || []).length;
    return t && 1 !== t ? Jt(e.replace(/\.(.+)\./g, ".$1")) : e;
  }
  function Wt(e) {
    return (
      "".concat(e).startsWith("https://") || "".concat(e).startsWith("http://")
    );
  }
  function Gt(e) {
    if (Wt(e)) return e;
    var t = Salla.config.get("store.url");
    return (
      t ||
        ((t = window.location.href.split("/").slice(0, -1).join("/")),
        Salla.config.set("store.url", t)),
      t.rtrim("/") + "/" + (null == e ? void 0 : e.ltrim("/"))
    );
  }
  function Vt(e, t, n) {
    if (((n = n || window.location.href), !t || !e)) return n;
    var r = new RegExp("([?&])" + e + "=[^&]+[&]?", "g");
    return (
      (n = n
        .replace(r, "$1")
        .split("#")[0]
        .replace(/&$|\?$/, "")).includes("?")
        ? (n += "&")
        : (n += (n.endsWith("/") ? "" : "/") + "?"),
      (n + e + "=" + encodeURIComponent(t)).replace(/&$|\?$/, "")
    );
  }
  function Kt(e) {
    return window.location.origin + "/" + (null == e ? void 0 : e.ltrim("/"));
  }
  function Qt(e) {
    return Wt(e)
      ? e
      : Salla.config.get("theme.assets")
        ? Salla.config
            .get("theme.assets")
            .replace(":path", null == e ? void 0 : e.ltrim("/"))
        : Kt(
            "themes/" +
              Salla.config.get("theme.name") +
              "/" +
              (null == e ? void 0 : e.ltrim("/")),
          );
  }
  ((String.prototype.toStudlyCase = function () {
    return this.trim().replace(/([^a-zA-Z\d].)/g, function (e) {
      return e.toUpperCase().replace(/[^a-zA-Z\d]/g, "");
    });
  }),
    (String.prototype.toDatasetName = function () {
      return this.startsWith("data-")
        ? this.substr(5).toStudlyCase()
        : this.toStudlyCase();
    }),
    (String.prototype.toSelector = function () {
      return this.trim().startsWith(".") || this.trim().startsWith("#")
        ? this.toString()
        : "#" + this.toString();
    }),
    (String.prototype.replaceArray = function (e, t) {
      for (var n, r = this, i = 0; i < e.length; i++)
        ((n = new RegExp(e[i], "g")), (r = r.replace(n, t[i])));
      return r;
    }),
    (String.prototype.rtrim = function (e) {
      return (
        void 0 === e && (e = "\\s"),
        this.replace(new RegExp("[" + e + "]*$"), "")
      );
    }),
    (String.prototype.ltrim = function (e) {
      return (
        void 0 === e && (e = "\\s"),
        this.replace(new RegExp("^[" + e + "]*"), "")
      );
    }),
    (String.prototype.digitsOnly = function () {
      return Salla.helpers.digitsOnly(this);
    }));
  var Xt = Object.freeze({
      __proto__: null,
      addParamToUrl: Vt,
      api: function (e) {
        var t;
        return (
          (null === (t = Salla.config.get("store.api", Gt(""))) || void 0 === t
            ? void 0
            : t.rtrim("/")) +
          "/" +
          (null == e ? void 0 : e.ltrim("/"))
        );
      },
      asset: Qt,
      base: function (e) {
        return Wt(e)
          ? e
          : "https://" +
              new URL(Gt("/")).hostname +
              "/" +
              (null == e ? void 0 : e.ltrim("/"));
      },
      baseUrl: Kt,
      cdn: function (e, t, n) {
        var r = "https://cdn.salla.network/";
        return (
          (t || n) &&
            ((t = t ? ",width=".concat(t) : ""),
            (n = n ? ",height=".concat(n) : ""),
            (r += "cdn-cgi/image/fit=scale-down"
              .concat(t)
              .concat(n, ",onerror=redirect,format=auto/"))),
          r + (null == e ? void 0 : e.ltrim("/"))
        );
      },
      create: function (e, t) {
        return "custom" === e
          ? t
          : Gt("offers" === e ? e : "redirect/".concat(e, "/").concat(t));
      },
      domain: function (e) {
        return Wt(e)
          ? e
          : ""
              .concat(
                Salla.config
                  .get(
                    "store.url",
                    window.location.href.split("/").slice(0, -1).join("/"),
                  )
                  .rtrim("/"),
                "/",
              )
              .concat(null == e ? void 0 : e.ltrim("/"));
      },
      get: Gt,
      is_full_url: Wt,
      is_page: function (e) {
        return e && Salla.config.get("page.slug") === e;
      },
      is_placeholder: function (e) {
        return Qt(salla.config.get("theme.settings.placeholder")) === Qt(e);
      },
    }),
    Yt = function (e, t) {
      return (
        (Yt =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (e, t) {
              e.__proto__ = t;
            }) ||
          function (e, t) {
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
          }),
        Yt(e, t)
      );
    },
    Zt = function () {
      return (
        (Zt =
          Object.assign ||
          function (e) {
            for (var t, n = 1, r = arguments.length; n < r; n++)
              for (var i in (t = arguments[n]))
                Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
            return e;
          }),
        Zt.apply(this, arguments)
      );
    };
  function en(e, t, n) {
    if (2 === arguments.length)
      for (var r, i = 0, o = t.length; i < o; i++)
        (!r && i in t) ||
          (r || (r = Array.prototype.slice.call(t, 0, i)), (r[i] = t[i]));
    return e.concat(r || Array.prototype.slice.call(t));
  }
  function tn(e) {
    return e instanceof FormData;
  }
  function nn(e) {
    return e instanceof File;
  }
  function rn(e) {
    return e instanceof Blob;
  }
  "function" == typeof SuppressedError && SuppressedError;
  var on = (function () {
    function e(e) {
      ((this.data = e), (this.proxy = this.createProxy()));
    }
    return (
      (e.prototype.createProxy = function () {
        var e = this;
        return new Proxy(this, {
          get: function (t, n) {
            return n in t ? t[n] : "string" == typeof n ? e.get(n) : void 0;
          },
          set: function (t, n, r) {
            return "string" == typeof n && (e.set(n, r), !0);
          },
          has: function (t, n) {
            return "string" == typeof n ? e.has(n) : n in t;
          },
          deleteProperty: function (t, n) {
            return "string" == typeof n && e.delete(n);
          },
        });
      }),
      (e.prototype.get = function (e) {
        return tn(this.data) ? this.data.get(e) : this.data[e];
      }),
      (e.prototype.getAll = function (e) {
        if (tn(this.data)) return this.data.getAll(e);
        var t = this.data[e];
        return void 0 === t ? [] : [t];
      }),
      (e.prototype.set = function (e, t) {
        var n = this;
        tn(this.data)
          ? (this.data.delete(e),
            null != t &&
              (Array.isArray(t)
                ? t.forEach(function (t) {
                    nn(t) || rn(t)
                      ? n.data.append(e, t)
                      : n.data.append(e, String(t));
                  })
                : nn(t) || rn(t)
                  ? this.data.append(e, t)
                  : this.data.append(e, String(t))))
          : (this.data[e] = t);
      }),
      (e.prototype.append = function (e, t) {
        if (tn(this.data))
          nn(t) || rn(t)
            ? this.data.append(e, t)
            : null != t && this.data.append(e, String(t));
        else {
          var n = this.data[e];
          void 0 === n
            ? (this.data[e] = t)
            : Array.isArray(n)
              ? n.push(t)
              : (this.data[e] = [n, t]);
        }
      }),
      (e.prototype.setFile = function (e, t) {
        this.set(e, t);
      }),
      (e.prototype.getFile = function (e) {
        var t = this.get(e);
        return nn(t) ? t : null;
      }),
      (e.prototype.getFiles = function (e) {
        return this.getAll(e).filter(nn);
      }),
      (e.prototype.has = function (e) {
        return tn(this.data) ? this.data.has(e) : e in this.data;
      }),
      (e.prototype.delete = function (e) {
        return tn(this.data) ? (this.data.delete(e), !0) : delete this.data[e];
      }),
      (e.prototype.keys = function () {
        if (!tn(this.data)) return Object.keys(this.data);
        for (
          var e = new Set(), t = 0, n = this.data.entries();
          t < n.length;
          t++
        ) {
          var r = n[t][0];
          e.add(r);
        }
        return Array.from(e);
      }),
      (e.prototype.values = function () {
        if (!tn(this.data)) return Object.values(this.data);
        for (var e = [], t = 0, n = this.data.entries(); t < n.length; t++) {
          var r = n[t][1];
          e.push(r);
        }
        return e;
      }),
      (e.prototype.entries = function () {
        return tn(this.data)
          ? Array.from(this.data.entries())
          : Object.entries(this.data);
      }),
      (e.prototype.toObject = function () {
        if (!tn(this.data)) return Zt({}, this.data);
        for (var e = {}, t = 0, n = this.data.entries(); t < n.length; t++) {
          var r = n[t],
            i = r[0],
            o = r[1];
          void 0 !== e[i]
            ? (Array.isArray(e[i]) || (e[i] = [e[i]]), e[i].push(o))
            : (e[i] = o);
        }
        return e;
      }),
      (e.prototype.getFileInfo = function (e) {
        var t = this.getFiles(e);
        return 0 === t.length
          ? null
          : t.map(function (e) {
              return { name: e.name, size: e.size, type: e.type };
            });
      }),
      (e.prototype.isFile = function (e) {
        var t = this.get(e);
        return nn(t) || rn(t);
      }),
      (e.prototype.getRawData = function () {
        return this.data;
      }),
      (e.prototype.getProxy = function () {
        return this.proxy;
      }),
      e
    );
  })();
  function an(e, t, n) {
    var r,
      i = e[0];
    return n && 0 == e.length
      ? Array.isArray(n)
        ? (n.push(t), n)
        : [n, t]
      : Array.isArray(n)
        ? (n.push(t), n)
        : "string" == typeof n
          ? [n, t]
          : n
            ? ((n[i] = an(e.slice(1), t, n[i])), n)
            : i
              ? (((r = {})[i] = an(e.slice(1), t)), r)
              : "" === i
                ? [t]
                : t;
  }
  function sn() {
    return window.self !== window.top;
  }
  var ln,
    un,
    cn,
    dn,
    hn = {
      digitsOnly: function (e) {
        return Ht(e, !0)
          .replace(/[^0-9.]/g, "")
          .replace("..", ".")
          .rtrim(".");
      },
      inputDigitsOnly: function e(t, n) {
        if ((void 0 === n && (n = !1), "string" == typeof t))
          return document.querySelectorAll(t).forEach(function (t) {
            return e(t, n);
          });
        if (t) {
          var r = Salla.helpers.digitsOnly(t.value);
          return t.min && r < parseInt(t.min)
            ? (t.value = t.min)
            : t.max && r > parseInt(t.max)
              ? (t.value = t.max)
              : t.maxLength >= 1 && r.toString().length > t.maxLength
                ? (t.value = r.toString().substring(0, t.maxLength))
                : (t.value =
                    n || t.dataset.hasOwnProperty("digitsWithDecimal")
                      ? Jt(r)
                      : r.replace(/\D/g, ""));
        }
        Salla.logger.warn("Can't find Object With Id: " + t);
      },
      number: Ht,
      money: function (e, t) {
        void 0 === t && (t = !0);
        var n = Salla.config.currency(null == e ? void 0 : e.currency).symbol;
        return (
          (e = Ht((e = "object" == typeof e ? e.amount : e)) + " " + n),
          t &&
            ["SAR", "ر.س"].includes(n) &&
            Salla.config.get("store.settings.use_sar_symbol") &&
            (e = e.replace(n, "<i class=sicon-sar></i>")),
          e
        );
      },
      isIframe: sn,
      isPreview: function () {
        return sn();
      },
      setNested: function (e, t, n) {
        for (var r = e, i = t.split("."), o = i.length, a = 0; a < o - 1; a++) {
          var s = i[a];
          (r[s] || (r[s] = {}), (r = r[s]));
        }
        return ((r[i[o - 1]] = n), e);
      },
      getNested: function (e, t, n) {
        var r = bt.default ? bt.default(e, t) : bt(e, t);
        return void 0 !== r ? r : n;
      },
      inputData: function (e, t, n) {
        if ((void 0 === n && (n = {}), e.includes("["))) {
          var r = e.split("]").join("").split("["),
            i = r[0],
            o = n && "object" == typeof n ? n[i] : void 0;
          return { name: i, value: an(r.slice(1), t, o) };
        }
        return { name: e, value: t };
      },
      url: Xt,
      addParamToUrl: Vt,
      debounce: function (e, t) {
        t = t || 100;
        var n,
          r = [];
        return function () {
          for (var i = [], o = 0; o < arguments.length; o++)
            i[o] = arguments[o];
          return (
            clearTimeout(n),
            (n = setTimeout(function () {
              var t = e.apply(void 0, i);
              (r.forEach(function (e) {
                return e(t);
              }),
                (r = []));
            }, t)),
            new Promise(function (e) {
              return r.push(e);
            })
          );
        };
      },
      hasApplePay: function () {
        var e;
        try {
          return !!(null === (e = window.ApplePaySession) || void 0 === e
            ? void 0
            : e.canMakePayments());
        } catch (e) {
          return (console.error(e), !1);
        }
      },
      createFormDataWrapper: function (e) {
        return new on(e).getProxy();
      },
      isAppleDevice: function () {
        try {
          var e = navigator.userAgent || "",
            t = navigator.platform || "",
            n = /iPhone|iPad|iPod/i.test(e),
            r = /Mac/i.test(t);
          return n || r;
        } catch (e) {
          return (console.error(e), !1);
        }
      },
      isIOSDevice: function () {
        try {
          var e = navigator.userAgent || "";
          return /iPhone|iPad|iPod/i.test(e);
        } catch (e) {
          return (console.error(e), !1);
        }
      },
    },
    pn =
      ((ln = console),
      (un = []),
      (cn = []),
      (dn = {
        log: function (e, t) {
          if (ln && salla.config.isDebug()) {
            (un.push([t, e]),
              "trace" === salla.config.get("debug") && (t = "trace"));
            var n = ln.log,
              r = void 0 === t ? n : this.__dict__[t] || n,
              i = [
                "%cTwilight",
                "color: #5cd5c4;font-weight:bold; border:1px solid #5cd5c4; padding: 2px 6px; border-radius: 5px;",
              ];
            cn.forEach(function (e) {
              ((i[0] += e[0]), i.push(e[1]));
            });
            var o = { event: "#CFF680", backend: "#7b68ee" }[t];
            (o &&
              ((i[0] += "%c" + t[0].toUpperCase() + t.substring(1)),
              i.push(
                "margin-left: 5px;color: "
                  .concat(o, ";font-weight:bold; border:1px solid ")
                  .concat(o, "; padding: 2px 6px; border-radius: 5px;"),
              )),
              r.call.apply(r, en([ln], i.concat.apply(i, e), !1)));
          }
        },
        __dict__: {
          trace: ln.trace,
          debug: ln.debug,
          info: ln.info,
          warn: ln.warn,
          error: ln.error,
        },
      }),
      {
        event: function () {
          dn.log(arguments, "event");
        },
        trace: function () {
          dn.log(arguments, "trace");
        },
        debug: function () {
          dn.log(arguments, "debug");
        },
        info: function () {
          dn.log(arguments, "info");
        },
        warn: function () {
          dn.log(arguments, "warn");
        },
        error: function () {
          dn.log(arguments, "error");
        },
        log: function () {
          dn.log(arguments, void 0);
        },
        backend: function () {
          dn.log(arguments, "backend");
        },
        logs: function (e) {
          [e].flat().forEach(function (e) {
            return e && dn.log([e].flat(), "backend");
          });
        },
        history: function () {
          return (
            un.map(function (e) {
              return ln.log.apply(ln, en([e[0]], e[1], !1));
            }),
            un
          );
        },
        addPrefix: function (e) {
          return (
            Array.isArray(e)
              ? cn.unshift(e)
              : this.warn("addPrefix receives array only!"),
            this
          );
        },
      }),
    fn = (function () {
      function e(e, t) {
        (void 0 === e && (e = {}),
          void 0 === t && (t = {}),
          (this.default_properties = t),
          (this.properties_ = Zt(Zt({}, this.default_properties), e)));
      }
      return (
        (e.prototype.merge = function (e) {
          var t;
          return (
            (this.properties_ = Zt(Zt({}, this.properties_), e)),
            (this.properties_.store = Zt(
              Zt(
                {},
                (null === (t = this.default_properties) || void 0 === t
                  ? void 0
                  : t.store) || {},
              ),
              this.properties_.store,
            )),
            this
          );
        }),
        (e.prototype.set = function (e, t) {
          return e.includes(".")
            ? (Salla.helpers.setNested(this.properties_, e, t), this)
            : ((this.properties_[e] = t), this);
        }),
        (e.prototype.currency = function (e) {
          return (
            void 0 === e && (e = void 0),
            (e = e || this.get("user.currency_code")),
            this.get("currencies." + e) ||
              Object.values(this.get("currencies"))[0]
          );
        }),
        (e.prototype.get = function (e, t) {
          return (
            void 0 === t && (t = null),
            e.includes(".")
              ? Salla.helpers.getNested(this.properties_, e, t)
              : this.properties_.hasOwnProperty(e)
                ? this.properties_[e] || t
                : t || void 0
          );
        }),
        (e.prototype.all = function () {
          return this.properties_;
        }),
        (e.prototype.isDebug = function () {
          return this.get("debug") || Salla.storage.get("debug");
        }),
        e
      );
    })(),
    gn = (function (e) {
      function t() {
        var t = this;
        return (
          ((t =
            e.call(this, {
              wildcard: !0,
              delimiter: "::",
              newListener: !1,
              removeListener: !1,
              maxListeners: 10,
              verboseMemoryLeak: !1,
              ignoreErrors: !1,
            }) || this).delimiter = "::"),
          "undefined" != typeof document &&
            (t.body = document.querySelector("body")),
          (t.logableEvents = [
            "cart::item.added.failed",
            "cart::item.deleted.failed",
          ]),
          (t.ingoreLogEvents = [
            "document::click",
            "document::keyup",
            "document::change",
          ]),
          (t.noneFireableActions = ["document.request"]),
          (t.emittedEvents = new Set()),
          t
        );
      }
      return (
        (function (e, t) {
          if ("function" != typeof t && null !== t)
            throw new TypeError(
              "Class extends value " +
                String(t) +
                " is not a constructor or null",
            );
          function n() {
            this.constructor = e;
          }
          (Yt(e, t),
            (e.prototype =
              null === t
                ? Object.create(t)
                : ((n.prototype = t.prototype), new n())));
        })(t, e),
        (t.prototype.createAndDispatch = function (e) {
          for (var t = [], n = 1; n < arguments.length; n++)
            t[n - 1] = arguments[n];
          this.dispatch.apply(this, en([e], t, !1));
        }),
        (t.prototype.emit = function (t) {
          for (var n, r = [], i = 1; i < arguments.length; i++)
            r[i - 1] = arguments[i];
          this.emittedEvents.add(t);
          var o = t.replace("::", ".");
          if (
            !this.noneFireableActions.includes(o) &&
            Salla.call &&
            "function" == typeof Salla.call(o)
          )
            return (
              Salla.log(
                "'Salla."
                  .concat(o, "(...)' triggered using event '")
                  .concat(t, "'"),
              ),
              (o = o.split(".")),
              Array.isArray(r[0]) && (r = r[0]),
              void (n = salla[o[0]])[o[1]].apply(n, r)
            );
          (e.prototype.emit.apply(this, en([t], r, !1)),
            this.trackEvents.apply(this, en([t], r, !1)));
        }),
        (t.prototype.onlyWhen = function (e, t) {
          var n = this;
          return (
            (t = t || function () {}),
            new Promise(function (r) {
              return n.emittedEvents.has(e)
                ? r(t())
                : n.once(e, function () {
                    return r(t());
                  });
            })
          );
        }),
        (t.prototype.emitAsync = function (t) {
          for (var n = [], r = 1; r < arguments.length; r++)
            n[r - 1] = arguments[r];
          this.emittedEvents.add(t);
          var i = e.prototype.emitAsync.apply(this, en([t], n, !1));
          try {
            this.trackEvents.apply(this, en([t], n, !1));
          } catch (e) {
            Salla.logger.warn("error on tracking event (".concat(t, ")"), n, e);
          }
          return i;
        }),
        (t.prototype.trackEvents = function (e) {
          for (var t, n = [], r = 1; r < arguments.length; r++)
            n[r - 1] = arguments[r];
          if ("undefined" != typeof window)
            try {
              window.dataLayer = window.dataLayer || [];
              var i = { event: e };
              (n.map(function (e) {
                return "object" == typeof e && (i = Zt(Zt({}, i), e));
              }),
                window.dataLayer.push(i));
            } catch (e) {
              salla.logger.error(e.message);
            }
          (Salla.logger &&
            !this.ingoreLogEvents.includes(e) &&
            (t = Salla.logger).event.apply(t, en([e], n, !1)),
            this.dispatchMobileEvent.apply(this, en([e], n, !1)));
        }),
        (t.prototype.dispatch = function (e) {
          for (var t = [], n = 1; n < arguments.length; n++)
            t[n - 1] = arguments[n];
          return this.emit.apply(this, en([e], t, !1));
        }),
        (t.prototype.dispatchEvents = function (e) {
          if (e)
            if ("object" != typeof e || Array.isArray(e))
              Salla.log(
                "Events object is wrong, it should be object of {event:payload}",
                e,
              );
            else
              for (var t = 0, n = Object.entries(e); t < n.length; t++) {
                var r = n[t],
                  i = r[0],
                  o = r[1];
                this.dispatch(i, o);
              }
          else Salla.log("No Events To Dispatch!", e);
        }),
        (t.prototype.addListener = function (e, t, n) {
          return this.on(e, t, n);
        }),
        (t.prototype.addEventListener = function (e, t, n) {
          return this.on(e, t, n);
        }),
        (t.prototype.listen = function (e, t) {
          return this.on(e, t);
        }),
        (t.prototype.registerGlobalListener = function (e, t) {
          return this.onAny(t);
        }),
        (t.prototype.dispatchMobileEvent = function (e, t) {
          var n;
          if ((void 0 === t && (t = {}), "undefined" != typeof window)) {
            if (window.webkit)
              try {
                return void window.webkit.messageHandlers.callbackHandler.postMessage(
                  JSON.stringify({ event: e, details: t }),
                );
              } catch (e) {
                Salla.log(e, "The native context does not exist yet");
              }
            if (
              null === (n = window.Android) || void 0 === n
                ? void 0
                : n.customEventWithData
            )
              try {
                window.Android.customEventWithData(
                  e,
                  JSON.stringify({ details: t }),
                );
              } catch (e) {
                Salla.log(e, "The native context does not exist yet");
              }
            else if (window.flutter_inappwebview)
              try {
                window.flutter_inappwebview.callHandler("sallaEvent", {
                  event: e,
                  details: t,
                });
              } catch (e) {
                Salla.log(e, "The Flutter context does not exist yet");
              }
          }
        }),
        t
      );
    })(Et.EventEmitter2),
    mn = xt.createStore([jt, Bt, zt, Mt], []),
    vn = xt.createStore([Bt], []),
    yn = xt.createStore([zt], []),
    bn = (function () {
      function e() {
        var e = this;
        ((this.clearableItems = ["cart", "user", "salla::wishlist", "token"]),
          Salla.event.on("storage::item.remove", function (t) {
            return e.remove(t);
          }),
          Salla.event.on("storage::item.set", function (t, n) {
            return e.set(t, n);
          }),
          (this.store = mn),
          (this.session = vn),
          (this.cookie = yn));
      }
      return (
        (e.prototype.set = function (e, t) {
          var n;
          if (e.includes(".")) {
            var r = e.split(".")[0],
              i = (((n = {})[r] = this.store.get(r)), n);
            return (
              (i = Salla.helpers.setNested(i, e, t)),
              this.store.set(r, i[r])
            );
          }
          return this.store.set(e, t);
        }),
        (e.prototype.remove = function (e) {
          return this.store.remove(e);
        }),
        (e.prototype.clearAll = function (e) {
          var t = this;
          if ((void 0 === e && (e = !1), e)) return this.store.clearAll();
          this.clearableItems.forEach(function (e) {
            t.store.remove(e);
          });
        }),
        (e.prototype.get = function (e, t) {
          var n;
          if (e.includes(".")) {
            var r = e.split(".")[0];
            return Salla.helpers.getNested(
              (((n = {})[r] = this.store.get(r)), n),
              e,
            );
          }
          return this.store.get(e, t);
        }),
        (e.prototype.prefixKey = function (e) {
          return "".concat(e, "_").concat(Salla.config.get("store.id"));
        }),
        (e.prototype.setWithTTL = function (e, t, n, r) {
          (void 0 === n && (n = 10), void 0 === r && (r = "store"));
          var i = this.prefixKey(e),
            o = new Date().getTime() + 60 * n * 1e3;
          return this[r].set(i, { value: t, expiry: o });
        }),
        (e.prototype.getWithTTL = function (e, t, n) {
          (void 0 === t && (t = null), void 0 === n && (n = "store"));
          var r = this.prefixKey(e),
            i = this[n].get(r);
          return i
            ? new Date().getTime() > i.expiry
              ? (this[n].remove(r), t)
              : i.value
            : t;
        }),
        e
      );
    })(),
    wn = (function () {
      function e() {
        var e = this;
        ((this.keysToRemove = [
          "__said",
          "__ssid",
          "theme_edit",
          "ws_port",
          "s-token",
        ]),
          (this.dynamicKeysToRemove = ["affiliate", "cart"]),
          Salla.event.on("cookies::remove", function (t) {
            return e.remove(t);
          }),
          Salla.event.on("cookies::add", function (t, n) {
            return e.set(t, n);
          }));
      }
      return (
        (e.prototype.get = function (e) {
          var t;
          return null ===
            (t = document.cookie.split("; ").find(function (t) {
              return t.startsWith(e + "=");
            })) || void 0 === t
            ? void 0
            : t.split("=")[1];
        }),
        (e.prototype.set = function (e, t, n) {
          (void 0 === t && (t = ""), void 0 === n && (n = 10));
          var r = "";
          if (n) {
            var i = new Date();
            (i.setTime(i.getTime() + 24 * n * 60 * 60 * 1e3),
              (r = "; expires=" + i.toUTCString()));
          }
          var o = salla.helpers.isIframe() ? "None" : "Lax";
          return (
            (document.cookie = ""
              .concat(e, "=")
              .concat(t)
              .concat(r, "; path=/; SameSite=")
              .concat(o, "; secure")),
            this
          );
        }),
        (e.prototype.remove = function (e) {
          var t = salla.helpers.isIframe() ? "None" : "Lax";
          return (
            (document.cookie = ""
              .concat(e, "=; Max-Age=0; path=/; SameSite=")
              .concat(t, "; secure")),
            this
          );
        }),
        (e.prototype.clearAll = function (e) {
          return (void 0 === e && (e = !1), this.clean(e));
        }),
        (e.prototype.clean = function (e) {
          var t = this;
          return (
            document.cookie
              .split(";")
              .map(function (e) {
                return e.split("=")[0].trim();
              })
              .filter(function (n) {
                return (
                  e ||
                  t.keysToRemove.includes(n) ||
                  t.dynamicKeysToRemove.some(function (e) {
                    return n.startsWith(e);
                  })
                );
              })
              .forEach(function (e) {
                return t.remove(e);
              }),
            this
          );
        }),
        (e.prototype.getCookieByPrefix = function (e) {
          return document.cookie
            .split("; ")
            .map(function (e) {
              return e.split("=")[0];
            })
            .filter(function (t) {
              return t.startsWith(e);
            });
        }),
        (e.prototype.clearCookieByPrefix = function (e) {
          var t = this;
          return this.getCookieByPrefix(e).forEach(function (e) {
            return t.remove(e);
          });
        }),
        e
      );
    })();
  ("undefined" != typeof window &&
    ((window.salla = window.salla || window.Salla || {}),
    (window.Salla = window.salla)),
    "undefined" != typeof global &&
      ((global.salla = global.salla || global.Salla || {}),
      (global.Salla = global.salla)),
    (Salla.status = "base"),
    (Salla.config = new fn()),
    (Salla.logger = pn),
    (Salla.event = new gn()),
    (Salla.helpers = hn),
    (Salla.storage = new bn()),
    (Salla.cookie = new wn()),
    (Salla.log = Salla.logger.log),
    (Salla.money = Salla.helpers.money),
    (Salla.url = Salla.helpers.url),
    (Salla.versions = { base: "2.14.361" }));
  var Dn = Salla;
  let Fn = function (e, t, n) {
      return alert(e);
    },
    Sn = function (e, t) {
      return Fn(e, _n.error, t);
    },
    _n = { error: "error", success: "success", info: "info" };
  var En = {
    fire: function (e, t, n) {
      return Fn(e, t, n);
    },
    setNotifier: function (e) {
      ((Fn = e), salla.event.emit("twilight::notifier.changed"));
    },
    error: Sn,
    success: function (e, t) {
      return Fn(e, _n.success, t);
    },
    info: function (e, t) {
      return Fn(e, _n.info, t);
    },
    sallaInitiated: function () {
      let e = window.location.href.match(/([\?\&]danger=)[^&]+/g);
      e &&
        (window.history.replaceState(
          null,
          document.title,
          window.location.pathname,
        ),
        salla.event.once("twilight::notifier.changed", () => {
          e.forEach((e) => {
            e = decodeURI(e.replace("?danger=", "").replace("&danger=", ""));
            let t = document.createElement("div");
            ((t.innerText = e),
              Sn(t.innerHTML),
              salla.event.emit("twilight::error", e));
          });
        }));
    },
    types: _n,
  };
  class An {
    constructor(e, t) {
      return (
        (this.api = e),
        (this.event = t),
        new Proxy(this, {
          get: function (n, r) {
            return "event" === r ? t : "api" === r ? e : (e && e[r]) || n[r];
          },
        })
      );
    }
  }
  (Element.prototype.matches ||
    (Element.prototype.matches = Element.prototype.msMatchesSelector),
    Element.prototype.closest ||
      (Element.prototype.closest = function (e) {
        for (var t = this; t; ) {
          if (t.matches(e)) return t;
          t = t.parentElement;
        }
      }),
    (Element.prototype.getElementSallaData = function (e, ...t) {
      if (!this.getAttribute) return;
      if (this.hasAttribute("data-json"))
        try {
          return JSON.parse(this.getAttribute("data-json"));
        } catch (e) {}
      let n = this.getAttribute("data-function");
      if (n && window[n])
        return "function" == typeof window[n]
          ? this.getFilteredData(window[n].call(this, ...t))
          : this.getFilteredData(window[n]);
      let r = this.hasAttribute("data-form-selector")
        ? document.querySelector(this.dataset.formSelector)
        : void 0;
      if (
        ((r =
          "FORM" === this.tagName
            ? this
            : r ||
              this.closest("form") ||
              this.closest("[salla-form-data]") ||
              this),
        r && "FORM" === r.tagName)
      )
        return this.getFilteredData(new FormData(r), null, r);
      let i = r.querySelectorAll("[name]");
      if (!i.length) return this.getFilteredData();
      let o = Object.assign({}, this.dataset);
      return (
        i.forEach((e) => {
          if (!["checkbox", "radio"].includes(e.type) || e.checked)
            try {
              let t = Salla.helpers.inputData(e.name, e.value, o);
              o[t.name] = t.value;
            } catch (t) {
              Salla.log(e.name + " can't be send");
            }
        }),
        this.getFilteredData(o)
      );
    }),
    (Element.prototype.canEventFireHook = function (e) {
      return (
        !!this.hasAttribute && this.hasAttribute(Salla.api.hooksPrefix + e.type)
      );
    }),
    (Element.prototype.hasAttributeStartsWith = function (e, t) {
      e = e.toLowerCase();
      for (var n = 0; n < this.attributes.length; n++) {
        let r = this.attributes[n].name.toLowerCase();
        if (0 === r.indexOf(e)) return !t || r;
      }
      return !1;
    }),
    (HTMLFormElement.prototype.getAjaxFormData = function (e) {
      var t = this.querySelectorAll('input[type="file"]');
      t.forEach((e) => {
        e.files.length || e.setAttribute("disabled", "");
      });
      var n = new FormData(this);
      return (
        t.forEach((e) => {
          e.files.length || e.removeAttribute("disabled");
        }),
        {
          formData: this.getFilteredData(n, e),
          url: this.getAttribute("action"),
          method: this.getAttribute("method") || "post",
          events: {
            success: this.dataset.onSuccess,
            fail: this.dataset.onFail,
          },
        }
      );
    }),
    (Element.prototype.getFilteredData = function (
      e = null,
      t = null,
      n = null,
    ) {
      return (
        (e = e || (null == n ? void 0 : n.dataset) || this.dataset),
        n &&
          this.name &&
          void 0 !== this.value &&
          (e = (function (e, t, n) {
            e instanceof FormData ? e.append(t, n) : (e[t] = n);
            return e;
          })(e, this.name, this.value)),
        ["filterBeforeSubmit", "filterBeforeSend"].forEach((r) => {
          let i = (null == n ? void 0 : n.dataset[r]) || this.dataset[r];
          if (i) {
            var o = window[i];
            if ("function" == typeof o) {
              if (!o(e, n || this, t) && e)
                throw `Data failed to be pass verify function window.${i}(formData, element, event)!`;
              return o(e, n || this, t);
            }
            Salla.log("window." + i + "() not found!");
          }
        }),
        e
      );
    }),
    (HTMLAnchorElement.prototype.getAjaxFormData = function (e) {
      return {
        formData: this.getFilteredData(null, e),
        url: this.getAttribute("href"),
        method: this.dataset.type || "get",
        events: { success: this.dataset.onSuccess, fail: this.dataset.onFail },
      };
    }));
  class Cn {
    constructor() {
      ((this.events = {}), (this.namespace = ""));
      let e = /function (.{1,})\(/.exec(this.constructor.toString());
      this.className = (e && e.length > 1 ? e[1] : "").toLowerCase();
    }
    after_init() {
      this.createDynamicFunctions();
    }
    createDynamicFunctions() {
      Object.keys(this.events).forEach((e) => {
        (this.createDynamicEventFuns(e), this.createDynamicListenerFuns(e));
      });
    }
    createDynamicEventFuns(e) {
      if (this[e]) return;
      let t = this;
      this[e] = function (...n) {
        return t.dispatch(e, ...n);
      };
    }
    createDynamicListenerFuns(e) {
      let t = "on" + e.charAt(0).toUpperCase() + e.slice(1);
      if (this[t]) return;
      let n = this;
      this[t] = function (t) {
        return n.on(e, async function (...e) {
          return t(...e);
        });
      };
    }
    getEventName(e) {
      return (
        (e = this.events[e] || e || "unknown-event"),
        !this.namespace || e.includes("::")
          ? e
          : this.namespace + Salla.event.delimiter + e
      );
    }
    dispatch(e, ...t) {
      return Salla.event.emitAsync(this.getEventName(e), ...t);
    }
    on(e, t, n = {}) {
      return Salla.event.addListener(this.getEventName(e), t, n);
    }
    once(e, t) {
      return Salla.event.once(this.getEventName(e), t);
    }
  }
  function kn(e, t) {
    ((this.v = e), (this.k = t));
  }
  function xn(e) {
    var t = {},
      n = !1;
    function r(t, r) {
      return (
        (n = !0),
        (r = new Promise(function (n) {
          n(e[t](r));
        })),
        { done: !1, value: new kn(r, 1) }
      );
    }
    return (
      (t[("undefined" != typeof Symbol && Symbol.iterator) || "@@iterator"] =
        function () {
          return this;
        }),
      (t.next = function (e) {
        return n ? ((n = !1), e) : r("next", e);
      }),
      "function" == typeof e.throw &&
        (t.throw = function (e) {
          if (n) throw ((n = !1), e);
          return r("throw", e);
        }),
      "function" == typeof e.return &&
        (t.return = function (e) {
          return n ? ((n = !1), e) : r("return", e);
        }),
      t
    );
  }
  function Pn(e) {
    var t,
      n,
      r,
      i = 2;
    for (
      "undefined" != typeof Symbol &&
      ((n = Symbol.asyncIterator), (r = Symbol.iterator));
      i--;
    ) {
      if (n && null != (t = e[n])) return t.call(e);
      if (r && null != (t = e[r])) return new On(t.call(e));
      ((n = "@@asyncIterator"), (r = "@@iterator"));
    }
    throw new TypeError("Object is not async iterable");
  }
  function On(e) {
    function t(e) {
      if (Object(e) !== e)
        return Promise.reject(new TypeError(e + " is not an object."));
      var t = e.done;
      return Promise.resolve(e.value).then(function (e) {
        return { value: e, done: t };
      });
    }
    return (
      (On = function (e) {
        ((this.s = e), (this.n = e.next));
      }),
      (On.prototype = {
        s: null,
        n: null,
        next: function () {
          return t(this.n.apply(this.s, arguments));
        },
        return: function (e) {
          var n = this.s.return;
          return void 0 === n
            ? Promise.resolve({ value: e, done: !0 })
            : t(n.apply(this.s, arguments));
        },
        throw: function (e) {
          var n = this.s.return;
          return void 0 === n
            ? Promise.reject(e)
            : t(n.apply(this.s, arguments));
        },
      }),
      new On(e)
    );
  }
  function In(e) {
    return new kn(e, 0);
  }
  function jn() {
    return (
      (jn = Object.assign
        ? Object.assign.bind()
        : function (e) {
            for (var t = 1; t < arguments.length; t++) {
              var n = arguments[t];
              for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
            }
            return e;
          }),
      jn.apply(null, arguments)
    );
  }
  function Tn(e) {
    return function () {
      return new Rn(e.apply(this, arguments));
    };
  }
  function Rn(e) {
    var t, n;
    function r(t, n) {
      try {
        var o = e[t](n),
          a = o.value,
          s = a instanceof kn;
        Promise.resolve(s ? a.v : a).then(
          function (n) {
            if (s) {
              var l = "return" === t ? "return" : "next";
              if (!a.k || n.done) return r(l, n);
              n = e[l](n).value;
            }
            i(o.done ? "return" : "normal", n);
          },
          function (e) {
            r("throw", e);
          },
        );
      } catch (e) {
        i("throw", e);
      }
    }
    function i(e, i) {
      switch (e) {
        case "return":
          t.resolve({ value: i, done: !0 });
          break;
        case "throw":
          t.reject(i);
          break;
        default:
          t.resolve({ value: i, done: !1 });
      }
      (t = t.next) ? r(t.key, t.arg) : (n = null);
    }
    ((this._invoke = function (e, i) {
      return new Promise(function (o, a) {
        var s = { key: e, arg: i, resolve: o, reject: a, next: null };
        n ? (n = n.next = s) : ((t = n = s), r(e, i));
      });
    }),
      "function" != typeof e.return && (this.return = void 0));
  }
  ((Rn.prototype[
    ("function" == typeof Symbol && Symbol.asyncIterator) || "@@asyncIterator"
  ] = function () {
    return this;
  }),
    (Rn.prototype.next = function (e) {
      return this._invoke("next", e);
    }),
    (Rn.prototype.throw = function (e) {
      return this._invoke("throw", e);
    }),
    (Rn.prototype.return = function (e) {
      return this._invoke("return", e);
    }));
  function Ln(e) {
    e &&
      e.sallaInitiated &&
      !e.initiated &&
      (e.sallaInitiated(), (e.initiated = !0));
  }
  ((Salla.event.auth = new (class extends Cn {
    constructor() {
      (super(),
        (this.namespace = "auth"),
        (this.events = {
          login: "login",
          logout: "logout",
          codeSent: "code.sent",
          codeNotSent: "code.not-sent",
          verified: "verified",
          verificationFailed: "verification.failed",
          loggedIn: "logged.in",
          registered: "registered",
          registrationFailed: "registration.failed",
          loggedOut: "logged.out",
          failedLogout: "failed.logout",
          refreshFailed: "refresh.failed",
          tokenFetched: "token.fetched",
          tokenInvalid: "token.invalid",
        }),
        this.after_init());
    }
    login(e) {
      return e
        ? (e.type && this.setTypeActionOnVerified(e.type),
          (this.next_event = e.next_event || null),
          this.dispatch("login", ...arguments))
        : ((this.next_event = null), this.dispatch("login", ...arguments));
    }
    async loggedIn(e) {
      return Salla.profile.info().finally(() => this.dispatch("loggedIn", e));
    }
    setTypeActionOnVerified(e) {
      this.type_action_on_verified = e;
    }
    getTypeActionOnVerified() {
      return this.type_action_on_verified || "redirect";
    }
  })()),
    (Salla.event.cart = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "cart"),
          (this.events = {
            latestFetched: "latest.fetched",
            latestFailed: "latest.failed",
            updated: "updated",
            itemUpdated: "item.updated",
            itemUpdatedFailed: "item.updated.failed",
            itemAdded: "item.added",
            beforeAddItem: "before.add.item",
            itemAddedFailed: "item.added.failed",
            itemDeleted: "item.deleted",
            itemDeletedFailed: "item.deleted.failed",
            submitted: "submitted",
            submitFailed: "submit.failed",
            imageDeleted: "image.deleted",
            imageNotDeleted: "image.not.deleted",
            detailsFetched: "details.fetched",
            detailsNotFetched: "details.not.fetched",
            successReset: "success.reset",
            priceQuoteSucceeded: "price-quote.succeeded",
            priceQuoteFailed: "price-quote.failed",
            offersFetched: "offers.fetched",
            offersFailed: "offers.failed",
            couponAdded: "coupon.added",
            couponDeleted: "coupon.deleted",
            couponAdditionFailed: "coupon.addition.failed",
            couponDeletionFailed: "coupon.deletion.failed",
            quickOrderSettingFetched: "quick-order.fetched",
            quickOrderSettingFailed: "quick-order.failed",
            quickOrderSucceeded: "quick-order.succeeded",
            quickOrderFailed: "quick-order.failed",
            beforeStartFastCheckout: "before.start.fast-checkout",
            submitting: "submitting",
          }),
          this.after_init());
      }
      updated(e, t = {}) {
        var n;
        return (
          Salla.cookie.set("fresh_summary", 1),
          e && "object" == typeof e
            ? (e.offer && salla.product.event.offerExisted(e.offer),
              e.redirect &&
                (salla.log("The current cart is purchased!"),
                salla.cart.api.reset()),
              e.cart
                ? (salla.storage.set("cart.summary", {
                    total: e.cart.total,
                    sub_total: e.cart.sub_total,
                    discount: e.cart.discount,
                    tax_amount: e.cart.tax_amount,
                    total_discount: e.cart.total_discount,
                    real_shipping_cost: e.cart.real_shipping_cost,
                    count: e.cart.count,
                    shipping_cost:
                      null != (n = e.cart.free_shipping_bar) &&
                      n.has_free_shipping
                        ? 0
                        : e.cart.real_shipping_cost,
                  }),
                  this.dispatch(
                    "updated",
                    jn({}, e.cart, { fromLatestFetched: t.fromLatestFetched }),
                  ))
                : void salla.log("Failed to get the cart summary!"))
            : (Salla.logger.info("Cart summary not an object!", e),
              this.dispatch("updated", {
                fromLatestFetched: t.fromLatestFetched,
              }))
        );
      }
      latestFetched(e) {
        return (
          this.updated(e.data, { fromLatestFetched: !0 }),
          this.dispatch("latestFetched", e)
        );
      }
      itemAdded(e, t) {
        return (this.updated(e.data), this.dispatch("itemAdded", e, t));
      }
      itemDeleted(e, t) {
        return (this.updated(e.data), this.dispatch("itemDeleted", e, t));
      }
      itemUpdated(e, t) {
        return (this.updated(e.data), this.dispatch("itemUpdated", e, t));
      }
      couponAdded(e, t) {
        return (this.updated(e.data), this.dispatch("couponAdded", e, t));
      }
      couponDeleted(e, t) {
        return (this.updated(e.data), this.dispatch("couponDeleted", e, t));
      }
    })()),
    (Salla.event.order = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "order"),
          (this.events = {
            canceled: "canceled",
            notCanceled: "not.canceled",
            orderCreated: "order.created",
            orderCreationFailed: "order.creation.failed",
            invoiceSent: "invoice.sent",
            invoiceNotSent: "invoice.not.sent",
            ordersFetched: "order.fetched",
            ordersNotFetched: "order.not.fetched",
          }),
          this.after_init());
      }
    })()),
    (Salla.event.scope = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "scope"),
          (this.events = {
            fetched: "fetched",
            notFetched: "not.fetched",
            productAvailabilityFetched: "product-availability.fetched",
            productAvailabilityNotFetched: "product-availability.not.fetched",
            changeSucceeded: "changed",
            changeFailed: "not.changed",
          }),
          this.after_init());
      }
    })()),
    (Salla.event.rating = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "rating"),
          (this.events = {
            orderNotFetched: "order.not.fetched",
            orderFetched: "order.fetched",
            storeRated: "store.rated",
            storeFailed: "store.failed",
            productsRated: "products.rated",
            productsFailed: "products.failed",
            shippingRated: "shipping.rated",
            shippingFailed: "shipping.failed",
          }),
          this.after_init());
      }
    })()),
    (Salla.event.booking = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "booking"),
          (this.events = { added: "added", additionFailed: "addition.failed" }),
          this.after_init());
      }
    })()),
    (Salla.event.comment = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "comment"),
          (this.events = {
            added: "added",
            additionFailed: "addition.failed",
            fetched: "fetched",
            fetchFailed: "fetch.failed",
          }),
          this.after_init());
      }
    })()),
    (Salla.event.landing = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "landing"),
          (this.events = {
            detailsFetched: "order.fetched",
            getDetailsFailed: "get.details.failed",
            orderCreated: "order.created",
            orderCreationFailed: "order.creation.failed",
            breadcrumbFetched: "breadcrumb.fetched",
            breadcrumbFetchFailed: "breadcrumb.fetch.failed",
          }),
          this.after_init());
      }
    })()),
    (Salla.event.loyalty = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "loyalty"),
          (this.events = {
            exchangeSucceeded: "exchange.succeeded",
            exchangeFailed: "exchange.failed",
            programFetched: "program.fetched",
            programNotFetched: "program.not.fetched",
            resetSucceeded: "exchange-reset.succeeded",
            resetFailed: "exchange-reset.failed",
          }),
          this.after_init());
      }
      exchangeSucceeded(e, t) {
        return (
          salla.cart.event.updated(e.data),
          this.dispatch("exchangeSucceeded", e, t)
        );
      }
      resetSucceeded(e) {
        return (
          salla.cart.event.updated(e.data),
          this.dispatch("resetSucceeded", e)
        );
      }
    })()),
    (Salla.event.product = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "product"),
          (this.events = {
            priceUpdated: "price.updated",
            priceUpdateFailed: "price.updated.failed",
            availabilitySubscribed: "availability.subscribed",
            availabilitySubscribeFailed: "availability.subscribe.failed",
            categoriesFetched: "categories.fetched",
            categoriesFailed: "categories.failed",
            searchFailed: "search.failed",
            searchResults: "search.results",
            offerExisted: "offer.existed",
            fetchOffersFailed: "fetch.offers.failed",
            offersFetched: "offers.fetched",
            sizeGuideFetched: "size-guide.fetched",
            sizeGuideFetchFailed: "size-guide.failed",
            giftFetched: "gift.fetched",
            giftFetchFailed: "gift.failed",
            detailFetched: "detail.fetched",
            detailFetchFailed: "detail.failed",
            addGiftToCartSucceeded: "gift.add-to-cart.succeeded",
            addGiftToCartFailed: "gift.add-to-cart.failed",
            giftImageUploadSucceeded: "gift.image-upload.succeeded",
            giftImageUploadFailed: "gift.image-upload.failed",
            productListFetchSucceeded: "fetch.succeeded",
            productListFetchFailed: "fetch.failed",
            productOptionsFetched: "options.fetched",
            productOptionsNotFetched: "options.not.fetched",
          }),
          this.after_init());
      }
    })()),
    (Salla.event.profile = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "profile"),
          (this.events = {
            updated: "updated",
            updateFailed: "update.failed",
            verificationCodeSent: "verification.code.sent",
            updateContactsFailed: "update.contacts.failed",
            verified: "verified",
            unverified: "unverified",
            infoFetched: "info.fetched",
            infoNotFetched: "info.not.fetched",
            settingsUpdated: "settings.updated",
            updateSettingsFailed: "update.settings.failed",
            deleted: "deleted",
            notDeleted: "not.deleted",
          }),
          this.after_init());
      }
    })()),
    (Salla.event.currency = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "currency"),
          (this.events = {
            changed: "changed",
            failed: "failed",
            fetched: "fetched",
            failedToFetch: "failed.to.fetch",
          }),
          this.after_init());
      }
    })()),
    (Salla.event.document = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "document"),
          (this.events = {
            click: "click",
            change: "change",
            submit: "submit",
            keyup: "keyup",
            leaving: "leaving",
            request: "request",
            requestFailed: "request.failed",
          }),
          this.after_init());
      }
      onClick(e, t) {
        this.fireCallableFuns("click", e, t);
      }
      onChange(e, t) {
        this.fireCallableFuns("change", e, t);
      }
      onSubmit(e, t) {
        this.fireCallableFuns("submit", e, t);
      }
      onKeyup(e, t) {
        this.fireCallableFuns("keyup", e, t);
      }
      fireCallableFuns(e, t, n) {
        this.on(e, (e) => {
          "function" != typeof t
            ? "function" == typeof n && e.target.matches(t) && n(e)
            : t(e);
        });
      }
      fireEvent(e, t, ...n) {
        return this.fireEventForElements(e, t, !1, ...n);
      }
      fireEventForAll(e, t, ...n) {
        return this.fireEventForElements(e, t, !0, ...n);
      }
      fireEventForElements(e, t, n, ...r) {
        if ("string" == typeof e) {
          if (n)
            return document
              .querySelectorAll(e)
              .forEach((e) => this.fireEventForElements(e, t, !1, ...r));
          e = document.querySelector(e);
        }
        if (!e)
          return void salla.log("Failed To get element to fire event: " + t);
        const i = new CustomEvent(t, ...r);
        return e.dispatchEvent(i);
      }
    })()),
    (Salla.event.wishlist = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "wishlist"),
          (this.events = {
            added: "added",
            removed: "removed",
            additionFailed: "addition.failed",
            removingFailed: "removing.failed",
          }),
          this.after_init());
      }
    })()),
    (Salla.event.infiniteScroll = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "infiniteScroll"),
          (this.events = {
            scrollThreshold: "scroll.threshold",
            request: "request",
            load: "load",
            append: "append",
            error: "error",
            last: "last",
            history: "history",
          }),
          this.after_init());
      }
    })()),
    (Salla.event.notifications = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "notifications"),
          (this.events = { fetched: "fetched", fetchFailed: "fetch.failed" }),
          this.after_init());
      }
    })()),
    (Salla.event.component = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "component"),
          (this.events = {
            menuFetched: "menus.fetched",
            menuFetchFailed: "menus.fetch.failed",
            reviewsFetched: "reviews.fetched",
            reviewsFetchFailed: "reviews.fetch.failed",
          }),
          this.after_init());
      }
    })()),
    (Salla.event.advertisement = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "advertisement"),
          (this.events = {
            fetched: "advertisement.fetched",
            fetchFailed: "advertisement.not.fetched",
          }),
          this.after_init());
      }
    })()),
    (Salla.event.navigation = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "navigation"),
          (this.events = {
            breadcrumbFetched: "breadcrumb.fetched",
            breadcrumbFetchFailed: "breadcrumb.fetch.failed",
          }),
          this.after_init());
      }
    })()),
    (Salla.event.metadata = new (class extends Cn {
      constructor() {
        (super(),
          (this.namespace = "metadata"),
          (this.events = {
            valueFetched: "value.fetched",
            valueNotFetch: "value.not.fetched",
          }),
          this.after_init());
      }
    })()),
    Salla.event.on("twilight::initiated", () => {
      Object.keys(Salla).forEach((e) => {
        "object" == typeof (e = Salla[e]) &&
          (Ln(e),
          Object.keys(e).forEach((t) => {
            Ln(e[t]);
          }));
      });
    }),
    (Salla.config.default_properties = {
      debug:
        "undefined" != typeof process && "development" === process.env.NODE_ENV,
      token: null,
      fastRequests: !0,
      canLeave: !0,
      store: {
        api: ["group", "test"].includes(
          window.location.hostname.split(".").pop(),
        )
          ? window.location.origin + "/api/v1/"
          : "https://api.salla.dev/store/v1/",
      },
      currencies: {
        SAR: {
          code: "SAR",
          name: "ريال سعودي",
          symbol: "ر.س",
          amount: 1,
          country_code: "sa",
        },
      },
    }),
    Salla.config.merge(Salla.config.default_properties),
    (Salla.config.triedToGetCurrencies_ = !1),
    (Salla.config.triedToGetLanguages_ = !1),
    (Salla.config.isUser = () => "user" === Salla.config.get("user.type")),
    (Salla.config.isGuest = () => !Salla.config.isUser()),
    (Salla.config.languages = async () => {
      var e;
      if (Salla.config.triedToGetLanguages_)
        return Salla.config.get("languages");
      Salla.config.triedToGetLanguages_ = !0;
      let t = !0,
        n = [];
      return (
        null ==
          (e = await salla.document.api.request("languages", null, "get")) ||
          null == (e = e.data) ||
          e.map((e) => {
            (t && ((n = []), (t = !1)),
              (e.code = e.code || e.iso_code),
              (e.url = salla.url.get(e.code)),
              (e.is_rtl = e.is_rtl || e.rtl),
              n.push(e));
          }),
        Salla.config.set("languages", n),
        n
      );
    }),
    (Salla.config.currencies = async () => {
      var e;
      if (Salla.config.triedToGetCurrencies_)
        return Salla.config.get("currencies");
      Salla.config.triedToGetCurrencies_ = !0;
      let t = !0,
        n = {};
      return (
        null == (e = await salla.currency.api.list()) ||
          null == (e = e.data) ||
          e.map((e) => {
            (t && ((n = {}), (t = !1)),
              (e.country_code = e.code.substr(0, 2).toLowerCase()),
              (n[e.code] = e));
          }),
        Salla.config.set("currencies", n),
        n
      );
    }),
    (Salla.config.isMobileApp = () => {
      var e;
      return ["ios", "android"].includes(
        null == (e = Salla.analytics) ||
          null == (e = e.jitsuAnalytics) ||
          null == (e = e.getContextProperty("app")) ||
          null == (e = e.platform)
          ? void 0
          : e.toLowerCase(),
      );
    }));
  var Bn,
    Un = { exports: {} },
    Nn = { exports: {} },
    qn = { exports: {} },
    zn = qn.exports;
  function $n() {
    return (
      Bn ||
        ((Bn = 1),
        (function (e) {
          !(function (t, n) {
            e.exports ? (e.exports = n()) : (t.EvEmitter = n());
          })("undefined" != typeof window ? window : zn, function () {
            function e() {}
            let t = e.prototype;
            return (
              (t.on = function (e, t) {
                if (!e || !t) return this;
                let n = (this._events = this._events || {}),
                  r = (n[e] = n[e] || []);
                return (r.includes(t) || r.push(t), this);
              }),
              (t.once = function (e, t) {
                if (!e || !t) return this;
                this.on(e, t);
                let n = (this._onceEvents = this._onceEvents || {});
                return (((n[e] = n[e] || {})[t] = !0), this);
              }),
              (t.off = function (e, t) {
                let n = this._events && this._events[e];
                if (!n || !n.length) return this;
                let r = n.indexOf(t);
                return (-1 != r && n.splice(r, 1), this);
              }),
              (t.emitEvent = function (e, t) {
                let n = this._events && this._events[e];
                if (!n || !n.length) return this;
                ((n = n.slice(0)), (t = t || []));
                let r = this._onceEvents && this._onceEvents[e];
                for (let i of n) {
                  (r && r[i] && (this.off(e, i), delete r[i]),
                    i.apply(this, t));
                }
                return this;
              }),
              (t.allOff = function () {
                return (delete this._events, delete this._onceEvents, this);
              }),
              e
            );
          });
        })(qn)),
      qn.exports
    );
  }
  var Mn,
    Hn,
    Jn = { exports: {} },
    Wn = Jn.exports;
  function Gn() {
    return (
      Mn ||
        ((Mn = 1),
        (function (e) {
          !(function (t, n) {
            e.exports ? (e.exports = n(t)) : (t.fizzyUIUtils = n(t));
          })(Wn, function (e) {
            let t = {
                extend: function (e, t) {
                  return Object.assign(e, t);
                },
                modulo: function (e, t) {
                  return ((e % t) + t) % t;
                },
                makeArray: function (e) {
                  if (Array.isArray(e)) return e;
                  if (null == e) return [];
                  return "object" == typeof e && "number" == typeof e.length
                    ? [...e]
                    : [e];
                },
                removeFrom: function (e, t) {
                  let n = e.indexOf(t);
                  -1 != n && e.splice(n, 1);
                },
                getParent: function (e, t) {
                  for (; e.parentNode && e != document.body; )
                    if ((e = e.parentNode).matches(t)) return e;
                },
                getQueryElement: function (e) {
                  return "string" == typeof e ? document.querySelector(e) : e;
                },
                handleEvent: function (e) {
                  let t = "on" + e.type;
                  this[t] && this[t](e);
                },
                filterFindElements: function (e, n) {
                  return (e = t.makeArray(e))
                    .filter((e) => e instanceof HTMLElement)
                    .reduce((e, t) => {
                      if (!n) return (e.push(t), e);
                      t.matches(n) && e.push(t);
                      let r = t.querySelectorAll(n);
                      return (e = e.concat(...r));
                    }, []);
                },
                debounceMethod: function (e, t, n) {
                  n = n || 100;
                  let r = e.prototype[t],
                    i = t + "Timeout";
                  e.prototype[t] = function () {
                    clearTimeout(this[i]);
                    let e = arguments;
                    this[i] = setTimeout(() => {
                      (r.apply(this, e), delete this[i]);
                    }, n);
                  };
                },
                docReady: function (e) {
                  let t = document.readyState;
                  "complete" == t || "interactive" == t
                    ? setTimeout(e)
                    : document.addEventListener("DOMContentLoaded", e);
                },
                toDashed: function (e) {
                  return e
                    .replace(/(.)([A-Z])/g, function (e, t, n) {
                      return t + "-" + n;
                    })
                    .toLowerCase();
                },
              },
              n = e.console;
            return (
              (t.htmlInit = function (r, i) {
                t.docReady(function () {
                  let o = "data-" + t.toDashed(i),
                    a = document.querySelectorAll(`[${o}]`),
                    s = e.jQuery;
                  [...a].forEach((e) => {
                    let t,
                      a = e.getAttribute(o);
                    try {
                      t = a && JSON.parse(a);
                    } catch (t) {
                      return void (
                        n &&
                        n.error(`Error parsing ${o} on ${e.className}: ${t}`)
                      );
                    }
                    let l = new r(e, t);
                    s && s.data(e, i, l);
                  });
                });
              }),
              t
            );
          });
        })(Jn)),
      Jn.exports
    );
  }
  function Vn() {
    return (
      Hn ||
        ((Hn = 1),
        (function (e) {
          !(function (t, n) {
            e.exports
              ? (e.exports = n(t, $n(), Gn()))
              : (t.InfiniteScroll = n(t, t.EvEmitter, t.fizzyUIUtils));
          })(window, function (e, t, n) {
            let r = e.jQuery,
              i = {};
            function o(e, t) {
              let a = n.getQueryElement(e);
              if (a) {
                if ((e = a).infiniteScrollGUID) {
                  let n = i[e.infiniteScrollGUID];
                  return (n.option(t), n);
                }
                ((this.element = e),
                  (this.options = jn({}, o.defaults)),
                  this.option(t),
                  r && (this.$element = r(this.element)),
                  this.create());
              } else
                console.error("Bad element for InfiniteScroll: " + (a || e));
            }
            ((o.defaults = {}), (o.create = {}), (o.destroy = {}));
            let a = o.prototype;
            Object.assign(a, t.prototype);
            let s = 0;
            ((a.create = function () {
              let e = (this.guid = ++s);
              if (
                ((this.element.infiniteScrollGUID = e),
                (i[e] = this),
                (this.pageIndex = 1),
                (this.loadCount = 0),
                this.updateGetPath(),
                this.getPath && this.getPath())
              ) {
                (this.updateGetAbsolutePath(),
                  this.log("initialized", [this.element.className]),
                  this.callOnInit());
                for (let e in o.create) o.create[e].call(this);
              } else console.error("Disabling InfiniteScroll");
            }),
              (a.option = function (e) {
                Object.assign(this.options, e);
              }),
              (a.callOnInit = function () {
                let e = this.options.onInit;
                e && e.call(this, this);
              }),
              (a.dispatchEvent = function (e, t, n) {
                this.log(e, n);
                let i = t ? [t].concat(n) : n;
                if ((this.emitEvent(e, i), !r || !this.$element)) return;
                let o = (e += ".infiniteScroll");
                if (t) {
                  let n = r.Event(t);
                  ((n.type = e), (o = n));
                }
                this.$element.trigger(o, n);
              }));
            let l = {
              initialized: (e) => `on ${e}`,
              request: (e) => `URL: ${e}`,
              load: (e, t) => `${e.title || ""}. URL: ${t}`,
              error: (e, t) => `${e}. URL: ${t}`,
              append: (e, t, n) => `${n.length} items. URL: ${t}`,
              last: (e, t) => `URL: ${t}`,
              history: (e, t) => `URL: ${t}`,
              pageIndex: function (e, t) {
                return `current page determined to be: ${e} from ${t}`;
              },
            };
            ((a.log = function (e, t) {
              if (!this.options.debug) return;
              let n = `[InfiniteScroll] ${e}`,
                r = l[e];
              (r && (n += ". " + r.apply(this, t)), console.log(n));
            }),
              (a.updateMeasurements = function () {
                this.windowHeight = e.innerHeight;
                let t = this.element.getBoundingClientRect();
                this.top = t.top + e.scrollY;
              }),
              (a.updateScroller = function () {
                let t = this.options.elementScroll;
                if (t) {
                  if (
                    ((this.scroller =
                      !0 === t ? this.element : n.getQueryElement(t)),
                    !this.scroller)
                  )
                    throw new Error(`Unable to find elementScroll: ${t}`);
                } else this.scroller = e;
              }),
              (a.updateGetPath = function () {
                let e = this.options.path;
                if (!e)
                  return void console.error(
                    `InfiniteScroll path option required. Set as: ${e}`,
                  );
                let t = typeof e;
                "function" != t
                  ? "string" == t && e.match("{{#}}")
                    ? this.updateGetPathTemplate(e)
                    : this.updateGetPathSelector(e)
                  : (this.getPath = e);
              }),
              (a.updateGetPathTemplate = function (e) {
                this.getPath = () => {
                  let t = this.pageIndex + 1;
                  return e.replace("{{#}}", t);
                };
                let t = e
                    .replace(/(\\\?|\?)/, "\\?")
                    .replace("{{#}}", "(\\d\\d?\\d?)"),
                  n = new RegExp(t),
                  r = location.href.match(n);
                r &&
                  ((this.pageIndex = parseInt(r[1], 10)),
                  this.log("pageIndex", [this.pageIndex, "template string"]));
              }));
            let u = [
                /^(.*?\/?page\/?)(\d\d?\d?)(.*?$)/,
                /^(.*?\/?\?page=)(\d\d?\d?)(.*?$)/,
                /(.*?)(\d\d?\d?)(?!.*\d)(.*?$)/,
              ],
              c = (o.getPathParts = function (e) {
                if (e)
                  for (let t of u) {
                    let n = e.match(t);
                    if (n) {
                      let [, e, t, r] = n;
                      return { begin: e, index: t, end: r };
                    }
                  }
              });
            ((a.updateGetPathSelector = function (e) {
              let t = document.querySelector(e);
              if (!t)
                return void console.error(
                  `Bad InfiniteScroll path option. Next link not found: ${e}`,
                );
              let n = t.getAttribute("href"),
                r = c(n);
              if (!r)
                return void console.error(
                  `InfiniteScroll unable to parse next link href: ${n}`,
                );
              let { begin: i, index: o, end: a } = r;
              ((this.isPathSelector = !0),
                (this.getPath = () => i + (this.pageIndex + 1) + a),
                (this.pageIndex = parseInt(o, 10) - 1),
                this.log("pageIndex", [this.pageIndex, "next link"]));
            }),
              (a.updateGetAbsolutePath = function () {
                let e = this.getPath();
                if (e.match(/^http/) || e.match(/^\//))
                  return void (this.getAbsolutePath = this.getPath);
                let { pathname: t } = location,
                  n = e.match(/^\?/),
                  r = t.substring(0, t.lastIndexOf("/")),
                  i = n ? t : r + "/";
                this.getAbsolutePath = () => i + this.getPath();
              }),
              (o.create.hideNav = function () {
                let e = n.getQueryElement(this.options.hideNav);
                e && ((e.style.display = "none"), (this.nav = e));
              }),
              (o.destroy.hideNav = function () {
                this.nav && (this.nav.style.display = "");
              }),
              (a.destroy = function () {
                this.allOff();
                for (let e in o.destroy) o.destroy[e].call(this);
                (delete this.element.infiniteScrollGUID,
                  delete i[this.guid],
                  r &&
                    this.$element &&
                    r.removeData(this.element, "infiniteScroll"));
              }),
              (o.throttle = function (e, t) {
                let n, r;
                return (
                  (t = t || 200),
                  function () {
                    let i = +new Date(),
                      o = arguments,
                      a = () => {
                        ((n = i), e.apply(this, o));
                      };
                    n && i < n + t
                      ? (clearTimeout(r), (r = setTimeout(a, t)))
                      : a();
                  }
                );
              }),
              (o.data = function (e) {
                let t = (e = n.getQueryElement(e)) && e.infiniteScrollGUID;
                return t && i[t];
              }),
              (o.setJQuery = function (e) {
                r = e;
              }),
              n.htmlInit(o, "infinite-scroll"),
              (a._init = function () {}));
            let { jQueryBridget: d } = e;
            return (r && d && d("infiniteScroll", o, r), o);
          });
        })(Nn)),
      Nn.exports
    );
  }
  var Kn,
    Qn = { exports: {} };
  function Xn() {
    return (
      Kn ||
        ((Kn = 1),
        (function (e) {
          !(function (t, n) {
            e.exports ? (e.exports = n(t, Vn())) : n(t, t.InfiniteScroll);
          })(window, function (e, t) {
            let n = t.prototype;
            (Object.assign(t.defaults, {
              loadOnScroll: !0,
              checkLastPage: !0,
              responseBody: "text",
              domParseResponse: !0,
            }),
              (t.create.pageLoad = function () {
                ((this.canLoad = !0),
                  this.on("scrollThreshold", this.onScrollThresholdLoad),
                  this.on("load", this.checkLastPage),
                  this.options.outlayer &&
                    this.on("append", this.onAppendOutlayer));
              }),
              (n.onScrollThresholdLoad = function () {
                this.options.loadOnScroll && this.loadNextPage();
              }));
            let r = new DOMParser();
            function i(e) {
              let t = document.createDocumentFragment();
              return (e && t.append(...e), t);
            }
            return (
              (n.loadNextPage = function () {
                if (this.isLoading || !this.canLoad) return;
                let {
                    responseBody: e,
                    domParseResponse: t,
                    fetchOptions: n,
                  } = this.options,
                  i = this.getAbsolutePath();
                ((this.isLoading = !0), "function" == typeof n && (n = n()));
                let o = fetch(i, n)
                  .then((n) => {
                    if (!n.ok) {
                      let e = new Error(n.statusText);
                      return (this.onPageError(e, i, n), { response: n });
                    }
                    return n[e]().then(
                      (o) => (
                        "text" == e &&
                          t &&
                          (o = r.parseFromString(o, "text/html")),
                        204 == n.status
                          ? (this.lastPageReached(o, i),
                            { body: o, response: n })
                          : this.onPageLoad(o, i, n)
                      ),
                    );
                  })
                  .catch((e) => {
                    this.onPageError(e, i);
                  });
                return (this.dispatchEvent("request", null, [i, o]), o);
              }),
              (n.onPageLoad = function (e, t, n) {
                return (
                  this.options.append || (this.isLoading = !1),
                  this.pageIndex++,
                  this.loadCount++,
                  this.dispatchEvent("load", null, [e, t, n]),
                  this.appendNextPage(e, t, n)
                );
              }),
              (n.appendNextPage = function (e, t, n) {
                let {
                  append: r,
                  responseBody: o,
                  domParseResponse: a,
                } = this.options;
                if (!("text" == o && a) || !r) return { body: e, response: n };
                let s = e.querySelectorAll(r),
                  l = { body: e, response: n, items: s };
                if (!s || !s.length) return (this.lastPageReached(e, t), l);
                let u = i(s),
                  c = () => (
                    this.appendItems(s, u),
                    (this.isLoading = !1),
                    this.dispatchEvent("append", null, [e, t, s, n]),
                    l
                  );
                return this.options.outlayer
                  ? this.appendOutlayerItems(u, c)
                  : c();
              }),
              (n.appendItems = function (e, t) {
                e &&
                  e.length &&
                  ((function (e) {
                    let t = e.querySelectorAll("script");
                    for (let e of t) {
                      let t = document.createElement("script"),
                        n = e.attributes;
                      for (let e of n) t.setAttribute(e.name, e.value);
                      ((t.innerHTML = e.innerHTML),
                        e.parentNode.replaceChild(t, e));
                    }
                  })((t = t || i(e))),
                  this.element.appendChild(t));
              }),
              (n.appendOutlayerItems = function (n, r) {
                let i = t.imagesLoaded || e.imagesLoaded;
                return i
                  ? new Promise(function (e) {
                      i(n, function () {
                        let t = r();
                        e(t);
                      });
                    })
                  : (console.error(
                      "[InfiniteScroll] imagesLoaded required for outlayer option",
                    ),
                    void (this.isLoading = !1));
              }),
              (n.onAppendOutlayer = function (e, t, n) {
                this.options.outlayer.appended(n);
              }),
              (n.checkLastPage = function (e, t) {
                let n,
                  { checkLastPage: r, path: i } = this.options;
                if (r) {
                  if ("function" == typeof i) {
                    if (!this.getPath()) return void this.lastPageReached(e, t);
                  }
                  ("string" == typeof r
                    ? (n = r)
                    : this.isPathSelector && (n = i),
                    n &&
                      e.querySelector &&
                      (e.querySelector(n) || this.lastPageReached(e, t)));
                }
              }),
              (n.lastPageReached = function (e, t) {
                ((this.canLoad = !1), this.dispatchEvent("last", null, [e, t]));
              }),
              (n.onPageError = function (e, t, n) {
                return (
                  (this.isLoading = !1),
                  (this.canLoad = !1),
                  this.dispatchEvent("error", null, [e, t, n]),
                  e
                );
              }),
              (t.create.prefill = function () {
                if (!this.options.prefill) return;
                let e = this.options.append;
                e
                  ? (this.updateMeasurements(),
                    this.updateScroller(),
                    (this.isPrefilling = !0),
                    this.on("append", this.prefill),
                    this.once("error", this.stopPrefill),
                    this.once("last", this.stopPrefill),
                    this.prefill())
                  : console.error(
                      `append option required for prefill. Set as :${e}`,
                    );
              }),
              (n.prefill = function () {
                let e = this.getPrefillDistance();
                ((this.isPrefilling = e >= 0),
                  this.isPrefilling
                    ? (this.log("prefill"), this.loadNextPage())
                    : this.stopPrefill());
              }),
              (n.getPrefillDistance = function () {
                return this.options.elementScroll
                  ? this.scroller.clientHeight - this.scroller.scrollHeight
                  : this.windowHeight - this.element.clientHeight;
              }),
              (n.stopPrefill = function () {
                (this.log("stopPrefill"), this.off("append", this.prefill));
              }),
              t
            );
          });
        })(Qn)),
      Qn.exports
    );
  }
  var Yn,
    Zn = { exports: {} };
  function er() {
    return (
      Yn ||
        ((Yn = 1),
        (function (e) {
          !(function (t, n) {
            e.exports
              ? (e.exports = n(t, Vn(), Gn()))
              : n(t, t.InfiniteScroll, t.fizzyUIUtils);
          })(window, function (e, t, n) {
            let r = t.prototype;
            return (
              Object.assign(t.defaults, { scrollThreshold: 400 }),
              (t.create.scrollWatch = function () {
                ((this.pageScrollHandler = this.onPageScroll.bind(this)),
                  (this.resizeHandler = this.onResize.bind(this)));
                let e = this.options.scrollThreshold;
                (e || 0 === e) && this.enableScrollWatch();
              }),
              (t.destroy.scrollWatch = function () {
                this.disableScrollWatch();
              }),
              (r.enableScrollWatch = function () {
                this.isScrollWatching ||
                  ((this.isScrollWatching = !0),
                  this.updateMeasurements(),
                  this.updateScroller(),
                  this.on("last", this.disableScrollWatch),
                  this.bindScrollWatchEvents(!0));
              }),
              (r.disableScrollWatch = function () {
                this.isScrollWatching &&
                  (this.bindScrollWatchEvents(!1),
                  delete this.isScrollWatching);
              }),
              (r.bindScrollWatchEvents = function (t) {
                let n = t ? "addEventListener" : "removeEventListener";
                (this.scroller[n]("scroll", this.pageScrollHandler),
                  e[n]("resize", this.resizeHandler));
              }),
              (r.onPageScroll = t.throttle(function () {
                this.getBottomDistance() <= this.options.scrollThreshold &&
                  this.dispatchEvent("scrollThreshold");
              })),
              (r.getBottomDistance = function () {
                let t, n;
                return (
                  this.options.elementScroll
                    ? ((t = this.scroller.scrollHeight),
                      (n =
                        this.scroller.scrollTop + this.scroller.clientHeight))
                    : ((t = this.top + this.element.clientHeight),
                      (n = e.scrollY + this.windowHeight)),
                  t - n
                );
              }),
              (r.onResize = function () {
                this.updateMeasurements();
              }),
              n.debounceMethod(t, "onResize", 150),
              t
            );
          });
        })(Zn)),
      Zn.exports
    );
  }
  var tr,
    nr = { exports: {} };
  function rr() {
    return (
      tr ||
        ((tr = 1),
        (function (e) {
          !(function (t, n) {
            e.exports
              ? (e.exports = n(t, Vn(), Gn()))
              : n(t, t.InfiniteScroll, t.fizzyUIUtils);
          })(window, function (e, t, n) {
            let r = t.prototype;
            Object.assign(t.defaults, { history: "replace" });
            let i = document.createElement("a");
            return (
              (t.create.history = function () {
                if (!this.options.history) return;
                ((i.href = this.getAbsolutePath()),
                  (i.origin || i.protocol + "//" + i.host) == location.origin
                    ? this.options.append
                      ? this.createHistoryAppend()
                      : this.createHistoryPageLoad()
                    : console.error(
                        `[InfiniteScroll] cannot set history with different origin: ${i.origin} on ${location.origin} . History behavior disabled.`,
                      ));
              }),
              (r.createHistoryAppend = function () {
                (this.updateMeasurements(),
                  this.updateScroller(),
                  (this.scrollPages = [
                    { top: 0, path: location.href, title: document.title },
                  ]),
                  (this.scrollPage = this.scrollPages[0]),
                  (this.scrollHistoryHandler = this.onScrollHistory.bind(this)),
                  (this.unloadHandler = this.onUnload.bind(this)),
                  this.scroller.addEventListener(
                    "scroll",
                    this.scrollHistoryHandler,
                  ),
                  this.on("append", this.onAppendHistory),
                  this.bindHistoryAppendEvents(!0));
              }),
              (r.bindHistoryAppendEvents = function (t) {
                let n = t ? "addEventListener" : "removeEventListener";
                (this.scroller[n]("scroll", this.scrollHistoryHandler),
                  e[n]("unload", this.unloadHandler));
              }),
              (r.createHistoryPageLoad = function () {
                this.on("load", this.onPageLoadHistory);
              }),
              (t.destroy.history = r.destroyHistory =
                function () {
                  this.options.history &&
                    this.options.append &&
                    this.bindHistoryAppendEvents(!1);
                }),
              (r.onAppendHistory = function (e, t, n) {
                if (!n || !n.length) return;
                let r = n[0],
                  o = this.getElementScrollY(r);
                ((i.href = t),
                  this.scrollPages.push({
                    top: o,
                    path: i.href,
                    title: e.title,
                  }));
              }),
              (r.getElementScrollY = function (t) {
                if (this.options.elementScroll) return t.offsetTop - this.top;
                return t.getBoundingClientRect().top + e.scrollY;
              }),
              (r.onScrollHistory = function () {
                let e = this.getClosestScrollPage();
                e != this.scrollPage &&
                  ((this.scrollPage = e), this.setHistory(e.title, e.path));
              }),
              n.debounceMethod(t, "onScrollHistory", 150),
              (r.getClosestScrollPage = function () {
                let t, n;
                t = this.options.elementScroll
                  ? this.scroller.scrollTop + this.scroller.clientHeight / 2
                  : e.scrollY + this.windowHeight / 2;
                for (let e of this.scrollPages) {
                  if (e.top >= t) break;
                  n = e;
                }
                return n;
              }),
              (r.setHistory = function (e, t) {
                let n = this.options.history;
                n &&
                  history[n + "State"] &&
                  (history[n + "State"](null, e, t),
                  this.options.historyTitle && (document.title = e),
                  this.dispatchEvent("history", null, [e, t]));
              }),
              (r.onUnload = function () {
                if (0 === this.scrollPage.top) return;
                let t = e.scrollY - this.scrollPage.top + this.top;
                (this.destroyHistory(), scrollTo(0, t));
              }),
              (r.onPageLoadHistory = function (e, t) {
                this.setHistory(e.title, t);
              }),
              t
            );
          });
        })(nr)),
      nr.exports
    );
  }
  var ir,
    or = { exports: {} };
  function ar() {
    return (
      ir ||
        ((ir = 1),
        (function (e) {
          !(function (t, n) {
            e.exports
              ? (e.exports = n(t, Vn(), Gn()))
              : n(t, t.InfiniteScroll, t.fizzyUIUtils);
          })(window, function (e, t, n) {
            class r {
              constructor(e, t) {
                ((this.element = e),
                  (this.infScroll = t),
                  (this.clickHandler = this.onClick.bind(this)),
                  this.element.addEventListener("click", this.clickHandler),
                  t.on("request", this.disable.bind(this)),
                  t.on("load", this.enable.bind(this)),
                  t.on("error", this.hide.bind(this)),
                  t.on("last", this.hide.bind(this)));
              }
              onClick(e) {
                (e.preventDefault(), this.infScroll.loadNextPage());
              }
              enable() {
                this.element.removeAttribute("disabled");
              }
              disable() {
                this.element.disabled = "disabled";
              }
              hide() {
                this.element.style.display = "none";
              }
              destroy() {
                this.element.removeEventListener("click", this.clickHandler);
              }
            }
            return (
              (t.create.button = function () {
                let e = n.getQueryElement(this.options.button);
                e && (this.button = new r(e, this));
              }),
              (t.destroy.button = function () {
                this.button && this.button.destroy();
              }),
              (t.Button = r),
              t
            );
          });
        })(or)),
      or.exports
    );
  }
  var sr,
    lr,
    ur = { exports: {} };
  function cr() {
    return (
      sr ||
        ((sr = 1),
        (function (e) {
          !(function (t, n) {
            e.exports
              ? (e.exports = n(t, Vn(), Gn()))
              : n(t, t.InfiniteScroll, t.fizzyUIUtils);
          })(window, function (e, t, n) {
            let r = t.prototype;
            function i(e) {
              a(e, "none");
            }
            function o(e) {
              a(e, "block");
            }
            function a(e, t) {
              e && (e.style.display = t);
            }
            return (
              (t.create.status = function () {
                let e = n.getQueryElement(this.options.status);
                e &&
                  ((this.statusElement = e),
                  (this.statusEventElements = {
                    request: e.querySelector(".infinite-scroll-request"),
                    error: e.querySelector(".infinite-scroll-error"),
                    last: e.querySelector(".infinite-scroll-last"),
                  }),
                  this.on("request", this.showRequestStatus),
                  this.on("error", this.showErrorStatus),
                  this.on("last", this.showLastStatus),
                  this.bindHideStatus("on"));
              }),
              (r.bindHideStatus = function (e) {
                let t = this.options.append ? "append" : "load";
                this[e](t, this.hideAllStatus);
              }),
              (r.showRequestStatus = function () {
                this.showStatus("request");
              }),
              (r.showErrorStatus = function () {
                this.showStatus("error");
              }),
              (r.showLastStatus = function () {
                (this.showStatus("last"), this.bindHideStatus("off"));
              }),
              (r.showStatus = function (e) {
                (o(this.statusElement),
                  this.hideStatusEventElements(),
                  o(this.statusEventElements[e]));
              }),
              (r.hideAllStatus = function () {
                (i(this.statusElement), this.hideStatusEventElements());
              }),
              (r.hideStatusEventElements = function () {
                for (let e in this.statusEventElements) {
                  i(this.statusEventElements[e]);
                }
              }),
              t
            );
          });
        })(ur)),
      ur.exports
    );
  }
  var dr =
    (lr ||
      ((lr = 1),
      (function (e) {
        (window,
          e.exports &&
            (e.exports = (function (e) {
              return e;
            })(Vn(), Xn(), er(), rr(), ar(), cr())));
      })(Un)),
    Un.exports);
  var hr,
    pr = { exports: {} };
  var fr =
    (hr ||
      ((hr = 1),
      (function (e, t) {
        e.exports = (function () {
          function e() {
            if ("undefined" != typeof document && document.documentElement)
              return document.documentElement.lang;
          }
          function t(e) {
            return "-Inf" === e
              ? -1 / 0
              : "+Inf" === e || "Inf" === e || "*" === e
                ? 1 / 0
                : parseInt(e, 10);
          }
          var n =
              /^({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])$/,
            r =
              /({\s*(\-?\d+(\.\d+)?[\s*,\s*\-?\d+(\.\d+)?]*)\s*})|([\[\]])\s*(-Inf|\*|\-?\d+(\.\d+)?)\s*,\s*(\+?Inf|\*|\-?\d+(\.\d+)?)\s*([\[\]])/,
            i = { locale: "en" },
            o = function (t) {
              ((t = t || {}),
                (this.locale = t.locale || e() || i.locale),
                (this.fallback = t.fallback),
                (this.messages = t.messages));
            };
          return (
            (o.prototype.setMessages = function (e) {
              this.messages = e;
            }),
            (o.prototype.getLocale = function () {
              return this.locale || this.fallback;
            }),
            (o.prototype.setLocale = function (e) {
              this.locale = e;
            }),
            (o.prototype.getFallback = function () {
              return this.fallback;
            }),
            (o.prototype.setFallback = function (e) {
              this.fallback = e;
            }),
            (o.prototype.has = function (e, t) {
              return (
                !("string" != typeof e || !this.messages) &&
                null !== this._getMessage(e, t)
              );
            }),
            (o.prototype.get = function (e, t, n) {
              if (!this.has(e, n)) return e;
              var r = this._getMessage(e, n);
              return null === r
                ? e
                : (t && (r = this._applyReplacements(r, t)), r);
            }),
            (o.prototype.trans = function (e, t) {
              return this.get(e, t);
            }),
            (o.prototype.choice = function (e, t, n, i) {
              (n = void 0 !== n ? n : {}).count = t;
              var o = this.get(e, n, i);
              if (null == o) return o;
              for (var a = o.split("|"), s = [], l = 0; l < a.length; l++)
                if (((a[l] = a[l].trim()), r.test(a[l]))) {
                  var u = a[l].split(/\s/);
                  (s.push(u.shift()), (a[l] = u.join(" ")));
                }
              if (1 === a.length) return o;
              for (var c = 0; c < s.length; c++)
                if (this._testInterval(t, s[c])) return a[c];
              return (
                (i = i || this._getLocale(e)),
                a[this._getPluralForm(t, i)]
              );
            }),
            (o.prototype.transChoice = function (e, t, n) {
              return this.choice(e, t, n);
            }),
            (o.prototype._parseKey = function (e, t) {
              if ("string" != typeof e || "string" != typeof t) return null;
              var n = e.split("."),
                r = n[0].replace(/\//g, ".");
              return {
                source: t + "." + r,
                sourceFallback: this.getFallback() + "." + r,
                entries: n.slice(1),
              };
            }),
            (o.prototype._getMessage = function (e, t) {
              if (
                ((t = t || this.getLocale()),
                (e = this._parseKey(e, t)),
                void 0 === this.messages[e.source] &&
                  void 0 === this.messages[e.sourceFallback])
              )
                return null;
              var n = this.messages[e.source],
                r = e.entries.slice(),
                i = r.join(".");
              if (
                "string" !=
                  typeof (n =
                    void 0 !== n ? this._getValueInKey(n, i) : void 0) &&
                this.messages[e.sourceFallback]
              )
                for (
                  n = this.messages[e.sourceFallback],
                    r = e.entries.slice(),
                    i = "";
                  r.length && void 0 !== n;
                )
                  n[(i = i ? i.concat(".", r.shift()) : r.shift())] &&
                    ((n = n[i]), (i = ""));
              return "string" != typeof n ? null : n;
            }),
            (o.prototype._getValueInKey = function (e, t) {
              if ("string" == typeof e[t]) return e[t];
              for (
                var n = (t = (t = t.replace(/\[(\w+)\]/g, ".$1")).replace(
                    /^\./,
                    "",
                  )).split("."),
                  r = 0,
                  i = n.length;
                r < i;
                ++r
              ) {
                var o = n.slice(0, r + 1).join("."),
                  a = n.slice(r + 1, n.length).join(".");
                if (e[o]) return this._getValueInKey(e[o], a);
              }
              return e;
            }),
            (o.prototype._getLocale = function (e) {
              return (
                (e = this._parseKey(e, this.locale)),
                this.messages[e.source]
                  ? this.locale
                  : this.messages[e.sourceFallback]
                    ? this.fallback
                    : null
              );
            }),
            (o.prototype._findMessageInTree = function (e, t) {
              for (; e.length && void 0 !== t; ) {
                var n = e.join(".");
                if (t[n]) {
                  t = t[n];
                  break;
                }
                t = t[e.shift()];
              }
              return t;
            }),
            (o.prototype._sortReplacementKeys = function (e, t) {
              return t.length - e.length;
            }),
            (o.prototype._applyReplacements = function (e, t) {
              return (
                Object.keys(t)
                  .sort(this._sortReplacementKeys)
                  .forEach(function (n) {
                    e = e.replace(new RegExp(":" + n, "gi"), function (e) {
                      var r = t[n];
                      return e === e.toUpperCase()
                        ? r.toUpperCase()
                        : e ===
                            e.replace(/\w/i, function (e) {
                              return e.toUpperCase();
                            })
                          ? r.charAt(0).toUpperCase() + r.slice(1)
                          : r;
                    });
                  }),
                e
              );
            }),
            (o.prototype._testInterval = function (e, r) {
              if ("string" != typeof r)
                throw "Invalid interval: should be a string.";
              var i = (r = r.trim()).match(n);
              if (!i) throw "Invalid interval: " + r;
              if (!i[2]) {
                var o = (i = i.filter(function (e) {
                    return !!e;
                  }))[1],
                  a = t(i[2]);
                a === 1 / 0 && (a = -1 / 0);
                var s = t(i[3]),
                  l = i[4];
                return (
                  ("[" === o ? e >= a : e > a) && ("]" === l ? e <= s : e < s)
                );
              }
              for (var u = i[2].split(","), c = 0; c < u.length; c++)
                if (parseInt(u[c], 10) === e) return !0;
              return !1;
            }),
            (o.prototype._getPluralForm = function (e, t) {
              switch (t) {
                case "az":
                case "bo":
                case "dz":
                case "id":
                case "ja":
                case "jv":
                case "ka":
                case "km":
                case "kn":
                case "ko":
                case "ms":
                case "th":
                case "tr":
                case "vi":
                case "zh":
                default:
                  return 0;
                case "af":
                case "bn":
                case "bg":
                case "ca":
                case "da":
                case "de":
                case "el":
                case "en":
                case "eo":
                case "es":
                case "et":
                case "eu":
                case "fa":
                case "fi":
                case "fo":
                case "fur":
                case "fy":
                case "gl":
                case "gu":
                case "ha":
                case "he":
                case "hu":
                case "is":
                case "it":
                case "ku":
                case "lb":
                case "ml":
                case "mn":
                case "mr":
                case "nah":
                case "nb":
                case "ne":
                case "nl":
                case "nn":
                case "no":
                case "om":
                case "or":
                case "pa":
                case "pap":
                case "ps":
                case "pt":
                case "so":
                case "sq":
                case "sv":
                case "sw":
                case "ta":
                case "te":
                case "tk":
                case "ur":
                case "zu":
                  return 1 == e ? 0 : 1;
                case "am":
                case "bh":
                case "fil":
                case "fr":
                case "gun":
                case "hi":
                case "hy":
                case "ln":
                case "mg":
                case "nso":
                case "xbr":
                case "ti":
                case "wa":
                  return 0 === e || 1 === e ? 0 : 1;
                case "be":
                case "bs":
                case "hr":
                case "ru":
                case "sr":
                case "uk":
                  return e % 10 == 1 && e % 100 != 11
                    ? 0
                    : e % 10 >= 2 &&
                        e % 10 <= 4 &&
                        (e % 100 < 10 || e % 100 >= 20)
                      ? 1
                      : 2;
                case "cs":
                case "sk":
                  return 1 == e ? 0 : e >= 2 && e <= 4 ? 1 : 2;
                case "ga":
                  return 1 == e ? 0 : 2 == e ? 1 : 2;
                case "lt":
                  return e % 10 == 1 && e % 100 != 11
                    ? 0
                    : e % 10 >= 2 && (e % 100 < 10 || e % 100 >= 20)
                      ? 1
                      : 2;
                case "sl":
                  return e % 100 == 1
                    ? 0
                    : e % 100 == 2
                      ? 1
                      : e % 100 == 3 || e % 100 == 4
                        ? 2
                        : 3;
                case "mk":
                  return e % 10 == 1 ? 0 : 1;
                case "mt":
                  return 1 == e
                    ? 0
                    : 0 === e || (e % 100 > 1 && e % 100 < 11)
                      ? 1
                      : e % 100 > 10 && e % 100 < 20
                        ? 2
                        : 3;
                case "lv":
                  return 0 === e ? 0 : e % 10 == 1 && e % 100 != 11 ? 1 : 2;
                case "pl":
                  return 1 == e
                    ? 0
                    : e % 10 >= 2 &&
                        e % 10 <= 4 &&
                        (e % 100 < 12 || e % 100 > 14)
                      ? 1
                      : 2;
                case "cy":
                  return 1 == e ? 0 : 2 == e ? 1 : 8 == e || 11 == e ? 2 : 3;
                case "ro":
                  return 1 == e
                    ? 0
                    : 0 === e || (e % 100 > 0 && e % 100 < 20)
                      ? 1
                      : 2;
                case "ar":
                  return 0 === e
                    ? 0
                    : 1 == e
                      ? 1
                      : 2 == e
                        ? 2
                        : e % 100 >= 3 && e % 100 <= 10
                          ? 3
                          : e % 100 >= 11 && e % 100 <= 99
                            ? 4
                            : 5;
              }
            }),
            o
          );
        })();
      })(pr)),
    pr.exports);
  class gr {
    constructor() {
      ((this.endpoints = {}),
        (this.webEndpoints = []),
        (this.namespace = "BaseApi"),
        (this.endpointsMethods = {}),
        (this.endpointsHeaders = {}));
      let e = /function (.{1,})\(/.exec(this.constructor.toString());
      ((this.className = (e && e.length > 1 ? e[1] : "").toLowerCase()),
        (this.debounce = {
          request: void 0,
          time: 300,
          enabled: !0,
          exclude: [],
        }));
    }
    after_init() {}
    normalRequest(e, t = void 0, n = null) {
      let r = Array.isArray(e),
        i = r ? this.getUrl(...e) : this.getUrl(e);
      ((e = r ? e[0] : e), (n = n || this.endpointsMethods[e] || "post"));
      let o = this.endpointsHeaders[e];
      if ("get" === n && t instanceof FormData) {
        let e = {};
        (Array.from(t.entries()).forEach(function (t) {
          e[t[0]] = t[1];
        }),
          (t = { params: e }));
      }
      return (
        o && "get" === n && (t = t ? Object.assign(t, o) : o),
        this.webEndpoints.includes(e)
          ? (i = salla.url.get(i))
          : "http" !== i.substring(0, 4) && (i = salla.url.api(i)),
        Salla.api.request(i, t, n, { headers: o })
      );
    }
    request(e, t = void 0, n = null) {
      return !salla.api.isFastRequestsAllowed() && this.debounce.enabled
        ? (this.debounce.request ||
            (this.debounce.request = salla.helpers.debounce(
              this.normalRequest.bind(this),
              this.debounce.time,
            )),
          this.debounce.request(e, t, n))
        : this.normalRequest(e, t, n);
    }
    getUrl(e) {
      let t = this.endpoints[e] || e;
      const n = /{[^{}]+}/i;
      for (let e = 1; e < arguments.length; e++) t = t.replace(n, arguments[e]);
      return t;
    }
    event() {
      return salla.event[this.className];
    }
  }
  class mr extends gr {
    constructor() {
      (super(),
        (this.addToCartTries = 0),
        (this.guestCartAssigned = !1),
        (this.namespace = "cart"),
        (this._pendingCartIdRequest = null),
        (this._pendingAssignRequest = null),
        (this.endpoints = {
          latest: "cart/latest",
          latestApi: "cart/latest",
          details: "cart/{cart}",
          quickAdd: "cart/{cart}/item/{product}/quick-add",
          addItem: "cart/{cart}/item/{product}/add",
          deleteItem: "cart/{cart}/item/{item}",
          updateItem: "cart/{cart}/item/{item}",
          deleteImage: "cart/{cart}/image/{image}",
          uploadImage: "cart/{cart}/image",
          status: "cart/{cart}/status",
          addCoupon: "cart/{id}/coupon",
          deleteCoupon: "cart/{id}/coupon",
          getQuickOrderSettings: "checkout/quick-order",
          createQuickOrder: "checkout/quick-order",
          priceQuote: "cart/{cartId}/price-quote",
          offers: "offers/cart/{cartId}",
          giftCartDetails: "cart/{cartId}/buy-as-gift",
          cartGiftToCart: "cart/{cart_id}/buy-as-gift",
          assign: "cart/{cartId}/assign?merge=1",
        }),
        (this.endpointsMethods = {
          latest: "get",
          details: "get",
          status: "get",
          updateItem: "post",
          deleteItem: "delete",
          deleteImage: "delete",
          deleteCoupon: "put",
          getQuickOrderSettings: "get",
          offers: "get",
          giftCartDetails: "get",
        }),
        (this.webEndpoints = ["latest"]),
        (this.latestCart = null),
        this.after_init(),
        salla.event.on("api::initiated", () =>
          salla.api.cart.getCurrentCartId(!1, "api::initiated"),
        ),
        salla.event.on("auth::token.fetched", this._checkCurrentCart),
        salla.event.on("auth::token.invalid", this._checkCurrentCart),
        salla.event.on(
          "auth::verified",
          async function () {
            try {
              await Salla.api.cart.assign();
            } catch (e) {
              Salla.log("Error on assign after verified", e);
            }
            return Salla.api.cart.getCurrentCartId(!0, "auth::verified");
          },
          { async: !0 },
        ),
        salla.event.on("twilight::initiated", () =>
          salla.api.cart.syncGuestCart(),
        ),
        salla.event.on("profile::info.fetched", () =>
          this._checkCurrentCart(!0),
        ),
        salla.event.on(
          "twilight::error",
          (e) =>
            (e.includes("Cart not available") ||
              e.includes("السلة غير متاحة")) &&
            salla.cart.api.reset(),
        ));
    }
    _checkCurrentCart(e = !1) {
      var t, n;
      let r = salla.storage.get("cart"),
        i = null == (t = salla.config.get("user")) ? void 0 : t.id,
        o = null == (n = salla.config.get("store")) ? void 0 : n.id;
      r &&
        r.id &&
        !e &&
        ((r.user_id === i && r.store_id === o) ||
          (salla.log("cart", { user_id: r.user_id, store_id: r.store_id }),
          salla.log("current", { user_id: i, store_id: o }),
          salla.log(
            "Api:: case2 => The cart is not belong to current " +
              (r.user_id !== i ? "user" : "store") +
              "!",
          ),
          salla.cart.api.reset()),
        salla.url.is_page("cart") &&
          r.id !== salla.config.get("page.id") &&
          (salla.log("cart", { user_id: r.user_id, store_id: r.store_id }),
          salla.log("current", { user_id: i, store_id: o }),
          salla.log(
            `Api:: case2 => The cart is different between storage:${r.id} & session:${salla.config.get("page.id")} !`,
          ),
          salla.cart.api.reset()));
    }
    async getCurrentCartId(e = !1, t = "getCurrentCartId") {
      if (Salla.cart.api._pendingCartIdRequest)
        return Salla.cart.api._pendingCartIdRequest;
      Salla.cart.api._pendingCartIdRequest = (async function () {
        try {
          if (!e) {
            if (Salla.cart.api.latestCart)
              return Salla.cart.api.latestCart.cart.id;
            let e = Salla.storage.get("cart.id");
            if (e) return e;
          }
          let n = await Salla.cart.api.latest(t);
          return (
            (Salla.cart.api.latestCart = n.data),
            Salla.cart.api.latestCart.cart.id
          );
        } finally {
          Salla.cart.api._pendingCartIdRequest = null;
        }
      })();
      let n = Salla.cart.api._pendingCartIdRequest;
      return ((Salla.cart.api._pendingCartIdRequest = null), n);
    }
    getUploadImageEndpoint(e) {
      return salla.url.api(
        this.getUrl("uploadImage", e || salla.storage.get("cart.id")),
      );
    }
    latest(e = "direct") {
      return this.request(
        salla.auth.api.isSessionless() ? "latestApi" : "latest",
        { params: { source: "", callerName: e } },
      )
        .then(
          (e) => (
            salla.api.cart.set(e.data.cart),
            salla.event.cart.latestFetched(e),
            e
          ),
        )
        .catch((e) => {
          throw (salla.api.cart.reset(), salla.event.cart.latestFailed(e), e);
        });
    }
    async details(e, t = []) {
      return (
        (e =
          e ||
          (await salla.api.cart.getCurrentCartId(
            !1,
            "salla.api.cart.details",
          ))),
        this.request(["details", e], { params: { with: t } })
          .then(function (e) {
            return (salla.cart.event.detailsFetched(e), e);
          })
          .catch(function (e) {
            throw (salla.cart.event.detailsNotFetched(e), e);
          })
      );
    }
    async quickAdd(e, t, n) {
      return this.addItem({
        id: e,
        quantity: t,
        offerType: n,
        endpoint: "quickAdd",
      });
    }
    async addItem(e) {
      let t = this.getCartPayload(e);
      if (!t.id) {
        let e = 'There is no product "id"!';
        return (salla.cart.event.itemAddedFailed(e), salla.api.errorPromise(e));
      }
      let n = salla.form.getPossibleValue(t.payload, ["endpoint"]);
      (n && ["addItem", "quickAdd"].includes(n)) ||
        (n = salla.form.getPossibleValue(t.payload, [
          "quantity",
          "donating_amount",
        ])
          ? "addItem"
          : "quickAdd");
      let r = await Salla.api.cart.getCurrentCartId(
        !1,
        "salla.api.cart.addItem",
      );
      try {
        ((t.payload = Salla.helpers.createFormDataWrapper(t.payload || {})),
          await Salla.cart.event.beforeAddItem(t));
      } catch (e) {}
      return this.request([n, r, t.id], t.payload.getRawData())
        .then(function (e) {
          Salla.cart.api.addToCartTries = 0;
          try {
            Salla.cart.event.itemAdded(e, t.id);
          } catch (e) {
            Salla.log(e);
          }
          return e;
        })
        .catch(function (n) {
          if (!Salla.cart.api.addToCartTries)
            return (
              Salla.cart.api.addToCartTries++,
              Salla.cart.reset(),
              Salla.cart.api.addItem(e)
            );
          throw (Salla.cart.event.itemAddedFailed(n, t.id), n);
        });
    }
    async deleteItem(e) {
      let t = this.getCartPayload(e);
      if (!t.id) {
        let e = 'There is no "id"!';
        return (
          salla.cart.event.itemDeletedFailed(e),
          salla.api.errorPromise(e)
        );
      }
      let n = await salla.api.cart.getCurrentCartId(
        !1,
        "salla.api.cart.deleteItem",
      );
      return this.request(["deleteItem", n, t.id])
        .then(function (e) {
          return (salla.cart.event.itemDeleted(e, t.id), e);
        })
        .catch(function (e) {
          throw (salla.cart.event.itemDeletedFailed(e, t.id), e);
        });
    }
    async updateItem(e) {
      var t;
      let n = this.getCartPayload(e);
      if (!n.id) {
        let e = 'There is no "id"!';
        return (
          salla.cart.event.itemUpdatedFailed(e),
          salla.api.errorPromise(e)
        );
      }
      let r = await salla.api.cart.getCurrentCartId(
        !1,
        "salla.api.cart.updateItem",
      );
      return (
        "Object" === (null == (t = n.payload.constructor) ? void 0 : t.name)
          ? (n.payload._method = "PUT")
          : n.payload.append("_method", "PUT"),
        this.request(["updateItem", r, n.id], n.payload)
          .then(function (e) {
            return (salla.cart.event.itemUpdated(e, n.id), e);
          })
          .catch(function (e) {
            throw (salla.cart.event.itemUpdatedFailed(e, n.id), e);
          })
      );
    }
    async deleteImage(e) {
      if (
        !(e = salla.form.getPossibleValue(e, ["id", "image_id", "photo_id"]))
      ) {
        let e = 'There is no "id"!';
        return (salla.cart.event.imageNotDeleted(e), salla.api.errorPromise(e));
      }
      let t = await salla.api.cart.getCurrentCartId(
        !1,
        "salla.api.cart.deleteImage",
      );
      return this.request(["deleteImage", t, e])
        .then(function (t) {
          return (salla.cart.event.imageDeleted(t, e), t);
        })
        .catch(function (t) {
          throw (salla.cart.event.imageNotDeleted(t, e), t);
        });
    }
    async status(e, t = !1) {
      e =
        e ||
        (await salla.api.cart.getCurrentCartId(!1, "salla.api.cart.status"));
      const n = { has_apple_pay: salla.helpers.hasApplePay() };
      t && (n.guest_checkout = 1);
      try {
        await salla.cart.event.submitting();
      } catch (e) {
        salla.log("Error on: salla.cart.event.submitting()");
      }
      return this.request(["status", e], { params: n });
    }
    async submit(e = !1, t = !1) {
      if (
        (console.log("salla.cart.api.submit", { isGuestCheckout: e }),
        salla.config.isGuest() && !e)
      )
        return (
          salla.log(
            "it looks that the current user is not logged-in, lets login then submit",
          ),
          salla.cart.loginOnCartPage()
        );
      let n;
      if (t)
        try {
          var r;
          const e = await Salla.api.cart.assign();
          n = null == e || null == (r = e.data) ? void 0 : r.cart_id;
        } catch (e) {
          Salla.log("Error on assign after login from submit", e);
        }
      this.status(
        null != n
          ? n
          : await salla.api.cart.getCurrentCartId(!1, "salla.api.cart.submit"),
        e,
      )
        .then((e) => {
          var t;
          let n = null == (t = e.data.next_step) ? void 0 : t.to;
          if (
            (n ||
              (window.history.pushState(
                {},
                "",
                salla.url.addParamToUrl("reload", "empty_next_step"),
              ),
              window.history.pushState(
                {},
                "",
                salla.url.addParamToUrl(
                  "acitve",
                  !1 === e.data.active ? "false" : "true_or_undfined",
                ),
              ),
              salla.cart.reset(),
              window.location.reload()),
            !["checkout", "refresh", "login"].includes(n))
          ) {
            let e = "Can't find next_step );";
            throw (salla.cart.reset(), salla.cart.event.submitFailed(e), e);
          }
          if ((salla.cart.event.submitted(e), "login" === n))
            return salla.cart.loginOnCartPage();
          if ("checkout" === n) {
            let t = e.data.next_step.url;
            return (
              salla.helpers.hasApplePay() &&
                (t += (t.includes("?") ? "&" : "?") + "has_apple_pay=true"),
              (window.location.href = t)
            );
          }
          (window.history.pushState(
            {},
            "",
            salla.url.addParamToUrl("reload", "refresh"),
          ),
            window.location.reload());
        })
        .catch(function (e) {
          var t;
          ((salla.cart.api.tries = salla.cart.api.tries || 0),
            salla.cart.reset());
          let n =
            404 ===
            (null == e || null == (t = e.response) || null == (t = t.data)
              ? void 0
              : t.status);
          if (n && 0 === salla.cart.api.tries)
            return (
              salla.cart.api.tries++,
              salla.log(
                "we recived that the current cart is not found, we will try to re-submit one more time",
              ),
              salla.cart.submit()
            );
          throw (
            n && salla.error(salla.lang.get("pages.checkout.try_again")),
            salla.cart.event.submitFailed(e),
            e
          );
        });
    }
    getCartPayload(e) {
      var t;
      let n =
        (null == (t = e) ? void 0 : t.data) ||
        ("object" == typeof e ? e : void 0);
      return (
        (e = n
          ? salla.form.getPossibleValue(n, [
              "prod_id",
              "product_id",
              "item_id",
              "id",
            ])
          : e),
        (n = "object" == typeof n ? n : void 0),
        { id: e, payload: n }
      );
    }
    normalRequest(e, t = void 0, n = null) {
      var r = this;
      return super.normalRequest(e, t, n).catch(async function (e) {
        var t;
        throw (
          403 === (null == e || null == (t = e.response) ? void 0 : t.status) &&
            (r.reset(),
            salla.error(salla.lang.get("pages.checkout.try_again"))),
          e
        );
      });
    }
    reset() {
      ((salla.api.cart.latestCart = null),
        salla.storage.remove("cart"),
        salla.cookie.clearCookieByPrefix(salla.api.cart.getCartCookiePrefix()),
        salla.cart.event.successReset());
    }
    async addCoupon(e) {
      if (
        ((e = e.data || e), !(e = salla.form.getPossibleValue(e, ["coupon"])))
      ) {
        let e = new Error('There is no "Coupon Code"!');
        return (
          (e.name = "EmptyCoupon"),
          salla.event.cart.couponAdditionFailed(e),
          salla.api.errorPromise(e)
        );
      }
      let t = await salla.cart.api.getCurrentCartId(
        !1,
        "salla.api.cart.addCoupon",
      );
      return this.request(["addCoupon", t], { coupon: e })
        .then(function (e) {
          var n;
          let r = salla.storage.get("cart");
          return (
            r &&
              null != (n = e.data) &&
              null != (n = n.cart) &&
              n.coupon &&
              ((r.coupon = e.data.cart.coupon), salla.storage.set("cart", r)),
            salla.event.cart.couponAdded(e, t),
            e
          );
        })
        .catch(function (e) {
          throw (salla.event.cart.couponAdditionFailed(e, t), e);
        });
    }
    async deleteCoupon() {
      let e = await salla.cart.api.getCurrentCartId(
        !1,
        "salla.api.cart.deleteCoupon",
      );
      return this.request(["deleteCoupon", e], {})
        .then(function (t) {
          let n = salla.storage.get("cart");
          return (
            n && n.coupon && (delete n.coupon, salla.storage.set("cart", n)),
            salla.event.cart.couponDeleted(t, e),
            t
          );
        })
        .catch(function (t) {
          throw (salla.event.cart.couponDeletionFailed(t, e), t);
        });
    }
    getQuickOrderSettings() {
      return this.request("getQuickOrderSettings")
        .then((e) => (salla.event.cart.quickOrderSettingFetched(e), e))
        .catch((e) => {
          throw (salla.event.cart.quickOrderSettingFailed(e), e);
        });
    }
    createQuickOrder(e) {
      return this.request("createQuickOrder", e)
        .then((e) => (salla.event.cart.quickOrderSucceeded(e), e))
        .catch((e) => {
          throw (salla.event.cart.quickOrderFailed(e), e);
        });
    }
    async priceQuote(e) {
      return salla.config.isGuest()
        ? (salla.auth.api.setAfterLoginEvent("cart::priceQuote", e),
          void salla.event.dispatch("login::open"))
        : this.request([
            "priceQuote",
            e ||
              (await salla.api.cart.getCurrentCartId(
                !1,
                "salla.api.cart.priceQuote",
              )),
          ])
            .then(
              (e) => (
                salla.cart.api.reset(),
                salla.event.cart
                  .priceQuoteSucceeded(e)
                  .then(
                    () => (
                      setTimeout(
                        () => (window.location.href = salla.url.get("/")),
                        1e3,
                      ),
                      e
                    ),
                  )
              ),
            )
            .catch((e) =>
              salla.event.cart.priceQuoteFailed(e).then(() => {
                var t;
                throw (
                  404 === (null == (t = e.error) ? void 0 : t.code) &&
                    window.location.reload(),
                  e
                );
              }),
            );
    }
    loginOnCartPage() {
      (salla.auth.setCanRedirect(!1),
        salla.event.dispatch("login::open", {
          withoutReload: !0,
          source: "cart-submit",
        }),
        salla.auth.event.onLoggedIn(() => {
          (salla.event.dispatch("login::close"), salla.cart.submit(!1, !0));
        }));
    }
    set(e) {
      (salla.storage.set("cart", e), salla.api.cart.syncGuestCart());
    }
    async offers() {
      const e = await salla.cart.api.getCurrentCartId(
        !1,
        "salla.api.cart.offers",
      );
      return this.request(["offers", e])
        .then((e) => (salla.event.cart.offersFetched(e), e))
        .catch((e) => {
          throw (salla.event.cart.offersFailed(e), e);
        });
    }
    async getGiftCartDetails() {
      let e = await salla.api.cart.getCurrentCartId(
        !1,
        "salla.api.cart.getGiftCartDetails",
      );
      return this.request(["giftCartDetails", e])
        .then((t) => (salla.product.event.giftFetched(t, e), t))
        .catch((t) => {
          throw (salla.product.event.giftFetchFailed(t, e), t);
        });
    }
    async addCartGiftToCart(e, t = !1) {
      let n = await salla.api.cart.getCurrentCartId(
        !1,
        "salla.api.cart.addCartGiftToCart",
      );
      return this.request(["cartGiftToCart", n], e)
        .then(
          (e) => (
            salla.product.event.addGiftToCartSucceeded(e, n),
            t && (window.location.href = e.redirect),
            e
          ),
        )
        .catch((e) => {
          throw (salla.product.event.addGiftToCartFailed(e, n), e);
        });
    }
    async syncGuestCart() {
      if (!salla.config.isGuest()) return;
      const e = salla.api.cart.getCartCookiePrefix(),
        t = salla.cookie.getCookieByPrefix(e),
        n = salla.storage.get("cart.id");
      if (!n && t.length)
        try {
          var r;
          const t =
            null == (r = (await salla.api.cart.latest()).data) ||
            null == (r = r.cart)
              ? void 0
              : r.id;
          t && salla.api.cart.setCartCookie(e, t);
        } catch (e) {
          salla.log("Failed to fetch latest cart:", e);
        }
      (salla.cookie.clearCookieByPrefix(e),
        n &&
          (salla.config.set("headers.s-cart-id", n),
          salla.api.cart.setCartCookie(e, n)));
    }
    async assign() {
      var e = this;
      if (Salla.api.cart._pendingAssignRequest)
        return Salla.api.cart._pendingAssignRequest;
      let t = Salla.storage.get("cart.id");
      return (
        !(!t || Salla.api.cart.guestCartAssigned) &&
        ((Salla.api.cart._pendingAssignRequest = (async function () {
          try {
            const n = await e.request(["assign", t]);
            return ((Salla.api.cart.guestCartAssigned = !0), n);
          } catch (e) {
            throw e;
          } finally {
            Salla.api.cart._pendingAssignRequest = null;
          }
        })()),
        Salla.api.cart._pendingAssignRequest)
      );
    }
    setCartCookie(e, t) {
      salla.cookie.set(`${e}-${t}`, t, 1);
    }
    getCartCookiePrefix() {
      return "cart-id-" + salla.config.get("store.id");
    }
  }
  class vr extends gr {
    constructor() {
      (super(),
        (this.namespace = "loyalty"),
        (this.endpoints = {
          getProgram: "loyalty",
          exchange: "loyalty/exchange",
          reset: "loyalty/exchange",
        }),
        (this.endpointsMethods = { getProgram: "get", reset: "put" }),
        this.after_init());
    }
    getProgram() {
      return this.request("getProgram")
        .then((e) => (salla.loyalty.event.programFetched(e), e))
        .catch((e) => {
          throw (salla.loyalty.event.programNotFetched(e), e);
        });
    }
    async exchange(e, t = null) {
      if (
        !(e = salla.form.getPossibleValue(e, [
          "id",
          "loyalty_prize_id",
          "prize_id",
        ]))
      ) {
        let e = "Unable to find cart id. Please provide one.";
        return (
          salla.loyalty.event.exchangeFailed(e),
          salla.api.errorPromise(e)
        );
      }
      if (
        !(t =
          t ||
          (await salla.cart.getCurrentCartId(!1, "salla.api.loyalty.exchange")))
      ) {
        let e = "Unable to find cart id. Please provide one.";
        return (
          salla.loyalty.event.exchangeFailed(e),
          salla.api.errorPromise(e)
        );
      }
      return this.request("exchange", { loyalty_prize_id: e, cart_id: t })
        .then(function (t) {
          return (salla.loyalty.event.exchangeSucceeded(t, e), t);
        })
        .catch(function (t) {
          throw (salla.loyalty.event.exchangeFailed(t, e), t);
        });
    }
    async reset(e = null) {
      if (
        !(e =
          e ||
          (await salla.cart.getCurrentCartId(!1, "salla.api.loyalty.reset")))
      ) {
        let e = "Unable to find cart id. Please provide one.";
        return (salla.loyalty.event.resetFailed(e), salla.api.errorPromise(e));
      }
      return this.request("reset", { cart_id: e })
        .then((e) => (salla.loyalty.event.resetSucceeded(e), e))
        .catch((e) => {
          throw (salla.loyalty.event.resetFailed(e), e);
        });
    }
  }
  class yr extends gr {
    constructor() {
      (super(),
        (this.namespace = "auth"),
        (this.canRedirect_ = !0),
        (this.afterLoginEvent = { event: null, payload: null }),
        (this.endpoints = {
          login: "auth/{type}/send_verification",
          resend: "auth/resend_verification",
          verify: "auth/{type}/verify",
          register: "auth/register",
          logout: "logout",
          refresh: "auth/refresh",
        }),
        (this.webEndpoints = ["logout", "auth/jwt", "refresh"]),
        (this.endpointsMethods = { logout: "get" }),
        (this.inIframe = salla.helpers.isIframe()),
        Salla.event.on("twilight::init", function () {
          if (Salla.config.isGuest() && location.href.includes("force_logout"))
            return (
              delete Salla.api.axios.defaults.headers.common.Authorization,
              Salla.api.auth.logout("twilight", !1)
            );
        }),
        this.after_init());
    }
    setAfterLoginEvent(e, t) {
      salla.api.auth.afterLoginEvent = { event: e, payload: t };
    }
    setCanRedirect(e) {
      salla.api.auth.canRedirect_ = e;
    }
    canRedirect() {
      return (
        salla.api.auth.canRedirect_ && !salla.api.auth.afterLoginEvent.event
      );
    }
    login(e) {
      var t;
      null != (t = e) && t.data && (e = e.data);
      let n = salla.form.getPossibleValue(e, ["type"]);
      if (!["email", "mobile"].includes(n)) {
        let e = "Login type should be in: [email, mobile]";
        return (salla.auth.event.codeNotSent(e), salla.api.errorPromise(e));
      }
      return this.request(["login", n], e)
        .then(function (e) {
          return (salla.auth.event.codeSent(e, n), e);
        })
        .catch(function (e) {
          throw (
            salla.auth.event.codeNotSent(e, n),
            salla.auth.api.trackBlockedError(e, "login"),
            e
          );
        });
    }
    async verify(e, t = !0) {
      let n = salla.form.getPossibleValue(e, ["type"]);
      if (!n) {
        let e = "Failed to know what's login type!";
        return (
          salla.auth.event.verificationFailed(e),
          salla.api.errorPromise(e)
        );
      }
      ((t = !1 !== salla.form.getPossibleValue(e, ["supportWebAuth"]) && t),
        salla.auth.event.next_event &&
          (e.next_event = salla.auth.event.next_event));
      let r = await salla.auth.api.request(["verify", n], e);
      return 200 !== (null == r ? void 0 : r.status)
        ? (salla.auth.event.verificationFailed(r, n), salla.api.errorPromise(r))
        : salla.auth.api.handlAfterAuthenticatedResponse(r, t);
    }
    async handlAfterAuthenticatedResponse(e, t) {
      var n;
      e.data || (e = { data: e });
      let r = "authenticated" === (null == (n = e.data) ? void 0 : n.case);
      return (
        r && salla.auth.event.tokenFetched(e.data.token),
        t &&
          !this.inIframe &&
          !this.isSessionless() &&
          (await salla.auth.api.request("auth/jwt", {
            callerName: "salla.auth.api.handlAfterAuthenticatedResponse",
          })),
        r &&
          (await salla.auth.event
            .loggedIn(e)
            .then(() => salla.auth.api.afterUserLogin())),
        await salla.auth.event.verified(e, e.data.verification.type),
        salla.api.successPromise(e)
      );
    }
    resend(e) {
      let t;
      return (
        ((e = e.data || e).type = e.type || "mobile"),
        "mobile" !== e.type || (e.phone && e.country_code)
          ? "email" !== e.type || e.email
            ? this.request("resend", e)
                .then(function (t) {
                  return (salla.auth.event.codeSent(t, e), t);
                })
                .catch(function (t) {
                  throw (
                    salla.auth.event.codeNotSent(t, e),
                    salla.auth.api.trackBlockedError(t, "resend"),
                    t
                  );
                })
            : (salla.auth.event.codeNotSent((t = "There is no email!"), e),
              salla.api.errorPromise(t))
          : (salla.auth.event.codeNotSent(
              (t = "There is no phone or country_code!"),
              e,
            ),
            salla.api.errorPromise(t))
      );
    }
    register(e) {
      var t = this;
      let n;
      return (
        e.data && ((n = e.element), (e = e.data)),
        salla.auth.event.next_event &&
          (e.next_event = salla.auth.event.next_event),
        this.request("register", e)
          .then(async function (e) {
            var r;
            return (
              salla.auth.event.registered.call(n, e),
              "authenticated" === (null == (r = e.data) ? void 0 : r.case) &&
                (salla.auth.event.tokenFetched(e.data.token),
                !t.inIframe &&
                  !t.isSessionless() &&
                  (await salla.auth.request("auth/jwt", {
                    callerName: "salla.auth.api.register",
                  })),
                salla.auth.event.loggedIn(e),
                salla.auth.api.afterUserLogin()),
              e
            );
          })
          .catch(function (e) {
            throw (
              salla.auth.event.registrationFailed.call(n, e),
              salla.auth.api.trackBlockedError(e, "register"),
              e
            );
          })
      );
    }
    handleIframeReadyAction(e, t) {
      var n;
      null == (n = e.contentWindow) ||
        n.postMessage(
          {
            source: "logout",
            type: "init",
            data: {
              id: salla.config.get("store.id"),
              lang: "ar",
              appUrl: t,
              apiUrl: salla.config.get("store.api").replace(/\/+$/, ""),
              settings: salla.config.all(),
              storage: {},
            },
          },
          "*",
        );
    }
    appendIframeAndLogout() {
      return new Promise((e) => {
        let t = salla.config.get("login.url", "https://accounts.salla.com");
        const n = document.createElement("iframe");
        ((n.style.display = "none"), (n.src = `${t}/logout`));
        const r = (i) => {
          if ("login" !== i.data.source) return;
          let o = i.data.type.replace("iframe::", "");
          if (
            (salla.log("iframe::logout-iframe message received", i.data),
            ["logged-out", "ready"].includes(o))
          ) {
            if ("ready" === o) return this.handleIframeReadyAction(n, t);
            (window.removeEventListener("message", r), n.remove(), e());
          }
        };
        (window.addEventListener("message", r), document.body.appendChild(n));
      });
    }
    logout(e = "twilight", t = !0) {
      return (
        salla.storage.clearAll(),
        salla.cookie.clearAll(),
        (e = encodeURI(e)),
        salla.auth.event
          .loggedOut()
          .then(() => this.appendIframeAndLogout())
          .then(() => {
            if (!t) return;
            let n = salla.url.get(`logout?from=${e}`);
            console.log(
              `Going to ${n}, to do any thing before this action use: salla.auth.even.onLoggedOut(()=>{...})`,
            );
            try {
              location.href = n;
            } catch (e) {
              salla.log(e);
            }
          })
          .catch((e) => console.error("Error during logout:", e))
      );
    }
    refresh() {
      return this.request("refresh")
        .then(function (e) {
          return (salla.auth.event.tokenFetched(e.data.token), e);
        })
        .catch(function (e) {
          throw (salla.auth.event.refreshFailed(e), e);
        });
    }
    afterUserLogin() {
      this.afterLoginEvent.event &&
        salla.event.emit(
          this.afterLoginEvent.event,
          this.afterLoginEvent.payload,
        );
    }
    isSessionless() {
      return "sessionless" === salla.config.get("auth.mode");
    }
    trackBlockedError(e, t) {
      var n;
      void 0 ===
        (null == e || null == (n = e.response) || null == (n = n.headers)
          ? void 0
          : n["s-ray"]) &&
        salla.analytics.track("BlockedByProxy", {
          class: "auth",
          function: t,
          reason: "non-server-request",
          message: e.message,
        });
    }
  }
  class br extends gr {
    constructor() {
      (super(),
        (this.namespace = "order"),
        (this.endpoints = {
          cancel: "orders/cancel/{id}",
          createCartFromOrder: "reorder/{id}",
          reorderProduct: "reorder/product/{id}",
          sendInvoice: "orders/send/{id}",
          fetch: "orders",
        }),
        (this.endpointsMethods = { createCartFromOrder: "get", fetch: "get" }),
        this.after_init());
    }
    show(e) {
      let t = salla.form.getPossibleValue((null == e ? void 0 : e.data) || e, [
        "id",
        "order_id",
      ]);
      (salla.event.dispatch("mobile::order.placed", { order_id: t }),
        (location.href = salla.form.getPossibleValue(
          (null == e ? void 0 : e.data) || e,
          ["url"],
        )));
    }
    cancel(e) {
      return (
        (e = e || Salla.config.get("page.id")),
        this.request(["cancel", e], {
          params: { has_apple_pay: salla.helpers.hasApplePay() },
        })
          .then(function (t) {
            return (salla.event.order.canceled(t, e), t);
          })
          .catch(function (t) {
            throw (salla.event.order.notCanceled(t, e), t);
          })
      );
    }
    createCartFromOrder(e) {
      return (
        (e = e || salla.config.get("page.id")),
        this.request(["createCartFromOrder", e])
          .then(function (t) {
            return (
              salla.cart.reset(),
              salla.event.order.orderCreated(t, e),
              (window.location.href = t.data.url),
              t
            );
          })
          .catch(function (t) {
            throw (salla.event.order.orderCreationFailed(t, e), t);
          })
      );
    }
    reorderProduct(e) {
      return (
        (e = e || salla.config.get("page.id")),
        this.request(["reorderProduct", e])
          .then(function (t) {
            const n = jn({}, t.data, { type: "reorder", id: e }),
              r = jn({}, t, { data: n });
            return (
              salla.event.order.orderCreated(r, t.data.order_id),
              (window.location.href = t.data.url),
              t
            );
          })
          .catch(function (t) {
            throw (salla.event.order.orderCreationFailed(t, e), t);
          })
      );
    }
    sendInvoice(e) {
      let t =
        salla.form.getPossibleValue(e, ["id"]) || salla.config.get("page.id");
      if (!t) {
        let e = "There is no id!";
        return (salla.order.event.invoiceNotSent(e), salla.api.errorPromise(e));
      }
      return this.request(["sendInvoice", t], e)
        .then((e) => (salla.event.order.invoiceSent(e, t), e))
        .catch((e) => {
          throw (salla.event.order.invoiceNotSent(e, t), e);
        });
    }
    fetch(e) {
      return this.request(["fetch"], { params: e })
        .then(function (e) {
          return (salla.event.order.ordersFetched(e), e);
        })
        .catch(function (e) {
          throw (salla.event.order.ordersNotFetched(e), e);
        });
    }
  }
  class wr extends gr {
    constructor() {
      (super(),
        (this.namespace = "product"),
        (this.previousQuery = ""),
        (this.endpoints = {
          getPrice: "products/{id}/price",
          availabilitySubscribe: "products/{id}/availability-notify",
          search: "products/search",
          details: "products/{product_id}/details",
          categories: "products/categories/{?id}",
          offers: "products/{product_id}/specialoffer",
          getSizeGuides: "products/{prod_id}/size-guides",
          giftProductDetails: "products/{product_id}/buy-as-gift",
          productGiftToCart: "products/{product_id}/buy-as-gift",
          giftImage: "products/buy-as-gift/image",
          buyNow: "products/{product_id}/buy-now",
          fetch: "products",
          fetchOptions: "products/options",
        }),
        (this.endpointsMethods = {
          details: "get",
          giftProductDetails: "get",
          fetch: "get",
          offers: "get",
          fetchOptions: "get",
        }),
        this.after_init());
    }
    getPrice(e) {
      let t = e.data || e,
        n = salla.form.getPossibleValue(t, ["id", "prod_id", "product_id"]);
      return this.request(["getPrice", n], "object" == typeof t ? t : void 0)
        .then(function (e) {
          return (salla.product.event.priceUpdated(e, n), e);
        })
        .catch(function (e) {
          throw (salla.product.event.priceUpdateFailed(e, n), e);
        });
    }
    categories(e) {
      return this.request(["categories", e || ""], null, "get")
        .then(function (e) {
          return (salla.product.event.categoriesFetched(e), e);
        })
        .catch(function (e) {
          throw (salla.product.event.categoriesFailed(e), e);
        });
    }
    availabilitySubscribe(e) {
      let t = e.data || e;
      return (
        (e = salla.form.getPossibleValue(t, ["id", "prod_id"])),
        this.request(
          ["availabilitySubscribe", e],
          "object" == typeof t ? t : void 0,
        )
          .then(function (t) {
            return (salla.product.event.availabilitySubscribed(t, e), t);
          })
          .catch(function (t) {
            throw (salla.product.event.availabilitySubscribeFailed(t, e), t);
          })
      );
    }
    search(e) {
      var t;
      let n = e.data;
      if (
        (n || (n = { params: "string" == typeof e ? { query: e } : e }),
        !(e =
          n instanceof FormData
            ? n.get("query")
            : n.query || (null == (t = n.params) ? void 0 : t.query)))
      ) {
        let e = 'There is no "query"!';
        return (salla.product.event.searchFailed(e), salla.api.errorPromise(e));
      }
      if (e === salla.api.product.previousQuery) {
        let e = "Query is same as previous one!";
        return (
          salla.product.event.searchFailed(e),
          (salla.api.product.previousQuery = null),
          salla.api.errorPromise(e)
        );
      }
      return (
        (salla.api.product.previousQuery = e),
        this.request("search", n, "get")
          .then(function (t) {
            return (salla.product.event.searchResults(t, e), t);
          })
          .catch(function (t) {
            throw (salla.product.event.searchFailed(t, e), t);
          })
      );
    }
    offers(e) {
      var t;
      if (
        !(e = salla.form.getPossibleValue(
          (null == (t = e) ? void 0 : t.data) | e,
          ["product_id", "id"],
        ))
      ) {
        let e = 'There is no "product_id"!';
        return (
          salla.product.event.fetchOffersFailed(e),
          salla.api.errorPromise(e)
        );
      }
      return this.request(["offers", e])
        .then(function (t) {
          return (salla.product.event.offersFetched(t, e), t);
        })
        .catch(function (t) {
          throw (salla.product.event.fetchOffersFailed(t, e), t);
        });
    }
    getSizeGuides(e) {
      return this.request(`products/${e}/size-guides`, null, "get")
        .then((t) => (salla.product.event.sizeGuideFetched(t, e), t))
        .catch((t) => {
          throw (salla.product.event.sizeGuideFetchFailed(t, e), t);
        });
    }
    getGiftProductDetails(e) {
      return this.request(["giftProductDetails", e])
        .then((t) => (salla.product.event.giftFetched(t, e), t))
        .catch((t) => {
          throw (salla.product.event.giftFetchFailed(t, e), t);
        });
    }
    getDetails(e, t = []) {
      if (!Array.isArray(t)) {
        let e = "withItems should be array.";
        return (
          salla.product.event.detailFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      if (!e) {
        let e = "productId is not passed.";
        return (
          salla.product.event.detailFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      return this.request(["details", e], { params: { with: t } })
        .then(function (t) {
          return (salla.product.event.detailFetched(t, e), t);
        })
        .catch(function (t) {
          throw (salla.product.event.availabilitySubscribeFailed(t, e), t);
        });
    }
    addProductGiftToCart(e, t, n = !1) {
      return this.request(["productGiftToCart", e], t)
        .then(
          (t) => (
            salla.product.event.addGiftToCartSucceeded(t, e),
            n && (window.location.href = t.redirect),
            t
          ),
        )
        .catch((t) => {
          throw (salla.product.event.addGiftToCartFailed(t, e), t);
        });
    }
    uploadGiftImage(e) {
      return this.request("giftImage", e)
        .then((e) => (salla.product.event.giftImageUploadSucceeded(e), e))
        .catch((e) => {
          throw (salla.product.event.giftImageUploadFailed(e), e);
        });
    }
    fetch(e) {
      if (!e.source) {
        const e = "Source cannot be empty. Please provide one.";
        return (
          salla.product.event.productListFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      const t = !e.source_value,
        n = "string" == typeof e.source_value && "[]" === e.source_value,
        r = Array.isArray(e.source_value) && !e.source_value.length;
      if (
        (t || n || r) &&
        ![
          "offers",
          "latest",
          "sales",
          "wishlist",
          "top-rated",
          "reorder",
        ].includes(e.source)
      ) {
        const e = "Source value cannot be empty. Please provide one.";
        return (
          salla.product.event.productListFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      if (
        ["categories", "brands", "tags", "selected"].includes(e.source) &&
        !Array.isArray(e.source_value)
      ) {
        const e = "SourceValue type error. Expected an array.";
        return (
          salla.product.event.productListFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      if ("search" === e.source && "string" != typeof e.source_value) {
        const e = "SourceValue type error. Expected a string.";
        return (
          salla.product.event.productListFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      if ("related" === e.source && isNaN(e.source_value)) {
        const e = "SourceValue type error. Expected a number.";
        return (
          salla.product.event.productListFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      return this.request(this.endpoints.fetch, { params: e }, "get")
        .then(async function (e) {
          return (salla.product.event.productListFetchSucceeded(e), e);
        })
        .catch((e) => {
          throw (salla.product.event.productListFetchFailed(e), e);
        });
    }
    fetchOptions(e, t = {}) {
      if (!e || 0 === e.length) {
        const e =
          "At least one product ID is required. Please provide a valid list of product IDs.";
        return (
          salla.product.event.productOptionsNotFetched(e),
          salla.api.errorPromise(e)
        );
      }
      const { with: n = [] } = t,
        r = { selected: e };
      return (
        n.length > 0 && (r.with = n),
        this.request(this.endpoints.fetchOptions, { params: r }, "get")
          .then((e) => (salla.product.event.productOptionsFetched(e), e))
          .catch((e) => {
            throw (salla.product.event.productOptionsNotFetched(e), e);
          })
      );
    }
  }
  class Dr extends gr {
    constructor() {
      (super(),
        (this.namespace = "profile"),
        (this.endpoints = {
          info: "auth/user",
          update: "profile/update",
          updateContacts: "profile/contacts/update",
          updateCustomFields: "profile/fields",
          updateSettings: "profile/settings",
          verify: "profile/verify",
          delete: "profile",
        }),
        (this.endpointsMethods = { delete: "delete" }),
        this.after_init());
    }
    syncUserData(e) {
      let t = {
        id: e.id,
        type: "user",
        email: e.email,
        mobile: e.phone.code + e.phone.number,
        country_code: e.phone.country,
        language_code: e.language,
        currency_code: e.currency,
        notifications: e.notifications,
        pending_orders: e.pending_orders,
        avatar: e.avatar,
        first_name: e.first_name,
        last_name: e.last_name,
        is_hidden_name: e.is_hidden_name,
        is_notifiable: e.is_notifiable,
        can_comment: salla.config.get("user.can_comment"),
        fetched_at: Date.now(),
      };
      (salla.config.set("user", t), salla.storage.set("user", t));
    }
    info() {
      return this.request("info", null, "get")
        .then(
          (e) => (
            this.syncUserData(e.data),
            salla.profile.event.infoFetched(e),
            e
          ),
        )
        .catch((e) => {
          throw (salla.profile.event.infoNotFetched(e), e);
        });
    }
    update(e) {
      if (Salla.config.get("store.features", []).includes("sso-login")) {
        const e = "SSO login is enabled. You cannot update your profile.";
        return (Salla.error(e), Promise.reject(new Error(e)));
      }
      return this.request("update", e)
        .then(
          (e) => (this.syncUserData(e.data), salla.profile.event.updated(e), e),
        )
        .catch((e) => {
          throw (salla.event.profile.updateFailed(e), e);
        });
    }
    updateCustomFields(e) {
      if (Salla.config.get("store.features", []).includes("sso-login")) {
        const e = "SSO login is enabled. You cannot update your profile.";
        return (Salla.error(e), Promise.reject(new Error(e)));
      }
      return this.request("updateCustomFields", e)
        .then(
          (e) => (this.syncUserData(e.data), salla.profile.event.updated(e), e),
        )
        .catch((e) => {
          throw (salla.event.profile.updateFailed(e), e);
        });
    }
    updateContacts(e) {
      return this.request("updateContacts", e)
        .then((e) => (salla.profile.event.verificationCodeSent(e), e))
        .catch((e) => {
          throw (salla.event.profile.updateContactsFailed(e), e);
        });
    }
    verify(e) {
      return this.request("verify", e)
        .then((e) => (salla.profile.event.verified(e), e))
        .catch((e) => {
          throw (salla.event.profile.unverified(e), e);
        });
    }
    updateSettings(e) {
      return this.request("updateSettings", e)
        .then((e) => (salla.event.profile.settingsUpdated(e), e))
        .catch((e) => {
          throw (salla.event.profile.updateSettingsFailed(e), e);
        });
    }
    delete() {
      return this.request("delete")
        .then(
          (e) => (
            salla.storage.clearAll(),
            salla.cookie.clearAll(),
            salla.auth.api.appendIframeAndLogout().then(() => {
              (salla.event.profile.deleted(e),
                (window.location.href = salla.url.get("logout")));
            }),
            e
          ),
        )
        .catch((e) => {
          throw (salla.event.profile.notDeleted(e), e);
        });
    }
  }
  class Fr extends gr {
    constructor() {
      (super(),
        (this.namespace = "comment"),
        (this.endpoints = {
          addComment: "{type}/{id}/comments",
          comments: "/comments",
        }),
        this.after_init());
    }
    add(e) {
      var t;
      if (
        (null != (t = e) && t.data && (e = e.data),
        "string" == typeof (e = this.getCommentPayload(e, !0)))
      )
        return (
          salla.event.comment.additionFailed(e),
          salla.api.errorPromise(e)
        );
      if (!e.comment) {
        let e = "can't find comment content!";
        return (
          salla.event.comment.additionFailed(e),
          salla.api.errorPromise(e)
        );
      }
      return this.request(
        ["addComment", "blog" == e.type ? "blogs" : e.type, e.id],
        { comment: e.comment },
      )
        .then(function (t) {
          return (salla.event.comment.added(t, e.id), t);
        })
        .catch(function (t) {
          throw (salla.event.comment.additionFailed(t, e.id), t);
        });
    }
    getCommentPayload(e, t = !1) {
      let n = {};
      if (
        (["id", "type", "comment", "per_page", "page", "sort"].forEach((t) => {
          let r = salla.form.getPossibleValue(e, [t]);
          r && (n[t] = r);
        }),
        !t)
      ) {
        let t = e.ids;
        if (
          (t && (n.ids = Array.isArray(t) ? t : [t]), !n.ids || !n.ids.length)
        )
          return "Failed to get ids!";
      }
      return n.type &&
        ["products", "pages", "product", "page", "blogs", "blog"].includes(
          n.type,
        )
        ? ((n.type += ["product", "page"].includes(n.type) ? "s" : ""), n)
        : "Failed to get type one of:(products, product, page, pages, blog, blogs)!";
    }
    fetchComments(e) {
      if ("string" == typeof (e = this.getCommentPayload(e)))
        return (salla.event.comment.fetchFailed(e), salla.api.errorPromise(e));
      const t = {
        per_page: e.per_page || 5,
        page: e.page || 1,
        type: e.type,
        ids: e.ids,
      };
      return (
        e.sort && (t.sort = e.sort),
        this.request(["comments"], { params: t }, "get")
          .then(function (t) {
            return (salla.event.comment.fetched(t, e), t);
          })
          .catch(function (t) {
            throw (salla.event.comment.fetchFailed(t, e), t);
          })
      );
    }
    getComments(e, t, n = 1, r = 5, i) {
      const o = Array.isArray(t) ? t : [t];
      return this.fetchComments({
        ids: o,
        type: `${e}s`,
        page: n,
        per_page: r,
        sort: i,
      });
    }
  }
  class Sr extends gr {
    constructor() {
      (super(),
        (this.namespace = "currency"),
        (this.endpoints = { change: "/", list: "currencies" }),
        (this.endpointsMethods = { change: "get", list: "get" }),
        (this.webEndpoints = ["change"]),
        this.after_init());
    }
    change(e) {
      if (
        !(e = salla.form.getPossibleValue(e.data || e, ["currency", "code"]))
      ) {
        let e = "Can't find currency code!";
        return (salla.currency.event.failed(e), salla.api.errorPromise(e));
      }
      return this.request("change", {
        params: { change_currency: "", currency: e },
      })
        .then(function (t) {
          return (
            salla.cookie.set("fresh_summary", 1),
            salla.storage.set("cart", ""),
            salla.currency.event.changed(t, e),
            t
          );
        })
        .catch(function (t) {
          throw (salla.currency.event.failed(t, e), t);
        });
    }
    list() {
      return this.request("list")
        .then(function (e) {
          return (salla.currency.event.fetched(e), e);
        })
        .catch(function (e) {
          throw (salla.currency.event.failedToFetch(e), e);
        });
    }
  }
  class _r extends gr {
    constructor() {
      (super(), (this.namespace = "document"));
    }
    reload() {
      window.location.reload();
    }
  }
  class Er extends gr {
    constructor() {
      (super(),
        (this.namespace = "rating"),
        (this.endpoints = {
          store: "rating/store",
          products: "rating/products",
          shipping: "rating/shipping",
          order: "rating/{order_id}",
        }),
        (this.endpointsMethods = { order: "get" }),
        this.after_init());
    }
    order(e) {
      let t = "object" == typeof e ? e : {},
        n = salla.form.getPossibleValue((null == e ? void 0 : e.data) || e, [
          "order_id",
          "id",
        ]);
      if (!n) {
        let e = 'There is no "order_id"!';
        return (
          salla.event.rating.orderNotFetched(e),
          salla.api.errorPromise(e)
        );
      }
      return this.request(["order", n], t)
        .then(function (e) {
          return (salla.event.rating.orderFetched(e, n), e);
        })
        .catch(function (e) {
          throw (salla.event.rating.orderNotFetched(e, n), e);
        });
    }
    store(e) {
      var t;
      if (!(e = (null == (t = e) ? void 0 : t.data) || e)) {
        let e = 'There is no "data"!';
        return (salla.event.rating.storeFailed(e), salla.api.errorPromise(e));
      }
      return this.request("store", e)
        .then(function (t) {
          return (salla.event.rating.storeRated(t, e), t);
        })
        .catch(function (t) {
          throw (salla.event.rating.storeFailed(t, e), t);
        });
    }
    products(e) {
      var t;
      if (!(e = (null == (t = e) ? void 0 : t.data) || e)) {
        let e = 'There is no "data"!';
        return (
          salla.event.rating.productsFailed(e),
          salla.api.errorPromise(e)
        );
      }
      return this.request("products", e)
        .then(function (t) {
          return (salla.event.rating.productsRated(t, e), t);
        })
        .catch(function (t) {
          throw (salla.event.rating.productsFailed(t, e), t);
        });
    }
    shipping(e) {
      var t;
      if (!(e = (null == (t = e) ? void 0 : t.data) || e)) {
        let e = 'There is no "data"!';
        return (
          salla.event.rating.shippingFailed(e),
          salla.api.errorPromise(e)
        );
      }
      return this.request("shipping", e)
        .then(function (t) {
          return (salla.event.rating.shippingRated(t, e), t);
        })
        .catch(function (t) {
          throw (salla.event.rating.shippingFailed(t, e), t);
        });
    }
  }
  class Ar extends gr {
    constructor() {
      (super(),
        (this.namespace = "wishlist"),
        (this.endpoints = {
          add: "products/favorites/{id}",
          remove: "products/favorites/{id}",
        }),
        (this.endpointsMethods = { remove: "delete" }),
        Salla.onReady(() => {
          var e;
          "customer.wishlist" === Salla.config.get("page.slug") &&
            ((null != (e = Salla.storage.getWithTTL("s-utms")) &&
              e["s-utm-source"]) ||
              this.injectSourceIntoRequest());
        }));
    }
    injectSourceIntoRequest() {
      Salla.api.axios.interceptors.request.use(
        (e) => (
          (e.headers = jn({}, e.headers, { "s-utm-source": "wishlist" })),
          e
        ),
        (e) => Promise.reject(e),
      );
    }
    toggle(e) {
      return salla.storage.get("salla::wishlist", []).includes(e)
        ? this.remove(e)
        : this.add(e);
    }
    add(e) {
      var t;
      let n;
      return salla.config.isGuest()
        ? (salla.wishlist.event.additionFailed(
            (n = salla.lang.get("common.messages.must_login")),
          ),
          salla.error(n),
          salla.api.errorPromise(n))
        : (e = salla.form.getPossibleValue(
              (null == (t = e) ? void 0 : t.data) || e,
              ["product_id", "id"],
            ))
          ? this.request(["add", e])
              .then(
                (t) => (
                  this.updateWishlistStorage(e),
                  salla.wishlist.event.added(t, e),
                  t
                ),
              )
              .catch(function (t) {
                throw (salla.wishlist.event.additionFailed(t, e), t);
              })
          : (salla.wishlist.event.additionFailed(
              (n = "Failed to get product id!"),
            ),
            salla.api.errorPromise(n));
    }
    remove(e) {
      var t;
      let n;
      return salla.config.isGuest()
        ? (salla.wishlist.event.additionFailed(
            (n = salla.lang.get("common.messages.must_login")),
          ),
          salla.error(n),
          salla.api.errorPromise(n))
        : (e = salla.form.getPossibleValue(
              (null == (t = e) ? void 0 : t.data) || e,
              ["product_id", "id"],
            ))
          ? this.request(["remove", e])
              .then(
                (t) => (
                  this.updateWishlistStorage(e, !1),
                  salla.wishlist.event.removed(t, e),
                  t
                ),
              )
              .catch(function (t) {
                throw (salla.wishlist.event.removingFailed(t, e), t);
              })
          : (salla.wishlist.event.removingFailed((n = "Failed to get id!")),
            salla.api.errorPromise(n));
    }
    updateWishlistStorage(e, t = !0) {
      let n = salla.storage.get("salla::wishlist", []);
      (t ? n.push(e) : n.splice(n.indexOf(e), 1),
        salla.storage.set("salla::wishlist", n));
    }
  }
  class Cr extends gr {
    constructor() {
      (super(),
        (this.namespace = "scopes"),
        (this.endpoints = {
          get: "scopes",
          change: "scopes",
          getProductAvailability: "scopes/availability?product_id={id}",
        }),
        this.after_init());
    }
    get() {
      return this.request("scopes", null, "get")
        .then((e) => (salla.scope.event.fetched(e), e))
        .catch((e) => {
          throw (salla.scope.event.notFetched(e), e);
        });
    }
    change(e) {
      return this.request("scopes", e)
        .then((e) => (salla.scope.event.changeSucceeded(e), e))
        .catch((e) => {
          throw (salla.scope.event.changeFailed(e), e);
        });
    }
    getProductAvailability(e = null) {
      return this.request(`scopes/availability?product_id=${e}`, null, "get")
        .then((t) => (salla.scope.event.productAvailabilityFetched(t, e), t))
        .catch((e) => {
          throw (salla.scope.event.productAvailabilityNotFetched(e), e);
        });
    }
  }
  class kr extends gr {
    constructor() {
      (super(),
        (this.namespace = "booking"),
        (this.endpoints = { add: "cart/booking/product/{id}" }),
        (this.endpointsMethods = { add: "get" }));
    }
    async add(e, t = !0) {
      if (!e) {
        let e = "Please provide product id.";
        return (
          salla.booking.event.additionFailed(e),
          salla.api.errorPromise(e)
        );
      }
      return this.request(["add", e])
        .then(function (e) {
          return (
            salla.booking.event.added(e),
            t &&
              "booking" === e.data.redirect.to &&
              (window.location.href = e.data.redirect.url),
            e
          );
        })
        .catch(function (e) {
          throw (salla.booking.event.additionFailed(e), e);
        });
    }
  }
  class xr extends gr {
    constructor() {
      (super(),
        (this.namespace = "landing"),
        (this.endpoints = {
          getDetails: "landing/{landing_page_id}",
          createCartFromPage: "landing/{landing_page_id}",
          breadcrumbs: "breadcrumbs",
        }),
        (this.endpointsMethods = { getDetails: "get", breadcrumbs: "get" }),
        this.after_init());
    }
    getDetails(e) {
      if (!e) {
        let e = "page landing id not passed";
        return (
          salla.event.landing.getDetailsFailed(e),
          salla.api.errorPromise(e)
        );
      }
      return this.request(["getDetails", e])
        .then(function (t) {
          return (salla.event.landing.detailsFetched(t, e), t);
        })
        .catch(function (t) {
          throw (salla.event.landing.getDetailsFailed(t, e), t);
        });
    }
    createCartFromPage(e) {
      if (!e) {
        let e = "page landing id not passed";
        return (
          salla.event.landing.orderCreationFailed(e),
          salla.api.errorPromise(e)
        );
      }
      return salla.config.isGuest()
        ? (salla.auth.api.setAfterLoginEvent("landing::createCartFromPage", e),
          salla.event.dispatch("login::open"),
          salla.api.successPromise(""))
        : this.request(["createCartFromPage", e])
            .then(function (t) {
              return (
                salla.event.landing
                  .orderCreated(t, e)
                  .then(() => (location.href = t.data.url)),
                t
              );
            })
            .catch(function (t) {
              throw (salla.event.landing.orderCreationFailed(t, e), t);
            });
    }
    fetchBreadcrumbs(e) {
      if (!e.page) {
        let e =
          "The 'page' parameter is required for the Breadcrumb API. Please provide a valid 'page' parameter.";
        return (
          salla.event.landing.breadcrumbFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      if ("product.single" === e.page && !e.id && !e.parent_id) {
        let e =
          "The 'id' and 'parent_id' parameters are required when the 'page' parameter is set to 'product.single'. Please provide valid values for both parameters.";
        return (
          salla.event.landing.breadcrumbFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      if (
        [
          "product.index",
          "customer.orders.single",
          "product.index.tag",
          "page-single",
          "landing-page",
          "brands.single",
          "blog.single",
          "blog.index.author",
          "blog.index.category",
          "blog.index.tag",
        ].includes(e.page) &&
        !e.id
      ) {
        let t = `The 'id' parameter is required when the 'page' parameter is set to ${e.page}. Please provide valid value for the 'ID' parameter.`;
        return (
          salla.event.landing.breadcrumbFetchFailed(t),
          salla.api.errorPromise(t)
        );
      }
      return this.request("breadcrumbs", { params: e })
        .then(function (e) {
          return (salla.event.landing.breadcrumbFetched(e), e);
        })
        .catch(function (e) {
          throw (salla.event.landing.breadcrumbFetchFailed(e), e);
        });
    }
  }
  class Pr extends gr {
    constructor() {
      (super(),
        (this.namespace = "notifications"),
        (this.endpoints = { fetch: "notifications" }),
        (this.endpointsMethods = { fetch: "get" }),
        this.after_init());
    }
    fetch(e) {
      return this.request(["fetch"], { params: e })
        .then(function (e) {
          return (salla.event.notifications.fetched(e), e);
        })
        .catch(function (e) {
          throw (salla.event.notifications.fetchFailed(e), e);
        });
    }
  }
  function Or(e, t) {
    return function () {
      return e.apply(t, arguments);
    };
  }
  const { toString: Ir } = Object.prototype,
    { getPrototypeOf: jr } = Object,
    { iterator: Tr, toStringTag: Rr } = Symbol,
    Lr =
      ((Br = Object.create(null)),
      (e) => {
        const t = Ir.call(e);
        return Br[t] || (Br[t] = t.slice(8, -1).toLowerCase());
      });
  var Br;
  const Ur = (e) => ((e = e.toLowerCase()), (t) => Lr(t) === e),
    Nr = (e) => (t) => typeof t === e,
    { isArray: qr } = Array,
    zr = Nr("undefined");
  function $r(e) {
    return (
      null !== e &&
      !zr(e) &&
      null !== e.constructor &&
      !zr(e.constructor) &&
      Jr(e.constructor.isBuffer) &&
      e.constructor.isBuffer(e)
    );
  }
  const Mr = Ur("ArrayBuffer");
  const Hr = Nr("string"),
    Jr = Nr("function"),
    Wr = Nr("number"),
    Gr = (e) => null !== e && "object" == typeof e,
    Vr = (e) => {
      if ("object" !== Lr(e)) return !1;
      const t = jr(e);
      return !(
        (null !== t &&
          t !== Object.prototype &&
          null !== Object.getPrototypeOf(t)) ||
        Rr in e ||
        Tr in e
      );
    },
    Kr = Ur("Date"),
    Qr = Ur("File"),
    Xr = Ur("Blob"),
    Yr = Ur("FileList"),
    Zr = Ur("URLSearchParams"),
    [ei, ti, ni, ri] = ["ReadableStream", "Request", "Response", "Headers"].map(
      Ur,
    );
  function ii(e, t, { allOwnKeys: n = !1 } = {}) {
    if (null == e) return;
    let r, i;
    if (("object" != typeof e && (e = [e]), qr(e)))
      for (r = 0, i = e.length; r < i; r++) t.call(null, e[r], r, e);
    else {
      if ($r(e)) return;
      const i = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
        o = i.length;
      let a;
      for (r = 0; r < o; r++) ((a = i[r]), t.call(null, e[a], a, e));
    }
  }
  function oi(e, t) {
    if ($r(e)) return null;
    t = t.toLowerCase();
    const n = Object.keys(e);
    let r,
      i = n.length;
    for (; i-- > 0; ) if (((r = n[i]), t === r.toLowerCase())) return r;
    return null;
  }
  const ai =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof self
          ? self
          : "undefined" != typeof window
            ? window
            : global,
    si = (e) => !zr(e) && e !== ai;
  const li =
    ((ui = "undefined" != typeof Uint8Array && jr(Uint8Array)),
    (e) => ui && e instanceof ui);
  var ui;
  const ci = Ur("HTMLFormElement"),
    di = (
      ({ hasOwnProperty: e }) =>
      (t, n) =>
        e.call(t, n)
    )(Object.prototype),
    hi = Ur("RegExp"),
    pi = (e, t) => {
      const n = Object.getOwnPropertyDescriptors(e),
        r = {};
      (ii(n, (n, i) => {
        let o;
        !1 !== (o = t(n, i, e)) && (r[i] = o || n);
      }),
        Object.defineProperties(e, r));
    };
  const fi = Ur("AsyncFunction"),
    gi =
      ((mi = "function" == typeof setImmediate),
      (vi = Jr(ai.postMessage)),
      mi
        ? setImmediate
        : vi
          ? ((yi = `axios@${Math.random()}`),
            (bi = []),
            ai.addEventListener(
              "message",
              ({ source: e, data: t }) => {
                e === ai && t === yi && bi.length && bi.shift()();
              },
              !1,
            ),
            (e) => {
              (bi.push(e), ai.postMessage(yi, "*"));
            })
          : (e) => setTimeout(e));
  var mi, vi, yi, bi;
  const wi =
    "undefined" != typeof queueMicrotask
      ? queueMicrotask.bind(ai)
      : ("undefined" != typeof process && process.nextTick) || gi;
  var Di = {
    isArray: qr,
    isArrayBuffer: Mr,
    isBuffer: $r,
    isFormData: (e) => {
      let t;
      return (
        e &&
        (("function" == typeof FormData && e instanceof FormData) ||
          (Jr(e.append) &&
            ("formdata" === (t = Lr(e)) ||
              ("object" === t &&
                Jr(e.toString) &&
                "[object FormData]" === e.toString()))))
      );
    },
    isArrayBufferView: function (e) {
      let t;
      return (
        (t =
          "undefined" != typeof ArrayBuffer && ArrayBuffer.isView
            ? ArrayBuffer.isView(e)
            : e && e.buffer && Mr(e.buffer)),
        t
      );
    },
    isString: Hr,
    isNumber: Wr,
    isBoolean: (e) => !0 === e || !1 === e,
    isObject: Gr,
    isPlainObject: Vr,
    isEmptyObject: (e) => {
      if (!Gr(e) || $r(e)) return !1;
      try {
        return (
          0 === Object.keys(e).length &&
          Object.getPrototypeOf(e) === Object.prototype
        );
      } catch (e) {
        return !1;
      }
    },
    isReadableStream: ei,
    isRequest: ti,
    isResponse: ni,
    isHeaders: ri,
    isUndefined: zr,
    isDate: Kr,
    isFile: Qr,
    isBlob: Xr,
    isRegExp: hi,
    isFunction: Jr,
    isStream: (e) => Gr(e) && Jr(e.pipe),
    isURLSearchParams: Zr,
    isTypedArray: li,
    isFileList: Yr,
    forEach: ii,
    merge: function e() {
      const { caseless: t, skipUndefined: n } = (si(this) && this) || {},
        r = {},
        i = (i, o) => {
          const a = (t && oi(r, o)) || o;
          Vr(r[a]) && Vr(i)
            ? (r[a] = e(r[a], i))
            : Vr(i)
              ? (r[a] = e({}, i))
              : qr(i)
                ? (r[a] = i.slice())
                : (n && zr(i)) || (r[a] = i);
        };
      for (let e = 0, t = arguments.length; e < t; e++)
        arguments[e] && ii(arguments[e], i);
      return r;
    },
    extend: (e, t, n, { allOwnKeys: r } = {}) => (
      ii(
        t,
        (t, r) => {
          n && Jr(t)
            ? Object.defineProperty(e, r, {
                value: Or(t, n),
                writable: !0,
                enumerable: !0,
                configurable: !0,
              })
            : Object.defineProperty(e, r, {
                value: t,
                writable: !0,
                enumerable: !0,
                configurable: !0,
              });
        },
        { allOwnKeys: r },
      ),
      e
    ),
    trim: (e) =>
      e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""),
    stripBOM: (e) => (65279 === e.charCodeAt(0) && (e = e.slice(1)), e),
    inherits: (e, t, n, r) => {
      ((e.prototype = Object.create(t.prototype, r)),
        Object.defineProperty(e.prototype, "constructor", {
          value: e,
          writable: !0,
          enumerable: !1,
          configurable: !0,
        }),
        Object.defineProperty(e, "super", { value: t.prototype }),
        n && Object.assign(e.prototype, n));
    },
    toFlatObject: (e, t, n, r) => {
      let i, o, a;
      const s = {};
      if (((t = t || {}), null == e)) return t;
      do {
        for (i = Object.getOwnPropertyNames(e), o = i.length; o-- > 0; )
          ((a = i[o]),
            (r && !r(a, e, t)) || s[a] || ((t[a] = e[a]), (s[a] = !0)));
        e = !1 !== n && jr(e);
      } while (e && (!n || n(e, t)) && e !== Object.prototype);
      return t;
    },
    kindOf: Lr,
    kindOfTest: Ur,
    endsWith: (e, t, n) => {
      ((e = String(e)),
        (void 0 === n || n > e.length) && (n = e.length),
        (n -= t.length));
      const r = e.indexOf(t, n);
      return -1 !== r && r === n;
    },
    toArray: (e) => {
      if (!e) return null;
      if (qr(e)) return e;
      let t = e.length;
      if (!Wr(t)) return null;
      const n = new Array(t);
      for (; t-- > 0; ) n[t] = e[t];
      return n;
    },
    forEachEntry: (e, t) => {
      const n = (e && e[Tr]).call(e);
      let r;
      for (; (r = n.next()) && !r.done; ) {
        const n = r.value;
        t.call(e, n[0], n[1]);
      }
    },
    matchAll: (e, t) => {
      let n;
      const r = [];
      for (; null !== (n = e.exec(t)); ) r.push(n);
      return r;
    },
    isHTMLForm: ci,
    hasOwnProperty: di,
    hasOwnProp: di,
    reduceDescriptors: pi,
    freezeMethods: (e) => {
      pi(e, (t, n) => {
        if (Jr(e) && -1 !== ["arguments", "caller", "callee"].indexOf(n))
          return !1;
        const r = e[n];
        Jr(r) &&
          ((t.enumerable = !1),
          "writable" in t
            ? (t.writable = !1)
            : t.set ||
              (t.set = () => {
                throw Error("Can not rewrite read-only method '" + n + "'");
              }));
      });
    },
    toObjectSet: (e, t) => {
      const n = {},
        r = (e) => {
          e.forEach((e) => {
            n[e] = !0;
          });
        };
      return (qr(e) ? r(e) : r(String(e).split(t)), n);
    },
    toCamelCase: (e) =>
      e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (e, t, n) {
        return t.toUpperCase() + n;
      }),
    noop: () => {},
    toFiniteNumber: (e, t) => (null != e && Number.isFinite((e = +e)) ? e : t),
    findKey: oi,
    global: ai,
    isContextDefined: si,
    isSpecCompliantForm: function (e) {
      return !!(e && Jr(e.append) && "FormData" === e[Rr] && e[Tr]);
    },
    toJSONObject: (e) => {
      const t = new Array(10),
        n = (e, r) => {
          if (Gr(e)) {
            if (t.indexOf(e) >= 0) return;
            if ($r(e)) return e;
            if (!("toJSON" in e)) {
              t[r] = e;
              const i = qr(e) ? [] : {};
              return (
                ii(e, (e, t) => {
                  const o = n(e, r + 1);
                  !zr(o) && (i[t] = o);
                }),
                (t[r] = void 0),
                i
              );
            }
          }
          return e;
        };
      return n(e, 0);
    },
    isAsyncFn: fi,
    isThenable: (e) => e && (Gr(e) || Jr(e)) && Jr(e.then) && Jr(e.catch),
    setImmediate: gi,
    asap: wi,
    isIterable: (e) => null != e && Jr(e[Tr]),
  };
  let Fi = class e extends Error {
    static from(t, n, r, i, o, a) {
      const s = new e(t.message, n || t.code, r, i, o);
      return ((s.cause = t), (s.name = t.name), a && Object.assign(s, a), s);
    }
    constructor(e, t, n, r, i) {
      (super(e),
        (this.name = "AxiosError"),
        (this.isAxiosError = !0),
        t && (this.code = t),
        n && (this.config = n),
        r && (this.request = r),
        i && ((this.response = i), (this.status = i.status)));
    }
    toJSON() {
      return {
        message: this.message,
        name: this.name,
        description: this.description,
        number: this.number,
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        config: Di.toJSONObject(this.config),
        code: this.code,
        status: this.status,
      };
    }
  };
  ((Fi.ERR_BAD_OPTION_VALUE = "ERR_BAD_OPTION_VALUE"),
    (Fi.ERR_BAD_OPTION = "ERR_BAD_OPTION"),
    (Fi.ECONNABORTED = "ECONNABORTED"),
    (Fi.ETIMEDOUT = "ETIMEDOUT"),
    (Fi.ERR_NETWORK = "ERR_NETWORK"),
    (Fi.ERR_FR_TOO_MANY_REDIRECTS = "ERR_FR_TOO_MANY_REDIRECTS"),
    (Fi.ERR_DEPRECATED = "ERR_DEPRECATED"),
    (Fi.ERR_BAD_RESPONSE = "ERR_BAD_RESPONSE"),
    (Fi.ERR_BAD_REQUEST = "ERR_BAD_REQUEST"),
    (Fi.ERR_CANCELED = "ERR_CANCELED"),
    (Fi.ERR_NOT_SUPPORT = "ERR_NOT_SUPPORT"),
    (Fi.ERR_INVALID_URL = "ERR_INVALID_URL"));
  function Si(e) {
    return Di.isPlainObject(e) || Di.isArray(e);
  }
  function _i(e) {
    return Di.endsWith(e, "[]") ? e.slice(0, -2) : e;
  }
  function Ei(e, t, n) {
    return e
      ? e
          .concat(t)
          .map(function (e, t) {
            return ((e = _i(e)), !n && t ? "[" + e + "]" : e);
          })
          .join(n ? "." : "")
      : t;
  }
  const Ai = Di.toFlatObject(Di, {}, null, function (e) {
    return /^is[A-Z]/.test(e);
  });
  function Ci(e, t, n) {
    if (!Di.isObject(e)) throw new TypeError("target must be an object");
    t = t || new FormData();
    const r = (n = Di.toFlatObject(
        n,
        { metaTokens: !0, dots: !1, indexes: !1 },
        !1,
        function (e, t) {
          return !Di.isUndefined(t[e]);
        },
      )).metaTokens,
      i = n.visitor || u,
      o = n.dots,
      a = n.indexes,
      s =
        (n.Blob || ("undefined" != typeof Blob && Blob)) &&
        Di.isSpecCompliantForm(t);
    if (!Di.isFunction(i)) throw new TypeError("visitor must be a function");
    function l(e) {
      if (null === e) return "";
      if (Di.isDate(e)) return e.toISOString();
      if (Di.isBoolean(e)) return e.toString();
      if (!s && Di.isBlob(e))
        throw new Fi("Blob is not supported. Use a Buffer instead.");
      return Di.isArrayBuffer(e) || Di.isTypedArray(e)
        ? s && "function" == typeof Blob
          ? new Blob([e])
          : Buffer.from(e)
        : e;
    }
    function u(e, n, i) {
      let s = e;
      if (e && !i && "object" == typeof e)
        if (Di.endsWith(n, "{}"))
          ((n = r ? n : n.slice(0, -2)), (e = JSON.stringify(e)));
        else if (
          (Di.isArray(e) &&
            (function (e) {
              return Di.isArray(e) && !e.some(Si);
            })(e)) ||
          ((Di.isFileList(e) || Di.endsWith(n, "[]")) && (s = Di.toArray(e)))
        )
          return (
            (n = _i(n)),
            s.forEach(function (e, r) {
              !Di.isUndefined(e) &&
                null !== e &&
                t.append(
                  !0 === a ? Ei([n], r, o) : null === a ? n : n + "[]",
                  l(e),
                );
            }),
            !1
          );
      return !!Si(e) || (t.append(Ei(i, n, o), l(e)), !1);
    }
    const c = [],
      d = Object.assign(Ai, {
        defaultVisitor: u,
        convertValue: l,
        isVisitable: Si,
      });
    if (!Di.isObject(e)) throw new TypeError("data must be an object");
    return (
      (function e(n, r) {
        if (!Di.isUndefined(n)) {
          if (-1 !== c.indexOf(n))
            throw Error("Circular reference detected in " + r.join("."));
          (c.push(n),
            Di.forEach(n, function (n, o) {
              !0 ===
                (!(Di.isUndefined(n) || null === n) &&
                  i.call(t, n, Di.isString(o) ? o.trim() : o, r, d)) &&
                e(n, r ? r.concat(o) : [o]);
            }),
            c.pop());
        }
      })(e),
      t
    );
  }
  function ki(e) {
    const t = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0",
    };
    return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (e) {
      return t[e];
    });
  }
  function xi(e, t) {
    ((this._pairs = []), e && Ci(e, this, t));
  }
  const Pi = xi.prototype;
  function Oi(e) {
    return encodeURIComponent(e)
      .replace(/%3A/gi, ":")
      .replace(/%24/g, "$")
      .replace(/%2C/gi, ",")
      .replace(/%20/g, "+");
  }
  function Ii(e, t, n) {
    if (!t) return e;
    const r = (n && n.encode) || Oi,
      i = Di.isFunction(n) ? { serialize: n } : n,
      o = i && i.serialize;
    let a;
    if (
      ((a = o
        ? o(t, i)
        : Di.isURLSearchParams(t)
          ? t.toString()
          : new xi(t, i).toString(r)),
      a)
    ) {
      const t = e.indexOf("#");
      (-1 !== t && (e = e.slice(0, t)),
        (e += (-1 === e.indexOf("?") ? "?" : "&") + a));
    }
    return e;
  }
  ((Pi.append = function (e, t) {
    this._pairs.push([e, t]);
  }),
    (Pi.toString = function (e) {
      const t = e
        ? function (t) {
            return e.call(this, t, ki);
          }
        : ki;
      return this._pairs
        .map(function (e) {
          return t(e[0]) + "=" + t(e[1]);
        }, "")
        .join("&");
    }));
  class ji {
    constructor() {
      this.handlers = [];
    }
    use(e, t, n) {
      return (
        this.handlers.push({
          fulfilled: e,
          rejected: t,
          synchronous: !!n && n.synchronous,
          runWhen: n ? n.runWhen : null,
        }),
        this.handlers.length - 1
      );
    }
    eject(e) {
      this.handlers[e] && (this.handlers[e] = null);
    }
    clear() {
      this.handlers && (this.handlers = []);
    }
    forEach(e) {
      Di.forEach(this.handlers, function (t) {
        null !== t && e(t);
      });
    }
  }
  var Ti = {
      silentJSONParsing: !0,
      forcedJSONParsing: !0,
      clarifyTimeoutError: !1,
    },
    Ri = {
      isBrowser: !0,
      classes: {
        URLSearchParams:
          "undefined" != typeof URLSearchParams ? URLSearchParams : xi,
        FormData: "undefined" != typeof FormData ? FormData : null,
        Blob: "undefined" != typeof Blob ? Blob : null,
      },
      protocols: ["http", "https", "file", "blob", "url", "data"],
    };
  const Li = "undefined" != typeof window && "undefined" != typeof document,
    Bi = ("object" == typeof navigator && navigator) || void 0,
    Ui =
      Li &&
      (!Bi || ["ReactNative", "NativeScript", "NS"].indexOf(Bi.product) < 0),
    Ni =
      "undefined" != typeof WorkerGlobalScope &&
      self instanceof WorkerGlobalScope &&
      "function" == typeof self.importScripts,
    qi = (Li && window.location.href) || "http://localhost";
  var zi = jn(
    {},
    Object.freeze({
      __proto__: null,
      hasBrowserEnv: Li,
      hasStandardBrowserEnv: Ui,
      hasStandardBrowserWebWorkerEnv: Ni,
      navigator: Bi,
      origin: qi,
    }),
    Ri,
  );
  function $i(e) {
    function t(e, n, r, i) {
      let o = e[i++];
      if ("__proto__" === o) return !0;
      const a = Number.isFinite(+o),
        s = i >= e.length;
      if (((o = !o && Di.isArray(r) ? r.length : o), s))
        return (Di.hasOwnProp(r, o) ? (r[o] = [r[o], n]) : (r[o] = n), !a);
      (r[o] && Di.isObject(r[o])) || (r[o] = []);
      return (
        t(e, n, r[o], i) &&
          Di.isArray(r[o]) &&
          (r[o] = (function (e) {
            const t = {},
              n = Object.keys(e);
            let r;
            const i = n.length;
            let o;
            for (r = 0; r < i; r++) ((o = n[r]), (t[o] = e[o]));
            return t;
          })(r[o])),
        !a
      );
    }
    if (Di.isFormData(e) && Di.isFunction(e.entries)) {
      const n = {};
      return (
        Di.forEachEntry(e, (e, r) => {
          t(
            (function (e) {
              return Di.matchAll(/\w+|\[(\w*)]/g, e).map((e) =>
                "[]" === e[0] ? "" : e[1] || e[0],
              );
            })(e),
            r,
            n,
            0,
          );
        }),
        n
      );
    }
    return null;
  }
  const Mi = {
    transitional: Ti,
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [
      function (e, t) {
        const n = t.getContentType() || "",
          r = n.indexOf("application/json") > -1,
          i = Di.isObject(e);
        i && Di.isHTMLForm(e) && (e = new FormData(e));
        if (Di.isFormData(e)) return r ? JSON.stringify($i(e)) : e;
        if (
          Di.isArrayBuffer(e) ||
          Di.isBuffer(e) ||
          Di.isStream(e) ||
          Di.isFile(e) ||
          Di.isBlob(e) ||
          Di.isReadableStream(e)
        )
          return e;
        if (Di.isArrayBufferView(e)) return e.buffer;
        if (Di.isURLSearchParams(e))
          return (
            t.setContentType(
              "application/x-www-form-urlencoded;charset=utf-8",
              !1,
            ),
            e.toString()
          );
        let o;
        if (i) {
          if (n.indexOf("application/x-www-form-urlencoded") > -1)
            return (function (e, t) {
              return Ci(
                e,
                new zi.classes.URLSearchParams(),
                jn(
                  {
                    visitor: function (e, t, n, r) {
                      return zi.isNode && Di.isBuffer(e)
                        ? (this.append(t, e.toString("base64")), !1)
                        : r.defaultVisitor.apply(this, arguments);
                    },
                  },
                  t,
                ),
              );
            })(e, this.formSerializer).toString();
          if ((o = Di.isFileList(e)) || n.indexOf("multipart/form-data") > -1) {
            const t = this.env && this.env.FormData;
            return Ci(
              o ? { "files[]": e } : e,
              t && new t(),
              this.formSerializer,
            );
          }
        }
        return i || r
          ? (t.setContentType("application/json", !1),
            (function (e, t, n) {
              if (Di.isString(e))
                try {
                  return ((t || JSON.parse)(e), Di.trim(e));
                } catch (e) {
                  if ("SyntaxError" !== e.name) throw e;
                }
              return (n || JSON.stringify)(e);
            })(e))
          : e;
      },
    ],
    transformResponse: [
      function (e) {
        const t = this.transitional || Mi.transitional,
          n = t && t.forcedJSONParsing,
          r = "json" === this.responseType;
        if (Di.isResponse(e) || Di.isReadableStream(e)) return e;
        if (e && Di.isString(e) && ((n && !this.responseType) || r)) {
          const n = !(t && t.silentJSONParsing) && r;
          try {
            return JSON.parse(e, this.parseReviver);
          } catch (e) {
            if (n) {
              if ("SyntaxError" === e.name)
                throw Fi.from(
                  e,
                  Fi.ERR_BAD_RESPONSE,
                  this,
                  null,
                  this.response,
                );
              throw e;
            }
          }
        }
        return e;
      },
    ],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: { FormData: zi.classes.FormData, Blob: zi.classes.Blob },
    validateStatus: function (e) {
      return e >= 200 && e < 300;
    },
    headers: {
      common: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": void 0,
      },
    },
  };
  Di.forEach(["delete", "get", "head", "post", "put", "patch"], (e) => {
    Mi.headers[e] = {};
  });
  const Hi = Di.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent",
  ]);
  const Ji = Symbol("internals");
  function Wi(e) {
    return e && String(e).trim().toLowerCase();
  }
  function Gi(e) {
    return !1 === e || null == e ? e : Di.isArray(e) ? e.map(Gi) : String(e);
  }
  function Vi(e, t, n, r, i) {
    return Di.isFunction(r)
      ? r.call(this, t, n)
      : (i && (t = n),
        Di.isString(t)
          ? Di.isString(r)
            ? -1 !== t.indexOf(r)
            : Di.isRegExp(r)
              ? r.test(t)
              : void 0
          : void 0);
  }
  let Ki = class {
    constructor(e) {
      e && this.set(e);
    }
    set(e, t, n) {
      const r = this;
      function i(e, t, n) {
        const i = Wi(t);
        if (!i) throw new Error("header name must be a non-empty string");
        const o = Di.findKey(r, i);
        (!o || void 0 === r[o] || !0 === n || (void 0 === n && !1 !== r[o])) &&
          (r[o || t] = Gi(e));
      }
      const o = (e, t) => Di.forEach(e, (e, n) => i(e, n, t));
      if (Di.isPlainObject(e) || e instanceof this.constructor) o(e, t);
      else if (
        Di.isString(e) &&
        (e = e.trim()) &&
        !/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim())
      )
        o(
          ((e) => {
            const t = {};
            let n, r, i;
            return (
              e &&
                e.split("\n").forEach(function (e) {
                  ((i = e.indexOf(":")),
                    (n = e.substring(0, i).trim().toLowerCase()),
                    (r = e.substring(i + 1).trim()),
                    !n ||
                      (t[n] && Hi[n]) ||
                      ("set-cookie" === n
                        ? t[n]
                          ? t[n].push(r)
                          : (t[n] = [r])
                        : (t[n] = t[n] ? t[n] + ", " + r : r)));
                }),
              t
            );
          })(e),
          t,
        );
      else if (Di.isObject(e) && Di.isIterable(e)) {
        let n,
          r,
          i = {};
        for (const t of e) {
          if (!Di.isArray(t))
            throw TypeError("Object iterator must return a key-value pair");
          i[(r = t[0])] = (n = i[r])
            ? Di.isArray(n)
              ? [...n, t[1]]
              : [n, t[1]]
            : t[1];
        }
        o(i, t);
      } else null != e && i(t, e, n);
      return this;
    }
    get(e, t) {
      if ((e = Wi(e))) {
        const n = Di.findKey(this, e);
        if (n) {
          const e = this[n];
          if (!t) return e;
          if (!0 === t)
            return (function (e) {
              const t = Object.create(null),
                n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
              let r;
              for (; (r = n.exec(e)); ) t[r[1]] = r[2];
              return t;
            })(e);
          if (Di.isFunction(t)) return t.call(this, e, n);
          if (Di.isRegExp(t)) return t.exec(e);
          throw new TypeError("parser must be boolean|regexp|function");
        }
      }
    }
    has(e, t) {
      if ((e = Wi(e))) {
        const n = Di.findKey(this, e);
        return !(!n || void 0 === this[n] || (t && !Vi(0, this[n], n, t)));
      }
      return !1;
    }
    delete(e, t) {
      const n = this;
      let r = !1;
      function i(e) {
        if ((e = Wi(e))) {
          const i = Di.findKey(n, e);
          !i || (t && !Vi(0, n[i], i, t)) || (delete n[i], (r = !0));
        }
      }
      return (Di.isArray(e) ? e.forEach(i) : i(e), r);
    }
    clear(e) {
      const t = Object.keys(this);
      let n = t.length,
        r = !1;
      for (; n--; ) {
        const i = t[n];
        (e && !Vi(0, this[i], i, e, !0)) || (delete this[i], (r = !0));
      }
      return r;
    }
    normalize(e) {
      const t = this,
        n = {};
      return (
        Di.forEach(this, (r, i) => {
          const o = Di.findKey(n, i);
          if (o) return ((t[o] = Gi(r)), void delete t[i]);
          const a = e
            ? (function (e) {
                return e
                  .trim()
                  .toLowerCase()
                  .replace(/([a-z\d])(\w*)/g, (e, t, n) => t.toUpperCase() + n);
              })(i)
            : String(i).trim();
          (a !== i && delete t[i], (t[a] = Gi(r)), (n[a] = !0));
        }),
        this
      );
    }
    concat(...e) {
      return this.constructor.concat(this, ...e);
    }
    toJSON(e) {
      const t = Object.create(null);
      return (
        Di.forEach(this, (n, r) => {
          null != n &&
            !1 !== n &&
            (t[r] = e && Di.isArray(n) ? n.join(", ") : n);
        }),
        t
      );
    }
    [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
      return Object.entries(this.toJSON())
        .map(([e, t]) => e + ": " + t)
        .join("\n");
    }
    getSetCookie() {
      return this.get("set-cookie") || [];
    }
    get [Symbol.toStringTag]() {
      return "AxiosHeaders";
    }
    static from(e) {
      return e instanceof this ? e : new this(e);
    }
    static concat(e, ...t) {
      const n = new this(e);
      return (t.forEach((e) => n.set(e)), n);
    }
    static accessor(e) {
      const t = (this[Ji] = this[Ji] = { accessors: {} }).accessors,
        n = this.prototype;
      function r(e) {
        const r = Wi(e);
        t[r] ||
          (!(function (e, t) {
            const n = Di.toCamelCase(" " + t);
            ["get", "set", "has"].forEach((r) => {
              Object.defineProperty(e, r + n, {
                value: function (e, n, i) {
                  return this[r].call(this, t, e, n, i);
                },
                configurable: !0,
              });
            });
          })(n, e),
          (t[r] = !0));
      }
      return (Di.isArray(e) ? e.forEach(r) : r(e), this);
    }
  };
  function Qi(e, t) {
    const n = this || Mi,
      r = t || n,
      i = Ki.from(r.headers);
    let o = r.data;
    return (
      Di.forEach(e, function (e) {
        o = e.call(n, o, i.normalize(), t ? t.status : void 0);
      }),
      i.normalize(),
      o
    );
  }
  function Xi(e) {
    return !(!e || !e.__CANCEL__);
  }
  (Ki.accessor([
    "Content-Type",
    "Content-Length",
    "Accept",
    "Accept-Encoding",
    "User-Agent",
    "Authorization",
  ]),
    Di.reduceDescriptors(Ki.prototype, ({ value: e }, t) => {
      let n = t[0].toUpperCase() + t.slice(1);
      return {
        get: () => e,
        set(e) {
          this[n] = e;
        },
      };
    }),
    Di.freezeMethods(Ki));
  let Yi = class extends Fi {
    constructor(e, t, n) {
      (super(null == e ? "canceled" : e, Fi.ERR_CANCELED, t, n),
        (this.name = "CanceledError"),
        (this.__CANCEL__ = !0));
    }
  };
  function Zi(e, t, n) {
    const r = n.config.validateStatus;
    n.status && r && !r(n.status)
      ? t(
          new Fi(
            "Request failed with status code " + n.status,
            [Fi.ERR_BAD_REQUEST, Fi.ERR_BAD_RESPONSE][
              Math.floor(n.status / 100) - 4
            ],
            n.config,
            n.request,
            n,
          ),
        )
      : e(n);
  }
  const eo = (e, t, n = 3) => {
      let r = 0;
      const i = (function (e, t) {
        e = e || 10;
        const n = new Array(e),
          r = new Array(e);
        let i,
          o = 0,
          a = 0;
        return (
          (t = void 0 !== t ? t : 1e3),
          function (s) {
            const l = Date.now(),
              u = r[a];
            (i || (i = l), (n[o] = s), (r[o] = l));
            let c = a,
              d = 0;
            for (; c !== o; ) ((d += n[c++]), (c %= e));
            if (((o = (o + 1) % e), o === a && (a = (a + 1) % e), l - i < t))
              return;
            const h = u && l - u;
            return h ? Math.round((1e3 * d) / h) : void 0;
          }
        );
      })(50, 250);
      return (function (e, t) {
        let n,
          r,
          i = 0,
          o = 1e3 / t;
        const a = (t, o = Date.now()) => {
          ((i = o), (n = null), r && (clearTimeout(r), (r = null)), e(...t));
        };
        return [
          (...e) => {
            const t = Date.now(),
              s = t - i;
            s >= o
              ? a(e, t)
              : ((n = e),
                r ||
                  (r = setTimeout(() => {
                    ((r = null), a(n));
                  }, o - s)));
          },
          () => n && a(n),
        ];
      })((n) => {
        const o = n.loaded,
          a = n.lengthComputable ? n.total : void 0,
          s = o - r,
          l = i(s);
        r = o;
        e({
          loaded: o,
          total: a,
          progress: a ? o / a : void 0,
          bytes: s,
          rate: l || void 0,
          estimated: l && a && o <= a ? (a - o) / l : void 0,
          event: n,
          lengthComputable: null != a,
          [t ? "download" : "upload"]: !0,
        });
      }, n);
    },
    to = (e, t) => {
      const n = null != e;
      return [(r) => t[0]({ lengthComputable: n, total: e, loaded: r }), t[1]];
    },
    no =
      (e) =>
      (...t) =>
        Di.asap(() => e(...t));
  var ro = zi.hasStandardBrowserEnv
      ? ((e, t) => (n) => (
          (n = new URL(n, zi.origin)),
          e.protocol === n.protocol &&
            e.host === n.host &&
            (t || e.port === n.port)
        ))(
          new URL(zi.origin),
          zi.navigator && /(msie|trident)/i.test(zi.navigator.userAgent),
        )
      : () => !0,
    io = zi.hasStandardBrowserEnv
      ? {
          write(e, t, n, r, i, o, a) {
            if ("undefined" == typeof document) return;
            const s = [`${e}=${encodeURIComponent(t)}`];
            (Di.isNumber(n) && s.push(`expires=${new Date(n).toUTCString()}`),
              Di.isString(r) && s.push(`path=${r}`),
              Di.isString(i) && s.push(`domain=${i}`),
              !0 === o && s.push("secure"),
              Di.isString(a) && s.push(`SameSite=${a}`),
              (document.cookie = s.join("; ")));
          },
          read(e) {
            if ("undefined" == typeof document) return null;
            const t = document.cookie.match(
              new RegExp("(?:^|; )" + e + "=([^;]*)"),
            );
            return t ? decodeURIComponent(t[1]) : null;
          },
          remove(e) {
            this.write(e, "", Date.now() - 864e5, "/");
          },
        }
      : { write() {}, read: () => null, remove() {} };
  function oo(e, t, n) {
    let r = !/^([a-z][a-z\d+\-.]*:)?\/\//i.test(t);
    return e && (r || 0 == n)
      ? (function (e, t) {
          return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e;
        })(e, t)
      : t;
  }
  const ao = (e) => (e instanceof Ki ? jn({}, e) : e);
  function so(e, t) {
    t = t || {};
    const n = {};
    function r(e, t, n, r) {
      return Di.isPlainObject(e) && Di.isPlainObject(t)
        ? Di.merge.call({ caseless: r }, e, t)
        : Di.isPlainObject(t)
          ? Di.merge({}, t)
          : Di.isArray(t)
            ? t.slice()
            : t;
    }
    function i(e, t, n, i) {
      return Di.isUndefined(t)
        ? Di.isUndefined(e)
          ? void 0
          : r(void 0, e, 0, i)
        : r(e, t, 0, i);
    }
    function o(e, t) {
      if (!Di.isUndefined(t)) return r(void 0, t);
    }
    function a(e, t) {
      return Di.isUndefined(t)
        ? Di.isUndefined(e)
          ? void 0
          : r(void 0, e)
        : r(void 0, t);
    }
    function s(n, i, o) {
      return o in t ? r(n, i) : o in e ? r(void 0, n) : void 0;
    }
    const l = {
      url: o,
      method: o,
      data: o,
      baseURL: a,
      transformRequest: a,
      transformResponse: a,
      paramsSerializer: a,
      timeout: a,
      timeoutMessage: a,
      withCredentials: a,
      withXSRFToken: a,
      adapter: a,
      responseType: a,
      xsrfCookieName: a,
      xsrfHeaderName: a,
      onUploadProgress: a,
      onDownloadProgress: a,
      decompress: a,
      maxContentLength: a,
      maxBodyLength: a,
      beforeRedirect: a,
      transport: a,
      httpAgent: a,
      httpsAgent: a,
      cancelToken: a,
      socketPath: a,
      responseEncoding: a,
      validateStatus: s,
      headers: (e, t, n) => i(ao(e), ao(t), 0, !0),
    };
    return (
      Di.forEach(Object.keys(jn({}, e, t)), function (r) {
        const o = l[r] || i,
          a = o(e[r], t[r], r);
        (Di.isUndefined(a) && o !== s) || (n[r] = a);
      }),
      n
    );
  }
  var lo = (e) => {
    const t = so({}, e);
    let {
      data: n,
      withXSRFToken: r,
      xsrfHeaderName: i,
      xsrfCookieName: o,
      headers: a,
      auth: s,
    } = t;
    if (
      ((t.headers = a = Ki.from(a)),
      (t.url = Ii(
        oo(t.baseURL, t.url, t.allowAbsoluteUrls),
        e.params,
        e.paramsSerializer,
      )),
      s &&
        a.set(
          "Authorization",
          "Basic " +
            btoa(
              (s.username || "") +
                ":" +
                (s.password ? unescape(encodeURIComponent(s.password)) : ""),
            ),
        ),
      Di.isFormData(n))
    )
      if (zi.hasStandardBrowserEnv || zi.hasStandardBrowserWebWorkerEnv)
        a.setContentType(void 0);
      else if (Di.isFunction(n.getHeaders)) {
        const e = n.getHeaders(),
          t = ["content-type", "content-length"];
        Object.entries(e).forEach(([e, n]) => {
          t.includes(e.toLowerCase()) && a.set(e, n);
        });
      }
    if (
      zi.hasStandardBrowserEnv &&
      (r && Di.isFunction(r) && (r = r(t)), r || (!1 !== r && ro(t.url)))
    ) {
      const e = i && o && io.read(o);
      e && a.set(i, e);
    }
    return t;
  };
  var uo =
    "undefined" != typeof XMLHttpRequest &&
    function (e) {
      return new Promise(function (t, n) {
        const r = lo(e);
        let i = r.data;
        const o = Ki.from(r.headers).normalize();
        let a,
          s,
          l,
          u,
          c,
          { responseType: d, onUploadProgress: h, onDownloadProgress: p } = r;
        function f() {
          (u && u(),
            c && c(),
            r.cancelToken && r.cancelToken.unsubscribe(a),
            r.signal && r.signal.removeEventListener("abort", a));
        }
        let g = new XMLHttpRequest();
        function m() {
          if (!g) return;
          const r = Ki.from(
            "getAllResponseHeaders" in g && g.getAllResponseHeaders(),
          );
          (Zi(
            function (e) {
              (t(e), f());
            },
            function (e) {
              (n(e), f());
            },
            {
              data:
                d && "text" !== d && "json" !== d ? g.response : g.responseText,
              status: g.status,
              statusText: g.statusText,
              headers: r,
              config: e,
              request: g,
            },
          ),
            (g = null));
        }
        (g.open(r.method.toUpperCase(), r.url, !0),
          (g.timeout = r.timeout),
          "onloadend" in g
            ? (g.onloadend = m)
            : (g.onreadystatechange = function () {
                g &&
                  4 === g.readyState &&
                  (0 !== g.status ||
                    (g.responseURL && 0 === g.responseURL.indexOf("file:"))) &&
                  setTimeout(m);
              }),
          (g.onabort = function () {
            g &&
              (n(new Fi("Request aborted", Fi.ECONNABORTED, e, g)), (g = null));
          }),
          (g.onerror = function (t) {
            const r = t && t.message ? t.message : "Network Error",
              i = new Fi(r, Fi.ERR_NETWORK, e, g);
            ((i.event = t || null), n(i), (g = null));
          }),
          (g.ontimeout = function () {
            let t = r.timeout
              ? "timeout of " + r.timeout + "ms exceeded"
              : "timeout exceeded";
            const i = r.transitional || Ti;
            (r.timeoutErrorMessage && (t = r.timeoutErrorMessage),
              n(
                new Fi(
                  t,
                  i.clarifyTimeoutError ? Fi.ETIMEDOUT : Fi.ECONNABORTED,
                  e,
                  g,
                ),
              ),
              (g = null));
          }),
          void 0 === i && o.setContentType(null),
          "setRequestHeader" in g &&
            Di.forEach(o.toJSON(), function (e, t) {
              g.setRequestHeader(t, e);
            }),
          Di.isUndefined(r.withCredentials) ||
            (g.withCredentials = !!r.withCredentials),
          d && "json" !== d && (g.responseType = r.responseType),
          p && (([l, c] = eo(p, !0)), g.addEventListener("progress", l)),
          h &&
            g.upload &&
            (([s, u] = eo(h)),
            g.upload.addEventListener("progress", s),
            g.upload.addEventListener("loadend", u)),
          (r.cancelToken || r.signal) &&
            ((a = (t) => {
              g &&
                (n(!t || t.type ? new Yi(null, e, g) : t),
                g.abort(),
                (g = null));
            }),
            r.cancelToken && r.cancelToken.subscribe(a),
            r.signal &&
              (r.signal.aborted
                ? a()
                : r.signal.addEventListener("abort", a))));
        const v = (function (e) {
          const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
          return (t && t[1]) || "";
        })(r.url);
        v && -1 === zi.protocols.indexOf(v)
          ? n(new Fi("Unsupported protocol " + v + ":", Fi.ERR_BAD_REQUEST, e))
          : g.send(i || null);
      });
    };
  const co = (e, t) => {
      const { length: n } = (e = e ? e.filter(Boolean) : []);
      if (t || n) {
        let n,
          r = new AbortController();
        const i = function (e) {
          if (!n) {
            ((n = !0), a());
            const t = e instanceof Error ? e : this.reason;
            r.abort(
              t instanceof Fi ? t : new Yi(t instanceof Error ? t.message : t),
            );
          }
        };
        let o =
          t &&
          setTimeout(() => {
            ((o = null), i(new Fi(`timeout of ${t}ms exceeded`, Fi.ETIMEDOUT)));
          }, t);
        const a = () => {
          e &&
            (o && clearTimeout(o),
            (o = null),
            e.forEach((e) => {
              e.unsubscribe
                ? e.unsubscribe(i)
                : e.removeEventListener("abort", i);
            }),
            (e = null));
        };
        e.forEach((e) => e.addEventListener("abort", i));
        const { signal: s } = r;
        return ((s.unsubscribe = () => Di.asap(a)), s);
      }
    },
    ho = function* (e, t) {
      let n = e.byteLength;
      if (!t || n < t) return void (yield e);
      let r,
        i = 0;
      for (; i < n; ) ((r = i + t), yield e.slice(i, r), (i = r));
    },
    po =
      ((fo = Tn(function* (e, t) {
        var n,
          r = !1,
          i = !1;
        try {
          for (
            var o, a = Pn(go(e));
            (r = !(o = yield In(a.next())).done);
            r = !1
          ) {
            const e = o.value;
            yield* xn(Pn(ho(e, t)));
          }
        } catch (e) {
          ((i = !0), (n = e));
        } finally {
          try {
            r && null != a.return && (yield In(a.return()));
          } finally {
            if (i) throw n;
          }
        }
      })),
      function (e, t) {
        return fo.apply(this, arguments);
      });
  var fo;
  const go =
    ((mo = Tn(function* (e) {
      if (e[Symbol.asyncIterator]) return void (yield* xn(Pn(e)));
      const t = e.getReader();
      try {
        for (;;) {
          const { done: e, value: n } = yield In(t.read());
          if (e) break;
          yield n;
        }
      } finally {
        yield In(t.cancel());
      }
    })),
    function (e) {
      return mo.apply(this, arguments);
    });
  var mo;
  const vo = (e, t, n, r) => {
      const i = po(e, t);
      let o,
        a = 0,
        s = (e) => {
          o || ((o = !0), r && r(e));
        };
      return new ReadableStream(
        {
          async pull(e) {
            try {
              const { done: t, value: r } = await i.next();
              if (t) return (s(), void e.close());
              let o = r.byteLength;
              if (n) {
                let e = (a += o);
                n(e);
              }
              e.enqueue(new Uint8Array(r));
            } catch (e) {
              throw (s(e), e);
            }
          },
          cancel: (e) => (s(e), i.return()),
        },
        { highWaterMark: 2 },
      );
    },
    { isFunction: yo } = Di,
    bo = (({ Request: e, Response: t }) => ({ Request: e, Response: t }))(
      Di.global,
    ),
    { ReadableStream: wo, TextEncoder: Do } = Di.global,
    Fo = (e, ...t) => {
      try {
        return !!e(...t);
      } catch (e) {
        return !1;
      }
    },
    So = (e) => {
      e = Di.merge.call({ skipUndefined: !0 }, bo, e);
      const { fetch: t, Request: n, Response: r } = e,
        i = t ? yo(t) : "function" == typeof fetch,
        o = yo(n),
        a = yo(r);
      if (!i) return !1;
      const s = i && yo(wo),
        l =
          i &&
          ("function" == typeof Do
            ? ((u = new Do()), (e) => u.encode(e))
            : async (e) => new Uint8Array(await new n(e).arrayBuffer()));
      var u;
      const c =
          o &&
          s &&
          Fo(() => {
            let e = !1;
            const t = new n(zi.origin, {
              body: new wo(),
              method: "POST",
              get duplex() {
                return ((e = !0), "half");
              },
            }).headers.has("Content-Type");
            return e && !t;
          }),
        d = a && s && Fo(() => Di.isReadableStream(new r("").body)),
        h = { stream: d && ((e) => e.body) };
      i &&
        ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((e) => {
          !h[e] &&
            (h[e] = (t, n) => {
              let r = t && t[e];
              if (r) return r.call(t);
              throw new Fi(
                `Response type '${e}' is not supported`,
                Fi.ERR_NOT_SUPPORT,
                n,
              );
            });
        });
      const p = async (e, t) => {
        const r = Di.toFiniteNumber(e.getContentLength());
        return null == r
          ? (async (e) => {
              if (null == e) return 0;
              if (Di.isBlob(e)) return e.size;
              if (Di.isSpecCompliantForm(e)) {
                const t = new n(zi.origin, { method: "POST", body: e });
                return (await t.arrayBuffer()).byteLength;
              }
              return Di.isArrayBufferView(e) || Di.isArrayBuffer(e)
                ? e.byteLength
                : (Di.isURLSearchParams(e) && (e += ""),
                  Di.isString(e) ? (await l(e)).byteLength : void 0);
            })(t)
          : r;
      };
      return async (e) => {
        let {
            url: i,
            method: a,
            data: s,
            signal: l,
            cancelToken: u,
            timeout: f,
            onDownloadProgress: g,
            onUploadProgress: m,
            responseType: v,
            headers: y,
            withCredentials: b = "same-origin",
            fetchOptions: w,
          } = lo(e),
          D = t || fetch;
        v = v ? (v + "").toLowerCase() : "text";
        let F = co([l, u && u.toAbortSignal()], f),
          S = null;
        const _ =
          F &&
          F.unsubscribe &&
          (() => {
            F.unsubscribe();
          });
        let E;
        try {
          if (
            m &&
            c &&
            "get" !== a &&
            "head" !== a &&
            0 !== (E = await p(y, s))
          ) {
            let e,
              t = new n(i, { method: "POST", body: s, duplex: "half" });
            if (
              (Di.isFormData(s) &&
                (e = t.headers.get("content-type")) &&
                y.setContentType(e),
              t.body)
            ) {
              const [e, n] = to(E, eo(no(m)));
              s = vo(t.body, 65536, e, n);
            }
          }
          Di.isString(b) || (b = b ? "include" : "omit");
          const t = o && "credentials" in n.prototype,
            l = jn({}, w, {
              signal: F,
              method: a.toUpperCase(),
              headers: y.normalize().toJSON(),
              body: s,
              duplex: "half",
              credentials: t ? b : void 0,
            });
          S = o && new n(i, l);
          let u = await (o ? D(S, w) : D(i, l));
          const f = d && ("stream" === v || "response" === v);
          if (d && (g || (f && _))) {
            const e = {};
            ["status", "statusText", "headers"].forEach((t) => {
              e[t] = u[t];
            });
            const t = Di.toFiniteNumber(u.headers.get("content-length")),
              [n, i] = (g && to(t, eo(no(g), !0))) || [];
            u = new r(
              vo(u.body, 65536, n, () => {
                (i && i(), _ && _());
              }),
              e,
            );
          }
          v = v || "text";
          let A = await h[Di.findKey(h, v) || "text"](u, e);
          return (
            !f && _ && _(),
            await new Promise((t, n) => {
              Zi(t, n, {
                data: A,
                headers: Ki.from(u.headers),
                status: u.status,
                statusText: u.statusText,
                config: e,
                request: S,
              });
            })
          );
        } catch (t) {
          if (
            (_ && _(),
            t && "TypeError" === t.name && /Load failed|fetch/i.test(t.message))
          )
            throw Object.assign(new Fi("Network Error", Fi.ERR_NETWORK, e, S), {
              cause: t.cause || t,
            });
          throw Fi.from(t, t && t.code, e, S);
        }
      };
    },
    _o = new Map(),
    Eo = (e) => {
      let t = (e && e.env) || {};
      const { fetch: n, Request: r, Response: i } = t,
        o = [r, i, n];
      let a,
        s,
        l = o.length,
        u = _o;
      for (; l--; )
        ((a = o[l]),
          (s = u.get(a)),
          void 0 === s && u.set(a, (s = l ? new Map() : So(t))),
          (u = s));
      return s;
    };
  Eo();
  const Ao = { http: null, xhr: uo, fetch: { get: Eo } };
  Di.forEach(Ao, (e, t) => {
    if (e) {
      try {
        Object.defineProperty(e, "name", { value: t });
      } catch (e) {}
      Object.defineProperty(e, "adapterName", { value: t });
    }
  });
  const Co = (e) => `- ${e}`,
    ko = (e) => Di.isFunction(e) || null === e || !1 === e;
  var xo = {
    getAdapter: function (e, t) {
      e = Di.isArray(e) ? e : [e];
      const { length: n } = e;
      let r, i;
      const o = {};
      for (let a = 0; a < n; a++) {
        let n;
        if (
          ((r = e[a]),
          (i = r),
          !ko(r) && ((i = Ao[(n = String(r)).toLowerCase()]), void 0 === i))
        )
          throw new Fi(`Unknown adapter '${n}'`);
        if (i && (Di.isFunction(i) || (i = i.get(t)))) break;
        o[n || "#" + a] = i;
      }
      if (!i) {
        const e = Object.entries(o).map(
          ([e, t]) =>
            `adapter ${e} ` +
            (!1 === t
              ? "is not supported by the environment"
              : "is not available in the build"),
        );
        let t = n
          ? e.length > 1
            ? "since :\n" + e.map(Co).join("\n")
            : " " + Co(e[0])
          : "as no adapter specified";
        throw new Fi(
          "There is no suitable adapter to dispatch the request " + t,
          "ERR_NOT_SUPPORT",
        );
      }
      return i;
    },
    adapters: Ao,
  };
  function Po(e) {
    if (
      (e.cancelToken && e.cancelToken.throwIfRequested(),
      e.signal && e.signal.aborted)
    )
      throw new Yi(null, e);
  }
  function Oo(e) {
    (Po(e),
      (e.headers = Ki.from(e.headers)),
      (e.data = Qi.call(e, e.transformRequest)),
      -1 !== ["post", "put", "patch"].indexOf(e.method) &&
        e.headers.setContentType("application/x-www-form-urlencoded", !1));
    return xo
      .getAdapter(
        e.adapter || Mi.adapter,
        e,
      )(e)
      .then(
        function (t) {
          return (
            Po(e),
            (t.data = Qi.call(e, e.transformResponse, t)),
            (t.headers = Ki.from(t.headers)),
            t
          );
        },
        function (t) {
          return (
            Xi(t) ||
              (Po(e),
              t &&
                t.response &&
                ((t.response.data = Qi.call(
                  e,
                  e.transformResponse,
                  t.response,
                )),
                (t.response.headers = Ki.from(t.response.headers)))),
            Promise.reject(t)
          );
        },
      );
  }
  const Io = "1.13.3",
    jo = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach(
    (e, t) => {
      jo[e] = function (n) {
        return typeof n === e || "a" + (t < 1 ? "n " : " ") + e;
      };
    },
  );
  const To = {};
  ((jo.transitional = function (e, t, n) {
    function r(e, t) {
      return (
        "[Axios v" +
        Io +
        "] Transitional option '" +
        e +
        "'" +
        t +
        (n ? ". " + n : "")
      );
    }
    return (n, i, o) => {
      if (!1 === e)
        throw new Fi(
          r(i, " has been removed" + (t ? " in " + t : "")),
          Fi.ERR_DEPRECATED,
        );
      return (
        t &&
          !To[i] &&
          ((To[i] = !0),
          console.warn(
            r(
              i,
              " has been deprecated since v" +
                t +
                " and will be removed in the near future",
            ),
          )),
        !e || e(n, i, o)
      );
    };
  }),
    (jo.spelling = function (e) {
      return (t, n) => (
        console.warn(`${n} is likely a misspelling of ${e}`),
        !0
      );
    }));
  var Ro = {
    assertOptions: function (e, t, n) {
      if ("object" != typeof e)
        throw new Fi("options must be an object", Fi.ERR_BAD_OPTION_VALUE);
      const r = Object.keys(e);
      let i = r.length;
      for (; i-- > 0; ) {
        const o = r[i],
          a = t[o];
        if (a) {
          const t = e[o],
            n = void 0 === t || a(t, o, e);
          if (!0 !== n)
            throw new Fi(
              "option " + o + " must be " + n,
              Fi.ERR_BAD_OPTION_VALUE,
            );
        } else if (!0 !== n)
          throw new Fi("Unknown option " + o, Fi.ERR_BAD_OPTION);
      }
    },
    validators: jo,
  };
  const Lo = Ro.validators;
  let Bo = class {
    constructor(e) {
      ((this.defaults = e || {}),
        (this.interceptors = { request: new ji(), response: new ji() }));
    }
    async request(e, t) {
      try {
        return await this._request(e, t);
      } catch (e) {
        if (e instanceof Error) {
          let t = {};
          Error.captureStackTrace
            ? Error.captureStackTrace(t)
            : (t = new Error());
          const n = t.stack ? t.stack.replace(/^.+\n/, "") : "";
          try {
            e.stack
              ? n &&
                !String(e.stack).endsWith(n.replace(/^.+\n.+\n/, "")) &&
                (e.stack += "\n" + n)
              : (e.stack = n);
          } catch (e) {}
        }
        throw e;
      }
    }
    _request(e, t) {
      ("string" == typeof e ? ((t = t || {}).url = e) : (t = e || {}),
        (t = so(this.defaults, t)));
      const { transitional: n, paramsSerializer: r, headers: i } = t;
      (void 0 !== n &&
        Ro.assertOptions(
          n,
          {
            silentJSONParsing: Lo.transitional(Lo.boolean),
            forcedJSONParsing: Lo.transitional(Lo.boolean),
            clarifyTimeoutError: Lo.transitional(Lo.boolean),
          },
          !1,
        ),
        null != r &&
          (Di.isFunction(r)
            ? (t.paramsSerializer = { serialize: r })
            : Ro.assertOptions(
                r,
                { encode: Lo.function, serialize: Lo.function },
                !0,
              )),
        void 0 !== t.allowAbsoluteUrls ||
          (void 0 !== this.defaults.allowAbsoluteUrls
            ? (t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls)
            : (t.allowAbsoluteUrls = !0)),
        Ro.assertOptions(
          t,
          {
            baseUrl: Lo.spelling("baseURL"),
            withXsrfToken: Lo.spelling("withXSRFToken"),
          },
          !0,
        ),
        (t.method = (t.method || this.defaults.method || "get").toLowerCase()));
      let o = i && Di.merge(i.common, i[t.method]);
      (i &&
        Di.forEach(
          ["delete", "get", "head", "post", "put", "patch", "common"],
          (e) => {
            delete i[e];
          },
        ),
        (t.headers = Ki.concat(o, i)));
      const a = [];
      let s = !0;
      this.interceptors.request.forEach(function (e) {
        ("function" == typeof e.runWhen && !1 === e.runWhen(t)) ||
          ((s = s && e.synchronous), a.unshift(e.fulfilled, e.rejected));
      });
      const l = [];
      let u;
      this.interceptors.response.forEach(function (e) {
        l.push(e.fulfilled, e.rejected);
      });
      let c,
        d = 0;
      if (!s) {
        const e = [Oo.bind(this), void 0];
        (e.unshift(...a),
          e.push(...l),
          (c = e.length),
          (u = Promise.resolve(t)));
        let n = t;
        for (; d < c; )
          u = u
            .then(e[d++])
            .then((e) => {
              n = void 0 !== e ? e : n;
            })
            .catch(e[d++])
            .then(() => n);
        return u;
      }
      c = a.length;
      let h = t;
      for (; d < c; ) {
        const e = a[d++],
          t = a[d++];
        try {
          h = e(h);
        } catch (e) {
          t.call(this, e);
          break;
        }
      }
      try {
        u = Oo.call(this, h);
      } catch (e) {
        return Promise.reject(e);
      }
      for (d = 0, c = l.length; d < c; ) u = u.then(l[d++]).catch(l[d++]);
      return u;
    }
    getUri(e) {
      return Ii(
        oo((e = so(this.defaults, e)).baseURL, e.url, e.allowAbsoluteUrls),
        e.params,
        e.paramsSerializer,
      );
    }
  };
  (Di.forEach(["delete", "get", "head", "options"], function (e) {
    Bo.prototype[e] = function (t, n) {
      return this.request(
        so(n || {}, { method: e, url: t, data: (n || {}).data }),
      );
    };
  }),
    Di.forEach(["post", "put", "patch"], function (e) {
      function t(t) {
        return function (n, r, i) {
          return this.request(
            so(i || {}, {
              method: e,
              headers: t ? { "Content-Type": "multipart/form-data" } : {},
              url: n,
              data: r,
            }),
          );
        };
      }
      ((Bo.prototype[e] = t()), (Bo.prototype[e + "Form"] = t(!0)));
    }));
  const Uo = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
    WebServerIsDown: 521,
    ConnectionTimedOut: 522,
    OriginIsUnreachable: 523,
    TimeoutOccurred: 524,
    SslHandshakeFailed: 525,
    InvalidSslCertificate: 526,
  };
  Object.entries(Uo).forEach(([e, t]) => {
    Uo[t] = e;
  });
  const No = (function e(t) {
    const n = new Bo(t),
      r = Or(Bo.prototype.request, n);
    return (
      Di.extend(r, Bo.prototype, n, { allOwnKeys: !0 }),
      Di.extend(r, n, null, { allOwnKeys: !0 }),
      (r.create = function (n) {
        return e(so(t, n));
      }),
      r
    );
  })(Mi);
  ((No.Axios = Bo),
    (No.CanceledError = Yi),
    (No.CancelToken = class e {
      constructor(e) {
        if ("function" != typeof e)
          throw new TypeError("executor must be a function.");
        let t;
        this.promise = new Promise(function (e) {
          t = e;
        });
        const n = this;
        (this.promise.then((e) => {
          if (!n._listeners) return;
          let t = n._listeners.length;
          for (; t-- > 0; ) n._listeners[t](e);
          n._listeners = null;
        }),
          (this.promise.then = (e) => {
            let t;
            const r = new Promise((e) => {
              (n.subscribe(e), (t = e));
            }).then(e);
            return (
              (r.cancel = function () {
                n.unsubscribe(t);
              }),
              r
            );
          }),
          e(function (e, r, i) {
            n.reason || ((n.reason = new Yi(e, r, i)), t(n.reason));
          }));
      }
      throwIfRequested() {
        if (this.reason) throw this.reason;
      }
      subscribe(e) {
        this.reason
          ? e(this.reason)
          : this._listeners
            ? this._listeners.push(e)
            : (this._listeners = [e]);
      }
      unsubscribe(e) {
        if (!this._listeners) return;
        const t = this._listeners.indexOf(e);
        -1 !== t && this._listeners.splice(t, 1);
      }
      toAbortSignal() {
        const e = new AbortController(),
          t = (t) => {
            e.abort(t);
          };
        return (
          this.subscribe(t),
          (e.signal.unsubscribe = () => this.unsubscribe(t)),
          e.signal
        );
      }
      static source() {
        let t;
        const n = new e(function (e) {
          t = e;
        });
        return { token: n, cancel: t };
      }
    }),
    (No.isCancel = Xi),
    (No.VERSION = Io),
    (No.toFormData = Ci),
    (No.AxiosError = Fi),
    (No.Cancel = No.CanceledError),
    (No.all = function (e) {
      return Promise.all(e);
    }),
    (No.spread = function (e) {
      return function (t) {
        return e.apply(null, t);
      };
    }),
    (No.isAxiosError = function (e) {
      return Di.isObject(e) && !0 === e.isAxiosError;
    }),
    (No.mergeConfig = so),
    (No.AxiosHeaders = Ki),
    (No.formToJSON = (e) => $i(Di.isHTMLForm(e) ? new FormData(e) : e)),
    (No.getAdapter = xo.getAdapter),
    (No.HttpStatusCode = Uo),
    (No.default = No));
  const {
    Axios: qo,
    AxiosError: zo,
    CanceledError: $o,
    isCancel: Mo,
    CancelToken: Ho,
    VERSION: Jo,
    all: Wo,
    Cancel: Go,
    isAxiosError: Vo,
    spread: Ko,
    toFormData: Qo,
    AxiosHeaders: Xo,
    HttpStatusCode: Yo,
    formToJSON: Zo,
    getAdapter: ea,
    mergeConfig: ta,
  } = No;
  class na extends Error {}
  function ra(e) {
    let t = e.replace(/-/g, "+").replace(/_/g, "/");
    switch (t.length % 4) {
      case 0:
        break;
      case 2:
        t += "==";
        break;
      case 3:
        t += "=";
        break;
      default:
        throw new Error("base64 string is not of the correct length");
    }
    try {
      return (function (e) {
        return decodeURIComponent(
          atob(e).replace(/(.)/g, (e, t) => {
            let n = t.charCodeAt(0).toString(16).toUpperCase();
            return (n.length < 2 && (n = "0" + n), "%" + n);
          }),
        );
      })(t);
    } catch (e) {
      return atob(t);
    }
  }
  na.prototype.name = "InvalidTokenError";
  class ia {
    constructor() {
      var e,
        t = this;
      ((this.inIframe = salla.helpers.isIframe()),
        salla.event.on("twilight::before.ready", async function (e) {
          return await t.initiateRequest(e);
        }),
        salla.event.on("profile::info.fetched", (e) =>
          this.setCurrencyAndLanguage(e),
        ),
        salla.event.on("auth::token.fetched", (e) => {
          (salla.storage.set("token", e),
            this.inIframe && salla.log("token fetched iframe"),
            this.inIframe && salla.cookie.set("s-token", e, 60),
            this.setToken(e));
        }),
        salla.event.on("auth::token.invalid", () => {
          (salla.storage.remove("user"), salla.storage.remove("token"));
        }),
        (this.notifier_handler_disabled = !1),
        (this.axios = No.create({
          baseURL: Salla.config.get("store.api", Salla.config.get("store.url")),
          headers: {
            common: {
              "X-Requested-With": "XMLHttpRequest",
              "S-SOURCE": "twilight",
              "S-APP-VERSION":
                (null == (e = Salla) || null == (e = e.versions)
                  ? void 0
                  : e.twilight) || "2.0.0",
              "S-APP-OS": "browser",
              "cache-control": "no-cache",
            },
          },
        })),
        this.axios.interceptors.request.use(
          (e) => {
            "preview" === Salla.config.get("theme.mode") &&
              (e.url = Salla.url.addParamToUrl("use_username_url", 1, e.url));
            try {
              var t;
              const n = Salla.config.get("swoole", []),
                r = new RegExp(n.join("|"), "i");
              n.length > 0 &&
                r.test(e.url) &&
                (e.headers["s-store-api-version"] = "swoole");
              const i =
                null == (t = Salla.analytics) ? void 0 : t.getAnonymousId();
              i && (e.headers["s-anonymous-id"] = i);
            } catch (e) {
              Salla.log("Error in request interceptor:", e);
            }
            return e;
          },
          (e) => Promise.reject(e),
        ));
    }
    getHeaders() {
      let e = jn({}, this.axios.defaults.headers.common);
      return (delete e["Content-Type"], e);
    }
    getHeader(e) {
      var t;
      return null ==
        (t = Object.entries(this.getHeaders()).filter(
          ([t]) => t.toLowerCase() === e.toLowerCase(),
        )[0])
        ? void 0
        : t[1];
    }
    setHeaders(e) {
      return (
        Object.entries(e).forEach((e) => this.setHeader(e[0], e[1])),
        this
      );
    }
    setHeader(e, t) {
      return (
        (salla.infiniteScroll.fetchOptions.headers[e] =
          this.axios.defaults.headers.common[e] =
            t),
        this
      );
    }
    async withoutNotifier(e) {
      return (
        (this.notifier_handler_disabled = !0),
        await e().finally(() => {
          this.notifier_handler_disabled = !1;
        })
      );
    }
    async initiateRequest(e) {
      var t, n, r;
      ((this.axios.defaults.baseURL = Salla.config.get(
        "store.api",
        Salla.config.get("store.url"),
      )),
        this.setHeaders(
          jn(
            {
              "Store-Identifier": Salla.config.get("store.id"),
              currency:
                (null == (t = e.user) ? void 0 : t.currency_code) || "SAR",
              "accept-language": salla.lang.getLocale(),
              "s-user-id": null == (n = e.user) ? void 0 : n.id,
              "s-country": null == (r = e.user) ? void 0 : r.country_code,
            },
            e.headers || {},
          ),
        ));
      const i = Salla.config.get("store.scope", Salla.storage.get("scope")),
        o = new URLSearchParams(window.location.search).get("scope");
      (o &&
        i &&
        !Salla.url.is_page("cart") &&
        ((i.id = o), Salla.storage.set("scope", i), Salla.cart.reset()),
        i && this.setHeaders({ "s-scope-type": i.type, "s-scope-id": i.id }));
      const a = Salla.storage.getWithTTL("s-utms");
      if (a) {
        const e = {};
        (Object.entries(a).forEach(([t, n]) => {
          e[t] =
            "string" == typeof n && /[^\x00-\x7F]/.test(n)
              ? encodeURIComponent(n)
              : n;
        }),
          this.setHeaders(e));
      }
      (await this.injectTokenToTheRequests(e),
        Salla.storage.get("affiliate_code") &&
          this.setHeader(
            "s-affiliate-code",
            Salla.storage.get("affiliate_code"),
          ));
    }
    async injectTokenToTheRequests(e) {
      var t,
        n,
        r = this;
      let i,
        o,
        a = this.getToken(),
        s = "guest" === (null == (t = e.user) ? void 0 : t.type),
        l = parseInt((null == (n = e.user) ? void 0 : n.id) || 0),
        u = parseInt(salla.storage.get("user.id") || 0),
        c = salla.auth.api.isSessionless(),
        d = (e) => {
          (this.setToken(e), salla.event.emit("api::initiated"));
        },
        h = async function () {
          s || c || !l
            ? salla.auth.event.tokenInvalid()
            : (salla.log(
                "Api:: case 1 => current is is guest & web session available",
              ),
              await salla.auth.api
                .refresh()
                .then(async function () {
                  await salla.profile.info();
                })
                .catch(() => salla.auth.event.tokenInvalid()));
        };
      if (!a)
        return (
          salla.log("Api:: case 1 => current is is guest"),
          void (await h())
        );
      try {
        i = (function (e, t) {
          if ("string" != typeof e)
            throw new na("Invalid token specified: must be a string");
          t || (t = {});
          const n = !0 === t.header ? 0 : 1,
            r = e.split(".")[n];
          if ("string" != typeof r)
            throw new na(`Invalid token specified: missing part #${n + 1}`);
          let i;
          try {
            i = ra(r);
          } catch (e) {
            throw new na(
              `Invalid token specified: invalid base64 for part #${n + 1} (${e.message})`,
            );
          }
          try {
            return JSON.parse(i);
          } catch (e) {
            throw new na(
              `Invalid token specified: invalid json for part #${n + 1} (${e.message})`,
            );
          }
        })(a);
      } catch (e) {
        return (
          Salla.logger.warn("Failed to decode JWT token", e),
          void Salla.auth.event.tokenInvalid()
        );
      }
      return Date.now() / 1e3 > i.exp
        ? (salla.log(
            "Api:: case 2 => current user is logged-in and there is a token, but it's expired",
          ),
          void (await h()))
        : ((o = c
            ? parseInt(i.sub) !== u
            : !u || !l || u !== l || parseInt(i.sub) !== l),
          o
            ? (salla.log(
                "Api:: case 3 => there is a token and user in session/local missing or mismatch",
              ),
              salla.log(
                `sub:${i.sub} userIdInWeb:${l} userIdInStorage:${u}, isSessionless:${c}`,
                i.sub,
                l,
                u,
              ),
              this.setHeader("Authorization", "Bearer " + a),
              void (await salla.profile
                .info()
                .then(async function (e) {
                  (!r.inIframe &&
                    !c &&
                    (await salla.auth.api.request("auth/jwt", {
                      callerName: "salla.auth.request.injectTokenToTheRequests",
                    })),
                    d(a));
                })
                .catch(() => {
                  (salla.log("Api:: case 3 => failed get fresh profile"),
                    this.setHeader("Authorization", null),
                    salla.auth.event.tokenInvalid());
                })))
            : (salla.log(
                "Api:: case 4 => current user is logged-in and there is a token, and it's not expired",
              ),
              void d(a)));
    }
    setToken(e) {
      return (
        this.setHeader("Authorization", "Bearer " + e),
        salla.event.emit("api::token.injected", e),
        (this.token = e),
        this
      );
    }
    cleanupTokenFromUrl() {
      try {
        const e = new URL(window.location.href);
        if (!e.searchParams.has("token")) return;
        (e.searchParams.delete("token"),
          window.history.replaceState({}, document.title, e.toString()));
      } catch (e) {
        Salla.logger.warn("Failed to cleanup token from URL", e);
      }
    }
    setCurrencyAndLanguage(e) {
      return this.setHeaders({
        currency: e.data.currency,
        "accept-language": e.data.language,
      });
    }
    request(e, t = void 0, n = "get", r = {}) {
      let i = { endPoint: e, payload: t, method: n, options: r },
        o = "undefined" != typeof event ? event.currentTarget : null,
        a = !1;
      return (
        "SALLA-BUTTON" === (null == o ? void 0 : o.tagName) && (a = !0),
        a && (null == o || o.load()),
        this.axios[i.method](i.endPoint, i.payload, i.options)
          .then(
            (e) => (
              a && (null == o || o.stop()),
              e.data && e.request && (e = e.data),
              this.handleAfterResponseActions(e),
              e
            ),
          )
          .catch((e) => {
            throw (
              a && (null == o || o.stop()),
              salla.event.document.requestFailed(i, e),
              this.handleErrorResponse(e),
              e
            );
          })
      );
    }
    handleAfterResponseActions(e) {
      if (!e) return;
      let { data: t, googleTags: n = null } = e,
        r = t && t.googleTags ? t.googleTags : n;
      try {
        dataLayer && r && dataLayer.push(r);
      } catch (e) {
        salla.logger.error(e.message);
      }
      (this.fireEventsForResponse(e), this.showAlert(e));
    }
    fireEventsForResponse(e) {
      var t, n;
      let r =
        (null == e ? void 0 : e.events) ||
        (null == (t = e.data) ? void 0 : t.events) ||
        (null == (n = e.error) ? void 0 : n.events);
      ("string" == typeof r && (r = JSON.parse(r)),
        r && Object.keys(r).forEach((e) => salla.event.dispatch(e, r[e])));
    }
    handleErrorResponse(e) {
      if (e.response && e.response.data)
        return e.response.data.error &&
          e.response.data.error.fields &&
          !this.notifier_handler_disabled
          ? this.handleInvalidFields(e)
          : this.handleAfterResponseActions(e.response.data);
    }
    showAlert(e) {
      var t, n;
      if (e && !this.notifier_handler_disabled)
        return e.case && e.msg
          ? salla.notify.fire(e.msg, e.case, e)
          : e.hasOwnProperty("success") && null != (t = e.data) && t.message
            ? salla.notify.fire(
                null == (n = e.data) ? void 0 : n.message,
                e.success
                  ? salla.notify.types.success
                  : salla.notify.types.error,
                e,
              )
            : e.error && e.error.message && "FORBIDDEN" !== e.error.message
              ? salla.error(e.error.message, e)
              : void 0;
    }
    handleInvalidFields(e) {
      let t = e.response.data.error.fields,
        n = [];
      Object.keys(t).forEach((e) => {
        let r = t[e];
        Array.isArray(r) ? r.forEach((e) => n.push(e)) : n.push(r);
      });
      let r = (n.length > 1 ? "* " : "") + n.join("\n* ");
      salla.error(r, e);
    }
    isFastRequestsAllowed() {
      return Salla.config.get("fastRequests");
    }
    promise(e, t = !0) {
      return new Promise((n, r) => (t ? n(e) : r(e)));
    }
    errorPromise(e) {
      return this.promise(e, !1);
    }
    successPromise(e) {
      return this.promise(e, !0);
    }
    getToken() {
      if (Salla.storage.get("token")) return Salla.storage.get("token");
      try {
        var e;
        const t =
          null == (e = new URLSearchParams(window.location.search))
            ? void 0
            : e.get("token");
        if (!t) return;
        if (3 !== t.split(".").length) return;
        return (this.cleanupTokenFromUrl(), t);
      } catch (e) {
        Salla.logger.warn("Failed to extract or validate token from URL", e);
      }
    }
  }
  class oa extends gr {
    constructor() {
      (super(),
        (this.namespace = "component"),
        (this.endpoints = {
          getMenus: "menus/{headOrFoot}?store_id={store}&lang={lang}",
          reviews: "reviews",
        }),
        (this.endpointsMethods = { getMenus: "get", reviews: "get" }));
    }
    async getMenus(e = "header") {
      return this.request([
        "getMenus",
        e,
        salla.config.get("store.id"),
        salla.lang.getLocale(),
      ])
        .then(function (e) {
          return (salla.event.component.menuFetched(e), e);
        })
        .catch(function (e) {
          throw (salla.event.component.menuFetchFailed(e), e);
        });
    }
    async getReviews({ per_page: e = 5, type: t = "all", items: n }) {
      if (!t) {
        const e = "Review type cannot be empty. Please provide one.";
        return (
          salla.event.component.reviewsFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      const r =
        !n ||
        ("string" == typeof n && "[]" === n) ||
        (Array.isArray(n) && !n.length);
      if (!new Set(["all", "store", "categories", "products", "json"]).has(t)) {
        const e = "Invalid review type. Please provide a valid type.";
        return (
          salla.event.component.reviewsFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      if ("all" !== t && "store" !== t && r) {
        const e = "Items cannot be empty. Please provide one.";
        return (
          salla.event.component.reviewsFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      if (new Set(["products", "categories"]).has(t) && !Array.isArray(n)) {
        const e = `Items value must be an array of ${t} id for review type of ${t}.`;
        return (
          salla.event.component.reviewsFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      return this.request(
        ["reviews"],
        { params: { per_page: e, type: t, items: n } },
        "get",
      )
        .then(function (e) {
          return (salla.event.component.reviewsFetched(e), e);
        })
        .catch(function (e) {
          throw (salla.event.component.reviewsFetchFailed(e), e);
        });
    }
  }
  class aa extends gr {
    constructor() {
      (super(),
        (this.namespace = "booking"),
        (this.endpoints = { fetch: "advertisements" }),
        (this.endpointsMethods = { fetch: "get" }));
    }
    async fetch(e = null) {
      const t = e ? { page: e } : {};
      return this.request(["fetch"], { params: t })
        .then(function (e) {
          return (salla.event.advertisement.fetched(e), e);
        })
        .catch(function (e) {
          throw (salla.event.advertisement.fetchFailed(e), e);
        });
    }
  }
  class sa extends gr {
    constructor() {
      (super(),
        (this.namespace = "navigation"),
        (this.endpoints = { breadcrumbs: "breadcrumbs" }),
        (this.endpointsMethods = { breadcrumbs: "get" }),
        this.after_init());
    }
    fetchBreadcrumbs(e) {
      if (!e.page) {
        let e =
          "The 'page' parameter is required for the Breadcrumb API. Please provide a valid 'page' parameter.";
        return (
          salla.event.navigation.breadcrumbFetchFailed(e),
          salla.api.errorPromise(e)
        );
      }
      if (
        [
          "product.single",
          "product.index",
          "customer.orders.single",
          "product.index.tag",
          "page-single",
          "landing-page",
          "brands.single",
          "blog.single",
          "blog.index.author",
          "blog.index.category",
          "blog.index.tag",
        ].includes(e.page) &&
        !e.id
      ) {
        let t = `The 'id' parameter is required when the 'page' parameter is set to ${e.page}. Please provide valid value for the 'ID' parameter.`;
        return (
          salla.event.navigation.breadcrumbFetchFailed(t),
          salla.api.errorPromise(t)
        );
      }
      return this.request("breadcrumbs", { params: e })
        .then(function (e) {
          return (salla.event.navigation.breadcrumbFetched(e), e);
        })
        .catch(function (e) {
          throw (salla.event.navigation.breadcrumbFetchFailed(e), e);
        });
    }
  }
  class la extends gr {
    constructor() {
      (super(),
        (this.namespace = "metadata"),
        (this.endpoints = {
          fetchValues: "https://api.salla.dev/store/v1/metadata/values",
        }),
        (this.endpointsMethods = { fetchValues: "get" }));
    }
    async fetchValues(e, t) {
      if (!e || !t) {
        const e = "Please provide entity type and entity ids.";
        return (
          salla.metadata.event.valueNotFetch(e),
          salla.api.errorPromise(e)
        );
      }
      const n = { type: e, entities: Array.isArray(t) ? t : [t] };
      return this.request(this.endpoints.fetchValues, { params: n }, "get")
        .then((e) => (salla.metadata.event.valueFetched(e), e))
        .catch((e) => {
          throw (salla.metadata.event.valueNotFetch(e), e);
        });
    }
  }
  class ua {
    constructor(e) {
      ((this.config = e),
        (this.configKey = "s-twilight-config"),
        (this.tempUser = e.user));
    }
    async getConfig() {
      if (Object.entries(this.config.store).length > 2) return this.config;
      let e = await this.getConfigFromSession();
      return (
        e || (e = await this.getConfigFromApi()),
        (e.user = this.tempUser),
        e
      );
    }
    async getConfigFromSession() {
      var e;
      let t = salla.storage.getWithTTL("session", this.configKey);
      return t && "object" == typeof t && null != (e = t.store) && e.id
        ? this.config.store.id == t.store.id
          ? t
          : (salla.storage.session.remove(this.configKey), null)
        : null;
    }
    getConfigFromApi() {
      console.log("getting Twilight initiate config using store.id ...");
      const e = new URL(
        `${(this.config.store.api || Salla.config.get("store.api")).replace(/\/$/, "")}/store/settings`,
      );
      return fetch(e, { headers: Salla.api.getHeaders() })
        .then((e) => e.json())
        .then((e) => {
          if (200 !== e.status) throw { response: e };
          return this.setConfigToSession(e.data);
        })
        .catch((e) => {
          throw (Salla.api.handleErrorResponse(e), e);
        });
    }
    setConfigToSession(e) {
      return (Salla.storage.setWithTTL("session", this.configKey, e, 1800), e);
    }
  }
  class ca {
    constructor() {
      Salla.event.on("twilight::before.ready", () => this.renderAll());
    }
    async renderAll() {
      (await Salla.lang.onLoaded(),
        this.renderAppInstall(),
        this.renderEdit(),
        this.applyContentCopyright(),
        this.renderTemplateStore(),
        Salla.hooks.renderAutoComponents([
          {
            hook: "body:end",
            tag: "salla-cookies-bar",
            canRender: () => {
              var e;
              return null == (e = Salla.config.get("store.features"))
                ? void 0
                : e.includes("website-cookies");
            },
          },
        ]),
        Salla.helpers.isIframe() ||
          (this.renderMaintenance(), this.renderThemePreview()));
    }
    renderMaintenance() {
      Salla.config.get("maintenance") &&
        (document.body.classList.add("has-maintenance-bar"),
        document.querySelector("salla-maintenance-alert")
          ? Salla.logger.warn("salla-maintenance-alert element Existed before!")
          : document.body.prepend(
              document.createElement("salla-maintenance-alert"),
            ));
    }
    renderTemplateStore() {
      Salla.config.get("store.template") &&
        (document.body.classList.add("has-bottom-alert"),
        document.querySelector("salla-bottom-alert")
          ? Salla.logger.warn("salla-bottom-alert element Existed before!")
          : document.body.append(document.createElement("salla-bottom-alert")));
    }
    renderAppInstall() {
      Salla.config.get("store.app_install_prompt") &&
        Salla.config.get("store.apps") &&
        !Salla.storage.get("app_install_prompt_disabled") &&
        !Salla.config.isMobileApp() &&
        (document.body.classList.add("has-app-install-alert"),
        document.querySelector("salla-app-install-alert")
          ? Salla.logger.warn("salla-app-install-alert element Existed before!")
          : document.body.append(
              document.createElement("salla-app-install-alert"),
            ));
    }
    renderThemePreview() {
      if ("preview" !== Salla.config.get("theme.mode")) return;
      if (
        (document.body.classList.add("has-preview-bar"),
        document.querySelector("#s-theme_preview_bar"))
      )
        return void Salla.logger.warn(
          "#s-theme_preview_bar element Existed before!",
        );
      let e = document.createElement("div");
      ((e.id = "s-theme_preview_bar"),
        e.setAttribute(
          "style",
          "display: flex; justify-content: space-between; text-align: center; background-color: #232323; color: #fff; padding: 10px; font-size: 0.875rem; line-height: 1.25rem; position: relative;",
        ),
        (e.innerHTML = `\n              <div style="display:flex; align-items:center;">\n                <img width="32" src="https://cdn.salla.network/images/logo/logo-light.svg">\n                <span style="margin:0 10px;">${Salla.lang.get("blocks.header.preview_mode")}: <span style="background:rgba(255,255,255,0.25);border-radius:15px; padding:2px 15px 4px">${Salla.config.get("theme.name")}</span></span>\n              </div>\n              <a href="${Salla.url.get("preview_theme/cancel/preview")}" style="line-height:32px; width:32px;"><i class="sicon-cancel"></i></a>\n            `),
        document.body.prepend(e));
    }
    renderEdit() {
      let e = Salla.config.get("edit");
      if (!e) return;
      if (document.querySelector("#s-edit-alert"))
        return void Salla.logger.warn("#s-edit-alert element Existed before!");
      let t = document.createElement("div");
      ((t.id = "s-edit-alert"),
        (t.innerHTML = `\n              <a href="${e}" style="display:block; background-color:${Salla.config.get("theme.color.primary", "#5cd5c4")}; color:${Salla.config.get("theme.color.reverse", "#fff")}; padding: 10px; text-align:center; font-size: 0.875rem; line-height: 1.25rem;">\n                <i class="sicon-edit"></i> \n                ${Salla.lang.get("pages.products.quick_edit")}\n              </a>\n            `),
        document.body.prepend(t));
    }
    applyContentCopyright() {
      if (!Salla.config.get("store.settings.content_copyright")) return;
      (["contextmenu", "selectstart", "copy"].forEach((e) => {
        document.addEventListener(e, (e) => {
          ((e) => {
            var t;
            if (!e) return !1;
            const n = null == (t = e.tagName) ? void 0 : t.toLowerCase();
            return "input" === n || "textarea" === n;
          })(e.target) || e.preventDefault();
        });
      }),
        document.addEventListener("keydown", (e) => {
          const t = e.key.toLowerCase();
          ("f12" === t ||
            (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(t)) ||
            (e.ctrlKey && "u" === t)) &&
            (e.preventDefault(), e.stopPropagation());
        }));
      const e = document.createElement("style");
      ((e.textContent =
        "\n            body {\n                -webkit-touch-callout: none;\n                -webkit-user-select: none;\n                -moz-user-select: none;\n                -ms-user-select: none;\n                user-select: none;\n            }\n            input, textarea {\n                -webkit-touch-callout: auto;\n                -webkit-user-select: auto;\n                -moz-user-select: auto;\n                -ms-user-select: auto;\n                user-select: auto;\n            }\n            img {\n                pointer-events: none;\n                -webkit-user-drag: none;\n            }\n        "),
        document.head.appendChild(e));
    }
  }
  class da {
    constructor(e) {
      ((this.storeUserKey = "s-store-user"),
        Salla.event.on("twilight::initiated", () => this.embedStoreUser()),
        this.embedUser(e));
    }
    embedUser(e) {
      return (e.user || (e.user = this.getUser()), e);
    }
    getUser() {
      return Salla.storage.get("user", this.getDefaultUser());
    }
    getDefaultUser() {
      return {
        type: "guest",
        language_code: Salla.lang.getLocale(),
        currency_code: "SAR",
      };
    }
    async embedStoreUser() {
      if (Salla.config.isGuest()) return;
      let e = Salla.storage.getWithTTL("session", this.storeUserKey);
      (e || (e = await this.getStoreUserFromApi()),
        Salla.config.set("user", jn({}, Salla.config.get("user"), e)),
        Salla.log("Store user is embeded to the user object."));
    }
    async getStoreUserFromApi() {
      let e = {};
      try {
        const t = await Salla.api.request("profile/notifications/unread");
        if (
          ((e.notification = t.data.count),
          (e.is_notifiable = t.data.is_notifiable),
          Salla.config.get("store.features", []).includes("loyalty-system"))
        ) {
          const t = await Salla.api.request("profile/loyalty/points");
          t && (e.loyalty_points = t.data.points);
        }
      } catch (e) {
        Salla.log("Failed to get user services", e);
      }
      return (
        Salla.storage.setWithTTL("session", this.storeUserKey, e, 300),
        e
      );
    }
  }
  class ha {
    constructor() {
      const e = {
          fbclid: "facebook",
          gad_source: "google",
          ttclid: "tiktok",
          twclid: "twitter",
          scid: "snapchat",
          sccid: "snapchat",
        },
        t = Object.keys(e),
        n = [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_term",
          "utm_content",
          ...t,
        ],
        r = {},
        i = {};
      window.location.search
        .replace("?", "")
        .split("&")
        .map((e) => e.split("="))
        .filter(([e]) => n.includes(e.toLowerCase()))
        .forEach(([e, t]) => {
          let n = t || "",
            i = !1;
          try {
            ((n = decodeURIComponent(t)), (i = !0));
          } catch (e) {
            Salla.log("Failed to decode UTM param:", e);
          }
          r[e.toLowerCase()] = i
            ? n
                .replace(
                  /(?:[\0-\x1F!-,\.\/:-@\[-`\{-\xA9\xAB-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u036F\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482-\u0489\u0530\u0557\u0558\u055A-\u055F\u0589-\u05CF\u05EB-\u05EE\u05F3-\u061F\u064B-\u065F\u066A-\u066D\u0670\u06D4\u06D6-\u06E4\u06E7-\u06ED\u06FD\u06FE\u0700-\u070F\u0711\u0730-\u074C\u07A6-\u07B0\u07B2-\u07BF\u07EB-\u07F3\u07F6-\u07F9\u07FB-\u07FF\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u083F\u0859-\u085F\u086B-\u086F\u0888\u0890-\u089F\u08CA-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962-\u0965\u0970\u0981-\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA-\u09BC\u09BE-\u09CD\u09CF-\u09DB\u09DE\u09E2-\u09E5\u09F2\u09F3\u09FA\u09FB\u09FD-\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A-\u0A58\u0A5D\u0A5F-\u0A65\u0A70\u0A71\u0A75-\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA-\u0ABC\u0ABE-\u0ACF\u0AD1-\u0ADF\u0AE2-\u0AE5\u0AF0-\u0AF8\u0AFA-\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A-\u0B3C\u0B3E-\u0B5B\u0B5E\u0B62-\u0B65\u0B70\u0B78-\u0B82\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BCF\u0BD1-\u0BE5\u0BF3-\u0C04\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C3E-\u0C57\u0C5B\u0C5E\u0C5F\u0C62-\u0C65\u0C70-\u0C77\u0C7F\u0C81-\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA-\u0CBC\u0CBE-\u0CDB\u0CDF\u0CE2-\u0CE5\u0CF0\u0CF3-\u0D03\u0D0D\u0D11\u0D3B\u0D3C\u0D3E-\u0D4D\u0D4F-\u0D53\u0D57\u0D62-\u0D65\u0D79\u0D80-\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DE5\u0DF0-\u0E00\u0E31\u0E34-\u0E3F\u0E47-\u0E4F\u0E5A-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EB1\u0EB4-\u0EBC\u0EBE\u0EBF\u0EC5\u0EC7-\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F01-\u0F1F\u0F34-\u0F3F\u0F48\u0F6D-\u0F87\u0F8D-\u0FFF\u102B-\u103E\u104A-\u104F\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B-\u1368\u137D-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u1680\u169B-\u169F\u16EB-\u16ED\u16F9-\u16FF\u1712-\u171E\u1732-\u173F\u1752-\u175F\u176D\u1771-\u177F\u17B4-\u17D6\u17D8-\u17DB\u17DD-\u17DF\u17EA-\u17EF\u17FA-\u180F\u181A-\u181F\u1879-\u187F\u1885\u1886\u18A9\u18AB-\u18AF\u18F6-\u18FF\u191F-\u1945\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19FF\u1A17-\u1A1F\u1A55-\u1A7F\u1A8A-\u1A8F\u1A9A-\u1AA6\u1AA8-\u1B04\u1B34-\u1B44\u1B4D-\u1B4F\u1B5A-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BFF\u1C24-\u1C3F\u1C4A-\u1C4C\u1C7E\u1C7F\u1C8B-\u1C8F\u1CBB\u1CBC\u1CC0-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1CFB-\u1CFF\u1DC0-\u1DFF\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u206F\u2072\u2073\u207A-\u207E\u208A-\u208F\u209D-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A-\u245F\u249C-\u24E9\u2500-\u2775\u2794-\u2BFF\u2CE5-\u2CEA\u2CEF-\u2CF1\u2CF4-\u2CFC\u2CFE\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7F\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF-\u2E2E\u2E30-\u3004\u3008-\u3020\u302A-\u3030\u3036\u3037\u303D-\u3040\u3097-\u309C\u30A0\u30FB\u3100-\u3104\u3130\u318F-\u3191\u3196-\u319F\u31C0-\u31EF\u3200-\u321F\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA66F-\uA67E\uA69E\uA69F\uA6F0-\uA716\uA720\uA721\uA789\uA78A\uA7DD-\uA7F0\uA802\uA806\uA80B\uA823-\uA82F\uA836-\uA83F\uA874-\uA881\uA8B4-\uA8CF\uA8DA-\uA8F1\uA8F8-\uA8FA\uA8FC\uA8FF\uA926-\uA92F\uA947-\uA95F\uA97D-\uA983\uA9B3-\uA9CE\uA9DA-\uA9DF\uA9E5\uA9FF\uAA29-\uAA3F\uAA43\uAA4C-\uAA4F\uAA5A-\uAA5F\uAA77-\uAA79\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAC3-\uAADA\uAADE\uAADF\uAAEB-\uAAF1\uAAF5-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB6A-\uAB6F\uABE3-\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB1E\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFE6F\uFE75\uFEFD-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDD06\uDD34-\uDD3F\uDD79-\uDD89\uDD8C-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEE0\uDEFC-\uDEFF\uDF24-\uDF2C\uDF4B-\uDF4F\uDF76-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDD6F\uDD7B\uDD8B\uDD93\uDD96\uDDA2\uDDB2\uDDBA\uDDBD-\uDDBF\uDDF4-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDF7F\uDF86\uDFB1\uDFBB-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC57\uDC77\uDC78\uDC9F-\uDCA6\uDCB0-\uDCDF\uDCF3\uDCF6-\uDCFA\uDD1C-\uDD1F\uDD3A-\uDD3F\uDD5A-\uDD7F\uDDB8-\uDDBB\uDDD0\uDDD1\uDE01-\uDE0F\uDE14\uDE18\uDE36-\uDE3F\uDE49-\uDE5F\uDE7F\uDEA0-\uDEBF\uDEC8\uDEE5-\uDEEA\uDEF0-\uDEFF\uDF36-\uDF3F\uDF56\uDF57\uDF73-\uDF77\uDF92-\uDFA8\uDFB0-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCF9\uDD24-\uDD2F\uDD3A-\uDD3F\uDD66-\uDD6E\uDD86-\uDE5F\uDE7F\uDEAA-\uDEAF\uDEB2-\uDEC1\uDEC8-\uDEFF\uDF28-\uDF2F\uDF46-\uDF50\uDF55-\uDF6F\uDF82-\uDFAF\uDFCC-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC00-\uDC02\uDC38-\uDC51\uDC70\uDC73\uDC74\uDC76-\uDC82\uDCB0-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDD02\uDD27-\uDD35\uDD40-\uDD43\uDD45\uDD46\uDD48-\uDD4F\uDD73-\uDD75\uDD77-\uDD82\uDDB3-\uDDC0\uDDC5-\uDDCF\uDDDB\uDDDD-\uDDE0\uDDF5-\uDDFF\uDE12\uDE2C-\uDE3E\uDE41-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEDF-\uDEEF\uDEFA-\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A-\uDF3C\uDF3E-\uDF4F\uDF51-\uDF5C\uDF62-\uDF7F\uDF8A\uDF8C\uDF8D\uDF8F\uDFB6\uDFB8-\uDFD0\uDFD2\uDFD4-\uDFFF]|\uD805[\uDC35-\uDC46\uDC4B-\uDC4F\uDC5A-\uDC5E\uDC62-\uDC7F\uDCB0-\uDCC3\uDCC6\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDAF-\uDDD7\uDDDC-\uDDFF\uDE30-\uDE43\uDE45-\uDE4F\uDE5A-\uDE7F\uDEAB-\uDEB7\uDEB9-\uDEBF\uDECA-\uDECF\uDEE4-\uDEFF\uDF1B-\uDF2F\uDF3C-\uDF3F\uDF47-\uDFFF]|\uD806[\uDC2C-\uDC9F\uDCF3-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD30-\uDD3E\uDD40\uDD42-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD1-\uDDE0\uDDE2\uDDE4-\uDDFF\uDE01-\uDE0A\uDE33-\uDE39\uDE3B-\uDE4F\uDE51-\uDE5B\uDE8A-\uDE9C\uDE9E-\uDEAF\uDEF9-\uDFBF\uDFE1-\uDFEF\uDFFA-\uDFFF]|\uD807[\uDC09\uDC2F-\uDC3F\uDC41-\uDC4F\uDC6D-\uDC71\uDC90-\uDCFF\uDD07\uDD0A\uDD31-\uDD45\uDD47-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8A-\uDD97\uDD99-\uDD9F\uDDAA-\uDDAF\uDDDC-\uDDDF\uDDEA-\uDEDF\uDEF3-\uDF01\uDF03\uDF11\uDF34-\uDF4F\uDF5A-\uDFAF\uDFB1-\uDFBF\uDFD5-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD812-\uD817\uD819\uD824-\uD82A\uD82D\uD82E\uD830-\uD832\uD836\uD83D\uD83F\uD87C\uD87D\uD87F\uD88E-\uDBFF][\uDC00-\uDFFF]|\uD80B[\uDC00-\uDF8F\uDFF1-\uDFFF]|\uD80D[\uDC30-\uDC40\uDC47-\uDC5F]|\uD810[\uDFFB-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD818[\uDC00-\uDCFF\uDD1E-\uDD2F\uDD3A-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDE6F\uDEBF\uDECA-\uDECF\uDEEE-\uDEFF\uDF30-\uDF3F\uDF44-\uDF4F\uDF5A\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDD3F\uDD6D-\uDD6F\uDD7A-\uDE3F\uDE97-\uDE9F\uDEB9\uDEBA\uDED4-\uDEFF\uDF4B-\uDF4F\uDF51-\uDF92\uDFA0-\uDFDF\uDFE2\uDFE4-\uDFF1\uDFF7-\uDFFF]|\uD823[\uDCD6-\uDCFE\uDD1F-\uDD7F\uDDF3-\uDFFF]|\uD82B[\uDC00-\uDFEF\uDFF4\uDFFC\uDFFF]|\uD82C[\uDD23-\uDD31\uDD33-\uDD4F\uDD53\uDD54\uDD56-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDFFF]|\uD833[\uDC00-\uDCEF\uDCFA-\uDFFF]|\uD834[\uDC00-\uDEBF\uDED4-\uDEDF\uDEF4-\uDF5F\uDF79-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC\uDFCD]|\uD837[\uDC00-\uDEFF\uDF1F-\uDF24\uDF2B-\uDFFF]|\uD838[\uDC00-\uDC2F\uDC6E-\uDCFF\uDD2D-\uDD36\uDD3E\uDD3F\uDD4A-\uDD4D\uDD4F-\uDE8F\uDEAE-\uDEBF\uDEEC-\uDEEF\uDEFA-\uDFFF]|\uD839[\uDC00-\uDCCF\uDCEC-\uDCEF\uDCFA-\uDDCF\uDDEE\uDDEF\uDDFB-\uDEBF\uDEDF\uDEE3\uDEE6\uDEEE\uDEEF\uDEF5-\uDEFD\uDF00-\uDFDF\uDFE7\uDFEC\uDFEF\uDFFF]|\uD83A[\uDCC5\uDCC6\uDCD0-\uDCFF\uDD44-\uDD4A\uDD4C-\uDD4F\uDD5A-\uDFFF]|\uD83B[\uDC00-\uDC70\uDCAC\uDCB0\uDCB5-\uDD00\uDD2E\uDD3E-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDFFF]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDFFF]|\uD83E[\uDC00-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEE0-\uDEFF]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEAE\uDEAF]|\uD87A[\uDFE1-\uDFEF]|\uD87B[\uDE5E-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDF4F]|\uD88D[\uDC7A-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g,
                  " ",
                )
                .replace(/ +/g, " ")
                .trim()
            : n;
        });
      const o = t.find((e) => r[e]);
      (!r.utm_source &&
        o &&
        ((r.utm_source = e[o]),
        (r.utm_campaign =
          r.utm_campaign ||
          `Using the CLICKID ${o} provided by ${r.utm_source}`),
        (r.utm_term = r.utm_term || `${o}: ${r[o]}`)),
        r.utm_source &&
          (Object.entries(r)
            .filter(([e]) => !t.includes(e))
            .forEach(([e, t]) => {
              i[`s-${e.replace("_", "-")}`] = t;
            }),
          (i["s-utm-referrer"] = document.referrer),
          Salla.storage.setWithTTL("s-utms", i, 129600),
          this.logUTMVisitData(i)));
    }
    async logUTMVisitData(e) {
      const t = e["s-utm-source"],
        n = e["s-utm-medium"],
        r = e["s-utm-campaign"],
        i = Salla.config.get("store.id");
      e &&
        "affiliate" === t &&
        n &&
        r &&
        fetch(Salla.config.get("affiliate.utm_url"), {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "s-utm-source": t,
            "s-utm-medium": n,
            "s-utm-campaign": r,
            "s-store-id": i,
          },
        }).then((e) => {
          if (!e.ok) return;
          const t = new URL(window.location.href),
            n = window.history.state;
          (t.searchParams.delete("utm_source"),
            t.searchParams.delete("utm_medium"),
            t.searchParams.delete("utm_campaign"),
            window.history.replaceState(n, "", t));
        });
    }
  }
  class pa {
    constructor(e) {
      var t, n, r;
      if ("ready" !== Salla.status) {
        if (null == e || null == (t = e.store) || !t.id)
          return (
            console.error("Trying to init Twilight without store.id!"),
            void console.log(
              "you can initiate twilight using this line only: Salla.init({store:{id:1234}})",
            )
          );
        var i;
        if (
          (Salla.config.merge(e),
          !["salla.sa", "salla.group"].includes(location.hostname) ||
            (null != (n = Salla.config.get("store.url")) &&
              n.includes(location.hostname)) ||
            !Salla.config.get("store.username") ||
            Salla.config.set(
              "store.url",
              window.location.origin + "/" + Salla.config.get("store.username"),
            ),
          (null == e ? void 0 : e.events) &&
            Salla.event.dispatchEvents(null == e ? void 0 : e.events),
          new ca(),
          new da(e),
          null != e && null != (r = e.user) && r.language_code)
        )
          Salla.lang.setLocale(
            null == e || null == (i = e.user) ? void 0 : i.language_code,
          );
        new ua(e)
          .getConfig()
          .then((e) => {
            (Salla.config.merge(e), this.setSallaReady(e), this.afterInit());
          })
          .catch((e) => console.error("failed to initite twilight😢", e));
      } else
        Salla.log("Trying to re-initiate Salla, while its status === 'ready'!");
    }
    afterInit() {
      Salla.url.is_page("product.single") &&
        Salla.config.isGuest() &&
        window.addEventListener("mini-checkout::before-init", (e) => {
          (e.preventDefault(), Salla.event.emit("login::open"));
        });
    }
    setSallaReady(e) {
      (new ha(),
        Salla.event.emitAsync("twilight::before.ready", e),
        (Salla.status = "ready"),
        Salla.event.dispatch("twilight::initiated", e),
        window.dispatchEvent(
          new CustomEvent("twilight::initiated", { detail: e }),
        ));
    }
  }
  function fa(e, t, n, r, i) {
    for (t = t.split ? t.split(".") : t, r = 0; r < t.length; r++)
      e = e ? e[t[r]] : i;
    return e === i ? n : e;
  }
  var ga = "undefined",
    ma = "object",
    va = "any",
    ya = "*",
    ba = "undefined" != typeof process ? process : {};
  ba.env && ba.env.NODE_ENV;
  var wa = "undefined" != typeof document;
  function Da(e, t) {
    return t.charAt(0)[e]() + t.slice(1);
  }
  (null != ba.versions && ba.versions.node,
    "undefined" != typeof Deno && Deno.core,
    (wa && "nodejs" === window.name) ||
      ("undefined" != typeof navigator &&
        void 0 !== navigator.userAgent &&
        (navigator.userAgent.includes("Node.js") ||
          navigator.userAgent.includes("jsdom"))));
  var Fa = Da.bind(null, "toUpperCase"),
    Sa = Da.bind(null, "toLowerCase");
  function _a(e) {
    return Oa(e)
      ? Fa("null")
      : "object" == typeof e
        ? (function (e) {
            return Ca(e.constructor) ? e.constructor.name : null;
          })(e)
        : Object.prototype.toString.call(e).slice(8, -1);
  }
  function Ea(e, t) {
    void 0 === t && (t = !0);
    var n = _a(e);
    return t ? Sa(n) : n;
  }
  function Aa(e, t) {
    return typeof t === e;
  }
  var Ca = Aa.bind(null, "function"),
    ka = Aa.bind(null, "string"),
    xa = Aa.bind(null, "undefined"),
    Pa = Aa.bind(null, "boolean");
  function Oa(e) {
    return null === e;
  }
  function Ia(e) {
    if (
      !(function (e) {
        return e && ("object" == typeof e || null !== e);
      })(e)
    )
      return !1;
    for (var t = e; null !== Object.getPrototypeOf(t); )
      t = Object.getPrototypeOf(t);
    return Object.getPrototypeOf(e) === t;
  }
  function ja(e) {
    return (
      e instanceof Error ||
      (ka(e.message) &&
        e.constructor &&
        (function (e) {
          return "number" === Ea(e) && !isNaN(e);
        })(e.constructor.stackTraceLimit))
    );
  }
  function Ta(e, t) {
    if ("object" != typeof t || Oa(t)) return !1;
    if (t instanceof e) return !0;
    var n = Ea(new e(""));
    if (ja(t))
      for (; t; ) {
        if (Ea(t) === n) return !0;
        t = Object.getPrototypeOf(t);
      }
    return !1;
  }
  function Ra(e, t) {
    var n = e instanceof Element || e instanceof HTMLDocument;
    return n && t
      ? (function (e, t) {
          return (
            void 0 === t && (t = ""),
            e && e.nodeName === t.toUpperCase()
          );
        })(e, t)
      : n;
  }
  function La(e) {
    var t = [].slice.call(arguments, 1);
    return function () {
      return e.apply(void 0, [].slice.call(arguments).concat(t));
    };
  }
  function Ba(e) {
    try {
      return decodeURIComponent(e.replace(/\+/g, " "));
    } catch (e) {
      return null;
    }
  }
  function Ua(e) {
    return (function (e) {
      for (
        var t, n = Object.create(null), r = /([^&=]+)=?([^&]*)/g;
        (t = r.exec(e));
      ) {
        var i = Ba(t[1]),
          o = Ba(t[2]);
        "[]" === i.substring(i.length - 2)
          ? (n[(i = i.substring(0, i.length - 2))] || (n[i] = [])).push(o)
          : (n[i] = "" === o || o);
      }
      for (var a in n) {
        var s = a.split("[");
        s.length > 1 &&
          (Na(
            n,
            s.map(function (e) {
              return e.replace(/[?[\]\\ ]/g, "");
            }),
            n[a],
          ),
          delete n[a]);
      }
      return n;
    })(wa && window.location.search.substring(1));
  }
  function Na(e, t, n) {
    for (var r = t.length - 1, i = 0; i < r; ++i) {
      var o = t[i];
      if ("__proto__" === o || "constructor" === o) break;
      (o in e || (e[o] = {}), (e = e[o]));
    }
    e[t[r]] = n;
  }
  function qa() {
    for (var e = "", t = 0, n = (4294967295 * Math.random()) | 0; t++ < 36; ) {
      var r = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"[t - 1],
        i = 15 & n;
      ((e +=
        "-" == r || "4" == r ? r : ("x" == r ? i : (3 & i) | 8).toString(16)),
        (n = t % 8 == 0 ? (4294967295 * Math.random()) | 0 : n >> 4));
    }
    return e;
  }
  (Aa.bind(null, "symbol"),
    Ta.bind(null, TypeError),
    Ta.bind(null, SyntaxError),
    La(Ra, "form"),
    La(Ra, "button"),
    La(Ra, "input"),
    La(Ra, "select"));
  var za = "global",
    $a = "__global__",
    Ma =
      (typeof self === ma && self.self === self && self) ||
      (typeof global === ma && global.global === global && global) ||
      void 0;
  function Ha(e) {
    return Ma[$a][e];
  }
  function Ja(e, t) {
    return (Ma[$a][e] = t);
  }
  function Wa(e) {
    delete Ma[$a][e];
  }
  function Ga(e, t, n) {
    var r;
    try {
      if (Ka(e)) {
        var i = window[e];
        r = i[t].bind(i);
      }
    } catch (e) {}
    return r || n;
  }
  Ma[$a] || (Ma[$a] = {});
  var Va = {};
  function Ka(e) {
    if (typeof Va[e] !== ga) return Va[e];
    try {
      var t = window[e];
      (t.setItem(ga, ga), t.removeItem(ga));
    } catch (t) {
      return (Va[e] = !1);
    }
    return (Va[e] = !0);
  }
  function Qa() {
    return (
      (Qa =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
      Qa.apply(this, arguments)
    );
  }
  var Xa = "function",
    Ya = "undefined",
    Za = "@@redux/" + Math.random().toString(36),
    es = (typeof Symbol === Xa && Symbol.observable) || "@@observable",
    ts = " != " + Xa;
  function ns(e, t, n) {
    var r;
    if (
      (typeof t === Xa && typeof n === Ya && ((n = t), (t = void 0)),
      typeof n !== Ya)
    ) {
      if (typeof n !== Xa) throw new Error("enhancer" + ts);
      return n(ns)(e, t);
    }
    if (typeof e !== Xa) throw new Error("reducer" + ts);
    var i = e,
      o = t,
      a = [],
      s = a,
      l = !1;
    function u() {
      s === a && (s = a.slice());
    }
    function c() {
      return o;
    }
    function d(e) {
      if (typeof e !== Xa) throw new Error("Listener" + ts);
      var t = !0;
      return (
        u(),
        s.push(e),
        function () {
          if (t) {
            ((t = !1), u());
            var n = s.indexOf(e);
            s.splice(n, 1);
          }
        }
      );
    }
    function h(e) {
      if (!Ia(e)) throw new Error("Act != obj");
      if (typeof e.type === Ya) throw new Error("ActType " + Ya);
      if (l) throw new Error("Dispatch in reducer");
      try {
        ((l = !0), (o = i(o, e)));
      } finally {
        l = !1;
      }
      for (var t = (a = s), n = 0; n < t.length; n++) (0, t[n])();
      return e;
    }
    return (
      h({ type: "@@redux/INIT" }),
      ((r = {
        dispatch: h,
        subscribe: d,
        getState: c,
        replaceReducer: function (e) {
          if (typeof e !== Xa) throw new Error("next reducer" + ts);
          ((i = e), h({ type: "@@redux/INIT" }));
        },
      })[es] = function () {
        var e,
          t = d;
        return (
          ((e = {
            subscribe: function (e) {
              if ("object" != typeof e) throw new TypeError("Observer != obj");
              function n() {
                e.next && e.next(c());
              }
              return (n(), { unsubscribe: t(n) });
            },
          })[es] = function () {
            return this;
          }),
          e
        );
      }),
      r
    );
  }
  function rs(e, t) {
    var n = t && t.type;
    return (
      "action " +
      ((n && n.toString()) || "?") +
      "reducer " +
      e +
      " returns " +
      Ya
    );
  }
  function is() {
    var e = [].slice.call(arguments);
    return 0 === e.length
      ? function (e) {
          return e;
        }
      : 1 === e.length
        ? e[0]
        : e.reduce(function (e, t) {
            return function () {
              return e(t.apply(void 0, [].slice.call(arguments)));
            };
          });
  }
  function os() {
    var e = arguments;
    return function (t) {
      return function (n, r, i) {
        var o,
          a = t(n, r, i),
          s = a.dispatch,
          l = {
            getState: a.getState,
            dispatch: function (e) {
              return s(e);
            },
          };
        return (
          (o = [].slice.call(e).map(function (e) {
            return e(l);
          })),
          Qa({}, a, { dispatch: (s = is.apply(void 0, o)(a.dispatch)) })
        );
      };
    };
  }
  var as = "__anon_id",
    ss = "__user_id",
    ls = "__user_traits",
    us = "userId",
    cs = "anonymousId",
    ds = [
      "bootstrap",
      "params",
      "campaign",
      "initializeStart",
      "initialize",
      "initializeEnd",
      "ready",
      "resetStart",
      "reset",
      "resetEnd",
      "pageStart",
      "page",
      "pageEnd",
      "pageAborted",
      "trackStart",
      "track",
      "trackEnd",
      "trackAborted",
      "identifyStart",
      "identify",
      "identifyEnd",
      "identifyAborted",
      "userIdChanged",
      "registerPlugins",
      "enablePlugin",
      "disablePlugin",
      "online",
      "offline",
      "setItemStart",
      "setItem",
      "setItemEnd",
      "setItemAborted",
      "removeItemStart",
      "removeItem",
      "removeItemEnd",
      "removeItemAborted",
    ],
    hs = ["name", "EVENTS", "config", "loaded"],
    ps = ds.reduce(
      function (e, t) {
        return ((e[t] = t), e);
      },
      {
        registerPluginType: function (e) {
          return "registerPlugin:" + e;
        },
        pluginReadyType: function (e) {
          return "ready:" + e;
        },
      },
    ),
    fs = /^utm_/,
    gs = /^an_prop_/,
    ms = /^an_trait_/;
  function vs(e) {
    var t = e.storage.setItem;
    return function (n) {
      return function (r) {
        return function (i) {
          if (i.type === ps.bootstrap) {
            var o = i.params,
              a = i.user,
              s = i.persistedUser,
              l = i.initialUser,
              u = s.userId === a.userId;
            (s.anonymousId !== a.anonymousId && t(as, a.anonymousId),
              u || t(ss, a.userId),
              l.traits &&
                t(ls, Qa({}, u && s.traits ? s.traits : {}, l.traits)));
            var c = Object.keys(i.params);
            if (c.length) {
              var d = o.an_uid,
                h = o.an_event,
                p = c.reduce(
                  function (e, t) {
                    if (t.match(fs) || t.match(/^(d|g)clid/)) {
                      var n = t.replace(fs, "");
                      e.campaign["campaign" === n ? "name" : n] = o[t];
                    }
                    return (
                      t.match(gs) && (e.props[t.replace(gs, "")] = o[t]),
                      t.match(ms) && (e.traits[t.replace(ms, "")] = o[t]),
                      e
                    );
                  },
                  { campaign: {}, props: {}, traits: {} },
                );
              (n.dispatch(
                Qa({ type: ps.params, raw: o }, p, d ? { userId: d } : {}),
              ),
                d &&
                  setTimeout(function () {
                    return e.identify(d, p.traits);
                  }, 0),
                h &&
                  setTimeout(function () {
                    return e.track(h, p.props);
                  }, 0),
                Object.keys(p.campaign).length &&
                  n.dispatch({ type: ps.campaign, campaign: p.campaign }));
            }
          }
          return r(i);
        };
      };
    };
  }
  function ys(e) {
    return function (t, n) {
      if (
        (void 0 === t && (t = {}),
        void 0 === n && (n = {}),
        n.type === ps.setItemEnd)
      ) {
        if (n.key === as) return Qa({}, t, { anonymousId: n.value });
        if (n.key === ss) return Qa({}, t, { userId: n.value });
      }
      switch (n.type) {
        case ps.identify:
          return Object.assign({}, t, {
            userId: n.userId,
            traits: Qa({}, t.traits, n.traits),
          });
        case ps.reset:
          return (
            [ss, as, ls].forEach(function (t) {
              e.removeItem(t);
            }),
            Object.assign({}, t, {
              userId: null,
              anonymousId: null,
              traits: {},
            })
          );
        default:
          return t;
      }
    };
  }
  function bs(e) {
    return {
      userId: e.getItem(ss),
      anonymousId: e.getItem(as),
      traits: e.getItem(ls),
    };
  }
  var ws = function (e) {
    return "__TEMP__" + e;
  };
  function Ds(e) {
    var t = e.storage,
      n = t.setItem,
      r = t.removeItem,
      i = t.getItem;
    return function (e) {
      return function (t) {
        return function (o) {
          var a = o.userId,
            s = o.traits,
            l = o.options;
          if (
            (o.type === ps.reset &&
              ([ss, ls, as].forEach(function (e) {
                r(e);
              }),
              [us, cs, "traits"].forEach(function (e) {
                Wa(ws(e));
              })),
            o.type === ps.identify)
          ) {
            i(as) || n(as, qa());
            var u = i(ss),
              c = i(ls) || {};
            (u &&
              u !== a &&
              e.dispatch({
                type: ps.userIdChanged,
                old: { userId: u, traits: c },
                new: { userId: a, traits: s },
                options: l,
              }),
              a && n(ss, a),
              s && n(ls, Qa({}, c, s)));
          }
          return t(o);
        };
      };
    };
  }
  var Fs = {};
  function Ss(e, t) {
    Fs[e] && Ca(Fs[e]) && (Fs[e](t), delete Fs[e]);
  }
  function _s(e, t, n) {
    return new Promise(function (r, i) {
      return t()
        ? r(e)
        : n < 1
          ? i(Qa({}, e, { queue: !0 }))
          : new Promise(function (e) {
              return setTimeout(e, 10);
            }).then(function (o) {
              return _s(e, t, n - 10).then(r, i);
            });
    });
  }
  function Es(e) {
    return { abort: e };
  }
  var As = function (e) {
      var t = e.data,
        n = e.action,
        r = e.instance,
        i = e.state,
        o = e.allPlugins,
        a = e.allMatches,
        s = e.store,
        l = e.EVENTS;
      try {
        var u = i.plugins,
          c = i.context,
          d = n.type,
          h = d.match(Cs),
          p = t.exact.map(function (e) {
            return e.pluginName;
          });
        h &&
          (p = a.during.map(function (e) {
            return e.pluginName;
          }));
        var f = (function (e, t) {
            return function (n, r, i) {
              var o = r.config,
                a = r.name,
                s = a + "." + n.type;
              i && (s = i.event);
              var l = n.type.match(Cs)
                ? (function (e, t, n, r, i) {
                    return function (o, a) {
                      var s = r ? r.name : e,
                        l = a && Ls(a) ? a : n;
                      if (
                        r &&
                        (!(l = a && Ls(a) ? a : [e]).includes(e) ||
                          1 !== l.length)
                      )
                        throw new Error(
                          "Method " +
                            t +
                            " can only abort " +
                            e +
                            " plugin. " +
                            JSON.stringify(l) +
                            " input valid",
                        );
                      return Qa({}, i, {
                        abort: { reason: o, plugins: l, caller: t, _: s },
                      });
                    };
                  })(a, s, t, i, n)
                : (function (e, t) {
                    return function () {
                      throw new Error(
                        e.type +
                          " action not cancellable. Remove abort in " +
                          t,
                      );
                    };
                  })(n, s);
              return { payload: Ns(n), instance: e, config: o || {}, abort: l };
            };
          })(r, p),
          g = t.exact.reduce(function (e, t) {
            var n = t.pluginName,
              r = t.methodName,
              i = !1;
            return (
              r.match(/^initialize/) || r.match(/^reset/) || (i = !u[n].loaded),
              c.offline && r.match(/^(page|track|identify)/) && (i = !0),
              (e["" + n] = i),
              e
            );
          }, {});
        return Promise.resolve(
          t.exact.reduce(function (e, i, a) {
            try {
              var s = i.pluginName;
              return Promise.resolve(e).then(function (e) {
                function i() {
                  return Promise.resolve(e);
                }
                var a = (function () {
                  if (t.namespaced && t.namespaced[s])
                    return Promise.resolve(
                      t.namespaced[s].reduce(function (e, t, n) {
                        try {
                          return Promise.resolve(e).then(function (e) {
                            return t.method && Ca(t.method)
                              ? ((function (e, t) {
                                  var n = Us(e);
                                  if (n && n.name === t) {
                                    var r = Us(n.method);
                                    throw new Error(
                                      [
                                        t + " plugin is calling method " + e,
                                        "Plugins cant call self",
                                        "Use " +
                                          n.method +
                                          " " +
                                          (r ? "or " + r.method : "") +
                                          " in " +
                                          t +
                                          " plugin insteadof " +
                                          e,
                                      ].join("\n"),
                                    );
                                  }
                                })(t.methodName, t.pluginName),
                                Promise.resolve(
                                  t.method({
                                    payload: e,
                                    instance: r,
                                    abort:
                                      ((n = e),
                                      (i = s),
                                      (a = t.pluginName),
                                      function (e, t) {
                                        return Qa({}, n, {
                                          abort: {
                                            reason: e,
                                            plugins: t || [i],
                                            caller: d,
                                            from: a || i,
                                          },
                                        });
                                      }),
                                    config: Os(t.pluginName, u, o),
                                    plugins: u,
                                  }),
                                ).then(function (t) {
                                  var n = Ia(t) ? t : {};
                                  return Promise.resolve(Qa({}, e, n));
                                }))
                              : e;
                            var n, i, a;
                          });
                        } catch (e) {
                          return Promise.reject(e);
                        }
                      }, Promise.resolve(n)),
                    ).then(function (t) {
                      e[s] = t;
                    });
                  e[s] = n;
                })();
                return a && a.then ? a.then(i) : i();
              });
            } catch (e) {
              return Promise.reject(e);
            }
          }, Promise.resolve({})),
        ).then(function (e) {
          return Promise.resolve(
            t.exact.reduce(function (n, i, a) {
              try {
                var l = t.exact.length === a + 1,
                  c = i.pluginName,
                  p = o[c];
                return Promise.resolve(n).then(function (t) {
                  var n = e[c] ? e[c] : {};
                  if ((h && (n = t), Ts(n, c)))
                    return (
                      Ps({
                        data: n,
                        method: d,
                        instance: r,
                        pluginName: c,
                        store: s,
                      }),
                      Promise.resolve(t)
                    );
                  if (Ts(t, c))
                    return (
                      l && Ps({ data: t, method: d, instance: r, store: s }),
                      Promise.resolve(t)
                    );
                  if (g.hasOwnProperty(c) && !0 === g[c])
                    return (
                      s.dispatch({
                        type: "queue",
                        plugin: c,
                        payload: n,
                        _: { called: "queue", from: "queueMechanism" },
                      }),
                      Promise.resolve(t)
                    );
                  var i = f(e[c], o[c]);
                  return Promise.resolve(
                    p[d]({
                      abort: i.abort,
                      payload: n,
                      instance: r,
                      config: Os(c, u, o),
                      plugins: u,
                    }),
                  ).then(function (i) {
                    var o = Ia(i) ? i : {},
                      a = Qa({}, t, o),
                      l = e[c];
                    if (Ts(l, c))
                      Ps({
                        data: l,
                        method: d,
                        instance: r,
                        pluginName: c,
                        store: s,
                      });
                    else {
                      var u = d + ":" + c;
                      (u.match(/:/g) || []).length < 2 &&
                        !d.match(ks) &&
                        !d.match(xs) &&
                        r.dispatch(
                          Qa({}, h ? a : n, {
                            type: u,
                            _: { called: u, from: "submethod" },
                          }),
                        );
                    }
                    return Promise.resolve(a);
                  });
                });
              } catch (e) {
                return Promise.reject(e);
              }
            }, Promise.resolve(n)),
          ).then(function (e) {
            if (
              !(
                d.match(Cs) ||
                d.match(/^registerPlugin/) ||
                d.match(xs) ||
                d.match(ks) ||
                d.match(/^params/) ||
                d.match(/^userIdChanged/)
              )
            ) {
              if ((l.plugins.includes(d), e._ && e._.originalAction === d))
                return e;
              var n = Qa({}, e, {
                _: {
                  originalAction: e.type,
                  called: e.type,
                  from: "engineEnd",
                },
              });
              (Rs(e, t.exact.length) &&
                !d.match(/End$/) &&
                (n = Qa({}, n, { type: e.type + "Aborted" })),
                s.dispatch(n));
            }
            return e;
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    Cs = /Start$/,
    ks = /^bootstrap/,
    xs = /^ready/;
  function Ps(e) {
    var t = e.pluginName,
      n = e.method + "Aborted" + (t ? ":" + t : "");
    e.store.dispatch(
      Qa({}, e.data, { type: n, _: { called: n, from: "abort" } }),
    );
  }
  function Os(e, t, n) {
    var r = t[e] || n[e];
    return r && r.config ? r.config : {};
  }
  function Is(e, t) {
    return t.reduce(function (t, n) {
      return n[e]
        ? t.concat({ methodName: e, pluginName: n.name, method: n[e] })
        : t;
    }, []);
  }
  function js(e, t) {
    var n = e.replace(Cs, ""),
      r = t ? ":" + t : "";
    return ["" + e + r, "" + n + r, n + "End" + r];
  }
  function Ts(e, t) {
    var n = e.abort;
    return !!n && (!0 === n || Bs(n, t) || (n && Bs(n.plugins, t)));
  }
  function Rs(e, t) {
    var n = e.abort;
    if (!n) return !1;
    if (!0 === n || ka(n)) return !0;
    var r = n.plugins;
    return (Ls(n) && n.length === t) || (Ls(r) && r.length === t);
  }
  function Ls(e) {
    return Array.isArray(e);
  }
  function Bs(e, t) {
    return !(!e || !Ls(e)) && e.includes(t);
  }
  function Us(e) {
    var t = e.match(/(.*):(.*)/);
    return !!t && { method: t[1], name: t[2] };
  }
  function Ns(e) {
    return Object.keys(e).reduce(function (t, n) {
      return (
        "type" === n || (t[n] = Ia(e[n]) ? Object.assign({}, e[n]) : e[n]),
        t
      );
    }, {});
  }
  function qs(e, t, n) {
    var r = {};
    return function (i) {
      return function (o) {
        return function (a) {
          try {
            var s,
              l = function (e) {
                return s ? e : o(d);
              },
              u = a.type,
              c = a.plugins,
              d = a;
            if (a.abort) return Promise.resolve(o(a));
            if (
              (u === ps.enablePlugin &&
                i.dispatch({
                  type: ps.initializeStart,
                  plugins: c,
                  disabled: [],
                  fromEnable: !0,
                  meta: a.meta,
                }),
              u === ps.disablePlugin &&
                setTimeout(function () {
                  return Ss(a.meta.rid, { payload: a });
                }, 0),
              u === ps.initializeEnd)
            ) {
              var h = t(),
                p = Object.keys(h),
                f = p
                  .filter(function (e) {
                    return c.includes(e);
                  })
                  .map(function (e) {
                    return h[e];
                  }),
                g = [],
                m = [],
                v = a.disabled,
                y = f.map(function (e) {
                  var t = e.loaded,
                    n = e.name,
                    o = e.config;
                  return _s(
                    e,
                    function () {
                      return t({ config: o });
                    },
                    1e4,
                  )
                    .then(function (t) {
                      return (
                        r[n] ||
                          (i.dispatch({
                            type: ps.pluginReadyType(n),
                            name: n,
                            events: Object.keys(e).filter(function (e) {
                              return !hs.includes(e);
                            }),
                          }),
                          (r[n] = !0)),
                        (g = g.concat(n)),
                        e
                      );
                    })
                    .catch(function (e) {
                      if (e instanceof Error) throw new Error(e);
                      return ((m = m.concat(e.name)), e);
                    });
                });
              Promise.all(y).then(function (e) {
                var t = { plugins: g, failed: m, disabled: v };
                setTimeout(function () {
                  p.length === y.length + v.length &&
                    i.dispatch(Qa({}, { type: ps.ready }, t));
                }, 0);
              });
            }
            var b = (function () {
              if (u !== ps.bootstrap)
                return (
                  /^ready:([^:]*)$/.test(u) &&
                    setTimeout(function () {
                      return (function (e, t, n) {
                        var r = {},
                          i = t(),
                          o = e.getState(),
                          a = o.plugins,
                          s = o.queue,
                          l = o.user;
                        if (
                          !o.context.offline &&
                          s &&
                          s.actions &&
                          s.actions.length
                        ) {
                          var u = s.actions.reduce(
                            function (e, t, n) {
                              return (
                                a[t.plugin].loaded
                                  ? (e.process.push(t), e.processIndex.push(n))
                                  : (e.requeue.push(t), e.requeueIndex.push(n)),
                                e
                              );
                            },
                            {
                              processIndex: [],
                              process: [],
                              requeue: [],
                              requeueIndex: [],
                            },
                          );
                          if (u.processIndex && u.processIndex.length) {
                            u.processIndex.forEach(function (t) {
                              var o = s.actions[t],
                                u = o.plugin,
                                c = o.payload.type,
                                d = i[u][c];
                              if (d && Ca(d)) {
                                var h,
                                  p = (function (e, t) {
                                    return (
                                      void 0 === e && (e = {}),
                                      void 0 === t && (t = {}),
                                      [us, cs].reduce(function (n, r) {
                                        return (
                                          e.hasOwnProperty(r) &&
                                            t[r] &&
                                            t[r] !== e[r] &&
                                            (n[r] = t[r]),
                                          n
                                        );
                                      }, e)
                                    );
                                  })(o.payload, l),
                                  f = r[p.meta.rid];
                                if (
                                  !f &&
                                  (h = d({
                                    payload: p,
                                    config: a[u].config,
                                    instance: n,
                                    abort: Es,
                                  })) &&
                                  Ia(h) &&
                                  h.abort
                                )
                                  return void (r[p.meta.rid] = !0);
                                if (!f) {
                                  var g = c + ":" + u;
                                  e.dispatch(
                                    Qa({}, p, {
                                      type: g,
                                      _: { called: g, from: "queueDrain" },
                                    }),
                                  );
                                }
                              }
                            });
                            var c = s.actions.filter(function (e, t) {
                              return !~u.processIndex.indexOf(t);
                            });
                            s.actions = c;
                          }
                        }
                      })(i, t, e);
                    }, 0),
                  Promise.resolve(
                    (function (e, t, n, r, i) {
                      try {
                        var o = Ca(t) ? t() : t,
                          a = e.type,
                          s = a.replace(Cs, "");
                        if (e._ && e._.called) return Promise.resolve(e);
                        var l = n.getState(),
                          u =
                            ((h = o),
                            void 0 === (p = l.plugins) && (p = {}),
                            void 0 === (f = e.options) && (f = {}),
                            Object.keys(h)
                              .filter(function (e) {
                                var t = f.plugins || {};
                                return Pa(t[e])
                                  ? t[e]
                                  : !1 !== t.all &&
                                      (!p[e] || !1 !== p[e].enabled);
                              })
                              .map(function (e) {
                                return h[e];
                              }));
                        a === ps.initializeStart &&
                          e.fromEnable &&
                          (u = Object.keys(l.plugins)
                            .filter(function (t) {
                              var n = l.plugins[t];
                              return e.plugins.includes(t) && !n.initialized;
                            })
                            .map(function (e) {
                              return o[e];
                            }));
                        var c = u.map(function (e) {
                            return e.name;
                          }),
                          d = (function (e, t, n) {
                            var r = js(e).map(function (e) {
                              return Is(e, t);
                            });
                            return t.reduce(
                              function (n, r) {
                                var i = r.name,
                                  o = js(e, i).map(function (e) {
                                    return Is(e, t);
                                  }),
                                  a = o[0],
                                  s = o[1],
                                  l = o[2];
                                return (
                                  a.length && (n.beforeNS[i] = a),
                                  s.length && (n.duringNS[i] = s),
                                  l.length && (n.afterNS[i] = l),
                                  n
                                );
                              },
                              {
                                before: r[0],
                                beforeNS: {},
                                during: r[1],
                                duringNS: {},
                                after: r[2],
                                afterNS: {},
                              },
                            );
                          })(a, u);
                        return Promise.resolve(
                          As({
                            action: e,
                            data: { exact: d.before, namespaced: d.beforeNS },
                            state: l,
                            allPlugins: o,
                            allMatches: d,
                            instance: n,
                            store: r,
                            EVENTS: i,
                          }),
                        ).then(function (e) {
                          function t() {
                            var t = (function () {
                              if (a.match(Cs))
                                return Promise.resolve(
                                  As({
                                    action: Qa({}, u, { type: s + "End" }),
                                    data: {
                                      exact: d.after,
                                      namespaced: d.afterNS,
                                    },
                                    state: l,
                                    allPlugins: o,
                                    allMatches: d,
                                    instance: n,
                                    store: r,
                                    EVENTS: i,
                                  }),
                                ).then(function (e) {
                                  e.meta &&
                                    e.meta.hasCallback &&
                                    Ss(e.meta.rid, { payload: e });
                                });
                            })();
                            return t && t.then
                              ? t.then(function () {
                                  return e;
                                })
                              : e;
                          }
                          if (Rs(e, c.length)) return e;
                          var u,
                            h = (function () {
                              if (a !== s)
                                return Promise.resolve(
                                  As({
                                    action: Qa({}, e, { type: s }),
                                    data: {
                                      exact: d.during,
                                      namespaced: d.duringNS,
                                    },
                                    state: l,
                                    allPlugins: o,
                                    allMatches: d,
                                    instance: n,
                                    store: r,
                                    EVENTS: i,
                                  }),
                                ).then(function (e) {
                                  u = e;
                                });
                              u = e;
                            })();
                          return h && h.then ? h.then(t) : t();
                        });
                      } catch (e) {
                        return Promise.reject(e);
                      }
                      var h, p, f;
                    })(a, t, e, i, n),
                  ).then(function (e) {
                    return ((s = 1), o(e));
                  })
                );
            })();
            return Promise.resolve(b && b.then ? b.then(l) : l(b));
          } catch (e) {
            return Promise.reject(e);
          }
        };
      };
    };
  }
  function zs(e) {
    return function (t) {
      return function (t) {
        return function (n) {
          var r = n.type,
            i = n.key,
            o = n.value,
            a = n.options;
          if (r === ps.setItem || r === ps.removeItem) {
            if (n.abort) return t(n);
            r === ps.setItem ? e.setItem(i, o, a) : e.removeItem(i, a);
          }
          return t(n);
        };
      };
    };
  }
  var $s = function () {
    var e = this;
    ((this.before = []),
      (this.after = []),
      (this.addMiddleware = function (t, n) {
        e[n] = e[n].concat(t);
      }),
      (this.removeMiddleware = function (t, n) {
        var r = e[n].findIndex(function (e) {
          return e === t;
        });
        -1 !== r && (e[n] = [].concat(e[n].slice(0, r), e[n].slice(r + 1)));
      }),
      (this.dynamicMiddlewares = function (t) {
        return function (n) {
          return function (r) {
            return function (i) {
              var o = {
                  getState: n.getState,
                  dispatch: function (e) {
                    return n.dispatch(e);
                  },
                },
                a = e[t].map(function (e) {
                  return e(o);
                });
              return is.apply(void 0, a)(r)(i);
            };
          };
        };
      }));
  };
  function Ms(e) {
    return function (t, n) {
      void 0 === t && (t = {});
      var r = {};
      if ("initialize:aborted" === n.type) return t;
      if (/^registerPlugin:([^:]*)$/.test(n.type)) {
        var i = Hs(n.type, "registerPlugin"),
          o = e()[i];
        if (!o || !i) return t;
        var a = n.enabled,
          s = o.config;
        return (
          (r[i] = {
            enabled: a,
            initialized: !!a && Boolean(!o.initialize),
            loaded: !!a && Boolean(o.loaded({ config: s })),
            config: s,
          }),
          Qa({}, t, r)
        );
      }
      if (/^initialize:([^:]*)$/.test(n.type)) {
        var l = Hs(n.type, ps.initialize),
          u = e()[l];
        return u && l
          ? ((r[l] = Qa({}, t[l], {
              initialized: !0,
              loaded: Boolean(u.loaded({ config: u.config })),
            })),
            Qa({}, t, r))
          : t;
      }
      if (/^ready:([^:]*)$/.test(n.type))
        return ((r[n.name] = Qa({}, t[n.name], { loaded: !0 })), Qa({}, t, r));
      switch (n.type) {
        case ps.disablePlugin:
          return Qa({}, t, Js(n.plugins, !1, t));
        case ps.enablePlugin:
          return Qa({}, t, Js(n.plugins, !0, t));
        default:
          return t;
      }
    };
  }
  function Hs(e, t) {
    return e.substring(t.length + 1, e.length);
  }
  function Js(e, t, n) {
    return e.reduce(function (e, r) {
      return ((e[r] = Qa({}, n[r], { enabled: t })), e);
    }, n);
  }
  function Ws(e) {
    try {
      return JSON.parse(JSON.stringify(e));
    } catch (e) {}
    return e;
  }
  var Gs = { last: {}, history: [] };
  function Vs(e, t) {
    void 0 === e && (e = Gs);
    var n = t.options,
      r = t.meta;
    if (t.type === ps.track) {
      var i = Ws(
        Qa(
          { event: t.event, properties: t.properties },
          Object.keys(n).length && { options: n },
          { meta: r },
        ),
      );
      return Qa({}, e, { last: i, history: e.history.concat(i) });
    }
    return e;
  }
  var Ks = { actions: [] };
  function Qs(e, t) {
    void 0 === e && (e = Ks);
    var n = t.payload;
    switch (t.type) {
      case "queue":
        var r;
        return (
          (r =
            n && n.type && n.type === ps.identify
              ? [t].concat(e.actions)
              : e.actions.concat(t)),
          Qa({}, e, { actions: r })
        );
      case "dequeue":
        return [];
      default:
        return e;
    }
  }
  var Xs = /#.*$/;
  function Ys(e) {
    var t = /(http[s]?:\/\/)?([^\/\s]+\/)(.*)/g.exec(e);
    return "/" + (t && t[3] ? t[3].split("?")[0].replace(Xs, "") : "");
  }
  var Zs,
    el = function (e) {
      if ((void 0 === e && (e = {}), !wa)) return e;
      var t = document,
        n = t.title,
        r = t.referrer,
        i = window,
        o = i.location,
        a = i.innerWidth,
        s = i.innerHeight,
        l = o.hash,
        u = o.search,
        c = (function (e) {
          var t = (function () {
            if (wa)
              for (
                var e, t = document.getElementsByTagName("link"), n = 0;
                (e = t[n]);
                n++
              )
                if ("canonical" === e.getAttribute("rel"))
                  return e.getAttribute("href");
          })();
          return t
            ? t.match(/\?/)
              ? t
              : t + e
            : window.location.href.replace(Xs, "");
        })(u),
        d = {
          title: n,
          url: c,
          path: Ys(c),
          hash: l,
          search: u,
          width: a,
          height: s,
        };
      return (r && "" !== r && (d.referrer = r), Qa({}, d, e));
    },
    tl = { last: {}, history: [] };
  function nl(e, t) {
    void 0 === e && (e = tl);
    var n = t.options;
    if (t.type === ps.page) {
      var r = Ws(
        Qa(
          { properties: t.properties, meta: t.meta },
          Object.keys(n).length && { options: n },
        ),
      );
      return Qa({}, e, { last: r, history: e.history.concat(r) });
    }
    return e;
  }
  Zs = {};
  var rl = {
    initialized: !1,
    sessionId: qa(),
    app: null,
    version: null,
    debug: !1,
    offline: !!wa && !navigator.onLine,
    os: { name: "na" },
    userAgent: wa ? navigator.userAgent : "node",
    library: { name: "analytics", version: "0.12.14" },
    timezone: void 0,
    locale: void 0,
    campaign: {},
    referrer: Zs,
  };
  function il(e, t) {
    void 0 === e && (e = rl);
    var n = e.initialized,
      r = t.campaign;
    switch (t.type) {
      case ps.campaign:
        return Qa({}, e, { campaign: r });
      case ps.offline:
        return Qa({}, e, { offline: !0 });
      case ps.online:
        return Qa({}, e, { offline: !1 });
      default:
        return n ? e : Qa({}, rl, e, { initialized: !0 });
    }
  }
  var ol = ["plugins", "reducers", "storage"];
  function al() {
    return (
      Ja("analytics", []),
      function (e) {
        return function (t, n, r) {
          var i = e(t, n, r),
            o = i.dispatch;
          return Object.assign(i, {
            dispatch: function (e) {
              return (Ma[$a].analytics.push(e.action || e), o(e));
            },
          });
        };
      }
    );
  }
  function sl(e) {
    return function () {
      return is(is.apply(null, arguments), al());
    };
  }
  function ll(e) {
    return e
      ? (function (e) {
          return "array" === Ea(e);
        })(e)
        ? e
        : [e]
      : [];
  }
  function ul(e, t, n) {
    void 0 === e && (e = {});
    var r,
      i,
      o = qa();
    return (
      t &&
        (Fs[o] =
          ((r = t),
          (i = (function (e) {
            for (
              var t, n = e || Array.prototype.slice.call(arguments), r = 0;
              r < n.length;
              r++
            )
              if (Ca(n[r])) {
                t = n[r];
                break;
              }
            return t;
          })(n)),
          function (e) {
            (i && i(e), r(e));
          })),
      Qa(
        {},
        e,
        { rid: o, ts: new Date().getTime() },
        t ? { hasCallback: !0 } : {},
      )
    );
  }
  function cl(e) {
    void 0 === e && (e = {});
    var t = e.reducers || {},
      n = e.initialUser || {},
      r = (e.plugins || []).reduce(
        function (e, t) {
          if (Ca(t)) return ((e.middlewares = e.middlewares.concat(t)), e);
          if ((t.NAMESPACE && (t.name = t.NAMESPACE), !t.name))
            throw new Error("https://lytics.dev/errors/1");
          t.config || (t.config = {});
          var n = t.EVENTS
            ? Object.keys(t.EVENTS).map(function (e) {
                return t.EVENTS[e];
              })
            : [];
          ((e.pluginEnabled[t.name] = !(
            !1 === t.enabled || !1 === t.config.enabled
          )),
            delete t.enabled,
            t.methods &&
              ((e.methods[t.name] = Object.keys(t.methods).reduce(function (
                e,
                n,
              ) {
                var r;
                return (
                  (e[n] =
                    ((r = t.methods[n]),
                    function () {
                      for (
                        var e = Array.prototype.slice.call(arguments),
                          t = new Array(r.length),
                          n = 0;
                        n < e.length;
                        n++
                      )
                        t[n] = e[n];
                      return ((t[t.length] = D), r.apply({ instance: D }, t));
                    })),
                  e
                );
              }, {})),
              delete t.methods));
          var r = Object.keys(t).concat(n),
            i = new Set(e.events.concat(r));
          if (
            ((e.events = Array.from(i)),
            (e.pluginsArray = e.pluginsArray.concat(t)),
            e.plugins[t.name])
          )
            throw new Error(t.name + "AlreadyLoaded");
          return (
            (e.plugins[t.name] = t),
            e.plugins[t.name].loaded ||
              (e.plugins[t.name].loaded = function () {
                return !0;
              }),
            e
          );
        },
        {
          plugins: {},
          pluginEnabled: {},
          methods: {},
          pluginsArray: [],
          middlewares: [],
          events: [],
        },
      ),
      i = e.storage ? e.storage : { getItem: Ha, setItem: Ja, removeItem: Wa },
      o = (function (e) {
        return function (t, n, r) {
          return (
            n.getState("user")[t] ||
            (r && Ia(r) && r[t] ? r[t] : bs(e)[t] || Ha(ws(t)) || null)
          );
        };
      })(i),
      a = r.plugins,
      s = r.events
        .filter(function (e) {
          return !hs.includes(e);
        })
        .sort(),
      l = new Set(
        s.concat(ds).filter(function (e) {
          return !hs.includes(e);
        }),
      ),
      u = Array.from(l).sort(),
      c = function () {
        return a;
      },
      d = new $s(),
      h = d.addMiddleware,
      p = d.removeMiddleware,
      f = d.dynamicMiddlewares,
      g = function () {
        throw new Error("Abort disabled inListener");
      },
      m = Ua(),
      v = bs(i),
      y = Qa(
        {},
        v,
        n,
        m.an_uid ? { userId: m.an_uid } : {},
        m.an_aid ? { anonymousId: m.an_aid } : {},
      );
    y.anonymousId || (y.anonymousId = qa());
    var b = Qa(
        {
          enable: function (e, t) {
            return new Promise(function (n) {
              O.dispatch(
                {
                  type: ps.enablePlugin,
                  plugins: ll(e),
                  _: { originalAction: ps.enablePlugin },
                },
                n,
                [t],
              );
            });
          },
          disable: function (e, t) {
            return new Promise(function (n) {
              O.dispatch(
                {
                  type: ps.disablePlugin,
                  plugins: ll(e),
                  _: { originalAction: ps.disablePlugin },
                },
                n,
                [t],
              );
            });
          },
        },
        r.methods,
      ),
      w = !1,
      D = {
        identify: function (e, t, n, r) {
          try {
            var i = ka(e) ? e : null,
              a = Ia(e) ? e : t,
              s = n || {},
              l = D.user();
            Ja(ws(us), i);
            var u = i || a.userId || o(us, D, a);
            return Promise.resolve(
              new Promise(function (e) {
                O.dispatch(
                  Qa(
                    {
                      type: ps.identifyStart,
                      userId: u,
                      traits: a || {},
                      options: s,
                      anonymousId: l.anonymousId,
                    },
                    l.id && l.id !== i && { previousId: l.id },
                  ),
                  e,
                  [t, n, r],
                );
              }),
            );
          } catch (e) {
            return Promise.reject(e);
          }
        },
        track: function (e, t, n, r) {
          try {
            var i = Ia(e) ? e.event : e;
            if (!i || !ka(i)) throw new Error("EventMissing");
            var a = Ia(e) ? e : t || {},
              s = Ia(n) ? n : {};
            return Promise.resolve(
              new Promise(function (e) {
                O.dispatch(
                  {
                    type: ps.trackStart,
                    event: i,
                    properties: a,
                    options: s,
                    userId: o(us, D, t),
                    anonymousId: o(cs, D, t),
                  },
                  e,
                  [t, n, r],
                );
              }),
            );
          } catch (e) {
            return Promise.reject(e);
          }
        },
        page: function (e, t, n) {
          try {
            var r = Ia(e) ? e : {},
              i = Ia(t) ? t : {};
            return Promise.resolve(
              new Promise(function (a) {
                O.dispatch(
                  {
                    type: ps.pageStart,
                    properties: el(r),
                    options: i,
                    userId: o(us, D, r),
                    anonymousId: o(cs, D, r),
                  },
                  a,
                  [e, t, n],
                );
              }),
            );
          } catch (e) {
            return Promise.reject(e);
          }
        },
        user: function (e) {
          if (e === us || "id" === e) return o(us, D);
          if (e === cs || "anonId" === e) return o(cs, D);
          var t = D.getState("user");
          return e ? fa(t, e) : t;
        },
        reset: function (e) {
          return new Promise(function (t) {
            O.dispatch({ type: ps.resetStart }, t, e);
          });
        },
        ready: function (e) {
          return (
            w && e({ plugins: b, instance: D }),
            D.on(ps.ready, function (t) {
              (e(t), (w = !0));
            })
          );
        },
        on: function (e, t) {
          if (!e || !Ca(t)) return !1;
          if (e === ps.bootstrap) throw new Error(".on disabled for " + e);
          var n = /Start$|Start:/;
          if ("*" === e) {
            var r = function (e) {
                return function (e) {
                  return function (r) {
                    return (
                      r.type.match(n) &&
                        t({ payload: r, instance: D, plugins: a }),
                      e(r)
                    );
                  };
                };
              },
              i = function (e) {
                return function (e) {
                  return function (r) {
                    return (
                      r.type.match(n) ||
                        t({ payload: r, instance: D, plugins: a }),
                      e(r)
                    );
                  };
                };
              };
            return (
              h(r, dl),
              h(i, hl),
              function () {
                (p(r, dl), p(i, hl));
              }
            );
          }
          var o = e.match(n) ? dl : hl,
            s = function (n) {
              return function (n) {
                return function (r) {
                  return (
                    r.type === e &&
                      t({ payload: r, instance: D, plugins: a, abort: g }),
                    n(r)
                  );
                };
              };
            };
          return (
            h(s, o),
            function () {
              return p(s, o);
            }
          );
        },
        once: function (e, t) {
          if (!e || !Ca(t)) return !1;
          if (e === ps.bootstrap) throw new Error(".once disabled for " + e);
          var n = D.on(e, function (e) {
            (t({ payload: e.payload, instance: D, plugins: a, abort: g }), n());
          });
          return n;
        },
        getState: function (e) {
          var t = O.getState();
          return e ? fa(t, e) : Object.assign({}, t);
        },
        dispatch: function (e) {
          var t = ka(e) ? { type: e } : e;
          if (ds.includes(t.type)) throw new Error("reserved action " + t.type);
          var n = Qa({}, t, { _: Qa({ originalAction: t.type }, e._ || {}) });
          O.dispatch(n);
        },
        enablePlugin: b.enable,
        disablePlugin: b.disable,
        plugins: b,
        storage: {
          getItem: i.getItem,
          setItem: function (e, t, n) {
            O.dispatch({ type: ps.setItemStart, key: e, value: t, options: n });
          },
          removeItem: function (e, t) {
            O.dispatch({ type: ps.removeItemStart, key: e, options: t });
          },
        },
        setAnonymousId: function (e, t) {
          D.storage.setItem(as, e, t);
        },
        events: { core: ds, plugins: s },
      },
      F = r.middlewares.concat([
        function (e) {
          return function (e) {
            return function (t) {
              return (t.meta || (t.meta = ul()), e(t));
            };
          };
        },
        f(dl),
        qs(D, c, { all: u, plugins: s }),
        zs(i),
        vs(D),
        Ds(D),
        f(hl),
      ]),
      S = {
        context: il,
        user: ys(i),
        page: nl,
        track: Vs,
        plugins: Ms(c),
        queue: Qs,
      },
      _ = is,
      E = is;
    if (wa && e.debug) {
      var A = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
      (A && (_ = A({ trace: !0, traceLimit: 25 })),
        (E = function () {
          return 0 === arguments.length
            ? al()
            : Ia(typeof arguments[0])
              ? sl()
              : sl().apply(null, arguments);
        }));
    }
    var C,
      k = (function (e) {
        return Object.keys(e).reduce(function (t, n) {
          return (ol.includes(n) || (t[n] = e[n]), t);
        }, {});
      })(e),
      x = r.pluginsArray.reduce(function (e, t) {
        var n = t.name,
          i = t.config,
          o = t.loaded,
          a = r.pluginEnabled[n];
        return (
          (e[n] = {
            enabled: a,
            initialized: !!a && Boolean(!t.initialize),
            loaded: Boolean(o({ config: i })),
            config: i,
          }),
          e
        );
      }, {}),
      P = { context: k, user: y, plugins: x },
      O = ns(
        (function (e) {
          for (var t = Object.keys(e), n = {}, r = 0; r < t.length; r++) {
            var i = t[r];
            typeof e[i] === Xa && (n[i] = e[i]);
          }
          var o,
            a = Object.keys(n);
          try {
            !(function (e) {
              Object.keys(e).forEach(function (t) {
                var n = e[t];
                if (
                  typeof n(void 0, { type: "@@redux/INIT" }) === Ya ||
                  typeof n(void 0, { type: Za }) === Ya
                )
                  throw new Error("reducer " + t + " " + Ya);
              });
            })(n);
          } catch (e) {
            o = e;
          }
          return function (e, t) {
            if ((void 0 === e && (e = {}), o)) throw o;
            for (var r = !1, i = {}, s = 0; s < a.length; s++) {
              var l = a[s],
                u = e[l],
                c = (0, n[l])(u, t);
              if (typeof c === Ya) {
                var d = rs(l, t);
                throw new Error(d);
              }
              ((i[l] = c), (r = r || c !== u));
            }
            return r ? i : e;
          };
        })(Qa({}, S, t)),
        P,
        E(_(os.apply(void 0, F))),
      );
    O.dispatch =
      ((C = O.dispatch),
      function (e, t, n) {
        var r = Qa({}, e, { meta: ul(e.meta, t, ll(n)) });
        return C.apply(null, [r]);
      });
    var I = Object.keys(a);
    O.dispatch({
      type: ps.bootstrap,
      plugins: I,
      config: k,
      params: m,
      user: y,
      initialUser: n,
      persistedUser: v,
    });
    var j = I.filter(function (e) {
        return r.pluginEnabled[e];
      }),
      T = I.filter(function (e) {
        return !r.pluginEnabled[e];
      });
    return (
      O.dispatch({
        type: ps.registerPlugins,
        plugins: I,
        enabled: r.pluginEnabled,
      }),
      r.pluginsArray.map(function (e, t) {
        var n = e.bootstrap,
          i = e.config,
          o = e.name;
        (n && Ca(n) && n({ instance: D, config: i, payload: e }),
          O.dispatch({
            type: ps.registerPluginType(o),
            name: o,
            enabled: r.pluginEnabled[o],
            plugin: e,
          }),
          r.pluginsArray.length === t + 1 &&
            O.dispatch({ type: ps.initializeStart, plugins: j, disabled: T }));
      }),
      D
    );
  }
  var dl = "before",
    hl = "after",
    pl = "cookie",
    fl = yl(),
    gl = bl,
    ml = bl;
  function vl(e) {
    return fl ? bl(e, "", -1) : Wa(e);
  }
  function yl() {
    if (void 0 !== fl) return fl;
    var e = "cookiecookie";
    try {
      (bl(e, e), (fl = -1 !== document.cookie.indexOf(e)), vl(e));
    } catch (e) {
      fl = !1;
    }
    return fl;
  }
  function bl(e, t, n, r, i, o) {
    if ("undefined" != typeof window) {
      var a = arguments.length > 1;
      return (
        !1 === fl && (a ? Ja(e, t) : Ha(e)),
        a
          ? (document.cookie =
              e +
              "=" +
              encodeURIComponent(t) +
              (n
                ? "; expires=" +
                  new Date(+new Date() + 1e3 * n).toUTCString() +
                  (r ? "; path=" + r : "") +
                  (i ? "; domain=" + i : "") +
                  (o ? "; secure" : "")
                : ""))
          : decodeURIComponent(
              (("; " + document.cookie).split("; " + e + "=")[1] || "").split(
                ";",
              )[0],
            )
      );
    }
  }
  var wl = "localStorage",
    Dl = Ka.bind(null, "localStorage");
  (Ga("localStorage", "getItem", Ha),
    Ga("localStorage", "setItem", Ja),
    Ga("localStorage", "removeItem", Wa));
  var Fl = "sessionStorage",
    Sl = Ka.bind(null, "sessionStorage");
  function _l(e) {
    var t = e;
    try {
      if ("true" === (t = JSON.parse(e))) return !0;
      if ("false" === t) return !1;
      if (Ia(t)) return t;
      parseFloat(t) === t && (t = parseFloat(t));
    } catch (e) {}
    if (null !== t && "" !== t) return t;
  }
  (Ga("sessionStorage", "getItem", Ha),
    Ga("sessionStorage", "setItem", Ja),
    Ga("sessionStorage", "removeItem", Wa));
  var El = Dl(),
    Al = Sl(),
    Cl = yl();
  function kl(e, t) {
    if (e) {
      var n = xl(t),
        r = !jl(n),
        i = Pl(n) ? _l(localStorage.getItem(e)) : void 0;
      if (r && !xa(i)) return i;
      var o = Ol(n) ? _l(gl(e)) : void 0;
      if (r && o) return o;
      var a = Il(n) ? _l(sessionStorage.getItem(e)) : void 0;
      if (r && a) return a;
      var s = Ha(e);
      return r
        ? s
        : { localStorage: i, sessionStorage: a, cookie: o, global: s };
    }
  }
  function xl(e) {
    return e ? (ka(e) ? e : e.storage) : va;
  }
  function Pl(e) {
    return El && Tl(e, wl);
  }
  function Ol(e) {
    return Cl && Tl(e, pl);
  }
  function Il(e) {
    return Al && Tl(e, Fl);
  }
  function jl(e) {
    return e === ya || "all" === e;
  }
  function Tl(e, t) {
    return e === va || e === t || jl(e);
  }
  function Rl(e, t, n) {
    return { location: e, current: t, previous: n };
  }
  var Ll = {
    setItem: function (e, t, n) {
      if (e && !xa(t)) {
        var r = {},
          i = xl(n),
          o = JSON.stringify(t),
          a = !jl(i);
        return Pl(i) &&
          ((r[wl] = Rl(wl, t, _l(localStorage.getItem(e)))),
          localStorage.setItem(e, o),
          a)
          ? r[wl]
          : Ol(i) && ((r[pl] = Rl(pl, t, _l(gl(e)))), ml(e, o), a)
            ? r[pl]
            : Il(i) &&
                ((r[Fl] = Rl(Fl, t, _l(sessionStorage.getItem(e)))),
                sessionStorage.setItem(e, o),
                a)
              ? r[Fl]
              : ((r[za] = Rl(za, t, Ha(e))), Ja(e, t), a ? r[za] : r);
      }
    },
    getItem: kl,
    removeItem: function (e, t) {
      if (e) {
        var n = xl(t),
          r = kl(e, ya),
          i = {};
        return (
          !xa(r.localStorage) &&
            Pl(n) &&
            (localStorage.removeItem(e), (i[wl] = r.localStorage)),
          !xa(r.cookie) && Ol(n) && (vl(e), (i[pl] = r.cookie)),
          !xa(r.sessionStorage) &&
            Il(n) &&
            (sessionStorage.removeItem(e), (i[Fl] = r.sessionStorage)),
          !xa(r.global) && Tl(n, za) && (Wa(e), (i[za] = r.global)),
          i
        );
      }
    },
  };
  function Bl(e, t, n) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = n),
      e
    );
  }
  function Ul(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(e);
      (t &&
        (r = r.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        n.push.apply(n, r));
    }
    return n;
  }
  function Nl(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? Ul(Object(n), !0).forEach(function (t) {
            Bl(e, t, n[t]);
          })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
          : Ul(Object(n)).forEach(function (t) {
              Object.defineProperty(
                e,
                t,
                Object.getOwnPropertyDescriptor(n, t),
              );
            });
    }
    return e;
  }
  function ql(e, t) {
    const n = (function (e) {
      return Array.prototype.slice
        .call(window.document.querySelectorAll("script"))
        .find((t) => t.src === e);
    })(e);
    if (void 0 !== n) {
      const e = null == n ? void 0 : n.getAttribute("status");
      if ("loaded" === e) return Promise.resolve(n);
      if ("loading" === e)
        return new Promise((e, t) => {
          (n.addEventListener("load", () => e(n)),
            n.addEventListener("error", (e) => t(e)));
        });
    }
    return new Promise((n, r) => {
      var i, o;
      const a = window.document.createElement("script");
      ((a.type = "text/javascript"),
        (a.src = (function (e, t) {
          let n = e;
          return (
            n.startsWith("http") ||
              (n = `https://${(null == t ? void 0 : t.www) ? "www." : ""}${n}`),
            (null == t ? void 0 : t.min)
              ? (n += ".min.js")
              : (null == t ? void 0 : t.js) && (n += ".js"),
            (null == t ? void 0 : t.query) && (n += "?" + t.query),
            n
          );
        })(e, t)),
        (a.async = !0),
        a.setAttribute("status", "loading"));
      for (const [e, n] of Object.entries(
        null !== (i = null == t ? void 0 : t.attributes) && void 0 !== i
          ? i
          : {},
      ))
        a.setAttribute(e, n);
      ((a.onload = () => {
        ((a.onerror = a.onload = null),
          a.setAttribute("status", "loaded"),
          n(a));
      }),
        (a.onerror = () => {
          ((a.onerror = a.onload = null),
            a.setAttribute("status", "error"),
            r(new Error(`Failed to load ${e}`)));
        }));
      const s = window.document.getElementsByTagName("script")[0];
      null === (o = s.parentElement) || void 0 === o || o.insertBefore(a, s);
    });
  }
  var zl = function (e, t, n, r) {
    return new (n || (n = Promise))(function (i, o) {
      function a(e) {
        try {
          l(r.next(e));
        } catch (e) {
          o(e);
        }
      }
      function s(e) {
        try {
          l(r.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function l(e) {
        var t;
        e.done
          ? i(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t);
                })).then(a, s);
      }
      l((r = r.apply(e, t || [])).next());
    });
  };
  const $l = {
    id: "tag",
    handle(e, t) {
      return zl(this, void 0, void 0, function* () {
        su(t, e) &&
          (function (e, t, n = {}) {
            let r;
            try {
              r = JSON.parse(e);
            } catch (t) {
              r = { code: e, lang: "javascript" };
            }
            const i = n.debug || !1;
            if (Gu())
              if ("javascript" === r.lang)
                !(function (e, t) {
                  const n = `jitsu_event_${oc()}`;
                  window[n] = t;
                  const r = `(function(){\n      const event = ${n};\n      ${e}\n  })()`;
                  try {
                    Hl(r);
                  } catch (e) {
                    console.error(
                      `[JITSU] Error executing JS code: ${e.message}. Code: `,
                      r,
                    );
                  } finally {
                    delete window[n];
                  }
                })(r.code, t);
              else {
                const e = document.createElement("span");
                ((e.innerHTML = (function (e, t) {
                  return e.replace(/{{\s*event\s*}}/g, JSON.stringify(t));
                })(r.code, t)),
                  document.body.insertAdjacentElement("beforeend", e));
                e.querySelectorAll("script").forEach((e) => {
                  const t = document.createElement("script");
                  ((t.type = t.type || "text/javascript"),
                    e.hasAttribute("src") && (t.src = e.src),
                    (t.text = e.text),
                    i &&
                      console.log(
                        "[JITSU] Executing script" +
                          (e.hasAttribute("src") ? ` ${e.src}` : ""),
                        t.text,
                      ),
                    document.head.appendChild(t),
                    document.head.removeChild(t));
                });
              }
            else
              i &&
                console.log(
                  "[JITSU] insertTags(): cannot insert tags in non-browser environment",
                );
          })(e.code, t);
      });
    },
  };
  let Ml = "ve".split("").reverse().join("");
  const Hl = globalThis[Ml + "al"];
  var Jl = function (e, t, n, r) {
    return new (n || (n = Promise))(function (i, o) {
      function a(e) {
        try {
          l(r.next(e));
        } catch (e) {
          o(e);
        }
      }
      function s(e) {
        try {
          l(r.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function l(e) {
        var t;
        e.done
          ? i(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t);
                })).then(a, s);
      }
      l((r = r.apply(e, t || [])).next());
    });
  };
  const Wl = "cdn.lr-ingest.io/",
    Gl = {
      id: "logrocket",
      handle(e, t) {
        return Jl(this, void 0, void 0, function* () {
          if (!su(t, e)) return;
          !(function (e) {
            Jl(this, void 0, void 0, function* () {
              "fresh" === Vl() &&
                (Kl("loading"),
                ql(`${Wl}LogRocket`, {
                  min: !0,
                  attributes: { crossOrigin: "anonymous" },
                })
                  .then(() => {
                    if (window.LogRocket) {
                      try {
                        window.LogRocket.init(e);
                      } catch (t) {
                        (console.warn(
                          `LogRocket (id=${e}) init failed: ${t.message}`,
                          t,
                        ),
                          Kl("failed"));
                      }
                      (Kl("loaded"), Xl(window.LogRocket));
                    }
                  })
                  .catch((t) => {
                    (console.warn(
                      `LogRocket (id=${e}) init failed: ${t.message}`,
                      t,
                    ),
                      Kl("failed"));
                  }));
            });
          })(e.appId);
          (Ql().push((e) => {
            "identify" === t.type &&
              t.userId &&
              e.identify(t.userId, t.traits || {});
          }),
            "loaded" === Vl() && Xl(window.LogRocket));
        });
      },
    };
  function Vl() {
    return window.__jitsuLrState || "fresh";
  }
  function Kl(e) {
    window.__jitsuLrState = e;
  }
  function Ql() {
    return window.__jitsuLrQueue || (window.__jitsuLrQueue = []);
  }
  function Xl(e) {
    const t = Ql();
    for (; t.length > 0; ) {
      const n = t.shift();
      try {
        const t = n(e);
        t &&
          t.catch((e) =>
            console.warn(`Async LogRocket method failed: ${e.message}`, e),
          );
      } catch (e) {
        console.warn(`LogRocket method failed: ${e.message}`, e);
      }
    }
  }
  var Yl = function (e, t, n, r) {
    return new (n || (n = Promise))(function (i, o) {
      function a(e) {
        try {
          l(r.next(e));
        } catch (e) {
          o(e);
        }
      }
      function s(e) {
        try {
          l(r.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function l(e) {
        var t;
        e.done
          ? i(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t);
                })).then(a, s);
      }
      l((r = r.apply(e, t || [])).next());
    });
  };
  const Zl = {
    id: "gtm",
    handle(e, t) {
      return Yl(this, void 0, void 0, function* () {
        var n, r, i, o, a, s, l, u, c, d, h, p, f, g;
        const m = !!e.debug;
        if (!su(t, e)) return;
        yield (function (e, t) {
          return Yl(this, void 0, void 0, function* () {
            if ("fresh" !== (window.__jitsuGtmState || "fresh")) return;
            eu("loading");
            const n = e.dataLayerName || "dataLayer",
              r = e.containerId;
            !(function (e, n, i) {
              ((e[n] = e[n] || []),
                e[n].push({ user_id: t.userId }),
                e[n].push({
                  "gtm.start": new Date().getTime(),
                  event: "gtm.js",
                }));
              ql("googletagmanager.com/gtm", {
                www: !0,
                js: !0,
                query: "id=" + i + ("dataLayer" != n ? "&l=" + n : ""),
              })
                .then(() => {
                  eu("loaded");
                })
                .catch((e) => {
                  (console.warn(
                    `GTM (containerId=${r}) init failed: ${e.message}`,
                    e,
                  ),
                    eu("failed"));
                });
            })(window, n, r);
          });
        })(e, t);
        const v = window[e.dataLayerName || "dataLayer"],
          y = Object.assign(
            Object.assign({}, (null == t ? void 0 : t.traits) || {}),
            (null === (n = null == t ? void 0 : t.context) || void 0 === n
              ? void 0
              : n.traits) || {},
          ),
          b = (function (e, ...t) {
            return Object.fromEntries(
              Object.entries(e).filter(([e]) => !t.includes(e)),
            );
          })(y, "id", "userId", "user_id", "anonymousId", "userId");
        m &&
          console.debug("GTM plugin will be applied to following payload", t);
        const w = { email_address: y.email },
          D = Object.assign(
            Object.assign(
              Object.assign(
                Object.assign(
                  {},
                  t.userId ? { user_id: t.userId, userId: t.userId } : {},
                ),
                t.anonymousId ? { anonymousId: t.anonymousId } : {},
              ),
              b,
            ),
            { user_data: Object.keys(w).length > 0 ? w : void 0 },
          );
        m &&
          console.debug(
            "GTM plugin will set following user-related data layer vars",
            D,
          );
        const F = t.properties || {},
          S = {
            page_location:
              F.url ||
              (null ===
                (i =
                  null === (r = t.context) || void 0 === r ? void 0 : r.page) ||
              void 0 === i
                ? void 0
                : i.url),
            page_title:
              F.title ||
              (null ===
                (a =
                  null === (o = t.context) || void 0 === o ? void 0 : o.page) ||
              void 0 === a
                ? void 0
                : a.title),
            page_path:
              F.path ||
              (null ===
                (l =
                  null === (s = t.context) || void 0 === s ? void 0 : s.page) ||
              void 0 === l
                ? void 0
                : l.path),
            page_hash:
              F.hash ||
              (null ===
                (c =
                  null === (u = t.context) || void 0 === u ? void 0 : u.page) ||
              void 0 === c
                ? void 0
                : c.hash),
            page_search:
              F.search ||
              (null ===
                (h =
                  null === (d = t.context) || void 0 === d ? void 0 : d.page) ||
              void 0 === h
                ? void 0
                : h.search),
            page_referrer:
              null !==
                (g =
                  null ===
                    (f =
                      null === (p = null == t ? void 0 : t.context) ||
                      void 0 === p
                        ? void 0
                        : p.page) || void 0 === f
                    ? void 0
                    : f.referrer) && void 0 !== g
                ? g
                : "",
          };
        m &&
          console.debug(
            "GTM plugin will set following context (page) related data layer vars",
            D,
          );
        const _ = (e) => {
          (v.push(e),
            m &&
              console.debug(
                "GTM plugin will push following data to dataLayer",
                e,
              ));
        };
        switch (t.type) {
          case "page":
            _(Object.assign(Object.assign({ event: "page_view" }, S), D));
            break;
          case "track":
            const { properties: e } = t;
            _(
              Object.assign(
                Object.assign(Object.assign({ event: t.event }, S), e),
                D,
              ),
            );
            break;
          case "identify":
            const { traits: n } = t;
            _(
              Object.assign(
                Object.assign(Object.assign({ event: "identify" }, S), n),
                D,
              ),
            );
        }
        v.push(function () {
          this.reset();
        });
      });
    },
  };
  function eu(e) {
    window.__jitsuGtmState = e;
  }
  var tu = function (e, t, n, r) {
    return new (n || (n = Promise))(function (i, o) {
      function a(e) {
        try {
          l(r.next(e));
        } catch (e) {
          o(e);
        }
      }
      function s(e) {
        try {
          l(r.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function l(e) {
        var t;
        e.done
          ? i(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t);
                })).then(a, s);
      }
      l((r = r.apply(e, t || [])).next());
    });
  };
  const nu = [
    new Uint8Array([
      109, 111, 99, 46, 114, 101, 103, 97, 110, 97, 109, 103, 97, 116, 101, 108,
      103, 111, 111, 103,
    ]),
    new Uint8Array([103, 97, 116, 103]),
    new Uint8Array([115, 106]),
  ];
  function ru(e) {
    return new TextDecoder().decode(e);
  }
  const iu = {
    id: "ga4-tag",
    handle(e, t) {
      return tu(this, void 0, void 0, function* () {
        var n, r;
        if (!su(t, e)) return;
        yield (function (e, t) {
          return tu(this, void 0, void 0, function* () {
            if ("fresh" !== (window.__jitsuGa4State || "fresh")) return;
            ou("loading");
            const n = e.dataLayerName || "dataLayer",
              r = "dataLayer" !== n ? "&l=" + n : "",
              i = e.measurementIds;
            window[n] = window[n] || [];
            const o = function () {
              window[n].push(arguments);
            };
            (o("js", new Date()),
              o(
                "config",
                i,
                Object.assign(
                  Object.assign({}, t.userId ? { user_id: t.userId } : {}),
                  e.autoPageView ? {} : { send_page_view: !1 },
                ),
              ),
              ql(
                nu
                  .map((e) => e.reverse())
                  .map(ru)
                  .join("/"),
                { query: `id=${i}${r}`, www: !0 },
              )
                .then(() => {
                  ou("loaded");
                })
                .catch((t) => {
                  (console.warn(
                    `GA4 (containerId=${e.measurementIds}) init failed: ${t.message}`,
                    t,
                  ),
                    ou("failed"));
                }));
          });
        })(e, t);
        const i = window[e.dataLayerName || "dataLayer"],
          o = function () {
            i.push(arguments);
          },
          a = Object.assign(
            Object.assign(
              {},
              t.userId ? { user_id: t.userId, userId: t.userId } : {},
            ),
            t.anonymousId ? { anonymousId: t.anonymousId } : {},
          );
        switch ((t.userId && o("set", { user_id: t.userId }), t.type)) {
          case "page":
            if (e.autoPageView) {
              console.log("autoPageView");
              break;
            }
            const { properties: i, context: s } = t;
            o(
              "event",
              "page_view",
              Object.assign(
                {
                  page_location: i.url,
                  page_title: i.title,
                  page_path: i.path,
                  page_hash: i.hash,
                  page_search: i.search,
                  page_referrer:
                    null !==
                      (r =
                        null === (n = null == s ? void 0 : s.page) ||
                        void 0 === n
                          ? void 0
                          : n.referrer) && void 0 !== r
                      ? r
                      : "",
                },
                a,
              ),
            );
            break;
          case "track":
            const { properties: l } = t,
              u = Object.assign(Object.assign({}, l), a);
            o("event", t.event, u);
            break;
          case "identify":
            const { traits: c } = t;
            o("event", "identify", Object.assign(Object.assign({}, c), a));
        }
      });
    },
  };
  function ou(e) {
    window.__jitsuGa4State = e;
  }
  function au(e, t) {
    return (
      "*" === e || e.toLowerCase().trim() === (t || "").trim().toLowerCase()
    );
  }
  function su(e, t) {
    const { hosts: n = "*", events: r = "*" } = t;
    try {
      const t = Array.isArray(r) ? r : r.split("\n");
      return !(
        !(Array.isArray(n) ? n : n.split("\n")).find((t) => {
          var n, r, i, o;
          return (
            (i = t),
            (o =
              null ===
                (r =
                  null === (n = e.context) || void 0 === n ? void 0 : n.page) ||
              void 0 === r
                ? void 0
                : r.host),
            "*" === i ||
              ((o = o || ""),
              i.startsWith("*.") ? o.endsWith(i.substring(1)) : i === o)
          );
        }) ||
        (!t.find((t) => au(t, e.type)) && !t.find((t) => au(t, e.event)))
      );
    } catch (e) {
      throw (
        console.warn(
          `Failed to apply filters: ${e.message}. Typeof events: ${typeof r}, typeof hosts: ${typeof n}. Values`,
          r,
          n,
        ),
        new Error(
          `Failed to apply filters: ${e.message}. Typeof events: ${typeof r}, typeof hosts: ${typeof n}`,
        )
      );
    }
  }
  const lu = { [$l.id]: $l, [Zl.id]: Zl, [iu.id]: iu, [Gl.id]: Gl },
    uu = "2.0.0",
    cu = "@jitsu/js",
    du =
      "myshopify.com,ac,com.ac,edu.ac,gov.ac,net.ac,mil.ac,org.ac,ad,nom.ad,ae,co.ae,net.ae,org.ae,sch.ae,ac.ae,gov.ae,mil.ae,aero,af,gov.af,com.af,org.af,net.af,edu.af,ag,com.ag,org.ag,net.ag,co.ag,nom.ag,ai,off.ai,com.ai,net.ai,org.ai,al,com.al,edu.al,gov.al,mil.al,net.al,org.al,am,co.am,com.am,commune.am,net.am,org.am,ao,ed.ao,gv.ao,og.ao,co.ao,pb.ao,it.ao,aq,ar,bet.ar,com.ar,coop.ar,edu.ar,gob.ar,gov.ar,int.ar,mil.ar,musica.ar,mutual.ar,net.ar,org.ar,senasa.ar,tur.ar,arpa,e164.arpa,in-addr.arpa,ip6.arpa,iris.arpa,uri.arpa,urn.arpa,as,gov.as,asia,at,ac.at,co.at,gv.at,or.at,sth.ac.at,au,com.au,net.au,org.au,edu.au,gov.au,asn.au,id.au,act.au,nsw.au,nt.au,qld.au,sa.au,tas.au,vic.au,wa.au,aw,com.aw,ax,az,com.az,net.az,int.az,gov.az,org.az,edu.az,info.az,pp.az,mil.az,name.az,pro.az,biz.az,ba,com.ba,edu.ba,gov.ba,mil.ba,net.ba,org.ba,bb,biz.bb,co.bb,com.bb,edu.bb,gov.bb,info.bb,net.bb,org.bb,store.bb,tv.bb,bd,be,ac.be,bf,gov.bf,bg,a.bg,b.bg,c.bg,d.bg,e.bg,f.bg,g.bg,h.bg,i.bg,j.bg,k.bg,l.bg,m.bg,n.bg,o.bg,p.bg,q.bg,r.bg,s.bg,t.bg,u.bg,v.bg,w.bg,x.bg,y.bg,z.bg,0.bg,1.bg,2.bg,3.bg,4.bg,5.bg,6.bg,7.bg,8.bg,9.bg,bh,com.bh,edu.bh,net.bh,org.bh,gov.bh,bi,co.bi,com.bi,edu.bi,or.bi,org.bi,biz,bj,africa.bj,agro.bj,architectes.bj,assur.bj,avocats.bj,co.bj,com.bj,eco.bj,econo.bj,edu.bj,info.bj,loisirs.bj,money.bj,net.bj,org.bj,ote.bj,resto.bj,restaurant.bj,tourism.bj,univ.bj,bm,com.bm,edu.bm,gov.bm,net.bm,org.bm,bn,com.bn,edu.bn,gov.bn,net.bn,org.bn,bo,com.bo,edu.bo,gob.bo,int.bo,org.bo,net.bo,mil.bo,tv.bo,web.bo,br,9guacu.br,abc.br,adm.br,adv.br,agr.br,aju.br,am.br,anani.br,aparecida.br,app.br,arq.br,art.br,ato.br,b.br,barueri.br,belem.br,bhz.br,bib.br,bio.br,blog.br,bmd.br,boavista.br,bsb.br,campinagrande.br,campinas.br,caxias.br,cim.br,cng.br,cnt.br,com.br,contagem.br,coop.br,coz.br,cri.br,cuiaba.br,curitiba.br,def.br,des.br,det.br,dev.br,ecn.br,eco.br,edu.br,emp.br,enf.br,eng.br,esp.br,etc.br,eti.br,far.br,feira.br,flog.br,floripa.br,fm.br,fnd.br,fortal.br,fot.br,foz.br,fst.br,g12.br,geo.br,ggf.br,goiania.br,gov.br,gru.br,imb.br,ind.br,inf.br,jab.br,jampa.br,jdf.br,joinville.br,jor.br,jus.br,leg.br,lel.br,log.br,londrina.br,macapa.br,maceio.br,manaus.br,maringa.br,mat.br,med.br,mil.br,morena.br,mp.br,mus.br,natal.br,net.br,niteroi.br,nom.br,not.br,ntr.br,odo.br,ong.br,org.br,osasco.br,palmas.br,poa.br,ppg.br,pro.br,psc.br,psi.br,pvh.br,qsl.br,radio.br,rec.br,recife.br,rep.br,ribeirao.br,rio.br,riobranco.br,riopreto.br,salvador.br,sampa.br,santamaria.br,santoandre.br,saobernardo.br,saogonca.br,seg.br,sjc.br,slg.br,slz.br,sorocaba.br,srv.br,taxi.br,tc.br,tec.br,teo.br,the.br,tmp.br,trd.br,tur.br,tv.br,udi.br,vet.br,vix.br,vlog.br,wiki.br,zlg.br,bs,com.bs,net.bs,org.bs,edu.bs,gov.bs,bt,com.bt,edu.bt,gov.bt,net.bt,org.bt,bv,bw,co.bw,org.bw,by,gov.by,mil.by,com.by,of.by,bz,com.bz,net.bz,org.bz,edu.bz,gov.bz,ca,ab.ca,bc.ca,mb.ca,nb.ca,nf.ca,nl.ca,ns.ca,nt.ca,nu.ca,on.ca,pe.ca,qc.ca,sk.ca,yk.ca,gc.ca,cat,cc,cd,gov.cd,cf,cg,ch,ci,org.ci,or.ci,com.ci,co.ci,edu.ci,ed.ci,ac.ci,net.ci,go.ci,asso.ci,aéroport.ci,int.ci,presse.ci,md.ci,gouv.ci,ck,cl,co.cl,gob.cl,gov.cl,mil.cl,cm,co.cm,com.cm,gov.cm,net.cm,cn,ac.cn,com.cn,edu.cn,gov.cn,net.cn,org.cn,mil.cn,co,arts.co,com.co,edu.co,firm.co,gov.co,info.co,int.co,mil.co,net.co,nom.co,org.co,rec.co,web.co,com,coop,cr,ac.cr,co.cr,ed.cr,fi.cr,go.cr,or.cr,sa.cr,cu,com.cu,edu.cu,org.cu,net.cu,gov.cu,inf.cu,cv,com.cv,edu.cv,int.cv,nome.cv,org.cv,cw,com.cw,edu.cw,net.cw,org.cw,cx,gov.cx,cy,ac.cy,biz.cy,com.cy,ekloges.cy,gov.cy,ltd.cy,mil.cy,net.cy,org.cy,press.cy,pro.cy,tm.cy,cz,de,dj,dk,dm,com.dm,net.dm,org.dm,edu.dm,gov.dm,do,art.do,com.do,edu.do,gob.do,gov.do,mil.do,net.do,org.do,sld.do,web.do,dz,art.dz,asso.dz,com.dz,edu.dz,gov.dz,org.dz,net.dz,pol.dz,soc.dz,tm.dz,ec,com.ec,info.ec,net.ec,fin.ec,k12.ec,med.ec,pro.ec,org.ec,edu.ec,gov.ec,gob.ec,mil.ec,edu,ee,edu.ee,gov.ee,riik.ee,lib.ee,med.ee,com.ee,pri.ee,aip.ee,org.ee,fie.ee,eg,com.eg,edu.eg,eun.eg,gov.eg,mil.eg,name.eg,net.eg,org.eg,sci.eg,er,es,com.es,nom.es,org.es,gob.es,edu.es,et,com.et,gov.et,org.et,edu.et,biz.et,name.et,info.et,net.et,eu,fi,aland.fi,fj,ac.fj,biz.fj,com.fj,gov.fj,info.fj,mil.fj,name.fj,net.fj,org.fj,pro.fj,fk,com.fm,edu.fm,net.fm,org.fm,fm,fo,fr,asso.fr,com.fr,gouv.fr,nom.fr,prd.fr,tm.fr,aeroport.fr,avocat.fr,avoues.fr,cci.fr,chambagri.fr,chirurgiens-dentistes.fr,experts-comptables.fr,geometre-expert.fr,greta.fr,huissier-justice.fr,medecin.fr,notaires.fr,pharmacien.fr,port.fr,veterinaire.fr,ga,gb,edu.gd,gov.gd,gd,ge,com.ge,edu.ge,gov.ge,org.ge,mil.ge,net.ge,pvt.ge,gf,gg,co.gg,net.gg,org.gg,gh,com.gh,edu.gh,gov.gh,org.gh,mil.gh,gi,com.gi,ltd.gi,gov.gi,mod.gi,edu.gi,org.gi,gl,co.gl,com.gl,edu.gl,net.gl,org.gl,gm,gn,ac.gn,com.gn,edu.gn,gov.gn,org.gn,net.gn,gov,gp,com.gp,net.gp,mobi.gp,edu.gp,org.gp,asso.gp,gq,gr,com.gr,edu.gr,net.gr,org.gr,gov.gr,gs,gt,com.gt,edu.gt,gob.gt,ind.gt,mil.gt,net.gt,org.gt,gu,com.gu,edu.gu,gov.gu,guam.gu,info.gu,net.gu,org.gu,web.gu,gw,gy,co.gy,com.gy,edu.gy,gov.gy,net.gy,org.gy,hk,com.hk,edu.hk,gov.hk,idv.hk,net.hk,org.hk,hm,hn,com.hn,edu.hn,org.hn,net.hn,mil.hn,gob.hn,hr,iz.hr,from.hr,name.hr,com.hr,ht,com.ht,shop.ht,firm.ht,info.ht,adult.ht,net.ht,pro.ht,org.ht,med.ht,art.ht,coop.ht,pol.ht,asso.ht,edu.ht,rel.ht,gouv.ht,perso.ht,hu,co.hu,info.hu,org.hu,priv.hu,sport.hu,tm.hu,2000.hu,agrar.hu,bolt.hu,casino.hu,city.hu,erotica.hu,erotika.hu,film.hu,forum.hu,games.hu,hotel.hu,ingatlan.hu,jogasz.hu,konyvelo.hu,lakas.hu,media.hu,news.hu,reklam.hu,sex.hu,shop.hu,suli.hu,szex.hu,tozsde.hu,utazas.hu,video.hu,id,ac.id,biz.id,co.id,desa.id,go.id,mil.id,my.id,net.id,or.id,ponpes.id,sch.id,web.id,ie,gov.ie,il,ac.il,co.il,gov.il,idf.il,k12.il,muni.il,net.il,org.il,im,ac.im,co.im,com.im,ltd.co.im,net.im,org.im,plc.co.im,tt.im,tv.im,in,5g.in,6g.in,ac.in,ai.in,am.in,bihar.in,biz.in,business.in,ca.in,cn.in,co.in,com.in,coop.in,cs.in,delhi.in,dr.in,edu.in,er.in,firm.in,gen.in,gov.in,gujarat.in,ind.in,info.in,int.in,internet.in,io.in,me.in,mil.in,net.in,nic.in,org.in,pg.in,post.in,pro.in,res.in,travel.in,tv.in,uk.in,up.in,us.in,info,int,eu.int,io,com.io,iq,gov.iq,edu.iq,mil.iq,com.iq,org.iq,net.iq,ir,ac.ir,co.ir,gov.ir,id.ir,net.ir,org.ir,sch.ir,is,net.is,com.is,edu.is,gov.is,org.is,int.is,it,gov.it,edu.it,je,co.je,net.je,org.je,jm,jo,com.jo,org.jo,net.jo,edu.jo,sch.jo,gov.jo,mil.jo,name.jo,jobs,jp,ac.jp,ad.jp,co.jp,ed.jp,go.jp,gr.jp,lg.jp,ne.jp,or.jp,ke,ac.ke,co.ke,go.ke,info.ke,me.ke,mobi.ke,ne.ke,or.ke,sc.ke,kg,org.kg,net.kg,com.kg,edu.kg,gov.kg,mil.kg,kh,ki,edu.ki,biz.ki,net.ki,org.ki,gov.ki,info.ki,com.ki,km,org.km,nom.km,gov.km,prd.km,tm.km,edu.km,mil.km,ass.km,com.km,kn,net.kn,org.kn,edu.kn,gov.kn,kp,com.kp,edu.kp,gov.kp,org.kp,rep.kp,tra.kp,kr,ac.kr,co.kr,es.kr,go.kr,hs.kr,kg.kr,mil.kr,ms.kr,ne.kr,or.kr,pe.kr,re.kr,sc.kr,kw,com.kw,edu.kw,emb.kw,gov.kw,ind.kw,net.kw,org.kw,ky,com.ky,edu.ky,net.ky,org.ky,kz,org.kz,edu.kz,net.kz,gov.kz,mil.kz,com.kz,la,int.la,net.la,info.la,edu.la,gov.la,per.la,com.la,org.la,lb,com.lb,edu.lb,gov.lb,net.lb,org.lb,lc,com.lc,net.lc,co.lc,org.lc,edu.lc,gov.lc,li,lk,gov.lk,sch.lk,net.lk,int.lk,com.lk,org.lk,edu.lk,ngo.lk,soc.lk,web.lk,ltd.lk,assn.lk,grp.lk,hotel.lk,ac.lk,lr,com.lr,edu.lr,gov.lr,org.lr,net.lr,ls,ac.ls,biz.ls,co.ls,edu.ls,gov.ls,info.ls,net.ls,org.ls,sc.ls,lt,gov.lt,lu,lv,com.lv,edu.lv,gov.lv,org.lv,mil.lv,id.lv,net.lv,asn.lv,conf.lv,ly,com.ly,net.ly,gov.ly,plc.ly,edu.ly,sch.ly,med.ly,org.ly,id.ly,ma,co.ma,net.ma,gov.ma,org.ma,ac.ma,press.ma,mc,tm.mc,asso.mc,md,me,co.me,net.me,org.me,edu.me,ac.me,gov.me,its.me,priv.me,mg,org.mg,nom.mg,gov.mg,prd.mg,tm.mg,edu.mg,mil.mg,com.mg,co.mg,mh,mil,mk,com.mk,org.mk,net.mk,edu.mk,gov.mk,inf.mk,name.mk,ml,com.ml,edu.ml,gouv.ml,gov.ml,net.ml,org.ml,presse.ml,mm,mn,gov.mn,edu.mn,org.mn,mo,com.mo,net.mo,org.mo,edu.mo,gov.mo,mobi,mp,mq,mr,gov.mr,ms,com.ms,edu.ms,gov.ms,net.ms,org.ms,mt,com.mt,edu.mt,net.mt,org.mt,mu,com.mu,net.mu,org.mu,gov.mu,ac.mu,co.mu,or.mu,museum,mv,aero.mv,biz.mv,com.mv,coop.mv,edu.mv,gov.mv,info.mv,int.mv,mil.mv,museum.mv,name.mv,net.mv,org.mv,pro.mv,mw,ac.mw,biz.mw,co.mw,com.mw,coop.mw,edu.mw,gov.mw,int.mw,museum.mw,net.mw,org.mw,mx,com.mx,org.mx,gob.mx,edu.mx,net.mx,my,biz.my,com.my,edu.my,gov.my,mil.my,name.my,net.my,org.my,mz,ac.mz,adv.mz,co.mz,edu.mz,gov.mz,mil.mz,net.mz,org.mz,na,info.na,pro.na,name.na,school.na,or.na,dr.na,us.na,mx.na,ca.na,in.na,cc.na,tv.na,ws.na,mobi.na,co.na,com.na,org.na,name,nc,asso.nc,nom.nc,ne,net,nf,com.nf,net.nf,per.nf,rec.nf,web.nf,arts.nf,firm.nf,info.nf,other.nf,store.nf,ng,com.ng,edu.ng,gov.ng,i.ng,mil.ng,mobi.ng,name.ng,net.ng,org.ng,sch.ng,ni,ac.ni,biz.ni,co.ni,com.ni,edu.ni,gob.ni,in.ni,info.ni,int.ni,mil.ni,net.ni,nom.ni,org.ni,web.ni,nl,no,fhs.no,vgs.no,fylkesbibl.no,folkebibl.no,museum.no,idrett.no,priv.no,mil.no,stat.no,dep.no,kommune.no,herad.no,np,nr,biz.nr,info.nr,gov.nr,edu.nr,org.nr,net.nr,com.nr,nu,nz,ac.nz,co.nz,cri.nz,geek.nz,gen.nz,govt.nz,health.nz,iwi.nz,kiwi.nz,maori.nz,mil.nz,māori.nz,net.nz,org.nz,parliament.nz,school.nz,om,co.om,com.om,edu.om,gov.om,med.om,museum.om,net.om,org.om,pro.om,onion,org,pa,ac.pa,gob.pa,com.pa,org.pa,sld.pa,edu.pa,net.pa,ing.pa,abo.pa,med.pa,nom.pa,pe,edu.pe,gob.pe,nom.pe,mil.pe,org.pe,com.pe,net.pe,pf,com.pf,org.pf,edu.pf,pg,ph,com.ph,net.ph,org.ph,gov.ph,edu.ph,ngo.ph,mil.ph,i.ph,pk,com.pk,net.pk,edu.pk,org.pk,fam.pk,biz.pk,web.pk,gov.pk,gob.pk,gok.pk,gon.pk,gop.pk,gos.pk,info.pk,pl,com.pl,net.pl,org.pl,aid.pl,agro.pl,atm.pl,auto.pl,biz.pl,edu.pl,gmina.pl,gsm.pl,info.pl,mail.pl,miasta.pl,media.pl,mil.pl,nieruchomosci.pl,nom.pl,pc.pl,powiat.pl,priv.pl,realestate.pl,rel.pl,sex.pl,shop.pl,sklep.pl,sos.pl,szkola.pl,targi.pl,tm.pl,tourism.pl,travel.pl,turystyka.pl,pm,pn,gov.pn,co.pn,org.pn,edu.pn,net.pn,post,pr,com.pr,net.pr,org.pr,gov.pr,edu.pr,isla.pr,pro.pr,biz.pr,info.pr,name.pr,est.pr,prof.pr,ac.pr,pro,aaa.pro,aca.pro,acct.pro,avocat.pro,bar.pro,cpa.pro,eng.pro,jur.pro,law.pro,med.pro,recht.pro,ps,edu.ps,gov.ps,sec.ps,plo.ps,com.ps,org.ps,net.ps,pt,net.pt,gov.pt,org.pt,edu.pt,int.pt,publ.pt,com.pt,nome.pt,pw,co.pw,ne.pw,or.pw,ed.pw,go.pw,belau.pw,py,com.py,coop.py,edu.py,gov.py,mil.py,net.py,org.py,qa,com.qa,edu.qa,gov.qa,mil.qa,name.qa,net.qa,org.qa,sch.qa,re,asso.re,com.re,nom.re,ro,arts.ro,com.ro,firm.ro,info.ro,nom.ro,nt.ro,org.ro,rec.ro,store.ro,tm.ro,www.ro,rs,ac.rs,co.rs,edu.rs,gov.rs,in.rs,org.rs,ru,rw,ac.rw,co.rw,coop.rw,gov.rw,mil.rw,net.rw,org.rw,sa,com.sa,net.sa,org.sa,gov.sa,med.sa,pub.sa,edu.sa,sch.sa,sb,com.sb,edu.sb,gov.sb,net.sb,org.sb,sc,com.sc,gov.sc,net.sc,org.sc,edu.sc,sd,com.sd,net.sd,org.sd,edu.sd,med.sd,tv.sd,gov.sd,info.sd,se,a.se,ac.se,b.se,bd.se,brand.se,c.se,d.se,e.se,f.se,fh.se,fhsk.se,fhv.se,g.se,h.se,i.se,k.se,komforb.se,kommunalforbund.se,komvux.se,l.se,lanbib.se,m.se,n.se,naturbruksgymn.se,o.se,org.se,p.se,parti.se,pp.se,press.se,r.se,s.se,t.se,tm.se,u.se,w.se,x.se,y.se,z.se,sg,com.sg,net.sg,org.sg,gov.sg,edu.sg,per.sg,sh,com.sh,net.sh,gov.sh,org.sh,mil.sh,si,sj,sk,sl,com.sl,net.sl,edu.sl,gov.sl,org.sl,sm,sn,art.sn,com.sn,edu.sn,gouv.sn,org.sn,perso.sn,univ.sn,so,com.so,edu.so,gov.so,me.so,net.so,org.so,sr,ss,biz.ss,com.ss,edu.ss,gov.ss,me.ss,net.ss,org.ss,sch.ss,st,co.st,com.st,consulado.st,edu.st,embaixada.st,mil.st,net.st,org.st,principe.st,saotome.st,store.st,su,sv,com.sv,edu.sv,gob.sv,org.sv,red.sv,sx,gov.sx,sy,edu.sy,gov.sy,net.sy,mil.sy,com.sy,org.sy,sz,co.sz,ac.sz,org.sz,tc,td,tel,tf,tg,th,ac.th,co.th,go.th,in.th,mi.th,net.th,or.th,tj,ac.tj,biz.tj,co.tj,com.tj,edu.tj,go.tj,gov.tj,int.tj,mil.tj,name.tj,net.tj,nic.tj,org.tj,test.tj,web.tj,tk,tl,gov.tl,tm,com.tm,co.tm,org.tm,net.tm,nom.tm,gov.tm,mil.tm,edu.tm,tn,com.tn,ens.tn,fin.tn,gov.tn,ind.tn,info.tn,intl.tn,mincom.tn,nat.tn,net.tn,org.tn,perso.tn,tourism.tn,to,com.to,gov.to,net.to,org.to,edu.to,mil.to,tr,av.tr,bbs.tr,bel.tr,biz.tr,com.tr,dr.tr,edu.tr,gen.tr,gov.tr,info.tr,mil.tr,k12.tr,kep.tr,name.tr,net.tr,org.tr,pol.tr,tel.tr,tsk.tr,tv.tr,web.tr,nc.tr,tt,co.tt,com.tt,org.tt,net.tt,biz.tt,info.tt,pro.tt,int.tt,coop.tt,jobs.tt,mobi.tt,travel.tt,museum.tt,aero.tt,name.tt,gov.tt,edu.tt,tv,tw,edu.tw,gov.tw,mil.tw,com.tw,net.tw,org.tw,idv.tw,game.tw,ebiz.tw,club.tw,tz,ac.tz,co.tz,go.tz,hotel.tz,info.tz,me.tz,mil.tz,mobi.tz,ne.tz,or.tz,sc.tz,tv.tz,ua,com.ua,edu.ua,gov.ua,in.ua,net.ua,org.ua,ug,co.ug,or.ug,ac.ug,sc.ug,go.ug,ne.ug,com.ug,org.ug,uk,ac.uk,co.uk,gov.uk,ltd.uk,me.uk,net.uk,nhs.uk,org.uk,plc.uk,police.uk,us,dni.us,fed.us,isa.us,kids.us,nsn.us,ak.us,al.us,ar.us,as.us,az.us,ca.us,co.us,ct.us,dc.us,de.us,fl.us,ga.us,gu.us,hi.us,ia.us,id.us,il.us,in.us,ks.us,ky.us,la.us,ma.us,md.us,me.us,mi.us,mn.us,mo.us,ms.us,mt.us,nc.us,nd.us,ne.us,nh.us,nj.us,nm.us,nv.us,ny.us,oh.us,ok.us,or.us,pa.us,pr.us,ri.us,sc.us,sd.us,tn.us,tx.us,ut.us,vi.us,vt.us,va.us,wa.us,wi.us,wv.us,wy.us,uy,com.uy,edu.uy,gub.uy,mil.uy,net.uy,org.uy,uz,co.uz,com.uz,net.uz,org.uz,va,vc,com.vc,net.vc,org.vc,gov.vc,mil.vc,edu.vc,ve,arts.ve,bib.ve,co.ve,com.ve,e12.ve,edu.ve,firm.ve,gob.ve,gov.ve,info.ve,int.ve,mil.ve,net.ve,nom.ve,org.ve,rar.ve,rec.ve,store.ve,tec.ve,web.ve,vg,vi,co.vi,com.vi,k12.vi,net.vi,org.vi,vn,ac.vn,ai.vn,biz.vn,com.vn,edu.vn,gov.vn,health.vn,id.vn,info.vn,int.vn,io.vn,name.vn,net.vn,org.vn,pro.vn,vu,com.vu,edu.vu,net.vu,org.vu,wf,ws,com.ws,net.ws,org.ws,gov.ws,edu.ws,yt,ye,com.ye,edu.ye,gov.ye,net.ye,mil.ye,org.ye,ac.za,agric.za,alt.za,co.za,edu.za,gov.za,grondar.za,law.za,mil.za,net.za,ngo.za,nic.za,nis.za,nom.za,org.za,school.za,tm.za,web.za,zm,ac.zm,biz.zm,co.zm,com.zm,edu.zm,gov.zm,info.zm,mil.zm,net.zm,org.zm,sch.zm,zw,ac.zw,co.zw,gov.zw,mil.zw,org.zw".split(
        ",",
      ),
    hu = {};
  du.forEach((e) => {
    hu[e] = !0;
  });
  const pu = hu;
  function fu(e) {
    const [t] = e.split(":"),
      n = t.split(".");
    if ("localhost" === n[n.length - 1] || n.length < 2) return n[n.length - 1];
    {
      const e = n[n.length - 2] + "." + n[n.length - 1];
      return n.length > 2 && pu[e] ? n[n.length - 3] + "." + e : e;
    }
  }
  class gu {
    constructor(e) {
      ((this.selfOptions = e || {}), (this.pipes = {}));
    }
    options(e) {
      return (e && (this.selfOptions = e), this.selfOptions);
    }
    pipe(e, t) {
      let n = t;
      if ("string" == typeof e) {
        if (void 0 === n) return this.pipes[e];
        this.pipes[e] = n;
      }
      if (e && e.name) {
        if (((n = e), n.processor === this)) return n;
        this.pipes[n.name] = n;
      }
      return ((n.processor = this), n);
    }
    process(e, t) {
      let n = e;
      n.options = this.options();
      let r,
        i = t || e.pipe || "default";
      for (; i; )
        (void 0 !== n.nextAfterChildren &&
          ((n.next = n.nextAfterChildren), (n.nextAfterChildren = null)),
          "string" == typeof i && (i = this.pipe(i)),
          i.process(n),
          (r = i),
          (i = null),
          n && n.next && ((n = n.next), (i = n.pipe || r)));
      return n.hasResult ? n.result : void 0;
    }
  }
  class mu {
    constructor(e) {
      ((this.name = e), (this.filters = []));
    }
    process(e) {
      if (!this.processor)
        throw new Error("add this pipe to a processor before using it");
      const t = this.debug,
        n = this.filters.length,
        r = e;
      for (let e = 0; e < n; e++) {
        const n = this.filters[e];
        if (
          (t && this.log(`filter: ${n.filterName}`),
          n(r),
          "object" == typeof r && r.exiting)
        ) {
          r.exiting = !1;
          break;
        }
      }
      !r.next && this.resultCheck && this.resultCheck(r);
    }
    log(e) {
      console.log(`[jsondiffpatch] ${this.name} pipe, ${e}`);
    }
    append(...e) {
      return (this.filters.push(...e), this);
    }
    prepend(...e) {
      return (this.filters.unshift(...e), this);
    }
    indexOf(e) {
      if (!e) throw new Error("a filter name is required");
      for (let t = 0; t < this.filters.length; t++) {
        if (this.filters[t].filterName === e) return t;
      }
      throw new Error(`filter not found: ${e}`);
    }
    list() {
      return this.filters.map((e) => e.filterName);
    }
    after(e, ...t) {
      const n = this.indexOf(e);
      return (this.filters.splice(n + 1, 0, ...t), this);
    }
    before(e, ...t) {
      const n = this.indexOf(e);
      return (this.filters.splice(n, 0, ...t), this);
    }
    replace(e, ...t) {
      const n = this.indexOf(e);
      return (this.filters.splice(n, 1, ...t), this);
    }
    remove(e) {
      const t = this.indexOf(e);
      return (this.filters.splice(t, 1), this);
    }
    clear() {
      return ((this.filters.length = 0), this);
    }
    shouldHaveResult(e) {
      if (!1 !== e) {
        if (!this.resultCheck)
          return (
            (this.resultCheck = (e) => {
              if (!e.hasResult) {
                console.log(e);
                const t = new Error(`${this.name} failed`);
                throw ((t.noResult = !0), t);
              }
            }),
            this
          );
      } else this.resultCheck = null;
    }
  }
  class vu {
    setResult(e) {
      return ((this.result = e), (this.hasResult = !0), this);
    }
    exit() {
      return ((this.exiting = !0), this);
    }
    push(e, t) {
      return (
        (e.parent = this),
        void 0 !== t && (e.childName = t),
        (e.root = this.root || this),
        (e.options = e.options || this.options),
        this.children
          ? ((this.children[this.children.length - 1].next = e),
            this.children.push(e))
          : ((this.children = [e]),
            (this.nextAfterChildren = this.next || null),
            (this.next = e)),
        (e.next = this),
        this
      );
    }
  }
  class yu extends vu {
    constructor(e, t) {
      (super(), (this.left = e), (this.right = t), (this.pipe = "diff"));
    }
    setResult(e) {
      return super.setResult(e);
    }
  }
  class bu extends vu {
    constructor(e, t) {
      (super(), (this.left = e), (this.delta = t), (this.pipe = "patch"));
    }
  }
  const wu = function (e) {
    if (e.left !== e.right)
      if (void 0 !== e.left)
        if (void 0 !== e.right) {
          if ("function" == typeof e.left || "function" == typeof e.right)
            throw new Error("functions are not supported");
          if (
            ((e.leftType = null === e.left ? "null" : typeof e.left),
            (e.rightType = null === e.right ? "null" : typeof e.right),
            e.leftType === e.rightType)
          )
            if (
              "boolean" !== e.leftType &&
              "number" !== e.leftType &&
              "string" !== e.leftType
            ) {
              if (
                ("object" === e.leftType &&
                  (e.leftIsArray = Array.isArray(e.left)),
                "object" === e.rightType &&
                  (e.rightIsArray = Array.isArray(e.right)),
                e.leftIsArray === e.rightIsArray)
              )
                return e.leftIsArray && e.rightIsArray
                  ? (function (e, t) {
                      if (e.length !== t.length) return !1;
                      for (let n = 0; n < e.length; n++)
                        if (e[n] !== t[n]) return !1;
                      return !0;
                    })(e.left, e.right)
                    ? void e.setResult(void 0).exit()
                    : void e.setResult([e.left, e.right]).exit()
                  : void (
                      e.left instanceof RegExp &&
                      (e.right instanceof RegExp
                        ? e
                            .setResult([e.left.toString(), e.right.toString()])
                            .exit()
                        : e.setResult([e.left, e.right]).exit())
                    );
              e.setResult([e.left, e.right]).exit();
            } else e.setResult([e.left, e.right]).exit();
          else e.setResult([e.left, e.right]).exit();
        } else e.setResult([e.left, 0, 0]).exit();
      else {
        if ("function" == typeof e.right)
          throw new Error("functions are not supported");
        e.setResult([e.right]).exit();
      }
    else e.setResult(void 0).exit();
  };
  wu.filterName = "trivial";
  const Du = function (e) {
    if (void 0 === e.delta) return void e.setResult(e.left).exit();
    if (((e.nested = !Array.isArray(e.delta)), e.nested)) return;
    const t = e.delta;
    if (1 !== t.length)
      if (2 !== t.length)
        3 === t.length && 0 === t[2] && e.setResult(void 0).exit();
      else {
        if (e.left instanceof RegExp) {
          const n = /^\/(.*)\/([gimyu]+)$/.exec(t[1]);
          if (n) return void e.setResult(new RegExp(n[1], n[2])).exit();
        }
        e.setResult(t[1]).exit();
      }
    else e.setResult(t[0]).exit();
  };
  Du.filterName = "trivial";
  const Fu = (e) => {
    if (!e || !e.children) return;
    const t = e.children.length;
    let n,
      r = e.result;
    for (let i = 0; i < t; i++)
      ((n = e.children[i]),
        void 0 !== n.result && ((r = r || {}), (r[n.childName] = n.result)));
    (r && e.leftIsArray && (r._t = "a"), e.setResult(r).exit());
  };
  Fu.filterName = "collectChildren";
  const Su = (e) => {
    if (e.leftIsArray || "object" !== e.leftType) return;
    const t = e.left,
      n = e.right;
    let r, i;
    const o = e.options.propertyFilter;
    for (r in t)
      Object.prototype.hasOwnProperty.call(t, r) &&
        ((o && !o(r, e)) || ((i = new yu(t[r], n[r])), e.push(i, r)));
    for (r in n)
      Object.prototype.hasOwnProperty.call(n, r) &&
        ((o && !o(r, e)) ||
          (void 0 === t[r] && ((i = new yu(void 0, n[r])), e.push(i, r))));
    e.children && 0 !== e.children.length
      ? e.exit()
      : e.setResult(void 0).exit();
  };
  Su.filterName = "objects";
  const _u = function (e) {
    if (!e.nested) return;
    const t = e.delta;
    if (t._t) return;
    const n = t;
    let r, i;
    for (r in n) ((i = new bu(e.left[r], n[r])), e.push(i, r));
    e.exit();
  };
  _u.filterName = "objects";
  const Eu = function (e) {
    if (!e || !e.children) return;
    if (e.delta._t) return;
    const t = e.left,
      n = e.children.length;
    let r;
    for (let i = 0; i < n; i++) {
      r = e.children[i];
      const n = r.childName;
      Object.prototype.hasOwnProperty.call(e.left, n) && void 0 === r.result
        ? delete t[n]
        : t[n] !== r.result && (t[n] = r.result);
    }
    e.setResult(t).exit();
  };
  Eu.filterName = "collectChildren";
  const Au = function (e) {
    e.left instanceof Date
      ? (e.right instanceof Date
          ? e.left.getTime() !== e.right.getTime()
            ? e.setResult([e.left, e.right])
            : e.setResult(void 0)
          : e.setResult([e.left, e.right]),
        e.exit())
      : e.right instanceof Date && e.setResult([e.left, e.right]).exit();
  };
  Au.filterName = "dates";
  class Cu {
    constructor(e) {
      ((this.processor = new gu(e)),
        this.processor.pipe(
          new mu("diff").append(Fu, wu, Au, Su).shouldHaveResult(),
        ),
        this.processor.pipe(
          new mu("patch").append(Eu, Du, _u).shouldHaveResult(),
        ));
    }
    options(e) {
      return this.processor.options(e);
    }
    diff(e, t) {
      return this.processor.process(new yu(e, t));
    }
    patch(e, t) {
      return this.processor.process(new bu(e, t));
    }
  }
  var ku = function (e, t, n, r) {
    return new (n || (n = Promise))(function (i, o) {
      function a(e) {
        try {
          l(r.next(e));
        } catch (e) {
          o(e);
        }
      }
      function s(e) {
        try {
          l(r.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function l(e) {
        var t;
        e.done
          ? i(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t);
                })).then(a, s);
      }
      l((r = r.apply(e, t || [])).next());
    });
  };
  const xu = new Cu(Pu);
  var Pu;
  const Ou = {
      writeKey: null,
      host: null,
      debug: !1,
      fetch: null,
      echoEvents: !1,
      cookieDomain: void 0,
      cookieNames: {},
      cookieCapture: {},
      runtime: void 0,
      fetchTimeoutMs: void 0,
      s2s: void 0,
      idEndpoint: void 0,
      errorPolicy: "log",
      defaultPayloadContext: {},
      privacy: {
        dontSend: !1,
        disableUserIds: !1,
        ipPolicy: "keep",
        consentCategories: void 0,
      },
    },
    Iu = (e, t) => {
      for (const n of Object.keys(Ou)) {
        const r = t[n];
        "privacy" === n
          ? "object" == typeof r
            ? (e.privacy = Object.assign(
                Object.assign(Object.assign({}, Ou.privacy), e.privacy),
                r,
              ))
            : t.hasOwnProperty("privacy") &&
              void 0 === r &&
              (e.privacy = Object.assign({}, Ou.privacy))
          : void 0 === r
            ? (!t.hasOwnProperty(n) && e.hasOwnProperty(n)) || (e[n] = Ou[n])
            : (e[n] = r);
      }
    },
    ju = (e) => {
      if (!e) return {};
      let t = e.length > 0 && "?" === e.charAt(0) ? e.substring(1) : e,
        n = {},
        r = ("?" === t[0] ? t.substr(1) : t).split("&");
      for (let e = 0; e < r.length; e++) {
        let t = r[e].split("=");
        n[decodeURIComponent(t[0])] = decodeURIComponent(t[1] || "");
      }
      return n;
    };
  function Tu(e) {
    const t = e.substring(4);
    return "campaign" === t ? "name" : t;
  }
  function Ru(e) {
    return Object.entries(e)
      .filter(([e]) => 0 === e.indexOf("utm_"))
      .reduce(
        (e, [t, n]) => Object.assign(Object.assign({}, e), { [Tu(t)]: n }),
        {},
      );
  }
  function Lu(e, t) {
    try {
      return e();
    } catch (e) {
      return t;
    }
  }
  function Bu(e) {
    let t = e.getItem("__user_traits");
    ("string" == typeof t && (t = Lu(() => JSON.parse(t), {})),
      ("object" != typeof t || null === t || Array.isArray(t)) && (t = {}));
    let n = e.getItem("__group_traits");
    return (
      "string" == typeof n && (n = Lu(() => JSON.parse(n), {})),
      ("object" != typeof n || null === n || Array.isArray(n)) && (n = {}),
      Object.assign(Object.assign({}, n || {}), t || {})
    );
  }
  function Uu(e) {
    const t = `; ${document.cookie}`.split(`; ${e}=`);
    return 2 === t.length ? t.pop().split(";").shift() : void 0;
  }
  function Nu(e, t) {
    const n = Object.assign({ fbc: "_fbc", fbp: "_fbp" }, t),
      r = Object.entries(n).reduce(
        (t, [n, r]) => ((t[n] = e.getCookie(r)), t),
        {},
      );
    return Object.assign(
      Object.assign({}, r),
      (function (e) {
        var t;
        const n = e.getCookies(),
          r =
            null === (t = n._ga) || void 0 === t
              ? void 0
              : t.split(".").slice(-2).join("."),
          i = Object.entries(n).filter(([e]) => e.startsWith("_ga_")),
          o =
            i.length > 0
              ? Object.fromEntries(
                  i
                    .map(([e, t]) => {
                      if ("string" != typeof t) return null;
                      const n = t.split(".");
                      return n.length < 3 ? null : [e.substring(4), n[2]];
                    })
                    .filter((e) => null !== e),
                )
              : void 0;
        return r || o ? { ga4: { clientId: r, sessionIds: o } } : void 0;
      })(e),
    );
  }
  function qu(e, { domain: t, secure: n }) {
    document.cookie =
      e +
      "=;domain=" +
      t +
      ";path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;SameSite=" +
      (n ? "None" : "Lax") +
      (n ? ";secure" : "");
  }
  const zu = {
      __anon_id: "__eventn_id",
      __user_id: "__eventn_uid",
      __user_traits: "__eventn_id_usr",
      __group_id: "__group_id",
      __group_traits: "__group_traits",
    },
    $u = (e, t) => ({
      setItem(n, r) {
        const i = t(n) || n;
        if (void 0 === r)
          return void qu(i, {
            domain: e,
            secure: "https:" === window.location.protocol,
          });
        !(function (e, t, { domain: n, secure: r }) {
          document.cookie =
            e +
            "=" +
            t +
            ";domain=" +
            n +
            ";path=/;expires=" +
            new Date(new Date().getTime() + 15768e7).toUTCString() +
            ";SameSite=" +
            (r ? "None" : "Lax") +
            (r ? ";secure" : "");
        })(
          i,
          "object" == typeof r && null !== r
            ? encodeURIComponent(JSON.stringify(r))
            : r,
          { domain: e, secure: "https:" === window.location.protocol },
        );
      },
      getItem(e) {
        const n = Uu(t(e) || e);
        if ("__anon_id" === e) return n;
        if (void 0 === n && "__user_id" === e) {
          const e = uc(Uu(t("__user_traits") || "__eventn_id_usr")) || {};
          return e.internal_id || e.user_id || e.id || e.userId;
        }
        return uc(n);
      },
      removeItem(n) {
        qu(t(n) || n, {
          domain: e,
          secure: "https:" === window.location.protocol,
        });
      },
      reset() {
        for (const n of Object.keys(zu))
          qu(t(n) || n, {
            domain: e,
            secure: "https:" === window.location.protocol,
          });
      },
    });
  function Mu(e) {
    const t = (t) => {
      var n, r, i, o, a;
      switch (t) {
        case "__anon_id":
          return (
            (null === (n = e.cookieNames) || void 0 === n
              ? void 0
              : n.anonymousId) || zu.__anon_id
          );
        case "__user_id":
          return (
            (null === (r = e.cookieNames) || void 0 === r
              ? void 0
              : r.userId) || zu.__user_id
          );
        case "__user_traits":
          return (
            (null === (i = e.cookieNames) || void 0 === i
              ? void 0
              : i.userTraits) || zu.__user_traits
          );
        case "__group_id":
          return (
            (null === (o = e.cookieNames) || void 0 === o
              ? void 0
              : o.groupId) || zu.__group_id
          );
        case "__group_traits":
          return (
            (null === (a = e.cookieNames) || void 0 === a
              ? void 0
              : a.groupTraits) || zu.__group_traits
          );
        default:
          return t;
      }
    };
    return {
      getCookie(e) {
        const t = `; ${document.cookie}`.split(`; ${e}=`);
        return 2 === t.length ? t.pop().split(";").shift() : void 0;
      },
      getCookies() {
        const e = {},
          t = `; ${document.cookie}`.matchAll(/(\w+)=([^;]+)/g);
        for (const n of t) e[n[1]] = n[2];
        return e;
      },
      documentEncoding: () => window.document.characterSet,
      timezoneOffset: () => new Date().getTimezoneOffset(),
      store: () => $u(e.cookieDomain || fu(window.location.hostname), t),
      language: () => window.navigator.language,
      pageTitle: () => window.document.title,
      pageUrl: () => window.location.href,
      referrer: () => window.document.referrer,
      screen: () => ({
        width: window.screen.width,
        height: window.screen.height,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        density: Math.floor(window.devicePixelRatio),
      }),
      userAgent: () => window.navigator.userAgent,
    };
  }
  function Hu(e) {
    const t = {};
    return {
      reset() {
        Object.keys(t).forEach((e) => delete t[e]);
      },
      setItem(n, r) {
        (e &&
          console.log(
            `[JITSU EMPTY RUNTIME] Set storage item ${n}=${JSON.stringify(r)}`,
          ),
          void 0 === r ? delete t[n] : (t[n] = r));
      },
      getItem(n) {
        const r = t[n];
        return (
          e &&
            console.log(
              `[JITSU EMPTY RUNTIME] Get storage item ${n}=${JSON.stringify(r)}`,
            ),
          r
        );
      },
      removeItem(n) {
        (e &&
          console.log(`[JITSU EMPTY RUNTIME] Get storage item ${n}=${t[n]}`),
          delete t[n]);
      },
    };
  }
  const Ju = (e) => ({
    documentEncoding() {},
    timezoneOffset() {},
    getCookie(e) {},
    getCookies: () => ({}),
    store: () => Hu(e.debug),
    language() {},
    pageTitle() {},
    pageUrl() {},
    referrer() {},
    screen() {},
    userAgent() {},
  });
  function Wu(e, t) {
    return "object" != typeof t ||
      null === t ||
      "object" != typeof e ||
      null === e
      ? t
      : Object.entries(t).reduce((t, [n, r]) => ((t[n] = Wu(e[n], r)), t), e);
  }
  function Gu() {
    return "undefined" != typeof document && "undefined" != typeof window;
  }
  const Vu = /#.*$/;
  function Ku(e, t, n, r) {
    var i, o, a, s, l, u, c, d, h, p, f, g, m, v;
    const y = t.runtime || (Gu() ? Mu(t) : Ju(t)),
      b = y.pageUrl(),
      w = Lu(() => new URL(b), void 0),
      D = w ? ju(w.search) : {},
      F = e.properties || {};
    if ("page" === e.type && (F.url || b)) {
      const e = F.url || b;
      ((F.url = e.replace(Vu, "")),
        (F.path =
          ((S = (function (e) {
            const t = /(http[s]?:\/\/)?([^\/\s]+\/)(.*)/g.exec(e);
            return "/" + (t && t[3] ? t[3].split("?")[0].replace(Vu, "") : "");
          })(e)),
          0 === S.indexOf("//") && 1 === S.lastIndexOf("/") ? "/" : S)));
    }
    var S;
    const _ = Wu(
      t.defaultPayloadContext,
      (null === (i = e.properties) || void 0 === i ? void 0 : i.context) ||
        (null === (o = e.options) || void 0 === o ? void 0 : o.context) ||
        {},
    );
    null === (a = e.properties) || void 0 === a || delete a.context;
    const E = y.referrer(),
      A = {
        library: { name: cu, version: uu, env: Gu() ? "browser" : "node" },
        consent: (
          null === (s = t.privacy) || void 0 === s
            ? void 0
            : s.consentCategories
        )
          ? { categoryPreferences: t.privacy.consentCategories }
          : void 0,
        userAgent:
          null === (l = y.userAgent) || void 0 === l ? void 0 : l.call(y),
        locale: null === (u = y.language) || void 0 === u ? void 0 : u.call(y),
        screen: null === (c = y.screen) || void 0 === c ? void 0 : c.call(y),
        ip:
          null === (d = null == y ? void 0 : y.ip) || void 0 === d
            ? void 0
            : d.call(y),
        traits:
          "identify" != e.type && "group" != e.type
            ? Object.assign(
                Object.assign({}, Bu(n) || {}),
                (null === (h = null == e ? void 0 : e.options) || void 0 === h
                  ? void 0
                  : h.traits) || {},
              )
            : void 0,
        page: {
          path: F.path || (w && w.pathname),
          referrer: E,
          referring_domain: Lu(() => E && new URL(E).hostname),
          host: w && w.host,
          search: F.search || (w && w.search),
          title: F.title || y.pageTitle(),
          url: F.url || b,
          encoding: F.encoding || y.documentEncoding(),
        },
        clientIds: (
          null === (p = t.privacy) || void 0 === p ? void 0 : p.disableUserIds
        )
          ? void 0
          : Nu(y, t.cookieCapture),
        campaign: Ru(D),
      },
      C = Object.assign(Object.assign({}, e), {
        userId:
          (null === (f = null == e ? void 0 : e.options) || void 0 === f
            ? void 0
            : f.userId) || (null == e ? void 0 : e.userId),
        anonymousId:
          (null === (g = null == e ? void 0 : e.options) || void 0 === g
            ? void 0
            : g.anonymousId) || (null == e ? void 0 : e.anonymousId),
        groupId:
          (null === (m = null == e ? void 0 : e.options) || void 0 === m
            ? void 0
            : m.groupId) || n.getItem("__group_id"),
        timestamp: new Date().toISOString(),
        sentAt: new Date().toISOString(),
        messageId: oc(F.path || (w && w.pathname)),
        writeKey: Xu(t.writeKey),
        context: Wu(A, _),
      });
    return (
      delete C.meta,
      delete C.options,
      (null === (v = t.privacy) || void 0 === v ? void 0 : v.disableUserIds) &&
        (delete C.userId,
        delete C.anonymousId,
        delete C.context.traits,
        delete C.groupId),
      C
    );
  }
  function Qu(e) {
    const t = Object.keys(e);
    return 1 === t.length && "__diff" === t[0];
  }
  function Xu(e) {
    if (e) {
      const [t, n] = e.split(":", 2);
      return n ? `${t}:***` : "***";
    }
    return e;
  }
  function Yu(e) {
    const t = e.errorPolicy || "log";
    return "function" == typeof t
      ? t
      : "rethrow" === t
        ? (e, ...t) => {
            throw new Error(e);
          }
        : (e, ...t) => {
            console.error(e, ...t);
          };
  }
  function Zu(e, t, n, r, i) {
    return ku(this, void 0, void 0, function* () {
      var o, a;
      const s = !!n.s2s,
        l = n.debug ? { "X-Enable-Debug": "true" } : {},
        u = Ku(t, n, i);
      if (n.echoEvents)
        return void console.log(`[JITSU DEBUG] sending '${e}' event:`, u);
      const c = s ? `${n.host}/api/s/s2s/${e}` : `${n.host}/api/s/${e}`,
        d = n.fetch || globalThis.fetch;
      if (!d)
        throw new Error(
          "Please specify fetch function in jitsu plugin initialization, fetch isn't available in global scope",
        );
      const h = n.fetchTimeoutMs ? new AbortController() : void 0,
        p = n.fetchTimeoutMs
          ? setTimeout(() => {
              h.abort();
            }, n.fetchTimeoutMs)
          : void 0,
        f = n.writeKey ? { "X-Write-Key": n.writeKey } : {},
        g =
          void 0 ===
            (null === (o = n.privacy) || void 0 === o ? void 0 : o.ipPolicy) ||
          "keep" ===
            (null === (a = n.privacy) || void 0 === a ? void 0 : a.ipPolicy)
            ? {}
            : { "X-IP-Policy": n.privacy.ipPolicy };
      let m, v, y;
      try {
        ((m = yield d(c, {
          method: "POST",
          headers: Object.assign(
            Object.assign(
              Object.assign({ "Content-Type": "application/json" }, f),
              l,
            ),
            g,
          ),
          body: JSON.stringify(u),
          signal: null == h ? void 0 : h.signal,
        })),
          p && clearTimeout(p));
      } catch (e) {
        return (
          Yu(n)(`Call to ${c} failed with error ${e.message}`),
          Promise.resolve()
        );
      }
      try {
        v = yield m.text();
      } catch (e) {
        console.warn(
          `Can't read response text from ${c} (status - ${m.status}  ${m.statusText}): ${null == e ? void 0 : e.message}`,
        );
      }
      if (
        (n.debug &&
          console.log(
            `[JITSU DEBUG] ${c} replied ${m.status}: ${v}. Original payload:\n${JSON.stringify(u, null, 2)}`,
          ),
        !m.ok)
      )
        return (
          Yu(n)(
            `Call to ${c} failed with error: ${m.status} - ${m.statusText}: ${v}`,
          ),
          Promise.resolve()
        );
      try {
        y = JSON.parse(v);
      } catch (e) {
        return (
          Yu(n)(`Can't parse JSON: ${v}: ${null == e ? void 0 : e.message}`),
          Promise.resolve()
        );
      }
      if (y.destinations && y.destinations.length > 0)
        if (n.s2s)
          console.warn(
            `[JITSU] ${t.type} responded with list of ${y.destinations.length} destinations. However, this code is running in server-to-server mode, so destinations will be ignored`,
            n.debug ? JSON.stringify(y.destinations, null, 2) : void 0,
          );
        else if (Gu())
          return (
            n.debug &&
              console.log(
                "[JITSU] Processing device destinations: ",
                JSON.stringify(y.destinations, null, 2),
              ),
            (function (e, t, n, r, i) {
              return ku(this, void 0, void 0, function* () {
                const o = [];
                for (const a of e) {
                  let e = [n];
                  if (a.newEvents)
                    try {
                      e = a.newEvents.map((e) =>
                        "same" === e ? n : Qu(e) ? xu.patch(n, e.__diff) : e,
                      );
                    } catch (e) {
                      console.error(
                        `[JITSU] Error applying '${a.id}' changes to event: ${null == e ? void 0 : e.message}`,
                        e,
                      );
                    }
                  const s = Object.assign(
                    Object.assign({}, a.credentials),
                    a.options,
                  );
                  if ("internal-plugin" === a.deviceOptions.type) {
                    const t = lu[a.deviceOptions.name];
                    if (t)
                      for (const n of e)
                        try {
                          o.push(
                            t.handle(
                              Object.assign(Object.assign({}, s), { debug: r }),
                              n,
                            ),
                          );
                        } catch (e) {
                          console.warn(
                            `[JITSU] Error processing event with internal plugin '${a.deviceOptions.name}': ${null == e ? void 0 : e.message}`,
                            e,
                          );
                        }
                    else
                      console.warn(
                        `[JITSU] Unknown internal plugin '${a.deviceOptions.name}' for destination '${a.id}'`,
                      );
                  } else if ("analytics-plugin" === a.deviceOptions.type) {
                    yield ql(a.deviceOptions.packageCdn);
                    const n = window[a.deviceOptions.moduleVarName];
                    if (n) {
                      let o;
                      try {
                        o = ("function" == typeof n ? n : n.init)(s);
                      } catch (e) {
                        console.warn(
                          `[JITSU] Error creating plugin '${a.deviceOptions.moduleVarName}@${a.deviceOptions.packageCdn}' for destination '${a.id}': ${null == e ? void 0 : e.message}`,
                          e,
                        );
                      }
                      try {
                        (r &&
                          console.log(
                            `[JITSU] Plugin '${a.deviceOptions.moduleVarName}@${a.deviceOptions.packageCdn}' for destination '${a.id}' initialized with config:`,
                            o.config,
                          ),
                          o.initialize({ config: o.config, instance: i }));
                      } catch (e) {
                        console.warn(
                          `[JITSU] Error initializing plugin '${a.deviceOptions.moduleVarName}@${a.deviceOptions.packageCdn}' for destination '${a.id}': ${null == e ? void 0 : e.message}. Config: ${JSON.stringify(o.config)}`,
                          e,
                        );
                        continue;
                      }
                      if (o[t])
                        for (const n of e)
                          try {
                            o[t]({ payload: n, config: o.config, instance: i });
                          } catch (e) {
                            console.warn(
                              `[JITSU] Error processing ${t}() with plugin '${a.deviceOptions.moduleVarName}@${a.deviceOptions.packageCdn}' for destination '${a.id}': ${null == e ? void 0 : e.message}`,
                              e,
                            );
                          }
                    } else
                      console.warn(
                        `[JITSU] Broken plugin '${a.deviceOptions.packageCdn}' for destination '${a.id}' - it doesn't export '${a.deviceOptions.moduleVarName}' variable`,
                      );
                  }
                }
              });
            })(y.destinations, e, u, !!n.debug, r)
          );
      return u;
    });
  }
  const ec = ["$doNotSend"];
  function tc(e) {
    const t = Object.assign({}, e);
    for (const e of ec) delete t[e];
    return t;
  }
  const nc = (e = {}, t) => (
    Iu(e, e),
    {
      name: "jitsu",
      config: e,
      initialize: (e) =>
        ku(void 0, void 0, void 0, function* () {
          const { config: t } = e;
          if (
            (t.debug &&
              console.debug(
                "[JITSU DEBUG] Initializing Jitsu plugin with config: ",
                JSON.stringify(t, null, 2),
              ),
            !t.host && !t.echoEvents)
          )
            throw new Error(
              "Please specify host variable in jitsu plugin initialization, or set echoEvents to true",
            );
          if (
            ((function (e) {
              if (e) {
                const [, n] = e.split(":", 2);
                if (!n && (25 !== (t = e).length || "c" !== t.charAt(0)))
                  throw new Error(
                    `Legacy write key detected - ${e}! This format doesn't work anymore, it should be 'key:secret'. Please download a new key from Jitsu UI`,
                  );
              }
              var t;
            })(t.writeKey),
            t.idEndpoint)
          ) {
            if (!Gu())
              return void console.error(
                "[JITSU] 'idEndpoint' option can be used only in browser environment",
              );
            try {
              const e = t.fetch || globalThis.fetch,
                n = new AbortController();
              setTimeout(() => n.abort(), 1e3);
              const r = t.cookieDomain || fu(window.location.hostname),
                i = yield e(t.idEndpoint + "?domain=" + encodeURIComponent(r), {
                  credentials: "include",
                  signal: n.signal,
                });
              i.ok
                ? t.debug &&
                  console.log(`[JITSU DEBUG] Fetch idEndpoint: ${i.status}`)
                : console.error(
                    `[JITSU] Can't fetch idEndpoint: ${i.status} - ${i.statusText}`,
                  );
            } catch (e) {
              console.error(`[JITSU] Can't fetch idEndpoint: ${e.message}`);
            }
          }
        }),
      page: (e) => {
        var n;
        const { payload: r, config: i, instance: o } = e;
        if (!(null === (n = i.privacy) || void 0 === n ? void 0 : n.dontSend))
          return Zu("page", r, i, o, t);
      },
      track: (e) => {
        var n;
        const { payload: r, config: i, instance: o } = e;
        if (!(null === (n = i.privacy) || void 0 === n ? void 0 : n.dontSend))
          return Zu("track", r, i, o, t);
      },
      identify: (e) => {
        var n, r, i;
        const { payload: o, config: a, instance: s } = e;
        if (
          (null === (n = a.privacy) || void 0 === n ? void 0 : n.dontSend) ||
          (null === (r = a.privacy) || void 0 === r ? void 0 : r.disableUserIds)
        )
          return;
        t.setItem("__user_id", o.userId);
        const l =
          null === (i = o.traits) || void 0 === i ? void 0 : i.$doNotSend;
        return (
          o.traits &&
            "object" == typeof o.traits &&
            ((o.traits = tc(o.traits)), t.setItem("__user_traits", o.traits)),
          l ? Promise.resolve() : Zu("identify", o, a, s, t)
        );
      },
      reset: (e) => {
        const { config: n, instance: r } = e;
        (t.reset(),
          n.debug &&
            console.log("[JITSU DEBUG] Resetting Jitsu plugin storage"));
      },
      methods: {
        configure(n) {
          var r, i, o, a;
          const s =
            (null === (r = e.privacy) || void 0 === r
              ? void 0
              : r.disableUserIds) ||
            (null === (i = e.privacy) || void 0 === i ? void 0 : i.dontSend);
          Iu(e, n);
          if (
            !(
              (null === (o = e.privacy) || void 0 === o
                ? void 0
                : o.disableUserIds) ||
              (null === (a = e.privacy) || void 0 === a ? void 0 : a.dontSend)
            ) &&
            s
          ) {
            e.debug &&
              console.log("[JITSU] Enabling Anonymous ID. Generating new Id.");
            const n = this.instance,
              r = ac(),
              i = n.user();
            (i && (i.anonymousId = r),
              t.setItem("__anon_id", r),
              n.setAnonymousId(r));
          }
        },
        group(n, r, i, o) {
          var a, s;
          if (
            (null === (a = e.privacy) || void 0 === a ? void 0 : a.dontSend) ||
            (null === (s = e.privacy) || void 0 === s
              ? void 0
              : s.disableUserIds)
          )
            return;
          "number" == typeof n && (n += "");
          const l = this.instance,
            u = l.user(),
            c =
              (null == i ? void 0 : i.userId) ||
              (null == u ? void 0 : u.userId),
            d =
              (null == i ? void 0 : i.anonymousId) ||
              (null == u ? void 0 : u.anonymousId) ||
              t.getItem("__anon_id");
          t.setItem("__group_id", n);
          const h = null == r ? void 0 : r.$doNotSend;
          return (
            r &&
              "object" == typeof r &&
              ((r = tc(r)), t.setItem("__group_traits", r)),
            h
              ? Promise.resolve()
              : Zu(
                  "group",
                  Object.assign(
                    Object.assign(
                      { type: "group", groupId: n, traits: r },
                      d ? { anonymousId: d } : {},
                    ),
                    c ? { userId: c } : {},
                  ),
                  e,
                  l,
                  t,
                )
          );
        },
      },
    }
  );
  let rc = 0;
  function ic() {
    var e;
    rc = (rc + 1) % Number.MAX_SAFE_INTEGER;
    const t = Date.now() % 2147483647;
    return (
      ((Gu() &&
        (null ===
          (e =
            null === window || void 0 === window
              ? void 0
              : window.performance) || void 0 === e
          ? void 0
          : e.now())) ||
        t) + rc
    );
  }
  function oc(e = "") {
    const t = Date.now();
    return (
      (
        (Math.random() * t * sc(null != e ? e : "", ic())) %
        Number.MAX_SAFE_INTEGER
      ).toString(36) +
      (
        (Math.random() * t * sc(null != e ? e : "", ic())) %
        Number.MAX_SAFE_INTEGER
      ).toString(36)
    );
  }
  function ac() {
    for (var e = "", t = 0, n = (4294967295 * Math.random()) | 0; t++ < 36; ) {
      var r = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"[t - 1],
        i = 15 & n;
      ((e +=
        "-" == r || "4" == r ? r : ("x" == r ? i : (3 & i) | 8).toString(16)),
        (n = t % 8 == 0 ? (4294967295 * Math.random()) | 0 : n >> 4));
    }
    return e;
  }
  function sc(e, t = 0) {
    let n = 3735928559 ^ t,
      r = 1103547991 ^ t;
    for (let t, i = 0; i < e.length; i++)
      ((t = e.charCodeAt(i)),
        (n = Math.imul(n ^ t, 2654435761)),
        (r = Math.imul(r ^ t, 1597334677)));
    return (
      (n =
        Math.imul(n ^ (n >>> 16), 2246822507) ^
        Math.imul(r ^ (r >>> 13), 3266489909)),
      (r =
        Math.imul(r ^ (r >>> 16), 2246822507) ^
        Math.imul(n ^ (n >>> 13), 3266489909)),
      4294967296 * (2097151 & r) + (n >>> 0)
    );
  }
  var lc = function (e, t, n, r) {
    return new (n || (n = Promise))(function (i, o) {
      function a(e) {
        try {
          l(r.next(e));
        } catch (e) {
          o(e);
        }
      }
      function s(e) {
        try {
          l(r.throw(e));
        } catch (e) {
          o(e);
        }
      }
      function l(e) {
        var t;
        e.done
          ? i(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t);
                })).then(a, s);
      }
      l((r = r.apply(e, t || [])).next());
    });
  };
  function uc(e) {
    let t = e;
    0 === (null == e ? void 0 : e.indexOf("%7B%22")) &&
      (t = decodeURIComponent(e));
    try {
      if (((t = JSON.parse(t)), "true" === t)) return !0;
      if ("false" === t) return !1;
      if ("object" == typeof t) return t;
      parseFloat(t) === t && (t = parseFloat(t));
    } catch (e) {}
    if (null !== t && "" !== t) return t;
  }
  function cc(e, t, n = []) {
    var r, i, o;
    const a = {},
      s = (t) => ({
        setItem(n, r) {
          var i, o;
          (null === (i = e.privacy) || void 0 === i ? void 0 : i.dontSend) ||
            (null === (o = e.privacy) || void 0 === o
              ? void 0
              : o.disableUserIds) ||
            (e.debug &&
              console.log(`[JITSU DEBUG] Caching storage setItem: ${n}=${r}`),
            (a[n] = r),
            t.setItem(n, r));
        },
        getItem(n) {
          var r, i;
          if (
            (null === (r = e.privacy) || void 0 === r ? void 0 : r.dontSend) ||
            (null === (i = e.privacy) || void 0 === i
              ? void 0
              : i.disableUserIds)
          )
            return;
          const o = a[n] || t.getItem(n);
          return (
            e.debug &&
              console.log(
                `[JITSU DEBUG] Caching storage getItem: ${n}=${o}. Evicted from cache: ${!a[n]}`,
              ),
            o
          );
        },
        reset() {
          for (const e of [...Object.keys(a)]) delete a[e];
          t.reset();
        },
        removeItem(n) {
          (e.debug &&
            console.log(`[JITSU DEBUG] Caching storage removeItem: ${n}`),
            delete a[n],
            t.removeItem(n));
        },
      }),
      l = s(
        (null === (r = t.store) || void 0 === r ? void 0 : r.call(t)) ||
          Hu(e.debug),
      ),
      u = (function () {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return cl(Nl(Nl({}, { storage: Ll }), e));
      })({ debug: !!e.debug, storage: l, plugins: [nc(e, l), ...n] }),
      c = Object.assign(Object.assign({}, u), {
        page: (...e) =>
          2 === e.length && "string" == typeof e[0] && "object" == typeof e[1]
            ? u.page(Object.assign({ name: e[0] }, e[1]))
            : u.page(...e),
        identify: (...e) => {
          e[0] &&
            "object" != typeof e[0] &&
            "string" != typeof e[0] &&
            (e[0] = e[0] + "");
          const t = u.storage,
            n = s(t);
          return (
            "string" == typeof e[0]
              ? n.setItem("__user_id", e[0])
              : "object" == typeof e[0] && n.setItem("__user_traits", e[0]),
            2 === e.length &&
              "object" == typeof e[1] &&
              n.setItem("__user_traits", e[1]),
            u.identify(...e)
          );
        },
        setContextProperty(t, n) {
          (e.debug &&
            console.log(
              `[JITSU DEBUG] Setting context property '${t}':${JSON.stringify(n)}`,
            ),
            e.defaultPayloadContext
              ? (e.defaultPayloadContext[t] = n)
              : (e.defaultPayloadContext = { [t]: n }));
        },
        getContextProperty(t) {
          var n;
          return (
            e.debug &&
              console.log(`[JITSU DEBUG] Getting context property '${t}'`),
            null === (n = e.defaultPayloadContext) || void 0 === n
              ? void 0
              : n[t]
          );
        },
        setAnonymousId: (t) => {
          (e.debug && console.log("[JITSU DEBUG] Setting anonymous id to " + t),
            l.setItem("__anon_id", t));
          const n = u.user();
          (n && (n.anonymousId = t), u.setAnonymousId(t));
        },
        reset() {
          return lc(this, void 0, void 0, function* () {
            (e.debug &&
              console.log(
                "[JITSU DEBUG] Called reset(). Storage state",
                JSON.stringify(u.user()),
              ),
              l.reset(),
              yield u.reset(),
              this.setAnonymousId(ac()),
              e.debug &&
                console.log(
                  "[JITSU DEBUG] User state after reset",
                  JSON.stringify(u.user()),
                ));
          });
        },
        configure(t) {
          return lc(this, void 0, void 0, function* () {
            var n, r;
            (e.debug &&
              console.log(
                "[JITSU DEBUG] Update Jitsu config with",
                JSON.stringify(t),
              ),
              ((null === (n = t.privacy) || void 0 === n
                ? void 0
                : n.disableUserIds) ||
                (null === (r = t.privacy) || void 0 === r
                  ? void 0
                  : r.dontSend)) &&
                l.reset());
            for (const e of Object.values(u.plugins))
              "function" == typeof e.configure && e.configure(t);
          });
        },
        group(e, t, n, r) {
          return lc(this, void 0, void 0, function* () {
            const i = [];
            for (const o of Object.values(u.plugins))
              o.group && i.push(yield o.group(e, t, n, r));
            return i[0];
          });
        },
      });
    return (
      ((null === (i = e.privacy) || void 0 === i ? void 0 : i.disableUserIds) ||
        (null === (o = e.privacy) || void 0 === o ? void 0 : o.dontSend)) &&
        l.reset(),
      c
    );
  }
  function dc(e) {
    const t = (function (e) {
        var t, n;
        return Object.assign(Object.assign({}, e), {
          host:
            0 !==
              (null !== (t = e.host) && void 0 !== t ? t : "").indexOf(
                "https://",
              ) &&
            0 !==
              (null !== (n = e.host) && void 0 !== n ? n : "").indexOf(
                "http://",
              )
              ? `https://${e.host}`
              : e.host,
        });
      })(e),
      n = Gu();
    return cc(t, t.runtime || (n ? Mu(t) : Ju(t)));
  }
  class hc {
    constructor(e) {
      const t = null == e ? void 0 : e.nextPage;
      ((this.listId = salla.config.get("page.slug")),
        Salla.config.get("page.id") &&
          (this.listId += `_${salla.config.get("page.id")}`),
        (this.sorts = null));
      try {
        if (t) {
          const e = new URL(t).searchParams.get("sort");
          e && (this.sorts = [{ type: "sort", value: e }]);
        }
        (e.source && (this.listId = `${this.listId}_${e.source}`),
          e.sourceValue &&
            (this.listId = `${this.listId}_${Array.isArray(e.sourceValue) ? e.sourceValue.join("_") : e.sourceValue}`));
      } catch (e) {
        salla.logger.error(e);
      }
      this.products = null == e ? void 0 : e.data;
    }
    toSegment() {
      const e = (salla.config.get("page.title") || "")
          .split("|")
          .map((e) => e.trim()),
        t = e[0],
        n = e[1] || null;
      return {
        event: "Product List Viewed",
        properties: {
          list_id: this.listId,
          category: t,
          sub_category: n,
          sorts: this.sorts,
          products: this.products.map((e) => {
            var t, n, r, i, o, a;
            return {
              product_id: e.id,
              category: null == (t = e.category) ? void 0 : t.name,
              currency: null == (n = Salla.config.currency()) ? void 0 : n.code,
              name: e.name,
              brand: null == (r = e.brand) ? void 0 : r.name,
              variant: null == (i = e.variant) ? void 0 : i.toString(),
              coupon: null == (o = e.coupon) ? void 0 : o.toString(),
              price: e.price,
              quantity: Number(e.quantity),
              sku: e.sku,
              position: 0,
              url: e.url,
              image_url: null == (a = e.image) ? void 0 : a.url,
            };
          }),
        },
      };
    }
    static shouldSend(e) {
      return (
        !((null == e ? void 0 : e.nextPage) || "").includes("filters") &&
        !["index", "customer.wishlist"].includes(salla.config.get("page.slug"))
      );
    }
  }
  class pc {
    constructor() {
      this.user = JSON.parse(localStorage.getItem("user"));
    }
    toSegment() {
      var e, t, n, r, i;
      return {
        event: "Signed In",
        properties: {
          first_name: null == (e = this.user) ? void 0 : e.first_name,
          last_name: null == (t = this.user) ? void 0 : t.last_name,
          type: null == (n = this.user) ? void 0 : n.type,
          mobile: null == (r = this.user) ? void 0 : r.mobile,
          email: null == (i = this.user) ? void 0 : i.email,
        },
      };
    }
    static shouldSend() {
      return "user" === Salla.config.get("user.type")
        ? !Salla.analytics.history.find(({ eventName: e }) => "Signed In" === e)
        : (Salla.profile.event.onInfoFetched(() =>
            Salla.event.emit("Signed In"),
          ),
          !1);
    }
  }
  class fc {
    constructor(e) {
      this.details = null == e ? void 0 : e.data;
    }
    toSegment() {
      const e = ["first_name", "last_name", "birthday", "gender"].filter(
        (e) => {
          var t, n;
          return (
            fc.user[e] !== (null == (t = this.details) ? void 0 : t[e]) &&
            (void 0 !== fc.user[e] ||
              void 0 !== (null == (n = this.details) ? void 0 : n[e]))
          );
        },
      );
      return (
        fc.setUser(this.details),
        { event: "User Profile Updated", properties: { updated_fields: e } }
      );
    }
    static registerEvent() {
      Salla.onReady(() => {
        salla.url.is_page("customer.profile") &&
          fc.setUser(Salla.config.get("user"));
      });
    }
    static setUser(e) {
      fc.user = {
        first_name: null == e ? void 0 : e.first_name,
        last_name: null == e ? void 0 : e.last_name,
        gender: null == e ? void 0 : e.gender,
        birthday: null == e ? void 0 : e.birthday,
        avatar: null == e ? void 0 : e.avatar,
      };
    }
    static shouldSend() {
      return "user" === Salla.config.get("user.type");
    }
  }
  fc.user = {};
  class gc {
    static registerEvents() {
      Object.values(this.events).forEach((e) => {
        e.forEach((e) => {
          "function" == typeof e.registerEvent && e.registerEvent();
        });
      });
    }
    static transform(e, t) {
      try {
        const n = this.events[e] || [];
        for (const e of n) {
          if (!e || ("function" == typeof e.shouldSend && !e.shouldSend(t)))
            continue;
          const n = new e(t).toSegment();
          return { event: n.event, properties: n.properties };
        }
        return null;
      } catch (e) {
        return (console.error("Failed to transform event:", e), null);
      }
    }
  }
  gc.events = {
    "Order Completed": [
      class {
        constructor(e) {
          this.details = e[0];
        }
        toSegment() {
          return { event: "Order Completed", properties: this.details };
        }
      },
    ],
    "Product Added": [
      class {
        constructor(e) {
          this.item = e[0];
        }
        toSegment() {
          var e, t, n, r, i;
          return {
            event: "Product Added",
            properties: {
              cart_id: null == (e = this.item.cart_id) ? void 0 : e.toString(),
              cart_item_id:
                null == (t = this.item.cart_item_id) ? void 0 : t.toString(),
              product_id: null == (n = this.item.id) ? void 0 : n.toString(),
              category: this.item.category,
              currency: null == (r = Salla.config.currency()) ? void 0 : r.code,
              name: this.item.name,
              brand: this.item.brand,
              variant: null == (i = this.item.variant) ? void 0 : i.toString(),
              price: this.item.price,
              quantity: this.item.quantity,
              sku: this.item.sku,
              coupon: this.item.coupon,
              position: this.item.position,
              url: this.item.url,
              image_url: this.item.image_url,
            },
          };
        }
        static shouldSend() {
          return "customer.wishlist" !== salla.config.get("page.slug");
        }
      },
      class {
        constructor(e) {
          this.item = e[0];
        }
        toSegment() {
          var e, t;
          return {
            event: "Wishlist Product Added to Cart",
            properties: {
              wishlist_id:
                salla.config.get("store.id") +
                "_" +
                salla.config.get("user.id"),
              wishlist_name: salla.config.get("store.name"),
              cart_id: null == (e = this.item.cart_id) ? void 0 : e.toString(),
              product_id: null == (t = this.item.id) ? void 0 : t.toString(),
              category: this.item.category,
              name: this.item.name,
              brand: this.item.brand,
              variant: this.item.variant,
              price: this.item.price,
              quantity: this.item.quantity,
              sku: this.item.sku,
              coupon: this.item.coupon,
              position: this.item.position,
              url: this.item.url,
              image_url: this.item.image_url,
            },
          };
        }
        static shouldSend() {
          return "customer.wishlist" === salla.config.get("page.slug");
        }
      },
    ],
    "Product Removed": [
      class {
        constructor(e) {
          this.item = e[0];
        }
        toSegment() {
          var e, t, n, r, i, o, a, s, l, u, c, d, h, p;
          return {
            event: "Product Removed",
            properties: {
              cart_id:
                null == (e = this.item) || null == (e = e.cart_id)
                  ? void 0
                  : e.toString(),
              product_id:
                null == (t = this.item) || null == (t = t.id)
                  ? void 0
                  : t.toString(),
              category: null == (n = this.item) ? void 0 : n.category,
              currency: null == (r = Salla.config.currency()) ? void 0 : r.code,
              name: null == (i = this.item) ? void 0 : i.name,
              brand: null == (o = this.item) ? void 0 : o.brand,
              variant: null == (a = this.item) ? void 0 : a.variant,
              price: null == (s = this.item) ? void 0 : s.price,
              quantity: null == (l = this.item) ? void 0 : l.quantity,
              sku: null == (u = this.item) ? void 0 : u.sku,
              coupon: null == (c = this.item) ? void 0 : c.coupon,
              position: null == (d = this.item) ? void 0 : d.position,
              url: null == (h = this.item) ? void 0 : h.url,
              image_url: null == (p = this.item) ? void 0 : p.image_url,
            },
          };
        }
      },
    ],
    "Product Viewed": [
      class {
        constructor(e) {
          this.product = e[0];
          try {
            ((this.source = sessionStorage.getItem("s-viewed-source") || null),
              sessionStorage.removeItem("s-viewed-source"));
          } catch (e) {
            this.source = null;
          }
        }
        toSegment() {
          var e;
          return {
            event: "Product Viewed",
            properties: {
              product_id: null == (e = this.product.id) ? void 0 : e.toString(),
              category: this.product.category,
              name: this.product.name,
              brand: this.product.brand,
              variant: this.product.variant,
              price: this.product.price,
              quantity: this.product.quantity,
              currency: this.product.currency,
              coupon: this.product.coupon,
              position: this.product.position,
              value: this.product.value,
              sku: this.product.sku,
              url: this.product.url,
              image_url: this.product.image_url,
              source: this.source,
            },
          };
        }
      },
    ],
    "Product Added to Wishlist": [
      class {
        constructor(e) {
          this.product = e.data.product;
        }
        toSegment() {
          var e, t, n;
          return {
            event: "Product Added to Wishlist",
            properties: {
              wishlist_id:
                salla.config.get("store.id") +
                "_" +
                salla.config.get("user.id"),
              wishlist_name: salla.config.get("store.name"),
              product_id: null == (e = this.product.id) ? void 0 : e.toString(),
              name: this.product.name,
              brand: this.product.brand,
              variant: this.product.variant,
              price: this.product.price,
              quantity: Math.max(1, Number(this.product.quantity)),
              sku: this.product.sku || null,
              position: Number(this.product.position || 0),
              url: this.product.url,
              image_url:
                (null == (t = this.product) ? void 0 : t.image) || null,
              category: this.product.category,
              currency: null == (n = Salla.config.currency()) ? void 0 : n.code,
              brand: this.product.brand,
            },
          };
        }
      },
    ],
    "Product Removed from Wishlist": [
      class {
        constructor(e) {
          this.product = e.data.product;
        }
        toSegment() {
          var e, t, n;
          return {
            event: "Product Removed from Wishlist",
            properties: {
              wishlist_id:
                salla.config.get("store.id") +
                "_" +
                salla.config.get("user.id"),
              wishlist_name: salla.config.get("store.name"),
              product_id: null == (e = this.product.id) ? void 0 : e.toString(),
              name: this.product.name,
              brand: this.product.brand,
              variant: this.product.variant,
              price: this.product.price,
              quantity: Math.max(1, Number(this.product.quantity)),
              sku: this.product.sku || null,
              coupon: this.product.coupon || null,
              position: Number(this.product.position || 0),
              currency: null == (t = Salla.config.currency()) ? void 0 : t.code,
              url: this.product.url,
              image_url:
                (null == (n = this.product) ? void 0 : n.image) || null,
              category: this.product.category,
              brand: this.product.brand,
            },
          };
        }
      },
    ],
    "Cart Viewed": [
      class {
        constructor(e) {
          this.cart = e[0];
        }
        toSegment() {
          var e;
          return {
            event: "Cart Viewed",
            properties: {
              cart_id: null == (e = this.cart.cart_id) ? void 0 : e.toString(),
              products: this.cart.products.map((e) => {
                var t, n, r;
                return {
                  product_id: null == (t = e.id) ? void 0 : t.toString(),
                  cart_item_id:
                    null == (n = e.cart_item_id) ? void 0 : n.toString(),
                  name: e.name,
                  price: e.price,
                  category: e.category,
                  sku: e.sku,
                  position: e.position,
                  url: e.url,
                  image_url: e.image_url,
                  brand: e.brand,
                  currency:
                    null == (r = Salla.config.currency()) ? void 0 : r.code,
                  variant: e.variant,
                  coupon: e.coupon,
                  quantity: e.quantity,
                };
              }),
            },
          };
        }
      },
    ],
    "Products Searched": [
      class {
        constructor(e) {
          this.query = e;
        }
        toSegment() {
          return {
            event: "Products Searched",
            properties: { query: this.query },
          };
        }
      },
    ],
    "Product List Viewed": [hc],
    "Product List Filtered": [
      class extends hc {
        constructor(e) {
          super(e);
          const t = (null == e ? void 0 : e.nextPage) || "";
          this.filters = this.extractFilters(t);
        }
        extractFilters(e) {
          if (!e) return null;
          try {
            const t = new URL(e),
              n = [];
            return (
              Array.from(t.searchParams.entries()).forEach(([e, t]) => {
                if (e.startsWith("filters[")) {
                  const r = e.match(/^filters\[(.*?)\]/),
                    i = r ? r[1] : e;
                  n.push({ type: i, value: t });
                }
              }),
              n.length > 0 ? n : null
            );
          } catch (e) {
            return (
              console.warn("Error extracting filters from URL:", e),
              null
            );
          }
        }
        toSegment() {
          const e = super.toSegment();
          return {
            event: "Product List Filtered",
            properties: jn({}, null == e ? void 0 : e.properties, {
              filters: this.filters,
            }),
          };
        }
        static shouldSend(e) {
          return ((null == e ? void 0 : e.nextPage) || "").includes("filters");
        }
      },
    ],
    "Signed Up": [
      class extends pc {
        toSegment() {
          const e = super.toSegment();
          return {
            event: "Signed Up",
            properties: null == e ? void 0 : e.properties,
          };
        }
        static shouldSend() {
          return (
            "user" === Salla.config.get("user.type") ||
            (Salla.profile.event.onInfoFetched(() =>
              Salla.event.emit("Signed Up"),
            ),
            !1)
          );
        }
      },
    ],
    "Signed In": [pc],
    "Signed Out": [
      class {
        toSegment() {
          return { event: "Signed Out", properties: {} };
        }
      },
    ],
    "Product Reviewed": [
      class {
        constructor(e) {
          this.details = e;
        }
        toSegment() {
          return { event: "Product Reviewed", properties: this.details };
        }
        static registerEvent() {
          salla.event.rating.onProductsRated(function (e, t) {
            const { products: n, order_id: r } = t;
            Object.values(n).forEach((e) => {
              var t;
              Salla.event.emit("Product Reviewed", {
                product_id: null == (t = e.product_id) ? void 0 : t.toString(),
                review_id: null == r ? void 0 : r.toString(),
                review_body: e.comment,
                rating: e.rating,
              });
            });
          });
        }
      },
    ],
    "Product Shared": [
      class {
        constructor(e) {
          this.data = e;
        }
        toSegment() {
          var e;
          const t =
            (null ==
            (e = Salla.analytics.history.find(
              ({ eventName: e }) => "Product Viewed" === e,
            ))
              ? void 0
              : e.payload) || {};
          return (
            (t.share_via = this.data.share_via),
            { event: "Product Shared", properties: t }
          );
        }
        static shouldSend() {
          return "product.single" === salla.config.get("page.slug");
        }
      },
    ],
    "Promotion Viewed": [
      class {
        constructor(e) {
          this.promotion = e[0];
        }
        toSegment() {
          var e;
          return {
            event: "Promotion Viewed",
            properties: {
              promotion_id:
                null == (e = this.promotion.id) ? void 0 : e.toString(),
              creative: this.promotion.creative,
              name: this.promotion.name,
              position: this.promotion.position,
            },
          };
        }
      },
    ],
    "Promotion Clicked": [
      class {
        constructor(e) {
          this.promotion = e[0];
        }
        toSegment() {
          var e;
          return {
            event: "Promotion Clicked",
            properties: {
              promotion_id:
                null == (e = this.promotion.id) ? void 0 : e.toString(),
              creative: this.promotion.creative,
              name: this.promotion.name,
              position: this.promotion.position,
            },
          };
        }
      },
    ],
    "Coupon Applied": [
      class {
        constructor(e) {
          this.transaction = e;
        }
        getCartId() {
          var e, t;
          return "cart" === salla.config.get("page.slug")
            ? null == (t = salla.config.get("page.id"))
              ? void 0
              : t.toString()
            : (null == (e = this.transaction) ||
              null == (e = e.data) ||
              null == (e = e.cart) ||
              null == (e = e.id)
                ? void 0
                : e.toString()) || "";
        }
        toSegment() {
          var e, t;
          return {
            event: "Coupon Applied",
            properties: {
              cart_id: this.getCartId(),
              coupon_name:
                (null == (e = this.transaction) ||
                null == (e = e.data) ||
                null == (e = e.cart)
                  ? void 0
                  : e.coupon) || "",
              discount:
                (null == (t = this.transaction) ||
                null == (t = t.data) ||
                null == (t = t.cart)
                  ? void 0
                  : t.discount) || 0,
              currency: salla.config.get("user.currency") || "",
            },
          };
        }
      },
    ],
    "Coupon Removed": [
      class {
        constructor(e) {
          this.transaction = e;
        }
        getCartId() {
          var e, t;
          return "cart" === salla.config.get("page.slug")
            ? null == (t = salla.config.get("page.id"))
              ? void 0
              : t.toString()
            : (null == (e = this.transaction) ||
              null == (e = e.data) ||
              null == (e = e.cart) ||
              null == (e = e.id)
                ? void 0
                : e.toString()) || "";
        }
        toSegment() {
          var e, t;
          return {
            event: "Coupon Removed",
            properties: {
              cart_id: this.getCartId(),
              coupon_name:
                (null == (e = this.transaction) ? void 0 : e.coupon) || "",
              discount:
                (null == (t = this.transaction) ||
                null == (t = t.data) ||
                null == (t = t.cart)
                  ? void 0
                  : t.discount) || 0,
              currency: salla.config.get("user.currency") || "",
            },
          };
        }
      },
    ],
    "Coupon Denied": [
      class {
        constructor(e) {
          this.transaction = e;
        }
        getCartId() {
          var e;
          return "cart" === salla.config.get("page.slug")
            ? null == (e = salla.config.get("page.id"))
              ? void 0
              : e.toString()
            : "";
        }
        getCouponCode() {
          try {
            var e, t;
            const n =
              null == (e = this.transaction.response) || null == (e = e.config)
                ? void 0
                : e.data;
            return n ? (null == (t = JSON.parse(n)) ? void 0 : t.coupon) : "";
          } catch (e) {
            return "";
          }
        }
        toSegment() {
          var e;
          return {
            event: "Coupon Denied",
            properties: {
              cart_id: this.getCartId(),
              coupon_name: this.getCouponCode(),
              reason:
                (null == (e = this.transaction.response) ||
                null == (e = e.data) ||
                null == (e = e.error)
                  ? void 0
                  : e.message) || "Unknown error",
            },
          };
        }
      },
    ],
    "User Profile Updated": [fc],
    "Cart Updated": [
      class {
        constructor(e) {
          this.cart = e;
        }
        toSegment() {
          var e, t, n, r;
          return {
            event: "Cart Updated",
            properties: {
              cart_id: null == (e = this.cart.id) ? void 0 : e.toString(),
              value: this.cart.total,
              revenue: this.cart.sub_total,
              tax: this.cart.tax_amount,
              discount: this.cart.total_discount,
              shipping: this.cart.real_shipping_cost,
              currency: null == (t = Salla.config.currency()) ? void 0 : t.code,
              affiliation:
                null == (n = Salla.storage.getWithTTL("s-utms"))
                  ? void 0
                  : n["s-utm-source"],
              products:
                null == (r = this.cart.items)
                  ? void 0
                  : r.map((e) => {
                      var t, n, r, i, o, a;
                      return {
                        product_id:
                          null == (t = e.product_id) ? void 0 : t.toString(),
                        name: e.product_name,
                        price: e.product_price,
                        category:
                          null == (n = e.category) ? void 0 : n.toString(),
                        sku:
                          null == (r = e.product_sku) ? void 0 : r.toString(),
                        position: e.position,
                        url: e.url,
                        image_url: e.product_image,
                        brand: null == (i = e.brand) ? void 0 : i.toString(),
                        currency:
                          null == (o = Salla.config.currency())
                            ? void 0
                            : o.code,
                        variant:
                          null == (a = e.variant) ? void 0 : a.toString(),
                        coupon: this.cart.coupon,
                        quantity: e.quantity,
                      };
                    }),
            },
          };
        }
        static shouldSend(e) {
          return (
            "cart" === salla.config.get("page.slug") &&
            !(null != e && e.fromLatestFetched)
          );
        }
      },
    ],
    "Market Selected": [
      class {
        constructor(e) {
          this.scope = e.data;
        }
        toSegment() {
          return {
            event: "Market Selected",
            properties: jn({}, this.getScope(this.scope), {
              prev: this.getScope(Salla.config.get("store.scope")),
            }),
          };
        }
        getScope(e) {
          var t;
          return {
            id: null == (t = (e = e || {}).id) ? void 0 : t.toString(),
            country: this.getScopeAttribute(e, "countries"),
            currency: this.getScopeAttribute(e, "currencies"),
            locale: this.getScopeAttribute(e, "languages"),
          };
        }
        getScopeAttribute(e, t) {
          return ((e = e[t]), Array.isArray(e) ? e[0] : e);
        }
      },
    ],
    "Product Reordered": [
      class {
        constructor(e) {
          this.details = e;
        }
        toSegment() {
          var e;
          return {
            event: "Product Reordered",
            properties: {
              product_id:
                null == (e = this.details) ||
                null == (e = e.data) ||
                null == (e = e.id)
                  ? void 0
                  : e.toString(),
            },
          };
        }
        static shouldSend(e) {
          const t = null == e ? void 0 : e.data;
          return (
            (null == t ? void 0 : t.id) &&
            !isNaN(null == t ? void 0 : t.id) &&
            "reorder" === (null == t ? void 0 : t.type)
          );
        }
      },
    ],
  };
  return (
    (Dn.versions.twilight = "2.14.361"),
    (Dn.onInitiated = (e) => salla.event.once("twilight::initiated", e)),
    (Dn.onReady =
      Dn.onReady ||
      function (e) {
        return new Promise(function (t) {
          return "ready" === salla.status
            ? t(e ? e(salla.config.all()) : salla.config.all())
            : Dn.onInitiated((n) => t(e ? e(n) : n));
        });
      }),
    (Dn.status = "loading"),
    (Dn.notify = En),
    (Dn.lang = new (class extends fr {
      constructor(e) {
        (((e = e || {}).messages = e.messages || window.translations),
          (e.locale =
            e.locale ||
            (
              window.locale ||
              navigator.language ||
              navigator.userLanguage ||
              "ar"
            ).split("-")[0]),
          (e.fallback = e.fallback || e.locale),
          super(e),
          (this.translationsLoaded = !1),
          Salla.event.on("twilight::before.ready", () =>
            this.loadStoreTranslations(),
          ));
      }
      onLoaded(e) {
        return new Promise((t) => {
          if (this.translationsLoaded) return t(e ? e() : null);
          Salla.event.once("languages::translations.loaded", () =>
            t(e ? e() : null),
          );
        });
      }
      loadStoreTranslations() {
        if (
          ((this.hash = salla.config.get(
            "theme.translations_hash",
            salla.config.get("store.id", "twilight"),
          )),
          this.message ||
            (salla.log("try to load translations from localstorage"),
            (this.messages = salla.storage.get(`s_translations.${this.hash}`)),
            this.messages &&
              (this.translationsLoaded = !0) &&
              super.setMessages(this.messages)),
          this.messages)
        )
          return (
            salla.event.dispatch("languages::translations.loaded"),
            void salla.logger.info(
              "The messages of transactions is already loaded",
            )
          );
        salla.url.get("")
          ? this.loadScript(salla.url.get(`languages/assets/${this.hash}.js`))
          : this.loadScript("https://cdn.salla.network/js/translations.js", !1);
      }
      setMessages(e) {
        (super.setMessages(e),
          salla.event.dispatch("languages::translations.loaded"),
          (this.translationsLoaded = !0));
      }
      loadScript(e, t = !0) {
        let n = document.createElement("script");
        ((n.src = e),
          (n.onload = () => {
            if (window.translations)
              return (
                salla.storage.remove("s_translations"),
                salla.storage.set("s_translations", {
                  [this.hash]: window.translations,
                }),
                this.setMessages(window.translations)
              );
            n.onerror();
          }),
          (n.onerror = () => {
            if (t)
              return (
                salla.logger.warn(
                  "Failed to load Translations for store, lets try load it from CDN",
                ),
                this.loadScript(
                  "https://cdn.salla.network/js/translations.js",
                  !1,
                )
              );
            salla.logger.error(
              "Failed to load Translations, check your network logs for more details\nor: salla.lang.setMessages({....}), see https://docs.salla.dev for more information's.",
            );
          }),
          document.head.appendChild(n));
      }
      getWithDefault(e, t, n, r) {
        let i = this.get(e, n, r);
        return i !== e ? i : t;
      }
      get(e, t, n) {
        let r = e;
        (window.translations || this.translationsLoaded) && (r = "trans." + e);
        let i = super.get(r, t, n);
        return i !== r ? i : super.get(r, t, "en").replace(r, e);
      }
      set(e, t) {
        return (
          salla.helpers.setNested(
            this.messages[`${this.getLocale()}.trans`],
            e,
            t,
          ),
          this
        );
      }
      add(e, t) {
        return (
          Object.entries(t).forEach((t) =>
            salla.helpers.setNested(this.messages[t[0] + ".trans"], e, t[1]),
          ),
          this
        );
      }
      addBulk(e) {
        return (
          Object.entries(e).forEach(([e, t]) => {
            this.add(e, t);
          }),
          this
        );
      }
    })()),
    (Dn.form = new (class {
      async submit(e, t = null) {
        var n;
        let r = t;
        if (
          "SubmitEvent" ===
            (null == t || null == (n = t.constructor) ? void 0 : n.name) ||
          "submit" === (null == t ? void 0 : t.type)
        ) {
          var i, o;
          if (
            (t.preventDefault(),
            "FORM" !== (null == (i = t.target) ? void 0 : i.tagName))
          )
            return (
              Salla.logger.warn(
                "Failed find the target element for submit action. make sure you submit a form element",
              ),
              new Promise(() => {
                throw "Failed find the target element for submit action. make sure you submit a form element";
              })
            );
          ("SALLA-BUTTON" ===
            (null == t ||
            null == (o = t.submitter) ||
            null == (o = o.parentElement)
              ? void 0
              : o.tagName) && t.submitter.parentElement.load(),
            (r = t.target.getElementSallaData()),
            salla.log("Data from element", r));
        }
        if (
          /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm.test(
            e,
          )
        )
          return salla.api.request(e, r, "post").finally(() => {
            var e;
            loaderSupported &&
              (null == t ||
                null == (e = t.submitter) ||
                e.parentElement.stop());
          });
        let a = e.split("."),
          s = a.splice(-1);
        return await salla
          .call(a.join("."))
          [s](r)
          .finally(() => {
            var e;
            return null == t ||
              null == (e = t.submitter) ||
              null == (e = e.parentElement)
              ? void 0
              : e.stop();
          })
          .catch((e) => {
            throw (salla.logger.warn(e), e);
          });
      }
      onSubmit(e, t) {
        return (salla.form.submit(e, t), !1);
      }
      onChange(e, t) {
        var n;
        return null != t && t.currentTarget
          ? "FORM" !==
              (null == t || null == (n = t.currentTarget)
                ? void 0
                : n.tagName) || t.currentTarget.checkValidity()
            ? (salla.form.submit(e, t.currentTarget.getElementSallaData()), !0)
            : (salla.logger.warn(
                `Trying to trigger '${e}' without filling required fields!`,
              ),
              !1)
          : (salla.logger.warn(`Trying to trigger '${e}' without event!`), !1);
      }
      getPossibleValue(e, t, n = !1) {
        if (!e) return;
        if ("object" != typeof e) return e;
        let r;
        for (
          let n = 0;
          n < t.length &&
          !(r = e[t[n]]) &&
          !(
            "undefined" != typeof FormData &&
            e instanceof FormData &&
            (r = e.get(t[n]))
          );
          n++
        );
        return ((r = r || e), "object" != typeof r || n ? r : void 0);
      }
    })()),
    (Dn.infiniteScroll = new (class extends An {
      constructor(e, t) {
        (super(e, t),
          (this.options = {
            path: ".infinite-scroll-btn",
            history: "push",
            status: ".infinite-scroll-status",
            append: ".list-block",
          }),
          (this.fetchOptions = {
            headers: {
              "S-INFINITE-SCROLL": !0,
              "S-Source": "twilight",
              "cache-control": "no-cache",
              pragma: "no-cache",
            },
          }),
          (this.instances = []));
      }
      initiate(e, t, n, r = !1) {
        r
          ? (((n = n || {}).fetchOptions = jn(
              {},
              this.fetchOptions,
              n.fetchOptions || {},
            )),
            (n.responseBody = "json"))
          : (n = this.getCustomOptions(t, n));
        let i = "string" != typeof e ? e : document.querySelector(e),
          o = n.path;
        if (!i || !o || ("string" == typeof o && !document.querySelector(o)))
          return void Salla.logger.warn(
            i
              ? "Path Option (a link that has next page link) Not Existed!"
              : "Container For InfiniteScroll not Existed!",
          );
        let a = new dr(i, n);
        return (
          a.on("scrollThreshold", Salla.infiniteScroll.event.scrollThreshold),
          a.on("request", Salla.infiniteScroll.event.request),
          a.on("load", Salla.infiniteScroll.event.load),
          a.on("append", Salla.infiniteScroll.event.append),
          a.on("error", Salla.infiniteScroll.event.error),
          a.on("last", Salla.infiniteScroll.event.last),
          a.on("history", Salla.infiniteScroll.event.history),
          this.instances.push(a),
          a
        );
      }
      getCustomOptions(e, t) {
        return (
          ((t = ("object" == typeof e && e) || t || this.options).fetchOptions =
            this.fetchOptions),
          (t.path = t.path || this.options.path),
          (t.button = t.button || t.path),
          (t.status = t.status || this.options.status),
          t.hasOwnProperty("history") || (t.history = this.options.history),
          (t.nextPage = t.nextPage || t.next_page),
          (t.append =
            ("string" == typeof e && e) || t.append || this.options.append),
          t
        );
      }
      loadNextPage(e) {
        ("string" != typeof e ? e : document.querySelector(e)).loadNextPage();
      }
      destroy(e) {
        ("string" != typeof e ? e : document.querySelector(e)).destroy();
      }
    })(void 0, salla.event.infiniteScroll)),
    (Dn.api = new (class extends ia {
      constructor() {
        (super(),
          (this.auth = new yr()),
          (this.cart = new mr()),
          (this.loyalty = new vr()),
          (this.order = new br()),
          (this.rating = new Er()),
          (this.product = new wr()),
          (this.profile = new Dr()),
          (this.comment = new Fr()),
          (this.currency = new Sr()),
          (this.document = new _r()),
          (this.wishlist = new Ar()),
          (this.scope = new Cr()),
          (this.booking = new kr()),
          (this.landing = new xr()),
          (this.notifications = new Pr()),
          (this.component = new oa()),
          (this.advertisement = new aa()),
          (this.navigation = new sa()),
          (this.metadata = new la()));
      }
      beaconRequest(e, t = {}) {
        var n;
        if (null == (n = window.navigator) || !n.sendBeacon) return fetch(e, t);
        const r =
            "string" == typeof (null == t ? void 0 : t.body)
              ? null == t
                ? void 0
                : t.body
              : JSON.stringify((null == t ? void 0 : t.body) || {}),
          i = new Blob([r], { type: "application/json" });
        return (
          Salla.log(
            `Beacon payload size: ${i.size} bytes (~${(i.size / 1024).toFixed(2)} KB)`,
          ),
          navigator.sendBeacon(e, i),
          Promise.resolve(
            new Response('{"status":"sent_via_beacon"}', {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }),
          )
        );
      }
    })()),
    (Dn.sso = new (class {
      constructor() {
        Salla.onReady(() => this.init());
      }
      init() {
        var e;
        if (salla.config.get("store.features", []).includes("sso-login")) {
          if (window.location.hostname.includes("salla"))
            return salla.log(
              "SSO is not supported yet for stores without custom domain.",
            );
          (salla.auth.event.onLoggedOut(
            () =>
              new Promise((e) => {
                const t = document.createElement("iframe");
                ((t.style.display = "none"),
                  (t.src = salla.url.get("sso/logout")),
                  document.body.appendChild(t),
                  (t.onload = () => {
                    (document.body.removeChild(t), e());
                  }));
              }),
          ),
            null == (e = document.querySelector("salla-login-modal")) ||
              e.remove(),
            Salla.event.removeAllListeners("login::open"),
            Salla.event.prependListener("login::open", () => this.redirect()),
            window.addEventListener("mini-checkout::before-init", (e) => {
              Salla.config.isUser() || (e.preventDefault(), this.redirect());
            }));
        }
      }
      redirect() {
        const e = window.location.pathname + window.location.search,
          t = `${window.location.origin}/sso/login?intended_to=${encodeURIComponent(e)}`;
        return (
          console.log("Redirecting to:", t),
          (window.location.href = t),
          !0
        );
      }
    })()),
    (Dn.intend = new (class {
      constructor() {
        Salla.onReady(() => this.init());
      }
      init() {
        if (Salla.config.isUser()) return;
        const e = new URLSearchParams(window.location.search);
        if (e.has("intended_to"))
          try {
            const t = new URL(e.get("intended_to"));
            if (t.hostname !== window.location.hostname) return;
            return this.handleAfterLoginEvent(t);
          } catch (e) {
            return void console.warn(
              "Invalid URL provided in intended_to parameter",
            );
          }
      }
      handleAfterLoginEvent(e) {
        let t = "intend::user.logged.in";
        (Salla.event.on(t, () => (window.location = e)),
          Salla.api.auth.setAfterLoginEvent(t),
          Salla.api.auth.setCanRedirect(!1),
          Salla.event.on("salla-login::ready", () =>
            Salla.event.emit("login::open", { withoutReload: !0 }),
          ));
      }
    })()),
    (Dn.hooks = new (class {
      constructor() {
        ((this._store = new Map()),
          (this._whitelist = new Map([
            [
              "salla-add-product-button",
              new Set(["validate", "componentDidLoad"]),
            ],
            ["salla-product-options", new Set(["componentDidLoad"])],
            ["salla-products-list", new Set(["componentDidLoad"])],
            ["salla-products-slider", new Set(["componentDidLoad"])],
            ["salla-hook", new Set(["componentDidLoad"])],
          ])),
          (this._themeSlots = [
            "head",
            "head:start",
            "head:end",
            "body:start",
            "body:end",
            "product:index.items.start",
            "product:index.items.end",
            "product:single.description.start",
            "product:single.description",
            "product:single.description.end",
            "product:single.form.start",
            "product:single.form.end",
            "blog:index.items.start",
            "blog:index.items.end",
            "blog:single.items.start",
            "blog:single.items.end",
            "brands:index.items.start",
            "brands:index.items.end",
            "brands:single.details.start",
            "brands:single.details.end",
            "brands:single.items.start",
            "brands:single.items.end",
            "cart:items.start",
            "cart:items.end",
            "cart:summary.start",
            "cart:summary.end",
            "cart:submit.start",
            "cart:submit.end",
            "customer:notifications.items.start",
            "customer:notifications.items.end",
            "customer:orders.index.items.start",
            "customer:orders.index.items.end",
            "customer:orders.single.details.start",
            "customer:orders.single.details.end",
            "customer:wishlist.items.start",
            "customer:wishlist.items.end",
            "customer:profile.form.start",
            "customer:profile.form.fields.start",
            "customer:profile.form.fields.end",
            "customer:profile.form.submit.start",
            "customer:profile.form.submit.end",
            "customer:profile.form.end",
            "thank-you:start",
            "thank-you:items.start",
            "thank-you:items.end",
            "thank-you:end",
          ]));
        const e = Salla.config.get("page.slug");
        (e &&
          (this._themeSlots.push(e + ":start"),
          this._themeSlots.push(e + ":end")),
          Salla.onReady(() => {
            const e = Salla.config.get("page.slug");
            e &&
              (this._themeSlots.includes(e + ":start") ||
                this._themeSlots.push(e + ":start"),
              this._themeSlots.includes(e + ":end") ||
                this._themeSlots.push(e + ":end"));
          }),
          (this._componentHistory = new Map()));
      }
      renderAutoComponents(e) {
        Array.isArray(e) &&
          0 !== e.length &&
          e.forEach(({ hook: e, tag: t, canRender: n }) => {
            (n && !n()) ||
              customElements.get(t) ||
              this.mount(e, document.createElement(t));
          });
      }
      registerHook(e, t, n, r = {}) {
        if (!this._isAllowed(e, t))
          return (
            console.warn(`[Hooks] Hook "${e}:${t}" is not allowed`),
            () => {}
          );
        const i = 0 | r.priority,
          o = !!r.once,
          a = this._ensureTag(e),
          s = a.get(t) || [];
        return (
          s.push({ cb: n, p: i, once: o }),
          s.sort((e, t) => t.p - e.p),
          a.set(t, s),
          "componentDidLoad" === t && this._callForLoadedComponents(e, n),
          () => this.removeHook(e, t, n)
        );
      }
      registerHookOnce(e, t, n, r = {}) {
        return this.registerHook(e, t, n, jn({}, r, { once: !0 }));
      }
      async call(e, t, n) {
        const r = this._store.get(e);
        if (!r) return;
        const i = r.get(t);
        if (i && 0 !== i.length)
          for (const r of [...i]) {
            try {
              await r.cb(n);
            } catch (n) {
              console.warn(`[Hooks] "${e}:${t}" callback failed:`, n);
            }
            r.once && this.removeHook(e, t, r.cb);
          }
      }
      removeHook(e, t, n) {
        const r = this._store.get(e);
        if (!r) return !1;
        if (!r.has(t)) return !1;
        if (!n) return (r.delete(t), 0 === r.size && this._store.delete(e), !0);
        const i = r.get(t),
          o = i.findIndex((e) => e.cb === n);
        return (
          o > -1 &&
          (i.splice(o, 1),
          0 === i.length && r.delete(t),
          0 === r.size && this._store.delete(e),
          !0)
        );
      }
      clear(e) {
        e ? this._store.delete(e) : this._store.clear();
      }
      get(e, t) {
        var n;
        const r = this._store.get(e);
        return (
          (r && (null == (n = r.get(t)) ? void 0 : n.map((e) => e.cb))) || []
        );
      }
      _ensureTag(e) {
        let t = this._store.get(e);
        return (t || ((t = new Map()), this._store.set(e, t)), t);
      }
      _isAllowed(e, t) {
        const n = this._whitelist.get(e);
        return n
          ? !!n.has(t) ||
              (console.warn(
                `[Hooks] Hook "${t}" is not allowed for tag "${e}"`,
              ),
              !1)
          : (console.warn(`[Hooks] Tag "${e}" is not in the whitelist`), !1);
      }
      registerComponent(e, t) {
        this._componentHistory.has(e) ||
          this._componentHistory.set(e, new Set());
        const n = this._componentHistory.get(e);
        if (!n.has(t)) return (n.add(t), this.call(e, "componentDidLoad", t));
      }
      async _callForLoadedComponents(e, t) {
        const n = this._componentHistory.get(e);
        if (n && 0 !== n.size)
          for (const r of n)
            try {
              await t(r);
            } catch (t) {
              console.warn(
                `[Hooks] "${e.replace(/[^a-zA-Z0-9-_]/g, "")}:componentDidLoad" callback failed:`,
                t,
              );
            }
      }
      mount(e, t) {
        return this._themeSlots.includes(e)
          ? new Promise((n) => {
              this.registerHook("salla-hook", "componentDidLoad", (r) => {
                r.name === e && (r.mount(t), n(t));
              });
            })
          : (console.warn(`[Hooks] Hook "${e}" is not allowed`),
            Promise.reject(t));
      }
    })()),
    [
      "cart",
      "auth",
      "order",
      "scope",
      "rating",
      "comment",
      "loyalty",
      "product",
      "profile",
      "currency",
      "document",
      "wishlist",
      "booking",
      "landing",
      "metadata",
    ].forEach((e) => (Dn[e] = new An(Dn.api[e], Dn.event[e]))),
    (Dn.call = (e) => {
      let t = Dn,
        n = e.split(".");
      for (; n.length && (t = t[n.shift()]); );
      return t;
    }),
    (Dn.analytics = new (class {
      constructor() {
        ((this.history = []),
          (this.customTrackers = []),
          (this.context = {}),
          (this._anonymousId = null),
          (this._jitsuConfig = null),
          (this.mappedEvents = {
            "wishlist::added": "Product Added to Wishlist",
            "wishlist::removed": "Product Removed from Wishlist",
            "salla-products-list::products.fetched": [
              "Product List Viewed",
              "Product List Filtered",
            ],
            "auth::registered": "Signed Up",
            "auth::logged.in": "Signed In",
            "auth::logged.out": "Signed Out",
            "share-element": "Product Shared",
            "promotion::viewed": "Promotion Viewed",
            "promotion::clicked": "Promotion Clicked",
            "cart::coupon.added": "Coupon Applied",
            "cart::coupon.deleted": "Coupon Removed",
            "cart::coupon.addition.failed": "Coupon Denied",
            "profile::updated": "User Profile Updated",
            "cart::updated": "Cart Updated",
            "scope::changed": "Market Selected",
            "order::order.created": "Product Reordered",
          }),
          Salla.event.onAny((e, t) => {
            try {
              if (Object.keys(this.mappedEvents).includes(e)) {
                const n = this.mappedEvents[e];
                return void (Array.isArray(n) ? n : [n]).forEach((e) =>
                  Salla.event.emit(e, t),
                );
              }
              if (!Salla.config.get("jitsu.events", []).includes(e)) return;
              const n = gc.transform(e, t);
              n && this.track(n.event, n.properties);
            } catch (e) {
              Salla.log("Error in analytics event handling:", e);
            }
          }),
          Salla.event.on("salla-cookies-bar::accepted", () =>
            this.setConsent("accepted"),
          ),
          Salla.event.on("salla-cookies-bar::rejected", () =>
            this.setConsent("rejected"),
          ),
          Salla.event.on("twilight::before.ready", (e) => {
            var t, n, r, i, o, a;
            this.debugAnalytics = dc({
              host: "https://st.salla.dev",
              writeKey:
                "bbLD6Xqr1OKsDJfxZBCy7SJN1RIsrkBp:WEa99iY220v9qX7KiuAlML9ldSFJKW2p",
            });
            const { host: s, key: l } = (null == e ? void 0 : e.jitsu) || {};
            if (((this.jitsuAnalytics = null), !s || !l))
              return void salla.log(
                "Jitsu configuration is missing. Analytics will not be tracked.",
              );
            (gc.registerEvents(),
              (this._jitsuConfig = {
                host: this.getAnalyticsHost(e),
                writeKey: l,
                cookieCapture: Object.fromEntries(
                  Salla.cookie.getCookieByPrefix("sa_").map((e) => [e, e]),
                ),
              }));
            const u = this.getConsentPolicies();
            var c;
            ((this.jitsuAnalytics = dc(jn({}, this._jitsuConfig, u))),
            (this._anonymousId =
              (null == (t = this.jitsuAnalytics) || null == (t = t.user())
                ? void 0
                : t.anonymousId) || null),
            this.setContext("store_id", null == (n = e.store) ? void 0 : n.id),
            this.setContext(
              "version",
              null == (r = e.jitsu) ? void 0 : r.version,
            ),
            this.setContext("library", { twilight: Salla.versions }),
            null != (i = e.jitsu) &&
              null != (i = i.context) &&
              i.extra &&
              this.setExtraContext(e.jitsu.context.extra),
            null != (o = e.store) && null != (o = o.scope) && o.id) &&
              this.setContext(
                "scope",
                null == (c = e.store) ? void 0 : c.scope,
              );
            ("user" === (null == e || null == (a = e.user) ? void 0 : a.type) &&
              this.setContext("traits", this.getFormattedUser(e.user)),
              this.registerTracker({
                name: "DefaultSallaTracker",
                track: (e, t) => this.jitsuAnalytics.track(e, t),
                page: (e) => this.jitsuAnalytics.page(e),
              }));
          }),
          Salla.onReady(() => {
            var e;
            const t = {
              name: Salla.config.get("page.slug", ""),
              id:
                null == (e = Salla.config.get("page.id", ""))
                  ? void 0
                  : e.toString(),
            };
            (this.setContext("page", t), this.page(t));
          }));
      }
      setExtraContext(e) {
        var t;
        (null != e &&
          null != (t = e.headers) &&
          t["s-app-os"] &&
          (this.setContext("app", {
            version: e.headers["s-app-os-version"],
            app_release_tag: e.headers["s-app-version"],
            platform: e.headers["s-app-os"].toLowerCase(),
          }),
          delete e.headers["s-app-os"],
          delete e.headers["s-app-os-version"],
          delete e.headers["s-app-version"],
          delete e.headers["s-source"]),
          this.setContext("system", e));
      }
      getAnalyticsHost(e) {
        var t;
        const n = "https://salla.cloud/_app/e";
        if (null == e || null == (t = e.store) || !t.url)
          return (
            Salla.log(
              "Error getting store url - no config or store URL provided",
            ),
            n
          );
        const r = e.store.url;
        try {
          let e = "";
          const t = r;
          if (/https:\/\/demostore\.salla\.sa/.test(t)) {
            const e = t.match(
              /demostore\.salla\.sa\/(?:(ar|en)\/)?((?!ar$|en$)[a-zA-Z0-9.-]+)/,
            );
            if (e && e[2]) {
              const n = e[2];
              return `${new URL(t).origin}/${n}/_app/e`;
            }
            return n;
          }
          const i = /(salla\.sa)\/(?:(ar|en)\/)?((?!ar$|en$)[a-zA-Z0-9.-]+)/,
            o = t.match(i);
          if (o) {
            const r = o[3];
            if (!r || 0 === r.trim().length || "ar" === r || "en" === r)
              return (
                Salla.log("Error: invalid or empty store name in salla.sa URL"),
                n
              );
            e = `${new URL(t).origin}/${r}`;
          } else {
            e = new URL(t).origin;
          }
          return `${e}/_app/e`;
        } catch (e) {
          return (
            Salla.log("Error getting store url, forwarding to salla.cloud:", e),
            n
          );
        }
      }
      setContext(e, t) {
        var n, r;
        (null == (n = this.jitsuAnalytics) || n.setContextProperty(e, t),
          null == (r = this.debugAnalytics) || r.setContextProperty(e, t),
          (this.context[e] = t));
      }
      setAppContext(e, t) {
        if (!this.jitsuAnalytics)
          return void Salla.log("setAppContext: Analytics not initialized yet");
        if (!e || "string" != typeof e)
          return void Salla.log(
            "setAppContext: appId must be a non-empty string",
          );
        if (!t || "object" != typeof t)
          return void Salla.log("setAppContext: payload must be an object");
        const n = this.context.apps_context || {};
        ((n[e] = jn({}, n[e], t)), this.setContext("apps_context", n));
      }
      customFetch(e, t) {
        var n;
        return Salla.api.beaconRequest(
          `${e}?writekey=${null == t || null == (n = t.headers) ? void 0 : n["X-Write-Key"]}`,
          t,
        );
      }
      track(e, t = {}) {
        ((t = this.finalPayload(t)),
          this.history.push({ action: "track", eventName: e, payload: t }),
          this.pushEventToCustomTrackers("track", e, t));
      }
      log(e, t = {}) {
        var n;
        return null == (n = this.debugAnalytics)
          ? void 0
          : n
              .track(e, t)
              .catch(
                (e) => (
                  Salla.log("Error tracking event:", e),
                  Promise.reject(e)
                ),
              );
      }
      page(e = {}) {
        var t, n;
        (((e = this.finalPayload(e)).id =
          null == (t = e.id || Salla.config.get("page.id", ""))
            ? void 0
            : t.toString()),
          (e.name = e.name || Salla.config.get("page.slug")),
          (e.keywords =
            e.keywords ||
            (null == (n = document.querySelector("meta[name=keywords]"))
              ? void 0
              : n.content)),
          (e.referrer = e.referrer || document.referrer),
          this.history.push({ action: "page", payload: e }),
          this.pushEventToCustomTrackers("page", e));
      }
      finalPayload(e = {}) {
        return (this.attachRealtimeContext(), jn({}, {}, e));
      }
      attachRealtimeContext() {
        try {
          const e = [
            "user.id",
            "cart.id",
            "cart.user_id",
            "cart.count",
            "cart.summary.count",
            "scope.id",
            "branch-choosed-before",
          ].reduce((e, t) => {
            const n = Salla.storage.get(t);
            return (n && (e[t.replace(".", "_")] = n), e);
          }, {});
          Object.keys(e).length > 0 && this.setContext("localStorage", e);
        } catch (e) {
          (Salla.analytics.log("attachRealtimeContext", { error: e.message }),
            Salla.log("Error attaching realtime context:", e));
        }
        const e = Salla.storage.getWithTTL("s-utms");
        if (!e) return;
        const {
          "s-utm-campaign": t,
          "s-utm-source": n,
          "s-utm-medium": r,
          "s-utm-term": i,
          "s-utm-content": o,
          "s-utm-referrer": a,
        } = e;
        this.setContext("campaign", {
          name: t,
          source: n,
          medium: r,
          term: i,
          content: o,
          referrer: a,
        });
      }
      registerTracker(e) {
        "object" == typeof e
          ? "string" == typeof e.name && e.name
            ? "function" == typeof e.track
              ? "function" == typeof e.page
                ? this.customTrackers.find((t) => t.name === e.name)
                  ? Salla.log("tracker with the same name already exists!")
                  : (this.customTrackers.push(e),
                    this.history.forEach((t) =>
                      "track" === t.action
                        ? e.track(t.eventName, t.payload)
                        : "page" === t.action
                          ? e.page(t.payload)
                          : void 0,
                    ))
                : Salla.log("tracker.page most be a function!")
              : Salla.log("tracker.track most be a function!")
            : Salla.log("tracker.name most be a string!")
          : Salla.log(
              'tracker most be an object {name:"tracker name", track: callback, page: callback}!',
            );
      }
      pushEventToCustomTrackers(e, t, n = {}) {
        const r = "page" === e ? [t] : [t, n];
        return Promise.allSettled(
          this.customTrackers.map((t) =>
            this.pushEventToCustomTracker(t[e], r),
          ),
        ).then((t) =>
          t
            .filter((e) => "rejected" === e.status)
            .map((t) => Salla.log("Error on customTracker to send " + e, t)),
        );
      }
      pushEventToCustomTracker(e, t) {
        try {
          const n = e(...t);
          return Promise.resolve(n).catch((e) => Promise.reject(e));
        } catch (e) {
          return Promise.reject(e);
        }
      }
      getConsentState() {
        return Salla.storage.get("cookies-consent", "unknown");
      }
      getConsentPolicies(e = null) {
        var t;
        if (
          null == (t = Salla.config.get("store.features")) ||
          !t.includes("website-cookies")
        )
          return {};
        const n = "accepted" === (e = e || this.getConsentState());
        return {
          privacy: {
            dontSend: !1,
            disableUserIds: !n,
            ipPolicy: n ? "keep" : "remove",
          },
        };
      }
      setConsent(e) {
        var t;
        if (
          null == (t = Salla.config.get("store.features")) ||
          !t.includes("website-cookies")
        )
          return;
        if (!["accepted", "rejected"].includes(e)) return;
        const n = this.getConsentState();
        if (this._jitsuConfig && this.jitsuAnalytics && n !== e)
          try {
            var r;
            const t = this.getConsentPolicies(e);
            ((this.jitsuAnalytics = dc(jn({}, this._jitsuConfig, t))),
              (this._anonymousId =
                (null == (r = this.jitsuAnalytics) || null == (r = r.user())
                  ? void 0
                  : r.anonymousId) || null),
              Object.entries(this.context).forEach(([e, t]) => {
                this.jitsuAnalytics.setContextProperty(e, t);
              }));
          } catch (e) {
            Salla.log("Error re-initializing Jitsu on consent change:", e);
          }
      }
      getFormattedUser(e) {
        return (
          (e.phone = e.mobile),
          (e.country = e.country_code),
          (e.language = e.language_code),
          (e.currency = e.currency_code),
          e
        );
      }
      getAnonymousId() {
        try {
          if (this._anonymousId) return this._anonymousId;
          if (this.jitsuAnalytics) {
            var e;
            const t =
              null == (e = this.jitsuAnalytics.user()) ? void 0 : e.anonymousId;
            if (t) return ((this._anonymousId = t), t);
          }
          return null;
        } catch (e) {
          return (Salla.log("Error getting anonymous ID from Jitsu:", e), null);
        }
      }
    })()),
    (Dn.init = (e) => new pa(e)),
    new (class {
      constructor(e = {}) {
        ((this.config = jn(
          {
            WHITELIST: [
              location.hostname,
              "salla.com",
              "salla.sa",
              "salla.dev",
              "salla.network",
              "salla.group",
              "mtjr.at",
            ],
            POLL_INTERVAL_MS: 500,
            WHITELIST_PAGES: [
              "customer.orders.single",
              "page-single",
              "blog.single",
              "blog.index",
            ],
          },
          e,
        )),
          (this.originalMethods = {}),
          (this.isInitialized = !1),
          Salla.onReady(() => this.init()));
      }
      normalizeUrl(e) {
        try {
          return new URL(e, location.href);
        } catch (e) {
          return null;
        }
      }
      shouldIgnoreUrl(e) {
        if (!e) return !1;
        const t = "string" == typeof e ? e : e.href || String(e),
          n = t.toLowerCase();
        if (["tel:", "mailto:", "javascript:"].some((e) => n.startsWith(e)))
          return !0;
        try {
          const e = new URL(t, location.href).hostname.toLowerCase();
          return [
            "facebook.com",
            "fb.com",
            "twitter.com",
            "x.com",
            "instagram.com",
            "linkedin.com",
            "youtube.com",
            "youtu.be",
            "tiktok.com",
            "snapchat.com",
            "pinterest.com",
            "whatsapp.com",
            "wa.me",
            "iwtsp.com",
            "telegram.org",
            "t.me",
            "discord.com",
            "discord.gg",
            "reddit.com",
            "tumblr.com",
            "google.com",
            "forms.gle",
            "maps.app.goo.gl",
            "goo.gl",
            "apple.com",
            "smsaexpress.com",
            "aramex.com",
            "aj-ex.com",
            "redboxsa.com",
            "fastcoo-tech.com",
            "express.dhl",
            "najizxpress.net",
            "jtexpress.me",
            "jtexpress-sa.com",
            "tamex.com.sa",
            "aymakan.com.sa",
            "fastlo.com",
            "sls-express.com",
            "logestechs.com",
            "massuul.com",
            "tamara.co",
            "gov.sa",
            "org.sa",
            "stc.com.sa",
            "sa",
            "addtoany.com",
            "wchat.freshchat.com",
            "getbutton.io",
            "heyzine.com",
            "linktr.ee",
          ].some((t) => e === t || e.endsWith("." + t));
        } catch (e) {
          return !1;
        }
      }
      isWhitelisted(e) {
        if (!e) return !1;
        const t = e.hostname.toLowerCase();
        for (const e of this.config.WHITELIST) {
          const n = String(e || "")
            .toLowerCase()
            .trim();
          if (n && (t === n || t.endsWith("." + n))) return !0;
        }
        return !1;
      }
      emit(e) {
        try {
          (window.__redirectLogs || (window.__redirectLogs = []),
            window.__redirectLogs.push(e));
          try {
            Salla.analytics.log("redirect", e);
          } catch (e) {}
        } catch (e) {}
      }
      logRedirect(e, t, n) {
        if (this.shouldIgnoreUrl(t)) return;
        const r = this.normalizeUrl(t),
          i = this.normalizeUrl(location.href),
          o = this.isWhitelisted(r),
          a = {
            redirect_source: e,
            redirect_from: i ? i.href : String(location.href),
            redirect_to: r ? r.href : String(t),
            redirect_host: r ? r.hostname : null,
            redirect_referrer: document.referrer || null,
            page_slug: Salla.config.get("page.slug"),
            whitelisted: o,
            stack: n && n.stack ? String(n.stack) : void 0,
            meta: n || void 0,
          };
        o || this.emit(a);
      }
      hookHistoryAPIs() {
        (["pushState", "replaceState"].forEach((e) => {
          try {
            const t = history[e];
            "function" == typeof t &&
              ((this.originalMethods[`history.${e}`] = t),
              (history[e] = (...n) => {
                try {
                  var r;
                  this.logRedirect(e, null != (r = n[2]) ? r : location.href);
                } catch (e) {}
                return t.apply(history, n);
              }));
          } catch (e) {}
        }),
          window.addEventListener("popstate", () => {
            this.logRedirect("popstate", location.href);
          }),
          window.addEventListener("hashchange", () => {
            this.logRedirect("hashchange", location.href);
          }));
      }
      hookLocationMethods() {
        try {
          const e = location.assign.bind(location);
          ((this.originalMethods["location.assign"] = e),
            (location.assign = (t) => (
              this.logRedirect("location.assign", t, {
                stack: new Error().stack,
              }),
              e(t)
            )));
        } catch (e) {}
        try {
          const e = location.replace.bind(location);
          ((this.originalMethods["location.replace"] = e),
            (location.replace = (t) => (
              this.logRedirect("location.replace", t, {
                stack: new Error().stack,
              }),
              e(t)
            )));
        } catch (e) {}
      }
      hookWindowOpen() {
        try {
          const e = window.open;
          ((this.originalMethods["window.open"] = e),
            (window.open = (t, ...n) => (
              t &&
                this.logRedirect("window.open", t, {
                  stack: new Error().stack,
                }),
              e.apply(window, [t, ...n])
            )));
        } catch (e) {}
      }
      setupEventListeners() {
        ((this.handleLinkClick = (e) => {
          const t =
            e.target && e.target.closest ? e.target.closest("a[href]") : null;
          if (!t) return;
          const n = t.getAttribute("href");
          if (!n || n.startsWith("#")) return;
          if (this.shouldIgnoreUrl(n)) return;
          const r = t.getAttribute("target") || "_self";
          setTimeout(() => {
            this.logRedirect("link-click", n, { target: r });
          }, 0);
        }),
          document.addEventListener("click", this.handleLinkClick, !0),
          (this.handleFormSubmit = (e) => {
            const t = e.target,
              n =
                (t && t.getAttribute && t.getAttribute("action")) ||
                location.href,
              r = (t && t.method ? String(t.method) : "GET").toUpperCase();
            this.logRedirect("form-submit", n, { method: r });
          }),
          document.addEventListener("submit", this.handleFormSubmit, !0));
      }
      setupPerformanceObserver() {
        try {
          ((this.performanceObserver = new PerformanceObserver((e) => {
            for (const t of e.getEntries())
              "navigation" === t.entryType &&
                this.logRedirect("performance-navigation", location.href, {
                  type: t.type,
                  redirectCount: t.redirectCount,
                });
          })),
            this.performanceObserver.observe({
              type: "navigation",
              buffered: !0,
            }));
        } catch (e) {}
      }
      init() {
        if (this.config.WHITELIST_PAGES.includes(Salla.config.get("page.slug")))
          return;
        if (this.isInitialized) return;
        const e = new URL(Salla.config.get("store.url")).hostname
          .split(".")
          .slice(-2)
          .join(".");
        (this.config.WHITELIST.includes(e) || this.config.WHITELIST.push(e),
          this.hookHistoryAPIs(),
          this.hookLocationMethods(),
          this.hookWindowOpen(),
          this.setupEventListeners(),
          this.setupPerformanceObserver(),
          (this.isInitialized = !0));
      }
      destroy() {
        this.isInitialized &&
          (Object.keys(this.originalMethods).forEach((e) => {
            const [t, n] = e.split(".");
            "history" === t && this.originalMethods[e]
              ? (history[n] = this.originalMethods[e])
              : "location" === t && this.originalMethods[e]
                ? (location[n] = this.originalMethods[e])
                : "window" === t &&
                  "open" === n &&
                  this.originalMethods[e] &&
                  (window.open = this.originalMethods[e]);
          }),
          this.handleLinkClick &&
            document.removeEventListener("click", this.handleLinkClick, !0),
          this.handleFormSubmit &&
            document.removeEventListener("submit", this.handleFormSubmit, !0),
          this.performanceObserver && this.performanceObserver.disconnect(),
          (this.isInitialized = !1));
      }
    })(),
    salla.event.once("twilight::init", salla.init),
    salla.event.on("twilight::api", (e) => {
      let t = null == e ? void 0 : e.events;
      t && salla.event.dispatchEvents(t);
    }),
    (Dn.success = Dn.notify.success),
    (Dn.error = Dn.notify.error),
    window.dispatchEvent(new CustomEvent("salla::created")),
    Dn
  );
});
//# sourceMappingURL=twilight.min.js.map
