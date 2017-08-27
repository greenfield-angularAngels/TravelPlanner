const makeBoxWiBoder = (lftOrRgtStr, wPx, hPx, bColor) => {
  lftOrRgtStr = lftOrRgtStr === 'r' ? 'right' : 'left';
  return {
    border: '1px solid gray',
    display: 'inline-block',
    width: wPx,
    height: hPx,
    float: lftOrRgtStr,
    borderColor: bColor,
  };
}

const makeBoxWiNoBoder = (lftOrRgtStr, wPx, hPx) => {
  lftOrRgtStr = lftOrRgtStr === 'r' ? 'right' : 'left';
  return {
    // border: '1px solid gray',
    display: 'inline-block',
    width: wPx,
    height: hPx,
    float: lftOrRgtStr,
    // borderColor: bColor,
  };
}

module.exports.makeBoxWiBoder = makeBoxWiBoder;
module.exports.makeBoxWiNoBoder = makeBoxWiNoBoder;
