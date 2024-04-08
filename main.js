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
// Add event listener to the subscribe button
subscriptionBtn.addEventListener("click", storeSubscription);

//the code waits for the entire webpage to load in order to execute the laod content and userloggedinstatus funtions
window.addEventListener("load", () =>{
    loadContent();
    userLoggedinStatus();
});

// Fetching and Loading JSON content
fetchAndStoreJSON('content.json', 'content');
fetchAndStoreJSON('user.json', 'userData');

function fetchAndStoreJSON(jsonFile, storageKey) {
    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem(storageKey, JSON.stringify(data));
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
    const username = usernameinput.value;
    const password = passwordinput.value;
    
    // Get the user data from the localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    // Checks if the data exists
    if(userData && userData.users) {
        // Loop through the users array to find a match
        for(const user of userData.users) {
            if(user.username === username && user.password === password) {
                // Authentication successful
                alert('Authentication successful');
                loginPopup.style.display="none";
                loginBtn.style.display="none";
                editBtn.style.display="block";
                logoutBtn.style.display="block";
                sessionStorage.setItem('isLoggedIn', "true");
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
    subsOutput.innerHTML = '';
    sessionStorage.removeItem('isLoggedIn');
}

//upon logging in, an isLoggedIn variable is set to True which is then retrieved to check the user logged in status  
function userLoggedinStatus(){
    let loggedInStatus = sessionStorage.getItem('isLoggedIn');
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
        subsOutput.innerHTML = '';
    }
    
}

function loadContent() {
    const storedContent = JSON.parse(localStorage.getItem('content'));
    const currentPage = getCurrentPage();

    if (storedContent) {
        const pageData = storedContent[currentPage];

        if (pageData) {
            // Loop through sections
            for (const sectionKey in pageData) {
                if (pageData.hasOwnProperty(sectionKey)) {
                    const section = pageData[sectionKey];
                    const sectionNumber = sectionKey.replace('section', '');

                    for (const key in section) {
                        if (section.hasOwnProperty(key)) {
                            const value = section[key];
                            const elementId = `${currentPage}Section${sectionNumber}${key}`;
                            const element = document.getElementById(elementId);

                            if (element.tagName.toLowerCase() === 'ul') {
                                // If it's a list, create list items
                                const listElement = document.createElement('ul');
                                value.forEach(item => {
                                    const listItem = document.createElement('li');
                                    listItem.textContent = item;
                                    listElement.appendChild(listItem);
                                });
                                element.appendChild(listElement);
                            } else if (element) {
                                element.textContent = value;
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
    return pageName;
}

function editableContent(elementId) {
    const element = document.getElementById(elementId);
    
    // Check if the element exists
    if (element) {
        // Create a new editable element based on the type of the original element
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
    const currentlyWorkingPage = getCurrentPage();
    saveBtn.style.display = "block";
    editBtn.style.display = "none";

    const index = Object.keys(savedData)[0];
    const index2 = Object.keys(savedData)[1];
    const index3 = Object.keys(savedData)[2];
    const index4 = Object.keys(savedData)[3];
    const index5 = Object.keys(savedData)[4];
    const index6 = Object.keys(savedData)[5];
    const index7 = Object.keys(savedData)[6];

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
    const savedData = JSON.parse(localStorage.getItem('content'));
    editBtn.style.display = 'block';
    saveBtn.style.display = 'none';

    const index = Object.keys(savedData)[0];
    const index2 = Object.keys(savedData)[1];
    const index3 = Object.keys(savedData)[2];
    const index4=Object.keys(savedData)[3];
    const index5=Object.keys(savedData)[4];
    const index6=Object.keys(savedData)[5];
    const index7=Object.keys(savedData)[6];

    if (currentlyWorkingPage==index){
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
    const email = emailInput.value.trim();
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    
    if (name && email) {
        // Save the subscription data to localStorage
        const subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];
        subscriptions.push({ name, email });
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
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
        return;
    }

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
        for (const key in subscription) {
            const cell = document.createElement("td");
            cell.textContent = subscription[key];
            row.appendChild(cell);
        }
        table.appendChild(row);
    });

    // Append the table to the output area
    subsOutput.appendChild(table);
}
  

