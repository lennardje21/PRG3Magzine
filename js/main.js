window.addEventListener('load', init);
window.localStorage;

//global vars
let fetchLocation = 'webservice/index.php';

function init()
{
    ajaxRequest(fetchLocation, createTheThing);
}

const ajaxRequest = (url, func) => {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(func)
        .catch(ajaxErrorHandler);
}


function createTheThing(data) {
    let spellInfo = document.getElementById('spellsGoHere');
    for (let spell of data) {
        let div = document.createElement("div");
        div.classList.add("spellInfo");
        div.dataset.name = spell.spellName;

        let classNameDiv = document.createElement("div")
        classNameDiv.classList.add("spellName");
        if (spell.spellName === localStorage.getItem(`favorite${spell.id}`)){
            classNameDiv.classList.add("favSpell");
        } else {
            classNameDiv.classList.remove("favSpell");
        }

        let h2 = document.createElement("h2");
        h2.innerHTML = spell.spellName;
        classNameDiv.appendChild(h2);
        div.appendChild(classNameDiv);

        let img = document.createElement("img");
        img.src = `images/${spell.spellImage}`;
        div.appendChild(img);

        //button to make something a favorite spell
        let favoriteButton = document.createElement('button');
        favoriteButton.classList.add("buttonClass");
        favoriteButton.id = "favoriteTest";
        let inStorage;

        if (spell.spellName === localStorage.getItem(`favorite${spell.id}`)){
            favoriteButton.innerHTML = 'Remove from favorites';
            inStorage = true;
        } else {
            favoriteButton.innerHTML = "Add to favorites";
            inStorage = false
        }

        favoriteButton.addEventListener("click", () => {
            if (inStorage === false) {
                localStorage.setItem(`favorite${spell.id}`, `${spell.spellName}`);
                favoriteButton.innerHTML = "Remove from favorites";
                classNameDiv.classList.add("favSpell");
                inStorage = true;
            } else {
                localStorage.removeItem(`favorite${spell.id}`)
                favoriteButton.innerHTML = "Add to favorites";
                classNameDiv.classList.remove("favSpell");
                inStorage = false;
            }
        });

        div.appendChild(favoriteButton);

        //button to show the details of a spell
        let detailsButton = document.createElement("button");
        detailsButton.classList.add("buttonClass");
        detailsButton.innerHTML = "Show details";

        detailsButton.addEventListener("click",  () => {
            ajaxRequest(`${fetchLocation}?id=${spell.id}`, showDetails);

        });

        div.appendChild(detailsButton);

        spellInfo.appendChild(div);
    }
}


function showDetails(spell) {
    //Haal de div op waar de data in moet komen
    let spellDetails = document.getElementById("spellDetailsGoHere");
    //Leegt de div zodat hij niet vol loopt
    spellDetails.innerHTML = '';
    spellDetails.style.display = "block";

    //creëer een h2 en zet er data in
    let spellName = document.createElement("div")
    spellName.classList.add("spellName");

    let spellNameH2 = document.createElement("h2");
    spellNameH2.innerHTML = spell.spellName + ' Details:';
    spellName.appendChild(spellNameH2);

    spellDetails.appendChild(spellName);


    let spellType = document.createElement("div");
    spellType.innerHTML = '<br><b>Spell Type:</b> ';
    spellDetails.appendChild(spellType);

    let spellTypeDiv = document.createElement("div");
    spellTypeDiv.classList.add("textToRight");
    spellTypeDiv.innerHTML = spell.spellType;
    spellType.appendChild(spellTypeDiv);


    let spellBonus = document.createElement("div");
    spellBonus.innerHTML = '<b>Bonus:</b> ';

    let spellBonusDiv = document.createElement("div")
    spellBonusDiv.classList.add("textToRight")
    spellBonusDiv.innerHTML = spell.bonus;
    spellBonus.appendChild(spellBonusDiv);

    spellDetails.appendChild(spellBonus);

    let FPCost = document.createElement("div");
    FPCost.innerHTML = '<b>FP Cost:</b> ';

    let FPCostDiv = document.createElement("div");
    FPCostDiv.classList.add("textToRight");
    FPCostDiv.innerHTML = spell.FPCost;
    FPCost.appendChild(FPCostDiv);

    spellDetails.appendChild(FPCost);

    //haalt de description op
    let descriptionDiv = document.createElement("div");
    descriptionDiv.innerHTML = '<br>' + spell.description;
    spellDetails.appendChild(descriptionDiv);


    //knop om het details veld af te sluiten
    let closeDetails = document.createElement("button")
    closeDetails.classList.add("buttonClass");
    closeDetails.addEventListener("click", () => {
        spellDetails.style.display = "none";
    });
    closeDetails.innerHTML = "close details";
    spellDetails.appendChild(closeDetails);

}
/*
function favorite(data){
    let clickedItem = data.target;
    console.log(clickedItem);
    if (clickedItem.nodeName !== "BUTTON") {
        return;
    }

    if (inStorage === false) {
        localStorage.setItem(`favorite${data.id}`, `${data.spellName}`);
        favoriteButton.innerHTML = "Remove from favorites";
        classNameDiv.classList.add("favSpell");
        inStorage = true;
    } else {
        localStorage.removeItem(`favorite${data.id}`)
        favoriteButton.innerHTML = "Add to favorites";
        classNameDiv.classList.remove("favSpell");
        inStorage = false;
    }

}
*/
function ajaxErrorHandler(data){
    console.log(data);
}
