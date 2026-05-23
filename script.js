// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // 1. Intersection Observer for Fade-In Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // 2. Render Certifications from data.js
    const certGrid = document.getElementById('cert-grid');
    if (typeof myCertifications !== 'undefined' && myCertifications.length > 0) {
        myCertifications.forEach(cert => {
            const certCard = document.createElement('a');
            certCard.href = cert.file;
            certCard.target = '_blank';
            certCard.className = 'card fade-in';
            
            certCard.innerHTML = `
                <div class="card-content">
                    <div class="card-header">
                        <span style="font-size: 2rem;">${cert.icon || '📄'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </div>
                    <h3 class="card-title">${cert.title}</h3>
                    <p class="card-desc">Click to view official certificate PDF.</p>
                </div>
            `;
            
            certGrid.appendChild(certCard);
            observer.observe(certCard); // Observe new dynamic element
        });
    } else {
        certGrid.innerHTML = '<p style="color: var(--text-secondary);">No certifications available at the moment.</p>';
    }

    // 3. Fetch GitHub Projects Dynamically
    const githubUsername = 'Hassan-Saed'; // Automatically fetches your latest projects
    const projectsGrid = document.getElementById('projects-grid');
    
    async function fetchGitHubProjects() {
        try {
            const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=6`);
            if (!response.ok) throw new Error('Failed to fetch from GitHub');
            
            const repos = await response.json();
            
            // Filter out forks if desired, or just show the top updated
            const filteredRepos = repos.filter(repo => !repo.fork).slice(0, 6);
            
            projectsGrid.innerHTML = ''; // Clear loader
            
            if (filteredRepos.length === 0) {
                projectsGrid.innerHTML = '<p style="color: var(--text-secondary);">No public repositories found.</p>';
                return;
            }

            filteredRepos.forEach(repo => {
                const projectCard = document.createElement('a');
                projectCard.href = repo.html_url;
                projectCard.target = '_blank';
                projectCard.className = 'card fade-in';
                
                // Format description
                const desc = repo.description ? repo.description : 'No description provided.';
                const truncatedDesc = desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
                
                // Format topics or language
                const language = repo.language ? `<span>${repo.language}</span>` : '<span>Code</span>';

                projectCard.innerHTML = `
                    <div class="card-content">
                        <div class="card-header">
                            <svg class="folder-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </div>
                        <h3 class="card-title">${repo.name}</h3>
                        <p class="card-desc">${truncatedDesc}</p>
                        <div class="card-tech">
                            ${language}
                            <span>⭐ ${repo.stargazers_count}</span>
                        </div>
                    </div>
                `;
                
                projectsGrid.appendChild(projectCard);
                observer.observe(projectCard); // Observe new dynamic element
            });
            
        } catch (error) {
            console.error(error);
            projectsGrid.innerHTML = '<p style="color: red;">Failed to load projects from GitHub API. Please try again later.</p>';
        }
    }

    fetchGitHubProjects();
});
