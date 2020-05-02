const KIND_MAP = {
  timelines: {
    name: '时间胶囊',
    type: {
      say: '吐槽',
      subject: '收藏',
      progress: '进度',
      blog: '日志',
      mono: '人物',
      relation: '好友',
      group: '小组',
      wiki: '维基',
      index: '目录',
      doujin: '天窗',
    },
  },
  wikis: {
    name: '维基',
    type: {
      subject: '条目',
      character: '角色',
      person: '人物',
      ep: '章节',
      subject_relation: '条目关联',
      subject_person_relation: '人物关联',
      subject_character_relation: '角色关联',
    },
  },
};

function addTip($rect) {
  const { count, date } = $rect.dataset;
  $rect.addEventListener('mouseenter', () => {
    const $tip = document.createElement('div');
    $tip.className = 'svg-tip';
    $tip.innerHTML = `<strong>${count}</strong> (${date})`;
    document.body.appendChild($tip);
    const tipBCR = $tip.getBoundingClientRect();
    const rectBCR = $rect.getBoundingClientRect();
    $tip.style.left = `${rectBCR.left - tipBCR.width / 2 + 6}px`;
    $tip.style.top = `${rectBCR.top - tipBCR.height - 10}px`;
  });
  $rect.addEventListener('mouseleave', () => {
    const $tip = document.querySelector('.svg-tip');
    document.body.removeChild($tip);
  });
}

class TileBox extends HTMLElement {
  constructor() {
    super();
    this.$el = this.attachShadow({ mode: 'open' });
    const template = document.getElementById('template-tile-box');
    this.$el.appendChild(template.content.cloneNode(true));
    this.render();
  }

  get username() {
    return this.getAttribute('username');
  }

  set username(val) {
    this.setAttribute('username', val);
    this.render();
  }

  get kind() {
    return this.getAttribute('kind');
  }

  set kind(val) {
    this.setAttribute('kind', val);
    this.render();
  }

  get type() {
    return this.getAttribute('type');
  }

  set type(val) {
    this.setAttribute('type', val);
    this.render();
  }

  render() {
    const { $el, username, kind, type } = this;
    if (!username || !kind || !type) return;
    $el.querySelector('.type').textContent = KIND_MAP[kind].type[type];
    const href = `/users/${username}/${kind}/${type}`;
    $el.querySelector('.link-svg').href = `${href}.svg`;
    $el.querySelector('.link-json').href = `${href}.json`;
    fetch(`${href}.svg`)
      .then((res) => {
        if (res.ok) return res.text();
        throw res;
      })
      .then((svg) => {
        $el.querySelector('.chart').innerHTML = svg;
        const $rects = [...$el.querySelectorAll('.chart svg rect')];
        $el.querySelector('.total').textContent = $rects
          .map(($rect) => Number($rect.dataset.count))
          .reduce((sum, count) => sum + count, 0);
        $rects.forEach(addTip);
      });
  }
}
customElements.define('tile-box', TileBox);

const [, username] = window.location.pathname.match(/\/users\/(\w+)/) || [];

if (username) {
  document.querySelector('.username').textContent = username;
  ['timelines', 'wikis'].forEach((kind) => {
    const $kind = document.querySelector(`.type-list[data-kind="${kind}"]`);
    Object.keys(KIND_MAP[kind].type).forEach((type) => {
      const $tileBox = document.createElement('tile-box');
      $tileBox.username = username;
      $tileBox.kind = kind;
      $tileBox.type = type;
      $kind.appendChild($tileBox);
    });
  });
}
