const data = require('./tests/e2e/lighthouse-reports/lighthouse-report-2025-12-10.json');
const audits = data.audits;

console.log('=== Core Web Vitals ===');
console.log('LCP:', audits['largest-contentful-paint'].displayValue);
console.log('FCP:', audits['first-contentful-paint'].displayValue);
console.log('CLS:', audits['cumulative-layout-shift'].displayValue);
console.log('TBT:', audits['total-blocking-time'].displayValue);
console.log('Speed Index:', audits['speed-index'].displayValue);

console.log('\n=== LCP Element ===');
const lcpElement = audits['largest-contentful-paint-element'];
if (lcpElement && lcpElement.details && lcpElement.details.items) {
  lcpElement.details.items.forEach(item => {
    console.log(' Element:', item.element ? item.element.value : 'N/A');
  });
}

console.log('\n=== Render Blocking Resources ===');
const renderBlocking = audits['render-blocking-resources'];
if (renderBlocking && renderBlocking.details && renderBlocking.details.items) {
  console.log('Potential savings:', renderBlocking.displayValue);
  renderBlocking.details.items.forEach(item => {
    console.log(' -', item.url ? item.url.substring(0, 80) : 'N/A', '| wasted:', item.wastedMs + 'ms');
  });
}

console.log('\n=== Unused CSS ===');
const unusedCss = audits['unused-css-rules'];
if (unusedCss && unusedCss.details && unusedCss.details.items) {
  console.log('Potential savings:', unusedCss.displayValue);
  unusedCss.details.items.slice(0, 5).forEach(item => {
    console.log(' -', item.url ? item.url.substring(0, 60) : 'N/A', '| wasted:', Math.round(item.wastedBytes/1024) + 'KB');
  });
}

console.log('\n=== Unused JavaScript ===');
const unusedJs = audits['unused-javascript'];
if (unusedJs && unusedJs.details && unusedJs.details.items) {
  console.log('Potential savings:', unusedJs.displayValue);
  unusedJs.details.items.slice(0, 5).forEach(item => {
    console.log(' -', item.url ? item.url.substring(0, 60) : 'N/A', '| wasted:', Math.round(item.wastedBytes/1024) + 'KB');
  });
}

console.log('\n=== Main Thread Work ===');
const mainThread = audits['mainthread-work-breakdown'];
if (mainThread && mainThread.details && mainThread.details.items) {
  mainThread.details.items.slice(0, 5).forEach(item => {
    console.log(' -', item.group, ':', Math.round(item.duration) + 'ms');
  });
}

console.log('\n=== Performance Opportunities ===');
const opportunities = [
  'unused-css-rules',
  'unused-javascript',
  'render-blocking-resources',
  'uses-optimized-images',
  'uses-webp-images',
  'offscreen-images',
  'uses-responsive-images',
  'efficient-animated-content',
  'duplicated-javascript',
  'legacy-javascript'
];

opportunities.forEach(id => {
  const audit = audits[id];
  if (audit && audit.score !== null && audit.score < 1) {
    console.log(' -', audit.title, ':', audit.displayValue || 'needs attention', '(score:', audit.score, ')');
  }
});

console.log('\n=== Server Response Time ===');
const serverResponse = audits['server-response-time'];
if (serverResponse) {
  console.log('TTFB:', serverResponse.displayValue);
}

console.log('\n=== Third Party Usage ===');
const thirdParty = audits['third-party-summary'];
if (thirdParty && thirdParty.details && thirdParty.details.items) {
  thirdParty.details.items.slice(0, 5).forEach(item => {
    console.log(' -', item.entity, '| blocking:', item.blockingTime + 'ms', '| size:', Math.round(item.transferSize/1024) + 'KB');
  });
}
