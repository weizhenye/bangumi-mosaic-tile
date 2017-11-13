const WEEKS = ['日', '月', '火', '水', '木', '金', '土'];
const MONTHS = ['零', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一', '十二'];
const COLORS = ['#ebedf0', '#f9d4d7', '#f09199', '#e74e5b', '#cd1c2b'];
const ONE_DAY = 8.64e7;
const UTC_8 = 2.88e7;

module.exports = function genSVG(data) {
  let maxCount = 0;
  const today = new Date(Date.now() + UTC_8);
  const tiles = 52 * 7 + (today.getUTCDay() || 7);
  let rects = '';
  let texts = '';
  Array(tiles + 1)
    .fill(0)
    .map((x, i) => {
      const date = new Date(+today - ONE_DAY * (tiles - i)).toISOString().slice(0, 10);
      const count = data[date] || 0;
      maxCount = Math.max(maxCount, count);
      return { date, count };
    })
    .forEach(({ date, count }, i) => {
      const color = COLORS[maxCount && Math.ceil(count / maxCount * 4)];
      const weekIdx = i / 7 | 0;
      rects += `<rect width="10" height="10" x="${12 * weekIdx}" y="${12 * (i % 7)}" fill="${color}" data-count="${count}" data-date="${date}"/>`;
      if (/01$/.test(date)) {
        texts += `<text x="${12 * weekIdx + 18}" y="1" fill="#767676" font-size="9" writing-mode="tb">${MONTHS[date.slice(5, 7) * 1]}</text>`;
      }
    });
  texts += WEEKS.map((week, idx) => `<text x="1" y="${12 * idx + 33}" fill="#767676" font-size="9">${week}</text>`);

  return `<svg width="648" height="108" xmlns="http://www.w3.org/2000/svg"><g transform="translate(13, 25)">${rects}</g>${texts}</svg>`;
};
