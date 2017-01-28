// Sticky Plugin v1.0.0 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 2/14/2011
// Date: 2/12/2012
// Website: http://labs.anthonygarand.com/sticky
// Description: Makes an element on the page stick on the screen as you scroll
//       It will only set the 'top' and 'position' of your element, you
//       might need to adjust the width in some cases.

(function($) {
  var defaults = {
      topSpacing: 0,
      bottomSpacing: 0,
      className: 'is-sticky',
      wrapperClassName: 'sticky-wrapper',
      center: false,
      getWidthFrom: '',
      responsiveWidth: false
    },
    $window = $(window),
    $document = $(document),
    sticked = [],
    windowHeight = $window.height(),
    scroller = function() {
      var scrollTop = $window.scrollTop(),
        documentHeight = $document.height(),
        dwh = documentHeight - windowHeight,
        extra = (scrollTop > dwh) ? dwh - scrollTop : 0;

      for (var i = 0; i < sticked.length; i++) {
        var s = sticked[i],
          elementTop = s.stickyWrapper.offset().top,
          etse = elementTop - s.topSpacing - extra;

        if (scrollTop <= etse) {
          if (s.currentTop !== null) {
            s.stickyElement
              .css('position', '')
              .css('top', '');
            s.stickyElement.trigger('sticky-end', [s]).parent().removeClass(s.className);
            s.currentTop = null;
          }
        }
        else {
          var newTop = documentHeight - s.stickyElement.outerHeight()
            - s.topSpacing - s.bottomSpacing - scrollTop - extra;
          if (newTop < 0) {
            newTop = newTop + s.topSpacing;
          } else {
            newTop = s.topSpacing;
          }
          if (s.currentTop != newTop) {
            s.stickyElement
              .css('position', 'fixed')
              .css('top', newTop);

            if (typeof s.getWidthFrom !== 'undefined') {
              s.stickyElement.css('width', $(s.getWidthFrom).width());
            }

            s.stickyElement.trigger('sticky-start', [s]).parent().addClass(s.className);
            s.currentTop = newTop;
          }
        }
      }
    },
    resizer = function() {
      windowHeight = $window.height();

      for (var i = 0; i < sticked.length; i++) {
        var s = sticked[i];
        if (typeof s.getWidthFrom !== 'undefined' && s.responsiveWidth === true) {
          s.stickyElement.css('width', $(s.getWidthFrom).width());
        }
      }
    },
    methods = {
      init: function(options) {
        var o = $.extend({}, defaults, options);
        return this.each(function() {
          var stickyElement = $(this);

          var stickyId = stickyElement.attr('id');
          var wrapperId = stickyId ? stickyId + '-' + defaults.wrapperClassName : defaults.wrapperClassName 
          var wrapper = $('<div></div>')
            .attr('id', stickyId + '-sticky-wrapper')
            .addClass(o.wrapperClassName);
          stickyElement.wrapAll(wrapper);

          if (o.center) {
            stickyElement.parent().css({width:stickyElement.outerWidth(),marginLeft:"auto",marginRight:"auto"});
          }

          if (stickyElement.css("float") == "right") {
            stickyElement.css({"float":"none"}).parent().css({"float":"right"});
          }

          var stickyWrapper = stickyElement.parent();
          stickyWrapper.css('height', stickyElement.outerHeight());
          sticked.push({
            topSpacing: o.topSpacing,
            bottomSpacing: o.bottomSpacing,
            stickyElement: stickyElement,
            currentTop: null,
            stickyWrapper: stickyWrapper,
            className: o.className,
            getWidthFrom: o.getWidthFrom,
            responsiveWidth: o.responsiveWidth
          });
        });
      },
      update: scroller,
      unstick: function(options) {
        return this.each(function() {
          var unstickyElement = $(this);

          var removeIdx = -1;
          for (var i = 0; i < sticked.length; i++)
          {
            if (sticked[i].stickyElement.get(0) == unstickyElement.get(0))
            {
                removeIdx = i;
            }
          }
          if(removeIdx != -1)
          {
            sticked.splice(removeIdx,1);
            unstickyElement.unwrap();
            unstickyElement.removeAttr('style');
          }
        });
      }
    };

  // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
  if (window.addEventListener) {
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', resizer, false);
  } else if (window.attachEvent) {
    window.attachEvent('onscroll', scroller);
    window.attachEvent('onresize', resizer);
  }

  $.fn.sticky = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }
  };

  $.fn.unstick = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method ) {
      return methods.unstick.apply( this, arguments );
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.sticky');
    }

  };
  $(function() {
    setTimeout(scroller, 0);
  });
})(jQuery);

