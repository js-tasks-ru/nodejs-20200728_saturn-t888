function sum (a, b) {
	if (!a || !b) {
		console.log ('Two numbers required!');
		return;
	}
	try {
		if ( (typeof (a) !== 'number' || isNaN (a)) || (typeof (b) !== 'number' || isNaN (b)) ) {
			throw new TypeError;
		}
	} catch (err) {
		console.log (err.name);
	}

	return (a + b)	;
}

module.exports = sum;
