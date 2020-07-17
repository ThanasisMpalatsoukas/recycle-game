/**
 * Author: Thanasis mpalatsoukas
 */

/**
 * Configurations for the working of
 * the game!
 */

let CONFIG = {
    speed: 2000,
    bin: {
        "blue" : [20,28],
        "brown" : [12,19],
        "green" : [1,11]
    },
    winningPoints: 300,
    amountOfLosingEl: 10
}

/**
 * WARNING! 
 * 
 * don't change something below
 * if you don't know what you are
 * doing.
 */


function RecycableCollection() {
    this.recycables = [];
    
    /**
     * @param {Recycable} rec 
     * 
     * @returns {Void}
     */
    this.addRecycable = (rec) => {
        this.recycables.push(rec);
    }

    /**
     * @param {Int} key 
     * 
     * @returns {Recycable} rec
     */
    this.find = (key) => {
        let rec = -1;
        this.recycables.map( recycable => {
            if (recycable.key == key) {
                rec = recycable;
            }
        });
        return rec;
    }
    this.remove = (key) => {
        for (let i=0;i<this.recycables.length;i++) {
            if (this.recycables[i].key == key) {
                this.recycables.splice(i, 1);
                return;
            }
        }
    }
    this.removeAll = () => {
        this.recycables.map( rec => {
            rec.deleteEl();
        });
        this.recycables = [];
    }
}

function BinCollection() {
    this.bins = [];

    /**
     * @param {Bin} bin 
     * 
     * @returns {Void}
     */
    this.addBin = (bin) => {
        this.bins.push(bin);
    }

    /**
     * 
     * @param {String} key
     * 
     * @returns {Bin} 
     */
    this.find = (key) => {
        let bin = -1;
        this.bins.map( bin1 => {
            if (bin1.key == key) {
                bin = bin1;
            }
        });
        return bin;
    }

    this.collides = (el) => {
        let binAns;
        this.bins.map( bin => {
            if (doElsCollide(bin.el, el)) {
                binAns = bin;
            }
        });
        return binAns;
    }

}

/**
 * 
 * @param {String} name 
 * @param {Integer} points 
 * @param {Integer} key 
 * @param {Integer} binKey 
 */
function Recycable (name, points, key, binKey, imgSrc) {
    this.name = name;
    this.points = points;
    this.key = key;
    this.binKey = binKey;
    this.imgSrc = imgSrc;
    this.el = "";
    this.id = "k" + key;

    this.createEl = () => {
        let topOf = Math.floor((Math.random() * gameObjectEl.clientHeight));
        let leftOf = Math.floor((Math.random() * gameObjectEl.clientWidth));

        let div = document.createElement("div");
        div.setAttribute("key", this.key);
        div.setAttribute("draggable", true);
        div.setAttribute("ondragstart", "dragStart(event);");
        div.setAttribute("ontouchstart", "mobileTouchStart(event);");
        div.setAttribute("ontouchmove", "mobileTouchMove(event);");
        div.setAttribute("ontouchend", "mobileTouchEnd(event);");
        div.style.backgroundImage = "url(./images/r" + this.imgSrc + ".png)";
        div.style.backgroundSize = "cover";
        div.style.backgroundPosition = "center";
        div.classList = imgSrc + " object";
        div.style.top = topOf + "px";
        div.style.left = leftOf + "px";
        this.el = div;

        gameObjectEl.appendChild(div);
    }

    this.deleteEl = () => {
        if (this.el != "") {
            gameObjectEl.removeChild(this.el);
        }
    }
}

/**
 * 
 * @param {String} name 
 * @param {Integer} key 
 */
function Bin(name, key, alert, alertFail, el) {
    this.name = name;
    this.key = key;
    this.el = el;
    this.alert = document.getElementById(alert);
    this.alertFail = document.getElementById(alertFail);
}

let gameObjectEl = document.getElementById("game-objects");
let pointsShow = document.getElementById("points");
let winningScreen = document.getElementById("winning-message");
let losingScreen = document.getElementById("losing-message");
let beginMessage = document.getElementById("begin-message");
let timeSpan = document.getElementById("time");

let binCollection = new BinCollection();
let recycableCollection = new RecycableCollection();

let allBins = document.getElementsByClassName("bin");

let bin1 = new Bin("bin1", 0, "point-alert-bin-1", "point-alert-lose-bin-1", allBins[0]);
let bin2 = new Bin("bin2", 1, "point-alert-bin-2", "point-alert-lose-bin-2", allBins[1]);
let bin3 = new Bin("bin3", 2, "point-alert-bin-3", "point-alert-lose-bin-3", allBins[2]);

let incremental = 0;
let timeKeeper = 0;

let timeKeeping = setInterval( () => {
    timeKeeper++;
}, 1000);

/**
 * Adding items to drag to bins
 */
let ok = "";

binCollection.addBin(bin1);
binCollection.addBin(bin2);
binCollection.addBin(bin3);

beginMessage.style.display = "flex";

function startGame() {
    ok = setInterval(gameInterval, CONFIG.speed);
    beginMessage.style.display = "none";
}

