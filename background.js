chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SEND_DATA") {
    console.log("Received data from content.js:", message.payload);
    
    // Call the async function and handle the result
    firstFetch(message.payload)
      .then((link) => {
        sendResponse(link); // Send the result back to content.js
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        sendResponse({ error: error.message }); // Send the error back to content.js
      });
    return true;
  }
});

  
async function firstFetch(url){
  const proxy =  `https://my-worker.sad282.workers.dev/?id=${url}`
  const response = await fetch(proxy);
  const html = await response.text();
  return extractIframeLinksFromHTML(html);
}

function extractIframeLinksFromHTML(html) {
  // Use regex to find all <iframe> tags and extract their src attributes
  const iframeRegex = /<iframe[^>]*src="([^"]*)"/gi;
  const links = [];
  let match;

  while ((match = iframeRegex.exec(html)) !== null) {
    links.push(match[1]); // Push the src value into the array
  }

  return fetchMultipleLinksWithPost(links); // Return all iframe links
}

async function fetchMultipleLinksWithPost(links) {
  const payload = {id: "", type: "folder", password: "", page_token: "", page_index: 0};
  const link = links[1];
  try {
    // Use Promise.all to make POST requests to all links simultaneously
    const response = await fetch(link, {
          method: "POST", // Set the HTTP method to POST
          headers: {
            "Content-Type": "application/json", // Specify JSON content type
          },
          body: JSON.stringify(payload), // Send the JSON body
        });

    const json = await response.json();
    const baseUrl = new URL(link).origin;
    json.BaseUrl = baseUrl;
    return json // Assuming the response is in JSON format
 // An array of JSON data from both links
  } catch (error) {
    console.error("Error fetching links:", error.message);
    return []; // Return an empty array if any fetch fails
  }
}










