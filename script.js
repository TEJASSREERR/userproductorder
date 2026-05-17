// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get all required elements
    const textElement = document.getElementById("text");
    const titleElement = document.getElementById("title");
    const btnText = document.getElementById("btn-text");
    const btnColor = document.getElementById("btn-color");

    // Change Text Button Click Handler
    btnText.addEventListener('click', function() {
        // Change the text content
        textElement.textContent = "Text Changed Successfully!";
        
        // Add Tailwind animation class
        textElement.classList.add('animate-pulse');
        
        // Remove animation after 1 second
        setTimeout(() => {
            textElement.classList.remove('animate-pulse');
        }, 1000);
    });

    // Change Color Button Click Handler
    btnColor.addEventListener('click', function() {
        // Array of Tailwind color classes
        const colors = [
            'text-blue-600', 
            'text-red-600', 
            'text-purple-600', 
            'text-pink-600', 
            'text-indigo-600', 
            'text-teal-600'
        ];
        
        // Remove any existing color classes from the title
        colors.forEach(color => titleElement.classList.remove(color));
        
        // Pick a random color from the array
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Apply the random color to the title
        titleElement.classList.add(randomColor);
        
        // Add scale animation
        titleElement.classList.add('scale-110');
        
        // Remove scale animation after 300ms
        setTimeout(() => {
            titleElement.classList.remove('scale-110');
        }, 300);
    });

});