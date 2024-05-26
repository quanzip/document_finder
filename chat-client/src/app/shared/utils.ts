export class Utils {
    static getRegexPhoneAndEmailAndUrl() {
        const LINK_REGEX = /(?<link>\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/
        // // NOSONAR
        // const EMAIL_REGEX = /(?<email>[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)/
        // const NOT_PHONE_REGEX = /(?<notPhonenumber>\d{12,})/
        // // NOSONAR
        // const PHONE_REGEX = /(?<phonenumber>(?<!\d)((\+|00)?84|0)?\s*(2[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}|[3-579][-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}|6\d{2,5}[-.\s]?\d{1,4}|8[1-9][-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}|80[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1}[-.\s]?\d{1})(?!\d))/
        // // NOSONAR
        // const PHONE1_REGEX = /(?<phonenumber1>0981988997777777777777777)/

        // return  new RegExp("(" + LINK_REGEX.source + ")|(" + EMAIL_REGEX.source + ")|(" + NOT_PHONE_REGEX.source + ")|(" + PHONE_REGEX.source + ")|(" + PHONE1_REGEX.source + ")", 'ig');
        return new RegExp(LINK_REGEX.source, 'ig');
    }
}