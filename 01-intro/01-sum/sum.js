function sum (a, b) {
	if (!a || !b) {
		console.log ('Two numbers required!');
		return;
	}
	
	if ( (typeof (a) !== 'number' || isNaN (a)) || (typeof (b) !== 'number' || isNaN (b)) ) throw new TypeError;
	
	return (a + b);
}

module.exports = sum;
