async function identifyBrowserTab() {
    return new Promise((resolve) => {
        // identify current active browser tab
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, async (tabs) => {
            const tab = tabs[0];

            // execute script in the context of the current tab
            const result = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => {
                    const links = document.links;
                    const linkArray = [];

                    for (let i = 0; i < links.length; i++) {
                        linkArray.push(links[i].href);
                    }
                    return linkArray;
                }
            });

            // result[0] contains the return value of the executed script
            const returningArray = result[0];
            resolve(returningArray);
        });
    });
}

// function returnAllLinks() {
//     let returnLinks = []
//     identifyBrowserTab().then((links) => {
//         returnLinks = links['result'];
//         console.log("Line 35")
//         console.log(returnLinks); // Array of link values
//     });
// }


