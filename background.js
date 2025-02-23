chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SEND_DATA") {
    console.log("Received data from content.js:", message.payload);
    
    Fetch(message.payload)
      .then((json) => {
        sendResponse(json);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        sendResponse({ error: error.message });
      });

    return true; // Keep the message channel open for async response
  }
});

function getRandomDomain() {
  const domains = [
    "https://lksfy.in/",
    "https://lksfy.com/",
    "https://lordslink.in/",
    "https://droplink.co/",
    "https://go.primeurl.in/",
    "https://open.primeurl.in/",
    "https://get.kingurl.in/",
    "https://linkshortify.in/",
    "https://vnshortener.com/",
    "https://hindianimeworld.com/",
    "https://publicearn.com/",
    "https://go.kingurl.in/",
    "https://try2link.com/"
  ];
  
  return domains[Math.floor(Math.random() * domains.length)];
}

async function Fetch(url) {
  const ref = getRandomDomain();
  const proxy = `https://shy-dawn-eba4.sad282.workers.dev/?id=${url}&ref=${ref}`;
  const response = await fetch(proxy);
  return await response.json();
}
