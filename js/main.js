window.addEventListener('load', init);

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
    //Haal de div spellsGoHere op, deze bestaat al in de index.html
    let spellInfo = document.getElementById('spellsGoHere');

    //spell of data haalt 1 spell uit de json waarin al de spells staan
    for (let spell of data) {
        //creëer een div en geef die de class spellInfo
        let div = document.createElement("div");
        div.classList.add("spellInfo");

        //Maak een div aan waarin de naam van de spell komt te staan, krijgt class spellName
        let classNameDiv = document.createElement("div")
        classNameDiv.classList.add("spellName");

        //Controleer of de spell een favoriet is, als dat zo is krijgt spellName de class favSpell toegevoegd, dit maakt de tekst goud
        if (spell.spellName === localStorage.getItem(`favorite${spell.id}`)){
            classNameDiv.classList.add("favSpell");
        } else {
            classNameDiv.classList.remove("favSpell");
        }

        //Maak een h2 waarin de naam van de spell wordt gezet met innerHTML
        let h2 = document.createElement("h2");
        h2.innerHTML = spell.spellName;

        classNameDiv.appendChild(h2);
        div.appendChild(classNameDiv);

        //Haal de afbeelding naam op en zoek die op in de image folder
        let img = document.createElement("img");
        img.src = `images/${spell.spellImage}`;
        div.appendChild(img);

        //Knop om spells aan favorieten toe te voegen
        let favoriteButton = document.createElement('button');
        favoriteButton.classList.add("buttonClass");
        favoriteButton.id = "favoriteTest";
        let inStorage;


        //Checkt welke tekst in de knop moet komen(toevoegen of verwijderen) aan de hand van localstorage
        //wordt gebruikt bij het inladen
        if (spell.spellName === localStorage.getItem(`favorite${spell.id}`)){
            favoriteButton.innerHTML = 'Remove from favorites';
            inStorage = true;
        } else {
            favoriteButton.innerHTML = "Add to favorites";
            inStorage = false
        }


        /*functie om een spell aan favorieten toe te voegen of te verwijderen, zorgt er ook voor dat de kleur van een favorieten spell van kleur veranderd
         en de de tekst in de favoriteButton veranderd zonder dat er een refresh nodig is*/
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

        //Maak een knop die je de details van een spell laat zien
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

/**
 *
 * @param spell
 */

function showDetails(spell) {
    //Haal de div op waar de data in moet komen
    let spellDetails = document.getElementById("spellDetailsGoHere");

    //Leeg de div zodat hij niet vol loopt
    spellDetails.innerHTML = '';
    spellDetails.style.display = "block";

    //creëer een h2 en zet er data in
    let spellName = document.createElement("div")
    spellName.classList.add("spellName");

    let spellNameH2 = document.createElement("h2");
    spellNameH2.innerHTML = spell.spellName + ' Details:';
    spellName.appendChild(spellNameH2);

    spellDetails.appendChild(spellName);

    /*Functie gemaakt omdat ik drie keer dezelfde code moest schrijven
    * vraagt om een div naam(voor variable), een tekst die bold moet worden gemaakt, de spell waaruit de data moet komen en welk specifieke waarde er moet worden opgehaald*/
    spellDetails.appendChild(test("spellType", "Spell Type: ", spell, 'spellType'));
    spellDetails.appendChild(test("spellBonus", "Spell Bonus: ", spell, 'bonus'));
    spellDetails.appendChild(test("spellType", "FP Cost: ", spell, 'FPCost'));


    //haalt de description op
    let descriptionDiv = document.createElement("div");
    descriptionDiv.innerHTML = '<br>' + spell.description;
    spellDetails.appendChild(descriptionDiv);


    //knop om het details veld af te sluiten/verbergen
    let closeDetails = document.createElement("button")
    closeDetails.classList.add("buttonClass");
    closeDetails.addEventListener("click", () => {
        spellDetails.style.display = "none";
    });
    closeDetails.innerHTML = "close details";
    spellDetails.appendChild(closeDetails);
}


function test(divName, item, spell, specification) {
    divName = document.createElement("div");
    divName.innerHTML = `<b>${item}</b>`;

    window[divName + "Div"] = document.createElement("div");
    window[divName + "Div"].classList.add("textToRight");
    window[divName + "Div"].innerHTML = spell[specification];
    divName.appendChild(window[divName + "Div"]);
    return divName;
}



function ajaxErrorHandler(data){
    console.log(data);
}
