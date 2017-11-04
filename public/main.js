/* eslint-disable */
var $timelines = Array.prototype.slice.apply(document.querySelectorAll('.timeline'));
$timelines.forEach(function ($timeline) {
  var total = 0;
  var $rects = Array.prototype.slice.apply($timeline.querySelectorAll('svg rect'));
  $rects.forEach(function ($rect, idx) {
    var count = $rect.getAttribute('data-count');
    var date = $rect.getAttribute('data-date');
    total += count * 1;
    $rect.addEventListener('mouseenter', function (evt) {
      var $tip = document.createElement('div');
      $tip.className = 'svg-tip';
      $tip.innerHTML = '<strong>' + count + '</strong> (' + date + ')';
      document.body.appendChild($tip);
      var tipBCR = $tip.getBoundingClientRect()
      var rectBCR = $rect.getBoundingClientRect();
      $tip.style.left = (rectBCR.left - tipBCR.width / 2 + 6) + 'px';
      $tip.style.top = (rectBCR.top - tipBCR.height - 10) + 'px';
    });
    $rect.addEventListener('mouseleave', function () {
      var $tip = document.querySelector('.svg-tip');
      document.body.removeChild($tip);
    });
  });
  $timeline.querySelector('.timeline-total').innerHTML = total;
});
