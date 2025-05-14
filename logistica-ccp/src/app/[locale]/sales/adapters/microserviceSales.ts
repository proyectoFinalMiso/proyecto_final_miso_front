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

export const closePlan = async (closePlanData : {
    id: string,
}): Promise<any> => {
    const url = apiURI + '/api/vendedor/finalizar_plan'
    // const url = 'http://127.0.0.1:3005/finalizar_plan'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(closePlanData),
        });

        if(!response.ok) {
            const error_msg = await response.text()
            throw new Error("No ha sido posible cerrar el plan de ventas: " + error_msg)
        }
        
        const data = await response.json()
        return data.body || [];
    } 
    catch (error) {
        console.error("No ha sido posible cerrar el plan de ventas", error)
        return []
    }
}

export const createPlan = async (createPlanData : {
    vendedor_id: string,
    vendedor_nombre: string,
    meta_ventas: string,
    productos_plan: string,
}): Promise<void> => {
    const url = apiURI + '/api/vendedor/crear_plan_ventas'
    // const url = 'http://127.0.0.1:3005/crear_plan_ventas'

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createPlanData),
        });

        if(!response.ok) {
            const error_msg = await response.text()
            throw new Error("No ha sido posible crear el plan de ventas: " + error_msg)
        }
        
        const data = await response.json()
    } 
    catch (error) {
        console.error("No ha sido posible crear el plan de ventas", error)
    }

}