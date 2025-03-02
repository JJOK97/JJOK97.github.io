source "https://rubygems.org"

# tale 테마 유지
gemspec

# 추가 플러그인
group :jekyll_plugins do
  gem "jekyll-paginate"
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-redirect-from"  # URL 리다이렉션 관리
  gem "jemoji"                # GitHub 스타일 이모지 지원
  gem "jekyll-mentions"       # GitHub 스타일 @멘션 지원
end

# Windows 및 JRuby 호환성을 위한 설정
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Windows 성능 개선
gem "wdm", "~> 0.1", :platforms => [:mingw, :x64_mingw, :mswin]

# HTTP 파서
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

# Webrick (Ruby 3.0 이상 필요)
gem "webrick", "~> 1.7"

# 성능 개선
# 캐싱으로 빌드 속도 향상
gem "jekyll-include-cache" 