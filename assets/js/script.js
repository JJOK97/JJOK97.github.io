'use strict';

// element toggle function
const elementToggleFunc = function (elem) {
    elem.classList.toggle('active');
};

// 글로벌 DOM 참조
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
const navButtons = document.querySelectorAll('[data-nav-link]');
const contentContainer = document.getElementById('content-container');

// 사이드바 토글
sidebarBtn.addEventListener('click', function () {
    elementToggleFunc(sidebar);
});

// 페이지 로드 함수
function loadPage(pageName) {
    fetch(`./pages/${pageName}.html`)
        .then((response) => {
            if (!response.ok) throw new Error('Page not found');
            return response.text();
        })
        .then((html) => {
            contentContainer.innerHTML = html;

            const loadedArticle = contentContainer.querySelector(`article[data-page="${pageName}"]`);
            if (loadedArticle) {
                loadedArticle.classList.add('active');
            }

            if (pageName === 'blog') {
                loadBlogCategories();
            } else if (pageName === 'portfolio') {
                loadProjects();
            } else if (pageName === 'about') {
                displayTopProjects();
            }

            initPage();
        })
        .catch((err) => {
            console.error(err);
            contentContainer.innerHTML = '<p>페이지 로딩 중 오류가 발생했습니다.</p>';
        });
}

// 상위 5개 프로젝트 표시
function displayTopProjects() {
    const projectsList = document.querySelector('.testimonials-list');

    fetch('./project.json')
        .then((response) => response.json())
        .then((data) => {
            const topProjects = data.projects.slice(0, 5); // 상위 5개만 선택

            topProjects.forEach((project) => {
                const li = document.createElement('li');
                li.className = 'project-item';

                li.innerHTML = `
                    <a href="${project.file}" class="project-link">
                        <figure class="project-img">
                            <div class="project-item-icon-box">
                                <ion-icon name="eye-outline"></ion-icon>
                            </div>
                            <img src="${project.image}" alt="${project.title}" loading="lazy">
                        </figure>
                        <div class="project-content">
                            <div class="blog-meta">
                                <p class="blog-category">${project.category}</p>
                                <span class="dot"></span>
                                <time datetime="${project.date}">${new Date(project.date).toLocaleDateString()}</time>
                            </div>
                            <h4 class="project-title">${project.title}</h4>
                            <p class="project-description">${project.description}</p>
                        </div>
                    </a>
                `;

                projectsList.appendChild(li);
            });
        })
        .catch((error) => console.error('JSON 데이터를 가져오는 중 오류:', error));
}

// DOMContentLoaded 시 실행
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(() => {
        const projectsList = document.querySelector('.testimonials-list');
        if (projectsList) {
            observer.disconnect();
        }
    });

    const targetNode = document.body; // body를 감시
    observer.observe(targetNode, { childList: true, subtree: true });
});

function loadBlogCategories() {
    fetch('./posts.json')
        .then((res) => res.json())
        .then((data) => {
            const categoriesList = document.getElementById('blog-categories-list');
            if (!categoriesList) return;

            data.categories.forEach((category) => {
                const li = document.createElement('li');
                li.className = 'category-item';

                li.innerHTML = `
                    <a href="#" class="category-link">
                        <figure class="category-banner-box">
                            <img src="${category.image}" alt="${category.title}" loading="lazy">
                        </figure>

                        <div class="category-content">
                            <h3 class="h3 category-title">${category.title}</h3>
                            <p class="category-description">${category.description}</p>
                            
                            <div class="category-meta">
                                <span class="post-count">${category.posts.length}개의 포스트</span>
                            </div>
                        </div>
                    </a>
                `;

                categoriesList.appendChild(li);

                // 카테고리 클릭 이벤트 처리
                const link = li.querySelector('.category-link');
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadCategoryPosts(category);
                });
            });
        })
        .catch((err) => console.error('카테고리 로딩 오류:', err));
}

