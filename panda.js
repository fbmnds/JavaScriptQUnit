// Made with Panda.js - http://www.pandajs.net
pandaConfig = {
	sourceFolder : "src",
	outputFile : "game.min.js",
	sitelock : "",
	analytics : {
		id : "UA-42024756-5"
	},
	storage : {
		id : "net.pandajs.flyingdog"
	}
}, "undefined" == typeof window && (window = {}), function (e) {
	"use strict";
	if ("undefined" == typeof global || !global.game) {
		var t = {
			version : "1.2.0",
			config : e.pandaConfig || {},
			plugins : {},
			json : {},
			getJSON : function (e) {
				return this.json[this.assets[e]]
			},
			scale : 1,
			scene : null,
			debug : null,
			system : null,
			sound : null,
			pool : null,
			storage : null,
			keyboard : null,
			device : {},
			assets : {},
			renderer : null,
			modules : {},
			resources : [],
			ready : !1,
			nocache : "",
			_current : null,
			_loadQueue : [],
			_waitForLoad : 0,
			_DOMLoaded : !1,
			copy : function (e) {
				var t,
				i,
				r;
				if (!e || "object" != typeof e || e instanceof HTMLElement || e instanceof game.Class || game.Container && e instanceof game.Container)
					return e;
				if (e instanceof Array) {
					for (i = [], r = 0, t = e.length; t > r; r++)
						i[r] = game.copy(e[r]);
					return i
				}
				i = {};
				for (r in e)
					i[r] = game.copy(e[r]);
				return i
			},
			merge : function (e, t) {
				for (var i in t) {
					var r = t[i];
					"object" != typeof r || r instanceof HTMLElement || r instanceof game.Class || r instanceof game.Container ? e[i] = r : (e[i] && "object" == typeof e[i] || (e[i] = r instanceof Array ? [] : {}), game.merge(e[i], r))
				}
				return e
			},
			ksort : function (e) {
				if (!e || "object" != typeof e)
					return !1;
				var t,
				i = [],
				r = {};
				for (t in e)
					i.push(t);
				for (i.sort(), t = 0; t < i.length; t++)
					r[i[t]] = e[i[t]];
				return r
			},
			setVendorAttribute : function (e, t, i) {
				var r = t.ucfirst();
				e[t] = e["ms" + r] = e["moz" + r] = e["webkit" + r] = e["o" + r] = i
			},
			getVendorAttribute : function (e, t) {
				var i = t.ucfirst();
				return e[t] || e["ms" + i] || e["moz" + i] || e["webkit" + i] || e["o" + i]
			},
			normalizeVendorAttribute : function (e, t) {
				var i = this.getVendorAttribute(e, t);
				e[t] || (e[t] = e[t] || i)
			},
			fullscreen : function () {
				game.system.canvas.requestFullscreen && game.system.canvas.requestFullscreen(),
				game.system.canvas.requestFullScreen && game.system.canvas.requestFullScreen()
			},
			fullscreenSupport : function () {
				return !(!game.system.canvas.requestFullscreen && !game.system.canvas.requestFullScreen)
			},
			addAsset : function (e, t) {
				return t = t || e,
				e = this.config.mediaFolder + e,
				this.assets[t] = e,
				-1 === this.resources.indexOf(e) && this.resources.push(e),
				e
			},
			addAudio : function (e, t) {
				return t = t || e,
				e = this.config.mediaFolder + e,
				game.Audio.queue[e] = t,
				t
			},
			setNocache : function () {
				this.nocache = "?" + Date.now()
			},
			module : function (e, t) {
				if (this._current)
					throw "Module " + this._current.name + " has no body";
				if (this.modules[e] && this.modules[e].body)
					throw "Module " + e + " is already defined";
				return this._current = {
					name : e,
					requires : [],
					loaded : !1,
					body : null,
					version : t
				},
				this.modules[e] = this._current,
				this._loadQueue.push(this._current),
				this
			},
			require : function () {
				var e,
				t = Array.prototype.slice.call(arguments);
				for (e = 0; e < t.length; e++)
					t[e] && this._current.requires.push(t[e]);
				return this
			},
			body : function (e) {
				this._current.body = e,
				this._current = null,
				this._initDOMReady ? this._initDOMReady() : this.loadFinished && this._loadModules()
			},
			start : function (t, i, r, s, n) {
				if (this._loadQueue.length > 0)
					throw "Core not ready.";
				this.system = new game.System(i, r, n),
				game.Audio && (this.audio = new game.Audio),
				game.Pool && (this.pool = new game.Pool),
				game.DebugDraw && game.DebugDraw.enabled && (this.debugDraw = new game.DebugDraw),
				game.Storage && game.Storage.id && (this.storage = new game.Storage(game.Storage.id)),
				game.Analytics && game.Analytics.id && (this.analytics = new game.Analytics(game.Analytics.id));
				for (var a in this.plugins)
					this.plugins[a] = new this.plugins[a];
				this.ready = !0,
				this.loader = s || game.Loader;
				var o = new this.loader(e[game.System.startScene] || game[game.System.startScene] || t);
				o.start()
			},
			Math : {
				distance : function (e, t, i, r) {
					return e = i - e,
					t = r - t,
					Math.sqrt(e * e + t * t)
				},
				random : function (e, t) {
					return Math.random() * (t - e) + e
				}
			},
			_loadScript : function (e, t) {
				this.modules[e] = !0,
				this._waitForLoad++;
				var i = this.config.sourceFolder + "/" + e.replace(/\./g, "/") + ".js" + this.nocache,
				r = document.createElement("script");
				r.type = "text/javascript",
				r.src = i,
				r.onload = function () {
					game._waitForLoad--,
					game._loadModules()
				},
				r.onerror = function () {
					throw "Failed to load module " + e + " at " + i + " required from " + t
				},
				document.getElementsByTagName("head")[0].appendChild(r)
			},
			_loadModules : function () {
				var t,
				i,
				r,
				s,
				n,
				a;
				for (i = 0; i < game._loadQueue.length; i++) {
					for (s = game._loadQueue[i], a = !0, r = 0; r < s.requires.length; r++)
						n = s.requires[r], game.modules[n] ? game.modules[n].loaded || (a = !1) : (a = !1, game._loadScript(n, s.name));
					if (a && s.body) {
						if (game._loadQueue.splice(i, 1), 0 === game._loadQueue.length)
							for (var o in e.pandaConfig) {
								var h = o.ucfirst();
								if (game[h])
									for (var l in e.pandaConfig[o])
										game[h][l] = e.pandaConfig[o][l]
							}
						s.loaded = !0,
						s.body(),
						t = !0,
						i--
					}
				}
				if (t && this._loadQueue.length > 0)
					game._loadModules();
				else {
					if (0 === game._waitForLoad && 0 !== game._loadQueue.length) {
						var u = [];
						for (i = 0; i < game._loadQueue.length; i++) {
							var c = [],
							d = game._loadQueue[i].requires;
							for (r = 0; r < d.length; r++)
								s = game.modules[d[r]], s && s.loaded || c.push(d[r]);
							u.push(game._loadQueue[i].name + " (requires: " + c.join(", ") + ")")
						}
						throw "Unresolved modules:\n" + u.join("\n")
					}
					this.loadFinished = !0
				}
			},
			_boot : function () {
				document.location.href.match(/\?nocache/) && this.setNocache(),
				this.device.pixelRatio = e.devicePixelRatio || 1,
				this.device.screen = {
					width : e.screen.availWidth * this.device.pixelRatio,
					height : e.screen.availHeight * this.device.pixelRatio
				},
				this.device.iPhone = /iPhone/i.test(navigator.userAgent),
				this.device.iPhone4 = this.device.iPhone && 2 === this.device.pixelRatio,
				this.device.iPhone5 = this.device.iPhone && 2 === this.device.pixelRatio && 1096 === this.device.screen.height,
				this.device.iPad = /iPad/i.test(navigator.userAgent),
				this.device.iPadRetina = this.device.iPad && 2 === this.device.pixelRatio,
				this.device.iOS = this.device.iPhone || this.device.iPad,
				this.device.iOS5 = this.device.iOS && /OS 5/i.test(navigator.userAgent),
				this.device.iOS6 = this.device.iOS && /OS 6/i.test(navigator.userAgent),
				this.device.iOS7 = this.device.iOS && /OS 7/i.test(navigator.userAgent),
				this.device.iOS71 = this.device.iOS && /OS 7_1/i.test(navigator.userAgent),
				this.device.android = /android/i.test(navigator.userAgent),
				this.device.android2 = /android 2/i.test(navigator.userAgent),
				this.device.wp7 = /Windows Phone OS 7/i.test(navigator.userAgent),
				this.device.wp8 = /Windows Phone 8/i.test(navigator.userAgent),
				this.device.wp = this.device.wp7 || this.device.wp8,
				this.device.wpApp = this.device.wp && "undefined" != typeof e.external && "undefined" != typeof e.external.notify,
				this.device.ie9 = /MSIE 9/i.test(navigator.userAgent),
				this.device.ie10 = /MSIE 10/i.test(navigator.userAgent),
				this.device.ie11 = /rv:11.0/i.test(navigator.userAgent),
				this.device.ie = this.device.ie10 || this.device.ie11 || this.device.ie9,
				this.device.opera = /Opera/i.test(navigator.userAgent),
				this.device.crosswalk = /Crosswalk/i.test(navigator.userAgent),
				this.device.cocoonJS = !!navigator.isCocoonJS,
				this.device.ejecta = /Ejecta/i.test(navigator.userAgent),
				this.device.mobile = this.device.iOS || this.device.android || this.device.wp,
				this.device.wp && "undefined" != typeof e.external.notify && (e.console.log = function (t) {
					e.external.notify(t)
				});
				var t;
				if (this.device.iOS && this.config.iOS)
					for (t in this.config.iOS)
						this.config[t] = this.config.iOS[t];
				if (this.device.android && this.config.android)
					for (t in this.config.android)
						this.config[t] = this.config.android[t];
				if (this.device.wp && this.config.wp)
					for (t in this.config.wp)
						this.config[t] = this.config.wp[t];
				this.config.sourceFolder = this.config.sourceFolder || "src",
				this.config.mediaFolder = this.config.mediaFolder ? this.config.mediaFolder + "/" : "";
				var i = document.createElement("meta");
				i.name = "viewport";
				var r = "width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no";
				this.device.iOS71 && (r += ",minimal-ui"),
				i.content = r,
				document.getElementsByTagName("head")[0].appendChild(i)
			},
			_DOMReady : function () {
				if (!game._DOMLoaded) {
					if (!document.body)
						return setTimeout(game._DOMReady, 13);
					game._DOMLoaded = !0,
					game._loadModules()
				}
			},
			_initDOMReady : function () {
				this._initDOMReady = null,
				this._boot(),
				"complete" === document.readyState ? this._DOMReady() : (document.addEventListener("DOMContentLoaded", this._DOMReady, !1), e.addEventListener("load", this._DOMReady, !1))
			}
		};
		if (e.game = t, Number.prototype.limit = function (e, t) {
			var i = this;
			return e > i && (i = e),
			i > t && (i = t),
			i
		}, Number.prototype.round = function (e) {
			return e = e ? Math.pow(10, e) : 1,
			Math.round(this * e) / e
		}, Array.prototype.erase = function (e) {
			for (var t = this.length; t--; )
				this[t] === e && this.splice(t, 1);
				return this
			}, Array.prototype.random = function () {
				return this[Math.floor(Math.random() * this.length)]
			}, Array.prototype.shuffle = function () {
				for (var e = this.length, t = e; t--; ) {
					var i = parseInt(Math.random() * e),
					r = this[t];
					this[t] = this[i],
					this[i] = r
				}
				return this
			}, Function.prototype.bind = function (e) {
				var t = this,
				i = [];
				return Array.prototype.push.apply(i, arguments),
				i.shift(),
				function () {
					var r = [];
					return Array.prototype.push.apply(r, i),
					Array.prototype.push.apply(r, arguments),
					t.apply(e, r)
				}
			}, String.prototype.ucfirst = function () {
				return this.charAt(0).toUpperCase() + this.slice(1)
			}, game.normalizeVendorAttribute(e, "requestAnimationFrame"), e.requestAnimationFrame) {
				var i = 1,
				r = {};
				e.game.setGameLoop = function (t, s) {
					var n = i++;
					r[n] = !0;
					var a = function () {
						r[n] && (e.requestAnimationFrame(a, s), t())
					};
					return e.requestAnimationFrame(a, s),
					n
				},
				e.game.clearGameLoop = function (e) {
					delete r[e]
				}
			}
		else
			e.game.setGameLoop = function (t) {
				return e.setInterval(t, 1e3 / 60)
			},
		e.game.clearGameLoop = function (t) {
			e.clearInterval(t)
		};
		var s = !1,
		n = /xyz/.test(function () {
				var e;
				return e
			}) ? /\b_super\b/ : /[\D|\d]*/;
		t.Class = function () {},
		t.Class.extend = function (t) {
			function i() {
				if (!s) {
					if (this.staticInit) {
						var e = this.staticInit.apply(this, arguments);
						if (e)
							return e
					}
					for (var t in this)
						"object" == typeof this[t] && (this[t] = game.copy(this[t]));
					this.init && this.init.apply(this, arguments)
				}
				return this
			}
			var r = this.prototype;
			s = !0;
			var a = new this;
			s = !1;
			var o = function (e, t) {
				return function () {
					var i = this._super;
					this._super = r[e];
					var s = t.apply(this, arguments);
					return this._super = i,
					s
				}
			};
			for (var h in t)
				a[h] = "function" == typeof t[h] && "function" == typeof r[h] && n.test(t[h]) ? o(h, t[h]) : t[h];
			return i.prototype = a,
			i.prototype.constructor = i,
			i.extend = e.game.Class.extend,
			i.inject = function (e) {
				var t = this.prototype,
				i = {},
				r = function (e, t) {
					return function () {
						var r = this._super;
						this._super = i[e];
						var s = t.apply(this, arguments);
						return this._super = r,
						s
					}
				};
				for (var s in e)
					"function" == typeof e[s] && "function" == typeof t[s] && n.test(e[s]) ? (i[s] = t[s], t[s] = r(s, e[s])) : t[s] = e[s]
			},
			i
		}
	}
}
(window), game.module("engine.core").require("engine.loader", "engine.timer", "engine.system", "engine.audio", "engine.renderer", "engine.sprite", "engine.debug", "engine.storage", "engine.tween", "engine.scene", "engine.pool", "engine.analytics").body(function () {}), game.module("engine.loader").body(function () {
	"use strict";
	game.Loader = game.Class.extend({
			scene : null,
			loaded : 0,
			percent : 0,
			backgroundColor : 0,
			assets : [],
			sounds : [],
			init : function (e) {
				var t;
				for (game.Timer.seconds && (game.Loader.timeout /= 1e3), this.scene = e || SceneGame, this.stage = game.system.stage, t = 0; t < game.resources.length; t++)
					game.TextureCache[game.resources[t]] || this.assets.push(game.Loader.getPath(game.resources[t]));
				for (var i in game.Audio.queue)
					this.sounds.push(i);
				this.assets.length > 0 && (this.loader = new game.AssetLoader(this.assets, !0), this.loader.onProgress = this.progress.bind(this), this.loader.onComplete = this.loadAudio.bind(this), this.loader.onError = this.error.bind(this)),
				0 === this.assets.length && 0 === this.sounds.length && (this.percent = 100)
			},
			initStage : function () {
				var e = new game.Graphics;
				e.beginFill(2301728),
				e.drawRect(0, 0, 200, 20),
				e.position.set(game.system.width / 2 - 100, game.system.height / 2 + 70),
				this.stage.addChild(e),
				this.bar = new game.Graphics,
				this.bar.beginFill(15132648),
				this.bar.drawRect(0, 0, 200, 20),
				this.bar.position.set(game.system.width / 2 - 100, game.system.height / 2 + 70),
				this.bar.scale.x = this.percent / 100,
				this.stage.addChild(this.bar);
				var t = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAACDCAMAAAC+7dm8AAAAolBMVEUAAAAjHyAjHyAjHyAjHyAjHyAjHyAjHyAjHyAmIiMjHyAjHyAjHyAjHyAjHyAjHyAjHyAjHyAjHyD////m5+grKCn8/Pz3+PgzMDH09PVKR0jw8fGenp7t7u6ko6SqqapTUVLLy8zY2Nnq6uvj4+Q5NjhkYmNcWltAPT+Qj5CBf4B6eXqXlpfe3t9zcnPEw8RsamyHhoe8vL22tbbS0tKvr7CGaULPAAAAEnRSTlMAg3FU0uK/ChX+QzIj8LGdkWTaWSIZAAALGUlEQVR42r1c2ZaiMBBFRXFfIiAqsijI5or6/782rSyBVAJRu+c+zDndQ8dL1U1tAYVfQHfQajYmY7E9QilGbXE8bbYGkvBfIQ37CZMRqkB73GgNhT+HNJg1xiJ6A71x8w95dVtTEX2EdmMg/AGGTSYfRdNcLYWCGBCb0i97rNVBAK4VBebNPjryD3br5XKxWG52snPc3s/xwwjCk+eXKE6Hv8ioSSpZsa6PrZxit16ocxZ2thl6ObNJ97cYkfY5PRw5A+ZTAXWr71Nejd/wYL9dttDlJufYLObcWMSnF612/2sjTcsmCo4ydpk6fw9Lw3/J6jtTDdslRrqDGS3nH0C9rZ6mGnzjt5LXAsxIBoy4WRkaQmj2MaUZKuCyLehIrfeTs7VteyvDK3eX5wb8BUqaiRntqpV9vAWXlZZnltXJkIkrTAWhjvSusrtSmZLFZ6SFHew1BOHF5evubkJK4iLW7TcnSQ4pqjsqKGnNtE8Sg+iwtqVr5RVCopiUDs0+k5mUsoHo6XKtuO/XFaqE8ihdv8GXJ8QGkNCsU7GajLGgE/JRPQySFIHJsKzmUcUN3qopyYcVZx1VFpXjoiKIYCqNq1aqtJJ62/cQL7TNvAgbqA9vRqlTafEKSk7goncQzkvQEcA45TRFFbiy5X3GJuKEsimvsEcArRelAarAXsYoLbgwV+h96EREh7Fs9PJelef8YyF6FxPHwUWfwCKcb9ANNazcKTKGWsgNnIzggoT7VQvK/IdTA7ERUsW089DHsAlD2Qjgx3ntCs85wHNJrvocJqbDknlf6CI2QLDEUeVTBCAFIBINoVW552Di3WroG4TzWkONK+TUsykCX/voK5wAJ6CotjBm/znNTBf0LScAEOcEZr/du1PM9EBfIoKcTMCJmR4uFDMtXfQlQkrhrpGcEAtnipkCREPP905hcNANQ9eDa7RfVWyDQ6bLWxBe9fMr6EW8nCxKotspkI+n32FN5dwityo+rSMl//MNULnwTolyBYxCh9nGxRbV+i/KPsJQTlufj5MCQzh0vH8niICOCcB5ruOTHwY4cQcCg6S0m1fjDoSlqMDcEAJvWoGBRDnO63BXKLXKWvmMk0Zx3R1soXocKOHJRHWc+INTSNDmmWKoPtx2l1pO3LtOdUH0qwPU4LMZ9j/ktIUB0wbVWS2AeLSftRboM04rGWOHgxOxfB1gKbJ/tqj8nKojAdx1+zkfdHJbHEt3djoY+tUCnPjktO6BgpELNunvLcK4povbJa3Sy3FKNXcmAxjvWLVwL8qizCnEgax4x9TuTgNygpFmO+eET3R3Dv6YRBagVhSmnDXBCZXBPWP1Cq56iYBa38WFTlhocUrcIkw558WJ9LcC3F9iijrUNvhAaTU1IlrUk4ExRC47U6a7uEHtOcHECUY6r5YLDAYudiY0tVccGDS4tp0D+g9ePHASLefNFcPFEnXU48gYWasJan1exOSgx6Ca+orl9AORJxTYoMfmxRmbv/yLE93FM3Cmwsp2ZzDc4sWdnPNsqKY2setoQzGPEp5ichtwc9qCreriaAVl10jPwzgKuhikFl4cQYj0aO6P89FhglZ9yDyDnogXDhjZh3mRsH7oxrb0AS0hQ7NmOgc1fq9jYur643VDMvgTM5VkOrU3Ch8wFTCa1eNn2CAcawLlK89rdoGTohLli5E25co6l53IPIgOKJyOBKddta57aeT+yQI7MPJdp5xUDV2f5B/5B4jgEYKqdLchOFWfKkbICvx0K+zA1k83nnlE2kvwIZYdPPydsDmp5TKzV1czycnmjvDdmGRuM2O0euWUPZZdF5BK563U0zr3jVJlg5RUgaufH2ARGCaczJTTCjtiwM0Jtgh+TejWUoFoOSdFJZs+U0fuq6/xschakBPDd3A8u6pJu1oWv5cZJwukQPOA0Pk5RnZxMdR8i1MIZhFsPJ5c4nR/bmB2kxNOQbGuUnF84uak83R32DfB9pLOm9aUAwQlsVPGCf9uDDkx4hNMeCfeIcEx47QF4+dHxsnHnETASWLEcRg0o+ooDjhhiePO6ZFRX+GCfwQ5VZxGqUop/fDbaUMRYPDy3S0XJw42AgClLsD25uAEp/ByGsdDWCyZdkkILiNoUuonbG9+Trdia+pQasD7i9M6y2WFZm0IOI3odSZszkPOuYXyjFOwjlgmO9EqFjFKenhHop1ojsop5te4XIytNshFqaOM1J5eVizAQI5bGF+mHW/u3pg+aYWW7ka73ktqOdOzrHBT3NczwKmTGBxwAll4xTmcM5JNCGbEEfhdjBjJZQKnmeCDYLiBiAvPOFxpw08d9AhB1raQaNCOpDIEnOMnvEl7ZnoryoLSiIbAmzjhwbLcpD6icn6n54yDMDy8iGs0+cnkLzdpzTgBnFoVCW++/miusqXfgUbUYAfE4jRgBHIYyXsOmwbUCbzYK/t/87QmszCAs8McJxA1OQ83LPqkzFrnV+0Rk5NAG6zkMPlOpWA61hnpRwvjF62jh1ic8NwHHpnDcsVSedSkJE0lwA4/vXmyeqiK04Q2PMzh89dQeBYP3QzLjEpOTXYFBQ+4T4tqRnL4MoCyo2qfm1O/UuQxOTxjT1cWd91LXWKwYwTEBHKS4Am1XPggBRHwHsTsfn08m0Hk+Vgil/y/jOh0wDvD4+SUT6YZz4edEIBiRfojPsc380B92sHLSOvKS9MRa3qE8x0QeeXThmfEB6g59ZI7fEc/y8V1AcwusKwDu4Ub7o2yPVZLHCgBZgJEF9EjFA6b/PD13MQPWhBZRAigL1AgVqXhucptKC06q6xHd+65FsByAxqnBtN5/IpSvIOtVpyeXwrrXRTyoUOIAfvMBSqTug3NrUqrAlhV6jIO/cLZHQaMBhFwHqFMCP+CnzuqTiQbcoZueAoI49B5GniqNsXiQjXP9barOlesnagtbyclDU8QQ8akFePhk+axazKfo8Fn2yF8or0DDRVyycdoMNQ4slxF0Xwv0s87rgOOgvc0BqUdHhcAtKiG+hLqbZ/kFktnrfUA4yeochco6ktazt0+Lir7r0bl6z8w6f01NgqeqkBIo3QzgRj1lzgA1wFDwdLub7HUYAKGSQ9mve9R3Qc2Bhyv3Snn/+W9YxLH29M+k9QkK4C2hb33J6TgewndGpkjy/kvkgpf5Vx/OkKozXxlup1P5P4HKT0f1w8aMyqhhlgqdsCrd78OA0x86RXUuPPfLHUADQvEaDRpSYIk8rw3+T0WEax6IVIrdnNN+ec3d59qeq7i7m88QeC14zoIjbpCJUhSyns1wtLK3K7WkdeVpKubIiRK75FC3v0N/5m8j2vYq3xQ3+F7ZViafvgSdcw3Ht7uk9g9yO5/WEtp+BT5GLPyDe63loNech9mlY325XZ8INZTkn7WHfWFQbvQVRsOJytZjy6RyY4cayMthjvVkQnOx8Zd0oPudYtZLdUPy5Jb1mh2+sLs51+BHy3ay/k9zzi+9ZUKoJXLX7buDNKWpMVBBhYJI6L1vmNa/NZSt8Ypb8PEbJ8N3zIUNlNb6I9Bz3t2Mieua3ltbCO0FDy1nHWFdtaIN9//hgypncT9YaNNNr+rS2Dax5zYQiWpLZ37zbheLK3g++ycp5Es+xEaySLst1G1lXeJrgfdfNzi+Gyfz7ERRJe9tXKJ8ac4bra6UuazPsi7/Gj1sufuxgi1Pvp2nHZn2uxnOz4fVCBx9sVXKeW6ElOD9ZvTsdhGVRi1xc5k2pi1BkRubWerSML3EKEApC6GJGU/SZWf1km0/SvoJ0L4Gq1ZS/g9UmJX+C/4BxGsxy8xC3cVAAAAAElFTkSuQmCC";
				if (this.symbol = new game.Sprite(game.Texture.fromImage(t, !0)), this.symbol.anchor.set(.5, 1), this.symbol.position.set(game.system.width / 2 - 8, game.system.height / 2 + 50), this.symbol.rotation =  - .1, this.stage.addChild(this.symbol), game.Tween) {
					var i = new game.Tween(this.symbol).to({
							rotation : .1
						}, 500).easing(game.Tween.Easing.Cubic.InOut).repeat().yoyo();
					i.start()
				}
			},
			start : function () {
				if (game.scene) {
					for (var e = this.stage.children.length - 1; e >= 0; e--)
						this.stage.removeChild(this.stage.children[e]);
					this.stage.setBackgroundColor(this.backgroundColor),
					this.stage.interactive = !1,
					this.stage.mousemove = this.stage.touchmove = null,
					this.stage.click = this.stage.tap = null,
					this.stage.mousedown = this.stage.touchstart = null,
					this.stage.mouseup = this.stage.mouseupoutside = this.stage.touchend = this.stage.touchendoutside = null,
					this.stage.mouseout = null
				}
				if (game.audio && game.audio.stopAll(), "number" == typeof this.backgroundColor) {
					var t = new game.Graphics;
					t.beginFill(this.backgroundColor),
					t.drawRect(0, 0, game.system.width, game.system.height),
					this.stage.addChild(t)
				}
				this.initStage(),
				this.startTime = Date.now(),
				this.assets.length > 0 ? this.loader.load() : this.loadAudio(),
				game.scene ? game.scene = this : this.loopId = game.setGameLoop(this.run.bind(this), game.system.canvas)
			},
			error : function (e) {
				if (e)
					throw e
			},
			progress : function (e) {
				e && e.json && !e.json.frames && !e.json.bones && (game.json[e.url] = e.json),
				this.loaded++,
				this.percent = Math.round(this.loaded / (this.assets.length + this.sounds.length) * 100),
				this.onPercentChange()
			},
			onPercentChange : function () {
				this.bar && (this.bar.scale.x = this.percent / 100)
			},
			loadAudio : function () {
				for (var e = this.sounds.length - 1; e >= 0; e--)
					game.audio.load(this.sounds[e], this.progress.bind(this))
			},
			ready : function () {
				this.setScene()
			},
			setScene : function () {
				if (game.system.retina || game.system.hires)
					for (var e in game.TextureCache)
						 - 1 !== e.indexOf("@2x") && (game.TextureCache[e.replace("@2x", "")] = game.TextureCache[e], delete game.TextureCache[e]);
				game.resources.length = 0,
				game.Audio.resources = {},
				game.Timer.time = Number.MIN_VALUE,
				game.clearGameLoop(this.loopId),
				game.system.setScene(this.scene)
			},
			run : function () {
				game.Timer.update(),
				this.update(),
				this.render()
			},
			update : function () {
				if (game.TweenEngine && game.TweenEngine.update(), !this._ready)
					if (this.timer)
						this.timer.time() >= 0 && (this._ready = !0, this.ready());
					else if (this.loaded === this.assets.length + this.sounds.length) {
						var e = Date.now() - this.startTime,
						t = Math.max(100, game.Loader.timeout - e);
						this.timer = new game.Timer(t)
					}
			},
			render : function () {
				game.system.renderer.render(this.stage)
			}
		}),
	game.Loader.getPath = function (e) {
		return game.system.retina || game.system.hires ? e.replace(/\.(?=[^.]*$)/, "@2x.") : e
	},
	game.Loader.timeout = 500
}), game.module("engine.timer").body(function () {
	"use strict";
	game.Timer = game.Class.extend({
			target : 0,
			base : 0,
			last : 0,
			pauseTime : 0,
			init : function (e) {
				this.last = game.Timer.time,
				this.set(e)
			},
			set : function (e) {
				"number" != typeof e && (e = 0),
				this.target = e || 0,
				this.reset()
			},
			reset : function () {
				this.base = game.Timer.time,
				this.pauseTime = 0
			},
			delta : function () {
				var e = game.Timer.time - this.last;
				return this.last = game.Timer.time,
				this.pauseTime ? 0 : e
			},
			time : function () {
				var e = (this.pauseTime || game.Timer.time) - this.base - this.target;
				return game.Timer.seconds && (e /= 1e3),
				e
			},
			pause : function () {
				this.pauseTime || (this.pauseTime = game.Timer.time)
			},
			resume : function () {
				this.pauseTime && (this.base += game.Timer.time - this.pauseTime, this.pauseTime = 0)
			}
		}),
	game.Timer.last = 0,
	game.Timer.time = Number.MIN_VALUE,
	game.Timer.speedFactor = 1,
	game.Timer.maxStep = 50,
	game.Timer.seconds = !1,
	game.Timer.update = function () {
		var e = Date.now();
		game.Timer.time += Math.min(e - game.Timer.last, game.Timer.maxStep) * game.Timer.speedFactor,
		game.Timer.last = e
	}
}), game.module("engine.system").body(function () {
	"use strict";
	game.System = game.Class.extend({
			width : null,
			height : null,
			delta : 0,
			timer : null,
			canvas : null,
			canvasId : "canvas",
			paused : !1,
			hires : !1,
			retina : !1,
			gameLoopId : 0,
			newSceneClass : null,
			running : !1,
			init : function (e, t, i) {
				if (e = e || game.System.width, t = t || game.System.height, e || (e = game.System.orientation === game.System.PORTRAIT ? 768 : 1024), t || (t = game.System.orientation === game.System.PORTRAIT ? 927 : 672), game.System.hires && window.innerWidth >= e * game.System.hiresFactor && window.innerHeight >= t * game.System.hiresFactor && (this.hires = !0), game.System.retina && 2 === game.device.pixelRatio && (this.retina = !0), (this.hires || this.retina) && (e *= 2, t *= 2, game.scale = 2), this.width = e, this.height = t, this.canvasId = i || this.canvasId, this.timer = new game.Timer, !document.getElementById(this.canvasId)) {
					var r = document.createElement(navigator.isCocoonJS && game.System.screenCanvas ? "screencanvas" : "canvas");
					r.id = this.canvasId,
					document.body.appendChild(r)
				}
				if (this.renderer = game.System.canvas ? new PIXI.CanvasRenderer(e, t, document.getElementById(this.canvasId), game.System.transparent) : new PIXI.autoDetectRenderer(e, t, document.getElementById(this.canvasId), game.System.transparent, game.System.antialias), this.canvas = this.renderer.view, this.stage = new PIXI.Stage, game.normalizeVendorAttribute(this.canvas, "requestFullscreen"), game.normalizeVendorAttribute(this.canvas, "requestFullScreen"), game.normalizeVendorAttribute(navigator, "vibrate"), document.body.style.margin = 0, this.retina ? (this.canvas.style.width = e / 2 + "px", this.canvas.style.height = t / 2 + "px") : (this.canvas.style.width = e + "px", this.canvas.style.height = t + "px"), !navigator.isCocoonJS) {
					var s;
					"undefined" != typeof document.hidden ? s = "visibilitychange" : "undefined" != typeof document.mozHidden ? s = "mozvisibilitychange" : "undefined" != typeof document.msHidden ? s = "msvisibilitychange" : "undefined" != typeof document.webkitHidden && (s = "webkitvisibilitychange"),
					document.addEventListener(s, function () {
						var e = !!game.getVendorAttribute(document, "hidden");
						e && game.System.pauseOnHide && game.system.pause(),
						!e && game.System.pauseOnHide && game.system.resume()
					}, !1)
				}
				window.addEventListener("devicemotion", function (e) {
					game.accelerometer = game.accel = e.accelerationIncludingGravity
				}, !1),
				navigator.isCocoonJS && (this.canvas.style.cssText = "idtkscale:" + game.System.idtkScale + ";"),
				game.renderer = this.renderer,
				navigator.isCocoonJS || this.initResize()
			},
			vibrate : function (e) {
				return navigator.vibrate ? navigator.vibrate(e) : !1
			},
			pause : function () {
				this.paused || (this.paused = !0, game.scene && game.scene.pause())
			},
			resume : function () {
				this.paused && (this.paused = !1, game.scene && game.scene.resume())
			},
			setScene : function (e) {
				this.running ? this.newSceneClass = e : this.setSceneNow(e)
			},
			setSceneNow : function (e) {
				game.TweenEngine && game.TweenEngine.removeAll(),
				game.scene = new e,
				game.Debug && game.Debug.enabled && !navigator.isCocoonJS && (this.debug = new game.Debug),
				this.startRunLoop()
			},
			startRunLoop : function () {
				this.gameLoopId && this.stopRunLoop(),
				this.gameLoopId = game.setGameLoop(this.run.bind(this), this.canvas),
				this.running = !0
			},
			stopRunLoop : function () {
				game.clearGameLoop(this.gameLoopId),
				this.running = !1
			},
			run : function () {
				this.paused || (game.Timer.update(), this.delta = this.timer.delta() / 1e3, game.scene.run(), this.debug && this.debug.update(), this.newSceneClass && (this.setSceneNow(this.newSceneClass), this.newSceneClass = null))
			},
			initResize : function () {
				if (this.ratio = game.System.orientation === game.System.LANDSCAPE ? this.width / this.height : this.height / this.width, game.System.center && (this.canvas.style.margin = "auto"), game.device.mobile) {
					game.System.center || (this.canvas.style.position = "absolute", this.canvas.style.left = game.System.left + "px", this.canvas.style.top = game.System.top + "px"),
					document.addEventListener("touchstart", function (e) {
						e.preventDefault()
					}, !1);
					var e = document.createElement("div");
					if (e.innerHTML = game.System.rotateImg ? "" : game.System.rotateMsg, e.id = "ig_rotateMsg", e.style.position = "absolute", e.style.height = "12px", e.style.textAlign = "center", e.style.left = 0, e.style.right = 0, e.style.top = 0, e.style.bottom = 0, e.style.margin = "auto", e.style.display = "none", game.System.rotateDiv = e, document.body.appendChild(game.System.rotateDiv), game.System.rotateImg) {
						var t = new Image,
						i = this;
						t.onload = function (t) {
							e.image = t.target,
							e.appendChild(t.target),
							e.style.height = t.target.height + "px",
							i.resizeRotateImage()
						},
						t.src = game.System.rotateImg,
						t.style.position = "relative"
					}
				} else if (this.canvas.style.position = "absolute", game.System.center ? (this.canvas.style.top = 0, this.canvas.style.left = 0, this.canvas.style.bottom = 0, this.canvas.style.right = 0) : (this.canvas.style.left = game.System.left + "px", this.canvas.style.top = game.System.top + "px"), game.System.resize) {
					var r = "auto" === game.System.minWidth ? this.retina ? this.width / 4 : this.width / 2 : game.System.minWidth,
					s = "auto" === game.System.minHeight ? this.retina ? this.height / 4 : this.height / 2 : game.System.minHeight,
					n = "auto" === game.System.maxWidth ? this.retina ? this.width / 2 : this.width : game.System.maxWidth,
					a = "auto" === game.System.maxHeight ? this.retina ? this.height / 2 : this.height : game.System.maxHeight;
					game.System.minWidth && (this.canvas.style.minWidth = r + "px"),
					game.System.minHeight && (this.canvas.style.minHeight = s + "px"),
					game.System.maxWidth && (this.canvas.style.maxWidth = n + "px"),
					game.System.maxHeight && (this.canvas.style.maxHeight = a + "px")
				}
				"undefined" != typeof window.onorientationchange ? window.onorientationchange = this.onResize.bind(this) : window.onresize = this.onResize.bind(this),
				this.onResize()
			},
			checkOrientation : function () {
				this.orientation = window.innerWidth < window.innerHeight ? game.System.PORTRAIT : game.System.LANDSCAPE,
				game.device.android2 && 320 === window.innerWidth && 251 === window.innerHeight && (this.orientation = game.System.PORTRAIT),
				game.System.rotateScreen = game.System.orientation !== this.orientation ? !0 : !1,
				this.canvas.style.display = game.System.rotateScreen ? "none" : "block",
				game.System.rotateDiv.style.display = game.System.rotateScreen ? "block" : "none",
				game.System.rotateScreen && game.System.backgroundColor.rotate && (document.body.style.backgroundColor = game.System.backgroundColor.rotate),
				!game.System.rotateScreen && game.System.backgroundColor.game && (document.body.style.backgroundColor = game.System.backgroundColor.game),
				game.System.rotateScreen && (document.body.style.backgroundImage = game.System.backgroundImage.rotate ? "url(" + game.System.backgroundImage.rotate + ")" : "none"),
				game.System.rotateScreen || (document.body.style.backgroundImage = game.System.backgroundImage.game ? "url(" + game.System.backgroundImage.game + ")" : "none"),
				game.System.rotateScreen && game.system && "function" == typeof game.system.pause && game.system.pause(),
				!game.System.rotateScreen && game.system && "function" == typeof game.system.resume && game.system.resume(),
				game.System.rotateScreen && this.resizeRotateImage()
			},
			resizeRotateImage : function () {
				game.System.rotateScreen && game.System.rotateDiv.image && window.innerHeight < game.System.rotateDiv.image.height && (game.System.rotateDiv.image.style.height = window.innerHeight + "px", game.System.rotateDiv.image.style.width = "auto", game.System.rotateDiv.style.height = window.innerHeight + "px", game.System.rotateDiv.style.bottom = "auto")
			},
			onResize : function () {
				if (game.device.mobile && this.checkOrientation(), game.System.resize)
					if (game.device.mobile) {
						var e = window.innerWidth,
						t = window.innerHeight;
						game.device.iPad && 671 === t && this.orientation === game.System.LANDSCAPE && (t = 672),
						game.System.orientation === game.System.LANDSCAPE ? (this.canvas.style.height = t + "px", this.canvas.style.width = t * this.ratio + "px") : (this.canvas.style.width = e + "px", this.canvas.style.height = e * this.ratio + "px"),
						game.device.ejecta || window.scroll(0, 1)
					} else {
						if (0 === window.innerWidth)
							return;
						window.innerWidth < this.width || window.innerHeight < this.height ? window.innerWidth / this.width < window.innerHeight / this.height ? (this.canvas.style.width = window.innerWidth + "px", this.canvas.style.height = window.innerWidth * (this.height / this.width) + "px") : (this.canvas.style.height = window.innerHeight + "px", this.canvas.style.width = window.innerHeight * (this.width / this.height) + "px") : (this.canvas.style.width = this.width + "px", this.canvas.style.height = this.height + "px")
					}
			}
		}),
	game.System.rotateScreen = !1,
	game.System.PORTRAIT = 0,
	game.System.LANDSCAPE = 1,
	game.System.center = !0,
	game.System.left = 0,
	game.System.top = 0,
	game.System.resize = !0,
	game.System.minWidth = "auto",
	game.System.minHeight = "auto",
	game.System.maxWidth = "auto",
	game.System.maxHeight = "auto",
	game.System.idtkScale = "ScaleAspectFit",
	game.System.screenCanvas = !0,
	game.System.hires = !1,
	game.System.hiresFactor = 1.5,
	game.System.retina = !1,
	game.System.pauseOnHide = !0,
	game.System.orientation = game.System.PORTRAIT,
	game.System.backgroundColor = {
		game : "#000000",
		rotate : "#000000"
	},
	game.System.backgroundImage = {
		game : null,
		rotate : null
	},
	game.System.rotateMsg = "Please rotate your device",
	game.System.rotateImg = "media/rotate.png",
	game.System.canvas = !0,
	game.System.transparent = !1,
	game.System.antialias = !1
}), game.module("engine.audio").body(function () {
	"use strict";
	game.Audio = game.Class.extend({
			format : null,
			sources : {},
			context : null,
			gainNode : null,
			soundMuted : !1,
			soundVolume : 1,
			currentMusic : null,
			musicMuted : !1,
			musicVolume : 1,
			init : function () {
				if (game.normalizeVendorAttribute(window, "AudioContext"), game.device.iOS5 && (game.Audio.enabled = !1), game.device.wp && (game.Audio.enabled = !1), game.device.android2 && (game.Audio.enabled = !1), game.device.cocoonJS || navigator.onLine || !game.device.mobile || (game.Audio.enabled = !1), game.Audio.enabled || (game.Audio.webAudio = !1), game.Audio.webAudio && !window.AudioContext && (game.Audio.webAudio = !1), game.Audio.enabled)
					for (var e = new Audio, t = 0; t < game.Audio.formats.length; t++)
						if (e.canPlayType(game.Audio.formats[t].type)) {
							this.format = game.Audio.formats[t].ext;
							break
						}
				this.format || (game.Audio.enabled = !1),
				game.Audio.enabled && game.Audio.webAudio && (this.context = new AudioContext, this.context.createGain ? this.gainNode = this.context.createGain() : this.context.createGainNode && (this.gainNode = this.context.createGainNode()), this.gainNode.connect(this.context.destination))
			},
			decode : function (e, t, i) {
				if (this.context) {
					if (!e.response)
						throw "Error loading audio: " + t;
					this.context.decodeAudioData(e.response, this.loaded.bind(this, t, i), this.loadError.bind(this, t))
				}
			},
			load : function (e, t) {
				if (!game.Audio.enabled)
					return t ? t() : !1;
				var i = this.getPath(e);
				if (this.context) {
					var r = new XMLHttpRequest;
					r.open("GET", i, !0),
					r.responseType = "arraybuffer",
					r.onload = this.decode.bind(this, r, e, t),
					r.send()
				} else {
					var s = new Audio(i);
					game.device.ie ? this.loaded(e, t, s) : (s.loadCallback = this.loaded.bind(this, e, t, s), s.addEventListener("canplaythrough", s.loadCallback, !1), s.addEventListener("error", this.loadError.bind(this, e), !1)),
					s.preload = "auto",
					s.load()
				}
			},
			loaded : function (e, t, i) {
				if (this.sources[game.Audio.queue[e]])
					throw "Duplicate audio source: " + game.Audio.queue[e];
				if (!game.Audio.queue[e])
					throw "Cannot find audio resource: " + e;
				var r = game.Audio.queue[e];
				this.sources[r] = {
					clips : [],
					audio : i
				},
				i instanceof Audio && (i.removeEventListener("canplaythrough", i.loadCallback, !1), i.addEventListener("ended", function () {
						this.playing = !1
					}, !1)),
				t && t(e)
			},
			loadError : function (e) {
				throw "Error loading: " + e
			},
			getPath : function (e) {
				return e.replace(/[^\.]+$/, this.format)
			},
			play : function (e, t, i, r, s) {
				if (!this.sources[e])
					throw "Cannot find source: " + e;
				if (this.context) {
					var n = this.context.createBufferSource();
					n.buffer = this.sources[e].audio,
					n.loop = !!i,
					n.playbackRate.value = s || 1,
					n.onended = "function" == typeof r ? r.bind(this) : null;
					var a;
					this.context.createGain ? a = this.context.createGain() : this.context.createGainNode && (a = this.context.createGainNode()),
					a.gain.value = t || 1,
					a.connect(this.gainNode),
					n.connect(a),
					n.start ? n.start(0, this.sources[e].audio.pauseTime || 0) : n.noteOn && n.noteOn(0, this.sources[e].audio.pauseTime || 0),
					this.sources[e].clips.push(n),
					this.sources[e].audio.volume = a.gain.value,
					this.sources[e].audio.loop = n.loop,
					this.sources[e].audio.startTime = this.context.currentTime - this.sources[e].audio.pauseTime || 0
				} else
					this.sources[e].audio.volume = t || 1, this.sources[e].audio.loop = i, this.sources[e].audio.playing = !0, this.sources[e].audio.onended = "function" == typeof r ? r.bind(this) : null, this.sources[e].audio.currentTime = 0, this.sources[e].audio.play()
			},
			stop : function (e) {
				if (!this.sources[e])
					throw "Cannot find source: " + e;
				if (this.context) {
					for (var t = 0; t < this.sources[e].clips.length; t++)
						this.sources[e].clips[t].stop ? this.sources[e].clips[t].stop(!0) : this.sources[e].clips[t].noteOff && this.sources[e].clips[t].noteOff(!0);
					this.sources[e].clips.length = 0,
					this.sources[e].audio.pauseTime = 0
				} else
					navigator.isCocoonJS ? this.sources[e].audio.volume = 0 : this.sources[e].audio.pause(), this.sources[e].audio.playing = !1, this.sources[e].audio.currentTime = 0
			},
			pause : function (e) {
				if (!this.sources[e])
					throw "Cannot find source: " + e;
				if (this.context) {
					if (0 === this.sources[e].clips.length)
						return;
					for (var t = 0; t < this.sources[e].clips.length; t++)
						this.sources[e].clips[t].stop ? this.sources[e].clips[t].stop(!0) : this.sources[e].clips[t].noteOff && this.sources[e].clips[t].noteOff(!0);
					this.sources[e].clips.length = 0,
					this.sources[e].audio.pauseTime = this.context.currentTime - this.sources[e].audio.startTime,
					this.sources[e].audio.pauseTime > this.sources[e].audio.duration && !this.sources[e].audio.loop && (this.sources[e].audio.pauseTime = 0)
				} else (this.sources[e].audio.currentTime > 0 && this.sources[e].audio.currentTime < this.sources[e].audio.duration || this.sources[e].audio.loop) && this.sources[e].audio.pause()
			},
			resume : function (e) {
				if (!this.sources[e])
					throw "Cannot find source: " + e;
				this.context ? this.sources[e].audio.pauseTime && this.play(e, this.sources[e].audio.volume, this.sources[e].audio.loop) : this.sources[e].audio.playing && this.sources[e].audio.play()
			},
			playSound : function (e, t, i, r, s) {
				game.Audio.enabled && (this.soundMuted || (i = i || 1, this.play(e, i * this.soundVolume, t, r, s)))
			},
			stopSound : function (e) {
				if (game.Audio.enabled)
					if (e)
						this.stop(e);
					else
						for (e in this.sources)
							e !== this.currentMusic && this.stop(e)
			},
			pauseSound : function (e) {
				if (game.Audio.enabled)
					if (e)
						this.pause(e);
					else
						for (e in this.sources)
							e !== this.currentMusic && this.pause(e)
			},
			resumeSound : function (e) {
				if (game.Audio.enabled)
					if (e)
						this.resume(e);
					else
						for (e in this.sources)
							e !== this.currentMusic && this.resume(e)
			},
			playMusic : function (e, t) {
				game.Audio.enabled && (this.musicMuted || (this.currentMusic && this.stop(this.currentMusic), this.currentMusic = e, t = t || 1, this.play(e, t * this.musicVolume, !0)))
			},
			stopMusic : function () {
				game.Audio.enabled && (this.currentMusic && this.stop(this.currentMusic), this.currentMusic = null)
			},
			pauseMusic : function () {
				game.Audio.enabled && this.currentMusic && this.pause(this.currentMusic)
			},
			resumeMusic : function () {
				game.Audio.enabled && this.currentMusic && (this.context ? this.play(this.currentMusic) : this.sources[this.currentMusic].audio.playing && this.sources[this.currentMusic].audio.play())
			},
			pauseAll : function () {
				if (game.Audio.enabled)
					for (var e in this.sources)
						this.pause(e)
			},
			resumeAll : function () {
				if (game.Audio.enabled)
					for (var e in this.sources)
						this.resume(e)
			},
			stopAll : function () {}

		}),
	game.Audio.enabled = !0,
	game.Audio.webAudio = !0,
	game.Audio.formats = [{
			ext : "m4a",
			type : 'audio/mp4; codecs="mp4a.40.5"'
		}, {
			ext : "ogg",
			type : 'audio/ogg; codecs="vorbis"'
		}
	],
	game.Audio.queue = {}

}), game.module("engine.renderer").body(function () {
	"use strict";
	(function () {
		var e = window,
		t = t || {};
		t.WEBGL_RENDERER = 0,
		t.CANVAS_RENDERER = 1,
		t.VERSION = "v1.4.4",
		t.blendModes = {
			NORMAL : 0,
			ADD : 1,
			MULTIPLY : 2,
			SCREEN : 3,
			OVERLAY : 4,
			DARKEN : 5,
			LIGHTEN : 6,
			COLOR_DODGE : 7,
			COLOR_BURN : 8,
			HARD_LIGHT : 9,
			SOFT_LIGHT : 10,
			DIFFERENCE : 11,
			EXCLUSION : 12,
			HUE : 13,
			SATURATION : 14,
			COLOR : 15,
			LUMINOSITY : 16
		},
		t.scaleModes = {
			DEFAULT : 0,
			LINEAR : 0,
			NEAREST : 1
		},
		t.INTERACTION_FREQUENCY = 30,
		t.AUTO_PREVENT_DEFAULT = !0,
		t.RAD_TO_DEG = 180 / Math.PI,
		t.DEG_TO_RAD = Math.PI / 180,
		t.Point = function (e, t) {
			this.x = e || 0,
			this.y = t || 0
		},
		t.Point.prototype.clone = function () {
			return new t.Point(this.x, this.y)
		},
		t.Point.prototype.constructor = t.Point,
		t.Point.prototype.set = function (e, t) {
			this.x = e || 0,
			this.y = t || (0 !== t ? this.x : 0)
		},
		t.Rectangle = function (e, t, i, r) {
			this.x = e || 0,
			this.y = t || 0,
			this.width = i || 0,
			this.height = r || 0
		},
		t.Rectangle.prototype.clone = function () {
			return new t.Rectangle(this.x, this.y, this.width, this.height)
		},
		t.Rectangle.prototype.contains = function (e, t) {
			if (this.width <= 0 || this.height <= 0)
				return !1;
			var i = this.x;
			if (e >= i && e <= i + this.width) {
				var r = this.y;
				if (t >= r && t <= r + this.height)
					return !0
			}
			return !1
		},
		t.Rectangle.prototype.constructor = t.Rectangle,
		t.EmptyRectangle = new t.Rectangle(0, 0, 0, 0),
		t.Polygon = function (e) {
			if (e instanceof Array || (e = Array.prototype.slice.call(arguments)), "number" == typeof e[0]) {
				for (var i = [], r = 0, s = e.length; s > r; r += 2)
					i.push(new t.Point(e[r], e[r + 1]));
				e = i
			}
			this.points = e
		},
		t.Polygon.prototype.clone = function () {
			for (var e = [], i = 0; i < this.points.length; i++)
				e.push(this.points[i].clone());
			return new t.Polygon(e)
		},
		t.Polygon.prototype.contains = function (e, t) {
			for (var i = !1, r = 0, s = this.points.length - 1; r < this.points.length; s = r++) {
				var n = this.points[r].x,
				a = this.points[r].y,
				o = this.points[s].x,
				h = this.points[s].y,
				l = a > t != h > t && (o - n) * (t - a) / (h - a) + n > e;
				l && (i = !i)
			}
			return i
		},
		t.Polygon.prototype.constructor = t.Polygon,
		t.Circle = function (e, t, i) {
			this.x = e || 0,
			this.y = t || 0,
			this.radius = i || 0
		},
		t.Circle.prototype.clone = function () {
			return new t.Circle(this.x, this.y, this.radius)
		},
		t.Circle.prototype.contains = function (e, t) {
			if (this.radius <= 0)
				return !1;
			var i = this.x - e,
			r = this.y - t,
			s = this.radius * this.radius;
			return i *= i,
			r *= r,
			s >= i + r
		},
		t.Circle.prototype.constructor = t.Circle,
		t.Ellipse = function (e, t, i, r) {
			this.x = e || 0,
			this.y = t || 0,
			this.width = i || 0,
			this.height = r || 0
		},
		t.Ellipse.prototype.clone = function () {
			return new t.Ellipse(this.x, this.y, this.width, this.height)
		},
		t.Ellipse.prototype.contains = function (e, t) {
			if (this.width <= 0 || this.height <= 0)
				return !1;
			var i = (e - this.x) / this.width,
			r = (t - this.y) / this.height;
			return i *= i,
			r *= r,
			1 >= i + r
		},
		t.Ellipse.prototype.getBounds = function () {
			return new t.Rectangle(this.x, this.y, this.width, this.height)
		},
		t.Ellipse.prototype.constructor = t.Ellipse,
		t.determineMatrixArrayType = function () {
			return "undefined" != typeof Float32Array ? Float32Array : Array
		},
		t.Matrix2 = t.determineMatrixArrayType(),
		t.Matrix = function () {
			this.a = 1,
			this.b = 0,
			this.c = 0,
			this.d = 1,
			this.tx = 0,
			this.ty = 0
		},
		t.Matrix.prototype.fromArray = function (e) {
			this.a = e[0],
			this.b = e[1],
			this.c = e[3],
			this.d = e[4],
			this.tx = e[2],
			this.ty = e[5]
		},
		t.Matrix.prototype.toArray = function (e) {
			this.array || (this.array = new Float32Array(9));
			var t = this.array;
			return e ? (this.array[0] = this.a, this.array[1] = this.c, this.array[2] = 0, this.array[3] = this.b, this.array[4] = this.d, this.array[5] = 0, this.array[6] = this.tx, this.array[7] = this.ty, this.array[8] = 1) : (this.array[0] = this.a, this.array[1] = this.b, this.array[2] = this.tx, this.array[3] = this.c, this.array[4] = this.d, this.array[5] = this.ty, this.array[6] = 0, this.array[7] = 0, this.array[8] = 1),
			t
		},
		t.identityMatrix = new t.Matrix,
		t.DisplayObject = function () {
			this.position = new t.Point,
			this.scale = new t.Point(1, 1),
			this.pivot = new t.Point(0, 0),
			this.rotation = 0,
			this.alpha = 1,
			this.visible = !0,
			this.hitArea = null,
			this.buttonMode = !1,
			this.renderable = !1,
			this.parent = null,
			this.stage = null,
			this.worldAlpha = 1,
			this._interactive = !1,
			this.defaultCursor = "pointer",
			this.worldTransform = new t.Matrix,
			this.color = [],
			this.dynamic = !0,
			this._sr = 0,
			this._cr = 1,
			this.filterArea = new t.Rectangle(0, 0, 1, 1),
			this._bounds = new t.Rectangle(0, 0, 1, 1),
			this._currentBounds = null,
			this._mask = null
		},
		t.DisplayObject.prototype.constructor = t.DisplayObject,
		t.DisplayObject.prototype.setInteractive = function (e) {
			this.interactive = e
		},
		Object.defineProperty(t.DisplayObject.prototype, "interactive", {
			get : function () {
				return this._interactive
			},
			set : function (e) {
				this._interactive = e,
				this.stage && (this.stage.dirty = !0)
			}
		}),
		Object.defineProperty(t.DisplayObject.prototype, "worldVisible", {
			get : function () {
				var e = this;
				do {
					if (!e.visible)
						return !1;
					e = e.parent
				} while (e);
				return !0
			}
		}),
		Object.defineProperty(t.DisplayObject.prototype, "mask", {
			get : function () {
				return this._mask
			},
			set : function (e) {
				this._mask && (this._mask.isMask = !1),
				this._mask = e,
				this._mask && (this._mask.isMask = !0)
			}
		}),
		Object.defineProperty(t.DisplayObject.prototype, "filters", {
			get : function () {
				return this._filters
			},
			set : function (e) {
				if (e) {
					for (var t = [], i = 0; i < e.length; i++)
						for (var r = e[i].passes, s = 0; s < r.length; s++)
							t.push(r[s]);
					this._filterBlock = {
						target : this,
						filterPasses : t
					}
				}
				this._filters = e
			}
		}),
		t.DisplayObject.prototype.updateTransform = function () {
			this.rotation !== this.rotationCache && (this.rotationCache = this.rotation, this._sr = Math.sin(this.rotation), this._cr = Math.cos(this.rotation));
			var e = this.parent.worldTransform,
			t = this.worldTransform,
			i = this.pivot.x,
			r = this.pivot.y,
			s = this._cr * this.scale.x,
			n = -this._sr * this.scale.y,
			a = this._sr * this.scale.x,
			o = this._cr * this.scale.y,
			h = this.position.x + s * i - r * n,
			l = this.position.y + o * r - i * a,
			u = e.a,
			c = e.b,
			d = e.c,
			p = e.d;
			t.a = u * s + c * a,
			t.b = u * n + c * o,
			t.tx = u * h + c * l + e.tx,
			t.c = d * s + p * a,
			t.d = d * n + p * o,
			t.ty = d * h + p * l + e.ty,
			this.worldAlpha = this.alpha * this.parent.worldAlpha
		},
		t.DisplayObject.prototype.getBounds = function (e) {
			return e = e,
			t.EmptyRectangle
		},
		t.DisplayObject.prototype.getLocalBounds = function () {
			return this.getBounds(t.identityMatrix)
		},
		t.DisplayObject.prototype.setStageReference = function (e) {
			this.stage = e,
			this._interactive && (this.stage.dirty = !0)
		},
		t.DisplayObject.prototype._renderWebGL = function (e) {
			e = e
		},
		t.DisplayObject.prototype._renderCanvas = function (e) {
			e = e
		},
		Object.defineProperty(t.DisplayObject.prototype, "x", {
			get : function () {
				return this.position.x
			},
			set : function (e) {
				this.position.x = e
			}
		}),
		Object.defineProperty(t.DisplayObject.prototype, "y", {
			get : function () {
				return this.position.y
			},
			set : function (e) {
				this.position.y = e
			}
		}),
		t.DisplayObjectContainer = function () {
			t.DisplayObject.call(this),
			this.children = []
		},
		t.DisplayObjectContainer.prototype = Object.create(t.DisplayObject.prototype),
		t.DisplayObjectContainer.prototype.constructor = t.DisplayObjectContainer,
		t.DisplayObjectContainer.prototype.addChild = function (e) {
			this.addChildAt(e, this.children.length)
		},
		t.DisplayObjectContainer.prototype.addChildAt = function (e, t) {
			if (!(t >= 0 && t <= this.children.length))
				throw new Error(e + " The index " + t + " supplied is out of bounds " + this.children.length);
			e.parent && e.parent.removeChild(e),
			e.parent = this,
			this.children.splice(t, 0, e),
			this.stage && e.setStageReference(this.stage)
		},
		t.DisplayObjectContainer.prototype.swapChildren = function (e, t) {
			if (e !== t) {
				var i = this.children.indexOf(e),
				r = this.children.indexOf(t);
				if (0 > i || 0 > r)
					throw new Error("swapChildren: Both the supplied DisplayObjects must be a child of the caller.");
				this.children[i] = t,
				this.children[r] = e
			}
		},
		t.DisplayObjectContainer.prototype.getChildAt = function (e) {
			if (e >= 0 && e < this.children.length)
				return this.children[e];
			throw new Error("The supplied DisplayObjects must be a child of the caller " + this)
		},
		t.DisplayObjectContainer.prototype.removeChild = function (e) {
			var t = this.children.indexOf(e);
			if (-1 === t)
				throw new Error(e + " The supplied DisplayObject must be a child of the caller " + this);
			this.stage && e.removeStageReference(),
			e.parent = void 0,
			this.children.splice(t, 1)
		},
		t.DisplayObjectContainer.prototype.removeAll = function () {
			for (var e = this.children.length - 1; e >= 0; e--)
				this.removeChild(this.children[e])
		},
		t.DisplayObjectContainer.prototype.updateTransform = function () {
			if (this.visible) {
				t.DisplayObject.prototype.updateTransform.call(this);
				for (var e = this.children.length - 1; e >= 0; e--)
					this.children[e].updateTransform()
			}
		},
		t.DisplayObjectContainer.prototype.getBounds = function (e) {
			if (0 === this.children.length)
				return t.EmptyRectangle;
			if (e) {
				var i = this.worldTransform;
				this.worldTransform = e,
				this.updateTransform(),
				this.worldTransform = i
			}
			for (var r, s, n, a = 1 / 0, o = 1 / 0, h = -1 / 0, l = -1 / 0, u = !1, c = 0, d = this.children.length; d > c; c++) {
				var p = this.children[c];
				p.visible && (u = !0, r = this.children[c].getBounds(e), a = a < r.x ? a : r.x, o = o < r.y ? o : r.y, s = r.width + r.x, n = r.height + r.y, h = h > s ? h : s, l = l > n ? l : n)
			}
			if (!u)
				return t.EmptyRectangle;
			var m = this._bounds;
			return m.x = a,
			m.y = o,
			m.width = h - a,
			m.height = l - o,
			m
		},
		t.DisplayObjectContainer.prototype.getLocalBounds = function () {
			var e = this.worldTransform;
			this.worldTransform = t.identityMatrix;
			for (var i = 0, r = this.children.length; r > i; i++)
				this.children[i].updateTransform();
			var s = this.getBounds();
			return this.worldTransform = e,
			s
		},
		t.DisplayObjectContainer.prototype.setStageReference = function (e) {
			this.stage = e,
			this._interactive && (this.stage.dirty = !0);
			for (var t = 0, i = this.children.length; i > t; t++) {
				var r = this.children[t];
				r.setStageReference(e)
			}
		},
		t.DisplayObjectContainer.prototype.removeStageReference = function () {
			for (var e = 0, t = this.children.length; t > e; e++) {
				var i = this.children[e];
				i.removeStageReference()
			}
			this._interactive && (this.stage.dirty = !0),
			this.stage = null
		},
		t.DisplayObjectContainer.prototype._renderWebGL = function (e) {
			if (this.visible && !(this.alpha <= 0)) {
				var t,
				i;
				if (this._mask || this._filters) {
					for (this._mask && (e.spriteBatch.stop(), e.maskManager.pushMask(this.mask, e), e.spriteBatch.start()), this._filters && (e.spriteBatch.flush(), e.filterManager.pushFilter(this._filterBlock)), t = 0, i = this.children.length; i > t; t++)
						this.children[t]._renderWebGL(e);
					e.spriteBatch.stop(),
					this._filters && e.filterManager.popFilter(),
					this._mask && e.maskManager.popMask(e),
					e.spriteBatch.start()
				} else
					for (t = 0, i = this.children.length; i > t; t++)
						this.children[t]._renderWebGL(e)
			}
		},
		t.DisplayObjectContainer.prototype._renderCanvas = function (e) {
			if (this.visible !== !1 && 0 !== this.alpha) {
				this._mask && e.maskManager.pushMask(this._mask, e.context);
				for (var t = 0, i = this.children.length; i > t; t++) {
					var r = this.children[t];
					r._renderCanvas(e)
				}
				this._mask && e.maskManager.popMask(e.context)
			}
		},
		t.Sprite = function (e) {
			t.DisplayObjectContainer.call(this),
			this.anchor = new t.Point,
			this.texture = e,
			this._width = 0,
			this._height = 0,
			this.tint = 16777215,
			this.blendMode = t.blendModes.NORMAL,
			e.baseTexture.hasLoaded ? this.onTextureUpdate() : (this.onTextureUpdateBind = this.onTextureUpdate.bind(this), this.texture.addEventListener("update", this.onTextureUpdateBind)),
			this.renderable = !0
		},
		t.Sprite.prototype = Object.create(t.DisplayObjectContainer.prototype),
		t.Sprite.prototype.constructor = t.Sprite,
		Object.defineProperty(t.Sprite.prototype, "width", {
			get : function () {
				return this.scale.x * this.texture.frame.width
			},
			set : function (e) {
				this.scale.x = e / this.texture.frame.width,
				this._width = e
			}
		}),
		Object.defineProperty(t.Sprite.prototype, "height", {
			get : function () {
				return this.scale.y * this.texture.frame.height
			},
			set : function (e) {
				this.scale.y = e / this.texture.frame.height,
				this._height = e
			}
		}),
		t.Sprite.prototype.setTexture = function (e) {
			this.texture.baseTexture !== e.baseTexture ? (this.textureChange = !0, this.texture = e) : this.texture = e,
			this.cachedTint = 16777215,
			this.updateFrame = !0
		},
		t.Sprite.prototype.onTextureUpdate = function () {
			this._width && (this.scale.x = this._width / this.texture.frame.width),
			this._height && (this.scale.y = this._height / this.texture.frame.height),
			this.updateFrame = !0
		},
		t.Sprite.prototype.getBounds = function (e) {
			var t = this.texture.frame.width,
			i = this.texture.frame.height,
			r = t * (1 - this.anchor.x),
			s = t * -this.anchor.x,
			n = i * (1 - this.anchor.y),
			a = i * -this.anchor.y,
			o = e || this.worldTransform,
			h = o.a,
			l = o.c,
			u = o.b,
			c = o.d,
			d = o.tx,
			p = o.ty,
			m = h * s + u * a + d,
			g = c * a + l * s + p,
			f = h * r + u * a + d,
			v = c * a + l * r + p,
			y = h * r + u * n + d,
			x = c * n + l * r + p,
			b = h * s + u * n + d,
			T = c * n + l * s + p,
			w = -1 / 0,
			S = -1 / 0,
			C = 1 / 0,
			A = 1 / 0;
			C = C > m ? m : C,
			C = C > f ? f : C,
			C = C > y ? y : C,
			C = C > b ? b : C,
			A = A > g ? g : A,
			A = A > v ? v : A,
			A = A > x ? x : A,
			A = A > T ? T : A,
			w = m > w ? m : w,
			w = f > w ? f : w,
			w = y > w ? y : w,
			w = b > w ? b : w,
			S = g > S ? g : S,
			S = v > S ? v : S,
			S = x > S ? x : S,
			S = T > S ? T : S;
			var M = this._bounds;
			return M.x = C,
			M.width = w - C,
			M.y = A,
			M.height = S - A,
			this._currentBounds = M,
			M
		},
		t.Sprite.prototype._renderWebGL = function (e) {
			if (this.visible && !(this.alpha <= 0)) {
				var t,
				i;
				if (this._mask || this._filters) {
					var r = e.spriteBatch;
					for (this._mask && (r.stop(), e.maskManager.pushMask(this.mask, e), r.start()), this._filters && (r.flush(), e.filterManager.pushFilter(this._filterBlock)), r.render(this), t = 0, i = this.children.length; i > t; t++)
						this.children[t]._renderWebGL(e);
					r.stop(),
					this._filters && e.filterManager.popFilter(),
					this._mask && e.maskManager.popMask(e),
					r.start()
				} else
					for (e.spriteBatch.render(this), t = 0, i = this.children.length; i > t; t++)
						this.children[t]._renderWebGL(e)
			}
		},
		t.Sprite.prototype._renderCanvas = function (e) {
			if (this.visible !== !1 && 0 !== this.alpha) {
				var i = this.texture.frame,
				r = e.context,
				s = this.texture;
				if (this.blendMode !== e.currentBlendMode && (e.currentBlendMode = this.blendMode, r.globalCompositeOperation = t.blendModesCanvas[e.currentBlendMode]), this._mask && e.maskManager.pushMask(this._mask, e.context), i && i.width && i.height && s.baseTexture.source) {
					r.globalAlpha = this.worldAlpha;
					var n = this.worldTransform;
					if (e.roundPixels ? r.setTransform(n.a, n.c, n.b, n.d, n.tx || 0, n.ty || 0) : r.setTransform(n.a, n.c, n.b, n.d, n.tx, n.ty), e.smoothProperty && e.scaleMode !== this.texture.baseTexture.scaleMode && (e.scaleMode = this.texture.baseTexture.scaleMode, r[e.smoothProperty] = e.scaleMode === t.scaleModes.LINEAR), 16777215 !== this.tint) {
						if (this.cachedTint !== this.tint) {
							if (!s.baseTexture.hasLoaded)
								return;
							this.cachedTint = this.tint,
							this.tintedTexture = t.CanvasTinter.getTintedTexture(this, this.tint)
						}
						r.drawImage(this.tintedTexture, 0, 0, i.width, i.height, this.anchor.x * -i.width, this.anchor.y * -i.height, i.width, i.height)
					} else if (s.trim) {
						var a = s.trim;
						r.drawImage(this.texture.baseTexture.source, i.x, i.y, i.width, i.height, a.x - this.anchor.x * a.width, a.y - this.anchor.y * a.height, i.width, i.height)
					} else
						r.drawImage(this.texture.baseTexture.source, i.x, i.y, i.width, i.height, this.anchor.x * -i.width, this.anchor.y * -i.height, i.width, i.height)
				}
				for (var o = 0, h = this.children.length; h > o; o++) {
					var l = this.children[o];
					l._renderCanvas(e)
				}
				this._mask && e.maskManager.popMask(e.context)
			}
		},
		t.Sprite.fromFrame = function (e) {
			var i = t.TextureCache[e];
			if (!i)
				throw new Error('The frameId "' + e + '" does not exist in the texture cache' + this);
			return new t.Sprite(i)
		},
		t.Sprite.fromImage = function (e) {
			var i = t.Texture.fromImage(e);
			return new t.Sprite(i)
		},
		t.SpriteBatch = function (e) {
			t.DisplayObjectContainer.call(this),
			this.textureThing = e,
			this.ready = !1
		},
		t.SpriteBatch.prototype = Object.create(t.DisplayObjectContainer.prototype),
		t.SpriteBatch.constructor = t.SpriteBatch,
		t.SpriteBatch.prototype.initWebGL = function (e) {
			this.fastSpriteBatch = new t.WebGLFastSpriteBatch(e),
			this.ready = !0
		},
		t.SpriteBatch.prototype.updateTransform = function () {
			t.DisplayObject.prototype.updateTransform.call(this)
		},
		t.SpriteBatch.prototype._renderWebGL = function (e) {
			!this.visible || this.alpha <= 0 || !this.children.length || (this.ready || this.initWebGL(e.gl), e.spriteBatch.stop(), e.shaderManager.activateShader(e.shaderManager.fastShader), this.fastSpriteBatch.begin(this, e), this.fastSpriteBatch.render(this), e.shaderManager.activateShader(e.shaderManager.defaultShader), e.spriteBatch.start())
		},
		t.SpriteBatch.prototype._renderCanvas = function (e) {
			var i = e.context;
			i.globalAlpha = this.worldAlpha;
			var r = this.worldTransform;
			e.roundPixels ? i.setTransform(r.a, r.c, r.b, r.d, Math.floor(r.tx), Math.floor(r.ty)) : i.setTransform(r.a, r.c, r.b, r.d, r.tx, r.ty),
			i.save();
			for (var s = 0; s < this.children.length; s++) {
				var n = this.children[s],
				a = n.texture,
				o = a.frame;
				if (i.globalAlpha = this.worldAlpha * n.alpha, n.rotation % (2 * Math.PI) === 0)
					i.drawImage(a.baseTexture.source, o.x, o.y, o.width, o.height, n.anchor.x * -o.width * n.scale.x + n.position.x + .5 | 0, n.anchor.y * -o.height * n.scale.y + n.position.y + .5 | 0, o.width * n.scale.x, o.height * n.scale.y);
				else {
					t.DisplayObject.prototype.updateTransform.call(n),
					r = n.localTransform,
					this.rotation !== this.rotationCache && (this.rotationCache = this.rotation, this._sr = Math.sin(this.rotation), this._cr = Math.cos(this.rotation));
					var h = n._cr * n.scale.x,
					l = -n._sr * n.scale.y,
					u = n._sr * n.scale.x,
					c = n._cr * n.scale.y;
					i.setTransform(h, u, l, c, n.position.x, n.position.y),
					i.drawImage(a.baseTexture.source, o.x, o.y, o.width, o.height, n.anchor.x * -o.width + .5 | 0, n.anchor.y * -o.height + .5 | 0, o.width, o.height)
				}
			}
			i.restore()
		},
		t.MovieClip = function (e) {
			t.Sprite.call(this, e[0]),
			this.textures = e,
			this.animationSpeed = 1,
			this.loop = !0,
			this.onComplete = null,
			this.currentFrame = 0,
			this.playing = !1
		},
		t.MovieClip.prototype = Object.create(t.Sprite.prototype),
		t.MovieClip.prototype.constructor = t.MovieClip,
		Object.defineProperty(t.MovieClip.prototype, "totalFrames", {
			get : function () {
				return this.textures.length
			}
		}),
		t.MovieClip.prototype.stop = function () {
			this.playing = !1
		},
		t.MovieClip.prototype.play = function () {
			this.playing = !0
		},
		t.MovieClip.prototype.gotoAndStop = function (e) {
			this.playing = !1,
			this.currentFrame = e;
			var t = this.currentFrame + .5 | 0;
			this.setTexture(this.textures[t % this.textures.length])
		},
		t.MovieClip.prototype.gotoAndPlay = function (e) {
			this.currentFrame = e,
			this.playing = !0
		},
		t.MovieClip.prototype.updateTransform = function () {
			if (t.Sprite.prototype.updateTransform.call(this), this.playing) {
				this.currentFrame += this.animationSpeed;
				var e = this.currentFrame + .5 | 0;
				this.loop || e < this.textures.length ? this.setTexture(this.textures[e % this.textures.length]) : e >= this.textures.length && (this.gotoAndStop(this.textures.length - 1), this.onComplete && this.onComplete())
			}
		},
		t.FilterBlock = function () {
			this.visible = !0,
			this.renderable = !0
		},
		t.Text = function (e, i) {
			this.canvas = document.createElement("canvas"),
			this.context = this.canvas.getContext("2d"),
			t.Sprite.call(this, t.Texture.fromCanvas(this.canvas)),
			this.setText(e),
			this.setStyle(i),
			this.updateText(),
			this.dirty = !1
		},
		t.Text.prototype = Object.create(t.Sprite.prototype),
		t.Text.prototype.constructor = t.Text,
		t.Text.prototype.setStyle = function (e) {
			e = e || {},
			e.font = e.font || "bold 20pt Arial",
			e.fill = e.fill || "black",
			e.align = e.align || "left",
			e.stroke = e.stroke || "black",
			e.strokeThickness = e.strokeThickness || 0,
			e.wordWrap = e.wordWrap || !1,
			e.wordWrapWidth = e.wordWrapWidth || 100,
			this.style = e,
			this.dirty = !0
		},
		t.Text.prototype.setText = function (e) {
			this.text = e.toString() || " ",
			this.dirty = !0
		},
		t.Text.prototype.updateText = function () {
			this.context.font = this.style.font;
			var e = this.text;
			this.style.wordWrap && (e = this.wordWrap(this.text));
			for (var i = e.split(/(?:\r\n|\r|\n)/), r = [], s = 0, n = 0; n < i.length; n++) {
				var a = this.context.measureText(i[n]).width;
				r[n] = a,
				s = Math.max(s, a)
			}
			this.canvas.width = s + this.style.strokeThickness;
			var o = this.determineFontHeight("font: " + this.style.font + ";") + this.style.strokeThickness;
			for (this.canvas.height = o * i.length, navigator.isCocoonJS && this.context.clearRect(0, 0, this.canvas.width, this.canvas.height), this.context.fillStyle = this.style.fill, this.context.font = this.style.font, this.context.strokeStyle = this.style.stroke, this.context.lineWidth = this.style.strokeThickness, this.context.textBaseline = "top", n = 0; n < i.length; n++) {
				var h = new t.Point(this.style.strokeThickness / 2, this.style.strokeThickness / 2 + n * o);
				"right" === this.style.align ? h.x += s - r[n] : "center" === this.style.align && (h.x += (s - r[n]) / 2),
				this.style.stroke && this.style.strokeThickness && this.context.strokeText(i[n], h.x, h.y),
				this.style.fill && this.context.fillText(i[n], h.x, h.y)
			}
			this.updateTexture()
		},
		t.Text.prototype.updateTexture = function () {
			this.texture.baseTexture.width = this.canvas.width,
			this.texture.baseTexture.height = this.canvas.height,
			this.texture.frame.width = this.canvas.width,
			this.texture.frame.height = this.canvas.height,
			this._width = this.canvas.width,
			this._height = this.canvas.height,
			this.requiresUpdate = !0
		},
		t.Text.prototype._renderWebGL = function (e) {
			this.requiresUpdate && (this.requiresUpdate = !1, t.updateWebGLTexture(this.texture.baseTexture, e.gl)),
			t.Sprite.prototype._renderWebGL.call(this, e)
		},
		t.Text.prototype.updateTransform = function () {
			this.dirty && (this.updateText(), this.dirty = !1),
			t.Sprite.prototype.updateTransform.call(this)
		},
		t.Text.prototype.determineFontHeight = function (e) {
			var i = t.Text.heightCache[e];
			if (!i) {
				var r = document.getElementsByTagName("body")[0],
				s = document.createElement("div"),
				n = document.createTextNode("M");
				s.appendChild(n),
				s.setAttribute("style", e + ";position:absolute;top:0;left:0"),
				r.appendChild(s),
				i = s.offsetHeight,
				t.Text.heightCache[e] = i,
				r.removeChild(s)
			}
			return i
		},
		t.Text.prototype.wordWrap = function (e) {
			for (var t = "", i = e.split("\n"), r = 0; r < i.length; r++) {
				for (var s = this.style.wordWrapWidth, n = i[r].split(" "), a = 0; a < n.length; a++) {
					var o = this.context.measureText(n[a]).width,
					h = o + this.context.measureText(" ").width;
					h > s ? (a > 0 && (t += "\n"), t += n[a] + " ", s = this.style.wordWrapWidth - o) : (s -= h, t += n[a] + " ")
				}
				r < i.length - 1 && (t += "\n")
			}
			return t
		},
		t.Text.prototype.destroy = function (e) {
			e && this.texture.destroy()
		},
		t.Text.heightCache = {},
		t.BitmapText = function (e, i) {
			t.DisplayObjectContainer.call(this),
			this._pool = [],
			this.setText(e),
			this.setStyle(i),
			this.updateText(),
			this.dirty = !1
		},
		t.BitmapText.prototype = Object.create(t.DisplayObjectContainer.prototype),
		t.BitmapText.prototype.constructor = t.BitmapText,
		t.BitmapText.prototype.setText = function (e) {
			this.text = e || " ",
			this.dirty = !0
		},
		t.BitmapText.prototype.setStyle = function (e) {
			e = e || {},
			e.align = e.align || "left",
			this.style = e;
			var i = e.font.split(" ");
			this.fontName = i[i.length - 1],
			this.fontSize = i.length >= 2 ? parseInt(i[i.length - 2], 10) : t.BitmapText.fonts[this.fontName].size,
			this.dirty = !0,
			this.tint = e.tint
		},
		t.BitmapText.prototype.updateText = function () {
			for (var e = t.BitmapText.fonts[this.fontName], i = new t.Point, r = null, s = [], n = 0, a = [], o = 0, h = this.fontSize / e.size, l = 0; l < this.text.length; l++) {
				var u = this.text.charCodeAt(l);
				if (/(?:\r\n|\r|\n)/.test(this.text.charAt(l)))
					a.push(i.x), n = Math.max(n, i.x), o++, i.x = 0, i.y += e.lineHeight, r = null;
				else {
					var c = e.chars[u];
					c && (r && c[r] && (i.x += c.kerning[r]), s.push({
							texture : c.texture,
							line : o,
							charCode : u,
							position : new t.Point(i.x + c.xOffset, i.y + c.yOffset)
						}), i.x += c.xAdvance, r = u)
				}
			}
			a.push(i.x),
			n = Math.max(n, i.x);
			var d = [];
			for (l = 0; o >= l; l++) {
				var p = 0;
				"right" === this.style.align ? p = n - a[l] : "center" === this.style.align && (p = (n - a[l]) / 2),
				d.push(p)
			}
			var m = this.children.length,
			g = s.length,
			f = this.tint || 16777215;
			for (l = 0; g > l; l++) {
				var v = m > l ? this.children[l] : this._pool.pop();
				v ? v.setTexture(s[l].texture) : v = new t.Sprite(s[l].texture),
				v.position.x = (s[l].position.x + d[s[l].line]) * h,
				v.position.y = s[l].position.y * h,
				v.scale.x = v.scale.y = h,
				v.tint = f,
				v.parent || this.addChild(v)
			}
			for (; this.children.length > g; ) {
				var y = this.getChildAt(this.children.length - 1);
				this._pool.push(y),
				this.removeChild(y)
			}
			this.textWidth = n * h,
			this.textHeight = (i.y + e.lineHeight) * h
		},
		t.BitmapText.prototype.updateTransform = function () {
			this.dirty && (this.updateText(), this.dirty = !1),
			t.DisplayObjectContainer.prototype.updateTransform.call(this)
		},
		t.BitmapText.fonts = {},
		t.InteractionData = function () {
			this.global = new t.Point,
			this.local = new t.Point,
			this.target = null,
			this.originalEvent = null
		},
		t.InteractionData.prototype.getLocalPosition = function (e) {
			var i = e.worldTransform,
			r = this.global,
			s = i.a,
			n = i.b,
			a = i.tx,
			o = i.c,
			h = i.d,
			l = i.ty,
			u = 1 / (s * h + n * -o);
			return new t.Point(h * u * r.x + -n * u * r.y + (l * n - a * h) * u, s * u * r.y + -o * u * r.x + (-l * s + a * o) * u)
		},
		t.InteractionData.prototype.constructor = t.InteractionData,
		t.InteractionManager = function (e) {
			this.stage = e,
			this.mouse = new t.InteractionData,
			this.mouse.global.x = this.mouse.global.y = -1e4,
			this.touchs = {},
			this.tempPoint = new t.Point,
			this.mouseoverEnabled = !0,
			this.pool = [],
			this.interactiveItems = [],
			this.interactionDOMElement = null,
			this.onMouseMove = this.onMouseMove.bind(this),
			this.onMouseDown = this.onMouseDown.bind(this),
			this.onMouseOut = this.onMouseOut.bind(this),
			this.onMouseUp = this.onMouseUp.bind(this),
			this.onTouchStart = this.onTouchStart.bind(this),
			this.onTouchEnd = this.onTouchEnd.bind(this),
			this.onTouchMove = this.onTouchMove.bind(this),
			this.last = 0,
			this.currentCursorStyle = "inherit",
			this.mouseOut = !1
		},
		t.InteractionManager.prototype.constructor = t.InteractionManager,
		t.InteractionManager.prototype.collectInteractiveSprite = function (e, t) {
			for (var i = e.children, r = i.length, s = r - 1; s >= 0; s--) {
				var n = i[s];
				n.interactive ? (t.interactiveChildren = !0, this.interactiveItems.push(n), n.children.length > 0 && this.collectInteractiveSprite(n, n)) : (n.__iParent = null, n.children.length > 0 && this.collectInteractiveSprite(n, t))
			}
		},
		t.InteractionManager.prototype.setTarget = function (e) {
			this.target = e,
			null === this.interactionDOMElement && this.setTargetDomElement(e.view)
		},
		t.InteractionManager.prototype.setTargetDomElement = function (e) {
			this.removeEvents(),
			window.navigator.msPointerEnabled && (e.style["-ms-content-zooming"] = "none", e.style["-ms-touch-action"] = "none"),
			this.interactionDOMElement = e,
			e.addEventListener("mousemove", this.onMouseMove, !0),
			e.addEventListener("mousedown", this.onMouseDown, !0),
			e.addEventListener("mouseout", this.onMouseOut, !0),
			e.addEventListener("touchstart", this.onTouchStart, !0),
			e.addEventListener("touchend", this.onTouchEnd, !0),
			e.addEventListener("touchmove", this.onTouchMove, !0),
			window.addEventListener("mouseup", this.onMouseUp, !0)
		},
		t.InteractionManager.prototype.removeEvents = function () {
			this.interactionDOMElement && (this.interactionDOMElement.style["-ms-content-zooming"] = "", this.interactionDOMElement.style["-ms-touch-action"] = "", this.interactionDOMElement.removeEventListener("mousemove", this.onMouseMove, !0), this.interactionDOMElement.removeEventListener("mousedown", this.onMouseDown, !0), this.interactionDOMElement.removeEventListener("mouseout", this.onMouseOut, !0), this.interactionDOMElement.removeEventListener("touchstart", this.onTouchStart, !0), this.interactionDOMElement.removeEventListener("touchend", this.onTouchEnd, !0), this.interactionDOMElement.removeEventListener("touchmove", this.onTouchMove, !0), this.interactionDOMElement = null, window.removeEventListener("mouseup", this.onMouseUp, !0))
		},
		t.InteractionManager.prototype.update = function () {
			if (this.target) {
				var e = Date.now(),
				i = e - this.last;
				if (i = i * t.INTERACTION_FREQUENCY / 1e3, !(1 > i)) {
					this.last = e;
					var r = 0;
					if (this.dirty) {
						this.dirty = !1;
						var s = this.interactiveItems.length;
						for (r = 0; s > r; r++)
							this.interactiveItems[r].interactiveChildren = !1;
						this.interactiveItems = [],
						this.stage.interactive && this.interactiveItems.push(this.stage),
						this.collectInteractiveSprite(this.stage, this.stage)
					}
					var n = this.interactiveItems.length,
					a = "inherit",
					o = !1;
					for (r = 0; n > r; r++) {
						var h = this.interactiveItems[r];
						h.__hit = this.hitTest(h, this.mouse),
						this.mouse.target = h,
						h.__hit && !o ? (h.buttonMode && (a = h.defaultCursor), h.interactiveChildren || (o = !0), h.__isOver || (h.mouseover && this.mouse.originalEvent ? h.mouseover(this.mouse) : h.touchover && h.touchover(this.mouse), h.__isOver = !0)) : h.__isOver && (h.mouseout && this.mouse.originalEvent ? h.mouseout(this.mouse) : h.touchout && h.touchout(this.mouse), h.__isOver = !1)
					}
					this.currentCursorStyle !== a && (this.currentCursorStyle = a, this.interactionDOMElement.style.cursor = a)
				}
			}
		},
		t.InteractionManager.prototype.onMouseMove = function (e) {
			this.mouse.originalEvent = e || window.event;
			var t = this.interactionDOMElement.getBoundingClientRect();
			this.mouse.global.x = (e.clientX - t.left) * (this.target.width / t.width),
			this.mouse.global.y = (e.clientY - t.top) * (this.target.height / t.height);
			for (var i = this.interactiveItems.length, r = 0; i > r; r++) {
				var s = this.interactiveItems[r];
				s.mousemove && s.mousemove(this.mouse)
			}
		},
		t.InteractionManager.prototype.onMouseDown = function (e) {
			this.mouse.originalEvent = e || window.event,
			t.AUTO_PREVENT_DEFAULT && this.mouse.originalEvent.preventDefault();
			for (var i = this.interactiveItems.length, r = 0; i > r; r++) {
				var s = this.interactiveItems[r];
				if ((s.mousedown || s.click) && (s.__mouseIsDown = !0, s.__hit = this.hitTest(s, this.mouse), s.__hit && (s.mousedown && s.mousedown(this.mouse), s.__isDown = !0, !s.interactiveChildren)))
					break
			}
		},
		t.InteractionManager.prototype.onMouseOut = function () {
			var e = this.interactiveItems.length;
			this.interactionDOMElement.style.cursor = "inherit";
			for (var t = 0; e > t; t++) {
				var i = this.interactiveItems[t];
				i.__isOver && (this.mouse.target = i, i.mouseout && i.mouseout(this.mouse), i.__isOver = !1)
			}
			this.mouseOut = !0
		},
		t.InteractionManager.prototype.onMouseUp = function (e) {
			this.mouse.originalEvent = e || window.event;
			for (var t = this.interactiveItems.length, i = !1, r = 0; t > r; r++) {
				var s = this.interactiveItems[r];
				s.__hit = this.hitTest(s, this.mouse),
				s.__hit && !i ? (s.mouseup && s.mouseup(this.mouse), s.__isDown && s.click && s.click(this.mouse), s.interactiveChildren || (i = !0)) : s.__isDown && s.mouseupoutside && s.mouseupoutside(this.mouse),
				s.__isDown = !1
			}
		},
		t.InteractionManager.prototype.hitTest = function (e, i) {
			var r = i.global;
			if (-1e4 === r.x && -1e4 === r.y)
				return !1;
			if (!e.worldVisible)
				return !1;
			var s = e instanceof t.Sprite,
			n = e.worldTransform,
			a = n.a,
			o = n.b,
			h = n.tx,
			l = n.c,
			u = n.d,
			c = n.ty,
			d = 1 / (a * u + o * -l),
			p = u * d * r.x + -o * d * r.y + (c * o - h * u) * d,
			m = a * d * r.y + -l * d * r.x + (-c * a + h * l) * d;
			if (i.target = e, e.hitArea && e.hitArea.contains)
				return e.hitArea.contains(p, m) ? (i.target = e, !0) : !1;
			if (s) {
				var g,
				f = e.texture.frame.width,
				v = e.texture.frame.height,
				y = -f * e.anchor.x;
				if (p > y && y + f > p && (g = -v * e.anchor.y, m > g && g + v > m))
					return i.target = e, !0
			}
			for (var x = e.children.length, b = 0; x > b; b++) {
				var T = e.children[b],
				w = this.hitTest(T, i);
				if (w)
					return i.target = e, !0
			}
			return !1
		},
		t.InteractionManager.prototype.onTouchMove = function (e) {
			var t,
			i,
			r,
			s,
			n,
			a = this.interactionDOMElement.getBoundingClientRect(),
			o = e.changedTouches;
			for (i = 0; i < o.length; i++) {
				var h = o[i];
				for (t = this.touchs[h.identifier], t.originalEvent = e || window.event, t.global.x = (h.clientX - a.left) * (this.target.width / a.width), t.global.y = (h.clientY - a.top) * (this.target.height / a.height), navigator.isCocoonJS && (t.global.x = h.clientX, t.global.y = h.clientY), this.mouse.global.x = t.global.x, this.mouse.global.y = t.global.y, s = this.interactiveItems.length, r = 0; s > r; r++)
					n = this.interactiveItems[r], n.touchmove && n.touchmove(t)
			}
		},
		t.InteractionManager.prototype.onTouchStart = function (e) {
			var i = this.interactionDOMElement.getBoundingClientRect();
			t.AUTO_PREVENT_DEFAULT && e.preventDefault();
			for (var r = e.changedTouches, s = 0; s < r.length; s++) {
				var n = r[s],
				a = this.pool.pop();
				a || (a = new t.InteractionData),
				a.originalEvent = e || window.event,
				this.touchs[n.identifier] = a,
				a.global.x = (n.clientX - i.left) * (this.target.width / i.width),
				a.global.y = (n.clientY - i.top) * (this.target.height / i.height),
				navigator.isCocoonJS && (a.global.x = n.clientX, a.global.y = n.clientY);
				for (var o = this.interactiveItems.length, h = 0; o > h; h++) {
					var l = this.interactiveItems[h];
					if ((l.touchstart || l.tap) && (l.__hit = this.hitTest(l, a), l.__hit && (l.touchstart && l.touchstart(a), l.__isDown = !0, l.__touchData = a, !l.interactiveChildren)))
						break
				}
			}
		},
		t.InteractionManager.prototype.onTouchEnd = function (e) {
			for (var t = this.interactionDOMElement.getBoundingClientRect(), i = e.changedTouches, r = 0; r < i.length; r++) {
				var s = i[r],
				n = this.touchs[s.identifier],
				a = !1;
				n.global.x = (s.clientX - t.left) * (this.target.width / t.width),
				n.global.y = (s.clientY - t.top) * (this.target.height / t.height),
				navigator.isCocoonJS && (n.global.x = s.clientX, n.global.y = s.clientY);
				for (var o = this.interactiveItems.length, h = 0; o > h; h++) {
					var l = this.interactiveItems[h],
					u = l.__touchData;
					l.__hit = this.hitTest(l, n),
					u = n,
					u === n && (n.originalEvent = e || window.event, (l.touchend || l.tap) && (l.__hit && !a ? (l.touchend && l.touchend(n), l.__isDown && l.tap && l.tap(n), l.interactiveChildren || (a = !0)) : l.__isDown && l.touchendoutside && l.touchendoutside(n), l.__isDown = !1), l.__touchData = null)
				}
				this.pool.push(n),
				this.touchs[s.identifier] = null
			}
		},
		t.Stage = function (e) {
			t.DisplayObjectContainer.call(this),
			this.worldTransform = new t.Matrix,
			this.interactive = !0,
			this.interactionManager = new t.InteractionManager(this),
			this.dirty = !0,
			this.stage = this,
			this.stage.hitArea = new t.Rectangle(0, 0, 1e5, 1e5),
			this.setBackgroundColor(e)
		},
		t.Stage.prototype = Object.create(t.DisplayObjectContainer.prototype),
		t.Stage.prototype.constructor = t.Stage,
		t.Stage.prototype.setInteractionDelegate = function (e) {
			this.interactionManager.setTargetDomElement(e)
		},
		t.Stage.prototype.updateTransform = function () {
			this.worldAlpha = 1;
			for (var e = 0, t = this.children.length; t > e; e++)
				this.children[e].updateTransform();
			this.dirty && (this.dirty = !1, this.interactionManager.dirty = !0),
			this.interactive && this.interactionManager.update()
		},
		t.Stage.prototype.setBackgroundColor = function (e) {
			this.backgroundColor = e || 0,
			this.backgroundColorSplit = t.hex2rgb(this.backgroundColor);
			var i = this.backgroundColor.toString(16);
			i = "000000".substr(0, 6 - i.length) + i,
			this.backgroundColorString = "#" + i
		},
		t.Stage.prototype.getMousePosition = function () {
			return this.interactionManager.mouse.global
		};
		for (var i = 0, s = ["ms", "moz", "webkit", "o"], n = 0; n < s.length && !window.requestAnimationFrame; ++n)
			window.requestAnimationFrame = window[s[n] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[s[n] + "CancelAnimationFrame"] || window[s[n] + "CancelRequestAnimationFrame"];
		window.requestAnimationFrame || (window.requestAnimationFrame = function (e) {
			var t = (new Date).getTime(),
			r = Math.max(0, 16 - (t - i)),
			s = window.setTimeout(function () {
					e(t + r)
				}, r);
			return i = t + r,
			s
		}),
		window.cancelAnimationFrame || (window.cancelAnimationFrame = function (e) {
			clearTimeout(e)
		}),
		window.requestAnimFrame = window.requestAnimationFrame,
		t.hex2rgb = function (e) {
			return [(e >> 16 & 255) / 255, (e >> 8 & 255) / 255, (255 & e) / 255]
		},
		t.rgb2hex = function (e) {
			return (255 * e[0] << 16) + (255 * e[1] << 8) + 255 * e[2]
		},
		"function" != typeof Function.prototype.bind && (Function.prototype.bind = function () {
			var e = Array.prototype.slice;
			return function (t) {
				function i() {
					var n = s.concat(e.call(arguments));
					r.apply(this instanceof i ? this : t, n)
				}
				var r = this,
				s = e.call(arguments, 1);
				if ("function" != typeof r)
					throw new TypeError;
				return i.prototype = function n(e) {
					return e && (n.prototype = e),
					this instanceof n ? void 0 : new n
				}
				(r.prototype),
				i
			}
		}
			()),
		t.AjaxRequest = function () {
			var e = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Microsoft.XMLHTTP"];
			if (!window.ActiveXObject)
				return window.XMLHttpRequest ? new window.XMLHttpRequest : !1;
			for (var t = 0; t < e.length; t++)
				try {
					return new window.ActiveXObject(e[t])
				} catch (i) {}

		},
		t.canUseNewCanvasBlendModes = function () {
			var e = document.createElement("canvas");
			e.width = 1,
			e.height = 1;
			var t = e.getContext("2d");
			return t.fillStyle = "#000",
			t.fillRect(0, 0, 1, 1),
			t.globalCompositeOperation = "multiply",
			t.fillStyle = "#fff",
			t.fillRect(0, 0, 1, 1),
			0 === t.getImageData(0, 0, 1, 1).data[0]
		},
		t.getNextPowerOfTwo = function (e) {
			if (e > 0 && 0 === (e & e - 1))
				return e;
			for (var t = 1; e > t; )
				t <<= 1;
			return t
		},
		t.EventTarget = function () {
			var e = {};
			this.addEventListener = this.on = function (t, i) {
				void 0 === e[t] && (e[t] = []),
				-1 === e[t].indexOf(i) && e[t].push(i)
			},
			this.dispatchEvent = this.emit = function (t) {
				if (e[t.type] && e[t.type].length)
					for (var i = 0, r = e[t.type].length; r > i; i++)
						e[t.type][i](t)
			},
			this.removeEventListener = this.off = function (t, i) {
				var r = e[t].indexOf(i);
				-1 !== r && e[t].splice(r, 1)
			},
			this.removeAllEventListeners = function (t) {
				var i = e[t];
				i && (i.length = 0)
			}
		},
		t.autoDetectRenderer = function (e, i, r, s, n) {
			e || (e = 800),
			i || (i = 600);
			var a = function () {
				try {
					var e = document.createElement("canvas");
					return !!window.WebGLRenderingContext && (e.getContext("webgl") || e.getContext("experimental-webgl"))
				} catch (t) {
					return !1
				}
			}
			();
			return a ? new t.WebGLRenderer(e, i, r, n, s) : new t.CanvasRenderer(e, i, r, n)
		},
		t.PolyK = {},
		t.PolyK.Triangulate = function (e) {
			var i = !0,
			r = e.length >> 1;
			if (3 > r)
				return [];
			for (var s = [], n = [], a = 0; r > a; a++)
				n.push(a);
			a = 0;
			for (var o = r; o > 3; ) {
				var h = n[(a + 0) % o],
				l = n[(a + 1) % o],
				u = n[(a + 2) % o],
				c = e[2 * h],
				d = e[2 * h + 1],
				p = e[2 * l],
				m = e[2 * l + 1],
				g = e[2 * u],
				f = e[2 * u + 1],
				v = !1;
				if (t.PolyK._convex(c, d, p, m, g, f, i)) {
					v = !0;
					for (var y = 0; o > y; y++) {
						var x = n[y];
						if (x !== h && x !== l && x !== u && t.PolyK._PointInTriangle(e[2 * x], e[2 * x + 1], c, d, p, m, g, f)) {
							v = !1;
							break
						}
					}
				}
				if (v)
					s.push(h, l, u), n.splice((a + 1) % o, 1), o--, a = 0;
				else if (a++ > 3 * o) {
					if (!i)
						return window.console.log("PIXI Warning: shape too complex to fill"), [];
					for (s = [], n = [], a = 0; r > a; a++)
						n.push(a);
					a = 0,
					o = r,
					i = !1
				}
			}
			return s.push(n[0], n[1], n[2]),
			s
		},
		t.PolyK._PointInTriangle = function (e, t, i, r, s, n, a, o) {
			var h = a - i,
			l = o - r,
			u = s - i,
			c = n - r,
			d = e - i,
			p = t - r,
			m = h * h + l * l,
			g = h * u + l * c,
			f = h * d + l * p,
			v = u * u + c * c,
			y = u * d + c * p,
			x = 1 / (m * v - g * g),
			b = (v * f - g * y) * x,
			T = (m * y - g * f) * x;
			return b >= 0 && T >= 0 && 1 > b + T
		},
		t.PolyK._convex = function (e, t, i, r, s, n, a) {
			return (t - r) * (s - i) + (i - e) * (n - r) >= 0 === a
		},
		t.initDefaultShaders = function () {},
		t.CompileVertexShader = function (e, i) {
			return t._CompileShader(e, i, e.VERTEX_SHADER)
		},
		t.CompileFragmentShader = function (e, i) {
			return t._CompileShader(e, i, e.FRAGMENT_SHADER)
		},
		t._CompileShader = function (e, t, i) {
			var r = t.join("\n"),
			s = e.createShader(i);
			return e.shaderSource(s, r),
			e.compileShader(s),
			e.getShaderParameter(s, e.COMPILE_STATUS) ? s : (window.console.log(e.getShaderInfoLog(s)), null)
		},
		t.compileProgram = function (e, i, r) {
			var s = t.CompileFragmentShader(e, r),
			n = t.CompileVertexShader(e, i),
			a = e.createProgram();
			return e.attachShader(a, n),
			e.attachShader(a, s),
			e.linkProgram(a),
			e.getProgramParameter(a, e.LINK_STATUS) || window.console.log("Could not initialise shaders"),
			a
		},
		t.PixiShader = function (e) {
			this.gl = e,
			this.program = null,
			this.fragmentSrc = ["precision lowp float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;", "}"],
			this.textureCount = 0,
			this.attributes = [],
			this.init()
		},
		t.PixiShader.prototype.init = function () {
			var e = this.gl,
			i = t.compileProgram(e, this.vertexSrc || t.PixiShader.defaultVertexSrc, this.fragmentSrc);
			e.useProgram(i),
			this.uSampler = e.getUniformLocation(i, "uSampler"),
			this.projectionVector = e.getUniformLocation(i, "projectionVector"),
			this.offsetVector = e.getUniformLocation(i, "offsetVector"),
			this.dimensions = e.getUniformLocation(i, "dimensions"),
			this.aVertexPosition = e.getAttribLocation(i, "aVertexPosition"),
			this.aTextureCoord = e.getAttribLocation(i, "aTextureCoord"),
			this.colorAttribute = e.getAttribLocation(i, "aColor"),
			-1 === this.colorAttribute && (this.colorAttribute = 2),
			this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute];
			for (var r in this.uniforms)
				this.uniforms[r].uniformLocation = e.getUniformLocation(i, r);
			this.initUniforms(),
			this.program = i
		},
		t.PixiShader.prototype.initUniforms = function () {
			this.textureCount = 1;
			var e,
			t = this.gl;
			for (var i in this.uniforms) {
				e = this.uniforms[i];
				var r = e.type;
				"sampler2D" === r ? (e._init = !1, null !== e.value && this.initSampler2D(e)) : "mat2" === r || "mat3" === r || "mat4" === r ? (e.glMatrix = !0, e.glValueLength = 1, "mat2" === r ? e.glFunc = t.uniformMatrix2fv : "mat3" === r ? e.glFunc = t.uniformMatrix3fv : "mat4" === r && (e.glFunc = t.uniformMatrix4fv)) : (e.glFunc = t["uniform" + r], e.glValueLength = "2f" === r || "2i" === r ? 2 : "3f" === r || "3i" === r ? 3 : "4f" === r || "4i" === r ? 4 : 1)
			}
		},
		t.PixiShader.prototype.initSampler2D = function (e) {
			if (e.value && e.value.baseTexture && e.value.baseTexture.hasLoaded) {
				var t = this.gl;
				if (t.activeTexture(t["TEXTURE" + this.textureCount]), t.bindTexture(t.TEXTURE_2D, e.value.baseTexture._glTexture), e.textureData) {
					var i = e.textureData,
					r = i.magFilter ? i.magFilter : t.LINEAR,
					s = i.minFilter ? i.minFilter : t.LINEAR,
					n = i.wrapS ? i.wrapS : t.CLAMP_TO_EDGE,
					a = i.wrapT ? i.wrapT : t.CLAMP_TO_EDGE,
					o = i.luminance ? t.LUMINANCE : t.RGBA;
					if (i.repeat && (n = t.REPEAT, a = t.REPEAT), t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !!i.flipY), i.width) {
						var h = i.width ? i.width : 512,
						l = i.height ? i.height : 2,
						u = i.border ? i.border : 0;
						t.texImage2D(t.TEXTURE_2D, 0, o, h, l, u, o, t.UNSIGNED_BYTE, null)
					} else
						t.texImage2D(t.TEXTURE_2D, 0, o, t.RGBA, t.UNSIGNED_BYTE, e.value.baseTexture.source);
					t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, r),
					t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, s),
					t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, n),
					t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, a)
				}
				t.uniform1i(e.uniformLocation, this.textureCount),
				e._init = !0,
				this.textureCount++
			}
		},
		t.PixiShader.prototype.syncUniforms = function () {
			this.textureCount = 1;
			var e,
			i = this.gl;
			for (var r in this.uniforms)
				e = this.uniforms[r], 1 === e.glValueLength ? e.glMatrix === !0 ? e.glFunc.call(i, e.uniformLocation, e.transpose, e.value) : e.glFunc.call(i, e.uniformLocation, e.value) : 2 === e.glValueLength ? e.glFunc.call(i, e.uniformLocation, e.value.x, e.value.y) : 3 === e.glValueLength ? e.glFunc.call(i, e.uniformLocation, e.value.x, e.value.y, e.value.z) : 4 === e.glValueLength ? e.glFunc.call(i, e.uniformLocation, e.value.x, e.value.y, e.value.z, e.value.w) : "sampler2D" === e.type && (e._init ? (i.activeTexture(i["TEXTURE" + this.textureCount]), i.bindTexture(i.TEXTURE_2D, e.value.baseTexture._glTextures[i.id] || t.createWebGLTexture(e.value.baseTexture, i)), i.uniform1i(e.uniformLocation, this.textureCount), this.textureCount++) : this.initSampler2D(e))
		},
		t.PixiShader.prototype.destroy = function () {
			this.gl.deleteProgram(this.program),
			this.uniforms = null,
			this.gl = null,
			this.attributes = null
		},
		t.PixiShader.defaultVertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "attribute vec2 aColor;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "const vec2 center = vec2(-1.0, 1.0);", "void main(void) {", "   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);", "   vTextureCoord = aTextureCoord;", "   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;", "   vColor = vec4(color * aColor.x, aColor.x);", "}"],
		t.PixiFastShader = function (e) {
			this.gl = e,
			this.program = null,
			this.fragmentSrc = ["precision lowp float;", "varying vec2 vTextureCoord;", "varying float vColor;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;", "}"],
			this.vertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec2 aPositionCoord;", "attribute vec2 aScale;", "attribute float aRotation;", "attribute vec2 aTextureCoord;", "attribute float aColor;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "uniform mat3 uMatrix;", "varying vec2 vTextureCoord;", "varying float vColor;", "const vec2 center = vec2(-1.0, 1.0);", "void main(void) {", "   vec2 v;", "   vec2 sv = aVertexPosition * aScale;", "   v.x = (sv.x) * cos(aRotation) - (sv.y) * sin(aRotation);", "   v.y = (sv.x) * sin(aRotation) + (sv.y) * cos(aRotation);", "   v = ( uMatrix * vec3(v + aPositionCoord , 1.0) ).xy ;", "   gl_Position = vec4( ( v / projectionVector) + center , 0.0, 1.0);", "   vTextureCoord = aTextureCoord;", "   vColor = aColor;", "}"],
			this.textureCount = 0,
			this.init()
		},
		t.PixiFastShader.prototype.init = function () {
			var e = this.gl,
			i = t.compileProgram(e, this.vertexSrc, this.fragmentSrc);
			e.useProgram(i),
			this.uSampler = e.getUniformLocation(i, "uSampler"),
			this.projectionVector = e.getUniformLocation(i, "projectionVector"),
			this.offsetVector = e.getUniformLocation(i, "offsetVector"),
			this.dimensions = e.getUniformLocation(i, "dimensions"),
			this.uMatrix = e.getUniformLocation(i, "uMatrix"),
			this.aVertexPosition = e.getAttribLocation(i, "aVertexPosition"),
			this.aPositionCoord = e.getAttribLocation(i, "aPositionCoord"),
			this.aScale = e.getAttribLocation(i, "aScale"),
			this.aRotation = e.getAttribLocation(i, "aRotation"),
			this.aTextureCoord = e.getAttribLocation(i, "aTextureCoord"),
			this.colorAttribute = e.getAttribLocation(i, "aColor"),
			-1 === this.colorAttribute && (this.colorAttribute = 2),
			this.attributes = [this.aVertexPosition, this.aPositionCoord, this.aScale, this.aRotation, this.aTextureCoord, this.colorAttribute],
			this.program = i
		},
		t.PixiFastShader.prototype.destroy = function () {
			this.gl.deleteProgram(this.program),
			this.uniforms = null,
			this.gl = null,
			this.attributes = null
		},
		t.StripShader = function () {
			this.program = null,
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying float vColor;", "uniform float alpha;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));", "   gl_FragColor = gl_FragColor * alpha;", "}"],
			this.vertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "attribute float aColor;", "uniform mat3 translationMatrix;", "uniform vec2 projectionVector;", "varying vec2 vTextureCoord;", "uniform vec2 offsetVector;", "varying float vColor;", "void main(void) {", "   vec3 v = translationMatrix * vec3(aVertexPosition, 1.0);", "   v -= offsetVector.xyx;", "   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / projectionVector.y + 1.0 , 0.0, 1.0);", "   vTextureCoord = aTextureCoord;", "   vColor = aColor;", "}"]
		},
		t.StripShader.prototype.init = function () {
			var e = t.gl,
			i = t.compileProgram(e, this.vertexSrc, this.fragmentSrc);
			e.useProgram(i),
			this.uSampler = e.getUniformLocation(i, "uSampler"),
			this.projectionVector = e.getUniformLocation(i, "projectionVector"),
			this.offsetVector = e.getUniformLocation(i, "offsetVector"),
			this.colorAttribute = e.getAttribLocation(i, "aColor"),
			this.aVertexPosition = e.getAttribLocation(i, "aVertexPosition"),
			this.aTextureCoord = e.getAttribLocation(i, "aTextureCoord"),
			this.translationMatrix = e.getUniformLocation(i, "translationMatrix"),
			this.alpha = e.getUniformLocation(i, "alpha"),
			this.program = i
		},
		t.PrimitiveShader = function (e) {
			this.gl = e,
			this.program = null,
			this.fragmentSrc = ["precision mediump float;", "varying vec4 vColor;", "void main(void) {", "   gl_FragColor = vColor;", "}"],
			this.vertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec4 aColor;", "uniform mat3 translationMatrix;", "uniform vec2 projectionVector;", "uniform vec2 offsetVector;", "uniform float alpha;", "uniform vec3 tint;", "varying vec4 vColor;", "void main(void) {", "   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);", "   v -= offsetVector.xyx;", "   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);", "   vColor = aColor * vec4(tint * alpha, alpha);", "}"],
			this.init()
		},
		t.PrimitiveShader.prototype.init = function () {
			var e = this.gl,
			i = t.compileProgram(e, this.vertexSrc, this.fragmentSrc);
			e.useProgram(i),
			this.projectionVector = e.getUniformLocation(i, "projectionVector"),
			this.offsetVector = e.getUniformLocation(i, "offsetVector"),
			this.tintColor = e.getUniformLocation(i, "tint"),
			this.aVertexPosition = e.getAttribLocation(i, "aVertexPosition"),
			this.colorAttribute = e.getAttribLocation(i, "aColor"),
			this.attributes = [this.aVertexPosition, this.colorAttribute],
			this.translationMatrix = e.getUniformLocation(i, "translationMatrix"),
			this.alpha = e.getUniformLocation(i, "alpha"),
			this.program = i
		},
		t.PrimitiveShader.prototype.destroy = function () {
			this.gl.deleteProgram(this.program),
			this.uniforms = null,
			this.gl = null,
			this.attribute = null
		},
		t.WebGLGraphics = function () {},
		t.WebGLGraphics.renderGraphics = function (e, i) {
			var r = i.gl,
			s = i.projection,
			n = i.offset,
			a = i.shaderManager.primitiveShader;
			e._webGL[r.id] || (e._webGL[r.id] = {
					points : [],
					indices : [],
					lastIndex : 0,
					buffer : r.createBuffer(),
					indexBuffer : r.createBuffer()
				});
			var o = e._webGL[r.id];
			e.dirty && (e.dirty = !1, e.clearDirty && (e.clearDirty = !1, o.lastIndex = 0, o.points = [], o.indices = []), t.WebGLGraphics.updateGraphics(e, r)),
			i.shaderManager.activatePrimitiveShader(),
			r.blendFunc(r.ONE, r.ONE_MINUS_SRC_ALPHA),
			r.uniformMatrix3fv(a.translationMatrix, !1, e.worldTransform.toArray(!0)),
			r.uniform2f(a.projectionVector, s.x, -s.y),
			r.uniform2f(a.offsetVector, -n.x, -n.y),
			r.uniform3fv(a.tintColor, t.hex2rgb(e.tint)),
			r.uniform1f(a.alpha, e.worldAlpha),
			r.bindBuffer(r.ARRAY_BUFFER, o.buffer),
			r.vertexAttribPointer(a.aVertexPosition, 2, r.FLOAT, !1, 24, 0),
			r.vertexAttribPointer(a.colorAttribute, 4, r.FLOAT, !1, 24, 8),
			r.bindBuffer(r.ELEMENT_ARRAY_BUFFER, o.indexBuffer),
			r.drawElements(r.TRIANGLE_STRIP, o.indices.length, r.UNSIGNED_SHORT, 0),
			i.shaderManager.deactivatePrimitiveShader()
		},
		t.WebGLGraphics.updateGraphics = function (e, i) {
			for (var r = e._webGL[i.id], s = r.lastIndex; s < e.graphicsData.length; s++) {
				var n = e.graphicsData[s];
				n.type === t.Graphics.POLY ? (n.fill && n.points.length > 3 && t.WebGLGraphics.buildPoly(n, r), n.lineWidth > 0 && t.WebGLGraphics.buildLine(n, r)) : n.type === t.Graphics.RECT ? t.WebGLGraphics.buildRectangle(n, r) : (n.type === t.Graphics.CIRC || n.type === t.Graphics.ELIP) && t.WebGLGraphics.buildCircle(n, r)
			}
			r.lastIndex = e.graphicsData.length,
			r.glPoints = new Float32Array(r.points),
			i.bindBuffer(i.ARRAY_BUFFER, r.buffer),
			i.bufferData(i.ARRAY_BUFFER, r.glPoints, i.STATIC_DRAW),
			r.glIndicies = new Uint16Array(r.indices),
			i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, r.indexBuffer),
			i.bufferData(i.ELEMENT_ARRAY_BUFFER, r.glIndicies, i.STATIC_DRAW)
		},
		t.WebGLGraphics.buildRectangle = function (e, i) {
			var r = e.points,
			s = r[0],
			n = r[1],
			a = r[2],
			o = r[3];
			if (e.fill) {
				var h = t.hex2rgb(e.fillColor),
				l = e.fillAlpha,
				u = h[0] * l,
				c = h[1] * l,
				d = h[2] * l,
				p = i.points,
				m = i.indices,
				g = p.length / 6;
				p.push(s, n),
				p.push(u, c, d, l),
				p.push(s + a, n),
				p.push(u, c, d, l),
				p.push(s, n + o),
				p.push(u, c, d, l),
				p.push(s + a, n + o),
				p.push(u, c, d, l),
				m.push(g, g, g + 1, g + 2, g + 3, g + 3)
			}
			if (e.lineWidth) {
				var f = e.points;
				e.points = [s, n, s + a, n, s + a, n + o, s, n + o, s, n],
				t.WebGLGraphics.buildLine(e, i),
				e.points = f
			}
		},
		t.WebGLGraphics.buildCircle = function (e, i) {
			var r = e.points,
			s = r[0],
			n = r[1],
			a = r[2],
			o = r[3],
			h = 40,
			l = 2 * Math.PI / h,
			u = 0;
			if (e.fill) {
				var c = t.hex2rgb(e.fillColor),
				d = e.fillAlpha,
				p = c[0] * d,
				m = c[1] * d,
				g = c[2] * d,
				f = i.points,
				v = i.indices,
				y = f.length / 6;
				for (v.push(y), u = 0; h + 1 > u; u++)
					f.push(s, n, p, m, g, d), f.push(s + Math.sin(l * u) * a, n + Math.cos(l * u) * o, p, m, g, d), v.push(y++, y++);
				v.push(y - 1)
			}
			if (e.lineWidth) {
				var x = e.points;
				for (e.points = [], u = 0; h + 1 > u; u++)
					e.points.push(s + Math.sin(l * u) * a, n + Math.cos(l * u) * o);
				t.WebGLGraphics.buildLine(e, i),
				e.points = x
			}
		},
		t.WebGLGraphics.buildLine = function (e, i) {
			var r = 0,
			s = e.points;
			if (0 !== s.length) {
				if (e.lineWidth % 2)
					for (r = 0; r < s.length; r++)
						s[r] += .5;
				var n = new t.Point(s[0], s[1]),
				a = new t.Point(s[s.length - 2], s[s.length - 1]);
				if (n.x === a.x && n.y === a.y) {
					s.pop(),
					s.pop(),
					a = new t.Point(s[s.length - 2], s[s.length - 1]);
					var o = a.x + .5 * (n.x - a.x),
					h = a.y + .5 * (n.y - a.y);
					s.unshift(o, h),
					s.push(o, h)
				}
				var l,
				u,
				c,
				d,
				p,
				m,
				g,
				f,
				v,
				y,
				x,
				b,
				T,
				w,
				S,
				C,
				A,
				M,
				E,
				R,
				L,
				_,
				F,
				P = i.points,
				I = i.indices,
				B = s.length / 2,
				D = s.length,
				O = P.length / 6,
				G = e.lineWidth / 2,
				k = t.hex2rgb(e.lineColor),
				j = e.lineAlpha,
				U = k[0] * j,
				N = k[1] * j,
				W = k[2] * j;
				for (c = s[0], d = s[1], p = s[2], m = s[3], v =  - (d - m), y = c - p, F = Math.sqrt(v * v + y * y), v /= F, y /= F, v *= G, y *= G, P.push(c - v, d - y, U, N, W, j), P.push(c + v, d + y, U, N, W, j), r = 1; B - 1 > r; r++)
					c = s[2 * (r - 1)], d = s[2 * (r - 1) + 1], p = s[2 * r], m = s[2 * r + 1], g = s[2 * (r + 1)], f = s[2 * (r + 1) + 1], v =  - (d - m), y = c - p, F = Math.sqrt(v * v + y * y), v /= F, y /= F, v *= G, y *= G, x =  - (m - f), b = p - g, F = Math.sqrt(x * x + b * b), x /= F, b /= F, x *= G, b *= G, S = -y + d - (-y + m), C = -v + p - (-v + c), A = (-v + c) * (-y + m) - (-v + p) * (-y + d), M = -b + f - (-b + m), E = -x + p - (-x + g), R = (-x + g) * (-b + m) - (-x + p) * (-b + f), L = S * E - M * C, Math.abs(L) < .1 ? (L += 10.1, P.push(p - v, m - y, U, N, W, j), P.push(p + v, m + y, U, N, W, j)) : (l = (C * R - E * A) / L, u = (M * A - S * R) / L, _ = (l - p) * (l - p) + (u - m) + (u - m), _ > 19600 ? (T = v - x, w = y - b, F = Math.sqrt(T * T + w * w), T /= F, w /= F, T *= G, w *= G, P.push(p - T, m - w), P.push(U, N, W, j), P.push(p + T, m + w), P.push(U, N, W, j), P.push(p - T, m - w), P.push(U, N, W, j), D++) : (P.push(l, u), P.push(U, N, W, j), P.push(p - (l - p), m - (u - m)), P.push(U, N, W, j)));
				for (c = s[2 * (B - 2)], d = s[2 * (B - 2) + 1], p = s[2 * (B - 1)], m = s[2 * (B - 1) + 1], v =  - (d - m), y = c - p, F = Math.sqrt(v * v + y * y), v /= F, y /= F, v *= G, y *= G, P.push(p - v, m - y), P.push(U, N, W, j), P.push(p + v, m + y), P.push(U, N, W, j), I.push(O), r = 0; D > r; r++)
					I.push(O++);
				I.push(O - 1)
			}
		},
		t.WebGLGraphics.buildPoly = function (e, i) {
			var r = e.points;
			if (!(r.length < 6)) {
				var s = i.points,
				n = i.indices,
				a = r.length / 2,
				o = t.hex2rgb(e.fillColor),
				h = e.fillAlpha,
				l = o[0] * h,
				u = o[1] * h,
				c = o[2] * h,
				d = t.PolyK.Triangulate(r),
				p = s.length / 6,
				m = 0;
				for (m = 0; m < d.length; m += 3)
					n.push(d[m] + p), n.push(d[m] + p), n.push(d[m + 1] + p), n.push(d[m + 2] + p), n.push(d[m + 2] + p);
				for (m = 0; a > m; m++)
					s.push(r[2 * m], r[2 * m + 1], l, u, c, h)
			}
		},
		t.glContexts = [],
		t.WebGLRenderer = function (e, i, r, s, n) {
			t.defaultRenderer || (t.defaultRenderer = this),
			this.type = t.WEBGL_RENDERER,
			this.transparent = !!s,
			this.width = e || 800,
			this.height = i || 600,
			this.view = r || document.createElement("canvas"),
			this.view.width = this.width,
			this.view.height = this.height,
			this.contextLost = this.handleContextLost.bind(this),
			this.contextRestoredLost = this.handleContextRestored.bind(this),
			this.view.addEventListener("webglcontextlost", this.contextLost, !1),
			this.view.addEventListener("webglcontextrestored", this.contextRestoredLost, !1),
			this.options = {
				alpha : this.transparent,
				antialias : !!n,
				premultipliedAlpha : !!s,
				stencil : !0
			};
			try {
				this.gl = this.view.getContext("experimental-webgl", this.options)
			} catch (a) {
				try {
					this.gl = this.view.getContext("webgl", this.options)
				} catch (o) {
					throw new Error(" This browser does not support webGL. Try using the canvas renderer" + this)
				}
			}
			var h = this.gl;
			this.glContextId = h.id = t.WebGLRenderer.glContextId++,
			t.glContexts[this.glContextId] = h,
			t.blendModesWebGL || (t.blendModesWebGL = [], t.blendModesWebGL[t.blendModes.NORMAL] = [h.ONE, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.ADD] = [h.SRC_ALPHA, h.DST_ALPHA], t.blendModesWebGL[t.blendModes.MULTIPLY] = [h.DST_COLOR, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.SCREEN] = [h.SRC_ALPHA, h.ONE], t.blendModesWebGL[t.blendModes.OVERLAY] = [h.ONE, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.DARKEN] = [h.ONE, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.LIGHTEN] = [h.ONE, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.COLOR_DODGE] = [h.ONE, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.COLOR_BURN] = [h.ONE, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.HARD_LIGHT] = [h.ONE, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.SOFT_LIGHT] = [h.ONE, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.DIFFERENCE] = [h.ONE, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.EXCLUSION] = [h.ONE, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.HUE] = [h.ONE, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.SATURATION] = [h.ONE, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.COLOR] = [h.ONE, h.ONE_MINUS_SRC_ALPHA], t.blendModesWebGL[t.blendModes.LUMINOSITY] = [h.ONE, h.ONE_MINUS_SRC_ALPHA]),
			this.projection = new t.Point,
			this.projection.x = this.width / 2,
			this.projection.y = -this.height / 2,
			this.offset = new t.Point(0, 0),
			this.resize(this.width, this.height),
			this.contextLost = !1,
			this.shaderManager = new t.WebGLShaderManager(h),
			this.spriteBatch = new t.WebGLSpriteBatch(h),
			this.maskManager = new t.WebGLMaskManager(h),
			this.filterManager = new t.WebGLFilterManager(h, this.transparent),
			this.renderSession = {},
			this.renderSession.gl = this.gl,
			this.renderSession.drawCount = 0,
			this.renderSession.shaderManager = this.shaderManager,
			this.renderSession.maskManager = this.maskManager,
			this.renderSession.filterManager = this.filterManager,
			this.renderSession.spriteBatch = this.spriteBatch,
			h.useProgram(this.shaderManager.defaultShader.program),
			h.disable(h.DEPTH_TEST),
			h.disable(h.CULL_FACE),
			h.enable(h.BLEND),
			h.colorMask(!0, !0, !0, this.transparent)
		},
		t.WebGLRenderer.prototype.constructor = t.WebGLRenderer,
		t.WebGLRenderer.prototype.render = function (e) {
			if (!this.contextLost) {
				this.__stage !== e && (e.interactive && e.interactionManager.removeEvents(), this.__stage = e),
				t.WebGLRenderer.updateTextures(),
				e.updateTransform();
				var i = this.gl;
				i.viewport(0, 0, this.width, this.height),
				i.bindFramebuffer(i.FRAMEBUFFER, null),
				this.transparent ? i.clearColor(0, 0, 0, 0) : i.clearColor(e.backgroundColorSplit[0], e.backgroundColorSplit[1], e.backgroundColorSplit[2], 1),
				i.clear(i.COLOR_BUFFER_BIT),
				this.renderDisplayObject(e, this.projection),
				e.interactive ? e._interactiveEventsAdded || (e._interactiveEventsAdded = !0, e.interactionManager.setTarget(this)) : e._interactiveEventsAdded && (e._interactiveEventsAdded = !1, e.interactionManager.setTarget(this))
			}
		},
		t.WebGLRenderer.prototype.renderDisplayObject = function (e, t, i) {
			this.renderSession.drawCount = 0,
			this.renderSession.currentBlendMode = 9999,
			this.renderSession.projection = t,
			this.renderSession.offset = this.offset,
			this.spriteBatch.begin(this.renderSession),
			this.filterManager.begin(this.renderSession, i),
			e._renderWebGL(this.renderSession),
			this.spriteBatch.end()
		},
		t.WebGLRenderer.updateTextures = function () {
			var e = 0;
			for (e = 0; e < t.Texture.frameUpdates.length; e++)
				t.WebGLRenderer.updateTextureFrame(t.Texture.frameUpdates[e]);
			for (e = 0; e < t.texturesToDestroy.length; e++)
				t.WebGLRenderer.destroyTexture(t.texturesToDestroy[e]);
			t.texturesToUpdate.length = 0,
			t.texturesToDestroy.length = 0,
			t.Texture.frameUpdates.length = 0
		},
		t.WebGLRenderer.destroyTexture = function (e) {
			for (var i = e._glTextures.length - 1; i >= 0; i--) {
				var r = e._glTextures[i],
				s = t.glContexts[i];
				s && r && s.deleteTexture(r)
			}
			e._glTextures.length = 0
		},
		t.WebGLRenderer.updateTextureFrame = function (e) {
			e.updateFrame = !1,
			e._updateWebGLuvs()
		},
		t.WebGLRenderer.prototype.resize = function (e, t) {
			this.width = e,
			this.height = t,
			this.view.width = e,
			this.view.height = t,
			this.gl.viewport(0, 0, this.width, this.height),
			this.projection.x = this.width / 2,
			this.projection.y = -this.height / 2
		},
		t.createWebGLTexture = function (e, i) {
			return e.hasLoaded && (e._glTextures[i.id] = i.createTexture(), i.bindTexture(i.TEXTURE_2D, e._glTextures[i.id]), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), i.texImage2D(i.TEXTURE_2D, 0, i.RGBA, i.RGBA, i.UNSIGNED_BYTE, e.source), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MAG_FILTER, e.scaleMode === t.scaleModes.LINEAR ? i.LINEAR : i.NEAREST), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, e.scaleMode === t.scaleModes.LINEAR ? i.LINEAR : i.NEAREST), e._powerOf2 ? (i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, i.REPEAT), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, i.REPEAT)) : (i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE)), i.bindTexture(i.TEXTURE_2D, null)),
			e._glTextures[i.id]
		},
		t.updateWebGLTexture = function (e, i) {
			e._glTextures[i.id] && (i.bindTexture(i.TEXTURE_2D, e._glTextures[i.id]), i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), i.texImage2D(i.TEXTURE_2D, 0, i.RGBA, i.RGBA, i.UNSIGNED_BYTE, e.source), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MAG_FILTER, e.scaleMode === t.scaleModes.LINEAR ? i.LINEAR : i.NEAREST), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, e.scaleMode === t.scaleModes.LINEAR ? i.LINEAR : i.NEAREST), e._powerOf2 ? (i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, i.REPEAT), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, i.REPEAT)) : (i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE), i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE)), i.bindTexture(i.TEXTURE_2D, null))
		},
		t.WebGLRenderer.prototype.handleContextLost = function (e) {
			e.preventDefault(),
			this.contextLost = !0
		},
		t.WebGLRenderer.prototype.handleContextRestored = function () {
			try {
				this.gl = this.view.getContext("experimental-webgl", this.options)
			} catch (e) {
				try {
					this.gl = this.view.getContext("webgl", this.options)
				} catch (i) {
					throw new Error(" This browser does not support webGL. Try using the canvas renderer" + this)
				}
			}
			var r = this.gl;
			r.id = t.WebGLRenderer.glContextId++,
			this.shaderManager.setContext(r),
			this.spriteBatch.setContext(r),
			this.maskManager.setContext(r),
			this.filterManager.setContext(r),
			this.renderSession.gl = this.gl,
			r.disable(r.DEPTH_TEST),
			r.disable(r.CULL_FACE),
			r.enable(r.BLEND),
			r.colorMask(!0, !0, !0, this.transparent),
			this.gl.viewport(0, 0, this.width, this.height);
			for (var s in t.TextureCache) {
				var n = t.TextureCache[s].baseTexture;
				n._glTextures = []
			}
			this.contextLost = !1
		},
		t.WebGLRenderer.prototype.destroy = function () {
			this.view.removeEventListener("webglcontextlost", this.contextLost),
			this.view.removeEventListener("webglcontextrestored", this.contextRestoredLost),
			t.glContexts[this.glContextId] = null,
			this.projection = null,
			this.offset = null,
			this.shaderManager.destroy(),
			this.spriteBatch.destroy(),
			this.maskManager.destroy(),
			this.filterManager.destroy(),
			this.shaderManager = null,
			this.spriteBatch = null,
			this.maskManager = null,
			this.filterManager = null,
			this.gl = null,
			this.renderSession = null
		},
		t.WebGLRenderer.glContextId = 0,
		t.WebGLMaskManager = function (e) {
			this.maskStack = [],
			this.maskPosition = 0,
			this.setContext(e)
		},
		t.WebGLMaskManager.prototype.setContext = function (e) {
			this.gl = e
		},
		t.WebGLMaskManager.prototype.pushMask = function (e, i) {
			var r = this.gl;
			0 === this.maskStack.length && (r.enable(r.STENCIL_TEST), r.stencilFunc(r.ALWAYS, 1, 1)),
			this.maskStack.push(e),
			r.colorMask(!1, !1, !1, !0),
			r.stencilOp(r.KEEP, r.KEEP, r.INCR),
			t.WebGLGraphics.renderGraphics(e, i),
			r.colorMask(!0, !0, !0, !0),
			r.stencilFunc(r.NOTEQUAL, 0, this.maskStack.length),
			r.stencilOp(r.KEEP, r.KEEP, r.KEEP)
		},
		t.WebGLMaskManager.prototype.popMask = function (e) {
			var i = this.gl,
			r = this.maskStack.pop();
			r && (i.colorMask(!1, !1, !1, !1), i.stencilOp(i.KEEP, i.KEEP, i.DECR), t.WebGLGraphics.renderGraphics(r, e), i.colorMask(!0, !0, !0, !0), i.stencilFunc(i.NOTEQUAL, 0, this.maskStack.length), i.stencilOp(i.KEEP, i.KEEP, i.KEEP)),
			0 === this.maskStack.length && i.disable(i.STENCIL_TEST)
		},
		t.WebGLMaskManager.prototype.destroy = function () {
			this.maskStack = null,
			this.gl = null
		},
		t.WebGLShaderManager = function (e) {
			this.maxAttibs = 10,
			this.attribState = [],
			this.tempAttribState = [];
			for (var t = 0; t < this.maxAttibs; t++)
				this.attribState[t] = !1;
			this.setContext(e)
		},
		t.WebGLShaderManager.prototype.setContext = function (e) {
			this.gl = e,
			this.primitiveShader = new t.PrimitiveShader(e),
			this.defaultShader = new t.PixiShader(e),
			this.fastShader = new t.PixiFastShader(e),
			this.activateShader(this.defaultShader)
		},
		t.WebGLShaderManager.prototype.setAttribs = function (e) {
			var t;
			for (t = 0; t < this.tempAttribState.length; t++)
				this.tempAttribState[t] = !1;
			for (t = 0; t < e.length; t++) {
				var i = e[t];
				this.tempAttribState[i] = !0
			}
			var r = this.gl;
			for (t = 0; t < this.attribState.length; t++)
				this.attribState[t] !== this.tempAttribState[t] && (this.attribState[t] = this.tempAttribState[t], this.tempAttribState[t] ? r.enableVertexAttribArray(t) : r.disableVertexAttribArray(t))
		},
		t.WebGLShaderManager.prototype.activateShader = function (e) {
			this.currentShader = e,
			this.gl.useProgram(e.program),
			this.setAttribs(e.attributes)
		},
		t.WebGLShaderManager.prototype.activatePrimitiveShader = function () {
			var e = this.gl;
			e.useProgram(this.primitiveShader.program),
			this.setAttribs(this.primitiveShader.attributes)
		},
		t.WebGLShaderManager.prototype.deactivatePrimitiveShader = function () {
			var e = this.gl;
			e.useProgram(this.defaultShader.program),
			this.setAttribs(this.defaultShader.attributes)
		},
		t.WebGLShaderManager.prototype.destroy = function () {
			this.attribState = null,
			this.tempAttribState = null,
			this.primitiveShader.destroy(),
			this.defaultShader.destroy(),
			this.fastShader.destroy(),
			this.gl = null
		},
		t.WebGLSpriteBatch = function (e) {
			this.vertSize = 6,
			this.size = 1e4;
			var t = 4 * this.size * this.vertSize,
			i = 6 * this.size;
			this.vertices = new Float32Array(t),
			this.indices = new Uint16Array(i),
			this.lastIndexCount = 0;
			for (var r = 0, s = 0; i > r; r += 6, s += 4)
				this.indices[r + 0] = s + 0, this.indices[r + 1] = s + 1, this.indices[r + 2] = s + 2, this.indices[r + 3] = s + 0, this.indices[r + 4] = s + 2, this.indices[r + 5] = s + 3;
			this.drawing = !1,
			this.currentBatchSize = 0,
			this.currentBaseTexture = null,
			this.setContext(e)
		},
		t.WebGLSpriteBatch.prototype.setContext = function (e) {
			this.gl = e,
			this.vertexBuffer = e.createBuffer(),
			this.indexBuffer = e.createBuffer(),
			e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indexBuffer),
			e.bufferData(e.ELEMENT_ARRAY_BUFFER, this.indices, e.STATIC_DRAW),
			e.bindBuffer(e.ARRAY_BUFFER, this.vertexBuffer),
			e.bufferData(e.ARRAY_BUFFER, this.vertices, e.DYNAMIC_DRAW),
			this.currentBlendMode = 99999
		},
		t.WebGLSpriteBatch.prototype.begin = function (e) {
			this.renderSession = e,
			this.shader = this.renderSession.shaderManager.defaultShader,
			this.start()
		},
		t.WebGLSpriteBatch.prototype.end = function () {
			this.flush()
		},
		t.WebGLSpriteBatch.prototype.render = function (e) {
			(e.texture.baseTexture !== this.currentBaseTexture || this.currentBatchSize >= this.size) && (this.flush(), this.currentBaseTexture = e.texture.baseTexture),
			e.blendMode !== this.currentBlendMode && this.setBlendMode(e.blendMode);
			var t = e._uvs || e.texture._uvs;
			if (t) {
				var i,
				r,
				s,
				n,
				a = e.worldAlpha,
				o = e.tint,
				h = this.vertices,
				l = e.texture.frame.width,
				u = e.texture.frame.height,
				c = e.anchor.x,
				d = e.anchor.y;
				if (e.texture.trim) {
					var p = e.texture.trim;
					r = p.x - c * p.width,
					i = r + l,
					n = p.y - d * p.height,
					s = n + u
				} else
					i = l * (1 - c), r = l * -c, s = u * (1 - d), n = u * -d;
				var m = 4 * this.currentBatchSize * this.vertSize,
				g = e.worldTransform,
				f = g.a,
				v = g.c,
				y = g.b,
				x = g.d,
				b = g.tx,
				T = g.ty;
				h[m++] = f * r + y * n + b,
				h[m++] = x * n + v * r + T,
				h[m++] = t.x0,
				h[m++] = t.y0,
				h[m++] = a,
				h[m++] = o,
				h[m++] = f * i + y * n + b,
				h[m++] = x * n + v * i + T,
				h[m++] = t.x1,
				h[m++] = t.y1,
				h[m++] = a,
				h[m++] = o,
				h[m++] = f * i + y * s + b,
				h[m++] = x * s + v * i + T,
				h[m++] = t.x2,
				h[m++] = t.y2,
				h[m++] = a,
				h[m++] = o,
				h[m++] = f * r + y * s + b,
				h[m++] = x * s + v * r + T,
				h[m++] = t.x3,
				h[m++] = t.y3,
				h[m++] = a,
				h[m++] = o,
				this.currentBatchSize++
			}
		},
		t.WebGLSpriteBatch.prototype.renderTilingSprite = function (e) {
			var t = e.tilingTexture;
			(t.baseTexture !== this.currentBaseTexture || this.currentBatchSize >= this.size) && (this.flush(), this.currentBaseTexture = t.baseTexture),
			e.blendMode !== this.currentBlendMode && this.setBlendMode(e.blendMode),
			e._uvs || (e._uvs = new Float32Array(8));
			var i = e._uvs;
			e.tilePosition.x %= t.baseTexture.width,
			e.tilePosition.y %= t.baseTexture.height;
			var r = e.tilePosition.x / t.baseTexture.width,
			s = e.tilePosition.y / t.baseTexture.height,
			n = e.width / t.baseTexture.width / (e.tileScale.x * e.tileScaleOffset.x),
			a = e.height / t.baseTexture.height / (e.tileScale.y * e.tileScaleOffset.y);
			i.x0 = 0 - r,
			i.y0 = 0 - s,
			i.x1 = 1 * n - r,
			i.y1 = 0 - s,
			i.x2 = 1 * n - r,
			i.y2 = 1 * a - s,
			i.x3 = 0 - r,
			i.y3 = 1 * a - s;
			var o = e.worldAlpha,
			h = e.tint,
			l = this.vertices,
			u = e.width,
			c = e.height,
			d = e.anchor.x,
			p = e.anchor.y,
			m = u * (1 - d),
			g = u * -d,
			f = c * (1 - p),
			v = c * -p,
			y = 4 * this.currentBatchSize * this.vertSize,
			x = e.worldTransform,
			b = x.a,
			T = x.c,
			w = x.b,
			S = x.d,
			C = x.tx,
			A = x.ty;
			l[y++] = b * g + w * v + C,
			l[y++] = S * v + T * g + A,
			l[y++] = i.x0,
			l[y++] = i.y0,
			l[y++] = o,
			l[y++] = h,
			l[y++] = b * m + w * v + C,
			l[y++] = S * v + T * m + A,
			l[y++] = i.x1,
			l[y++] = i.y1,
			l[y++] = o,
			l[y++] = h,
			l[y++] = b * m + w * f + C,
			l[y++] = S * f + T * m + A,
			l[y++] = i.x2,
			l[y++] = i.y2,
			l[y++] = o,
			l[y++] = h,
			l[y++] = b * g + w * f + C,
			l[y++] = S * f + T * g + A,
			l[y++] = i.x3,
			l[y++] = i.y3,
			l[y++] = o,
			l[y++] = h,
			this.currentBatchSize++
		},
		t.WebGLSpriteBatch.prototype.flush = function () {
			if (0 !== this.currentBatchSize) {
				var e = this.gl;
				if (e.bindTexture(e.TEXTURE_2D, this.currentBaseTexture._glTextures[e.id] || t.createWebGLTexture(this.currentBaseTexture, e)), this.currentBatchSize > .5 * this.size)
					e.bufferSubData(e.ARRAY_BUFFER, 0, this.vertices);
				else {
					var i = this.vertices.subarray(0, 4 * this.currentBatchSize * this.vertSize);
					e.bufferSubData(e.ARRAY_BUFFER, 0, i)
				}
				e.drawElements(e.TRIANGLES, 6 * this.currentBatchSize, e.UNSIGNED_SHORT, 0),
				this.currentBatchSize = 0,
				this.renderSession.drawCount++
			}
		},
		t.WebGLSpriteBatch.prototype.stop = function () {
			this.flush()
		},
		t.WebGLSpriteBatch.prototype.start = function () {
			var e = this.gl;
			e.activeTexture(e.TEXTURE0),
			e.bindBuffer(e.ARRAY_BUFFER, this.vertexBuffer),
			e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
			var i = this.renderSession.projection;
			e.uniform2f(this.shader.projectionVector, i.x, i.y);
			var r = 4 * this.vertSize;
			e.vertexAttribPointer(this.shader.aVertexPosition, 2, e.FLOAT, !1, r, 0),
			e.vertexAttribPointer(this.shader.aTextureCoord, 2, e.FLOAT, !1, r, 8),
			e.vertexAttribPointer(this.shader.colorAttribute, 2, e.FLOAT, !1, r, 16),
			this.currentBlendMode !== t.blendModes.NORMAL && this.setBlendMode(t.blendModes.NORMAL)
		},
		t.WebGLSpriteBatch.prototype.setBlendMode = function (e) {
			this.flush(),
			this.currentBlendMode = e;
			var i = t.blendModesWebGL[this.currentBlendMode];
			this.gl.blendFunc(i[0], i[1])
		},
		t.WebGLSpriteBatch.prototype.destroy = function () {
			this.vertices = null,
			this.indices = null,
			this.gl.deleteBuffer(this.vertexBuffer),
			this.gl.deleteBuffer(this.indexBuffer),
			this.currentBaseTexture = null,
			this.gl = null
		},
		t.WebGLFastSpriteBatch = function (e) {
			this.vertSize = 10,
			this.maxSize = 6e3,
			this.size = this.maxSize;
			var t = 4 * this.size * this.vertSize,
			i = 6 * this.maxSize;
			this.vertices = new Float32Array(t),
			this.indices = new Uint16Array(i),
			this.vertexBuffer = null,
			this.indexBuffer = null,
			this.lastIndexCount = 0;
			for (var r = 0, s = 0; i > r; r += 6, s += 4)
				this.indices[r + 0] = s + 0, this.indices[r + 1] = s + 1, this.indices[r + 2] = s + 2, this.indices[r + 3] = s + 0, this.indices[r + 4] = s + 2, this.indices[r + 5] = s + 3;
			this.drawing = !1,
			this.currentBatchSize = 0,
			this.currentBaseTexture = null,
			this.currentBlendMode = 0,
			this.renderSession = null,
			this.shader = null,
			this.matrix = null,
			this.setContext(e)
		},
		t.WebGLFastSpriteBatch.prototype.setContext = function (e) {
			this.gl = e,
			this.vertexBuffer = e.createBuffer(),
			this.indexBuffer = e.createBuffer(),
			e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indexBuffer),
			e.bufferData(e.ELEMENT_ARRAY_BUFFER, this.indices, e.STATIC_DRAW),
			e.bindBuffer(e.ARRAY_BUFFER, this.vertexBuffer),
			e.bufferData(e.ARRAY_BUFFER, this.vertices, e.DYNAMIC_DRAW),
			this.currentBlendMode = 99999
		},
		t.WebGLFastSpriteBatch.prototype.begin = function (e, t) {
			this.renderSession = t,
			this.shader = this.renderSession.shaderManager.fastShader,
			this.matrix = e.worldTransform.toArray(!0),
			this.start()
		},
		t.WebGLFastSpriteBatch.prototype.end = function () {
			this.flush()
		},
		t.WebGLFastSpriteBatch.prototype.render = function (e) {
			var t = e.children,
			i = t[0];
			if (i.texture._uvs) {
				this.currentBaseTexture = i.texture.baseTexture,
				i.blendMode !== this.currentBlendMode && this.setBlendMode(i.blendMode);
				for (var r = 0, s = t.length; s > r; r++)
					this.renderSprite(t[r]);
				this.flush()
			}
		},
		t.WebGLFastSpriteBatch.prototype.renderSprite = function (e) {
			if (e.texture.baseTexture === this.currentBaseTexture || (this.flush(), this.currentBaseTexture = e.texture.baseTexture, e.texture._uvs)) {
				var t,
				i,
				r,
				s,
				n,
				a,
				o,
				h,
				l = this.vertices;
				if (t = e.texture._uvs, i = e.texture.frame.width, r = e.texture.frame.height, e.texture.trim) {
					var u = e.texture.trim;
					n = u.x - e.anchor.x * u.width,
					s = n + e.texture.frame.width,
					o = u.y - e.anchor.y * u.height,
					a = o + e.texture.frame.height
				} else
					s = e.texture.frame.width * (1 - e.anchor.x), n = e.texture.frame.width * -e.anchor.x, a = e.texture.frame.height * (1 - e.anchor.y), o = e.texture.frame.height * -e.anchor.y;
				h = 4 * this.currentBatchSize * this.vertSize,
				l[h++] = n,
				l[h++] = o,
				l[h++] = e.position.x,
				l[h++] = e.position.y,
				l[h++] = e.scale.x,
				l[h++] = e.scale.y,
				l[h++] = e.rotation,
				l[h++] = t.x0,
				l[h++] = t.y1,
				l[h++] = e.alpha,
				l[h++] = s,
				l[h++] = o,
				l[h++] = e.position.x,
				l[h++] = e.position.y,
				l[h++] = e.scale.x,
				l[h++] = e.scale.y,
				l[h++] = e.rotation,
				l[h++] = t.x1,
				l[h++] = t.y1,
				l[h++] = e.alpha,
				l[h++] = s,
				l[h++] = a,
				l[h++] = e.position.x,
				l[h++] = e.position.y,
				l[h++] = e.scale.x,
				l[h++] = e.scale.y,
				l[h++] = e.rotation,
				l[h++] = t.x2,
				l[h++] = t.y2,
				l[h++] = e.alpha,
				l[h++] = n,
				l[h++] = a,
				l[h++] = e.position.x,
				l[h++] = e.position.y,
				l[h++] = e.scale.x,
				l[h++] = e.scale.y,
				l[h++] = e.rotation,
				l[h++] = t.x3,
				l[h++] = t.y3,
				l[h++] = e.alpha,
				this.currentBatchSize++,
				this.currentBatchSize >= this.size && this.flush()
			}
		},
		t.WebGLFastSpriteBatch.prototype.flush = function () {
			if (0 !== this.currentBatchSize) {
				var e = this.gl;
				if (this.currentBaseTexture._glTextures[e.id] || t.createWebGLTexture(this.currentBaseTexture, e), e.bindTexture(e.TEXTURE_2D, this.currentBaseTexture._glTextures[e.id]), this.currentBatchSize > .5 * this.size)
					e.bufferSubData(e.ARRAY_BUFFER, 0, this.vertices);
				else {
					var i = this.vertices.subarray(0, 4 * this.currentBatchSize * this.vertSize);
					e.bufferSubData(e.ARRAY_BUFFER, 0, i)
				}
				e.drawElements(e.TRIANGLES, 6 * this.currentBatchSize, e.UNSIGNED_SHORT, 0),
				this.currentBatchSize = 0,
				this.renderSession.drawCount++
			}
		},
		t.WebGLFastSpriteBatch.prototype.stop = function () {
			this.flush()
		},
		t.WebGLFastSpriteBatch.prototype.start = function () {
			var e = this.gl;
			e.activeTexture(e.TEXTURE0),
			e.bindBuffer(e.ARRAY_BUFFER, this.vertexBuffer),
			e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
			var i = this.renderSession.projection;
			e.uniform2f(this.shader.projectionVector, i.x, i.y),
			e.uniformMatrix3fv(this.shader.uMatrix, !1, this.matrix);
			var r = 4 * this.vertSize;
			e.vertexAttribPointer(this.shader.aVertexPosition, 2, e.FLOAT, !1, r, 0),
			e.vertexAttribPointer(this.shader.aPositionCoord, 2, e.FLOAT, !1, r, 8),
			e.vertexAttribPointer(this.shader.aScale, 2, e.FLOAT, !1, r, 16),
			e.vertexAttribPointer(this.shader.aRotation, 1, e.FLOAT, !1, r, 24),
			e.vertexAttribPointer(this.shader.aTextureCoord, 2, e.FLOAT, !1, r, 28),
			e.vertexAttribPointer(this.shader.colorAttribute, 1, e.FLOAT, !1, r, 36),
			this.currentBlendMode !== t.blendModes.NORMAL && this.setBlendMode(t.blendModes.NORMAL)
		},
		t.WebGLFastSpriteBatch.prototype.setBlendMode = function (e) {
			this.flush(),
			this.currentBlendMode = e;
			var i = t.blendModesWebGL[this.currentBlendMode];
			this.gl.blendFunc(i[0], i[1])
		},
		t.WebGLFilterManager = function (e, t) {
			this.transparent = t,
			this.filterStack = [],
			this.offsetX = 0,
			this.offsetY = 0,
			this.setContext(e)
		},
		t.WebGLFilterManager.prototype.setContext = function (e) {
			this.gl = e,
			this.texturePool = [],
			this.initShaderBuffers()
		},
		t.WebGLFilterManager.prototype.begin = function (e, t) {
			this.renderSession = e,
			this.defaultShader = e.shaderManager.defaultShader;
			var i = this.renderSession.projection;
			this.width = 2 * i.x,
			this.height = 2 * -i.y,
			this.buffer = t
		},
		t.WebGLFilterManager.prototype.pushFilter = function (e) {
			var i = this.gl,
			r = this.renderSession.projection,
			s = this.renderSession.offset;
			this.filterStack.push(e);
			var n = e.filterPasses[0];
			this.offsetX += e.target.filterArea.x,
			this.offsetY += e.target.filterArea.y;
			var a = this.texturePool.pop();
			a ? a.resize(this.width, this.height) : a = new t.FilterTexture(this.gl, this.width, this.height),
			i.bindTexture(i.TEXTURE_2D, a.texture),
			e.target.filterArea = e.target.getBounds();
			var o = e.target.filterArea,
			h = n.padding;
			o.x -= h,
			o.y -= h,
			o.width += 2 * h,
			o.height += 2 * h,
			o.x < 0 && (o.x = 0),
			o.width > this.width && (o.width = this.width),
			o.y < 0 && (o.y = 0),
			o.height > this.height && (o.height = this.height),
			i.bindFramebuffer(i.FRAMEBUFFER, a.frameBuffer),
			i.viewport(0, 0, o.width, o.height),
			r.x = o.width / 2,
			r.y = -o.height / 2,
			s.x = -o.x,
			s.y = -o.y,
			i.uniform2f(this.defaultShader.projectionVector, o.width / 2, -o.height / 2),
			i.uniform2f(this.defaultShader.offsetVector, -o.x, -o.y),
			i.colorMask(!0, !0, !0, !0),
			i.clearColor(0, 0, 0, 0),
			i.clear(i.COLOR_BUFFER_BIT),
			e._glFilterTexture = a
		},
		t.WebGLFilterManager.prototype.popFilter = function () {
			var e = this.gl,
			i = this.filterStack.pop(),
			r = i.target.filterArea,
			s = i._glFilterTexture,
			n = this.renderSession.projection,
			a = this.renderSession.offset;
			if (i.filterPasses.length > 1) {
				e.viewport(0, 0, r.width, r.height),
				e.bindBuffer(e.ARRAY_BUFFER, this.vertexBuffer),
				this.vertexArray[0] = 0,
				this.vertexArray[1] = r.height,
				this.vertexArray[2] = r.width,
				this.vertexArray[3] = r.height,
				this.vertexArray[4] = 0,
				this.vertexArray[5] = 0,
				this.vertexArray[6] = r.width,
				this.vertexArray[7] = 0,
				e.bufferSubData(e.ARRAY_BUFFER, 0, this.vertexArray),
				e.bindBuffer(e.ARRAY_BUFFER, this.uvBuffer),
				this.uvArray[2] = r.width / this.width,
				this.uvArray[5] = r.height / this.height,
				this.uvArray[6] = r.width / this.width,
				this.uvArray[7] = r.height / this.height,
				e.bufferSubData(e.ARRAY_BUFFER, 0, this.uvArray);
				var o = s,
				h = this.texturePool.pop();
				h || (h = new t.FilterTexture(this.gl, this.width, this.height)),
				e.bindFramebuffer(e.FRAMEBUFFER, h.frameBuffer),
				e.clear(e.COLOR_BUFFER_BIT),
				e.disable(e.BLEND);
				for (var l = 0; l < i.filterPasses.length - 1; l++) {
					var u = i.filterPasses[l];
					e.bindFramebuffer(e.FRAMEBUFFER, h.frameBuffer),
					e.activeTexture(e.TEXTURE0),
					e.bindTexture(e.TEXTURE_2D, o.texture),
					this.applyFilterPass(u, r, r.width, r.height);
					var c = o;
					o = h,
					h = c
				}
				e.enable(e.BLEND),
				s = o,
				this.texturePool.push(h)
			}
			var d = i.filterPasses[i.filterPasses.length - 1];
			this.offsetX -= r.x,
			this.offsetY -= r.y;
			var p = this.width,
			m = this.height,
			g = 0,
			f = 0,
			v = this.buffer;
			if (0 === this.filterStack.length)
				e.colorMask(!0, !0, !0, this.transparent);
			else {
				var y = this.filterStack[this.filterStack.length - 1];
				r = y.target.filterArea,
				p = r.width,
				m = r.height,
				g = r.x,
				f = r.y,
				v = y._glFilterTexture.frameBuffer
			}
			n.x = p / 2,
			n.y = -m / 2,
			a.x = g,
			a.y = f,
			r = i.target.filterArea;
			var x = r.x - g,
			b = r.y - f;
			e.bindBuffer(e.ARRAY_BUFFER, this.vertexBuffer),
			this.vertexArray[0] = x,
			this.vertexArray[1] = b + r.height,
			this.vertexArray[2] = x + r.width,
			this.vertexArray[3] = b + r.height,
			this.vertexArray[4] = x,
			this.vertexArray[5] = b,
			this.vertexArray[6] = x + r.width,
			this.vertexArray[7] = b,
			e.bufferSubData(e.ARRAY_BUFFER, 0, this.vertexArray),
			e.bindBuffer(e.ARRAY_BUFFER, this.uvBuffer),
			this.uvArray[2] = r.width / this.width,
			this.uvArray[5] = r.height / this.height,
			this.uvArray[6] = r.width / this.width,
			this.uvArray[7] = r.height / this.height,
			e.bufferSubData(e.ARRAY_BUFFER, 0, this.uvArray),
			e.viewport(0, 0, p, m),
			e.bindFramebuffer(e.FRAMEBUFFER, v),
			e.activeTexture(e.TEXTURE0),
			e.bindTexture(e.TEXTURE_2D, s.texture),
			this.applyFilterPass(d, r, p, m),
			e.useProgram(this.defaultShader.program),
			e.uniform2f(this.defaultShader.projectionVector, p / 2, -m / 2),
			e.uniform2f(this.defaultShader.offsetVector, -g, -f),
			this.texturePool.push(s),
			i._glFilterTexture = null
		},
		t.WebGLFilterManager.prototype.applyFilterPass = function (e, i, r, s) {
			var n = this.gl,
			a = e.shaders[n.id];
			a || (a = new t.PixiShader(n), a.fragmentSrc = e.fragmentSrc, a.uniforms = e.uniforms, a.init(), e.shaders[n.id] = a),
			n.useProgram(a.program),
			n.uniform2f(a.projectionVector, r / 2, -s / 2),
			n.uniform2f(a.offsetVector, 0, 0),
			e.uniforms.dimensions && (e.uniforms.dimensions.value[0] = this.width, e.uniforms.dimensions.value[1] = this.height, e.uniforms.dimensions.value[2] = this.vertexArray[0], e.uniforms.dimensions.value[3] = this.vertexArray[5]),
			a.syncUniforms(),
			n.bindBuffer(n.ARRAY_BUFFER, this.vertexBuffer),
			n.vertexAttribPointer(a.aVertexPosition, 2, n.FLOAT, !1, 0, 0),
			n.bindBuffer(n.ARRAY_BUFFER, this.uvBuffer),
			n.vertexAttribPointer(a.aTextureCoord, 2, n.FLOAT, !1, 0, 0),
			n.bindBuffer(n.ARRAY_BUFFER, this.colorBuffer),
			n.vertexAttribPointer(a.colorAttribute, 2, n.FLOAT, !1, 0, 0),
			n.bindBuffer(n.ELEMENT_ARRAY_BUFFER, this.indexBuffer),
			n.drawElements(n.TRIANGLES, 6, n.UNSIGNED_SHORT, 0),
			this.renderSession.drawCount++
		},
		t.WebGLFilterManager.prototype.initShaderBuffers = function () {
			var e = this.gl;
			this.vertexBuffer = e.createBuffer(),
			this.uvBuffer = e.createBuffer(),
			this.colorBuffer = e.createBuffer(),
			this.indexBuffer = e.createBuffer(),
			this.vertexArray = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
			e.bindBuffer(e.ARRAY_BUFFER, this.vertexBuffer),
			e.bufferData(e.ARRAY_BUFFER, this.vertexArray, e.STATIC_DRAW),
			this.uvArray = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
			e.bindBuffer(e.ARRAY_BUFFER, this.uvBuffer),
			e.bufferData(e.ARRAY_BUFFER, this.uvArray, e.STATIC_DRAW),
			this.colorArray = new Float32Array([1, 16777215, 1, 16777215, 1, 16777215, 1, 16777215]),
			e.bindBuffer(e.ARRAY_BUFFER, this.colorBuffer),
			e.bufferData(e.ARRAY_BUFFER, this.colorArray, e.STATIC_DRAW),
			e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, this.indexBuffer),
			e.bufferData(e.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 1, 3, 2]), e.STATIC_DRAW)
		},
		t.WebGLFilterManager.prototype.destroy = function () {
			var e = this.gl;
			this.filterStack = null,
			this.offsetX = 0,
			this.offsetY = 0;
			for (var t = 0; t < this.texturePool.length; t++)
				this.texturePool.destroy();
			this.texturePool = null,
			e.deleteBuffer(this.vertexBuffer),
			e.deleteBuffer(this.uvBuffer),
			e.deleteBuffer(this.colorBuffer),
			e.deleteBuffer(this.indexBuffer)
		},
		t.FilterTexture = function (e, t, i) {
			this.gl = e,
			this.frameBuffer = e.createFramebuffer(),
			this.texture = e.createTexture(),
			e.bindTexture(e.TEXTURE_2D, this.texture),
			e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR),
			e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR),
			e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE),
			e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE),
			e.bindFramebuffer(e.FRAMEBUFFER, this.framebuffer),
			e.bindFramebuffer(e.FRAMEBUFFER, this.frameBuffer),
			e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, this.texture, 0),
			this.resize(t, i)
		},
		t.FilterTexture.prototype.clear = function () {
			var e = this.gl;
			e.clearColor(0, 0, 0, 0),
			e.clear(e.COLOR_BUFFER_BIT)
		},
		t.FilterTexture.prototype.resize = function (e, t) {
			if (this.width !== e || this.height !== t) {
				this.width = e,
				this.height = t;
				var i = this.gl;
				i.bindTexture(i.TEXTURE_2D, this.texture),
				i.texImage2D(i.TEXTURE_2D, 0, i.RGBA, e, t, 0, i.RGBA, i.UNSIGNED_BYTE, null)
			}
		},
		t.FilterTexture.prototype.destroy = function () {
			var e = this.gl;
			e.deleteFramebuffer(this.frameBuffer),
			e.deleteTexture(this.texture),
			this.frameBuffer = null,
			this.texture = null
		},
		t.CanvasMaskManager = function () {},
		t.CanvasMaskManager.prototype.pushMask = function (e, i) {
			i.save();
			var r = e.alpha,
			s = e.worldTransform;
			i.setTransform(s.a, s.c, s.b, s.d, s.tx, s.ty),
			t.CanvasGraphics.renderGraphicsMask(e, i),
			i.clip(),
			e.worldAlpha = r
		},
		t.CanvasMaskManager.prototype.popMask = function (e) {
			e.restore()
		},
		t.CanvasTinter = function () {},
		t.CanvasTinter.getTintedTexture = function (e, i) {
			var r = e.texture;
			i = t.CanvasTinter.roundColor(i);
			var s = "#" + ("00000" + (0 | i).toString(16)).substr(-6);
			if (r.tintCache = r.tintCache || {}, r.tintCache[s])
				return r.tintCache[s];
			var n = t.CanvasTinter.canvas || document.createElement("canvas");
			if (t.CanvasTinter.tintMethod(r, i, n), t.CanvasTinter.convertTintToImage) {
				var a = new Image;
				a.src = n.toDataURL(),
				r.tintCache[s] = a
			} else
				r.tintCache[s] = n, t.CanvasTinter.canvas = null;
			return n
		},
		t.CanvasTinter.tintWithMultiply = function (e, t, i) {
			var r = i.getContext("2d"),
			s = e.frame;
			i.width = s.width,
			i.height = s.height,
			r.fillStyle = "#" + ("00000" + (0 | t).toString(16)).substr(-6),
			r.fillRect(0, 0, s.width, s.height),
			r.globalCompositeOperation = "multiply",
			r.drawImage(e.baseTexture.source, s.x, s.y, s.width, s.height, 0, 0, s.width, s.height),
			r.globalCompositeOperation = "destination-atop",
			r.drawImage(e.baseTexture.source, s.x, s.y, s.width, s.height, 0, 0, s.width, s.height)
		},
		t.CanvasTinter.tintWithOverlay = function (e, t, i) {
			var r = i.getContext("2d"),
			s = e.frame;
			i.width = s.width,
			i.height = s.height,
			r.globalCompositeOperation = "copy",
			r.fillStyle = "#" + ("00000" + (0 | t).toString(16)).substr(-6),
			r.fillRect(0, 0, s.width, s.height),
			r.globalCompositeOperation = "destination-atop",
			r.drawImage(e.baseTexture.source, s.x, s.y, s.width, s.height, 0, 0, s.width, s.height)
		},
		t.CanvasTinter.tintWithPerPixel = function (e, i, r) {
			var s = r.getContext("2d"),
			n = e.frame;
			r.width = n.width,
			r.height = n.height,
			s.globalCompositeOperation = "copy",
			s.drawImage(e.baseTexture.source, n.x, n.y, n.width, n.height, 0, 0, n.width, n.height);
			for (var a = t.hex2rgb(i), o = a[0], h = a[1], l = a[2], u = s.getImageData(0, 0, n.width, n.height), c = u.data, d = 0; d < c.length; d += 4)
				c[d + 0] *= o, c[d + 1] *= h, c[d + 2] *= l;
			s.putImageData(u, 0, 0)
		},
		t.CanvasTinter.roundColor = function (e) {
			var i = t.CanvasTinter.cacheStepsPerColorChannel,
			r = t.hex2rgb(e);
			return r[0] = Math.min(255, r[0] / i * i),
			r[1] = Math.min(255, r[1] / i * i),
			r[2] = Math.min(255, r[2] / i * i),
			t.rgb2hex(r)
		},
		t.CanvasTinter.cacheStepsPerColorChannel = 8,
		t.CanvasTinter.convertTintToImage = !1,
		t.CanvasTinter.canUseMultiply = t.canUseNewCanvasBlendModes(),
		t.CanvasTinter.tintMethod = t.CanvasTinter.canUseMultiply ? t.CanvasTinter.tintWithMultiply : t.CanvasTinter.tintWithPerPixel,
		t.CanvasRenderer = function (e, i, r, s) {
			t.defaultRenderer = t.defaultRenderer || this,
			this.type = t.CANVAS_RENDERER,
			this.clearBeforeRender = !0,
			this.roundPixels = !1,
			this.transparent = !!s,
			t.blendModesCanvas || (t.blendModesCanvas = [], t.canUseNewCanvasBlendModes() ? (t.blendModesCanvas[t.blendModes.NORMAL] = "source-over", t.blendModesCanvas[t.blendModes.ADD] = "lighter", t.blendModesCanvas[t.blendModes.MULTIPLY] = "multiply", t.blendModesCanvas[t.blendModes.SCREEN] = "screen", t.blendModesCanvas[t.blendModes.OVERLAY] = "overlay", t.blendModesCanvas[t.blendModes.DARKEN] = "darken", t.blendModesCanvas[t.blendModes.LIGHTEN] = "lighten", t.blendModesCanvas[t.blendModes.COLOR_DODGE] = "color-dodge", t.blendModesCanvas[t.blendModes.COLOR_BURN] = "color-burn", t.blendModesCanvas[t.blendModes.HARD_LIGHT] = "hard-light", t.blendModesCanvas[t.blendModes.SOFT_LIGHT] = "soft-light", t.blendModesCanvas[t.blendModes.DIFFERENCE] = "difference", t.blendModesCanvas[t.blendModes.EXCLUSION] = "exclusion", t.blendModesCanvas[t.blendModes.HUE] = "hue", t.blendModesCanvas[t.blendModes.SATURATION] = "saturation", t.blendModesCanvas[t.blendModes.COLOR] = "color", t.blendModesCanvas[t.blendModes.LUMINOSITY] = "luminosity") : (t.blendModesCanvas[t.blendModes.NORMAL] = "source-over", t.blendModesCanvas[t.blendModes.ADD] = "lighter", t.blendModesCanvas[t.blendModes.MULTIPLY] = "source-over", t.blendModesCanvas[t.blendModes.SCREEN] = "source-over", t.blendModesCanvas[t.blendModes.OVERLAY] = "source-over", t.blendModesCanvas[t.blendModes.DARKEN] = "source-over", t.blendModesCanvas[t.blendModes.LIGHTEN] = "source-over", t.blendModesCanvas[t.blendModes.COLOR_DODGE] = "source-over", t.blendModesCanvas[t.blendModes.COLOR_BURN] = "source-over", t.blendModesCanvas[t.blendModes.HARD_LIGHT] = "source-over", t.blendModesCanvas[t.blendModes.SOFT_LIGHT] = "source-over", t.blendModesCanvas[t.blendModes.DIFFERENCE] = "source-over", t.blendModesCanvas[t.blendModes.EXCLUSION] = "source-over", t.blendModesCanvas[t.blendModes.HUE] = "source-over", t.blendModesCanvas[t.blendModes.SATURATION] = "source-over", t.blendModesCanvas[t.blendModes.COLOR] = "source-over", t.blendModesCanvas[t.blendModes.LUMINOSITY] = "source-over")),
			this.width = e || 800,
			this.height = i || 600,
			this.view = r || document.createElement("canvas"),
			this.context = this.view.getContext("2d", {
					alpha : this.transparent
				}),
			this.refresh = !0,
			this.view.width = this.width,
			this.view.height = this.height,
			this.count = 0,
			this.maskManager = new t.CanvasMaskManager,
			this.renderSession = {
				context : this.context,
				maskManager : this.maskManager,
				scaleMode : null,
				smoothProperty : null
			},
			"imageSmoothingEnabled" in this.context ? this.renderSession.smoothProperty = "imageSmoothingEnabled" : "webkitImageSmoothingEnabled" in this.context ? this.renderSession.smoothProperty = "webkitImageSmoothingEnabled" : "mozImageSmoothingEnabled" in this.context ? this.renderSession.smoothProperty = "mozImageSmoothingEnabled" : "oImageSmoothingEnabled" in this.context && (this.renderSession.smoothProperty = "oImageSmoothingEnabled")
		},
		t.CanvasRenderer.prototype.constructor = t.CanvasRenderer,
		t.CanvasRenderer.prototype.render = function (e) {
			t.texturesToUpdate.length = 0,
			t.texturesToDestroy.length = 0,
			e.updateTransform(),
			this.context.setTransform(1, 0, 0, 1, 0, 0),
			this.context.globalAlpha = 1,
			!this.transparent && this.clearBeforeRender ? (this.context.fillStyle = e.backgroundColorString, this.context.fillRect(0, 0, this.width, this.height)) : this.transparent && this.clearBeforeRender && this.context.clearRect(0, 0, this.width, this.height),
			this.renderDisplayObject(e),
			e.interactive && (e._interactiveEventsAdded || (e._interactiveEventsAdded = !0, e.interactionManager.setTarget(this))),
			t.Texture.frameUpdates.length > 0 && (t.Texture.frameUpdates.length = 0)
		},
		t.CanvasRenderer.prototype.resize = function (e, t) {
			this.width = e,
			this.height = t,
			this.view.width = e,
			this.view.height = t
		},
		t.CanvasRenderer.prototype.renderDisplayObject = function (e, t) {
			this.renderSession.context = t || this.context,
			e._renderCanvas(this.renderSession)
		},
		t.CanvasRenderer.prototype.renderStripFlat = function (e) {
			var t = this.context,
			i = e.verticies,
			r = i.length / 2;
			this.count++,
			t.beginPath();
			for (var s = 1; r - 2 > s; s++) {
				var n = 2 * s,
				a = i[n],
				o = i[n + 2],
				h = i[n + 4],
				l = i[n + 1],
				u = i[n + 3],
				c = i[n + 5];
				t.moveTo(a, l),
				t.lineTo(o, u),
				t.lineTo(h, c)
			}
			t.fillStyle = "#FF0000",
			t.fill(),
			t.closePath()
		},
		t.CanvasRenderer.prototype.renderStrip = function (e) {
			var t = this.context,
			i = e.verticies,
			r = e.uvs,
			s = i.length / 2;
			this.count++;
			for (var n = 1; s - 2 > n; n++) {
				var a = 2 * n,
				o = i[a],
				h = i[a + 2],
				l = i[a + 4],
				u = i[a + 1],
				c = i[a + 3],
				d = i[a + 5],
				p = r[a] * e.texture.width,
				m = r[a + 2] * e.texture.width,
				g = r[a + 4] * e.texture.width,
				f = r[a + 1] * e.texture.height,
				v = r[a + 3] * e.texture.height,
				y = r[a + 5] * e.texture.height;
				t.save(),
				t.beginPath(),
				t.moveTo(o, u),
				t.lineTo(h, c),
				t.lineTo(l, d),
				t.closePath(),
				t.clip();
				var x = p * v + f * g + m * y - v * g - f * m - p * y,
				b = o * v + f * l + h * y - v * l - f * h - o * y,
				T = p * h + o * g + m * l - h * g - o * m - p * l,
				w = p * v * l + f * h * g + o * m * y - o * v * g - f * m * l - p * h * y,
				S = u * v + f * d + c * y - v * d - f * c - u * y,
				C = p * c + u * g + m * d - c * g - u * m - p * d,
				A = p * v * d + f * c * g + u * m * y - u * v * g - f * m * d - p * c * y;
				t.transform(b / x, S / x, T / x, C / x, w / x, A / x),
				t.drawImage(e.texture.baseTexture.source, 0, 0),
				t.restore()
			}
		},
		t.CanvasBuffer = function (e, t) {
			this.width = e,
			this.height = t,
			this.canvas = document.createElement("canvas"),
			this.context = this.canvas.getContext("2d"),
			this.canvas.width = e,
			this.canvas.height = t
		},
		t.CanvasBuffer.prototype.clear = function () {
			this.context.clearRect(0, 0, this.width, this.height)
		},
		t.CanvasBuffer.prototype.resize = function (e, t) {
			this.width = this.canvas.width = e,
			this.height = this.canvas.height = t
		},
		t.CanvasGraphics = function () {},
		t.CanvasGraphics.renderGraphics = function (e, i) {
			for (var r = e.worldAlpha, s = "", n = 0; n < e.graphicsData.length; n++) {
				var a = e.graphicsData[n],
				o = a.points;
				if (i.strokeStyle = s = "#" + ("00000" + (0 | a.lineColor).toString(16)).substr(-6), i.lineWidth = a.lineWidth, a.type === t.Graphics.POLY) {
					i.beginPath(),
					i.moveTo(o[0], o[1]);
					for (var h = 1; h < o.length / 2; h++)
						i.lineTo(o[2 * h], o[2 * h + 1]);
					o[0] === o[o.length - 2] && o[1] === o[o.length - 1] && i.closePath(),
					a.fill && (i.globalAlpha = a.fillAlpha * r, i.fillStyle = s = "#" + ("00000" + (0 | a.fillColor).toString(16)).substr(-6), i.fill()),
					a.lineWidth && (i.globalAlpha = a.lineAlpha * r, i.stroke())
				} else if (a.type === t.Graphics.RECT)
					(a.fillColor || 0 === a.fillColor) && (i.globalAlpha = a.fillAlpha * r, i.fillStyle = s = "#" + ("00000" + (0 | a.fillColor).toString(16)).substr(-6), i.fillRect(o[0], o[1], o[2], o[3])), a.lineWidth && (i.globalAlpha = a.lineAlpha * r, i.strokeRect(o[0], o[1], o[2], o[3]));
				else if (a.type === t.Graphics.CIRC)
					i.beginPath(), i.arc(o[0], o[1], o[2], 0, 2 * Math.PI), i.closePath(), a.fill && (i.globalAlpha = a.fillAlpha * r, i.fillStyle = s = "#" + ("00000" + (0 | a.fillColor).toString(16)).substr(-6), i.fill()), a.lineWidth && (i.globalAlpha = a.lineAlpha * r, i.stroke());
				else if (a.type === t.Graphics.ELIP) {
					var l = a.points,
					u = 2 * l[2],
					c = 2 * l[3],
					d = l[0] - u / 2,
					p = l[1] - c / 2;
					i.beginPath();
					var m = .5522848,
					g = u / 2 * m,
					f = c / 2 * m,
					v = d + u,
					y = p + c,
					x = d + u / 2,
					b = p + c / 2;
					i.moveTo(d, b),
					i.bezierCurveTo(d, b - f, x - g, p, x, p),
					i.bezierCurveTo(x + g, p, v, b - f, v, b),
					i.bezierCurveTo(v, b + f, x + g, y, x, y),
					i.bezierCurveTo(x - g, y, d, b + f, d, b),
					i.closePath(),
					a.fill && (i.globalAlpha = a.fillAlpha * r, i.fillStyle = s = "#" + ("00000" + (0 | a.fillColor).toString(16)).substr(-6), i.fill()),
					a.lineWidth && (i.globalAlpha = a.lineAlpha * r, i.stroke())
				}
			}
		},
		t.CanvasGraphics.renderGraphicsMask = function (e, i) {
			var r = e.graphicsData.length;
			if (0 !== r) {
				r > 1 && (r = 1, window.console.log("Pixi.js warning: masks in canvas can only mask using the first path in the graphics object"));
				for (var s = 0; 1 > s; s++) {
					var n = e.graphicsData[s],
					a = n.points;
					if (n.type === t.Graphics.POLY) {
						i.beginPath(),
						i.moveTo(a[0], a[1]);
						for (var o = 1; o < a.length / 2; o++)
							i.lineTo(a[2 * o], a[2 * o + 1]);
						a[0] === a[a.length - 2] && a[1] === a[a.length - 1] && i.closePath()
					} else if (n.type === t.Graphics.RECT)
						i.beginPath(), i.rect(a[0], a[1], a[2], a[3]), i.closePath();
					else if (n.type === t.Graphics.CIRC)
						i.beginPath(), i.arc(a[0], a[1], a[2], 0, 2 * Math.PI), i.closePath();
					else if (n.type === t.Graphics.ELIP) {
						var h = n.points,
						l = 2 * h[2],
						u = 2 * h[3],
						c = h[0] - l / 2,
						d = h[1] - u / 2;
						i.beginPath();
						var p = .5522848,
						m = l / 2 * p,
						g = u / 2 * p,
						f = c + l,
						v = d + u,
						y = c + l / 2,
						x = d + u / 2;
						i.moveTo(c, x),
						i.bezierCurveTo(c, x - g, y - m, d, y, d),
						i.bezierCurveTo(y + m, d, f, x - g, f, x),
						i.bezierCurveTo(f, x + g, y + m, v, y, v),
						i.bezierCurveTo(y - m, v, c, x + g, c, x),
						i.closePath()
					}
				}
			}
		},
		t.Graphics = function () {
			t.DisplayObjectContainer.call(this),
			this.renderable = !0,
			this.fillAlpha = 1,
			this.lineWidth = 0,
			this.lineColor = "black",
			this.graphicsData = [],
			this.tint = 16777215,
			this.blendMode = t.blendModes.NORMAL,
			this.currentPath = {
				points : []
			},
			this._webGL = [],
			this.isMask = !1,
			this.bounds = null,
			this.boundsPadding = 10
		},
		t.Graphics.prototype = Object.create(t.DisplayObjectContainer.prototype),
		t.Graphics.prototype.constructor = t.Graphics,
		Object.defineProperty(t.Graphics.prototype, "cacheAsBitmap", {
			get : function () {
				return this._cacheAsBitmap
			},
			set : function (e) {
				this._cacheAsBitmap = e,
				this._cacheAsBitmap ? this._generateCachedSprite() : (this.destroyCachedSprite(), this.dirty = !0)
			}
		}),
		t.Graphics.prototype.lineStyle = function (e, i, r) {
			this.currentPath.points.length || this.graphicsData.pop(),
			this.lineWidth = e || 0,
			this.lineColor = i || 0,
			this.lineAlpha = arguments.length < 3 ? 1 : r,
			this.currentPath = {
				lineWidth : this.lineWidth,
				lineColor : this.lineColor,
				lineAlpha : this.lineAlpha,
				fillColor : this.fillColor,
				fillAlpha : this.fillAlpha,
				fill : this.filling,
				points : [],
				type : t.Graphics.POLY
			},
			this.graphicsData.push(this.currentPath)
		},
		t.Graphics.prototype.moveTo = function (e, i) {
			this.currentPath.points.length || this.graphicsData.pop(),
			this.currentPath = this.currentPath = {
				lineWidth : this.lineWidth,
				lineColor : this.lineColor,
				lineAlpha : this.lineAlpha,
				fillColor : this.fillColor,
				fillAlpha : this.fillAlpha,
				fill : this.filling,
				points : [],
				type : t.Graphics.POLY
			},
			this.currentPath.points.push(e, i),
			this.graphicsData.push(this.currentPath)
		},
		t.Graphics.prototype.lineTo = function (e, t) {
			this.currentPath.points.push(e, t),
			this.dirty = !0
		},
		t.Graphics.prototype.beginFill = function (e, t) {
			this.filling = !0,
			this.fillColor = e || 0,
			this.fillAlpha = arguments.length < 2 ? 1 : t
		},
		t.Graphics.prototype.endFill = function () {
			this.filling = !1,
			this.fillColor = null,
			this.fillAlpha = 1
		},
		t.Graphics.prototype.drawRect = function (e, i, r, s) {
			this.currentPath.points.length || this.graphicsData.pop(),
			this.currentPath = {
				lineWidth : this.lineWidth,
				lineColor : this.lineColor,
				lineAlpha : this.lineAlpha,
				fillColor : this.fillColor,
				fillAlpha : this.fillAlpha,
				fill : this.filling,
				points : [e, i, r, s],
				type : t.Graphics.RECT
			},
			this.graphicsData.push(this.currentPath),
			this.dirty = !0
		},
		t.Graphics.prototype.drawCircle = function (e, i, r) {
			this.currentPath.points.length || this.graphicsData.pop(),
			this.currentPath = {
				lineWidth : this.lineWidth,
				lineColor : this.lineColor,
				lineAlpha : this.lineAlpha,
				fillColor : this.fillColor,
				fillAlpha : this.fillAlpha,
				fill : this.filling,
				points : [e, i, r, r],
				type : t.Graphics.CIRC
			},
			this.graphicsData.push(this.currentPath),
			this.dirty = !0
		},
		t.Graphics.prototype.drawEllipse = function (e, i, r, s) {
			this.currentPath.points.length || this.graphicsData.pop(),
			this.currentPath = {
				lineWidth : this.lineWidth,
				lineColor : this.lineColor,
				lineAlpha : this.lineAlpha,
				fillColor : this.fillColor,
				fillAlpha : this.fillAlpha,
				fill : this.filling,
				points : [e, i, r, s],
				type : t.Graphics.ELIP
			},
			this.graphicsData.push(this.currentPath),
			this.dirty = !0
		},
		t.Graphics.prototype.clear = function () {
			this.lineWidth = 0,
			this.filling = !1,
			this.dirty = !0,
			this.clearDirty = !0,
			this.graphicsData = [],
			this.bounds = null
		},
		t.Graphics.prototype.generateTexture = function () {
			var e = this.getBounds(),
			i = new t.CanvasBuffer(e.width, e.height),
			r = t.Texture.fromCanvas(i.canvas);
			return i.context.translate(-e.x, -e.y),
			t.CanvasGraphics.renderGraphics(this, i.context),
			r
		},
		t.Graphics.prototype._renderWebGL = function (e) {
			if (this.visible !== !1 && 0 !== this.alpha && this.isMask !== !0) {
				if (this._cacheAsBitmap)
					return this.dirty && (this._generateCachedSprite(), t.updateWebGLTexture(this._cachedSprite.texture.baseTexture, e.gl), this.dirty = !1), void t.Sprite.prototype._renderWebGL.call(this._cachedSprite, e);
				if (e.spriteBatch.stop(), this._mask && e.maskManager.pushMask(this.mask, e), this._filters && e.filterManager.pushFilter(this._filterBlock), this.blendMode !== e.spriteBatch.currentBlendMode) {
					e.spriteBatch.currentBlendMode = this.blendMode;
					var i = t.blendModesWebGL[e.spriteBatch.currentBlendMode];
					e.spriteBatch.gl.blendFunc(i[0], i[1])
				}
				if (t.WebGLGraphics.renderGraphics(this, e), this.children.length) {
					e.spriteBatch.start();
					for (var r = 0, s = this.children.length; s > r; r++)
						this.children[r]._renderWebGL(e);
					e.spriteBatch.stop()
				}
				this._filters && e.filterManager.popFilter(),
				this._mask && e.maskManager.popMask(e),
				e.drawCount++,
				e.spriteBatch.start()
			}
		},
		t.Graphics.prototype._renderCanvas = function (e) {
			if (this.visible !== !1 && 0 !== this.alpha && this.isMask !== !0) {
				var i = e.context,
				r = this.worldTransform;
				this.blendMode !== e.currentBlendMode && (e.currentBlendMode = this.blendMode, i.globalCompositeOperation = t.blendModesCanvas[e.currentBlendMode]),
				i.setTransform(r.a, r.c, r.b, r.d, r.tx, r.ty),
				t.CanvasGraphics.renderGraphics(this, i);
				for (var s = 0, n = this.children.length; n > s; s++)
					this.children[s]._renderCanvas(e)
			}
		},
		t.Graphics.prototype.getBounds = function (e) {
			this.bounds || this.updateBounds();
			var t = this.bounds.x,
			i = this.bounds.width + this.bounds.x,
			r = this.bounds.y,
			s = this.bounds.height + this.bounds.y,
			n = e || this.worldTransform,
			a = n.a,
			o = n.c,
			h = n.b,
			l = n.d,
			u = n.tx,
			c = n.ty,
			d = a * i + h * s + u,
			p = l * s + o * i + c,
			m = a * t + h * s + u,
			g = l * s + o * t + c,
			f = a * t + h * r + u,
			v = l * r + o * t + c,
			y = a * i + h * r + u,
			x = l * r + o * i + c,
			b = -1 / 0,
			T = -1 / 0,
			w = 1 / 0,
			S = 1 / 0;
			w = w > d ? d : w,
			w = w > m ? m : w,
			w = w > f ? f : w,
			w = w > y ? y : w,
			S = S > p ? p : S,
			S = S > g ? g : S,
			S = S > v ? v : S,
			S = S > x ? x : S,
			b = d > b ? d : b,
			b = m > b ? m : b,
			b = f > b ? f : b,
			b = y > b ? y : b,
			T = p > T ? p : T,
			T = g > T ? g : T,
			T = v > T ? v : T,
			T = x > T ? x : T;
			var C = this._bounds;
			return C.x = w,
			C.width = b - w,
			C.y = S,
			C.height = T - S,
			C
		},
		t.Graphics.prototype.updateBounds = function () {
			for (var e, i, r, s, n, a = 1 / 0, o = -1 / 0, h = 1 / 0, l = -1 / 0, u = 0; u < this.graphicsData.length; u++) {
				var c = this.graphicsData[u],
				d = c.type,
				p = c.lineWidth;
				if (e = c.points, d === t.Graphics.RECT)
					i = e[0] - p / 2, r = e[1] - p / 2, s = e[2] + p, n = e[3] + p, a = a > i ? i : a, o = i + s > o ? i + s : o, h = h > r ? i : h, l = r + n > l ? r + n : l;
				else if (d === t.Graphics.CIRC || d === t.Graphics.ELIP)
					i = e[0], r = e[1], s = e[2] + p / 2, n = e[3] + p / 2, a = a > i - s ? i - s : a, o = i + s > o ? i + s : o, h = h > r - n ? r - n : h, l = r + n > l ? r + n : l;
				else
					for (var m = 0; m < e.length; m += 2)
						i = e[m], r = e[m + 1], a = a > i - p ? i - p : a, o = i + p > o ? i + p : o, h = h > r - p ? r - p : h, l = r + p > l ? r + p : l
			}
			var g = this.boundsPadding;
			this.bounds = new t.Rectangle(a - g, h - g, o - a + 2 * g, l - h + 2 * g)
		},
		t.Graphics.prototype._generateCachedSprite = function () {
			var e = this.getLocalBounds();
			if (this._cachedSprite)
				this._cachedSprite.buffer.resize(e.width, e.height);
			else {
				var i = new t.CanvasBuffer(e.width, e.height),
				r = t.Texture.fromCanvas(i.canvas);
				this._cachedSprite = new t.Sprite(r),
				this._cachedSprite.buffer = i,
				this._cachedSprite.worldTransform = this.worldTransform
			}
			this._cachedSprite.anchor.x =  - (e.x / e.width),
			this._cachedSprite.anchor.y =  - (e.y / e.height),
			this._cachedSprite.buffer.context.translate(-e.x, -e.y),
			t.CanvasGraphics.renderGraphics(this, this._cachedSprite.buffer.context)
		},
		t.Graphics.prototype.destroyCachedSprite = function () {
			this._cachedSprite.texture.destroy(!0),
			this._cachedSprite = null
		},
		t.Graphics.POLY = 0,
		t.Graphics.RECT = 1,
		t.Graphics.CIRC = 2,
		t.Graphics.ELIP = 3,
		t.Strip = function (e, i, r) {
			t.DisplayObjectContainer.call(this),
			this.texture = e,
			this.blendMode = t.blendModes.NORMAL;
			try {
				this.uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1]),
				this.verticies = new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]),
				this.colors = new Float32Array([1, 1, 1, 1]),
				this.indices = new Uint16Array([0, 1, 2, 3])
			} catch (s) {
				this.uvs = [0, 1, 1, 1, 1, 0, 0, 1],
				this.verticies = [0, 0, 0, 0, 0, 0, 0, 0, 0],
				this.colors = [1, 1, 1, 1],
				this.indices = [0, 1, 2, 3]
			}
			this.width = i,
			this.height = r,
			e.baseTexture.hasLoaded ? (this.width = this.texture.frame.width, this.height = this.texture.frame.height, this.updateFrame = !0) : (this.onTextureUpdateBind = this.onTextureUpdate.bind(this), this.texture.addEventListener("update", this.onTextureUpdateBind)),
			this.renderable = !0
		},
		t.Strip.prototype = Object.create(t.DisplayObjectContainer.prototype),
		t.Strip.prototype.constructor = t.Strip,
		t.Strip.prototype.setTexture = function (e) {
			this.texture = e,
			this.width = e.frame.width,
			this.height = e.frame.height,
			this.updateFrame = !0
		},
		t.Strip.prototype.onTextureUpdate = function () {
			this.updateFrame = !0
		},
		t.Rope = function (e, i) {
			t.Strip.call(this, e),
			this.points = i;
			try {
				this.verticies = new Float32Array(4 * i.length),
				this.uvs = new Float32Array(4 * i.length),
				this.colors = new Float32Array(2 * i.length),
				this.indices = new Uint16Array(2 * i.length)
			} catch (r) {
				this.verticies = new Array(4 * i.length),
				this.uvs = new Array(4 * i.length),
				this.colors = new Array(2 * i.length),
				this.indices = new Array(2 * i.length)
			}
			this.refresh()
		},
		t.Rope.prototype = Object.create(t.Strip.prototype),
		t.Rope.prototype.constructor = t.Rope,
		t.Rope.prototype.refresh = function () {
			var e = this.points;
			if (!(e.length < 1)) {
				var t = this.uvs,
				i = e[0],
				r = this.indices,
				s = this.colors;
				this.count -= .2,
				t[0] = 0,
				t[1] = 1,
				t[2] = 0,
				t[3] = 1,
				s[0] = 1,
				s[1] = 1,
				r[0] = 0,
				r[1] = 1;
				for (var n, a, o, h = e.length, l = 1; h > l; l++)
					n = e[l], a = 4 * l, o = l / (h - 1), l % 2 ? (t[a] = o, t[a + 1] = 0, t[a + 2] = o, t[a + 3] = 1) : (t[a] = o, t[a + 1] = 0, t[a + 2] = o, t[a + 3] = 1), a = 2 * l, s[a] = 1, s[a + 1] = 1, a = 2 * l, r[a] = a, r[a + 1] = a + 1, i = n
			}
		},
		t.Rope.prototype.updateTransform = function () {
			var e = this.points;
			if (!(e.length < 1)) {
				var i,
				r = e[0],
				s = {
					x : 0,
					y : 0
				};
				this.count -= .2;
				var n = this.verticies;
				n[0] = r.x + s.x,
				n[1] = r.y + s.y,
				n[2] = r.x - s.x,
				n[3] = r.y - s.y;
				for (var a, o, h, l, u, c = e.length, d = 1; c > d; d++)
					a = e[d], o = 4 * d, i = d < e.length - 1 ? e[d + 1] : a, s.y =  - (i.x - r.x), s.x = i.y - r.y, h = 10 * (1 - d / (c - 1)), h > 1 && (h = 1), l = Math.sqrt(s.x * s.x + s.y * s.y), u = this.texture.height / 2, s.x /= l, s.y /= l, s.x *= u, s.y *= u, n[o] = a.x + s.x, n[o + 1] = a.y + s.y, n[o + 2] = a.x - s.x, n[o + 3] = a.y - s.y, r = a;
				t.DisplayObjectContainer.prototype.updateTransform.call(this)
			}
		},
		t.Rope.prototype.setTexture = function (e) {
			this.texture = e,
			this.updateFrame = !0
		},
		t.TilingSprite = function (e, i, r) {
			t.Sprite.call(this, e),
			this.width = i || 100,
			this.height = r || 100,
			this.tileScale = new t.Point(1, 1),
			this.tileScaleOffset = new t.Point(1, 1),
			this.tilePosition = new t.Point(0, 0),
			this.renderable = !0,
			this.tint = 16777215,
			this.blendMode = t.blendModes.NORMAL
		},
		t.TilingSprite.prototype = Object.create(t.Sprite.prototype),
		t.TilingSprite.prototype.constructor = t.TilingSprite,
		Object.defineProperty(t.TilingSprite.prototype, "width", {
			get : function () {
				return this._width
			},
			set : function (e) {
				this._width = e
			}
		}),
		Object.defineProperty(t.TilingSprite.prototype, "height", {
			get : function () {
				return this._height
			},
			set : function (e) {
				this._height = e
			}
		}),
		t.TilingSprite.prototype.onTextureUpdate = function () {
			this.updateFrame = !0
		},
		t.TilingSprite.prototype._renderWebGL = function (e) {
			if (this.visible !== !1 && 0 !== this.alpha) {
				var t,
				i;
				if (this.mask || this.filters) {
					for (this.mask && (e.spriteBatch.stop(), e.maskManager.pushMask(this.mask, e), e.spriteBatch.start()), this.filters && (e.spriteBatch.flush(), e.filterManager.pushFilter(this._filterBlock)), this.tilingTexture ? e.spriteBatch.renderTilingSprite(this) : this.generateTilingTexture(!0), t = 0, i = this.children.length; i > t; t++)
						this.children[t]._renderWebGL(e);
					e.spriteBatch.stop(),
					this.filters && e.filterManager.popFilter(),
					this.mask && e.maskManager.popMask(e),
					e.spriteBatch.start()
				} else
					for (this.tilingTexture ? e.spriteBatch.renderTilingSprite(this) : this.generateTilingTexture(!0), t = 0, i = this.children.length; i > t; t++)
						this.children[t]._renderWebGL(e)
			}
		},
		t.TilingSprite.prototype._renderCanvas = function (e) {
			if (this.visible !== !1 && 0 !== this.alpha) {
				var i = e.context;
				this._mask && e.maskManager.pushMask(this._mask, i),
				i.globalAlpha = this.worldAlpha;
				var r = this.worldTransform;
				i.setTransform(r.a, r.c, r.b, r.d, r.tx, r.ty),
				this.__tilePattern || (this.generateTilingTexture(!1), this.tilingTexture && (this.__tilePattern = i.createPattern(this.tilingTexture.baseTexture.source, "repeat"))),
				this.blendMode !== e.currentBlendMode && (e.currentBlendMode = this.blendMode, i.globalCompositeOperation = t.blendModesCanvas[e.currentBlendMode]),
				i.beginPath();
				var s = this.tilePosition,
				n = this.tileScale;
				s.x %= this.tilingTexture.baseTexture.width,
				s.y %= this.tilingTexture.baseTexture.height,
				i.scale(n.x, n.y),
				i.translate(s.x, s.y),
				i.fillStyle = this.__tilePattern,
				i.fillRect(-s.x, -s.y, this.width / n.x, this.height / n.y),
				i.scale(1 / n.x, 1 / n.y),
				i.translate(-s.x, -s.y),
				i.closePath(),
				this._mask && e.maskManager.popMask(e.context)
			}
		},
		t.TilingSprite.prototype.getBounds = function () {
			var e = this._width,
			t = this._height,
			i = e * (1 - this.anchor.x),
			r = e * -this.anchor.x,
			s = t * (1 - this.anchor.y),
			n = t * -this.anchor.y,
			a = this.worldTransform,
			o = a.a,
			h = a.c,
			l = a.b,
			u = a.d,
			c = a.tx,
			d = a.ty,
			p = o * r + l * n + c,
			m = u * n + h * r + d,
			g = o * i + l * n + c,
			f = u * n + h * i + d,
			v = o * i + l * s + c,
			y = u * s + h * i + d,
			x = o * r + l * s + c,
			b = u * s + h * r + d,
			T = -1 / 0,
			w = -1 / 0,
			S = 1 / 0,
			C = 1 / 0;
			S = S > p ? p : S,
			S = S > g ? g : S,
			S = S > v ? v : S,
			S = S > x ? x : S,
			C = C > m ? m : C,
			C = C > f ? f : C,
			C = C > y ? y : C,
			C = C > b ? b : C,
			T = p > T ? p : T,
			T = g > T ? g : T,
			T = v > T ? v : T,
			T = x > T ? x : T,
			w = m > w ? m : w,
			w = f > w ? f : w,
			w = y > w ? y : w,
			w = b > w ? b : w;
			var A = this._bounds;
			return A.x = S,
			A.width = T - S,
			A.y = C,
			A.height = w - C,
			this._currentBounds = A,
			A
		},
		t.TilingSprite.prototype.generateTilingTexture = function (e) {
			var i = this.texture;
			if (i.baseTexture.hasLoaded) {
				var r,
				s,
				n = i.baseTexture,
				a = i.frame,
				o = a.width !== n.width || a.height !== n.height;
				this.tilingTexture = i;
				var h = !1;
				if (e ? (r = t.getNextPowerOfTwo(i.frame.width), s = t.getNextPowerOfTwo(i.frame.height), a.width !== r && a.height !== s && (h = !0)) : o && (r = a.width, s = a.height, h = !0), h) {
					var l = new t.CanvasBuffer(r, s);
					l.context.drawImage(i.baseTexture.source, a.x, a.y, a.width, a.height, 0, 0, r, s),
					this.tilingTexture = t.Texture.fromCanvas(l.canvas),
					this.tileScaleOffset.x = a.width / r,
					this.tileScaleOffset.y = a.height / s
				}
				this.tilingTexture.baseTexture._powerOf2 = !0
			}
		};
		var o = {};
		o.BoneData = function (e, t) {
			this.name = e,
			this.parent = t
		},
		o.BoneData.prototype = {
			length : 0,
			x : 0,
			y : 0,
			rotation : 0,
			scaleX : 1,
			scaleY : 1
		},
		o.SlotData = function (e, t) {
			this.name = e,
			this.boneData = t
		},
		o.SlotData.prototype = {
			r : 1,
			g : 1,
			b : 1,
			a : 1,
			attachmentName : null
		},
		o.Bone = function (e, t) {
			this.data = e,
			this.parent = t,
			this.setToSetupPose()
		},
		o.Bone.yDown = !1,
		o.Bone.prototype = {
			x : 0,
			y : 0,
			rotation : 0,
			scaleX : 1,
			scaleY : 1,
			m00 : 0,
			m01 : 0,
			worldX : 0,
			m10 : 0,
			m11 : 0,
			worldY : 0,
			worldRotation : 0,
			worldScaleX : 1,
			worldScaleY : 1,
			updateWorldTransform : function (e, t) {
				var i = this.parent;
				null != i ? (this.worldX = this.x * i.m00 + this.y * i.m01 + i.worldX, this.worldY = this.x * i.m10 + this.y * i.m11 + i.worldY, this.worldScaleX = i.worldScaleX * this.scaleX, this.worldScaleY = i.worldScaleY * this.scaleY, this.worldRotation = i.worldRotation + this.rotation) : (this.worldX = this.x, this.worldY = this.y, this.worldScaleX = this.scaleX, this.worldScaleY = this.scaleY, this.worldRotation = this.rotation);
				var r = this.worldRotation * Math.PI / 180,
				s = Math.cos(r),
				n = Math.sin(r);
				this.m00 = s * this.worldScaleX,
				this.m10 = n * this.worldScaleX,
				this.m01 = -n * this.worldScaleY,
				this.m11 = s * this.worldScaleY,
				e && (this.m00 = -this.m00, this.m01 = -this.m01),
				t && (this.m10 = -this.m10, this.m11 = -this.m11),
				o.Bone.yDown && (this.m10 = -this.m10, this.m11 = -this.m11)
			},
			setToSetupPose : function () {
				var e = this.data;
				this.x = e.x,
				this.y = e.y,
				this.rotation = e.rotation,
				this.scaleX = e.scaleX,
				this.scaleY = e.scaleY
			}
		},
		o.Slot = function (e, t, i) {
			this.data = e,
			this.skeleton = t,
			this.bone = i,
			this.setToSetupPose()
		},
		o.Slot.prototype = {
			r : 1,
			g : 1,
			b : 1,
			a : 1,
			_attachmentTime : 0,
			attachment : null,
			setAttachment : function (e) {
				this.attachment = e,
				this._attachmentTime = this.skeleton.time
			},
			setAttachmentTime : function (e) {
				this._attachmentTime = this.skeleton.time - e
			},
			getAttachmentTime : function () {
				return this.skeleton.time - this._attachmentTime
			},
			setToSetupPose : function () {
				var e = this.data;
				this.r = e.r,
				this.g = e.g,
				this.b = e.b,
				this.a = e.a;
				for (var t = this.skeleton.data.slots, i = 0, r = t.length; r > i; i++)
					if (t[i] == e) {
						this.setAttachment(e.attachmentName ? this.skeleton.getAttachmentBySlotIndex(i, e.attachmentName) : null);
						break
					}
			}
		},
		o.Skin = function (e) {
			this.name = e,
			this.attachments = {}

		},
		o.Skin.prototype = {
			addAttachment : function (e, t, i) {
				this.attachments[e + ":" + t] = i
			},
			getAttachment : function (e, t) {
				return this.attachments[e + ":" + t]
			},
			_attachAll : function (e, t) {
				for (var i in t.attachments) {
					var r = i.indexOf(":"),
					s = parseInt(i.substring(0, r), 10),
					n = i.substring(r + 1),
					a = e.slots[s];
					if (a.attachment && a.attachment.name == n) {
						var o = this.getAttachment(s, n);
						o && a.setAttachment(o)
					}
				}
			}
		},
		o.Animation = function (e, t, i) {
			this.name = e,
			this.timelines = t,
			this.duration = i
		},
		o.Animation.prototype = {
			apply : function (e, t, i) {
				i && this.duration && (t %= this.duration);
				for (var r = this.timelines, s = 0, n = r.length; n > s; s++)
					r[s].apply(e, t, 1)
			},
			mix : function (e, t, i, r) {
				i && this.duration && (t %= this.duration);
				for (var s = this.timelines, n = 0, a = s.length; a > n; n++)
					s[n].apply(e, t, r)
			}
		},
		o.binarySearch = function (e, t, i) {
			var r = 0,
			s = Math.floor(e.length / i) - 2;
			if (!s)
				return i;
			for (var n = s >>> 1; ; ) {
				if (e[(n + 1) * i] <= t ? r = n + 1 : s = n, r == s)
					return (r + 1) * i;
				n = r + s >>> 1
			}
		},
		o.linearSearch = function (e, t, i) {
			for (var r = 0, s = e.length - i; s >= r; r += i)
				if (e[r] > t)
					return r;
			return -1
		},
		o.Curves = function (e) {
			this.curves = [],
			this.curves.length = 6 * (e - 1)
		},
		o.Curves.prototype = {
			setLinear : function (e) {
				this.curves[6 * e] = 0
			},
			setStepped : function (e) {
				this.curves[6 * e] = -1
			},
			setCurve : function (e, t, i, r, s) {
				var n = .1,
				a = n * n,
				o = a * n,
				h = 3 * n,
				l = 3 * a,
				u = 6 * a,
				c = 6 * o,
				d = 2 * -t + r,
				p = 2 * -i + s,
				m = 3 * (t - r) + 1,
				g = 3 * (i - s) + 1,
				f = 6 * e,
				v = this.curves;
				v[f] = t * h + d * l + m * o,
				v[f + 1] = i * h + p * l + g * o,
				v[f + 2] = d * u + m * c,
				v[f + 3] = p * u + g * c,
				v[f + 4] = m * c,
				v[f + 5] = g * c
			},
			getCurvePercent : function (e, t) {
				t = 0 > t ? 0 : t > 1 ? 1 : t;
				var i = 6 * e,
				r = this.curves,
				s = r[i];
				if (!s)
					return t;
				if (-1 == s)
					return 0;
				for (var n = r[i + 1], a = r[i + 2], o = r[i + 3], h = r[i + 4], l = r[i + 5], u = s, c = n, d = 8; ; ) {
					if (u >= t) {
						var p = u - s,
						m = c - n;
						return m + (c - m) * (t - p) / (u - p)
					}
					if (!d)
						break;
					d--,
					s += a,
					n += o,
					a += h,
					o += l,
					u += s,
					c += n
				}
				return c + (1 - c) * (t - u) / (1 - u)
			}
		},
		o.RotateTimeline = function (e) {
			this.curves = new o.Curves(e),
			this.frames = [],
			this.frames.length = 2 * e
		},
		o.RotateTimeline.prototype = {
			boneIndex : 0,
			getFrameCount : function () {
				return this.frames.length / 2
			},
			setFrame : function (e, t, i) {
				e *= 2,
				this.frames[e] = t,
				this.frames[e + 1] = i
			},
			apply : function (e, t, i) {
				var r,
				s = this.frames;
				if (!(t < s[0])) {
					var n = e.bones[this.boneIndex];
					if (t >= s[s.length - 2]) {
						for (r = n.data.rotation + s[s.length - 1] - n.rotation; r > 180; )
							r -= 360;
						for (; -180 > r; )
							r += 360;
						return void(n.rotation += r * i)
					}
					var a = o.binarySearch(s, t, 2),
					h = s[a - 1],
					l = s[a],
					u = 1 - (t - l) / (s[a - 2] - l);
					for (u = this.curves.getCurvePercent(a / 2 - 1, u), r = s[a + 1] - h; r > 180; )
						r -= 360;
					for (; -180 > r; )
						r += 360;
					for (r = n.data.rotation + (h + r * u) - n.rotation; r > 180; )
						r -= 360;
					for (; -180 > r; )
						r += 360;
					n.rotation += r * i
				}
			}
		},
		o.TranslateTimeline = function (e) {
			this.curves = new o.Curves(e),
			this.frames = [],
			this.frames.length = 3 * e
		},
		o.TranslateTimeline.prototype = {
			boneIndex : 0,
			getFrameCount : function () {
				return this.frames.length / 3
			},
			setFrame : function (e, t, i, r) {
				e *= 3,
				this.frames[e] = t,
				this.frames[e + 1] = i,
				this.frames[e + 2] = r
			},
			apply : function (e, t, i) {
				var r = this.frames;
				if (!(t < r[0])) {
					var s = e.bones[this.boneIndex];
					if (t >= r[r.length - 3])
						return s.x += (s.data.x + r[r.length - 2] - s.x) * i, void(s.y += (s.data.y + r[r.length - 1] - s.y) * i);
					var n = o.binarySearch(r, t, 3),
					a = r[n - 2],
					h = r[n - 1],
					l = r[n],
					u = 1 - (t - l) / (r[n + -3] - l);
					u = this.curves.getCurvePercent(n / 3 - 1, u),
					s.x += (s.data.x + a + (r[n + 1] - a) * u - s.x) * i,
					s.y += (s.data.y + h + (r[n + 2] - h) * u - s.y) * i
				}
			}
		},
		o.ScaleTimeline = function (e) {
			this.curves = new o.Curves(e),
			this.frames = [],
			this.frames.length = 3 * e
		},
		o.ScaleTimeline.prototype = {
			boneIndex : 0,
			getFrameCount : function () {
				return this.frames.length / 3
			},
			setFrame : function (e, t, i, r) {
				e *= 3,
				this.frames[e] = t,
				this.frames[e + 1] = i,
				this.frames[e + 2] = r
			},
			apply : function (e, t, i) {
				var r = this.frames;
				if (!(t < r[0])) {
					var s = e.bones[this.boneIndex];
					if (t >= r[r.length - 3])
						return s.scaleX += (s.data.scaleX - 1 + r[r.length - 2] - s.scaleX) * i, void(s.scaleY += (s.data.scaleY - 1 + r[r.length - 1] - s.scaleY) * i);
					var n = o.binarySearch(r, t, 3),
					a = r[n - 2],
					h = r[n - 1],
					l = r[n],
					u = 1 - (t - l) / (r[n + -3] - l);
					u = this.curves.getCurvePercent(n / 3 - 1, u),
					s.scaleX += (s.data.scaleX - 1 + a + (r[n + 1] - a) * u - s.scaleX) * i,
					s.scaleY += (s.data.scaleY - 1 + h + (r[n + 2] - h) * u - s.scaleY) * i
				}
			}
		},
		o.ColorTimeline = function (e) {
			this.curves = new o.Curves(e),
			this.frames = [],
			this.frames.length = 5 * e
		},
		o.ColorTimeline.prototype = {
			slotIndex : 0,
			getFrameCount : function () {
				return this.frames.length / 2
			},
			setFrame : function (e, t) {
				e *= 5,
				this.frames[e] = t,
				this.frames[e + 1] = r,
				this.frames[e + 2] = g,
				this.frames[e + 3] = b,
				this.frames[e + 4] = a
			},
			apply : function (e, t, i) {
				var r = this.frames;
				if (!(t < r[0])) {
					var s = e.slots[this.slotIndex];
					if (t >= r[r.length - 5]) {
						var n = r.length - 1;
						return s.r = r[n - 3],
						s.g = r[n - 2],
						s.b = r[n - 1],
						void(s.a = r[n])
					}
					var a = o.binarySearch(r, t, 5),
					h = r[a - 4],
					l = r[a - 3],
					u = r[a - 2],
					c = r[a - 1],
					d = r[a],
					p = 1 - (t - d) / (r[a - 5] - d);
					p = this.curves.getCurvePercent(a / 5 - 1, p);
					var m = h + (r[a + 1] - h) * p,
					g = l + (r[a + 2] - l) * p,
					f = u + (r[a + 3] - u) * p,
					v = c + (r[a + 4] - c) * p;
					1 > i ? (s.r += (m - s.r) * i, s.g += (g - s.g) * i, s.b += (f - s.b) * i, s.a += (v - s.a) * i) : (s.r = m, s.g = g, s.b = f, s.a = v)
				}
			}
		},
		o.AttachmentTimeline = function (e) {
			this.curves = new o.Curves(e),
			this.frames = [],
			this.frames.length = e,
			this.attachmentNames = [],
			this.attachmentNames.length = e
		},
		o.AttachmentTimeline.prototype = {
			slotIndex : 0,
			getFrameCount : function () {
				return this.frames.length
			},
			setFrame : function (e, t, i) {
				this.frames[e] = t,
				this.attachmentNames[e] = i
			},
			apply : function (e, t) {
				var i = this.frames;
				if (!(t < i[0])) {
					var r;
					r = t >= i[i.length - 1] ? i.length - 1 : o.binarySearch(i, t, 1) - 1;
					var s = this.attachmentNames[r];
					e.slots[this.slotIndex].setAttachment(s ? e.getAttachmentBySlotIndex(this.slotIndex, s) : null)
				}
			}
		},
		o.SkeletonData = function () {
			this.bones = [],
			this.slots = [],
			this.skins = [],
			this.animations = []
		},
		o.SkeletonData.prototype = {
			defaultSkin : null,
			findBone : function (e) {
				for (var t = this.bones, i = 0, r = t.length; r > i; i++)
					if (t[i].name == e)
						return t[i];
				return null
			},
			findBoneIndex : function (e) {
				for (var t = this.bones, i = 0, r = t.length; r > i; i++)
					if (t[i].name == e)
						return i;
				return -1
			},
			findSlot : function (e) {
				for (var t = this.slots, i = 0, r = t.length; r > i; i++)
					if (t[i].name == e)
						return slot[i];
				return null
			},
			findSlotIndex : function (e) {
				for (var t = this.slots, i = 0, r = t.length; r > i; i++)
					if (t[i].name == e)
						return i;
				return -1
			},
			findSkin : function (e) {
				for (var t = this.skins, i = 0, r = t.length; r > i; i++)
					if (t[i].name == e)
						return t[i];
				return null
			},
			findAnimation : function (e) {
				for (var t = this.animations, i = 0, r = t.length; r > i; i++)
					if (t[i].name == e)
						return t[i];
				return null
			}
		},
		o.Skeleton = function (e) {
			this.data = e,
			this.bones = [];
			for (var t = 0, i = e.bones.length; i > t; t++) {
				var r = e.bones[t],
				s = r.parent ? this.bones[e.bones.indexOf(r.parent)] : null;
				this.bones.push(new o.Bone(r, s))
			}
			for (this.slots = [], this.drawOrder = [], t = 0, i = e.slots.length; i > t; t++) {
				var n = e.slots[t],
				a = this.bones[e.bones.indexOf(n.boneData)],
				h = new o.Slot(n, this, a);
				this.slots.push(h),
				this.drawOrder.push(h)
			}
		},
		o.Skeleton.prototype = {
			x : 0,
			y : 0,
			skin : null,
			r : 1,
			g : 1,
			b : 1,
			a : 1,
			time : 0,
			flipX : !1,
			flipY : !1,
			updateWorldTransform : function () {
				for (var e = this.flipX, t = this.flipY, i = this.bones, r = 0, s = i.length; s > r; r++)
					i[r].updateWorldTransform(e, t)
			},
			setToSetupPose : function () {
				this.setBonesToSetupPose(),
				this.setSlotsToSetupPose()
			},
			setBonesToSetupPose : function () {
				for (var e = this.bones, t = 0, i = e.length; i > t; t++)
					e[t].setToSetupPose()
			},
			setSlotsToSetupPose : function () {
				for (var e = this.slots, t = 0, i = e.length; i > t; t++)
					e[t].setToSetupPose(t)
			},
			getRootBone : function () {
				return this.bones.length ? this.bones[0] : null
			},
			findBone : function (e) {
				for (var t = this.bones, i = 0, r = t.length; r > i; i++)
					if (t[i].data.name == e)
						return t[i];
				return null
			},
			findBoneIndex : function (e) {
				for (var t = this.bones, i = 0, r = t.length; r > i; i++)
					if (t[i].data.name == e)
						return i;
				return -1
			},
			findSlot : function (e) {
				for (var t = this.slots, i = 0, r = t.length; r > i; i++)
					if (t[i].data.name == e)
						return t[i];
				return null
			},
			findSlotIndex : function (e) {
				for (var t = this.slots, i = 0, r = t.length; r > i; i++)
					if (t[i].data.name == e)
						return i;
				return -1
			},
			setSkinByName : function (e) {
				var t = this.data.findSkin(e);
				if (!t)
					throw "Skin not found: " + e;
				this.setSkin(t)
			},
			setSkin : function (e) {
				this.skin && e && e._attachAll(this, this.skin),
				this.skin = e
			},
			getAttachmentBySlotName : function (e, t) {
				return this.getAttachmentBySlotIndex(this.data.findSlotIndex(e), t)
			},
			getAttachmentBySlotIndex : function (e, t) {
				if (this.skin) {
					var i = this.skin.getAttachment(e, t);
					if (i)
						return i
				}
				return this.data.defaultSkin ? this.data.defaultSkin.getAttachment(e, t) : null
			},
			setAttachment : function (e, t) {
				for (var i = this.slots, r = 0, s = i.size; s > r; r++) {
					var n = i[r];
					if (n.data.name == e) {
						var a = null;
						if (t && (a = this.getAttachment(r, t), null == a))
							throw "Attachment not found: " + t + ", for slot: " + e;
						return void n.setAttachment(a)
					}
				}
				throw "Slot not found: " + e
			},
			update : function (e) {
				this.time += e
			}
		},
		o.AttachmentType = {
			region : 0
		},
		o.RegionAttachment = function () {
			this.offset = [],
			this.offset.length = 8,
			this.uvs = [],
			this.uvs.length = 8
		},
		o.RegionAttachment.prototype = {
			x : 0,
			y : 0,
			rotation : 0,
			scaleX : 1,
			scaleY : 1,
			width : 0,
			height : 0,
			rendererObject : null,
			regionOffsetX : 0,
			regionOffsetY : 0,
			regionWidth : 0,
			regionHeight : 0,
			regionOriginalWidth : 0,
			regionOriginalHeight : 0,
			setUVs : function (e, t, i, r, s) {
				var n = this.uvs;
				s ? (n[2] = e, n[3] = r, n[4] = e, n[5] = t, n[6] = i, n[7] = t, n[0] = i, n[1] = r) : (n[0] = e, n[1] = r, n[2] = e, n[3] = t, n[4] = i, n[5] = t, n[6] = i, n[7] = r)
			},
			updateOffset : function () {
				var e = this.width / this.regionOriginalWidth * this.scaleX,
				t = this.height / this.regionOriginalHeight * this.scaleY,
				i = -this.width / 2 * this.scaleX + this.regionOffsetX * e,
				r = -this.height / 2 * this.scaleY + this.regionOffsetY * t,
				s = i + this.regionWidth * e,
				n = r + this.regionHeight * t,
				a = this.rotation * Math.PI / 180,
				o = Math.cos(a),
				h = Math.sin(a),
				l = i * o + this.x,
				u = i * h,
				c = r * o + this.y,
				d = r * h,
				p = s * o + this.x,
				m = s * h,
				g = n * o + this.y,
				f = n * h,
				v = this.offset;
				v[0] = l - d,
				v[1] = c + u,
				v[2] = l - f,
				v[3] = g + u,
				v[4] = p - f,
				v[5] = g + m,
				v[6] = p - d,
				v[7] = c + m
			},
			computeVertices : function (e, t, i, r) {
				e += i.worldX,
				t += i.worldY;
				var s = i.m00,
				n = i.m01,
				a = i.m10,
				o = i.m11,
				h = this.offset;
				r[0] = h[0] * s + h[1] * n + e,
				r[1] = h[0] * a + h[1] * o + t,
				r[2] = h[2] * s + h[3] * n + e,
				r[3] = h[2] * a + h[3] * o + t,
				r[4] = h[4] * s + h[5] * n + e,
				r[5] = h[4] * a + h[5] * o + t,
				r[6] = h[6] * s + h[7] * n + e,
				r[7] = h[6] * a + h[7] * o + t
			}
		},
		o.AnimationStateData = function (e) {
			this.skeletonData = e,
			this.animationToMixTime = {}

		},
		o.AnimationStateData.prototype = {
			defaultMix : 0,
			setMixByName : function (e, t, i) {
				var r = this.skeletonData.findAnimation(e);
				if (!r)
					throw "Animation not found: " + e;
				var s = this.skeletonData.findAnimation(t);
				if (!s)
					throw "Animation not found: " + t;
				this.setMix(r, s, i)
			},
			setMix : function (e, t, i) {
				this.animationToMixTime[e.name + ":" + t.name] = i
			},
			getMix : function (e, t) {
				var i = this.animationToMixTime[e.name + ":" + t.name];
				return i ? i : this.defaultMix
			}
		},
		o.AnimationState = function (e) {
			this.data = e,
			this.queue = []
		},
		o.AnimationState.prototype = {
			current : null,
			previous : null,
			currentTime : 0,
			previousTime : 0,
			currentLoop : !1,
			previousLoop : !1,
			mixTime : 0,
			mixDuration : 0,
			update : function (e) {
				if (this.currentTime += e, this.previousTime += e, this.mixTime += e, this.queue.length > 0) {
					var t = this.queue[0];
					this.currentTime >= t.delay && (this._setAnimation(t.animation, t.loop), this.queue.shift())
				}
			},
			apply : function (e) {
				if (this.current)
					if (this.previous) {
						this.previous.apply(e, this.previousTime, this.previousLoop);
						var t = this.mixTime / this.mixDuration;
						t >= 1 && (t = 1, this.previous = null),
						this.current.mix(e, this.currentTime, this.currentLoop, t)
					} else
						this.current.apply(e, this.currentTime, this.currentLoop)
			},
			clearAnimation : function () {
				this.previous = null,
				this.current = null,
				this.queue.length = 0
			},
			_setAnimation : function (e, t) {
				this.previous = null,
				e && this.current && (this.mixDuration = this.data.getMix(this.current, e), this.mixDuration > 0 && (this.mixTime = 0, this.previous = this.current, this.previousTime = this.currentTime, this.previousLoop = this.currentLoop)),
				this.current = e,
				this.currentLoop = t,
				this.currentTime = 0
			},
			setAnimationByName : function (e, t) {
				var i = this.data.skeletonData.findAnimation(e);
				if (!i)
					throw "Animation not found: " + e;
				this.setAnimation(i, t)
			},
			setAnimation : function (e, t) {
				this.queue.length = 0,
				this._setAnimation(e, t)
			},
			addAnimationByName : function (e, t, i) {
				var r = this.data.skeletonData.findAnimation(e);
				if (!r)
					throw "Animation not found: " + e;
				this.addAnimation(r, t, i)
			},
			addAnimation : function (e, t, i) {
				var r = {};
				if (r.animation = e, r.loop = t, !i || 0 >= i) {
					var s = this.queue.length ? this.queue[this.queue.length - 1].animation : this.current;
					i = null != s ? s.duration - this.data.getMix(s, e) + (i || 0) : 0
				}
				r.delay = i,
				this.queue.push(r)
			},
			isComplete : function () {
				return !this.current || this.currentTime >= this.current.duration
			}
		},
		o.SkeletonJson = function (e) {
			this.attachmentLoader = e
		},
		o.SkeletonJson.prototype = {
			scale : 1,
			readSkeletonData : function (e) {
				for (var t, i = new o.SkeletonData, r = e.bones, s = 0, n = r.length; n > s; s++) {
					var a = r[s],
					h = null;
					if (a.parent && (h = i.findBone(a.parent), !h))
						throw "Parent bone not found: " + a.parent;
					t = new o.BoneData(a.name, h),
					t.length = (a.length || 0) * this.scale,
					t.x = (a.x || 0) * this.scale,
					t.y = (a.y || 0) * this.scale,
					t.rotation = a.rotation || 0,
					t.scaleX = a.scaleX || 1,
					t.scaleY = a.scaleY || 1,
					i.bones.push(t)
				}
				var l = e.slots;
				for (s = 0, n = l.length; n > s; s++) {
					var u = l[s];
					if (t = i.findBone(u.bone), !t)
						throw "Slot bone not found: " + u.bone;
					var c = new o.SlotData(u.name, t),
					d = u.color;
					d && (c.r = o.SkeletonJson.toColor(d, 0), c.g = o.SkeletonJson.toColor(d, 1), c.b = o.SkeletonJson.toColor(d, 2), c.a = o.SkeletonJson.toColor(d, 3)),
					c.attachmentName = u.attachment,
					i.slots.push(c)
				}
				var p = e.skins;
				for (var m in p)
					if (p.hasOwnProperty(m)) {
						var g = p[m],
						f = new o.Skin(m);
						for (var v in g)
							if (g.hasOwnProperty(v)) {
								var y = i.findSlotIndex(v),
								x = g[v];
								for (var b in x)
									if (x.hasOwnProperty(b)) {
										var T = this.readAttachment(f, b, x[b]);
										null != T && f.addAttachment(y, b, T)
									}
							}
						i.skins.push(f),
						"default" == f.name && (i.defaultSkin = f)
					}
				var w = e.animations;
				for (var S in w)
					w.hasOwnProperty(S) && this.readAnimation(S, w[S], i);
				return i
			},
			readAttachment : function (e, t, i) {
				t = i.name || t;
				var r = o.AttachmentType[i.type || "region"];
				if (r == o.AttachmentType.region) {
					var s = new o.RegionAttachment;
					return s.x = (i.x || 0) * this.scale,
					s.y = (i.y || 0) * this.scale,
					s.scaleX = i.scaleX || 1,
					s.scaleY = i.scaleY || 1,
					s.rotation = i.rotation || 0,
					s.width = (i.width || 32) * this.scale,
					s.height = (i.height || 32) * this.scale,
					s.updateOffset(),
					s.rendererObject = {},
					s.rendererObject.name = t,
					s.rendererObject.scale = {},
					s.rendererObject.scale.x = s.scaleX,
					s.rendererObject.scale.y = s.scaleY,
					s.rendererObject.rotation = -s.rotation * Math.PI / 180,
					s
				}
				throw "Unknown attachment type: " + r
			},
			readAnimation : function (e, t, i) {
				var r,
				s,
				n,
				a,
				h,
				l,
				u,
				c = [],
				d = 0,
				p = t.bones;
				for (var m in p)
					if (p.hasOwnProperty(m)) {
						var g = i.findBoneIndex(m);
						if (-1 == g)
							throw "Bone not found: " + m;
						var f = p[m];
						for (n in f)
							if (f.hasOwnProperty(n))
								if (h = f[n], "rotate" == n) {
									for (s = new o.RotateTimeline(h.length), s.boneIndex = g, r = 0, l = 0, u = h.length; u > l; l++)
										a = h[l], s.setFrame(r, a.time, a.angle), o.SkeletonJson.readCurve(s, r, a), r++;
									c.push(s),
									d = Math.max(d, s.frames[2 * s.getFrameCount() - 2])
								} else {
									if ("translate" != n && "scale" != n)
										throw "Invalid timeline type for a bone: " + n + " (" + m + ")";
									var v = 1;
									for ("scale" == n ? s = new o.ScaleTimeline(h.length) : (s = new o.TranslateTimeline(h.length), v = this.scale), s.boneIndex = g, r = 0, l = 0, u = h.length; u > l; l++) {
										a = h[l];
										var y = (a.x || 0) * v,
										x = (a.y || 0) * v;
										s.setFrame(r, a.time, y, x),
										o.SkeletonJson.readCurve(s, r, a),
										r++
									}
									c.push(s),
									d = Math.max(d, s.frames[3 * s.getFrameCount() - 3])
								}
					}
				var b = t.slots;
				for (var T in b)
					if (b.hasOwnProperty(T)) {
						var w = b[T],
						S = i.findSlotIndex(T);
						for (n in w)
							if (w.hasOwnProperty(n))
								if (h = w[n], "color" == n) {
									for (s = new o.ColorTimeline(h.length), s.slotIndex = S, r = 0, l = 0, u = h.length; u > l; l++) {
										a = h[l];
										var C = a.color,
										A = o.SkeletonJson.toColor(C, 0),
										M = o.SkeletonJson.toColor(C, 1),
										E = o.SkeletonJson.toColor(C, 2),
										R = o.SkeletonJson.toColor(C, 3);
										s.setFrame(r, a.time, A, M, E, R),
										o.SkeletonJson.readCurve(s, r, a),
										r++
									}
									c.push(s),
									d = Math.max(d, s.frames[5 * s.getFrameCount() - 5])
								} else {
									if ("attachment" != n)
										throw "Invalid timeline type for a slot: " + n + " (" + T + ")";
									for (s = new o.AttachmentTimeline(h.length), s.slotIndex = S, r = 0, l = 0, u = h.length; u > l; l++)
										a = h[l], s.setFrame(r++, a.time, a.name);
									c.push(s),
									d = Math.max(d, s.frames[s.getFrameCount() - 1])
								}
					}
				i.animations.push(new o.Animation(e, c, d))
			}
		},
		o.SkeletonJson.readCurve = function (e, t, i) {
			var r = i.curve;
			r && ("stepped" == r ? e.curves.setStepped(t) : r instanceof Array && e.curves.setCurve(t, r[0], r[1], r[2], r[3]))
		},
		o.SkeletonJson.toColor = function (e, t) {
			if (8 != e.length)
				throw "Color hexidecimal length must be 8, recieved: " + e;
			return parseInt(e.substring(2 * t, 2), 16) / 255
		},
		o.Atlas = function (e, t) {
			this.textureLoader = t,
			this.pages = [],
			this.regions = [];
			var i = new o.AtlasReader(e),
			r = [];
			r.length = 4;
			for (var s = null; ; ) {
				var n = i.readLine();
				if (null == n)
					break;
				if (n = i.trim(n), n.length)
					if (s) {
						var a = new o.AtlasRegion;
						a.name = n,
						a.page = s,
						a.rotate = "true" == i.readValue(),
						i.readTuple(r);
						var h = parseInt(r[0], 10),
						l = parseInt(r[1], 10);
						i.readTuple(r);
						var u = parseInt(r[0], 10),
						c = parseInt(r[1], 10);
						a.u = h / s.width,
						a.v = l / s.height,
						a.rotate ? (a.u2 = (h + c) / s.width, a.v2 = (l + u) / s.height) : (a.u2 = (h + u) / s.width, a.v2 = (l + c) / s.height),
						a.x = h,
						a.y = l,
						a.width = Math.abs(u),
						a.height = Math.abs(c),
						4 == i.readTuple(r) && (a.splits = [parseInt(r[0], 10), parseInt(r[1], 10), parseInt(r[2], 10), parseInt(r[3], 10)], 4 == i.readTuple(r) && (a.pads = [parseInt(r[0], 10), parseInt(r[1], 10), parseInt(r[2], 10), parseInt(r[3], 10)], i.readTuple(r))),
						a.originalWidth = parseInt(r[0], 10),
						a.originalHeight = parseInt(r[1], 10),
						i.readTuple(r),
						a.offsetX = parseInt(r[0], 10),
						a.offsetY = parseInt(r[1], 10),
						a.index = parseInt(i.readValue(), 10),
						this.regions.push(a)
					} else {
						s = new o.AtlasPage,
						s.name = n,
						s.format = o.Atlas.Format[i.readValue()],
						i.readTuple(r),
						s.minFilter = o.Atlas.TextureFilter[r[0]],
						s.magFilter = o.Atlas.TextureFilter[r[1]];
						var d = i.readValue();
						s.uWrap = o.Atlas.TextureWrap.clampToEdge,
						s.vWrap = o.Atlas.TextureWrap.clampToEdge,
						"x" == d ? s.uWrap = o.Atlas.TextureWrap.repeat : "y" == d ? s.vWrap = o.Atlas.TextureWrap.repeat : "xy" == d && (s.uWrap = s.vWrap = o.Atlas.TextureWrap.repeat),
						t.load(s, n),
						this.pages.push(s)
					}
				else
					s = null
			}
		},
		o.Atlas.prototype = {
			findRegion : function (e) {
				for (var t = this.regions, i = 0, r = t.length; r > i; i++)
					if (t[i].name == e)
						return t[i];
				return null
			},
			dispose : function () {
				for (var e = this.pages, t = 0, i = e.length; i > t; t++)
					this.textureLoader.unload(e[t].rendererObject)
			},
			updateUVs : function (e) {
				for (var t = this.regions, i = 0, r = t.length; r > i; i++) {
					var s = t[i];
					s.page == e && (s.u = s.x / e.width, s.v = s.y / e.height, s.rotate ? (s.u2 = (s.x + s.height) / e.width, s.v2 = (s.y + s.width) / e.height) : (s.u2 = (s.x + s.width) / e.width, s.v2 = (s.y + s.height) / e.height))
				}
			}
		},
		o.Atlas.Format = {
			alpha : 0,
			intensity : 1,
			luminanceAlpha : 2,
			rgb565 : 3,
			rgba4444 : 4,
			rgb888 : 5,
			rgba8888 : 6
		},
		o.Atlas.TextureFilter = {
			nearest : 0,
			linear : 1,
			mipMap : 2,
			mipMapNearestNearest : 3,
			mipMapLinearNearest : 4,
			mipMapNearestLinear : 5,
			mipMapLinearLinear : 6
		},
		o.Atlas.TextureWrap = {
			mirroredRepeat : 0,
			clampToEdge : 1,
			repeat : 2
		},
		o.AtlasPage = function () {},
		o.AtlasPage.prototype = {
			name : null,
			format : null,
			minFilter : null,
			magFilter : null,
			uWrap : null,
			vWrap : null,
			rendererObject : null,
			width : 0,
			height : 0
		},
		o.AtlasRegion = function () {},
		o.AtlasRegion.prototype = {
			page : null,
			name : null,
			x : 0,
			y : 0,
			width : 0,
			height : 0,
			u : 0,
			v : 0,
			u2 : 0,
			v2 : 0,
			offsetX : 0,
			offsetY : 0,
			originalWidth : 0,
			originalHeight : 0,
			index : 0,
			rotate : !1,
			splits : null,
			pads : null
		},
		o.AtlasReader = function (e) {
			this.lines = e.split(/\r\n|\r|\n/)
		},
		o.AtlasReader.prototype = {
			index : 0,
			trim : function (e) {
				return e.replace(/^\s+|\s+$/g, "")
			},
			readLine : function () {
				return this.index >= this.lines.length ? null : this.lines[this.index++]
			},
			readValue : function () {
				var e = this.readLine(),
				t = e.indexOf(":");
				if (-1 == t)
					throw "Invalid line: " + e;
				return this.trim(e.substring(t + 1))
			},
			readTuple : function (e) {
				var t = this.readLine(),
				i = t.indexOf(":");
				if (-1 == i)
					throw "Invalid line: " + t;
				for (var r = 0, s = i + 1; 3 > r; r++) {
					var n = t.indexOf(",", s);
					if (-1 == n) {
						if (!r)
							throw "Invalid line: " + t;
						break
					}
					e[r] = this.trim(t.substr(s, n - s)),
					s = n + 1
				}
				return e[r] = this.trim(t.substring(s)),
				r + 1
			}
		},
		o.AtlasAttachmentLoader = function (e) {
			this.atlas = e
		},
		o.AtlasAttachmentLoader.prototype = {
			newAttachment : function (e, t, i) {
				switch (t) {
				case o.AttachmentType.region:
					var r = this.atlas.findRegion(i);
					if (!r)
						throw "Region not found in atlas: " + i + " (" + t + ")";
					var s = new o.RegionAttachment(i);
					return s.rendererObject = r,
					s.setUVs(r.u, r.v, r.u2, r.v2, r.rotate),
					s.regionOffsetX = r.offsetX,
					s.regionOffsetY = r.offsetY,
					s.regionWidth = r.width,
					s.regionHeight = r.height,
					s.regionOriginalWidth = r.originalWidth,
					s.regionOriginalHeight = r.originalHeight,
					s
				}
				throw "Unknown attachment type: " + t
			}
		},
		o.Bone.yDown = !0,
		t.AnimCache = {},
		t.Spine = function (e) {
			if (t.DisplayObjectContainer.call(this), this.spineData = t.AnimCache[e], !this.spineData)
				throw new Error("Spine data must be preloaded using PIXI.SpineLoader or PIXI.AssetLoader: " + e);
			this.skeleton = new o.Skeleton(this.spineData),
			this.skeleton.updateWorldTransform(),
			this.stateData = new o.AnimationStateData(this.spineData),
			this.state = new o.AnimationState(this.stateData),
			this.slotContainers = [];
			for (var i = 0, r = this.skeleton.drawOrder.length; r > i; i++) {
				var s = this.skeleton.drawOrder[i],
				n = s.attachment,
				a = new t.DisplayObjectContainer;
				if (this.slotContainers.push(a), this.addChild(a), n instanceof o.RegionAttachment) {
					var h = n.rendererObject.name,
					l = this.createSprite(s, n.rendererObject);
					s.currentSprite = l,
					s.currentSpriteName = h,
					a.addChild(l)
				}
			}
		},
		t.Spine.prototype = Object.create(t.DisplayObjectContainer.prototype),
		t.Spine.prototype.constructor = t.Spine,
		t.Spine.prototype.updateTransform = function () {
			this.lastTime = this.lastTime || Date.now();
			var e = .001 * (Date.now() - this.lastTime);
			this.lastTime = Date.now(),
			this.state.update(e),
			this.state.apply(this.skeleton),
			this.skeleton.updateWorldTransform();
			for (var i = this.skeleton.drawOrder, r = 0, s = i.length; s > r; r++) {
				var n = i[r],
				a = n.attachment,
				h = this.slotContainers[r];
				if (a instanceof o.RegionAttachment) {
					if (a.rendererObject && (!n.currentSpriteName || n.currentSpriteName != a.name)) {
						var l = a.rendererObject.name;
						if (void 0 !== n.currentSprite && (n.currentSprite.visible = !1), n.sprites = n.sprites || {}, void 0 !== n.sprites[l])
							n.sprites[l].visible = !0;
						else {
							var u = this.createSprite(n, a.rendererObject);
							h.addChild(u)
						}
						n.currentSprite = n.sprites[l],
						n.currentSpriteName = l
					}
					h.visible = !0;
					var c = n.bone;
					h.position.x = c.worldX + a.x * c.m00 + a.y * c.m01,
					h.position.y = c.worldY + a.x * c.m10 + a.y * c.m11,
					h.scale.x = c.worldScaleX,
					h.scale.y = c.worldScaleY,
					h.rotation =  - (n.bone.worldRotation * Math.PI / 180)
				} else
					h.visible = !1
			}
			t.DisplayObjectContainer.prototype.updateTransform.call(this)
		},
		t.Spine.prototype.createSprite = function (e, i) {
			var r = t.TextureCache[i.name] ? i.name : i.name + ".png",
			s = new t.Sprite(t.Texture.fromFrame(r));
			return s.scale = i.scale,
			s.rotation = i.rotation,
			s.anchor.x = s.anchor.y = .5,
			e.sprites = e.sprites || {},
			e.sprites[i.name] = s,
			s
		},
		t.BaseTextureCache = {},
		t.texturesToUpdate = [],
		t.texturesToDestroy = [],
		t.BaseTextureCacheIdGenerator = 0,
		t.BaseTexture = function (e, i) {
			if (t.EventTarget.call(this), this.width = 100, this.height = 100, this.scaleMode = i || t.scaleModes.DEFAULT, this.hasLoaded = !1, this.source = e, e) {
				if (this.source.complete || this.source.getContext)
					this.hasLoaded = !0, this.width = this.source.width, this.height = this.source.height, t.texturesToUpdate.push(this);
				else {
					var r = this;
					this.source.onload = function () {
						r.hasLoaded = !0,
						r.width = r.source.width,
						r.height = r.source.height,
						t.texturesToUpdate.push(r),
						r.dispatchEvent({
							type : "loaded",
							content : r
						})
					}
				}
				this.imageUrl = null,
				this._powerOf2 = !1,
				this.id = t.BaseTextureCacheIdGenerator++,
				this._glTextures = []
			}
		},
		t.BaseTexture.prototype.constructor = t.BaseTexture,
		t.BaseTexture.prototype.destroy = function () {
			this.imageUrl && (delete t.BaseTextureCache[this.imageUrl], this.imageUrl = null, this.source.src = null),
			this.source = null,
			t.texturesToDestroy.push(this)
		},
		t.BaseTexture.prototype.updateSourceImage = function (e) {
			this.hasLoaded = !1,
			this.source.src = null,
			this.source.src = e
		},
		t.BaseTexture.fromImage = function (e, i, r) {
			var s = t.BaseTextureCache[e];
			if (i = !i, !s) {
				var n = new Image;
				i && (n.crossOrigin = ""),
				n.src = e,
				s = new t.BaseTexture(n, r),
				s.imageUrl = e,
				t.BaseTextureCache[e] = s
			}
			return s
		},
		t.BaseTexture.fromCanvas = function (e, i) {
			e._pixiId || (e._pixiId = "canvas_" + t.TextureCacheIdGenerator++);
			var r = t.BaseTextureCache[e._pixiId];
			return r || (r = new t.BaseTexture(e, i), t.BaseTextureCache[e._pixiId] = r),
			r
		},
		t.TextureCache = {},
		t.FrameCache = {},
		t.TextureCacheIdGenerator = 0,
		t.Texture = function (e, i) {
			if (t.EventTarget.call(this), i || (this.noFrame = !0, i = new t.Rectangle(0, 0, 1, 1)), e instanceof t.Texture && (e = e.baseTexture), this.baseTexture = e, this.frame = i, this.trim = null, this.scope = this, e.hasLoaded)
				this.noFrame && (i = new t.Rectangle(0, 0, e.width, e.height)), this.setFrame(i);
			else {
				var r = this;
				e.addEventListener("loaded", function () {
					r.onBaseTextureLoaded()
				})
			}
		},
		t.Texture.prototype.constructor = t.Texture,
		t.Texture.prototype.onBaseTextureLoaded = function () {
			var e = this.baseTexture;
			e.removeEventListener("loaded", this.onLoaded),
			this.noFrame && (this.frame = new t.Rectangle(0, 0, e.width, e.height)),
			this.setFrame(this.frame),
			this.scope.dispatchEvent({
				type : "update",
				content : this
			})
		},
		t.Texture.prototype.destroy = function (e) {
			e && this.baseTexture.destroy()
		},
		t.Texture.prototype.setFrame = function (e) {
			if (this.frame = e, this.width = e.width, this.height = e.height, e.x + e.width > this.baseTexture.width || e.y + e.height > this.baseTexture.height)
				throw new Error("Texture Error: frame does not fit inside the base Texture dimensions " + this);
			this.updateFrame = !0,
			t.Texture.frameUpdates.push(this)
		},
		t.Texture.prototype._updateWebGLuvs = function () {
			this._uvs || (this._uvs = new t.TextureUvs);
			var e = this.frame,
			i = this.baseTexture.width,
			r = this.baseTexture.height;
			this._uvs.x0 = e.x / i,
			this._uvs.y0 = e.y / r,
			this._uvs.x1 = (e.x + e.width) / i,
			this._uvs.y1 = e.y / r,
			this._uvs.x2 = (e.x + e.width) / i,
			this._uvs.y2 = (e.y + e.height) / r,
			this._uvs.x3 = e.x / i,
			this._uvs.y3 = (e.y + e.height) / r
		},
		t.Texture.fromImage = function (e, i, r) {
			var s = t.TextureCache[e];
			return s || (s = new t.Texture(t.BaseTexture.fromImage(e, i, r)), t.TextureCache[e] = s),
			s
		},
		t.Texture.fromFrame = function (e) {
			var i = t.TextureCache[e];
			if (!i)
				throw new Error('The frameId "' + e + '" does not exist in the texture cache ');
			return i
		},
		t.Texture.fromCanvas = function (e, i) {
			var r = t.BaseTexture.fromCanvas(e, i);
			return new t.Texture(r)
		},
		t.Texture.addTextureToCache = function (e, i) {
			t.TextureCache[i] = e
		},
		t.Texture.removeTextureFromCache = function (e) {
			var i = t.TextureCache[e];
			return t.TextureCache[e] = null,
			i
		},
		t.Texture.frameUpdates = [],
		t.TextureUvs = function () {
			this.x0 = 0,
			this.y0 = 0,
			this.x1 = 0,
			this.y1 = 0,
			this.x2 = 0,
			this.y2 = 0,
			this.x3 = 0,
			this.y4 = 0
		},
		t.RenderTexture = function (e, i, r) {
			if (t.EventTarget.call(this), this.width = e || 100, this.height = i || 100, this.frame = new t.Rectangle(0, 0, this.width, this.height), this.baseTexture = new t.BaseTexture, this.baseTexture.width = this.width, this.baseTexture.height = this.height, this.baseTexture._glTextures = [], this.baseTexture.hasLoaded = !0, this.renderer = r || t.defaultRenderer, this.renderer.type === t.WEBGL_RENDERER) {
				var s = this.renderer.gl;
				this.textureBuffer = new t.FilterTexture(s, this.width, this.height),
				this.baseTexture._glTextures[s.id] = this.textureBuffer.texture,
				this.render = this.renderWebGL,
				this.projection = new t.Point(this.width / 2, -this.height / 2)
			} else
				this.render = this.renderCanvas, this.textureBuffer = new t.CanvasBuffer(this.width, this.height), this.baseTexture.source = this.textureBuffer.canvas;
			t.Texture.frameUpdates.push(this)
		},
		t.RenderTexture.prototype = Object.create(t.Texture.prototype),
		t.RenderTexture.prototype.constructor = t.RenderTexture,
		t.RenderTexture.prototype.resize = function (e, i) {
			if (this.width = e, this.height = i, this.frame.width = this.width, this.frame.height = this.height, this.renderer.type === t.WEBGL_RENDERER) {
				this.projection.x = this.width / 2,
				this.projection.y = -this.height / 2;
				var r = this.renderer.gl;
				r.bindTexture(r.TEXTURE_2D, this.baseTexture._glTextures[r.id]),
				r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, this.width, this.height, 0, r.RGBA, r.UNSIGNED_BYTE, null)
			} else
				this.textureBuffer.resize(this.width, this.height);
			t.Texture.frameUpdates.push(this)
		},
		t.RenderTexture.prototype.renderWebGL = function (e, i, r) {
			var s = this.renderer.gl;
			s.colorMask(!0, !0, !0, !0),
			s.viewport(0, 0, this.width, this.height),
			s.bindFramebuffer(s.FRAMEBUFFER, this.textureBuffer.frameBuffer),
			r && this.textureBuffer.clear();
			var n = e.children,
			a = e.worldTransform;
			e.worldTransform = t.RenderTexture.tempMatrix,
			e.worldTransform.d = -1,
			e.worldTransform.ty = -2 * this.projection.y,
			i && (e.worldTransform.tx = i.x, e.worldTransform.ty -= i.y);
			for (var o = 0, h = n.length; h > o; o++)
				n[o].updateTransform();
			t.WebGLRenderer.updateTextures(),
			this.renderer.renderDisplayObject(e, this.projection, this.textureBuffer.frameBuffer),
			e.worldTransform = a
		},
		t.RenderTexture.prototype.renderCanvas = function (e, i, r) {
			var s = e.children;
			e.worldTransform = t.RenderTexture.tempMatrix,
			i && (e.worldTransform.tx = i.x, e.worldTransform.ty = i.y);
			for (var n = s.length - 1; n >= 0; n--)
				s[n].updateTransform();
			r && this.textureBuffer.clear();
			var a = this.textureBuffer.context;
			this.renderer.renderDisplayObject(e, a),
			a.setTransform(1, 0, 0, 1, 0, 0)
		},
		t.RenderTexture.tempMatrix = new t.Matrix,
		t.AssetLoader = function (e, i) {
			t.EventTarget.call(this),
			this.assetURLs = e,
			this.crossorigin = i,
			this.loadersByType = {
				jpg : t.ImageLoader,
				jpeg : t.ImageLoader,
				png : t.ImageLoader,
				gif : t.ImageLoader,
				json : t.JsonLoader,
				atlas : t.AtlasLoader,
				anim : t.SpineLoader,
				xml : t.BitmapFontLoader,
				fnt : t.BitmapFontLoader
			}
		},
		t.AssetLoader.prototype.constructor = t.AssetLoader,
		t.AssetLoader.prototype._getDataType = function (e) {
			var t = "data:",
			i = e.slice(0, t.length).toLowerCase();
			if (i === t) {
				var r = e.slice(t.length),
				s = r.indexOf(",");
				if (-1 === s)
					return null;
				var n = r.slice(0, s).split(";")[0];
				return n && "text/plain" !== n.toLowerCase() ? n.split("/").pop().toLowerCase() : "txt"
			}
			return null
		},
		t.AssetLoader.prototype.load = function () {
			function e(e) {
				t.onAssetLoaded(e.content)
			}
			var t = this;
			this.loadCount = this.assetURLs.length;
			for (var i = 0; i < this.assetURLs.length; i++) {
				var r = this.assetURLs[i],
				s = this._getDataType(r);
				s || (s = r.split("?").shift().split(".").pop().toLowerCase());
				var n = this.loadersByType[s];
				if (!n)
					throw new Error(s + " is an unsupported file type");
				var a = new n(r, this.crossorigin);
				a.addEventListener("loaded", e),
				a.load()
			}
		},
		t.AssetLoader.prototype.onAssetLoaded = function (e) {
			this.loadCount--,
			this.dispatchEvent({
				type : "onProgress",
				content : this,
				loader : e
			}),
			this.onProgress && this.onProgress(e),
			this.loadCount || (this.dispatchEvent({
					type : "onComplete",
					content : this
				}), this.onComplete && this.onComplete())
		},
		t.JsonLoader = function (e, i) {
			t.EventTarget.call(this),
			this.url = e,
			this.crossorigin = i,
			this.baseUrl = e.replace(/[^\/]*$/, ""),
			this.loaded = !1
		},
		t.JsonLoader.prototype.constructor = t.JsonLoader,
		t.JsonLoader.prototype.load = function () {
			this.ajaxRequest = new t.AjaxRequest(this.crossorigin);
			var e = this;
			this.ajaxRequest.onreadystatechange = function () {
				e.onJSONLoaded()
			},
			this.ajaxRequest.open("GET", this.url, !0),
			this.ajaxRequest.overrideMimeType && this.ajaxRequest.overrideMimeType("application/json"),
			this.ajaxRequest.send(null)
		},
		t.JsonLoader.prototype.onJSONLoaded = function () {
			if (4 === this.ajaxRequest.readyState)
				if (200 === this.ajaxRequest.status || -1 === window.location.protocol.indexOf("http"))
					if (this.json = JSON.parse(this.ajaxRequest.responseText), this.json.frames) {
						var e = this,
						i = this.baseUrl + this.json.meta.image,
						r = new t.ImageLoader(i, this.crossorigin),
						s = this.json.frames;
						this.texture = r.texture.baseTexture,
						r.addEventListener("loaded", function () {
							e.onLoaded()
						});
						for (var n in s) {
							var a = s[n].frame;
							if (a && (t.TextureCache[n] = new t.Texture(this.texture, {
											x : a.x,
											y : a.y,
											width : a.w,
											height : a.h
										}), s[n].trimmed)) {
								var h = t.TextureCache[n],
								l = s[n].sourceSize,
								u = s[n].spriteSourceSize;
								h.trim = new t.Rectangle(u.x, u.y, l.w, l.h)
							}
						}
						r.load()
					} else if (this.json.bones) {
						var c = new o.SkeletonJson,
						d = c.readSkeletonData(this.json);
						t.AnimCache[this.url] = d,
						this.onLoaded()
					} else
						this.onLoaded();
				else
					this.onError()
		},
		t.JsonLoader.prototype.onLoaded = function () {
			this.loaded = !0,
			this.dispatchEvent({
				type : "loaded",
				content : this
			})
		},
		t.JsonLoader.prototype.onError = function () {
			this.dispatchEvent({
				type : "error",
				content : this
			})
		},
		t.AtlasLoader = function (e, i) {
			t.EventTarget.call(this),
			this.url = e,
			this.baseUrl = e.replace(/[^\/]*$/, ""),
			this.crossorigin = i,
			this.loaded = !1
		},
		t.AtlasLoader.constructor = t.AtlasLoader,
		t.AtlasLoader.prototype.load = function () {
			this.ajaxRequest = new t.AjaxRequest,
			this.ajaxRequest.onreadystatechange = this.onAtlasLoaded.bind(this),
			this.ajaxRequest.open("GET", this.url, !0),
			this.ajaxRequest.overrideMimeType && this.ajaxRequest.overrideMimeType("application/json"),
			this.ajaxRequest.send(null)
		},
		t.AtlasLoader.prototype.onAtlasLoaded = function () {
			if (4 === this.ajaxRequest.readyState)
				if (200 === this.ajaxRequest.status || -1 === window.location.href.indexOf("http")) {
					this.atlas = {
						meta : {
							image : []
						},
						frames : []
					};
					var e = this.ajaxRequest.responseText.split(/\r?\n/),
					i = -3,
					r = 0,
					s = null,
					n = !1,
					a = 0,
					o = 0,
					h = this.onLoaded.bind(this);
					for (a = 0; a < e.length; a++)
						if (e[a] = e[a].replace(/^\s+|\s+$/g, ""), "" === e[a] && (n = a + 1), e[a].length > 0) {
							if (n === a)
								this.atlas.meta.image.push(e[a]), r = this.atlas.meta.image.length - 1, this.atlas.frames.push({}), i = -3;
							else if (i > 0)
								if (i % 7 === 1)
									null != s && (this.atlas.frames[r][s.name] = s), s = {
										name : e[a],
										frame : {}

									};
								else {
									var l = e[a].split(" ");
									if (i % 7 === 3)
										s.frame.x = Number(l[1].replace(",", "")), s.frame.y = Number(l[2]);
									else if (i % 7 === 4)
										s.frame.w = Number(l[1].replace(",", "")), s.frame.h = Number(l[2]);
									else if (i % 7 === 5) {
										var u = {
											x : 0,
											y : 0,
											w : Number(l[1].replace(",", "")),
											h : Number(l[2])
										};
										u.w > s.frame.w || u.h > s.frame.h ? (s.trimmed = !0, s.realSize = u) : s.trimmed = !1
									}
								}
							i++
						}
					if (null != s && (this.atlas.frames[r][s.name] = s), this.atlas.meta.image.length > 0) {
						for (this.images = [], o = 0; o < this.atlas.meta.image.length; o++) {
							var c = this.baseUrl + this.atlas.meta.image[o],
							d = this.atlas.frames[o];
							this.images.push(new t.ImageLoader(c, this.crossorigin));
							for (a in d) {
								var p = d[a].frame;
								p && (t.TextureCache[a] = new t.Texture(this.images[o].texture.baseTexture, {
											x : p.x,
											y : p.y,
											width : p.w,
											height : p.h
										}), d[a].trimmed && (t.TextureCache[a].realSize = d[a].realSize, t.TextureCache[a].trim.x = 0, t.TextureCache[a].trim.y = 0))
							}
						}
						for (this.currentImageId = 0, o = 0; o < this.images.length; o++)
							this.images[o].addEventListener("loaded", h);
						this.images[this.currentImageId].load()
					} else
						this.onLoaded()
				} else
					this.onError()
		},
		t.AtlasLoader.prototype.onLoaded = function () {
			this.images.length - 1 > this.currentImageId ? (this.currentImageId++, this.images[this.currentImageId].load()) : (this.loaded = !0, this.dispatchEvent({
					type : "loaded",
					content : this
				}))
		},
		t.AtlasLoader.prototype.onError = function () {
			this.dispatchEvent({
				type : "error",
				content : this
			})
		},
		t.SpriteSheetLoader = function (e, i) {
			t.EventTarget.call(this),
			this.url = e,
			this.crossorigin = i,
			this.baseUrl = e.replace(/[^\/]*$/, ""),
			this.texture = null,
			this.frames = {}

		},
		t.SpriteSheetLoader.prototype.constructor = t.SpriteSheetLoader,
		t.SpriteSheetLoader.prototype.load = function () {
			var e = this,
			i = new t.JsonLoader(this.url, this.crossorigin);
			i.addEventListener("loaded", function (t) {
				e.json = t.content.json,
				e.onLoaded()
			}),
			i.load()
		},
		t.SpriteSheetLoader.prototype.onLoaded = function () {
			this.dispatchEvent({
				type : "loaded",
				content : this
			})
		},
		t.ImageLoader = function (e, i) {
			t.EventTarget.call(this),
			this.texture = t.Texture.fromImage(e, i),
			this.frames = []
		},
		t.ImageLoader.prototype.constructor = t.ImageLoader,
		t.ImageLoader.prototype.load = function () {
			if (this.texture.baseTexture.hasLoaded)
				this.onLoaded();
			else {
				var e = this;
				this.texture.baseTexture.addEventListener("loaded", function () {
					e.onLoaded()
				})
			}
		},
		t.ImageLoader.prototype.onLoaded = function () {
			this.dispatchEvent({
				type : "loaded",
				content : this
			})
		},
		t.ImageLoader.prototype.loadFramedSpriteSheet = function (e, i, r) {
			this.frames = [];
			for (var s = Math.floor(this.texture.width / e), n = Math.floor(this.texture.height / i), a = 0, o = 0; n > o; o++)
				for (var h = 0; s > h; h++, a++) {
					var l = new t.Texture(this.texture, {
							x : h * e,
							y : o * i,
							width : e,
							height : i
						});
					this.frames.push(l),
					r && (t.TextureCache[r + "-" + a] = l)
				}
			if (this.texture.baseTexture.hasLoaded)
				this.onLoaded();
			else {
				var u = this;
				this.texture.baseTexture.addEventListener("loaded", function () {
					u.onLoaded()
				})
			}
		},
		t.BitmapFontLoader = function (e, i) {
			t.EventTarget.call(this),
			this.url = e,
			this.crossorigin = i,
			this.baseUrl = e.replace(/[^\/]*$/, ""),
			this.texture = null
		},
		t.BitmapFontLoader.prototype.constructor = t.BitmapFontLoader,
		t.BitmapFontLoader.prototype.load = function () {
			this.ajaxRequest = new t.AjaxRequest;
			var e = this;
			this.ajaxRequest.onreadystatechange = function () {
				e.onXMLLoaded()
			},
			this.ajaxRequest.open("GET", this.url, !0),
			this.ajaxRequest.overrideMimeType && this.ajaxRequest.overrideMimeType("application/xml"),
			this.ajaxRequest.send(null)
		},
		t.BitmapFontLoader.prototype.onXMLLoaded = function () {
			if (4 === this.ajaxRequest.readyState && (200 === this.ajaxRequest.status || -1 === window.location.protocol.indexOf("http"))) {
				var e = this.ajaxRequest.responseXML;
				if (!e || /MSIE 9/i.test(navigator.userAgent) || navigator.isCocoonJS)
					if ("function" == typeof window.DOMParser) {
						var i = new DOMParser;
						e = i.parseFromString(this.ajaxRequest.responseText, "text/xml")
					} else {
						var r = document.createElement("div");
						r.innerHTML = this.ajaxRequest.responseText,
						e = r
					}
				var s = this.baseUrl + e.getElementsByTagName("page")[0].getAttribute("file"),
				n = new t.ImageLoader(s, this.crossorigin);
				this.texture = n.texture.baseTexture;
				var a = {},
				o = e.getElementsByTagName("info")[0],
				h = e.getElementsByTagName("common")[0];
				a.font = o.getAttribute("face"),
				a.size = parseInt(o.getAttribute("size"), 10),
				a.lineHeight = parseInt(h.getAttribute("lineHeight"), 10),
				a.chars = {};
				for (var l = e.getElementsByTagName("char"), u = 0; u < l.length; u++) {
					var c = parseInt(l[u].getAttribute("id"), 10),
					d = new t.Rectangle(parseInt(l[u].getAttribute("x"), 10), parseInt(l[u].getAttribute("y"), 10), parseInt(l[u].getAttribute("width"), 10), parseInt(l[u].getAttribute("height"), 10));
					a.chars[c] = {
						xOffset : parseInt(l[u].getAttribute("xoffset"), 10),
						yOffset : parseInt(l[u].getAttribute("yoffset"), 10),
						xAdvance : parseInt(l[u].getAttribute("xadvance"), 10),
						kerning : {},
						texture : t.TextureCache[c] = new t.Texture(this.texture, d)
					}
				}
				var p = e.getElementsByTagName("kerning");
				for (u = 0; u < p.length; u++) {
					var m = parseInt(p[u].getAttribute("first"), 10),
					g = parseInt(p[u].getAttribute("second"), 10),
					f = parseInt(p[u].getAttribute("amount"), 10);
					a.chars[g].kerning[m] = f
				}
				t.BitmapText.fonts[a.font] = a;
				var v = this;
				n.addEventListener("loaded", function () {
					v.onLoaded()
				}),
				n.load()
			}
		},
		t.BitmapFontLoader.prototype.onLoaded = function () {
			this.dispatchEvent({
				type : "loaded",
				content : this
			})
		},
		t.SpineLoader = function (e, i) {
			t.EventTarget.call(this),
			this.url = e,
			this.crossorigin = i,
			this.loaded = !1
		},
		t.SpineLoader.prototype.constructor = t.SpineLoader,
		t.SpineLoader.prototype.load = function () {
			var e = this,
			i = new t.JsonLoader(this.url, this.crossorigin);
			i.addEventListener("loaded", function (t) {
				e.json = t.content.json,
				e.onLoaded()
			}),
			i.load()
		},
		t.SpineLoader.prototype.onLoaded = function () {
			this.loaded = !0,
			this.dispatchEvent({
				type : "loaded",
				content : this
			})
		},
		t.AbstractFilter = function (e, t) {
			this.passes = [this],
			this.shaders = [],
			this.dirty = !0,
			this.padding = 0,
			this.uniforms = t || {},
			this.fragmentSrc = e || []
		},
		t.AlphaMaskFilter = function (e) {
			t.AbstractFilter.call(this),
			this.passes = [this],
			e.baseTexture._powerOf2 = !0,
			this.uniforms = {
				mask : {
					type : "sampler2D",
					value : e
				},
				mapDimensions : {
					type : "2f",
					value : {
						x : 1,
						y : 5112
					}
				},
				dimensions : {
					type : "4fv",
					value : [0, 0, 0, 0]
				}
			},
			e.baseTexture.hasLoaded ? (this.uniforms.mask.value.x = e.width, this.uniforms.mask.value.y = e.height) : (this.boundLoadedFunction = this.onTextureLoaded.bind(this), e.baseTexture.on("loaded", this.boundLoadedFunction)),
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D mask;", "uniform sampler2D uSampler;", "uniform vec2 offset;", "uniform vec4 dimensions;", "uniform vec2 mapDimensions;", "void main(void) {", "   vec2 mapCords = vTextureCoord.xy;", "   mapCords += (dimensions.zw + offset)/ dimensions.xy ;", "   mapCords.y *= -1.0;", "   mapCords.y += 1.0;", "   mapCords *= dimensions.xy / mapDimensions;", "   vec4 original =  texture2D(uSampler, vTextureCoord);", "   float maskAlpha =  texture2D(mask, mapCords).r;", "   original *= maskAlpha;", "   gl_FragColor =  original;", "}"]
		},
		t.AlphaMaskFilter.prototype = Object.create(t.AbstractFilter.prototype),
		t.AlphaMaskFilter.prototype.constructor = t.AlphaMaskFilter,
		t.AlphaMaskFilter.prototype.onTextureLoaded = function () {
			this.uniforms.mapDimensions.value.x = this.uniforms.mask.value.width,
			this.uniforms.mapDimensions.value.y = this.uniforms.mask.value.height,
			this.uniforms.mask.value.baseTexture.off("loaded", this.boundLoadedFunction)
		},
		Object.defineProperty(t.AlphaMaskFilter.prototype, "map", {
			get : function () {
				return this.uniforms.mask.value
			},
			set : function (e) {
				this.uniforms.mask.value = e
			}
		}),
		t.ColorMatrixFilter = function () {
			t.AbstractFilter.call(this),
			this.passes = [this],
			this.uniforms = {
				matrix : {
					type : "mat4",
					value : [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
				}
			},
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform float invert;", "uniform mat4 matrix;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord) * matrix;", "}"]
		},
		t.ColorMatrixFilter.prototype = Object.create(t.AbstractFilter.prototype),
		t.ColorMatrixFilter.prototype.constructor = t.ColorMatrixFilter,
		Object.defineProperty(t.ColorMatrixFilter.prototype, "matrix", {
			get : function () {
				return this.uniforms.matrix.value
			},
			set : function (e) {
				this.uniforms.matrix.value = e
			}
		}),
		t.GrayFilter = function () {
			t.AbstractFilter.call(this),
			this.passes = [this],
			this.uniforms = {
				gray : {
					type : "1f",
					value : 1
				}
			},
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D uSampler;", "uniform float gray;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord);", "   gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), gray);", "}"]
		},
		t.GrayFilter.prototype = Object.create(t.AbstractFilter.prototype),
		t.GrayFilter.prototype.constructor = t.GrayFilter,
		Object.defineProperty(t.GrayFilter.prototype, "gray", {
			get : function () {
				return this.uniforms.gray.value
			},
			set : function (e) {
				this.uniforms.gray.value = e
			}
		}),
		t.DisplacementFilter = function (e) {
			t.AbstractFilter.call(this),
			this.passes = [this],
			e.baseTexture._powerOf2 = !0,
			this.uniforms = {
				displacementMap : {
					type : "sampler2D",
					value : e
				},
				scale : {
					type : "2f",
					value : {
						x : 30,
						y : 30
					}
				},
				offset : {
					type : "2f",
					value : {
						x : 0,
						y : 0
					}
				},
				mapDimensions : {
					type : "2f",
					value : {
						x : 1,
						y : 5112
					}
				},
				dimensions : {
					type : "4fv",
					value : [0, 0, 0, 0]
				}
			},
			e.baseTexture.hasLoaded ? (this.uniforms.mapDimensions.value.x = e.width, this.uniforms.mapDimensions.value.y = e.height) : (this.boundLoadedFunction = this.onTextureLoaded.bind(this), e.baseTexture.on("loaded", this.boundLoadedFunction)),
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D displacementMap;", "uniform sampler2D uSampler;", "uniform vec2 scale;", "uniform vec2 offset;", "uniform vec4 dimensions;", "uniform vec2 mapDimensions;", "void main(void) {", "   vec2 mapCords = vTextureCoord.xy;", "   mapCords += (dimensions.zw + offset)/ dimensions.xy ;", "   mapCords.y *= -1.0;", "   mapCords.y += 1.0;", "   vec2 matSample = texture2D(displacementMap, mapCords).xy;", "   matSample -= 0.5;", "   matSample *= scale;", "   matSample /= mapDimensions;", "   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x + matSample.x, vTextureCoord.y + matSample.y));", "   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb, 1.0);", "   vec2 cord = vTextureCoord;", "}"]
		},
		t.DisplacementFilter.prototype = Object.create(t.AbstractFilter.prototype),
		t.DisplacementFilter.prototype.constructor = t.DisplacementFilter,
		t.DisplacementFilter.prototype.onTextureLoaded = function () {
			this.uniforms.mapDimensions.value.x = this.uniforms.displacementMap.value.width,
			this.uniforms.mapDimensions.value.y = this.uniforms.displacementMap.value.height,
			this.uniforms.displacementMap.value.baseTexture.off("loaded", this.boundLoadedFunction)
		},
		Object.defineProperty(t.DisplacementFilter.prototype, "map", {
			get : function () {
				return this.uniforms.displacementMap.value
			},
			set : function (e) {
				this.uniforms.displacementMap.value = e
			}
		}),
		Object.defineProperty(t.DisplacementFilter.prototype, "scale", {
			get : function () {
				return this.uniforms.scale.value
			},
			set : function (e) {
				this.uniforms.scale.value = e
			}
		}),
		Object.defineProperty(t.DisplacementFilter.prototype, "offset", {
			get : function () {
				return this.uniforms.offset.value
			},
			set : function (e) {
				this.uniforms.offset.value = e
			}
		}),
		t.PixelateFilter = function () {
			t.AbstractFilter.call(this),
			this.passes = [this],
			this.uniforms = {
				invert : {
					type : "1f",
					value : 0
				},
				dimensions : {
					type : "4fv",
					value : new Float32Array([1e4, 100, 10, 10])
				},
				pixelSize : {
					type : "2f",
					value : {
						x : 10,
						y : 10
					}
				}
			},
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform vec2 testDim;", "uniform vec4 dimensions;", "uniform vec2 pixelSize;", "uniform sampler2D uSampler;", "void main(void) {", "   vec2 coord = vTextureCoord;", "   vec2 size = dimensions.xy/pixelSize;", "   vec2 color = floor( ( vTextureCoord * size ) ) / size + pixelSize/dimensions.xy * 0.5;", "   gl_FragColor = texture2D(uSampler, color);", "}"]
		},
		t.PixelateFilter.prototype = Object.create(t.AbstractFilter.prototype),
		t.PixelateFilter.prototype.constructor = t.PixelateFilter,
		Object.defineProperty(t.PixelateFilter.prototype, "size", {
			get : function () {
				return this.uniforms.pixelSize.value
			},
			set : function (e) {
				this.dirty = !0,
				this.uniforms.pixelSize.value = e
			}
		}),
		t.BlurXFilter = function () {
			t.AbstractFilter.call(this),
			this.passes = [this],
			this.uniforms = {
				blur : {
					type : "1f",
					value : 1 / 512
				}
			},
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform float blur;", "uniform sampler2D uSampler;", "void main(void) {", "   vec4 sum = vec4(0.0);", "   sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;", "   gl_FragColor = sum;", "}"]
		},
		t.BlurXFilter.prototype = Object.create(t.AbstractFilter.prototype),
		t.BlurXFilter.prototype.constructor = t.BlurXFilter,
		Object.defineProperty(t.BlurXFilter.prototype, "blur", {
			get : function () {
				return this.uniforms.blur.value / (1 / 7e3)
			},
			set : function (e) {
				this.dirty = !0,
				this.uniforms.blur.value = 1 / 7e3 * e
			}
		}),
		t.BlurYFilter = function () {
			t.AbstractFilter.call(this),
			this.passes = [this],
			this.uniforms = {
				blur : {
					type : "1f",
					value : 1 / 512
				}
			},
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform float blur;", "uniform sampler2D uSampler;", "void main(void) {", "   vec4 sum = vec4(0.0);", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;", "   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;", "   gl_FragColor = sum;", "}"]
		},
		t.BlurYFilter.prototype = Object.create(t.AbstractFilter.prototype),
		t.BlurYFilter.prototype.constructor = t.BlurYFilter,
		Object.defineProperty(t.BlurYFilter.prototype, "blur", {
			get : function () {
				return this.uniforms.blur.value / (1 / 7e3)
			},
			set : function (e) {
				this.uniforms.blur.value = 1 / 7e3 * e
			}
		}),
		t.BlurFilter = function () {
			this.blurXFilter = new t.BlurXFilter,
			this.blurYFilter = new t.BlurYFilter,
			this.passes = [this.blurXFilter, this.blurYFilter]
		},
		Object.defineProperty(t.BlurFilter.prototype, "blur", {
			get : function () {
				return this.blurXFilter.blur
			},
			set : function (e) {
				this.blurXFilter.blur = this.blurYFilter.blur = e
			}
		}),
		Object.defineProperty(t.BlurFilter.prototype, "blurX", {
			get : function () {
				return this.blurXFilter.blur
			},
			set : function (e) {
				this.blurXFilter.blur = e
			}
		}),
		Object.defineProperty(t.BlurFilter.prototype, "blurY", {
			get : function () {
				return this.blurYFilter.blur
			},
			set : function (e) {
				this.blurYFilter.blur = e
			}
		}),
		t.InvertFilter = function () {
			t.AbstractFilter.call(this),
			this.passes = [this],
			this.uniforms = {
				invert : {
					type : "1f",
					value : 1
				}
			},
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform float invert;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord);", "   gl_FragColor.rgb = mix( (vec3(1)-gl_FragColor.rgb) * gl_FragColor.a, gl_FragColor.rgb, 1.0 - invert);", "}"]
		},
		t.InvertFilter.prototype = Object.create(t.AbstractFilter.prototype),
		t.InvertFilter.prototype.constructor = t.InvertFilter,
		Object.defineProperty(t.InvertFilter.prototype, "invert", {
			get : function () {
				return this.uniforms.invert.value
			},
			set : function (e) {
				this.uniforms.invert.value = e
			}
		}),
		t.SepiaFilter = function () {
			t.AbstractFilter.call(this),
			this.passes = [this],
			this.uniforms = {
				sepia : {
					type : "1f",
					value : 1
				}
			},
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform float sepia;", "uniform sampler2D uSampler;", "const mat3 sepiaMatrix = mat3(0.3588, 0.7044, 0.1368, 0.2990, 0.5870, 0.1140, 0.2392, 0.4696, 0.0912);", "void main(void) {", "   gl_FragColor = texture2D(uSampler, vTextureCoord);", "   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb * sepiaMatrix, sepia);", "}"]
		},
		t.SepiaFilter.prototype = Object.create(t.AbstractFilter.prototype),
		t.SepiaFilter.prototype.constructor = t.SepiaFilter,
		Object.defineProperty(t.SepiaFilter.prototype, "sepia", {
			get : function () {
				return this.uniforms.sepia.value
			},
			set : function (e) {
				this.uniforms.sepia.value = e
			}
		}),
		t.TwistFilter = function () {
			t.AbstractFilter.call(this),
			this.passes = [this],
			this.uniforms = {
				radius : {
					type : "1f",
					value : .5
				},
				angle : {
					type : "1f",
					value : 5
				},
				offset : {
					type : "2f",
					value : {
						x : .5,
						y : .5
					}
				}
			},
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform vec4 dimensions;", "uniform sampler2D uSampler;", "uniform float radius;", "uniform float angle;", "uniform vec2 offset;", "void main(void) {", "   vec2 coord = vTextureCoord - offset;", "   float distance = length(coord);", "   if (distance < radius) {", "       float ratio = (radius - distance) / radius;", "       float angleMod = ratio * ratio * angle;", "       float s = sin(angleMod);", "       float c = cos(angleMod);", "       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);", "   }", "   gl_FragColor = texture2D(uSampler, coord+offset);", "}"]
		},
		t.TwistFilter.prototype = Object.create(t.AbstractFilter.prototype),
		t.TwistFilter.prototype.constructor = t.TwistFilter,
		Object.defineProperty(t.TwistFilter.prototype, "offset", {
			get : function () {
				return this.uniforms.offset.value
			},
			set : function (e) {
				this.dirty = !0,
				this.uniforms.offset.value = e
			}
		}),
		Object.defineProperty(t.TwistFilter.prototype, "radius", {
			get : function () {
				return this.uniforms.radius.value
			},
			set : function (e) {
				this.dirty = !0,
				this.uniforms.radius.value = e
			}
		}),
		Object.defineProperty(t.TwistFilter.prototype, "angle", {
			get : function () {
				return this.uniforms.angle.value
			},
			set : function (e) {
				this.dirty = !0,
				this.uniforms.angle.value = e
			}
		}),
		t.ColorStepFilter = function () {
			t.AbstractFilter.call(this),
			this.passes = [this],
			this.uniforms = {
				step : {
					type : "1f",
					value : 5
				}
			},
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform sampler2D uSampler;", "uniform float step;", "void main(void) {", "   vec4 color = texture2D(uSampler, vTextureCoord);", "   color = floor(color * step) / step;", "   gl_FragColor = color;", "}"]
		},
		t.ColorStepFilter.prototype = Object.create(t.AbstractFilter.prototype),
		t.ColorStepFilter.prototype.constructor = t.ColorStepFilter,
		Object.defineProperty(t.ColorStepFilter.prototype, "step", {
			get : function () {
				return this.uniforms.step.value
			},
			set : function (e) {
				this.uniforms.step.value = e
			}
		}),
		t.DotScreenFilter = function () {
			t.AbstractFilter.call(this),
			this.passes = [this],
			this.uniforms = {
				scale : {
					type : "1f",
					value : 1
				},
				angle : {
					type : "1f",
					value : 5
				},
				dimensions : {
					type : "4fv",
					value : [0, 0, 0, 0]
				}
			},
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform vec4 dimensions;", "uniform sampler2D uSampler;", "uniform float angle;", "uniform float scale;", "float pattern() {", "   float s = sin(angle), c = cos(angle);", "   vec2 tex = vTextureCoord * dimensions.xy;", "   vec2 point = vec2(", "       c * tex.x - s * tex.y,", "       s * tex.x + c * tex.y", "   ) * scale;", "   return (sin(point.x) * sin(point.y)) * 4.0;", "}", "void main() {", "   vec4 color = texture2D(uSampler, vTextureCoord);", "   float average = (color.r + color.g + color.b) / 3.0;", "   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);", "}"]
		},
		t.DotScreenFilter.prototype = Object.create(t.DotScreenFilter.prototype),
		t.DotScreenFilter.prototype.constructor = t.DotScreenFilter,
		Object.defineProperty(t.DotScreenFilter.prototype, "scale", {
			get : function () {
				return this.uniforms.scale.value
			},
			set : function (e) {
				this.dirty = !0,
				this.uniforms.scale.value = e
			}
		}),
		Object.defineProperty(t.DotScreenFilter.prototype, "angle", {
			get : function () {
				return this.uniforms.angle.value
			},
			set : function (e) {
				this.dirty = !0,
				this.uniforms.angle.value = e
			}
		}),
		t.CrossHatchFilter = function () {
			t.AbstractFilter.call(this),
			this.passes = [this],
			this.uniforms = {
				blur : {
					type : "1f",
					value : 1 / 512
				}
			},
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform float blur;", "uniform sampler2D uSampler;", "void main(void) {", "    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);", "    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);", "    if (lum < 1.00) {", "        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {", "            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);", "        }", "    }", "    if (lum < 0.75) {", "        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0) {", "            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);", "        }", "    }", "    if (lum < 0.50) {", "        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0) {", "            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);", "        }", "    }", "    if (lum < 0.3) {", "        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0) {", "            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);", "        }", "    }", "}"]
		},
		t.CrossHatchFilter.prototype = Object.create(t.AbstractFilter.prototype),
		t.CrossHatchFilter.prototype.constructor = t.BlurYFilter,
		Object.defineProperty(t.CrossHatchFilter.prototype, "blur", {
			get : function () {
				return this.uniforms.blur.value / (1 / 7e3)
			},
			set : function (e) {
				this.uniforms.blur.value = 1 / 7e3 * e
			}
		}),
		t.RGBSplitFilter = function () {
			t.AbstractFilter.call(this),
			this.passes = [this],
			this.uniforms = {
				red : {
					type : "2f",
					value : {
						x : 20,
						y : 20
					}
				},
				green : {
					type : "2f",
					value : {
						x : -20,
						y : 20
					}
				},
				blue : {
					type : "2f",
					value : {
						x : 20,
						y : -20
					}
				},
				dimensions : {
					type : "4fv",
					value : [0, 0, 0, 0]
				}
			},
			this.fragmentSrc = ["precision mediump float;", "varying vec2 vTextureCoord;", "varying vec4 vColor;", "uniform vec2 red;", "uniform vec2 green;", "uniform vec2 blue;", "uniform vec4 dimensions;", "uniform sampler2D uSampler;", "void main(void) {", "   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/dimensions.xy).r;", "   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/dimensions.xy).g;", "   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/dimensions.xy).b;", "   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;", "}"]
		},
		t.RGBSplitFilter.prototype = Object.create(t.AbstractFilter.prototype),
		t.RGBSplitFilter.prototype.constructor = t.RGBSplitFilter,
		Object.defineProperty(t.RGBSplitFilter.prototype, "angle", {
			get : function () {
				return this.uniforms.blur.value / (1 / 7e3)
			},
			set : function (e) {
				this.uniforms.blur.value = 1 / 7e3 * e
			}
		}),
		"undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = t), exports.PIXI = t) : "undefined" != typeof define && define.amd ? define(t) : e.PIXI = t
	}).call(this),
	PIXI.FlashClip = function (e) {
		var t = [];
		for (var i in PIXI.TextureCache)
			 - 1 !== i.indexOf(e) && i.length === e.length + 4 && t.push(PIXI.Texture.fromFrame(i));
		if (0 === t.length)
			throw "FlashClip textures not found";
		PIXI.MovieClip.call(this, t)
	},
	PIXI.FlashClip.prototype = Object.create(PIXI.MovieClip.prototype),
	PIXI.FlashClip.prototype.constructor = PIXI.FlashClip,
	PIXI.WindowsPhoneLoaders = {},
	window.PIXIwindowsPhoneFileLoaded = function (e, t) {
		PIXI.WindowsPhoneLoaders[e] && (PIXI.WindowsPhoneLoaders[e].ajaxRequest = {}, PIXI.WindowsPhoneLoaders[e].ajaxRequest.readyState = 4, PIXI.WindowsPhoneLoaders[e].ajaxRequest.status = 200, PIXI.WindowsPhoneLoaders[e].ajaxRequest.responseText = t, PIXI.WindowsPhoneLoaders[e].ajaxRequest.responseXML = "", PIXI.WindowsPhoneLoaders[e].onJSONLoaded && PIXI.WindowsPhoneLoaders[e].onJSONLoaded(), PIXI.WindowsPhoneLoaders[e].onXMLLoaded && PIXI.WindowsPhoneLoaders[e].onXMLLoaded())
	},
	window.PIXIwindowsPhoneFix = function () {
		return "undefined" != typeof window.external && "unknown" == typeof window.external.notify && /Windows Phone/i.test(navigator.userAgent) ? (PIXI.WindowsPhoneLoaders[this.url] = this, window.external.notify("GetResource?file=" + this.url + ";callback=PIXI_WindowsPhone_fileLoaded"), !0) : !1
	},
	PIXI.extend = function (e) {
		function t() {
			var t;
			this.init ? this.init.apply(this, arguments) : this.base.apply(this, arguments);
			for (t in r)
				"function" != typeof r[t] && (this[t] = game.copy(r[t]));
			for (t in e)
				"function" != typeof e[t] && (this[t] = game.copy(e[t]))
		}
		var i,
		r = this.prototype,
		s = this.prototype.base || this;
		t.prototype = Object.create(s.prototype);
		var n = function (e, t) {
			var i = r[e];
			return "init" !== e || i || (i = s),
			function () {
				var e = this._super;
				this._super = i;
				var r = t.apply(this, arguments);
				return this._super = e,
				r
			}
		};
		for (i in r)
			t.prototype[i] = "function" == typeof r[i] ? n(i, r[i]) : r[i];
		for (i in e)
			t.prototype[i] = "function" == typeof e[i] ? n(i, e[i]) : e[i];
		return t.prototype.constructor = t,
		t.prototype.base = s,
		t.extend = PIXI.extend,
		t
	};
	for (var e in PIXI)
		PIXI[e].prototype instanceof Object && (PIXI[e].extend = PIXI.extend);
	game.AssetLoader = PIXI.AssetLoader,
	game.Text = PIXI.Text,
	game.MovieClip = PIXI.MovieClip,
	game.FlashClip = PIXI.FlashClip,
	game.BitmapText = PIXI.BitmapText,
	game.Spine = PIXI.Spine,
	game.Graphics = PIXI.Graphics,
	game.HitRectangle = PIXI.Rectangle,
	game.HitCircle = PIXI.Circle,
	game.HitEllipse = PIXI.Ellipse,
	game.HitPolygon = PIXI.Polygon,
	game.TextureCache = PIXI.TextureCache,
	game.RenderTexture = PIXI.RenderTexture
}), game.module("engine.sprite").require("engine.renderer").body(function () {
	game.Sprite = PIXI.Sprite.extend({
			init : function (e, t, i, r) {
				"number" != typeof e && (i = e),
				i = game.assets[i] || i;
				var s = i instanceof PIXI.Texture ? i : PIXI.Texture.fromFrame(this.path || i);
				this._super(s),
				game.merge(this, r),
				"number" == typeof e && (this.position.x = e),
				"number" == typeof t && (this.position.y = t),
				game.device.mobile && !this.tap && this.click && (this.tap = this.click),
				game.device.mobile && !this.touchmove && this.mousemove && (this.touchmove = this.mousemove),
				game.device.mobile && !this.touchstart && this.mousedown && (this.touchstart = this.mousedown),
				game.device.mobile && !this.touchend && this.mouseup && (this.touchend = this.mouseup),
				game.device.mobile && !this.touchendoutside && this.mouseupoutside && (this.touchendoutside = this.mouseupoutside)
			},
			setTexture : function (e) {
				"string" == typeof e && (e = game.assets[e] || e, e = game.Texture.fromFrame(e)),
				this._super(e)
			},
			remove : function () {
				this.parent && this.parent.removeChild(this)
			},
			addChild : function (e) {
				this._super(e),
				game.debugDraw && e.interactive && game.debugDraw.addSprite(e)
			}
		}),
	game.Container = PIXI.DisplayObjectContainer.extend({
			remove : function () {
				this.parent && this.parent.removeChild(this)
			},
			addChild : function (e) {
				this._super(e),
				game.debugDraw && e.interactive && game.debugDraw.addSprite(e)
			}
		}),
	game.Texture = PIXI.Texture.extend(),
	game.Texture.fromImage = function (e, t) {
		return e = game.assets[e] || e,
		PIXI.Texture.fromImage(e, t)
	},
	game.Texture.fromCanvas = PIXI.Texture.fromCanvas,
	game.Texture.fromFrame = PIXI.Texture.fromFrame,
	game.TilingSprite = PIXI.TilingSprite.extend({
			speed : {
				x : 0,
				y : 0
			},
			init : function (e, t, i, r) {
				e = game.assets[e] || e;
				var s = e instanceof PIXI.Texture ? e : PIXI.Texture.fromFrame(this.path || e);
				this._super(s, t || s.width, i || s.height),
				game.merge(this, r)
			},
			update : function () {
				this.tilePosition.x += this.speed.x * game.system.delta,
				this.tilePosition.y += this.speed.y * game.system.delta
			}
		}),
	game.Animation = PIXI.MovieClip.extend({
			init : function () {
				for (var e = Array.prototype.slice.call(arguments), t = [], i = 0; i < e.length; i++)
					t.push(game.Texture.fromImage(e[i]));
				this._super(t)
			}
		})
}), game.module("engine.debug").body(function () {
	"use strict";
	game.DebugDraw = game.Class.extend({
			container : null,
			init : function () {
				this.container = new game.Container
			},
			reset : function () {
				for (var e = this.container.children.length - 1; e >= 0; e--)
					this.container.removeChild(this.container.children[e]);
				game.system.stage.addChild(this.container)
			},
			addSprite : function (e) {
				var t = new game.Graphics;
				t.beginFill(game.DebugDraw.spriteColor),
				e.hitArea ? t.drawRect(e.hitArea.x, e.hitArea.y, e.hitArea.width, e.hitArea.height) : t.drawRect(-e.width * e.anchor.x, -e.height * e.anchor.y, e.width, e.height),
				t.target = e,
				t.alpha = game.DebugDraw.spriteAlpha,
				this.container.addChild(t)
			},
			addBody : function (e) {
				var t = new game.Graphics;
				this.drawDebugSprite(t, e),
				t.position.x = e.position.x,
				t.position.y = e.position.y,
				t.target = e,
				t.alpha = game.DebugDraw.shapeAlpha,
				this.container.addChild(t)
			},
			drawDebugSprite : function (e, t) {
				e.clear(),
				e.beginFill(game.DebugDraw.shapeColor),
				t.shape instanceof game.Rectangle && (e.drawRect(-t.shape.width / 2, -t.shape.height / 2, t.shape.width, t.shape.height), e.width = t.shape.width, e.height = t.shape.height),
				t.shape instanceof game.Circle && (e.drawCircle(0, 0, t.shape.radius), e.radius = t.shape.radius)
			},
			update : function () {
				for (var e = this.container.children.length - 1; e >= 0; e--)
					game.modules["plugins.p2"] && this.container.children[e].target instanceof game.Body ? this.updateP2(this.container.children[e]) : (this.container.children[e].rotation = this.container.children[e].target.rotation, game.modules["engine.physics"] && this.container.children[e].target instanceof game.Body ? ((this.container.children[e].width !== this.container.children[e].target.shape.width || this.container.children[e].height !== this.container.children[e].target.shape.height) && this.drawDebugSprite(this.container.children[e], this.container.children[e].target), this.container.children[e].radius !== this.container.children[e].target.shape.radius && this.drawDebugSprite(this.container.children[e], this.container.children[e].target), this.container.children[e].position.x = this.container.children[e].target.position.x + game.scene.stage.position.x, this.container.children[e].position.y = this.container.children[e].target.position.y + game.scene.stage.position.y, this.container.children[e].target.world || this.container.removeChild(this.container.children[e])) : (this.container.children[e].target.parent && this.container.children[e].target.updateTransform(), this.container.children[e].position.x = this.container.children[e].target.worldTransform.tx, this.container.children[e].position.y = this.container.children[e].target.worldTransform.ty, this.container.children[e].scale.x = this.container.children[e].target.scale.x, this.container.children[e].scale.y = this.container.children[e].target.scale.y, this.container.children[e].target.parent || this.container.removeChild(this.container.children[e])))
			}
		}),
	game.DebugDraw.spriteColor = 16711680,
	game.DebugDraw.spriteAlpha = .3,
	game.DebugDraw.shapeColor = 255,
	game.DebugDraw.shapeAlpha = .3,
	game.DebugDraw.enabled = document.location.href.match(/\?debugdraw/) ? !0 : !1,
	game.Debug = game.Class.extend({
			frames : 0,
			last : 0,
			fps : 0,
			fpsText : null,
			init : function () {
				this.fpsText = new game.Text("0", {
						fill : game.Debug.color
					}),
				this.fpsText.position.set(game.Debug.position.x, game.Debug.position.y),
				game.system.stage.addChild(this.fpsText)
			},
			update : function () {
				this.frames++,
				game.Timer.last >= this.last + game.Debug.frequency && (this.fps = Math.round(1e3 * this.frames / (game.Timer.last - this.last)).toString(), this.fps !== this.fpsText.text && this.fpsText.setText(this.fps.toString()), this.last = game.Timer.last, this.frames = 0)
			}
		}),
	game.Debug.enabled = !!document.location.href.toLowerCase().match(/\?debug/),
	game.Debug.frequency = 1e3,
	game.Debug.color = "black",
	game.Debug.position = {
		x : 10,
		y : 10
	}
}), game.module("engine.storage").body(function () {
	"use strict";
	game.Storage = game.Class.extend({
			id : null,
			init : function (e) {
				this.id = e
			},
			set : function (e, t) {
				localStorage[this.id + "." + e] = t
			},
			get : function (e) {
				return localStorage[this.id + "." + e]
			},
			remove : function (e) {
				localStorage.removeItem(this.id + "." + e)
			},
			reset : function () {
				for (var e in localStorage)
					 - 1 !== e.indexOf(this.id + ".") && localStorage.removeItem(e)
			}
		}),
	game.Storage.id = ""
}), game.module("engine.tween").body(function () {
	void 0 === Date.now && (Date.now = function () {
		return (new Date).valueOf()
	}),
	game.TweenEngine = function () {
		var e = [];
		return {
			REVISION : "12",
			getAll : function () {
				return e
			},
			removeAll : function () {
				e.length = 0
			},
			stopAllForObject : function (t) {
				for (var i = e.length - 1; i >= 0; i--)
					e[i].getObject() === t && e[i].stop()
			},
			getTweenForObject : function (t) {
				for (var i = e.length - 1; i >= 0; i--)
					if (e[i].getObject() === t)
						return e[i];
				return !1
			},
			add : function (t) {
				e.push(t)
			},
			remove : function (t) {
				var i = e.indexOf(t);
				-1 !== i && e.splice(i, 1)
			},
			update : function (t) {
				if (0 === e.length)
					return !1;
				t = void 0 !== t ? t : game.Timer.time;
				for (var i = e.length - 1; i >= 0; i--)
					e[i].update(t) || e.splice(i, 1);
				return !0
			}
		}
	}
	(),
	game.Tween = function (e, t, i, r) {
		if (!e)
			throw "No object defined for tween";
		r = r || {};
		var s = e,
		n = {},
		a = t || {},
		o = {},
		h = i || 1e3,
		l = 0,
		u = 0,
		c = !1,
		d = !1,
		p = !1,
		m = 0,
		g = !1,
		f = null,
		v = null,
		y = r.easing || game.Tween.Easing.Linear.None,
		x = r.interpolation || game.Tween.Interpolation.Linear,
		b = [],
		T = r.onStart || null,
		w = !1,
		S = r.onUpdate || null,
		C = r.onComplete || null;
		for (var A in e)
			n[A] = parseFloat(e[A], 10);
		this.getObject = function () {
			return s
		},
		this.to = function (e, t) {
			return void 0 !== t && (h = t),
			a = e,
			this
		},
		this.start = function (e) {
			game.TweenEngine.add(this),
			d = !0,
			w = !1,
			f = void 0 !== e ? e : game.Timer.time,
			f += m,
			v = f;
			for (var t in a) {
				if (a[t]instanceof Array) {
					if (0 === a[t].length)
						continue;
					a[t] = [s[t]].concat(a[t])
				}
				n[t] = s[t],
				n[t]instanceof Array == !1 && (n[t] *= 1),
				o[t] = n[t] || 0
			}
			return this
		},
		this.stop = function () {
			return d ? (game.TweenEngine.remove(this), d = !1, this.stopChainedTweens(), this) : this
		},
		this.stopChainedTweens = function () {
			for (var e = 0, t = b.length; t > e; e++)
				b[e].stop()
		},
		this.delay = function (e, t) {
			return m = e,
			g = !!t,
			this
		},
		this.repeat = function (e) {
			return "undefined" == typeof e && (e = 1 / 0),
			l = e,
			this
		},
		this.yoyo = function (e) {
			return "undefined" == typeof e && (e = !0),
			c = e,
			this
		},
		this.easing = function (e) {
			return y = e,
			this
		},
		this.interpolation = function (e) {
			return x = e,
			this
		},
		this.chain = function () {
			return b = arguments,
			this
		},
		this.onStart = function (e) {
			return T = e,
			this
		},
		this.onUpdate = function (e) {
			return S = e,
			this
		},
		this.onComplete = function (e) {
			return C = e,
			this
		},
		this.isPlaying = function () {
			return d
		},
		this.update = function (e) {
			var t;
			if (f > e)
				return !0;
			w === !1 && (null !== T && T.call(s), w = !0);
			var i = (e - f) / h;
			i = i > 1 ? 1 : i;
			var r = y(i);
			for (t in a) {
				var A = n[t] || 0,
				M = a[t];
				M instanceof Array ? s[t] = x(M, r) : ("string" == typeof M && (M = A + parseFloat(M, 10)), "number" == typeof M && (s[t] = A + (M - A) * r))
			}
			if (null !== S && S.call(s, r), 1 === i) {
				if (l > 0) {
					isFinite(l) && l--,
					u += 1;
					for (t in o) {
						if ("string" == typeof a[t] && (o[t] = o[t] + parseFloat(a[t], 10)), c) {
							var E = o[t];
							o[t] = a[t],
							a[t] = E,
							p = !p
						}
						n[t] = o[t]
					}
					return g || (m = 0),
					f = v + u * (h + m),
					!0
				}
				d = !1,
				null !== C && C.call(s);
				for (var R = 0, L = b.length; L > R; R++)
					b[R].start(e);
				return !1
			}
			return !0
		}
	},
	game.Tween.Loop = {
		Reverse : 0,
		Revert : 1
	},
	game.Tween.Easing = {
		Linear : {
			None : function (e) {
				return e
			}
		},
		Quadratic : {
			In : function (e) {
				return e * e
			},
			Out : function (e) {
				return e * (2 - e)
			},
			InOut : function (e) {
				return (e *= 2) < 1 ? .5 * e * e :  - .5 * (--e * (e - 2) - 1)
			}
		},
		Cubic : {
			In : function (e) {
				return e * e * e
			},
			Out : function (e) {
				return --e * e * e + 1
			},
			InOut : function (e) {
				return (e *= 2) < 1 ? .5 * e * e * e : .5 * ((e -= 2) * e * e + 2)
			}
		},
		Quartic : {
			In : function (e) {
				return e * e * e * e
			},
			Out : function (e) {
				return 1 - --e * e * e * e
			},
			InOut : function (e) {
				return (e *= 2) < 1 ? .5 * e * e * e * e :  - .5 * ((e -= 2) * e * e * e - 2)
			}
		},
		Quintic : {
			In : function (e) {
				return e * e * e * e * e
			},
			Out : function (e) {
				return --e * e * e * e * e + 1
			},
			InOut : function (e) {
				return (e *= 2) < 1 ? .5 * e * e * e * e * e : .5 * ((e -= 2) * e * e * e * e + 2)
			}
		},
		Sinusoidal : {
			In : function (e) {
				return 1 - Math.cos(e * Math.PI / 2)
			},
			Out : function (e) {
				return Math.sin(e * Math.PI / 2)
			},
			InOut : function (e) {
				return .5 * (1 - Math.cos(Math.PI * e))
			}
		},
		Exponential : {
			In : function (e) {
				return 0 === e ? 0 : Math.pow(1024, e - 1)
			},
			Out : function (e) {
				return 1 === e ? 1 : 1 - Math.pow(2, -10 * e)
			},
			InOut : function (e) {
				return 0 === e ? 0 : 1 === e ? 1 : (e *= 2) < 1 ? .5 * Math.pow(1024, e - 1) : .5 * (-Math.pow(2, -10 * (e - 1)) + 2)
			}
		},
		Circular : {
			In : function (e) {
				return 1 - Math.sqrt(1 - e * e)
			},
			Out : function (e) {
				return Math.sqrt(1 - --e * e)
			},
			InOut : function (e) {
				return (e *= 2) < 1 ?  - .5 * (Math.sqrt(1 - e * e) - 1) : .5 * (Math.sqrt(1 - (e -= 2) * e) + 1)
			}
		},
		Elastic : {
			In : function (e) {
				var t,
				i = .1,
				r = .4;
				return 0 === e ? 0 : 1 === e ? 1 : (!i || 1 > i ? (i = 1, t = r / 4) : t = r * Math.asin(1 / i) / (2 * Math.PI),  - (i * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e - t) * Math.PI / r)))
			},
			Out : function (e) {
				var t,
				i = .1,
				r = .4;
				return 0 === e ? 0 : 1 === e ? 1 : (!i || 1 > i ? (i = 1, t = r / 4) : t = r * Math.asin(1 / i) / (2 * Math.PI), i * Math.pow(2, -10 * e) * Math.sin(2 * (e - t) * Math.PI / r) + 1)
			},
			InOut : function (e) {
				var t,
				i = .1,
				r = .4;
				return 0 === e ? 0 : 1 === e ? 1 : (!i || 1 > i ? (i = 1, t = r / 4) : t = r * Math.asin(1 / i) / (2 * Math.PI), (e *= 2) < 1 ?  - .5 * i * Math.pow(2, 10 * (e -= 1)) * Math.sin(2 * (e - t) * Math.PI / r) : i * Math.pow(2, -10 * (e -= 1)) * Math.sin(2 * (e - t) * Math.PI / r) * .5 + 1)
			}
		},
		Back : {
			In : function (e) {
				var t = 1.70158;
				return e * e * ((t + 1) * e - t)
			},
			Out : function (e) {
				var t = 1.70158;
				return --e * e * ((t + 1) * e + t) + 1
			},
			InOut : function (e) {
				var t = 2.5949095;
				return (e *= 2) < 1 ? .5 * e * e * ((t + 1) * e - t) : .5 * ((e -= 2) * e * ((t + 1) * e + t) + 2)
			}
		},
		Bounce : {
			In : function (e) {
				return 1 - game.Tween.Easing.Bounce.Out(1 - e)
			},
			Out : function (e) {
				return 1 / 2.75 > e ? 7.5625 * e * e : 2 / 2.75 > e ? 7.5625 * (e -= 1.5 / 2.75) * e + .75 : 2.5 / 2.75 > e ? 7.5625 * (e -= 2.25 / 2.75) * e + .9375 : 7.5625 * (e -= 2.625 / 2.75) * e + .984375
			},
			InOut : function (e) {
				return .5 > e ? .5 * game.Tween.Easing.Bounce.In(2 * e) : .5 * game.Tween.Easing.Bounce.Out(2 * e - 1) + .5
			}
		}
	},
	game.Tween.Interpolation = {
		Linear : function (e, t) {
			var i = e.length - 1,
			r = i * t,
			s = Math.floor(r),
			n = game.Tween.Interpolation.Utils.Linear;
			return 0 > t ? n(e[0], e[1], r) : t > 1 ? n(e[i], e[i - 1], i - r) : n(e[s], e[s + 1 > i ? i : s + 1], r - s)
		},
		Bezier : function (e, t) {
			var i,
			r = 0,
			s = e.length - 1,
			n = Math.pow,
			a = game.Tween.Interpolation.Utils.Bernstein;
			for (i = 0; s >= i; i++)
				r += n(1 - t, s - i) * n(t, i) * e[i] * a(s, i);
			return r
		},
		CatmullRom : function (e, t) {
			var i = e.length - 1,
			r = i * t,
			s = Math.floor(r),
			n = game.Tween.Interpolation.Utils.CatmullRom;
			return e[0] === e[i] ? (0 > t && (s = Math.floor(r = i * (1 + t))), n(e[(s - 1 + i) % i], e[s], e[(s + 1) % i], e[(s + 2) % i], r - s)) : 0 > t ? e[0] - (n(e[0], e[0], e[1], e[1], -r) - e[0]) : t > 1 ? e[i] - (n(e[i], e[i], e[i - 1], e[i - 1], r - i) - e[i]) : n(e[s ? s - 1 : 0], e[s], e[s + 1 > i ? i : s + 1], e[s + 2 > i ? i : s + 2], r - s)
		},
		Utils : {
			Linear : function (e, t, i) {
				return (t - e) * i + e
			},
			Bernstein : function (e, t) {
				var i = game.Tween.Interpolation.Utils.Factorial;
				return i(e) / i(t) / i(e - t)
			},
			Factorial : function () {
				var e = [1];
				return function (t) {
					var i,
					r = 1;
					if (e[t])
						return e[t];
					for (i = t; i > 1; i--)
						r *= i;
					return e[t] = r
				}
			}
			(),
			CatmullRom : function (e, t, i, r, s) {
				var n = .5 * (i - e),
				a = .5 * (r - t),
				o = s * s,
				h = s * o;
				return (2 * t - 2 * i + n + a) * h + (-3 * t + 3 * i - 2 * n - a) * o + n * s + t
			}
		}
	},
	game.TweenGroup = game.Class.extend({
			tweens : [],
			onComplete : null,
			complete : !1,
			init : function (e) {
				this.onComplete = e
			},
			add : function (e) {
				return e.onComplete(this.tweenComplete.bind(this)),
				this.tweens.push(e),
				e
			},
			tweenComplete : function () {
				if (!this.complete) {
					for (var e = 0; e < this.tweens.length; e++)
						if (this.tweens[e].isPlaying())
							return;
					this.complete = !0,
					"function" == typeof this.onComplete && this.onComplete()
				}
			},
			remove : function (e) {
				this.tweens.erase(e)
			},
			start : function () {
				for (var e = 0; e < this.tweens.length; e++)
					this.tweens[e].start()
			},
			pause : function () {
				for (var e = 0; e < this.tweens.length; e++)
					this.tweens[e].pause()
			},
			resume : function () {
				for (var e = 0; e < this.tweens.length; e++)
					this.tweens[e].resume()
			},
			stop : function (e, t) {
				if (!this.complete) {
					for (var i = 0; i < this.tweens.length; i++)
						this.tweens[i].stop(t);
					!this.complete && e && this.tweenComplete(),
					this.complete = !0
				}
			}
		})
}), game.module("engine.scene").body(function () {
	"use strict";
	game.Scene = game.Class.extend({
			backgroundColor : 0,
			objects : [],
			timers : [],
			emitters : [],
			stage : null,
			swipeDist : 100,
			swipeTime : 500,
			staticInit : function () {
				game.scene = this;
				for (var e = game.system.stage.children.length - 1; e >= 0; e--)
					game.system.stage.removeChild(game.system.stage.children[e]);
				game.system.stage.setBackgroundColor(this.backgroundColor),
				game.system.stage.mousemove = game.system.stage.touchmove = this._mousemove.bind(this),
				game.system.stage.click = game.system.stage.tap = this.click.bind(this),
				game.system.stage.mousedown = game.system.stage.touchstart = this._mousedown.bind(this),
				game.system.stage.mouseup = game.system.stage.mouseupoutside = game.system.stage.touchend = game.system.stage.touchendoutside = this.mouseup.bind(this),
				game.system.stage.mouseout = this.mouseout.bind(this),
				this.stage = new game.Container,
				game.system.stage.addChild(this.stage),
				game.debugDraw && game.debugDraw.reset()
			},
			update : function () {
				var e;
				for (this.world && this.world.update(), e = this.timers.length - 1; e >= 0; e--)
					this.timers[e].time() >= 0 && ("function" == typeof this.timers[e].callback && this.timers[e].callback(), this.timers[e].repeat ? this.timers[e].reset() : this.timers.splice(e, 1));
				for (e = this.emitters.length - 1; e >= 0; e--)
					this.emitters[e].update(), this.emitters[e]._remove && this.emitters.splice(e, 1);
				for (game.TweenEngine && game.TweenEngine.update(), e = this.objects.length - 1; e >= 0; e--)
					"function" == typeof this.objects[e].update && this.objects[e].update(), this.objects[e]._remove && this.objects.splice(e, 1)
			},
			addObject : function (e) {
				e._remove && (e._remove = !1),
				this.objects.push(e)
			},
			removeObject : function (e) {
				e._remove = !0
			},
			addEmitter : function (e) {
				this.emitters.push(e)
			},
			removeEmitter : function (e) {
				e._remove = !0
			},
			addTimer : function (e, t, i) {
				game.Timer.seconds && (e *= 1e3);
				var r = new game.Timer(e);
				return r.repeat = !!i,
				r.callback = t,
				this.timers.push(r),
				r
			},
			addTween : function (e, t, i, r) {
				var s = new game.Tween(e);
				if (game.Timer.seconds && (i *= 1e3), s.to(t, i), r = r || {}, r.delay && (game.Timer.seconds && (r.delay *= 1e3), s.delay(r.delay)), r.easing && s.easing(r.easing), r.onComplete && s.onComplete(r.onComplete), r.onStart && s.onStart(r.onStart), "undefined" != typeof r.loop) {
					var n = r.loopCount || 1 / 0;
					s.repeat(n),
					r.loop === game.Tween.Loop.Reverse && s.yoyo()
				}
				return s
			},
			stopTweens : function (e) {
				game.TweenEngine.stopAllForObject(e)
			},
			getTween : function (e) {
				return game.TweenEngine.getTweenForObject(e)
			},
			removeTimer : function (e, t) {
				t || (e.callback = null),
				e.repeat = !1,
				e.set(0)
			},
			click : function () {},
			mousedown : function () {},
			mouseup : function () {},
			mousemove : function () {},
			mouseout : function () {},
			keydown : function () {},
			keyup : function () {},
			_mousedown : function (e) {
				e.startTime = Date.now(),
				e.swipeX = e.global.x,
				e.swipeY = e.global.y,
				this.mousedown(e)
			},
			_mousemove : function (e) {
				this.mousemove(e),
				e.startTime && (e.global.x - e.swipeX >= this.swipeDist ? this._swipe(e, "right") : e.global.x - e.swipeX <= -this.swipeDist ? this._swipe(e, "left") : e.global.y - e.swipeY >= this.swipeDist ? this._swipe(e, "down") : e.global.y - e.swipeY <= -this.swipeDist && this._swipe(e, "up"))
			},
			_swipe : function (e, t) {
				var i = Date.now() - e.startTime;
				e.startTime = null,
				i <= this.swipeTime && this.swipe(t)
			},
			swipe : function () {},
			run : function () {
				this.update(),
				game.debugDraw && game.debugDraw.update(),
				this.render()
			},
			render : function () {
				game.renderer.render(game.system.stage)
			},
			pause : function () {
				game.audio.pauseAll()
			},
			resume : function () {
				game.audio.resumeAll()
			}
		})
}), game.module("engine.pool").body(function () {
	"use strict";
	game.Pool = game.Class.extend({
			create : function (e) {
				return this[e] ? !1 : (this[e] = [], !0)
			},
			get : function (e) {
				return this[e] && 0 !== this[e].length ? this[e].pop() : !1
			},
			put : function (e, t) {
				return this[e] ? (this[e].push(t), !0) : !1
			}
		})
}), game.module("engine.analytics").body(function () {
	game.Analytics = game.Class.extend({
			init : function (e) {
				if (navigator.onLine) {
					if (!e)
						throw "Analytics id not set.";
					!function (e, t, i, r, s, n, a) {
						e.GoogleAnalyticsObject = s,
						e[s] = e[s] || function () {
							(e[s].q = e[s].q || []).push(arguments)
						},
						e[s].l = 1 * new Date,
						n = t.createElement(i),
						a = t.getElementsByTagName(i)[0],
						n.async = 1,
						n.src = r,
						a.parentNode.insertBefore(n, a)
					}
					(window, document, "script", "//www.google-analytics.com/analytics.js", "ga"),
					ga("create", e, "auto"),
					ga("send", "pageview")
				}
			},
			event : function (e, t) {
				navigator.onLine && ga("send", "event", e, t)
			}
		}),
	game.Analytics.id = ""
}), game.module("game.main").require("engine.core", "engine.particle", "game.assets", "game.objects", "game.scenes").body(function () {
	game.System.idtkScale = "ScaleAspectFill",
	game.start(SceneGame, 768, 1024)
}), game.module("engine.particle").require("engine.physics").body(function () {
	"use strict";
	game.Particle = game.Class.extend({
			position : null,
			velocity : null,
			sprite : null,
			accel : null,
			init : function () {
				this.position = new game.Vector,
				this.velocity = new game.Vector,
				this.accel = new game.Vector
			},
			setVeloctity : function (e, t) {
				this.velocity.x = Math.cos(e) * t,
				this.velocity.y = Math.sin(e) * t
			},
			setAccel : function (e, t) {
				this.accel.x = Math.cos(e) * t,
				this.accel.y = Math.sin(e) * t
			}
		}),
	game.Emitter = game.Class.extend({
			poolName : "emitter",
			particles : [],
			textures : [],
			container : null,
			position : null,
			positionVar : null,
			angle : 0,
			angleVar : Math.PI,
			speed : 100,
			speedVar : 0,
			life : 2,
			lifeVar : 0,
			duration : 0,
			durationTimer : 0,
			rate : .1,
			rateTimer : 0,
			count : 10,
			active : !0,
			velRotate : 0,
			velRotateVar : 0,
			rotate : 0,
			rotateVar : 0,
			startAlpha : 1,
			endAlpha : 0,
			startScale : 1,
			startScaleVar : 0,
			endScale : 1,
			endScaleVar : 0,
			target : null,
			targetForce : 0,
			accelAngle : Math.PI / 2,
			accelAngleVar : 0,
			accelSpeed : 0,
			accelSpeedVar : 0,
			spriteSettings : {
				anchor : {
					x : .5,
					y : .5
				}
			},
			velocityLimit : null,
			init : function (e) {
				game.pool.create(this.poolName),
				this.position = new game.Vector,
				this.positionVar = new game.Vector,
				this.velocityLimit = new game.Vector,
				this.target = new game.Vector,
				game.merge(this, e)
			},
			reset : function (e) {
				for (var t in this)
					"number" == typeof this[t] && (this[t] = game.Emitter.prototype[t]), this[t]instanceof game.Vector && e && this[t].set(0, 0)
			},
			getVariance : function (e) {
				return Math.random() * e * (Math.random() > .5 ? -1 : 1)
			},
			addParticle : function () {
				var e = game.pool.get(this.poolName);
				e || (e = new game.Particle),
				e.position.x = this.position.x + this.getVariance(this.positionVar.x),
				e.position.y = this.position.y + this.getVariance(this.positionVar.y);
				var t = this.getVariance(this.angleVar),
				i = this.angle + t,
				r = this.speed + this.getVariance(this.speedVar);
				e.setVeloctity(i, r),
				this.angleVar !== this.accelAngleVar && (t = this.getVariance(this.accelAngleVar)),
				i = this.accelAngle + t,
				r = this.accelSpeed + this.getVariance(this.accelSpeedVar),
				e.setAccel(i, r),
				e.life = this.life + this.getVariance(this.lifeVar),
				e.sprite ? (e.sprite.setTexture(game.TextureCache[this.textures.random()]), e.sprite.position.x = e.position.x, e.sprite.position.y = e.position.y) : e.sprite = new game.Sprite(e.position.x, e.position.y, this.textures.random(), this.spriteSettings),
				e.rotate = this.rotate + this.getVariance(this.rotateVar),
				e.velRotate = this.velRotate + this.getVariance(this.velRotateVar),
				this.startAlpha !== this.endAlpha ? (e.deltaAlpha = this.endAlpha - this.startAlpha, e.deltaAlpha /= e.life) : e.deltaAlpha = 0,
				e.sprite.alpha = this.startAlpha;
				var s = this.startScale + this.getVariance(this.startScaleVar);
				this.startScale !== this.endScale ? (e.deltaScale = this.endScale + this.getVariance(this.endScaleVar) - s, e.deltaScale /= e.life) : e.deltaScale = 0,
				e.sprite.scale.x = e.sprite.scale.y = s,
				this.container && this.container.addChild(e.sprite),
				this.particles.push(e)
			},
			updateParticle : function (e) {
				return e.life > 0 && (e.life -= game.system.delta, e.life <= 0) ? this.removeParticle(e) : (this.targetForce > 0 && (e.accel.set(this.target.x - e.position.x, this.target.y - e.position.y), e.accel.normalize().multiply(this.targetForce)), e.velocity.multiplyAdd(e.accel, game.system.delta), (this.velocityLimit.x > 0 || this.velocityLimit.y > 0) && e.velocity.limit(this.velocityLimit), e.velRotate && e.velocity.rotate(e.velRotate * game.system.delta), e.position.multiplyAdd(e.velocity, game.scale * game.system.delta), e.deltaAlpha && (e.sprite.alpha = Math.max(0, e.sprite.alpha + e.deltaAlpha * game.system.delta)), e.deltaScale && (e.sprite.scale.x = e.sprite.scale.y += e.deltaScale * game.system.delta), e.sprite.rotation += e.rotate * game.system.delta, e.sprite.position.x = e.position.x, void(e.sprite.position.y = e.position.y))
			},
			removeParticle : function (e) {
				e.sprite.parent && e.sprite.parent.removeChild(e.sprite),
				game.pool.put(this.poolName, e),
				this.particles.erase(e)
			},
			emit : function (e) {
				e = e || 1;
				for (var t = 0; e > t; t++)
					this.addParticle()
			},
			update : function () {
				this.durationTimer += game.system.delta,
				this.duration > 0 && (this.active = this.durationTimer < this.duration),
				this.rate && this.active && (this.rateTimer += game.system.delta, this.rateTimer >= this.rate && (this.rateTimer = 0, this.emit(this.count)));
				for (var e = this.particles.length - 1; e >= 0; e--)
					this.updateParticle(this.particles[e])
			},
			remove : function () {
				this._remove = !0
			}
		})
}), game.module("engine.physics").body(function () {
	"use strict";
	game.World = game.Class.extend({
			gravity : null,
			solver : null,
			bodies : [],
			collisionGroups : [],
			init : function (e, t) {
				this.gravity = new game.Vector,
				this.gravity.x = "number" == typeof e ? e : 0,
				this.gravity.y = "number" == typeof t ? t : 980,
				this.solver = new game.CollisionSolver
			},
			addBody : function (e) {
				e.world = this,
				this.bodies.push(e),
				"number" == typeof e.collisionGroup && this.addBodyCollision(e, e.collisionGroup),
				game.debugDraw && e.shape && game.debugDraw.addBody(e)
			},
			removeBody : function (e) {
				e.world && (e.world = null, e.collisionGroup && this.removeBodyCollision(e), this.bodies.erase(e))
			},
			removeBodyCollision : function (e) {
				this.collisionGroups[e.collisionGroup].erase(e)
			},
			addBodyCollision : function (e, t) {
				e.collisionGroup = t,
				this.collisionGroups[e.collisionGroup] = this.collisionGroups[e.collisionGroup] || [],
				this.collisionGroups[e.collisionGroup].push(e)
			},
			removeCollisionGroup : function (e) {
				this.collisionGroups.erase(this.collisionGroups[e])
			},
			collide : function (e) {
				if (this.collisionGroups[e.collideAgainst]) {
					var t,
					i;
					for (t = this.collisionGroups[e.collideAgainst].length - 1; t >= 0 && this.collisionGroups[e.collideAgainst]; t--)
						i = this.collisionGroups[e.collideAgainst][t], e !== i && this.solver.solve(e, i)
				}
			},
			update : function () {
				var e,
				t;
				for (e = this.bodies.length - 1; e >= 0; e--)
					this.bodies[e].update();
				for (e = this.collisionGroups.length - 1; e >= 0; e--)
					if (this.collisionGroups[e])
						for (t = this.collisionGroups[e].length - 1; t >= 0; t--)
							"number" == typeof this.collisionGroups[e][t].collideAgainst && this.collide(this.collisionGroups[e][t])
			}
		}),
	game.CollisionSolver = game.Class.extend({
			solve : function (e, t) {
				this.hitTest(e, t) && this.hitResponse(e, t) && e.afterCollide(t)
			},
			hitTest : function (e, t) {
				if (e.shape instanceof game.Rectangle && t.shape instanceof game.Rectangle)
					return !(e.position.y + e.shape.height / 2 <= t.position.y - t.shape.height / 2 || e.position.y - e.shape.height / 2 >= t.position.y + t.shape.height / 2 || e.position.x - e.shape.width / 2 >= t.position.x + t.shape.width / 2 || e.position.x + e.shape.width / 2 <= t.position.x - t.shape.width / 2);
				if (e.shape instanceof game.Circle && t.shape instanceof game.Circle)
					return e.shape.radius + t.shape.radius > e.position.distance(t.position);
				if (e.shape instanceof game.Rectangle && t.shape instanceof game.Circle || e.shape instanceof game.Circle && t.shape instanceof game.Rectangle) {
					var i = e.shape instanceof game.Rectangle ? e : t,
					r = e.shape instanceof game.Circle ? e : t,
					s = Math.max(i.position.x - i.shape.width / 2, Math.min(i.position.x + i.shape.width / 2, r.position.x)),
					n = Math.max(i.position.y - i.shape.height / 2, Math.min(i.position.y + i.shape.height / 2, r.position.y)),
					a = Math.pow(r.position.x - s, 2) + Math.pow(r.position.y - n, 2);
					return a < r.shape.radius * r.shape.radius
				}
				if (e.shape instanceof game.Line && t.shape instanceof game.Line) {
					var o = e.position.x - Math.sin(e.shape.rotation) * (e.shape.length / 2),
					h = e.position.y - Math.cos(e.shape.rotation) * (e.shape.length / 2),
					l = e.position.x + Math.sin(e.shape.rotation) * (e.shape.length / 2),
					u = e.position.y + Math.cos(e.shape.rotation) * (e.shape.length / 2),
					c = t.position.x - Math.sin(t.shape.rotation) * (t.shape.length / 2),
					d = t.position.y - Math.cos(t.shape.rotation) * (t.shape.length / 2),
					p = t.position.x + Math.sin(t.shape.rotation) * (t.shape.length / 2),
					m = t.position.y + Math.cos(t.shape.rotation) * (t.shape.length / 2),
					g = (m - d) * (l - o) - (p - c) * (u - h);
					if (0 !== g) {
						var f = (p - c) * (h - d) - (m - d) * (o - c),
						v = (l - o) * (h - d) - (u - h) * (o - c),
						y = f / g;
						if (g = v / g, y >= 0 && 1 >= y && g >= 0 && 1 >= g)
							return !0
					}
					return !1
				}
				if (e.shape instanceof game.Line && t.shape instanceof game.Circle || e.shape instanceof game.Circle && t.shape instanceof game.Line) {
					var x = e.shape instanceof game.Line ? e : t,
					r = e.shape instanceof game.Circle ? e : t,
					o = x.position.x - Math.sin(x.shape.rotation - x.rotation) * (x.shape.length / 2),
					h = x.position.y - Math.cos(x.shape.rotation - x.rotation) * (x.shape.length / 2),
					l = x.position.x + Math.sin(x.shape.rotation - x.rotation) * (x.shape.length / 2),
					u = x.position.y + Math.cos(x.shape.rotation - x.rotation) * (x.shape.length / 2),
					b = l - o,
					T = u - h,
					w = r.position.x,
					S = r.position.y,
					C = w - o,
					A = S - h,
					M = (b * C + T * A) / (x.shape.length * x.shape.length);
					if (0 > M) {
						var E = Math.sqrt(C * C + A * A);
						if (E < r.shape.radius)
							return !0
					} else if (M > 1) {
						var E = this.distance(w, S, l, u);
						if (E < r.shape.radius)
							return !0
					} else {
						var E = this.distance(C, A, b * M, T * M);
						if (E < r.shape.radius)
							return !0
					}
					return !1
				}
				return !1
			},
			hitResponse : function (e, t) {
				if (e.shape instanceof game.Rectangle && t.shape instanceof game.Rectangle) {
					if (e.last.y + e.shape.height / 2 <= t.last.y - t.shape.height / 2) {
						if (e.collide(t))
							return e.position.y = t.position.y - t.shape.height / 2 - e.shape.height / 2, !0
					} else if (e.last.y - e.shape.height / 2 >= t.last.y + t.shape.height / 2) {
						if (e.collide(t))
							return e.position.y = t.position.y + t.shape.height / 2 + e.shape.height / 2, !0
					} else if (e.last.x + e.shape.width / 2 <= t.last.x - t.shape.width / 2) {
						if (e.collide(t))
							return e.position.x = t.position.x - t.shape.width / 2 - e.shape.width / 2, !0
					} else if (e.last.x - e.shape.width / 2 >= t.last.x + t.shape.width / 2 && e.collide(t))
						return e.position.x = t.position.x + t.shape.width / 2 + e.shape.width / 2, !0
				} else if (e.shape instanceof game.Circle && t.shape instanceof game.Circle) {
					if (e.collide(t)) {
						var i = t.position.angle(e.position),
						r = e.shape.radius + t.shape.radius;
						return e.position.x = t.position.x + Math.cos(i) * r,
						e.position.y = t.position.y + Math.sin(i) * r,
						!0
					}
				} else if (e.shape instanceof game.Rectangle && t.shape instanceof game.Circle) {
					if (e.collide(t))
						return
				} else if (e.shape instanceof game.Circle && t.shape instanceof game.Rectangle) {
					if (e.collide(t))
						return
				} else if (e.shape instanceof game.Line && t.shape instanceof game.Line) {
					if (e.collide(t))
						return
				} else if (e.shape instanceof game.Circle && t.shape instanceof game.Line) {
					if (e.collide(t))
						return
				} else if (e.shape instanceof game.Line && t.shape instanceof game.Circle && e.collide(t))
					return;
				return !1
			}
		}),
	game.Body = game.Class.extend({
			world : null,
			shape : null,
			position : null,
			last : null,
			velocity : null,
			velocityLimit : null,
			mass : 0,
			collisionGroup : null,
			collideAgainst : null,
			rotation : 0,
			init : function (e) {
				this.position = new game.Vector,
				this.velocity = new game.Vector,
				this.velocityLimit = new game.Vector(500, 500),
				this.last = new game.Vector,
				game.merge(this, e)
			},
			addShape : function (e) {
				this.shape = e
			},
			collide : function () {
				return !0
			},
			afterCollide : function () {},
			setCollisionGroup : function (e) {
				this.world && ("number" == typeof this.collisionGroup && this.world.removeBodyCollision(this, this.collisionGroup), this.world.addBodyCollision(this, e))
			},
			setCollideAgainst : function (e) {
				this.collideAgainst = e
			},
			update : function () {
				this.last.copy(this.position),
				this.mass > 0 && (this.velocity.x += this.world.gravity.x * this.mass * game.system.delta, this.velocity.y += this.world.gravity.y * this.mass * game.system.delta, this.velocity.limit(this.velocityLimit)),
				this.position.multiplyAdd(this.velocity, game.scale * game.system.delta)
			}
		}),
	game.Rectangle = game.Class.extend({
			width : 50,
			height : 50,
			init : function (e, t) {
				this.width = e || this.width * game.scale,
				this.height = t || this.height * game.scale
			}
		}),
	game.Circle = game.Class.extend({
			radius : 50,
			init : function (e) {
				this.radius = e || this.radius * game.scale
			}
		}),
	game.Line = game.Class.extend({
			length : 50,
			rotation : 0,
			init : function (e, t) {
				this.length = e || this.length * game.scale,
				this.rotation = t || this.rotation
			}
		}),
	game.Vector = game.Class.extend({
			value : null,
			init : function (e, t) {
				this.value = new Float32Array(2),
				this.x = e || 0,
				this.y = t || 0
			},
			set : function (e, t) {
				return this.x = e,
				this.y = t,
				this
			},
			clone : function () {
				return new game.Vector(this.x, this.y)
			},
			copy : function (e) {
				return this.x = e.x,
				this.y = e.y,
				this
			},
			add : function (e, t) {
				return this.x += e instanceof game.Vector ? e.x : e,
				this.y += e instanceof game.Vector ? e.y : t || e,
				this
			},
			subtract : function (e, t) {
				return this.x -= e instanceof game.Vector ? e.x : e,
				this.y -= e instanceof game.Vector ? e.y : t || e,
				this
			},
			multiply : function (e, t) {
				return this.x *= e instanceof game.Vector ? e.x : e,
				this.y *= e instanceof game.Vector ? e.y : t || e,
				this
			},
			multiplyAdd : function (e, t) {
				return this.x += e instanceof game.Vector ? e.x * t : e * t,
				this.y += e instanceof game.Vector ? e.y * t : e * t,
				this
			},
			divide : function (e, t) {
				return this.x /= e instanceof game.Vector ? e.x : e,
				this.y /= e instanceof game.Vector ? e.y : t || e,
				this
			},
			distance : function (e) {
				var t = e.x - this.x,
				i = e.y - this.y;
				return Math.sqrt(t * t + i * i)
			},
			length : function () {
				return Math.sqrt(this.dot())
			},
			dot : function (e) {
				return e instanceof game.Vector ? this.x * e.x + this.y * e.y : this.x * this.x + this.y * this.y
			},
			dotNormalized : function (e) {
				var t = this.length(),
				i = this.x / t,
				r = this.y / t;
				if (e instanceof game.Vector) {
					var s = e.length(),
					n = e.x / s,
					a = e.y / s;
					return i * n + r * a
				}
				return i * i + r * r
			},
			rotate : function (e) {
				var t = Math.cos(e),
				i = Math.sin(e),
				r = this.x * t - this.y * i,
				s = this.y * t + this.x * i;
				return this.x = r,
				this.y = s,
				this
			},
			normalize : function () {
				var e = this.length();
				return this.x /= e || 1,
				this.y /= e || 1,
				this
			},
			limit : function (e) {
				return this.x = this.x.limit(-e.x, e.x),
				this.y = this.y.limit(-e.y, e.y),
				this
			},
			angle : function (e) {
				return Math.atan2(e.y - this.y, e.x - this.x)
			},
			angleFromOrigin : function (e) {
				return Math.atan2(e.y, e.x) - Math.atan2(this.y, this.x)
			},
			round : function () {
				return this.x = Math.round(this.x),
				this.y = Math.round(this.y),
				this
			}
		}),
	Object.defineProperty(game.Vector.prototype, "x", {
		get : function () {
			return this.value[0]
		},
		set : function (e) {
			this.value[0] = e
		}
	}),
	Object.defineProperty(game.Vector.prototype, "y", {
		get : function () {
			return this.value[1]
		},
		set : function (e) {
			this.value[1] = e
		}
	})
}), game.module("game.assets").require("engine.audio").body(function () {
	game.addAsset("media/player1.png"),
	game.addAsset("media/player2.png"),
	game.addAsset("media/logo2.png"),
	game.addAsset("media/logo1.png"),
	game.addAsset("media/cloud4.png"),
	game.addAsset("media/cloud3.png"),
	game.addAsset("media/cloud2.png"),
	game.addAsset("media/cloud1.png"),
	game.addAsset("media/ground.png"),
	game.addAsset("media/bushes.png"),
	game.addAsset("media/parallax3.png"),
	game.addAsset("media/parallax2.png"),
	game.addAsset("media/parallax1.png"),
	game.addAsset("media/particle.png"),
	game.addAsset("media/particle2.png"),
	game.addAsset("media/bar.png"),
	game.addAsset("media/gameover.png"),
	game.addAsset("media/new.png"),
	game.addAsset("media/restart.png"),
	game.addAsset("media/madewithpanda.png"),
	game.addAsset("media/font.fnt"),
	game.addAudio("media/sound/explosion.m4a", "explosion"),
	game.addAudio("media/sound/jump.m4a", "jump"),
	game.addAudio("media/sound/score.m4a", "score"),
	game.addAudio("media/sound/highscore.m4a", "highscore"),
	game.addAudio("media/sound/music.m4a", "music")
}), game.module("game.objects").require("engine.sprite").body(function () {
	Player = game.Class.extend({
			jumpPower : -750,
			init : function () {
				var e = game.system.width / 2,
				t = 500;
				this.sprite = new game.MovieClip([game.Texture.fromImage("media/player1.png"), game.Texture.fromImage("media/player2.png")]),
				this.sprite.position.x = e,
				this.sprite.position.y = t,
				this.sprite.anchor.x = this.sprite.anchor.y = .5,
				this.sprite.animationSpeed = .1,
				this.sprite.play(),
				game.scene.stage.addChild(this.sprite),
				game.scene.addObject(this),
				this.body = new game.Body({
						position : {
							x : e,
							y : t
						},
						velocityLimit : {
							x : 100,
							y : 1e3
						},
						collideAgainst : 0,
						collisionGroup : 1
					}),
				this.body.collide = this.collide.bind(this);
				var i = new game.Rectangle(132, 36);
				this.body.addShape(i),
				game.scene.world.addBody(this.body),
				this.smokeEmitter = new game.Emitter({
						angle : Math.PI,
						angleVar : .1,
						endAlpha : 1,
						life : .4,
						lifeVar : .2,
						count : 2,
						speed : 400
					}),
				this.smokeEmitter.container = game.scene.stage,
				this.smokeEmitter.textures.push("media/particle.png"),
				game.scene.emitters.push(this.smokeEmitter),
				this.flyEmitter = new game.Emitter({
						life : 0,
						rate : 0,
						positionVar : {
							x : 50,
							y : 50
						},
						targetForce : 200,
						speed : 100,
						velocityLimit : {
							x : 100,
							y : 100
						},
						endAlpha : 1
					}),
				this.flyEmitter.container = game.scene.stage,
				this.flyEmitter.textures.push("media/particle2.png"),
				this.flyEmitter.position.x = this.sprite.position.x + 30,
				this.flyEmitter.position.y = this.sprite.position.y - 30,
				this.flyEmitter.emit(5),
				game.scene.emitters.push(this.flyEmitter)
			},
			collide : function () {
				return game.scene.ended || (game.scene.gameOver(), this.body.velocity.y = -200, this.smokeEmitter.rate = 0),
				this.body.velocity.x = 0,
				!0
			},
			update : function () {
				this.sprite.position.x = this.body.position.x,
				this.sprite.position.y = this.body.position.y,
				this.smokeEmitter.position.x = this.sprite.position.x - 60,
				this.smokeEmitter.position.y = this.sprite.position.y,
				this.flyEmitter.target.x = this.sprite.position.x + 30,
				this.flyEmitter.target.y = this.sprite.position.y - 30
			},
			jump : function () {
				this.body.position.y < 0 || (this.body.velocity.y = this.jumpPower, game.audio.playSound("jump"))
			}
		}),
	Gap = game.Class.extend({
			groundTop : 800,
			width : 132,
			minY : 150,
			maxY : 550,
			height : 232,
			speed : -300,
			init : function () {
				var e = Math.round(game.Math.random(this.minY, this.maxY)),
				t = e - this.height / 2;
				this.topBody = new game.Body({
						position : {
							x : game.system.width + this.width / 2,
							y : t / 2
						},
						velocity : {
							x : this.speed
						},
						collisionGroup : 0
					});
				var i = new game.Rectangle(this.width, t);
				this.topBody.addShape(i),
				game.scene.world.addBody(this.topBody);
				var r = this.groundTop - t - this.height;
				this.bottomBody = new game.Body({
						position : {
							x : game.system.width + this.width / 2,
							y : t + this.height + r / 2
						},
						velocity : {
							x : this.speed
						},
						collisionGroup : 0
					});
				var s = new game.Rectangle(this.width, r);
				this.bottomBody.addShape(s),
				game.scene.world.addBody(this.bottomBody),
				this.goalBody = new game.Body({
						position : {
							x : game.system.width + this.width / 2 + this.width + game.scene.player.body.shape.width,
							y : t + this.height / 2
						},
						velocity : {
							x : this.speed
						},
						collisionGroup : 1,
						collideAgainst : 1
					}),
				this.goalBody.collide = function () {
					return game.scene.world.removeBody(this),
					game.scene.addScore(),
					!1
				};
				var n = new game.Rectangle(this.width, this.height + game.scene.player.body.shape.height);
				this.goalBody.addShape(n),
				game.scene.world.addBody(this.goalBody),
				this.topSprite = new game.Sprite(game.system.width + this.width / 2, t, "media/bar.png", {
						anchor : {
							x : .5,
							y : 0
						},
						scale : {
							y : -1
						}
					}),
				game.scene.gapContainer.addChild(this.topSprite),
				this.bottomSprite = new game.Sprite(game.system.width + this.width / 2, t + this.height, "media/bar.png", {
						anchor : {
							x : .5,
							y : 0
						}
					}),
				game.scene.gapContainer.addChild(this.bottomSprite)
			},
			update : function () {
				this.topSprite.position.x = this.bottomSprite.position.x = this.topBody.position.x,
				this.topSprite.position.x + this.width / 2 < 0 && (game.scene.world.removeBody(this.topBody), game.scene.world.removeBody(this.bottomBody), game.scene.world.removeBody(this.goalBody), game.scene.gapContainer.removeChild(this.topSprite), game.scene.gapContainer.removeChild(this.bottomSprite), game.scene.removeObject(this))
			}
		}),
	Cloud = game.Sprite.extend({
			update : function () {
				this.position.x += this.speed * game.scene.cloudSpeedFactor * game.system.delta,
				this.position.x + this.width < 0 && (this.position.x = game.system.width)
			}
		}),
	Logo = game.Class.extend({
			init : function () {
				var e,
				t;
				this.container = new game.Container,
				this.container.position.y = -150,
				e = new game.Tween(this.container.position).to({
						y : 200
					}, 1500).delay(100).easing(game.Tween.Easing.Back.Out).start(),
				t = new game.Sprite(game.system.width / 2, 0, "media/logo1.png", {
						anchor : {
							x : .5,
							y : .5
						}
					}),
				this.container.addChild(t),
				e = new game.Tween(t.position).to({
						y : -20
					}, 1e3).easing(game.Tween.Easing.Quadratic.InOut).repeat().yoyo().start(),
				t = new game.Sprite(game.system.width / 2, 80, "media/logo2.png", {
						anchor : {
							x : .5,
							y : .5
						}
					}),
				this.container.addChild(t),
				e = new game.Tween(t.position).to({
						y : 100
					}, 1e3).easing(game.Tween.Easing.Quadratic.InOut).repeat().yoyo().start(),
				game.scene.stage.addChild(this.container)
			},
			remove : function () {
				var e = new game.Tween(this.container).to({
						alpha : 0
					}, 1e3).onComplete(this.container.remove.bind(this));
				e.start()
			}
		})
}), game.module("game.scenes").require("engine.scene").body(function () {
	SceneGame = game.Scene.extend({
			backgroundColor : 11721967,
			gapTime : 1500,
			gravity : 2e3,
			score : 0,
			cloudSpeedFactor : 1,
			init : function () {
				this.world = new game.World(0, this.gravity),
				this.addParallax(400, "media/parallax1.png", -50),
				this.addParallax(550, "media/parallax2.png", -100),
				this.addParallax(650, "media/parallax3.png", -200),
				this.addCloud(100, 100, "media/cloud1.png", -50),
				this.addCloud(300, 50, "media/cloud2.png", -30),
				this.logo = new Logo,
				this.addCloud(650, 100, "media/cloud3.png", -50),
				this.addCloud(700, 200, "media/cloud4.png", -40),
				this.addParallax(700, "media/bushes.png", -250),
				this.gapContainer = new game.Container,
				this.stage.addChild(this.gapContainer),
				this.addParallax(800, "media/ground.png", -300),
				this.player = new Player;
				var e = new game.Body({
						position : {
							x : game.system.width / 2,
							y : 850
						},
						collisionGroup : 0
					}),
				t = new game.Rectangle(game.system.width, 100);
				e.addShape(t),
				this.world.addBody(e),
				this.scoreText = new game.BitmapText(this.score.toString(), {
						font : "Pixel"
					}),
				this.scoreText.position.x = game.system.width / 2 - this.scoreText.textWidth / 2,
				this.stage.addChild(this.scoreText);
				var i = new game.Sprite(game.system.width / 2, game.system.height - 48, "media/madewithpanda.png", {
						anchor : {
							x : .5,
							y : 0
						}
					});
				this.stage.addChild(i),
				game.audio.musicVolume = .2,
				game.audio.playMusic("music")
			},
			spawnGap : function () {
				this.addObject(new Gap)
			},
			addScore : function () {
				this.score++,
				this.scoreText.setText(this.score.toString()),
				game.audio.playSound("score")
			},
			addCloud : function (e, t, i, r) {
				var s = new Cloud(e, t, i, {
						speed : r
					});
				this.addObject(s),
				this.stage.addChild(s)
			},
			addParallax : function (e, t, i) {
				var r = new game.TilingSprite(t);
				r.position.y = e,
				r.speed.x = i,
				this.addObject(r),
				this.stage.addChild(r)
			},
			mousedown : function () {
				this.ended || (0 === this.player.body.mass && (game.analytics.event("play"), this.player.body.mass = 1, this.logo.remove(), this.addTimer(this.gapTime, this.spawnGap.bind(this), !0)), this.player.jump())
			},
			showScore : function () {
				var e = new game.Sprite(game.system.width / 2, game.system.height / 2, "media/gameover.png", {
						anchor : {
							x : .5,
							y : .5
						}
					}),
				t = parseInt(game.storage.get("highScore")) || 0;
				this.score > t && game.storage.set("highScore", this.score);
				var i = new game.BitmapText(t.toString(), {
						font : "Pixel"
					});
				i.position.x = 27,
				i.position.y = 43,
				e.addChild(i);
				var r = new game.BitmapText("0", {
						font : "Pixel"
					});
				if (r.position.x = i.position.x, r.position.y = -21, e.addChild(r), game.scene.stage.addChild(e), this.restartButton = new game.Sprite(game.system.width / 2, game.system.height / 2 + 250, "media/restart.png", {
							anchor : {
								x : .5,
								y : .5
							},
							scale : {
								x : 0,
								y : 0
							},
							interactive : !0,
							mousedown : function () {
								game.analytics.event("restart"),
								game.system.setScene(SceneGame)
							}
						}), this.score > 0) {
					var s = Math.min(100, 1 / this.score * 1e3),
					n = 0;
					this.addTimer(s, function () {
						if (n++, r.setText(n.toString()), n >= game.scene.score) {
							if (this.repeat = !1, game.scene.score > t) {
								game.audio.playSound("highscore");
								var i = new game.Sprite(-208, 59, "media/new.png");
								e.addChild(i)
							}
							game.scene.showRestartButton()
						}
					}, !0)
				} else
					this.showRestartButton()
			},
			showRestartButton : function () {
				var e = new game.Tween(this.restartButton.scale).to({
						x : 1,
						y : 1
					}, 200).easing(game.Tween.Easing.Back.Out);
				e.start(),
				this.stage.addChild(this.restartButton)
			},
			gameOver : function () {
				var e;
				for (this.cloudSpeedFactor = .2, this.ended = !0, this.timers.length = 0, e = 0; e < this.objects.length; e++)
					this.objects[e].speed && (this.objects[e].speed.x = 0);
				for (e = 0; e < this.world.bodies.length; e++)
					this.world.bodies[e].velocity.set(0, 0);
				this.addTimer(500, this.showScore.bind(this)),
				game.audio.stopMusic(),
				game.audio.playSound("explosion")
			}
		})
});
