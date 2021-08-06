/** 
 * from: https://jekyllcodex.org/without-plugin/metrics/Z 
 * (use multi-line comment because compression causes single line to comment out entire file)
 * */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', '{{ site.ga_tracking }}']);
_gaq.push(['_gat._forceSSL']);
_gaq.push(['_gat._anonymizeIp']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
