digit = 5;
k_constant = 3826;

alphabet = "A 2 B 3 C 4 D 5 E 6 F 7 G 8 H 9 J K L M N P Q R S T U V W X Y Z";
alphabet = alphabet.split(" ");
// console.log(alphabet)

alphabetmap = {};
for (var i = 0; i < alphabet.length; i++) {
	alphabetmap[alphabet[i]] = i;
};
// console.log(alphabetmap)

function to32(num) {
	if (num < 0) {
		return "";
	};

	num = parseInt(num);
	num32 = "";
	while(parseInt(num / 32) > 0) {
		num32 = alphabet[num % 32] + num32;
		num = parseInt(num / 32);
	};
	num32 = alphabet[num % 32] + num32;
	return num32;
};

function to10(num32) {
	if (!num32) {
		return -1;
	};

	num32 = num32.toUpperCase();
	num = 0;
	for (var i = 0; i < num32.length; i++) {
		num = num + alphabetmap[num32[i]] * Math.pow(32, num32.length-i-1);
	};
		
	return parseInt(num);
};

function calcX(num32) {
	x = 0;
	for (var i = 0; i < num32.length; i++) {
		x = x + to10(num32[i]);
	};
	return to32(x % (alphabet.length - 1));
};

function encode(num) {
	num = num + k_constant;
	num32 = to32(num);

	if (!num32) {
		for (var i = 0; i < digit; i++) {
			num32 = num32 + alphabet[0];
		};
			
		return num32 + alphabet[alphabet.length-1];
	}

	if (num32.length > digit) {
		num32 = ""
		for (var i = 0; i < digit + 1; i++) {
			num32 = num32 + alphabet[alphabet.length-1];
		};	
		return num32;
	}

	while (num32.length < digit) {
		num32 = alphabet[0] + num32;
	}

	num32 = num32 + calcX(num32);
	return num32;
};

function isValid(num32) {
	if (num32.length != (digit + 1)) {
		return false;
	}

	num32 = num32.toUpperCase();
	
	if (num32[num32.length-1] == alphabet[alphabet.length-1]) {
		return false;
	}

	x0 = num32[num32.length-1];
	x = calcX(num32.substr(0, num32.length-1))
	if (x0 != x) {
		return false;
	}

	return true;
};

function decode(num32) {
	if (!isValid(num32)) {
		return -1;
	}

	num32 = num32.substr(0, num32.length-1);
	num = to10(num32) - k_constant;

	return parseInt(num);
};

var coder = {
	"encode":encode,
	"decode":decode,
	"isValid":isValid
}

// console.log(calcX("ASD"));
// console.log(to10(to32(3826)))
// console.log(to32(to10('AAADF')))
// console.log(encode(0))
// console.log(decode(encode(0)))

// console.log(encode(3214347))
// console.log(decode(encode(3214347)))

// console.log(encode(-3826))
// console.log(decode(encode(-3826)))

// console.log(encode(-1323232))
// console.log(decode(encode(-1323232)))

// console.log(encode(33554432-k_constant-1))
// console.log(decode(encode(33554432-k_constant-1)))

// console.log(encode(33554432-k_constant))
// console.log(decode(encode(33554432-k_constant)))

module.exports = coder
