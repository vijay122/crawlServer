let fetch = require('node-fetch');


module.exports = {
    fetchData(url, method, data) {
        fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: data
        }).then(response => {
           debugger;
            //return response.json();
        }).catch(err => {
            console.log(err);
        });
    }
}