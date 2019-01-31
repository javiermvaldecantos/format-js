var format = (function () {

    /**
     * Rules for credit card number, including max length and format
     */
    var _creditCardRules = {
        'amex': {    // American Express: XXXX XXXXXX XXXXX (17 characters including spaces)
            format: /^(\d{1,4})(\d{0,6})(\d{0,5})$/,    // with this regex we can, at least, get the chunks of the amex format.
            maxLength: 17,                              // Unfortunately we also get the whole card number in the match, so we'll have to remove it.
            maxLengthWithoutSpaces: 15
        },
        'laser': {   // Laser cards are not in use since 2014 (i.e. we could remove this one)
            format: /\d{1,4}/g, maxLength: 24, maxLengthWithoutSpaces: 20
        },
        'visa': {    // Visa: XXXX XXXX XXXX XXXX (19 characters including spaces)
            format: /\d{1,4}/g, maxLength: 19, maxLengthWithoutSpaces: 16
        },
        'mc': {      // MasterCard: XXXX XXXX XXXX XXXX (19 characters including spaces)
            format: /\d{1,4}/g, maxLength: 19, maxLengthWithoutSpaces: 16
        },
        'maestro': { // Maestro: XXXX XXXX XXXX XXXX XXXX (24 characters including spaces)
            format: /\d{1,4}/g, maxLength: 24, maxLengthWithoutSpaces: 20
        },
        'discover': {// Discover: XXXX XXXX XXXX XXXX (19 characters including spaces)
            format: /\d{1,4}/g, maxLength: 19, maxLengthWithoutSpaces: 16
        },
        'default': { // Default case: XXXX XXXX XXXX XXXX XXX (23 characters including spaces)
            format: /\d{1,4}/g, maxLength: 23, maxLengthWithoutSpaces: 19
        }
    }

    /**
     * toCreditCardNumber
     *
     * Formats a credit card number depending on the card type. This function uses the _creditCardRules variable.
     * @param cardNumber: Card number to be formatted, for example "4242424242424242" or "4242 4242 4242 4242"
     * @param cardType: Type of the card to be formatted, for example "amex" or "visa". This should be one of the types of _creditCardRules.
     */
    function toCreditCardNumber(cardNumber, cardType) {

        var cardRules = _creditCardRules[cardType];

        cardNumber = cardNumber.replace(/\D/g, ""); // remove non-numeric characters

        if(cardNumber && cardNumber.length > cardRules.maxLengthWithoutSpaces) {
            // the card number is longer than the maximum length allowed
            cardNumber = cardNumber.substring(0, cardRules.maxLengthWithoutSpaces);   // we trim the string to fit the maximum length
        }

        var formattedCardNumber = cardNumber.match(cardRules.format);	// divide the card number in chunks of numbers (the chunks are elements of an array)

        if(formattedCardNumber && cardType === 'amex') {
            // the regex for American Express returns the whole card number in the match. We have to remove it.
            formattedCardNumber.shift();	// remove whole card number
            formattedCardNumber = formattedCardNumber.filter(function(element) {return !!element});	// remove elements that are empty
        }

        // join the chunks with spaces
        formattedCardNumber = (formattedCardNumber !== null) ? formattedCardNumber.join(" ") : "";

        return formattedCardNumber;
    }

    /**
     * toDate
     *
     * Formats a set of day,month,year to a date as a String
     * @param day     day as DD (2 digits, min = "01", max = "31")
     * @param month   month as MM (2 digits, min = "01", max = "12")
     * @param year    year as YYYY (4 digits, min = "0001")
     * @param options
     *      - country: Which country rules we want to use for the formatting, ie. "au".
     *      - ISOformat: if set to true, will convert the date to ISO format
     */
    function toDate(day, month, year, options) {

        if (!day || !month || !year) {
            return "";
        } else {
            var country = options && options.country ? options.country : '';

            // add leading zeros to numbers (if necessary)
            day = ('0' + day).slice(-2);
            month = ('0' + month).slice(-2);
            year = ('000' + year).slice(-4);

            if (options && options.ISOformat === true) {
                return year + "-" + month + "-" + day;
            }

            if (country === 'us') {    // US format: "MM/DD/YYYY"
                return month + "/" + day + "/" + year;

            } else {    // Rest of the countries: "DD/MM/YYYY"
                return day + "/" + month + "/" + year;
            }
        }
    }

    /**
     * toPhoneNumber
     * 
     * Formats phone numbers.
     * NOTE: For now, this function only formats USA and Canada phone numbers.
     * @param phoneNumber Phone number
     * @param options.country country whose rules will be applied to format the phone number.
     * @param options.addBlanks true to add blank characters '_' to the phone number until the full length is reached (for example, (123) 45_-____).
     */
    function toPhoneNumber(phoneNumber, options) {
        if(!options) {
            options = {};
        }

        var formattedPhoneNumber = phoneNumber;
        var _country = options && options.country ? options.country : '';

        if (_country === 'us' || _country === 'ca') {
            formattedPhoneNumber = phoneNumber.replace(/\D/g, ""); // remove non-numeric characters
            if (formattedPhoneNumber && formattedPhoneNumber.length > 10) {
                formattedPhoneNumber = formattedPhoneNumber.substring(0, 10);
            }

            if (formattedPhoneNumber) {
                formattedPhoneNumber = formattedPhoneNumber.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
                formattedPhoneNumber.shift();	// remove whole phone number from the match result
            }

            formattedPhoneNumber = '(' + (formattedPhoneNumber[0] || '').padEnd(3,'_') + ') ' + (formattedPhoneNumber[1] || '').padEnd(3,'_') + '-' + (formattedPhoneNumber[2] || '').padEnd(4,'_');

            if (!options.addBlanks) {
                var indexOfFirstBlank = formattedPhoneNumber.indexOf('_');
                if (indexOfFirstBlank > -1) {
                    formattedPhoneNumber = formattedPhoneNumber.substring(0, indexOfFirstBlank);
                }
            }
        }

        return formattedPhoneNumber;
    }

    return {
        toCreditCardNumber: toCreditCardNumber,
        toDate: toDate,
        toPhoneNumber: toPhoneNumber
    }
})();

exports = module.exports = format;
