const create = async (user) => {
    try {
        let response = await fetch('/api/clubs/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const list = async (signal) => {
    return [
        { name: "Dance Club", pictureUri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCjXPBdhZPSLQsWltbfqNhBx7y92MN-yjHEQ&s", description: "aaa" },
        { name: "Cooking Club", pictureUri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw02FR0tX8qBPxZz1RjQITNBlE3CXO-1ybKQ&s", description: "bbb" },
    
        { name: "Dance Club", pictureUri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCjXPBdhZPSLQsWltbfqNhBx7y92MN-yjHEQ&s", description: "aaa" },
        { name: "Cooking Club", pictureUri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw02FR0tX8qBPxZz1RjQITNBlE3CXO-1ybKQ&s", description: "bbb" },
    ];
    // try {
    //     let response = await fetch('/api/clubs/', {
    //         method: 'GET',
    //         signal: signal,
    //     })
    //     console.log(response)
    //     return await response.json()
    // } catch (err) {
    //     console.log(err)
    // }
}

const read = async (params, credentials, signal) => {
    try {
        let response = await fetch('/api/clubs/' + params.clubId, {
            method: 'GET',
            signal: signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const update = async (params, credentials, user) => {
    try {
        let response = await fetch('/api/clubs/' + params.clubId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },
            body: JSON.stringify(user)
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const remove = async (params, credentials) => {
    try {
        let response = await fetch('/api/clubs/' + params.clubId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}
export { create, list, read, update, remove }
