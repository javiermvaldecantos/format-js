var format = require('./format.js');

test('Credit cards are formatted properly', function() {
    expect(format.toCreditCardNumber('340000000000009','amex')).toBe('3400 000000 00009');
    expect(format.toCreditCardNumber('4111111111111111','visa')).toBe('4111 1111 1111 1111');
    expect(format.toCreditCardNumber('4242424242424242','visa')).toBe('4242 4242 4242 4242');
    expect(format.toCreditCardNumber('5500000000000004','mc')).toBe('5500 0000 0000 0004');
    expect(format.toCreditCardNumber('6011000000000004','discover')).toBe('6011 0000 0000 0004');
});

test('Dates are formatted properly', function () {
    expect(format.toDate(1, 1, 1960, {})).toBe("01/01/1960");
    expect(format.toDate(5, 6, 1960, {})).toBe("05/06/1960");
    expect(format.toDate(31, 1, 1960, {})).toBe("31/01/1960");
    expect(format.toDate(1, 11, 1960, {})).toBe("01/11/1960");

    expect(format.toDate(1, 11, 1960, {ISOformat: true})).toBe("1960-11-01");

    expect(format.toDate(1, 1, 1960, {country: "us"})).toBe("01/01/1960");
    expect(format.toDate(5, 6, 1960, {country: "us"})).toBe("06/05/1960");
    expect(format.toDate(31, 1, 1960, {country: "us"})).toBe("01/31/1960");
    expect(format.toDate(1, 11, 1960, {country: "us"})).toBe("11/01/1960");
});

test('Phone numbers are formatted properly', function() {
    expect(format.toPhoneNumber('1234567890', {country: ''})).toBe('1234567890');
    expect(format.toPhoneNumber('1234567890', {country: 'us'})).toBe('(123) 456-7890');
    expect(format.toPhoneNumber('312 000 0000', {country: ''})).toBe('312 000 0000');
    expect(format.toPhoneNumber('312 000 0000', {country: 'us'})).toBe('(312) 000-0000');
    expect(format.toPhoneNumber('', {country: 'us'})).toBe('(');
    expect(format.toPhoneNumber('', {country: 'us', addBlanks: true})).toBe('(___) ___-____');
    expect(format.toPhoneNumber('888', {country: 'ca'})).toBe('(888) ');
    expect(format.toPhoneNumber('888', {country: 'ca', addBlanks: true})).toBe('(888) ___-____');
});
