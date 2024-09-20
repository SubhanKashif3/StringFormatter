class StringFormatter {
    constructor(defaultOptions = {}) {
      this.defaultOptions = {
        encrypt: { method: null, key: null }, // 'caesar', 'vigenere', 'xor'
        decrypt: { method: null, key: null },
        compress: false,
        decompress: false,
        sentiment: false,
        translate: { to: null },
        spellCheck: false,
        summarize: { sentences: 3 },
        formatNumber: { locale: 'en-US', style: 'decimal' },
        formatDate: { locale: 'en-US', options: { dateStyle: 'full' } },
        formatCurrency: { locale: 'en-US', currency: 'USD' },
        removeDiacritics: false,
        removeEmojis: false,
        escapeRegex: false,
        unescapeRegex: false,
        isAnagram: null,
        isPalindrome: false,
        toAscii: false,
        fromAscii: false,
        toMorseCode: false,
        fromMorseCode: false,
        ...defaultOptions
      };
    }
  
    format(input, options = {}) {
      try {
        if (input == null) throw new Error('Input cannot be null or undefined');
        const opts = { ...this.defaultOptions, ...options };
        let result = String(input);
  
        // Apply transformations
        if (opts.encrypt.method) result = this.encrypt(result, opts.encrypt.method, opts.encrypt.key);
        if (opts.decrypt.method) result = this.decrypt(result, opts.decrypt.method, opts.decrypt.key);
        if (opts.compress) result = this.compress(result);
        if (opts.decompress) result = this.decompress(result);
        if (opts.sentiment) result = this.analyzeSentiment(result);
        if (opts.translate.to) result = this.translate(result, opts.translate.to);
        if (opts.spellCheck) result = this.spellCheck(result);
        if (opts.summarize.sentences > 0) result = this.summarize(result, opts.summarize.sentences);
        if (opts.formatNumber.style) result = this.formatNumber(result, opts.formatNumber);
        if (opts.formatDate.options) result = this.formatDate(result, opts.formatDate);
        if (opts.formatCurrency.currency) result = this.formatCurrency(result, opts.formatCurrency);
        if (opts.removeDiacritics) result = this.removeDiacritics(result);
        if (opts.removeEmojis) result = this.removeEmojis(result);
        if (opts.escapeRegex) result = this.escapeRegex(result);
        if (opts.unescapeRegex) result = this.unescapeRegex(result);
        if (opts.isAnagram) result = this.isAnagram(result, opts.isAnagram).toString();
        if (opts.isPalindrome) result = this.isPalindrome(result).toString();
        if (opts.toAscii) result = this.toAscii(result);
        if (opts.fromAscii) result = this.fromAscii(result);
        if (opts.toMorseCode) result = this.toMorseCode(result);
        if (opts.fromMorseCode) result = this.fromMorseCode(result);
  
        return result;
      } catch (error) {
        console.error('Error in StringFormatter:', error.message);
        return input;
      }
    }
  
    encrypt(str, method, key) {
      switch (method) {
        case 'caesar':
          return str.replace(/[a-zA-Z]/g, char => {
            const code = char.charCodeAt(0);
            const base = code < 91 ? 65 : 97;
            return String.fromCharCode((code - base + key) % 26 + base);
          });
        case 'vigenere':
          return str.replace(/[a-zA-Z]/g, (char, i) => {
            const charCode = char.charCodeAt(0);
            const keyChar = key[i % key.length].toUpperCase();
            const keyCode = keyChar.charCodeAt(0) - 65;
            const base = charCode < 91 ? 65 : 97;
            return String.fromCharCode((charCode - base + keyCode) % 26 + base);
          });
        case 'xor':
          return str.split('').map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join('');
        default:
          return str;
      }
    }
  
    decrypt(str, method, key) {
      switch (method) {
        case 'caesar':
          return this.encrypt(str, 'caesar', 26 - key);
        case 'vigenere':
          return str.replace(/[a-zA-Z]/g, (char, i) => {
            const charCode = char.charCodeAt(0);
            const keyChar = key[i % key.length].toUpperCase();
            const keyCode = keyChar.charCodeAt(0) - 65;
            const base = charCode < 91 ? 65 : 97;
            return String.fromCharCode((charCode - base - keyCode + 26) % 26 + base);
          });
        case 'xor':
          return this.encrypt(str, 'xor', key); // XOR decryption is the same as encryption
        default:
          return str;
      }
    }
  
    compress(str) {
      return str.replace(/(\w)\1+/g, (match, char) => `${char}${match.length}`);
    }
  
    decompress(str) {
      return str.replace(/(\w)(\d+)/g, (_, char, count) => char.repeat(parseInt(count)));
    }
  
    analyzeSentiment(str) {
      const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'];
      const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'poor', 'disappointing'];
      const words = str.toLowerCase().match(/\b\w+\b/g) || [];
      const positiveCount = words.filter(word => positiveWords.includes(word)).length;
      const negativeCount = words.filter(word => negativeWords.includes(word)).length;
      if (positiveCount > negativeCount) return 'Positive';
      if (negativeCount > positiveCount) return 'Negative';
      return 'Neutral';
    }
  
    translate(str, to) {
      // Note: Actual translation would require an external API
      return `[Translated to ${to}]: ${str}`;
    }
  
    spellCheck(str) {
      // Note: Actual spell checking would require a dictionary or API
      return str.replace(/\b\w+\b/g, word => {
        if (Math.random() < 0.1) return `[${word}]?`;
        return word;
      });
    }
  
    summarize(str, sentences) {
      const allSentences = str.match(/[^.!?]+[.!?]+/g) || [];
      return allSentences.slice(0, sentences).join(' ');
    }
  
    formatNumber(str, { locale, style }) {
      const num = parseFloat(str);
      return isNaN(num) ? str : num.toLocaleString(locale, { style });
    }
  
    formatDate(str, { locale, options }) {
      const date = new Date(str);
      return isNaN(date.getTime()) ? str : date.toLocaleDateString(locale, options);
    }
  
    formatCurrency(str, { locale, currency }) {
      const num = parseFloat(str);
      return isNaN(num) ? str : num.toLocaleString(locale, { style: 'currency', currency });
    }
  
    removeDiacritics(str) {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
  
    removeEmojis(str) {
      return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '');
    }
  
    escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  
    unescapeRegex(str) {
      return str.replace(/\\(.)/g, '$1');
    }
  
    isAnagram(str, comparison) {
      const normalize = s => s.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('');
      return normalize(str) === normalize(comparison);
    }
  
    isPalindrome(str) {
      const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalized === normalized.split('').reverse().join('');
    }
  
    toAscii(str) {
      return str.split('').map(char => char.charCodeAt(0)).join(' ');
    }
  
    fromAscii(str) {
      return str.split(' ').map(code => String.fromCharCode(parseInt(code))).join('');
    }
  
    fromMorseCode(str) {
        const morseCodeReverse = {
          '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', 
          '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L', 
          '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', 
          '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', 
          '-.--': 'Y', '--..': 'Z', '.----': '1', '..---': '2', '...--': '3', 
          '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', 
          '----.': '9', '-----': '0', '/': ' '
        };
      
        return str.split(' ').map(morse => morseCodeReverse[morse] || morse).join('');
      }
    };
    
    
const formatter = new StringFormatter();

let s = formatter.encrypt("234423","xor","233");
let x = formatter.fromMorseCode("Helo")
console.log(x)