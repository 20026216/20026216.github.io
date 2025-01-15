

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
async function cryptoHandler(input) {
    try {
        const response = await fetch(`/crypto/${input}`);
        const data = await response.json();
        if (data.price) {
            document.getElementById('text-output').innerHTML = `${input} = $${data.price}`;
        } else {
            throw new Error('Cannot recognize symbol');
        }
    } catch (err) {
        document.getElementById('text-output').innerHTML = err.message;
    }
}


// Function that checks whether the crypto works with the list from another api
// (there was no catching that other error, only pain and suffering)
async function isInCryptoList(input) {
    try {
        const response = await fetch(`http://localhost:3000/crypto/symbols`);
        console.log(response);
        if (response.ok) {
            const data = await response.json();
            return data.symbols.includes(input); // Check if the input symbol is in the list
        } else {
            throw new Error("Cannot fetch crypto symbols");
        }
    } catch (error) {
        document.getElementById("text-output").innerHTML = error.message;
        return false; // Return false if any error occurs
    }
}


// TODO: make a function that fetches data from stock price
async function stockHandler(input) {
    try {
        const response = await fetch(`/stock/${input}`);
        const data = await response.json();
        if (data.price) {
            document.getElementById("text-output").innerHTML = `${input} = $${data.price}`;
        } else {
            throw new Error('Cannot recognize symbol');
        }
    } catch (err) {
        document.getElementById("text-output").innerHTML = err.message;
    }
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