/**
 * DESKTOP Event handlers
 */
function triggerDrop(event, bin = null) {

    /**
     * In case we are in a mobile version
     * we pass bin automatically
     */
    if (bin == null) {
        bin = binCollection.find(event.currentTarget.getAttribute("key"));
    }

    if (bin.key == currentRec.binKey) {
        currentRec.deleteEl();

        let val = 0;
        if (pointsShow.innerHTML != "" ) {
            val = parseInt(pointsShow.innerHTML);
        }

        val+=currentRec.points;
        bin.alert.innerHTML = currentRec.points;

        pointsShow.innerHTML = val;

        bin.alert.classList.add("appear");

        /**
         * Winning condition!
         */
        if (parseInt(pointsShow.innerHTML) >= CONFIG.winningPoints) {
            clearInterval(ok);
            clearInterval(timeKeeping);
            let formattedTime = computeSecondsAndMin(timeKeeper);
            timeSpan.innerHTML = formattedTime; 
            winningScreen.style.display = "flex";
            recycableCollection.removeAll();
        }

        recycableCollection.remove(currentRec.key);

        setTimeout( () => {
            bin.alert.classList.remove("appear");
        }, 500);
    }
    else {
        currentRec.deleteEl();
        bin.alertFail.innerHTML = "-" + currentRec.points;
        bin.alertFail.classList+=" appear";
        bin.alertFail.classList.add("appear");

        let val = 0;
        if (pointsShow.innerHTML != "") {
            val = parseInt(pointsShow.innerHTML);
        }
        
        val -= currentRec.points;
        pointsShow.innerHTML=val;

        recycableCollection.remove(currentRec.key);

        setTimeout( () => {
            bin.alertFail.classList.remove("appear");
        }, 500);
    }
}

let points = 0;
let currentElement = "";
let haveEl = 0;

function dragStart(event) {
    currentRec = recycableCollection.find(event.currentTarget.getAttribute("key"));
}

/**
 * MOBILE event handlers
 */
function mobileTouchStart(event) {
    currentRec = recycableCollection.find(event.currentTarget.getAttribute("key"));

}

function mobileTouchEnd(event) {
    
    let bin = binCollection.collides(currentRec.el);
    if (bin != undefined) {
        triggerDrop(event, bin);
    }
}


function mobileTouchMove(event) {
    var touchLocation = event.targetTouches[0];

    currentRec.el.style.left = touchLocation.pageX + 'px';
    currentRec.el.style.top = touchLocation.pageY + 'px';
}

function triggerDragEnter(event) {
    event.preventDefault();
}

function triggerDragOver(event) {
    event.preventDefault();
}

function computeSecondsAndMin(sec) {
    let min = 0;
    if (sec > 60) {
        min = Math.floor(sec/60);
        sec -= min*60;
    }
    return min+"m"+" "+sec+"s";
}

function randomNumbGenerator(low, high) {
    return Math.floor(Math.random() * (high + 1 - low) + low);
}

function reStart() {
    restartGame();
    ok = setInterval( gameInterval, CONFIG.speed);
    timeKeeping = setInterval( () => {
        timeKeeper++;
    }, 1000);
}

function restartGame() {
    timeKeeper = 0;
    RecycableCollection.recycable = [];
    pointsShow.innerHTML = 0;
    winningScreen.style.display = "none";
    losingScreen.style.display = "none";
}

function gameInterval() {
    let binKey = Math.floor((Math.random() * 3));
    
    // Losing condition
    if (recycableCollection.recycables.length > CONFIG.amountOfLosingEl) {
        clearInterval(ok);
        clearInterval(timeKeeping);
        losingScreen.style.display = "flex";
        recycableCollection.removeAll();
    }

    /**
     * In case we change the items 
     * we need to change these values
     * to add more items.
     */
    let obj = 0;
    if (binKey == 0) {
        /**
         * Bin blue
         */
        obj = randomNumbGenerator(CONFIG.bin.blue[0],CONFIG.bin.blue[1]);
    }
    else if (binKey == 1) {
        /**
         * bin brown
         */
        obj = randomNumbGenerator(CONFIG.bin.brown[0],CONFIG.bin.brown[1]);
    }
    else {
        /**
         * Bin green
         */
        obj = randomNumbGenerator(CONFIG.bin.green[0],CONFIG.bin.green[1]);
    }


    let rec1 = new Recycable("w2", 20, incremental, binKey, obj);
    rec1.createEl();
    recycableCollection.addRecycable(rec1);
    incremental++;
}

doElsCollide = function(el1, el2) {
    el1.offsetBottom = el1.offsetTop + el1.offsetHeight;
    el1.offsetRight = el1.offsetLeft + el1.offsetWidth;
    el2.offsetBottom = el2.offsetTop + el2.offsetHeight;
    el2.offsetRight = el2.offsetLeft + el2.offsetWidth;

    return !((el1.offsetBottom < el2.offsetTop) ||
             (el1.offsetTop > el2.offsetBottom) ||
             (el1.offsetRight < el2.offsetLeft) ||
             (el1.offsetLeft > el2.offsetRight))
};