function loadCategoryPosts(category) {
    const blogCategories = document.querySelector('.blog-categories');
    const blogPosts = document.querySelector('.blog-posts');
    const blogTitle = document.getElementById('blog-title');
    const categoryDescription = blogPosts.querySelector('.category-description');
    const postsContainer = document.getElementById('blog-posts-list');

    // 타이틀 업데이트
    blogTitle.textContent = category.title;
    categoryDescription.textContent = category.description;

    // 게시글 목록 초기화 및 생성
    postsContainer.innerHTML = '';

    category.posts.forEach((post) => {
        const li = document.createElement('li');
        li.className = 'blog-post-item';

        li.innerHTML = `
            <a class="post-link">
                <h3 class="post-title">${post.title}</h3>
                <p class="post-summary">${post.summary}</p>
                <div class="post-meta">
                    <time class="post-date" datetime="${post.date}">
                        ${new Date(post.date).toLocaleDateString()}
                    </time>
                    <div class="post-tags">
                        ${post.tags.map((tag) => `<span class="post-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
        `;

        postsContainer.appendChild(li);

        const link = li.querySelector('.post-link');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadBlogPostDetail(category.id, post);
        });
    });

    // 화면 전환
    blogCategories.style.display = 'none';
    blogPosts.style.display = 'block';
}

function loadBlogPostDetail(categoryId, post) {
    const blogPosts = document.querySelector('.blog-posts');
    const postDetail = document.querySelector('.post-detail');
    const detailContainer = document.getElementById('post-detail-container');

    detailContainer.innerHTML = `
    <div class="blog-detail">
        <header class="blog-detail-header">
            <h3 class="h3 detail-title">${post.title}</h3>
            <div class="detail-meta">
                <time datetime="${post.date}">${new Date(post.date).toLocaleDateString()}</time>
                <div class="detail-tags">
                    ${post.tags.map((tag) => `<span class="detail-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </header>
        
        <div class="blog-detail-content markdown-body">
            <!-- 마크다운 내용이 여기에 렌더링됨 -->
        </div>
  
        <div class="post-footer">
            <hr class="divider" />
            <div class="post-footer-content">
                <button class="back-to-posts">
                    <span class="back-text">목록으로</span>
                </button>
                <p class="footer-date">마지막 업데이트: ${post.date}</p>
            </div>
        </div>
    </div>
  `;

    // 마크다운 내용 불러오기
    fetch(`./pages/blog/${post.content}`)
        .then((res) => res.text())
        .then((markdown) => {
            const contentHtml = marked.parse(markdown);
            detailContainer.querySelector('.markdown-body').innerHTML = contentHtml;
            // 코드 블록에 하이라이팅 적용
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        });

    // 뒤로가기 버튼 이벤트
    const backBtn = detailContainer.querySelector('.back-to-posts');
    backBtn.addEventListener('click', () => {
        postDetail.style.display = 'none';
        blogPosts.style.display = 'block';
    });

    // 화면 전환
    blogPosts.style.display = 'none';
    postDetail.style.display = 'block';
}

// 페이지 로드 시 카테고리 목록 표시
document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('[data-page="blog"]')) {
        loadBlogCategories();
    }
});

function loadProjects() {
    fetch('./project.json')
        .then((res) => res.json())
        .then((data) => {
            const projectList = contentContainer.querySelector('#project-list');
            if (!projectList) return;

            data.projects.forEach((project) => {
                const li = document.createElement('li');
                li.classList.add('project-item', 'active');
                li.setAttribute('data-filter-item', '');
                li.setAttribute('data-category', project.category.toLowerCase());

                li.innerHTML = `
          <a href="#" class="project-link">
            <figure class="project-img">
              <div class="project-item-icon-box">
                <ion-icon name="eye-outline"></ion-icon>
              </div>
              <img src="${project.image}" alt="${project.title}" loading="lazy">
            </figure>
              <div class="blog-meta">
                <p class="blog-category">${project.category}</p>
                <span class="dot"></span>
                <time datetime="${project.date}">${new Date(project.date).toLocaleDateString()}</time>
              </div>
            <h3 class="project-title">${project.title}</h3>
          </a>
        `;
                projectList.appendChild(li);

                const link = li.querySelector('.project-link');
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    loadProjectDetail(project.file);
                });
            });

            initializeFilters();
        })
        .catch((err) => console.error('프로젝트 로딩 오류:', err));
}

function loadProjectDetail(file) {
    const projectName = file.split('/')[0];

    fetch(`./pages/portfolio/${projectName}/index.html`)
        .then((res) => res.text())
        .then((html) => {
            const projectList = contentContainer.querySelector('#project-list');
            const detailContainer = contentContainer.querySelector('#project-detail-container');
            const projectsSection = document.querySelector('.projects');
            const filterList = projectsSection.querySelector('.filter-list');
            const filterSelectBox = projectsSection.querySelector('.filter-select-box');
            const portfolioSection = document.querySelector('.portfolio');
            const articleTitle = portfolioSection.querySelector('.article-title');

            if (!detailContainer || !projectList) return;

            articleTitle.style.display = 'none';
            filterList.style.display = 'none';
            filterSelectBox.style.display = 'none';
            projectList.style.display = 'none';
            detailContainer.innerHTML = html;
            detailContainer.style.display = 'block';

            initializeProjectNav(projectName);
            loadProjectSection('overview', projectName);
        })
        .catch((err) => console.error('프로젝트 상세 로딩 오류:', err));
}

function initializeProjectNav(projectName) {
    const sectionBtns = document.querySelectorAll('[data-section-btn]');

    sectionBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            sectionBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const section = btn.getAttribute('data-section');
            loadProjectSection(section, projectName);
        });
    });
}

