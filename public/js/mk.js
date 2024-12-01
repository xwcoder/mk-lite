const el = document.getElementById('mk')
const md = window.markdownit({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (e) {
        console.log(e)
      }
    }

    return ''; // use external default escaping
  }
})

md.use(window.markdownItAnchor, {
  permalink: window.markdownItAnchor.permalink.class
})
  .use(window.markdownItTocDoneRight)
  // .use(window.katex)

el.innerHTML = md.render(content)
