//initialising variables 
const loginPopup = document.getElementById('loginPopup');
const loginBtn = document.getElementById('loginBtn');
const closePopupBtn = document.getElementById('closePopup');
const usernameinput = document.getElementById('username');
const passwordinput = document.getElementById('password');
const submitBtn = document.getElementById('submit-button');
const editBtn = document.getElementById('pencil');
const saveBtn = document.getElementById('save');
const logoutBtn = document.getElementById('logoutBtn');
const subsForm = document.getElementById('subscribe-form');
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const subscriptionBtn = document.getElementById("subscriptionBtn");
const subsOutput = document.getElementById("subsOutput");

//creating functions for each component
loginBtn.addEventListener('click', openLoginPopup);
closePopupBtn.addEventListener('click', closeLoginPopup);
submitBtn.addEventListener('click', authenticateUser);
logoutBtn.addEventListener('click', logoutUser);
editBtn.addEventListener('click',editPageContent);
saveBtn.addEventListener('click', saveContent);
subscriptionBtn.addEventListener("click", storeSubscription);

//the code waits for the entire webpage to load in order to execute the laod content and userloggedinstatus funtions
window.addEventListener("load", () =>{
    loadContent();
    userLoggedinStatus();
});

// Fetching and Loading JSON content form the 2 files
fetchAndStoreJSON('content.json', 'content');
fetchAndStoreJSON('user.json', 'userData');
//'userData' is a key or identifier used to store the fetched JSON data in the local storage.
//Location where the fetched JSON data will be stored in the local storage.

function fetchAndStoreJSON(jsonFile, storageKey) {
//parameters: URL to the json, the key json data will be stored in the local storage
    fetch(jsonFile)
        .then(response => {//promise
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem(storageKey, JSON.stringify(data));//json can only store strings 
            console.log(`JSON data fetched from ${jsonFile} and stored in local storage with key ${storageKey}`);
        })
        .catch(error => console.error('There was a problem fetching the JSON:', error));
}

function openLoginPopup(){
    loginPopup.style.display = "flex";
}

function closeLoginPopup(){
    loginPopup.style.display = "none";
}

function authenticateUser() {
    //get data from input fields
    const username = usernameinput.value;
    const password = passwordinput.value;
    
    // Get the user data from the localStorage and parses it into a JavaScript object.
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    // Checks if the data exists
    if(userData && userData.users) {
        // Loop through the users array to find a match
        for(const user of userData.users) {
            if(user.username === username && user.password === password) {
                alert('Authentication successful');
                loginPopup.style.display="none";
                loginBtn.style.display="none";//hides login btn
                editBtn.style.display="block";//shows edit btn
                logoutBtn.style.display="block";
                sessionStorage.setItem('isLoggedIn', "true");
                //sets a session variable named 'isLoggedIn' to "true" to indicate that the user is logged in.
                displaySubscriptions();
                return;
            }
        }
    }
    
    // Authentication failed
    alert('Authentication failed. Invalid username or password.');
}

function logoutUser(){
    loginBtn.style.display="block";
    editBtn.style.display="none";
    saveBtn.style.display="none";
    logoutBtn.style.display="none";
    subsOutput.innerHTML = '';//clears any subscription displayed on the page by converting to an empty string
    sessionStorage.removeItem('isLoggedIn');// to remove the loggedIn session variable to indicate that the user is logged out.
}

//upon logging in, an isLoggedIn variable is set to True which is then retrieved to check the user logged in status  
function userLoggedinStatus(){
    let loggedInStatus = sessionStorage.getItem('isLoggedIn');//retrives the value of the logged in session variable and stores it in the 'loggedInSt'
    if(loggedInStatus == "true"){
        loginBtn.style.display="none";
        editBtn.style.display="block";
        logoutBtn.style.display="block";
        displaySubscriptions();
    }else{
        loginBtn.style.display="block";
        editBtn.style.display="none";
        saveBtn.style.display="none";
        logoutBtn.style.display="none";
        subsOutput.innerHTML = '';//clears any subscription displayed on the page by converting to an empty string
    }
    
}

