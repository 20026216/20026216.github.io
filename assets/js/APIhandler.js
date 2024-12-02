
// Allows the form to not reload the page on submission
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("APIform");
    form.addEventListener("submit", inputHandler);
    // Allows enter to submit form when using text area
    document.getElementById("text-input").addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();  // Prevent default enter behavior in the form
            form.requestSubmit();  // Manually trigger form submit
        }
    });

});


// Handles input while taking account API calls
async function inputHandler(event) {
    event.preventDefault();

    const apitype = document.querySelector('input[name="price-check"]:checked');
    const selectedAPIType = apitype ? apitype.value : "No API selected";
    const symbol = document.getElementById("text-input").value;
    const inputCheck = InputCheck(symbol);

    if (inputCheck === true) {
        switch (selectedAPIType) {
            case "Crypto Price":
                const isCrypto = await isInCryptoList(symbol); // Correct the argument here to symbol, not selectedAPIType
                if (isCrypto) { // If the symbol is in the crypto list, fetch the data
                    cryptoHandler(symbol);
                } else {
                    document.getElementById("text-output").innerHTML = "Cannot Find Crypto";
                }
                break;
            case "Stock Price":
                stockHandler(symbol);
                break;
            default:
                document.getElementById("text-output").innerHTML = selectedAPIType;
        }
    }
}



// TODO: make a function that fetches data from crypto price
function cryptoHandler (input) {
    const apiKey = "PMwI8DmXX8YYMt51lA5oZg==08TeCoPPFxfMmJdV"
    fetch(`https://api.api-ninjas.com/v1/cryptoprice?symbol=${input}`,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: 'application/json',
                "X-Api-Key": apiKey,
            }
        })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else if (response.status === 400) {
                throw new Error("Cannot Recognise symbol");
            }

        })
        .then(function (data) {
            let price = data.price;
            document.getElementById("text-output").innerHTML = ` ${input} = $${price}`;

        })
        .catch(function (error) {
            document.getElementById("text-output").innerHTML = error.message;
        })
}

// Function that checks whether the crypto works with the list from another api
// (there was no catching that other error, only pain and suffering)
async function isInCryptoList(input) {
    const apiKey = "PMwI8DmXX8YYMt51lA5oZg==08TeCoPPFxfMmJdV";
    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/cryptosymbols`, {
            headers: {
                "Content-Type": "application/json",
                Accept: 'application/json',
                "X-Api-Key": apiKey,
            }
        });
        if (response.ok) {
            const data = await response.json();
            let cryptolist = data.symbols;
            return cryptolist.includes(input); // Check if the input symbol is in the list
        } else if (response.status === 400) {
            throw new Error("Cannot Symbol to API Crypto List");
        }
    } catch (error) {
        document.getElementById("text-output").innerHTML = error.message;
        return false; // Return false if any error occurs
    }
}


// TODO: make a function that fetches data from stock price
function stockHandler (input) {
    let stockInput = document.getElementById("text-input").value;
    const apiKey = "t5y6H8lz9JZLZa+XmXkJYg==59LFFF663OsoCuSB"
    fetch(`https://api.api-ninjas.com/v1/stockprice?ticker=${input}`,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: 'application/json',
                "X-Api-Key": apiKey,
            }
        })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Cannot recognise symbol");
        })
        .then(function (data) {
            let price = data.price;
            if (price === undefined) {
                document.getElementById("text-output").innerHTML = "Cannot Recognise symbol";
            }
            else
            {
                document.getElementById("text-output").innerHTML = ` ${stockInput} =  $${price}`;
            }

        })
        .catch(function (error) {
            document.getElementById("text-output").innerHTML = error.message;
        })
}

function InputCheck (input) {
    const regex = /^[A-Z0-9.]+$/;
    const lowerRegex = /^[a-z]+$/;

    if (regex.test(input)) {
        return true;
    }
    else if (lowerRegex.test(input)) {
        document.getElementById("text-output").innerHTML = "Please Enter in All Capitals"
        return false;
    }
    else {
        document.getElementById("text-output").innerHTML = "This Only Accepts '.', Capital Letters and Numbers"
        return false;
    }
}


