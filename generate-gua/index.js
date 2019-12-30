const { gua8, gua64 } = require("./src/gua.js");

const getYao = () => {
  return Math.random() > 0.5 ? "1" : "0";
};

/**
 * @params { isSingle },  { default: false, type: boolean }，是否只取一个随机的单卦
 */
const getGua = (isSingle = false) => {
  let gua = "";
  const MAX = isSingle ? 3 : 6;
  for (let i = 0; i < MAX; i++) {
    gua += getYao();
  }
  const guaText = isSingle ? gua8[gua] : gua64[gua];
  return {
    yao: gua,
    gua: guaText,
    describe: "1为阳爻，0为阴爻"
  };
};

const res = {
  getGua
};

module.exports = res;
