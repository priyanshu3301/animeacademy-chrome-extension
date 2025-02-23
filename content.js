let isProcessing = false; // Flag to track if the function is processing
console.log($);
// Select all anchor tags with href starting with the base URL
const anchors = document.querySelectorAll('a[href^="https://aatdl.xyz/archives/"]');
anchors.forEach(anchor => {

    anchor.addEventListener('click', event => {
        // Prevent the default action
        event.preventDefault();

        // If the function is already processing, exit early
        if (isProcessing) {
        return;
        }

        isProcessing = true; // Set the flag to indicate that the function is running

        const href = event.target.getAttribute('href');
        const parentDiv = event.target.closest('div'); // Find the closest <div> ancestor

        // Assuming addNewDiv() creates a new div inside parentDiv and returns the new div's ID
        addNewDiv(parentDiv);

        const iddiv = parentDiv.id;
        const DivId = iddiv.split('-').pop();

        // Now send the data to the background using the href
        sendDataToBackground(href)
            .then(response => {
                DivAdd(DivId, response);
            })
            .catch(error => {
             // Handle any error that occurs during the promise
                console.error('Error sending data:', error);
            })
            .finally(() => {
                // Reset the flag once the function finishes
                isProcessing = false;
        });
    });

});


// Function to send data to background.js
function sendDataToBackground(data) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: "SEND_DATA", payload: data }, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(response); // Resolve the promise with the response
            }
        });
    });
}



async function addNewDiv(parentDiv){
    const iddiv = parentDiv.id;
    const DivId = iddiv.split('-').pop();
    const divToRemove = document.getElementById(DivId);
    if (divToRemove) {
        $('#' + DivId).slideUp(500, function() { // 400 is the duration for the slideUp animation
            divToRemove.innerHTML = ""; // Remove the div after the animation completes
        });

 
    }
    else{
        //Create a new div
        const newDiv = document.createElement('div');
        newDiv.id = DivId;
        parentDiv.appendChild(newDiv);
        $('#' + DivId).slideUp();
    }
    return DivId;

}

function DivAdd(DivId,jsonData){
    const fileList = document.getElementById(DivId);
    const BaseUrl = jsonData.BaseUrl;

    jsonData.data.files.forEach(file => {
        const size = parseInt(file.size / 1048576);
        const fileDiv = document.createElement("div");
        fileDiv.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 5px; border: 1px solid #ccc; border-radius: 5px; margin-top: 5px;";
  
        fileDiv.innerHTML = `
            <span style="font-weight: bold;">${file.name}</span>
            <span style="color: gray;">${size} MB</span>
            <a href="${BaseUrl+file.link}" style="text-decoration: none; background-color: #4CAF50; color: white; padding: 5px 10px; border-radius: 3px;"
            onmouseover="this.style.backgroundColor='#45a049';" 
            onmouseout="this.style.backgroundColor='#4CAF50';">Download</a>`;
  
        fileList.appendChild(fileDiv);
      });
      $('#' + DivId).slideDown(500);
}
