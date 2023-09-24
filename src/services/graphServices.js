import Constants from "../constants/graphConstants"

export const createGraph = async (adjacencyList, nodeOccupancy, name) => {
    try {
        const resp = await fetch(`${Constants.server}/graphs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({ adjacencyList, nodeOccupancy, name })
        })
        const responseData = await resp.json()

        if (resp.ok) {
            return { success: true, status: resp.status, data: responseData };
          } else {
            return { success: false, status: resp.status, error: responseData };
        }
    } catch (error) {
        return { success: false, status: null, error: error.message };
    }
}

export const getGraph = async (name) => {
    try {
        const resp = await fetch(`${Constants.server}/graph?graph[name]=${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const responseData = await resp.json()

        if (resp.ok) {
            return { success: true, status: resp.status, data: responseData };
          } else {
            return { success: false, status: resp.status, error: responseData };
        }
    } catch (error) {
        return { success: false, status: null, error: error.message };
    }
}

export const getAllGraphNames = async () => {
    try {
        const resp = await fetch(`${Constants.server}/graphs?graph[name_only]=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const responseData = await resp.json()

        if (resp.ok) {
            return { success: true, status: resp.status, data: responseData };
          } else {
            return { success: false, status: resp.status, error: responseData };
        }
    } catch (error) {
        return { success: false, status: null, error: error.message };
    }
}

export const updateGraph = async (adjacencyList, nodeOccupancy, name) => {
    try {
        const resp = await fetch(`${Constants.server}/graph`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({ adjacencyList, nodeOccupancy, name })
        })
        const responseData = await resp.json()

        if (resp.ok) {
            return { success: true, status: resp.status, data: responseData };
          } else {
            return { success: false, status: resp.status, error: responseData };
        }
    } catch (error) {
        return { success: false, status: null, error: error.message };
    }
}