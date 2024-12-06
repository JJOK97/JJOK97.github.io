'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// 글로벌 DOM 참조
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
const navButtons = document.querySelectorAll("[data-nav-link]");
const contentContainer = document.getElementById("content-container");

// 사이드바 토글
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// 페이지 로드 함수
function loadPage(pageName) {
  fetch(`./pages/${pageName}.html`)
    .then(response => {
      if (!response.ok) throw new Error("Page not found");
      return response.text();
    })
    .then(html => {
      contentContainer.innerHTML = html;

      // 로드된 article에 active 클래스 추가
      const loadedArticle = contentContainer.querySelector(`article[data-page="${pageName}"]`);
      if (loadedArticle) {
        loadedArticle.classList.add('active');
      }

      // 페이지별 추가 데이터 로딩
      if (pageName === 'blog') {
        loadBlogPosts();
      } else if (pageName === 'portfolio') {
        loadProjects();
      }

      initPage();
    })
    .catch(err => {
      console.error(err);
      contentContainer.innerHTML = "<p>페이지 로딩 중 오류가 발생했습니다.</p>";
    });
}

// 블로그 게시글 로딩 함수
function loadBlogPosts() {
  fetch('./posts.json')
    .then(res => res.json())
    .then(data => {
      const postList = contentContainer.querySelector('#blog-posts-list');
      if (!postList) return;

      const posts = data.posts.slice(0, 6);
      posts.forEach(post => {
        const li = document.createElement('li');
        li.classList.add('blog-post-item');

        li.innerHTML = `
          <a href="#" class="post-link">
            <figure class="blog-banner-box">
              <img src="${post.image}" alt="${post.title}" loading="lazy">
            </figure>
            <div class="blog-content">
              <div class="blog-meta">
                <p class="blog-category">${post.category}</p>
                <span class="dot"></span>
                <time datetime="${post.date}">${new Date(post.date).toLocaleDateString()}</time>
              </div>
              <h3 class="h3 blog-item-title">${post.title}</h3>
              <p class="blog-text">게시글에 대한 짧은 설명을 여기에 작성할 수 있습니다.</p>
            </div>
          </a>
        `;
        postList.appendChild(li);

        // 각 게시글에 클릭 이벤트 등록
        const link = li.querySelector('.post-link');
        link.addEventListener('click', (event) => {
          event.preventDefault();
          loadBlogPostDetail(post.file);
        });
      });
    })
    .catch(err => console.error("블로그 포스트 로딩 오류:", err));
}

// 상세 게시글 로딩 함수
function loadBlogPostDetail(file) {
  fetch(`./pages/blog/${file}`)
    .then(res => res.text())
    .then(html => {
      const detailContainer = contentContainer.querySelector('#post-detail-container');
      const blogPostsSection = contentContainer.querySelector('.blog-posts');
      const postDetailSection = contentContainer.querySelector('.post-detail');

      if (!detailContainer || !blogPostsSection || !postDetailSection) return;

      blogPostsSection.style.display = 'none';
      detailContainer.innerHTML = html;

      // 여기서 blog-post-detail article에 active 클래스 추가
      const blogPostDetailArticle = detailContainer.querySelector('.blog-post-detail');
      if (blogPostDetailArticle) {
        blogPostDetailArticle.classList.add('active');
      }

      postDetailSection.style.display = 'block';
    })
    .catch(err => console.error("포스트 상세 로딩 오류:", err));
}

