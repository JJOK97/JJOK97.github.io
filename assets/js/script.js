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
                loadBlogPosts();
            } else if (pageName === 'portfolio') {
                loadProjects();
            }

            initPage();
        })
        .catch((err) => {
            console.error(err);
            contentContainer.innerHTML = '<p>페이지 로딩 중 오류가 발생했습니다.</p>';
        });
}

function loadBlogPosts() {
    fetch('./posts.json')
        .then((res) => res.json())
        .then((data) => {
            const postList = contentContainer.querySelector('#blog-posts-list');
            if (!postList) return;

            const posts = data.posts.slice(0, 6);
            posts.forEach((post) => {
                const li = document.createElement('li');
                li.classList.add('blog-post-item');

                li.innerHTML = `
          <a href="#" class="post-link">
            <figure class="blog-banner-box">
              <img src="${post.image}" alt="${post.title}" loading="lazy">
            </figure>
            <div class="blog-content">
              <h3 class="h3 blog-item-title">${post.title}</h3>
              <p class="blog-text">${post.description}</p>
            </div>
          </a>
        `;
                postList.appendChild(li);

                const link = li.querySelector('.post-link');
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    loadBlogPostDetail(post.file);
                });
            });
        })
        .catch((err) => console.error('블로그 포스트 로딩 오류:', err));
}

function loadBlogPostDetail(file) {
    fetch(`./pages/blog/${file}`)
        .then((res) => res.text())
        .then((html) => {
            const detailContainer = contentContainer.querySelector('#post-detail-container');
            const blogPostsSection = contentContainer.querySelector('.blog-posts');
            const postDetailSection = contentContainer.querySelector('.post-detail');

            if (!detailContainer || !blogPostsSection || !postDetailSection) return;

            blogPostsSection.style.display = 'none';
            detailContainer.innerHTML = html;

            const blogPostDetailArticle = detailContainer.querySelector('.blog-post-detail');
            if (blogPostDetailArticle) {
                blogPostDetailArticle.classList.add('active');
            }

            postDetailSection.style.display = 'block';
        })
        .catch((err) => console.error('포스트 상세 로딩 오류:', err));
}

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
    const projectName = file.split('/')[0]; // fitnect/index.html -> fitnect

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
});
