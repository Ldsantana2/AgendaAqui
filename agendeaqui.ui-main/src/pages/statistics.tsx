"use client";
import { ClinicStatisticsDto } from "../types/api-dtos";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "../services/authService";
import axios from "axios";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  Layout,
  Card,
  Row,
  Col,
  Statistic,
  Spin,
  Alert,
  Progress,
  Rate,
  List,
} from "antd";

import {
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  PlusCircleOutlined,
  TeamOutlined,
  DollarOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";

interface BackendApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
}

const { Content } = Layout;

export default function StatisticsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [malePercentage, setMalePercentage] = useState<number>(0);
  const [femalePercentage, setFemalePercentage] = useState<number>(0);

  const [statisticsData, setStatisticsData] =
    useState<ClinicStatisticsDto | null>(null);

  const [stats, setStats] = useState<ClinicStatisticsDto>({
    totalPatients: 0,
    insurancePatients: 0,
    privatePatients: 0,
    appointmentsThisMonth: 0,
    appointmentsLastMonth: 0,
    canceledAppointments: 0,
    averageRating: 0,
    malePatients: 0,
    femalePatients: 0,
    newPatientsThisMonth: 0,
    averageConsultationDurationMinutes: 0,
    patientsByAgeGroup: {},
    mostFrequentService: "N/A",
    totalRevenueThisMonth: 0,
    scheduledAppointmentsThisMonth: 0,
    completedAppointmentsThisMonth: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        const profile = await getProfile();

        if (!profile?.user) {
          setError("Dados do perfil não encontrados.");
          return;
        }

        setUserRole(profile.user.role);
        let fetchedUserName: string | null = null;
        if (profile.user.role === "DOCTOR") {
          fetchedUserName = profile.doctor?.name || null;
        } else if (profile.user.role === "CLINIC") {
          fetchedUserName = profile.clinic?.name || null;
        } else {
          router.push("/");
          return;
        }
        setUserName(fetchedUserName);

        if (profile.user.role === "CLINIC") {
          const token = localStorage.getItem("token");

          if (!token) {
            setError(
              "Token de autenticação não encontrado. Por favor, faça login novamente.",
            );
            router.push("/login");
            return;
          }

          const response = await axios.get<
            BackendApiResponse<ClinicStatisticsDto>
          >(`${process.env.NEXT_PUBLIC_BASE_ROUTE}/statistics/clinic`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const fetchedStatsData: ClinicStatisticsDto = response.data.data;

          if (fetchedStatsData) {
            const totalGenderedPatients =
              fetchedStatsData.malePatients + fetchedStatsData.femalePatients;
            if (totalGenderedPatients > 0) {
              setMalePercentage(
                (fetchedStatsData.malePatients / totalGenderedPatients) * 100,
              );
              setFemalePercentage(
                (fetchedStatsData.femalePatients / totalGenderedPatients) * 100,
              );
            } else {
              setMalePercentage(0);
              setFemalePercentage(0);
            }
          }

          setStats(fetchedStatsData);
        } else {
          setError(
            "Estatísticas detalhadas estão disponíveis apenas para Clínicas. Verifique seu perfil.",
          );
        }
      } catch (err: any) {
        console.error("Erro ao carregar dados:", err);
        setError(err.message || "Erro ao carregar dados estatísticos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndStats();
  }, [router]);

  const insurancePercentage =
    stats.totalPatients > 0
      ? (stats.insurancePatients / stats.totalPatients) * 100
      : 0;
  const privatePercentage =
    stats.totalPatients > 0
      ? (stats.privatePatients / stats.totalPatients) * 100
      : 0;

  const growthRate =
    stats.appointmentsLastMonth > 0
      ? ((stats.appointmentsThisMonth - stats.appointmentsLastMonth) /
          stats.appointmentsLastMonth) *
        100
      : stats.appointmentsThisMonth > 0
        ? 100
        : 0;

  const cancellationRate =
    stats.appointmentsThisMonth > 0
      ? (stats.canceledAppointments / stats.appointmentsThisMonth) * 100
      : 0;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center flex-col"
        style={{ backgroundColor: "#f0f2f5" }}
      >
        <LoadingOverlay />
        <p className="mt-4 text-gray-600">Carregando estatísticas...</p>
      </div>
    );
  }

  return (
    <Layout className="min-h-screen pt-16 pb-8 bg-gray-100">
      <Content className="container mx-auto p-8 bg-white rounded-lg shadow-lg w-full max-w-7xl">
        {error && (
          <Alert
            message="Erro"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError("")}
            className="mb-8"
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#2D39A6]">
            Estatísticas da Clínica
          </h1>{" "}
          {/* Título mais claro */}
          <div className="text-gray-600">
            {userRole === "DOCTOR" ? "Dr(a). " : ""}
            {userName}
          </div>
        </div>

        {/* Summary Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} md={8}>
            <Card bordered={false} className="shadow-sm">
              <Statistic
                title="Total de Pacientes"
                value={stats.totalPatients}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} className="shadow-sm">
              <Statistic
                title="Receita Total (Mês)"
                value={stats.totalRevenueThisMonth.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#28a745" }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered={false} className="shadow-sm">
              <Statistic
                title="Avaliação Média"
                value={stats.averageRating.toFixed(1)}
                suffix="/5.0"
                prefix={
                  <Rate
                    character={<i className="anticon-star" />}
                    disabled
                    defaultValue={0}
                  />
                }
                valueStyle={{ color: "#faad14" }}
              />
              <Rate
                allowHalf
                disabled
                defaultValue={stats.averageRating}
                className="text-lg"
              />
            </Card>
          </Col>
        </Row>

        {/*  Appointments Breakdown (Agendadas vs. Realizadas) */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} md={12}>
            <Card bordered={false} className="shadow-sm">
              <Statistic
                title="Consultas Agendadas (Mês)"
                value={stats.scheduledAppointmentsThisMonth}
                precision={0}
                prefix={<ScheduleOutlined />}
                valueStyle={{ color: "#007bff" }}
              />
              <p className="text-sm text-gray-500 mt-2">
                Agendamentos pendentes ou confirmados neste mês.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card bordered={false} className="shadow-sm">
              <Statistic
                title="Consultas Realizadas (Mês)"
                value={stats.completedAppointmentsThisMonth}
                precision={0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Detailed Statistics */}
        <Row gutter={[24, 24]}>
          {/* Appointment Trend & Cancellation */}
          <Col xs={24} md={12}>
            <Card bordered={false} className="shadow-sm h-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Tendência de Agendamentos
              </h3>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Total Este Mês"
                    value={stats.appointmentsThisMonth}
                    precision={0}
                    valueStyle={{
                      color: growthRate >= 0 ? "#3f8600" : "#cf1322",
                    }}
                    prefix={
                      growthRate >= 0 ? <RiseOutlined /> : <FallOutlined />
                    }
                    suffix={`${growthRate.toFixed(1)}%`}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    em relação ao mês anterior ({stats.appointmentsLastMonth})
                  </p>
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Consultas Canceladas"
                    value={stats.canceledAppointments}
                    valueStyle={{ color: "#cf1322" }}
                  />
                </Col>
                <Col span={24}>
                  <Statistic
                    title="Taxa de Cancelamento"
                    value={cancellationRate.toFixed(1)}
                    suffix="%"
                  />
                  <Progress
                    percent={cancellationRate}
                    size="small"
                    strokeColor="#cf1322"
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Payment Type Breakdown */}
          <Col xs={24} md={12}>
            <Card bordered={false} className="shadow-sm h-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Tipo de Agendamento (Mês)
              </h3>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Plano de Saúde
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {stats.insurancePatients} ({insurancePercentage.toFixed(1)}
                    %)
                  </span>
                </div>
                <Progress
                  percent={insurancePercentage}
                  size="small"
                  strokeColor="#1890ff"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Particular
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {stats.privatePatients} ({privatePercentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  percent={privatePercentage}
                  size="small"
                  strokeColor="#52c41a"
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* NEW ROW: Demographics and Other Useful Info */}
        <Row gutter={[24, 24]} className="mb-8 mt-8">
          {" "}
          {/* Patient Gender Distribution */}
          <Col xs={24} md={12}>
            <Card bordered={false} className="shadow-sm h-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Distribuição de Pacientes por Gênero
              </h3>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Masculino
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {stats.malePatients} ({malePercentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  percent={malePercentage}
                  size="small"
                  strokeColor="#1890ff"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Feminino
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {stats.femalePatients} ({femalePercentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  percent={femalePercentage}
                  size="small"
                  strokeColor="#eb2f96"
                />
              </div>
            </Card>
          </Col>
          {/* Patient Age Group Distribution */}
          <Col xs={24} md={12}>
            <Card bordered={false} className="shadow-sm h-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Pacientes por Faixa Etária
              </h3>
              {Object.keys(stats.patientsByAgeGroup).length > 0 ? (
                <List
                  dataSource={Object.entries(stats.patientsByAgeGroup).sort(
                    ([, a], [, b]) => b - a,
                  )}
                  renderItem={([ageGroup, count]) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <TeamOutlined
                            style={{ fontSize: "20px", color: "#1890ff" }}
                          />
                        }
                        title={ageGroup}
                        description={`${count} pacientes`}
                      />
                    </List.Item>
                  )}
                  className="max-h-40 overflow-auto"
                />
              ) : (
                <p className="text-gray-500 italic">
                  Nenhum dado de faixa etária disponível.
                </p>
              )}
            </Card>
          </Col>
        </Row>

        {/* Other Performance and Service Info */}
        <Row gutter={[24, 24]} className="mt-8">
          {" "}
          <Col xs={24} md={12}>
            <Card bordered={false} className="shadow-sm h-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Outras Métricas de Performance
              </h3>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="Novos Pacientes (Mês)"
                    value={stats.newPatientsThisMonth}
                    prefix={<PlusCircleOutlined />}
                    valueStyle={{ color: "#fd7e14" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Duração Média Consulta"
                    value={stats.averageConsultationDurationMinutes.toFixed(1)}
                    suffix="min"
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: "#6c757d" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          {/* Service Most Frequent */}
          <Col xs={24} md={12}>
            <Card bordered={false} className="shadow-sm h-full">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Serviço Mais Frequente
              </h3>
              <Statistic
                value={stats.mostFrequentService || "N/A"}
                prefix={<MedicineBoxOutlined />}
                valueStyle={{ fontSize: "1.8em", color: "#20c997" }}
              />
              <p className="text-sm text-gray-500 mt-2">
                Serviço mais agendado e concluído no mês.
              </p>
            </Card>
          </Col>
        </Row>

        <div className="mt-8 text-sm text-gray-500 italic text-center">
          * Os dados apresentados são referentes ao período atual e podem variar
          conforme a utilização da plataforma.
        </div>
      </Content>
    </Layout>
  );
}
