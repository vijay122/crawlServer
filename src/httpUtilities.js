let fetch = require('node-fetch');


module.exports = {
        fetchData(url, method, data)

        {
            return new Promise((resolve, reject) => {
            if (method == "GET") {
                fetch(url, {
                    method: method,
                    headers: {'Content-Type': 'application/json'},
                }).then(response => {
                    let rst = response.json();
                    return rst;
                })
                    .then(function (j) {
                        console.log(j);
                        resolve(j);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            else {
                fetch(url, {
                    method: method,
                    headers: {'Content-Type': 'application/json'},
                    body: data
                }).then(response => {
                    return response.json();
                }).catch(err => {
                    console.log(err);
                });
            }
    });
}
}