function loadProjectSection(sectionName, projectName) {
    fetch(`./pages/portfolio/${projectName}/${sectionName}.html`)
        .then((res) => res.text())
        .then((html) => {
            const sectionContent = document.getElementById('section-content');
            if (sectionContent) {
                sectionContent.innerHTML = html;
            }
        })
        .catch((err) => console.error(`섹션 로딩 오류: ${sectionName}`, err));
}

function returnToPortfolio() {
    const projectList = contentContainer.querySelector('#project-list');
    const detailContainer = contentContainer.querySelector('#project-detail-container');
    const projectsSection = document.querySelector('.projects');
    const filterList = projectsSection.querySelector('.filter-list');
    const filterSelectBox = projectsSection.querySelector('.filter-select-box');
    const portfolioSection = document.querySelector('.portfolio');
    const articleTitle = portfolioSection.querySelector('.article-title');

    detailContainer.style.display = 'none';
    articleTitle.style.display = 'block';
    filterList.style.display = 'flex';
    filterSelectBox.style.display = 'block';
    projectList.style.display = 'grid';
}

function initializeFilters() {
    const select = contentContainer.querySelector('[data-select]');
    const selectItems = contentContainer.querySelectorAll('[data-select-item]');
    const selectValue = contentContainer.querySelector('[data-selecct-value]');
    const filterBtn = contentContainer.querySelectorAll('[data-filter-btn]');
    const filterItems = contentContainer.querySelectorAll('[data-filter-item]');

    function filterFunc(selectedValue) {
        filterItems.forEach((item) => {
            if (selectedValue === 'all') {
                item.classList.add('active');
            } else if (selectedValue === item.dataset.category) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    if (select) {
        select.addEventListener('click', function () {
            elementToggleFunc(this);
        });
    }

    let lastClickedBtn = null;

    if (selectItems && selectItems.length > 0 && selectValue) {
        selectItems.forEach((item) => {
            item.addEventListener('click', function () {
                const selectedVal = this.innerText.toLowerCase();
                selectValue.innerText = this.innerText;
                elementToggleFunc(select);
                filterFunc(selectedVal);
            });
        });
    }

    if (filterBtn && filterBtn.length > 0) {
        filterBtn.forEach((btn) => {
            btn.addEventListener('click', function () {
                const selectedVal = this.innerText.toLowerCase();
                selectValue.innerText = this.innerText;
                filterFunc(selectedVal);

                if (lastClickedBtn) {
                    lastClickedBtn.classList.remove('active');
                }
                this.classList.add('active');
                lastClickedBtn = this;
            });
        });
    }
}

function initPage() {
    const testimonialsItem = contentContainer.querySelectorAll('[data-testimonials-item]');
    const modalContainer = contentContainer.querySelector('[data-modal-container]');
    const modalCloseBtn = contentContainer.querySelector('[data-modal-close-btn]');
    const overlay = contentContainer.querySelector('[data-overlay]');
    const modalImg = contentContainer.querySelector('[data-modal-img]');
    const modalTitle = contentContainer.querySelector('[data-modal-title]');
    const modalText = contentContainer.querySelector('[data-modal-text]');

    const form = contentContainer.querySelector('[data-form]');
    const formInputs = contentContainer.querySelectorAll('[data-form-input]');
    const formBtn = contentContainer.querySelector('[data-form-btn]');

    function testimonialsModalFunc() {
        if (modalContainer && overlay) {
            modalContainer.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    }

    if (testimonialsItem && testimonialsItem.length > 0) {
        testimonialsItem.forEach((item) => {
            item.addEventListener('click', function () {
                if (modalImg && modalTitle && modalText) {
                    const avatar = this.querySelector('[data-testimonials-avatar]');
                    const title = this.querySelector('[data-testimonials-title]');
                    const text = this.querySelector('[data-testimonials-text]');

                    if (avatar) {
                        modalImg.src = avatar.src;
                        modalImg.alt = avatar.alt;
                    }
                    if (title) modalTitle.innerHTML = title.innerHTML;
                    if (text) modalText.innerHTML = text.innerHTML;

                    testimonialsModalFunc();
                }
            });
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', testimonialsModalFunc);
    }

    if (overlay) {
        overlay.addEventListener('click', testimonialsModalFunc);
    }

    if (form && formInputs && formBtn) {
        formInputs.forEach((input) => {
            input.addEventListener('input', function () {
                if (form.checkValidity()) {
                    formBtn.removeAttribute('disabled');
                } else {
                    formBtn.setAttribute('disabled', '');
                }
            });
        });
    }
}

// DOMContentLoaded 시 초기 about 페이지 로드
document.addEventListener('DOMContentLoaded', function () {
    loadPage('about');

    navButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const page = btn.getAttribute('data-page');
            navButtons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            loadPage(page);
        });
    });

    hljs.configure({
        languages: ['java', 'javascript', 'python', 'sql', 'html', 'css'],
        tabReplace: '    ',
    });
    hljs.highlightAll();
});
