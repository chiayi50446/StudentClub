const apiUrl = (process.env.NODE_ENV === 'development') ? '' : import.meta.env.VITE_API_URL;

const signin = async (user) => {
    try {
        let response = await fetch(`${apiUrl}/auth/signin/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(user)
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const signout = async () => {
    try {
        let response = await fetch(`${apiUrl}/auth/signout/`, { method: 'GET' })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

export { signin, signout }
