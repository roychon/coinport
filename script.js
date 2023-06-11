let start = 0;
let limit = 10;
const stats = document.querySelector(".stats");
const table = document.querySelector("table");
const tbody = document.querySelector("table tbody");
const showMoreBtn = document.querySelector('button.showMore');
// search is the id of the input box

// Global Stats
const globalStats = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.coinlore.net/api/global/");
    
    xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText)[0];
        // console.log(response);
        const coinsCount = document.createElement("div");
        const activeMarkets = document.createElement("div");
        const totalVolume = document.createElement("div");
        const avgChangePercent = document.createElement("div");
        // coinsCount
        const p1 = document.createElement("p");
        p1.textContent = "Coin Count";
        const p2 = document.createElement("p");
        p2.textContent = numWithCommas(response.coins_count);
        coinsCount.appendChild(p1);
        coinsCount.appendChild(p2);

        // activeMarkets
        const p3 = document.createElement("p");
        p3.textContent = "Active Markets";
        const p4 = document.createElement("p");
        p4.textContent = numWithCommas(response.active_markets);
        activeMarkets.appendChild(p3);
        activeMarkets.appendChild(p4);
        // totalVolume
        const p5 = document.createElement("p");
        p5.textContent = "Total Volume";
        const p6 = document.createElement("p");
        p6.textContent = "$ " + numWithCommas(response.total_volume);
        totalVolume.appendChild(p5);
        totalVolume.appendChild(p6);
        // avgChangePercent
        const p7 = document.createElement("p");
        p7.textContent = "Average Change Percent";
        const p8 = document.createElement("p");
        p8.textContent = response.avg_change_percent + " %";
        avgChangePercent.appendChild(p7);
        avgChangePercent.appendChild(p8);

        stats.appendChild(coinsCount);
        stats.appendChild(activeMarkets);
        stats.appendChild(totalVolume);
        stats.appendChild(avgChangePercent);
    });
    xhr.send(null);
}

// Table Stats
const tbodyStats = () => {
    const xhr = new XMLHttpRequest();
    const API = "https://api.coinlore.net/api/tickers/";
    xhr.open("GET", API);

    xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText)["data"];
        console.log(response);

        for (let i = start; i < limit; ++i) {
            const row = document.createElement("tr");
            row.className = "body-row";
            const star = document.createElement("td");
            const icon = document.createElement("i");
            icon.className = "fa-regular fa-star";
            icon.setAttribute("id", "star");
            star.appendChild(icon);
            const rank = document.createElement("td");
            const name = document.createElement("td");
            name.className = "name";
            name.classList.add("right-padding");
            const price = document.createElement("td");
            const marketCap = document.createElement("td");
            const circulatingSupply = document.createElement("td");
            const supply = document.createElement("td");
            const volume = document.createElement("td");
            const change = document.createElement("td");

            const symbol = document.createElement("span");
            symbol.textContent = response[i].symbol;
            symbol.className = "symbol";

            rank.textContent = response[i].rank;

            name.textContent = `${response[i].name} `;
            name.appendChild(symbol);
            price.textContent = `$${numWithCommas(response[i].price_usd)}`;
            marketCap.textContent =
                "$" + roundNumber(response[i].market_cap_usd);
            circulatingSupply.textContent = roundNumber(response[i].csupply);
            supply.textContent = roundNumber(response[i].tsupply);
            volume.textContent = roundNumber(response[i].volume24);
            change.textContent = response[i].percent_change_24h + "%";
            changeRate(change);

            row.appendChild(star);
            row.appendChild(rank);
            row.appendChild(name);
            row.appendChild(price);
            row.appendChild(marketCap);
            row.appendChild(circulatingSupply);
            row.appendChild(supply);
            row.appendChild(volume);
            row.appendChild(change);
            tbody.appendChild(row);
        }
        // add event listener for when star is clicked
        const stars = document.querySelectorAll("#star");
        stars.forEach(star => {
            star.addEventListener('click', () => {
                star.classList.toggle('.fa-regular');
                star.classList.toggle('fa-solid');
                star.classList.toggle('clickedStar');
                
                if (star.classList.contains("clickedStar")) {
                    const selectedRow = star.closest("tr");
                    const name = selectedRow.querySelector(".name").textContent;
                    console.log(name);

                    const rank =
                        selectedRow.querySelector(":nth-child(2)").textContent;
                    console.log(rank);

                    const price =
                        selectedRow.querySelector(":nth-child(4)").textContent;
                    console.log(price);

                    const data = {
                        rank: rank,
                        name: name,
                        price: price,
                    };

                    fetch("insert_coin.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    })
                        .then(() => {
                            console.log("Data inserted successfully:");
                        })
                        .catch((error) => {
                            console.error("Error inserting data:", error);
                        });
                }
            })
        })
    });
    xhr.send(null);
}