(function(e){e.fn.progressTracker=function(t){function r(){if(n.tracking=="viewport"){var t=e(window).scrollTop()}else{var t=e(".progress-tracker").offset().top}e(".pt-section").each(function(r){var i=e(this),s=i.offset().top,o=s+i.outerHeight(),u=i.attr("id");if(e.isNumeric(n.positiveTolerance)){s+=n.positiveTolerance;o+=n.positiveTolerance}if(e.isNumeric(n.negativeTolerance)){s-=n.negativeTolerance;o-=n.negativeTolerance}if(t>=s&&t<=o){e(".progress-tracker ul li").removeClass("active");e(".progress-tracker ul li.section-"+u).addClass("active")}})}function i(){if(!n.displayWhenActive){return false}var t=e(".progress-tracker"),r=e(".pt-section:first").offset().top,i=e(".pt-section:last").offset().top+e(".pt-section:last").outerHeight();if(t.offset().top>=r&&t.offset().top<=i){t.removeClass("hide")}else{t.addClass("hide")}}var n=e.extend({linking:true,tooltip:"constant",positiveTolerance:0,negativeTolerance:0,displayWhenActive:true,disableBelow:0,tracking:"tracker"},t);e("body").append('<div class="progress-tracker"><ul></ul></div>');e(".pt-section").each(function(t){var r=e(this),i=r.attr("id"),s=r.data("name"),o="",u="";if(n.linking){o='<a class="pt-circle" href="#'+i+'"></a>'}if(n.tooltip){u="<span class='pt-description'><span>"+s+"</span></span>"}e(".progress-tracker ul").append('<li class="section-'+i+'">'+o+u+"</li>");e(".progress-tracker").css({"margin-top":"-"+e(".progress-tracker").height()/2+"px"})});if(n.linking){e(".progress-tracker ul li a.pt-circle").on("click",function(t){t.preventDefault();var n=e(this).attr("href");e("html, body").animate({scrollTop:e(n).offset().top+1},1e3)})}if(n.tooltip=="hover"){e(".progress-tracker ul li").hover(function(){e(this).find(".pt-description").show()},function(){e(this).find(".pt-description").hide()})}else if(n.tooltip=="constant"){e(".progress-tracker").addClass("constant")}e(window).scroll(function(){r();i()});e(document).ready(function(){r();i()});if(n.disableBelow>0&&e.isNumeric(n.disableBelow)){var s;function o(){if(e(window).width()<=n.disableBelow){e(".progress-tracker").hide()}else{e(".progress-tracker").show()}}e(window).resize(function(){clearTimeout(s);s=setTimeout(o,150)});o()}}})(jQuery)
!function (a, b) { "object" == typeof exports && "object" == typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define([], b) : "object" == typeof exports ? exports.PUBNUB = b() : a.PUBNUB = b() } (this, function () {
    return function (a) { function b(d) { if (c[d]) return c[d].exports; var e = c[d] = { exports: {}, id: d, loaded: !1 }; return a[d].call(e.exports, e, e.exports, b), e.loaded = !0, e.exports } var c = {}; return b.m = a, b.c = c, b.p = "", b(0) } ([function (a, b, c) { function d(a, b) { var c = q.HmacSHA256(a, b); return c.toString(q.enc.Base64) } function e(a) { return document.getElementById(a) } function f(a) { console.error(a) } function g(a, b) { var c = []; return r.each(a.split(/\s+/), function (a) { r.each((b || document).getElementsByTagName(a), function (a) { c.push(a) }) }), c } function h(a, b, c) { r.each(a.split(","), function (a) { var d = function (a) { a || (a = window.event), c(a) || (a.cancelBubble = !0, a.preventDefault && a.preventDefault(), a.stopPropagation && a.stopPropagation()) }; b.addEventListener ? b.addEventListener(a, d, !1) : b.attachEvent ? b.attachEvent("on" + a, d) : b["on" + a] = d }) } function i() { return g("head")[0] } function j(a, b, c) { return c ? void a.setAttribute(b, c) : a && a.getAttribute && a.getAttribute(b) } function k(a, b) { for (var c in b) if (b.hasOwnProperty(c)) try { a.style[c] = b[c] + ("|width|height|top|left|".indexOf(c) > 0 && "number" == typeof b[c] ? "px" : "") } catch (d) { return } } function l(a) { return document.createElement(a) } function m(a) { var b, c, d = 0, e = 0, f = !0, g = a.timeout || r.DEF_TIMEOUT, h = a.data || {}, i = a.fail || function () { }, j = a.success || function () { }, k = function (a, e) { d || (d = 1, clearTimeout(c), b && (b.onerror = b.onload = null, b.abort && b.abort(), b = null), a && i(e)) }, l = function () { if (!e) { var a; e = 1, clearTimeout(c); try { a = JSON.parse(b.responseText) } catch (d) { return k(1) } j(a) } }; c = r.timeout(function () { k(1) }, g); try { b = "undefined" != typeof XDomainRequest && new XDomainRequest || new XMLHttpRequest, b.onerror = b.onabort = function () { k(1, b.responseText || { error: "Network Connection Error" }) }, b.onload = b.onloadend = l; var m = r.build_url(a.url, h); b.open("GET", m, f), f && (b.timeout = g), b.send() } catch (n) { k(1, { error: "XHR Failed", stacktrace: n }) } return k } function n() { if (!("onLine" in navigator)) return 1; try { return navigator.onLine } catch (a) { return !0 } } function o(a) { return "sendBeacon" in navigator && navigator.sendBeacon(a) } c(1); var p = c(2), q = c(3), r = c(4), s = c(8); window.console || (window.console = window.console || {}), console.log || (console.log = console.error = (window.opera || {}).postError || function () { }); var t = function () { var a = {}, b = !1; try { b = window.localStorage } catch (c) { return } var d = function (a) { return document.cookie.indexOf(a) === -1 ? null : ((document.cookie || "").match(RegExp(a + "=([^;]+)")) || [])[1] || null }, e = function (a, b) { document.cookie = a + "=" + b + "; expires=Thu, 1 Aug " + ((new Date).getFullYear() + 1) + " 20:00:00 UTC; path=/" }, f = function () { try { return e("pnctest", "1"), "1" === d("pnctest") } catch (a) { return !1 } } (); return { get: function (c) { try { return b ? b.getItem(c) : f ? d(c) : a[c] } catch (e) { return a[c] } }, set: function (c, d) { try { if (b) return b.setItem(c, d) && 0; f && e(c, d), a[c] = d } catch (g) { a[c] = d } } } } (), u = { list: {}, unbind: function (a) { u.list[a] = [] }, bind: function (a, b) { (u.list[a] = u.list[a] || []).push(b) }, fire: function (a, b) { r.each(u.list[a] || [], function (a) { a(b) }) } }, v = function (a) { var b = a.leave_on_unload || 0; a.xdr = m, a.db = t, a.error = a.error || f, a._is_online = n, a.hmac_SHA256 = d, a.crypto_obj = p(), a.sendBeacon = o, a.sdk_family = "Web"; var c = function (a) { return v(a) }, q = r.PN_API(a); for (var w in q) q.hasOwnProperty(w) && (c[w] = q[w]); return c.css = k, c.$ = e, c.create = l, c.bind = h, c.head = i, c.search = g, c.attr = j, c.events = u, c.init = c, c.secure = c, c.crypto_obj = p(), c.WS = s, c.PNmessage = r.PNmessage, c.supplant = r.supplant, h("beforeunload", window, function () { return b && c["each-channel"](function (a) { c.LEAVE(a.name, 0) }), !0 }), c.ready(), a.notest ? c : (h("offline", window, c.offline), h("offline", document, c.offline), c) }; v.init = v, v.secure = v, v.crypto_obj = p(), v.WS = s, v.db = t, v.PNmessage = r.PNmessage, v.uuid = r.uuid, v.css = k, v.$ = e, v.create = e, v.bind = h, v.head = i, v.search = g, v.attr = j, v.events = u, v.map = r.map, v.each = r.each, v.grep = r.grep, v.supplant = r.supplant, v.now = r.now, v.unique = r.unique, v.updater = r.updater, window.jQuery && (window.jQuery.PUBNUB = v), a.exports = v }, function (module, exports) { (function () { window.JSON && window.JSON.stringify || function () { function toJSON(a) { try { return this.valueOf() } catch (b) { return null } } function quote(a) { return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function (a) { var b = meta[a]; return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + a + '"' } function str(a, b) { var c, d, e, f, g, h = gap, i = b[a]; switch (i && "object" == typeof i && (i = toJSON.call(i, a)), "function" == typeof rep && (i = rep.call(b, a, i)), typeof i) { case "string": return quote(i); case "number": return isFinite(i) ? String(i) : "null"; case "boolean": case "null": return String(i); case "object": if (!i) return "null"; if (gap += indent, g = [], "[object Array]" === Object.prototype.toString.apply(i)) { for (f = i.length, c = 0; c < f; c += 1)g[c] = str(c, i) || "null"; return e = 0 === g.length ? "[]" : gap ? "[\n" + gap + g.join(",\n" + gap) + "\n" + h + "]" : "[" + g.join(",") + "]", gap = h, e } if (rep && "object" == typeof rep) for (f = rep.length, c = 0; c < f; c += 1)d = rep[c], "string" == typeof d && (e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e)); else for (d in i) Object.hasOwnProperty.call(i, d) && (e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e)); return e = 0 === g.length ? "{}" : gap ? "{\n" + gap + g.join(",\n" + gap) + "\n" + h + "}" : "{" + g.join(",") + "}", gap = h, e } } window.JSON || (window.JSON = {}); var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, rep; "function" != typeof JSON.stringify && (JSON.stringify = function (a, b, c) { var d; if (gap = "", indent = "", "number" == typeof c) for (d = 0; d < c; d += 1)indent += " "; else "string" == typeof c && (indent = c); if (rep = b, b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length)) throw new Error("JSON.stringify"); return str("", { "": a }) }), "function" != typeof JSON.parse && (JSON.parse = function (text) { return eval("(" + text + ")") }) } () }).call(window) }, function (a, b, c) { function d() { function a(a) { return e.SHA256(a).toString(e.enc.Hex) } function b(a) { return a = a || {}, a.hasOwnProperty("encryptKey") || (a.encryptKey = l.encryptKey), a.hasOwnProperty("keyEncoding") || (a.keyEncoding = l.keyEncoding), a.hasOwnProperty("keyLength") || (a.keyLength = l.keyLength), a.hasOwnProperty("mode") || (a.mode = l.mode), i.indexOf(a.keyEncoding.toLowerCase()) == -1 && (a.keyEncoding = l.keyEncoding), j.indexOf(parseInt(a.keyLength, 10)) == -1 && (a.keyLength = l.keyLength), k.indexOf(a.mode.toLowerCase()) == -1 && (a.mode = l.mode), a } function c(a, b) { return "base64" === b.keyEncoding ? e.enc.Base64.parse(a) : "hex" === b.keyEncoding ? e.enc.Hex.parse(a) : a } function d(b, d) { return b = c(b, d), d.encryptKey ? e.enc.Utf8.parse(a(b).slice(0, 32)) : b } function f(a) { return "ecb" === a.mode ? e.mode.ECB : e.mode.CBC } function g(a) { return "cbc" === a.mode ? e.enc.Utf8.parse(h) : null } var h = "0123456789012345", i = ["hex", "utf8", "base64", "binary"], j = [128, 256], k = ["ecb", "cbc"], l = { encryptKey: !0, keyEncoding: "utf8", keyLength: 256, mode: "cbc" }; return { encrypt: function (a, c, h) { if (!c) return a; h = b(h); var i = g(h), j = f(h), k = d(c, h), l = JSON.stringify(a), m = e.AES.encrypt(l, k, { iv: i, mode: j }).ciphertext, n = m.toString(e.enc.Base64); return n || a }, decrypt: function (a, c, h) { if (!c) return a; h = b(h); var i = g(h), j = f(h), k = d(c, h); try { var l = e.enc.Base64.parse(a), m = e.AES.decrypt({ ciphertext: l }, k, { iv: i, mode: j }).toString(e.enc.Utf8), n = JSON.parse(m); return n } catch (o) { return } } } } var e = c(3); a.exports = d }, function (a, b) { var c = c || function (a, b) { var c = {}, d = c.lib = {}, e = function () { }, f = d.Base = { extend: function (a) { e.prototype = this; var b = new e; return a && b.mixIn(a), b.hasOwnProperty("init") || (b.init = function () { b.$super.init.apply(this, arguments) }), b.init.prototype = b, b.$super = this, b }, create: function () { var a = this.extend(); return a.init.apply(a, arguments), a }, init: function () { }, mixIn: function (a) { for (var b in a) a.hasOwnProperty(b) && (this[b] = a[b]); a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function () { return this.init.prototype.extend(this) } }, g = d.WordArray = f.extend({ init: function (a, c) { a = this.words = a || [], this.sigBytes = c != b ? c : 4 * a.length }, toString: function (a) { return (a || i).stringify(this) }, concat: function (a) { var b = this.words, c = a.words, d = this.sigBytes; if (a = a.sigBytes, this.clamp(), d % 4) for (var e = 0; e < a; e++)b[d + e >>> 2] |= (c[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((d + e) % 4); else if (65535 < c.length) for (e = 0; e < a; e += 4)b[d + e >>> 2] = c[e >>> 2]; else b.push.apply(b, c); return this.sigBytes += a, this }, clamp: function () { var b = this.words, c = this.sigBytes; b[c >>> 2] &= 4294967295 << 32 - 8 * (c % 4), b.length = a.ceil(c / 4) }, clone: function () { var a = f.clone.call(this); return a.words = this.words.slice(0), a }, random: function (b) { for (var c = [], d = 0; d < b; d += 4)c.push(4294967296 * a.random() | 0); return new g.init(c, b) } }), h = c.enc = {}, i = h.Hex = { stringify: function (a) { var b = a.words; a = a.sigBytes; for (var c = [], d = 0; d < a; d++) { var e = b[d >>> 2] >>> 24 - 8 * (d % 4) & 255; c.push((e >>> 4).toString(16)), c.push((15 & e).toString(16)) } return c.join("") }, parse: function (a) { for (var b = a.length, c = [], d = 0; d < b; d += 2)c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - 4 * (d % 8); return new g.init(c, b / 2) } }, j = h.Latin1 = { stringify: function (a) { var b = a.words; a = a.sigBytes; for (var c = [], d = 0; d < a; d++)c.push(String.fromCharCode(b[d >>> 2] >>> 24 - 8 * (d % 4) & 255)); return c.join("") }, parse: function (a) { for (var b = a.length, c = [], d = 0; d < b; d++)c[d >>> 2] |= (255 & a.charCodeAt(d)) << 24 - 8 * (d % 4); return new g.init(c, b) } }, k = h.Utf8 = { stringify: function (a) { try { return decodeURIComponent(escape(j.stringify(a))) } catch (b) { throw Error("Malformed UTF-8 data") } }, parse: function (a) { return j.parse(unescape(encodeURIComponent(a))) } }, l = d.BufferedBlockAlgorithm = f.extend({ reset: function () { this._data = new g.init, this._nDataBytes = 0 }, _append: function (a) { "string" == typeof a && (a = k.parse(a)), this._data.concat(a), this._nDataBytes += a.sigBytes }, _process: function (b) { var c = this._data, d = c.words, e = c.sigBytes, f = this.blockSize, h = e / (4 * f), h = b ? a.ceil(h) : a.max((0 | h) - this._minBufferSize, 0); if (b = h * f, e = a.min(4 * b, e), b) { for (var i = 0; i < b; i += f)this._doProcessBlock(d, i); i = d.splice(0, b), c.sigBytes -= e } return new g.init(i, e) }, clone: function () { var a = f.clone.call(this); return a._data = this._data.clone(), a }, _minBufferSize: 0 }); d.Hasher = l.extend({ cfg: f.extend(), init: function (a) { this.cfg = this.cfg.extend(a), this.reset() }, reset: function () { l.reset.call(this), this._doReset() }, update: function (a) { return this._append(a), this._process(), this }, finalize: function (a) { return a && this._append(a), this._doFinalize() }, blockSize: 16, _createHelper: function (a) { return function (b, c) { return new a.init(c).finalize(b) } }, _createHmacHelper: function (a) { return function (b, c) { return new m.HMAC.init(a, c).finalize(b) } } }); var m = c.algo = {}; return c } (Math); !function (a) { for (var b = c, d = b.lib, e = d.WordArray, f = d.Hasher, d = b.algo, g = [], h = [], i = function (a) { return 4294967296 * (a - (0 | a)) | 0 }, j = 2, k = 0; 64 > k;) { var l; a: { l = j; for (var m = a.sqrt(l), n = 2; n <= m; n++)if (!(l % n)) { l = !1; break a } l = !0 } l && (8 > k && (g[k] = i(a.pow(j, .5))), h[k] = i(a.pow(j, 1 / 3)), k++), j++ } var o = [], d = d.SHA256 = f.extend({ _doReset: function () { this._hash = new e.init(g.slice(0)) }, _doProcessBlock: function (a, b) { for (var c = this._hash.words, d = c[0], e = c[1], f = c[2], g = c[3], i = c[4], j = c[5], k = c[6], l = c[7], m = 0; 64 > m; m++) { if (16 > m) o[m] = 0 | a[b + m]; else { var n = o[m - 15], p = o[m - 2]; o[m] = ((n << 25 | n >>> 7) ^ (n << 14 | n >>> 18) ^ n >>> 3) + o[m - 7] + ((p << 15 | p >>> 17) ^ (p << 13 | p >>> 19) ^ p >>> 10) + o[m - 16] } n = l + ((i << 26 | i >>> 6) ^ (i << 21 | i >>> 11) ^ (i << 7 | i >>> 25)) + (i & j ^ ~i & k) + h[m] + o[m], p = ((d << 30 | d >>> 2) ^ (d << 19 | d >>> 13) ^ (d << 10 | d >>> 22)) + (d & e ^ d & f ^ e & f), l = k, k = j, j = i, i = g + n | 0, g = f, f = e, e = d, d = n + p | 0 } c[0] = c[0] + d | 0, c[1] = c[1] + e | 0, c[2] = c[2] + f | 0, c[3] = c[3] + g | 0, c[4] = c[4] + i | 0, c[5] = c[5] + j | 0, c[6] = c[6] + k | 0, c[7] = c[7] + l | 0 }, _doFinalize: function () { var b = this._data, c = b.words, d = 8 * this._nDataBytes, e = 8 * b.sigBytes; return c[e >>> 5] |= 128 << 24 - e % 32, c[(e + 64 >>> 9 << 4) + 14] = a.floor(d / 4294967296), c[(e + 64 >>> 9 << 4) + 15] = d, b.sigBytes = 4 * c.length, this._process(), this._hash }, clone: function () { var a = f.clone.call(this); return a._hash = this._hash.clone(), a } }); b.SHA256 = f._createHelper(d), b.HmacSHA256 = f._createHmacHelper(d) } (Math), function () { var a = c, b = a.enc.Utf8; a.algo.HMAC = a.lib.Base.extend({ init: function (a, c) { a = this._hasher = new a.init, "string" == typeof c && (c = b.parse(c)); var d = a.blockSize, e = 4 * d; c.sigBytes > e && (c = a.finalize(c)), c.clamp(); for (var f = this._oKey = c.clone(), g = this._iKey = c.clone(), h = f.words, i = g.words, j = 0; j < d; j++)h[j] ^= 1549556828, i[j] ^= 909522486; f.sigBytes = g.sigBytes = e, this.reset() }, reset: function () { var a = this._hasher; a.reset(), a.update(this._iKey) }, update: function (a) { return this._hasher.update(a), this }, finalize: function (a) { var b = this._hasher; return a = b.finalize(a), b.reset(), b.finalize(this._oKey.clone().concat(a)) } }) } (), function () { var a = c, b = a.lib.WordArray; a.enc.Base64 = { stringify: function (a) { var b = a.words, c = a.sigBytes, d = this._map; a.clamp(), a = []; for (var e = 0; e < c; e += 3)for (var f = (b[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 16 | (b[e + 1 >>> 2] >>> 24 - 8 * ((e + 1) % 4) & 255) << 8 | b[e + 2 >>> 2] >>> 24 - 8 * ((e + 2) % 4) & 255, g = 0; 4 > g && e + .75 * g < c; g++)a.push(d.charAt(f >>> 6 * (3 - g) & 63)); if (b = d.charAt(64)) for (; a.length % 4;)a.push(b); return a.join("") }, parse: function (a) { var c = a.length, d = this._map, e = d.charAt(64); e && (e = a.indexOf(e), -1 != e && (c = e)); for (var e = [], f = 0, g = 0; g < c; g++)if (g % 4) { var h = d.indexOf(a.charAt(g - 1)) << 2 * (g % 4), i = d.indexOf(a.charAt(g)) >>> 6 - 2 * (g % 4); e[f >>> 2] |= (h | i) << 24 - 8 * (f % 4), f++ } return b.create(e, f) }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" } } (), function (a) { function b(a, b, c, d, e, f, g) { return a = a + (b & c | ~b & d) + e + g, (a << f | a >>> 32 - f) + b } function d(a, b, c, d, e, f, g) { return a = a + (b & d | c & ~d) + e + g, (a << f | a >>> 32 - f) + b } function e(a, b, c, d, e, f, g) { return a = a + (b ^ c ^ d) + e + g, (a << f | a >>> 32 - f) + b } function f(a, b, c, d, e, f, g) { return a = a + (c ^ (b | ~d)) + e + g, (a << f | a >>> 32 - f) + b } for (var g = c, h = g.lib, i = h.WordArray, j = h.Hasher, h = g.algo, k = [], l = 0; 64 > l; l++)k[l] = 4294967296 * a.abs(a.sin(l + 1)) | 0; h = h.MD5 = j.extend({ _doReset: function () { this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878]) }, _doProcessBlock: function (a, c) { for (var g = 0; 16 > g; g++) { var h = c + g, i = a[h]; a[h] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8) } var g = this._hash.words, h = a[c + 0], i = a[c + 1], j = a[c + 2], l = a[c + 3], m = a[c + 4], n = a[c + 5], o = a[c + 6], p = a[c + 7], q = a[c + 8], r = a[c + 9], s = a[c + 10], t = a[c + 11], u = a[c + 12], v = a[c + 13], w = a[c + 14], x = a[c + 15], y = g[0], z = g[1], A = g[2], B = g[3], y = b(y, z, A, B, h, 7, k[0]), B = b(B, y, z, A, i, 12, k[1]), A = b(A, B, y, z, j, 17, k[2]), z = b(z, A, B, y, l, 22, k[3]), y = b(y, z, A, B, m, 7, k[4]), B = b(B, y, z, A, n, 12, k[5]), A = b(A, B, y, z, o, 17, k[6]), z = b(z, A, B, y, p, 22, k[7]), y = b(y, z, A, B, q, 7, k[8]), B = b(B, y, z, A, r, 12, k[9]), A = b(A, B, y, z, s, 17, k[10]), z = b(z, A, B, y, t, 22, k[11]), y = b(y, z, A, B, u, 7, k[12]), B = b(B, y, z, A, v, 12, k[13]), A = b(A, B, y, z, w, 17, k[14]), z = b(z, A, B, y, x, 22, k[15]), y = d(y, z, A, B, i, 5, k[16]), B = d(B, y, z, A, o, 9, k[17]), A = d(A, B, y, z, t, 14, k[18]), z = d(z, A, B, y, h, 20, k[19]), y = d(y, z, A, B, n, 5, k[20]), B = d(B, y, z, A, s, 9, k[21]), A = d(A, B, y, z, x, 14, k[22]), z = d(z, A, B, y, m, 20, k[23]), y = d(y, z, A, B, r, 5, k[24]), B = d(B, y, z, A, w, 9, k[25]), A = d(A, B, y, z, l, 14, k[26]), z = d(z, A, B, y, q, 20, k[27]), y = d(y, z, A, B, v, 5, k[28]), B = d(B, y, z, A, j, 9, k[29]), A = d(A, B, y, z, p, 14, k[30]), z = d(z, A, B, y, u, 20, k[31]), y = e(y, z, A, B, n, 4, k[32]), B = e(B, y, z, A, q, 11, k[33]), A = e(A, B, y, z, t, 16, k[34]), z = e(z, A, B, y, w, 23, k[35]), y = e(y, z, A, B, i, 4, k[36]), B = e(B, y, z, A, m, 11, k[37]), A = e(A, B, y, z, p, 16, k[38]), z = e(z, A, B, y, s, 23, k[39]), y = e(y, z, A, B, v, 4, k[40]), B = e(B, y, z, A, h, 11, k[41]), A = e(A, B, y, z, l, 16, k[42]), z = e(z, A, B, y, o, 23, k[43]), y = e(y, z, A, B, r, 4, k[44]), B = e(B, y, z, A, u, 11, k[45]), A = e(A, B, y, z, x, 16, k[46]), z = e(z, A, B, y, j, 23, k[47]), y = f(y, z, A, B, h, 6, k[48]), B = f(B, y, z, A, p, 10, k[49]), A = f(A, B, y, z, w, 15, k[50]), z = f(z, A, B, y, n, 21, k[51]), y = f(y, z, A, B, u, 6, k[52]), B = f(B, y, z, A, l, 10, k[53]), A = f(A, B, y, z, s, 15, k[54]), z = f(z, A, B, y, i, 21, k[55]), y = f(y, z, A, B, q, 6, k[56]), B = f(B, y, z, A, x, 10, k[57]), A = f(A, B, y, z, o, 15, k[58]), z = f(z, A, B, y, v, 21, k[59]), y = f(y, z, A, B, m, 6, k[60]), B = f(B, y, z, A, t, 10, k[61]), A = f(A, B, y, z, j, 15, k[62]), z = f(z, A, B, y, r, 21, k[63]); g[0] = g[0] + y | 0, g[1] = g[1] + z | 0, g[2] = g[2] + A | 0, g[3] = g[3] + B | 0 }, _doFinalize: function () { var b = this._data, c = b.words, d = 8 * this._nDataBytes, e = 8 * b.sigBytes; c[e >>> 5] |= 128 << 24 - e % 32; var f = a.floor(d / 4294967296); for (c[(e + 64 >>> 9 << 4) + 15] = 16711935 & (f << 8 | f >>> 24) | 4278255360 & (f << 24 | f >>> 8), c[(e + 64 >>> 9 << 4) + 14] = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8), b.sigBytes = 4 * (c.length + 1), this._process(), b = this._hash, c = b.words, d = 0; 4 > d; d++)e = c[d], c[d] = 16711935 & (e << 8 | e >>> 24) | 4278255360 & (e << 24 | e >>> 8); return b }, clone: function () { var a = j.clone.call(this); return a._hash = this._hash.clone(), a } }), g.MD5 = j._createHelper(h), g.HmacMD5 = j._createHmacHelper(h) } (Math), function () { var a = c, b = a.lib, d = b.Base, e = b.WordArray, b = a.algo, f = b.EvpKDF = d.extend({ cfg: d.extend({ keySize: 4, hasher: b.MD5, iterations: 1 }), init: function (a) { this.cfg = this.cfg.extend(a) }, compute: function (a, b) { for (var c = this.cfg, d = c.hasher.create(), f = e.create(), g = f.words, h = c.keySize, c = c.iterations; g.length < h;) { i && d.update(i); var i = d.update(a).finalize(b); d.reset(); for (var j = 1; j < c; j++)i = d.finalize(i), d.reset(); f.concat(i) } return f.sigBytes = 4 * h, f } }); a.EvpKDF = function (a, b, c) { return f.create(c).compute(a, b) } } (), c.lib.Cipher || function (a) { var b = c, d = b.lib, e = d.Base, f = d.WordArray, g = d.BufferedBlockAlgorithm, h = b.enc.Base64, i = b.algo.EvpKDF, j = d.Cipher = g.extend({ cfg: e.extend(), createEncryptor: function (a, b) { return this.create(this._ENC_XFORM_MODE, a, b) }, createDecryptor: function (a, b) { return this.create(this._DEC_XFORM_MODE, a, b) }, init: function (a, b, c) { this.cfg = this.cfg.extend(c), this._xformMode = a, this._key = b, this.reset() }, reset: function () { g.reset.call(this), this._doReset() }, process: function (a) { return this._append(a), this._process() }, finalize: function (a) { return a && this._append(a), this._doFinalize() }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function (a) { return { encrypt: function (b, c, d) { return ("string" == typeof c ? p : o).encrypt(a, b, c, d) }, decrypt: function (b, c, d) { return ("string" == typeof c ? p : o).decrypt(a, b, c, d) } } } }); d.StreamCipher = j.extend({ _doFinalize: function () { return this._process(!0) }, blockSize: 1 }); var k = b.mode = {}, l = function (b, c, d) { var e = this._iv; e ? this._iv = a : e = this._prevBlock; for (var f = 0; f < d; f++)b[c + f] ^= e[f] }, m = (d.BlockCipherMode = e.extend({ createEncryptor: function (a, b) { return this.Encryptor.create(a, b) }, createDecryptor: function (a, b) { return this.Decryptor.create(a, b) }, init: function (a, b) { this._cipher = a, this._iv = b } })).extend(); m.Encryptor = m.extend({ processBlock: function (a, b) { var c = this._cipher, d = c.blockSize; l.call(this, a, b, d), c.encryptBlock(a, b), this._prevBlock = a.slice(b, b + d) } }), m.Decryptor = m.extend({ processBlock: function (a, b) { var c = this._cipher, d = c.blockSize, e = a.slice(b, b + d); c.decryptBlock(a, b), l.call(this, a, b, d), this._prevBlock = e } }), k = k.CBC = m, m = (b.pad = {}).Pkcs7 = { pad: function (a, b) { for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, e = [], g = 0; g < c; g += 4)e.push(d); c = f.create(e, c), a.concat(c) }, unpad: function (a) { a.sigBytes -= 255 & a.words[a.sigBytes - 1 >>> 2] } }, d.BlockCipher = j.extend({ cfg: j.cfg.extend({ mode: k, padding: m }), reset: function () { j.reset.call(this); var a = this.cfg, b = a.iv, a = a.mode; if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor; else c = a.createDecryptor, this._minBufferSize = 1; this._mode = c.call(a, this, b && b.words) }, _doProcessBlock: function (a, b) { this._mode.processBlock(a, b) }, _doFinalize: function () { var a = this.cfg.padding; if (this._xformMode == this._ENC_XFORM_MODE) { a.pad(this._data, this.blockSize); var b = this._process(!0) } else b = this._process(!0), a.unpad(b); return b }, blockSize: 4 }); var n = d.CipherParams = e.extend({ init: function (a) { this.mixIn(a) }, toString: function (a) { return (a || this.formatter).stringify(this) } }), k = (b.format = {}).OpenSSL = { stringify: function (a) { var b = a.ciphertext; return a = a.salt, (a ? f.create([1398893684, 1701076831]).concat(a).concat(b) : b).toString(h) }, parse: function (a) { a = h.parse(a); var b = a.words; if (1398893684 == b[0] && 1701076831 == b[1]) { var c = f.create(b.slice(2, 4)); b.splice(0, 4), a.sigBytes -= 16 } return n.create({ ciphertext: a, salt: c }) } }, o = d.SerializableCipher = e.extend({ cfg: e.extend({ format: k }), encrypt: function (a, b, c, d) { d = this.cfg.extend(d); var e = a.createEncryptor(c, d); return b = e.finalize(b), e = e.cfg, n.create({ ciphertext: b, key: c, iv: e.iv, algorithm: a, mode: e.mode, padding: e.padding, blockSize: a.blockSize, formatter: d.format }) }, decrypt: function (a, b, c, d) { return d = this.cfg.extend(d), b = this._parse(b, d.format), a.createDecryptor(c, d).finalize(b.ciphertext) }, _parse: function (a, b) { return "string" == typeof a ? b.parse(a, this) : a } }), b = (b.kdf = {}).OpenSSL = { execute: function (a, b, c, d) { return d || (d = f.random(8)), a = i.create({ keySize: b + c }).compute(a, d), c = f.create(a.words.slice(b), 4 * c), a.sigBytes = 4 * b, n.create({ key: a, iv: c, salt: d }) } }, p = d.PasswordBasedCipher = o.extend({ cfg: o.cfg.extend({ kdf: b }), encrypt: function (a, b, c, d) { return d = this.cfg.extend(d), c = d.kdf.execute(c, a.keySize, a.ivSize), d.iv = c.iv, a = o.encrypt.call(this, a, b, c.key, d), a.mixIn(c), a }, decrypt: function (a, b, c, d) { return d = this.cfg.extend(d), b = this._parse(b, d.format), c = d.kdf.execute(c, a.keySize, a.ivSize, b.salt), d.iv = c.iv, o.decrypt.call(this, a, b, c.key, d) } }) } (), function () { for (var a = c, b = a.lib.BlockCipher, d = a.algo, e = [], f = [], g = [], h = [], i = [], j = [], k = [], l = [], m = [], n = [], o = [], p = 0; 256 > p; p++)o[p] = 128 > p ? p << 1 : p << 1 ^ 283; for (var q = 0, r = 0, p = 0; 256 > p; p++) { var s = r ^ r << 1 ^ r << 2 ^ r << 3 ^ r << 4, s = s >>> 8 ^ 255 & s ^ 99; e[q] = s, f[s] = q; var t = o[q], u = o[t], v = o[u], w = 257 * o[s] ^ 16843008 * s; g[q] = w << 24 | w >>> 8, h[q] = w << 16 | w >>> 16, i[q] = w << 8 | w >>> 24, j[q] = w, w = 16843009 * v ^ 65537 * u ^ 257 * t ^ 16843008 * q, k[s] = w << 24 | w >>> 8, l[s] = w << 16 | w >>> 16, m[s] = w << 8 | w >>> 24, n[s] = w, q ? (q = t ^ o[o[o[v ^ t]]], r ^= o[o[r]]) : q = r = 1 } var x = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], d = d.AES = b.extend({ _doReset: function () { for (var a = this._key, b = a.words, c = a.sigBytes / 4, a = 4 * ((this._nRounds = c + 6) + 1), d = this._keySchedule = [], f = 0; f < a; f++)if (f < c) d[f] = b[f]; else { var g = d[f - 1]; f % c ? 6 < c && 4 == f % c && (g = e[g >>> 24] << 24 | e[g >>> 16 & 255] << 16 | e[g >>> 8 & 255] << 8 | e[255 & g]) : (g = g << 8 | g >>> 24, g = e[g >>> 24] << 24 | e[g >>> 16 & 255] << 16 | e[g >>> 8 & 255] << 8 | e[255 & g], g ^= x[f / c | 0] << 24), d[f] = d[f - c] ^ g } for (b = this._invKeySchedule = [], c = 0; c < a; c++)f = a - c, g = c % 4 ? d[f] : d[f - 4], b[c] = 4 > c || 4 >= f ? g : k[e[g >>> 24]] ^ l[e[g >>> 16 & 255]] ^ m[e[g >>> 8 & 255]] ^ n[e[255 & g]] }, encryptBlock: function (a, b) { this._doCryptBlock(a, b, this._keySchedule, g, h, i, j, e) }, decryptBlock: function (a, b) { var c = a[b + 1]; a[b + 1] = a[b + 3], a[b + 3] = c, this._doCryptBlock(a, b, this._invKeySchedule, k, l, m, n, f), c = a[b + 1], a[b + 1] = a[b + 3], a[b + 3] = c }, _doCryptBlock: function (a, b, c, d, e, f, g, h) { for (var i = this._nRounds, j = a[b] ^ c[0], k = a[b + 1] ^ c[1], l = a[b + 2] ^ c[2], m = a[b + 3] ^ c[3], n = 4, o = 1; o < i; o++)var p = d[j >>> 24] ^ e[k >>> 16 & 255] ^ f[l >>> 8 & 255] ^ g[255 & m] ^ c[n++], q = d[k >>> 24] ^ e[l >>> 16 & 255] ^ f[m >>> 8 & 255] ^ g[255 & j] ^ c[n++], r = d[l >>> 24] ^ e[m >>> 16 & 255] ^ f[j >>> 8 & 255] ^ g[255 & k] ^ c[n++], m = d[m >>> 24] ^ e[j >>> 16 & 255] ^ f[k >>> 8 & 255] ^ g[255 & l] ^ c[n++], j = p, k = q, l = r; p = (h[j >>> 24] << 24 | h[k >>> 16 & 255] << 16 | h[l >>> 8 & 255] << 8 | h[255 & m]) ^ c[n++], q = (h[k >>> 24] << 24 | h[l >>> 16 & 255] << 16 | h[m >>> 8 & 255] << 8 | h[255 & j]) ^ c[n++], r = (h[l >>> 24] << 24 | h[m >>> 16 & 255] << 16 | h[j >>> 8 & 255] << 8 | h[255 & k]) ^ c[n++], m = (h[m >>> 24] << 24 | h[j >>> 16 & 255] << 16 | h[k >>> 8 & 255] << 8 | h[255 & l]) ^ c[n++], a[b] = p, a[b + 1] = q, a[b + 2] = r, a[b + 3] = m }, keySize: 8 }); a.AES = b._createHelper(d) } (), c.mode.ECB = function () { var a = c.lib.BlockCipherMode.extend(); return a.Encryptor = a.extend({ processBlock: function (a, b) { this._cipher.encryptBlock(a, b) } }), a.Decryptor = a.extend({ processBlock: function (a, b) { this._cipher.decryptBlock(a, b) } }), a } (), a.exports = c }, function (a, b, c) {
        function d() { return "x" + ++m + +new Date } function e(a, b) { var c = []; return l.each(a, function (a, d) { b ? a.search("-pnpres") < 0 && d.subscribed && c.push(a) : d.subscribed && c.push(a) }), c.sort() } function f(a, b) { var c = []; return l.each(a, function (a, d) { b ? a.search("-pnpres") < 0 && d.subscribed && c.push(a) : d.subscribed && c.push(a) }), c.sort() } function g() { n || (n = 1, l.each(o, function (a) { a() })) } function h(a) { var b = a || { apns: {} }; return b.getPubnubMessage = function () { var a = {}; if (Object.keys(b.apns).length) { a.pn_apns = { aps: { alert: b.apns.alert, badge: b.apns.badge, sound: b.apns.sound } }; for (var c in b.apns) a.pn_apns[c] = b.apns[c]; var d = ["badge", "alert", "sound"]; for (var c in d) delete a.pn_apns[d[c]] } b.gcm && (a.pn_gcm = { data: b.gcm }); for (var c in b) a[c] = b[c]; var e = ["apns", "gcm", "publish", "channel", "callback", "error"]; for (var c in e) delete a[e[c]]; return a }, b.publish = function () { var a = b.getPubnubMessage(); b.pubnub && b.channel && b.pubnub.publish({ message: a, channel: b.channel, callback: b.callback, error: b.error }) }, b } function i(a) {
            function b() { var a = "PubNub-JS-" + Ea; return Da && (a += "-" + Da), a += "/" + x } function c(a) { return a || (a = {}), l.each(va, function (b, c) { b in a || (a[b] = c) }), a.pnsdk = b(), a } function h(a) { var b = []; return l.each(a, function (a, c) { b.push(a) }), b } function i(a) { return h(a).sort() } function j(a) { var b = "", c = i(a); for (var d in c) { var e = c[d]; b += e + "=" + l.pamEncode(a[e]), d != c.length - 1 && (b += "&") } return b } function k(a, b, c) { var d = !1; if ("undefined" == typeof a) return b; if ("number" == typeof a) d = !(a > v || 0 == a); else { if ("boolean" == typeof a) return a ? w : 0; d = !0 } return d ? (c && c("Presence Heartbeat value invalid. Valid range ( x > " + v + " or x = 0). Current Value : " + (b || v)), b || v) : a } function m(a, b) { return Ja.encrypt(a, b || Aa) || a } function r(a, b) { return Ja.decrypt(a, b || Aa) || Ja.decrypt(a, Aa) || a } function z() { return clearTimeout(oa), !qa || qa >= 500 || qa < 1 || !e(la, !0).length && !f(ma, !0).length ? void (ra = !1) : (ra = !0, void Ka.presence_heartbeat({ callback: function (a) { oa = l.timeout(z, qa * u) }, error: function (a) { wa && wa("Presence Heartbeat unable to reach Pubnub servers." + JSON.stringify(a)), oa = l.timeout(z, qa * u) } })) } function A() { !ra && z() } function B(a) { if (sa) { if (!ca.length) return } else { if (a && (ca.sending = 0), ca.sending || !ca.length) return; ca.sending = 1 } G(ca.shift()) } function C(a) { var b = 0; return l.each(f(ma), function (c) { var d = ma[c]; d && (b++ , (a || function () { })(d)) }), b } function D(a) { var b = 0; return l.each(e(la), function (c) { var d = la[c]; d && (b++ , (a || function () { })(d)) }), b } function E(a, b, c) { if ("object" == typeof a) { if (a.error) { var d = {}; return a.message && (d.message = a.message), a.payload && (d.payload = a.payload), void (c && c(d)) } if (a.payload) return void (a.next_page ? b && b(a.payload, a.next_page) : b && b(a.payload)) } b && b(a) } function F(a, b) { if ("object" == typeof a && a.error) { var c = {}; return a.message && (c.message = a.message), a.payload && (c.payload = a.payload), void (b && b(c)) } b && b(a) } function G(a) { var b = a.operation, c = Math.floor((new Date).getTime() / 1e3), d = a.data || {}; if (X) { d.auth || delete d.auth, d.timestamp = c; var e = V + "\n" + U + "\n"; if ("PNAccessManagerGrant" === b) e += "grant\n"; else if ("PNAccessManagerAudit" === b) e += "audit\n"; else { var f = a.url.slice(); f.shift(), e += "/" + f.join("/") + "\n" } e += j(d); var g = Y(e, X); g = g.replace(/\+/g, "-"), g = g.replace(/\//g, "_"), d.signature = g, a.data = d } return ua(a) } function H(a, b, d, e) { var b = a.callback || b, f = a.error || wa, g = ya(); e = e || {}, e.auth || (e.auth = a.auth_key || W); var h = [_, "v1", "channel-registration", "sub-key", V]; h.push.apply(h, d), g && (e.callback = g), G({ callback: g, data: c(e), success: function (a) { E(a, b, f) }, fail: function (a) { F(a, f) }, url: h }) } function I() { xa() || K(1, { error: "Offline. Please check your network settings." }), N && clearTimeout(N), N = l.timeout(I, u) } function J() { S && Ka.time(function (a) { M(function () { }, a), a || K(1, { error: "Heartbeat failed to connect to Pubnub Servers.Please check your network settings." }), O && clearTimeout(O), O = l.timeout(J, R) }) } function K(a, b) { ha && ha(a, b), ha = null, clearTimeout(N), clearTimeout(O) } function L(a) { var b = l.rnow() - ea; return b - a / 1e4 } function M(a, b) { function c(b) { if (b) { var c = b / 1e4, e = (l.rnow() - d) / 2; ea = l.rnow() - (c + e), a && a(ea) } } var d = l.rnow(); b && c(b) || Ka.time(c) } var N, O, P = +a.windowing || q, Q = (+a.timeout || s) * u, R = (+a.keepalive || t) * u, S = a.timecheck || 0, T = a.noleave || 0, U = a.publish_key, V = a.subscribe_key, W = a.auth_key || "", X = a.secret_key || "", Y = a.hmac_SHA256, Z = a.ssl ? "s" : "", $ = "http" + Z + "://" + (a.origin || "pubsub.pubnub.com"), _ = y($), aa = y($), ba = function () { }, ca = [], da = !0, ea = 0, fa = 0, ga = 0, ha = 0, ia = a.restore || 0, ja = 0, ka = !1, la = {}, ma = {}, na = {}, oa = null, pa = k(a.heartbeat || a.pnexpires || 0, a.error), qa = a.heartbeat_interval || pa / 2 - 1, ra = !1, sa = a.no_wait_for_pending, ta = a["compatible_3.5"] || !1, ua = a.xdr, va = a.params || {}, wa = a.error || function () { }, xa = a._is_online || function () { return 1 }, ya = a.jsonp_cb || function () { return 0 }, za = a.db || { get: function () { }, set: function () { } }, Aa = a.cipher_key, Ba = a.uuid || !a.unique_uuid && za && za.get(V + "uuid") || "", Ca = a.instance_id || !1, Da = a.partner_id, Ea = a.sdk_family, Fa = "", Ga = a.shutdown, Ha = "undefined" == typeof a.use_send_beacon || a.use_send_beacon, Ia = Ha ? a.sendBeacon : null; 2 === pa && (qa = 1); var Ja = a.crypto_obj || { encrypt: function (a, b) { return a }, decrypt: function (a, b) { return a } }, Ka = {
                LEAVE: function (a, b, d, e, f) { var g, h, i = { uuid: Ba, auth: d || W }, j = y($), e = e || function () { }, k = f || function () { }, m = ya(); if (a.indexOf(p) > 0) return !0; if (ta) { if (!Z) return !1; if ("0" == m) return !1 } if (T) return !1; if ("0" != m && (i.callback = m), Ca && (i.instanceid = Fa), g = [j, "v2", "presence", "sub_key", V, "channel", l.encode(a), "leave"], h = c(i), Ia) { var n = l.buildURL(g, h); if (Ia(n)) return e && e({ status: 200, action: "leave", message: "OK", service: "Presence" }), !0 } return G({ blocking: b || Z, callback: m, data: h, success: function (a) { E(a, e, k) }, fail: function (a) { F(a, k) }, url: g }), !0 }, LEAVE_GROUP: function (a, b, d, e, f) { var g, h, i = { uuid: Ba, auth: d || W }, j = y($), e = e || function () { }, k = f || function () { }, m = ya(); if (a.indexOf(p) > 0) return !0; if (ta) { if (!Z) return !1; if ("0" == m) return !1 } if (T) return !1; if ("0" != m && (i.callback = m), a && a.length > 0 && (i["channel-group"] = a), Ca && (i.instanceid = Fa), g = [j, "v2", "presence", "sub_key", V, "channel", l.encode(","), "leave"], h = c(i), Ia) { var n = l.buildURL(g, h); if (Ia(n)) return e && e({ status: 200, action: "leave", message: "OK", service: "Presence" }), !0 } return G({ blocking: b || Z, callback: m, data: h, success: function (a) { E(a, e, k) }, fail: function (a) { F(a, k) }, url: g }), !0 }, set_resumed: function (a) { ka = a }, get_cipher_key: function () { return Aa }, set_cipher_key: function (a) { Aa = a }, raw_encrypt: function (a, b) { return m(a, b) }, raw_decrypt: function (a, b) { return r(a, b) }, get_heartbeat: function () { return pa }, set_heartbeat: function (a, b) { pa = k(a, pa, wa), qa = b || pa / 2 - 1, 2 == pa && (qa = 1), ba(), z() }, get_heartbeat_interval: function () { return qa }, set_heartbeat_interval: function (a) { qa = a, z() }, get_version: function () { return x }, getGcmMessageObject: function (a) { return { data: a } }, getApnsMessageObject: function (a) { var b = { aps: { badge: 1, alert: "" } }; for (var c in a) c[b] = a[c]; return b }, _add_param: function (a, b) { va[a] = b }, channel_group: function (a, b) { var c, d, e = a.channel_group, b = b || a.callback, f = a.channels || a.channel, g = a.cloak, h = [], i = {}, j = a.mode || "add"; if (e) { var k = e.split(":"); k.length > 1 ? (c = "*" === k[0] ? null : k[0], d = k[1]) : d = k[0] } c && h.push("namespace") && h.push(l.encode(c)), h.push("channel-group"), d && "*" !== d && h.push(d), f ? (l.isArray(f) && (f = f.join(",")), i[j] = f, i.cloak = da ? "true" : "false") : "remove" === j && h.push("remove"), "undefined" != typeof g && (i.cloak = g ? "true" : "false"), H(a, b, h, i) }, channel_group_list_groups: function (a, b) { var c; c = a.namespace || a.ns || a.channel_group || null, c && (a.channel_group = c + ":*"), Ka.channel_group(a, b) }, channel_group_list_channels: function (a, b) { return a.channel_group ? void Ka.channel_group(a, b) : wa("Missing Channel Group") }, channel_group_remove_channel: function (a, b) { return a.channel_group ? a.channel || a.channels ? (a.mode = "remove", void Ka.channel_group(a, b)) : wa("Missing Channel") : wa("Missing Channel Group") }, channel_group_remove_group: function (a, b) { return a.channel_group ? a.channel ? wa("Use channel_group_remove_channel if you want to remove a channel from a group.") : (a.mode = "remove", void Ka.channel_group(a, b)) : wa("Missing Channel Group") }, channel_group_add_channel: function (a, b) { return a.channel_group ? a.channel || a.channels ? void Ka.channel_group(a, b) : wa("Missing Channel") : wa("Missing Channel Group") }, channel_group_cloak: function (a, b) { return "undefined" == typeof a.cloak ? void b(da) : (da = a.cloak, void Ka.channel_group(a, b)) }, channel_group_list_namespaces: function (a, b) { var c = ["namespace"]; H(a, b, c) }, channel_group_remove_namespace: function (a, b) { var c = ["namespace", a.namespace, "remove"]; H(a, b, c) }, history: function (a, b) {
                    var b = a.callback || b, d = a.count || a.limit || 100, e = a.reverse || "false", f = a.error || function () { }, g = a.auth_key || W, h = a.cipher_key, i = a.channel, j = a.channel_group, k = a.start, m = a.end, n = a.include_token, o = a.string_message_token || !1, p = {}, q = ya(); return i || j ? b ? V ? (p.stringtoken = "true", p.count = d, p.reverse = e, p.auth = g, j && (p["channel-group"] = j, i || (i = ",")), q && (p.callback = q), k && (p.start = k), m && (p.end = m), n && (p.include_token = "true"), o && (p.string_message_token = "true"), void G({
                        callback: q, data: c(p), success: function (a) { if ("object" == typeof a && a.error) return void f({ message: a.message, payload: a.payload }); for (var c = a[0], d = [], e = 0; e < c.length; e++)if (n) { var g = r(c[e].message, h), i = c[e].timetoken; try { d.push({ message: JSON.parse(g), timetoken: i }) } catch (j) { d.push({ message: g, timetoken: i }) } } else { var g = r(c[e], h); try { d.push(JSON.parse(g)) } catch (j) { d.push(g) } } b([d, a[1], a[2]]) }, fail: function (a) { F(a, f) }, url: [_, "v2", "history", "sub-key", V, "channel", l.encode(i)]
                    })) : wa("Missing Subscribe Key") : wa("Missing Callback") : wa("Missing Channel")
                }, replay: function (a, b) { var d, b = b || a.callback || function () { }, e = a.auth_key || W, f = a.source, g = a.destination, h = a.error || a.error || function () { }, i = a.stop, j = a.start, k = a.end, l = a.reverse, m = a.limit, n = ya(), o = {}; return f ? g ? U ? V ? ("0" != n && (o.callback = n), i && (o.stop = "all"), l && (o.reverse = "true"), j && (o.start = j), k && (o.end = k), m && (o.count = m), o.auth = e, d = [_, "v1", "replay", U, V, f, g], void G({ callback: n, success: function (a) { E(a, b, h) }, fail: function () { b([0, "Disconnected"]) }, url: d, data: c(o) })) : wa("Missing Subscribe Key") : wa("Missing Publish Key") : wa("Missing Destination Channel") : wa("Missing Source Channel") }, auth: function (a) { W = a, ba() }, time: function (a) { var b = ya(), d = { uuid: Ba, auth: W }; Ca && (d.instanceid = Fa), G({ callback: b, data: c(d), url: [_, "time", b], success: function (b) { a(b[0]) }, fail: function () { a(0) } }) }, publish: function (a, b) { var d = a.message; if (!d) return wa("Missing Message"); var e, f, b = b || a.callback || d.callback || a.success || function () { }, g = a.channel || d.channel, h = a.meta || a.metadata, i = a.auth_key || W, j = a.cipher_key, k = a.error || d.error || function () { }, n = a.post || !1, o = !("store_in_history" in a) || a.store_in_history, p = !("replicate" in a) || a.replicate, q = ya(), r = "push"; return a.prepend && (r = "unshift"), g ? U ? V ? (d.getPubnubMessage && (d = d.getPubnubMessage()), d = JSON.stringify(m(d, j)), f = [_, "publish", U, V, 0, l.encode(g), q, l.encode(d)], e = { uuid: Ba, auth: i }, h && "object" == typeof h && (e.meta = JSON.stringify(h)), o || (e.store = "0"), p || (e.norep = "true"), Ca && (e.instanceid = Fa), ca[r]({ callback: q, url: f, data: c(e), fail: function (a) { F(a, k), B(1) }, success: function (a) { E(a, b, k), B(1) }, mode: n ? "POST" : "GET" }), void B()) : wa("Missing Subscribe Key") : wa("Missing Publish Key") : wa("Missing Channel") }, fire: function (a, b) { a.store_in_history = !1, a.replicate = !1, Ka.publish(a, b) }, unsubscribe: function (a, b) { var c = a.channel, d = a.channel_group, e = a.auth_key || W, b = b || a.callback || function () { }, f = a.error || function () { }; if (!c && !d) return wa("Missing Channel or Channel Group"); if (!V) return wa("Missing Subscribe Key"); if (c) { var g = l.isArray(c) ? c : ("" + c).split(","), h = [], i = []; if (l.each(g, function (a) { la[a] && h.push(a) }), 0 == h.length) return void b({ action: "leave" }); l.each(h, function (a) { i.push(a + p) }), l.each(h.concat(i), function (a) { a in la && delete la[a], a in na && delete na[a] }), 0 === la.length && 0 === ma.length && (ja = 0); var j = !0; n && (j = Ka.LEAVE(h.join(","), 0, e, b, f)), j || b({ action: "leave" }) } if (d) { var k = l.isArray(d) ? d : ("" + d).split(","), m = [], o = []; if (l.each(k, function (a) { ma[a] && m.push(a) }), 0 == m.length) return void b({ action: "leave" }); l.each(m, function (a) { o.push(a + p) }), l.each(m.concat(o), function (a) { a in ma && delete ma[a], a in na && delete na[a] }), 0 === la.length && 0 === ma.length && (ja = 0); var j = !0; n && (j = Ka.LEAVE_GROUP(m.join(","), 0, e, b, f)), j || b({ action: "leave" }) } ba() }, subscribe: function (a, b) { function d(a) { a ? l.timeout(ba, B) : (_ = y($), aa = y($), l.timeout(function () { Ka.time(d) }, u)), D(function (b) { return a && b.disconnected ? (b.disconnected = 0, b.reconnect(b.name)) : void (a || b.disconnected || (b.disconnected = 1, b.disconnect(b.name))) }), C(function (b) { return a && b.disconnected ? (b.disconnected = 0, b.reconnect(b.name)) : void (a || b.disconnected || (b.disconnected = 1, b.disconnect(b.name))) }) } function g() { var a = ya(), b = e(la).join(","), h = f(ma).join(","); if (b || h) { b || (b = ","), K(); var i = c({ uuid: Ba, auth: W }); h && (i["channel-group"] = h); var j = JSON.stringify(na); j.length > 2 && (i.state = JSON.stringify(na)), pa && (i.heartbeat = pa), Ca && (i.instanceid = Fa), A(), ha = G({ timeout: z, callback: a, fail: function (a) { a && a.error && a.service ? (F(a, q), d(!1)) : Ka.time(function (b) { !b && F(a, q), d(b) }) }, data: c(i), url: [aa, "subscribe", V, l.encode(b), a, ja], success: function (a) { if (!a || "object" == typeof a && "error" in a && a.error) return q(a), l.timeout(ba, u); if (s(a[1]), ja = !ja && ia && za.get(V) || a[1], D(function (a) { a.connected || (a.connected = 1, a.connect(a.name)) }), C(function (a) { a.connected || (a.connected = 1, a.connect(a.name)) }), ka && !ia) return ja = 0, ka = !1, za.set(V, 0), void l.timeout(g, B); w && (ja = 1e4, w = 0), za.set(V, a[1]); var b = function () { var b = "", c = ""; a.length > 3 ? (b = a[3], c = a[2]) : b = a.length > 2 ? a[2] : l.map(e(la), function (b) { return l.map(Array(a[0].length).join(",").split(","), function () { return b }) }).join(","); var d = b.split(","), f = c ? c.split(",") : []; return function () { var a = d.shift() || ga, b = f.shift(), c = {}, e = { callback: function () { } }; b ? (a && a.indexOf("-pnpres") >= 0 && b.indexOf("-pnpres") < 0 && (b += "-pnpres"), c = ma[b] || la[b] || e) : c = la[a] || e; var g = [c.callback || fa, a.split(p)[0]]; return b && g.push(b.split(p)[0]), g } } (), c = L(+a[1]); l.each(a[0], function (d) { var e = b(), f = r(d, la[e[1]] ? la[e[1]].cipher_key : null); e[0] && e[0](f, a, e[2] || e[1], c, e[1]) }), l.timeout(g, B) } }) } } var h = a.channel, i = a.channel_group, b = b || a.callback, b = b || a.message, j = a.connect || function () { }, k = a.reconnect || function () { }, m = a.disconnect || function () { }, q = a.error || q || function () { }, s = a.idle || function () { }, t = a.presence || 0, v = a.noheresync || 0, w = a.backfill || 0, x = a.timetoken || 0, z = a.timeout || Q, B = a.windowing || P, E = a.state, H = a.heartbeat || a.pnexpires, I = a.heartbeat_interval, J = a.restore || ia; return W = a.auth_key || W, ia = J, ja = x, h || i ? b ? V ? ((H || 0 === H || I || 0 === I) && Ka.set_heartbeat(H, I), h && l.each((h.join ? h.join(",") : "" + h).split(","), function (d) { var e = la[d] || {}; la[ga = d] = { name: d, connected: e.connected, disconnected: e.disconnected, subscribed: 1, callback: fa = b, cipher_key: a.cipher_key, connect: j, disconnect: m, reconnect: k }, E && (d in E ? na[d] = E[d] : na[d] = E), t && (Ka.subscribe({ channel: d + p, callback: t, restore: J }), e.subscribed || v || Ka.here_now({ channel: d, data: c({ uuid: Ba, auth: W }), callback: function (a) { l.each("uuids" in a ? a.uuids : [], function (b) { t({ action: "join", uuid: b, timestamp: Math.floor(l.rnow() / 1e3), occupancy: a.occupancy || 1 }, a, d) }) } })) }), i && l.each((i.join ? i.join(",") : "" + i).split(","), function (d) { var e = ma[d] || {}; ma[d] = { name: d, connected: e.connected, disconnected: e.disconnected, subscribed: 1, callback: fa = b, cipher_key: a.cipher_key, connect: j, disconnect: m, reconnect: k }, t && (Ka.subscribe({ channel_group: d + p, callback: t, restore: J, auth_key: W }), e.subscribed || v || Ka.here_now({ channel_group: d, data: c({ uuid: Ba, auth: W }), callback: function (a) { l.each("uuids" in a ? a.uuids : [], function (b) { t({ action: "join", uuid: b, timestamp: Math.floor(l.rnow() / 1e3), occupancy: a.occupancy || 1 }, a, d) }) } })) }), ba = function () { K(), l.timeout(g, B) }, n ? void ba() : o.push(ba)) : wa("Missing Subscribe Key") : wa("Missing Callback") : wa("Missing Channel") }, here_now: function (a, b) { var b = a.callback || b, d = a.debug, e = a.error || function () { }, f = a.auth_key || W, g = a.channel, h = a.channel_group, i = ya(), j = !("uuids" in a) || a.uuids, k = a.state, m = { uuid: Ba, auth: f }; if (j || (m.disable_uuids = 1), k && (m.state = 1), !b) return wa("Missing Callback"); if (!V) return wa("Missing Subscribe Key"); var n = [_, "v2", "presence", "sub_key", V]; g && n.push("channel") && n.push(l.encode(g)), "0" != i && (m.callback = i), h && (m["channel-group"] = h, !g && n.push("channel") && n.push(",")), Ca && (m.instanceid = Fa), G({ callback: i, data: c(m), success: function (a) { E(a, b, e) }, fail: function (a) { F(a, e) }, debug: d, url: n }) }, where_now: function (a, b) { var b = a.callback || b, d = a.error || function () { }, e = a.auth_key || W, f = ya(), g = a.uuid || Ba, h = { auth: e }; return b ? V ? ("0" != f && (h.callback = f), Ca && (h.instanceid = Fa), void G({ callback: f, data: c(h), success: function (a) { E(a, b, d) }, fail: function (a) { F(a, d) }, url: [_, "v2", "presence", "sub_key", V, "uuid", l.encode(g)] })) : wa("Missing Subscribe Key") : wa("Missing Callback") }, state: function (a, b) { var d, b = a.callback || b || function (a) { }, e = a.error || function () { }, f = a.auth_key || W, g = ya(), h = a.state, i = a.uuid || Ba, j = a.channel, k = a.channel_group, m = c({ auth: f }); return V ? i ? j || k ? ("0" != g && (m.callback = g), "undefined" != typeof j && la[j] && la[j].subscribed && h && (na[j] = h), "undefined" != typeof k && ma[k] && ma[k].subscribed && (h && (na[k] = h), m["channel-group"] = k, j || (j = ",")), m.state = JSON.stringify(h), Ca && (m.instanceid = Fa), d = h ? [_, "v2", "presence", "sub-key", V, "channel", j, "uuid", i, "data"] : [_, "v2", "presence", "sub-key", V, "channel", j, "uuid", l.encode(i)], void G({ callback: g, data: c(m), success: function (a) { E(a, b, e) }, fail: function (a) { F(a, e) }, url: d })) : wa("Missing Channel") : wa("Missing UUID") : wa("Missing Subscribe Key") }, grant: function (a, b) { var b = a.callback || b, d = a.error || function () { }, e = a.channel || a.channels, f = a.channel_group, g = ya(), h = a.ttl, i = a.read ? "1" : "0", j = a.write ? "1" : "0", k = a.manage ? "1" : "0", m = a.auth_key || a.auth_keys; if (!b) return wa("Missing Callback"); if (!V) return wa("Missing Subscribe Key"); if (!U) return wa("Missing Publish Key"); if (!X) return wa("Missing Secret Key"); var n = { w: j, r: i }; a.manage && (n.m = k), l.isArray(e) && (e = e.join(",")), l.isArray(m) && (m = m.join(",")), "undefined" != typeof e && null != e && e.length > 0 && (n.channel = e), "undefined" != typeof f && null != f && f.length > 0 && (n["channel-group"] = f), "0" != g && (n.callback = g), (h || 0 === h) && (n.ttl = h), m && (n.auth = m), n = c(n), m || delete n.auth, G({ operation: "PNAccessManagerGrant", callback: g, data: n, success: function (a) { E(a, b, d) }, fail: function (a) { F(a, d) }, url: [_, "v1", "auth", "grant", "sub-key", V] }) }, mobile_gw_provision: function (a) { var b, c, d = a.callback || function () { }, e = a.auth_key || W, f = a.error || function () { }, g = ya(), h = a.channel, i = a.op, j = a.gw_type, k = a.device_id; return k ? j ? i ? h ? V ? (c = [_, "v1/push/sub-key", V, "devices", k], b = { uuid: Ba, auth: e, type: j }, "add" == i ? b.add = h : "remove" == i && (b.remove = h), Ca && (b.instanceid = Fa), void G({ callback: g, data: b, success: function (a) { E(a, d, f) }, fail: function (a) { F(a, f) }, url: c })) : wa("Missing Subscribe Key") : wa("Missing gw destination Channel (channel)") : wa("Missing GW Operation (op: add or remove)") : wa("Missing GW Type (gw_type: gcm or apns)") : wa("Missing Device ID (device_id)") }, audit: function (a, b) { var b = a.callback || b, d = a.error || function () { }, e = a.channel, f = a.channel_group, g = a.auth_key, h = ya(); if (!b) return wa("Missing Callback"); if (!V) return wa("Missing Subscribe Key"); if (!U) return wa("Missing Publish Key"); if (!X) return wa("Missing Secret Key"); var i = {}; "0" != h && (i.callback = h), "undefined" != typeof e && null != e && e.length > 0 && (i.channel = e), "undefined" != typeof f && null != f && f.length > 0 && (i["channel-group"] = f), g && (i.auth = g), i = c(i), g || delete i.auth, G({ operation: "PNAccessManagerAudit", callback: h, data: i, success: function (a) { E(a, b, d) }, fail: function (a) { F(a, d) }, url: [_, "v1", "auth", "audit", "sub-key", V] }) }, revoke: function (a, b) { a.read = !1, a.write = !1, Ka.grant(a, b) }, set_uuid: function (a) { Ba = a, ba() }, get_uuid: function () { return Ba }, isArray: function (a) { return l.isArray(a) }, get_subscribed_channels: function () { return e(la, !0) }, presence_heartbeat: function (a) { var b = a.callback || function () { }, d = a.error || function () { }, g = ya(), h = { uuid: Ba, auth: W }, i = JSON.stringify(na); i.length > 2 && (h.state = JSON.stringify(na)), pa > 0 && pa < 320 && (h.heartbeat = pa), "0" != g && (h.callback = g); var j = l.encode(e(la, !0).join(",")), k = f(ma, !0).join(","); j || (j = ","), k && (h["channel-group"] = k), Ca && (h.instanceid = Fa), G({ callback: g, data: c(h), url: [_, "v2", "presence", "sub-key", V, "channel", j, "heartbeat"], success: function (a) { E(a, b, d) }, fail: function (a) { F(a, d) } }) }, stop_timers: function () { clearTimeout(N), clearTimeout(O), clearTimeout(oa) }, shutdown: function () { Ka.stop_timers(), Ga && Ga() }, xdr: ua, ready: g, db: za, uuid: l.generateUUID, map: l.map, each: l.each, "each-channel": D, grep: l.grep, offline: function () { K(1, { message: "Offline. Please check your network settings." }) }, supplant: l.supplant, now: l.rnow, unique: d, updater: l.updater
            }; return Ba || (Ba = Ka.uuid()), Fa || (Fa = Ka.uuid()), za.set(V + "uuid", Ba), N = l.timeout(I, u), O = l.timeout(J, R), oa = l.timeout(A, (qa - 3) * u), M(), Ka
        } var j = c(5), k = c(6), l = c(7), m = 1, n = !1, o = [], p = "-pnpres", q = 10, r = 15e3, s = 310, t = 60, u = 1e3, v = 5, w = 30, x = j.version, y = function () { var a = 20, b = Math.floor(Math.random() * a); return function (c) { var d = c.split("://")[0], e = c.split("://")[1]; return e.match("^ps") ? d + "://" + e.replace("ps", "ps" + (++b < a ? b : b = 1)) : e.match("^pubsub") ? d + "://" + e.replace("pubsub", "ps" + (++b < a ? b : b = 1)) : c } } (); a.exports = { PN_API: i, unique: d, PNmessage: h, DEF_TIMEOUT: r, timeout: l.timeout, build_url: l.buildURL, each: l.each, uuid: l.generateUUID, URLBIT: k.URLBIT, grep: l.grep, supplant: l.supplant, now: l.rnow, updater: l.updater, map: l.map }
    }, function (a, b) { a.exports = { name: "pubnub", preferGlobal: !1, version: "3.16.5", author: "PubNub <support@pubnub.com>", description: "Publish & Subscribe Real-time Messaging with PubNub", contributors: [{ name: "Stephen Blum", email: "stephen@pubnub.com" }], bin: {}, scripts: { test: "grunt test --force" }, main: "./node.js/pubnub.js", browser: "./modern/dist/pubnub.js", repository: { type: "git", url: "git://github.com/pubnub/javascript.git" }, keywords: ["cloud", "publish", "subscribe", "websockets", "comet", "bosh", "xmpp", "real-time", "messaging"], dependencies: { agentkeepalive: "~0.2", lodash: "^4.1.0" }, noAnalyze: !1, devDependencies: { chai: "^3.5.0", eslint: "2.4.0", "eslint-config-airbnb": "^6.0.2", "eslint-plugin-flowtype": "^2.1.0", "eslint-plugin-mocha": "^2.0.0", "eslint-plugin-react": "^4.1.0", "flow-bin": "^0.22.0", grunt: "^0.4.5", "grunt-contrib-clean": "^1.0.0", "grunt-contrib-copy": "^0.8.2", "grunt-contrib-uglify": "^0.11.1", "grunt-env": "^0.4.4", "grunt-eslint": "^18.0.0", "grunt-flow": "^1.0.3", "grunt-karma": "^0.12.1", "grunt-mocha-istanbul": "^3.0.1", "grunt-text-replace": "^0.4.0", "grunt-webpack": "^1.0.11", "imports-loader": "^0.6.5", isparta: "^4.0.0", "json-loader": "^0.5.4", karma: "^0.13.21", "karma-chai": "^0.1.0", "karma-mocha": "^0.2.1", "karma-phantomjs-launcher": "^1.0.0", "karma-spec-reporter": "0.0.24", "load-grunt-tasks": "^3.4.0", mocha: "^2.4.5", nock: "^1.1.0", "node-uuid": "^1.4.7", nodeunit: "^0.9.0", "phantomjs-prebuilt": "^2.1.4", proxyquire: "^1.7.4", sinon: "^1.17.2", "uglify-js": "^2.6.1", underscore: "^1.7.0", webpack: "^1.12.13", "webpack-dev-server": "^1.14.1" }, bundleDependencies: [], license: "MIT", engine: { node: ">=0.8" }, files: ["core", "node.js", "modern", "CHANGELOG", "FUTURE.md", "LICENSE", "README.md"] } }, function (a, b) { a.exports = { PARAMSBIT: "&", URLBIT: "/" } }, function (a, b, c) { function d() { return +new Date } function e(a) { return !!a && "string" != typeof a && (Array.isArray && Array.isArray(a) || "number" == typeof a.length) } function f(a, b) { if (a && b) if (e(a)) for (var c = 0, d = a.length; c < d;)b.call(a[c], a[c], c++); else for (var c in a) a.hasOwnProperty && a.hasOwnProperty(c) && b.call(a[c], c, a[c]) } function g(a) { return encodeURIComponent(a) } function h(a, b) { var c = a.join(p.URLBIT), d = []; return b ? (f(b, function (a, b) { var c = "object" == typeof b ? JSON.stringify(b) : b; "undefined" != typeof b && null !== b && g(c).length > 0 && d.push(a + "=" + g(c)) }), c += "?" + d.join(p.PARAMSBIT)) : c } function i(a, b) { var c, e = 0, f = function () { e + b > d() ? (clearTimeout(c), c = setTimeout(f, b)) : (e = d(), a()) }; return f } function j(a, b) { var c = []; return f(a || [], function (a) { b(a) && c.push(a) }), c } function k(a, b) { return a.replace(q, function (a, c) { return b[c] || a }) } function l(a, b) { if ("undefined" != typeof setTimeout) return setTimeout(a, b) } function m(a) { var b = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (a) { var b = 16 * Math.random() | 0, c = "x" === a ? b : 3 & b | 8; return c.toString(16) }); return a && a(b), b } function n(a, b) { var c = []; return f(a || [], function (a, d) { c.push(b(a, d)) }), c } function o(a) { return encodeURIComponent(a).replace(/[!'()*~]/g, function (a) { return "%" + a.charCodeAt(0).toString(16).toUpperCase() }) } var p = c(6), q = /{([\w\-]+)}/g; a.exports = { buildURL: h, encode: g, each: f, updater: i, rnow: d, isArray: e, map: n, pamEncode: o, generateUUID: m, timeout: l, supplant: k, grep: j } }, function (a, b) { var c = function (a, b) { if (!(this instanceof c)) return new c(a, b); var d = this, a = d.url = a || "", e = (d.protocol = b || "Sec-WebSocket-Protocol", a.split("/")), f = { ssl: "wss:" === e[0], origin: e[2], publish_key: e[3], subscribe_key: e[4], channel: e[5] }; return d.CONNECTING = 0, d.OPEN = 1, d.CLOSING = 2, d.CLOSED = 3, d.CLOSE_NORMAL = 1e3, d.CLOSE_GOING_AWAY = 1001, d.CLOSE_PROTOCOL_ERROR = 1002, d.CLOSE_UNSUPPORTED = 1003, d.CLOSE_TOO_LARGE = 1004, d.CLOSE_NO_STATUS = 1005, d.CLOSE_ABNORMAL = 1006, d.onclose = d.onerror = d.onmessage = d.onopen = d.onsend = function () { }, d.binaryType = "", d.extensions = "", d.bufferedAmount = 0, d.trasnmitting = !1, d.buffer = [], d.readyState = d.CONNECTING, a ? (d.pubnub = PUBNUB.init(f), d.pubnub.setup = f, d.setup = f, void d.pubnub.subscribe({ restore: !1, channel: f.channel, disconnect: d.onerror, reconnect: d.onopen, error: function () { d.onclose({ code: d.CLOSE_ABNORMAL, reason: "Missing URL", wasClean: !1 }) }, callback: function (a) { d.onmessage({ data: a }) }, connect: function () { d.readyState = d.OPEN, d.onopen() } })) : (d.readyState = d.CLOSED, d.onclose({ code: d.CLOSE_ABNORMAL, reason: "Missing URL", wasClean: !0 }), d) }; c.prototype.send = function (a) { var b = this; b.pubnub.publish({ channel: b.pubnub.setup.channel, message: a, callback: function (a) { b.onsend({ data: a }) } }) }, c.prototype.close = function () { var a = this; a.pubnub.unsubscribe({ channel: a.pubnub.setup.channel }), a.readyState = a.CLOSED, a.onclose({}) }, a.exports = c }])
});
(function ($) {
    'use strict';

    $(window).load(function () {

        /* Image cache */
        $('.gallery-item').each(function() {
            var src = $(this).attr('href');
            var img = document.createElement('img');

            img.src = src;
            $('#image-cache').append(img);
        });

    });

    $(document).ready(function () {

        /* Sticky Header */ 
        $(".sticky-header").sticky({topSpacing: 0});

        /* Slider Revolution */


        // Slider0 for John

        //$("#slider0").revolution({
        //    sliderType: "standard",
        //    sliderLayout: "fullscreen",
        //    autoHeight: "on",
        //    delay: 9000,
        //    navigation: {
        //        keyboardNavigation: "on",
        //        keyboard_direction: "horizontal",
        //        mouseScrollNavigation: "off",
        //        onHoverStop: "on",
        //        touch: {
        //            touchenabled: "on",
        //            swipe_treshold: 75,
        //            swipe_min_touches: 1,
        //            drag_block_vertical: false,
        //            swipe_direction: "horizontal"
        //        },
        //        arrows: {
        //            style: "hades",
        //            enable: true,
        //            hide_onmobile: true,
        //            hide_onleave: true,
        //            tmp: '',
        //            left: {
        //                h_align: "left",
        //                v_align: "center",
        //                h_offset: 10,
        //                v_offset: 0
        //            },
        //            right: {
        //                h_align: "right",
        //                v_align: "center",
        //                h_offset: 10,
        //                v_offset: 0
        //            }
        //        },
        //        bullets: {
        //            style: "",
        //            enable: true,
        //            hide_onmobile: false,
        //            hide_onleave: true,
        //            hide_delay: 200,
        //            hide_delay_mobile: 1200,
        //            hide_under: 0,
        //            hide_over: 9999,
        //            direction: "horizontal",
        //            h_align: "center",
        //            v_align: "bottom",
        //            space: 7,
        //            h_offset: 0,
        //            v_offset: 40,
        //            tmp: '<span class="tp-bullet-image"></span><span class="tp-bullet-title"></span>'
        //        }
        //    },

        //    lazyType: "smart",
        //    disableProgressBar: "off",
        //    responsiveLevels: [4000, 1200, 992, 768, 320],
        //    gridwidth: [1130, 910, 580, 300],
        //    gridheight: [600, 800, 1024, 568]
        //});


        //// Slider1 for Jessica and Samantha

        //$("#slider1").revolution({
        //    sliderType: "standard",
        //    sliderLayout: "auto",
        //    autoHeight: "on",
        //    delay: 9000,
        //    navigation: {
        //        keyboardNavigation: "on",
        //        keyboard_direction: "horizontal",
        //        mouseScrollNavigation: "off",
        //        onHoverStop: "on",
        //        touch: {
        //            touchenabled: "on",
        //            swipe_treshold: 75,
        //            swipe_min_touches: 1,
        //            drag_block_vertical: false,
        //            swipe_direction: "horizontal"
        //        },
        //        arrows: {
        //            style: "hades",
        //            enable: true,
        //            hide_onmobile: true,
        //            hide_onleave: true,
        //            tmp: '',
        //            left: {
        //                h_align: "left",
        //                v_align: "center",
        //                h_offset: 10,
        //                v_offset: 0
        //            },
        //            right: {
        //                h_align: "right",
        //                v_align: "center",
        //                h_offset: 10,
        //                v_offset: 0
        //            }
        //        },
        //        bullets: {
        //            style: "",
        //            enable: true,
        //            hide_onmobile: false,
        //            hide_onleave: true,
        //            hide_delay: 200,
        //            hide_delay_mobile: 1200,
        //            hide_under: 0,
        //            hide_over: 9999,
        //            direction: "horizontal",
        //            h_align: "center",
        //            v_align: "bottom",
        //            space: 7,
        //            h_offset: 0,
        //            v_offset: 40,
        //            tmp: '<span class="tp-bullet-image"></span><span class="tp-bullet-title"></span>'
        //        }
        //    },

        //    lazyType: "smart",
        //    disableProgressBar: "off",
        //    responsiveLevels: [4000, 1200, 992, 768, 320],
        //    gridwidth: [1130, 910, 580, 300],
        //    gridheight: [600, 800, 1024, 568]
        //});

        /* Preloader */
        $('#preloader').fadeOut('slow', function () {
            $(this).remove();
        });

        /* Jarallax */
        //jarallax(document.querySelectorAll('.jarallax'), {
        //    speed: 0.7
        //});

        /* Animated Counter */
        //$('.count-container span').counterUp({
        //    delay: 10, // the delay time in ms
        //    time: 1000 // the speed time in ms
        //});

        /* Magnific Popup */
        //$('.gallery-item').magnificPopup({
        //    type: 'image',
        //    gallery: {
        //        enabled: true
        //    }
        //});

        /* Progress Tracker */
        (function () {
            $('body').progressTracker({

                // Allows for navigating between content sections
                linking: true,

                // "constant" = always visiable
                // "hover" = shows on mouse hover
                tooltip: "hover",

                // The number specified is added to the default value at which the tracker changes to the next section.
                positiveTolerance: 0,

                // The number specified is subtracted from the default value at which the tracker changes to the next section.
                negativeTolerance: 60,

                // Only displays the progress tracker when the user is between the top of the first section and the bottom of the last;
                // It is only shown when the tracker sections are in view.
                // Specify false if you want the tracker to always show.
                displayWhenActive: false,

                // Specify the value (in pixels) that you wish the progress tracker to be hidden when it is below that.
                disableBelow: 0,

                // Specifies what the plugin takes into account when deciding when to switch to the next section.
                // "tracker" or "viewport"
                tracking: "viewport"

            });

            // Register custom scrollTop
            $('.progress-tracker ul li a.pt-circle').off('click').on('click', function(e) {
                softScroll(this, e);
            });

        })();

        /* Soft Scroll */
        (function () {
            $('.nav a, .menu-item a').click(function (e) {
                softScroll(this, e);

                window.setTimeout(function() {
                    classie.remove(document.body, 'show-menu');
                }, 500);
                return false;
            });
            $('.scrollTop a').scrollTop();
        })();

        /* Off-Canvas Menu */
        //(function () {

        //    var bodyEl = document.body,
        //        content = document.querySelector('.content-wrap'),
        //        openbtn = document.getElementById('open-button'),
        //        closebtn = document.getElementById('close-button');

        //    function init() {
        //        initEvents();
        //    }

        //    function initEvents() {
        //        openbtn.addEventListener('click', toggleMenu);
        //        if (closebtn) {
        //            closebtn.addEventListener('click', toggleMenu);
        //        }

        //        // close the menu element if the target it´s not the menu element or one of its descendants..
        //        content.addEventListener('click', function (ev) {
        //            var target = ev.target;
        //            if (classie.hasClass(bodyEl, 'show-menu') && target !== openbtn) {
        //                toggleMenu();
        //            }
        //        });
        //    }

        //    function toggleMenu() {
        //        $( bodyEl ).toggleClass( 'show-menu' );
        //    }

        //    init();

        //})();

        /* Isotope Portfolio */
        //(function () {
        //    var grid = $('.grid').isotope({
        //        itemSelector: '.grid-item',
        //        percentPosition: true,
        //        masonry: {
        //            // use outer width of grid-sizer for columnWidth
        //            columnWidth: '.grid-sizer'
        //        }
        //    });

        //    grid.imagesLoaded(function () {
        //        grid.isotope();
        //    });

        //    grid.isotope({filter: '*'});

        //    // filter items on button click
        //    $('#isotope-filters').on('click', 'a', function () {
        //        var filterValue = $(this).attr('data-filter');
        //        grid.isotope({filter: filterValue});
        //    });

        //})();

        /* Back to top */
        (function () {
            $("#back-top").hide();

            $(window).scroll(function () {
                if ($(this).scrollTop() > 100) {
                    $('#back-top').fadeIn();
                } else {
                    $('#back-top').fadeOut();
                }
            });

            $('#back-top a').click(function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 600);
                return false;
            });
        })();

        /* Circle Progress */
        (function () {
            function animateElements() {
                $('.progressbar').each(function () {
                    var elementPos = $(this).offset().top;
                    var topOfWindow = $(window).scrollTop();
                    var percent = $(this).find('.circle').attr('data-percent');
                    var percentage = parseInt(percent, 10) / parseInt(100, 10);
                    var animate = $(this).data('animate');
                    var preAnimate = $(this).data('pre-animate');
                    if (elementPos < topOfWindow + $(window).height() - 30 && !animate) {
                        $(this).data('animate', true);
                        $(this).find('.circle').circleProgress({
                            startAngle: -Math.PI / 2,
                            value: percent / 100,
                            thickness: 3,
                            fill: {
                                color: '#E84855'
                            }
                        }).on('circle-animation-progress', function (event, progress, stepValue) {
                            $(this).find('div').text((stepValue * 100).toFixed(1) + "%");
                        }).stop();
                    } else if (!preAnimate && !animate) {
                        $(this).data('pre-animate', true);
                        $(this).find('.circle').circleProgress({
                            startAngle: -Math.PI / 2,
                            value: 0,
                            thickness: 3,
                            fill: {
                                color: '#E84855'
                            }
                        });
                    }
                });
            }

            // Show animated elements
            animateElements();
            $(window).scroll(animateElements);
        })();

        /* Contact Form */
        (function () {
            // Get the form.
            var form = $('#ajax-contact');

            // Get the messages div.
            var formMessages = $('#form-messages');

            // Set up an event listener for the contact form.
            $(form).submit(function (e) {
                // Stop the browser from submitting the form.
                e.preventDefault();

                // Serialize the form data.
                var formData = $(form).serialize();

                // Submit the form using AJAX.
                $.ajax({
                        type: 'POST',
                        url: $(form).attr('action'),
                        data: formData
                    })
                    .done(function (response) {
                        // Make sure that the formMessages div has the 'success' class.
                        $(formMessages).removeClass('alert alert-danger');
                        $(formMessages).addClass('alert alert-success');

                        // Set the message text.
                        $(formMessages).text(response);

                        // Clear the form.
                        $('#name').val('');
                        $('#email').val('');
                        $('#message').val('');
                    })
                    .fail(function (data) {
                        // Make sure that the formMessages div has the 'error' class.
                        $(formMessages).removeClass('alert alert-success');
                        $(formMessages).addClass('alert alert-danger');

                        // Set the message text.
                        if (data.responseText !== '') {
                            $(formMessages).text(data.responseText);
                        } else {
                            $(formMessages).text('Oops! An error occured and your message could not be sent.');
                        }
                    });
            });

        })();

        /* Google map */
        (function () {
            var gmapIsReady = false;

            $('.gm-toggle-link').click(function () {
                if (!gmapIsReady) {
                    initGmap();
                }
                $('#gm-panel').slideToggle('slow');
            });


            function initGmap() {
                gmapIsReady = true;

                // Create an array of styles.
                var styles = [
                    {
                        stylers: [
                            {saturation: -100}
                        ]
                    }, {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [
                            {lightness: 100},
                            {visibility: "simplified"}
                        ]
                    }, {
                        featureType: "road",
                        elementType: "labels",
                        stylers: [
                            {visibility: "off"}
                        ]
                    }
                ];

                // Create a new StyledMapType object, passing it the array of styles,
                // as well as the name to be displayed on the map type control.
                var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});

                // Create a map object, and include the MapTypeId to add
                // to the map type control.
                var $latlng = new google.maps.LatLng(52.5075419, 13.4261419),
                    $mapOptions = {
                        zoom: 13,
                        center: $latlng,
                        panControl: false,
                        zoomControl: true,
                        scaleControl: false,
                        mapTypeControl: false,
                        scrollwheel: false,
                        mapTypeControlOptions: {
                            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                        }
                    };
                var map = new google.maps.Map(document.getElementById('google-map'), $mapOptions);

                google.maps.event.trigger(map, 'resize');

                //Associate the styled map with the MapTypeId and set it to display.
                map.mapTypes.set('map_style', styledMap);
                map.setMapTypeId('map_style');

                var marker = new google.maps.Marker({
                    position: $latlng,
                    map: map,
                    title: ""
                });
            }

        })();

        /* Flickr feed */
        //jQuery('#basicuse').jflickrfeed({
        //    limit: 4,
        //    qstrings: {
        //        id: '32532032@N06'
        //    },
        //    itemTemplate: '<li>' +
        //    '<a href="{{image_b}}"><img src="{{image_s}}" class="img-rounded" alt="{{title}}" /></a>' +
        //    '</li>'
        //});

    });

    // Soft scroll
    var softScroll = function(target, event) {
        event.preventDefault();
        var targetNavElem = $(target).attr('href');
        if (targetNavElem[0] != '#') {
            window.open(
                targetNavElem,
                $(target).attr('target') == '_blank' ? '_blank' : '_self');
            return false;
        }

        var targetScrollPos = $(targetNavElem).offset().top - $('header .mp-nav').height() + 40;

        if (window.pageYOffset > targetScrollPos) {
            $('html, body').animate({
                scrollTop: targetScrollPos - 60
            }, 1000);
        } else {
            $('html, body').animate({
                scrollTop: targetScrollPos + 60
            }, 1000);
        }

        $('html, body').animate({
            scrollTop: targetScrollPos
        }, 600);
    };

    /* Google Analytics */
    //(function (i, s, o, g, r, a, m) {
    //    i['GoogleAnalyticsObject'] = r;
    //    i[r] = i[r] || function () {(i[r].q = i[r].q || []).push(arguments)};
    //    i[r].l = 1 * new Date();
    //    a = s.createElement(o);
    //    m = s.getElementsByTagName(o)[0];
    //    a.async = 1;
    //    a.src = g;
    //    m.parentNode.insertBefore(a, m);
    //})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

    //ga('create', 'UA-40696437-12', 'auto');
    //ga('send', 'pageview');

})(jQuery);