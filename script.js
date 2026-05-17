// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get elements
    const textElement = document.getElementById("text");
    const titleElement = document.getElementById("title");
    const btnText = document.getElementById("btn-text");
    const btnColor = document.getElementById("btn-color");

    // Change Text functionality
    btnText.addEventListener('click', function() {
        textElement.textContent = "Text Changed Successfully!";
        
        // Add Tailwind animation classes
        textElement.classList.add('animate-pulse');
        setTimeout(() => {
            textElement.classList.remove('animate-pulse');
        }, 1000);
    });

    // Change Color functionality - Cycles through responsive colors
    btnColor.addEventListener('click', function() {
        const colors = [
            'text-blue-600', 
            'text-red-600', 
            'text-purple-600', 
            'text-pink-600', 
            'text-indigo-600', 
            'text-teal-600',
            'text-orange-600',
            'text-cyan-600'
        ];
        
        // Remove existing color classes
        colors.forEach(color => titleElement.classList.remove(color));
        
        // Add random color
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        titleElement.classList.add(randomColor);
        
        // Add scale animation
        titleElement.classList.add('scale-110');
        setTimeout(() => {
            titleElement.classList.remove('scale-110');
        }, 300);
    });

});