showMoreBtn.addEventListener("click", () => {
    if (limit === 100) return;
        start = limit;
        limit += 10;
    tbodyStats();
})

// Advanced Data on Specific Coin
const advancedData = (coin) => {
    const get = coin.toLowerCase().split(' ').join('-');
    window.location = `https://coincap.io/assets/${get}`;
}


// Edit Numbers => Commas
function numWithCommas(num) {
    let roundedNum = Number(num).toFixed(2);
    let numParts = roundedNum.toString().split(".");
    numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return numParts.join(".");
}

// Red/Green depending on positive/negative change rate
function changeRate(change) {
    const changeValue = parseFloat(change.textContent);
    if (changeValue > 0) {
        change.className = 'green';
        change.textContent = '⬆' + change.textContent;
    } else if (changeValue < 0) {
        change.className = 'red';
        change.textContent = '⬇' + change.textContent;
    } else {
        change.className = 'grey';
    }
}

// Round number to million or billion (if neccessary)
function roundNumber(number) {
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(2) + "b";
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(2) + "m";
    } else {
        return number;
    }
}

function getCoins() {
    if (!search.value) {
        results.innerHTML = '';
        return;
    };
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.coinlore.net/api/tickers/");
    
    xhr.addEventListener("load", () => {
        results.innerHTML = "";
        const coinNames = [];
        const responseArr = JSON.parse(xhr.responseText).data;
        responseArr.forEach(coin => {
            if (coin.name.toLowerCase().startsWith(search.value, 0)) {
                coinNames.push(coin.name);
            }
        })

        coinNames.sort();
        
        coinNames.forEach(coinName => {
            const p = document.createElement('p');
            p.textContent = coinName;
            p.addEventListener('click', () => {
                search.value = p.textContent;
                advancedData(search.value);
            })
            results.appendChild(p);
        })
    })

    xhr.send(null);
}

//
let locations;
let p; // which paragraph text you selected
let i; // index of paragraph text
search.addEventListener("keyup", function (e) {
    locations = document.querySelectorAll("#results p");
    if (e.key === "Enter") {
        if (p) {
            search.value = p.textContent;
            advancedData(input.value); // get advanced data for specific coin
        }
    } else if (e.key === "ArrowDown") {
        if (i >= 0 && i <= locations.length - 1) {
            locations[i].className = "";
        }
        if (i === locations.length - 1) {
            p = locations[0];
            i = 0;
            p.classList.add("selectSearch");
          
        } else if (i < locations.length - 1) {
            p = locations[++i];
            p.classList.add("selectSearch");
            console.log(p);
        }

    } else if (e.key === "ArrowUp") {
        if (i > 0) {
            p.classList.remove("selectSearch");
            p = locations[--i];
            p.classList.add("selectSearch");
            console.log(p);
        } else if (i === 0 && Boolean(p)) {
            p.classList.remove("selectSearch");
            i = locations.length - 1;
            p = locations[i];
            p.classList.add('selectSearch');

        }
    } else {
        i = -1;
        getCoins();
    }
});



globalStats();
tbodyStats();