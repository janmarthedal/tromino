const CODE = `
<script async src="https://www.googletagmanager.com/gtag/js?id=__ID__"></script>
<script>window.dataLayer=window.dataLayer||[]
function gtag(){dataLayer.push(arguments)}
gtag('js', new Date())
gtag('config', '__ID__')
</script>`;

export default class GoogleAnalyticsPlugin {
  constructor ({ id }) {
    this.id = id;
  }
  apply (compiler) {
    compiler.hooks.compilation.tap('ga', compilation => {
      compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tap('ga', ({ html }) => ({
        html: html.replace('</body>', CODE.replace(/__ID__/g, this.id) + '</body>')
      }));
    });
  }
}
