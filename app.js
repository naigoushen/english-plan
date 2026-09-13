(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   * 学期常量
   * ------------------------------------------------------------------ */
  var STORE_KEY = 'eng-plan.v1';

  var WEEK1_MONDAY = '2026-08-31';
  var CHECKIN_WEEKS = [3, 19];
  var TERM_START = '2026-09-14';
  var EXAM_START = '2027-01-04';
  var EXAM_END = '2027-01-10';
  var MILITARY = ['2026-11-23', '2026-12-06'];

  var UNIT_KEYS = ['read', 'drill', 'review', 'listen', 'shadow'];
  var UNIT_LABELS = { read: '精读', drill: '练习', review: '错题', listen: '精听', shadow: '跟读' };
  var UNIT_TITLES = {
    read: '综合教程·精读课文',
    drill: '综合教程·课后练习',
    review: '综合教程·错题重做',
    listen: '视听说·精听',
    shadow: '视听说·跟读'
  };

  var WEEKDAY_CN = ['日', '一', '二', '三', '四', '五', '六'];

  var TIMELINE = [
    { w: [3, 3], dates: '9/14 - 9/20', school: '新生正式开课', task: '补齐音标，本周单元当天清' },
    { w: [4, 4], dates: '9/21 - 9/27', school: '9/25 中秋节', task: '保持每周一个单元的节奏' },
    { w: [5, 6], dates: '9/28 - 10/11', school: '10/1 起国庆假', task: '假期每天朗读 30 分钟，一天别断' },
    { w: [7, 8], dates: '10/12 - 10/25', school: '正常上课', task: '基础语法补完' },
    { w: [9, 10], dates: '10/26 - 11/8', school: '11/6 - 11/7 校运会停课', task: '课本前 6 个单元过完第一遍' },
    { w: [11, 12], dates: '11/9 - 11/22', school: '正常上课', task: '老师讲过的单元全部复盘' },
    { w: [13, 14], dates: '11/23 - 12/6', school: '军训', task: '只保留每天的 30 分钟，不设新任务' },
    { w: [15, 16], dates: '12/7 - 12/20', school: '军训结束复课', task: '重做线上平台的单元练习' },
    { w: [17, 18], dates: '12/21 - 1/3', school: '老生统考，1/1 元旦', task: '每周一次限时上机模拟' },
    { w: [19, 19], dates: '1/4 - 1/10', school: '新生统考', task: '考试周' }
  ];

  var RULES = [
    '每天 30 分钟，把课文读出声。时间自己定，但固定在同一个时段，不然很容易断。',
    '单元当天讲完当天过。不积压，积压的内容周末补，不允许拖过两周。',
    '周二、周五两天全天满课，不额外加英语任务，只完成当天的 30 分钟，把力气留给高数。'
  ];

  var TODOS = [
    '把综合教程 1 和视听说教程 1 的激活码刮开注册，看老师有没有在上面布置任务。',
    '课间问老师两个问题：期末机考用的是哪个系统，平时分由哪几项构成。',
    '两周内把 48 个音标过一遍，这是背单词能不能记住的前提。'
  ];

  var WEEK_PLAN = {
    1: { classes: '上午全空，下午第 5-6 节有大学外语课', task: '英语 30 分钟；上午整块时间精读课文；晚上清当天内容' },
    2: { classes: 'Python 四节 + 高等数学四节', task: '只完成英语 30 分钟' },
    3: { classes: '上午电工电子与口语课，晚上还有两节大学外语', task: '英语 30 分钟；下午空档练视听说听力；晚上英语课当天清' },
    4: { classes: '艺术学概论三节 + 思政两节 + 体育两节', task: '英语 30 分钟；晚上背单词' },
    5: { classes: '思政、电工电子、高等数学共八节', task: '只完成英语 30 分钟' },
    6: { classes: '无课', task: '一周复盘，1 到 1.5 小时' },
    0: { classes: '无课', task: '预习下周单元，补本周欠账' }
  };

  var COURSES = {
    1: [['第 5-6 节', '大学外语I', '2216']],
    2: [['第 1-4 节', 'Python 程序设计', '3509 通用计算机实训室'], ['第 5-8 节', '高等数学I', '5-0308']],
    3: [
      ['第 1-2 节', '电工电子技术基础', '3710 数字媒体实训室'],
      ['第 3-4 节', '大学外语口语', '4102'],
      ['第 9-10 节', '大学外语I', '2216']
    ],
    4: [
      ['第 1-3 节', '艺术学概论', '4313'],
      ['第 5-6 节', '思想道德与法治', '5-0506'],
      ['第 7-8 节', '体育I', '图书馆旁篮球场']
    ],
    5: [
      ['第 1-2 节', '思想道德与法治', '5-0506'],
      ['第 3-4 节', '电工电子技术基础', '3307 通用计算机实训室'],
      ['第 5-8 节', '高等数学I', '5-0308']
    ],
    6: [],
    0: []
  };

  var PERIOD_TIMES = [
    ['上午', '第 1-4 节　08:20 / 09:10 / 10:15 / 11:10'],
    ['下午', '第 5-8 节　14:20 / 15:10 / 16:10 / 17:00'],
    ['晚上', '第 9-11 节　19:00 / 19:50 / 20:40']
  ];

  var HOLIDAYS = [
    { from: '2026-10-01', to: '2026-10-07', text: '国庆假期，具体安排以学校通知为准' }
  ];

  var DAY_NOTES = {
    '2026-09-25': { text: '中秋节，放假安排以学校通知为准', noClass: true },
    '2026-11-06': { text: '校运会，全校停课', noClass: true },
    '2026-11-07': { text: '校运会，全校停课', noClass: true },
    '2027-01-01': { text: '元旦，放假安排以学校通知为准', noClass: true }
  };

  /* ------------------------------------------------------------------ *
   * 日期工具：一律本地时间，不经过 UTC
   * ------------------------------------------------------------------ */
  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function toKey(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function keyToDate(k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(k, n) { var d = keyToDate(k); d.setDate(d.getDate() + n); return toKey(d); }
  function diffDays(a, b) { return Math.round((keyToDate(b).getTime() - keyToDate(a).getTime()) / 86400000); }
  function weekdayOf(k) { return keyToDate(k).getDay(); }
  function isWorkday(k) { var w = weekdayOf(k); return w >= 1 && w <= 5; }
  function weekOf(k) { return Math.floor(diffDays(WEEK1_MONDAY, k) / 7) + 1; }
  function mondayOfWeek(w) { return addDays(WEEK1_MONDAY, (w - 1) * 7); }
  function inRange(k, r) { return k >= r[0] && k <= r[1]; }
  function monthDay(k) { var d = keyToDate(k); return (d.getMonth() + 1) + '/' + d.getDate(); }
  function range(a, b) { var out = []; for (var i = a; i <= b; i++) out.push(i); return out; }

  function holidayOn(k) {
    for (var i = 0; i < HOLIDAYS.length; i++) {
      if (k >= HOLIDAYS[i].from && k <= HOLIDAYS[i].to) return HOLIDAYS[i].text;
    }
    return null;
  }

  var WINDOW_START = mondayOfWeek(CHECKIN_WEEKS[0]);
  var WINDOW_END = addDays(mondayOfWeek(CHECKIN_WEEKS[1]), 4);

  function todayKey() {
    var m = /[?&]date=(\d{4}-\d{2}-\d{2})/.exec(window.location.search);
    return m ? m[1] : toKey(new Date());
  }

  /* ------------------------------------------------------------------ *
   * 存储
   * ------------------------------------------------------------------ */
  var storageOK = true;

  function emptyData() { return { daily: {}, units: {} }; }

  function sanitize(raw) {
    var out = emptyData();
    if (!raw || typeof raw !== 'object') return out;
    var daily = raw.daily || raw.morning;
    if (daily && typeof daily === 'object') {
      Object.keys(daily).forEach(function (k) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(k) && daily[k]) out.daily[k] = true;
      });
    }
    if (raw.units && typeof raw.units === 'object') {
      for (var i = 1; i <= 8; i++) {
        var src = raw.units[i];
        if (!src || typeof src !== 'object') continue;
        var keep = {};
        UNIT_KEYS.forEach(function (u) { if (src[u]) keep[u] = true; });
        if (Object.keys(keep).length) out.units[i] = keep;
      }
    }
    return out;
  }

  function loadData() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return emptyData();
      return sanitize(JSON.parse(raw));
    } catch (e) {
      storageOK = false;
      return emptyData();
    }
  }

  var data = loadData();

  function saveData() {
    if (!storageOK) return;
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(data));
    } catch (e) {
      storageOK = false;
      renderFooterNote();
    }
  }

  /* ------------------------------------------------------------------ *
   * DOM
   * ------------------------------------------------------------------ */
  function $(sel) { return document.querySelector(sel); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  var dom = {
    switch: $('#viewSwitch'),
    views: {
      today: $('#viewToday'),
      timetable: $('#viewTimetable'),
      checkin: $('#viewCheckin'),
      plan: $('#viewPlan'),
      stats: $('#viewStats')
    },
    todayKicker: $('#todayKicker'),
    todayTitle: $('#todayTitle'),
    todaySub: $('#todaySub'),
    courseMeta: $('#courseMeta'),
    courseList: $('#courseList'),
    taskList: $('#taskList'),
    timetableMeta: $('#timetableMeta'),
    timetable: $('#timetable'),
    periodTimes: $('#periodTimes'),
    todayMorningMeta: $('#todayMorningMeta'),
    todayMorningBtn: $('#todayMorningBtn'),
    todayMorningBtnText: $('#todayMorningBtnText'),
    todayWeekFill: $('#todayWeekFill'),
    todayMorningNote: $('#todayMorningNote'),
    gridMode: $('#gridMode'),
    weekNav: $('#weekNav'),
    weekPrev: $('#weekPrev'),
    weekNext: $('#weekNext'),
    weekLabel: $('#weekLabel'),
    morningGrid: $('#morningGrid'),
    unitMeta: $('#unitMeta'),
    unitList: $('#unitList'),
    timelineMeta: $('#timelineMeta'),
    timeline: $('#timeline'),
    ruleList: $('#ruleList'),
    todoList: $('#todoList'),
    morningStats: $('#morningStats'),
    unitStats: $('#unitStats'),
    statsMorningFill: $('#statsMorningFill'),
    statsUnitFill: $('#statsUnitFill'),
    foot: $('.foot'),
    sheet: $('#sheet'),
    sheetBackdrop: $('#sheetBackdrop'),
    sheetClose: $('#sheetClose'),
    backupText: $('#backupText'),
    backupHint: $('#backupHint'),
    exportBtn: $('#exportBtn'),
    importBtn: $('#importBtn'),
    copyBtn: $('#copyBtn')
  };

  var currentView = 'today';
  var gridMode = 'week';
  var gridWeek = Math.min(Math.max(weekOf(todayKey()), CHECKIN_WEEKS[0]), CHECKIN_WEEKS[1]);

  /* ------------------------------------------------------------------ *
   * 打卡状态
   * ------------------------------------------------------------------ */
  function isMorningDone(k) { return !!data.daily[k]; }

  function toggleMorning(k) {
    if (data.daily[k]) delete data.daily[k];
    else data.daily[k] = true;
    saveData();
    renderAll();
  }

  function isUnitDone(unit, part) { return !!(data.units[unit] && data.units[unit][part]); }

  function toggleUnit(unit, part) {
    var u = data.units[unit] || (data.units[unit] = {});
    if (u[part]) delete u[part];
    else u[part] = true;
    if (!Object.keys(u).length) delete data.units[unit];
    saveData();
    renderAll();
  }

  function weekCheckedCount(w) {
    var n = 0;
    for (var i = 0; i < 5; i++) if (isMorningDone(addDays(mondayOfWeek(w), i))) n++;
    return n;
  }

  function expectedWorkdays() {
    var today = todayKey();
    var end = today < WINDOW_END ? today : WINDOW_END;
    if (end < WINDOW_START) return 0;
    var n = 0;
    var cursor = WINDOW_START;
    while (cursor <= end) {
      if (isWorkday(cursor)) n++;
      cursor = addDays(cursor, 1);
    }
    return n;
  }

  function checkedWorkdays() {
    var n = 0;
    Object.keys(data.daily).forEach(function (k) {
      if (k >= WINDOW_START && k <= WINDOW_END && isWorkday(k)) n++;
    });
    return n;
  }

  function prevWorkday(k) {
    var cursor = addDays(k, -1);
    var guard = 0;
    while (!isWorkday(cursor) && guard < 10) { cursor = addDays(cursor, -1); guard++; }
    return cursor;
  }

  function streakWorkdays() {
    var cursor = todayKey();
    if (!isWorkday(cursor) || !isMorningDone(cursor)) cursor = prevWorkday(cursor);
    var n = 0;
    while (cursor >= WINDOW_START && isMorningDone(cursor)) {
      n++;
      cursor = prevWorkday(cursor);
    }
    return n;
  }

  function unitDoneCount() {
    var n = 0;
    for (var i = 1; i <= 8; i++) {
      for (var j = 0; j < UNIT_KEYS.length; j++) if (isUnitDone(i, UNIT_KEYS[j])) n++;
    }
    return n;
  }

  /* ------------------------------------------------------------------ *
   * 今日
   * ------------------------------------------------------------------ */
  function todayStatus() {
    var k = todayKey();
    var w = weekOf(k);
    if (k > EXAM_END) return { kind: 'after', week: w };
    if (k >= EXAM_START) return { kind: 'exam', week: w };
    if (inRange(k, MILITARY)) return { kind: 'military', week: w };
    if (k < TERM_START) return { kind: 'before', week: w };
    var h = holidayOn(k);
    if (h) return { kind: 'holiday', week: w, text: h };
    return { kind: 'normal', week: w };
  }

  function renderToday() {
    var k = todayKey();
    var d = keyToDate(k);
    var status = todayStatus();
    var wd = weekdayOf(k);
    var toExam = diffDays(k, EXAM_START);

    dom.todayTitle.textContent = (d.getMonth() + 1) + ' 月 ' + d.getDate() + ' 日';

    if (status.kind === 'before') {
      dom.todayKicker.textContent = '开学前';
      dom.todaySub.innerHTML = '距正式上课还有 <b>' + diffDays(k, TERM_START) + '</b> 天';
    } else if (status.kind === 'after') {
      dom.todayKicker.textContent = '第 ' + status.week + ' 周 · 学期已结束';
      dom.todaySub.textContent = '考试周已经过去，这一页可以留到下学期改。';
    } else if (status.kind === 'exam') {
      dom.todayKicker.textContent = '第 ' + status.week + ' 周 · 星期' + WEEKDAY_CN[wd] + ' · 考试周';
      dom.todaySub.textContent = '统考就在这一周，按老师划的范围过一遍。';
    } else if (status.kind === 'military') {
      dom.todayKicker.textContent = '第 ' + status.week + ' 周 · 星期' + WEEKDAY_CN[wd] + ' · 军训';
      dom.todaySub.innerHTML = '军训期间只保每天 30 分钟，距考试还有 <b>' + toExam + '</b> 天';
    } else {
      dom.todayKicker.textContent = '第 ' + status.week + ' 周 · 星期' + WEEKDAY_CN[wd];
      dom.todaySub.innerHTML = '距第 19 周考试还有 <b>' + toExam + '</b> 天';
    }

    renderCourses(status, k, wd);
    renderTasks(status, wd);
    renderTodayMorning(k);
  }

  function renderCourses(status, k, wd) {
    dom.courseList.textContent = '';
    var note = DAY_NOTES[k];
    var blank = null;

    if (status.kind === 'before') blank = '还没开课，9 月 14 日正式上课。';
    else if (status.kind === 'after') blank = '学期已结束。';
    else if (status.kind === 'exam') blank = '考试周，没有常规课程。';
    else if (status.kind === 'military') blank = '军训期间没有常规课程。';
    else if (status.kind === 'holiday') blank = status.text;
    else if (note && note.noClass) blank = note.text;

    if (blank) {
      dom.courseMeta.textContent = '';
      dom.courseList.appendChild(el('li', 'empty-line', blank));
      return;
    }

    var list = COURSES[wd] || [];
    dom.courseMeta.textContent = note ? note.text : '';
    if (!list.length) {
      dom.courseList.appendChild(el('li', 'empty-line', note ? note.text : '今天没有课。'));
      return;
    }
    list.forEach(function (c) {
      var li = el('li', 'course-item');
      li.appendChild(el('span', 'course-slot', c[0]));
      var name = el('span', 'course-name');
      name.appendChild(el('span', 'course-title', c[1]));
      if (c[2]) name.appendChild(el('span', 'course-room', c[2]));
      li.appendChild(name);
      dom.courseList.appendChild(li);
    });
  }

  /* ------------------------------------------------------------------ *
   * 课表
   * ------------------------------------------------------------------ */
  function renderTimetable() {
    var today = todayKey();
    var todayWd = weekdayOf(today);
    var highlight = today >= TERM_START && today <= EXAM_END;

    dom.timetableMeta.textContent = '按第 3 周教务系统';
    dom.timetable.textContent = '';

    [1, 2, 3, 4, 5, 6, 0].forEach(function (wd) {
      var list = COURSES[wd] || [];
      var isToday = highlight && wd === todayWd;
      var day = el('div', 'tt-day' + (isToday ? ' is-today' : ''));

      var head = el('div', 'tt-day-head');
      head.appendChild(el('span', 'tt-day-name', wd === 0 ? '周日' : '周' + WEEKDAY_CN[wd]));
      if (isToday) head.appendChild(el('span', 'tt-day-tag', '今天'));
      day.appendChild(head);

      if (!list.length) {
        day.appendChild(el('p', 'tt-day-rest', '没课'));
      } else {
        var ul = el('ul', 'course-list');
        list.forEach(function (c) {
          var li = el('li', 'course-item');
          li.appendChild(el('span', 'course-slot', c[0]));
          var name = el('span', 'course-name');
          name.appendChild(el('span', 'course-title', c[1]));
          if (c[2]) name.appendChild(el('span', 'course-room', c[2]));
          li.appendChild(name);
          ul.appendChild(li);
        });
        day.appendChild(ul);
      }
      dom.timetable.appendChild(day);
    });

    dom.periodTimes.textContent = '';
    PERIOD_TIMES.forEach(function (p) {
      var li = el('li', 'period-item');
      li.appendChild(el('span', 'period-label', p[0]));
      li.appendChild(el('span', null, p[1]));
      dom.periodTimes.appendChild(li);
    });
  }

  function renderTasks(status, wd) {
    dom.taskList.textContent = '';
    var plan = WEEK_PLAN[wd];
    var text = plan ? plan.task : '';
    if (status.kind === 'before') text = '把激活码注册好；把 48 个音标过一遍';
    else if (status.kind === 'military') text = '只完成英语 30 分钟；晚上早点睡，别安排新任务';
    else if (status.kind === 'exam') text = '按老师划的范围复习；做一次限时上机模拟';
    else if (status.kind === 'after') text = '这一页留到下学期再用';

    text.split('；').forEach(function (t) {
      var s = t.trim();
      if (s) dom.taskList.appendChild(el('li', 'task-item', s));
    });
  }

  function renderTodayMorning(k) {
    var inWindow = k >= WINDOW_START && k <= WINDOW_END;
    var workday = isWorkday(k);
    var done = isMorningDone(k);
    var week = Math.min(Math.max(weekOf(k), CHECKIN_WEEKS[0]), CHECKIN_WEEKS[1]);
    var weekCount = weekCheckedCount(week);

    dom.todayWeekFill.style.width = Math.round(weekCount / 5 * 100) + '%';
    dom.todayMorningMeta.textContent = '本周 ' + weekCount + ' / 5';
    dom.todayMorningBtn.className = 'cta';
    dom.todayMorningBtn.dataset.key = k;

    if (!inWindow) {
      dom.todayMorningBtn.classList.add('locked');
      dom.todayMorningBtn.disabled = true;
      dom.todayMorningBtn.setAttribute('aria-pressed', 'false');
      dom.todayMorningBtnText.textContent = k < WINDOW_START ? '打卡从 9 月 14 日开始' : '本学期的打卡已经结束';
      dom.todayMorningNote.textContent = k < WINDOW_START
        ? '正式上课后，每个工作日读完 30 分钟就在这里打勾。'
        : '第 19 周结束后不再累计。';
      return;
    }
    if (!workday) {
      dom.todayMorningBtn.classList.add('locked');
      dom.todayMorningBtn.disabled = true;
      dom.todayMorningBtn.setAttribute('aria-pressed', 'false');
      dom.todayMorningBtnText.textContent = '周末不用打卡';
      dom.todayMorningNote.textContent = '打卡按工作日算，周末想学也可以，只是不计入统计。';
      return;
    }

    dom.todayMorningBtn.disabled = false;
    dom.todayMorningBtn.setAttribute('aria-pressed', done ? 'true' : 'false');
    if (done) {
      dom.todayMorningBtn.classList.add('on');
      dom.todayMorningBtnText.textContent = '今天已打卡，点一下取消';
    } else {
      dom.todayMorningBtnText.textContent = '完成今天的 30 分钟';
    }
    dom.todayMorningNote.textContent = '打卡窗口：第 3 周到第 19 周的每个工作日。';
  }

  /* ------------------------------------------------------------------ *
   * 打卡页
   * ------------------------------------------------------------------ */
  function renderCheckin() {
    renderGrid();
    renderUnits();
  }

  function renderGrid() {
    var today = todayKey();
    dom.morningGrid.textContent = '';
    dom.morningGrid.className = 'mgrid' + (gridMode === 'all' ? ' is-all' : '');
    dom.weekNav.hidden = gridMode === 'all';
    dom.weekLabel.textContent = '第 ' + gridWeek + ' 周 · ' + weekRangeText(gridWeek);
    dom.weekPrev.disabled = gridWeek <= CHECKIN_WEEKS[0];
    dom.weekNext.disabled = gridWeek >= CHECKIN_WEEKS[1];

    dom.morningGrid.appendChild(el('div', 'mgrid-head is-corner', '周次'));
    for (var i = 0; i < 5; i++) dom.morningGrid.appendChild(el('div', 'mgrid-head', WEEKDAY_CN[i + 1]));

    var weeks = gridMode === 'all' ? range(CHECKIN_WEEKS[0], CHECKIN_WEEKS[1]) : [gridWeek];
    weeks.forEach(function (w) {
      dom.morningGrid.appendChild(el('div', 'mgrid-week', '第 ' + w + ' 周'));
      for (var i = 0; i < 5; i++) {
        var key = addDays(mondayOfWeek(w), i);
        var on = isMorningDone(key);
        var cell = el('button', 'mgrid-cell');
        cell.type = 'button';
        cell.dataset.key = key;
        if (on) cell.classList.add('is-on');
        if (key === today) cell.classList.add('is-today');
        if (key > today) cell.classList.add('is-future');
        cell.setAttribute('aria-pressed', on ? 'true' : 'false');
        cell.setAttribute('aria-label',
          '第 ' + w + ' 周 星期' + WEEKDAY_CN[i + 1] + '，' + monthDay(key) + '，' + (on ? '已打卡' : '未打卡'));
        dom.morningGrid.appendChild(cell);
      }
    });
  }

  function weekRangeText(w) {
    var a = mondayOfWeek(w);
    return monthDay(a) + ' - ' + monthDay(addDays(a, 6));
  }

  function renderUnits() {
    dom.unitList.textContent = '';
    dom.unitMeta.textContent = unitDoneCount() + ' / 40';
    for (var i = 1; i <= 8; i++) {
      var li = el('li', 'unit-item');
      li.appendChild(el('span', 'unit-name', 'Unit ' + i));
      var tags = el('span', 'unit-tags');
      UNIT_KEYS.forEach(function (u) {
        var on = isUnitDone(i, u);
        var b = el('button', 'tag' + (on ? ' on' : ''), UNIT_LABELS[u]);
        b.type = 'button';
        b.dataset.unit = String(i);
        b.dataset.part = u;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.setAttribute('aria-label', 'Unit ' + i + ' ' + UNIT_TITLES[u] + '，' + (on ? '已完成' : '未完成'));
        tags.appendChild(b);
      });
      li.appendChild(tags);
      dom.unitList.appendChild(li);
    }
  }

  /* ------------------------------------------------------------------ *
   * 计划页
   * ------------------------------------------------------------------ */
  function renderPlan() {
    var week = weekOf(todayKey());
    dom.timelineMeta.textContent = '第 19 周统考';
    dom.timeline.textContent = '';

    var nowIndex = -1;
    TIMELINE.forEach(function (seg, i) {
      if (week >= seg.w[0] && week <= seg.w[1]) nowIndex = i;
    });
    if (nowIndex === -1 && week < TIMELINE[0].w[0]) nowIndex = 0;

    TIMELINE.forEach(function (seg, i) {
      var li = el('li', 'tl-item');
      if (i === nowIndex) li.classList.add('is-now');
      else if (week > seg.w[1]) li.classList.add('is-past');
      li.appendChild(el('span', 'tl-dot'));

      var head = el('div', 'tl-head');
      head.appendChild(el('span', 'tl-weeks',
        seg.w[0] === seg.w[1] ? '第 ' + seg.w[0] + ' 周' : '第 ' + seg.w[0] + ' - ' + seg.w[1] + ' 周'));
      head.appendChild(el('span', 'tl-dates', seg.dates));
      if (i === nowIndex) head.appendChild(el('span', 'tl-now', week < CHECKIN_WEEKS[0] ? '即将开始' : '现在在这里'));
      li.appendChild(head);
      li.appendChild(el('p', 'tl-school', seg.school));
      li.appendChild(el('p', 'tl-task', seg.task));
      dom.timeline.appendChild(li);
    });

    fillRules(dom.ruleList, RULES);
    fillRules(dom.todoList, TODOS);
  }

  function fillRules(target, items) {
    target.textContent = '';
    items.forEach(function (t) { target.appendChild(el('li', 'rule-item', t)); });
  }

  /* ------------------------------------------------------------------ *
   * 统计页
   * ------------------------------------------------------------------ */
  function renderStats() {
    var expected = expectedWorkdays();
    var checked = checkedWorkdays();
    var rate = expected ? Math.round(Math.min(checked, expected) / expected * 100) : 0;
    var week = Math.min(Math.max(weekOf(todayKey()), CHECKIN_WEEKS[0]), CHECKIN_WEEKS[1]);
    var toExam = diffDays(todayKey(), EXAM_START);
    var streak = streakWorkdays();

    dom.morningStats.textContent = '';
    addStat(dom.morningStats, '打卡完成率', rate + '%', checked + ' / ' + expected + ' 天', rate >= 60, true);
    addStat(dom.morningStats, '连续打卡', String(streak), '个工作日', streak > 0);
    addStat(dom.morningStats, '本周打卡', String(weekCheckedCount(week)), '/ 5 天', false);
    addStat(dom.morningStats, '单元进度', String(unitDoneCount()), '/ 40 项', false);
    var examText = toExam > 0 ? String(toExam) : '—';
    var examUnit = toExam > 0 ? '天' : '考试周已经开始';
    addStat(dom.morningStats, '距第 19 周考试', examText, examUnit, false);
    dom.statsMorningFill.style.width = rate + '%';

    dom.unitStats.textContent = '';
    UNIT_KEYS.forEach(function (u, idx) {
      var n = 0;
      for (var i = 1; i <= 8; i++) if (isUnitDone(i, u)) n++;
      addStat(dom.unitStats, UNIT_TITLES[u], n + ' / 8', '个单元', n > 0, idx === UNIT_KEYS.length - 1);
    });
    dom.statsUnitFill.style.width = Math.round(unitDoneCount() / 40 * 100) + '%';
  }

  function addStat(target, label, value, unit, highlight, wide) {
    var box = el('div', 'stat' + (wide ? ' is-wide' : ''));
    box.appendChild(el('p', 'stat-label', label));
    var v = el('p', 'stat-value' + (highlight ? ' is-on' : ''));
    v.appendChild(document.createTextNode(value));
    if (unit) v.appendChild(el('small', null, unit));
    box.appendChild(v);
    target.appendChild(box);
  }

  /* ------------------------------------------------------------------ *
   * 备份与恢复
   * ------------------------------------------------------------------ */
  function openSheet() {
    dom.sheet.hidden = false;
    dom.backupHint.hidden = true;
    dom.backupText.value = '';
  }

  function closeSheet() { dom.sheet.hidden = true; }

  function showBackupHint(msg, isError) {
    dom.backupHint.textContent = msg;
    dom.backupHint.className = 'hint' + (isError ? ' is-error' : '');
    dom.backupHint.hidden = false;
  }

  function exportBackup() {
    dom.backupText.value = JSON.stringify({ v: 1, daily: data.daily, units: data.units });
    dom.backupText.select();
    showBackupHint('已生成备份文本，点“复制”或长按全选。', false);
  }

  function importBackup() {
    var text = dom.backupText.value.trim();
    if (!text) { showBackupHint('先把备份文本粘贴进来。', true); return; }
    var parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      showBackupHint('这段文本不是有效的备份内容。', true);
      return;
    }
    var next = sanitize(parsed);
    var days = Object.keys(next.daily).length;
    if (!days && !Object.keys(next.units).length) {
      showBackupHint('这段备份里没有找到打卡记录。', true);
      return;
    }
    data.daily = next.daily;
    data.units = next.units;
    saveData();
    renderAll();
    showBackupHint('已导入 ' + days + ' 天打卡记录。', false);
  }

  function copyBackup() {
    var text = dom.backupText.value;
    if (!text) { showBackupHint('先点“导出”再复制。', true); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showBackupHint('已复制到剪贴板。', false);
      }, function () {
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }
  }

  function fallbackCopy() {
    try {
      dom.backupText.select();
      document.execCommand('copy');
      showBackupHint('已复制到剪贴板。', false);
    } catch (e) {
      showBackupHint('复制失败，请长按文本框手动全选复制。', true);
    }
  }

  /* ------------------------------------------------------------------ *
   * 视图与渲染
   * ------------------------------------------------------------------ */
  function showView(view) {
    currentView = view;
    ['today', 'timetable', 'checkin', 'plan', 'stats'].forEach(function (v) { dom.views[v].hidden = v !== view; });
    Array.prototype.forEach.call(dom.switch.querySelectorAll('.seg-btn'), function (b) {
      var active = b.dataset.view === view;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    window.scrollTo(0, 0);
  }

  function renderFooterNote() {
    var note = document.querySelector('.foot-note');
    if (!note) {
      note = el('p', 'foot-note');
      dom.foot.appendChild(note);
    }
    var parts = ['课表按第 3 周教务系统导出，如有调整以最新通知为准。'];
    if (!storageOK) parts.push('当前浏览器不允许本地存储，这次的记录不会保存。');
    note.textContent = parts.join(' ');
  }

  function renderAll() {
    renderToday();
    renderTimetable();
    renderCheckin();
    renderPlan();
    renderStats();
    renderFooterNote();
  }

  /* ------------------------------------------------------------------ *
   * 事件
   * ------------------------------------------------------------------ */
  dom.switch.addEventListener('click', function (e) {
    var btn = e.target.closest('.seg-btn');
    if (btn) showView(btn.dataset.view);
  });

  dom.todayMorningBtn.addEventListener('click', function () {
    var k = dom.todayMorningBtn.dataset.key;
    if (k && !dom.todayMorningBtn.disabled) toggleMorning(k);
  });

  dom.gridMode.addEventListener('click', function (e) {
    var btn = e.target.closest('.mini-btn');
    if (!btn || btn.dataset.mode === gridMode) return;
    gridMode = btn.dataset.mode;
    Array.prototype.forEach.call(dom.gridMode.querySelectorAll('.mini-btn'), function (b) {
      b.classList.toggle('on', b.dataset.mode === gridMode);
    });
    renderGrid();
  });

  dom.weekPrev.addEventListener('click', function () {
    if (gridWeek > CHECKIN_WEEKS[0]) { gridWeek--; renderGrid(); }
  });
  dom.weekNext.addEventListener('click', function () {
    if (gridWeek < CHECKIN_WEEKS[1]) { gridWeek++; renderGrid(); }
  });

  dom.morningGrid.addEventListener('click', function (e) {
    var cell = e.target.closest('.mgrid-cell');
    if (cell) toggleMorning(cell.dataset.key);
  });

  dom.unitList.addEventListener('click', function (e) {
    var btn = e.target.closest('.tag');
    if (btn) toggleUnit(btn.dataset.unit, btn.dataset.part);
  });

  $('#backupOpen').addEventListener('click', openSheet);
  $('#backupOpenFoot').addEventListener('click', openSheet);
  dom.sheetClose.addEventListener('click', closeSheet);
  dom.sheetBackdrop.addEventListener('click', closeSheet);
  dom.exportBtn.addEventListener('click', exportBackup);
  dom.importBtn.addEventListener('click', importBackup);
  dom.copyBtn.addEventListener('click', copyBackup);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !dom.sheet.hidden) closeSheet();
  });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) renderAll();
  });

  showView('today');
  renderAll();
})();
