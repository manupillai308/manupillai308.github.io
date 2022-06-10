endpointUrl = "http://127.0.0.1:3000";

function createNodeFromHTML(string) {
    var div = document.createElement('div');
    div.innerHTML = string;
    return div.firstChild;
}

function loadMain(){
    fetch(endpointUrl+"/aboutme")
    .then((res) => res.json())
    .then((d) => {
        const img = document.getElementById("aboutme-image");
        img.style.backgroundImage = `url(${d["image"]})`;
        img.innerHTML = "";
        document.getElementById("aboutme-body").innerHTML = d["body"];
    });

    fetch(endpointUrl+"/newsupdate")
    .then((res) => res.json())
    .then(data => {
        const newspad = document.getElementById("news-update");
        const refnode = document.getElementById("lastnode");
        for(let i=0; i < data.length; i++){
            const newsNode = createNodeFromHTML(`<li><span style="font-weight:bold;">${data[i]["date"]}</span>: ${data[i]["body"]}<span style="display: ${(data[i]["new"]?"default;":"none;")}" class="pulsate">NEW!</span></li>`);
            newspad.insertBefore(newsNode, refnode);
        }
    })
    fetch(endpointUrl+"/carousel")
    .then(res => res.json())
    .then(data => {
        const carousel = document.getElementById("carousel");
        const dot = document.getElementById("dot");
        carousel.removeChild(carousel.firstElementChild);
        dot.removeChild(dot.firstElementChild);
        let i = 1, t = Object.entries(data).length;
        for (const value of Object.values(data)){
            const carNode = createNodeFromHTML(`<div class="mySlides fade">
            <div class="numbertext">${i} / ${t}</div>
            <div class="car-image box-shadow" style="background-image: url(${value["image"]});"></div>
            <div class="text">${value["caption"]}</div>
        </div>`);
            carousel.insertBefore(carNode, dot); i++;
            const newDot = createNodeFromHTML(`<span class="dot"></span>`);
            dot.appendChild(newDot);
        }
    })


}

function loadPub(){
    const publist = `<div class="pub-list">
        <div class="pub-title">$$TITLE$$$$NEW$$</div>
        <div class="pub-authors">$$AUTHORS$$</div>
        <div style="display: flex; margin: 0.3rem 0; align-items: center;">
        </div></div>`;
    function pubLoader(what){
        fetch(endpointUrl+`/publications?which=${what}`)
        .then((res) => res.json())
        .then(data => {
            const which = document.getElementById(`${what}`);
            which.removeChild(which.firstElementChild);

            // authors, date, doi, paper, project, talk, title, code, new
            for (const value of Object.values(data)){
                var publist_html = publist.replace("$$TITLE$$", value["title"]).replace("$$AUTHORS$$", value["authors"].trim());
                if (value["new"]) publist_html = publist_html.replace("$$NEW$$", ` <span class="pulsate">NEW!</span>`);
                else publist_html = publist_html.replace("$$NEW$$", ``);

                delete value["authors"];
                delete value["title"];
                delete value["new"];
                const pubNode = createNodeFromHTML(publist_html);
                which.appendChild(pubNode);

                const metaNode = pubNode.lastChild;
                if(value["doi"]){
                    metaNode.appendChild(createNodeFromHTML(`<div onclick="window.open('${value['doi']}', '_blank')" class="pub-meta">DOI</div>`));
                    delete value["doi"];
                }
                if(value["doi"] == "") delete value["doi"];
                for (const [key, val] of Object.entries(value)){
                    if((key === "date") || val == "") continue;
                    metaNode.appendChild(createNodeFromHTML(`<div onclick="window.open('${val}', '_blank')" class="pub-meta">${key}</div>`));
                }
                metaNode.appendChild(createNodeFromHTML(`<div class="pub-date">${value["date"]}</div>`));
            }
        });
    }
    pubLoader("journal");
    pubLoader("conference");
    pubLoader("bookchapter");
}

function loadContact(){
    fetch(endpointUrl+"/contact")
    .then((res) => res.json())
    .then((d) => {
        const img = document.getElementById("contact-image");
        img.src = `${d["image"]}`;
        img.style.display = "block";
    });
}