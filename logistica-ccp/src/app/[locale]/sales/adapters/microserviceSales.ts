const apiURI = "https://cr-bff-webapp-488938258128.us-central1.run.app"

export const getSalesPlan = async (): Promise<any> => {
    const url = apiURI + '/api/vendedor/listar_planes'
    // const url = 'http://127.0.0.1:3005/listar_planes'
    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if(!response.ok) {
            const error_msg = await response.text()
            throw new Error("No ha sido posible listar el plan de ventas: " + error_msg)
        }
        
        const data = await response.json()
        return data.body || [];
    } 
    catch (error) {
        console.error("No ha sido posible listar el plan de ventas", error)
        return []
    }
}