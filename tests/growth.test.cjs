const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const script = fs.readFileSync(require('node:path').join(__dirname, '../assets/growth.js'), 'utf8');

function run(search) {
  const events = [];
  const links = [
    {href: 'https://play.google.com/store/apps/details?id=com.defter.englishbooks', dataset: {store:'android', placement:'app'}, addEventListener(name, fn) {this.click = fn;}},
    {href: 'https://apps.apple.com/app/id6742233378', dataset: {store:'ios', placement:'app'}, addEventListener(name, fn) {this.click = fn;}},
  ];
  const language = {href:'https://litooapp.com/en/'};
  vm.runInNewContext(script, {URL, URLSearchParams, CustomEvent: class {constructor(type, data) {this.type=type; this.detail=data.detail;}},
    window:{location:{search}, dispatchEvent(e) {events.push(e.detail);}},
    document:{documentElement:{lang:'tr'}, querySelectorAll(selector) {return selector==='[data-store]' ? links : [language];}, getElementById() {return null;}}});
  return {links, language, events};
}

test('Instagram and YouTube survive one decode of the Play referrer and language switch', () => {
  for (const source of ['instagram', 'youtube']) {
    const result=run(`?utm_source=${source}&utm_campaign=story_quiz_pilot_202610&utm_content=mountains_hiking_01`);
    const play=new URL(result.links[0].href);
    assert.equal(play.searchParams.get('id'), 'com.defter.englishbooks');
    const ref=new URLSearchParams(play.searchParams.get('referrer'));
    assert.equal(ref.get('utm_source'),source);
    assert.equal(ref.get('utm_campaign'),'story_quiz_pilot_202610');
    assert.equal(ref.get('utm_content'),'mountains_hiking_01');
    assert.equal(new URL(result.language.href).searchParams.get('utm_source'),source);
    result.links[0].click();
    assert.equal(result.events[0].source,source);
    assert.equal(result.events[0].content,'mountains_hiking_01');
    const apple=new URL(result.links[1].href);
    assert.equal(apple.hostname,'apps.apple.com');
    assert.equal(apple.searchParams.get('pt'),'127604962');
    assert.equal(apple.searchParams.get('ct'),source==='instagram' ? 'ig_story_quiz_202610' : 'yt_story_quiz_202610');
  }
});

test('unsupported query values do not enter events or store destinations', () => {
  const result=run('?utm_source=unknown&utm_campaign=private_name&utm_content=private_name&redirect=https://evil.example');
  const play=new URL(result.links[0].href);
  const ref=new URLSearchParams(play.searchParams.get('referrer'));
  assert.equal(play.hostname,'play.google.com');
  assert.equal(ref.get('utm_source'),'website');
  assert.equal(ref.get('utm_campaign'),'website_reading');
  assert.equal(ref.has('utm_content'),false);
  result.links[0].click();
  assert.equal(JSON.stringify(result.events).includes('private_name'),false);
  assert.equal(result.links[1].href,'https://apps.apple.com/app/id6742233378');
});

test('existing reading campaigns keep working', () => {
  const result=run('?utm_source=instagram&utm_campaign=ig_reading_01');
  assert.equal(new URL(result.links[0].href).searchParams.get('utm_campaign'),'ig_reading_01');
});

test('short Instagram URL keeps profile attribution through both store links without JavaScript on the redirect page', () => {
  const html=fs.readFileSync(require('node:path').join(__dirname,'../insta/app/index.html'),'utf8');
  const redirect=html.match(/http-equiv="refresh" content="0; url=([^"]+)"/)[1].replaceAll('&amp;','&');
  const fallback=html.match(/<a href="([^"]+)"/)[1].replaceAll('&amp;','&');
  assert.equal(redirect,fallback);
  const target=new URL(redirect,'https://litooapp.com');
  assert.equal(target.origin,'https://litooapp.com');
  assert.equal(target.pathname,'/app/');
  const result=run(target.search);
  const play=new URL(result.links[0].href);
  const ref=new URLSearchParams(play.searchParams.get('referrer'));
  assert.equal(ref.get('utm_source'),'instagram');
  assert.equal(ref.get('utm_content'),'profile');
  assert.equal(ref.get('utm_campaign'),'story_quiz_pilot_202610');
  assert.equal(new URL(result.links[1].href).searchParams.get('ct'),'ig_story_quiz_202610');
});

test('short YouTube URL keeps profile attribution through both store links without JavaScript on the redirect page', () => {
  const html=fs.readFileSync(require('node:path').join(__dirname,'../youtube/app/index.html'),'utf8');
  const redirect=html.match(/http-equiv="refresh" content="0; url=([^"]+)"/)[1].replaceAll('&amp;','&');
  const fallback=html.match(/<a href="([^"]+)"/)[1].replaceAll('&amp;','&');
  assert.equal(redirect,fallback);
  const target=new URL(redirect,'https://litooapp.com');
  assert.equal(target.origin,'https://litooapp.com');
  assert.equal(target.pathname,'/app/');
  const result=run(target.search);
  const play=new URL(result.links[0].href);
  const ref=new URLSearchParams(play.searchParams.get('referrer'));
  assert.equal(ref.get('utm_source'),'youtube');
  assert.equal(ref.get('utm_content'),'profile');
  assert.equal(ref.get('utm_campaign'),'story_quiz_pilot_202610');
  assert.equal(new URL(result.links[1].href).searchParams.get('ct'),'yt_story_quiz_202610');
});