function loadContent() {
    const storedContent = JSON.parse(localStorage.getItem('content'));
    //Retrieves the stored content from local storage and parses it into a JavaScript object.
    const currentPage = getCurrentPage();

    if (storedContent) {
        const pageData = storedContent[currentPage];
        //Retrieves the data specific to the current page from the stored content.

        if (pageData) {
            // Loop through sections
            for (const sectionKey in pageData) {
                if (pageData.hasOwnProperty(sectionKey)) {
                    //Iterates through each section of the page data.
                    const section = pageData[sectionKey];
                    //Retrieves the section object.
                    const sectionNumber = sectionKey.replace('section', '');
                    //Extracts the section number from the section key.

                    for (const key in section) {
                        //Iterates through each key-value pair in the section
                        if (section.hasOwnProperty(key)) {
                            const value = section[key];
                            //Retrieves the value associated with the key
                            const elementId = `${currentPage}Section${sectionNumber}${key}`;
                            //Generates the ID of the corresponding HTML element.
                            const element = document.getElementById(elementId);
                            //Finds the HTML element by its ID.
                            if (element.tagName.toLowerCase() === 'ul') {
                                //Checks if the element is a list.
                                // If it's a list, create list items
                                const listElement = document.createElement('ul');
                                //Creates a new <ul> element.
                                value.forEach(item => {
                                    //Iterates through each item in the value array
                                    const listItem = document.createElement('li');
                                    listItem.textContent = item;
                                    //Sets the text content of the list item.
                                    listElement.appendChild(listItem);
                                    //Appends the list item to the list.
                                });
                                element.appendChild(listElement);
                                //Appends the list to the HTML element.
                            } else if (element) {
                                // If the element is not a list, sets its text content
                                element.textContent = value;//Sets the text content of the element.
                            } else {
                                console.log(`Element with ID ${elementId} not found.`);
                            }
                        }
                    }
                }
            }
        } else {
            console.log('No data found for the current page in the local storage.');
        }
    } else {
        console.log('No stored content found in local storage.');
    }
}

function getCurrentPage() {
    // Get the current URL name
    const url = window.location.href;
    // Remove the .html extension from the url name
    const pageName = url.substring(url.lastIndexOf('/') + 1).replace('.html', '');
    //Takes the page name from the URL by finding the last '/' and taking everything after it. It will include the '.html' extension.
    //Removes the '.html' extension from the page name using the replace method.
    return pageName;
}

function editableContent(elementId) {
    const element = document.getElementById(elementId);
    //gets the element from the DOM with the specified ID.
    
    // Check if the element exists
    if (element) {
        // Create a new editable element based on the type of the original element
        //The subsequent if-else statements determine the type of the element and create an appropriate editable element for it:
        //For headings (h1, h2, h3, h4, h5), it creates an input element.
        //For paragraphs (p), it creates a textarea element.
        //For unordered lists (ul), it converts each list item (li) into an editable input element.
        let editableElement;
        if (element.tagName.toLowerCase() === 'h1') {
            editableElement = document.createElement('input');
            editableElement.type = 'text';
            editableElement.value = element.textContent;
        //The .textContent property retrieves the text content of the element, which is assigned to the value property of the input element.
        } else if (element.tagName.toLowerCase() === 'h2') {
            editableElement = document.createElement('input');
            editableElement.type = 'text';
            editableElement.value = element.textContent;
        } else if (element.tagName.toLowerCase() === 'h3') {
            editableElement = document.createElement('input');
            editableElement.type = 'text';
            editableElement.value = element.textContent;
        } else if (element.tagName.toLowerCase() === 'h4') {
            editableElement = document.createElement('input');
            editableElement.type = 'text';
            editableElement.value = element.textContent;
        } else if (element.tagName.toLowerCase() === 'h5') {
            editableElement = document.createElement('input');
            editableElement.type = 'text';
            editableElement.value = element.textContent;
        } else if (element.tagName.toLowerCase() === 'p') {
            editableElement = document.createElement('textarea');
            editableElement.textContent = element.textContent;
        } else if (element.tagName.toLowerCase() === 'ul') {
            // Convert each list item to a text input
            editableElement = document.createElement('ul');
            const listItems = element.querySelectorAll('li');
            if (listItems.length > 0) {
                listItems.forEach(li => {
                    const listItem = document.createElement('li');
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = li.textContent;
                    listItem.appendChild(input);
                    editableElement.appendChild(listItem);
                });
            } else {
                console.log('No list items found.');
            }
        } else {
            // If the element type is not supported for editing, return
            return;
        }

        // Copy attributes from the original element to the editable element
        Array.from(element.attributes).forEach(attr => {
            editableElement.setAttribute(attr.name, attr.value);
        });

        // Replace the original element with the editable one
        element.parentNode.replaceChild(editableElement, element);
    }
}