function loadProjects() {
  fetch('./project.json')
    .then(res => res.json())
    .then(data => {
      const projectList = contentContainer.querySelector('#project-list');
      if (!projectList) return;

      data.projects.forEach(project => {
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
            <h3 class="project-title">${project.title}</h3>
            <p class="project-category">${project.category}</p>
          </a>
        `;
        projectList.appendChild(li);

        const link = li.querySelector('.project-link');
        link.addEventListener('click', (event) => {
          event.preventDefault();
          loadProjectDetail(project.file);
        });
      });
    })
    .catch(err => console.error("프로젝트 로딩 오류:", err));
}

function loadProjectDetail(file) {
  fetch(`./pages/portfolio/${file}`)
    .then(res => res.text())
    .then(html => {
      const projectList = contentContainer.querySelector('#project-list');
      const detailContainer = contentContainer.querySelector('#project-detail-container');

      const projectsSection = document.querySelector('.projects');

      const filterList = projectsSection.querySelector('.filter-list');
      const filterSelectBox = projectsSection.querySelector('.filter-select-box');

      if (!detailContainer || !projectList) return;

      filterList.style.display = 'none';
      filterSelectBox.style.display = 'none';
      projectList.style.display = 'none';
      detailContainer.innerHTML = html;
      detailContainer.style.display = 'block';
    })
    .catch(err => console.error("프로젝트 상세 로딩 오류:", err));
}


// 페이지 초기화 함수: 로드된 페이지 내 요소들을 다시 바인딩
function initPage() {
  const testimonialsItem = contentContainer.querySelectorAll("[data-testimonials-item]");
  const modalContainer = contentContainer.querySelector("[data-modal-container]");
  const modalCloseBtn = contentContainer.querySelector("[data-modal-close-btn]");
  const overlay = contentContainer.querySelector("[data-overlay]");
  const modalImg = contentContainer.querySelector("[data-modal-img]");
  const modalTitle = contentContainer.querySelector("[data-modal-title]");
  const modalText = contentContainer.querySelector("[data-modal-text]");

  const select = contentContainer.querySelector("[data-select]");
  const selectItems = contentContainer.querySelectorAll("[data-select-item]");
  const selectValue = contentContainer.querySelector("[data-selecct-value]");
  const filterBtn = contentContainer.querySelectorAll("[data-filter-btn]");
  const filterItems = contentContainer.querySelectorAll("[data-filter-item]");

  const form = contentContainer.querySelector("[data-form]");
  const formInputs = contentContainer.querySelectorAll("[data-form-input]");
  const formBtn = contentContainer.querySelector("[data-form-btn]");

  const pages = contentContainer.querySelectorAll("[data-page]");
  const navigationLinks = document.querySelectorAll("[data-nav-link]");

  function testimonialsModalFunc() {
    if(modalContainer && overlay) {
      modalContainer.classList.toggle("active");
      overlay.classList.toggle("active");
    }
  }

  if(testimonialsItem && testimonialsItem.length > 0) {
    for (let i = 0; i < testimonialsItem.length; i++) {
      testimonialsItem[i].addEventListener("click", function () {
        if (modalImg && modalTitle && modalText) {
          const avatar = this.querySelector("[data-testimonials-avatar]");
          const title = this.querySelector("[data-testimonials-title]");
          const text = this.querySelector("[data-testimonials-text]");

          if (avatar) {
            modalImg.src = avatar.src;
            modalImg.alt = avatar.alt;
          }
          if (title) modalTitle.innerHTML = title.innerHTML;
          if (text) modalText.innerHTML = text.innerHTML;

          testimonialsModalFunc();
        }
      });
    }
  }

  if(modalCloseBtn) {
    modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  }

  if(overlay) {
    overlay.addEventListener("click", testimonialsModalFunc);
  }

  function filterFunc(selectedValue) {
    if(filterItems) {
      for (let i = 0; i < filterItems.length; i++) {
        if (selectedValue === "all") {
          filterItems[i].classList.add("active");
        } else if (selectedValue === filterItems[i].dataset.category) {
          filterItems[i].classList.add("active");
        } else {
          filterItems[i].classList.remove("active");
        }
      }
    }
  }

  if(select) {
    select.addEventListener("click", function () { elementToggleFunc(this); });
  }

  let lastClickedBtn = (filterBtn && filterBtn.length > 0) ? filterBtn[0] : null;

  if(selectItems && selectItems.length > 0 && selectValue) {
    for (let i = 0; i < selectItems.length; i++) {
      selectItems[i].addEventListener("click", function () {
        let selectedVal = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedVal);
      });
    }
  }

  if(filterBtn && filterBtn.length > 0 && selectValue) {
    for (let i = 0; i < filterBtn.length; i++) {
      filterBtn[i].addEventListener("click", function () {
        let selectedVal = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedVal);

        if(lastClickedBtn) lastClickedBtn.classList.remove("active");
        this.classList.add("active");
        lastClickedBtn = this;
      });
    }
  }

  if(form && formInputs && formBtn) {
    for (let i = 0; i < formInputs.length; i++) {
      formInputs[i].addEventListener("input", function () {
        if (form.checkValidity()) {
          formBtn.removeAttribute("disabled");
        } else {
          formBtn.setAttribute("disabled", "");
        }
      });
    }
  }
  
}

// DOMContentLoaded 시 초기 about 페이지 로드
document.addEventListener("DOMContentLoaded", function() {
  loadPage('about');

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const page = btn.getAttribute("data-page");
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadPage(page);
    });
  });
});
