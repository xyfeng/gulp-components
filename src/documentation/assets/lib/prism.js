/* http://prismjs.com/download.html?themes=prism-okaidia&languages=markup+clike+javascript */
self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {};
var Prism = function() {
    var e = /\blang(?:uage)?-(?!\*)(\w+)\b/i,
        t = self.Prism = {
            util: {
                encode: function(e) {
                    return e instanceof n ? new n(e.type, t.util.encode(e.content), e.alias) : "Array" === t.util.type(e) ? e.map(t.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
                },
                type: function(e) {
                    return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]
                },
                clone: function(e) {
                    var n = t.util.type(e);
                    switch (n) {
                        case "Object":
                            var a = {};
                            for (var r in e) e.hasOwnProperty(r) && (a[r] = t.util.clone(e[r]));
                            return a;
                        case "Array":
                            return e.map(function(e) {
                                return t.util.clone(e)
                            })
                    }
                    return e
                }
            },
            languages: {
                extend: function(e, n) {
                    var a = t.util.clone(t.languages[e]);
                    for (var r in n) a[r] = n[r];
                    return a
                },
                insertBefore: function(e, n, a, r) {
                    r = r || t.languages;
                    var i = r[e];
                    if (2 == arguments.length) {
                        a = arguments[1];
                        for (var l in a) a.hasOwnProperty(l) && (i[l] = a[l]);
                        return i
                    }
                    var s = {};
                    for (var o in i)
                        if (i.hasOwnProperty(o)) {
                            if (o == n)
                                for (var l in a) a.hasOwnProperty(l) && (s[l] = a[l]);
                            s[o] = i[o]
                        }
                    return t.languages.DFS(t.languages, function(t, n) {
                        n === r[e] && t != e && (this[t] = s)
                    }), r[e] = s
                },
                DFS: function(e, n, a) {
                    for (var r in e) e.hasOwnProperty(r) && (n.call(e, r, e[r], a || r), "Object" === t.util.type(e[r]) ? t.languages.DFS(e[r], n) : "Array" === t.util.type(e[r]) && t.languages.DFS(e[r], n, r))
                }
            },
            highlightAll: function(e, n) {
                for (var a, r = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'), i = 0; a = r[i++];) t.highlightElement(a, e === !0, n)
            },
            highlightElement: function(a, r, i) {
                for (var l, s, o = a; o && !e.test(o.className);) o = o.parentNode;
                if (o && (l = (o.className.match(e) || [, ""])[1], s = t.languages[l]), s) {
                    a.className = a.className.replace(e, "").replace(/\s+/g, " ") + " language-" + l, o = a.parentNode, /pre/i.test(o.nodeName) && (o.className = o.className.replace(e, "").replace(/\s+/g, " ") + " language-" + l);
                    var u = a.textContent;
                    if (u) {
                        u = u.replace(/^(?:\r?\n|\r)/, "");
                        var g = {
                            element: a,
                            language: l,
                            grammar: s,
                            code: u
                        };
                        if (t.hooks.run("before-highlight", g), r && self.Worker) {
                            var c = new Worker(t.filename);
                            c.onmessage = function(e) {
                                g.highlightedCode = n.stringify(JSON.parse(e.data), l), t.hooks.run("before-insert", g), g.element.innerHTML = g.highlightedCode, i && i.call(g.element), t.hooks.run("after-highlight", g)
                            }, c.postMessage(JSON.stringify({
                                language: g.language,
                                code: g.code
                            }))
                        } else g.highlightedCode = t.highlight(g.code, g.grammar, g.language), t.hooks.run("before-insert", g), g.element.innerHTML = g.highlightedCode, i && i.call(a), t.hooks.run("after-highlight", g)
                    }
                }
            },
            highlight: function(e, a, r) {
                var i = t.tokenize(e, a);
                return n.stringify(t.util.encode(i), r)
            },
            tokenize: function(e, n) {
                var a = t.Token,
                    r = [e],
                    i = n.rest;
                if (i) {
                    for (var l in i) n[l] = i[l];
                    delete n.rest
                }
                e: for (var l in n)
                    if (n.hasOwnProperty(l) && n[l]) {
                        var s = n[l];
                        s = "Array" === t.util.type(s) ? s : [s];
                        for (var o = 0; o < s.length; ++o) {
                            var u = s[o],
                                g = u.inside,
                                c = !!u.lookbehind,
                                f = 0,
                                h = u.alias;
                            u = u.pattern || u;
                            for (var p = 0; p < r.length; p++) {
                                var d = r[p];
                                if (r.length > e.length) break e;
                                if (!(d instanceof a)) {
                                    u.lastIndex = 0;
                                    var m = u.exec(d);
                                    if (m) {
                                        c && (f = m[1].length);
                                        var y = m.index - 1 + f,
                                            m = m[0].slice(f),
                                            v = m.length,
                                            k = y + v,
                                            b = d.slice(0, y + 1),
                                            w = d.slice(k + 1),
                                            N = [p, 1];
                                        b && N.push(b);
                                        var O = new a(l, g ? t.tokenize(m, g) : m, h);
                                        N.push(O), w && N.push(w), Array.prototype.splice.apply(r, N)
                                    }
                                }
                            }
                        }
                    }
                return r
            },
            hooks: {
                all: {},
                add: function(e, n) {
                    var a = t.hooks.all;
                    a[e] = a[e] || [], a[e].push(n)
                },
                run: function(e, n) {
                    var a = t.hooks.all[e];
                    if (a && a.length)
                        for (var r, i = 0; r = a[i++];) r(n)
                }
            }
        },
        n = t.Token = function(e, t, n) {
            this.type = e, this.content = t, this.alias = n
        };
    if (n.stringify = function(e, a, r) {
            if ("string" == typeof e) return e;
            if ("Array" === t.util.type(e)) return e.map(function(t) {
                return n.stringify(t, a, e)
            }).join("");
            var i = {
                type: e.type,
                content: n.stringify(e.content, a, r),
                tag: "span",
                classes: ["token", e.type],
                attributes: {},
                language: a,
                parent: r
            };
            if ("comment" == i.type && (i.attributes.spellcheck = "true"), e.alias) {
                var l = "Array" === t.util.type(e.alias) ? e.alias : [e.alias];
                Array.prototype.push.apply(i.classes, l)
            }
            t.hooks.run("wrap", i);
            var s = "";
            for (var o in i.attributes) s += o + '="' + (i.attributes[o] || "") + '"';
            return "<" + i.tag + ' class="' + i.classes.join(" ") + '" ' + s + ">" + i.content + "</" + i.tag + ">"
        }, !self.document) return self.addEventListener ? (self.addEventListener("message", function(e) {
        var n = JSON.parse(e.data),
            a = n.language,
            r = n.code;
        self.postMessage(JSON.stringify(t.util.encode(t.tokenize(r, t.languages[a])))), self.close()
    }, !1), self.Prism) : self.Prism;
    var a = document.getElementsByTagName("script");
    return a = a[a.length - 1], a && (t.filename = a.src, document.addEventListener && !a.hasAttribute("data-manual") && document.addEventListener("DOMContentLoaded", t.highlightAll)), self.Prism
}();
"undefined" != typeof module && module.exports && (module.exports = Prism);;
Prism.languages.markup = {
    comment: /<!--[\w\W]*?-->/,
    prolog: /<\?.+?\?>/,
    doctype: /<!DOCTYPE.+?>/,
    cdata: /<!\[CDATA\[[\w\W]*?]]>/i,
    tag: {
        pattern: /<\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
        inside: {
            tag: {
                pattern: /^<\/?[^\s>\/]+/i,
                inside: {
                    punctuation: /^<\/?/,
                    namespace: /^[^\s>\/:]+:/
                }
            },
            "attr-value": {
                pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
                inside: {
                    punctuation: /=|>|"/
                }
            },
            punctuation: /\/?>/,
            "attr-name": {
                pattern: /[^\s>\/]+/,
                inside: {
                    namespace: /^[^\s>\/:]+:/
                }
            }
        }
    },
    entity: /&#?[\da-z]{1,8};/i
}, Prism.hooks.add("wrap", function(t) {
    "entity" === t.type && (t.attributes.title = t.content.replace(/&amp;/, "&"))
});;
Prism.languages.clike = {
    comment: [{
        pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
        lookbehind: !0
    }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0
    }],
    string: /("|')(\\\n|\\?.)*?\1/,
    "class-name": {
        pattern: /((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
        lookbehind: !0,
        inside: {
            punctuation: /(\.|\\)/
        }
    },
    keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    "boolean": /\b(true|false)\b/,
    "function": {
        pattern: /[a-z0-9_]+\(/i,
        inside: {
            punctuation: /\(/
        }
    },
    number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/,
    operator: /[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|~|\^|%/,
    ignore: /&(lt|gt|amp);/i,
    punctuation: /[{}[\];(),.:]/
};;
Prism.languages.javascript = Prism.languages.extend("clike", {
    keyword: /\b(as|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/,
    number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
    "function": /(?!\d)[a-z0-9_$]+(?=\()/i
}), Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
        lookbehind: !0
    }
}), Prism.languages.insertBefore("javascript", "string", {
    "template-string": {
        pattern: /`(?:\\`|\\?[^`])*`/,
        inside: {
            interpolation: {
                pattern: /\$\{[^}]+\}/,
                inside: {
                    "interpolation-punctuation": {
                        pattern: /^\$\{|\}$/,
                        alias: "punctuation"
                    },
                    rest: Prism.languages.javascript
                }
            },
            string: /[\s\S]+/
        }
    }
}), Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {
    script: {
        pattern: /<script[\w\W]*?>[\w\W]*?<\/script>/i,
        inside: {
            tag: {
                pattern: /<script[\w\W]*?>|<\/script>/i,
                inside: Prism.languages.markup.tag.inside
            },
            rest: Prism.languages.javascript
        },
        alias: "language-javascript"
    }
});;