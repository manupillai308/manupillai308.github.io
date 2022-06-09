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
        document.getElementById("aboutme-image").style.backgroundImage = `url(${d["image"]})`;
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
}