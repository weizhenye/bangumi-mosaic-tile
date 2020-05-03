const WEEKS = ['日', '月', '火', '水', '木', '金', '土'];
const MONTHS = ['零', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一', '十二'];
const COLORS = ['#ebedf0', '#f9d4d7', '#f09199', '#e74e5b', '#cd1c2b'];
const ONE_DAY = 8.64e7;
const UTC_8 = 2.88e7;

function normalize(date) {
  try {
    const d = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(+d)) return null;
    if (d < new Date('2008-06-19T00:00:00.000Z')) return null;
    if (d > Date.now()) return null;
    return d;
  } catch (err) {
    return null;
  }
}

function getDates(begin, end) {
  const today = new Date(`${new Date(Date.now() + UTC_8).toISOString().slice(0, 10)}T00:00:00.000Z`);
  const firstDate = normalize(begin)
    || new Date(+today - ONE_DAY * (52 * 7 + (today.getUTCDay() || 7)));
  const lastDate = normalize(end) || today;
  const firstDay = firstDate.getUTCDay();
  return Array(((lastDate - firstDate) / ONE_DAY | 0) + 1).fill(0).map((x, i) => {
    const d = new Date(+firstDate + ONE_DAY * i);
    const date = d.toISOString().slice(0, 10);
    const day = d.getUTCDay();
    const week = (i + firstDay) / 7 | 0;
    return { date, day, week };
  });
}

module.exports = function genSVG(data, { begin, end, direction = 'horizontal' } = {}) {
  let maxCount = 0;
  const tiles = getDates(begin, end)
    .map((tile) => {
      const count = data[tile.date] || 0;
      maxCount = Math.max(maxCount, count);
      return { ...tile, count };
    })
    .map((tile) => {
      const color = COLORS[maxCount && Math.ceil(tile.count / maxCount * 4)];
      return { ...tile, color };
    });
  const isH = direction !== 'vertical';
  const $rects = tiles.map(({ date, day, week, count, color }) => `<rect width="10" height="10" x="${12 * (isH ? week : day)}" y="${12 * (isH ? day : week)}" fill="${color}" data-count="${count}" data-date="${date}"/>`).join('');
  const $weeks = WEEKS.map((week, idx) => {
    const h = `x="1" y="${12 * idx + 33}"`;
    const v = `x="${12 * idx + 26}" y="10"`;
    return `<text ${isH ? h : v} fill="#767676" font-size="9">${week}</text>`;
  }).join('');
  const $months = tiles
    .filter((tile) => tile.date.slice(-2) === '01')
    .map(({ week, date }) => {
      const h = `x="${12 * week + 18}" y="1"`;
      const v = `x="3" y="${12 * week + 21}"`;
      return `<text ${isH ? h : v} fill="#767676" font-size="9" ${isH ? 'writing-mode="tb"' : ''}>${MONTHS[date.slice(5, 7) * 1]}</text>`;
    })
    .join('');
  const w = tiles[tiles.length - 1].week * 12 + 24;
  const h = 108;
  return `<svg width="${isH ? w : h}" height="${isH ? h : w}" xmlns="http://www.w3.org/2000/svg"><g transform="translate(${isH ? '13, 25' : '25, 13'})">${$rects}</g>${$weeks}${$months}</svg>`;
};
