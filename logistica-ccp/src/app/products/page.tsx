import Sidebar from "../../../components/Sidebar";
import DataTable from "../../../components/Datatable";

const Products: React.FC = () => {

    return (
        <div className="flex h-screen w-screen">
            <Sidebar />
            <DataTable />
        </div>
    )
}

export default Products