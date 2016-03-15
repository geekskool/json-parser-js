//////////////////////////////////////////////////////
//////         JSON Parser                       /////
//////////////////////////////////////////////////////

var fs = require('fs');
var data = fs.readFileSync('tester.js');
inpStr = data.toString();


function spaceParse(inpStr) {
	var nonwhite =inpStr.search(/\S/);
	if (nonwhite == -1) {
		return "";
	} 
	return inpStr.slice(nonwhite);
}


function boolParse(inpStr) {
	inpStr = spaceParse(inpStr);
	var outpt = {};
	if (inpStr.slice(0,4) == "true") {
		outpt = {out: true, rem: inpStr.substring(4,inpStr.length)};
		if (outpt.rem == "") {
			return outpt.out;
		}
		return outpt;
	}
	if (inpStr.slice(0,5) == "false") {
		outpt = {out: false, rem: inpStr.substring(5,inpStr.length)};
		if (outpt.rem == "") {
			return outpt.out;
		}
		return outpt;
	}
	return null;
}


function nullParse(inpStr) {
	var outpt = {};
	inpStr = spaceParse(inpStr);
	if (inpStr.slice(0,4) == "null") {
		outpt = {out: null, rem: inpStr.substring(4,inpStr.length)};
		if (outpt.rem == "") {
			return outpt.out;
		}
		return outpt;
	}
	return null;
}


function stringParse(inpStr) {
	var outpt = {};
	inpStr = spaceParse(inpStr);
    if (inpStr[0] == '"') {
    	inpStr = inpStr.substring(1,inpStr.length);
    	index_val = inpStr.indexOf('"');
    	inpStr1 = inpStr.substring(0,index_val);
    	outpt = {out: inpStr1, rem: inpStr.substring(index_val+1, inpStr.length)};
    	if (outpt.rem == "") {
    		return outpt.out;
    	}
    	return outpt;
    }
    return null;
}


function numberParse(inpStr) {
	var outpt = {};
	inpStr = spaceParse(inpStr);
	if (match = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/.exec(inpStr)) {
		num_len = match[0].length;
	    var num = parseFloat(match[0]);
	    var d = inpStr.substring(num_len, inpStr.length);
	    outpt = {out: num, rem: inpStr.substring(num_len, inpStr.length)};
	    if (outpt.rem == "") {
	    	return outpt.out;
	    }
	    return outpt;
	}
	return null;
}


function arrayParse(inpStr) {
	var outpt = {};
	inpStr = spaceParse(inpStr);
	var outArr = [];
	var outparsed;
	if (inpStr[0] == "[") {
		inpStr = inpStr.substring(1,inpStr.length);
		while (inpStr[0] != "]") {
			inpStr = spaceParse(inpStr);
			if (inpStr[0] == ",") {
				inpStr = inpStr.slice(1);
			}
			outparsed = parseWay(inpStr);
			outArr.push(outparsed.out);
			inpStr = outparsed.rem;
			inpStr = spaceParse(inpStr);
		}
		outpt = {out: outArr, rem: inpStr.substring(1,inpStr.length)};
		if (outpt.rem == "") {
			return outpt.out;
		}
		return outpt;
	}
	return null;
}


function objectParse(inpStr) {
	var outpt = {};
	var key;
	inpStr = spaceParse(inpStr);
	var outArrObj = {};
	if (inpStr[0] == "{") {
		inpStr = inpStr.substring(1,inpStr.length);
		while (inpStr[0] != "}") {
			inpStr = spaceParse(inpStr);
			if (inpStr[0] == ",") {
				inpStr = inpStr.slice(1);
			}
          	key = stringParse(inpStr);
 			inpStr = spaceParse(key.rem);
            if (inpStr[0] == ":") {
            	inpStr = inpStr.slice(1);
            }
            value = parseWay(inpStr);
            inpStr = spaceParse(value.rem);
 			outArrObj[key.out] = value.out;
 		}
 		outpt = {out: outArrObj, rem: inpStr.slice(1)};
 		if (outpt.rem == "") {
 			return outpt.out;
 		}
 		return outpt;
 	}
 	return null;
}


function parseWay(inpStr) {
	var parsedOut;
	if (parsedOut = boolParse(inpStr)) {
		return parsedOut;
	}
	if (parsedOut = nullParse(inpStr)) {
		return parsedOut;
	}
	if (parsedOut = numberParse(inpStr)) {
		return parsedOut;
	}
	if (parsedOut = stringParse(inpStr)) {
		return parsedOut;
	}
	if (parsedOut = arrayParse(inpStr)) {
		return parsedOut;
	}
	if (parsedOut = objectParse(inpStr)) {
		return parsedOut;
	}
	return null;
}


console.log(JSON.stringify(parseWay(inpStr),null,2));
//JSON.stringify(jsonParser(data),null,2));