//retrieve data to edit the page content 
function editPageContent(){
    const savedData = JSON.parse(localStorage.getItem('content'));
    //function begins by fetching the saved content data from the local storage and parsing it into a JavaScript object.
    const currentlyWorkingPage = getCurrentPage();
    //retrieves the name of the currently active page using the getCurrentPage function.
    saveBtn.style.display = "block";
    editBtn.style.display = "none";

    //extracts the keys (page names) from the saved data object to determine which page's content needs to be edited.
    const index = Object.keys(savedData)[0];
    const index2 = Object.keys(savedData)[1];
    const index3 = Object.keys(savedData)[2];
    const index4 = Object.keys(savedData)[3];
    const index5 = Object.keys(savedData)[4];
    const index6 = Object.keys(savedData)[5];
    const index7 = Object.keys(savedData)[6];

    //The function checks if the currently active page matches the first saved page (index).
    //If the currently active page matches, it proceeds to make the content of each section editable by calling the editableContent function for each relevant element ID.
    if(currentlyWorkingPage==index){
        editableContent("indexSection1Heading1");
        editableContent("indexSection1Heading2");
        editableContent("indexSection1Heading3");
        editableContent("indexSection1Para1");
        editableContent("indexSection1Para2");
        editableContent("indexSection1Para3");

        editableContent("indexSection2Heading1");
        editableContent("indexSection2Para1");
        editableContent("indexSection2Para2");
        editableContent("indexSection2Para3");

        editableContent("indexSection3Para1");
        editableContent("indexSection3List");
        
        editableContent("indexSection4Heading1");
        editableContent("indexSection4Para1");
        editableContent("indexSection4Para2");
        editableContent("indexSection4Para3");

        editableContent("indexSection5Heading1");
        editableContent("indexSection5Heading2");
        editableContent("indexSection5Heading3");
        editableContent("indexSection5Heading4");
        editableContent("indexSection5Para1");
        editableContent("indexSection5Para2");
        editableContent("indexSection5Para3");


        
    } else if(currentlyWorkingPage==index2){

        //section1
        editableContent("index2Section1Heading1");
        editableContent("index2Section1Heading2");
        editableContent("index2Section1Heading3");
        editableContent("index2Section1Para1");
        editableContent("index2Section1Para2");
        editableContent("index2Section1Para3");

        //section2
        editableContent("index2Section2Heading1");
        editableContent("index2Section2Heading2");
        editableContent("index2Section2Heading3");
        editableContent("index2Section2Para1");
        editableContent("index2Section2Para2");
        editableContent("index2Section2Para3");

    }else if (currentlyWorkingPage==index3){
        //section1
        editableContent("index3Section1Heading1");
        editableContent("index3Section1Heading2");
        editableContent("index3Section1Para1");
        //section 2-12
        editableContent("index3Section2Heading1");
        editableContent("index3Section3Heading1");
        editableContent("index3Section4Heading1");
        editableContent("index3Section5Heading1");
        editableContent("index3Section6Heading1");
        editableContent("index3Section7Heading1");
        editableContent("index3Section8Heading1");
        editableContent("index3Section9Heading1");
        editableContent("index3Section10Heading1");
        editableContent("index3Section11Heading1");
        editableContent("index3Section12Heading1");

    }else if (currentlyWorkingPage==index4){
        editableContent("index4Section1Heading1");
        editableContent("index4Section1Heading2");
        editableContent("index4Section1Heading3");
        editableContent("index4Section1Para1");

        editableContent("index4Section2Heading1");
        editableContent("index4Section2Para1");

        editableContent("index4Section3Heading1");
        editableContent("index4Section3Heading2");
        editableContent("index4Section3Heading3");
        editableContent("index4Section3Para1");
        editableContent("index4Section3Para2");

    }else if (currentlyWorkingPage==index5){
        editableContent("index5Section1Heading2");
        editableContent("index5Section1Heading1");
        editableContent("index5Section1Heading3");
        editableContent("index5Section1Para1");
        editableContent("index5Section1Para2");

        editableContent("index5Section2Heading2");
        editableContent("index5Section2Heading1");
        editableContent("index5Section2Para1");
        editableContent("index5Section2Para2");

        editableContent("index5Section3Heading2");
        editableContent("index5Section3Heading1");
        editableContent("index5Section3Para1");
        editableContent("index5Section3Para2");

        editableContent("index5Section4Heading1");
        editableContent("index5Section4Heading2");
        editableContent("index5Section4Heading3");
        editableContent("index5Section4Para1");
        editableContent("index5Section4Para2");

    }else if (currentlyWorkingPage==index6){
        editableContent("index6Section1Para1");

        editableContent("index6Section2Heading1");
        editableContent("index6Section2Heading2");
        editableContent("index6Section2Para1");
        editableContent("index6Section2Para2");

        editableContent("index6Section3Heading1");
        editableContent("index6Section3Heading2");
        editableContent("index6Section3Heading3");
        editableContent("index6Section3Heading4");
        editableContent("index6Section3Para1");
        editableContent("index6Section3Para2");
        editableContent("index6Section3Para3");

    }else if (currentlyWorkingPage==index7){
        editableContent("index7Section1Para1");

        editableContent("index7Section2Heading1");
        editableContent("index7Section2Heading2");
        editableContent("index7Section2Para1");
        editableContent("index7Section2Para2");

        editableContent("index7Section3Heading1");
        editableContent("index7Section3Heading2");
        editableContent("index7Section3Heading3");
        editableContent("index7Section3Heading4");
        editableContent("index7Section3Para1");
        editableContent("index7Section3Para2");
        editableContent("index7Section3Para3");
    }
}

