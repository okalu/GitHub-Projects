function populateFields(username){
    const xhr = new XMLHttpRequest();
    const url = `https://api.github.com/users/${username}/repos`;

    xhr.open('GET', url, true);
    // parsing through the request
    let listOfTitles = [];
    xhr.onload = function() {
        const data = JSON.parse(this.response);
        // console.log(data);
        const projectList = document.querySelector(".api-data");
        let languagesList = [];
        for(let i in data){
            const eachTitle = data[i].name;
            const eachDesc = data[i].description;
            const eachUrl = data[i].html_url;
            const eachLanguage = data[i].language;
            // console.log("built with " + eachLanguage);
            // languagesList.push(eachLanguage);

            const hasPages = data[i].hasPages;

            // add to the repo name list
            listOfTitles.push(eachTitle);
            // if hasPages is true add a link to it.

            // repo button
            const newRepo = repoButtonMaker(eachTitle, eachDesc, eachLanguage, projectList);
            
            // details within the repo (collapsibles)
            const repoContent = repoContentMaker(eachUrl);
            
            makeItCollapsible(newRepo);
            projectList.appendChild(repoContent);
            // break;
        }
        drawMainChart(username, listOfTitles);
    }
    xhr.send();
}
function repoButtonMaker(eachTitle, eachDesc, eachLanguage, projectList) {
    const newRepo = document.createElement('button');
    newRepo.type = "button";
    newRepo.className = "collapsible";
    newRepo.innerText = eachTitle;
    // console.log("language :  " + eachLanguage);
    newRepo.innerText += " -> " + eachLanguage
    if (eachDesc != null)
        newRepo.innerText += " : " + eachDesc;
    projectList.appendChild(newRepo);
    return newRepo;
}
function repoContentMaker(eachUrl) {
    const repoContent = document.createElement('div');
    repoContent.className = 'repo-content';
    const repoLink = document.createElement('a');
    repoLink.href = eachUrl;
    repoLink.innerText = "Goto repository";
    const trial = document.createElement('h1');
    trial.textContent = "Graphs and details about the repo";
    repoContent.appendChild(trial);
    repoContent.appendChild(repoLink);
    return repoContent;
}
function makeItCollapsible(thisOne){
    thisOne.addEventListener('click', function(){
            thisOne.classList.toggle("active");
            var content = this.nextElementSibling;
            
            // toggle visiblity
            if(content.style.maxHeight){
                content.style.maxHeight = null;
                console.log("clicked off");
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                console.log("clicked on");
            }
    });
}
function drawMainChart(userURL, listOfRepo){
    const ctx = document.getElementById('user-languages');
    const xhrLan = new XMLHttpRequest();
    console.log(listOfRepo);

    for(const eachRepo of listOfRepo){
        const urlLan = `https://api.github.com/repos/${userURL}/${eachRepo}/languages`;
        console.log(urlLan);
        xhrLan.open('GET', urlLan, true);

        xhrLan.onload = function() {
            let languagesList = JSON.parse(this.response);
            console.log("list of languages");
            console.log(languagesList);
            
            // for(const [key, value] of languagesList)
            //     console.log();

            // looping through fields in an object
            for (const index in languagesList) {
                console.log("pring from for in loop");
                console.log(`${index}: ${languagesList[index]}`);
            }
        }
        xhrLan.send();
    }
    
    let labels = ['Java', 'JS', 'CSS', 'HTML', 'C++', 'SCSS'];
    let labelData = [40, 30, 20, 10, 2, 7];

    const mainChart = chartMain(ctx, labels, labelData);
}
function chartMain(ctx, labels, labelData) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Language breakdown',
                data: labelData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// oh Java, I miss you already
// public static void main ... lol
// let githubUser = 'okalu';
let githubUser = 'abrahammehari';
populateFields(githubUser);

// make use of bubbling of DOM elements

// to work around "api call limit", limit requests to only one.
// once the whole logic is working, OAuth can be added.
