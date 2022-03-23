window.addEventListener('load', init);
window.localStorage;

//global vars
let fetchLocation = 'webservice/index.php';
let screenWidth = screen.availWidth;

function init()
{
    getSpells();
}

function getSpells() {
    fetch(fetchLocation)
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(createTheThing)
        .catch(ajaxErrorHandler);
}



function createTheThing(data) {
    let spellInfo = document.getElementById('spellsGoHere');
    for (let i = 0; i < data.length; i++) {
        let div = document.createElement("div");
        div.classList.add("spellInfo");

        let classNameDiv = document.createElement("div")
        classNameDiv.classList.add("spellName");
        if (data[i].spellName === localStorage.getItem(`favorite${data[i].id}`)){
            classNameDiv.classList.add("favSpell");
        } else {
            classNameDiv.classList.remove("favSpell");
        }

        let h2 = document.createElement("h2");
        h2.innerHTML = data[i].spellName;
        classNameDiv.appendChild(h2);
        div.appendChild(classNameDiv);

        let img = document.createElement("img");
        img.src = `images/${data[i].spellImage}`;
        div.appendChild(img);

        //button to make something a favorite spell
        let favoriteButton = document.createElement('button');
        favoriteButton.classList.add("buttonClass");
        favoriteButton.id = "favoriteTest";
        let inStorage;

        if (data[i].spellName === localStorage.getItem(`favorite${data[i].id}`)){
            favoriteButton.innerHTML = 'Remove from favorites';
            inStorage = true;
        } else {
            favoriteButton.innerHTML = "Add to favorites";
            inStorage = false
        }

        //favoriteButton.addEventListener("click" )

        favoriteButton.onclick = function () {
            if (inStorage === false) {
                localStorage.setItem(`favorite${data[i].id}`, `${data[i].spellName}`);
                favoriteButton.innerHTML = "Remove from favorites";
                classNameDiv.classList.add("favSpell");
                inStorage = true;
            } else {
                localStorage.removeItem(`favorite${data[i].id}`)
                favoriteButton.innerHTML = "Add to favorites";
                classNameDiv.classList.remove("favSpell");
                inStorage = false;
            }
        }
        div.appendChild(favoriteButton);

        //button to show the details of a spell
        let detailsButton = document.createElement("button");
        detailsButton.classList.add("buttonClass");
        detailsButton.innerHTML = "Show details";
        detailsButton.onclick = function () {
                fetch(`${fetchLocation}?id=${data[i].id}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .then(showDetails)
                    .catch(ajaxErrorHandler)
            };
        div.appendChild(detailsButton);


        spellInfo.appendChild(div);
    }
}

//  function favoriteOrNot()

function showDetails(data) {
    console.log(screenWidth);
    if (screenWidth > 400) {
        //Haal de div op waar de data in moet komen
        let spellDetails = document.getElementById("spellDetailsGoHere")
        //Leegt de div zodat hij niet vol loopt
        spellDetails.innerHTML = '';

        //creëer een h2 en zet er data in
        let spellName = document.createElement("div")
        spellName.classList.add("spellName");

        let spellNameH2 = document.createElement("h2");
        spellNameH2.innerHTML = data.spellName + ' Details:';
        spellName.appendChild(spellNameH2);

        spellDetails.appendChild(spellName);


        let spellType = document.createElement("div");
        spellType.innerHTML = '<br><b>Spell Type:</b> ';
        spellDetails.appendChild(spellType);

        let spellTypeDiv = document.createElement("div");
        spellTypeDiv.classList.add("textToRight");
        spellTypeDiv.innerHTML = data.spellType;
        spellType.appendChild(spellTypeDiv);


        let spellBonus = document.createElement("div");
        spellBonus.innerHTML = '<b>Bonus:</b> ';

        let spellBonusDiv = document.createElement("div")
        spellBonusDiv.classList.add("textToRight")
        spellBonusDiv.innerHTML = data.bonus;
        spellBonus.appendChild(spellBonusDiv);

        spellDetails.appendChild(spellBonus);

        //
        let descriptionDiv = document.createElement("div");
        descriptionDiv.innerHTML = '<br>' + data.description;
        spellDetails.appendChild(descriptionDiv);

        let FPCostDiv = document.createElement("div");
        FPCostDiv.innerHTML = 'FP Cost: ' + data.FPCost;
    }
}

function ajaxErrorHandler(data){
    console.log(data);
}