function revertContent(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const parent = element.parentNode;
        let revertElement;

        // Revert the element based on its tag name and class
        switch (element.tagName.toLowerCase()) {
            //It retrieves the parent node of the element to be reverted, which will be used to replace the editable element with the reverted element.
            case 'input':
                if (element.classList.contains('edit-Heading1')) {
                    revertElement = document.createElement('h1');
                } else if (element.classList.contains('edit-Heading2')) {
                    revertElement = document.createElement('h2');
                } else if (element.classList.contains('edit-Heading4')) {
                    revertElement = document.createElement('h4');
                }
                break;
            case 'textarea':
                revertElement = document.createElement('p');
                //It initializes a variable revertElement to hold the new element after reverting.
                break;
            case 'ul':
                case 'ul':
                revertElement = document.createElement('ul');
                break;
        }

        // Copy attributes from the editable element to the new element
        Array.from(element.attributes).forEach(attr => {
            revertElement.setAttribute(attr.name, attr.value);
        });

        // Replace the editable element with the new element
        parent.replaceChild(revertElement, element);
    }
}

function saveContent() {
    const currentlyWorkingPage = getCurrentPage();
    const savedData = JSON.parse(localStorage.getItem('content'));//'context' key
    editBtn.style.display = 'block';
    saveBtn.style.display = 'none';
    //retrieves the keys of the savedData object to access each section.
    const index = Object.keys(savedData)[0];
    const index2 = Object.keys(savedData)[1];
    const index3 = Object.keys(savedData)[2];
    const index4=Object.keys(savedData)[3];
    const index5=Object.keys(savedData)[4];
    const index6=Object.keys(savedData)[5];
    const index7=Object.keys(savedData)[6];
    //checks if the currently working page matches the index page.
    if (currentlyWorkingPage==index){
        //updates the savedData object with the edited content from the input fields.
        savedData.index.section1.Heading1 = document.getElementById('indexSection1Heading1').value;
        savedData.index.section1.Heading2 = document.getElementById('indexSection1Heading2').value;
        savedData.index.section1.Heading3 = document.getElementById('indexSection1Heading3').value;
        savedData.index.section1.Para1 = document.getElementById('indexSection1Para1').value;
        savedData.index.section1.Para2 = document.getElementById('indexSection1Para2').value;
        savedData.index.section1.Para3 = document.getElementById('indexSection1Para3').value;

        savedData.index.section2.Heading1 = document.getElementById('indexSection2Heading1').value;
        savedData.index.section2.Para1 = document.getElementById('indexSection2Para1').value;
        savedData.index.section2.Para2 = document.getElementById('indexSection2Para2').value;
        savedData.index.section2.Para3 = document.getElementById('indexSection2Para3').value;

        //saves them as an array.
        savedData.index.section3.Para1 = document.getElementById('indexSection3Para1').value;
        const indexListItems = document.querySelectorAll('#indexSection3List input');
        savedData.index.section3.List = Array.from(indexListItems).map(item => item.value);

        savedData.index.section4.Heading1 = document.getElementById('indexSection4Heading1').value;
        savedData.index.section4.Para1 = document.getElementById('indexSection4Para1').value;
        savedData.index.section4.Para2 = document.getElementById('indexSection4Para2').value;
        savedData.index.section4.Para3 = document.getElementById('indexSection4Para3').value;

        savedData.index.section5.Heading1 = document.getElementById('indexSection5Heading1').value;
        savedData.index.section5.Heading2 = document.getElementById('indexSection5Heading2').value;
        savedData.index.section5.Heading3 = document.getElementById('indexSection5Heading3').value;
        savedData.index.section5.Heading4 = document.getElementById('indexSection5Heading4').value;
        savedData.index.section5.Para1 = document.getElementById('indexSection5Para1').value;
        savedData.index.section5.Para2 = document.getElementById('indexSection5Para2').value;
        savedData.index.section5.Para3 = document.getElementById('indexSection5Para3').value;


        //After saving the content, it reverts the content of each edited element back to its original state using the revertContent function.
        revertContent("indexSection1Heading1");
        revertContent("indexSection1Heading2");
        revertContent("indexSection1Heading3");
        revertContent("indexSection1Para1");
        revertContent("indexSection1Para2");
        revertContent("indexSection1Para3");

        revertContent("indexSection2Heading1");
        revertContent("indexSection2Para1");
        revertContent("indexSection2Para2");
        revertContent("indexSection2Para3");

        revertContent("indexSection3Para1");
        revertContent("indexSection3List");
        
        revertContent("indexSection4Heading1");
        revertContent("indexSection4Para1");
        revertContent("indexSection4Para2");
        revertContent("indexSection4Para3");

        revertContent("indexSection5Heading1");
        revertContent("indexSection5Heading2");
        revertContent("indexSection5Heading3");
        revertContent("indexSection5Heading4");
        revertContent("indexSection5Para1");
        revertContent("indexSection5Para2");
        revertContent("indexSection5Para3");
    } else if(currentlyWorkingPage==index2){
        savedData.index2.section1.Heading1 = document.getElementById('index2Section1Heading1').value;
        savedData.index2.section1.Heading2 = document.getElementById('index2Section1Heading2').value;
        savedData.index2.section1.Heading3 = document.getElementById('index2Section1Heading3').value;
        savedData.index2.section1.Para1 = document.getElementById('index2Section1Para1').value;
        savedData.index2.section1.Para2 = document.getElementById('index2Section1Para2').value;
        savedData.index2.section1.Para3 = document.getElementById('index2Section1Para3').value;

        savedData.index2.section2.Heading1 = document.getElementById('index2Section2Heading1').value;
        savedData.index2.section2.Heading2 = document.getElementById('index2Section2Heading2').value;
        savedData.index2.section2.Heading3 = document.getElementById('index2Section2Heading3').value;
        savedData.index2.section2.Para1 = document.getElementById('index2Section2Para1').value;
        savedData.index2.section2.Para2 = document.getElementById('index2Section2Para2').value;
        savedData.index2.section2.Para3 = document.getElementById('index2Section2Para3').value;

        //section1
        revertContent("index2Section1Heading1");
        revertContent("index2Section1Heading2");
        revertContent("index2Section1Heading3");
        revertContent("index2Section1Para1");
        revertContent("index2Section1Para2");
        revertContent("index2Section1Para3");

        //section2
        revertContent("index2Section2Heading1");
        revertContent("index2Section2Heading2");
        revertContent("index2Section2Heading3");
        revertContent("index2Section2Para1");
        revertContent("index2Section2Para2");
        revertContent("index2Section2Para3")

    }else if (currentlyWorkingPage==index3){
        savedData.index3.section1.Heading1 = document.getElementById('index3Section1Heading1').value;
        savedData.index3.section1.Heading2 = document.getElementById('index3Section1Heading2').value;
        savedData.index3.section1.Para1 = document.getElementById('index3Section1Para1').value;

        savedData.index3.section2.Heading1 = document.getElementById('index3Section2Heading1').value;
        savedData.index3.section3.Heading1 = document.getElementById('index3Section3Heading1').value;
        savedData.index3.section4.Heading1 = document.getElementById('index3Section4Heading1').value;
        savedData.index3.section5.Heading1 = document.getElementById('index3Section5Heading1').value;
        savedData.index3.section6.Heading1 = document.getElementById('index3Section6Heading1').value;
        savedData.index3.section7.Heading1 = document.getElementById('index3Section7Heading1').value;
        savedData.index3.section8.Heading1 = document.getElementById('index3Section8Heading1').value;
        savedData.index3.section9.Heading1 = document.getElementById('index3Section9Heading1').value;
        savedData.index3.section10.Heading1 = document.getElementById('index3Section10Heading1').value;
        savedData.index3.section11.Heading1 = document.getElementById('index3Section11Heading1').value;
        savedData.index3.section12.Heading1 = document.getElementById('index3Section12Heading1').value;

        //section1
        revertContent("index3Section1Heading1");
        revertContent("index3Section1Heading2");
        revertContent("index3Section1Para1");
        //section 2-12
        revertContent("index3Section2Heading1");
        revertContent("index3Section3Heading1");
        revertContent("index3Section4Heading1");
        revertContent("index3Section5Heading1");
        revertContent("index3Section6Heading1");
        revertContent("index3Section7Heading1");
        revertContent("index3Section8Heading1");
        revertContent("index3Section9Heading1");
        revertContent("index3Section10Heading1");
        revertContent("index3Section11Heading1");
        revertContent("index3Section12Heading1");
    }else if (currentlyWorkingPage==index4){
        savedData.index4.section1.Heading1 = document.getElementById('index4Section1Heading1').value;
        savedData.index4.section1.Heading2 = document.getElementById('index4Section1Heading2').value;
        savedData.index4.section1.Heading3 = document.getElementById('index4Section1Heading3').value;
        savedData.index4.section1.Para1 = document.getElementById('index4Section1Para1').value;

        savedData.index4.section2.Heading1 = document.getElementById('index4Section2Heading1').value;
        savedData.index4.section2.Para1 = document.getElementById('index4Section2Para1').value;

        savedData.index4.section3.Heading1 = document.getElementById('index4Section3Heading1').value;
        savedData.index4.section3.Heading2 = document.getElementById('index4Section3Heading2').value;
        savedData.index4.section3.Heading3 = document.getElementById('index4Section3Heading3').value;
        savedData.index4.section3.Para1 = document.getElementById('index4Section3Para1').value;
        savedData.index4.section3.Para2 = document.getElementById('index4Section3Para2').value;

        revertContent("index4Section1Heading1");
        revertContent("index4Section1Heading2");
        revertContent("index4Section1Heading3");
        revertContent("index4Section1Para1");

        revertContent("index4Section2Heading1");
        revertContent("index4Section2Para1");

        revertContent("index4Section3Heading1");
        revertContent("index4Section3Heading2");
        revertContent("index4Section3Heading3");
        revertContent("index4Section3Para1");
        revertContent("index4Section3Para2");

    }else if (currentlyWorkingPage==index5){
        savedData.index5.section1.Heading1 = document.getElementById('index5Section1Heading1').value;
        savedData.index5.section1.Heading2 = document.getElementById('index5Section1Heading2').value;
        savedData.index5.section1.Heading3 = document.getElementById('index5Section1Heading3').value;
        savedData.index5.section1.Para1 = document.getElementById('index5Section1Para1').value;
        savedData.index5.section1.Para2 = document.getElementById('index5Section1Para2').value;

        savedData.index5.section2.Heading1 = document.getElementById('index5Section2Heading1').value;
        savedData.index5.section2.Heading2 = document.getElementById('index5Section2Heading2').value;
        savedData.index5.section2.Para1 = document.getElementById('index5Section2Para1').value;
        savedData.index5.section2.Para2 = document.getElementById('index5Section2Para2').value;

        savedData.index5.section3.Heading1 = document.getElementById('index5Section3Heading1').value;
        savedData.index5.section3.Heading2 = document.getElementById('index5Section3Heading2').value;
        savedData.index5.section3.Para1 = document.getElementById('index5Section3Para1').value;
        savedData.index5.section3.Para2 = document.getElementById('index5Section3Para2').value;

        savedData.index5.section4.Heading1 = document.getElementById('index5Section4Heading1').value;
        savedData.index5.section4.Heading2 = document.getElementById('index5Section4Heading2').value;
        savedData.index5.section4.Heading3 = document.getElementById('index5Section4Heading3').value;
        savedData.index5.section4.Para1 = document.getElementById('index5Section4Para1').value;
        savedData.index5.section4.Para2 = document.getElementById('index5Section4Para2').value;

        revertContent("index5Section1Heading2");
        revertContent("index5Section1Heading1");
        revertContent("index5Section1Heading3");
        revertContent("index5Section1Para1");
        revertContent("index5Section1Para2");

        revertContent("index5Section2Heading2");
        revertContent("index5Section2Heading1");
        revertContent("index5Section2Para1");
        revertContent("index5Section2Para2");

        revertContent("index5Section3Heading2");
        revertContent("index5Section3Heading1");
        revertContent("index5Section3Para1");
        revertContent("index5Section3Para2");

        revertContent("index5Section4Heading1");
        revertContent("index5Section4Heading2");
        revertContent("index5Section4Heading3");
        revertContent("index5Section4Para1");
        revertContent("index5Section4Para2");

    }else if (currentlyWorkingPage==index6){
        savedData.index6.section1.Para1 = document.getElementById('index6Section1Para1').value;

        savedData.index6.section2.Heading1 = document.getElementById('index6Section2Heading1').value;
        savedData.index6.section2.Heading2 = document.getElementById('index6Section2Heading2').value;
        savedData.index6.section2.Para1 = document.getElementById('index6Section2Para1').value;
        savedData.index6.section2.Para2 = document.getElementById('index6Section2Para2').value;

        savedData.index6.section3.Heading1 = document.getElementById('index6Section3Heading1').value;
        savedData.index6.section3.Heading2 = document.getElementById('index6Section3Heading2').value;
        savedData.index6.section3.Heading3 = document.getElementById('index6Section3Heading3').value;
        savedData.index6.section3.Heading4 = document.getElementById('index6Section3Heading4').value;
        savedData.index6.section3.Para1 = document.getElementById('index6Section3Para1').value;
        savedData.index6.section3.Para2 = document.getElementById('index6Section3Para2').value;
        savedData.index6.section3.Para3 = document.getElementById('index6Section3Para3').value;

        revertContent("index6Section1Para1");

        revertContent("index6Section2Heading1");
        revertContent("index6Section2Heading2");
        revertContent("index6Section2Para1");
        revertContent("index6Section2Para2");

        revertContent("index6Section3Heading1");
        revertContent("index6Section3Heading2");
        revertContent("index6Section3Heading3");
        revertContent("index6Section3Heading4");
        revertContent("index6Section3Para1");
        revertContent("index6Section3Para2");
        revertContent("index6Section3Para3");

    }else if (currentlyWorkingPage==index7){
        savedData.index7.section1.Para1 = document.getElementById('index7Section1Para1').value;

        savedData.index7.section2.Heading1 = document.getElementById('index7Section2Heading1').value;
        savedData.index7.section2.Heading2 = document.getElementById('index7Section2Heading2').value;
        savedData.index7.section2.Para1 = document.getElementById('index7Section2Para1').value;
        savedData.index7.section2.Para2 = document.getElementById('index7Section2Para2').value;

        savedData.index7.section3.Heading1 = document.getElementById('index7Section3Heading1').value;
        savedData.index7.section3.Heading2 = document.getElementById('index7Section3Heading2').value;
        savedData.index7.section3.Heading3 = document.getElementById('index7Section3Heading3').value;
        savedData.index7.section3.Heading4 = document.getElementById('index7Section3Heading4').value;
        savedData.index7.section3.Para1 = document.getElementById('index7Section3Para1').value;
        savedData.index7.section3.Para2 = document.getElementById('index7Section3Para2').value;
        savedData.index7.section3.Para3 = document.getElementById('index7Section3Para3').value;

        revertContent("index7Section1Para1");

        revertContent("index7Section2Heading1");
        revertContent("index7Section2Heading2");
        revertContent("index7Section2Para1");
        revertContent("index7Section2Para2");

        revertContent("index7Section3Heading1");
        revertContent("index7Section3Heading2");
        revertContent("index7Section3Heading3");
        revertContent("index7Section3Heading4");
        revertContent("index7Section3Para1");
        revertContent("index7Section3Para2");
        revertContent("index7Section3Para3");
    }
    // Save the modified data back to local storage
    localStorage.setItem('content', JSON.stringify(savedData));

    // Load content dynamically
    loadContent();
}

