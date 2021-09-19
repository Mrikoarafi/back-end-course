const numberFormat = {
  // substr = string dimulai dari 1,bukan dari 0
  numberWebWhatsapp: (number) => {
    if (number.startsWith("0")) {
      number = "62" + number.substr(1);
    }
    if (!number.endsWith("@c.us")) {
      number += "@c.us";
    }
    return number;
  },
  numberMongo: (number) => {
    if (number.startsWith("0")) {
      number = "62" + number.substr(1);
    } else if (number.startsWith("62")) {
      number = number;
    } else if (!number.startsWith("0")) {
      number = "62" + number.substr(0);
    }
    return number;
  },
};

module.exports = numberFormat;
