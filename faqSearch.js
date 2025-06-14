// FAQ Search functionality
document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.querySelector('input[placeholder="Search for answers..."]');
    const faqItems = document.querySelectorAll('.bg-white.rounded-xl.shadow-lg');
    
    if(searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            faqItems.forEach(item => {
                const question = item.querySelector('button span').textContent.toLowerCase();
                const answer = item.querySelector('.p-6.border-t p').textContent.toLowerCase();
                
                if(question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});
