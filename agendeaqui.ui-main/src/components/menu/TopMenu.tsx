"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaHome,
  FaBars,
  FaTimes,
  FaRegUser,
  FaRegClipboard,
  FaRegComments,
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
  FaRegQuestionCircle,
  FaRegGem,
  FaRegChartBar,
  FaUserPlus,
  FaRegNewspaper,
  FaRegFileAlt,
} from "react-icons/fa";
import { getToken, logout, getProfile } from "../../services/authService";

export default function TopMenu() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profilePatientId, setProfilePatientId] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserName(null);
    setUserRole(null);
    setProfilePatientId(null);
    window.location.href = "/login";
  };

  const fetchProfile = async () => {
    try {
      const profile = await getProfile();
      if (profile?.user) {
        setUserRole(profile.user.role);
        if (profile.user.role === "DOCTOR") {
          setUserName(profile.doctor?.name);
          setProfilePatientId(null);
        } else if (profile.user.role === "PATIENT") {
          setUserName(profile.patient?.name);
          setProfilePatientId(profile.patient?.id); // <- para o link
        } else if (profile.user.role === "CLINIC") {
          setUserName(profile.clinic?.name);
          setProfilePatientId(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserName(null);
        setUserRole(null);
        setProfilePatientId(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserName(null);
      setUserRole(null);
      setProfilePatientId(null);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      fetchProfile();

      const tokenCheckInterval = setInterval(
        () => {
          fetchProfile();
        },
        5 * 60 * 1000,
      );

      const handleUserActivity = () => {
        fetchProfile();
      };

      const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
      let activityTimeout: NodeJS.Timeout;
      const debouncedActivityHandler = () => {
        clearTimeout(activityTimeout);
        activityTimeout = setTimeout(handleUserActivity, 1000);
      };

      activityEvents.forEach((event) => {
        window.addEventListener(event, debouncedActivityHandler);
      });

      return () => {
        clearInterval(tokenCheckInterval);
        clearTimeout(activityTimeout);
        activityEvents.forEach((event) => {
          window.removeEventListener(event, debouncedActivityHandler);
        });
      };
    } else {
      setIsLoggedIn(false);
      setUserName(null);
      setUserRole(null);
      setProfilePatientId(null);
    }
  }, []);

  return (
    <>
      <nav className="bg-white text-[#364153] px-6 py-3 relative">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <img 
                src="/images/AGENDAQUI_FUNDO_TRANSPARENTE@4x.png" 
                alt="Agendaqui" 
                className="h-8 cursor-pointer" 
              />
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#364153] focus:outline-none"
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/help"
              className="flex items-center gap-1 hover:underline text-[#364153]"
            >
              <FaRegQuestionCircle /> Ajuda
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-1 hover:underline text-[#364153]"
            >
              <FaRegNewspaper />
              Blog
            </Link>

            {isLoggedIn && userRole === "CLINIC" && (
              <>
                <Link
                  href="/plans"
                  className="flex items-center gap-1 hover:underline text-[#364153]"
                >
                  <FaRegGem /> Planos
                </Link>
                <Link
                  href="/statistics"
                  className="flex items-center gap-1 hover:underline text-[#364153]"
                >
                  <FaRegChartBar /> Estatísticas
                </Link>
              </>
            )}

            {/* --- DOCUMENTOS DO PACIENTE --- */}
            {isLoggedIn && userRole === "PATIENT" && profilePatientId && (
              <Link
                href={`/patient/${profilePatientId}/documents`}
                className="flex items-center gap-1 hover:underline text-[#364153]"
              >
                <FaRegFileAlt /> Documentos
              </Link>
            )}
            {/* ------------------------------ */}

            {isLoggedIn ? (
              <>
                {userRole !== "DOCTOR" && (
                  <Link
                    href={
                      userRole === "CLINIC"
                        ? "/profile_clinic"
                        : "/profile_patient"
                    }
                    className="flex items-center gap-1 hover:underline text-[#364153]"
                  >
                    <FaRegUser /> Perfil
                  </Link>
                )}

                <Link
                  href={
                    userRole === "PATIENT"
                      ? "/consultations"
                      : userRole === "DOCTOR"
                        ? "/doctor_schedule"
                        : "/calendar"
                  }
                  className="flex items-center gap-1 hover:underline text-[#364153]"
                >
                  <FaRegClipboard />{" "}
                  {userRole === "PATIENT" ? "Consultas" : "Calendário"}
                </Link>

                {(userRole === "DOCTOR" || userRole === "CLINIC") && (
                  <Link
                    href="/patients"
                    className="flex items-center gap-1 hover:underline text-[#364153]"
                  >
                    <FaRegUser /> Pacientes
                  </Link>
                )}

                {userRole !== "DOCTOR" && (
                  <Link
                    href="/messages"
                    className="flex items-center gap-1 hover:underline text-[#364153]"
                  >
                    <FaRegComments /> Mensagens
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 hover:underline text-[#364153]"
                >
                  <FaRegArrowAltCircleRight /> Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/cadastro"
                  className="flex items-center gap-1 hover:underline text-[#364153]"
                >
                  <FaUserPlus /> Cadastrar
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-1 hover:underline text-[#364153]"
                >
                  <FaRegArrowAltCircleLeft /> Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white text-[#364153] p-4 shadow-md">
          <div className="max-w-7xl mx-auto space-y-3">
            <Link href="/help" className="flex items-center gap-2">
              <FaRegQuestionCircle /> Ajuda
            </Link>
            <Link href="/blog" className="flex items-center gap-2">
              <FaRegNewspaper /> Blog
            </Link>

            {isLoggedIn && userRole === "CLINIC" && (
              <>
                <Link href="/plans" className="flex items-center gap-2">
                  <FaRegGem /> Planos
                </Link>
                <Link href="/statistics" className="flex items-center gap-2">
                  <FaRegChartBar /> Estatísticas
                </Link>
              </>
            )}

            {/* --- DOCUMENTOS DO PACIENTE - MOBILE --- */}
            {isLoggedIn && userRole === "PATIENT" && profilePatientId && (
              <Link
                href={`/patient/${profilePatientId}/documents`}
                className="flex items-center gap-2"
              >
                <FaRegFileAlt /> Meus Documentos
              </Link>
            )}
            {/* ---------------------------------------- */}

            {isLoggedIn ? (
              <>
                {userRole !== "DOCTOR" && (
                  <Link
                    href={
                      userRole === "CLINIC"
                        ? "/profile_clinic"
                        : "/profile_patient"
                    }
                    className="flex items-center gap-2"
                  >
                    <FaRegUser /> Perfil
                  </Link>
                )}

                <Link
                  href={
                    userRole === "PATIENT"
                      ? "/consultations"
                      : userRole === "DOCTOR"
                        ? "/doctor_schedule"
                        : "/calendar"
                  }
                  className="flex items-center gap-2"
                >
                  <FaRegClipboard />{" "}
                  {userRole === "PATIENT" ? "Consultas" : "Calendário"}
                </Link>

                {(userRole === "DOCTOR" || userRole === "CLINIC") && (
                  <Link href="/patients" className="flex items-center gap-2">
                    <FaRegUser /> Pacientes
                  </Link>
                )}

                {userRole !== "DOCTOR" && (
                  <Link href="/messages" className="flex items-center gap-2">
                    <FaRegComments /> Mensagens
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <FaRegArrowAltCircleRight /> Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/cadastro" className="flex items-center gap-2">
                  <FaUserPlus /> Cadastrar
                </Link>
                <Link href="/login" className="flex items-center gap-2">
                  <FaRegArrowAltCircleLeft /> Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}