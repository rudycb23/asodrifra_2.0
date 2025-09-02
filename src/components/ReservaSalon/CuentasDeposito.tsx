import { FaMoneyBillWave, FaUniversity } from "react-icons/fa";

const CuentasDeposito = () => (
    <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="mb-4">
            <p className="font-bold text-gray-700 mb-1">Depósitos</p>
            <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-green-700" size={24} />
                <span>SINPE Móvil: <span className="font-bold text-green-700">87616802</span></span>
            </div>
        </div>
        <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-1">
                <FaUniversity className="text-blue-700" size={24} />
                <span>Transferencia Bancaria:</span>
            </div>
            <span className="font-bold break-all">Cuenta IBAN CR12345678901234567890</span>
        </div>
    </div>
);

export default CuentasDeposito;
