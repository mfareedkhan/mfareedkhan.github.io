# Keep the footer's original theme markup while customizing only its separator.
Jekyll::Hooks.register :pages, :post_render do |page|
  next unless page.output_ext == ".html"

  page.output = page.output.gsub(/(<footer\b[^>]*>.*?<\/footer>)/m) do |footer|
    footer.sub(/(Muhammad\s+Fareed)\.\s+(MS Data Science)/, '\\1, \\2')
  end
end
