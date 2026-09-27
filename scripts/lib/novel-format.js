// 長編の各話を、note 用・他サイト用の文面に組み立てる
// novel-pack.js（予約用ページ）と novel-note.js（note 用ファイル）の両方で使う。
// ページに埋め込むため、この関数の中ではテンプレート文字列（バッククォート）を使わない

function makeNovelFormat(M, CH, getUrl) {
  var BAR = '━━━';
  var last = CH.length;
  function urlOf(no) { return (getUrl(no) || '').trim(); }
  function magUrl() { return urlOf('mag') || '（マガジンの URL を貼ってください）'; }
  function noteTitle(c) {
    if (c.no === 1 && M.firstTitle) return '【' + M.genreLabel + '】' + M.title + '　' + M.firstTitle;
    return '【' + M.genreLabel + '】' + M.title + '　' + c.heading + (c.no === last ? '（完）' : '');
  }
  function siteTitle(c) { return c.heading + (c.no === last ? '（完）' : ''); }
  function tags() { return M.noteTags.map(function (t) { return '#' + t; }).join(' '); }
  function noteBody(c) {
    var head = (c.no === 1 && M.firstHead)
      ? M.firstHead.join('\n') + '\n' + BAR
      : BAR + '\n長編ホラー『' + M.title + '』全' + last + '話\n' + M.hook.join('\n') + '\n' + BAR;
    var parts = [head, c.heading + '\n' + c.body];
    if (c.no === last) parts.push(BAR + '\n（了）\n最後までお読みいただき、ありがとうございました。');
    var links = [];
    if (c.no > 1) links.push('前回の記事\n' + (urlOf(c.no - 1) || '（' + CH[c.no - 2].heading + ' の URL）'));
    if (c.no < last) { var n = CH[c.no]; links.push('次回の記事\n' + (urlOf(n.no) || n.date + ' ' + M.time + ' 公開')); }
    if (links.length) parts.push(BAR + '\n' + links.join('\n'));
    parts.push(BAR + '\n' + M.crossPost + '\n' + M.aiNote);
    if (M.magLabel) parts.push(BAR + '\n' + M.magLabel + '\n' + magUrl());
    if (c.no === last && M.nextWork) parts.push(BAR + '\n次回の記事\n' + M.nextWork);
    parts.push(BAR + '\n' + tags());
    return parts.join('\n');
  }
  function siteBody(c) {
    var s = c.body;
    if (c.no === last) s += '\n\n' + BAR + '\n（了）\n最後までお読みいただき、ありがとうございました。';
    return s;
  }
  return { noteTitle: noteTitle, noteBody: noteBody, siteTitle: siteTitle, siteBody: siteBody, tags: tags };
}

// 章ファイル（01.md〜）と meta.json を読み、日付を付けて返す（Node 用）
function loadNovel(dir) {
  var fs = require('fs');
  var path = require('path');
  var meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
  var files = fs.readdirSync(dir).filter(function (f) { return /^\d+\.md$/.test(f); }).sort();
  var ymd = meta.start.split('-').map(Number);
  var chapters = files.map(function (f, i) {
    var lines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');
    // 端末のタイムゾーンに左右されないよう UTC で日付だけを数える
    var d = new Date(Date.UTC(ymd[0], ymd[1] - 1, ymd[2] + i));
    return {
      no: i + 1,
      heading: lines[0].replace(/^#\s*/, '').trim(),
      date: (d.getUTCMonth() + 1) + '/' + d.getUTCDate() + '（' + '日月火水木金土'[d.getUTCDay()] + '）',
      isoDate: d.toISOString().slice(0, 10),
      body: lines.slice(1).join('\n').trim(),
    };
  });
  return { meta: meta, chapters: chapters };
}

module.exports = { makeNovelFormat: makeNovelFormat, loadNovel: loadNovel };
