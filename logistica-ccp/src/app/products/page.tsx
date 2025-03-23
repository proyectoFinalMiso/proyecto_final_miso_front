import type { AppProps } from "next/app"
import Sidebar from "../../../components/Sidebar"

const Products: React.FC = () => {

    return (
        <div className="flex h-screen w-screen">
            <Sidebar />
        </div>
    )
}

export default Products