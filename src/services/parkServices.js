import Constants from "../constants/graphConstants";

export const createLog = async (data) => {
    try {
        const resp = await fetch(`${Constants.server}/log`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({log: data})
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

export const getAllLogs = async () => {
    try {
        const resp = await fetch(`${Constants.server}/logs?log[graph_name]=${Constants.defaultGraphName}`, {
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

