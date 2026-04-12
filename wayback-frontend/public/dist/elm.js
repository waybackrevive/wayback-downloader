(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEBUG mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});




// HELPERS


function _Debugger_unsafeCoerce(value)
{
	return value;
}



// PROGRAMS


var _Debugger_element = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		A3($elm$browser$Debugger$Main$wrapInit, _Json_wrap(debugMetadata), _Debugger_popout(), impl.init),
		$elm$browser$Debugger$Main$wrapUpdate(impl.update),
		$elm$browser$Debugger$Main$wrapSubs(impl.subscriptions),
		function(sendToApp, initialModel)
		{
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			var currNode = _VirtualDom_virtualize(domNode);
			var currBlocker = $elm$browser$Debugger$Main$toBlockerType(initialModel);
			var currPopout;

			var cornerNode = _VirtualDom_doc.createElement('div');
			domNode.parentNode.insertBefore(cornerNode, domNode.nextSibling);
			var cornerCurr = _VirtualDom_virtualize(cornerNode);

			initialModel.popout.a = sendToApp;

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = A2(_VirtualDom_map, $elm$browser$Debugger$Main$UserMsg, view($elm$browser$Debugger$Main$getUserModel(model)));
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;

				// update blocker

				var nextBlocker = $elm$browser$Debugger$Main$toBlockerType(model);
				_Debugger_updateBlocker(currBlocker, nextBlocker);
				currBlocker = nextBlocker;

				// view corner

				var cornerNext = $elm$browser$Debugger$Main$cornerView(model);
				var cornerPatches = _VirtualDom_diff(cornerCurr, cornerNext);
				cornerNode = _VirtualDom_applyPatches(cornerNode, cornerCurr, cornerPatches, sendToApp);
				cornerCurr = cornerNext;

				if (!model.popout.b)
				{
					currPopout = undefined;
					return;
				}

				// view popout

				_VirtualDom_doc = model.popout.b; // SWITCH TO POPOUT DOC
				currPopout || (currPopout = _VirtualDom_virtualize(model.popout.b));
				var nextPopout = $elm$browser$Debugger$Main$popoutView(model);
				var popoutPatches = _VirtualDom_diff(currPopout, nextPopout);
				_VirtualDom_applyPatches(model.popout.b.body, currPopout, popoutPatches, sendToApp);
				currPopout = nextPopout;
				_VirtualDom_doc = document; // SWITCH BACK TO NORMAL DOC
			});
		}
	);
});


var _Debugger_document = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		A3($elm$browser$Debugger$Main$wrapInit, _Json_wrap(debugMetadata), _Debugger_popout(), impl.init),
		$elm$browser$Debugger$Main$wrapUpdate(impl.update),
		$elm$browser$Debugger$Main$wrapSubs(impl.subscriptions),
		function(sendToApp, initialModel)
		{
			var divertHrefToApp = impl.setup && impl.setup(function(x) { return sendToApp($elm$browser$Debugger$Main$UserMsg(x)); });
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			var currBlocker = $elm$browser$Debugger$Main$toBlockerType(initialModel);
			var currPopout;

			initialModel.popout.a = sendToApp;

			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view($elm$browser$Debugger$Main$getUserModel(model));
				var nextNode = _VirtualDom_node('body')(_List_Nil)(
					_Utils_ap(
						A2($elm$core$List$map, _VirtualDom_map($elm$browser$Debugger$Main$UserMsg), doc.body),
						_List_Cons($elm$browser$Debugger$Main$cornerView(model), _List_Nil)
					)
				);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);

				// update blocker

				var nextBlocker = $elm$browser$Debugger$Main$toBlockerType(model);
				_Debugger_updateBlocker(currBlocker, nextBlocker);
				currBlocker = nextBlocker;

				// view popout

				if (!model.popout.b) { currPopout = undefined; return; }

				_VirtualDom_doc = model.popout.b; // SWITCH TO POPOUT DOC
				currPopout || (currPopout = _VirtualDom_virtualize(model.popout.b));
				var nextPopout = $elm$browser$Debugger$Main$popoutView(model);
				var popoutPatches = _VirtualDom_diff(currPopout, nextPopout);
				_VirtualDom_applyPatches(model.popout.b.body, currPopout, popoutPatches, sendToApp);
				currPopout = nextPopout;
				_VirtualDom_doc = document; // SWITCH BACK TO NORMAL DOC
			});
		}
	);
});


function _Debugger_popout()
{
	return {
		b: undefined,
		a: undefined
	};
}

function _Debugger_isOpen(popout)
{
	return !!popout.b;
}

function _Debugger_open(popout)
{
	return _Scheduler_binding(function(callback)
	{
		_Debugger_openWindow(popout);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}

function _Debugger_openWindow(popout)
{
	var w = $elm$browser$Debugger$Main$initialWindowWidth,
		h = $elm$browser$Debugger$Main$initialWindowHeight,
	 	x = screen.width - w,
		y = screen.height - h;

	var debuggerWindow = window.open('', '', 'width=' + w + ',height=' + h + ',left=' + x + ',top=' + y);
	var doc = debuggerWindow.document;
	doc.title = 'Elm Debugger';

	// handle arrow keys
	doc.addEventListener('keydown', function(event) {
		event.metaKey && event.which === 82 && window.location.reload();
		event.key === 'ArrowUp'   && (popout.a($elm$browser$Debugger$Main$Up  ), event.preventDefault());
		event.key === 'ArrowDown' && (popout.a($elm$browser$Debugger$Main$Down), event.preventDefault());
	});

	// handle window close
	window.addEventListener('unload', close);
	debuggerWindow.addEventListener('unload', function() {
		popout.b = undefined;
		popout.a($elm$browser$Debugger$Main$NoOp);
		window.removeEventListener('unload', close);
	});

	function close() {
		popout.b = undefined;
		popout.a($elm$browser$Debugger$Main$NoOp);
		debuggerWindow.close();
	}

	// register new window
	popout.b = doc;
}



// SCROLL


function _Debugger_scroll(popout)
{
	return _Scheduler_binding(function(callback)
	{
		if (popout.b)
		{
			var msgs = popout.b.getElementById('elm-debugger-sidebar');
			if (msgs && msgs.scrollTop !== 0)
			{
				msgs.scrollTop = 0;
			}
		}
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


var _Debugger_scrollTo = F2(function(id, popout)
{
	return _Scheduler_binding(function(callback)
	{
		if (popout.b)
		{
			var msg = popout.b.getElementById(id);
			if (msg)
			{
				msg.scrollIntoView(false);
			}
		}
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});



// UPLOAD


function _Debugger_upload(popout)
{
	return _Scheduler_binding(function(callback)
	{
		var doc = popout.b || document;
		var element = doc.createElement('input');
		element.setAttribute('type', 'file');
		element.setAttribute('accept', 'text/json');
		element.style.display = 'none';
		element.addEventListener('change', function(event)
		{
			var fileReader = new FileReader();
			fileReader.onload = function(e)
			{
				callback(_Scheduler_succeed(e.target.result));
			};
			fileReader.readAsText(event.target.files[0]);
			doc.body.removeChild(element);
		});
		doc.body.appendChild(element);
		element.click();
	});
}



// DOWNLOAD


var _Debugger_download = F2(function(historyLength, json)
{
	return _Scheduler_binding(function(callback)
	{
		var fileName = 'history-' + historyLength + '.txt';
		var jsonString = JSON.stringify(json);
		var mime = 'text/plain;charset=utf-8';
		var done = _Scheduler_succeed(_Utils_Tuple0);

		// for IE10+
		if (navigator.msSaveBlob)
		{
			navigator.msSaveBlob(new Blob([jsonString], {type: mime}), fileName);
			return callback(done);
		}

		// for HTML5
		var element = document.createElement('a');
		element.setAttribute('href', 'data:' + mime + ',' + encodeURIComponent(jsonString));
		element.setAttribute('download', fileName);
		element.style.display = 'none';
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
		callback(done);
	});
});



// POPOUT CONTENT


function _Debugger_messageToString(value)
{
	if (typeof value === 'boolean')
	{
		return value ? 'True' : 'False';
	}

	if (typeof value === 'number')
	{
		return value + '';
	}

	if (typeof value === 'string')
	{
		return '"' + _Debugger_addSlashes(value, false) + '"';
	}

	if (value instanceof String)
	{
		return "'" + _Debugger_addSlashes(value, true) + "'";
	}

	if (typeof value !== 'object' || value === null || !('$' in value))
	{
		return '…';
	}

	if (typeof value.$ === 'number')
	{
		return '…';
	}

	var code = value.$.charCodeAt(0);
	if (code === 0x23 /* # */ || /* a */ 0x61 <= code && code <= 0x7A /* z */)
	{
		return '…';
	}

	if (['Array_elm_builtin', 'Set_elm_builtin', 'RBNode_elm_builtin', 'RBEmpty_elm_builtin'].indexOf(value.$) >= 0)
	{
		return '…';
	}

	var keys = Object.keys(value);
	switch (keys.length)
	{
		case 1:
			return value.$;
		case 2:
			return value.$ + ' ' + _Debugger_messageToString(value.a);
		default:
			return value.$ + ' … ' + _Debugger_messageToString(value[keys[keys.length - 1]]);
	}
}


function _Debugger_init(value)
{
	if (typeof value === 'boolean')
	{
		return A3($elm$browser$Debugger$Expando$Constructor, $elm$core$Maybe$Just(value ? 'True' : 'False'), true, _List_Nil);
	}

	if (typeof value === 'number')
	{
		return $elm$browser$Debugger$Expando$Primitive(value + '');
	}

	if (typeof value === 'string')
	{
		return $elm$browser$Debugger$Expando$S('"' + _Debugger_addSlashes(value, false) + '"');
	}

	if (value instanceof String)
	{
		return $elm$browser$Debugger$Expando$S("'" + _Debugger_addSlashes(value, true) + "'");
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (tag === '::' || tag === '[]')
		{
			return A3($elm$browser$Debugger$Expando$Sequence, $elm$browser$Debugger$Expando$ListSeq, true,
				A2($elm$core$List$map, _Debugger_init, value)
			);
		}

		if (tag === 'Set_elm_builtin')
		{
			return A3($elm$browser$Debugger$Expando$Sequence, $elm$browser$Debugger$Expando$SetSeq, true,
				A3($elm$core$Set$foldr, _Debugger_initCons, _List_Nil, value)
			);
		}

		if (tag === 'RBNode_elm_builtin' || tag == 'RBEmpty_elm_builtin')
		{
			return A2($elm$browser$Debugger$Expando$Dictionary, true,
				A3($elm$core$Dict$foldr, _Debugger_initKeyValueCons, _List_Nil, value)
			);
		}

		if (tag === 'Array_elm_builtin')
		{
			return A3($elm$browser$Debugger$Expando$Sequence, $elm$browser$Debugger$Expando$ArraySeq, true,
				A3($elm$core$Array$foldr, _Debugger_initCons, _List_Nil, value)
			);
		}

		if (typeof tag === 'number')
		{
			return $elm$browser$Debugger$Expando$Primitive('<internals>');
		}

		var char = tag.charCodeAt(0);
		if (char === 35 || 65 <= char && char <= 90)
		{
			var list = _List_Nil;
			for (var i in value)
			{
				if (i === '$') continue;
				list = _List_Cons(_Debugger_init(value[i]), list);
			}
			return A3($elm$browser$Debugger$Expando$Constructor, char === 35 ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(tag), true, $elm$core$List$reverse(list));
		}

		return $elm$browser$Debugger$Expando$Primitive('<internals>');
	}

	if (typeof value === 'object')
	{
		var dict = $elm$core$Dict$empty;
		for (var i in value)
		{
			dict = A3($elm$core$Dict$insert, i, _Debugger_init(value[i]), dict);
		}
		return A2($elm$browser$Debugger$Expando$Record, true, dict);
	}

	return $elm$browser$Debugger$Expando$Primitive('<internals>');
}

var _Debugger_initCons = F2(function initConsHelp(value, list)
{
	return _List_Cons(_Debugger_init(value), list);
});

var _Debugger_initKeyValueCons = F3(function(key, value, list)
{
	return _List_Cons(
		_Utils_Tuple2(_Debugger_init(key), _Debugger_init(value)),
		list
	);
});

function _Debugger_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');
	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}



// BLOCK EVENTS


function _Debugger_updateBlocker(oldBlocker, newBlocker)
{
	if (oldBlocker === newBlocker) return;

	var oldEvents = _Debugger_blockerToEvents(oldBlocker);
	var newEvents = _Debugger_blockerToEvents(newBlocker);

	// remove old blockers
	for (var i = 0; i < oldEvents.length; i++)
	{
		document.removeEventListener(oldEvents[i], _Debugger_blocker, true);
	}

	// add new blockers
	for (var i = 0; i < newEvents.length; i++)
	{
		document.addEventListener(newEvents[i], _Debugger_blocker, true);
	}
}


function _Debugger_blocker(event)
{
	if (event.type === 'keydown' && event.metaKey && event.which === 82)
	{
		return;
	}

	var isScroll = event.type === 'scroll' || event.type === 'wheel';
	for (var node = event.target; node; node = node.parentNode)
	{
		if (isScroll ? node.id === 'elm-debugger-details' : node.id === 'elm-debugger-overlay')
		{
			return;
		}
	}

	event.stopPropagation();
	event.preventDefault();
}

function _Debugger_blockerToEvents(blocker)
{
	return blocker === $elm$browser$Debugger$Overlay$BlockNone
		? []
		: blocker === $elm$browser$Debugger$Overlay$BlockMost
			? _Debugger_mostEvents
			: _Debugger_allEvents;
}

var _Debugger_mostEvents = [
	'click', 'dblclick', 'mousemove',
	'mouseup', 'mousedown', 'mouseenter', 'mouseleave',
	'touchstart', 'touchend', 'touchcancel', 'touchmove',
	'pointerdown', 'pointerup', 'pointerover', 'pointerout',
	'pointerenter', 'pointerleave', 'pointermove', 'pointercancel',
	'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop',
	'keyup', 'keydown', 'keypress',
	'input', 'change',
	'focus', 'blur'
];

var _Debugger_allEvents = _Debugger_mostEvents.concat('wheel', 'scroll');




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}

// BYTES

function _Bytes_width(bytes)
{
	return bytes.byteLength;
}

var _Bytes_getHostEndianness = F2(function(le, be)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be));
	});
});


// ENCODERS

function _Bytes_encode(encoder)
{
	var mutableBytes = new DataView(new ArrayBuffer($elm$bytes$Bytes$Encode$getWidth(encoder)));
	$elm$bytes$Bytes$Encode$write(encoder)(mutableBytes)(0);
	return mutableBytes;
}


// SIGNED INTEGERS

var _Bytes_write_i8  = F3(function(mb, i, n) { mb.setInt8(i, n); return i + 1; });
var _Bytes_write_i16 = F4(function(mb, i, n, isLE) { mb.setInt16(i, n, isLE); return i + 2; });
var _Bytes_write_i32 = F4(function(mb, i, n, isLE) { mb.setInt32(i, n, isLE); return i + 4; });


// UNSIGNED INTEGERS

var _Bytes_write_u8  = F3(function(mb, i, n) { mb.setUint8(i, n); return i + 1 ;});
var _Bytes_write_u16 = F4(function(mb, i, n, isLE) { mb.setUint16(i, n, isLE); return i + 2; });
var _Bytes_write_u32 = F4(function(mb, i, n, isLE) { mb.setUint32(i, n, isLE); return i + 4; });


// FLOATS

var _Bytes_write_f32 = F4(function(mb, i, n, isLE) { mb.setFloat32(i, n, isLE); return i + 4; });
var _Bytes_write_f64 = F4(function(mb, i, n, isLE) { mb.setFloat64(i, n, isLE); return i + 8; });


// BYTES

var _Bytes_write_bytes = F3(function(mb, offset, bytes)
{
	for (var i = 0, len = bytes.byteLength, limit = len - 4; i <= limit; i += 4)
	{
		mb.setUint32(offset + i, bytes.getUint32(i));
	}
	for (; i < len; i++)
	{
		mb.setUint8(offset + i, bytes.getUint8(i));
	}
	return offset + len;
});


// STRINGS

function _Bytes_getStringWidth(string)
{
	for (var width = 0, i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		width +=
			(code < 0x80) ? 1 :
			(code < 0x800) ? 2 :
			(code < 0xD800 || 0xDBFF < code) ? 3 : (i++, 4);
	}
	return width;
}

var _Bytes_write_string = F3(function(mb, offset, string)
{
	for (var i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		offset +=
			(code < 0x80)
				? (mb.setUint8(offset, code)
				, 1
				)
				:
			(code < 0x800)
				? (mb.setUint16(offset, 0xC080 /* 0b1100000010000000 */
					| (code >>> 6 & 0x1F /* 0b00011111 */) << 8
					| code & 0x3F /* 0b00111111 */)
				, 2
				)
				:
			(code < 0xD800 || 0xDBFF < code)
				? (mb.setUint16(offset, 0xE080 /* 0b1110000010000000 */
					| (code >>> 12 & 0xF /* 0b00001111 */) << 8
					| code >>> 6 & 0x3F /* 0b00111111 */)
				, mb.setUint8(offset + 2, 0x80 /* 0b10000000 */
					| code & 0x3F /* 0b00111111 */)
				, 3
				)
				:
			(code = (code - 0xD800) * 0x400 + string.charCodeAt(++i) - 0xDC00 + 0x10000
			, mb.setUint32(offset, 0xF0808080 /* 0b11110000100000001000000010000000 */
				| (code >>> 18 & 0x7 /* 0b00000111 */) << 24
				| (code >>> 12 & 0x3F /* 0b00111111 */) << 16
				| (code >>> 6 & 0x3F /* 0b00111111 */) << 8
				| code & 0x3F /* 0b00111111 */)
			, 4
			);
	}
	return offset;
});


// DECODER

var _Bytes_decode = F2(function(decoder, bytes)
{
	try {
		return $elm$core$Maybe$Just(A2(decoder, bytes, 0).b);
	} catch(e) {
		return $elm$core$Maybe$Nothing;
	}
});

var _Bytes_read_i8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getInt8(offset)); });
var _Bytes_read_i16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getInt16(offset, isLE)); });
var _Bytes_read_i32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getInt32(offset, isLE)); });
var _Bytes_read_u8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getUint8(offset)); });
var _Bytes_read_u16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getUint16(offset, isLE)); });
var _Bytes_read_u32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getUint32(offset, isLE)); });
var _Bytes_read_f32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getFloat32(offset, isLE)); });
var _Bytes_read_f64 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 8, bytes.getFloat64(offset, isLE)); });

var _Bytes_read_bytes = F3(function(len, bytes, offset)
{
	return _Utils_Tuple2(offset + len, new DataView(bytes.buffer, bytes.byteOffset + offset, len));
});

var _Bytes_read_string = F3(function(len, bytes, offset)
{
	var string = '';
	var end = offset + len;
	for (; offset < end;)
	{
		var byte = bytes.getUint8(offset++);
		string +=
			(byte < 128)
				? String.fromCharCode(byte)
				:
			((byte & 0xE0 /* 0b11100000 */) === 0xC0 /* 0b11000000 */)
				? String.fromCharCode((byte & 0x1F /* 0b00011111 */) << 6 | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */)
				:
			((byte & 0xF0 /* 0b11110000 */) === 0xE0 /* 0b11100000 */)
				? String.fromCharCode(
					(byte & 0xF /* 0b00001111 */) << 12
					| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
					| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
				)
				:
				(byte =
					((byte & 0x7 /* 0b00000111 */) << 18
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 12
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
						| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
					) - 0x10000
				, String.fromCharCode(Math.floor(byte / 0x400) + 0xD800, byte % 0x400 + 0xDC00)
				);
	}
	return _Utils_Tuple2(offset, string);
});

var _Bytes_decodeFailure = F2(function() { throw 0; });



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.expect.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.expect.b, xhr)); });
		$elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);

		try {
			xhr.open(request.method, request.url, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.url));
		}

		_Http_configureRequest(xhr, request);

		request.body.a && xhr.setRequestHeader('Content-Type', request.body.a);
		xhr.send(request.body.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.headers; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.timeout.a || 0;
	xhr.responseType = request.expect.d;
	xhr.withCredentials = request.allowCookiesFromOtherDomains;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		url: xhr.responseURL,
		statusCode: xhr.status,
		statusText: xhr.statusText,
		headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			sent: event.loaded,
			size: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			received: event.loaded,
			size: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}

// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.multiline) { flags += 'm'; }
	if (options.caseInsensitive) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});
var $author$project$Main$ChangedUrl = function (a) {
	return {$: 'ChangedUrl', a: a};
};
var $author$project$Main$ClickedLink = function (a) {
	return {$: 'ClickedLink', a: a};
};
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Debugger$Expando$ArraySeq = {$: 'ArraySeq'};
var $elm$browser$Debugger$Overlay$BlockMost = {$: 'BlockMost'};
var $elm$browser$Debugger$Overlay$BlockNone = {$: 'BlockNone'};
var $elm$browser$Debugger$Expando$Constructor = F3(
	function (a, b, c) {
		return {$: 'Constructor', a: a, b: b, c: c};
	});
var $elm$browser$Debugger$Expando$Dictionary = F2(
	function (a, b) {
		return {$: 'Dictionary', a: a, b: b};
	});
var $elm$browser$Debugger$Main$Down = {$: 'Down'};
var $elm$browser$Debugger$Expando$ListSeq = {$: 'ListSeq'};
var $elm$browser$Debugger$Main$NoOp = {$: 'NoOp'};
var $elm$browser$Debugger$Expando$Primitive = function (a) {
	return {$: 'Primitive', a: a};
};
var $elm$browser$Debugger$Expando$Record = F2(
	function (a, b) {
		return {$: 'Record', a: a, b: b};
	});
var $elm$browser$Debugger$Expando$S = function (a) {
	return {$: 'S', a: a};
};
var $elm$browser$Debugger$Expando$Sequence = F3(
	function (a, b, c) {
		return {$: 'Sequence', a: a, b: b, c: c};
	});
var $elm$browser$Debugger$Expando$SetSeq = {$: 'SetSeq'};
var $elm$browser$Debugger$Main$Up = {$: 'Up'};
var $elm$browser$Debugger$Main$UserMsg = function (a) {
	return {$: 'UserMsg', a: a};
};
var $elm$browser$Debugger$Main$Export = {$: 'Export'};
var $elm$browser$Debugger$Main$Import = {$: 'Import'};
var $elm$browser$Debugger$Main$Open = {$: 'Open'};
var $elm$browser$Debugger$Main$OverlayMsg = function (a) {
	return {$: 'OverlayMsg', a: a};
};
var $elm$browser$Debugger$Main$Resume = {$: 'Resume'};
var $elm$browser$Debugger$Main$isPaused = function (state) {
	if (state.$ === 'Running') {
		return false;
	} else {
		return true;
	}
};
var $elm$browser$Debugger$History$size = function (history) {
	return history.numMessages;
};
var $elm$browser$Debugger$Overlay$Accept = function (a) {
	return {$: 'Accept', a: a};
};
var $elm$browser$Debugger$Overlay$Choose = F2(
	function (a, b) {
		return {$: 'Choose', a: a, b: b};
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$browser$Debugger$Overlay$goodNews1 = '\nThe good news is that having values like this in your message type is not\nso great in the long run. You are better off using simpler data, like\n';
var $elm$browser$Debugger$Overlay$goodNews2 = '\nfunction can pattern match on that data and call whatever functions, JSON\ndecoders, etc. you need. This makes the code much more explicit and easy to\nfollow for other readers (or you in a few months!)\n';
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $elm$html$Html$code = _VirtualDom_node('code');
var $elm$browser$Debugger$Overlay$viewCode = function (name) {
	return A2(
		$elm$html$Html$code,
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text(name)
			]));
};
var $elm$browser$Debugger$Overlay$addCommas = function (items) {
	if (!items.b) {
		return '';
	} else {
		if (!items.b.b) {
			var item = items.a;
			return item;
		} else {
			if (!items.b.b.b) {
				var item1 = items.a;
				var _v1 = items.b;
				var item2 = _v1.a;
				return item1 + (' and ' + item2);
			} else {
				var lastItem = items.a;
				var otherItems = items.b;
				return A2(
					$elm$core$String$join,
					', ',
					_Utils_ap(
						otherItems,
						_List_fromArray(
							[' and ' + lastItem])));
			}
		}
	}
};
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$browser$Debugger$Overlay$problemToString = function (problem) {
	switch (problem.$) {
		case 'Function':
			return 'functions';
		case 'Decoder':
			return 'JSON decoders';
		case 'Task':
			return 'tasks';
		case 'Process':
			return 'processes';
		case 'Socket':
			return 'web sockets';
		case 'Request':
			return 'HTTP requests';
		case 'Program':
			return 'programs';
		default:
			return 'virtual DOM values';
	}
};
var $elm$browser$Debugger$Overlay$viewProblemType = function (_v0) {
	var name = _v0.name;
	var problems = _v0.problems;
	return A2(
		$elm$html$Html$li,
		_List_Nil,
		_List_fromArray(
			[
				$elm$browser$Debugger$Overlay$viewCode(name),
				$elm$html$Html$text(
				' can contain ' + ($elm$browser$Debugger$Overlay$addCommas(
					A2($elm$core$List$map, $elm$browser$Debugger$Overlay$problemToString, problems)) + '.'))
			]));
};
var $elm$browser$Debugger$Overlay$viewBadMetadata = function (_v0) {
	var message = _v0.message;
	var problems = _v0.problems;
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('The '),
					$elm$browser$Debugger$Overlay$viewCode(message),
					$elm$html$Html$text(' type of your program cannot be reliably serialized for history files.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Functions cannot be serialized, nor can values that contain functions. This is a problem in these places:')
				])),
			A2(
			$elm$html$Html$ul,
			_List_Nil,
			A2($elm$core$List$map, $elm$browser$Debugger$Overlay$viewProblemType, problems)),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text($elm$browser$Debugger$Overlay$goodNews1),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('https://guide.elm-lang.org/types/custom_types.html')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('custom types')
						])),
					$elm$html$Html$text(', in your messages. From there, your '),
					$elm$browser$Debugger$Overlay$viewCode('update'),
					$elm$html$Html$text($elm$browser$Debugger$Overlay$goodNews2)
				]))
		]);
};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$browser$Debugger$Overlay$Cancel = {$: 'Cancel'};
var $elm$browser$Debugger$Overlay$Proceed = {$: 'Proceed'};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$browser$Debugger$Overlay$viewButtons = function (buttons) {
	var btn = F2(
		function (msg, string) {
			return A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-right', '20px'),
						$elm$html$Html$Events$onClick(msg)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(string)
					]));
		});
	var buttonNodes = function () {
		if (buttons.$ === 'Accept') {
			var proceed = buttons.a;
			return _List_fromArray(
				[
					A2(btn, $elm$browser$Debugger$Overlay$Proceed, proceed)
				]);
		} else {
			var cancel = buttons.a;
			var proceed = buttons.b;
			return _List_fromArray(
				[
					A2(btn, $elm$browser$Debugger$Overlay$Cancel, cancel),
					A2(btn, $elm$browser$Debugger$Overlay$Proceed, proceed)
				]);
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'height', '60px'),
				A2($elm$html$Html$Attributes$style, 'line-height', '60px'),
				A2($elm$html$Html$Attributes$style, 'text-align', 'right'),
				A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(50, 50, 50)')
			]),
		buttonNodes);
};
var $elm$browser$Debugger$Overlay$viewMessage = F4(
	function (config, title, details, buttons) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('elm-debugger-overlay'),
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'width', '100vw'),
					A2($elm$html$Html$Attributes$style, 'height', '100vh'),
					A2($elm$html$Html$Attributes$style, 'color', 'white'),
					A2($elm$html$Html$Attributes$style, 'pointer-events', 'none'),
					A2($elm$html$Html$Attributes$style, 'font-family', '\'Trebuchet MS\', \'Lucida Grande\', \'Bitstream Vera Sans\', \'Helvetica Neue\', sans-serif'),
					A2($elm$html$Html$Attributes$style, 'z-index', '2147483647')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
							A2($elm$html$Html$Attributes$style, 'width', '600px'),
							A2($elm$html$Html$Attributes$style, 'height', '100vh'),
							A2($elm$html$Html$Attributes$style, 'padding-left', 'calc(50% - 300px)'),
							A2($elm$html$Html$Attributes$style, 'padding-right', 'calc(50% - 300px)'),
							A2($elm$html$Html$Attributes$style, 'background-color', 'rgba(200, 200, 200, 0.7)'),
							A2($elm$html$Html$Attributes$style, 'pointer-events', 'auto')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '36px'),
									A2($elm$html$Html$Attributes$style, 'height', '80px'),
									A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(50, 50, 50)'),
									A2($elm$html$Html$Attributes$style, 'padding-left', '22px'),
									A2($elm$html$Html$Attributes$style, 'vertical-align', 'middle'),
									A2($elm$html$Html$Attributes$style, 'line-height', '80px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(title)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('elm-debugger-details'),
									A2($elm$html$Html$Attributes$style, 'padding', ' 8px 20px'),
									A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
									A2($elm$html$Html$Attributes$style, 'max-height', 'calc(100vh - 156px)'),
									A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(61, 61, 61)')
								]),
							details),
							A2(
							$elm$html$Html$map,
							config.wrap,
							$elm$browser$Debugger$Overlay$viewButtons(buttons))
						]))
				]));
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$virtual_dom$VirtualDom$nodeNS = function (tag) {
	return _VirtualDom_nodeNS(
		_VirtualDom_noScript(tag));
};
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$browser$Debugger$Overlay$viewShape = F4(
	function (x, y, angle, coordinates) {
		return A4(
			$elm$virtual_dom$VirtualDom$nodeNS,
			'http://www.w3.org/2000/svg',
			'polygon',
			_List_fromArray(
				[
					A2($elm$virtual_dom$VirtualDom$attribute, 'points', coordinates),
					A2(
					$elm$virtual_dom$VirtualDom$attribute,
					'transform',
					'translate(' + ($elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y) + (') rotate(' + ($elm$core$String$fromFloat(-angle) + ')'))))))
				]),
			_List_Nil);
	});
var $elm$browser$Debugger$Overlay$elmLogo = A4(
	$elm$virtual_dom$VirtualDom$nodeNS,
	'http://www.w3.org/2000/svg',
	'svg',
	_List_fromArray(
		[
			A2($elm$virtual_dom$VirtualDom$attribute, 'viewBox', '-300 -300 600 600'),
			A2($elm$virtual_dom$VirtualDom$attribute, 'xmlns', 'http://www.w3.org/2000/svg'),
			A2($elm$virtual_dom$VirtualDom$attribute, 'fill', 'currentColor'),
			A2($elm$virtual_dom$VirtualDom$attribute, 'width', '24px'),
			A2($elm$virtual_dom$VirtualDom$attribute, 'height', '24px')
		]),
	_List_fromArray(
		[
			A4(
			$elm$virtual_dom$VirtualDom$nodeNS,
			'http://www.w3.org/2000/svg',
			'g',
			_List_fromArray(
				[
					A2($elm$virtual_dom$VirtualDom$attribute, 'transform', 'scale(1 -1)')
				]),
			_List_fromArray(
				[
					A4($elm$browser$Debugger$Overlay$viewShape, 0, -210, 0, '-280,-90 0,190 280,-90'),
					A4($elm$browser$Debugger$Overlay$viewShape, -210, 0, 90, '-280,-90 0,190 280,-90'),
					A4($elm$browser$Debugger$Overlay$viewShape, 207, 207, 45, '-198,-66 0,132 198,-66'),
					A4($elm$browser$Debugger$Overlay$viewShape, 150, 0, 0, '-130,0 0,-130 130,0 0,130'),
					A4($elm$browser$Debugger$Overlay$viewShape, -89, 239, 0, '-191,61 69,61 191,-61 -69,-61'),
					A4($elm$browser$Debugger$Overlay$viewShape, 0, 106, 180, '-130,-44 0,86  130,-44'),
					A4($elm$browser$Debugger$Overlay$viewShape, 256, -150, 270, '-130,-44 0,86  130,-44')
				]))
		]));
var $elm$core$String$length = _String_length;
var $elm$browser$Debugger$Overlay$viewMiniControls = F2(
	function (config, numMsgs) {
		var string = $elm$core$String$fromInt(numMsgs);
		var width = $elm$core$String$fromInt(
			2 + $elm$core$String$length(string));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'bottom', '2em'),
					A2($elm$html$Html$Attributes$style, 'right', '2em'),
					A2($elm$html$Html$Attributes$style, 'width', 'calc(42px + ' + (width + 'ch)')),
					A2($elm$html$Html$Attributes$style, 'height', '36px'),
					A2($elm$html$Html$Attributes$style, 'background-color', '#1293D8'),
					A2($elm$html$Html$Attributes$style, 'color', 'white'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
					A2($elm$html$Html$Attributes$style, 'pointer-events', 'auto'),
					A2($elm$html$Html$Attributes$style, 'z-index', '2147483647'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					$elm$html$Html$Events$onClick(config.open)
				]),
			_List_fromArray(
				[
					$elm$browser$Debugger$Overlay$elmLogo,
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'padding-left', 'calc(1ch + 6px)'),
							A2($elm$html$Html$Attributes$style, 'padding-right', '1ch')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(string)
						]))
				]));
	});
var $elm$browser$Debugger$Overlay$explanationBad = '\nThe messages in this history do not match the messages handled by your\nprogram. I noticed changes in the following types:\n';
var $elm$browser$Debugger$Overlay$explanationRisky = '\nThis history seems old. It will work with this program, but some\nmessages have been added since the history was created:\n';
var $elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						$elm$core$List$cons,
						sep,
						A2($elm$core$List$cons, x, rest));
				});
			var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
			return A2($elm$core$List$cons, hd, spersed);
		}
	});
var $elm$browser$Debugger$Overlay$viewMention = F2(
	function (tags, verbed) {
		var _v0 = A2(
			$elm$core$List$map,
			$elm$browser$Debugger$Overlay$viewCode,
			$elm$core$List$reverse(tags));
		if (!_v0.b) {
			return $elm$html$Html$text('');
		} else {
			if (!_v0.b.b) {
				var tag = _v0.a;
				return A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(verbed),
							tag,
							$elm$html$Html$text('.')
						]));
			} else {
				if (!_v0.b.b.b) {
					var tag2 = _v0.a;
					var _v1 = _v0.b;
					var tag1 = _v1.a;
					return A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(verbed),
								tag1,
								$elm$html$Html$text(' and '),
								tag2,
								$elm$html$Html$text('.')
							]));
				} else {
					var lastTag = _v0.a;
					var otherTags = _v0.b;
					return A2(
						$elm$html$Html$li,
						_List_Nil,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$text(verbed),
							_Utils_ap(
								A2(
									$elm$core$List$intersperse,
									$elm$html$Html$text(', '),
									$elm$core$List$reverse(otherTags)),
								_List_fromArray(
									[
										$elm$html$Html$text(', and '),
										lastTag,
										$elm$html$Html$text('.')
									]))));
				}
			}
		}
	});
var $elm$browser$Debugger$Overlay$viewChange = function (change) {
	return A2(
		$elm$html$Html$li,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'margin', '8px 0')
			]),
		function () {
			if (change.$ === 'AliasChange') {
				var name = change.a;
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
							]),
						_List_fromArray(
							[
								$elm$browser$Debugger$Overlay$viewCode(name)
							]))
					]);
			} else {
				var name = change.a;
				var removed = change.b.removed;
				var changed = change.b.changed;
				var added = change.b.added;
				var argsMatch = change.b.argsMatch;
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '1.5em')
							]),
						_List_fromArray(
							[
								$elm$browser$Debugger$Overlay$viewCode(name)
							])),
						A2(
						$elm$html$Html$ul,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'list-style-type', 'disc'),
								A2($elm$html$Html$Attributes$style, 'padding-left', '2em')
							]),
						_List_fromArray(
							[
								A2($elm$browser$Debugger$Overlay$viewMention, removed, 'Removed '),
								A2($elm$browser$Debugger$Overlay$viewMention, changed, 'Changed '),
								A2($elm$browser$Debugger$Overlay$viewMention, added, 'Added ')
							])),
						argsMatch ? $elm$html$Html$text('') : $elm$html$Html$text('This may be due to the fact that the type variable names changed.')
					]);
			}
		}());
};
var $elm$browser$Debugger$Overlay$viewReport = F2(
	function (isBad, report) {
		switch (report.$) {
			case 'CorruptHistory':
				return _List_fromArray(
					[
						$elm$html$Html$text('Looks like this history file is corrupt. I cannot understand it.')
					]);
			case 'VersionChanged':
				var old = report.a;
				var _new = report.b;
				return _List_fromArray(
					[
						$elm$html$Html$text('This history was created with Elm ' + (old + (', but you are using Elm ' + (_new + ' right now.'))))
					]);
			case 'MessageChanged':
				var old = report.a;
				var _new = report.b;
				return _List_fromArray(
					[
						$elm$html$Html$text('To import some other history, the overall message type must' + ' be the same. The old history has '),
						$elm$browser$Debugger$Overlay$viewCode(old),
						$elm$html$Html$text(' messages, but the new program works with '),
						$elm$browser$Debugger$Overlay$viewCode(_new),
						$elm$html$Html$text(' messages.')
					]);
			default:
				var changes = report.a;
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								isBad ? $elm$browser$Debugger$Overlay$explanationBad : $elm$browser$Debugger$Overlay$explanationRisky)
							])),
						A2(
						$elm$html$Html$ul,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'list-style-type', 'none'),
								A2($elm$html$Html$Attributes$style, 'padding-left', '20px')
							]),
						A2($elm$core$List$map, $elm$browser$Debugger$Overlay$viewChange, changes))
					]);
		}
	});
var $elm$browser$Debugger$Overlay$view = F5(
	function (config, isPaused, isOpen, numMsgs, state) {
		switch (state.$) {
			case 'None':
				return isOpen ? $elm$html$Html$text('') : (isPaused ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('elm-debugger-overlay'),
							A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
							A2($elm$html$Html$Attributes$style, 'top', '0'),
							A2($elm$html$Html$Attributes$style, 'left', '0'),
							A2($elm$html$Html$Attributes$style, 'width', '100vw'),
							A2($elm$html$Html$Attributes$style, 'height', '100vh'),
							A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
							A2($elm$html$Html$Attributes$style, 'pointer-events', 'auto'),
							A2($elm$html$Html$Attributes$style, 'background-color', 'rgba(200, 200, 200, 0.7)'),
							A2($elm$html$Html$Attributes$style, 'color', 'white'),
							A2($elm$html$Html$Attributes$style, 'font-family', '\'Trebuchet MS\', \'Lucida Grande\', \'Bitstream Vera Sans\', \'Helvetica Neue\', sans-serif'),
							A2($elm$html$Html$Attributes$style, 'z-index', '2147483646'),
							$elm$html$Html$Events$onClick(config.resume)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '80px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Click to Resume')
								])),
							A2($elm$browser$Debugger$Overlay$viewMiniControls, config, numMsgs)
						])) : A2($elm$browser$Debugger$Overlay$viewMiniControls, config, numMsgs));
			case 'BadMetadata':
				var badMetadata_ = state.a;
				return A4(
					$elm$browser$Debugger$Overlay$viewMessage,
					config,
					'Cannot use Import or Export',
					$elm$browser$Debugger$Overlay$viewBadMetadata(badMetadata_),
					$elm$browser$Debugger$Overlay$Accept('Ok'));
			case 'BadImport':
				var report = state.a;
				return A4(
					$elm$browser$Debugger$Overlay$viewMessage,
					config,
					'Cannot Import History',
					A2($elm$browser$Debugger$Overlay$viewReport, true, report),
					$elm$browser$Debugger$Overlay$Accept('Ok'));
			default:
				var report = state.a;
				return A4(
					$elm$browser$Debugger$Overlay$viewMessage,
					config,
					'Warning',
					A2($elm$browser$Debugger$Overlay$viewReport, false, report),
					A2($elm$browser$Debugger$Overlay$Choose, 'Cancel', 'Import Anyway'));
		}
	});
var $elm$browser$Debugger$Main$cornerView = function (model) {
	return A5(
		$elm$browser$Debugger$Overlay$view,
		{exportHistory: $elm$browser$Debugger$Main$Export, importHistory: $elm$browser$Debugger$Main$Import, open: $elm$browser$Debugger$Main$Open, resume: $elm$browser$Debugger$Main$Resume, wrap: $elm$browser$Debugger$Main$OverlayMsg},
		$elm$browser$Debugger$Main$isPaused(model.state),
		_Debugger_isOpen(model.popout),
		$elm$browser$Debugger$History$size(model.history),
		model.overlay);
};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$foldr = F3(
	function (func, initialState, _v0) {
		var dict = _v0.a;
		return A3(
			$elm$core$Dict$foldr,
			F3(
				function (key, _v1, state) {
					return A2(func, key, state);
				}),
			initialState,
			dict);
	});
var $elm$browser$Debugger$Main$getCurrentModel = function (state) {
	if (state.$ === 'Running') {
		var model = state.a;
		return model;
	} else {
		var model = state.b;
		return model;
	}
};
var $elm$browser$Debugger$Main$getUserModel = function (model) {
	return $elm$browser$Debugger$Main$getCurrentModel(model.state);
};
var $elm$browser$Debugger$Main$initialWindowHeight = 420;
var $elm$browser$Debugger$Main$initialWindowWidth = 900;
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$browser$Debugger$Main$cachedHistory = function (model) {
	var _v0 = model.state;
	if (_v0.$ === 'Running') {
		return model.history;
	} else {
		var history = _v0.e;
		return history;
	}
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$browser$Debugger$Main$DragEnd = {$: 'DragEnd'};
var $elm$browser$Debugger$Main$getDragStatus = function (layout) {
	if (layout.$ === 'Horizontal') {
		var status = layout.a;
		return status;
	} else {
		var status = layout.a;
		return status;
	}
};
var $elm$browser$Debugger$Main$Drag = function (a) {
	return {$: 'Drag', a: a};
};
var $elm$browser$Debugger$Main$DragInfo = F5(
	function (x, y, down, width, height) {
		return {down: down, height: height, width: width, x: x, y: y};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$browser$Debugger$Main$decodeDimension = function (field) {
	return A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['currentTarget', 'ownerDocument', 'defaultView', field]),
		$elm$json$Json$Decode$float);
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map5 = _Json_map5;
var $elm$browser$Debugger$Main$onMouseMove = A2(
	$elm$html$Html$Events$on,
	'mousemove',
	A2(
		$elm$json$Json$Decode$map,
		$elm$browser$Debugger$Main$Drag,
		A6(
			$elm$json$Json$Decode$map5,
			$elm$browser$Debugger$Main$DragInfo,
			A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
			A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float),
			A2(
				$elm$json$Json$Decode$field,
				'buttons',
				A2(
					$elm$json$Json$Decode$map,
					function (v) {
						return v === 1;
					},
					$elm$json$Json$Decode$int)),
			$elm$browser$Debugger$Main$decodeDimension('innerWidth'),
			$elm$browser$Debugger$Main$decodeDimension('innerHeight'))));
var $elm$html$Html$Events$onMouseUp = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseup',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$browser$Debugger$Main$toDragListeners = function (layout) {
	var _v0 = $elm$browser$Debugger$Main$getDragStatus(layout);
	if (_v0.$ === 'Static') {
		return _List_Nil;
	} else {
		return _List_fromArray(
			[
				$elm$browser$Debugger$Main$onMouseMove,
				$elm$html$Html$Events$onMouseUp($elm$browser$Debugger$Main$DragEnd)
			]);
	}
};
var $elm$browser$Debugger$Main$toFlexDirection = function (layout) {
	if (layout.$ === 'Horizontal') {
		return 'row';
	} else {
		return 'column-reverse';
	}
};
var $elm$browser$Debugger$Main$DragStart = {$: 'DragStart'};
var $elm$html$Html$Events$onMouseDown = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mousedown',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$browser$Debugger$Main$toPercent = function (fraction) {
	return $elm$core$String$fromFloat(100 * fraction) + '%';
};
var $elm$browser$Debugger$Main$viewDragZone = function (layout) {
	if (layout.$ === 'Horizontal') {
		var x = layout.b;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2(
					$elm$html$Html$Attributes$style,
					'left',
					$elm$browser$Debugger$Main$toPercent(x)),
					A2($elm$html$Html$Attributes$style, 'margin-left', '-5px'),
					A2($elm$html$Html$Attributes$style, 'width', '10px'),
					A2($elm$html$Html$Attributes$style, 'height', '100%'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'col-resize'),
					$elm$html$Html$Events$onMouseDown($elm$browser$Debugger$Main$DragStart)
				]),
			_List_Nil);
	} else {
		var y = layout.c;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2(
					$elm$html$Html$Attributes$style,
					'top',
					$elm$browser$Debugger$Main$toPercent(y)),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'margin-top', '-5px'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', '10px'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'row-resize'),
					$elm$html$Html$Events$onMouseDown($elm$browser$Debugger$Main$DragStart)
				]),
			_List_Nil);
	}
};
var $elm$browser$Debugger$Main$TweakExpandoModel = function (a) {
	return {$: 'TweakExpandoModel', a: a};
};
var $elm$browser$Debugger$Main$TweakExpandoMsg = function (a) {
	return {$: 'TweakExpandoMsg', a: a};
};
var $elm$browser$Debugger$Main$toExpandoPercents = function (layout) {
	if (layout.$ === 'Horizontal') {
		var x = layout.b;
		return _Utils_Tuple2(
			$elm$browser$Debugger$Main$toPercent(1 - x),
			'100%');
	} else {
		var y = layout.c;
		return _Utils_Tuple2(
			'100%',
			$elm$browser$Debugger$Main$toPercent(y));
	}
};
var $elm$browser$Debugger$Main$toMouseBlocker = function (layout) {
	var _v0 = $elm$browser$Debugger$Main$getDragStatus(layout);
	if (_v0.$ === 'Static') {
		return 'auto';
	} else {
		return 'none';
	}
};
var $elm$browser$Debugger$Expando$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$browser$Debugger$Expando$Index = F3(
	function (a, b, c) {
		return {$: 'Index', a: a, b: b, c: c};
	});
var $elm$browser$Debugger$Expando$Key = {$: 'Key'};
var $elm$browser$Debugger$Expando$None = {$: 'None'};
var $elm$browser$Debugger$Expando$Toggle = {$: 'Toggle'};
var $elm$browser$Debugger$Expando$Value = {$: 'Value'};
var $elm$browser$Debugger$Expando$blue = A2($elm$html$Html$Attributes$style, 'color', 'rgb(28, 0, 207)');
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$browser$Debugger$Expando$leftPad = function (maybeKey) {
	if (maybeKey.$ === 'Nothing') {
		return _List_Nil;
	} else {
		return _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'padding-left', '4ch')
			]);
	}
};
var $elm$browser$Debugger$Expando$makeArrow = function (arrow) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'color', '#777'),
				A2($elm$html$Html$Attributes$style, 'padding-left', '2ch'),
				A2($elm$html$Html$Attributes$style, 'width', '2ch'),
				A2($elm$html$Html$Attributes$style, 'display', 'inline-block')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(arrow)
			]));
};
var $elm$browser$Debugger$Expando$purple = A2($elm$html$Html$Attributes$style, 'color', 'rgb(136, 19, 145)');
var $elm$browser$Debugger$Expando$lineStarter = F3(
	function (maybeKey, maybeIsClosed, description) {
		var arrow = function () {
			if (maybeIsClosed.$ === 'Nothing') {
				return $elm$browser$Debugger$Expando$makeArrow('');
			} else {
				if (maybeIsClosed.a) {
					return $elm$browser$Debugger$Expando$makeArrow('▸');
				} else {
					return $elm$browser$Debugger$Expando$makeArrow('▾');
				}
			}
		}();
		if (maybeKey.$ === 'Nothing') {
			return A2($elm$core$List$cons, arrow, description);
		} else {
			var key = maybeKey.a;
			return A2(
				$elm$core$List$cons,
				arrow,
				A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$span,
						_List_fromArray(
							[$elm$browser$Debugger$Expando$purple]),
						_List_fromArray(
							[
								$elm$html$Html$text(key)
							])),
					A2(
						$elm$core$List$cons,
						$elm$html$Html$text(' = '),
						description)));
		}
	});
var $elm$browser$Debugger$Expando$red = A2($elm$html$Html$Attributes$style, 'color', 'rgb(196, 26, 22)');
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$browser$Debugger$Expando$seqTypeToString = F2(
	function (n, seqType) {
		switch (seqType.$) {
			case 'ListSeq':
				return 'List(' + ($elm$core$String$fromInt(n) + ')');
			case 'SetSeq':
				return 'Set(' + ($elm$core$String$fromInt(n) + ')');
			default:
				return 'Array(' + ($elm$core$String$fromInt(n) + ')');
		}
	});
var $elm$core$String$slice = _String_slice;
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $elm$browser$Debugger$Expando$elideMiddle = function (str) {
	return ($elm$core$String$length(str) <= 18) ? str : (A2($elm$core$String$left, 8, str) + ('...' + A2($elm$core$String$right, 8, str)));
};
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === 'RBEmpty_elm_builtin') {
		return true;
	} else {
		return false;
	}
};
var $elm$browser$Debugger$Expando$viewExtraTinyRecord = F3(
	function (length, starter, entries) {
		if (!entries.b) {
			return _Utils_Tuple2(
				length + 1,
				_List_fromArray(
					[
						$elm$html$Html$text('}')
					]));
		} else {
			var field = entries.a;
			var rest = entries.b;
			var nextLength = (length + $elm$core$String$length(field)) + 1;
			if (nextLength > 18) {
				return _Utils_Tuple2(
					length + 2,
					_List_fromArray(
						[
							$elm$html$Html$text('…}')
						]));
			} else {
				var _v1 = A3($elm$browser$Debugger$Expando$viewExtraTinyRecord, nextLength, ',', rest);
				var finalLength = _v1.a;
				var otherHtmls = _v1.b;
				return _Utils_Tuple2(
					finalLength,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$text(starter),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$span,
								_List_fromArray(
									[$elm$browser$Debugger$Expando$purple]),
								_List_fromArray(
									[
										$elm$html$Html$text(field)
									])),
							otherHtmls)));
			}
		}
	});
var $elm$browser$Debugger$Expando$viewTinyHelp = function (str) {
	return _Utils_Tuple2(
		$elm$core$String$length(str),
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $elm$browser$Debugger$Expando$viewExtraTiny = function (value) {
	if (value.$ === 'Record') {
		var record = value.b;
		return A3(
			$elm$browser$Debugger$Expando$viewExtraTinyRecord,
			0,
			'{',
			$elm$core$Dict$keys(record));
	} else {
		return $elm$browser$Debugger$Expando$viewTiny(value);
	}
};
var $elm$browser$Debugger$Expando$viewTiny = function (value) {
	switch (value.$) {
		case 'S':
			var stringRep = value.a;
			var str = $elm$browser$Debugger$Expando$elideMiddle(stringRep);
			return _Utils_Tuple2(
				$elm$core$String$length(str),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[$elm$browser$Debugger$Expando$red]),
						_List_fromArray(
							[
								$elm$html$Html$text(str)
							]))
					]));
		case 'Primitive':
			var stringRep = value.a;
			return _Utils_Tuple2(
				$elm$core$String$length(stringRep),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[$elm$browser$Debugger$Expando$blue]),
						_List_fromArray(
							[
								$elm$html$Html$text(stringRep)
							]))
					]));
		case 'Sequence':
			var seqType = value.a;
			var valueList = value.c;
			return $elm$browser$Debugger$Expando$viewTinyHelp(
				A2(
					$elm$browser$Debugger$Expando$seqTypeToString,
					$elm$core$List$length(valueList),
					seqType));
		case 'Dictionary':
			var keyValuePairs = value.b;
			return $elm$browser$Debugger$Expando$viewTinyHelp(
				'Dict(' + ($elm$core$String$fromInt(
					$elm$core$List$length(keyValuePairs)) + ')'));
		case 'Record':
			var record = value.b;
			return $elm$browser$Debugger$Expando$viewTinyRecord(record);
		default:
			if (!value.c.b) {
				var maybeName = value.a;
				return $elm$browser$Debugger$Expando$viewTinyHelp(
					A2($elm$core$Maybe$withDefault, 'Unit', maybeName));
			} else {
				var maybeName = value.a;
				var valueList = value.c;
				return $elm$browser$Debugger$Expando$viewTinyHelp(
					function () {
						if (maybeName.$ === 'Nothing') {
							return 'Tuple(' + ($elm$core$String$fromInt(
								$elm$core$List$length(valueList)) + ')');
						} else {
							var name = maybeName.a;
							return name + ' …';
						}
					}());
			}
	}
};
var $elm$browser$Debugger$Expando$viewTinyRecord = function (record) {
	return $elm$core$Dict$isEmpty(record) ? _Utils_Tuple2(
		2,
		_List_fromArray(
			[
				$elm$html$Html$text('{}')
			])) : A3(
		$elm$browser$Debugger$Expando$viewTinyRecordHelp,
		0,
		'{ ',
		$elm$core$Dict$toList(record));
};
var $elm$browser$Debugger$Expando$viewTinyRecordHelp = F3(
	function (length, starter, entries) {
		if (!entries.b) {
			return _Utils_Tuple2(
				length + 2,
				_List_fromArray(
					[
						$elm$html$Html$text(' }')
					]));
		} else {
			var _v1 = entries.a;
			var field = _v1.a;
			var value = _v1.b;
			var rest = entries.b;
			var fieldLen = $elm$core$String$length(field);
			var _v2 = $elm$browser$Debugger$Expando$viewExtraTiny(value);
			var valueLen = _v2.a;
			var valueHtmls = _v2.b;
			var newLength = ((length + fieldLen) + valueLen) + 5;
			if (newLength > 60) {
				return _Utils_Tuple2(
					length + 4,
					_List_fromArray(
						[
							$elm$html$Html$text(', … }')
						]));
			} else {
				var _v3 = A3($elm$browser$Debugger$Expando$viewTinyRecordHelp, newLength, ', ', rest);
				var finalLength = _v3.a;
				var otherHtmls = _v3.b;
				return _Utils_Tuple2(
					finalLength,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$text(starter),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$span,
								_List_fromArray(
									[$elm$browser$Debugger$Expando$purple]),
								_List_fromArray(
									[
										$elm$html$Html$text(field)
									])),
							A2(
								$elm$core$List$cons,
								$elm$html$Html$text(' = '),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$span, _List_Nil, valueHtmls),
									otherHtmls)))));
			}
		}
	});
var $elm$browser$Debugger$Expando$view = F2(
	function (maybeKey, expando) {
		switch (expando.$) {
			case 'S':
				var stringRep = expando.a;
				return A2(
					$elm$html$Html$div,
					$elm$browser$Debugger$Expando$leftPad(maybeKey),
					A3(
						$elm$browser$Debugger$Expando$lineStarter,
						maybeKey,
						$elm$core$Maybe$Nothing,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[$elm$browser$Debugger$Expando$red]),
								_List_fromArray(
									[
										$elm$html$Html$text(stringRep)
									]))
							])));
			case 'Primitive':
				var stringRep = expando.a;
				return A2(
					$elm$html$Html$div,
					$elm$browser$Debugger$Expando$leftPad(maybeKey),
					A3(
						$elm$browser$Debugger$Expando$lineStarter,
						maybeKey,
						$elm$core$Maybe$Nothing,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[$elm$browser$Debugger$Expando$blue]),
								_List_fromArray(
									[
										$elm$html$Html$text(stringRep)
									]))
							])));
			case 'Sequence':
				var seqType = expando.a;
				var isClosed = expando.b;
				var valueList = expando.c;
				return A4($elm$browser$Debugger$Expando$viewSequence, maybeKey, seqType, isClosed, valueList);
			case 'Dictionary':
				var isClosed = expando.a;
				var keyValuePairs = expando.b;
				return A3($elm$browser$Debugger$Expando$viewDictionary, maybeKey, isClosed, keyValuePairs);
			case 'Record':
				var isClosed = expando.a;
				var valueDict = expando.b;
				return A3($elm$browser$Debugger$Expando$viewRecord, maybeKey, isClosed, valueDict);
			default:
				var maybeName = expando.a;
				var isClosed = expando.b;
				var valueList = expando.c;
				return A4($elm$browser$Debugger$Expando$viewConstructor, maybeKey, maybeName, isClosed, valueList);
		}
	});
var $elm$browser$Debugger$Expando$viewConstructor = F4(
	function (maybeKey, maybeName, isClosed, valueList) {
		var tinyArgs = A2(
			$elm$core$List$map,
			A2($elm$core$Basics$composeL, $elm$core$Tuple$second, $elm$browser$Debugger$Expando$viewExtraTiny),
			valueList);
		var description = function () {
			var _v7 = _Utils_Tuple2(maybeName, tinyArgs);
			if (_v7.a.$ === 'Nothing') {
				if (!_v7.b.b) {
					var _v8 = _v7.a;
					return _List_fromArray(
						[
							$elm$html$Html$text('()')
						]);
				} else {
					var _v9 = _v7.a;
					var _v10 = _v7.b;
					var x = _v10.a;
					var xs = _v10.b;
					return A2(
						$elm$core$List$cons,
						$elm$html$Html$text('( '),
						A2(
							$elm$core$List$cons,
							A2($elm$html$Html$span, _List_Nil, x),
							A3(
								$elm$core$List$foldr,
								F2(
									function (args, rest) {
										return A2(
											$elm$core$List$cons,
											$elm$html$Html$text(', '),
											A2(
												$elm$core$List$cons,
												A2($elm$html$Html$span, _List_Nil, args),
												rest));
									}),
								_List_fromArray(
									[
										$elm$html$Html$text(' )')
									]),
								xs)));
				}
			} else {
				if (!_v7.b.b) {
					var name = _v7.a.a;
					return _List_fromArray(
						[
							$elm$html$Html$text(name)
						]);
				} else {
					var name = _v7.a.a;
					var _v11 = _v7.b;
					var x = _v11.a;
					var xs = _v11.b;
					return A2(
						$elm$core$List$cons,
						$elm$html$Html$text(name + ' '),
						A2(
							$elm$core$List$cons,
							A2($elm$html$Html$span, _List_Nil, x),
							A3(
								$elm$core$List$foldr,
								F2(
									function (args, rest) {
										return A2(
											$elm$core$List$cons,
											$elm$html$Html$text(' '),
											A2(
												$elm$core$List$cons,
												A2($elm$html$Html$span, _List_Nil, args),
												rest));
									}),
								_List_Nil,
								xs)));
				}
			}
		}();
		var _v4 = function () {
			if (!valueList.b) {
				return _Utils_Tuple2(
					$elm$core$Maybe$Nothing,
					A2($elm$html$Html$div, _List_Nil, _List_Nil));
			} else {
				if (!valueList.b.b) {
					var entry = valueList.a;
					switch (entry.$) {
						case 'S':
							return _Utils_Tuple2(
								$elm$core$Maybe$Nothing,
								A2($elm$html$Html$div, _List_Nil, _List_Nil));
						case 'Primitive':
							return _Utils_Tuple2(
								$elm$core$Maybe$Nothing,
								A2($elm$html$Html$div, _List_Nil, _List_Nil));
						case 'Sequence':
							var subValueList = entry.c;
							return _Utils_Tuple2(
								$elm$core$Maybe$Just(isClosed),
								isClosed ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : A2(
									$elm$html$Html$map,
									A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$None, 0),
									$elm$browser$Debugger$Expando$viewSequenceOpen(subValueList)));
						case 'Dictionary':
							var keyValuePairs = entry.b;
							return _Utils_Tuple2(
								$elm$core$Maybe$Just(isClosed),
								isClosed ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : A2(
									$elm$html$Html$map,
									A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$None, 0),
									$elm$browser$Debugger$Expando$viewDictionaryOpen(keyValuePairs)));
						case 'Record':
							var record = entry.b;
							return _Utils_Tuple2(
								$elm$core$Maybe$Just(isClosed),
								isClosed ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : A2(
									$elm$html$Html$map,
									A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$None, 0),
									$elm$browser$Debugger$Expando$viewRecordOpen(record)));
						default:
							var subValueList = entry.c;
							return _Utils_Tuple2(
								$elm$core$Maybe$Just(isClosed),
								isClosed ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : A2(
									$elm$html$Html$map,
									A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$None, 0),
									$elm$browser$Debugger$Expando$viewConstructorOpen(subValueList)));
					}
				} else {
					return _Utils_Tuple2(
						$elm$core$Maybe$Just(isClosed),
						isClosed ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : $elm$browser$Debugger$Expando$viewConstructorOpen(valueList));
				}
			}
		}();
		var maybeIsClosed = _v4.a;
		var openHtml = _v4.b;
		return A2(
			$elm$html$Html$div,
			$elm$browser$Debugger$Expando$leftPad(maybeKey),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($elm$browser$Debugger$Expando$Toggle)
						]),
					A3($elm$browser$Debugger$Expando$lineStarter, maybeKey, maybeIsClosed, description)),
					openHtml
				]));
	});
var $elm$browser$Debugger$Expando$viewConstructorEntry = F2(
	function (index, value) {
		return A2(
			$elm$html$Html$map,
			A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$None, index),
			A2(
				$elm$browser$Debugger$Expando$view,
				$elm$core$Maybe$Just(
					$elm$core$String$fromInt(index)),
				value));
	});
var $elm$browser$Debugger$Expando$viewConstructorOpen = function (valueList) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		A2($elm$core$List$indexedMap, $elm$browser$Debugger$Expando$viewConstructorEntry, valueList));
};
var $elm$browser$Debugger$Expando$viewDictionary = F3(
	function (maybeKey, isClosed, keyValuePairs) {
		var starter = 'Dict(' + ($elm$core$String$fromInt(
			$elm$core$List$length(keyValuePairs)) + ')');
		return A2(
			$elm$html$Html$div,
			$elm$browser$Debugger$Expando$leftPad(maybeKey),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($elm$browser$Debugger$Expando$Toggle)
						]),
					A3(
						$elm$browser$Debugger$Expando$lineStarter,
						maybeKey,
						$elm$core$Maybe$Just(isClosed),
						_List_fromArray(
							[
								$elm$html$Html$text(starter)
							]))),
					isClosed ? $elm$html$Html$text('') : $elm$browser$Debugger$Expando$viewDictionaryOpen(keyValuePairs)
				]));
	});
var $elm$browser$Debugger$Expando$viewDictionaryEntry = F2(
	function (index, _v2) {
		var key = _v2.a;
		var value = _v2.b;
		switch (key.$) {
			case 'S':
				var stringRep = key.a;
				return A2(
					$elm$html$Html$map,
					A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$Value, index),
					A2(
						$elm$browser$Debugger$Expando$view,
						$elm$core$Maybe$Just(stringRep),
						value));
			case 'Primitive':
				var stringRep = key.a;
				return A2(
					$elm$html$Html$map,
					A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$Value, index),
					A2(
						$elm$browser$Debugger$Expando$view,
						$elm$core$Maybe$Just(stringRep),
						value));
			default:
				return A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$map,
							A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$Key, index),
							A2(
								$elm$browser$Debugger$Expando$view,
								$elm$core$Maybe$Just('key'),
								key)),
							A2(
							$elm$html$Html$map,
							A2($elm$browser$Debugger$Expando$Index, $elm$browser$Debugger$Expando$Value, index),
							A2(
								$elm$browser$Debugger$Expando$view,
								$elm$core$Maybe$Just('value'),
								value))
						]));
		}
	});
var $elm$browser$Debugger$Expando$viewDictionaryOpen = function (keyValuePairs) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		A2($elm$core$List$indexedMap, $elm$browser$Debugger$Expando$viewDictionaryEntry, keyValuePairs));
};
var $elm$browser$Debugger$Expando$viewRecord = F3(
	function (maybeKey, isClosed, record) {
		var _v1 = isClosed ? _Utils_Tuple3(
			$elm$browser$Debugger$Expando$viewTinyRecord(record).b,
			$elm$html$Html$text(''),
			$elm$html$Html$text('')) : _Utils_Tuple3(
			_List_fromArray(
				[
					$elm$html$Html$text('{')
				]),
			$elm$browser$Debugger$Expando$viewRecordOpen(record),
			A2(
				$elm$html$Html$div,
				$elm$browser$Debugger$Expando$leftPad(
					$elm$core$Maybe$Just(_Utils_Tuple0)),
				_List_fromArray(
					[
						$elm$html$Html$text('}')
					])));
		var start = _v1.a;
		var middle = _v1.b;
		var end = _v1.c;
		return A2(
			$elm$html$Html$div,
			$elm$browser$Debugger$Expando$leftPad(maybeKey),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($elm$browser$Debugger$Expando$Toggle)
						]),
					A3(
						$elm$browser$Debugger$Expando$lineStarter,
						maybeKey,
						$elm$core$Maybe$Just(isClosed),
						start)),
					middle,
					end
				]));
	});
var $elm$browser$Debugger$Expando$viewRecordEntry = function (_v0) {
	var field = _v0.a;
	var value = _v0.b;
	return A2(
		$elm$html$Html$map,
		$elm$browser$Debugger$Expando$Field(field),
		A2(
			$elm$browser$Debugger$Expando$view,
			$elm$core$Maybe$Just(field),
			value));
};
var $elm$browser$Debugger$Expando$viewRecordOpen = function (record) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		A2(
			$elm$core$List$map,
			$elm$browser$Debugger$Expando$viewRecordEntry,
			$elm$core$Dict$toList(record)));
};
var $elm$browser$Debugger$Expando$viewSequence = F4(
	function (maybeKey, seqType, isClosed, valueList) {
		var starter = A2(
			$elm$browser$Debugger$Expando$seqTypeToString,
			$elm$core$List$length(valueList),
			seqType);
		return A2(
			$elm$html$Html$div,
			$elm$browser$Debugger$Expando$leftPad(maybeKey),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($elm$browser$Debugger$Expando$Toggle)
						]),
					A3(
						$elm$browser$Debugger$Expando$lineStarter,
						maybeKey,
						$elm$core$Maybe$Just(isClosed),
						_List_fromArray(
							[
								$elm$html$Html$text(starter)
							]))),
					isClosed ? $elm$html$Html$text('') : $elm$browser$Debugger$Expando$viewSequenceOpen(valueList)
				]));
	});
var $elm$browser$Debugger$Expando$viewSequenceOpen = function (values) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		A2($elm$core$List$indexedMap, $elm$browser$Debugger$Expando$viewConstructorEntry, values));
};
var $elm$browser$Debugger$Main$viewExpando = F3(
	function (expandoMsg, expandoModel, layout) {
		var block = $elm$browser$Debugger$Main$toMouseBlocker(layout);
		var _v0 = $elm$browser$Debugger$Main$toExpandoPercents(layout);
		var w = _v0.a;
		var h = _v0.b;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'block'),
					A2($elm$html$Html$Attributes$style, 'width', 'calc(' + (w + ' - 4em)')),
					A2($elm$html$Html$Attributes$style, 'height', 'calc(' + (h + ' - 4em)')),
					A2($elm$html$Html$Attributes$style, 'padding', '2em'),
					A2($elm$html$Html$Attributes$style, 'margin', '0'),
					A2($elm$html$Html$Attributes$style, 'overflow', 'auto'),
					A2($elm$html$Html$Attributes$style, 'pointer-events', block),
					A2($elm$html$Html$Attributes$style, '-webkit-user-select', block),
					A2($elm$html$Html$Attributes$style, '-moz-user-select', block),
					A2($elm$html$Html$Attributes$style, '-ms-user-select', block),
					A2($elm$html$Html$Attributes$style, 'user-select', block)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', '#ccc'),
							A2($elm$html$Html$Attributes$style, 'padding', '0 0 1em 0')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('-- MESSAGE')
						])),
					A2(
					$elm$html$Html$map,
					$elm$browser$Debugger$Main$TweakExpandoMsg,
					A2($elm$browser$Debugger$Expando$view, $elm$core$Maybe$Nothing, expandoMsg)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', '#ccc'),
							A2($elm$html$Html$Attributes$style, 'padding', '1em 0')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('-- MODEL')
						])),
					A2(
					$elm$html$Html$map,
					$elm$browser$Debugger$Main$TweakExpandoModel,
					A2($elm$browser$Debugger$Expando$view, $elm$core$Maybe$Nothing, expandoModel))
				]));
	});
var $elm$browser$Debugger$Main$Jump = function (a) {
	return {$: 'Jump', a: a};
};
var $elm$virtual_dom$VirtualDom$lazy = _VirtualDom_lazy;
var $elm$html$Html$Lazy$lazy = $elm$virtual_dom$VirtualDom$lazy;
var $elm$browser$Debugger$Main$toHistoryPercents = function (layout) {
	if (layout.$ === 'Horizontal') {
		var x = layout.b;
		return _Utils_Tuple2(
			$elm$browser$Debugger$Main$toPercent(x),
			'100%');
	} else {
		var y = layout.c;
		return _Utils_Tuple2(
			'100%',
			$elm$browser$Debugger$Main$toPercent(1 - y));
	}
};
var $elm$virtual_dom$VirtualDom$lazy3 = _VirtualDom_lazy3;
var $elm$html$Html$Lazy$lazy3 = $elm$virtual_dom$VirtualDom$lazy3;
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$browser$Debugger$History$idForMessageIndex = function (index) {
	return 'msg-' + $elm$core$String$fromInt(index);
};
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $elm$browser$Debugger$History$viewMessage = F3(
	function (currentIndex, index, msg) {
		var messageName = _Debugger_messageToString(msg);
		var className = _Utils_eq(currentIndex, index) ? 'elm-debugger-entry elm-debugger-entry-selected' : 'elm-debugger-entry';
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id(
					$elm$browser$Debugger$History$idForMessageIndex(index)),
					$elm$html$Html$Attributes$class(className),
					$elm$html$Html$Events$onClick(index)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$title(messageName),
							$elm$html$Html$Attributes$class('elm-debugger-entry-content')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(messageName)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('elm-debugger-entry-index')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(index))
						]))
				]));
	});
var $elm$browser$Debugger$History$consMsg = F3(
	function (currentIndex, msg, _v0) {
		var index = _v0.a;
		var rest = _v0.b;
		return _Utils_Tuple2(
			index + 1,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					$elm$core$String$fromInt(index),
					A4($elm$html$Html$Lazy$lazy3, $elm$browser$Debugger$History$viewMessage, currentIndex, index, msg)),
				rest));
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $elm$browser$Debugger$History$maxSnapshotSize = 31;
var $elm$browser$Debugger$History$showMoreButton = function (numMessages) {
	var nextIndex = (numMessages - 1) - ($elm$browser$Debugger$History$maxSnapshotSize * 2);
	var labelText = 'View more messages';
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('elm-debugger-entry'),
				$elm$html$Html$Events$onClick(nextIndex)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$title(labelText),
						$elm$html$Html$Attributes$class('elm-debugger-entry-content')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(labelText)
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('elm-debugger-entry-index')
					]),
				_List_Nil)
			]));
};
var $elm$browser$Debugger$History$styles = A3(
	$elm$html$Html$node,
	'style',
	_List_Nil,
	_List_fromArray(
		[
			$elm$html$Html$text('\n\n.elm-debugger-entry {\n  cursor: pointer;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 8px;\n}\n\n.elm-debugger-entry:hover {\n  background-color: rgb(41, 41, 41);\n}\n\n.elm-debugger-entry-selected, .elm-debugger-entry-selected:hover {\n  background-color: rgb(10, 10, 10);\n}\n\n.elm-debugger-entry-content {\n  width: calc(100% - 40px);\n  padding: 0 5px;\n  box-sizing: border-box;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  display: inline-block;\n}\n\n.elm-debugger-entry-index {\n  color: #666;\n  width: 40px;\n  text-align: right;\n  display: block;\n  float: right;\n}\n\n')
		]));
var $elm$core$Basics$ge = _Utils_ge;
var $elm$browser$Debugger$History$viewSnapshot = F3(
	function (selectedIndex, index, _v0) {
		var messages = _v0.messages;
		return A3(
			$elm$html$Html$Keyed$node,
			'div',
			_List_Nil,
			A3(
				$elm$core$Array$foldr,
				$elm$browser$Debugger$History$consMsg(selectedIndex),
				_Utils_Tuple2(index, _List_Nil),
				messages).b);
	});
var $elm$browser$Debugger$History$consSnapshot = F3(
	function (selectedIndex, snapshot, _v0) {
		var index = _v0.a;
		var rest = _v0.b;
		var nextIndex = index + $elm$core$Array$length(snapshot.messages);
		var selectedIndexHelp = ((_Utils_cmp(nextIndex, selectedIndex) > 0) && (_Utils_cmp(selectedIndex, index) > -1)) ? selectedIndex : (-1);
		return _Utils_Tuple2(
			nextIndex,
			A2(
				$elm$core$List$cons,
				A4($elm$html$Html$Lazy$lazy3, $elm$browser$Debugger$History$viewSnapshot, selectedIndexHelp, index, snapshot),
				rest));
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $elm$browser$Debugger$History$viewAllSnapshots = F3(
	function (selectedIndex, startIndex, snapshots) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			A3(
				$elm$core$Array$foldl,
				$elm$browser$Debugger$History$consSnapshot(selectedIndex),
				_Utils_Tuple2(startIndex, _List_Nil),
				snapshots).b);
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: $elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_v0.$ === 'SubTree') {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_v0.$ === 'SubTree') {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $elm$browser$Debugger$History$viewRecentSnapshots = F3(
	function (selectedIndex, recentMessagesNum, snapshots) {
		var messagesToFill = $elm$browser$Debugger$History$maxSnapshotSize - recentMessagesNum;
		var arrayLength = $elm$core$Array$length(snapshots);
		var snapshotsToRender = function () {
			var _v0 = _Utils_Tuple2(
				A2($elm$core$Array$get, arrayLength - 2, snapshots),
				A2($elm$core$Array$get, arrayLength - 1, snapshots));
			if ((_v0.a.$ === 'Just') && (_v0.b.$ === 'Just')) {
				var fillerSnapshot = _v0.a.a;
				var recentSnapshot = _v0.b.a;
				return $elm$core$Array$fromList(
					_List_fromArray(
						[
							{
							messages: A3($elm$core$Array$slice, 0, messagesToFill, fillerSnapshot.messages),
							model: fillerSnapshot.model
						},
							recentSnapshot
						]));
			} else {
				return snapshots;
			}
		}();
		var startingIndex = ((arrayLength * $elm$browser$Debugger$History$maxSnapshotSize) - $elm$browser$Debugger$History$maxSnapshotSize) - messagesToFill;
		return A3($elm$browser$Debugger$History$viewAllSnapshots, selectedIndex, startingIndex, snapshotsToRender);
	});
var $elm$browser$Debugger$History$view = F2(
	function (maybeIndex, _v0) {
		var snapshots = _v0.snapshots;
		var recent = _v0.recent;
		var numMessages = _v0.numMessages;
		var recentMessageStartIndex = numMessages - recent.numMessages;
		var index = A2($elm$core$Maybe$withDefault, -1, maybeIndex);
		var newStuff = A3(
			$elm$html$Html$Keyed$node,
			'div',
			_List_Nil,
			A3(
				$elm$core$List$foldr,
				$elm$browser$Debugger$History$consMsg(index),
				_Utils_Tuple2(recentMessageStartIndex, _List_Nil),
				recent.messages).b);
		var onlyRenderRecentMessages = (!_Utils_eq(index, -1)) || ($elm$core$Array$length(snapshots) < 2);
		var oldStuff = onlyRenderRecentMessages ? A4($elm$html$Html$Lazy$lazy3, $elm$browser$Debugger$History$viewAllSnapshots, index, 0, snapshots) : A4($elm$html$Html$Lazy$lazy3, $elm$browser$Debugger$History$viewRecentSnapshots, index, recent.numMessages, snapshots);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('elm-debugger-sidebar'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
					A2($elm$html$Html$Attributes$style, 'height', 'calc(100% - 72px)')
				]),
			A2(
				$elm$core$List$cons,
				$elm$browser$Debugger$History$styles,
				A2(
					$elm$core$List$cons,
					newStuff,
					A2(
						$elm$core$List$cons,
						oldStuff,
						onlyRenderRecentMessages ? _List_Nil : _List_fromArray(
							[
								$elm$browser$Debugger$History$showMoreButton(numMessages)
							])))));
	});
var $elm$browser$Debugger$Main$SwapLayout = {$: 'SwapLayout'};
var $elm$browser$Debugger$Main$toHistoryIcon = function (layout) {
	if (layout.$ === 'Horizontal') {
		return 'M13 1a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z M13 3h-10a1 1 0 0 0-1 1v5h12v-5a1 1 0 0 0-1-1z M14 10h-12v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1z';
	} else {
		return 'M0 4a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3z M2 4v8a1 1 0 0 0 1 1h2v-10h-2a1 1 0 0 0-1 1z M6 3v10h7a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1z';
	}
};
var $elm$browser$Debugger$Main$icon = function (path) {
	return A4(
		$elm$virtual_dom$VirtualDom$nodeNS,
		'http://www.w3.org/2000/svg',
		'svg',
		_List_fromArray(
			[
				A2($elm$virtual_dom$VirtualDom$attribute, 'viewBox', '0 0 16 16'),
				A2($elm$virtual_dom$VirtualDom$attribute, 'xmlns', 'http://www.w3.org/2000/svg'),
				A2($elm$virtual_dom$VirtualDom$attribute, 'fill', 'currentColor'),
				A2($elm$virtual_dom$VirtualDom$attribute, 'width', '16px'),
				A2($elm$virtual_dom$VirtualDom$attribute, 'height', '16px')
			]),
		_List_fromArray(
			[
				A4(
				$elm$virtual_dom$VirtualDom$nodeNS,
				'http://www.w3.org/2000/svg',
				'path',
				_List_fromArray(
					[
						A2($elm$virtual_dom$VirtualDom$attribute, 'd', path)
					]),
				_List_Nil)
			]));
};
var $elm$browser$Debugger$Main$viewHistoryButton = F3(
	function (label, msg, path) {
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'row'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'background', 'none'),
					A2($elm$html$Html$Attributes$style, 'border', 'none'),
					A2($elm$html$Html$Attributes$style, 'color', 'inherit'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					$elm$html$Html$Events$onClick(msg)
				]),
			_List_fromArray(
				[
					$elm$browser$Debugger$Main$icon(path),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'padding-left', '6px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						]))
				]));
	});
var $elm$browser$Debugger$Main$viewHistoryOptions = function (layout) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '36px'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'flex-direction', 'row'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
				A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(50, 50, 50)')
			]),
		_List_fromArray(
			[
				A3(
				$elm$browser$Debugger$Main$viewHistoryButton,
				'Swap Layout',
				$elm$browser$Debugger$Main$SwapLayout,
				$elm$browser$Debugger$Main$toHistoryIcon(layout)),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'flex-direction', 'row'),
						A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
						A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between')
					]),
				_List_fromArray(
					[
						A3($elm$browser$Debugger$Main$viewHistoryButton, 'Import', $elm$browser$Debugger$Main$Import, 'M5 1a1 1 0 0 1 0 2h-2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1a1 1 0 0 1 2 0a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z M10 2a1 1 0 0 0 -2 0v6a1 1 0 0 0 1 1h6a1 1 0 0 0 0-2h-3.586l4.293-4.293a1 1 0 0 0-1.414-1.414l-4.293 4.293z'),
						A3($elm$browser$Debugger$Main$viewHistoryButton, 'Export', $elm$browser$Debugger$Main$Export, 'M5 1a1 1 0 0 1 0 2h-2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1 a1 1 0 0 1 2 0a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3z M9 3a1 1 0 1 1 0-2h6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-3.586l-5.293 5.293 a1 1 0 0 1-1.414-1.414l5.293 -5.293z')
					]))
			]));
};
var $elm$browser$Debugger$Main$SliderJump = function (a) {
	return {$: 'SliderJump', a: a};
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$browser$Debugger$Main$isPlaying = function (maybeIndex) {
	if (maybeIndex.$ === 'Nothing') {
		return true;
	} else {
		return false;
	}
};
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$core$String$toInt = _String_toInt;
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $elm$browser$Debugger$Main$viewPlayButton = function (playing) {
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background', '#1293D8'),
				A2($elm$html$Html$Attributes$style, 'border', 'none'),
				A2($elm$html$Html$Attributes$style, 'color', 'white'),
				A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
				A2($elm$html$Html$Attributes$style, 'width', '36px'),
				A2($elm$html$Html$Attributes$style, 'height', '36px'),
				$elm$html$Html$Events$onClick($elm$browser$Debugger$Main$Resume)
			]),
		_List_fromArray(
			[
				playing ? $elm$browser$Debugger$Main$icon('M2 2h4v12h-4v-12z M10 2h4v12h-4v-12z') : $elm$browser$Debugger$Main$icon('M2 2l12 7l-12 7z')
			]));
};
var $elm$browser$Debugger$Main$viewHistorySlider = F2(
	function (history, maybeIndex) {
		var lastIndex = $elm$browser$Debugger$History$size(history) - 1;
		var selectedIndex = A2($elm$core$Maybe$withDefault, lastIndex, maybeIndex);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'row'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', '36px'),
					A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(50, 50, 50)')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$Lazy$lazy,
					$elm$browser$Debugger$Main$viewPlayButton,
					$elm$browser$Debugger$Main$isPlaying(maybeIndex)),
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('range'),
							A2($elm$html$Html$Attributes$style, 'width', 'calc(100% - 56px)'),
							A2($elm$html$Html$Attributes$style, 'height', '36px'),
							A2($elm$html$Html$Attributes$style, 'margin', '0 10px'),
							$elm$html$Html$Attributes$min('0'),
							$elm$html$Html$Attributes$max(
							$elm$core$String$fromInt(lastIndex)),
							$elm$html$Html$Attributes$value(
							$elm$core$String$fromInt(selectedIndex)),
							$elm$html$Html$Events$onInput(
							A2(
								$elm$core$Basics$composeR,
								$elm$core$String$toInt,
								A2(
									$elm$core$Basics$composeR,
									$elm$core$Maybe$withDefault(lastIndex),
									$elm$browser$Debugger$Main$SliderJump)))
						]),
					_List_Nil)
				]));
	});
var $elm$browser$Debugger$Main$viewHistory = F3(
	function (maybeIndex, history, layout) {
		var block = $elm$browser$Debugger$Main$toMouseBlocker(layout);
		var _v0 = $elm$browser$Debugger$Main$toHistoryPercents(layout);
		var w = _v0.a;
		var h = _v0.b;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'width', w),
					A2($elm$html$Html$Attributes$style, 'height', h),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'color', '#DDDDDD'),
					A2($elm$html$Html$Attributes$style, 'background-color', 'rgb(61, 61, 61)'),
					A2($elm$html$Html$Attributes$style, 'pointer-events', block),
					A2($elm$html$Html$Attributes$style, 'user-select', block)
				]),
			_List_fromArray(
				[
					A2($elm$browser$Debugger$Main$viewHistorySlider, history, maybeIndex),
					A2(
					$elm$html$Html$map,
					$elm$browser$Debugger$Main$Jump,
					A2($elm$browser$Debugger$History$view, maybeIndex, history)),
					A2($elm$html$Html$Lazy$lazy, $elm$browser$Debugger$Main$viewHistoryOptions, layout)
				]));
	});
var $elm$browser$Debugger$Main$popoutView = function (model) {
	var maybeIndex = function () {
		var _v0 = model.state;
		if (_v0.$ === 'Running') {
			return $elm$core$Maybe$Nothing;
		} else {
			var index = _v0.a;
			return $elm$core$Maybe$Just(index);
		}
	}();
	var historyToRender = $elm$browser$Debugger$Main$cachedHistory(model);
	return A3(
		$elm$html$Html$node,
		'body',
		_Utils_ap(
			$elm$browser$Debugger$Main$toDragListeners(model.layout),
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'margin', '0'),
					A2($elm$html$Html$Attributes$style, 'padding', '0'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', '100%'),
					A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2(
					$elm$html$Html$Attributes$style,
					'flex-direction',
					$elm$browser$Debugger$Main$toFlexDirection(model.layout))
				])),
		_List_fromArray(
			[
				A3($elm$browser$Debugger$Main$viewHistory, maybeIndex, historyToRender, model.layout),
				$elm$browser$Debugger$Main$viewDragZone(model.layout),
				A3($elm$browser$Debugger$Main$viewExpando, model.expandoMsg, model.expandoModel, model.layout)
			]));
};
var $elm$browser$Debugger$Overlay$BlockAll = {$: 'BlockAll'};
var $elm$browser$Debugger$Overlay$toBlockerType = F2(
	function (isPaused, state) {
		switch (state.$) {
			case 'None':
				return isPaused ? $elm$browser$Debugger$Overlay$BlockAll : $elm$browser$Debugger$Overlay$BlockNone;
			case 'BadMetadata':
				return $elm$browser$Debugger$Overlay$BlockMost;
			case 'BadImport':
				return $elm$browser$Debugger$Overlay$BlockMost;
			default:
				return $elm$browser$Debugger$Overlay$BlockMost;
		}
	});
var $elm$browser$Debugger$Main$toBlockerType = function (model) {
	return A2(
		$elm$browser$Debugger$Overlay$toBlockerType,
		$elm$browser$Debugger$Main$isPaused(model.state),
		model.overlay);
};
var $elm$browser$Debugger$Main$Horizontal = F3(
	function (a, b, c) {
		return {$: 'Horizontal', a: a, b: b, c: c};
	});
var $elm$browser$Debugger$Main$Running = function (a) {
	return {$: 'Running', a: a};
};
var $elm$browser$Debugger$Main$Static = {$: 'Static'};
var $elm$browser$Debugger$Metadata$Error = F2(
	function (message, problems) {
		return {message: message, problems: problems};
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$browser$Debugger$Metadata$Metadata = F2(
	function (versions, types) {
		return {types: types, versions: versions};
	});
var $elm$browser$Debugger$Metadata$Types = F3(
	function (message, aliases, unions) {
		return {aliases: aliases, message: message, unions: unions};
	});
var $elm$browser$Debugger$Metadata$Alias = F2(
	function (args, tipe) {
		return {args: args, tipe: tipe};
	});
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$browser$Debugger$Metadata$decodeAlias = A3(
	$elm$json$Json$Decode$map2,
	$elm$browser$Debugger$Metadata$Alias,
	A2(
		$elm$json$Json$Decode$field,
		'args',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
var $elm$browser$Debugger$Metadata$Union = F2(
	function (args, tags) {
		return {args: args, tags: tags};
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $elm$browser$Debugger$Metadata$decodeUnion = A3(
	$elm$json$Json$Decode$map2,
	$elm$browser$Debugger$Metadata$Union,
	A2(
		$elm$json$Json$Decode$field,
		'args',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'tags',
		$elm$json$Json$Decode$dict(
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string))));
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$browser$Debugger$Metadata$decodeTypes = A4(
	$elm$json$Json$Decode$map3,
	$elm$browser$Debugger$Metadata$Types,
	A2($elm$json$Json$Decode$field, 'message', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'aliases',
		$elm$json$Json$Decode$dict($elm$browser$Debugger$Metadata$decodeAlias)),
	A2(
		$elm$json$Json$Decode$field,
		'unions',
		$elm$json$Json$Decode$dict($elm$browser$Debugger$Metadata$decodeUnion)));
var $elm$browser$Debugger$Metadata$Versions = function (elm) {
	return {elm: elm};
};
var $elm$browser$Debugger$Metadata$decodeVersions = A2(
	$elm$json$Json$Decode$map,
	$elm$browser$Debugger$Metadata$Versions,
	A2($elm$json$Json$Decode$field, 'elm', $elm$json$Json$Decode$string));
var $elm$browser$Debugger$Metadata$decoder = A3(
	$elm$json$Json$Decode$map2,
	$elm$browser$Debugger$Metadata$Metadata,
	A2($elm$json$Json$Decode$field, 'versions', $elm$browser$Debugger$Metadata$decodeVersions),
	A2($elm$json$Json$Decode$field, 'types', $elm$browser$Debugger$Metadata$decodeTypes));
var $elm$browser$Debugger$Metadata$ProblemType = F2(
	function (name, problems) {
		return {name: name, problems: problems};
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$String$contains = _String_contains;
var $elm$browser$Debugger$Metadata$hasProblem = F2(
	function (tipe, _v0) {
		var problem = _v0.a;
		var token = _v0.b;
		return A2($elm$core$String$contains, token, tipe) ? $elm$core$Maybe$Just(problem) : $elm$core$Maybe$Nothing;
	});
var $elm$browser$Debugger$Metadata$Decoder = {$: 'Decoder'};
var $elm$browser$Debugger$Metadata$Function = {$: 'Function'};
var $elm$browser$Debugger$Metadata$Process = {$: 'Process'};
var $elm$browser$Debugger$Metadata$Program = {$: 'Program'};
var $elm$browser$Debugger$Metadata$Request = {$: 'Request'};
var $elm$browser$Debugger$Metadata$Socket = {$: 'Socket'};
var $elm$browser$Debugger$Metadata$Task = {$: 'Task'};
var $elm$browser$Debugger$Metadata$VirtualDom = {$: 'VirtualDom'};
var $elm$browser$Debugger$Metadata$problemTable = _List_fromArray(
	[
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Function, '->'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Decoder, 'Json.Decode.Decoder'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Task, 'Task.Task'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Process, 'Process.Id'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Socket, 'WebSocket.LowLevel.WebSocket'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Request, 'Http.Request'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$Program, 'Platform.Program'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$VirtualDom, 'VirtualDom.Node'),
		_Utils_Tuple2($elm$browser$Debugger$Metadata$VirtualDom, 'VirtualDom.Attribute')
	]);
var $elm$browser$Debugger$Metadata$findProblems = function (tipe) {
	return A2(
		$elm$core$List$filterMap,
		$elm$browser$Debugger$Metadata$hasProblem(tipe),
		$elm$browser$Debugger$Metadata$problemTable);
};
var $elm$browser$Debugger$Metadata$collectBadAliases = F3(
	function (name, _v0, list) {
		var tipe = _v0.tipe;
		var _v1 = $elm$browser$Debugger$Metadata$findProblems(tipe);
		if (!_v1.b) {
			return list;
		} else {
			var problems = _v1;
			return A2(
				$elm$core$List$cons,
				A2($elm$browser$Debugger$Metadata$ProblemType, name, problems),
				list);
		}
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $elm$browser$Debugger$Metadata$collectBadUnions = F3(
	function (name, _v0, list) {
		var tags = _v0.tags;
		var _v1 = A2(
			$elm$core$List$concatMap,
			$elm$browser$Debugger$Metadata$findProblems,
			$elm$core$List$concat(
				$elm$core$Dict$values(tags)));
		if (!_v1.b) {
			return list;
		} else {
			var problems = _v1;
			return A2(
				$elm$core$List$cons,
				A2($elm$browser$Debugger$Metadata$ProblemType, name, problems),
				list);
		}
	});
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$browser$Debugger$Metadata$isPortable = function (_v0) {
	var types = _v0.types;
	var badAliases = A3($elm$core$Dict$foldl, $elm$browser$Debugger$Metadata$collectBadAliases, _List_Nil, types.aliases);
	var _v1 = A3($elm$core$Dict$foldl, $elm$browser$Debugger$Metadata$collectBadUnions, badAliases, types.unions);
	if (!_v1.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var problems = _v1;
		return $elm$core$Maybe$Just(
			A2($elm$browser$Debugger$Metadata$Error, types.message, problems));
	}
};
var $elm$browser$Debugger$Metadata$decode = function (value) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $elm$browser$Debugger$Metadata$decoder, value);
	if (_v0.$ === 'Err') {
		return $elm$core$Result$Err(
			A2($elm$browser$Debugger$Metadata$Error, 'The compiler is generating bad metadata. This is a compiler bug!', _List_Nil));
	} else {
		var metadata = _v0.a;
		var _v1 = $elm$browser$Debugger$Metadata$isPortable(metadata);
		if (_v1.$ === 'Nothing') {
			return $elm$core$Result$Ok(metadata);
		} else {
			var error = _v1.a;
			return $elm$core$Result$Err(error);
		}
	}
};
var $elm$browser$Debugger$History$History = F3(
	function (snapshots, recent, numMessages) {
		return {numMessages: numMessages, recent: recent, snapshots: snapshots};
	});
var $elm$browser$Debugger$History$RecentHistory = F3(
	function (model, messages, numMessages) {
		return {messages: messages, model: model, numMessages: numMessages};
	});
var $elm$browser$Debugger$History$empty = function (model) {
	return A3(
		$elm$browser$Debugger$History$History,
		$elm$core$Array$empty,
		A3($elm$browser$Debugger$History$RecentHistory, model, _List_Nil, 0),
		0);
};
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $elm$browser$Debugger$Expando$initHelp = F2(
	function (isOuter, expando) {
		switch (expando.$) {
			case 'S':
				return expando;
			case 'Primitive':
				return expando;
			case 'Sequence':
				var seqType = expando.a;
				var isClosed = expando.b;
				var items = expando.c;
				return isOuter ? A3(
					$elm$browser$Debugger$Expando$Sequence,
					seqType,
					false,
					A2(
						$elm$core$List$map,
						$elm$browser$Debugger$Expando$initHelp(false),
						items)) : (($elm$core$List$length(items) <= 8) ? A3($elm$browser$Debugger$Expando$Sequence, seqType, false, items) : expando);
			case 'Dictionary':
				var isClosed = expando.a;
				var keyValuePairs = expando.b;
				return isOuter ? A2(
					$elm$browser$Debugger$Expando$Dictionary,
					false,
					A2(
						$elm$core$List$map,
						function (_v1) {
							var k = _v1.a;
							var v = _v1.b;
							return _Utils_Tuple2(
								k,
								A2($elm$browser$Debugger$Expando$initHelp, false, v));
						},
						keyValuePairs)) : (($elm$core$List$length(keyValuePairs) <= 8) ? A2($elm$browser$Debugger$Expando$Dictionary, false, keyValuePairs) : expando);
			case 'Record':
				var isClosed = expando.a;
				var entries = expando.b;
				return isOuter ? A2(
					$elm$browser$Debugger$Expando$Record,
					false,
					A2(
						$elm$core$Dict$map,
						F2(
							function (_v2, v) {
								return A2($elm$browser$Debugger$Expando$initHelp, false, v);
							}),
						entries)) : (($elm$core$Dict$size(entries) <= 4) ? A2($elm$browser$Debugger$Expando$Record, false, entries) : expando);
			default:
				var maybeName = expando.a;
				var isClosed = expando.b;
				var args = expando.c;
				return isOuter ? A3(
					$elm$browser$Debugger$Expando$Constructor,
					maybeName,
					false,
					A2(
						$elm$core$List$map,
						$elm$browser$Debugger$Expando$initHelp(false),
						args)) : (($elm$core$List$length(args) <= 4) ? A3($elm$browser$Debugger$Expando$Constructor, maybeName, false, args) : expando);
		}
	});
var $elm$browser$Debugger$Expando$init = function (value) {
	return A2(
		$elm$browser$Debugger$Expando$initHelp,
		true,
		_Debugger_init(value));
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$browser$Debugger$Overlay$None = {$: 'None'};
var $elm$browser$Debugger$Overlay$none = $elm$browser$Debugger$Overlay$None;
var $elm$browser$Debugger$Main$wrapInit = F4(
	function (metadata, popout, init, flags) {
		var _v0 = init(flags);
		var userModel = _v0.a;
		var userCommands = _v0.b;
		return _Utils_Tuple2(
			{
				expandoModel: $elm$browser$Debugger$Expando$init(userModel),
				expandoMsg: $elm$browser$Debugger$Expando$init(_Utils_Tuple0),
				history: $elm$browser$Debugger$History$empty(userModel),
				layout: A3($elm$browser$Debugger$Main$Horizontal, $elm$browser$Debugger$Main$Static, 0.3, 0.5),
				metadata: $elm$browser$Debugger$Metadata$decode(metadata),
				overlay: $elm$browser$Debugger$Overlay$none,
				popout: popout,
				state: $elm$browser$Debugger$Main$Running(userModel)
			},
			A2($elm$core$Platform$Cmd$map, $elm$browser$Debugger$Main$UserMsg, userCommands));
	});
var $elm$browser$Debugger$Main$getLatestModel = function (state) {
	if (state.$ === 'Running') {
		var model = state.a;
		return model;
	} else {
		var model = state.c;
		return model;
	}
};
var $elm$core$Platform$Sub$map = _Platform_map;
var $elm$browser$Debugger$Main$wrapSubs = F2(
	function (subscriptions, model) {
		return A2(
			$elm$core$Platform$Sub$map,
			$elm$browser$Debugger$Main$UserMsg,
			subscriptions(
				$elm$browser$Debugger$Main$getLatestModel(model.state)));
	});
var $elm$browser$Debugger$Main$Moving = {$: 'Moving'};
var $elm$browser$Debugger$Main$Paused = F5(
	function (a, b, c, d, e) {
		return {$: 'Paused', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$browser$Debugger$History$Snapshot = F2(
	function (model, messages) {
		return {messages: messages, model: model};
	});
var $elm$browser$Debugger$History$addRecent = F3(
	function (msg, newModel, _v0) {
		var model = _v0.model;
		var messages = _v0.messages;
		var numMessages = _v0.numMessages;
		return _Utils_eq(numMessages, $elm$browser$Debugger$History$maxSnapshotSize) ? _Utils_Tuple2(
			$elm$core$Maybe$Just(
				A2(
					$elm$browser$Debugger$History$Snapshot,
					model,
					$elm$core$Array$fromList(messages))),
			A3(
				$elm$browser$Debugger$History$RecentHistory,
				newModel,
				_List_fromArray(
					[msg]),
				1)) : _Utils_Tuple2(
			$elm$core$Maybe$Nothing,
			A3(
				$elm$browser$Debugger$History$RecentHistory,
				model,
				A2($elm$core$List$cons, msg, messages),
				numMessages + 1));
	});
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $elm$browser$Debugger$History$add = F3(
	function (msg, model, _v0) {
		var snapshots = _v0.snapshots;
		var recent = _v0.recent;
		var numMessages = _v0.numMessages;
		var _v1 = A3($elm$browser$Debugger$History$addRecent, msg, model, recent);
		if (_v1.a.$ === 'Just') {
			var snapshot = _v1.a.a;
			var newRecent = _v1.b;
			return A3(
				$elm$browser$Debugger$History$History,
				A2($elm$core$Array$push, snapshot, snapshots),
				newRecent,
				numMessages + 1);
		} else {
			var _v2 = _v1.a;
			var newRecent = _v1.b;
			return A3($elm$browser$Debugger$History$History, snapshots, newRecent, numMessages + 1);
		}
	});
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$browser$Debugger$Overlay$BadImport = function (a) {
	return {$: 'BadImport', a: a};
};
var $elm$browser$Debugger$Overlay$RiskyImport = F2(
	function (a, b) {
		return {$: 'RiskyImport', a: a, b: b};
	});
var $elm$browser$Debugger$Report$VersionChanged = F2(
	function (a, b) {
		return {$: 'VersionChanged', a: a, b: b};
	});
var $elm$browser$Debugger$Report$MessageChanged = F2(
	function (a, b) {
		return {$: 'MessageChanged', a: a, b: b};
	});
var $elm$browser$Debugger$Report$SomethingChanged = function (a) {
	return {$: 'SomethingChanged', a: a};
};
var $elm$browser$Debugger$Report$AliasChange = function (a) {
	return {$: 'AliasChange', a: a};
};
var $elm$browser$Debugger$Metadata$checkAlias = F4(
	function (name, old, _new, changes) {
		return (_Utils_eq(old.tipe, _new.tipe) && _Utils_eq(old.args, _new.args)) ? changes : A2(
			$elm$core$List$cons,
			$elm$browser$Debugger$Report$AliasChange(name),
			changes);
	});
var $elm$browser$Debugger$Report$UnionChange = F2(
	function (a, b) {
		return {$: 'UnionChange', a: a, b: b};
	});
var $elm$browser$Debugger$Metadata$addTag = F3(
	function (tag, _v0, changes) {
		return _Utils_update(
			changes,
			{
				added: A2($elm$core$List$cons, tag, changes.added)
			});
	});
var $elm$browser$Debugger$Metadata$checkTag = F4(
	function (tag, old, _new, changes) {
		return _Utils_eq(old, _new) ? changes : _Utils_update(
			changes,
			{
				changed: A2($elm$core$List$cons, tag, changes.changed)
			});
	});
var $elm$browser$Debugger$Report$TagChanges = F4(
	function (removed, changed, added, argsMatch) {
		return {added: added, argsMatch: argsMatch, changed: changed, removed: removed};
	});
var $elm$browser$Debugger$Report$emptyTagChanges = function (argsMatch) {
	return A4($elm$browser$Debugger$Report$TagChanges, _List_Nil, _List_Nil, _List_Nil, argsMatch);
};
var $elm$browser$Debugger$Report$hasTagChanges = function (tagChanges) {
	return _Utils_eq(
		tagChanges,
		A4($elm$browser$Debugger$Report$TagChanges, _List_Nil, _List_Nil, _List_Nil, true));
};
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Debugger$Metadata$removeTag = F3(
	function (tag, _v0, changes) {
		return _Utils_update(
			changes,
			{
				removed: A2($elm$core$List$cons, tag, changes.removed)
			});
	});
var $elm$browser$Debugger$Metadata$checkUnion = F4(
	function (name, old, _new, changes) {
		var tagChanges = A6(
			$elm$core$Dict$merge,
			$elm$browser$Debugger$Metadata$removeTag,
			$elm$browser$Debugger$Metadata$checkTag,
			$elm$browser$Debugger$Metadata$addTag,
			old.tags,
			_new.tags,
			$elm$browser$Debugger$Report$emptyTagChanges(
				_Utils_eq(old.args, _new.args)));
		return $elm$browser$Debugger$Report$hasTagChanges(tagChanges) ? changes : A2(
			$elm$core$List$cons,
			A2($elm$browser$Debugger$Report$UnionChange, name, tagChanges),
			changes);
	});
var $elm$browser$Debugger$Metadata$ignore = F3(
	function (key, value, report) {
		return report;
	});
var $elm$browser$Debugger$Metadata$checkTypes = F2(
	function (old, _new) {
		return (!_Utils_eq(old.message, _new.message)) ? A2($elm$browser$Debugger$Report$MessageChanged, old.message, _new.message) : $elm$browser$Debugger$Report$SomethingChanged(
			A6(
				$elm$core$Dict$merge,
				$elm$browser$Debugger$Metadata$ignore,
				$elm$browser$Debugger$Metadata$checkUnion,
				$elm$browser$Debugger$Metadata$ignore,
				old.unions,
				_new.unions,
				A6($elm$core$Dict$merge, $elm$browser$Debugger$Metadata$ignore, $elm$browser$Debugger$Metadata$checkAlias, $elm$browser$Debugger$Metadata$ignore, old.aliases, _new.aliases, _List_Nil)));
	});
var $elm$browser$Debugger$Metadata$check = F2(
	function (old, _new) {
		return (!_Utils_eq(old.versions.elm, _new.versions.elm)) ? A2($elm$browser$Debugger$Report$VersionChanged, old.versions.elm, _new.versions.elm) : A2($elm$browser$Debugger$Metadata$checkTypes, old.types, _new.types);
	});
var $elm$browser$Debugger$Report$CorruptHistory = {$: 'CorruptHistory'};
var $elm$browser$Debugger$Overlay$corruptImport = $elm$browser$Debugger$Overlay$BadImport($elm$browser$Debugger$Report$CorruptHistory);
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$browser$Debugger$Report$Fine = {$: 'Fine'};
var $elm$browser$Debugger$Report$Impossible = {$: 'Impossible'};
var $elm$browser$Debugger$Report$Risky = {$: 'Risky'};
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$browser$Debugger$Report$some = function (list) {
	return !$elm$core$List$isEmpty(list);
};
var $elm$browser$Debugger$Report$evaluateChange = function (change) {
	if (change.$ === 'AliasChange') {
		return $elm$browser$Debugger$Report$Impossible;
	} else {
		var removed = change.b.removed;
		var changed = change.b.changed;
		var added = change.b.added;
		var argsMatch = change.b.argsMatch;
		return ((!argsMatch) || ($elm$browser$Debugger$Report$some(changed) || $elm$browser$Debugger$Report$some(removed))) ? $elm$browser$Debugger$Report$Impossible : ($elm$browser$Debugger$Report$some(added) ? $elm$browser$Debugger$Report$Risky : $elm$browser$Debugger$Report$Fine);
	}
};
var $elm$browser$Debugger$Report$worstCase = F2(
	function (status, statusList) {
		worstCase:
		while (true) {
			if (!statusList.b) {
				return status;
			} else {
				switch (statusList.a.$) {
					case 'Impossible':
						var _v1 = statusList.a;
						return $elm$browser$Debugger$Report$Impossible;
					case 'Risky':
						var _v2 = statusList.a;
						var rest = statusList.b;
						var $temp$status = $elm$browser$Debugger$Report$Risky,
							$temp$statusList = rest;
						status = $temp$status;
						statusList = $temp$statusList;
						continue worstCase;
					default:
						var _v3 = statusList.a;
						var rest = statusList.b;
						var $temp$status = status,
							$temp$statusList = rest;
						status = $temp$status;
						statusList = $temp$statusList;
						continue worstCase;
				}
			}
		}
	});
var $elm$browser$Debugger$Report$evaluate = function (report) {
	switch (report.$) {
		case 'CorruptHistory':
			return $elm$browser$Debugger$Report$Impossible;
		case 'VersionChanged':
			return $elm$browser$Debugger$Report$Impossible;
		case 'MessageChanged':
			return $elm$browser$Debugger$Report$Impossible;
		default:
			var changes = report.a;
			return A2(
				$elm$browser$Debugger$Report$worstCase,
				$elm$browser$Debugger$Report$Fine,
				A2($elm$core$List$map, $elm$browser$Debugger$Report$evaluateChange, changes));
	}
};
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $elm$browser$Debugger$Overlay$uploadDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (x, y) {
			return _Utils_Tuple2(x, y);
		}),
	A2($elm$json$Json$Decode$field, 'metadata', $elm$browser$Debugger$Metadata$decoder),
	A2($elm$json$Json$Decode$field, 'history', $elm$json$Json$Decode$value));
var $elm$browser$Debugger$Overlay$assessImport = F2(
	function (metadata, jsonString) {
		var _v0 = A2($elm$json$Json$Decode$decodeString, $elm$browser$Debugger$Overlay$uploadDecoder, jsonString);
		if (_v0.$ === 'Err') {
			return $elm$core$Result$Err($elm$browser$Debugger$Overlay$corruptImport);
		} else {
			var _v1 = _v0.a;
			var foreignMetadata = _v1.a;
			var rawHistory = _v1.b;
			var report = A2($elm$browser$Debugger$Metadata$check, foreignMetadata, metadata);
			var _v2 = $elm$browser$Debugger$Report$evaluate(report);
			switch (_v2.$) {
				case 'Impossible':
					return $elm$core$Result$Err(
						$elm$browser$Debugger$Overlay$BadImport(report));
				case 'Risky':
					return $elm$core$Result$Err(
						A2($elm$browser$Debugger$Overlay$RiskyImport, report, rawHistory));
				default:
					return $elm$core$Result$Ok(rawHistory);
			}
		}
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$browser$Debugger$Overlay$close = F2(
	function (msg, state) {
		switch (state.$) {
			case 'None':
				return $elm$core$Maybe$Nothing;
			case 'BadMetadata':
				return $elm$core$Maybe$Nothing;
			case 'BadImport':
				return $elm$core$Maybe$Nothing;
			default:
				var rawHistory = state.b;
				if (msg.$ === 'Cancel') {
					return $elm$core$Maybe$Nothing;
				} else {
					return $elm$core$Maybe$Just(rawHistory);
				}
		}
	});
var $elm$browser$Debugger$History$elmToJs = A2($elm$core$Basics$composeR, _Json_wrap, _Debugger_unsafeCoerce);
var $elm$browser$Debugger$History$encodeHelp = F2(
	function (snapshot, allMessages) {
		return A3($elm$core$Array$foldl, $elm$core$List$cons, allMessages, snapshot.messages);
	});
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$browser$Debugger$History$encode = function (_v0) {
	var snapshots = _v0.snapshots;
	var recent = _v0.recent;
	return A2(
		$elm$json$Json$Encode$list,
		$elm$browser$Debugger$History$elmToJs,
		A3(
			$elm$core$Array$foldr,
			$elm$browser$Debugger$History$encodeHelp,
			$elm$core$List$reverse(recent.messages),
			snapshots));
};
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$browser$Debugger$Metadata$encodeAlias = function (_v0) {
	var args = _v0.args;
	var tipe = _v0.tipe;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'args',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, args)),
				_Utils_Tuple2(
				'type',
				$elm$json$Json$Encode$string(tipe))
			]));
};
var $elm$browser$Debugger$Metadata$encodeDict = F2(
	function (f, dict) {
		return $elm$json$Json$Encode$object(
			$elm$core$Dict$toList(
				A2(
					$elm$core$Dict$map,
					F2(
						function (key, value) {
							return f(value);
						}),
					dict)));
	});
var $elm$browser$Debugger$Metadata$encodeUnion = function (_v0) {
	var args = _v0.args;
	var tags = _v0.tags;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'args',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, args)),
				_Utils_Tuple2(
				'tags',
				A2(
					$elm$browser$Debugger$Metadata$encodeDict,
					$elm$json$Json$Encode$list($elm$json$Json$Encode$string),
					tags))
			]));
};
var $elm$browser$Debugger$Metadata$encodeTypes = function (_v0) {
	var message = _v0.message;
	var unions = _v0.unions;
	var aliases = _v0.aliases;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'message',
				$elm$json$Json$Encode$string(message)),
				_Utils_Tuple2(
				'aliases',
				A2($elm$browser$Debugger$Metadata$encodeDict, $elm$browser$Debugger$Metadata$encodeAlias, aliases)),
				_Utils_Tuple2(
				'unions',
				A2($elm$browser$Debugger$Metadata$encodeDict, $elm$browser$Debugger$Metadata$encodeUnion, unions))
			]));
};
var $elm$browser$Debugger$Metadata$encodeVersions = function (_v0) {
	var elm = _v0.elm;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'elm',
				$elm$json$Json$Encode$string(elm))
			]));
};
var $elm$browser$Debugger$Metadata$encode = function (_v0) {
	var versions = _v0.versions;
	var types = _v0.types;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'versions',
				$elm$browser$Debugger$Metadata$encodeVersions(versions)),
				_Utils_Tuple2(
				'types',
				$elm$browser$Debugger$Metadata$encodeTypes(types))
			]));
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Debugger$Main$download = F2(
	function (metadata, history) {
		var historyLength = $elm$browser$Debugger$History$size(history);
		return A2(
			$elm$core$Task$perform,
			function (_v0) {
				return $elm$browser$Debugger$Main$NoOp;
			},
			A2(
				_Debugger_download,
				historyLength,
				_Json_unwrap(
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'metadata',
								$elm$browser$Debugger$Metadata$encode(metadata)),
								_Utils_Tuple2(
								'history',
								$elm$browser$Debugger$History$encode(history))
							])))));
	});
var $elm$browser$Debugger$Main$Vertical = F3(
	function (a, b, c) {
		return {$: 'Vertical', a: a, b: b, c: c};
	});
var $elm$browser$Debugger$Main$drag = F2(
	function (info, layout) {
		if (layout.$ === 'Horizontal') {
			var status = layout.a;
			var y = layout.c;
			return A3($elm$browser$Debugger$Main$Horizontal, status, info.x / info.width, y);
		} else {
			var status = layout.a;
			var x = layout.b;
			return A3($elm$browser$Debugger$Main$Vertical, status, x, info.y / info.height);
		}
	});
var $elm$browser$Debugger$History$Stepping = F2(
	function (a, b) {
		return {$: 'Stepping', a: a, b: b};
	});
var $elm$browser$Debugger$History$Done = F2(
	function (a, b) {
		return {$: 'Done', a: a, b: b};
	});
var $elm$browser$Debugger$History$getHelp = F3(
	function (update, msg, getResult) {
		if (getResult.$ === 'Done') {
			return getResult;
		} else {
			var n = getResult.a;
			var model = getResult.b;
			return (!n) ? A2(
				$elm$browser$Debugger$History$Done,
				msg,
				A2(update, msg, model).a) : A2(
				$elm$browser$Debugger$History$Stepping,
				n - 1,
				A2(update, msg, model).a);
		}
	});
var $elm$browser$Debugger$History$undone = function (getResult) {
	undone:
	while (true) {
		if (getResult.$ === 'Done') {
			var msg = getResult.a;
			var model = getResult.b;
			return _Utils_Tuple2(model, msg);
		} else {
			var $temp$getResult = getResult;
			getResult = $temp$getResult;
			continue undone;
		}
	}
};
var $elm$browser$Debugger$History$get = F3(
	function (update, index, history) {
		get:
		while (true) {
			var recent = history.recent;
			var snapshotMax = history.numMessages - recent.numMessages;
			if (_Utils_cmp(index, snapshotMax) > -1) {
				return $elm$browser$Debugger$History$undone(
					A3(
						$elm$core$List$foldr,
						$elm$browser$Debugger$History$getHelp(update),
						A2($elm$browser$Debugger$History$Stepping, index - snapshotMax, recent.model),
						recent.messages));
			} else {
				var _v0 = A2($elm$core$Array$get, (index / $elm$browser$Debugger$History$maxSnapshotSize) | 0, history.snapshots);
				if (_v0.$ === 'Nothing') {
					var $temp$update = update,
						$temp$index = index,
						$temp$history = history;
					update = $temp$update;
					index = $temp$index;
					history = $temp$history;
					continue get;
				} else {
					var model = _v0.a.model;
					var messages = _v0.a.messages;
					return $elm$browser$Debugger$History$undone(
						A3(
							$elm$core$Array$foldr,
							$elm$browser$Debugger$History$getHelp(update),
							A2($elm$browser$Debugger$History$Stepping, index % $elm$browser$Debugger$History$maxSnapshotSize, model),
							messages));
				}
			}
		}
	});
var $elm$browser$Debugger$History$getRecentMsg = function (history) {
	getRecentMsg:
	while (true) {
		var _v0 = history.recent.messages;
		if (!_v0.b) {
			var $temp$history = history;
			history = $temp$history;
			continue getRecentMsg;
		} else {
			var first = _v0.a;
			return first;
		}
	}
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$browser$Debugger$Expando$mergeDictHelp = F3(
	function (oldDict, key, value) {
		var _v12 = A2($elm$core$Dict$get, key, oldDict);
		if (_v12.$ === 'Nothing') {
			return value;
		} else {
			var oldValue = _v12.a;
			return A2($elm$browser$Debugger$Expando$mergeHelp, oldValue, value);
		}
	});
var $elm$browser$Debugger$Expando$mergeHelp = F2(
	function (old, _new) {
		var _v3 = _Utils_Tuple2(old, _new);
		_v3$6:
		while (true) {
			switch (_v3.b.$) {
				case 'S':
					return _new;
				case 'Primitive':
					return _new;
				case 'Sequence':
					if (_v3.a.$ === 'Sequence') {
						var _v4 = _v3.a;
						var isClosed = _v4.b;
						var oldValues = _v4.c;
						var _v5 = _v3.b;
						var seqType = _v5.a;
						var newValues = _v5.c;
						return A3(
							$elm$browser$Debugger$Expando$Sequence,
							seqType,
							isClosed,
							A2($elm$browser$Debugger$Expando$mergeListHelp, oldValues, newValues));
					} else {
						break _v3$6;
					}
				case 'Dictionary':
					if (_v3.a.$ === 'Dictionary') {
						var _v6 = _v3.a;
						var isClosed = _v6.a;
						var _v7 = _v3.b;
						var keyValuePairs = _v7.b;
						return A2($elm$browser$Debugger$Expando$Dictionary, isClosed, keyValuePairs);
					} else {
						break _v3$6;
					}
				case 'Record':
					if (_v3.a.$ === 'Record') {
						var _v8 = _v3.a;
						var isClosed = _v8.a;
						var oldDict = _v8.b;
						var _v9 = _v3.b;
						var newDict = _v9.b;
						return A2(
							$elm$browser$Debugger$Expando$Record,
							isClosed,
							A2(
								$elm$core$Dict$map,
								$elm$browser$Debugger$Expando$mergeDictHelp(oldDict),
								newDict));
					} else {
						break _v3$6;
					}
				default:
					if (_v3.a.$ === 'Constructor') {
						var _v10 = _v3.a;
						var isClosed = _v10.b;
						var oldValues = _v10.c;
						var _v11 = _v3.b;
						var maybeName = _v11.a;
						var newValues = _v11.c;
						return A3(
							$elm$browser$Debugger$Expando$Constructor,
							maybeName,
							isClosed,
							A2($elm$browser$Debugger$Expando$mergeListHelp, oldValues, newValues));
					} else {
						break _v3$6;
					}
			}
		}
		return _new;
	});
var $elm$browser$Debugger$Expando$mergeListHelp = F2(
	function (olds, news) {
		var _v0 = _Utils_Tuple2(olds, news);
		if (!_v0.a.b) {
			return news;
		} else {
			if (!_v0.b.b) {
				return news;
			} else {
				var _v1 = _v0.a;
				var x = _v1.a;
				var xs = _v1.b;
				var _v2 = _v0.b;
				var y = _v2.a;
				var ys = _v2.b;
				return A2(
					$elm$core$List$cons,
					A2($elm$browser$Debugger$Expando$mergeHelp, x, y),
					A2($elm$browser$Debugger$Expando$mergeListHelp, xs, ys));
			}
		}
	});
var $elm$browser$Debugger$Expando$merge = F2(
	function (value, expando) {
		return A2(
			$elm$browser$Debugger$Expando$mergeHelp,
			expando,
			_Debugger_init(value));
	});
var $elm$browser$Debugger$Main$jumpUpdate = F3(
	function (update, index, model) {
		var history = $elm$browser$Debugger$Main$cachedHistory(model);
		var currentMsg = $elm$browser$Debugger$History$getRecentMsg(history);
		var currentModel = $elm$browser$Debugger$Main$getLatestModel(model.state);
		var _v0 = A3($elm$browser$Debugger$History$get, update, index, history);
		var indexModel = _v0.a;
		var indexMsg = _v0.b;
		return _Utils_update(
			model,
			{
				expandoModel: A2($elm$browser$Debugger$Expando$merge, indexModel, model.expandoModel),
				expandoMsg: A2($elm$browser$Debugger$Expando$merge, indexMsg, model.expandoMsg),
				state: A5($elm$browser$Debugger$Main$Paused, index, indexModel, currentModel, currentMsg, history)
			});
	});
var $elm$browser$Debugger$History$jsToElm = A2($elm$core$Basics$composeR, _Json_unwrap, _Debugger_unsafeCoerce);
var $elm$browser$Debugger$History$decoder = F2(
	function (initialModel, update) {
		var addMessage = F2(
			function (rawMsg, _v0) {
				var model = _v0.a;
				var history = _v0.b;
				var msg = $elm$browser$Debugger$History$jsToElm(rawMsg);
				return _Utils_Tuple2(
					A2(update, msg, model),
					A3($elm$browser$Debugger$History$add, msg, model, history));
			});
		var updateModel = function (rawMsgs) {
			return A3(
				$elm$core$List$foldl,
				addMessage,
				_Utils_Tuple2(
					initialModel,
					$elm$browser$Debugger$History$empty(initialModel)),
				rawMsgs);
		};
		return A2(
			$elm$json$Json$Decode$map,
			updateModel,
			$elm$json$Json$Decode$list($elm$json$Json$Decode$value));
	});
var $elm$browser$Debugger$History$getInitialModel = function (_v0) {
	var snapshots = _v0.snapshots;
	var recent = _v0.recent;
	var _v1 = A2($elm$core$Array$get, 0, snapshots);
	if (_v1.$ === 'Just') {
		var model = _v1.a.model;
		return model;
	} else {
		return recent.model;
	}
};
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$browser$Debugger$Main$loadNewHistory = F3(
	function (rawHistory, update, model) {
		var pureUserUpdate = F2(
			function (msg, userModel) {
				return A2(update, msg, userModel).a;
			});
		var initialUserModel = $elm$browser$Debugger$History$getInitialModel(model.history);
		var decoder = A2($elm$browser$Debugger$History$decoder, initialUserModel, pureUserUpdate);
		var _v0 = A2($elm$json$Json$Decode$decodeValue, decoder, rawHistory);
		if (_v0.$ === 'Err') {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{overlay: $elm$browser$Debugger$Overlay$corruptImport}),
				$elm$core$Platform$Cmd$none);
		} else {
			var _v1 = _v0.a;
			var latestUserModel = _v1.a;
			var newHistory = _v1.b;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						expandoModel: $elm$browser$Debugger$Expando$init(latestUserModel),
						expandoMsg: $elm$browser$Debugger$Expando$init(
							$elm$browser$Debugger$History$getRecentMsg(newHistory)),
						history: newHistory,
						overlay: $elm$browser$Debugger$Overlay$none,
						state: $elm$browser$Debugger$Main$Running(latestUserModel)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $elm$browser$Debugger$Main$scroll = function (popout) {
	return A2(
		$elm$core$Task$perform,
		$elm$core$Basics$always($elm$browser$Debugger$Main$NoOp),
		_Debugger_scroll(popout));
};
var $elm$browser$Debugger$Main$scrollTo = F2(
	function (id, popout) {
		return A2(
			$elm$core$Task$perform,
			$elm$core$Basics$always($elm$browser$Debugger$Main$NoOp),
			A2(_Debugger_scrollTo, id, popout));
	});
var $elm$browser$Debugger$Main$setDragStatus = F2(
	function (status, layout) {
		if (layout.$ === 'Horizontal') {
			var x = layout.b;
			var y = layout.c;
			return A3($elm$browser$Debugger$Main$Horizontal, status, x, y);
		} else {
			var x = layout.b;
			var y = layout.c;
			return A3($elm$browser$Debugger$Main$Vertical, status, x, y);
		}
	});
var $elm$browser$Debugger$Main$swapLayout = function (layout) {
	if (layout.$ === 'Horizontal') {
		var s = layout.a;
		var x = layout.b;
		var y = layout.c;
		return A3($elm$browser$Debugger$Main$Vertical, s, x, y);
	} else {
		var s = layout.a;
		var x = layout.b;
		var y = layout.c;
		return A3($elm$browser$Debugger$Main$Horizontal, s, x, y);
	}
};
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$browser$Debugger$Expando$updateIndex = F3(
	function (n, func, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			var x = list.a;
			var xs = list.b;
			return (n <= 0) ? A2(
				$elm$core$List$cons,
				func(x),
				xs) : A2(
				$elm$core$List$cons,
				x,
				A3($elm$browser$Debugger$Expando$updateIndex, n - 1, func, xs));
		}
	});
var $elm$browser$Debugger$Expando$update = F2(
	function (msg, value) {
		switch (value.$) {
			case 'S':
				return value;
			case 'Primitive':
				return value;
			case 'Sequence':
				var seqType = value.a;
				var isClosed = value.b;
				var valueList = value.c;
				switch (msg.$) {
					case 'Toggle':
						return A3($elm$browser$Debugger$Expando$Sequence, seqType, !isClosed, valueList);
					case 'Index':
						if (msg.a.$ === 'None') {
							var _v3 = msg.a;
							var index = msg.b;
							var subMsg = msg.c;
							return A3(
								$elm$browser$Debugger$Expando$Sequence,
								seqType,
								isClosed,
								A3(
									$elm$browser$Debugger$Expando$updateIndex,
									index,
									$elm$browser$Debugger$Expando$update(subMsg),
									valueList));
						} else {
							return value;
						}
					default:
						return value;
				}
			case 'Dictionary':
				var isClosed = value.a;
				var keyValuePairs = value.b;
				switch (msg.$) {
					case 'Toggle':
						return A2($elm$browser$Debugger$Expando$Dictionary, !isClosed, keyValuePairs);
					case 'Index':
						var redirect = msg.a;
						var index = msg.b;
						var subMsg = msg.c;
						switch (redirect.$) {
							case 'None':
								return value;
							case 'Key':
								return A2(
									$elm$browser$Debugger$Expando$Dictionary,
									isClosed,
									A3(
										$elm$browser$Debugger$Expando$updateIndex,
										index,
										function (_v6) {
											var k = _v6.a;
											var v = _v6.b;
											return _Utils_Tuple2(
												A2($elm$browser$Debugger$Expando$update, subMsg, k),
												v);
										},
										keyValuePairs));
							default:
								return A2(
									$elm$browser$Debugger$Expando$Dictionary,
									isClosed,
									A3(
										$elm$browser$Debugger$Expando$updateIndex,
										index,
										function (_v7) {
											var k = _v7.a;
											var v = _v7.b;
											return _Utils_Tuple2(
												k,
												A2($elm$browser$Debugger$Expando$update, subMsg, v));
										},
										keyValuePairs));
						}
					default:
						return value;
				}
			case 'Record':
				var isClosed = value.a;
				var valueDict = value.b;
				switch (msg.$) {
					case 'Toggle':
						return A2($elm$browser$Debugger$Expando$Record, !isClosed, valueDict);
					case 'Index':
						return value;
					default:
						var field = msg.a;
						var subMsg = msg.b;
						return A2(
							$elm$browser$Debugger$Expando$Record,
							isClosed,
							A3(
								$elm$core$Dict$update,
								field,
								$elm$browser$Debugger$Expando$updateField(subMsg),
								valueDict));
				}
			default:
				var maybeName = value.a;
				var isClosed = value.b;
				var valueList = value.c;
				switch (msg.$) {
					case 'Toggle':
						return A3($elm$browser$Debugger$Expando$Constructor, maybeName, !isClosed, valueList);
					case 'Index':
						if (msg.a.$ === 'None') {
							var _v10 = msg.a;
							var index = msg.b;
							var subMsg = msg.c;
							return A3(
								$elm$browser$Debugger$Expando$Constructor,
								maybeName,
								isClosed,
								A3(
									$elm$browser$Debugger$Expando$updateIndex,
									index,
									$elm$browser$Debugger$Expando$update(subMsg),
									valueList));
						} else {
							return value;
						}
					default:
						return value;
				}
		}
	});
var $elm$browser$Debugger$Expando$updateField = F2(
	function (msg, maybeExpando) {
		if (maybeExpando.$ === 'Nothing') {
			return maybeExpando;
		} else {
			var expando = maybeExpando.a;
			return $elm$core$Maybe$Just(
				A2($elm$browser$Debugger$Expando$update, msg, expando));
		}
	});
var $elm$browser$Debugger$Main$Upload = function (a) {
	return {$: 'Upload', a: a};
};
var $elm$browser$Debugger$Main$upload = function (popout) {
	return A2(
		$elm$core$Task$perform,
		$elm$browser$Debugger$Main$Upload,
		_Debugger_upload(popout));
};
var $elm$browser$Debugger$Overlay$BadMetadata = function (a) {
	return {$: 'BadMetadata', a: a};
};
var $elm$browser$Debugger$Overlay$badMetadata = $elm$browser$Debugger$Overlay$BadMetadata;
var $elm$browser$Debugger$Main$withGoodMetadata = F2(
	function (model, func) {
		var _v0 = model.metadata;
		if (_v0.$ === 'Ok') {
			var metadata = _v0.a;
			return func(metadata);
		} else {
			var error = _v0.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						overlay: $elm$browser$Debugger$Overlay$badMetadata(error)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $elm$browser$Debugger$Main$wrapUpdate = F3(
	function (update, msg, model) {
		wrapUpdate:
		while (true) {
			switch (msg.$) {
				case 'NoOp':
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 'UserMsg':
					var userMsg = msg.a;
					var userModel = $elm$browser$Debugger$Main$getLatestModel(model.state);
					var newHistory = A3($elm$browser$Debugger$History$add, userMsg, userModel, model.history);
					var _v1 = A2(update, userMsg, userModel);
					var newUserModel = _v1.a;
					var userCmds = _v1.b;
					var commands = A2($elm$core$Platform$Cmd$map, $elm$browser$Debugger$Main$UserMsg, userCmds);
					var _v2 = model.state;
					if (_v2.$ === 'Running') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									expandoModel: A2($elm$browser$Debugger$Expando$merge, newUserModel, model.expandoModel),
									expandoMsg: A2($elm$browser$Debugger$Expando$merge, userMsg, model.expandoMsg),
									history: newHistory,
									state: $elm$browser$Debugger$Main$Running(newUserModel)
								}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										commands,
										$elm$browser$Debugger$Main$scroll(model.popout)
									])));
					} else {
						var index = _v2.a;
						var indexModel = _v2.b;
						var history = _v2.e;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									history: newHistory,
									state: A5($elm$browser$Debugger$Main$Paused, index, indexModel, newUserModel, userMsg, history)
								}),
							commands);
					}
				case 'TweakExpandoMsg':
					var eMsg = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								expandoMsg: A2($elm$browser$Debugger$Expando$update, eMsg, model.expandoMsg)
							}),
						$elm$core$Platform$Cmd$none);
				case 'TweakExpandoModel':
					var eMsg = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								expandoModel: A2($elm$browser$Debugger$Expando$update, eMsg, model.expandoModel)
							}),
						$elm$core$Platform$Cmd$none);
				case 'Resume':
					var _v3 = model.state;
					if (_v3.$ === 'Running') {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var userModel = _v3.c;
						var userMsg = _v3.d;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									expandoModel: A2($elm$browser$Debugger$Expando$merge, userModel, model.expandoModel),
									expandoMsg: A2($elm$browser$Debugger$Expando$merge, userMsg, model.expandoMsg),
									state: $elm$browser$Debugger$Main$Running(userModel)
								}),
							$elm$browser$Debugger$Main$scroll(model.popout));
					}
				case 'Jump':
					var index = msg.a;
					return _Utils_Tuple2(
						A3($elm$browser$Debugger$Main$jumpUpdate, update, index, model),
						$elm$core$Platform$Cmd$none);
				case 'SliderJump':
					var index = msg.a;
					return _Utils_Tuple2(
						A3($elm$browser$Debugger$Main$jumpUpdate, update, index, model),
						A2(
							$elm$browser$Debugger$Main$scrollTo,
							$elm$browser$Debugger$History$idForMessageIndex(index),
							model.popout));
				case 'Open':
					return _Utils_Tuple2(
						model,
						A2(
							$elm$core$Task$perform,
							$elm$core$Basics$always($elm$browser$Debugger$Main$NoOp),
							_Debugger_open(model.popout)));
				case 'Up':
					var _v4 = model.state;
					if (_v4.$ === 'Running') {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var i = _v4.a;
						var history = _v4.e;
						var targetIndex = i + 1;
						if (_Utils_cmp(
							targetIndex,
							$elm$browser$Debugger$History$size(history)) < 0) {
							var $temp$update = update,
								$temp$msg = $elm$browser$Debugger$Main$SliderJump(targetIndex),
								$temp$model = model;
							update = $temp$update;
							msg = $temp$msg;
							model = $temp$model;
							continue wrapUpdate;
						} else {
							var $temp$update = update,
								$temp$msg = $elm$browser$Debugger$Main$Resume,
								$temp$model = model;
							update = $temp$update;
							msg = $temp$msg;
							model = $temp$model;
							continue wrapUpdate;
						}
					}
				case 'Down':
					var _v5 = model.state;
					if (_v5.$ === 'Running') {
						var $temp$update = update,
							$temp$msg = $elm$browser$Debugger$Main$Jump(
							$elm$browser$Debugger$History$size(model.history) - 1),
							$temp$model = model;
						update = $temp$update;
						msg = $temp$msg;
						model = $temp$model;
						continue wrapUpdate;
					} else {
						var index = _v5.a;
						if (index > 0) {
							var $temp$update = update,
								$temp$msg = $elm$browser$Debugger$Main$SliderJump(index - 1),
								$temp$model = model;
							update = $temp$update;
							msg = $temp$msg;
							model = $temp$model;
							continue wrapUpdate;
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					}
				case 'Import':
					return A2(
						$elm$browser$Debugger$Main$withGoodMetadata,
						model,
						function (_v6) {
							return _Utils_Tuple2(
								model,
								$elm$browser$Debugger$Main$upload(model.popout));
						});
				case 'Export':
					return A2(
						$elm$browser$Debugger$Main$withGoodMetadata,
						model,
						function (metadata) {
							return _Utils_Tuple2(
								model,
								A2($elm$browser$Debugger$Main$download, metadata, model.history));
						});
				case 'Upload':
					var jsonString = msg.a;
					return A2(
						$elm$browser$Debugger$Main$withGoodMetadata,
						model,
						function (metadata) {
							var _v7 = A2($elm$browser$Debugger$Overlay$assessImport, metadata, jsonString);
							if (_v7.$ === 'Err') {
								var newOverlay = _v7.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{overlay: newOverlay}),
									$elm$core$Platform$Cmd$none);
							} else {
								var rawHistory = _v7.a;
								return A3($elm$browser$Debugger$Main$loadNewHistory, rawHistory, update, model);
							}
						});
				case 'OverlayMsg':
					var overlayMsg = msg.a;
					var _v8 = A2($elm$browser$Debugger$Overlay$close, overlayMsg, model.overlay);
					if (_v8.$ === 'Nothing') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{overlay: $elm$browser$Debugger$Overlay$none}),
							$elm$core$Platform$Cmd$none);
					} else {
						var rawHistory = _v8.a;
						return A3($elm$browser$Debugger$Main$loadNewHistory, rawHistory, update, model);
					}
				case 'SwapLayout':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								layout: $elm$browser$Debugger$Main$swapLayout(model.layout)
							}),
						$elm$core$Platform$Cmd$none);
				case 'DragStart':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								layout: A2($elm$browser$Debugger$Main$setDragStatus, $elm$browser$Debugger$Main$Moving, model.layout)
							}),
						$elm$core$Platform$Cmd$none);
				case 'Drag':
					var info = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								layout: A2($elm$browser$Debugger$Main$drag, info, model.layout)
							}),
						$elm$core$Platform$Cmd$none);
				default:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								layout: A2($elm$browser$Debugger$Main$setDragStatus, $elm$browser$Debugger$Main$Static, model.layout)
							}),
						$elm$core$Platform$Cmd$none);
			}
		}
	});
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Main$Model = F4(
	function (url, key, shared, page) {
		return {key: key, page: page, shared: shared, url: url};
	});
var $author$project$Main$Page = function (a) {
	return {$: 'Page', a: a};
};
var $author$project$Main$Shared = function (a) {
	return {$: 'Shared', a: a};
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $elm$core$Tuple$mapBoth = F3(
	function (funcA, funcB, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			funcA(x),
			funcB(y));
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $ryan_haskell$elm_spa$ElmSpa$Request$query = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Dict$empty;
	} else {
		var decode = function (val) {
			return A2(
				$elm$core$Maybe$withDefault,
				val,
				$elm$url$Url$percentDecode(val));
		};
		return $elm$core$Dict$fromList(
			A2(
				$elm$core$List$map,
				A2($elm$core$Tuple$mapBoth, decode, decode),
				A2(
					$elm$core$List$filterMap,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$String$split('='),
						function (eq) {
							return A3(
								$elm$core$Maybe$map2,
								$elm$core$Tuple$pair,
								$elm$core$List$head(eq),
								$elm$core$Maybe$Just(
									A2(
										$elm$core$Maybe$withDefault,
										'',
										$elm$core$List$head(
											A2($elm$core$List$drop, 1, eq)))));
						}),
					A2($elm$core$String$split, '&', str))));
	}
};
var $ryan_haskell$elm_spa$ElmSpa$Request$create = F4(
	function (route, params, url, key) {
		return {
			key: key,
			params: params,
			query: A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Dict$empty,
				A2($elm$core$Maybe$map, $ryan_haskell$elm_spa$ElmSpa$Request$query, url.query)),
			route: route,
			url: url
		};
	});
var $author$project$Gen$Route$NotFound = {$: 'NotFound'};
var $elm$url$Url$Parser$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return $elm$url$Url$Parser$Parser(
		function (state) {
			return A2(
				$elm$core$List$concatMap,
				function (_v0) {
					var parser = _v0.a;
					return parser(state);
				},
				parsers);
		});
};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {frag: frag, params: params, unvisited: unvisited, value: value, visited: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.unvisited;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.value);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.value);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 'Nothing') {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 'Nothing') {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 'Nothing') {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 'Nothing') {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0.a;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.path),
					$elm$url$Url$Parser$prepareQuery(url.query),
					url.fragment,
					$elm$core$Basics$identity)));
	});
var $author$project$Gen$Route$About = {$: 'About'};
var $author$project$Gen$Route$Admin = {$: 'Admin'};
var $author$project$Gen$Route$Admin__Update__Id_ = function (a) {
	return {$: 'Admin__Update__Id_', a: a};
};
var $author$project$Gen$Route$Contact = {$: 'Contact'};
var $author$project$Gen$Route$Dashboard = {$: 'Dashboard'};
var $author$project$Gen$Route$ForgotPassword = {$: 'ForgotPassword'};
var $author$project$Gen$Route$ForgotPassword__Username_ = function (a) {
	return {$: 'ForgotPassword__Username_', a: a};
};
var $author$project$Gen$Route$Home_ = {$: 'Home_'};
var $author$project$Gen$Route$Knowledgebase = {$: 'Knowledgebase'};
var $author$project$Gen$Route$Login = {$: 'Login'};
var $author$project$Gen$Route$Logout = {$: 'Logout'};
var $author$project$Gen$Route$Order = {$: 'Order'};
var $author$project$Gen$Route$Privacy = {$: 'Privacy'};
var $author$project$Gen$Route$Signup = {$: 'Signup'};
var $author$project$Gen$Route$Subscription = {$: 'Subscription'};
var $author$project$Gen$Route$Success__Id_ = function (a) {
	return {$: 'Success__Id_', a: a};
};
var $author$project$Gen$Route$Terms = {$: 'Terms'};
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.visited;
		var unvisited = _v0.unvisited;
		var params = _v0.params;
		var frag = _v0.frag;
		var value = _v0.value;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0.a;
		return $elm$url$Url$Parser$Parser(
			function (_v1) {
				var visited = _v1.visited;
				var unvisited = _v1.unvisited;
				var params = _v1.params;
				var frag = _v1.frag;
				var value = _v1.value;
				return A2(
					$elm$core$List$map,
					$elm$url$Url$Parser$mapState(value),
					parseArg(
						A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
			});
	});
var $elm$url$Url$Parser$s = function (str) {
	return $elm$url$Url$Parser$Parser(
		function (_v0) {
			var visited = _v0.visited;
			var unvisited = _v0.unvisited;
			var params = _v0.params;
			var frag = _v0.frag;
			var value = _v0.value;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				return _Utils_eq(next, str) ? _List_fromArray(
					[
						A5(
						$elm$url$Url$Parser$State,
						A2($elm$core$List$cons, next, visited),
						rest,
						params,
						frag,
						value)
					]) : _List_Nil;
			}
		});
};
var $author$project$Gen$Params$About$parser = $elm$url$Url$Parser$s('about');
var $author$project$Gen$Params$Admin$parser = $elm$url$Url$Parser$s('admin');
var $author$project$Gen$Params$Admin$Update$Id_$Params = function (id) {
	return {id: id};
};
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0.a;
		var parseAfter = _v1.a;
		return $elm$url$Url$Parser$Parser(
			function (state) {
				return A2(
					$elm$core$List$concatMap,
					parseAfter,
					parseBefore(state));
			});
	});
var $elm$url$Url$Parser$custom = F2(
	function (tipe, stringToSomething) {
		return $elm$url$Url$Parser$Parser(
			function (_v0) {
				var visited = _v0.visited;
				var unvisited = _v0.unvisited;
				var params = _v0.params;
				var frag = _v0.frag;
				var value = _v0.value;
				if (!unvisited.b) {
					return _List_Nil;
				} else {
					var next = unvisited.a;
					var rest = unvisited.b;
					var _v2 = stringToSomething(next);
					if (_v2.$ === 'Just') {
						var nextValue = _v2.a;
						return _List_fromArray(
							[
								A5(
								$elm$url$Url$Parser$State,
								A2($elm$core$List$cons, next, visited),
								rest,
								params,
								frag,
								value(nextValue))
							]);
					} else {
						return _List_Nil;
					}
				}
			});
	});
var $elm$url$Url$Parser$string = A2($elm$url$Url$Parser$custom, 'STRING', $elm$core$Maybe$Just);
var $author$project$Gen$Params$Admin$Update$Id_$parser = A2(
	$elm$url$Url$Parser$map,
	$author$project$Gen$Params$Admin$Update$Id_$Params,
	A2(
		$elm$url$Url$Parser$slash,
		$elm$url$Url$Parser$s('admin'),
		A2(
			$elm$url$Url$Parser$slash,
			$elm$url$Url$Parser$s('update'),
			$elm$url$Url$Parser$string)));
var $author$project$Gen$Params$Contact$parser = $elm$url$Url$Parser$s('contact');
var $author$project$Gen$Params$Dashboard$parser = $elm$url$Url$Parser$s('dashboard');
var $author$project$Gen$Params$ForgotPassword$parser = $elm$url$Url$Parser$s('forgot-password');
var $author$project$Gen$Params$ForgotPassword$Username_$Params = function (username) {
	return {username: username};
};
var $author$project$Gen$Params$ForgotPassword$Username_$parser = A2(
	$elm$url$Url$Parser$map,
	$author$project$Gen$Params$ForgotPassword$Username_$Params,
	A2(
		$elm$url$Url$Parser$slash,
		$elm$url$Url$Parser$s('forgot-password'),
		$elm$url$Url$Parser$string));
var $elm$url$Url$Parser$top = $elm$url$Url$Parser$Parser(
	function (state) {
		return _List_fromArray(
			[state]);
	});
var $author$project$Gen$Params$Home_$parser = $elm$url$Url$Parser$top;
var $author$project$Gen$Params$Knowledgebase$parser = $elm$url$Url$Parser$s('knowledgebase');
var $author$project$Gen$Params$Login$parser = $elm$url$Url$Parser$s('login');
var $author$project$Gen$Params$Logout$parser = $elm$url$Url$Parser$s('logout');
var $author$project$Gen$Params$NotFound$parser = $elm$url$Url$Parser$s('not-found');
var $author$project$Gen$Params$Order$parser = $elm$url$Url$Parser$s('order');
var $author$project$Gen$Params$Privacy$parser = $elm$url$Url$Parser$s('privacy');
var $author$project$Gen$Params$Signup$parser = $elm$url$Url$Parser$s('signup');
var $author$project$Gen$Params$Subscription$parser = $elm$url$Url$Parser$s('subscription');
var $author$project$Gen$Params$Success$Id_$Params = function (id) {
	return {id: id};
};
var $author$project$Gen$Params$Success$Id_$parser = A2(
	$elm$url$Url$Parser$map,
	$author$project$Gen$Params$Success$Id_$Params,
	A2(
		$elm$url$Url$Parser$slash,
		$elm$url$Url$Parser$s('success'),
		$elm$url$Url$Parser$string));
var $author$project$Gen$Params$Terms$parser = $elm$url$Url$Parser$s('terms');
var $author$project$Gen$Route$routes = _List_fromArray(
	[
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Home_, $author$project$Gen$Params$Home_$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$About, $author$project$Gen$Params$About$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Admin, $author$project$Gen$Params$Admin$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Contact, $author$project$Gen$Params$Contact$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Dashboard, $author$project$Gen$Params$Dashboard$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$ForgotPassword, $author$project$Gen$Params$ForgotPassword$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Knowledgebase, $author$project$Gen$Params$Knowledgebase$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Login, $author$project$Gen$Params$Login$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Logout, $author$project$Gen$Params$Logout$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$NotFound, $author$project$Gen$Params$NotFound$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Order, $author$project$Gen$Params$Order$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Privacy, $author$project$Gen$Params$Privacy$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Signup, $author$project$Gen$Params$Signup$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Subscription, $author$project$Gen$Params$Subscription$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Terms, $author$project$Gen$Params$Terms$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Success__Id_, $author$project$Gen$Params$Success$Id_$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$ForgotPassword__Username_, $author$project$Gen$Params$ForgotPassword$Username_$parser),
		A2($elm$url$Url$Parser$map, $author$project$Gen$Route$Admin__Update__Id_, $author$project$Gen$Params$Admin$Update$Id_$parser)
	]);
var $author$project$Gen$Route$fromUrl = A2(
	$elm$core$Basics$composeR,
	$elm$url$Url$Parser$parse(
		$elm$url$Url$Parser$oneOf($author$project$Gen$Route$routes)),
	$elm$core$Maybe$withDefault($author$project$Gen$Route$NotFound));
var $author$project$Request$create = F3(
	function (params, url, key) {
		return A4(
			$ryan_haskell$elm_spa$ElmSpa$Request$create,
			$author$project$Gen$Route$fromUrl(url),
			params,
			url,
			key);
	});
var $author$project$Gen$Model$About = F2(
	function (a, b) {
		return {$: 'About', a: a, b: b};
	});
var $author$project$Gen$Msg$About = function (a) {
	return {$: 'About', a: a};
};
var $author$project$Gen$Model$Admin = F2(
	function (a, b) {
		return {$: 'Admin', a: a, b: b};
	});
var $author$project$Gen$Msg$Admin = function (a) {
	return {$: 'Admin', a: a};
};
var $author$project$Gen$Model$Admin__Update__Id_ = F2(
	function (a, b) {
		return {$: 'Admin__Update__Id_', a: a, b: b};
	});
var $author$project$Gen$Msg$Admin__Update__Id_ = function (a) {
	return {$: 'Admin__Update__Id_', a: a};
};
var $author$project$Gen$Model$Contact = F2(
	function (a, b) {
		return {$: 'Contact', a: a, b: b};
	});
var $author$project$Gen$Msg$Contact = function (a) {
	return {$: 'Contact', a: a};
};
var $author$project$Gen$Model$Dashboard = F2(
	function (a, b) {
		return {$: 'Dashboard', a: a, b: b};
	});
var $author$project$Gen$Msg$Dashboard = function (a) {
	return {$: 'Dashboard', a: a};
};
var $author$project$Gen$Model$ForgotPassword = F2(
	function (a, b) {
		return {$: 'ForgotPassword', a: a, b: b};
	});
var $author$project$Gen$Msg$ForgotPassword = function (a) {
	return {$: 'ForgotPassword', a: a};
};
var $author$project$Gen$Model$ForgotPassword__Username_ = F2(
	function (a, b) {
		return {$: 'ForgotPassword__Username_', a: a, b: b};
	});
var $author$project$Gen$Msg$ForgotPassword__Username_ = function (a) {
	return {$: 'ForgotPassword__Username_', a: a};
};
var $author$project$Gen$Model$Home_ = F2(
	function (a, b) {
		return {$: 'Home_', a: a, b: b};
	});
var $author$project$Gen$Msg$Home_ = function (a) {
	return {$: 'Home_', a: a};
};
var $author$project$Gen$Model$Knowledgebase = F2(
	function (a, b) {
		return {$: 'Knowledgebase', a: a, b: b};
	});
var $author$project$Gen$Msg$Knowledgebase = function (a) {
	return {$: 'Knowledgebase', a: a};
};
var $author$project$Gen$Model$Login = F2(
	function (a, b) {
		return {$: 'Login', a: a, b: b};
	});
var $author$project$Gen$Msg$Login = function (a) {
	return {$: 'Login', a: a};
};
var $author$project$Gen$Model$Logout = F2(
	function (a, b) {
		return {$: 'Logout', a: a, b: b};
	});
var $author$project$Gen$Msg$Logout = function (a) {
	return {$: 'Logout', a: a};
};
var $author$project$Gen$Model$NotFound = F2(
	function (a, b) {
		return {$: 'NotFound', a: a, b: b};
	});
var $author$project$Gen$Msg$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $author$project$Gen$Model$Order = F2(
	function (a, b) {
		return {$: 'Order', a: a, b: b};
	});
var $author$project$Gen$Msg$Order = function (a) {
	return {$: 'Order', a: a};
};
var $author$project$Gen$Model$Privacy = F2(
	function (a, b) {
		return {$: 'Privacy', a: a, b: b};
	});
var $author$project$Gen$Msg$Privacy = function (a) {
	return {$: 'Privacy', a: a};
};
var $author$project$Gen$Model$Signup = F2(
	function (a, b) {
		return {$: 'Signup', a: a, b: b};
	});
var $author$project$Gen$Msg$Signup = function (a) {
	return {$: 'Signup', a: a};
};
var $author$project$Gen$Model$Subscription = F2(
	function (a, b) {
		return {$: 'Subscription', a: a, b: b};
	});
var $author$project$Gen$Msg$Subscription = function (a) {
	return {$: 'Subscription', a: a};
};
var $author$project$Gen$Model$Success__Id_ = F2(
	function (a, b) {
		return {$: 'Success__Id_', a: a, b: b};
	});
var $author$project$Gen$Msg$Success__Id_ = function (a) {
	return {$: 'Success__Id_', a: a};
};
var $author$project$Gen$Model$Terms = F2(
	function (a, b) {
		return {$: 'Terms', a: a, b: b};
	});
var $author$project$Gen$Msg$Terms = function (a) {
	return {$: 'Terms', a: a};
};
var $author$project$Gen$Model$Redirecting_ = {$: 'Redirecting_'};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$Navigation$replaceUrl = _Browser_replaceUrl;
var $ryan_haskell$elm_spa$ElmSpa$Page$toResult = F3(
	function (toPage, shared, req) {
		var _v0 = A2(toPage, shared, req);
		var toResult_ = _v0.a;
		return A2(
			toResult_,
			shared,
			A4($ryan_haskell$elm_spa$ElmSpa$Request$create, req.route, _Utils_Tuple0, req.url, req.key));
	});
var $ryan_haskell$elm_spa$ElmSpa$Page$bundle = function (_v0) {
	var redirecting = _v0.redirecting;
	var toRoute = _v0.toRoute;
	var toUrl = _v0.toUrl;
	var fromCmd = _v0.fromCmd;
	var mapEffect = _v0.mapEffect;
	var mapView = _v0.mapView;
	var page = _v0.page;
	var toModel = _v0.toModel;
	var toMsg = _v0.toMsg;
	return {
		init: F4(
			function (params, shared, url, key) {
				var req = A4(
					$ryan_haskell$elm_spa$ElmSpa$Request$create,
					toRoute(url),
					params,
					url,
					key);
				var _v1 = A3($ryan_haskell$elm_spa$ElmSpa$Page$toResult, page, shared, req);
				if (_v1.$ === 'Ok') {
					var record = _v1.a;
					return A3(
						$elm$core$Tuple$mapBoth,
						toModel(req.params),
						mapEffect,
						record.init(_Utils_Tuple0));
				} else {
					var route = _v1.a;
					return _Utils_Tuple2(
						redirecting.model,
						fromCmd(
							A2(
								$elm$browser$Browser$Navigation$replaceUrl,
								req.key,
								toUrl(route))));
				}
			}),
		subscriptions: F5(
			function (params, model, shared, url, key) {
				var req = A4(
					$ryan_haskell$elm_spa$ElmSpa$Request$create,
					toRoute(url),
					params,
					url,
					key);
				var _v2 = A3($ryan_haskell$elm_spa$ElmSpa$Page$toResult, page, shared, req);
				if (_v2.$ === 'Ok') {
					var record = _v2.a;
					return A2(
						$elm$core$Platform$Sub$map,
						toMsg,
						record.subscriptions(model));
				} else {
					return $elm$core$Platform$Sub$none;
				}
			}),
		update: F6(
			function (params, msg, model, shared, url, key) {
				var req = A4(
					$ryan_haskell$elm_spa$ElmSpa$Request$create,
					toRoute(url),
					params,
					url,
					key);
				var _v3 = A3($ryan_haskell$elm_spa$ElmSpa$Page$toResult, page, shared, req);
				if (_v3.$ === 'Ok') {
					var record = _v3.a;
					return A3(
						$elm$core$Tuple$mapBoth,
						toModel(req.params),
						mapEffect,
						A2(record.update, msg, model));
				} else {
					var route = _v3.a;
					return _Utils_Tuple2(
						redirecting.model,
						fromCmd(
							A2(
								$elm$browser$Browser$Navigation$replaceUrl,
								req.key,
								toUrl(route))));
				}
			}),
		view: F5(
			function (params, model, shared, url, key) {
				var req = A4(
					$ryan_haskell$elm_spa$ElmSpa$Request$create,
					toRoute(url),
					params,
					url,
					key);
				var _v4 = A3($ryan_haskell$elm_spa$ElmSpa$Page$toResult, page, shared, req);
				if (_v4.$ === 'Ok') {
					var record = _v4.a;
					return mapView(
						record.view(model));
				} else {
					return redirecting.view;
				}
			})
	};
};
var $author$project$Effect$Cmd = function (a) {
	return {$: 'Cmd', a: a};
};
var $author$project$Effect$fromCmd = $author$project$Effect$Cmd;
var $author$project$Effect$Batch = function (a) {
	return {$: 'Batch', a: a};
};
var $author$project$Effect$None = {$: 'None'};
var $author$project$Effect$Shared = function (a) {
	return {$: 'Shared', a: a};
};
var $author$project$Effect$map = F2(
	function (fn, effect) {
		switch (effect.$) {
			case 'None':
				return $author$project$Effect$None;
			case 'Cmd':
				var cmd = effect.a;
				return $author$project$Effect$Cmd(
					A2($elm$core$Platform$Cmd$map, fn, cmd));
			case 'Shared':
				var msg = effect.a;
				return $author$project$Effect$Shared(msg);
			default:
				var list = effect.a;
				return $author$project$Effect$Batch(
					A2(
						$elm$core$List$map,
						$author$project$Effect$map(fn),
						list));
		}
	});
var $author$project$View$map = F2(
	function (fn, view) {
		return {
			body: A2(
				$elm$core$List$map,
				$elm$html$Html$map(fn),
				view.body),
			title: view.title
		};
	});
var $author$project$View$placeholder = function (str) {
	return {
		body: _List_fromArray(
			[
				$elm$html$Html$text(str)
			]),
		title: str
	};
};
var $author$project$View$none = $author$project$View$placeholder('');
var $author$project$Gen$Route$toHref = function (route) {
	var joinAsHref = function (segments) {
		return '/' + A2($elm$core$String$join, '/', segments);
	};
	switch (route.$) {
		case 'About':
			return joinAsHref(
				_List_fromArray(
					['about']));
		case 'Admin':
			return joinAsHref(
				_List_fromArray(
					['admin']));
		case 'Contact':
			return joinAsHref(
				_List_fromArray(
					['contact']));
		case 'Dashboard':
			return joinAsHref(
				_List_fromArray(
					['dashboard']));
		case 'ForgotPassword':
			return joinAsHref(
				_List_fromArray(
					['forgot-password']));
		case 'Home_':
			return joinAsHref(_List_Nil);
		case 'Knowledgebase':
			return joinAsHref(
				_List_fromArray(
					['knowledgebase']));
		case 'Login':
			return joinAsHref(
				_List_fromArray(
					['login']));
		case 'Logout':
			return joinAsHref(
				_List_fromArray(
					['logout']));
		case 'NotFound':
			return joinAsHref(
				_List_fromArray(
					['not-found']));
		case 'Order':
			return joinAsHref(
				_List_fromArray(
					['order']));
		case 'Privacy':
			return joinAsHref(
				_List_fromArray(
					['privacy']));
		case 'Signup':
			return joinAsHref(
				_List_fromArray(
					['signup']));
		case 'Subscription':
			return joinAsHref(
				_List_fromArray(
					['subscription']));
		case 'Terms':
			return joinAsHref(
				_List_fromArray(
					['terms']));
		case 'Admin__Update__Id_':
			var params = route.a;
			return joinAsHref(
				_List_fromArray(
					['admin', 'update', params.id]));
		case 'ForgotPassword__Username_':
			var params = route.a;
			return joinAsHref(
				_List_fromArray(
					['forgot-password', params.username]));
		default:
			var params = route.a;
			return joinAsHref(
				_List_fromArray(
					['success', params.id]));
	}
};
var $author$project$Gen$Pages$bundle = F3(
	function (page, toModel, toMsg) {
		return $ryan_haskell$elm_spa$ElmSpa$Page$bundle(
			{
				fromCmd: $author$project$Effect$fromCmd,
				mapEffect: $author$project$Effect$map(toMsg),
				mapView: $author$project$View$map(toMsg),
				page: page,
				redirecting: {model: $author$project$Gen$Model$Redirecting_, view: $author$project$View$none},
				toModel: toModel,
				toMsg: toMsg,
				toRoute: $author$project$Gen$Route$fromUrl,
				toUrl: $author$project$Gen$Route$toHref
			});
	});
var $ryan_haskell$elm_spa$ElmSpa$Page$Page = function (a) {
	return {$: 'Page', a: a};
};
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $ryan_haskell$elm_spa$ElmSpa$Page$adapters = {
	advanced: function (page) {
		return {
			init: $elm$core$Basics$always(page.init),
			subscriptions: page.subscriptions,
			update: page.update,
			view: page.view
		};
	},
	element: F2(
		function (fromCmd, page) {
			return {
				init: function (_v0) {
					return A2($elm$core$Tuple$mapSecond, fromCmd, page.init);
				},
				subscriptions: page.subscriptions,
				update: F2(
					function (msg, model) {
						return A2(
							$elm$core$Tuple$mapSecond,
							fromCmd,
							A2(page.update, msg, model));
					}),
				view: page.view
			};
		}),
	sandbox: F2(
		function (none, page) {
			return {
				init: function (_v1) {
					return _Utils_Tuple2(page.init, none);
				},
				subscriptions: function (_v2) {
					return $elm$core$Platform$Sub$none;
				},
				update: F2(
					function (msg, model) {
						return _Utils_Tuple2(
							A2(page.update, msg, model),
							none);
					}),
				view: page.view
			};
		}),
	_static: F2(
		function (none, page) {
			return {
				init: function (_v3) {
					return _Utils_Tuple2(_Utils_Tuple0, none);
				},
				subscriptions: function (_v4) {
					return $elm$core$Platform$Sub$none;
				},
				update: F2(
					function (_v5, _v6) {
						return _Utils_Tuple2(_Utils_Tuple0, none);
					}),
				view: function (_v7) {
					return page.view;
				}
			};
		})
};
var $ryan_haskell$elm_spa$ElmSpa$Page$element = F2(
	function (fromCmd, page) {
		return $ryan_haskell$elm_spa$ElmSpa$Page$Page(
			F2(
				function (_v0, _v1) {
					return $elm$core$Result$Ok(
						A2($ryan_haskell$elm_spa$ElmSpa$Page$adapters.element, fromCmd, page));
				}));
	});
var $author$project$Page$element = $ryan_haskell$elm_spa$ElmSpa$Page$element($author$project$Effect$fromCmd);
var $author$project$Pages$About$Model = function (showMenu) {
	return {showMenu: showMenu};
};
var $author$project$Pages$About$init = _Utils_Tuple2(
	$author$project$Pages$About$Model(false),
	$elm$core$Platform$Cmd$none);
var $author$project$Pages$About$update = F2(
	function (msg, model) {
		return model.showMenu ? _Utils_Tuple2(
			_Utils_update(
				model,
				{showMenu: false}),
			$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
			_Utils_update(
				model,
				{showMenu: true}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$About$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$section = _VirtualDom_node('section');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Common$Footer$viewFooter = function (year) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('footer-section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mr-tp-40 row justify-content-between footer-area-under')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-md-4')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$href('#')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$img,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$alt('Wayback Machine Downloader'),
														$elm$html$Html$Attributes$class('footer-logo-blue'),
														$elm$html$Html$Attributes$src('/img/header/logo-w.png')
													]),
												_List_Nil)
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-md-4 row')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$ul,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('under-footer-ullist text-right')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$li,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$a,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$href('/privacy')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('Privacy policy')
															]))
													])),
												A2(
												$elm$html$Html$li,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$a,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$href('/terms')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('Terms of Service')
															]))
													]))
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('row justify-content-between final-footer-area mr-tp-40')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('final-footer-area-text')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('© Copyright'),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('copyright-year')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												' ' + ($elm$core$String$fromInt(year) + ' '))
											])),
										$elm$html$Html$text('Wayback Download')
									]))
							]))
					]))
			]));
};
var $elm$html$Html$canvas = _VirtualDom_node('canvas');
var $author$project$Common$NavBar$adminNavList = function (user) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nav-item')
				]),
			user.admin ? _List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('nav-link'),
							$elm$html$Html$Attributes$href(
							$author$project$Gen$Route$toHref($author$project$Gen$Route$Admin))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Admin')
						]))
				]) : _List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('nav-link'),
							$elm$html$Html$Attributes$href(
							$author$project$Gen$Route$toHref($author$project$Gen$Route$Dashboard))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Dashboard')
						]))
				])),
			A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nav-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('nav-link'),
							$elm$html$Html$Attributes$href(
							$author$project$Gen$Route$toHref($author$project$Gen$Route$Order))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Order')
						]))
				])),
			A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nav-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('nav-link'),
							$elm$html$Html$Attributes$href(
							$author$project$Gen$Route$toHref($author$project$Gen$Route$Subscription))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Subscriptions')
						]))
				]))
		]);
};
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $author$project$Common$NavBar$navList = _List_fromArray(
	[
		A2(
		$elm$html$Html$li,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('nav-item')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('nav-link'),
						$elm$html$Html$Attributes$href(
						$author$project$Gen$Route$toHref($author$project$Gen$Route$Home_))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Home')
					]))
			])),
		A2(
		$elm$html$Html$li,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('nav-item')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('nav-link'),
						$elm$html$Html$Attributes$href(
						$author$project$Gen$Route$toHref($author$project$Gen$Route$About))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('About Us')
					]))
			])),
		A2(
		$elm$html$Html$li,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('nav-item')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('nav-link'),
						$elm$html$Html$Attributes$href(
						$author$project$Gen$Route$toHref($author$project$Gen$Route$Knowledgebase))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Knowledge Base')
					]))
			])),
		A2(
		$elm$html$Html$li,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('nav-item')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('nav-link'),
						$elm$html$Html$Attributes$href(
						$author$project$Gen$Route$toHref($author$project$Gen$Route$Contact))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Contact us')
					]))
			]))
	]);
var $author$project$Common$NavBar$viewNavbar = F3(
	function (user, clickedToggleMenu, showMenu) {
		return A2(
			$elm$html$Html$nav,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('navbar navbar-expand-md fixed-header-layout'),
					$elm$html$Html$Attributes$id('coodiv-navbar-header'),
					showMenu ? A2($elm$html$Html$Attributes$style, 'background', '#151621') : A2($elm$html$Html$Attributes$style, '', '')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('container main-header-coodiv-s')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('navbar-brand'),
									$elm$html$Html$Attributes$href('/')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$alt('Wayback Machine Downloader'),
											$elm$html$Html$Attributes$class('w-logo'),
											$elm$html$Html$Attributes$src('/img/header/logo-w.png')
										]),
									_List_Nil),
									$elm$html$Html$text('				'),
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$alt('Wayback Machine Downloader'),
											$elm$html$Html$Attributes$class('b-logo'),
											$elm$html$Html$Attributes$src('/img/header/logo.svg')
										]),
									_List_Nil),
									$elm$html$Html$text('				')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('navbar-toggle offcanvas-toggle menu-btn-span-bar ml-auto'),
									A2($elm$html$Html$Attributes$attribute, 'data-target', '#offcanvas-menu-home'),
									A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'offcanvas'),
									$elm$html$Html$Events$onClick(clickedToggleMenu)
								]),
							_List_fromArray(
								[
									A2($elm$html$Html$span, _List_Nil, _List_Nil),
									A2($elm$html$Html$span, _List_Nil, _List_Nil),
									A2($elm$html$Html$span, _List_Nil, _List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('collapse navbar-collapse navbar-offcanvas'),
									$elm$html$Html$Attributes$id('offcanvas-menu-home'),
									showMenu ? A2($elm$html$Html$Attributes$style, 'position', 'static') : A2($elm$html$Html$Attributes$style, '', '')
								]),
							_List_fromArray(
								[
									function () {
									if (user.$ === 'Just') {
										var u = user.a;
										return A2(
											$elm$html$Html$ul,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('navbar-nav ml-auto')
												]),
											A2(
												$elm$core$List$append,
												$author$project$Common$NavBar$navList,
												$author$project$Common$NavBar$adminNavList(u)));
									} else {
										return A2(
											$elm$html$Html$ul,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('navbar-nav ml-auto')
												]),
											$author$project$Common$NavBar$navList);
									}
								}()
								])),
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('header-user-info-coodiv')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$li,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('dropdown')
										]),
									_List_fromArray(
										[
											function () {
											if (user.$ === 'Just') {
												return A2(
													$elm$html$Html$li,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('nav-item')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$a,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$href('/logout'),
																	$elm$html$Html$Attributes$id('header-login-dropdown')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Logout')
																])),
															A2($elm$html$Html$li, _List_Nil, _List_Nil)
														]));
											} else {
												return A2(
													$elm$html$Html$li,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('nav-item')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$a,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$href('/login'),
																	$elm$html$Html$Attributes$id('header-login-dropdown')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Login')
																])),
															A2($elm$html$Html$li, _List_Nil, _List_Nil)
														]));
											}
										}()
										]))
								]))
						]))
				]));
	});
var $elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $author$project$Common$Header$viewParticles = A2(
	$elm$html$Html$canvas,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('particles-js-canvas-el'),
			A2($elm$html$Html$Attributes$style, 'width', '100%'),
			A2($elm$html$Html$Attributes$style, 'height', '100%'),
			$elm$html$Html$Attributes$width(1908),
			$elm$html$Html$Attributes$height(954)
		]),
	_List_Nil);
var $author$project$Common$Header$viewHeader = F7(
	function (user, type_, domain, main, modal, clickedToggleMenu, showMenu) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					function () {
					switch (type_) {
						case 'main':
							return $elm$html$Html$Attributes$class('d-flex mx-auto flex-column moon-edition');
						case 'sub':
							return $elm$html$Html$Attributes$class('d-flex mx-auto flex-column subpages-header moon-edition');
						default:
							return $elm$html$Html$Attributes$class('subpages-header-min moon-edition');
					}
				}(),
					$elm$html$Html$Attributes$id('coodiv-header')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('bg_overlay_header')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('particles-bg')
								]),
							_List_fromArray(
								[
									function () {
									if (type_ === 'main') {
										return $author$project$Common$Header$viewParticles;
									} else {
										return A2($elm$html$Html$canvas, _List_Nil, _List_Nil);
									}
								}()
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('bg-img-header-new-moon')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('header-shapes shape-02')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('header-shapes shape-03')
								]),
							_List_Nil)
						])),
					A3($author$project$Common$NavBar$viewNavbar, user, clickedToggleMenu, showMenu),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mt-auto header-top-height')
						]),
					_List_Nil),
					main,
					modal,
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mt-auto')
						]),
					_List_Nil)
				]));
	});
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $author$project$Pages$About$viewMain = A2(
	$elm$html$Html$main_,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('container mb-auto')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mt-3 main-header-text-title')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('About Us')
				]))
		]));
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $author$project$Pages$About$viewSection1 = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('padding-0-100 position-relative')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row justify-content-between')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-md-7 about-us-img-section')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src('img/demo/groupofworks.jpg'),
											$elm$html$Html$Attributes$alt('')
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-md-4 side-text-right-container d-flex mx-auto flex-column')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('mb-auto')
										]),
									_List_Nil),
									A2(
									$elm$html$Html$h2,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('side-text-right-title f-size25')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Who are we,'),
											A2($elm$html$Html$br, _List_Nil, _List_Nil),
											$elm$html$Html$text('and what do we do?')
										])),
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('side-text-right-text f-size16')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('We are a Montreal-based tech startup focused on making it as easy and fast as possible to recover a lost or deleted website. That\'s why we developped this self-serve tool. The Internet Archive\'s Wayback Machine is an amazing product, but restoring websites from there can be a tedious and lengthy process. We wish to eliminate that hassle!'),
											A2($elm$html$Html$br, _List_Nil, _List_Nil)
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('mt-auto')
										]),
									_List_Nil)
								]))
						]))
				]))
		]));
var $elm$html$Html$h5 = _VirtualDom_node('h5');
var $elm$html$Html$i = _VirtualDom_node('i');
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$Pages$About$viewSection2 = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('padding-100-0 position-relative how-it-work-section')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h5,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('title-default-coodiv-two')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('how it works')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row justify-content-center mr-tp-70 how-it-work-section-row')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-md-4')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('how-it-works-box')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$i,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('h-flaticon-011-globe-2')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$h5,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Choose a package')
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Whether you\'re restoring a basic website or a Wordpress website, we\'ve got you covered!')
												]))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-md-4')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('how-it-works-box')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$i,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('h-flaticon-014-calendar')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$h5,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Select a timestamp')
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Head over to the '),
													A2(
													$elm$html$Html$a,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$href('https://web.archive.org/'),
															$elm$html$Html$Attributes$target('_blank')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Internet Archive\'s Wayback Machine')
														])),
													$elm$html$Html$text(', and find the correct snapshot.')
												]))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-md-4')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('how-it-works-box')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$i,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('h-flaticon-008-upload')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$h5,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Upload your files')
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('That\'s it! All you need to do is take the restored files and upload them to the server of your choice!')
												]))
										]))
								]))
						]))
				]))
		]));
var $author$project$Pages$About$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'sub',
					'',
					$author$project$Pages$About$viewMain,
					$elm$html$Html$text(''),
					$author$project$Pages$About$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$About$viewSection1,
					$author$project$Pages$About$viewSection2,
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'About | Wayback Download'
		};
	});
var $author$project$Pages$About$page = F2(
	function (shared, _v0) {
		return $author$project$Page$element(
			{
				init: $author$project$Pages$About$init,
				subscriptions: function (_v1) {
					return $elm$core$Platform$Sub$none;
				},
				update: $author$project$Pages$About$update,
				view: $author$project$Pages$About$view(shared)
			});
	});
var $author$project$Pages$Admin$Model = F9(
	function (status, restores, restoresSplit, tempRestores, queue, search, numPages, currentPage, showMenu) {
		return {currentPage: currentPage, numPages: numPages, queue: queue, restores: restores, restoresSplit: restoresSplit, search: search, showMenu: showMenu, status: status, tempRestores: tempRestores};
	});
var $author$project$Pages$Admin$None = {$: 'None'};
var $author$project$Proto$Response$QueueForm = F6(
	function (domain, timestamp, restoreId, email, action, method) {
		return {action: action, domain: domain, email: email, method: method, restoreId: restoreId, timestamp: timestamp};
	});
var $author$project$Pages$Admin$OrderResp = function (a) {
	return {$: 'OrderResp', a: a};
};
var $author$project$Proto$Response$defaultReceipt = {amount: '', date: '', id: '', url: ''};
var $eriktim$elm_protocol_buffers$Protobuf$Decode$Decoder = function (a) {
	return {$: 'Decoder', a: a};
};
var $elm$bytes$Bytes$Encode$getWidth = function (builder) {
	switch (builder.$) {
		case 'I8':
			return 1;
		case 'I16':
			return 2;
		case 'I32':
			return 4;
		case 'U8':
			return 1;
		case 'U16':
			return 2;
		case 'U32':
			return 4;
		case 'F32':
			return 4;
		case 'F64':
			return 8;
		case 'Seq':
			var w = builder.a;
			return w;
		case 'Utf8':
			var w = builder.a;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_width(bs);
	}
};
var $elm$bytes$Bytes$LE = {$: 'LE'};
var $elm$bytes$Bytes$Encode$write = F3(
	function (builder, mb, offset) {
		switch (builder.$) {
			case 'I8':
				var n = builder.a;
				return A3(_Bytes_write_i8, mb, offset, n);
			case 'I16':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_i16,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'I32':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_i32,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'U8':
				var n = builder.a;
				return A3(_Bytes_write_u8, mb, offset, n);
			case 'U16':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_u16,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'U32':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_u32,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'F32':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_f32,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'F64':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_f64,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'Seq':
				var bs = builder.b;
				return A3($elm$bytes$Bytes$Encode$writeSequence, bs, mb, offset);
			case 'Utf8':
				var s = builder.b;
				return A3(_Bytes_write_string, mb, offset, s);
			default:
				var bs = builder.a;
				return A3(_Bytes_write_bytes, mb, offset, bs);
		}
	});
var $elm$bytes$Bytes$Encode$writeSequence = F3(
	function (builders, mb, offset) {
		writeSequence:
		while (true) {
			if (!builders.b) {
				return offset;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$builders = bs,
					$temp$mb = mb,
					$temp$offset = A3($elm$bytes$Bytes$Encode$write, b, mb, offset);
				builders = $temp$builders;
				mb = $temp$mb;
				offset = $temp$offset;
				continue writeSequence;
			}
		}
	});
var $elm$bytes$Bytes$Decode$Decoder = function (a) {
	return {$: 'Decoder', a: a};
};
var $elm$bytes$Bytes$Decode$fail = $elm$bytes$Bytes$Decode$Decoder(_Bytes_decodeFailure);
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$bytes$Bytes$Decode$loopHelp = F4(
	function (state, callback, bites, offset) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var decoder = _v0.a;
			var _v1 = A2(decoder, bites, offset);
			var newOffset = _v1.a;
			var step = _v1.b;
			if (step.$ === 'Loop') {
				var newState = step.a;
				var $temp$state = newState,
					$temp$callback = callback,
					$temp$bites = bites,
					$temp$offset = newOffset;
				state = $temp$state;
				callback = $temp$callback;
				bites = $temp$bites;
				offset = $temp$offset;
				continue loopHelp;
			} else {
				var result = step.a;
				return _Utils_Tuple2(newOffset, result);
			}
		}
	});
var $elm$bytes$Bytes$Decode$loop = F2(
	function (state, callback) {
		return $elm$bytes$Bytes$Decode$Decoder(
			A2($elm$bytes$Bytes$Decode$loopHelp, state, callback));
	});
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $elm$bytes$Bytes$Decode$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$bytes$Bytes$Decode$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$bytes$Bytes$Decode$andThen = F2(
	function (callback, _v0) {
		var decodeA = _v0.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v1 = A2(decodeA, bites, offset);
					var newOffset = _v1.a;
					var a = _v1.b;
					var _v2 = callback(a);
					var decodeB = _v2.a;
					return A2(decodeB, bites, newOffset);
				}));
	});
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$isEmpty(dict);
};
var $elm$bytes$Bytes$Decode$map = F2(
	function (func, _v0) {
		var decodeA = _v0.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v1 = A2(decodeA, bites, offset);
					var aOffset = _v1.a;
					var a = _v1.b;
					return _Utils_Tuple2(
						aOffset,
						func(a));
				}));
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return $elm$core$Set$Set_elm_builtin(
			A2($elm$core$Dict$remove, key, dict));
	});
var $elm$bytes$Bytes$Decode$succeed = function (a) {
	return $elm$bytes$Bytes$Decode$Decoder(
		F2(
			function (_v0, offset) {
				return _Utils_Tuple2(offset, a);
			}));
};
var $eriktim$elm_protocol_buffers$Internal$Protobuf$Bit32 = {$: 'Bit32'};
var $eriktim$elm_protocol_buffers$Internal$Protobuf$Bit64 = {$: 'Bit64'};
var $eriktim$elm_protocol_buffers$Internal$Protobuf$EndGroup = {$: 'EndGroup'};
var $eriktim$elm_protocol_buffers$Internal$Protobuf$LengthDelimited = function (a) {
	return {$: 'LengthDelimited', a: a};
};
var $eriktim$elm_protocol_buffers$Internal$Protobuf$StartGroup = {$: 'StartGroup'};
var $eriktim$elm_protocol_buffers$Internal$Protobuf$VarInt = {$: 'VarInt'};
var $elm$bytes$Bytes$Decode$unsignedInt8 = $elm$bytes$Bytes$Decode$Decoder(_Bytes_read_u8);
function $eriktim$elm_protocol_buffers$Protobuf$Decode$cyclic$varIntDecoder() {
	return A2(
		$elm$bytes$Bytes$Decode$andThen,
		function (octet) {
			return ((128 & octet) === 128) ? A2(
				$elm$bytes$Bytes$Decode$map,
				function (_v0) {
					var usedBytes = _v0.a;
					var value = _v0.b;
					return _Utils_Tuple2(usedBytes + 1, (127 & octet) + (value << 7));
				},
				$eriktim$elm_protocol_buffers$Protobuf$Decode$cyclic$varIntDecoder()) : $elm$bytes$Bytes$Decode$succeed(
				_Utils_Tuple2(1, octet));
		},
		$elm$bytes$Bytes$Decode$unsignedInt8);
}
try {
	var $eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder = $eriktim$elm_protocol_buffers$Protobuf$Decode$cyclic$varIntDecoder();
	$eriktim$elm_protocol_buffers$Protobuf$Decode$cyclic$varIntDecoder = function () {
		return $eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder;
	};
} catch ($) {
	throw 'Some top-level definitions from `Protobuf.Decode` are causing infinite recursion:\n\n  ┌─────┐\n  │    varIntDecoder\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $eriktim$elm_protocol_buffers$Protobuf$Decode$tagDecoder = A2(
	$elm$bytes$Bytes$Decode$andThen,
	function (_v0) {
		var usedBytes = _v0.a;
		var value = _v0.b;
		var fieldNumber = value >>> 3;
		return A2(
			$elm$bytes$Bytes$Decode$map,
			function (_v1) {
				var n = _v1.a;
				var wireType = _v1.b;
				return _Utils_Tuple2(
					usedBytes + n,
					_Utils_Tuple2(fieldNumber, wireType));
			},
			function () {
				var _v2 = 7 & value;
				switch (_v2) {
					case 0:
						return $elm$bytes$Bytes$Decode$succeed(
							_Utils_Tuple2(0, $eriktim$elm_protocol_buffers$Internal$Protobuf$VarInt));
					case 1:
						return $elm$bytes$Bytes$Decode$succeed(
							_Utils_Tuple2(0, $eriktim$elm_protocol_buffers$Internal$Protobuf$Bit64));
					case 2:
						return A2(
							$elm$bytes$Bytes$Decode$map,
							$elm$core$Tuple$mapSecond($eriktim$elm_protocol_buffers$Internal$Protobuf$LengthDelimited),
							$eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder);
					case 3:
						return $elm$bytes$Bytes$Decode$succeed(
							_Utils_Tuple2(0, $eriktim$elm_protocol_buffers$Internal$Protobuf$StartGroup));
					case 4:
						return $elm$bytes$Bytes$Decode$succeed(
							_Utils_Tuple2(0, $eriktim$elm_protocol_buffers$Internal$Protobuf$EndGroup));
					case 5:
						return $elm$bytes$Bytes$Decode$succeed(
							_Utils_Tuple2(0, $eriktim$elm_protocol_buffers$Internal$Protobuf$Bit32));
					default:
						return $elm$bytes$Bytes$Decode$fail;
				}
			}());
	},
	$eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder);
var $elm$bytes$Bytes$Decode$bytes = function (n) {
	return $elm$bytes$Bytes$Decode$Decoder(
		_Bytes_read_bytes(n));
};
var $eriktim$elm_protocol_buffers$Protobuf$Decode$unknownFieldDecoder = function (wireType) {
	switch (wireType.$) {
		case 'VarInt':
			return A2($elm$bytes$Bytes$Decode$map, $elm$core$Tuple$first, $eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder);
		case 'Bit64':
			return A2(
				$elm$bytes$Bytes$Decode$map,
				$elm$core$Basics$always(8),
				$elm$bytes$Bytes$Decode$bytes(8));
		case 'LengthDelimited':
			var width = wireType.a;
			return A2(
				$elm$bytes$Bytes$Decode$map,
				$elm$core$Basics$always(width),
				$elm$bytes$Bytes$Decode$bytes(width));
		case 'StartGroup':
			return $elm$bytes$Bytes$Decode$fail;
		case 'EndGroup':
			return $elm$bytes$Bytes$Decode$fail;
		default:
			return A2(
				$elm$bytes$Bytes$Decode$map,
				$elm$core$Basics$always(4),
				$elm$bytes$Bytes$Decode$bytes(4));
	}
};
var $eriktim$elm_protocol_buffers$Protobuf$Decode$stepMessage = F2(
	function (width, state) {
		return (state.width <= 0) ? ($elm$core$Set$isEmpty(state.requiredFieldNumbers) ? $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(
				_Utils_Tuple2(width, state.model))) : $elm$bytes$Bytes$Decode$fail) : A2(
			$elm$bytes$Bytes$Decode$andThen,
			function (_v0) {
				var usedBytes = _v0.a;
				var _v1 = _v0.b;
				var fieldNumber = _v1.a;
				var wireType = _v1.b;
				var _v2 = A2($elm$core$Dict$get, fieldNumber, state.dict);
				if (_v2.$ === 'Just') {
					var decoder = _v2.a.a;
					return A2(
						$elm$bytes$Bytes$Decode$map,
						function (_v3) {
							var n = _v3.a;
							var fn = _v3.b;
							return $elm$bytes$Bytes$Decode$Loop(
								_Utils_update(
									state,
									{
										model: fn(state.model),
										requiredFieldNumbers: A2($elm$core$Set$remove, fieldNumber, state.requiredFieldNumbers),
										width: (state.width - usedBytes) - n
									}));
						},
						decoder(wireType));
				} else {
					return A2(
						$elm$bytes$Bytes$Decode$map,
						function (n) {
							return $elm$bytes$Bytes$Decode$Loop(
								_Utils_update(
									state,
									{width: (state.width - usedBytes) - n}));
						},
						$eriktim$elm_protocol_buffers$Protobuf$Decode$unknownFieldDecoder(wireType));
				}
			},
			$eriktim$elm_protocol_buffers$Protobuf$Decode$tagDecoder);
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$message = F2(
	function (v, fieldDecoders) {
		var _v0 = A2(
			$elm$core$Tuple$mapSecond,
			$elm$core$Dict$fromList,
			A2(
				$elm$core$Tuple$mapFirst,
				$elm$core$Set$fromList,
				A3(
					$elm$core$List$foldr,
					F2(
						function (_v1, _v2) {
							var isRequired = _v1.a;
							var items = _v1.b;
							var numbers = _v2.a;
							var decoders = _v2.b;
							var numbers_ = isRequired ? _Utils_ap(
								numbers,
								A2($elm$core$List$map, $elm$core$Tuple$first, items)) : numbers;
							return _Utils_Tuple2(
								numbers_,
								_Utils_ap(items, decoders));
						}),
					_Utils_Tuple2(_List_Nil, _List_Nil),
					fieldDecoders)));
		var requiredSet = _v0.a;
		var dict = _v0.b;
		return $eriktim$elm_protocol_buffers$Protobuf$Decode$Decoder(
			function (wireType) {
				if (wireType.$ === 'LengthDelimited') {
					var width = wireType.a;
					return A2(
						$elm$bytes$Bytes$Decode$loop,
						{dict: dict, model: v, requiredFieldNumbers: requiredSet, width: width},
						$eriktim$elm_protocol_buffers$Protobuf$Decode$stepMessage(width));
				} else {
					return $elm$bytes$Bytes$Decode$fail;
				}
			});
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$FieldDecoder = F2(
	function (a, b) {
		return {$: 'FieldDecoder', a: a, b: b};
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$map = F2(
	function (fn, _v0) {
		var decoder = _v0.a;
		return $eriktim$elm_protocol_buffers$Protobuf$Decode$Decoder(
			function (wireType) {
				return A2(
					$elm$bytes$Bytes$Decode$map,
					$elm$core$Tuple$mapSecond(fn),
					decoder(wireType));
			});
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$optional = F3(
	function (fieldNumber, decoder, set) {
		return A2(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$FieldDecoder,
			false,
			_List_fromArray(
				[
					_Utils_Tuple2(
					fieldNumber,
					A2($eriktim$elm_protocol_buffers$Protobuf$Decode$map, set, decoder))
				]));
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$lengthDelimitedDecoder = function (decoder) {
	return $eriktim$elm_protocol_buffers$Protobuf$Decode$Decoder(
		function (wireType) {
			if (wireType.$ === 'LengthDelimited') {
				var width = wireType.a;
				return A2(
					$elm$bytes$Bytes$Decode$map,
					$elm$core$Tuple$pair(width),
					decoder(width));
			} else {
				return $elm$bytes$Bytes$Decode$fail;
			}
		});
};
var $elm$bytes$Bytes$Decode$string = function (n) {
	return $elm$bytes$Bytes$Decode$Decoder(
		_Bytes_read_string(n));
};
var $eriktim$elm_protocol_buffers$Protobuf$Decode$string = $eriktim$elm_protocol_buffers$Protobuf$Decode$lengthDelimitedDecoder($elm$bytes$Bytes$Decode$string);
var $author$project$Proto$Response$decodeReceipt = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$message,
	$author$project$Proto$Response$defaultReceipt,
	_List_fromArray(
		[
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			1,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{id: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			2,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{url: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			3,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{date: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			4,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{amount: a});
				}))
		]));
var $author$project$Proto$Response$defaultRestore = {domain: '', email: '', id: '', s3Url: '', status: '', timestamp: '', transactDate: '', username: ''};
var $author$project$Proto$Response$decodeRestore = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$message,
	$author$project$Proto$Response$defaultRestore,
	_List_fromArray(
		[
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			1,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{id: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			2,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{timestamp: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			3,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{domain: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			4,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{status: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			5,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{s3Url: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			6,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{transactDate: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			7,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{username: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			8,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{email: a});
				}))
		]));
var $eriktim$elm_protocol_buffers$Protobuf$Decode$packedDecoder = F2(
	function (decoderWireType, decoder) {
		return $eriktim$elm_protocol_buffers$Protobuf$Decode$Decoder(
			function (wireType) {
				if (wireType.$ === 'LengthDelimited') {
					return decoder;
				} else {
					return _Utils_eq(wireType, decoderWireType) ? decoder : $elm$bytes$Bytes$Decode$fail;
				}
			});
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$bool = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$packedDecoder,
	$eriktim$elm_protocol_buffers$Internal$Protobuf$VarInt,
	A2(
		$elm$bytes$Bytes$Decode$map,
		$elm$core$Tuple$mapSecond(
			$elm$core$Basics$neq(0)),
		$eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder));
var $author$project$Proto$Response$defaultUser = {admin: false, subscribed: false, token: ''};
var $author$project$Proto$Response$decodeUser = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$message,
	$author$project$Proto$Response$defaultUser,
	_List_fromArray(
		[
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			1,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{token: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			2,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$bool,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{subscribed: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			3,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$bool,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{admin: a});
				}))
		]));
var $author$project$Proto$Response$defaultData = {id: '', info: '', receipts: _List_Nil, restore: $elm$core$Maybe$Nothing, restores: _List_Nil, url: '', user: $elm$core$Maybe$Nothing};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $eriktim$elm_protocol_buffers$Protobuf$Decode$stepPackedField = F3(
	function (fullWidth, decoder, _v0) {
		var width = _v0.a;
		var values = _v0.b;
		return A2(
			$elm$bytes$Bytes$Decode$map,
			function (_v1) {
				var w = _v1.a;
				var value = _v1.b;
				var values_ = A2($elm$core$List$cons, value, values);
				var bytesRemaining = width - w;
				return (bytesRemaining <= 0) ? $elm$bytes$Bytes$Decode$Done(
					_Utils_Tuple2(
						fullWidth,
						$elm$core$List$reverse(values_))) : $elm$bytes$Bytes$Decode$Loop(
					_Utils_Tuple2(bytesRemaining, values_));
			},
			decoder);
	});
var $eriktim$elm_protocol_buffers$Protobuf$Decode$repeated = F4(
	function (fieldNumber, _v0, get, set) {
		var decoder = _v0.a;
		var update = F2(
			function (value, model) {
				return A2(
					set,
					_Utils_ap(
						get(model),
						value),
					model);
			});
		var listDecoder = $eriktim$elm_protocol_buffers$Protobuf$Decode$Decoder(
			function (wireType) {
				if (wireType.$ === 'LengthDelimited') {
					var width = wireType.a;
					return A2(
						$elm$bytes$Bytes$Decode$loop,
						_Utils_Tuple2(width, _List_Nil),
						A2(
							$eriktim$elm_protocol_buffers$Protobuf$Decode$stepPackedField,
							width,
							decoder(wireType)));
				} else {
					return A2(
						$elm$bytes$Bytes$Decode$map,
						$elm$core$Tuple$mapSecond($elm$core$List$singleton),
						decoder(wireType));
				}
			});
		return A2(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$FieldDecoder,
			false,
			_List_fromArray(
				[
					_Utils_Tuple2(
					fieldNumber,
					A2($eriktim$elm_protocol_buffers$Protobuf$Decode$map, update, listDecoder))
				]));
	});
var $author$project$Proto$Response$decodeData = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$message,
	$author$project$Proto$Response$defaultData,
	_List_fromArray(
		[
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			1,
			A2($eriktim$elm_protocol_buffers$Protobuf$Decode$map, $elm$core$Maybe$Just, $author$project$Proto$Response$decodeUser),
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{user: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			2,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{id: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			3,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{url: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			4,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{info: a});
				})),
			A4(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$repeated,
			5,
			$author$project$Proto$Response$decodeReceipt,
			function ($) {
				return $.receipts;
			},
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{receipts: a});
				})),
			A4(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$repeated,
			6,
			$author$project$Proto$Response$decodeRestore,
			function ($) {
				return $.restores;
			},
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{restores: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			7,
			A2($eriktim$elm_protocol_buffers$Protobuf$Decode$map, $elm$core$Maybe$Just, $author$project$Proto$Response$decodeRestore),
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{restore: a});
				}))
		]));
var $author$project$Proto$Response$StatusUnrecognized_ = function (a) {
	return {$: 'StatusUnrecognized_', a: a};
};
var $author$project$Proto$Response$Status_FAILED = {$: 'Status_FAILED'};
var $author$project$Proto$Response$Status_SUCCESS = {$: 'Status_SUCCESS'};
var $eriktim$elm_protocol_buffers$Protobuf$Decode$int32 = A2($eriktim$elm_protocol_buffers$Protobuf$Decode$packedDecoder, $eriktim$elm_protocol_buffers$Internal$Protobuf$VarInt, $eriktim$elm_protocol_buffers$Protobuf$Decode$varIntDecoder);
var $author$project$Proto$Response$decodeStatus = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$map,
	function (i) {
		switch (i) {
			case 0:
				return $author$project$Proto$Response$Status_SUCCESS;
			case 1:
				return $author$project$Proto$Response$Status_FAILED;
			default:
				return $author$project$Proto$Response$StatusUnrecognized_(i);
		}
	},
	$eriktim$elm_protocol_buffers$Protobuf$Decode$int32);
var $author$project$Proto$Response$defaultResponse = {data: $elm$core$Maybe$Nothing, error: '', status: $author$project$Proto$Response$Status_SUCCESS};
var $author$project$Proto$Response$decodeResponse = A2(
	$eriktim$elm_protocol_buffers$Protobuf$Decode$message,
	$author$project$Proto$Response$defaultResponse,
	_List_fromArray(
		[
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			1,
			$eriktim$elm_protocol_buffers$Protobuf$Decode$string,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{error: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			2,
			$author$project$Proto$Response$decodeStatus,
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{status: a});
				})),
			A3(
			$eriktim$elm_protocol_buffers$Protobuf$Decode$optional,
			3,
			A2($eriktim$elm_protocol_buffers$Protobuf$Decode$map, $elm$core$Maybe$Just, $author$project$Proto$Response$decodeData),
			F2(
				function (a, r) {
					return _Utils_update(
						r,
						{data: a});
				}))
		]));
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 'BadStatus_', a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 'BadUrl_', a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 'GoodStatus_', a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 'NetworkError_'};
var $elm$http$Http$Receiving = function (a) {
	return {$: 'Receiving', a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 'Sending', a: a};
};
var $elm$http$Http$Timeout_ = {$: 'Timeout_'};
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$BadBody = function (a) {
	return {$: 'BadBody', a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 'BadStatus', a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 'BadUrl', a: a};
};
var $elm$http$Http$NetworkError = {$: 'NetworkError'};
var $elm$http$Http$Timeout = {$: 'Timeout'};
var $elm$bytes$Bytes$Decode$decode = F2(
	function (_v0, bs) {
		var decoder = _v0.a;
		return A2(_Bytes_decode, decoder, bs);
	});
var $elm$bytes$Bytes$width = _Bytes_width;
var $eriktim$elm_protocol_buffers$Protobuf$Decode$decode = F2(
	function (_v0, bs) {
		var decoder = _v0.a;
		var wireType = $eriktim$elm_protocol_buffers$Internal$Protobuf$LengthDelimited(
			$elm$bytes$Bytes$width(bs));
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			A2(
				$elm$bytes$Bytes$Decode$decode,
				decoder(wireType),
				bs));
	});
var $elm$http$Http$expectBytesResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'arraybuffer',
			_Http_toDataView,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $author$project$Common$CustomHttp$expectProto = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectBytesResponse,
			toMsg,
			function (response) {
				switch (response.$) {
					case 'BadUrl_':
						var url = response.a;
						return $elm$core$Result$Err(
							$elm$http$Http$BadUrl(url));
					case 'Timeout_':
						return $elm$core$Result$Err($elm$http$Http$Timeout);
					case 'NetworkError_':
						return $elm$core$Result$Err($elm$http$Http$NetworkError);
					case 'BadStatus_':
						var metadata = response.a;
						var body = response.b;
						if (metadata.statusCode === 422) {
							var _v1 = A2($eriktim$elm_protocol_buffers$Protobuf$Decode$decode, decoder, body);
							if (_v1.$ === 'Just') {
								var value = _v1.a;
								return $elm$core$Result$Ok(value);
							} else {
								return $elm$core$Result$Err(
									$elm$http$Http$BadBody('Protobuf decoder error'));
							}
						} else {
							return $elm$core$Result$Err(
								$elm$http$Http$BadStatus(metadata.statusCode));
						}
					default:
						var body = response.b;
						var _v2 = A2($eriktim$elm_protocol_buffers$Protobuf$Decode$decode, decoder, body);
						if (_v2.$ === 'Just') {
							var value = _v2.a;
							return $elm$core$Result$Ok(value);
						} else {
							return $elm$core$Result$Err(
								$elm$http$Http$BadBody('Protobuf decoder error'));
						}
				}
			});
	});
var $elm$http$Http$Header = F2(
	function (a, b) {
		return {$: 'Header', a: a, b: b};
	});
var $elm$http$Http$header = $elm$http$Http$Header;
var $elm$http$Http$Request = function (a) {
	return {$: 'Request', a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {reqs: reqs, subs: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (cmd.$ === 'Cancel') {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 'Nothing') {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.tracker;
							if (_v4.$ === 'Nothing') {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.reqs));
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.subs)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 'Cancel', a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (cmd.$ === 'Cancel') {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					allowCookiesFromOtherDomains: r.allowCookiesFromOtherDomains,
					body: r.body,
					expect: A2(_Http_mapExpect, func, r.expect),
					headers: r.headers,
					method: r.method,
					timeout: r.timeout,
					tracker: r.tracker,
					url: r.url
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 'MySub', a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{allowCookiesFromOtherDomains: false, body: r.body, expect: r.expect, headers: r.headers, method: r.method, timeout: r.timeout, tracker: r.tracker, url: r.url}));
};
var $author$project$Pages$Admin$getOrders = F3(
	function (env, user, storage) {
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$emptyBody,
				expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Admin$OrderResp, $author$project$Proto$Response$decodeResponse),
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'Bearer ' + user.token)
					]),
				method: 'GET',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: env.serverUrl + '/admin/restores'
			});
	});
var $author$project$Request$replaceRoute = F2(
	function (route, req) {
		return A2(
			$elm$browser$Browser$Navigation$replaceUrl,
			req.key,
			$author$project$Gen$Route$toHref(route));
	});
var $author$project$Pages$Admin$init = F3(
	function (shared, user, req) {
		var model = A9(
			$author$project$Pages$Admin$Model,
			$author$project$Pages$Admin$None,
			_List_Nil,
			_List_Nil,
			_List_Nil,
			A6($author$project$Proto$Response$QueueForm, '', '', '', '', '', ''),
			'',
			1,
			1,
			false);
		return (!user.admin) ? _Utils_Tuple2(
			model,
			A2($author$project$Request$replaceRoute, $author$project$Gen$Route$Dashboard, req)) : _Utils_Tuple2(
			model,
			A3($author$project$Pages$Admin$getOrders, shared.env, user, shared.storage));
	});
var $ryan_haskell$elm_spa$ElmSpa$Page$Provide = function (a) {
	return {$: 'Provide', a: a};
};
var $ryan_haskell$elm_spa$ElmSpa$Page$RedirectTo = function (a) {
	return {$: 'RedirectTo', a: a};
};
var $author$project$Auth$beforeProtectedInit = F2(
	function (shared, req) {
		var _v0 = shared.storage.user;
		if (_v0.$ === 'Just') {
			var user = _v0.a;
			return $ryan_haskell$elm_spa$ElmSpa$Page$Provide(user);
		} else {
			return $ryan_haskell$elm_spa$ElmSpa$Page$RedirectTo($author$project$Gen$Route$Login);
		}
	});
var $author$project$Effect$none = $author$project$Effect$None;
var $ryan_haskell$elm_spa$ElmSpa$Page$protected = function (options) {
	var protect = F2(
		function (toPage, toRecord) {
			return $ryan_haskell$elm_spa$ElmSpa$Page$Page(
				F2(
					function (shared, req) {
						var _v0 = A2(options.beforeInit, shared, req);
						if (_v0.$ === 'Provide') {
							var user = _v0.a;
							return $elm$core$Result$Ok(
								toPage(
									toRecord(user)));
						} else {
							var route = _v0.a;
							return $elm$core$Result$Err(route);
						}
					}));
		});
	return {
		advanced: protect($ryan_haskell$elm_spa$ElmSpa$Page$adapters.advanced),
		element: protect(
			$ryan_haskell$elm_spa$ElmSpa$Page$adapters.element(options.fromCmd)),
		sandbox: protect(
			$ryan_haskell$elm_spa$ElmSpa$Page$adapters.sandbox(options.effectNone)),
		_static: protect(
			$ryan_haskell$elm_spa$ElmSpa$Page$adapters._static(options.effectNone))
	};
};
var $author$project$Page$protected = $ryan_haskell$elm_spa$ElmSpa$Page$protected(
	{beforeInit: $author$project$Auth$beforeProtectedInit, effectNone: $author$project$Effect$none, fromCmd: $author$project$Effect$fromCmd});
var $author$project$Pages$Admin$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $author$project$Pages$Admin$Loading = {$: 'Loading'};
var $author$project$Pages$Admin$Success = function (a) {
	return {$: 'Success', a: a};
};
var $author$project$Common$PageViewer$checkRestoreContainsSearch = F2(
	function (search, restore) {
		return (A2($elm$core$String$contains, search, restore.id) || (A2($elm$core$String$contains, search, restore.timestamp) || (A2($elm$core$String$contains, search, restore.domain) || (A2($elm$core$String$contains, search, restore.status) || (A2($elm$core$String$contains, search, restore.s3Url) || (A2($elm$core$String$contains, search, restore.transactDate) || (A2($elm$core$String$contains, search, restore.username) || A2($elm$core$String$contains, search, restore.email)))))))) ? true : false;
	});
var $author$project$Storage$save = _Platform_outgoingPort('save', $elm$core$Basics$identity);
var $author$project$Storage$cartItemToJson = function (item) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'domain',
				$elm$json$Json$Encode$string(item.domain)),
				_Utils_Tuple2(
				'timestamp',
				$elm$json$Json$Encode$string(item.timestamp))
			]));
};
var $author$project$Storage$cartToJson = function (cart) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'items',
				A2($elm$json$Json$Encode$list, $author$project$Storage$cartItemToJson, cart.items))
			]));
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $author$project$Domain$User$userEncoder = function (user) {
	if (user.$ === 'Just') {
		var user_ = user.a;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'token',
					$elm$json$Json$Encode$string(user_.token)),
					_Utils_Tuple2(
					'subscribed',
					$elm$json$Json$Encode$bool(user_.subscribed)),
					_Utils_Tuple2(
					'admin',
					$elm$json$Json$Encode$bool(user_.admin))
				]));
	} else {
		return $elm$json$Json$Encode$object(_List_Nil);
	}
};
var $author$project$Storage$storageToJson = function (storage) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'cart',
				$author$project$Storage$cartToJson(storage.cart)),
				_Utils_Tuple2(
				'user',
				$author$project$Domain$User$userEncoder(storage.user))
			]));
};
var $author$project$Storage$signOut = function (storage) {
	return $author$project$Storage$save(
		$author$project$Storage$storageToJson(
			_Utils_update(
				storage,
				{user: $elm$core$Maybe$Nothing})));
};
var $author$project$Pages$Admin$errorHandler = F3(
	function (model, storage, err) {
		if (err.$ === 'BadStatus') {
			var code = err.a;
			return (code === 401) ? _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Admin$Failure('Login session expired')
					}),
				$author$project$Storage$signOut(storage)) : _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Admin$Failure('Unable to fetch user details, please try again later')
					}),
				$elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Admin$Failure('Unable to fetch user details, please try again later')
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Common$PageViewer$filterPages = F2(
	function (pageNum, splitLists) {
		var sublist = $elm$core$List$head(
			$elm$core$List$reverse(
				A2($elm$core$List$take, pageNum, splitLists)));
		if (sublist.$ === 'Just') {
			var l = sublist.a;
			return l;
		} else {
			return _List_Nil;
		}
	});
var $author$project$Pages$Admin$numResultsPerPage = 10;
var $author$project$Pages$Admin$QueueResp = function (a) {
	return {$: 'QueueResp', a: a};
};
var $elm$http$Http$bytesBody = _Http_pair;
var $elm$bytes$Bytes$Encode$Bytes = function (a) {
	return {$: 'Bytes', a: a};
};
var $elm$bytes$Bytes$Encode$bytes = $elm$bytes$Bytes$Encode$Bytes;
var $elm$bytes$Bytes$Encode$encode = _Bytes_encode;
var $elm$bytes$Bytes$Encode$Seq = F2(
	function (a, b) {
		return {$: 'Seq', a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$getWidths = F2(
	function (width, builders) {
		getWidths:
		while (true) {
			if (!builders.b) {
				return width;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$width = width + $elm$bytes$Bytes$Encode$getWidth(b),
					$temp$builders = bs;
				width = $temp$width;
				builders = $temp$builders;
				continue getWidths;
			}
		}
	});
var $elm$bytes$Bytes$Encode$sequence = function (builders) {
	return A2(
		$elm$bytes$Bytes$Encode$Seq,
		A2($elm$bytes$Bytes$Encode$getWidths, 0, builders),
		builders);
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$encode = function (encoder) {
	switch (encoder.$) {
		case 'Encoder':
			var _v1 = encoder.b;
			var encoder_ = _v1.b;
			return $elm$bytes$Bytes$Encode$encode(encoder_);
		case 'ListEncoder':
			var encoders = encoder.a;
			return $elm$bytes$Bytes$Encode$encode(
				$elm$bytes$Bytes$Encode$sequence(
					A2(
						$elm$core$List$map,
						A2($elm$core$Basics$composeL, $elm$bytes$Bytes$Encode$bytes, $eriktim$elm_protocol_buffers$Protobuf$Encode$encode),
						encoders)));
		default:
			return $elm$bytes$Bytes$Encode$encode(
				$elm$bytes$Bytes$Encode$sequence(_List_Nil));
	}
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$Encoder = F2(
	function (a, b) {
		return {$: 'Encoder', a: a, b: b};
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$sequence = function (items) {
	var width = $elm$core$List$sum(
		A2($elm$core$List$map, $elm$core$Tuple$first, items));
	return _Utils_Tuple2(
		width,
		$elm$bytes$Bytes$Encode$sequence(
			A2($elm$core$List$map, $elm$core$Tuple$second, items)));
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$bytes$Bytes$Encode$U8 = function (a) {
	return {$: 'U8', a: a};
};
var $elm$bytes$Bytes$Encode$unsignedInt8 = $elm$bytes$Bytes$Encode$U8;
var $eriktim$elm_protocol_buffers$Protobuf$Encode$toVarIntEncoders = function (value) {
	var higherBits = value >>> 7;
	var base128 = 127 & value;
	return (!(!higherBits)) ? A2(
		$elm$core$List$cons,
		$elm$bytes$Bytes$Encode$unsignedInt8(128 | base128),
		$eriktim$elm_protocol_buffers$Protobuf$Encode$toVarIntEncoders(higherBits)) : _List_fromArray(
		[
			$elm$bytes$Bytes$Encode$unsignedInt8(base128)
		]);
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$varInt = function (value) {
	var encoders = $eriktim$elm_protocol_buffers$Protobuf$Encode$toVarIntEncoders(value);
	return _Utils_Tuple2(
		$elm$core$List$length(encoders),
		$elm$bytes$Bytes$Encode$sequence(encoders));
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$tag = F2(
	function (fieldNumber, wireType) {
		var encodeTag = function (base4) {
			return $eriktim$elm_protocol_buffers$Protobuf$Encode$varInt((fieldNumber << 3) | base4);
		};
		switch (wireType.$) {
			case 'VarInt':
				return encodeTag(0);
			case 'Bit64':
				return encodeTag(1);
			case 'LengthDelimited':
				var width = wireType.a;
				return $eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(
					_List_fromArray(
						[
							encodeTag(2),
							$eriktim$elm_protocol_buffers$Protobuf$Encode$varInt(width)
						]));
			case 'StartGroup':
				return encodeTag(3);
			case 'EndGroup':
				return encodeTag(4);
			default:
				return encodeTag(5);
		}
	});
var $eriktim$elm_protocol_buffers$Protobuf$Encode$unwrap = function (encoder) {
	if (encoder.$ === 'Encoder') {
		var encoder_ = encoder.b;
		return $elm$core$Maybe$Just(encoder_);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$toPackedEncoder = function (encoders) {
	if (encoders.b && (encoders.a.$ === 'Encoder')) {
		var _v1 = encoders.a;
		var wireType = _v1.a;
		var encoder = _v1.b;
		var others = encoders.b;
		if (wireType.$ === 'LengthDelimited') {
			return $elm$core$Maybe$Nothing;
		} else {
			return $elm$core$Maybe$Just(
				$eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(
					A2(
						$elm$core$List$cons,
						encoder,
						A2($elm$core$List$filterMap, $eriktim$elm_protocol_buffers$Protobuf$Encode$unwrap, others))));
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$toKeyValuePairEncoder = function (_v0) {
	var fieldNumber = _v0.a;
	var encoder = _v0.b;
	switch (encoder.$) {
		case 'Encoder':
			var wireType = encoder.a;
			var encoder_ = encoder.b;
			return $eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(
				_List_fromArray(
					[
						A2($eriktim$elm_protocol_buffers$Protobuf$Encode$tag, fieldNumber, wireType),
						encoder_
					]));
		case 'ListEncoder':
			var encoders = encoder.a;
			var _v2 = $eriktim$elm_protocol_buffers$Protobuf$Encode$toPackedEncoder(encoders);
			if (_v2.$ === 'Just') {
				var encoder_ = _v2.a;
				return $eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(
					_List_fromArray(
						[
							A2(
							$eriktim$elm_protocol_buffers$Protobuf$Encode$tag,
							fieldNumber,
							$eriktim$elm_protocol_buffers$Internal$Protobuf$LengthDelimited(encoder_.a)),
							encoder_
						]));
			} else {
				return $eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(
					A2(
						$elm$core$List$map,
						A2(
							$elm$core$Basics$composeL,
							$eriktim$elm_protocol_buffers$Protobuf$Encode$toKeyValuePairEncoder,
							$elm$core$Tuple$pair(fieldNumber)),
						encoders));
			}
		default:
			return $eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(_List_Nil);
	}
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$message = function (items) {
	return function (e) {
		return A2(
			$eriktim$elm_protocol_buffers$Protobuf$Encode$Encoder,
			$eriktim$elm_protocol_buffers$Internal$Protobuf$LengthDelimited(e.a),
			e);
	}(
		$eriktim$elm_protocol_buffers$Protobuf$Encode$sequence(
			A2(
				$elm$core$List$map,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$toKeyValuePairEncoder,
				A2($elm$core$List$sortBy, $elm$core$Tuple$first, items))));
};
var $elm$bytes$Bytes$Encode$getStringWidth = _Bytes_getStringWidth;
var $elm$bytes$Bytes$Encode$Utf8 = F2(
	function (a, b) {
		return {$: 'Utf8', a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$string = function (str) {
	return A2(
		$elm$bytes$Bytes$Encode$Utf8,
		_Bytes_getStringWidth(str),
		str);
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$string = function (v) {
	var width = $elm$bytes$Bytes$Encode$getStringWidth(v);
	return A2(
		$eriktim$elm_protocol_buffers$Protobuf$Encode$Encoder,
		$eriktim$elm_protocol_buffers$Internal$Protobuf$LengthDelimited(width),
		_Utils_Tuple2(
			width,
			$elm$bytes$Bytes$Encode$string(v)));
};
var $author$project$Proto$Response$encodeQueueForm = function (value) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(
		_List_fromArray(
			[
				_Utils_Tuple2(
				1,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.domain)),
				_Utils_Tuple2(
				2,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.timestamp)),
				_Utils_Tuple2(
				3,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.restoreId)),
				_Utils_Tuple2(
				4,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.email)),
				_Utils_Tuple2(
				5,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.action)),
				_Utils_Tuple2(
				6,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.method))
			]));
};
var $author$project$Pages$Admin$queueMessage = F3(
	function (env, user, model) {
		return _Utils_Tuple2(
			model,
			$elm$http$Http$request(
				{
					body: A2(
						$elm$http$Http$bytesBody,
						'application/protobuf',
						$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
							$author$project$Proto$Response$encodeQueueForm(model.queue))),
					expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Admin$QueueResp, $author$project$Proto$Response$decodeResponse),
					headers: _List_fromArray(
						[
							A2($elm$http$Http$header, 'Authorization', 'Bearer ' + user.token)
						]),
					method: 'POST',
					timeout: $elm$core$Maybe$Nothing,
					tracker: $elm$core$Maybe$Nothing,
					url: env.serverUrl + '/admin/queue'
				}));
	});
var $author$project$Common$PageViewer$splitList = F2(
	function (i, list) {
		var _v0 = A2($elm$core$List$take, i, list);
		if (!_v0.b) {
			return _List_Nil;
		} else {
			var listHead = _v0;
			return A2(
				$elm$core$List$cons,
				listHead,
				A2(
					$author$project$Common$PageViewer$splitList,
					i,
					A2($elm$core$List$drop, i, list)));
		}
	});
var $author$project$Pages$Admin$update = F5(
	function (env, user, storage, msg, model) {
		switch (msg.$) {
			case 'OrderResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v2 = resp.status;
					if (_v2.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Admin$Failure(resp.error)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v3 = resp.data;
						if (_v3.$ === 'Just') {
							var data = _v3.a;
							var sList = A2($author$project$Common$PageViewer$splitList, $author$project$Pages$Admin$numResultsPerPage, data.restores);
							var _v4 = $elm$core$List$head(sList);
							if (_v4.$ === 'Just') {
								var r = _v4.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											numPages: $elm$core$List$length(sList),
											restores: data.restores,
											restoresSplit: sList,
											status: $author$project$Pages$Admin$None,
											tempRestores: r
										}),
									$elm$core$Platform$Cmd$none);
							} else {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{restores: data.restores, restoresSplit: sList, status: $author$project$Pages$Admin$None, tempRestores: _List_Nil}),
									$elm$core$Platform$Cmd$none);
							}
						} else {
							return A3(
								$author$project$Pages$Admin$errorHandler,
								model,
								storage,
								$elm$http$Http$BadBody('Unable to decode'));
						}
					}
				} else {
					var err = result.a;
					return A3($author$project$Pages$Admin$errorHandler, model, storage, err);
				}
			case 'QueueResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v6 = resp.status;
					if (_v6.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Admin$Failure(resp.error)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									queue: A6($author$project$Proto$Response$QueueForm, '', '', '', '', '', ''),
									status: $author$project$Pages$Admin$Success('Successfully queued message')
								}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = result.a;
					return A3($author$project$Pages$Admin$errorHandler, model, storage, err);
				}
			case 'ClickedQueue':
				return ((model.queue.domain !== '') && ((model.queue.timestamp !== '') && ((model.queue.restoreId !== '') && ((model.queue.email !== '') && (model.queue.action !== ''))))) ? A3(
					$author$project$Pages$Admin$queueMessage,
					env,
					user,
					_Utils_update(
						model,
						{status: $author$project$Pages$Admin$Loading})) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$Admin$Failure('Cannot have blank fields')
						}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeDomain':
				var domain = msg.a;
				var oldForm = model.queue;
				var newForm = _Utils_update(
					oldForm,
					{domain: domain});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{queue: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeTimestamp':
				var timestamp = msg.a;
				var oldForm = model.queue;
				var newForm = _Utils_update(
					oldForm,
					{timestamp: timestamp});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{queue: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeRestoreID':
				var restoreId = msg.a;
				var oldForm = model.queue;
				var newForm = _Utils_update(
					oldForm,
					{restoreId: restoreId});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{queue: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeEmail':
				var email = msg.a;
				var oldForm = model.queue;
				var newForm = _Utils_update(
					oldForm,
					{email: email});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{queue: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeAction':
				var action = msg.a;
				var oldForm = model.queue;
				var newForm = _Utils_update(
					oldForm,
					{action: action});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{queue: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeMethod':
				var method = msg.a;
				var oldForm = model.queue;
				var newForm = _Utils_update(
					oldForm,
					{method: method});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{queue: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ClickedQueueOrders':
				var restore = msg.a;
				var oldForm = model.queue;
				var newForm = _Utils_update(
					oldForm,
					{action: 'restore', domain: restore.domain, email: restore.email, method: 'main', restoreId: restore.id, timestamp: restore.timestamp});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{queue: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ClickedResend':
				var restore = msg.a;
				var oldForm = model.queue;
				var newForm = _Utils_update(
					oldForm,
					{action: 'resend', domain: restore.domain, email: restore.email, method: 'blank', restoreId: restore.id, timestamp: restore.timestamp});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{queue: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ClickedClear':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							queue: A6($author$project$Proto$Response$QueueForm, '', '', '', '', '', '')
						}),
					$elm$core$Platform$Cmd$none);
			case 'ClickedRefresh':
				return _Utils_Tuple2(
					model,
					A3($author$project$Pages$Admin$getOrders, env, user, storage));
			case 'ChangeSearch':
				var search = msg.a;
				var sList = A2(
					$author$project$Common$PageViewer$splitList,
					$author$project$Pages$Admin$numResultsPerPage,
					A2(
						$elm$core$List$filter,
						$author$project$Common$PageViewer$checkRestoreContainsSearch(search),
						model.restores));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							currentPage: model.currentPage,
							numPages: $elm$core$List$length(sList),
							search: search,
							tempRestores: A2($author$project$Common$PageViewer$filterPages, model.currentPage, sList)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ClickedPageNum':
				var num = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							currentPage: num,
							tempRestores: A2($author$project$Common$PageViewer$filterPages, num, model.restoresSplit)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ClickedNextPage':
				if (_Utils_cmp(model.currentPage + 1, model.numPages) < 1) {
					var num = model.currentPage + 1;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								currentPage: num,
								tempRestores: A2($author$project$Common$PageViewer$filterPages, num, model.restoresSplit)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'ClickedPrevPage':
				if ((model.currentPage - 1) > 0) {
					var num = model.currentPage - 1;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								currentPage: num,
								tempRestores: A2($author$project$Common$PageViewer$filterPages, num, model.restoresSplit)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				return model.showMenu ? _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: false}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: true}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Admin$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$Admin$viewMain = A2(
	$elm$html$Html$main_,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('container mb-auto')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mt-3 main-header-text-title')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Administration')
				]))
		]));
var $author$project$Pages$Admin$ChangeSearch = function (a) {
	return {$: 'ChangeSearch', a: a};
};
var $author$project$Pages$Admin$ClickedNextPage = {$: 'ClickedNextPage'};
var $author$project$Pages$Admin$ClickedPageNum = function (a) {
	return {$: 'ClickedPageNum', a: a};
};
var $author$project$Pages$Admin$ClickedPrevPage = {$: 'ClickedPrevPage'};
var $author$project$Pages$Admin$ClickedRefresh = {$: 'ClickedRefresh'};
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$scope = $elm$html$Html$Attributes$stringProperty('scope');
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $author$project$Common$PageViewer$viewPage = F6(
	function (clickedPrevPage, clickedNextPage, clickedPageNum, currentPage, numPages, pageNum) {
		return (!pageNum) ? A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					(currentPage === 1) ? $elm$html$Html$Attributes$class('page-item disabled') : $elm$html$Html$Attributes$class('page-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('page-link'),
							$elm$html$Html$Attributes$tabindex(-1),
							$elm$html$Html$Events$onClick(clickedPrevPage)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Previous')
						]))
				])) : (_Utils_eq(pageNum, numPages + 1) ? A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					_Utils_eq(currentPage, numPages) ? $elm$html$Html$Attributes$class('page-item disabled') : $elm$html$Html$Attributes$class('page-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('page-link'),
							$elm$html$Html$Events$onClick(clickedNextPage)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Next')
						]))
				])) : A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					_Utils_eq(currentPage, pageNum) ? $elm$html$Html$Attributes$class('page-item active') : $elm$html$Html$Attributes$class('page-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('page-link'),
							$elm$html$Html$Events$onClick(
							clickedPageNum(pageNum))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(pageNum))
						]))
				])));
	});
var $author$project$Common$PageViewer$viewPages = F5(
	function (clickedPrevPage, clickedNextPage, clickedPageNum, currentPage, numPages) {
		return A2(
			$elm$html$Html$nav,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Page navigation example')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$ul,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('pagination justify-content-center')
						]),
					A2(
						$elm$core$List$map,
						A5($author$project$Common$PageViewer$viewPage, clickedPrevPage, clickedNextPage, clickedPageNum, currentPage, numPages),
						A2($elm$core$List$range, 0, numPages + 1)))
				]));
	});
var $author$project$Pages$Admin$ClickedQueueOrders = function (a) {
	return {$: 'ClickedQueueOrders', a: a};
};
var $author$project$Pages$Admin$ClickedResend = function (a) {
	return {$: 'ClickedResend', a: a};
};
var $ryan_haskell$date_format$DateFormat$DayOfMonthFixed = {$: 'DayOfMonthFixed'};
var $ryan_haskell$date_format$DateFormat$dayOfMonthFixed = $ryan_haskell$date_format$DateFormat$DayOfMonthFixed;
var $ryan_haskell$date_format$DateFormat$Language$Language = F6(
	function (toMonthName, toMonthAbbreviation, toWeekdayName, toWeekdayAbbreviation, toAmPm, toOrdinalSuffix) {
		return {toAmPm: toAmPm, toMonthAbbreviation: toMonthAbbreviation, toMonthName: toMonthName, toOrdinalSuffix: toOrdinalSuffix, toWeekdayAbbreviation: toWeekdayAbbreviation, toWeekdayName: toWeekdayName};
	});
var $ryan_haskell$date_format$DateFormat$Language$toEnglishAmPm = function (hour) {
	return (hour > 11) ? 'pm' : 'am';
};
var $ryan_haskell$date_format$DateFormat$Language$toEnglishMonthName = function (month) {
	switch (month.$) {
		case 'Jan':
			return 'January';
		case 'Feb':
			return 'February';
		case 'Mar':
			return 'March';
		case 'Apr':
			return 'April';
		case 'May':
			return 'May';
		case 'Jun':
			return 'June';
		case 'Jul':
			return 'July';
		case 'Aug':
			return 'August';
		case 'Sep':
			return 'September';
		case 'Oct':
			return 'October';
		case 'Nov':
			return 'November';
		default:
			return 'December';
	}
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $ryan_haskell$date_format$DateFormat$Language$toEnglishSuffix = function (num) {
	var _v0 = A2($elm$core$Basics$modBy, 100, num);
	switch (_v0) {
		case 11:
			return 'th';
		case 12:
			return 'th';
		case 13:
			return 'th';
		default:
			var _v1 = A2($elm$core$Basics$modBy, 10, num);
			switch (_v1) {
				case 1:
					return 'st';
				case 2:
					return 'nd';
				case 3:
					return 'rd';
				default:
					return 'th';
			}
	}
};
var $ryan_haskell$date_format$DateFormat$Language$toEnglishWeekdayName = function (weekday) {
	switch (weekday.$) {
		case 'Mon':
			return 'Monday';
		case 'Tue':
			return 'Tuesday';
		case 'Wed':
			return 'Wednesday';
		case 'Thu':
			return 'Thursday';
		case 'Fri':
			return 'Friday';
		case 'Sat':
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var $ryan_haskell$date_format$DateFormat$Language$english = A6(
	$ryan_haskell$date_format$DateFormat$Language$Language,
	$ryan_haskell$date_format$DateFormat$Language$toEnglishMonthName,
	A2(
		$elm$core$Basics$composeR,
		$ryan_haskell$date_format$DateFormat$Language$toEnglishMonthName,
		$elm$core$String$left(3)),
	$ryan_haskell$date_format$DateFormat$Language$toEnglishWeekdayName,
	A2(
		$elm$core$Basics$composeR,
		$ryan_haskell$date_format$DateFormat$Language$toEnglishWeekdayName,
		$elm$core$String$left(3)),
	$ryan_haskell$date_format$DateFormat$Language$toEnglishAmPm,
	$ryan_haskell$date_format$DateFormat$Language$toEnglishSuffix);
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.start, posixMinutes) < 0) {
					return posixMinutes + era.offset;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			24,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var $ryan_haskell$date_format$DateFormat$amPm = F3(
	function (language, zone, posix) {
		return language.toAmPm(
			A2($elm$time$Time$toHour, zone, posix));
	});
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		day: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		month: month,
		year: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).day;
	});
var $ryan_haskell$date_format$DateFormat$dayOfMonth = $elm$time$Time$toDay;
var $elm$time$Time$Sun = {$: 'Sun'};
var $elm$time$Time$Fri = {$: 'Fri'};
var $elm$time$Time$Mon = {$: 'Mon'};
var $elm$time$Time$Sat = {$: 'Sat'};
var $elm$time$Time$Thu = {$: 'Thu'};
var $elm$time$Time$Tue = {$: 'Tue'};
var $elm$time$Time$Wed = {$: 'Wed'};
var $ryan_haskell$date_format$DateFormat$days = _List_fromArray(
	[$elm$time$Time$Sun, $elm$time$Time$Mon, $elm$time$Time$Tue, $elm$time$Time$Wed, $elm$time$Time$Thu, $elm$time$Time$Fri, $elm$time$Time$Sat]);
var $elm$time$Time$toWeekday = F2(
	function (zone, time) {
		var _v0 = A2(
			$elm$core$Basics$modBy,
			7,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60 * 24));
		switch (_v0) {
			case 0:
				return $elm$time$Time$Thu;
			case 1:
				return $elm$time$Time$Fri;
			case 2:
				return $elm$time$Time$Sat;
			case 3:
				return $elm$time$Time$Sun;
			case 4:
				return $elm$time$Time$Mon;
			case 5:
				return $elm$time$Time$Tue;
			default:
				return $elm$time$Time$Wed;
		}
	});
var $ryan_haskell$date_format$DateFormat$dayOfWeek = F2(
	function (zone, posix) {
		return function (_v1) {
			var i = _v1.a;
			return i;
		}(
			A2(
				$elm$core$Maybe$withDefault,
				_Utils_Tuple2(0, $elm$time$Time$Sun),
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (_v0) {
							var day = _v0.b;
							return _Utils_eq(
								day,
								A2($elm$time$Time$toWeekday, zone, posix));
						},
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, day) {
									return _Utils_Tuple2(i, day);
								}),
							$ryan_haskell$date_format$DateFormat$days)))));
	});
var $ryan_haskell$date_format$DateFormat$isLeapYear = function (year_) {
	return (!(!A2($elm$core$Basics$modBy, 4, year_))) ? false : ((!(!A2($elm$core$Basics$modBy, 100, year_))) ? true : ((!(!A2($elm$core$Basics$modBy, 400, year_))) ? false : true));
};
var $ryan_haskell$date_format$DateFormat$daysInMonth = F2(
	function (year_, month) {
		switch (month.$) {
			case 'Jan':
				return 31;
			case 'Feb':
				return $ryan_haskell$date_format$DateFormat$isLeapYear(year_) ? 29 : 28;
			case 'Mar':
				return 31;
			case 'Apr':
				return 30;
			case 'May':
				return 31;
			case 'Jun':
				return 30;
			case 'Jul':
				return 31;
			case 'Aug':
				return 31;
			case 'Sep':
				return 30;
			case 'Oct':
				return 31;
			case 'Nov':
				return 30;
			default:
				return 31;
		}
	});
var $elm$time$Time$Jan = {$: 'Jan'};
var $elm$time$Time$Apr = {$: 'Apr'};
var $elm$time$Time$Aug = {$: 'Aug'};
var $elm$time$Time$Dec = {$: 'Dec'};
var $elm$time$Time$Feb = {$: 'Feb'};
var $elm$time$Time$Jul = {$: 'Jul'};
var $elm$time$Time$Jun = {$: 'Jun'};
var $elm$time$Time$Mar = {$: 'Mar'};
var $elm$time$Time$May = {$: 'May'};
var $elm$time$Time$Nov = {$: 'Nov'};
var $elm$time$Time$Oct = {$: 'Oct'};
var $elm$time$Time$Sep = {$: 'Sep'};
var $ryan_haskell$date_format$DateFormat$months = _List_fromArray(
	[$elm$time$Time$Jan, $elm$time$Time$Feb, $elm$time$Time$Mar, $elm$time$Time$Apr, $elm$time$Time$May, $elm$time$Time$Jun, $elm$time$Time$Jul, $elm$time$Time$Aug, $elm$time$Time$Sep, $elm$time$Time$Oct, $elm$time$Time$Nov, $elm$time$Time$Dec]);
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).month;
		switch (_v0) {
			case 1:
				return $elm$time$Time$Jan;
			case 2:
				return $elm$time$Time$Feb;
			case 3:
				return $elm$time$Time$Mar;
			case 4:
				return $elm$time$Time$Apr;
			case 5:
				return $elm$time$Time$May;
			case 6:
				return $elm$time$Time$Jun;
			case 7:
				return $elm$time$Time$Jul;
			case 8:
				return $elm$time$Time$Aug;
			case 9:
				return $elm$time$Time$Sep;
			case 10:
				return $elm$time$Time$Oct;
			case 11:
				return $elm$time$Time$Nov;
			default:
				return $elm$time$Time$Dec;
		}
	});
var $ryan_haskell$date_format$DateFormat$monthPair = F2(
	function (zone, posix) {
		return A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, $elm$time$Time$Jan),
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var i = _v0.a;
						var m = _v0.b;
						return _Utils_eq(
							m,
							A2($elm$time$Time$toMonth, zone, posix));
					},
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (a, b) {
								return _Utils_Tuple2(a, b);
							}),
						$ryan_haskell$date_format$DateFormat$months))));
	});
var $ryan_haskell$date_format$DateFormat$monthNumber_ = F2(
	function (zone, posix) {
		return 1 + function (_v0) {
			var i = _v0.a;
			var m = _v0.b;
			return i;
		}(
			A2($ryan_haskell$date_format$DateFormat$monthPair, zone, posix));
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).year;
	});
var $ryan_haskell$date_format$DateFormat$dayOfYear = F2(
	function (zone, posix) {
		var monthsBeforeThisOne = A2(
			$elm$core$List$take,
			A2($ryan_haskell$date_format$DateFormat$monthNumber_, zone, posix) - 1,
			$ryan_haskell$date_format$DateFormat$months);
		var daysBeforeThisMonth = $elm$core$List$sum(
			A2(
				$elm$core$List$map,
				$ryan_haskell$date_format$DateFormat$daysInMonth(
					A2($elm$time$Time$toYear, zone, posix)),
				monthsBeforeThisOne));
		return daysBeforeThisMonth + A2($ryan_haskell$date_format$DateFormat$dayOfMonth, zone, posix);
	});
var $ryan_haskell$date_format$DateFormat$quarter = F2(
	function (zone, posix) {
		return (A2($ryan_haskell$date_format$DateFormat$monthNumber_, zone, posix) / 4) | 0;
	});
var $ryan_haskell$date_format$DateFormat$toFixedLength = F2(
	function (totalChars, num) {
		var numStr = $elm$core$String$fromInt(num);
		var numZerosNeeded = totalChars - $elm$core$String$length(numStr);
		var zeros = A2(
			$elm$core$String$join,
			'',
			A2(
				$elm$core$List$map,
				function (_v0) {
					return '0';
				},
				A2($elm$core$List$range, 1, numZerosNeeded)));
		return _Utils_ap(zeros, numStr);
	});
var $elm$core$String$toLower = _String_toLower;
var $elm$time$Time$toMillis = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			1000,
			$elm$time$Time$posixToMillis(time));
	});
var $elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2($elm$time$Time$toAdjustedMinutes, zone, time));
	});
var $ryan_haskell$date_format$DateFormat$toNonMilitary = function (num) {
	return (!num) ? 12 : ((num <= 12) ? num : (num - 12));
};
var $elm$time$Time$toSecond = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				1000));
	});
var $elm$core$String$toUpper = _String_toUpper;
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$core$Basics$round = _Basics_round;
var $ryan_haskell$date_format$DateFormat$millisecondsPerYear = $elm$core$Basics$round((((1000 * 60) * 60) * 24) * 365.25);
var $ryan_haskell$date_format$DateFormat$firstDayOfYear = F2(
	function (zone, time) {
		return $elm$time$Time$millisToPosix(
			$ryan_haskell$date_format$DateFormat$millisecondsPerYear * A2($elm$time$Time$toYear, zone, time));
	});
var $ryan_haskell$date_format$DateFormat$weekOfYear = F2(
	function (zone, posix) {
		var firstDay = A2($ryan_haskell$date_format$DateFormat$firstDayOfYear, zone, posix);
		var firstDayOffset = A2($ryan_haskell$date_format$DateFormat$dayOfWeek, zone, firstDay);
		var daysSoFar = A2($ryan_haskell$date_format$DateFormat$dayOfYear, zone, posix);
		return (((daysSoFar + firstDayOffset) / 7) | 0) + 1;
	});
var $ryan_haskell$date_format$DateFormat$year = F2(
	function (zone, time) {
		return $elm$core$String$fromInt(
			A2($elm$time$Time$toYear, zone, time));
	});
var $ryan_haskell$date_format$DateFormat$piece = F4(
	function (language, zone, posix, token) {
		switch (token.$) {
			case 'MonthNumber':
				return $elm$core$String$fromInt(
					A2($ryan_haskell$date_format$DateFormat$monthNumber_, zone, posix));
			case 'MonthSuffix':
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2($ryan_haskell$date_format$DateFormat$monthNumber_, zone, posix));
			case 'MonthFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					A2($ryan_haskell$date_format$DateFormat$monthNumber_, zone, posix));
			case 'MonthNameAbbreviated':
				return language.toMonthAbbreviation(
					A2($elm$time$Time$toMonth, zone, posix));
			case 'MonthNameFull':
				return language.toMonthName(
					A2($elm$time$Time$toMonth, zone, posix));
			case 'QuarterNumber':
				return $elm$core$String$fromInt(
					1 + A2($ryan_haskell$date_format$DateFormat$quarter, zone, posix));
			case 'QuarterSuffix':
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					1 + A2($ryan_haskell$date_format$DateFormat$quarter, zone, posix));
			case 'DayOfMonthNumber':
				return $elm$core$String$fromInt(
					A2($ryan_haskell$date_format$DateFormat$dayOfMonth, zone, posix));
			case 'DayOfMonthSuffix':
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2($ryan_haskell$date_format$DateFormat$dayOfMonth, zone, posix));
			case 'DayOfMonthFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					A2($ryan_haskell$date_format$DateFormat$dayOfMonth, zone, posix));
			case 'DayOfYearNumber':
				return $elm$core$String$fromInt(
					A2($ryan_haskell$date_format$DateFormat$dayOfYear, zone, posix));
			case 'DayOfYearSuffix':
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2($ryan_haskell$date_format$DateFormat$dayOfYear, zone, posix));
			case 'DayOfYearFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					3,
					A2($ryan_haskell$date_format$DateFormat$dayOfYear, zone, posix));
			case 'DayOfWeekNumber':
				return $elm$core$String$fromInt(
					A2($ryan_haskell$date_format$DateFormat$dayOfWeek, zone, posix));
			case 'DayOfWeekSuffix':
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2($ryan_haskell$date_format$DateFormat$dayOfWeek, zone, posix));
			case 'DayOfWeekNameAbbreviated':
				return language.toWeekdayAbbreviation(
					A2($elm$time$Time$toWeekday, zone, posix));
			case 'DayOfWeekNameFull':
				return language.toWeekdayName(
					A2($elm$time$Time$toWeekday, zone, posix));
			case 'WeekOfYearNumber':
				return $elm$core$String$fromInt(
					A2($ryan_haskell$date_format$DateFormat$weekOfYear, zone, posix));
			case 'WeekOfYearSuffix':
				return function (num) {
					return _Utils_ap(
						$elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2($ryan_haskell$date_format$DateFormat$weekOfYear, zone, posix));
			case 'WeekOfYearFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					A2($ryan_haskell$date_format$DateFormat$weekOfYear, zone, posix));
			case 'YearNumberLastTwo':
				return A2(
					$elm$core$String$right,
					2,
					A2($ryan_haskell$date_format$DateFormat$year, zone, posix));
			case 'YearNumber':
				return A2($ryan_haskell$date_format$DateFormat$year, zone, posix);
			case 'AmPmUppercase':
				return $elm$core$String$toUpper(
					A3($ryan_haskell$date_format$DateFormat$amPm, language, zone, posix));
			case 'AmPmLowercase':
				return $elm$core$String$toLower(
					A3($ryan_haskell$date_format$DateFormat$amPm, language, zone, posix));
			case 'HourMilitaryNumber':
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toHour, zone, posix));
			case 'HourMilitaryFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					A2($elm$time$Time$toHour, zone, posix));
			case 'HourNumber':
				return $elm$core$String$fromInt(
					$ryan_haskell$date_format$DateFormat$toNonMilitary(
						A2($elm$time$Time$toHour, zone, posix)));
			case 'HourFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					$ryan_haskell$date_format$DateFormat$toNonMilitary(
						A2($elm$time$Time$toHour, zone, posix)));
			case 'HourMilitaryFromOneNumber':
				return $elm$core$String$fromInt(
					1 + A2($elm$time$Time$toHour, zone, posix));
			case 'HourMilitaryFromOneFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					1 + A2($elm$time$Time$toHour, zone, posix));
			case 'MinuteNumber':
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toMinute, zone, posix));
			case 'MinuteFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					A2($elm$time$Time$toMinute, zone, posix));
			case 'SecondNumber':
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toSecond, zone, posix));
			case 'SecondFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					2,
					A2($elm$time$Time$toSecond, zone, posix));
			case 'MillisecondNumber':
				return $elm$core$String$fromInt(
					A2($elm$time$Time$toMillis, zone, posix));
			case 'MillisecondFixed':
				return A2(
					$ryan_haskell$date_format$DateFormat$toFixedLength,
					3,
					A2($elm$time$Time$toMillis, zone, posix));
			default:
				var string = token.a;
				return string;
		}
	});
var $ryan_haskell$date_format$DateFormat$formatWithLanguage = F4(
	function (language, tokens, zone, time) {
		return A2(
			$elm$core$String$join,
			'',
			A2(
				$elm$core$List$map,
				A3($ryan_haskell$date_format$DateFormat$piece, language, zone, time),
				tokens));
	});
var $ryan_haskell$date_format$DateFormat$format = $ryan_haskell$date_format$DateFormat$formatWithLanguage($ryan_haskell$date_format$DateFormat$Language$english);
var $ryan_haskell$date_format$DateFormat$MonthFixed = {$: 'MonthFixed'};
var $ryan_haskell$date_format$DateFormat$monthFixed = $ryan_haskell$date_format$DateFormat$MonthFixed;
var $ryan_haskell$date_format$DateFormat$Text = function (a) {
	return {$: 'Text', a: a};
};
var $ryan_haskell$date_format$DateFormat$text = $ryan_haskell$date_format$DateFormat$Text;
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $ryan_haskell$date_format$DateFormat$YearNumber = {$: 'YearNumber'};
var $ryan_haskell$date_format$DateFormat$yearNumber = $ryan_haskell$date_format$DateFormat$YearNumber;
var $author$project$Pages$Admin$getDateFromPosix = function (posix) {
	var _v0 = $elm$core$String$toInt(posix);
	if (_v0.$ === 'Just') {
		var date = _v0.a;
		return A3(
			$ryan_haskell$date_format$DateFormat$format,
			_List_fromArray(
				[
					$ryan_haskell$date_format$DateFormat$yearNumber,
					$ryan_haskell$date_format$DateFormat$text('-'),
					$ryan_haskell$date_format$DateFormat$monthFixed,
					$ryan_haskell$date_format$DateFormat$text('-'),
					$ryan_haskell$date_format$DateFormat$dayOfMonthFixed
				]),
			$elm$time$Time$utc,
			$elm$time$Time$millisToPosix(date * 1000));
	} else {
		return posix;
	}
};
var $elm$html$Html$td = _VirtualDom_node('td');
var $author$project$Pages$Admin$viewRestoreItem = function (restore) {
	return A2(
		$elm$html$Html$tr,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('_website')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$th,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$scope('row')
					]),
				_List_fromArray(
					[
						A2($elm$html$Html$a, _List_Nil, _List_Nil),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href(restore.s3Url)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(restore.id)
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(restore.username)
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(restore.email)
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$Pages$Admin$getDateFromPosix(restore.transactDate))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(restore.timestamp)
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(restore.domain)
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(restore.status)
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('col-12 col-md-6')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('plan-dedicated-order-button'),
										A2($elm$html$Html$Attributes$style, 'background', '#4b6cbf'),
										A2($elm$html$Html$Attributes$style, 'border', '0px'),
										A2($elm$html$Html$Attributes$style, 'width', '100px'),
										$elm$html$Html$Attributes$href(
										$author$project$Gen$Route$toHref(
											$author$project$Gen$Route$Admin__Update__Id_(
												{id: restore.id})))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Update')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('plan-dedicated-order-button'),
										A2($elm$html$Html$Attributes$style, 'background', '#1ec1d6'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '2px'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '2px'),
										A2($elm$html$Html$Attributes$style, 'border', '0px'),
										A2($elm$html$Html$Attributes$style, 'width', '100px'),
										$elm$html$Html$Events$onClick(
										$author$project$Pages$Admin$ClickedResend(restore))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Re-send')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('plan-dedicated-order-button'),
										A2($elm$html$Html$Attributes$style, 'background', '#5ad18a'),
										A2($elm$html$Html$Attributes$style, 'border', '0px'),
										A2($elm$html$Html$Attributes$style, 'width', '100px'),
										$elm$html$Html$Events$onClick(
										$author$project$Pages$Admin$ClickedQueueOrders(restore))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Queue')
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Admin$viewSection1 = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('padding-20-0')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('row justify-content-start futures-version-2')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-lg')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('futures-version-3-box'),
												A2($elm$html$Html$Attributes$style, 'margin-top', '0px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h4,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Orders')
													])),
												A2($elm$html$Html$br, _List_Nil, _List_Nil),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('row')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('col-sm-12 col-md-3')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$button,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('plan-dedicated-order-button'),
																		A2($elm$html$Html$Attributes$style, 'background', '#4b6cbf'),
																		A2($elm$html$Html$Attributes$style, 'border', '0px'),
																		$elm$html$Html$Events$onClick($author$project$Pages$Admin$ClickedRefresh)
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Refresh')
																	]))
															])),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('col-sm-12 col-md-6')
															]),
														_List_Nil),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('col-sm-12 col-md-3')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$id('websites_filter'),
																		$elm$html$Html$Attributes$class('dataTables_filter')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$input,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$type_('text'),
																				$elm$html$Html$Attributes$class('form-control'),
																				$elm$html$Html$Attributes$id('usr'),
																				$elm$html$Html$Attributes$placeholder('Search'),
																				$elm$html$Html$Attributes$value(model.search),
																				$elm$html$Html$Events$onInput($author$project$Pages$Admin$ChangeSearch)
																			]),
																		_List_Nil)
																	]))
															]))
													])),
												A2($elm$html$Html$br, _List_Nil, _List_Nil),
												A2(
												$elm$html$Html$table,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('table table-hover'),
														A2($elm$html$Html$Attributes$style, 'table-layout', 'fixed'),
														A2($elm$html$Html$Attributes$style, 'word-wrap', 'break-word'),
														$elm$html$Html$Attributes$id('orders')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$thead,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$elm$html$Html$tr,
																_List_Nil,
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('ID')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Username')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Email')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Date')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Wayback Timestamp')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Domain')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Status')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Action')
																			]))
																	]))
															])),
														A2(
														$elm$html$Html$tbody,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$id('websites')
															]),
														A2($elm$core$List$map, $author$project$Pages$Admin$viewRestoreItem, model.tempRestores))
													])),
												A5($author$project$Common$PageViewer$viewPages, $author$project$Pages$Admin$ClickedPrevPage, $author$project$Pages$Admin$ClickedNextPage, $author$project$Pages$Admin$ClickedPageNum, model.currentPage, model.numPages)
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Admin$ChangeAction = function (a) {
	return {$: 'ChangeAction', a: a};
};
var $author$project$Pages$Admin$ChangeDomain = function (a) {
	return {$: 'ChangeDomain', a: a};
};
var $author$project$Pages$Admin$ChangeEmail = function (a) {
	return {$: 'ChangeEmail', a: a};
};
var $author$project$Pages$Admin$ChangeMethod = function (a) {
	return {$: 'ChangeMethod', a: a};
};
var $author$project$Pages$Admin$ChangeRestoreID = function (a) {
	return {$: 'ChangeRestoreID', a: a};
};
var $author$project$Pages$Admin$ChangeTimestamp = function (a) {
	return {$: 'ChangeTimestamp', a: a};
};
var $author$project$Pages$Admin$ClickedClear = {$: 'ClickedClear'};
var $author$project$Pages$Admin$ClickedQueue = {$: 'ClickedQueue'};
var $elm$html$Html$label = _VirtualDom_node('label');
var $author$project$Common$Alert$viewAlertError = function (error) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('alert alert-danger col-md-12'),
				A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(error)
			]));
};
var $author$project$Common$Alert$viewAlertSuccess = function (msg) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('alert alert-success col-md-12'),
				A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(msg)
			]));
};
var $author$project$Common$Spinner$viewSpinnerText = _List_fromArray(
	[
		A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('spinner-border spinner-border-sm'),
				A2($elm$html$Html$Attributes$attribute, 'role', 'status'),
				A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
			]),
		_List_Nil),
		$elm$html$Html$text(' Loading...')
	]);
var $author$project$Pages$Admin$viewSection2 = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('padding-20-0')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('row justify-content-start futures-version-2')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-lg')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('futures-version-3-box'),
												A2($elm$html$Html$Attributes$style, 'margin-top', '0px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h4,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Queue')
													])),
												function () {
												var _v0 = model.status;
												switch (_v0.$) {
													case 'Success':
														var msg = _v0.a;
														return $author$project$Common$Alert$viewAlertSuccess(msg);
													case 'Failure':
														var err = _v0.a;
														return $author$project$Common$Alert$viewAlertError(err);
													default:
														return A2($elm$html$Html$div, _List_Nil, _List_Nil);
												}
											}(),
												A2($elm$html$Html$br, _List_Nil, _List_Nil),
												A2(
												$elm$html$Html$div,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group row')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$label,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-2 col-form-label')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Domain')
																	])),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-10')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$input,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$type_('text'),
																				$elm$html$Html$Attributes$class('form-control'),
																				$elm$html$Html$Attributes$value(model.queue.domain),
																				$elm$html$Html$Attributes$placeholder('Domain'),
																				$elm$html$Html$Events$onInput($author$project$Pages$Admin$ChangeDomain)
																			]),
																		_List_Nil)
																	]))
															])),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group row')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$label,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-2 col-form-label')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Timestamp')
																	])),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-10')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$input,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$type_('text'),
																				$elm$html$Html$Attributes$class('form-control'),
																				$elm$html$Html$Attributes$value(model.queue.timestamp),
																				$elm$html$Html$Attributes$placeholder('Timestamp'),
																				$elm$html$Html$Events$onInput($author$project$Pages$Admin$ChangeTimestamp)
																			]),
																		_List_Nil)
																	]))
															])),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group row')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$label,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-2 col-form-label')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Restore ID')
																	])),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-10')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$input,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$type_('text'),
																				$elm$html$Html$Attributes$class('form-control'),
																				$elm$html$Html$Attributes$value(model.queue.restoreId),
																				$elm$html$Html$Attributes$placeholder('Restore ID'),
																				$elm$html$Html$Events$onInput($author$project$Pages$Admin$ChangeRestoreID)
																			]),
																		_List_Nil)
																	]))
															])),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group row')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$label,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-2 col-form-label')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Client Email')
																	])),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-10')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$input,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$type_('text'),
																				$elm$html$Html$Attributes$class('form-control'),
																				$elm$html$Html$Attributes$value(model.queue.email),
																				$elm$html$Html$Attributes$placeholder('Client Email'),
																				$elm$html$Html$Events$onInput($author$project$Pages$Admin$ChangeEmail)
																			]),
																		_List_Nil)
																	]))
															])),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group row')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$label,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-2 col-form-label')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Action')
																	])),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-10')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$input,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$type_('text'),
																				$elm$html$Html$Attributes$class('form-control'),
																				$elm$html$Html$Attributes$value(model.queue.action),
																				$elm$html$Html$Attributes$placeholder('Action'),
																				$elm$html$Html$Events$onInput($author$project$Pages$Admin$ChangeAction)
																			]),
																		_List_Nil)
																	]))
															])),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group row')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$label,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-2 col-form-label')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Method')
																	])),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-10')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$input,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$type_('text'),
																				$elm$html$Html$Attributes$class('form-control'),
																				$elm$html$Html$Attributes$value(model.queue.method),
																				$elm$html$Html$Attributes$placeholder('Method'),
																				$elm$html$Html$Events$onInput($author$project$Pages$Admin$ChangeMethod)
																			]),
																		_List_Nil)
																	]))
															]))
													])),
												A2(
												$elm$html$Html$table,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$td,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-12 col-md-6')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$a,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('plan-dedicated-order-button'),
																				A2($elm$html$Html$Attributes$style, 'background', '#5ad18a'),
																				$elm$html$Html$Attributes$href('#'),
																				$elm$html$Html$Events$onClick($author$project$Pages$Admin$ClickedQueue)
																			]),
																		function () {
																			var _v1 = model.status;
																			if (_v1.$ === 'Loading') {
																				return $author$project$Common$Spinner$viewSpinnerText;
																			} else {
																				return _List_fromArray(
																					[
																						$elm$html$Html$text('Queue')
																					]);
																			}
																		}())
																	]))
															])),
														A2(
														$elm$html$Html$td,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-12 col-md-6')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$a,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('plan-dedicated-order-button'),
																				A2($elm$html$Html$Attributes$style, 'background', '#d63838'),
																				$elm$html$Html$Attributes$href('#'),
																				$elm$html$Html$Events$onClick($author$project$Pages$Admin$ClickedClear)
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Clear')
																			]))
																	]))
															]))
													]))
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Admin$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'sub',
					'',
					$author$project$Pages$Admin$viewMain,
					$elm$html$Html$text(''),
					$author$project$Pages$Admin$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$Admin$viewSection1(model),
					$author$project$Pages$Admin$viewSection2(model),
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Administration | Wayback Download'
		};
	});
var $author$project$Pages$Admin$page = F2(
	function (shared, req) {
		return $author$project$Page$protected.element(
			function (user) {
				return {
					init: A3($author$project$Pages$Admin$init, shared, user, req),
					subscriptions: function (_v0) {
						return $elm$core$Platform$Sub$none;
					},
					update: A3($author$project$Pages$Admin$update, shared.env, user, shared.storage),
					view: $author$project$Pages$Admin$view(shared)
				};
			});
	});
var $author$project$Pages$Admin$Update$Id_$Model = F3(
	function (status, restore, showMenu) {
		return {restore: restore, showMenu: showMenu, status: status};
	});
var $author$project$Pages$Admin$Update$Id_$None = {$: 'None'};
var $author$project$Common$Response$Restore = F8(
	function (id, timestamp, domain, status, s3Url, transactDate, username, email) {
		return {domain: domain, email: email, id: id, s3Url: s3Url, status: status, timestamp: timestamp, transactDate: transactDate, username: username};
	});
var $author$project$Pages$Admin$Update$Id_$RestoreResp = function (a) {
	return {$: 'RestoreResp', a: a};
};
var $author$project$Pages$Admin$Update$Id_$getRestore = F4(
	function (env, user, storage, id) {
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$emptyBody,
				expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Admin$Update$Id_$RestoreResp, $author$project$Proto$Response$decodeResponse),
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'Bearer ' + user.token)
					]),
				method: 'GET',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: env.serverUrl + ('/admin/restore/' + id)
			});
	});
var $author$project$Pages$Admin$Update$Id_$init = F3(
	function (shared, user, req) {
		var model = A3(
			$author$project$Pages$Admin$Update$Id_$Model,
			$author$project$Pages$Admin$Update$Id_$None,
			A8($author$project$Common$Response$Restore, '', '', '', '', '', '', '', ''),
			false);
		return (!user.admin) ? _Utils_Tuple2(
			model,
			A2($author$project$Request$replaceRoute, $author$project$Gen$Route$Dashboard, req)) : _Utils_Tuple2(
			model,
			A4($author$project$Pages$Admin$Update$Id_$getRestore, shared.env, user, shared.storage, req.params.id));
	});
var $author$project$Pages$Admin$Update$Id_$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $author$project$Pages$Admin$Update$Id_$Success = function (a) {
	return {$: 'Success', a: a};
};
var $author$project$Pages$Admin$Update$Id_$errorHandler = F3(
	function (model, storage, err) {
		if (err.$ === 'BadStatus') {
			var code = err.a;
			return (code === 401) ? _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Admin$Update$Id_$Failure('Login session expired')
					}),
				$author$project$Storage$signOut(storage)) : _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Admin$Update$Id_$Failure('Unable to fetch user details, please try again later')
					}),
				$elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Admin$Update$Id_$Failure('Unable to fetch user details, please try again later')
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Admin$Update$Id_$UpdateResp = function (a) {
	return {$: 'UpdateResp', a: a};
};
var $author$project$Proto$Response$encodeRestore = function (value) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(
		_List_fromArray(
			[
				_Utils_Tuple2(
				1,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.id)),
				_Utils_Tuple2(
				2,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.timestamp)),
				_Utils_Tuple2(
				3,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.domain)),
				_Utils_Tuple2(
				4,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.status)),
				_Utils_Tuple2(
				5,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.s3Url)),
				_Utils_Tuple2(
				6,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.transactDate)),
				_Utils_Tuple2(
				7,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.username)),
				_Utils_Tuple2(
				8,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.email))
			]));
};
var $author$project$Pages$Admin$Update$Id_$updateRestore = F3(
	function (env, user, model) {
		return _Utils_Tuple2(
			model,
			$elm$http$Http$request(
				{
					body: A2(
						$elm$http$Http$bytesBody,
						'application/protobuf',
						$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
							$author$project$Proto$Response$encodeRestore(model.restore))),
					expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Admin$Update$Id_$UpdateResp, $author$project$Proto$Response$decodeResponse),
					headers: _List_fromArray(
						[
							A2($elm$http$Http$header, 'Authorization', 'Bearer ' + user.token)
						]),
					method: 'POST',
					timeout: $elm$core$Maybe$Nothing,
					tracker: $elm$core$Maybe$Nothing,
					url: env.serverUrl + '/admin/update'
				}));
	});
var $author$project$Pages$Admin$Update$Id_$update = F5(
	function (env, user, storage, msg, model) {
		switch (msg.$) {
			case 'RestoreResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v2 = resp.status;
					if (_v2.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Admin$Update$Id_$Failure(resp.error)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v3 = resp.data;
						if (_v3.$ === 'Just') {
							var data = _v3.a;
							var _v4 = data.restore;
							if (_v4.$ === 'Just') {
								var restore = _v4.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{restore: restore, status: $author$project$Pages$Admin$Update$Id_$None}),
									$elm$core$Platform$Cmd$none);
							} else {
								return A3(
									$author$project$Pages$Admin$Update$Id_$errorHandler,
									model,
									storage,
									$elm$http$Http$BadBody('Unable to decode'));
							}
						} else {
							return A3(
								$author$project$Pages$Admin$Update$Id_$errorHandler,
								model,
								storage,
								$elm$http$Http$BadBody('Unable to decode'));
						}
					}
				} else {
					var err = result.a;
					return A3($author$project$Pages$Admin$Update$Id_$errorHandler, model, storage, err);
				}
			case 'UpdateResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v6 = resp.status;
					if (_v6.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Admin$Update$Id_$Failure(resp.error)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Admin$Update$Id_$Success('Successfully updated order')
								}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					var err = result.a;
					return A3($author$project$Pages$Admin$Update$Id_$errorHandler, model, storage, err);
				}
			case 'ClickedUpdate':
				return A3($author$project$Pages$Admin$Update$Id_$updateRestore, env, user, model);
			case 'ChangedSelect':
				var status = msg.a;
				var oldForm = model.restore;
				var newForm = _Utils_update(
					oldForm,
					{status: status});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{restore: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeS3URL':
				var url = msg.a;
				var oldForm = model.restore;
				var newForm = _Utils_update(
					oldForm,
					{s3Url: url});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{restore: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeEmail':
				var email = msg.a;
				var oldForm = model.restore;
				var newForm = _Utils_update(
					oldForm,
					{email: email});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{restore: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeDomain':
				var domain = msg.a;
				var oldForm = model.restore;
				var newForm = _Utils_update(
					oldForm,
					{domain: domain});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{restore: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeTimestamp':
				var timestamp = msg.a;
				var oldForm = model.restore;
				var newForm = _Utils_update(
					oldForm,
					{timestamp: timestamp});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{restore: newForm}),
					$elm$core$Platform$Cmd$none);
			default:
				return model.showMenu ? _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: false}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: true}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Admin$Update$Id_$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $author$project$Pages$Admin$Update$Id_$viewMain = A2(
	$elm$html$Html$main_,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('container mb-auto')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h3,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mt-3 main-header-text-title')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Update Restore')
				]))
		]));
var $author$project$Pages$Admin$Update$Id_$ChangeDomain = function (a) {
	return {$: 'ChangeDomain', a: a};
};
var $author$project$Pages$Admin$Update$Id_$ChangeEmail = function (a) {
	return {$: 'ChangeEmail', a: a};
};
var $author$project$Pages$Admin$Update$Id_$ChangeS3URL = function (a) {
	return {$: 'ChangeS3URL', a: a};
};
var $author$project$Pages$Admin$Update$Id_$ChangeTimestamp = function (a) {
	return {$: 'ChangeTimestamp', a: a};
};
var $author$project$Pages$Admin$Update$Id_$ChangedSelect = function (a) {
	return {$: 'ChangedSelect', a: a};
};
var $author$project$Pages$Admin$Update$Id_$ClickedUpdate = {$: 'ClickedUpdate'};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$Pages$Admin$Update$Id_$viewSection = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('padding-20-0')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('row justify-content-start futures-version-2')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-lg')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('futures-version-3-box'),
												A2($elm$html$Html$Attributes$style, 'margin-top', '0px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h4,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Update Restore')
													])),
												function () {
												var _v0 = model.status;
												switch (_v0.$) {
													case 'Success':
														var msg = _v0.a;
														return $author$project$Common$Alert$viewAlertSuccess(msg);
													case 'Failure':
														var err = _v0.a;
														return $author$project$Common$Alert$viewAlertError(err);
													default:
														return A2($elm$html$Html$div, _List_Nil, _List_Nil);
												}
											}(),
												A2($elm$html$Html$br, _List_Nil, _List_Nil),
												A2(
												$elm$html$Html$div,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group row')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$label,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-2 col-form-label')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Email')
																	])),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-10')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$input,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$type_('text'),
																				$elm$html$Html$Attributes$class('form-control'),
																				$elm$html$Html$Attributes$value(model.restore.email),
																				$elm$html$Html$Attributes$placeholder('Email'),
																				$elm$html$Html$Events$onInput($author$project$Pages$Admin$Update$Id_$ChangeEmail)
																			]),
																		_List_Nil)
																	]))
															])),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group row')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$label,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-2 col-form-label')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Domain')
																	])),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-10')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$input,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$type_('text'),
																				$elm$html$Html$Attributes$class('form-control'),
																				$elm$html$Html$Attributes$value(model.restore.domain),
																				$elm$html$Html$Attributes$placeholder('Domain'),
																				$elm$html$Html$Events$onInput($author$project$Pages$Admin$Update$Id_$ChangeDomain)
																			]),
																		_List_Nil)
																	]))
															])),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group row')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$label,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-2 col-form-label')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Timestamp')
																	])),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-10')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$input,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$type_('text'),
																				$elm$html$Html$Attributes$class('form-control'),
																				$elm$html$Html$Attributes$value(model.restore.timestamp),
																				$elm$html$Html$Attributes$placeholder('Timestamp'),
																				$elm$html$Html$Events$onInput($author$project$Pages$Admin$Update$Id_$ChangeTimestamp)
																			]),
																		_List_Nil)
																	]))
															])),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group row')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$label,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-2 col-form-label')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('s3URL')
																	])),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-10')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$input,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$type_('text'),
																				$elm$html$Html$Attributes$class('form-control'),
																				$elm$html$Html$Attributes$value(model.restore.s3Url),
																				$elm$html$Html$Attributes$placeholder('s3URL'),
																				$elm$html$Html$Events$onInput($author$project$Pages$Admin$Update$Id_$ChangeS3URL)
																			]),
																		_List_Nil)
																	]))
															])),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-group row')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$label,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-2 col-form-label')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Status')
																	])),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-sm-10')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('dropdown')
																			]),
																		_List_fromArray(
																			[
																				A2(
																				$elm$html$Html$select,
																				_List_fromArray(
																					[
																						$elm$html$Html$Attributes$id('inputState'),
																						$elm$html$Html$Attributes$class('form-control'),
																						$elm$html$Html$Events$onInput($author$project$Pages$Admin$Update$Id_$ChangedSelect)
																					]),
																				_List_fromArray(
																					[
																						((model.restore.status === 'Awaiting Payment') ? $elm$html$Html$option(
																						_List_fromArray(
																							[
																								$elm$html$Html$Attributes$selected(true)
																							])) : $elm$html$Html$option(_List_Nil))(
																						_List_fromArray(
																							[
																								$elm$html$Html$text('Awaiting Payment')
																							])),
																						((model.restore.status === 'Submitted') ? $elm$html$Html$option(
																						_List_fromArray(
																							[
																								$elm$html$Html$Attributes$selected(true)
																							])) : $elm$html$Html$option(_List_Nil))(
																						_List_fromArray(
																							[
																								$elm$html$Html$text('Submitted')
																							])),
																						((model.restore.status === 'In Progress') ? $elm$html$Html$option(
																						_List_fromArray(
																							[
																								$elm$html$Html$Attributes$selected(true)
																							])) : $elm$html$Html$option(_List_Nil))(
																						_List_fromArray(
																							[
																								$elm$html$Html$text('In Progress')
																							])),
																						((model.restore.status === 'Awaiting Review') ? $elm$html$Html$option(
																						_List_fromArray(
																							[
																								$elm$html$Html$Attributes$selected(true)
																							])) : $elm$html$Html$option(_List_Nil))(
																						_List_fromArray(
																							[
																								$elm$html$Html$text('Awaiting Review')
																							])),
																						((model.restore.status === 'Done') ? $elm$html$Html$option(
																						_List_fromArray(
																							[
																								$elm$html$Html$Attributes$selected(true)
																							])) : $elm$html$Html$option(_List_Nil))(
																						_List_fromArray(
																							[
																								$elm$html$Html$text('Done')
																							])),
																						((model.restore.status === 'Error') ? $elm$html$Html$option(
																						_List_fromArray(
																							[
																								$elm$html$Html$Attributes$selected(true)
																							])) : $elm$html$Html$option(_List_Nil))(
																						_List_fromArray(
																							[
																								$elm$html$Html$text('Error')
																							]))
																					]))
																			]))
																	]))
															])),
														A2(
														$elm$html$Html$table,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$elm$html$Html$td,
																_List_Nil,
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('col-12 col-md-6')
																			]),
																		_List_fromArray(
																			[
																				A2(
																				$elm$html$Html$a,
																				_List_fromArray(
																					[
																						$elm$html$Html$Attributes$class('plan-dedicated-order-button'),
																						A2($elm$html$Html$Attributes$style, 'background', '#5ad18a'),
																						$elm$html$Html$Attributes$href('#'),
																						$elm$html$Html$Events$onClick($author$project$Pages$Admin$Update$Id_$ClickedUpdate)
																					]),
																				function () {
																					var _v1 = model.status;
																					if (_v1.$ === 'Loading') {
																						return $author$project$Common$Spinner$viewSpinnerText;
																					} else {
																						return _List_fromArray(
																							[
																								$elm$html$Html$text('Update')
																							]);
																					}
																				}())
																			]))
																	]))
															]))
													]))
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Admin$Update$Id_$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'sub',
					'',
					$author$project$Pages$Admin$Update$Id_$viewMain,
					$elm$html$Html$text(''),
					$author$project$Pages$Admin$Update$Id_$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$Admin$Update$Id_$viewSection(model),
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Update Restore | Wayback Download'
		};
	});
var $author$project$Pages$Admin$Update$Id_$page = F2(
	function (shared, req) {
		return $author$project$Page$protected.element(
			function (user) {
				return {
					init: A3($author$project$Pages$Admin$Update$Id_$init, shared, user, req),
					subscriptions: function (_v0) {
						return $elm$core$Platform$Sub$none;
					},
					update: A3($author$project$Pages$Admin$Update$Id_$update, shared.env, user, shared.storage),
					view: $author$project$Pages$Admin$Update$Id_$view(shared)
				};
			});
	});
var $author$project$Proto$Response$ContactForm = F4(
	function (email, message, name, recaptcha) {
		return {email: email, message: message, name: name, recaptcha: recaptcha};
	});
var $author$project$Pages$Contact$Model = F3(
	function (form, status, showMenu) {
		return {form: form, showMenu: showMenu, status: status};
	});
var $author$project$Pages$Contact$None = {$: 'None'};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Shared$loadCaptcha = _Platform_outgoingPort(
	'loadCaptcha',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Shared$loadhCaptcha = $author$project$Shared$loadCaptcha(_Utils_Tuple0);
var $author$project$Pages$Contact$init = _Utils_Tuple2(
	A3(
		$author$project$Pages$Contact$Model,
		A4($author$project$Proto$Response$ContactForm, '', '', '', ''),
		$author$project$Pages$Contact$None,
		false),
	$author$project$Shared$loadhCaptcha);
var $author$project$Pages$Contact$ReceivedCaptcha = function (a) {
	return {$: 'ReceivedCaptcha', a: a};
};
var $author$project$Shared$messageReceiver = _Platform_incomingPort('messageReceiver', $elm$json$Json$Decode$string);
var $author$project$Pages$Contact$subscriptions = function (_v0) {
	return $author$project$Shared$messageReceiver($author$project$Pages$Contact$ReceivedCaptcha);
};
var $author$project$Pages$Contact$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $author$project$Pages$Contact$Loading = {$: 'Loading'};
var $author$project$Pages$Contact$Success = {$: 'Success'};
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {index: index, match: match, number: number, submatches: submatches};
	});
var $elm$regex$Regex$contains = _Regex_contains;
var $author$project$Common$Regex$emailPattern = '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])';
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{caseInsensitive: false, multiline: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $author$project$Common$Regex$emailRegex = function (email) {
	return A2(
		$elm$regex$Regex$contains,
		A2(
			$elm$core$Maybe$withDefault,
			$elm$regex$Regex$never,
			$elm$regex$Regex$fromString($author$project$Common$Regex$emailPattern)),
		email);
};
var $author$project$Shared$Message = F4(
	function (action, id, key, popover) {
		return {action: action, id: id, key: key, popover: popover};
	});
var $elm$core$Maybe$destruct = F3(
	function (_default, func, maybe) {
		if (maybe.$ === 'Just') {
			var a = maybe.a;
			return func(a);
		} else {
			return _default;
		}
	});
var $author$project$Shared$sendMessage = _Platform_outgoingPort(
	'sendMessage',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'action',
					$elm$json$Json$Encode$string($.action)),
					_Utils_Tuple2(
					'id',
					$elm$json$Json$Encode$string($.id)),
					_Utils_Tuple2(
					'key',
					$elm$json$Json$Encode$string($.key)),
					_Utils_Tuple2(
					'popover',
					function ($) {
						return A3(
							$elm$core$Maybe$destruct,
							$elm$json$Json$Encode$null,
							function ($) {
								return $elm$json$Json$Encode$object(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'content',
											$elm$json$Json$Encode$string($.content)),
											_Utils_Tuple2(
											'placement',
											$elm$json$Json$Encode$string($.placement)),
											_Utils_Tuple2(
											'title',
											$elm$json$Json$Encode$string($.title))
										]));
							},
							$);
					}($.popover))
				]));
	});
var $author$project$Shared$getCaptchaResponse = $author$project$Shared$sendMessage(
	A4($author$project$Shared$Message, 'getCaptchaResponse', '', '', $elm$core$Maybe$Nothing));
var $author$project$Shared$resetCaptcha = function (_v0) {
	return $author$project$Shared$sendMessage(
		A4($author$project$Shared$Message, 'resetCaptcha', '', '', $elm$core$Maybe$Nothing));
};
var $author$project$Pages$Contact$FormSentResp = function (a) {
	return {$: 'FormSentResp', a: a};
};
var $author$project$Proto$Response$encodeContactForm = function (value) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(
		_List_fromArray(
			[
				_Utils_Tuple2(
				1,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.email)),
				_Utils_Tuple2(
				2,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.message)),
				_Utils_Tuple2(
				3,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.name)),
				_Utils_Tuple2(
				4,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.recaptcha))
			]));
};
var $elm$http$Http$post = function (r) {
	return $elm$http$Http$request(
		{body: r.body, expect: r.expect, headers: _List_Nil, method: 'POST', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $author$project$Pages$Contact$submitForm = F2(
	function (env, model) {
		return _Utils_Tuple2(
			model,
			$elm$http$Http$post(
				{
					body: A2(
						$elm$http$Http$bytesBody,
						'application/protobuf',
						$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
							$author$project$Proto$Response$encodeContactForm(model.form))),
					expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Contact$FormSentResp, $author$project$Proto$Response$decodeResponse),
					url: env.serverUrl + '/contact'
				}));
	});
var $author$project$Pages$Contact$update = F3(
	function (shared, msg, model) {
		switch (msg.$) {
			case 'NameChange':
				var name = msg.a;
				var oldForm = model.form;
				var newForm = _Utils_update(
					oldForm,
					{name: name});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{form: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'EmailChange':
				var email = msg.a;
				var oldForm = model.form;
				var newForm = _Utils_update(
					oldForm,
					{email: email});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{form: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'MessageChange':
				var message = msg.a;
				var oldForm = model.form;
				var newForm = _Utils_update(
					oldForm,
					{message: message});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{form: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ClickedSend':
				return (model.form.name === '') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$Contact$Failure('Name cannot be empty')
						}),
					$elm$core$Platform$Cmd$none) : ((!$author$project$Common$Regex$emailRegex(model.form.email)) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$Contact$Failure('Invalid email address provided')
						}),
					$elm$core$Platform$Cmd$none) : ((model.form.message === '') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$Contact$Failure('Message cannot be empty')
						}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{status: $author$project$Pages$Contact$Loading}),
					$author$project$Shared$getCaptchaResponse)));
			case 'ReceivedCaptcha':
				var captcha = msg.a;
				if (captcha === '') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Pages$Contact$Failure('Must fill out captcha')
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var oldForm = model.form;
					var newForm = _Utils_update(
						oldForm,
						{recaptcha: captcha});
					return A2(
						$author$project$Pages$Contact$submitForm,
						shared.env,
						_Utils_update(
							model,
							{form: newForm}));
				}
			case 'FormSentResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					return _Utils_Tuple2(
						A3(
							$author$project$Pages$Contact$Model,
							A4($author$project$Proto$Response$ContactForm, '', '', '', ''),
							$author$project$Pages$Contact$Success,
							false),
						$author$project$Shared$resetCaptcha(_Utils_Tuple0));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Pages$Contact$Failure('Unable to send form, please try again later')
							}),
						$author$project$Shared$resetCaptcha(_Utils_Tuple0));
				}
			default:
				return model.showMenu ? _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: false}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: true}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Contact$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$Contact$ClickedSend = {$: 'ClickedSend'};
var $author$project$Pages$Contact$EmailChange = function (a) {
	return {$: 'EmailChange', a: a};
};
var $author$project$Pages$Contact$MessageChange = function (a) {
	return {$: 'MessageChange', a: a};
};
var $author$project$Pages$Contact$NameChange = function (a) {
	return {$: 'NameChange', a: a};
};
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $elm$html$Html$Attributes$required = $elm$html$Html$Attributes$boolProperty('required');
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$Pages$Contact$viewMain = function (model) {
	return A2(
		$elm$html$Html$main_,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container mb-auto')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('col-md-5')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h1,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mt-3 main-header-text-title mr-tp-60')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Still got questions?')
											])),
										$elm$html$Html$text('you can talk to our support.')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('col-md-7')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row form-contain-home contact-page-form-send'),
										$elm$html$Html$Attributes$id('ajax-contact')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h5,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('send us a message')
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12'),
												$elm$html$Html$Attributes$id('alert'),
												A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
											]),
										_List_Nil),
										function () {
										var _v0 = model.status;
										switch (_v0.$) {
											case 'Success':
												return $author$project$Common$Alert$viewAlertSuccess('Successfully sent message!');
											case 'Failure':
												var err = _v0.a;
												return $author$project$Common$Alert$viewAlertError(err);
											default:
												return $elm$html$Html$text('');
										}
									}(),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('form-messages')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field input-field')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$input,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-contain-home-input'),
																$elm$html$Html$Attributes$id('name'),
																$elm$html$Html$Attributes$name('name'),
																$elm$html$Html$Attributes$placeholder('enter your name'),
																$elm$html$Html$Attributes$required(true),
																$elm$html$Html$Attributes$type_('text'),
																$elm$html$Html$Attributes$value(model.form.name),
																$elm$html$Html$Events$onInput($author$project$Pages$Contact$NameChange)
															]),
														_List_Nil),
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('fas fa-user')
															]),
														_List_Nil)
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field input-field')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$input,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-contain-home-input'),
																$elm$html$Html$Attributes$id('email'),
																$elm$html$Html$Attributes$name('email'),
																$elm$html$Html$Attributes$placeholder('enter your email'),
																$elm$html$Html$Attributes$required(true),
																$elm$html$Html$Attributes$type_('email'),
																$elm$html$Html$Attributes$value(model.form.email),
																$elm$html$Html$Events$onInput($author$project$Pages$Contact$EmailChange)
															]),
														_List_Nil),
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('far fa-envelope')
															]),
														_List_Nil)
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field input-field')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$textarea,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-contain-home-input'),
																$elm$html$Html$Attributes$id('message'),
																$elm$html$Html$Attributes$name('message'),
																$elm$html$Html$Attributes$placeholder('enter your message'),
																$elm$html$Html$Attributes$required(true),
																$elm$html$Html$Attributes$value(model.form.message),
																$elm$html$Html$Events$onInput($author$project$Pages$Contact$MessageChange)
															]),
														_List_Nil)
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('h-captcha'),
												$elm$html$Html$Attributes$class('h-captcha col-md-12')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn-holder-contact')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$id('contact'),
														$elm$html$Html$Attributes$type_('submit'),
														$elm$html$Html$Events$onClick($author$project$Pages$Contact$ClickedSend)
													]),
												function () {
													var _v1 = model.status;
													if (_v1.$ === 'Loading') {
														return $author$project$Common$Spinner$viewSpinnerText;
													} else {
														return _List_fromArray(
															[
																$elm$html$Html$text('Send')
															]);
													}
												}())
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Contact$viewSection1 = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('padding-20-0 mob-display-none')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row justify-content-start')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-md-5')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h5,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('immediate-help-center-title')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Need some urgent'),
											A2($elm$html$Html$br, _List_Nil, _List_Nil),
											$elm$html$Html$text('help?')
										])),
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('immediate-help-center-text')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Our support team is here to answer any questions that may arise during the restore process of your lost or deleted websites.')
										])),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('immediate-help-center-link'),
											$elm$html$Html$Attributes$href('mailto:support@wayback.download')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('support@wayback.download')
										]))
								]))
						]))
				]))
		]));
var $author$project$Pages$Contact$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'sub',
					'',
					$author$project$Pages$Contact$viewMain(model),
					$elm$html$Html$text(''),
					$author$project$Pages$Contact$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$Contact$viewSection1,
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('contact-spacing')
						]),
					_List_Nil),
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Contact | Wayback Download'
		};
	});
var $author$project$Pages$Contact$page = F2(
	function (shared, _v0) {
		return $author$project$Page$element(
			{
				init: $author$project$Pages$Contact$init,
				subscriptions: $author$project$Pages$Contact$subscriptions,
				update: $author$project$Pages$Contact$update(shared),
				view: $author$project$Pages$Contact$view(shared)
			});
	});
var $author$project$Pages$Dashboard$Loading = {$: 'Loading'};
var $author$project$Pages$Dashboard$Model = function (status) {
	return function (restores) {
		return function (restoresSplit) {
			return function (tempRestores) {
				return function (searchRestore) {
					return function (numPagesRestore) {
						return function (currentPageRestore) {
							return function (receipts) {
								return function (receiptsSplit) {
									return function (tempReceipts) {
										return function (searchReceipts) {
											return function (numPagesReceipts) {
												return function (currentPageReceipts) {
													return function (showMenu) {
														return {currentPageReceipts: currentPageReceipts, currentPageRestore: currentPageRestore, numPagesReceipts: numPagesReceipts, numPagesRestore: numPagesRestore, receipts: receipts, receiptsSplit: receiptsSplit, restores: restores, restoresSplit: restoresSplit, searchReceipts: searchReceipts, searchRestore: searchRestore, showMenu: showMenu, status: status, tempReceipts: tempReceipts, tempRestores: tempRestores};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Pages$Dashboard$ReceiptResp = function (a) {
	return {$: 'ReceiptResp', a: a};
};
var $author$project$Proto$Response$encodeCartItem = function (value) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(
		_List_fromArray(
			[
				_Utils_Tuple2(
				1,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.timestamp)),
				_Utils_Tuple2(
				2,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.domain))
			]));
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$ListEncoder = function (a) {
	return {$: 'ListEncoder', a: a};
};
var $eriktim$elm_protocol_buffers$Protobuf$Encode$list = function (fn) {
	return A2(
		$elm$core$Basics$composeL,
		$eriktim$elm_protocol_buffers$Protobuf$Encode$ListEncoder,
		$elm$core$List$map(fn));
};
var $author$project$Proto$Response$encodeCart = function (value) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(
		_List_fromArray(
			[
				_Utils_Tuple2(
				1,
				A2($eriktim$elm_protocol_buffers$Protobuf$Encode$list, $author$project$Proto$Response$encodeCartItem, value.items))
			]));
};
var $author$project$Pages$Dashboard$getReceipts = F3(
	function (env, user, storage) {
		return $elm$http$Http$request(
			{
				body: A2(
					$elm$http$Http$bytesBody,
					'application/protobuf',
					$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
						$author$project$Proto$Response$encodeCart(storage.cart))),
				expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Dashboard$ReceiptResp, $author$project$Proto$Response$decodeResponse),
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'Bearer ' + user.token)
					]),
				method: 'GET',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: env.serverUrl + '/receipt'
			});
	});
var $author$project$Pages$Dashboard$RestoreResp = function (a) {
	return {$: 'RestoreResp', a: a};
};
var $author$project$Pages$Dashboard$getRestores = F3(
	function (env, user, storage) {
		return $elm$http$Http$request(
			{
				body: A2(
					$elm$http$Http$bytesBody,
					'application/protobuf',
					$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
						$author$project$Proto$Response$encodeCart(storage.cart))),
				expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Dashboard$RestoreResp, $author$project$Proto$Response$decodeResponse),
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'Bearer ' + user.token)
					]),
				method: 'GET',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: env.serverUrl + '/restore'
			});
	});
var $author$project$Pages$Dashboard$init = F3(
	function (shared, user, req) {
		var model = $author$project$Pages$Dashboard$Model($author$project$Pages$Dashboard$Loading)(_List_Nil)(_List_Nil)(_List_Nil)('')(1)(1)(_List_Nil)(_List_Nil)(_List_Nil)('')(1)(1)(false);
		return user.admin ? _Utils_Tuple2(
			model,
			A2($author$project$Request$replaceRoute, $author$project$Gen$Route$Admin, req)) : _Utils_Tuple2(
			model,
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						A3($author$project$Pages$Dashboard$getRestores, shared.env, user, shared.storage),
						A3($author$project$Pages$Dashboard$getReceipts, shared.env, user, shared.storage)
					])));
	});
var $author$project$Pages$Dashboard$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $author$project$Pages$Dashboard$None = {$: 'None'};
var $author$project$Common$PageViewer$checkReceiptContainSearch = F2(
	function (search, receipt) {
		return (A2($elm$core$String$contains, search, receipt.id) || (A2($elm$core$String$contains, search, receipt.url) || (A2($elm$core$String$contains, search, receipt.date) || A2($elm$core$String$contains, search, receipt.amount)))) ? true : false;
	});
var $author$project$Pages$Dashboard$errorHandler = F3(
	function (model, storage, err) {
		if (err.$ === 'BadStatus') {
			var code = err.a;
			return (code === 401) ? _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Dashboard$Failure('Login session expired')
					}),
				$author$project$Storage$signOut(storage)) : _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Dashboard$Failure('Unable to fetch user details, please try again later')
					}),
				$elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Dashboard$Failure('Unable to fetch user details, please try again later')
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Dashboard$numResultsPerPage = 5;
var $author$project$Pages$Dashboard$update = F3(
	function (storage, msg, model) {
		switch (msg.$) {
			case 'RestoreResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v2 = resp.status;
					if (_v2.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Dashboard$Failure(resp.error)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v3 = resp.data;
						if (_v3.$ === 'Just') {
							var data = _v3.a;
							var sList = A2($author$project$Common$PageViewer$splitList, $author$project$Pages$Dashboard$numResultsPerPage, data.restores);
							var _v4 = $elm$core$List$head(sList);
							if (_v4.$ === 'Just') {
								var r = _v4.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											numPagesRestore: $elm$core$List$length(sList),
											restores: data.restores,
											restoresSplit: sList,
											status: $author$project$Pages$Dashboard$None,
											tempRestores: r
										}),
									$elm$core$Platform$Cmd$none);
							} else {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{restores: data.restores, restoresSplit: sList, status: $author$project$Pages$Dashboard$None, tempRestores: _List_Nil}),
									$elm$core$Platform$Cmd$none);
							}
						} else {
							return A3(
								$author$project$Pages$Dashboard$errorHandler,
								model,
								storage,
								$elm$http$Http$BadBody('Unable to decode'));
						}
					}
				} else {
					var err = result.a;
					return A3($author$project$Pages$Dashboard$errorHandler, model, storage, err);
				}
			case 'ReceiptResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v6 = resp.status;
					if (_v6.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Dashboard$Failure(resp.error)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v7 = resp.data;
						if (_v7.$ === 'Just') {
							var data = _v7.a;
							var sList = A2($author$project$Common$PageViewer$splitList, $author$project$Pages$Dashboard$numResultsPerPage, data.receipts);
							var _v8 = $elm$core$List$head(sList);
							if (_v8.$ === 'Just') {
								var r = _v8.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											numPagesReceipts: $elm$core$List$length(sList),
											receipts: data.receipts,
											receiptsSplit: sList,
											status: $author$project$Pages$Dashboard$None,
											tempReceipts: r
										}),
									$elm$core$Platform$Cmd$none);
							} else {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{receipts: data.receipts, receiptsSplit: sList, status: $author$project$Pages$Dashboard$None, tempReceipts: _List_Nil}),
									$elm$core$Platform$Cmd$none);
							}
						} else {
							return A3(
								$author$project$Pages$Dashboard$errorHandler,
								model,
								storage,
								$elm$http$Http$BadBody('Unable to decode'));
						}
					}
				} else {
					var err = result.a;
					return A3($author$project$Pages$Dashboard$errorHandler, model, storage, err);
				}
			case 'ChangeSearchRestore':
				var search = msg.a;
				var sList = A2(
					$author$project$Common$PageViewer$splitList,
					$author$project$Pages$Dashboard$numResultsPerPage,
					A2(
						$elm$core$List$filter,
						$author$project$Common$PageViewer$checkRestoreContainsSearch(search),
						model.restores));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							currentPageRestore: model.currentPageRestore,
							numPagesRestore: $elm$core$List$length(sList),
							searchRestore: search,
							tempRestores: A2($author$project$Common$PageViewer$filterPages, model.currentPageRestore, sList)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ClickedPageNumRestore':
				var num = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							currentPageRestore: num,
							tempRestores: A2($author$project$Common$PageViewer$filterPages, num, model.restoresSplit)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ClickedNextPageRestore':
				if (_Utils_cmp(model.currentPageRestore + 1, model.numPagesRestore) < 1) {
					var num = model.currentPageRestore + 1;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								currentPageRestore: num,
								tempRestores: A2($author$project$Common$PageViewer$filterPages, num, model.restoresSplit)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'ClickedPrevPageRestore':
				if ((model.currentPageRestore - 1) > 0) {
					var num = model.currentPageRestore - 1;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								currentPageRestore: num,
								tempRestores: A2($author$project$Common$PageViewer$filterPages, num, model.restoresSplit)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'ChangeSearchReceipt':
				var search = msg.a;
				var sList = A2(
					$author$project$Common$PageViewer$splitList,
					$author$project$Pages$Dashboard$numResultsPerPage,
					A2(
						$elm$core$List$filter,
						$author$project$Common$PageViewer$checkReceiptContainSearch(search),
						model.receipts));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							currentPageReceipts: model.currentPageReceipts,
							numPagesReceipts: $elm$core$List$length(sList),
							searchReceipts: search,
							tempReceipts: A2($author$project$Common$PageViewer$filterPages, model.currentPageReceipts, sList)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ClickedPageNumReceipt':
				var num = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							currentPageReceipts: num,
							tempReceipts: A2($author$project$Common$PageViewer$filterPages, num, model.receiptsSplit)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ClickedNextPageReceipt':
				if (_Utils_cmp(model.currentPageReceipts + 1, model.numPagesReceipts) < 1) {
					var num = model.currentPageReceipts + 1;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								currentPageReceipts: num,
								tempReceipts: A2($author$project$Common$PageViewer$filterPages, num, model.receiptsSplit)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'ClickedPrevPageReceipt':
				if ((model.currentPageReceipts - 1) > 0) {
					var num = model.currentPageReceipts - 1;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								currentPageReceipts: num,
								tempReceipts: A2($author$project$Common$PageViewer$filterPages, num, model.receiptsSplit)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				return model.showMenu ? _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: false}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: true}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Dashboard$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$Dashboard$viewMain = A2(
	$elm$html$Html$main_,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('container mb-auto')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h3,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mt-3 main-header-text-title')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Dashboard')
				]))
		]));
var $author$project$Pages$Dashboard$ChangeSearchRestore = function (a) {
	return {$: 'ChangeSearchRestore', a: a};
};
var $author$project$Pages$Dashboard$ClickedNextPageRestore = {$: 'ClickedNextPageRestore'};
var $author$project$Pages$Dashboard$ClickedPageNumRestore = function (a) {
	return {$: 'ClickedPageNumRestore', a: a};
};
var $author$project$Pages$Dashboard$ClickedPrevPageRestore = {$: 'ClickedPrevPageRestore'};
var $author$project$Pages$Dashboard$getDateFromPosix = function (posix) {
	var _v0 = $elm$core$String$toInt(posix);
	if (_v0.$ === 'Just') {
		var date = _v0.a;
		return A3(
			$ryan_haskell$date_format$DateFormat$format,
			_List_fromArray(
				[
					$ryan_haskell$date_format$DateFormat$yearNumber,
					$ryan_haskell$date_format$DateFormat$text('-'),
					$ryan_haskell$date_format$DateFormat$monthFixed,
					$ryan_haskell$date_format$DateFormat$text('-'),
					$ryan_haskell$date_format$DateFormat$dayOfMonthFixed
				]),
			$elm$time$Time$utc,
			$elm$time$Time$millisToPosix(date * 1000));
	} else {
		return posix;
	}
};
var $author$project$Pages$Dashboard$viewRestoreItem = function (restore) {
	return A2(
		$elm$html$Html$tr,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('_website')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$th,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$scope('row')
					]),
				_List_fromArray(
					[
						A2($elm$html$Html$a, _List_Nil, _List_Nil),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href(restore.s3Url)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(restore.id)
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$Pages$Dashboard$getDateFromPosix(restore.transactDate))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(restore.timestamp)
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(restore.domain)
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(restore.status)
					]))
			]));
};
var $author$project$Pages$Dashboard$viewSection1 = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('padding-20-0')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('row justify-content-start futures-version-2')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-lg')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('futures-version-3-box'),
												A2($elm$html$Html$Attributes$style, 'margin-top', '0px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h4,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Websites')
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('col-sm-12 col-md-4 float-right')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$id('websites_filter'),
																$elm$html$Html$Attributes$class('dataTables_filter')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$input,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$type_('text'),
																		$elm$html$Html$Attributes$class('form-control'),
																		$elm$html$Html$Attributes$id('usr'),
																		$elm$html$Html$Attributes$placeholder('Search'),
																		$elm$html$Html$Events$onInput($author$project$Pages$Dashboard$ChangeSearchRestore),
																		$elm$html$Html$Attributes$value(model.searchRestore)
																	]),
																_List_Nil)
															]))
													])),
												A2(
												$elm$html$Html$table,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('table table-hover'),
														A2($elm$html$Html$Attributes$style, 'table-layout', 'fixed'),
														A2($elm$html$Html$Attributes$style, 'word-wrap', 'break-word'),
														$elm$html$Html$Attributes$id('websites')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$thead,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$elm$html$Html$tr,
																_List_Nil,
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('ID')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Date')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Wayback Timestamp')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Domain')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Status')
																			]))
																	]))
															])),
														A2(
														$elm$html$Html$tbody,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$id('websites')
															]),
														A2($elm$core$List$map, $author$project$Pages$Dashboard$viewRestoreItem, model.tempRestores))
													])),
												A5($author$project$Common$PageViewer$viewPages, $author$project$Pages$Dashboard$ClickedPrevPageRestore, $author$project$Pages$Dashboard$ClickedNextPageRestore, $author$project$Pages$Dashboard$ClickedPageNumRestore, model.currentPageRestore, model.numPagesRestore),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('container')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('row')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-12 col-md-6')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$a,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('plan-dedicated-order-button'),
																				$elm$html$Html$Attributes$href(
																				$author$project$Gen$Route$toHref($author$project$Gen$Route$Subscription)),
																				A2($elm$html$Html$Attributes$style, 'background', '#5c5cfd')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Subscribe')
																			]))
																	])),
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('col-12 col-md-6')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$a,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('plan-dedicated-order-button'),
																				$elm$html$Html$Attributes$href(
																				$author$project$Gen$Route$toHref($author$project$Gen$Route$Order)),
																				A2($elm$html$Html$Attributes$style, 'background', '#5c5cfd')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Restore Website')
																			]))
																	]))
															]))
													]))
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Dashboard$ChangeSearchReceipt = function (a) {
	return {$: 'ChangeSearchReceipt', a: a};
};
var $author$project$Pages$Dashboard$ClickedNextPageReceipt = {$: 'ClickedNextPageReceipt'};
var $author$project$Pages$Dashboard$ClickedPageNumReceipt = function (a) {
	return {$: 'ClickedPageNumReceipt', a: a};
};
var $author$project$Pages$Dashboard$ClickedPrevPageReceipt = {$: 'ClickedPrevPageReceipt'};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $myrho$elm_round$Round$addSign = F2(
	function (signed, str) {
		var isNotZero = A2(
			$elm$core$List$any,
			function (c) {
				return (!_Utils_eq(
					c,
					_Utils_chr('0'))) && (!_Utils_eq(
					c,
					_Utils_chr('.')));
			},
			$elm$core$String$toList(str));
		return _Utils_ap(
			(signed && isNotZero) ? '-' : '',
			str);
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$Char$fromCode = _Char_fromCode;
var $myrho$elm_round$Round$increaseNum = function (_v0) {
	var head = _v0.a;
	var tail = _v0.b;
	if (_Utils_eq(
		head,
		_Utils_chr('9'))) {
		var _v1 = $elm$core$String$uncons(tail);
		if (_v1.$ === 'Nothing') {
			return '01';
		} else {
			var headtail = _v1.a;
			return A2(
				$elm$core$String$cons,
				_Utils_chr('0'),
				$myrho$elm_round$Round$increaseNum(headtail));
		}
	} else {
		var c = $elm$core$Char$toCode(head);
		return ((c >= 48) && (c < 57)) ? A2(
			$elm$core$String$cons,
			$elm$core$Char$fromCode(c + 1),
			tail) : '0';
	}
};
var $elm$core$Basics$isInfinite = _Basics_isInfinite;
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)));
	});
var $elm$core$String$reverse = _String_reverse;
var $myrho$elm_round$Round$splitComma = function (str) {
	var _v0 = A2($elm$core$String$split, '.', str);
	if (_v0.b) {
		if (_v0.b.b) {
			var before = _v0.a;
			var _v1 = _v0.b;
			var after = _v1.a;
			return _Utils_Tuple2(before, after);
		} else {
			var before = _v0.a;
			return _Utils_Tuple2(before, '0');
		}
	} else {
		return _Utils_Tuple2('0', '0');
	}
};
var $myrho$elm_round$Round$toDecimal = function (fl) {
	var _v0 = A2(
		$elm$core$String$split,
		'e',
		$elm$core$String$fromFloat(
			$elm$core$Basics$abs(fl)));
	if (_v0.b) {
		if (_v0.b.b) {
			var num = _v0.a;
			var _v1 = _v0.b;
			var exp = _v1.a;
			var e = A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(
					A2($elm$core$String$startsWith, '+', exp) ? A2($elm$core$String$dropLeft, 1, exp) : exp));
			var _v2 = $myrho$elm_round$Round$splitComma(num);
			var before = _v2.a;
			var after = _v2.b;
			var total = _Utils_ap(before, after);
			var zeroed = (e < 0) ? A2(
				$elm$core$Maybe$withDefault,
				'0',
				A2(
					$elm$core$Maybe$map,
					function (_v3) {
						var a = _v3.a;
						var b = _v3.b;
						return a + ('.' + b);
					},
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$mapFirst($elm$core$String$fromChar),
						$elm$core$String$uncons(
							_Utils_ap(
								A2(
									$elm$core$String$repeat,
									$elm$core$Basics$abs(e),
									'0'),
								total))))) : A3(
				$elm$core$String$padRight,
				e + 1,
				_Utils_chr('0'),
				total);
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				zeroed);
		} else {
			var num = _v0.a;
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				num);
		}
	} else {
		return '';
	}
};
var $myrho$elm_round$Round$roundFun = F3(
	function (functor, s, fl) {
		if ($elm$core$Basics$isInfinite(fl) || $elm$core$Basics$isNaN(fl)) {
			return $elm$core$String$fromFloat(fl);
		} else {
			var signed = fl < 0;
			var _v0 = $myrho$elm_round$Round$splitComma(
				$myrho$elm_round$Round$toDecimal(
					$elm$core$Basics$abs(fl)));
			var before = _v0.a;
			var after = _v0.b;
			var r = $elm$core$String$length(before) + s;
			var normalized = _Utils_ap(
				A2($elm$core$String$repeat, (-r) + 1, '0'),
				A3(
					$elm$core$String$padRight,
					r,
					_Utils_chr('0'),
					_Utils_ap(before, after)));
			var totalLen = $elm$core$String$length(normalized);
			var roundDigitIndex = A2($elm$core$Basics$max, 1, r);
			var increase = A2(
				functor,
				signed,
				A3($elm$core$String$slice, roundDigitIndex, totalLen, normalized));
			var remains = A3($elm$core$String$slice, 0, roundDigitIndex, normalized);
			var num = increase ? $elm$core$String$reverse(
				A2(
					$elm$core$Maybe$withDefault,
					'1',
					A2(
						$elm$core$Maybe$map,
						$myrho$elm_round$Round$increaseNum,
						$elm$core$String$uncons(
							$elm$core$String$reverse(remains))))) : remains;
			var numLen = $elm$core$String$length(num);
			var numZeroed = (num === '0') ? num : ((s <= 0) ? _Utils_ap(
				num,
				A2(
					$elm$core$String$repeat,
					$elm$core$Basics$abs(s),
					'0')) : ((_Utils_cmp(
				s,
				$elm$core$String$length(after)) < 0) ? (A3($elm$core$String$slice, 0, numLen - s, num) + ('.' + A3($elm$core$String$slice, numLen - s, numLen, num))) : _Utils_ap(
				before + '.',
				A3(
					$elm$core$String$padRight,
					s,
					_Utils_chr('0'),
					after))));
			return A2($myrho$elm_round$Round$addSign, signed, numZeroed);
		}
	});
var $myrho$elm_round$Round$round = $myrho$elm_round$Round$roundFun(
	F2(
		function (signed, str) {
			var _v0 = $elm$core$String$uncons(str);
			if (_v0.$ === 'Nothing') {
				return false;
			} else {
				if ('5' === _v0.a.a.valueOf()) {
					if (_v0.a.b === '') {
						var _v1 = _v0.a;
						return !signed;
					} else {
						var _v2 = _v0.a;
						return true;
					}
				} else {
					var _v3 = _v0.a;
					var _int = _v3.a;
					return function (i) {
						return ((i > 53) && signed) || ((i >= 53) && (!signed));
					}(
						$elm$core$Char$toCode(_int));
				}
			}
		}));
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$Pages$Dashboard$viewReceiptItem = function (receipt) {
	return A2(
		$elm$html$Html$tr,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('_website')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$th,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$scope('row')
					]),
				_List_fromArray(
					[
						A2($elm$html$Html$a, _List_Nil, _List_Nil),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href(receipt.url),
								$elm$html$Html$Attributes$target('_blank')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(receipt.id)
							]))
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(receipt.date)
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						function () {
						var _v0 = $elm$core$String$toFloat(receipt.amount);
						if (_v0.$ === 'Just') {
							var amount = _v0.a;
							return $elm$html$Html$text(
								'$' + A2($myrho$elm_round$Round$round, 2, amount));
						} else {
							return $elm$html$Html$text('$' + receipt.amount);
						}
					}()
					]))
			]));
};
var $author$project$Pages$Dashboard$viewSection2 = function (model) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('padding-20-0')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('row justify-content-start futures-version-2')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-lg')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('futures-version-3-box')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h4,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Payment History')
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('col-sm-12 col-md-4 float-right')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$id('websites_filter'),
																$elm$html$Html$Attributes$class('dataTables_filter')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$input,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$type_('text'),
																		$elm$html$Html$Attributes$class('form-control'),
																		$elm$html$Html$Attributes$id('usr'),
																		$elm$html$Html$Attributes$placeholder('Search'),
																		$elm$html$Html$Events$onInput($author$project$Pages$Dashboard$ChangeSearchReceipt),
																		$elm$html$Html$Attributes$value(model.searchReceipts)
																	]),
																_List_Nil)
															]))
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'),
														$elm$html$Html$Attributes$class('modal fade'),
														$elm$html$Html$Attributes$id('model_website_'),
														A2($elm$html$Html$Attributes$attribute, 'role', 'dialog'),
														$elm$html$Html$Attributes$tabindex(-1)
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('modal-dialog'),
																A2($elm$html$Html$Attributes$attribute, 'role', 'document')
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$div,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('modal-content')
																	]),
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('modal-header')
																			]),
																		_List_fromArray(
																			[
																				A2(
																				$elm$html$Html$h5,
																				_List_fromArray(
																					[
																						$elm$html$Html$Attributes$class('modal-title')
																					]),
																				_List_fromArray(
																					[
																						$elm$html$Html$text('Confirm Deletion')
																					])),
																				A2(
																				$elm$html$Html$button,
																				_List_fromArray(
																					[
																						A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Close'),
																						$elm$html$Html$Attributes$class('close'),
																						A2($elm$html$Html$Attributes$attribute, 'data-dismiss', 'modal'),
																						$elm$html$Html$Attributes$type_('button')
																					]),
																				_List_fromArray(
																					[
																						A2(
																						$elm$html$Html$span,
																						_List_fromArray(
																							[
																								A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
																							]),
																						_List_fromArray(
																							[
																								$elm$html$Html$text('×')
																							]))
																					]))
																			])),
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('modal-body')
																			]),
																		_List_fromArray(
																			[
																				A2(
																				$elm$html$Html$p,
																				_List_Nil,
																				_List_fromArray(
																					[
																						$elm$html$Html$text('Are you sure you want to delete the website backup for:')
																					])),
																				A2(
																				$elm$html$Html$p,
																				_List_Nil,
																				_List_fromArray(
																					[
																						$elm$html$Html$text('All data will be deleted during the next batch job.')
																					]))
																			])),
																		A2(
																		$elm$html$Html$div,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('modal-footer')
																			]),
																		_List_fromArray(
																			[
																				A2(
																				$elm$html$Html$button,
																				_List_fromArray(
																					[
																						$elm$html$Html$Attributes$class('btn btn-primary'),
																						$elm$html$Html$Attributes$id('confirm_deletion'),
																						$elm$html$Html$Attributes$type_('button')
																					]),
																				_List_fromArray(
																					[
																						$elm$html$Html$text('Confirm')
																					])),
																				A2(
																				$elm$html$Html$button,
																				_List_fromArray(
																					[
																						$elm$html$Html$Attributes$class('btn btn-secondary'),
																						A2($elm$html$Html$Attributes$attribute, 'data-dismiss', 'modal'),
																						$elm$html$Html$Attributes$type_('button')
																					]),
																				_List_fromArray(
																					[
																						$elm$html$Html$text('Cancel')
																					]))
																			]))
																	]))
															]))
													])),
												A2(
												$elm$html$Html$table,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('table table-hover'),
														$elm$html$Html$Attributes$id('payments'),
														A2($elm$html$Html$Attributes$style, 'table-layout', 'fixed'),
														A2($elm$html$Html$Attributes$style, 'word-wrap', 'break-word')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$thead,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$elm$html$Html$tr,
																_List_Nil,
																_List_fromArray(
																	[
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('ID')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Date')
																			])),
																		A2(
																		$elm$html$Html$th,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$scope('col')
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('Amount')
																			]))
																	]))
															])),
														A2(
														$elm$html$Html$tbody,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$id('websites')
															]),
														A2($elm$core$List$map, $author$project$Pages$Dashboard$viewReceiptItem, model.tempReceipts))
													])),
												A5($author$project$Common$PageViewer$viewPages, $author$project$Pages$Dashboard$ClickedPrevPageReceipt, $author$project$Pages$Dashboard$ClickedNextPageReceipt, $author$project$Pages$Dashboard$ClickedPageNumReceipt, model.currentPageReceipts, model.numPagesReceipts)
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Dashboard$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'sub',
					'',
					$author$project$Pages$Dashboard$viewMain,
					$elm$html$Html$text(''),
					$author$project$Pages$Dashboard$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$Dashboard$viewSection1(model),
					$author$project$Pages$Dashboard$viewSection2(model),
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Dashboard | Wayback Download'
		};
	});
var $author$project$Pages$Dashboard$page = F2(
	function (shared, req) {
		return $author$project$Page$protected.element(
			function (user) {
				return {
					init: A3($author$project$Pages$Dashboard$init, shared, user, req),
					subscriptions: function (_v0) {
						return $elm$core$Platform$Sub$none;
					},
					update: $author$project$Pages$Dashboard$update(shared.storage),
					view: $author$project$Pages$Dashboard$view(shared)
				};
			});
	});
var $author$project$Proto$Response$ForgotPasswordForm = F2(
	function (recaptcha, username) {
		return {recaptcha: recaptcha, username: username};
	});
var $author$project$Pages$ForgotPassword$Model = F3(
	function (form, status, showMenu) {
		return {form: form, showMenu: showMenu, status: status};
	});
var $author$project$Pages$ForgotPassword$None = {$: 'None'};
var $author$project$Pages$ForgotPassword$init = _Utils_Tuple2(
	A3(
		$author$project$Pages$ForgotPassword$Model,
		A2($author$project$Proto$Response$ForgotPasswordForm, '', ''),
		$author$project$Pages$ForgotPassword$None,
		false),
	$author$project$Shared$loadhCaptcha);
var $author$project$Pages$ForgotPassword$ReceivedCaptcha = function (a) {
	return {$: 'ReceivedCaptcha', a: a};
};
var $author$project$Pages$ForgotPassword$subscriptions = function (_v0) {
	return $author$project$Shared$messageReceiver($author$project$Pages$ForgotPassword$ReceivedCaptcha);
};
var $author$project$Pages$ForgotPassword$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $author$project$Pages$ForgotPassword$Loading = {$: 'Loading'};
var $author$project$Pages$ForgotPassword$FormSentResp = function (a) {
	return {$: 'FormSentResp', a: a};
};
var $author$project$Proto$Response$encodeForgotPasswordForm = function (value) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(
		_List_fromArray(
			[
				_Utils_Tuple2(
				1,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.recaptcha)),
				_Utils_Tuple2(
				2,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.username))
			]));
};
var $author$project$Pages$ForgotPassword$forgotPassword = F2(
	function (env, model) {
		return _Utils_Tuple2(
			model,
			$elm$http$Http$post(
				{
					body: A2(
						$elm$http$Http$bytesBody,
						'application/protobuf',
						$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
							$author$project$Proto$Response$encodeForgotPasswordForm(model.form))),
					expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$ForgotPassword$FormSentResp, $author$project$Proto$Response$decodeResponse),
					url: env.serverUrl + '/forgot-password'
				}));
	});
var $author$project$Pages$ForgotPassword$update = F4(
	function (shared, req, msg, model) {
		switch (msg.$) {
			case 'ClickedReset':
				return (model.form.username === '') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$ForgotPassword$Failure('Username cannot be empty')
						}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{status: $author$project$Pages$ForgotPassword$Loading}),
					$author$project$Shared$getCaptchaResponse);
			case 'ChangeUsername':
				var username = msg.a;
				return _Utils_Tuple2(
					function () {
						var oldForm = model.form;
						var newForm = _Utils_update(
							oldForm,
							{username: username});
						return _Utils_update(
							model,
							{form: newForm});
					}(),
					$elm$core$Platform$Cmd$none);
			case 'ReceivedCaptcha':
				var captcha = msg.a;
				if (captcha === '') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Pages$ForgotPassword$Failure('Must fill out captcha')
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var oldForm = model.form;
					var newForm = _Utils_update(
						oldForm,
						{recaptcha: captcha});
					return A2(
						$author$project$Pages$ForgotPassword$forgotPassword,
						shared.env,
						_Utils_update(
							model,
							{form: newForm}));
				}
			case 'FormSentResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v2 = resp.status;
					if (_v2.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$ForgotPassword$Failure(resp.error)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							model,
							A2(
								$author$project$Request$replaceRoute,
								$author$project$Gen$Route$ForgotPassword__Username_(
									{username: model.form.username}),
								req));
					}
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Pages$ForgotPassword$Failure('Unable to reset password, please try again later')
							}),
						$author$project$Shared$resetCaptcha(_Utils_Tuple0));
				}
			default:
				return model.showMenu ? _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: false}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: true}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$ForgotPassword$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$ForgotPassword$ChangeUsername = function (a) {
	return {$: 'ChangeUsername', a: a};
};
var $author$project$Pages$ForgotPassword$ClickedReset = {$: 'ClickedReset'};
var $author$project$Pages$ForgotPassword$viewMain = function (model) {
	return A2(
		$elm$html$Html$main_,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('col-sm')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row form-contain-home contact-page-form-send'),
										$elm$html$Html$Attributes$id('ajax-contact')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12'),
												$elm$html$Html$Attributes$id('alert'),
												A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$h5,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Forgot Password')
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('form-messages')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field input-field')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$input,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-contain-home-input'),
																$elm$html$Html$Attributes$id('username'),
																$elm$html$Html$Attributes$name('username'),
																$elm$html$Html$Attributes$placeholder('Username'),
																$elm$html$Html$Attributes$required(true),
																$elm$html$Html$Attributes$type_('text'),
																$elm$html$Html$Attributes$value(model.form.username),
																$elm$html$Html$Events$onInput($author$project$Pages$ForgotPassword$ChangeUsername)
															]),
														_List_Nil),
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('fas fa-address-card')
															]),
														_List_Nil)
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('h-captcha'),
												$elm$html$Html$Attributes$class('h-captcha col-md-12')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn-holder-contact'),
												$elm$html$Html$Attributes$id('hidden_reset_button')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$id('forgot_password'),
														$elm$html$Html$Attributes$type_('submit'),
														$elm$html$Html$Events$onClick($author$project$Pages$ForgotPassword$ClickedReset)
													]),
												function () {
													var _v0 = model.status;
													if (_v0.$ === 'Loading') {
														return $author$project$Common$Spinner$viewSpinnerText;
													} else {
														return _List_fromArray(
															[
																$elm$html$Html$text('Reset')
															]);
													}
												}())
											])),
										A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin-top', '0.5rem')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Remember your password?'),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href('/login')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(' Log In')
													]))
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$ForgotPassword$viewSection1 = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('padding-100-0')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_Nil)
		]));
var $author$project$Pages$ForgotPassword$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'main',
					'',
					$author$project$Pages$ForgotPassword$viewMain(model),
					$elm$html$Html$text(''),
					$author$project$Pages$ForgotPassword$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$ForgotPassword$viewSection1,
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Forgot Password | Wayback Download'
		};
	});
var $author$project$Pages$ForgotPassword$page = F2(
	function (shared, req) {
		return $author$project$Page$element(
			{
				init: $author$project$Pages$ForgotPassword$init,
				subscriptions: $author$project$Pages$ForgotPassword$subscriptions,
				update: A2($author$project$Pages$ForgotPassword$update, shared, req),
				view: $author$project$Pages$ForgotPassword$view(shared)
			});
	});
var $author$project$Proto$Response$ForgotPasswordConfirmForm = F4(
	function (recaptcha, username, token, password) {
		return {password: password, recaptcha: recaptcha, token: token, username: username};
	});
var $author$project$Pages$ForgotPassword$Username_$Model = F3(
	function (form, status, showMenu) {
		return {form: form, showMenu: showMenu, status: status};
	});
var $author$project$Pages$ForgotPassword$Username_$Success = function (a) {
	return {$: 'Success', a: a};
};
var $author$project$Pages$ForgotPassword$Username_$init = function (params) {
	var model = A3(
		$author$project$Pages$ForgotPassword$Username_$Model,
		A4($author$project$Proto$Response$ForgotPasswordConfirmForm, '', params.username, '', ''),
		$author$project$Pages$ForgotPassword$Username_$Success('Successfully sent reset token. Please verify your emails.'),
		false);
	return _Utils_Tuple2(model, $author$project$Shared$loadhCaptcha);
};
var $author$project$Pages$ForgotPassword$Username_$ReceivedCaptcha = function (a) {
	return {$: 'ReceivedCaptcha', a: a};
};
var $author$project$Pages$ForgotPassword$Username_$subscriptions = function (_v0) {
	return $author$project$Shared$messageReceiver($author$project$Pages$ForgotPassword$Username_$ReceivedCaptcha);
};
var $author$project$Pages$ForgotPassword$Username_$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $author$project$Pages$ForgotPassword$Username_$Loading = {$: 'Loading'};
var $author$project$Pages$ForgotPassword$Username_$FormSentResp = function (a) {
	return {$: 'FormSentResp', a: a};
};
var $author$project$Proto$Response$encodeForgotPasswordConfirmForm = function (value) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(
		_List_fromArray(
			[
				_Utils_Tuple2(
				1,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.recaptcha)),
				_Utils_Tuple2(
				2,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.username)),
				_Utils_Tuple2(
				3,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.token)),
				_Utils_Tuple2(
				4,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.password))
			]));
};
var $author$project$Pages$ForgotPassword$Username_$forgotPassword = F2(
	function (env, model) {
		return _Utils_Tuple2(
			model,
			$elm$http$Http$post(
				{
					body: A2(
						$elm$http$Http$bytesBody,
						'application/protobuf',
						$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
							$author$project$Proto$Response$encodeForgotPasswordConfirmForm(model.form))),
					expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$ForgotPassword$Username_$FormSentResp, $author$project$Proto$Response$decodeResponse),
					url: env.serverUrl + '/forgot-password-confirm'
				}));
	});
var $author$project$Pages$ForgotPassword$Username_$update = F3(
	function (shared, msg, model) {
		switch (msg.$) {
			case 'ClickedConfirm':
				return (model.form.password === '') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$ForgotPassword$Username_$Failure('Password cannot be empty')
						}),
					$elm$core$Platform$Cmd$none) : ((model.form.token === '') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$ForgotPassword$Username_$Failure('Token cannot be empty')
						}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{status: $author$project$Pages$ForgotPassword$Username_$Loading}),
					$author$project$Shared$getCaptchaResponse));
			case 'ChangePassword':
				var password = msg.a;
				return _Utils_Tuple2(
					function () {
						var oldForm = model.form;
						var newForm = _Utils_update(
							oldForm,
							{password: password});
						return _Utils_update(
							model,
							{form: newForm});
					}(),
					$elm$core$Platform$Cmd$none);
			case 'ChangeToken':
				var token = msg.a;
				return _Utils_Tuple2(
					function () {
						var oldForm = model.form;
						var newForm = _Utils_update(
							oldForm,
							{token: token});
						return _Utils_update(
							model,
							{form: newForm});
					}(),
					$elm$core$Platform$Cmd$none);
			case 'ReceivedCaptcha':
				var captcha = msg.a;
				if (captcha === '') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Pages$ForgotPassword$Username_$Failure('Must fill out captcha')
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var oldForm = model.form;
					var newForm = _Utils_update(
						oldForm,
						{recaptcha: captcha});
					return A2(
						$author$project$Pages$ForgotPassword$Username_$forgotPassword,
						shared.env,
						_Utils_update(
							model,
							{form: newForm}));
				}
			case 'FormSentResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v2 = resp.status;
					if (_v2.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$ForgotPassword$Username_$Failure(resp.error)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v3 = resp.data;
						if (_v3.$ === 'Just') {
							var data = _v3.a;
							return _Utils_Tuple2(
								A3(
									$author$project$Pages$ForgotPassword$Username_$Model,
									A4($author$project$Proto$Response$ForgotPasswordConfirmForm, '', model.form.username, '', ''),
									$author$project$Pages$ForgotPassword$Username_$Success(data.info),
									false),
								$author$project$Shared$resetCaptcha(_Utils_Tuple0));
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										status: $author$project$Pages$ForgotPassword$Username_$Failure('Unable to reset password, please try again later')
									}),
								$author$project$Shared$resetCaptcha(_Utils_Tuple0));
						}
					}
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Pages$ForgotPassword$Username_$Failure('Unable to reset password, please try again later')
							}),
						$author$project$Shared$resetCaptcha(_Utils_Tuple0));
				}
			default:
				return model.showMenu ? _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: false}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: true}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$ForgotPassword$Username_$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$ForgotPassword$Username_$ChangePassword = function (a) {
	return {$: 'ChangePassword', a: a};
};
var $author$project$Pages$ForgotPassword$Username_$ChangeToken = function (a) {
	return {$: 'ChangeToken', a: a};
};
var $author$project$Pages$ForgotPassword$Username_$ClickedConfirm = {$: 'ClickedConfirm'};
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $author$project$Pages$ForgotPassword$Username_$viewMain = function (model) {
	return A2(
		$elm$html$Html$main_,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('col-sm')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row form-contain-home contact-page-form-send'),
										$elm$html$Html$Attributes$id('ajax-contact')
									]),
								_List_fromArray(
									[
										function () {
										var _v0 = model.status;
										switch (_v0.$) {
											case 'Success':
												var msg = _v0.a;
												return $author$project$Common$Alert$viewAlertSuccess(msg);
											case 'Failure':
												var err = _v0.a;
												return $author$project$Common$Alert$viewAlertError(err);
											default:
												return A2($elm$html$Html$div, _List_Nil, _List_Nil);
										}
									}(),
										A2(
										$elm$html$Html$h5,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Forgot Password')
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('form-messages')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field input-field')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$input,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-contain-home-input'),
																$elm$html$Html$Attributes$id('username'),
																$elm$html$Html$Attributes$name('username'),
																$elm$html$Html$Attributes$placeholder('Username'),
																$elm$html$Html$Attributes$required(true),
																$elm$html$Html$Attributes$type_('text'),
																$elm$html$Html$Attributes$value(model.form.username),
																$elm$html$Html$Attributes$disabled(true)
															]),
														_List_Nil),
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('fas fa-address-card')
															]),
														_List_Nil)
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12'),
												$elm$html$Html$Attributes$id('hidden_token')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field input-field')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$input,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-contain-home-input'),
																$elm$html$Html$Attributes$id('token'),
																$elm$html$Html$Attributes$name('token'),
																$elm$html$Html$Attributes$placeholder('Token'),
																$elm$html$Html$Attributes$required(true),
																$elm$html$Html$Attributes$type_('text'),
																$elm$html$Html$Attributes$value(model.form.token),
																$elm$html$Html$Events$onInput($author$project$Pages$ForgotPassword$Username_$ChangeToken)
															]),
														_List_Nil),
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('fas fa-address-card')
															]),
														_List_Nil)
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12'),
												$elm$html$Html$Attributes$id('hidden_password')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field input-field')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$input,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-contain-home-input'),
																$elm$html$Html$Attributes$id('password'),
																$elm$html$Html$Attributes$name('password'),
																$elm$html$Html$Attributes$placeholder('Password'),
																$elm$html$Html$Attributes$required(true),
																$elm$html$Html$Attributes$type_('password'),
																$elm$html$Html$Attributes$value(model.form.password),
																$elm$html$Html$Events$onInput($author$project$Pages$ForgotPassword$Username_$ChangePassword)
															]),
														_List_Nil),
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('fas fa-key')
															]),
														_List_Nil)
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('h-captcha'),
												$elm$html$Html$Attributes$class('h-captcha col-md-12')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn-holder-contact'),
												$elm$html$Html$Attributes$id('hidden_confirm_button')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$id('forgot_password_confirm'),
														$elm$html$Html$Attributes$type_('submit'),
														$elm$html$Html$Events$onClick($author$project$Pages$ForgotPassword$Username_$ClickedConfirm)
													]),
												function () {
													var _v1 = model.status;
													if (_v1.$ === 'Loading') {
														return $author$project$Common$Spinner$viewSpinnerText;
													} else {
														return _List_fromArray(
															[
																$elm$html$Html$text('Confirm')
															]);
													}
												}())
											])),
										A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin-top', '0.5rem')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Remember your password?'),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href('/login')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(' Log In')
													]))
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$ForgotPassword$Username_$viewSection1 = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('padding-100-0')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_Nil)
		]));
var $author$project$Pages$ForgotPassword$Username_$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'main',
					'',
					$author$project$Pages$ForgotPassword$Username_$viewMain(model),
					$elm$html$Html$text(''),
					$author$project$Pages$ForgotPassword$Username_$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$ForgotPassword$Username_$viewSection1,
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Forgot Password Confirm | Wayback Download'
		};
	});
var $author$project$Pages$ForgotPassword$Username_$page = F2(
	function (shared, req) {
		return $author$project$Page$element(
			{
				init: $author$project$Pages$ForgotPassword$Username_$init(req.params),
				subscriptions: $author$project$Pages$ForgotPassword$Username_$subscriptions,
				update: $author$project$Pages$ForgotPassword$Username_$update(shared),
				view: $author$project$Pages$ForgotPassword$Username_$view(shared)
			});
	});
var $author$project$Pages$Home_$Model = F4(
	function (domain, url, status, showMenu) {
		return {domain: domain, showMenu: showMenu, status: status, url: url};
	});
var $author$project$Pages$Home_$None = {$: 'None'};
var $author$project$Pages$Home_$init = _Utils_Tuple2(
	A4($author$project$Pages$Home_$Model, '', '', $author$project$Pages$Home_$None, false),
	$elm$core$Platform$Cmd$none);
var $author$project$Pages$Home_$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $author$project$Pages$Home_$Loading = {$: 'Loading'};
var $author$project$Proto$Response$Cart = function (items) {
	return {items: items};
};
var $author$project$Pages$Home_$CheckoutResp = function (a) {
	return {$: 'CheckoutResp', a: a};
};
var $author$project$Proto$Response$CartItem = F2(
	function (timestamp, domain) {
		return {domain: domain, timestamp: timestamp};
	});
var $elm$parser$Parser$Advanced$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 'Good', a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.src);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.offset, offset) < 0,
					_Utils_Tuple0,
					{col: col, context: s0.context, indent: s0.indent, offset: offset, row: row, src: s0.src});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.offset, s.row, s.col, s);
		});
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 'Bad', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						A2(
							func,
							A3($elm$core$String$slice, s0.offset, s1.offset, s0.src),
							a),
						s1);
				}
			});
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0.a;
		var parseB = _v1.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v2 = parseA(s0);
				if (_v2.$ === 'Bad') {
					var p = _v2.a;
					var x = _v2.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v2.a;
					var a = _v2.b;
					var s1 = _v2.c;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3(
							$elm$parser$Parser$Advanced$Good,
							p1 || p2,
							A2(func, a, b),
							s2);
					}
				}
			});
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Advanced$Empty = {$: 'Empty'};
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 'Append', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
		});
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$Good, false, a, s);
		});
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 'ExpectingSymbol', a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 'Token', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 'AddRight', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {col: col, contextStack: contextStack, problem: problem, row: row};
	});
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.row, s.col, x, s.context));
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $author$project$Common$Parsing$httpParser = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($elm$core$Maybe$Just),
				$elm$parser$Parser$symbol('https:')),
			$elm$parser$Parser$getChompedString(
				$elm$parser$Parser$chompWhile(
					function (c) {
						return _Utils_eq(
							c,
							_Utils_chr('/'));
					}))),
			$elm$parser$Parser$succeed($elm$core$Maybe$Nothing)
		]));
var $author$project$Common$Parsing$httpsParser = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($elm$core$Maybe$Just),
				$elm$parser$Parser$symbol('http:/')),
			$elm$parser$Parser$getChompedString(
				$elm$parser$Parser$chompWhile(
					function (c) {
						return _Utils_eq(
							c,
							_Utils_chr('/'));
					}))),
			$elm$parser$Parser$succeed($elm$core$Maybe$Nothing)
		]));
var $author$project$Common$Parsing$cartParser = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($author$project$Proto$Response$CartItem),
			$elm$parser$Parser$symbol('https://web.archive.org/web/')),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$getChompedString(
						$elm$parser$Parser$chompWhile(
							function (c) {
								return $elm$core$Char$isDigit(c);
							})),
					$elm$parser$Parser$symbol('/')),
				$author$project$Common$Parsing$httpsParser),
			$author$project$Common$Parsing$httpParser)),
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompWhile(
			function (c) {
				return !_Utils_eq(
					c,
					_Utils_chr('/'));
			})));
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {col: col, problem: problem, row: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.row, p.col, p.problem);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 'Empty':
					return list;
				case 'AddRight':
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0.a;
		var _v1 = parse(
			{col: 1, context: _List_Nil, indent: 1, offset: 0, row: 1, src: src});
		if (_v1.$ === 'Good') {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (_v0.$ === 'Ok') {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $author$project$Pages$Home_$getCheckoutUrl = F2(
	function (env, model) {
		var _v0 = A2($elm$parser$Parser$run, $author$project$Common$Parsing$cartParser, model.url);
		if (_v0.$ === 'Ok') {
			var cartItem = _v0.a;
			return _Utils_Tuple2(
				model,
				$elm$http$Http$post(
					{
						body: A2(
							$elm$http$Http$bytesBody,
							'application/protobuf',
							$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
								$author$project$Proto$Response$encodeCart(
									$author$project$Proto$Response$Cart(
										_List_fromArray(
											[cartItem]))))),
						expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Home_$CheckoutResp, $author$project$Proto$Response$decodeResponse),
						url: env.serverUrl + '/checkout'
					}));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Home_$Failure('Invalid URL provided')
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Shared$hideModal = function (id) {
	return $author$project$Shared$sendMessage(
		A4($author$project$Shared$Message, 'hideModal', id, '', $elm$core$Maybe$Nothing));
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $author$project$Common$Regex$domainPattern = '^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\\.(xn--)?([a-z0-9\\-]{1,61}|[a-z0-9-]{1,30}\\.[a-z]{2,})$';
var $author$project$Common$Regex$domainRegex = function (domain) {
	return A2(
		$elm$regex$Regex$contains,
		A2(
			$elm$core$Maybe$withDefault,
			$elm$regex$Regex$never,
			$elm$regex$Regex$fromString($author$project$Common$Regex$domainPattern)),
		domain);
};
var $author$project$Shared$Popover = F3(
	function (title, content, placement) {
		return {content: content, placement: placement, title: title};
	});
var $author$project$Shared$popoverMessage = F3(
	function (title, content, placement) {
		return $author$project$Shared$sendMessage(
			A4(
				$author$project$Shared$Message,
				'popoverMessage',
				'',
				'',
				$elm$core$Maybe$Just(
					A3($author$project$Shared$Popover, title, content, placement))));
	});
var $author$project$Shared$showModal = function (id) {
	return $author$project$Shared$sendMessage(
		A4($author$project$Shared$Message, 'showModal', id, '', $elm$core$Maybe$Nothing));
};
var $author$project$Pages$Home_$restoreAction = function (model) {
	return (model.domain === '') ? _Utils_Tuple2(
		model,
		A3($author$project$Shared$popoverMessage, 'Error', 'URL cannot be blank', 'bottom')) : ($author$project$Common$Regex$domainRegex(
		$elm$core$String$toLower(model.domain)) ? _Utils_Tuple2(
		model,
		$author$project$Shared$showModal('helpModal')) : _Utils_Tuple2(
		model,
		A3($author$project$Shared$popoverMessage, 'Error', 'Invalid domain provided (ie. example.com)', 'bottom')));
};
var $author$project$Pages$Home_$update = F3(
	function (shared, msg, model) {
		switch (msg.$) {
			case 'KeyDown':
				var key = msg.a;
				return (key === 13) ? $author$project$Pages$Home_$restoreAction(model) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'ClickedRestore':
				return $author$project$Pages$Home_$restoreAction(model);
			case 'ClickedExit':
				return _Utils_Tuple2(
					model,
					$author$project$Shared$hideModal('helpModal'));
			case 'ClickedCheckout':
				return A2(
					$author$project$Pages$Home_$getCheckoutUrl,
					shared.env,
					_Utils_update(
						model,
						{status: $author$project$Pages$Home_$Loading}));
			case 'ChangeWaybackUrl':
				var url = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{url: url}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeDomain':
				var domain = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{domain: domain}),
					$elm$core$Platform$Cmd$none);
			case 'CheckoutResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v2 = resp.status;
					if (_v2.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Home_$Failure(resp.error)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v3 = resp.data;
						if (_v3.$ === 'Just') {
							var data = _v3.a;
							return _Utils_Tuple2(
								model,
								$elm$browser$Browser$Navigation$load(data.url));
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										status: $author$project$Pages$Home_$Failure('Unable to process request, please try again later')
									}),
								$elm$core$Platform$Cmd$none);
						}
					}
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Pages$Home_$Failure('Unable to process request, please try again later')
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'ClickedOrderNow':
				return _Utils_Tuple2(
					model,
					$author$project$Shared$showModal('helpModal'));
			default:
				return model.showMenu ? _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: false}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: true}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Home_$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$Home_$ChangeDomain = function (a) {
	return {$: 'ChangeDomain', a: a};
};
var $author$project$Pages$Home_$ClickedRestore = {$: 'ClickedRestore'};
var $author$project$Pages$Home_$KeyDown = function (a) {
	return {$: 'KeyDown', a: a};
};
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $author$project$Pages$Home_$onKeyDown = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'keydown',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$keyCode));
};
var $author$project$Pages$Home_$viewMain = function (model) {
	return A2(
		$elm$html$Html$main_,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container mb-auto')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('carousel carousel-main')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('carousel-cell')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h1,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mt-3 main-header-text-title')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Recover Your Lost Website from archive.org')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row justify-content-center domain-search-row')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-7'),
												$elm$html$Html$Attributes$id('domain-search-header')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$i,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('fas fa-globe')
													]),
												_List_Nil),
												A2(
												$elm$html$Html$input,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$id('domain'),
														$elm$html$Html$Attributes$name('domain'),
														$elm$html$Html$Attributes$placeholder('select a domain to restore'),
														$elm$html$Html$Attributes$type_('text'),
														$elm$html$Html$Attributes$value(model.domain),
														$elm$html$Html$Events$onInput($author$project$Pages$Home_$ChangeDomain),
														$author$project$Pages$Home_$onKeyDown($author$project$Pages$Home_$KeyDown)
													]),
												_List_Nil),
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('inline-button-domain-order')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$button,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$attribute, 'data-placement', 'left'),
																A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'tooltip'),
																$elm$html$Html$Attributes$id('transfer-btn'),
																$elm$html$Html$Attributes$name('restore'),
																$elm$html$Html$Attributes$type_('submit'),
																$elm$html$Html$Attributes$value('Restore'),
																$elm$html$Html$Events$onClick($author$project$Pages$Home_$ClickedRestore)
															]),
														_List_fromArray(
															[
																A2(
																$elm$html$Html$i,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('fas fa-undo')
																	]),
																_List_Nil)
															]))
													]))
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Home_$ChangeWaybackUrl = function (a) {
	return {$: 'ChangeWaybackUrl', a: a};
};
var $author$project$Pages$Home_$ClickedCheckout = {$: 'ClickedCheckout'};
var $elm$html$Html$b = _VirtualDom_node('b');
var $author$project$Common$Spinner$viewSpinnerSymbol = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('spinner-border spinner-border-sm'),
			A2($elm$html$Html$Attributes$attribute, 'role', 'status'),
			A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
		]),
	_List_Nil);
var $author$project$Pages$Home_$viewModal = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('modal'),
				A2($elm$html$Html$Attributes$attribute, 'data-backdrop', 'static'),
				A2($elm$html$Html$Attributes$attribute, 'data-keyboard', 'false'),
				$elm$html$Html$Attributes$id('helpModal')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-dialog modal-lg')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('modal-content')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('modal-header')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h4,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('modal-title')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('3 easy steps to start your recovery')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('close'),
												A2($elm$html$Html$Attributes$attribute, 'data-dismiss', 'modal'),
												$elm$html$Html$Attributes$id('exit'),
												$elm$html$Html$Attributes$type_('button')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('×')
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('modal-body')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$b,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Step 1. ')
													])),
												$elm$html$Html$text('Navigate to the '),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href('https://web.archive.org/web/*/' + model.domain),
														$elm$html$Html$Attributes$id('wayback_url'),
														$elm$html$Html$Attributes$target('_blank')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Wayback Machine')
													]))
											])),
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$b,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Step 2. ')
													])),
												$elm$html$Html$text('Select a snapshot using the date selector')
											])),
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$b,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Step 3. ')
													])),
												$elm$html$Html$text('Copy the URL in the bar below')
											])),
										function () {
										var _v0 = model.status;
										if (_v0.$ === 'Failure') {
											var err = _v0.a;
											return $author$project$Common$Alert$viewAlertError(err);
										} else {
											return A2($elm$html$Html$div, _List_Nil, _List_Nil);
										}
									}(),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md'),
												$elm$html$Html$Attributes$id('domain-search-header')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$i,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('fas fa-globe')
													]),
												_List_Nil),
												A2(
												$elm$html$Html$input,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$id('url-checkout'),
														$elm$html$Html$Attributes$name('url'),
														$elm$html$Html$Attributes$placeholder('https://web.archive.org/web/20210130001414/http://example.com/'),
														$elm$html$Html$Attributes$type_('text'),
														$elm$html$Html$Attributes$value(model.url),
														$elm$html$Html$Events$onInput($author$project$Pages$Home_$ChangeWaybackUrl)
													]),
												_List_Nil),
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('inline-button-domain-order')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$button,
														_List_fromArray(
															[
																A2($elm$html$Html$Attributes$attribute, 'data-placement', 'left'),
																A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'tooltip'),
																$elm$html$Html$Attributes$id('transfer-btn-2'),
																$elm$html$Html$Attributes$name('restore'),
																$elm$html$Html$Attributes$type_('submit'),
																$elm$html$Html$Attributes$value('Restore'),
																$elm$html$Html$Events$onClick($author$project$Pages$Home_$ClickedCheckout)
															]),
														_List_fromArray(
															[
																function () {
																var _v1 = model.status;
																if (_v1.$ === 'Loading') {
																	return $author$project$Common$Spinner$viewSpinnerSymbol;
																} else {
																	return A2(
																		$elm$html$Html$i,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('fas fa-undo')
																			]),
																		_List_Nil);
																}
															}()
															]))
													]))
											])),
										A2($elm$html$Html$br, _List_Nil, _List_Nil),
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(' If you require any assistance during this process, our'),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href('mailto:support@wayback.download')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(' support team ')
													])),
												$elm$html$Html$text('would be more than happy to help you out!')
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('modal-footer')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('btn btn-danger'),
														A2($elm$html$Html$Attributes$attribute, 'data-dismiss', 'modal'),
														$elm$html$Html$Attributes$id('cancel'),
														$elm$html$Html$Attributes$type_('button')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Cancel')
													]))
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Home_$viewSection1 = A2(
	$elm$html$Html$section,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row justify-content-start futures-version-2')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex-futures col-md-4')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('futures-version-2-box')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$i,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bredhicon-download-cloud')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$h5,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Complete Website Recovery')
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('All HTML, CSS, JS, images and fonts downloaded — your site looks exactly as it did in the archive.')
												]))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex-futures col-md-4')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('futures-version-2-box')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$i,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('bredhicon-share')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$h5,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('All Links Auto-Fixed')
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Every internal URL is automatically rewritten so your site works perfectly on any domain or hosting.')
												]))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex-futures col-md-4')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('futures-version-2-box')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$i,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('e-flaticon-032-sata')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$h5,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Upload & Go')
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Receive a zip file by email. Upload it to your hosting and your site is live — no technical skills needed.')
												]))
										]))
								]))
						]))
				]))
		]));
var $author$project$Pages$Home_$ClickedOrderNow = {$: 'ClickedOrderNow'};
var $elm$html$Html$small = _VirtualDom_node('small');
var $author$project$Pages$Home_$viewSection2 = function (env) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('padding-100-0 position-relative')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h5,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('title-default-coodiv-two')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Simple, transparent pricing.'),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mr-tp-20')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Flat fee per domain. No hidden charges.')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('test-row row justify-content-start second-pricing-table-container mr-tp-30')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-md-4')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('second-pricing-table')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h5,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('second-pricing-table-title')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('HTML Recovery'),
														A2(
														$elm$html$Html$span,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('1 domain recovered from archive.org')
															]))
													])),
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('second-pricing-table-price monthly')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('monthly')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(
																'$' + $elm$core$String$fromInt(env.itemCost)),
																A2(
																$elm$html$Html$small,
																_List_Nil,
																_List_fromArray(
																	[
																		$elm$html$Html$text('/website')
																	]))
															]))
													])),
												A2(
												$elm$html$Html$ul,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('second-pricing-table-body')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Looks 100% like the archived version')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('All CSS, images, JS & fonts included')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Archive.org headers stripped out')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Pages load on their original URLs')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Up to 20,000 pages or 10 GB')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Additional domains: $12 each')
															]))
													])),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('second-pricing-table-button'),
														$elm$html$Html$Attributes$href('#'),
														$elm$html$Html$Attributes$id('basic_order'),
														$elm$html$Html$Events$onClick($author$project$Pages$Home_$ClickedOrderNow)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Order now')
													]))
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-md-4')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('second-pricing-table')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h5,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('second-pricing-table-title')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('WordPress Conversion'),
														A2(
														$elm$html$Html$span,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('convert your HTML files to WordPress')
															]))
													])),
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('second-pricing-table-price monthly')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('monthly')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('$70'),
																A2(
																$elm$html$Html$small,
																_List_Nil,
																_List_fromArray(
																	[
																		$elm$html$Html$text('/domain')
																	]))
															]))
													])),
												A2(
												$elm$html$Html$ul,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('second-pricing-table-body')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('WordPress theme identical to original')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('WYSIWYG editor-ready pages')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Menu integration included')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Original title & meta descriptions')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Automatic string replacement')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Best-quality guarantee under $200')
															]))
													])),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('second-pricing-table-button'),
														$elm$html$Html$Attributes$href('#')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Coming Soon')
													]))
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-md-4')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('second-pricing-table style-2 active')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h5,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('second-pricing-table-title')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Bulk Subscription'),
														A2(
														$elm$html$Html$span,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('unlimited monthly access')
															]))
													])),
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('second-pricing-table-price monthly')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('monthly')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(
																'$' + $elm$core$String$fromInt(env.subscriptionCost)),
																A2(
																$elm$html$Html$small,
																_List_Nil,
																_List_fromArray(
																	[
																		$elm$html$Html$text('/mo')
																	]))
															]))
													])),
												A2(
												$elm$html$Html$ul,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('second-pricing-table-body')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Up to 10 HTML restores/month')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Priority processing')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Configurable link creation')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Discounted WordPress conversion ($55)')
															])),
														A2(
														$elm$html$Html$li,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Email support included')
															])),
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$id('flex-premium')
															]),
														_List_Nil)
													])),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('second-pricing-table-button'),
														$elm$html$Html$Attributes$href(
														$author$project$Gen$Route$toHref($author$project$Gen$Route$Subscription))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Subscribe')
													]))
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Home_$viewSection3 = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('padding-100-0 with-top-border')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h5,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('title-default-coodiv-two')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Frequently Asked Questions')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row justify-content-center mr-tp-40')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-md-9')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('accordion'),
											$elm$html$Html$Attributes$id('frequently-questions')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('questions-box')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('headingone')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$attribute, 'aria-controls', 'questionone'),
																	A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'true'),
																	$elm$html$Html$Attributes$class('btn questions-title collapsed'),
																	A2($elm$html$Html$Attributes$attribute, 'data-target', '#questionone'),
																	A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'collapse'),
																	$elm$html$Html$Attributes$type_('button')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('What is the difference between HTML Restore and WordPress Restore?')
																]))
														])),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'headingone'),
															$elm$html$Html$Attributes$class('collapse questions-reponse'),
															A2($elm$html$Html$Attributes$attribute, 'data-parent', '#frequently-questions'),
															$elm$html$Html$Attributes$id('questionone')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('HTML Restore and WordPress Restore both recover websites from the Wayback Machine. The key difference is the format of the restored website. HTML Restore provides a website in HTML format, while WordPress Restore converts the website into a WordPress website, creating a WordPress theme for easy customization.')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('questions-box')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('headingtwo')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$attribute, 'aria-controls', 'questiontwo'),
																	A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'true'),
																	$elm$html$Html$Attributes$class('btn questions-title collapsed'),
																	A2($elm$html$Html$Attributes$attribute, 'data-target', '#questiontwo'),
																	A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'collapse'),
																	$elm$html$Html$Attributes$type_('button')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('What does \'ready-to-use solution\' mean?')
																]))
														])),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'headingtwo'),
															$elm$html$Html$Attributes$class('collapse questions-reponse'),
															A2($elm$html$Html$Attributes$attribute, 'data-parent', '#frequently-questions'),
															$elm$html$Html$Attributes$id('questiontwo')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('A \'ready-to-use solution\' means that the website we provide is fully functional and ready to be uploaded to your server. You don\'t need to do any additional coding or setup. Simply upload the files to your server, and your website will work as it did before.')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('questions-box')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('headingthree')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$attribute, 'aria-controls', 'questionthree'),
																	A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'true'),
																	$elm$html$Html$Attributes$class('btn questions-title collapsed'),
																	A2($elm$html$Html$Attributes$attribute, 'data-target', '#questionthree'),
																	A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'collapse'),
																	$elm$html$Html$Attributes$type_('button')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('How does the SEO optimization feature work?')
																]))
														])),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'headingthree'),
															$elm$html$Html$Attributes$class('collapse questions-reponse'),
															A2($elm$html$Html$Attributes$attribute, 'data-parent', '#frequently-questions'),
															$elm$html$Html$Attributes$id('questionthree')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Our SEO optimization feature ensures that your restored website is SEO-friendly. We follow best practices for website structure, meta tags, and other key SEO factors. This helps your website rank better in search engine results, increasing its visibility and traffic.')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('questions-box')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('headingfour')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$attribute, 'aria-controls', 'questionfour'),
																	A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'true'),
																	$elm$html$Html$Attributes$class('btn questions-title collapsed'),
																	A2($elm$html$Html$Attributes$attribute, 'data-target', '#questionfour'),
																	A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'collapse'),
																	$elm$html$Html$Attributes$type_('button')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('How does the URL rewrite feature work?')
																]))
														])),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'headingfour'),
															$elm$html$Html$Attributes$class('collapse questions-reponse'),
															A2($elm$html$Html$Attributes$attribute, 'data-parent', '#frequently-questions'),
															$elm$html$Html$Attributes$id('questionfour')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('The URL rewrite feature automatically corrects all URLs in the restored website, including those for CSS, JS, Images, and Fonts. This ensures that they point to your local files instead of the original online sources. This feature is crucial for the website to function correctly after restoration.')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('questions-box')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('headingfive')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$attribute, 'aria-controls', 'questionfive'),
																	A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'true'),
																	$elm$html$Html$Attributes$class('btn questions-title collapsed'),
																	A2($elm$html$Html$Attributes$attribute, 'data-target', '#questionfive'),
																	A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'collapse'),
																	$elm$html$Html$Attributes$type_('button')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('What hosting platforms does this service work with?')
																]))
														])),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'headingfive'),
															$elm$html$Html$Attributes$class('collapse questions-reponse'),
															A2($elm$html$Html$Attributes$attribute, 'data-parent', '#frequently-questions'),
															$elm$html$Html$Attributes$id('questionfive')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Our service is compatible with a wide range of hosting platforms. As long as the platform supports HTML or WordPress (for WordPress Restores), you should be able to use our service without any issues. This includes popular hosting platforms like cPanel, Bluehost, GoDaddy, SiteGround, and many others. If you have specific questions about compatibility with a certain hosting platform, please feel free to contact us.')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('questions-box')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('headingsix')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$attribute, 'aria-controls', 'questionsix'),
																	A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'true'),
																	$elm$html$Html$Attributes$class('btn questions-title collapsed'),
																	A2($elm$html$Html$Attributes$attribute, 'data-target', '#questionsix'),
																	A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'collapse'),
																	$elm$html$Html$Attributes$type_('button')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('How long does the restore process take?')
																]))
														])),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'headingsix'),
															$elm$html$Html$Attributes$class('collapse questions-reponse'),
															A2($elm$html$Html$Attributes$attribute, 'data-parent', '#frequently-questions'),
															$elm$html$Html$Attributes$id('questionsix')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Your order is queued up immediately after submitting it. The orders are then processed in the order that they are received! Many factors will impact the restore process time (like the number of pages being restored), but in general, you should receive your files within the day.')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('questions-box')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('headingseven')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$attribute, 'aria-controls', 'questionseven'),
																	A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'true'),
																	$elm$html$Html$Attributes$class('btn questions-title collapsed'),
																	A2($elm$html$Html$Attributes$attribute, 'data-target', '#questionseven'),
																	A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'collapse'),
																	$elm$html$Html$Attributes$type_('button')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Does this work with Wordpress websites?')
																]))
														])),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'headingseven'),
															$elm$html$Html$Attributes$class('collapse questions-reponse'),
															A2($elm$html$Html$Attributes$attribute, 'data-parent', '#frequently-questions'),
															$elm$html$Html$Attributes$id('questionseven')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Yes, it does! We offer two restoration plans: HTML Restore and WordPress Restore. Both plans can restore any website, including WordPress websites, from the Wayback Machine. The HTML Restore plan will provide you with an HTML version of the website, which will work perfectly fine even if the original was a WordPress site. The WordPress Restore plan, on the other hand, will convert the website into a WordPress format, creating a WordPress theme for easy customization. So, regardless of the original website\'s platform, our service can effectively restore it in the format you prefer.')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('questions-box')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('headingeight')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$attribute, 'aria-controls', 'questioneight'),
																	A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'true'),
																	$elm$html$Html$Attributes$class('btn questions-title collapsed'),
																	A2($elm$html$Html$Attributes$attribute, 'data-target', '#questioneight'),
																	A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'collapse'),
																	$elm$html$Html$Attributes$type_('button')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Can I really recover deleted websites?')
																]))
														])),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'headingeight'),
															$elm$html$Html$Attributes$class('collapse questions-reponse'),
															A2($elm$html$Html$Attributes$attribute, 'data-parent', '#frequently-questions'),
															$elm$html$Html$Attributes$id('questioneight')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Absolutely! The Internet Archive\'s Wayback Machine continuously captures snapshots of websites across the web. If a snapshot of your deleted website exists, we can transform that web archive into a fully functional HTML website, complete with all supporting files. So, in most cases, you can indeed recover deleted websites!')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('questions-box')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('headingnine')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$attribute, 'aria-controls', 'questionine'),
																	A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'true'),
																	$elm$html$Html$Attributes$class('btn questions-title collapsed'),
																	A2($elm$html$Html$Attributes$attribute, 'data-target', '#questionine'),
																	A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'collapse'),
																	$elm$html$Html$Attributes$type_('button')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('How does Wayback Download retrieve data from archive.org (Internet Archive)?')
																]))
														])),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'headingnine'),
															$elm$html$Html$Attributes$class('collapse questions-reponse'),
															A2($elm$html$Html$Attributes$attribute, 'data-parent', '#frequently-questions'),
															$elm$html$Html$Attributes$id('questionine')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Wayback Download uses advanced cloud technology to access the Internet Archive\'s Wayback Machine. We input the URL of the website you want to restore, and our system retrieves the most recent snapshot available from the Wayback Machine. This includes all the HTML, CSS, JS, images, and fonts associated with the website. Our service then processes this data, rewrites the URLs, and packages it into a ready-to-use format that you can easily upload to your server.')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('questions-box')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('headingten')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$attribute, 'aria-controls', 'questionten'),
																	A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'true'),
																	$elm$html$Html$Attributes$class('btn questions-title collapsed'),
																	A2($elm$html$Html$Attributes$attribute, 'data-target', '#questionten'),
																	A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'collapse'),
																	$elm$html$Html$Attributes$type_('button')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Can this be used as a normal website downloader?')
																]))
														])),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'headingten'),
															$elm$html$Html$Attributes$class('collapse questions-reponse'),
															A2($elm$html$Html$Attributes$attribute, 'data-parent', '#frequently-questions'),
															$elm$html$Html$Attributes$id('questionten')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Yes! Since virtually every website is being archived from the Internet Archive\'s Wayback Machine, you can download practically any website. If a snapshot does not exist, you can request one '),
															A2(
															$elm$html$Html$a,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$href('https://web.archive.org/'),
																	$elm$html$Html$Attributes$target('_blank')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('here')
																])),
															$elm$html$Html$text(', and then you\'ll be able to download it with us!')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('questions-box')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('headingeleven')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$attribute, 'aria-controls', 'questioneleven'),
																	A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'true'),
																	$elm$html$Html$Attributes$class('btn questions-title collapsed'),
																	A2($elm$html$Html$Attributes$attribute, 'data-target', '#questioneleven'),
																	A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'collapse'),
																	$elm$html$Html$Attributes$type_('button')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('How can I support the Internet Archive\'s Wayback Machine?')
																]))
														])),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'headingeleven'),
															$elm$html$Html$Attributes$class('collapse questions-reponse'),
															A2($elm$html$Html$Attributes$attribute, 'data-parent', '#frequently-questions'),
															$elm$html$Html$Attributes$id('questioneleven')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Donating is simple, simply head over to the '),
															A2(
															$elm$html$Html$a,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$href('https://archive.org/donate?origin=wbwww-TopNavDonateButton'),
																	$elm$html$Html$Attributes$target('_blank')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Internet Archive')
																])),
															$elm$html$Html$text(' and select an amount you would like to donate. We rely on the Internet Archive\'s data to provide this service, so we encourage everyone using our service to support them!')
														]))
												]))
										]))
								]))
						]))
				]))
		]));
var $author$project$Pages$Home_$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'main',
					model.domain,
					$author$project$Pages$Home_$viewMain(model),
					$author$project$Pages$Home_$viewModal(model),
					$author$project$Pages$Home_$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$Home_$viewSection1,
					$author$project$Pages$Home_$viewSection2(shared.env),
					$author$project$Pages$Home_$viewSection3,
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Recover Any Website from archive.org — Starting at $19 | Wayback Download'
		};
	});
var $author$project$Pages$Home_$page = F2(
	function (shared, _v0) {
		return $author$project$Page$element(
			{
				init: $author$project$Pages$Home_$init,
				subscriptions: function (_v1) {
					return $elm$core$Platform$Sub$none;
				},
				update: $author$project$Pages$Home_$update(shared),
				view: $author$project$Pages$Home_$view(shared)
			});
	});
var $author$project$Pages$Knowledgebase$Model = function (showMenu) {
	return {showMenu: showMenu};
};
var $author$project$Pages$Knowledgebase$init = _Utils_Tuple2(
	$author$project$Pages$Knowledgebase$Model(false),
	$elm$core$Platform$Cmd$none);
var $author$project$Pages$Knowledgebase$update = F2(
	function (msg, model) {
		return model.showMenu ? _Utils_Tuple2(
			_Utils_update(
				model,
				{showMenu: false}),
			$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
			_Utils_update(
				model,
				{showMenu: true}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Knowledgebase$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$Knowledgebase$viewSection1 = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('padding-100-0 position-relative')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('body_overlay_ono')
				]),
			_List_Nil),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('col-md-12 help-center-header text-center')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h1,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('help-center-title')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Help Center')
										])),
									$elm$html$Html$text('We may have already answered your questions.')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row question-area-page justify-content-left mr-tp-120')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-md-4 no-phone-display')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('question-area-answer-navs')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('nuhost-filter-container')
												]),
											_List_Nil),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('nuhost-filter-list-container min-height-auto')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$ul,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('nuhost-filter-list')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$li,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$a,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$href('#restore-cpanel')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('How do I upload the restored files to cPanel?'),
																			A2(
																			$elm$html$Html$i,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('fas fa-angle-right')
																				]),
																			_List_Nil)
																		]))
																])),
															A2(
															$elm$html$Html$li,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$a,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$href('#restore-ftp')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('How do I upload the restored files to an FTP/SFTP server?'),
																			A2(
																			$elm$html$Html$i,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('fas fa-angle-right')
																				]),
																			_List_Nil)
																		]))
																])),
															A2(
															$elm$html$Html$li,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$a,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$href('#only-readme')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Why is there only a README file in the zip?'),
																			A2(
																			$elm$html$Html$i,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('fas fa-angle-right')
																				]),
																			_List_Nil)
																		]))
																])),
															A2(
															$elm$html$Html$li,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$a,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$href('#files-missing')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Why are some files missing?'),
																			A2(
																			$elm$html$Html$i,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('fas fa-angle-right')
																				]),
																			_List_Nil)
																		]))
																])),
															A2(
															$elm$html$Html$li,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$a,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$href('#too-long')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Why is the restore process taking so long?'),
																			A2(
																			$elm$html$Html$i,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('fas fa-angle-right')
																				]),
																			_List_Nil)
																		]))
																]))
														]))
												]))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-md-8')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('question-area-answer-body')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$ul,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$li,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('restore-cpanel')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('How do I upload the restored website files to cPanel?')
																])),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('1. Login to your cPanel account')
																])),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('2. Under the \"Files\" tab, click on \"File Manager\"')
																])),
															A2(
															$elm$html$Html$img,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$alt('cpanel_1'),
																	$elm$html$Html$Attributes$class('knowledgebase-image'),
																	$elm$html$Html$Attributes$src('img/knowledgebase/cpanel_1.png')
																]),
															_List_Nil),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('3. Find the \"public_html\" folder and click on it')
																])),
															A2(
															$elm$html$Html$img,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$alt('cpanel_2'),
																	$elm$html$Html$Attributes$class('knowledgebase-image'),
																	$elm$html$Html$Attributes$src('img/knowledgebase/cpanel_2.png')
																]),
															_List_Nil),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('4. Click the \"Upload\" button, and select the Zip file you downloaded from our dashboard')
																])),
															A2(
															$elm$html$Html$img,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$alt('cpanel_3'),
																	$elm$html$Html$Attributes$class('knowledgebase-image'),
																	$elm$html$Html$Attributes$src('img/knowledgebase/cpanel_3.png')
																]),
															_List_Nil),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('5. Right click on the Zip file, and click \"Extract\"')
																])),
															A2(
															$elm$html$Html$img,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$alt('cpanel_4'),
																	$elm$html$Html$Attributes$class('knowledgebase-image'),
																	$elm$html$Html$Attributes$src('img/knowledgebase/cpanel_4.png')
																]),
															_List_Nil)
														])),
													A2(
													$elm$html$Html$li,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('restore-ftp')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('How do I upload the restored website files to an FTP/SFTP server?')
																])),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('1. Download the'),
																	A2(
																	$elm$html$Html$a,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$href('https://filezilla-project.org/'),
																			$elm$html$Html$Attributes$target('_blank')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Filezilla Client')
																		])),
																	$elm$html$Html$text('if you do not already have it installed')
																])),
															A2(
															$elm$html$Html$img,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$alt('filezilla_1'),
																	$elm$html$Html$Attributes$class('knowledgebase-image'),
																	$elm$html$Html$Attributes$src('img/knowledgebase/filezilla_1.png')
																]),
															_List_Nil),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('2. Connect to your FTP server by entering the host, username, password and port (21 for FTP or 22 for SFTP), and click on \"Quickconnect\"')
																])),
															A2(
															$elm$html$Html$img,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$alt('filezilla_2'),
																	$elm$html$Html$Attributes$class('knowledgebase-image'),
																	$elm$html$Html$Attributes$src('img/knowledgebase/filezilla_2.png')
																]),
															_List_Nil),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('3. Locate your restored website files in the left rectangle')
																])),
															A2(
															$elm$html$Html$img,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$alt('filezilla_3'),
																	$elm$html$Html$Attributes$class('knowledgebase-image'),
																	$elm$html$Html$Attributes$src('img/knowledgebase/filezilla_3.png')
																]),
															_List_Nil),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('4. Drag and drop them in the right rectangle in the desired folder')
																]))
														])),
													A2(
													$elm$html$Html$li,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('only-readme')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('Why is there only a README file in the zip file?')
																])),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('This usually happens when the selected timestamp leads to a bad snapshot on the Internet Archive\'s Wayback Machine (the timestamp exist, but nothing was saved). If this happens, please make sure that the corresponding snapshot on the'),
																	A2(
																	$elm$html$Html$a,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$href('https://web.archive.org/'),
																			$elm$html$Html$Attributes$target('_blank')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Wayback Machine')
																		])),
																	$elm$html$Html$text('is correct.')
																])),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('You can also'),
																	A2(
																	$elm$html$Html$a,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$href('/contact'),
																			$elm$html$Html$Attributes$target('_blank')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('contact us')
																		])),
																	$elm$html$Html$text('for help regarding this issue.')
																]))
														])),
													A2(
													$elm$html$Html$li,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('files-missing')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('Why are some files missing?')
																])),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('This is usually due to a bad snapshot on Internet Archive\'s Wayback Machine\'s part. You can validate this yourself by heading to the'),
																	A2(
																	$elm$html$Html$a,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$href('https://web.archive.org/')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Wayback Machine')
																		])),
																	$elm$html$Html$text(', and trying to load the missing resource. In these cases, our system tries to grab the resource but gets an HTTP 404 error.')
																])),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('It can also happen that our queries to the Internet Archives\' Wayback Machine timeout due to an increased serverload on their part. In these cases, simply'),
																	A2(
																	$elm$html$Html$a,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$href('/contact'),
																			$elm$html$Html$Attributes$target('_blank')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('contact us')
																		])),
																	$elm$html$Html$text(', and we will gladly re-run the restore process.')
																]))
														])),
													A2(
													$elm$html$Html$li,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('too-long')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('Why is the restore process taking so long to complete?')
																])),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('When you submit an order, the restore job is instantly placed in a queue. While we do our best to process orders as quickly as possible, many factors may slow down the restore process (like the size of the restore, or the number of items already in the queue).')
																])),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('With that said, if your order still hasn\'t been processed after 24 hours, please'),
																	A2(
																	$elm$html$Html$a,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$href('/contact'),
																			$elm$html$Html$Attributes$target('_blank')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('contact us')
																		])),
																	$elm$html$Html$text(', and we will investigate issue.')
																]))
														]))
												]))
										]))
								]))
						]))
				]))
		]));
var $author$project$Pages$Knowledgebase$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'other',
					'',
					$elm$html$Html$text(''),
					$elm$html$Html$text(''),
					$author$project$Pages$Knowledgebase$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$Knowledgebase$viewSection1,
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Knowledge Base | Wayback Download'
		};
	});
var $author$project$Pages$Knowledgebase$page = F2(
	function (shared, _v0) {
		return $author$project$Page$element(
			{
				init: $author$project$Pages$Knowledgebase$init,
				subscriptions: function (_v1) {
					return $elm$core$Platform$Sub$none;
				},
				update: $author$project$Pages$Knowledgebase$update,
				view: $author$project$Pages$Knowledgebase$view(shared)
			});
	});
var $author$project$Proto$Response$LoginForm = F3(
	function (username, password, recaptcha) {
		return {password: password, recaptcha: recaptcha, username: username};
	});
var $author$project$Pages$Login$Model = F3(
	function (form, status, showMenu) {
		return {form: form, showMenu: showMenu, status: status};
	});
var $author$project$Pages$Login$None = {$: 'None'};
var $author$project$Pages$Login$init = F2(
	function (req, storage) {
		var model = A3(
			$author$project$Pages$Login$Model,
			A3($author$project$Proto$Response$LoginForm, '', '', ''),
			$author$project$Pages$Login$None,
			false);
		return _Utils_Tuple2(
			model,
			((!_Utils_eq(storage.user, $elm$core$Maybe$Nothing)) && _Utils_eq(req.route, $author$project$Gen$Route$Login)) ? A2($author$project$Request$replaceRoute, $author$project$Gen$Route$Dashboard, req) : $author$project$Shared$loadhCaptcha);
	});
var $author$project$Pages$Login$ReceivedCaptcha = function (a) {
	return {$: 'ReceivedCaptcha', a: a};
};
var $author$project$Pages$Login$subscriptions = function (_v0) {
	return $author$project$Shared$messageReceiver($author$project$Pages$Login$ReceivedCaptcha);
};
var $author$project$Pages$Login$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $author$project$Pages$Login$Loading = {$: 'Loading'};
var $author$project$Domain$User$User = F3(
	function (token, subscribed, admin) {
		return {admin: admin, subscribed: subscribed, token: token};
	});
var $author$project$Pages$Login$FormSentResp = function (a) {
	return {$: 'FormSentResp', a: a};
};
var $author$project$Proto$Response$encodeLoginForm = function (value) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(
		_List_fromArray(
			[
				_Utils_Tuple2(
				1,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.username)),
				_Utils_Tuple2(
				2,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.password)),
				_Utils_Tuple2(
				3,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.recaptcha))
			]));
};
var $author$project$Pages$Login$login = F2(
	function (env, model) {
		return _Utils_Tuple2(
			model,
			$elm$http$Http$post(
				{
					body: A2(
						$elm$http$Http$bytesBody,
						'application/protobuf',
						$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
							$author$project$Proto$Response$encodeLoginForm(model.form))),
					expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Login$FormSentResp, $author$project$Proto$Response$decodeResponse),
					url: env.serverUrl + '/login'
				}));
	});
var $author$project$Storage$signIn = F2(
	function (user, storage) {
		return $author$project$Storage$save(
			$author$project$Storage$storageToJson(
				_Utils_update(
					storage,
					{
						user: $elm$core$Maybe$Just(user)
					})));
	});
var $author$project$Pages$Login$update = F3(
	function (shared, msg, model) {
		switch (msg.$) {
			case 'ClickedLogin':
				return (model.form.username === '') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$Login$Failure('Username cannot be empty')
						}),
					$elm$core$Platform$Cmd$none) : ((model.form.password === '') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$Login$Failure('Password cannot be empty')
						}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{status: $author$project$Pages$Login$Loading}),
					$author$project$Shared$getCaptchaResponse));
			case 'ReceivedCaptcha':
				var captcha = msg.a;
				if (captcha === '') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Pages$Login$Failure('Must fill out captcha')
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var oldForm = model.form;
					var newForm = _Utils_update(
						oldForm,
						{recaptcha: captcha});
					return A2(
						$author$project$Pages$Login$login,
						shared.env,
						_Utils_update(
							model,
							{form: newForm}));
				}
			case 'ChangeUsername':
				var username = msg.a;
				var oldForm = model.form;
				var newForm = _Utils_update(
					oldForm,
					{username: username});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{form: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ChangePassword':
				var password = msg.a;
				var oldForm = model.form;
				var newForm = _Utils_update(
					oldForm,
					{password: password});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{form: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'FormSentResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v2 = resp.status;
					if (_v2.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Login$Failure(resp.error)
								}),
							$author$project$Shared$resetCaptcha(_Utils_Tuple0));
					} else {
						var _v3 = resp.data;
						if (_v3.$ === 'Just') {
							var data = _v3.a;
							var _v4 = data.user;
							if (_v4.$ === 'Just') {
								var user = _v4.a;
								return _Utils_Tuple2(
									model,
									A2(
										$author$project$Storage$signIn,
										A3($author$project$Domain$User$User, user.token, user.subscribed, user.admin),
										shared.storage));
							} else {
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											status: $author$project$Pages$Login$Failure('Unable to process request (3), please try again later')
										}),
									$author$project$Shared$resetCaptcha(_Utils_Tuple0));
							}
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										status: $author$project$Pages$Login$Failure('Unable to process request (2), please try again later')
									}),
								$author$project$Shared$resetCaptcha(_Utils_Tuple0));
						}
					}
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Pages$Login$Failure('Unable to process request, please try again later')
							}),
						$author$project$Shared$resetCaptcha(_Utils_Tuple0));
				}
			default:
				return model.showMenu ? _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: false}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: true}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Login$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$Login$ChangePassword = function (a) {
	return {$: 'ChangePassword', a: a};
};
var $author$project$Pages$Login$ChangeUsername = function (a) {
	return {$: 'ChangeUsername', a: a};
};
var $author$project$Pages$Login$ClickedLogin = {$: 'ClickedLogin'};
var $author$project$Pages$Login$viewMain = function (model) {
	return A2(
		$elm$html$Html$main_,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('col-sm')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row form-contain-home contact-page-form-send'),
										$elm$html$Html$Attributes$id('ajax-contact')
									]),
								_List_fromArray(
									[
										function () {
										var _v0 = model.status;
										if (_v0.$ === 'Failure') {
											var err = _v0.a;
											return $author$project$Common$Alert$viewAlertError(err);
										} else {
											return A2($elm$html$Html$div, _List_Nil, _List_Nil);
										}
									}(),
										A2(
										$elm$html$Html$h5,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Login')
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('form-messages')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field input-field')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$input,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-contain-home-input'),
																$elm$html$Html$Attributes$id('username'),
																$elm$html$Html$Attributes$name('username'),
																$elm$html$Html$Attributes$placeholder('Username'),
																$elm$html$Html$Attributes$required(true),
																$elm$html$Html$Attributes$type_('text'),
																$elm$html$Html$Attributes$value(model.form.username),
																$elm$html$Html$Events$onInput($author$project$Pages$Login$ChangeUsername)
															]),
														_List_Nil),
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('fas fa-address-card')
															]),
														_List_Nil)
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field input-field')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$input,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-contain-home-input'),
																$elm$html$Html$Attributes$id('password'),
																$elm$html$Html$Attributes$name('password'),
																$elm$html$Html$Attributes$placeholder('Password'),
																$elm$html$Html$Attributes$required(true),
																$elm$html$Html$Attributes$type_('password'),
																$elm$html$Html$Attributes$value(model.form.password),
																$elm$html$Html$Events$onInput($author$project$Pages$Login$ChangePassword)
															]),
														_List_Nil),
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('fas fa-key')
															]),
														_List_Nil),
														A2(
														$elm$html$Html$a,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$href('/forgot-password'),
																A2($elm$html$Html$Attributes$style, 'float', 'right')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('Forgot Password')
															]))
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('h-captcha'),
												$elm$html$Html$Attributes$class('h-captcha col-md-12')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn-holder-contact')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$id('login'),
														$elm$html$Html$Attributes$type_('submit'),
														$elm$html$Html$Events$onClick($author$project$Pages$Login$ClickedLogin)
													]),
												function () {
													var _v1 = model.status;
													if (_v1.$ === 'Loading') {
														return $author$project$Common$Spinner$viewSpinnerText;
													} else {
														return _List_fromArray(
															[
																$elm$html$Html$text('Login')
															]);
													}
												}())
											])),
										A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin-top', '0.5rem')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Don\'t have an account?'),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href('/signup')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(' Register')
													]))
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Login$viewSection1 = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('padding-100-0')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_Nil)
		]));
var $author$project$Pages$Login$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'main',
					'',
					$author$project$Pages$Login$viewMain(model),
					$elm$html$Html$text(''),
					$author$project$Pages$Login$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$Login$viewSection1,
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Login | Wayback Download'
		};
	});
var $author$project$Pages$Login$page = F2(
	function (shared, req) {
		return $author$project$Page$element(
			{
				init: A2($author$project$Pages$Login$init, req, shared.storage),
				subscriptions: $author$project$Pages$Login$subscriptions,
				update: $author$project$Pages$Login$update(shared),
				view: $author$project$Pages$Login$view(shared)
			});
	});
var $author$project$Pages$Logout$Model = {};
var $author$project$Pages$Logout$init = F2(
	function (req, storage) {
		return _Utils_Tuple2(
			$author$project$Pages$Logout$Model,
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$Storage$signOut(storage),
						A2($author$project$Request$replaceRoute, $author$project$Gen$Route$Login, req)
					])));
	});
var $author$project$Pages$Logout$page = F2(
	function (shared, req) {
		return $author$project$Page$element(
			{
				init: A2($author$project$Pages$Logout$init, req, shared.storage),
				subscriptions: function (_v0) {
					return $elm$core$Platform$Sub$none;
				},
				update: F2(
					function (_v1, model) {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}),
				view: function (_v2) {
					return $author$project$View$none;
				}
			});
	});
var $author$project$Pages$NotFound$Model = function (showMenu) {
	return {showMenu: showMenu};
};
var $author$project$Pages$NotFound$init = _Utils_Tuple2(
	$author$project$Pages$NotFound$Model(false),
	$elm$core$Platform$Cmd$none);
var $author$project$Pages$NotFound$update = F2(
	function (msg, model) {
		return model.showMenu ? _Utils_Tuple2(
			_Utils_update(
				model,
				{showMenu: false}),
			$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
			_Utils_update(
				model,
				{showMenu: true}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$NotFound$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$NotFound$viewSection1 = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('padding-100-0 position-relative')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('page-404-styles text-center')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$alt('404'),
									$elm$html$Html$Attributes$src('/img/header/404.png')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$h1,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('message-error')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Ooops! Sorry this page does not exist!')
								]))
						]))
				]))
		]));
var $author$project$Pages$NotFound$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'other',
					'',
					$elm$html$Html$text(''),
					$elm$html$Html$text(''),
					$author$project$Pages$NotFound$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$NotFound$viewSection1,
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Not Found | Wayback Download'
		};
	});
var $author$project$Pages$NotFound$page = F2(
	function (shared, _v0) {
		return $author$project$Page$element(
			{
				init: $author$project$Pages$NotFound$init,
				subscriptions: function (_v1) {
					return $elm$core$Platform$Sub$none;
				},
				update: $author$project$Pages$NotFound$update,
				view: $author$project$Pages$NotFound$view(shared)
			});
	});
var $author$project$Pages$Order$Model = F3(
	function (url, status, showMenu) {
		return {showMenu: showMenu, status: status, url: url};
	});
var $author$project$Pages$Order$None = {$: 'None'};
var $author$project$Pages$Order$UserResp = function (a) {
	return {$: 'UserResp', a: a};
};
var $author$project$Pages$Order$getUser = F2(
	function (user, env) {
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$emptyBody,
				expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Order$UserResp, $author$project$Proto$Response$decodeResponse),
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'Bearer ' + user.token)
					]),
				method: 'GET',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: env.serverUrl + '/user'
			});
	});
var $author$project$Pages$Order$init = F2(
	function (user, env) {
		return _Utils_Tuple2(
			A3($author$project$Pages$Order$Model, '', $author$project$Pages$Order$None, false),
			A2($author$project$Pages$Order$getUser, user, env));
	});
var $author$project$Pages$Order$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $author$project$Pages$Order$Loading = {$: 'Loading'};
var $author$project$Pages$Order$Success = function (a) {
	return {$: 'Success', a: a};
};
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Storage$checkItemExistInCart = F2(
	function (item, storage) {
		return A2($elm$core$List$member, item, storage.cart.items);
	});
var $author$project$Storage$addItemToCart = F2(
	function (item, storage) {
		if (!A2($author$project$Storage$checkItemExistInCart, item, storage)) {
			var cart = $author$project$Proto$Response$Cart(
				A2($elm$core$List$cons, item, storage.cart.items));
			return $author$project$Storage$save(
				$author$project$Storage$storageToJson(
					_Utils_update(
						storage,
						{cart: cart})));
		} else {
			return $elm$core$Platform$Cmd$none;
		}
	});
var $author$project$Storage$changeSubscriptionStatus = F2(
	function (storage, status) {
		var _v0 = storage.user;
		if (_v0.$ === 'Just') {
			var user = _v0.a;
			var oldUser = user;
			var newUser = _Utils_update(
				oldUser,
				{subscribed: status});
			return $author$project$Storage$save(
				$author$project$Storage$storageToJson(
					_Utils_update(
						storage,
						{
							user: $elm$core$Maybe$Just(newUser)
						})));
		} else {
			return $elm$core$Platform$Cmd$none;
		}
	});
var $author$project$Pages$Order$errorHandler = F3(
	function (err, model, shared) {
		if (err.$ === 'BadStatus') {
			var code = err.a;
			return (code === 401) ? _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Order$Failure('Login session expired')
					}),
				$author$project$Storage$signOut(shared.storage)) : _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Order$Failure('Unable to process request, please try again later')
					}),
				$elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Order$Failure('Unable to process request, please try again later')
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Order$CheckoutResp = function (a) {
	return {$: 'CheckoutResp', a: a};
};
var $author$project$Storage$clearCart = function (storage) {
	return $author$project$Storage$save(
		$author$project$Storage$storageToJson(
			_Utils_update(
				storage,
				{
					cart: $author$project$Proto$Response$Cart(_List_Nil)
				})));
};
var $author$project$Pages$Order$getCheckoutUrl = F4(
	function (env, storage, user, model) {
		return _Utils_Tuple2(
			model,
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$elm$http$Http$request(
						{
							body: A2(
								$elm$http$Http$bytesBody,
								'application/protobuf',
								$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
									$author$project$Proto$Response$encodeCart(storage.cart))),
							expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Order$CheckoutResp, $author$project$Proto$Response$decodeResponse),
							headers: _List_fromArray(
								[
									A2($elm$http$Http$header, 'Authorization', 'Bearer ' + user.token)
								]),
							method: 'POST',
							timeout: $elm$core$Maybe$Nothing,
							tracker: $elm$core$Maybe$Nothing,
							url: env.serverUrl + '/checkout'
						}),
						$author$project$Storage$clearCart(storage)
					])));
	});
var $author$project$Pages$Order$ProcessResp = function (a) {
	return {$: 'ProcessResp', a: a};
};
var $author$project$Pages$Order$processRestore = F3(
	function (env, user, model) {
		var _v0 = A2($elm$parser$Parser$run, $author$project$Common$Parsing$cartParser, model.url);
		if (_v0.$ === 'Ok') {
			var cartItem = _v0.a;
			return _Utils_Tuple2(
				model,
				$elm$http$Http$request(
					{
						body: A2(
							$elm$http$Http$bytesBody,
							'application/protobuf',
							$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
								$author$project$Proto$Response$encodeCartItem(cartItem))),
						expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Order$ProcessResp, $author$project$Proto$Response$decodeResponse),
						headers: _List_fromArray(
							[
								A2($elm$http$Http$header, 'Authorization', 'Bearer ' + user.token)
							]),
						method: 'POST',
						timeout: $elm$core$Maybe$Nothing,
						tracker: $elm$core$Maybe$Nothing,
						url: env.serverUrl + '/process'
					}));
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						status: $author$project$Pages$Order$Failure('Invalid URL provided')
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Storage$removeItemFromCart = F2(
	function (item, storage) {
		if (A2($author$project$Storage$checkItemExistInCart, item, storage)) {
			var cart = $author$project$Proto$Response$Cart(
				A2(
					$elm$core$List$filter,
					function (x) {
						return !_Utils_eq(x, item);
					},
					storage.cart.items));
			return $author$project$Storage$save(
				$author$project$Storage$storageToJson(
					_Utils_update(
						storage,
						{cart: cart})));
		} else {
			return $elm$core$Platform$Cmd$none;
		}
	});
var $author$project$Pages$Order$update = F4(
	function (shared, user, msg, model) {
		switch (msg.$) {
			case 'ChangeUrl':
				var url = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{url: url}),
					$elm$core$Platform$Cmd$none);
			case 'ClickedAddToCart':
				if (model.url === '') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Pages$Order$Failure('URl cannot be empty')
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var _v1 = A2($elm$parser$Parser$run, $author$project$Common$Parsing$cartParser, model.url);
					if (_v1.$ === 'Ok') {
						var cart = _v1.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{url: ''}),
							A2($author$project$Storage$addItemToCart, cart, shared.storage));
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Order$Failure('Invalid URL provided')
								}),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 'ClickedRemoveFromCart':
				var item = msg.a;
				return _Utils_Tuple2(
					model,
					A2($author$project$Storage$removeItemFromCart, item, shared.storage));
			case 'ClickedCheckout':
				return ($elm$core$List$length(shared.storage.cart.items) < 1) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$Order$Failure('Cart must contain at least one item')
						}),
					$elm$core$Platform$Cmd$none) : A4(
					$author$project$Pages$Order$getCheckoutUrl,
					shared.env,
					shared.storage,
					user,
					_Utils_update(
						model,
						{status: $author$project$Pages$Order$Loading}));
			case 'CheckoutResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v3 = resp.status;
					if (_v3.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Order$Failure(resp.error)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v4 = resp.data;
						if (_v4.$ === 'Just') {
							var data = _v4.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{status: $author$project$Pages$Order$Loading}),
								$elm$browser$Browser$Navigation$load(data.url));
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										status: $author$project$Pages$Order$Failure('Unable to process request, please try again later')
									}),
								$elm$core$Platform$Cmd$none);
						}
					}
				} else {
					var err = result.a;
					return A3($author$project$Pages$Order$errorHandler, err, model, shared);
				}
			case 'ClickedRestore':
				return A3(
					$author$project$Pages$Order$processRestore,
					shared.env,
					user,
					_Utils_update(
						model,
						{status: $author$project$Pages$Order$Loading}));
			case 'ProcessResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v6 = resp.status;
					if (_v6.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Order$Failure(resp.error)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v7 = resp.data;
						if (_v7.$ === 'Just') {
							var data = _v7.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										status: $author$project$Pages$Order$Success(data.info),
										url: ''
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										status: $author$project$Pages$Order$Failure('Unable to process request, please try again later')
									}),
								$elm$core$Platform$Cmd$none);
						}
					}
				} else {
					var err = result.a;
					return A3($author$project$Pages$Order$errorHandler, err, model, shared);
				}
			case 'UserResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v9 = resp.status;
					if (_v9.$ === 'Status_FAILED') {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var _v10 = resp.data;
						if (_v10.$ === 'Just') {
							var data = _v10.a;
							var _v11 = data.user;
							if (_v11.$ === 'Just') {
								var user_ = _v11.a;
								return _Utils_Tuple2(
									model,
									A2($author$project$Storage$changeSubscriptionStatus, shared.storage, user_.subscribed));
							} else {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							}
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					}
				} else {
					var err = result.a;
					if (err.$ === 'BadStatus') {
						var code = err.a;
						return (code === 401) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Order$Failure('Login session expired')
								}),
							$author$project$Storage$signOut(shared.storage)) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				}
			default:
				return model.showMenu ? _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: false}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: true}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Order$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$Order$viewMain = A2(
	$elm$html$Html$main_,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('container mb-auto')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h3,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mt-3 main-header-text-title')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Place Your Order')
				]))
		]));
var $author$project$Pages$Order$ChangeUrl = function (a) {
	return {$: 'ChangeUrl', a: a};
};
var $author$project$Pages$Order$ClickedAddToCart = {$: 'ClickedAddToCart'};
var $author$project$Pages$Order$ClickedRestore = {$: 'ClickedRestore'};
var $author$project$Pages$Order$ClickedCheckout = {$: 'ClickedCheckout'};
var $elm$html$Html$hr = _VirtualDom_node('hr');
var $author$project$Pages$Order$ClickedRemoveFromCart = function (a) {
	return {$: 'ClickedRemoveFromCart', a: a};
};
var $author$project$Pages$Order$viewCartItem = F3(
	function (env, idx, cartItem) {
		var price = (!idx) ? env.itemCost : env.multiItemCost;
		return A2(
			$elm$html$Html$tr,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(cartItem.domain + (' (' + (cartItem.timestamp + ')')))
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(price) + '$')
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('plan-dedicated-order-button'),
									A2($elm$html$Html$Attributes$attribute, 'style', 'background: #ce634a; border:none'),
									$elm$html$Html$Events$onClick(
									$author$project$Pages$Order$ClickedRemoveFromCart(cartItem))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Remove')
								]))
						]))
				]));
	});
var $author$project$Pages$Order$viewOrderSummary = F3(
	function (env, storage, model) {
		var count = $elm$core$List$length(storage.cart.items);
		var total = (count <= 1) ? env.itemCost : (env.itemCost + ((count - 1) * env.multiItemCost));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('col-md')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('futures-version-3-box')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h4,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Order Summary')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('alertOrder'),
									A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
								]),
							_List_Nil),
							A2($elm$html$Html$br, _List_Nil, _List_Nil),
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('table table-dedicated-hosting-container'),
									$elm$html$Html$Attributes$id('order')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$tbody,
									_List_Nil,
									A2(
										$elm$core$List$indexedMap,
										$author$project$Pages$Order$viewCartItem(env),
										storage.cart.items))
								])),
							A2($elm$html$Html$hr, _List_Nil, _List_Nil),
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('table')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$tbody,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$td,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$b,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('Total:')
																]))
														])),
													A2(
													$elm$html$Html$td,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$id('totalOrder')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(
																	$elm$core$String$fromInt(total))
																])),
															$elm$html$Html$text('$')
														]))
												]))
										]))
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('plan-dedicated-order-button'),
									$elm$html$Html$Attributes$href('#'),
									$elm$html$Html$Attributes$id('checkout-button'),
									A2($elm$html$Html$Attributes$attribute, 'style', 'border: none'),
									$elm$html$Html$Events$onClick($author$project$Pages$Order$ClickedCheckout)
								]),
							function () {
								var _v0 = model.status;
								if (_v0.$ === 'Loading') {
									return $author$project$Common$Spinner$viewSpinnerText;
								} else {
									return _List_fromArray(
										[
											$elm$html$Html$text('Checkout')
										]);
								}
							}())
						]))
				]));
	});
var $author$project$Pages$Order$viewSection1 = F4(
	function (env, model, storage, user) {
		return A2(
			$elm$html$Html$section,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('container')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('row justify-content-start futures-version-2')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											user.subscribed ? $elm$html$Html$Attributes$class('col-md-8 mx-auto') : $elm$html$Html$Attributes$class('col-md')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('futures-version-3-box')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$h4,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Restore')
														])),
													A2($elm$html$Html$br, _List_Nil, _List_Nil),
													function () {
													var _v0 = model.status;
													switch (_v0.$) {
														case 'Failure':
															var err = _v0.a;
															return $author$project$Common$Alert$viewAlertError(err);
														case 'Success':
															var msg = _v0.a;
															return $author$project$Common$Alert$viewAlertSuccess(msg);
														default:
															return A2($elm$html$Html$div, _List_Nil, _List_Nil);
													}
												}(),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('container border')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$b,
																	_List_Nil,
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Step 1. ')
																		])),
																	$elm$html$Html$text('Navigate to the '),
																	A2(
																	$elm$html$Html$a,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$href('https://web.archive.org/'),
																			$elm$html$Html$Attributes$id('wayback_url'),
																			$elm$html$Html$Attributes$target('_blank')
																		]),
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Wayback Machine')
																		]))
																])),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$b,
																	_List_Nil,
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Step 2. ')
																		])),
																	$elm$html$Html$text('Enter the domain to restore in the provided box')
																])),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$b,
																	_List_Nil,
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Step 3. ')
																		])),
																	$elm$html$Html$text('Select a snapshot using the date selector')
																])),
															A2(
															$elm$html$Html$p,
															_List_Nil,
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$b,
																	_List_Nil,
																	_List_fromArray(
																		[
																			$elm$html$Html$text('Step 4. ')
																		])),
																	$elm$html$Html$text('Copy the URL in the bar below')
																]))
														])),
													A2($elm$html$Html$br, _List_Nil, _List_Nil),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$id('domain-search-header')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$i,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('fas fa-globe')
																]),
															_List_Nil),
															A2(
															$elm$html$Html$input,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$id('url'),
																	$elm$html$Html$Attributes$name('url'),
																	$elm$html$Html$Attributes$placeholder('https://web.archive.org/web/20210130001414/http://example.com/'),
																	$elm$html$Html$Attributes$type_('text'),
																	$elm$html$Html$Attributes$value(model.url),
																	$elm$html$Html$Events$onInput($author$project$Pages$Order$ChangeUrl)
																]),
															_List_Nil),
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('inline-button-domain-order')
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$button,
																	_List_fromArray(
																		[
																			A2($elm$html$Html$Attributes$attribute, 'data-original-title', 'restore'),
																			$elm$html$Html$Attributes$id('transfer-btn'),
																			$elm$html$Html$Attributes$name('restore'),
																			$elm$html$Html$Attributes$type_('button'),
																			$elm$html$Html$Attributes$value('Restore'),
																			user.subscribed ? $elm$html$Html$Events$onClick($author$project$Pages$Order$ClickedRestore) : $elm$html$Html$Events$onClick($author$project$Pages$Order$ClickedAddToCart)
																		]),
																	_List_fromArray(
																		[
																			function () {
																			if (user.subscribed) {
																				var _v1 = model.status;
																				if (_v1.$ === 'Loading') {
																					return $author$project$Common$Spinner$viewSpinnerSymbol;
																				} else {
																					return A2(
																						$elm$html$Html$i,
																						_List_fromArray(
																							[
																								$elm$html$Html$Attributes$class('fas fa-undo')
																							]),
																						_List_Nil);
																				}
																			} else {
																				return A2(
																					$elm$html$Html$i,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('fas fa-undo')
																						]),
																					_List_Nil);
																			}
																		}()
																		]))
																]))
														])),
													A2($elm$html$Html$br, _List_Nil, _List_Nil)
												]))
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									(!user.subscribed) ? A3($author$project$Pages$Order$viewOrderSummary, env, storage, model) : A2($elm$html$Html$div, _List_Nil, _List_Nil)
								]))
						]))
				]));
	});
var $author$project$Pages$Order$view = F3(
	function (shared, user, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'sub',
					'',
					$author$project$Pages$Order$viewMain,
					$elm$html$Html$text(''),
					$author$project$Pages$Order$ClickedToggleMenu,
					model.showMenu),
					A4($author$project$Pages$Order$viewSection1, shared.env, model, shared.storage, user),
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Place Your Order | Wayback Download'
		};
	});
var $author$project$Pages$Order$page = F2(
	function (shared, _v0) {
		return $author$project$Page$protected.element(
			function (user) {
				return {
					init: A2($author$project$Pages$Order$init, user, shared.env),
					subscriptions: function (_v1) {
						return $elm$core$Platform$Sub$none;
					},
					update: A2($author$project$Pages$Order$update, shared, user),
					view: A2($author$project$Pages$Order$view, shared, user)
				};
			});
	});
var $author$project$Pages$Privacy$Model = function (showMenu) {
	return {showMenu: showMenu};
};
var $author$project$Pages$Privacy$init = _Utils_Tuple2(
	$author$project$Pages$Privacy$Model(false),
	$elm$core$Platform$Cmd$none);
var $author$project$Pages$Privacy$update = F2(
	function (msg, model) {
		return model.showMenu ? _Utils_Tuple2(
			_Utils_update(
				model,
				{showMenu: false}),
			$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
			_Utils_update(
				model,
				{showMenu: true}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Privacy$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$Privacy$viewSection1 = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('padding-60-0-100 position-relative')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-md-12 help-center-header')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h1,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('help-center-title')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Last update: May 2021')
												])),
											$elm$html$Html$text('Privacy policy')
										])),
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('help-center-text')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('This privacy policy sets out how Wayback Download uses and protects any information that you give Wayback Download when you use our services. Wayback Download is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using our services, then you can be assured that it will only be used in accordance with this privacy statement. Wayback Download may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes.')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row justify-content-start mr-tp-20')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-lg privacy-content mr-tp-40')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Data related to account')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Any email address provided to Wayback Download through either our waiting list, optional email verification, or optional notification/recovery email setting in your account, is considered personal data.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Such data will only be used to contact you with important notifications about Wayback Download, to send you information related to security, to send you an invitation link to create your Wayback Download account, to verify your Wayback Download account, or to send you password recovery links if you enable the option. We may also inform you about new products in which you might have an interest. You are free, at any given time, to opt-out of those features through the account settings panel.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('In order to pursue our legitimate interest of preventing the creation of accounts by spam bots or human spammers, Wayback Download uses a variety of human verification methods. You may be asked to verify using either reCaptcha, Email, or SMS. IP addresses, email addresses, and phone numbers provided are saved temporarily in order to send you a verification code and to determine if you are a spammer. If this data is saved permanently, it is always saved as a cryptographic hash, which ensures that the raw values cannot be deciphered by us.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Data Collection')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Wayback Download\'s overriding policy is to collect as little user information as possible to ensure a completely private and anonymous user experience when using our services.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Service\'s user data collection is limited to the following:')
										])),
									A2(
									$elm$html$Html$ul,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$li,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$p,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$b,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('Visiting our website:')
																])),
															$elm$html$Html$text('We do not make use of any analytics on our website and we do not log any user activity.')
														]))
												])),
											A2(
											$elm$html$Html$li,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$p,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$b,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('Account creation:')
																])),
															$elm$html$Html$text('We collect only the necessary information for billing and communication. We encourage all users to provide an anonymous email address through the use of services like '),
															A2(
															$elm$html$Html$a,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$href('https://anonaddy.com/'),
																	$elm$html$Html$Attributes$target('_blank')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('AnonAddy')
																])),
															$elm$html$Html$text('.')
														]))
												])),
											A2(
											$elm$html$Html$li,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$p,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$b,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('Account activity:')
																])),
															$elm$html$Html$text('Minimal information is retained during account usage (such as domains restored, recovered deleted websites, how you use the wayback machine downloader, etc.). This information is used to provide you with accurate experience.')
														]))
												])),
											A2(
											$elm$html$Html$li,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$p,
													_List_Nil,
													_List_fromArray(
														[
															A2(
															$elm$html$Html$b,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('Communicating with Wayback Download:')
																])),
															$elm$html$Html$text('Your communications with us, such as support requests, bug reports or feature requests may be saved. But you are welcome to do so anonymously.')
														]))
												]))
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Data Use')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('We do not have any advertising on our site. Any data that that we do have (which is very little), will only be shared under extraordinary circumstances (such as through a court order).')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Data Storage')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('All servers used in connection with the provisioning of our services are located in the United States through Amazon Web Services.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Third Party Networks')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('To provide every user with a secure user experience, we make use of some minimal third party tools, namely: Stripe (for payment processing) and AWS Cognito (for credential handling). We encourage every user to read these companies privacy policy carefully as the data they handle is out of our control.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Right to Access, Rectification, Erasure, Portability, and right to lodge a complaint')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Through our services, you can directly access, edit, delete or export personal data processed by Wayback Download. If your account has been suspended for a breach of our terms and conditions, and you would like to exercise the rights related to your personal data, you can make a request to our support team.'),
											A2($elm$html$Html$br, _List_Nil, _List_Nil),
											A2($elm$html$Html$br, _List_Nil, _List_Nil),
											$elm$html$Html$text('In case of violation of your rights, you have the right to lodge a complaint to the competent supervisory authority.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Data Retention')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('When an Wayback Download account is closed, data is immediately delete from production servers. Active accounts will have data retained as long as the user requests to have it. Deleted data may be retained for some time in our backups for regulatory purposes.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Data Disclosure')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('We will only disclose the limited user data we possess if we are instructed to do so by a fully binding request coming from the competent Canadian or United States authorities (legal obligation). While we may comply with electronically delivered notices (see exceptions below), the disclosed data can only be used in court after we have received an original copy of the court order by registered post or in person, and provide a formal response.'),
											A2($elm$html$Html$br, _List_Nil, _List_Nil),
											$elm$html$Html$text('If a request is made for encrypted message content that Wayback Download does not possess the ability to decrypt, the fully encrypted message content may be turned over. If permitted by law, Wayback Download will always contact a user first before any data disclosure.'),
											A2($elm$html$Html$br, _List_Nil, _List_Nil),
											$elm$html$Html$text('Wayback Download may from time to time, contest requests if there is a public interest in doing so. In such situations, Wayback Download will not comply with the request until all legal or other remedies have been exhausted.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil)
								]))
						]))
				]))
		]));
var $author$project$Pages$Privacy$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'other',
					'',
					$elm$html$Html$text(''),
					$elm$html$Html$text(''),
					$author$project$Pages$Privacy$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$Privacy$viewSection1,
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Privacy Policy | Wayback Download'
		};
	});
var $author$project$Pages$Privacy$page = F2(
	function (shared, _v0) {
		return $author$project$Page$element(
			{
				init: $author$project$Pages$Privacy$init,
				subscriptions: function (_v1) {
					return $elm$core$Platform$Sub$none;
				},
				update: $author$project$Pages$Privacy$update,
				view: $author$project$Pages$Privacy$view(shared)
			});
	});
var $author$project$Pages$Signup$Model = F3(
	function (form, status, showMenu) {
		return {form: form, showMenu: showMenu, status: status};
	});
var $author$project$Pages$Signup$None = {$: 'None'};
var $author$project$Proto$Response$SignupForm = F4(
	function (username, password, email, recaptcha) {
		return {email: email, password: password, recaptcha: recaptcha, username: username};
	});
var $author$project$Pages$Signup$init = _Utils_Tuple2(
	A3(
		$author$project$Pages$Signup$Model,
		A4($author$project$Proto$Response$SignupForm, '', '', '', ''),
		$author$project$Pages$Signup$None,
		false),
	$author$project$Shared$loadhCaptcha);
var $author$project$Pages$Signup$ReceivedCaptcha = function (a) {
	return {$: 'ReceivedCaptcha', a: a};
};
var $author$project$Pages$Signup$subscriptions = function (_v0) {
	return $author$project$Shared$messageReceiver($author$project$Pages$Signup$ReceivedCaptcha);
};
var $author$project$Pages$Signup$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $author$project$Pages$Signup$Loading = {$: 'Loading'};
var $author$project$Pages$Signup$Success = function (a) {
	return {$: 'Success', a: a};
};
var $author$project$Pages$Signup$FormSentResp = function (a) {
	return {$: 'FormSentResp', a: a};
};
var $author$project$Proto$Response$encodeSignupForm = function (value) {
	return $eriktim$elm_protocol_buffers$Protobuf$Encode$message(
		_List_fromArray(
			[
				_Utils_Tuple2(
				1,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.username)),
				_Utils_Tuple2(
				2,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.password)),
				_Utils_Tuple2(
				3,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.email)),
				_Utils_Tuple2(
				4,
				$eriktim$elm_protocol_buffers$Protobuf$Encode$string(value.recaptcha))
			]));
};
var $author$project$Pages$Signup$signup = F2(
	function (env, model) {
		return _Utils_Tuple2(
			model,
			$elm$http$Http$post(
				{
					body: A2(
						$elm$http$Http$bytesBody,
						'application/protobuf',
						$eriktim$elm_protocol_buffers$Protobuf$Encode$encode(
							$author$project$Proto$Response$encodeSignupForm(model.form))),
					expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Signup$FormSentResp, $author$project$Proto$Response$decodeResponse),
					url: env.serverUrl + '/signup'
				}));
	});
var $author$project$Pages$Signup$update = F3(
	function (shared, msg, model) {
		switch (msg.$) {
			case 'ClickedRegister':
				return (model.form.username === '') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$Signup$Failure('Username cannot be empty')
						}),
					$elm$core$Platform$Cmd$none) : ((model.form.email === '') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$Signup$Failure('Email cannot be empty')
						}),
					$elm$core$Platform$Cmd$none) : ((!$author$project$Common$Regex$emailRegex(model.form.email)) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$Signup$Failure('Invalid email provided')
						}),
					$elm$core$Platform$Cmd$none) : ((model.form.password === '') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{
							status: $author$project$Pages$Signup$Failure('Password cannot be empty')
						}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{status: $author$project$Pages$Signup$Loading}),
					$author$project$Shared$getCaptchaResponse))));
			case 'ReceivedCaptcha':
				var captcha = msg.a;
				if (captcha === '') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Pages$Signup$Failure('Must fill out captcha')
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var oldForm = model.form;
					var newForm = _Utils_update(
						oldForm,
						{recaptcha: captcha});
					return A2(
						$author$project$Pages$Signup$signup,
						shared.env,
						_Utils_update(
							model,
							{form: newForm}));
				}
			case 'ChangeUsername':
				var username = msg.a;
				var oldForm = model.form;
				var newForm = _Utils_update(
					oldForm,
					{username: username});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{form: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ChangePassword':
				var password = msg.a;
				var oldForm = model.form;
				var newForm = _Utils_update(
					oldForm,
					{password: password});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{form: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'ChangeEmail':
				var email = msg.a;
				var oldForm = model.form;
				var newForm = _Utils_update(
					oldForm,
					{email: email});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{form: newForm}),
					$elm$core$Platform$Cmd$none);
			case 'FormSentResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v2 = resp.status;
					if (_v2.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Signup$Failure(resp.error)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v3 = resp.data;
						if (_v3.$ === 'Just') {
							var data = _v3.a;
							return _Utils_Tuple2(
								A3(
									$author$project$Pages$Signup$Model,
									A4($author$project$Proto$Response$SignupForm, '', '', '', ''),
									$author$project$Pages$Signup$Success(data.info),
									false),
								$author$project$Shared$resetCaptcha(_Utils_Tuple0));
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										status: $author$project$Pages$Signup$Failure('Unable to process request, please try again later')
									}),
								$author$project$Shared$resetCaptcha(_Utils_Tuple0));
						}
					}
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								status: $author$project$Pages$Signup$Failure('Unable to process request, please try again later')
							}),
						$author$project$Shared$resetCaptcha(_Utils_Tuple0));
				}
			default:
				return model.showMenu ? _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: false}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: true}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Signup$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$Signup$ChangeEmail = function (a) {
	return {$: 'ChangeEmail', a: a};
};
var $author$project$Pages$Signup$ChangePassword = function (a) {
	return {$: 'ChangePassword', a: a};
};
var $author$project$Pages$Signup$ChangeUsername = function (a) {
	return {$: 'ChangeUsername', a: a};
};
var $author$project$Pages$Signup$ClickedRegister = {$: 'ClickedRegister'};
var $author$project$Pages$Signup$viewMain = function (model) {
	return A2(
		$elm$html$Html$main_,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('col-sm')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('row form-contain-home contact-page-form-send'),
										$elm$html$Html$Attributes$id('ajax-contact')
									]),
								_List_fromArray(
									[
										function () {
										var _v0 = model.status;
										switch (_v0.$) {
											case 'Failure':
												var err = _v0.a;
												return $author$project$Common$Alert$viewAlertError(err);
											case 'Success':
												var msg = _v0.a;
												return $author$project$Common$Alert$viewAlertSuccess(msg);
											default:
												return A2($elm$html$Html$div, _List_Nil, _List_Nil);
										}
									}(),
										A2(
										$elm$html$Html$h5,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Register')
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('form-messages')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field input-field')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$input,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-contain-home-input'),
																$elm$html$Html$Attributes$id('username'),
																$elm$html$Html$Attributes$name('username'),
																$elm$html$Html$Attributes$placeholder('Username'),
																$elm$html$Html$Attributes$required(true),
																$elm$html$Html$Attributes$type_('text'),
																$elm$html$Html$Attributes$value(model.form.username),
																$elm$html$Html$Events$onInput($author$project$Pages$Signup$ChangeUsername)
															]),
														_List_Nil),
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('fas fa-address-card')
															]),
														_List_Nil)
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field input-field')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$input,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-contain-home-input'),
																$elm$html$Html$Attributes$id('email'),
																$elm$html$Html$Attributes$name('email'),
																$elm$html$Html$Attributes$placeholder('Email'),
																$elm$html$Html$Attributes$required(true),
																$elm$html$Html$Attributes$type_('email'),
																$elm$html$Html$Attributes$value(model.form.email),
																$elm$html$Html$Events$onInput($author$project$Pages$Signup$ChangeEmail)
															]),
														_List_Nil),
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('fas fa-envelope')
															]),
														_List_Nil)
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('col-md-12')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('field input-field')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$input,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('form-contain-home-input'),
																$elm$html$Html$Attributes$id('password'),
																$elm$html$Html$Attributes$name('password'),
																$elm$html$Html$Attributes$placeholder('Password'),
																$elm$html$Html$Attributes$required(true),
																$elm$html$Html$Attributes$type_('password'),
																$elm$html$Html$Attributes$value(model.form.password),
																$elm$html$Html$Events$onInput($author$project$Pages$Signup$ChangePassword)
															]),
														_List_Nil),
														A2(
														$elm$html$Html$i,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('fas fa-key')
															]),
														_List_Nil)
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$id('h-captcha'),
												$elm$html$Html$Attributes$class('h-captcha col-md-12')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn-holder-contact')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$id('signup'),
														$elm$html$Html$Attributes$type_('submit'),
														$elm$html$Html$Events$onClick($author$project$Pages$Signup$ClickedRegister)
													]),
												function () {
													var _v1 = model.status;
													if (_v1.$ === 'Loading') {
														return $author$project$Common$Spinner$viewSpinnerText;
													} else {
														return _List_fromArray(
															[
																$elm$html$Html$text('Register')
															]);
													}
												}())
											])),
										A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin-top', '0.5rem')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Already have an account?'),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href('/login')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(' Login')
													]))
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Pages$Signup$viewSection1 = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('padding-100-0')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_Nil)
		]));
var $author$project$Pages$Signup$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'main',
					'',
					$author$project$Pages$Signup$viewMain(model),
					$elm$html$Html$text(''),
					$author$project$Pages$Signup$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$Signup$viewSection1,
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Signup | Wayback Download'
		};
	});
var $author$project$Pages$Signup$page = F2(
	function (shared, _v0) {
		return $author$project$Page$element(
			{
				init: $author$project$Pages$Signup$init,
				subscriptions: $author$project$Pages$Signup$subscriptions,
				update: $author$project$Pages$Signup$update(shared),
				view: $author$project$Pages$Signup$view(shared)
			});
	});
var $author$project$Pages$Subscription$Model = F2(
	function (status, showMenu) {
		return {showMenu: showMenu, status: status};
	});
var $author$project$Pages$Subscription$None = {$: 'None'};
var $author$project$Pages$Subscription$UserResp = function (a) {
	return {$: 'UserResp', a: a};
};
var $author$project$Pages$Subscription$getUser = F2(
	function (user, env) {
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$emptyBody,
				expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Subscription$UserResp, $author$project$Proto$Response$decodeResponse),
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'Bearer ' + user.token)
					]),
				method: 'GET',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: env.serverUrl + '/user'
			});
	});
var $author$project$Pages$Subscription$init = F2(
	function (user, env) {
		return _Utils_Tuple2(
			A2($author$project$Pages$Subscription$Model, $author$project$Pages$Subscription$None, false),
			A2($author$project$Pages$Subscription$getUser, user, env));
	});
var $author$project$Pages$Subscription$Failure = function (a) {
	return {$: 'Failure', a: a};
};
var $author$project$Pages$Subscription$ServerResp = function (a) {
	return {$: 'ServerResp', a: a};
};
var $author$project$Pages$Subscription$getCustomerPortalUrl = F2(
	function (user, env) {
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$emptyBody,
				expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Subscription$ServerResp, $author$project$Proto$Response$decodeResponse),
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'Bearer ' + user.token)
					]),
				method: 'POST',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: env.serverUrl + '/customer-portal'
			});
	});
var $author$project$Pages$Subscription$getSubscriptionUrl = F2(
	function (user, env) {
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$emptyBody,
				expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Subscription$ServerResp, $author$project$Proto$Response$decodeResponse),
				headers: _List_fromArray(
					[
						A2($elm$http$Http$header, 'Authorization', 'Bearer ' + user.token)
					]),
				method: 'POST',
				timeout: $elm$core$Maybe$Nothing,
				tracker: $elm$core$Maybe$Nothing,
				url: env.serverUrl + '/subscription-checkout-session'
			});
	});
var $author$project$Pages$Subscription$update = F4(
	function (shared, user, msg, model) {
		switch (msg.$) {
			case 'ClickedSubscribeNow':
				return _Utils_Tuple2(
					model,
					A2($author$project$Pages$Subscription$getSubscriptionUrl, user, shared.env));
			case 'ClickedManageSubscription':
				return _Utils_Tuple2(
					model,
					A2($author$project$Pages$Subscription$getCustomerPortalUrl, user, shared.env));
			case 'ServerResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v2 = resp.status;
					if (_v2.$ === 'Status_FAILED') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Subscription$Failure(resp.error)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v3 = resp.data;
						if (_v3.$ === 'Just') {
							var data = _v3.a;
							return _Utils_Tuple2(
								model,
								$elm$browser$Browser$Navigation$load(data.url));
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										status: $author$project$Pages$Subscription$Failure('Unable to create checkout session, please try again')
									}),
								$elm$core$Platform$Cmd$none);
						}
					}
				} else {
					var err = result.a;
					if (err.$ === 'BadStatus') {
						var code = err.a;
						return (code === 401) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Subscription$Failure('Login session expired')
								}),
							$author$project$Storage$signOut(shared.storage)) : _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Subscription$Failure('Unable to fetch user details, please try again later')
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Subscription$Failure('Unable to fetch user details, please try again later')
								}),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 'UserResp':
				var result = msg.a;
				if (result.$ === 'Ok') {
					var resp = result.a;
					var _v6 = resp.status;
					if (_v6.$ === 'Status_FAILED') {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var _v7 = resp.data;
						if (_v7.$ === 'Just') {
							var data = _v7.a;
							var _v8 = data.user;
							if (_v8.$ === 'Just') {
								var user_ = _v8.a;
								return _Utils_Tuple2(
									model,
									A2($author$project$Storage$changeSubscriptionStatus, shared.storage, user_.subscribed));
							} else {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							}
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					}
				} else {
					var err = result.a;
					if (err.$ === 'BadStatus') {
						var code = err.a;
						return (code === 401) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{
									status: $author$project$Pages$Subscription$Failure('Login session expired')
								}),
							$author$project$Storage$signOut(shared.storage)) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				}
			default:
				return model.showMenu ? _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: false}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{showMenu: true}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Subscription$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$Subscription$viewMain = A2(
	$elm$html$Html$main_,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('container mb-auto')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h3,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mt-3 main-header-text-title')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Unlimited Restores Subscription')
				]))
		]));
var $author$project$Pages$Subscription$ClickedManageSubscription = {$: 'ClickedManageSubscription'};
var $author$project$Pages$Subscription$ClickedSubscribeNow = {$: 'ClickedSubscribeNow'};
var $author$project$Pages$Subscription$viewSection1 = F3(
	function (env, user, model) {
		return A2(
			$elm$html$Html$section,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('padding-100-0 position-relative')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('container')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-md-6 mx-auto')
								]),
							_List_fromArray(
								[
									function () {
									var _v0 = model.status;
									if (_v0.$ === 'Failure') {
										var err = _v0.a;
										return $author$project$Common$Alert$viewAlertError(err);
									} else {
										return A2($elm$html$Html$div, _List_Nil, _List_Nil);
									}
								}(),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('second-pricing-table')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$h5,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('second-pricing-table-title')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Bulk Subscription'),
													A2(
													$elm$html$Html$span,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('unlimited monthly access')
														]))
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('second-pricing-table-price monthly')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$i,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('monthly')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(
															'$' + $elm$core$String$fromInt(env.subscriptionCost)),
															A2(
															$elm$html$Html$small,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('/mo')
																]))
														]))
												])),
											A2(
											$elm$html$Html$ul,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('second-pricing-table-body')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$li,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Up to 10 HTML restores per month')
														])),
													A2(
													$elm$html$Html$li,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Priority order processing')
														])),
													A2(
													$elm$html$Html$li,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Configurable link creation during scraping')
														])),
													A2(
													$elm$html$Html$li,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Discounted WordPress conversion ($55)')
														])),
													A2(
													$elm$html$Html$li,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Email support included')
														])),
													A2(
													$elm$html$Html$li,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Fair use policy applies')
														]))
												])),
											user.subscribed ? A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('second-pricing-table-button'),
													$elm$html$Html$Attributes$href('#'),
													$elm$html$Html$Attributes$id('subscribe'),
													$elm$html$Html$Events$onClick($author$project$Pages$Subscription$ClickedManageSubscription)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Manage Subscription')
												])) : A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('second-pricing-table-button'),
													$elm$html$Html$Attributes$href('#'),
													$elm$html$Html$Attributes$id('subscribe'),
													$elm$html$Html$Events$onClick($author$project$Pages$Subscription$ClickedSubscribeNow)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Subscribe Now')
												]))
										]))
								]))
						]))
				]));
	});
var $author$project$Pages$Subscription$view = F3(
	function (shared, user, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'sub',
					'',
					$author$project$Pages$Subscription$viewMain,
					$elm$html$Html$text(''),
					$author$project$Pages$Subscription$ClickedToggleMenu,
					model.showMenu),
					A3($author$project$Pages$Subscription$viewSection1, shared.env, user, model),
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Bulk Subscription — Unlimited Restores | Wayback Download'
		};
	});
var $author$project$Pages$Subscription$page = F2(
	function (shared, _v0) {
		return $author$project$Page$protected.element(
			function (user) {
				return {
					init: A2($author$project$Pages$Subscription$init, user, shared.env),
					subscriptions: function (_v1) {
						return $elm$core$Platform$Sub$none;
					},
					update: A2($author$project$Pages$Subscription$update, shared, user),
					view: A2($author$project$Pages$Subscription$view, shared, user)
				};
			});
	});
var $author$project$Pages$Success$Id_$Loading = {$: 'Loading'};
var $author$project$Pages$Success$Id_$Model = F4(
	function (id, status, restore, showMenu) {
		return {id: id, restore: restore, showMenu: showMenu, status: status};
	});
var $author$project$Pages$Success$Id_$RestoreResp = function (a) {
	return {$: 'RestoreResp', a: a};
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{body: $elm$http$Http$emptyBody, expect: r.expect, headers: _List_Nil, method: 'GET', timeout: $elm$core$Maybe$Nothing, tracker: $elm$core$Maybe$Nothing, url: r.url});
};
var $author$project$Pages$Success$Id_$getRestores = F2(
	function (env, model) {
		return $elm$http$Http$get(
			{
				expect: A2($author$project$Common$CustomHttp$expectProto, $author$project$Pages$Success$Id_$RestoreResp, $author$project$Proto$Response$decodeResponse),
				url: env.serverUrl + ('/restore/' + model.id)
			});
	});
var $author$project$Pages$Success$Id_$init = F2(
	function (params, shared) {
		var model = A4($author$project$Pages$Success$Id_$Model, params.id, $author$project$Pages$Success$Id_$Loading, _List_Nil, false);
		return _Utils_Tuple2(
			model,
			A2($author$project$Pages$Success$Id_$getRestores, shared.env, model));
	});
var $author$project$Pages$Success$Id_$Failure = {$: 'Failure'};
var $author$project$Pages$Success$Id_$ServerError = {$: 'ServerError'};
var $author$project$Pages$Success$Id_$Success = {$: 'Success'};
var $author$project$Pages$Success$Id_$update = F2(
	function (msg, model) {
		if (msg.$ === 'RestoreResp') {
			var result = msg.a;
			if (result.$ === 'Ok') {
				var resp = result.a;
				var _v2 = resp.status;
				if (_v2.$ === 'Status_FAILED') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{status: $author$project$Pages$Success$Id_$Failure}),
						$elm$core$Platform$Cmd$none);
				} else {
					var _v3 = resp.data;
					if (_v3.$ === 'Just') {
						var data = _v3.a;
						return ($elm$core$List$length(data.restores) >= 1) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{restore: data.restores, status: $author$project$Pages$Success$Id_$Success}),
							$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
							_Utils_update(
								model,
								{status: $author$project$Pages$Success$Id_$ServerError}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{status: $author$project$Pages$Success$Id_$Failure}),
							$elm$core$Platform$Cmd$none);
					}
				}
			} else {
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{status: $author$project$Pages$Success$Id_$Failure}),
					$elm$core$Platform$Cmd$none);
			}
		} else {
			return model.showMenu ? _Utils_Tuple2(
				_Utils_update(
					model,
					{showMenu: false}),
				$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
				_Utils_update(
					model,
					{showMenu: true}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Pages$Success$Id_$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $author$project$Pages$Success$Id_$viewMain = A2(
	$elm$html$Html$main_,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('container mb-auto')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h3,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mt-3 main-header-text-title')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Order Summary')
				]))
		]));
var $author$project$Pages$Success$Id_$viewInvalidOrder = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('futures-version-3-box')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h4,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Invalid Order!')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('This is an invalid order.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('If you are sure that this is the correct URL, please contact our support: '),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('mailto:support@wayback.download')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('support@wayback.download')
						]))
				]))
		]));
var $author$project$Pages$Success$Id_$viewLoading = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('futures-version-3-box')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h4,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Loading...')
				]))
		]));
var $author$project$Pages$Success$Id_$viewServerError = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('futures-version-3-box')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$h4,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Failed to process order!')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('The order has failed to process.')
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Please contact our support: '),
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('mailto:support@wayback.download')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('support@wayback.download')
						]))
				]))
		]));
var $elm$html$Html$h6 = _VirtualDom_node('h6');
var $author$project$Pages$Success$Id_$viewItem = function (restore) {
	return A2(
		$elm$html$Html$tr,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(restore.domain)
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(restore.timestamp)
					])),
				A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('9$')
					]))
			]));
};
var $author$project$Pages$Success$Id_$viewValidOrder = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('futures-version-3-box')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h4,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Success!')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('We\'ve got your order and will be processing it shortly!')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Keep an eye out for emails from us, as this is how you will be receiving your restored files as well as your receipt.')
					])),
				A2($elm$html$Html$hr, _List_Nil, _List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h6,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Here\'s your order summary:')
							])),
						A2(
						$elm$html$Html$table,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('table table-bordered')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$thead,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$tr,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$th,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$scope('col')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Domain')
													])),
												A2(
												$elm$html$Html$th,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$scope('col')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Timestamp')
													])),
												A2(
												$elm$html$Html$th,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$scope('col')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Price')
													]))
											]))
									])),
								A2(
								$elm$html$Html$tbody,
								_List_Nil,
								A2($elm$core$List$map, $author$project$Pages$Success$Id_$viewItem, model.restore))
							]))
					]))
			]));
};
var $author$project$Pages$Success$Id_$viewSection = function (model) {
	return A2(
		$elm$html$Html$main_,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container mb-auto')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row justify-content-start futures-version-2')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('col-md')
							]),
						_List_fromArray(
							[
								function () {
								var _v0 = model.status;
								switch (_v0.$) {
									case 'Loading':
										return $author$project$Pages$Success$Id_$viewLoading;
									case 'Success':
										return $author$project$Pages$Success$Id_$viewValidOrder(model);
									case 'Failure':
										return $author$project$Pages$Success$Id_$viewInvalidOrder;
									default:
										return $author$project$Pages$Success$Id_$viewServerError;
								}
							}()
							]))
					]))
			]));
};
var $author$project$Pages$Success$Id_$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'sub',
					'',
					$author$project$Pages$Success$Id_$viewMain,
					$elm$html$Html$text(''),
					$author$project$Pages$Success$Id_$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$Success$Id_$viewSection(model),
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Success | Wayback Download'
		};
	});
var $author$project$Pages$Success$Id_$page = F2(
	function (shared, req) {
		return $author$project$Page$element(
			{
				init: A2($author$project$Pages$Success$Id_$init, req.params, shared),
				subscriptions: function (_v0) {
					return $elm$core$Platform$Sub$none;
				},
				update: $author$project$Pages$Success$Id_$update,
				view: $author$project$Pages$Success$Id_$view(shared)
			});
	});
var $author$project$Pages$Terms$Model = function (showMenu) {
	return {showMenu: showMenu};
};
var $author$project$Pages$Terms$init = _Utils_Tuple2(
	$author$project$Pages$Terms$Model(false),
	$elm$core$Platform$Cmd$none);
var $author$project$Pages$Terms$update = F2(
	function (msg, model) {
		return model.showMenu ? _Utils_Tuple2(
			_Utils_update(
				model,
				{showMenu: false}),
			$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
			_Utils_update(
				model,
				{showMenu: true}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Pages$Terms$ClickedToggleMenu = {$: 'ClickedToggleMenu'};
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $author$project$Pages$Terms$viewSection1 = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('padding-60-0-100 position-relative')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-md-12 help-center-header')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h1,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('help-center-title')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Last update: May 2021')
												])),
											$elm$html$Html$text('Terms of service')
										])),
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('help-center-text')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('This Terms of Service (\"Agreement\") is a legally binding contract between Wayback Download and you (\"Customer,\" \"you\" or \"your\") that shall govern the purchase and use, in any manner, of the services provided by Wayback Download to Customer (collectively, the \"Services\").')
										])),
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('help-center-text')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('By purchasing and/or using the Services in any manner, you represent that you have read, understand, and agree to all terms and conditions set forth in this Agreement, and that you are at least eighteen (18) years old and have the legal ability to engage in a contract in Quebec,Canada.')
										])),
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('help-center-text')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('If you do not agree to all the terms and conditions set forth in this Agreement, then you may not use any of the Services. If you are already a customer of Wayback Download and do not agree with the terms and conditions set forth in this Agreement, you should immediately contact Wayback Download to cancel your Services.')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row justify-content-start mr-tp-20')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col-lg privacy-content mr-tp-40')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('1. Ownership and Services Purchased')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('1.1. The individual or entity set out in our records as the primary billing contact shall be the owner of the account.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('1.2. The features and details of the Services governed by this Agreement are described on the web pages setting out the particular services or products you have purchased (\"Service Description Page\") based on their description on the Service Description Page as of the Effective Date, as defined below. Wayback Download may modify the products and services it offers from time-to-time. Should the Service Description Page change subsequent to the Effective Date, we have no obligation to modify the Service to reflect such a change. The services and products provided to you by Wayback Download as set out on the Service Description Page, are referred to as the \"Services.\"')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('2. Term of Agreement')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('2.1. This Agreement becomes effective immediately when Customer clicks \"I Agree.\" (\"Effective Date\") and remains effective and binding until terminated by either party as outlined below. This Agreement may only be modified by a written amendment signed by an authorized executive of Wayback Download, or by the posting by Wayback Download of a revised version.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('2.2. The term of this Agreement is set to the Customer\'s billing term (\"Term\"). If no Term is set out, the Term shall be one (1) year. Upon expiration of the initial Term, this Agreement shall renew for periods equal to the length of the initial Term, unless one party provides notice of its intent to terminate as set out in this Agreement.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('3. Obeying the Law')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('3.1. Wayback Download is registered and located within Canada and as such, we are required to comply with the laws and official policies of Canada, regardless of where the Services are provided. In addition, Wayback Download will comply with appropriate laws and official policies set forth by Quebec.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('4. Payments and Billing')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('4.1. Wayback Download will automatically bill your payment method on file up to fifteen (15) days prior to the due date on all terms of one (1) or more years; for terms less than one (1) year in length, Wayback Download will attempt to bill your payment method on file up to five (5) days prior to due date. All fees are billed in United States Dollars (“USD”) and are subject to change with thirty (30) days notice prior notice to you.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('4.2. Your \"Billing Term\" is the period of time you have chosen to receive bills for the Services. For example, your Billing Term may be monthly, quarterly, or annually.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('4.3. Wayback Download is only able to automatically collect payment from customers with credit cards stored on file (as opposed to credit cards used one for one time transactions) or active PayPal subscriptions. All other payment methods (one time credit card payments, check, money order, PayPal one time payments, etc.) must be initiated manually by you. It is your obligation to ensure that reoccurring fees are paid on their due date.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('4.4. As a customer of Wayback Download, it is your responsibility to ensure that all billing information on file with Wayback Download is accurate, and that any credit card or other automated payment method on file has sufficient funds for processing. You are solely responsible for any and all fees charged to your payment method by the issuer, bank, or financial institution including, but not limited to, membership, overdraft, insufficient funds and over the credit limit fees. Wayback Download screens all orders for fraud and other unethical practices. Services will not be activated until this fraud screen is completed. In certain cases, if your account is flagged for fraud, third party services, such as domain name registrations, will not be processed. Wayback Download has no liability for the failure to provide Services, including third party services, if your account fails its fraud screen.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('5. Late Payments')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('5.1. Any account not paid in full by the end of the first day of the Billing Term will be given a seven (7) day grace period. If payment is not made within the seven (7) day grace period, Wayback Download reserves the right to suspend your Service(s) with Wayback Download and to charge a $10 \"late penalty.\" Fourteen (14) days following suspension of Services for non-payment, Wayback Download reserves the right to terminate Service(s) for non-payment.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('5.2. Wayback Download is not responsible for any damages or losses as a result of suspension or termination for non-payment of your account. In addition, Wayback Download reserves the right to refuse to re-activate your Services until any and all outstanding invoice(s) have been paid in full.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('6. Refund Policy and Billing Disputes')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('6.1. Wayback Download offers a fourteen (14) day money back guarantee on website restores for major discrepencies between the restore files and the Internet Archive\'s Wayback Machine\'s website. Beyond 14 days, no refunds are available for any reason.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('6.2. No refunds are offered on any other services.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('6.3. Only first-time accounts are eligible for a refund under the 14 day money back guarantee. For example, if you had or still have an account with Wayback Download before, canceled and signed up again, you will not be eligible for a refund or if you have opened a second account with Wayback Download. In addition, refunds are not offered for accounts that are suspended or terminated for violating this Agreement.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('6.4. Refunds will be issued only to the payment method that the original payment was sent from, and may take up to one (1) week to process.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('6.5. The following methods of payment are not refundable any circumstances (including during the money back guarantee period, if one applies), and refunds will be posted solely as credit to the hosting account for current or future Services: bank wire transfers, Western Union payments, checks, and money orders.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('6.6. Wayback Download will not activate new orders or provide additional Services for customers who have an outstanding balance with Wayback Download. For a new order to be setup or a new package to be activated, you must have a balance of $0.00, unless otherwise stated by Wayback Download in writing.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('6.7. Exchange rate fluctuations for international payments are constant and unavoidable. Like all payments, all refunds are processed in U.S. dollars, and will reflect the exchange rate in effect on the date of the refund. All refunds are subject to this fluctuation and Wayback Download is not responsible for any change in exchange rates between time of payment and time of refund. In addition, Wayback Download reserves the right to refuse a refund at any time for any or no reason.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('6.8. If you believe there is an error in Wayback Download\'s billing, you must contact Wayback Download about it, in writing, within thirty (30) days of the date you are billed or charged. Wayback Download\'s obligation to consider your claim is contingent on your providing it with sufficient facts for Wayback Download to investigate your claims. You waive your right to dispute any charges or fees if you fail to notify Wayback Download in writing or meet the deadline set out above. If Wayback Download finds that your claim is valid, Wayback Download agrees to credit your account on your next billing date. Third party fees are not subject to this dispute provision and are final.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('7. Chargebacks, Reversals, and Retrievals')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('7.1. If Wayback Download receives a chargeback or payment dispute from a credit card company, bank, or Stripe your Services may be suspended without notice. A $50 chargeback fee (issued to recoup mandatory fees passed on to Wayback Download by the credit card company), plus any outstanding balances accrued as a result of the chargeback(s), must be paid in full before service is restored. Instead of issuing a chargeback, please contact Wayback Download\'s billing team to address any billing issues.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('7.2. If Wayback Download appeals a chargeback or other payment dispute and wins the dispute or appeal, the funds will likely be returned to Wayback Download by the credit card company or bank. Any double payment resulting from this process will be applied to Customer\'s account in the form of a service credit.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('8. Cancellation of Services')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('8.1. Either party may terminate this Agreement by providing notice to the other as provided herein.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('8.2. You may cancel Service(s) with Wayback Download by submitting a cancellation request in writing by logging into Wayback Download\'s account center located at https://onintime.com/clientarea.php. In the event that you are unable to login to your billing account with Wayback Download, please contact our billing department via email and we will assist you. However, Wayback Download prefers that cancellations are submitted through the account center to reduce the likelihood of error and ensure the security of your account. Cancellations are not final until confirmed by a representative of Wayback Download in writing by email.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('8.3. Cancellations must be requested via the form indicated above 48 hours or more prior to the Service\'s renewal date. If a cancellation notice is not received within the required time frame, you will be billed for the next Billing Term and are responsible for payment as set forth above.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('8.4. If you pay Wayback Download via PayPal, it is your responsibility to cancel any subscription for recurring PayPal payments. Wayback Download (which has no control over PayPal subscription payments) is not responsible for payments made from your PayPal account after cancellation and is under no obligation to refund such payments made after cancellation.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('When upgrading or downgrading package(s), you are responsible for canceling any previous package(s). To cancel previous package(s), you must submit a written cancellation request as described in Section 8.2 above.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('8.6. Wayback Download may terminate this Agreement at any time by providing notice to Customers via email. Should Wayback Download terminate this Agreement for any reason other than a material breach, or violation of Wayback Download\'s Acceptable Use Policy, any prepaid fees shall be refunded.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('8.7. One party may also terminate this Agreement upon the occurrence of a material breach which has not been cured by the other party within ten (10) days of their receipt of written notice of the breach. For the purposes of defining a material breach, materiality shall be determined from the perspective of a reasonable business person with significant experience in conducting business on the Internet. Notices of material breach must contain sufficient detail for the party against whom the assertion of material breach is directed to identify the breach and attempt to take corrective action.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('9. Refusal of Service')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('9.1. Wayback Download reserves the right to refuse service to anyone at any time. Any material that, in Wayback Download\'s judgment, is obscene, threatening, illegal, or violates Wayback Download\'s terms of service in any manner may be removed from Wayback Download\'s servers (or otherwise disabled), with or without notice.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('9.2. Similarly, Wayback Download reserves the right to cancel, suspend, or otherwise restrict access to the Service(s) it provides at any time, for any or no reason, and with or without notice. Wayback Download is not responsible for any damages or loss of data resulting from such suspension or termination.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('9.3. If any manner of communication with Wayback Download\'s staff could be construed as belligerent, vulgar (curse words), attacking, highly rude, threatening, or abusive, you will be issued one warning. If the communication continues, your account may be suspended or terminated without refund. This includes, but is not limited to, threats to sue, slander, libel, publicly post, or initiate a chargeback.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('9.4. Wayback Download happily accepts orders from outside Canada, but may limit accounts from certain countries with a high fraud rate. To help protect Wayback Download and its customers from fraud, Wayback Download may ask you to provide a copy of a government issued identification and/or a scan of the credit card used for the purchase. If you fail to meet these requirements, the order may be considered fraudulent in nature and denied.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('9.5. Due to the Canadian law, Wayback Download cannot accept any orders originating from countries that Canada has established an embargo on or otherwise prohibited trade with. By becoming a customer, you represent and warrant that: (i) you are not located in a country that is subject to a Canadian embargo, or that has been designated by the Canadian Government as a \"terrorist supporting\" country; and (ii) you are not listed on any U.S. Government list of prohibited or restricted parties.')
										])),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('10. Licenses')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('10.1. Wayback Download grants to you a non-exclusive, non-transferable, worldwide, royalty free license to use technology provided by Wayback Download solely to access and use the Services. This license terminates on the expiration or termination of this Agreement. Except for the license rights set out above, this license does not grant any additional rights to you. All right, title and interest in Wayback Download\'s technology shall remain with Wayback Download, or its licensors. You are not permitted to circumvent any devices designed to protect Wayback Download, or its licensor\'s ownership interests in the technology provided to you. In addition, you may not reverse engineer this technology.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('10.2. You grant Wayback Download, or to any third parties used by Wayback Download to provide the Services, a non-exclusive, non-transferable, worldwide, royalty free, license to use, disseminate, transmit and cache content, technology and information provided by you and, if applicable, your End Users, in conjunction with the Services. This license terminates on the expiration or termination of this Agreement. All right, title and interest in your technology shall remain with you, or your licensors.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('11. Service Modifications')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('11.1. Wayback Download reserves the right to add, modify, or remove any or all features from any service Wayback Download provides, at any time, with or without notice. This includes, but is not limited to, disk space limits, bandwidth limits, domain limits, pricing, and third party applications. These changes can be made for any or no reason and Wayback Download does not guarantee the availability of any feature, whether written or implied. If the removal of a feature materially impacts your ability to use the Service, you may terminate this Agreement. For the purposes of this paragraph only, the term \"materially\" means that a reasonable business person would not have purchased the Services for the purposes used by you.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('12. Support Policy')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('12.1. Wayback Download will provide technical support to you during normal business day hours. The only official method for technical support is by email: '),
											A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$href('mailto:support@wayback.download')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('support@wayback.download')
												])),
											$elm$html$Html$text('.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('12.2. Limited support will be provided, at Wayback Download\'s discretion and subject to availability of staff, via email.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('13. Advanced Support Policy')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('13.1. Support to Customer is limited to Wayback Download\'s area of expertise and is available only for issues related to the physical functioning of the Services. Wayback Download does not provide support for any third party software including, but not limited to, software offered by but not developed by Wayback Download. Wayback Download reserves the right to refuse assistance with and/or assess an \"Advanced Support Fee\" of $35.00 USD per hour (1 hour minimum) for any issue that, at Wayback Download\'s sole discretion, is: (a) outside the scope of standard support; or (b) caused by customer error or omission. Wayback Download will always ask for your permission before providing advanced support that may be subject to a fee. By providing your permission, you agree to pay Advanced Support Fees as billed.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('14. Acceptable Usage Policy')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('14.1. You shall use Wayback Download\'s services only for lawful purposes. Transmission, storage, or presentation of any information, data, or material in violation of the laws of Quebec or Canada is prohibited. This includes, but is not limited to: copyrighted material in which you are not the copyright holder, material that is threatening or obscene, or material protected by trade secrets or other statutes. You agree to indemnify and hold harmless Wayback Download from any claims resulting from the use of the service which damages you or any other party.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('15. Warranties')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('15.1. Your Warranties to Wayback Download')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('15.1.1. You represent and warrant to Wayback Download that: (i) you have the experience and knowledge necessary to use the Services; (ii) you will provide Wayback Download with material that may be implemented by it to provide the Services without extra effort on Wayback Download\'s part; and (iii) you have sufficient knowledge about administering, designing, and operating the functions facilitated by the Service to take advantage of it.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('15.1.2. You expressly warrant that you own the entire right, title and interest to, or have an appropriate license to use, all material provided to Wayback Download, or which may be accessed or transmitted using the Services. You also warrant that to the extent you do business with other parties using the Services, that they have the same ownership interests in the materials provided to you, or accessed via you, that are set out in this paragraph.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('15.2. Wayback Download\'s Warranties')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('15.2.1. YOU EXPRESSLY AGREE THAT USE OF Wayback Download\'S SERVICES IS AT YOUR OWN RISK. THE SERVICES ARE PROVIDED AS-IS AND AS-AVAILABLE. OTHER THAN AS EXPRESSLY SET OUT IN THIS AGREEMENT, Wayback Download HAS NOT, AND DOES NOT, MAKE ANY WARRANTIES WHETHER EXPRESS OR IMPLIED. THIS DISCLAIMER INCLUDES, BUT IS NOT LIMITED TO, THE WARRANTIES OR NON-INFRINGEMENT, FITNESS FOR A PARTICULAR PURPOSE, WARRANTIES OR MERCHANTABILITY, AND/OR TITLE. NEITHER Wayback Download, ITS PARENT, ITS EMPLOYEES, AGENTS, RESELLERS, THIRD PARTY INFORMATION PROVIDERS, MERCHANTS LICENSERS OR THE LIKE, WARRANT THAT Wayback Download\'S SERVICES WILL NOT BE INTERRUPTED OR BE ERROR-FREE; NOR DO THEY MAKE ANY WARRANTY AS TO THE RESULTS THAT MIGHT BE OBTAINED FROM THE USE OF THE SERVICES OR AS TO THE ACCURACY, OR RELIABILITY, OF ANY INFORMATION SERVICE OR MERCHANDISE CONTAINED IN OR PROVIDED THROUGH Wayback Download\'S NETWORK, UNLESS OTHERWISE EXPRESSLY STATED IN THIS AGREEMENT. Wayback Download SPECIFICALLY DISCLAIMS ANY AND ALL WARRANTIES REGARDING SERVICES PROVIDED BY THIRD PARTIES, REGARDLESS OF WHETHER THOSE SERVICES APPEAR TO BE PROVIDED BY Wayback Download. NO WARRANTIES MADE BY THESE THIRD PARTIES TO Wayback Download SHALL BE PASSED THROUGH TO YOU, NOR SHALL YOU CLAIM TO BE A THIRD PARTY BENEFICIARY OF SUCH WARRANTIES.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('15.2.2. THE WARRANTY DISCLAIMERS CONTAINED IN THIS AGREEMENT EXTEND TO ANY ORAL OR WRITTEN INFORMATION YOU MAY HAVE RECEIVED FROM Wayback Download, ITS EMPLOYEES, THIRD-PARTY VENDORS, AGENTS OR AFFILIATES. YOU MAY NOT RELY ON SUCH INFORMATION.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('15.2.3. SOME STATES DO NOT ALLOW Wayback Download TO EXCLUDE CERTAIN WARRANTIES. IF THIS APPLIES TO YOU, YOUR WARRANTY IS LIMITED TO NINETY (90) DAYS FROM THE EFFECTIVE DATE.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('15.3. The parties expressly disclaim the applicability of the United Nations Convention on the International Sale of Goods.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('16. Limitation of Liability')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('16.1. YOU ALSO ACKNOWLEDGE AND ACCEPT THAT ANY DAMAGES WILL BE LIMITED TO NO MORE THAN THE FEES PAID BY YOU FOR ONE (1) MONTH OF SERVICE.')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('16.2. UNDER NO CIRCUMSTANCES, INCLUDING NEGLIGENCE, SHALL Wayback Download, ITS OFFICERS, AGENTS OR THIRD PARTIES PROVIDING SERVICES THROUGH Wayback Download, BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE OR CONSEQUENTIAL DAMAGES WHATSOEVER, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, COST SAVINGS, REVENUE, BUSINESS, DATA OR USE, OR ANY OTHER PECUNIARY LOSS BY YOU, ANY OF YOUR END USERS OR ANY THIRD PARTY; OR THAT RESULTS FROM MISTAKES, OMISSIONS, INTERRUPTIONS, DELETION OF FILES, ERRORS, DEFECTS, DELAYS IN OPERATION, OR TRANSMISSION OR ANY FAILURE OF PERFORMANCE, WHETHER OR NOT LIMITED TO ACTS OF GOD, COMMUNICATION FAILURE, THEFT, DESTRUCTION OR UNAUTHORIZED ACCESS TO Wayback Download RECORDS, PROGRAMS OR SERVICES. YOU AGREE THAT THIS PARAGRAPH APPLIES EVEN IF Wayback Download HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. YOU HEREBY ACKNOWLEDGE THAT THIS PARAGRAPH SHALL APPLY TO ALL CONTENTS ON ALL SERVERS AND ALL SERVICES. SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES; YOU AGREE THAT IN THOSE JURISDICTIONS, Wayback Download\'S LIABILITY WILL BE LIMITED TO THE EXTENT PERMITTED BY LAW.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('17. Indemnification')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('17.1. You agree to indemnify, defend and hold harmless Wayback Download, and its parent, subsidiary and affiliated companies, third party service providers and each of their respective officers, directors, employees, shareholders and agents (each an \"indemnified party\" and collectively, \"indemnified parties\") from and against any and all claims, damages, losses. liabilities, suits, actions, demands, proceedings (whether legal or administrative), and expenses (including, but not limited to, reasonable attorneys\' fees) threatened, asserted, or filed by a third party against any of the indemnified parties arising out of, or relating to: (i) your use of the Services; (ii) any violation by you of any of Wayback Download\'s policies; (iii) any breach of any of your representations, warranties or covenants contained in this Agreement; or (iv) any acts or omissions by you. The terms of this section shall survive any termination of this Agreement. For the purpose of this paragraph only, the terms used to designate you include you, your customers, visitors to your website, and users of your products or services the use of which is facilities by Wayback Download.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('18. Governing Law and Disputes')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('18.1. This agreement shall be governed by the laws of Quebec, exclusive of its choice of law principles, and the laws of Canada, as applicable. Exclusive venue for all disputes arising out of or relating to this Agreement shall be the state and federal courts in Montreal,Quebec and each party agrees not to dispute such personal jurisdiction and waives all objections thereto.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('19. Partial Invalidity')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('19.1. If any provision of this Agreement is held to be invalid by a court of competent jurisdiction, then the remaining provisions shall nevertheless remain in full force and effect. Wayback Download and Customer agree to renegotiate any term held invalid and to be bound by mutually agreed substitute provision.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('20. Changes to the Terms of Service')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('20.1. Wayback Download reserves the right to modify this Agreement, in whole or in part, from time-to-time. Wayback Download will provide you with notices of such a change by posting notice on your control panel. Unless Wayback Download is required to make a change in an emergency, any change will be effective thirty (30) days after it is posted. If such a change materially diminishes your ability to use the Services, you may terminate this Agreement. You are encouraged to review the content of this Agreement on a regular basis.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('21. Assignment')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('21.1. This Agreement may be assigned by Wayback Download. It may not be assigned by you. This Agreement shall bind and inure to the benefit of the corporate successors and permitted assigns of the parties.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('22. Force Majeure')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('22.1. Except for the obligation to pay monies due and owing, neither party shall be liable for any delay or failure in performance due to events outside the defaulting party\'s reasonable control, including, without limitation, acts of God, earthquake, labor disputes, shortages of supplies, riots, war, fire, epidemics, failure of telecommunication carriers, or delays of common carriers or other circumstances beyond its reasonable control. The obligations and rights of the excused party shall be extended on a day-to-day basis for the time period equal to the period of the excusable delay. The party affected by such an occurrence shall notify the other party as soon as possible but in no event less than ten (10) days from the beginning of the event.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('23. No Waiver')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('23.1. No waiver of rights under this Agreement or any Wayback Download policy, or agreement between Customer and Wayback Download shall constitute a subsequent waiver of this or any other right under this Agreement.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('24. No Agency')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('24.1. This Agreement does not create any agency, partnership, joint venture, or franchise relationship. Neither party has the right or authority to, and shall not, assume or create any obligation of any nature whatsoever on behalf of the other party or bind the other party in any respect whatsoever.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('25. Survival')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('25.1. The following paragraphs shall survive the termination of this Agreement: 16 through 19, and 25.')
										])),
									A2($elm$html$Html$br, _List_Nil, _List_Nil),
									A2(
									$elm$html$Html$h4,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('26. HIPAA Disclaimer')
												]))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('26.1. We are not \"HIPAA compliant.\" Users are solely responsible for any applicable compliance with federal or state laws governing the privacy and security of personal data, including medical or other sensitive data. Users acknowledge that the Services may not be appropriate for the storage or control of access to sensitive data, such as information about children or medical or health information. Wayback Download does not control or monitor the information or data you store on, or transmit through, our Services. We specifically disclaim any representation or warranty that the Services, as offered, comply with the federal Health Insurance Portability and Accountability Act (\"HIPAA\"). Customers requiring secure storage of \"protected health information\" under HIPAA are expressly prohibited from using this Service for such purposes. Storing and permitting access to \"protected health information,\" as defined under HIPAA is a material violation of this User Agreement, and grounds for immediate account termination. We do not sign \"Business Associate Agreements\" and you agree that Wayback Download is not a Business Associate or subcontractor or agent of yours pursuant to HIPAA. If you have questions about the security of your data, you should '),
											A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$href('mailto:support@wayback.download')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('contact customer support')
												])),
											$elm$html$Html$text('.')
										]))
								]))
						]))
				]))
		]));
var $author$project$Pages$Terms$view = F2(
	function (shared, model) {
		return {
			body: _List_fromArray(
				[
					A7(
					$author$project$Common$Header$viewHeader,
					shared.storage.user,
					'other',
					'',
					$elm$html$Html$text(''),
					$elm$html$Html$text(''),
					$author$project$Pages$Terms$ClickedToggleMenu,
					model.showMenu),
					$author$project$Pages$Terms$viewSection1,
					$author$project$Common$Footer$viewFooter(shared.year)
				]),
			title: 'Terms of Service | Wayback Download'
		};
	});
var $author$project$Pages$Terms$page = F2(
	function (shared, _v0) {
		return $author$project$Page$element(
			{
				init: $author$project$Pages$Terms$init,
				subscriptions: function (_v1) {
					return $elm$core$Platform$Sub$none;
				},
				update: $author$project$Pages$Terms$update,
				view: $author$project$Pages$Terms$view(shared)
			});
	});
var $author$project$Gen$Pages$pages = {
	about: A3($author$project$Gen$Pages$bundle, $author$project$Pages$About$page, $author$project$Gen$Model$About, $author$project$Gen$Msg$About),
	admin: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Admin$page, $author$project$Gen$Model$Admin, $author$project$Gen$Msg$Admin),
	admin__update__id_: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Admin$Update$Id_$page, $author$project$Gen$Model$Admin__Update__Id_, $author$project$Gen$Msg$Admin__Update__Id_),
	contact: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Contact$page, $author$project$Gen$Model$Contact, $author$project$Gen$Msg$Contact),
	dashboard: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Dashboard$page, $author$project$Gen$Model$Dashboard, $author$project$Gen$Msg$Dashboard),
	forgotPassword: A3($author$project$Gen$Pages$bundle, $author$project$Pages$ForgotPassword$page, $author$project$Gen$Model$ForgotPassword, $author$project$Gen$Msg$ForgotPassword),
	forgotPassword__username_: A3($author$project$Gen$Pages$bundle, $author$project$Pages$ForgotPassword$Username_$page, $author$project$Gen$Model$ForgotPassword__Username_, $author$project$Gen$Msg$ForgotPassword__Username_),
	home_: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Home_$page, $author$project$Gen$Model$Home_, $author$project$Gen$Msg$Home_),
	knowledgebase: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Knowledgebase$page, $author$project$Gen$Model$Knowledgebase, $author$project$Gen$Msg$Knowledgebase),
	login: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Login$page, $author$project$Gen$Model$Login, $author$project$Gen$Msg$Login),
	logout: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Logout$page, $author$project$Gen$Model$Logout, $author$project$Gen$Msg$Logout),
	notFound: A3($author$project$Gen$Pages$bundle, $author$project$Pages$NotFound$page, $author$project$Gen$Model$NotFound, $author$project$Gen$Msg$NotFound),
	order: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Order$page, $author$project$Gen$Model$Order, $author$project$Gen$Msg$Order),
	privacy: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Privacy$page, $author$project$Gen$Model$Privacy, $author$project$Gen$Msg$Privacy),
	signup: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Signup$page, $author$project$Gen$Model$Signup, $author$project$Gen$Msg$Signup),
	subscription: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Subscription$page, $author$project$Gen$Model$Subscription, $author$project$Gen$Msg$Subscription),
	success__id_: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Success$Id_$page, $author$project$Gen$Model$Success__Id_, $author$project$Gen$Msg$Success__Id_),
	terms: A3($author$project$Gen$Pages$bundle, $author$project$Pages$Terms$page, $author$project$Gen$Model$Terms, $author$project$Gen$Msg$Terms)
};
var $author$project$Gen$Pages$init = function (route) {
	switch (route.$) {
		case 'About':
			return $author$project$Gen$Pages$pages.about.init(_Utils_Tuple0);
		case 'Admin':
			return $author$project$Gen$Pages$pages.admin.init(_Utils_Tuple0);
		case 'Contact':
			return $author$project$Gen$Pages$pages.contact.init(_Utils_Tuple0);
		case 'Dashboard':
			return $author$project$Gen$Pages$pages.dashboard.init(_Utils_Tuple0);
		case 'ForgotPassword':
			return $author$project$Gen$Pages$pages.forgotPassword.init(_Utils_Tuple0);
		case 'Home_':
			return $author$project$Gen$Pages$pages.home_.init(_Utils_Tuple0);
		case 'Knowledgebase':
			return $author$project$Gen$Pages$pages.knowledgebase.init(_Utils_Tuple0);
		case 'Login':
			return $author$project$Gen$Pages$pages.login.init(_Utils_Tuple0);
		case 'Logout':
			return $author$project$Gen$Pages$pages.logout.init(_Utils_Tuple0);
		case 'NotFound':
			return $author$project$Gen$Pages$pages.notFound.init(_Utils_Tuple0);
		case 'Order':
			return $author$project$Gen$Pages$pages.order.init(_Utils_Tuple0);
		case 'Privacy':
			return $author$project$Gen$Pages$pages.privacy.init(_Utils_Tuple0);
		case 'Signup':
			return $author$project$Gen$Pages$pages.signup.init(_Utils_Tuple0);
		case 'Subscription':
			return $author$project$Gen$Pages$pages.subscription.init(_Utils_Tuple0);
		case 'Terms':
			return $author$project$Gen$Pages$pages.terms.init(_Utils_Tuple0);
		case 'Admin__Update__Id_':
			var params = route.a;
			return $author$project$Gen$Pages$pages.admin__update__id_.init(params);
		case 'ForgotPassword__Username_':
			var params = route.a;
			return $author$project$Gen$Pages$pages.forgotPassword__username_.init(params);
		default:
			var params = route.a;
			return $author$project$Gen$Pages$pages.success__id_.init(params);
	}
};
var $author$project$Shared$Model = F4(
	function (year, storage, message, env) {
		return {env: env, message: message, storage: storage, year: year};
	});
var $author$project$Shared$Flags_ = F2(
	function (year, storage) {
		return {storage: storage, year: year};
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $author$project$Shared$flagDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'storage',
	$elm$json$Json$Decode$value,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'year',
		$elm$json$Json$Decode$int,
		$elm$json$Json$Decode$succeed($author$project$Shared$Flags_)));
var $author$project$Environment$EnvironmentVar = F4(
	function (serverUrl, itemCost, multiItemCost, subscriptionCost) {
		return {itemCost: itemCost, multiItemCost: multiItemCost, serverUrl: serverUrl, subscriptionCost: subscriptionCost};
	});
var $author$project$Environment$devHost = '0.0.0.0';
var $author$project$Environment$init = function (host) {
	return _Utils_eq(host, $author$project$Environment$devHost) ? A4($author$project$Environment$EnvironmentVar, 'http://0.0.0.0:5000', 19, 12, 95) : A4($author$project$Environment$EnvironmentVar, 'https://api.wayback.download', 19, 12, 95);
};
var $author$project$Storage$init = {
	cart: $author$project$Proto$Response$Cart(_List_Nil),
	user: $elm$core$Maybe$Nothing
};
var $author$project$Storage$Storage = F2(
	function (cart, user) {
		return {cart: cart, user: user};
	});
var $author$project$Storage$cartItemDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'domain',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'timestamp',
		$elm$json$Json$Decode$string,
		$elm$json$Json$Decode$succeed($author$project$Proto$Response$CartItem)));
var $author$project$Storage$cartDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'items',
	$elm$json$Json$Decode$list($author$project$Storage$cartItemDecoder),
	$elm$json$Json$Decode$succeed($author$project$Proto$Response$Cart));
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Domain$User$userDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'admin',
	$elm$json$Json$Decode$bool,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'subscribed',
		$elm$json$Json$Decode$bool,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'token',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed($author$project$Domain$User$User))));
var $author$project$Storage$storageDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'user',
	$elm$json$Json$Decode$nullable($author$project$Domain$User$userDecoder),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'cart',
		$author$project$Storage$cartDecoder,
		$elm$json$Json$Decode$succeed($author$project$Storage$Storage)));
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (result.$ === 'Ok') {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Storage$storageFromJson = function (json) {
	return A2(
		$elm$core$Result$withDefault,
		$author$project$Storage$init,
		A2($elm$json$Json$Decode$decodeValue, $author$project$Storage$storageDecoder, json));
};
var $author$project$Shared$init = F2(
	function (req, flags) {
		var model = function () {
			var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$Shared$flagDecoder, flags);
			if (_v0.$ === 'Ok') {
				var obj = _v0.a;
				return A4(
					$author$project$Shared$Model,
					obj.year,
					$author$project$Storage$storageFromJson(obj.storage),
					'',
					$author$project$Environment$init(req.url.host));
			} else {
				return A4(
					$author$project$Shared$Model,
					2022,
					$author$project$Storage$init,
					'',
					$author$project$Environment$init(req.url.host));
			}
		}();
		return _Utils_Tuple2(
			model,
			((!_Utils_eq(model.storage.user, $elm$core$Maybe$Nothing)) && _Utils_eq(req.route, $author$project$Gen$Route$Login)) ? A2($author$project$Request$replaceRoute, $author$project$Gen$Route$Dashboard, req) : (_Utils_eq(req.route, $author$project$Gen$Route$Logout) ? A2($author$project$Request$replaceRoute, $author$project$Gen$Route$Login, req) : $elm$core$Platform$Cmd$none));
	});
var $author$project$Effect$toCmd = F2(
	function (_v0, effect) {
		var fromSharedMsg = _v0.a;
		var fromPageMsg = _v0.b;
		switch (effect.$) {
			case 'None':
				return $elm$core$Platform$Cmd$none;
			case 'Cmd':
				var cmd = effect.a;
				return A2($elm$core$Platform$Cmd$map, fromPageMsg, cmd);
			case 'Shared':
				var msg = effect.a;
				return A2(
					$elm$core$Task$perform,
					fromSharedMsg,
					$elm$core$Task$succeed(msg));
			default:
				var list = effect.a;
				return $elm$core$Platform$Cmd$batch(
					A2(
						$elm$core$List$map,
						$author$project$Effect$toCmd(
							_Utils_Tuple2(fromSharedMsg, fromPageMsg)),
						list));
		}
	});
var $author$project$Main$init = F3(
	function (flags, url, key) {
		var _v0 = A2(
			$author$project$Shared$init,
			A3($author$project$Request$create, _Utils_Tuple0, url, key),
			flags);
		var shared = _v0.a;
		var sharedCmd = _v0.b;
		var _v1 = A4(
			$author$project$Gen$Pages$init,
			$author$project$Gen$Route$fromUrl(url),
			shared,
			url,
			key);
		var page = _v1.a;
		var effect = _v1.b;
		return _Utils_Tuple2(
			A4($author$project$Main$Model, url, key, shared, page),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						A2($elm$core$Platform$Cmd$map, $author$project$Main$Shared, sharedCmd),
						A2(
						$author$project$Effect$toCmd,
						_Utils_Tuple2($author$project$Main$Shared, $author$project$Main$Page),
						effect)
					])));
	});
var $author$project$Gen$Pages$subscriptions = function (model_) {
	switch (model_.$) {
		case 'Redirecting_':
			return F3(
				function (_v1, _v2, _v3) {
					return $elm$core$Platform$Sub$none;
				});
		case 'About':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.about.subscriptions, params, model);
		case 'Admin':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.admin.subscriptions, params, model);
		case 'Contact':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.contact.subscriptions, params, model);
		case 'Dashboard':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.dashboard.subscriptions, params, model);
		case 'ForgotPassword':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.forgotPassword.subscriptions, params, model);
		case 'Home_':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.home_.subscriptions, params, model);
		case 'Knowledgebase':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.knowledgebase.subscriptions, params, model);
		case 'Login':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.login.subscriptions, params, model);
		case 'Logout':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.logout.subscriptions, params, model);
		case 'NotFound':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.notFound.subscriptions, params, model);
		case 'Order':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.order.subscriptions, params, model);
		case 'Privacy':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.privacy.subscriptions, params, model);
		case 'Signup':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.signup.subscriptions, params, model);
		case 'Subscription':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.subscription.subscriptions, params, model);
		case 'Terms':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.terms.subscriptions, params, model);
		case 'Admin__Update__Id_':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.admin__update__id_.subscriptions, params, model);
		case 'ForgotPassword__Username_':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.forgotPassword__username_.subscriptions, params, model);
		default:
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.success__id_.subscriptions, params, model);
	}
};
var $author$project$Shared$StorageUpdated = function (a) {
	return {$: 'StorageUpdated', a: a};
};
var $author$project$Storage$load = _Platform_incomingPort('load', $elm$json$Json$Decode$value);
var $author$project$Storage$onChange = function (fromStorage) {
	return $author$project$Storage$load(
		function (json) {
			return fromStorage(
				$author$project$Storage$storageFromJson(json));
		});
};
var $author$project$Shared$subscriptions = F2(
	function (_v0, _v1) {
		return $author$project$Storage$onChange($author$project$Shared$StorageUpdated);
	});
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$Page,
				A4($author$project$Gen$Pages$subscriptions, model.page, model.shared, model.url, model.key)),
				A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$Shared,
				A2(
					$author$project$Shared$subscriptions,
					A3($author$project$Request$create, _Utils_Tuple0, model.url, model.key),
					model.shared))
			]));
};
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 'Nothing') {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 'Nothing') {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.protocol;
		if (_v0.$ === 'Http') {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.fragment,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.query,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.port_,
					_Utils_ap(http, url.host)),
				url.path)));
};
var $author$project$Gen$Pages$update = F2(
	function (msg_, model_) {
		var _v0 = _Utils_Tuple2(msg_, model_);
		_v0$18:
		while (true) {
			switch (_v0.a.$) {
				case 'About':
					if (_v0.b.$ === 'About') {
						var msg = _v0.a.a;
						var _v1 = _v0.b;
						var params = _v1.a;
						var model = _v1.b;
						return A3($author$project$Gen$Pages$pages.about.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'Admin':
					if (_v0.b.$ === 'Admin') {
						var msg = _v0.a.a;
						var _v2 = _v0.b;
						var params = _v2.a;
						var model = _v2.b;
						return A3($author$project$Gen$Pages$pages.admin.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'Contact':
					if (_v0.b.$ === 'Contact') {
						var msg = _v0.a.a;
						var _v3 = _v0.b;
						var params = _v3.a;
						var model = _v3.b;
						return A3($author$project$Gen$Pages$pages.contact.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'Dashboard':
					if (_v0.b.$ === 'Dashboard') {
						var msg = _v0.a.a;
						var _v4 = _v0.b;
						var params = _v4.a;
						var model = _v4.b;
						return A3($author$project$Gen$Pages$pages.dashboard.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'ForgotPassword':
					if (_v0.b.$ === 'ForgotPassword') {
						var msg = _v0.a.a;
						var _v5 = _v0.b;
						var params = _v5.a;
						var model = _v5.b;
						return A3($author$project$Gen$Pages$pages.forgotPassword.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'Home_':
					if (_v0.b.$ === 'Home_') {
						var msg = _v0.a.a;
						var _v6 = _v0.b;
						var params = _v6.a;
						var model = _v6.b;
						return A3($author$project$Gen$Pages$pages.home_.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'Knowledgebase':
					if (_v0.b.$ === 'Knowledgebase') {
						var msg = _v0.a.a;
						var _v7 = _v0.b;
						var params = _v7.a;
						var model = _v7.b;
						return A3($author$project$Gen$Pages$pages.knowledgebase.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'Login':
					if (_v0.b.$ === 'Login') {
						var msg = _v0.a.a;
						var _v8 = _v0.b;
						var params = _v8.a;
						var model = _v8.b;
						return A3($author$project$Gen$Pages$pages.login.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'Logout':
					if (_v0.b.$ === 'Logout') {
						var msg = _v0.a.a;
						var _v9 = _v0.b;
						var params = _v9.a;
						var model = _v9.b;
						return A3($author$project$Gen$Pages$pages.logout.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'NotFound':
					if (_v0.b.$ === 'NotFound') {
						var msg = _v0.a.a;
						var _v10 = _v0.b;
						var params = _v10.a;
						var model = _v10.b;
						return A3($author$project$Gen$Pages$pages.notFound.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'Order':
					if (_v0.b.$ === 'Order') {
						var msg = _v0.a.a;
						var _v11 = _v0.b;
						var params = _v11.a;
						var model = _v11.b;
						return A3($author$project$Gen$Pages$pages.order.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'Privacy':
					if (_v0.b.$ === 'Privacy') {
						var msg = _v0.a.a;
						var _v12 = _v0.b;
						var params = _v12.a;
						var model = _v12.b;
						return A3($author$project$Gen$Pages$pages.privacy.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'Signup':
					if (_v0.b.$ === 'Signup') {
						var msg = _v0.a.a;
						var _v13 = _v0.b;
						var params = _v13.a;
						var model = _v13.b;
						return A3($author$project$Gen$Pages$pages.signup.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'Subscription':
					if (_v0.b.$ === 'Subscription') {
						var msg = _v0.a.a;
						var _v14 = _v0.b;
						var params = _v14.a;
						var model = _v14.b;
						return A3($author$project$Gen$Pages$pages.subscription.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'Terms':
					if (_v0.b.$ === 'Terms') {
						var msg = _v0.a.a;
						var _v15 = _v0.b;
						var params = _v15.a;
						var model = _v15.b;
						return A3($author$project$Gen$Pages$pages.terms.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'Admin__Update__Id_':
					if (_v0.b.$ === 'Admin__Update__Id_') {
						var msg = _v0.a.a;
						var _v16 = _v0.b;
						var params = _v16.a;
						var model = _v16.b;
						return A3($author$project$Gen$Pages$pages.admin__update__id_.update, params, msg, model);
					} else {
						break _v0$18;
					}
				case 'ForgotPassword__Username_':
					if (_v0.b.$ === 'ForgotPassword__Username_') {
						var msg = _v0.a.a;
						var _v17 = _v0.b;
						var params = _v17.a;
						var model = _v17.b;
						return A3($author$project$Gen$Pages$pages.forgotPassword__username_.update, params, msg, model);
					} else {
						break _v0$18;
					}
				default:
					if (_v0.b.$ === 'Success__Id_') {
						var msg = _v0.a.a;
						var _v18 = _v0.b;
						var params = _v18.a;
						var model = _v18.b;
						return A3($author$project$Gen$Pages$pages.success__id_.update, params, msg, model);
					} else {
						break _v0$18;
					}
			}
		}
		return F3(
			function (_v19, _v20, _v21) {
				return _Utils_Tuple2(model_, $author$project$Effect$none);
			});
	});
var $author$project$Request$pushRoute = F2(
	function (route, req) {
		return A2(
			$elm$browser$Browser$Navigation$pushUrl,
			req.key,
			$author$project$Gen$Route$toHref(route));
	});
var $author$project$Shared$update = F3(
	function (req, msg, model) {
		if (msg.$ === 'Receive') {
			var message = msg.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{message: message}),
				$elm$core$Platform$Cmd$none);
		} else {
			var storage = msg.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{storage: storage}),
				_Utils_eq($author$project$Gen$Route$Login, req.route) ? A2($author$project$Request$pushRoute, $author$project$Gen$Route$Dashboard, req) : $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'ClickedLink':
				if (msg.a.$ === 'Internal') {
					var url = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.key,
							$elm$url$Url$toString(url)));
				} else {
					var url = msg.a.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(url));
				}
			case 'ChangedUrl':
				var url = msg.a;
				if (!_Utils_eq(url.path, model.url.path)) {
					var _v1 = A4(
						$author$project$Gen$Pages$init,
						$author$project$Gen$Route$fromUrl(url),
						model.shared,
						url,
						model.key);
					var page = _v1.a;
					var effect = _v1.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{page: page, url: url}),
						A2(
							$author$project$Effect$toCmd,
							_Utils_Tuple2($author$project$Main$Shared, $author$project$Main$Page),
							effect));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{url: url}),
						$elm$core$Platform$Cmd$none);
				}
			case 'Shared':
				var sharedMsg = msg.a;
				var _v2 = A3(
					$author$project$Shared$update,
					A3($author$project$Request$create, _Utils_Tuple0, model.url, model.key),
					sharedMsg,
					model.shared);
				var shared = _v2.a;
				var sharedCmd = _v2.b;
				var _v3 = A4(
					$author$project$Gen$Pages$init,
					$author$project$Gen$Route$fromUrl(model.url),
					shared,
					model.url,
					model.key);
				var page = _v3.a;
				var effect = _v3.b;
				return _Utils_eq(page, $author$project$Gen$Model$Redirecting_) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{page: page, shared: shared}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2($elm$core$Platform$Cmd$map, $author$project$Main$Shared, sharedCmd),
								A2(
								$author$project$Effect$toCmd,
								_Utils_Tuple2($author$project$Main$Shared, $author$project$Main$Page),
								effect)
							]))) : _Utils_Tuple2(
					_Utils_update(
						model,
						{shared: shared}),
					A2($elm$core$Platform$Cmd$map, $author$project$Main$Shared, sharedCmd));
			default:
				var pageMsg = msg.a;
				var _v4 = A5($author$project$Gen$Pages$update, pageMsg, model.page, model.shared, model.url, model.key);
				var page = _v4.a;
				var effect = _v4.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{page: page}),
					A2(
						$author$project$Effect$toCmd,
						_Utils_Tuple2($author$project$Main$Shared, $author$project$Main$Page),
						effect));
		}
	});
var $author$project$View$toBrowserDocument = function (view) {
	return {body: view.body, title: view.title};
};
var $author$project$Gen$Pages$view = function (model_) {
	switch (model_.$) {
		case 'Redirecting_':
			return F3(
				function (_v1, _v2, _v3) {
					return $author$project$View$none;
				});
		case 'About':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.about.view, params, model);
		case 'Admin':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.admin.view, params, model);
		case 'Contact':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.contact.view, params, model);
		case 'Dashboard':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.dashboard.view, params, model);
		case 'ForgotPassword':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.forgotPassword.view, params, model);
		case 'Home_':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.home_.view, params, model);
		case 'Knowledgebase':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.knowledgebase.view, params, model);
		case 'Login':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.login.view, params, model);
		case 'Logout':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.logout.view, params, model);
		case 'NotFound':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.notFound.view, params, model);
		case 'Order':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.order.view, params, model);
		case 'Privacy':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.privacy.view, params, model);
		case 'Signup':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.signup.view, params, model);
		case 'Subscription':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.subscription.view, params, model);
		case 'Terms':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.terms.view, params, model);
		case 'Admin__Update__Id_':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.admin__update__id_.view, params, model);
		case 'ForgotPassword__Username_':
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.forgotPassword__username_.view, params, model);
		default:
			var params = model_.a;
			var model = model_.b;
			return A2($author$project$Gen$Pages$pages.success__id_.view, params, model);
	}
};
var $author$project$Main$view = function (model) {
	return $author$project$View$toBrowserDocument(
		A2(
			$author$project$View$map,
			$author$project$Main$Page,
			A4($author$project$Gen$Pages$view, model.page, model.shared, model.url, model.key)));
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{init: $author$project$Main$init, onUrlChange: $author$project$Main$ChangedUrl, onUrlRequest: $author$project$Main$ClickedLink, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)({"versions":{"elm":"0.19.1"},"types":{"message":"Main.Msg","aliases":{"Gen.Pages.Msg":{"args":[],"type":"Gen.Msg.Msg"},"Url.Url":{"args":[],"type":"{ protocol : Url.Protocol, host : String.String, port_ : Maybe.Maybe Basics.Int, path : String.String, query : Maybe.Maybe String.String, fragment : Maybe.Maybe String.String }"},"Proto.Response.Cart":{"args":[],"type":"{ items : List.List Proto.Response.CartItem }"},"Proto.Response.CartItem":{"args":[],"type":"{ timestamp : String.String, domain : String.String }"},"Storage.Storage":{"args":[],"type":"{ cart : Proto.Response.Cart, user : Maybe.Maybe Domain.User.User }"},"Domain.User.User":{"args":[],"type":"{ token : String.String, subscribed : Basics.Bool, admin : Basics.Bool }"},"Proto.Response.Data":{"args":[],"type":"{ user : Maybe.Maybe Proto.Response.User, id : String.String, url : String.String, info : String.String, receipts : List.List Proto.Response.Receipt, restores : List.List Proto.Response.Restore, restore : Maybe.Maybe Proto.Response.Restore }"},"Proto.Response.Receipt":{"args":[],"type":"{ id : String.String, url : String.String, date : String.String, amount : String.String }"},"Proto.Response.Response":{"args":[],"type":"{ error : String.String, status : Proto.Response.Status, data : Maybe.Maybe Proto.Response.Data }"},"Common.Response.Restore":{"args":[],"type":"{ id : String.String, timestamp : String.String, domain : String.String, status : String.String, s3Url : String.String, transactDate : String.String, username : String.String, email : String.String }"},"Proto.Response.Restore":{"args":[],"type":"{ id : String.String, timestamp : String.String, domain : String.String, status : String.String, s3Url : String.String, transactDate : String.String, username : String.String, email : String.String }"},"Proto.Response.User":{"args":[],"type":"{ token : String.String, subscribed : Basics.Bool, admin : Basics.Bool }"}},"unions":{"Main.Msg":{"args":[],"tags":{"ChangedUrl":["Url.Url"],"ClickedLink":["Browser.UrlRequest"],"Shared":["Shared.Msg"],"Page":["Gen.Pages.Msg"]}},"Basics.Int":{"args":[],"tags":{"Int":[]}},"Maybe.Maybe":{"args":["a"],"tags":{"Just":["a"],"Nothing":[]}},"Gen.Msg.Msg":{"args":[],"tags":{"About":["Pages.About.Msg"],"Admin":["Pages.Admin.Msg"],"Contact":["Pages.Contact.Msg"],"Dashboard":["Pages.Dashboard.Msg"],"ForgotPassword":["Pages.ForgotPassword.Msg"],"Home_":["Pages.Home_.Msg"],"Knowledgebase":["Pages.Knowledgebase.Msg"],"Login":["Pages.Login.Msg"],"Logout":["Pages.Logout.Msg"],"NotFound":["Pages.NotFound.Msg"],"Order":["Pages.Order.Msg"],"Privacy":["Pages.Privacy.Msg"],"Signup":["Pages.Signup.Msg"],"Subscription":["Pages.Subscription.Msg"],"Terms":["Pages.Terms.Msg"],"Admin__Update__Id_":["Pages.Admin.Update.Id_.Msg"],"ForgotPassword__Username_":["Pages.ForgotPassword.Username_.Msg"],"Success__Id_":["Pages.Success.Id_.Msg"]}},"Shared.Msg":{"args":[],"tags":{"Receive":["String.String"],"StorageUpdated":["Storage.Storage"]}},"Url.Protocol":{"args":[],"tags":{"Http":[],"Https":[]}},"String.String":{"args":[],"tags":{"String":[]}},"Browser.UrlRequest":{"args":[],"tags":{"Internal":["Url.Url"],"External":["String.String"]}},"Basics.Bool":{"args":[],"tags":{"True":[],"False":[]}},"List.List":{"args":["a"],"tags":{}},"Pages.About.Msg":{"args":[],"tags":{"ClickedToggleMenu":[]}},"Pages.Admin.Msg":{"args":[],"tags":{"OrderResp":["Result.Result Http.Error Proto.Response.Response"],"QueueResp":["Result.Result Http.Error Proto.Response.Response"],"ChangeDomain":["String.String"],"ChangeTimestamp":["String.String"],"ChangeRestoreID":["String.String"],"ChangeEmail":["String.String"],"ChangeAction":["String.String"],"ChangeMethod":["String.String"],"ClickedQueue":[],"ClickedQueueOrders":["Common.Response.Restore"],"ClickedResend":["Common.Response.Restore"],"ClickedClear":[],"ClickedRefresh":[],"ChangeSearch":["String.String"],"ClickedPageNum":["Basics.Int"],"ClickedNextPage":[],"ClickedPrevPage":[],"ClickedToggleMenu":[]}},"Pages.Admin.Update.Id_.Msg":{"args":[],"tags":{"RestoreResp":["Result.Result Http.Error Proto.Response.Response"],"UpdateResp":["Result.Result Http.Error Proto.Response.Response"],"ClickedUpdate":[],"ChangedSelect":["String.String"],"ChangeS3URL":["String.String"],"ChangeEmail":["String.String"],"ChangeDomain":["String.String"],"ChangeTimestamp":["String.String"],"ClickedToggleMenu":[]}},"Pages.Contact.Msg":{"args":[],"tags":{"ClickedSend":[],"NameChange":["String.String"],"EmailChange":["String.String"],"MessageChange":["String.String"],"ReceivedCaptcha":["String.String"],"FormSentResp":["Result.Result Http.Error Proto.Response.Response"],"ClickedToggleMenu":[]}},"Pages.Dashboard.Msg":{"args":[],"tags":{"RestoreResp":["Result.Result Http.Error Proto.Response.Response"],"ReceiptResp":["Result.Result Http.Error Proto.Response.Response"],"ChangeSearchRestore":["String.String"],"ClickedPageNumRestore":["Basics.Int"],"ClickedNextPageRestore":[],"ClickedPrevPageRestore":[],"ChangeSearchReceipt":["String.String"],"ClickedPageNumReceipt":["Basics.Int"],"ClickedNextPageReceipt":[],"ClickedPrevPageReceipt":[],"ClickedToggleMenu":[]}},"Pages.ForgotPassword.Msg":{"args":[],"tags":{"ClickedReset":[],"ChangeUsername":["String.String"],"ReceivedCaptcha":["String.String"],"FormSentResp":["Result.Result Http.Error Proto.Response.Response"],"ClickedToggleMenu":[]}},"Pages.ForgotPassword.Username_.Msg":{"args":[],"tags":{"ClickedConfirm":[],"ChangePassword":["String.String"],"ChangeToken":["String.String"],"ReceivedCaptcha":["String.String"],"FormSentResp":["Result.Result Http.Error Proto.Response.Response"],"ClickedToggleMenu":[]}},"Pages.Home_.Msg":{"args":[],"tags":{"ClickedRestore":[],"ClickedCheckout":[],"ClickedOrderNow":[],"KeyDown":["Basics.Int"],"ClickedExit":[],"ChangeWaybackUrl":["String.String"],"ChangeDomain":["String.String"],"CheckoutResp":["Result.Result Http.Error Proto.Response.Response"],"ClickedToggleMenu":[]}},"Pages.Knowledgebase.Msg":{"args":[],"tags":{"ClickedToggleMenu":[]}},"Pages.Login.Msg":{"args":[],"tags":{"ClickedLogin":[],"ChangeUsername":["String.String"],"ChangePassword":["String.String"],"ReceivedCaptcha":["String.String"],"FormSentResp":["Result.Result Http.Error Proto.Response.Response"],"ClickedToggleMenu":[]}},"Pages.Logout.Msg":{"args":[],"tags":{"NoOp":[]}},"Pages.NotFound.Msg":{"args":[],"tags":{"ClickedToggleMenu":[]}},"Pages.Order.Msg":{"args":[],"tags":{"ChangeUrl":["String.String"],"ClickedAddToCart":[],"ClickedRemoveFromCart":["Proto.Response.CartItem"],"ClickedCheckout":[],"ClickedRestore":[],"ProcessResp":["Result.Result Http.Error Proto.Response.Response"],"CheckoutResp":["Result.Result Http.Error Proto.Response.Response"],"UserResp":["Result.Result Http.Error Proto.Response.Response"],"ClickedToggleMenu":[]}},"Pages.Privacy.Msg":{"args":[],"tags":{"ClickedToggleMenu":[]}},"Pages.Signup.Msg":{"args":[],"tags":{"ClickedRegister":[],"ChangeUsername":["String.String"],"ChangeEmail":["String.String"],"ChangePassword":["String.String"],"FormSentResp":["Result.Result Http.Error Proto.Response.Response"],"ReceivedCaptcha":["String.String"],"ClickedToggleMenu":[]}},"Pages.Subscription.Msg":{"args":[],"tags":{"ClickedSubscribeNow":[],"ClickedManageSubscription":[],"ServerResp":["Result.Result Http.Error Proto.Response.Response"],"UserResp":["Result.Result Http.Error Proto.Response.Response"],"ClickedToggleMenu":[]}},"Pages.Success.Id_.Msg":{"args":[],"tags":{"RestoreResp":["Result.Result Http.Error Proto.Response.Response"],"ClickedToggleMenu":[]}},"Pages.Terms.Msg":{"args":[],"tags":{"ClickedToggleMenu":[]}},"Http.Error":{"args":[],"tags":{"BadUrl":["String.String"],"Timeout":[],"NetworkError":[],"BadStatus":["Basics.Int"],"BadBody":["String.String"]}},"Result.Result":{"args":["error","value"],"tags":{"Ok":["value"],"Err":["error"]}},"Proto.Response.Status":{"args":[],"tags":{"Status_SUCCESS":[],"Status_FAILED":[],"StatusUnrecognized_":["Basics.Int"]}}}}})}});}(this));