// Function to handle subscription
function storeSubscription() {
    const name = nameInput.value.trim();
    // Trim whitespace from the input values for name and email
    const email = emailInput.value.trim();
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    if (name && email) {
        // Save the subscription data to localStorage
        // Retrieve existing subscriptions from localStorage or initialize an empty array
        const subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];
        // Push the new subscription data to the subscriptions array
        subscriptions.push({ name, email });
        // Save the updated subscriptions array back to localStorage
        localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
        
        // Display success message
        alert("Subscription successful!");
        subsForm.reset();
        // Check if user is logged in
    
        if (isLoggedIn == 'true') {
            displaySubscriptions();
        }

    } else {
        // Display error message if name or email is missing
        alert("Please enter both name and email.");
    }
}

// Function to display subscriptions in a table
function displaySubscriptions() {
    // Check if user is logged in by retrieving the isLoggedIn status from sessionStorage
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
        return;
    }
    // If user is not logged in, exit the function

    const subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

    if (subscriptions.length === 0) {
        // If there are no subscriptions, display a message
        subsOutput.innerHTML = "No subscriptions found.";
        return;
    }

    // Clear any existing content in the output area
    subsOutput.innerHTML = "";

    // Create a table element
    const table = document.createElement("table");
    table.classList.add("subscription-table");

    // Create table headers
    const headers = ["Name", "Email"];
    const headerRow = document.createElement("tr");
    headers.forEach(headerText => {
        const header = document.createElement("th");
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    // Create rows for each subscription 
    subscriptions.forEach(subscription => {
        const row = document.createElement("tr");
        // Iterate through each key-value pair in the subscription object
        for (const key in subscription) {
            // Create a table cell for each value and populate with subscription data
            const cell = document.createElement("td");
            cell.textContent = subscription[key];
            row.appendChild(cell);
        }
        // Append the row to the table
        table.appendChild(row);
    });

    // Append the table to the output area
    subsOutput.appendChild(table);
}
  

