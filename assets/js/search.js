document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    let posts = [];

    fetch('/search.json')
        .then((response) => response.json())
        .then((data) => {
            posts = data;
        });

    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();

        if (searchTerm.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        const results = posts.filter((post) => {
            const titleMatch = post.title.toLowerCase().includes(searchTerm);
            const contentMatch = post.content.toLowerCase().includes(searchTerm);
            return titleMatch || contentMatch;
        });

        displayResults(results);
    });

    function displayResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="search-no-results">No results found</p>';
            return;
        }

        const html = results
            .map(
                (post) => `
            <div class="search-result-item">
                <h3><a href="${post.url}">${post.title}</a></h3>
                <span class="search-result-date">${post.date}</span>
                <p>${post.content.substring(0, 150)}...</p>
            </div>
        `,
            )
            .join('');

        searchResults.innerHTML = html;
    }
});
