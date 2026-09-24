import { useRouter } from "next/router"

export const RegisterClinic = () => {
    const router = useRouter()

    return (
        <section className="bg-[#E6F4F1] py-12 px-6 ">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-[#176357] mb-4">
                    Você tem uma clínica? Receba pacientes agora mesmo!
                </h2>
                <p className="text-gray-700 text-base sm:text-lg mb-6">
                    Cadastre sua clínica gratuitamente na nossa plataforma e comece a atender milhares de pacientes hoje mesmo.
                </p>
                <button className="bg-[#176357] hover:bg-[#14564d] text-white
                 px-6 py-3 rounded-full text-sm font-medium transition duration-200"
                    onClick={() => router.push("/cadastro")}>
                    Cadastrar Clínica
                </button>
            </div>
        </section>
    )
}