import { Select } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import Fuse from "fuse.js";
const { Option, OptGroup } = Select; // Importe o OptGroup aqui

import { useEffect, useMemo, useState } from "react";

interface SearchIndexProps {
    searchForIndex
    onItemSelect?: (item: any) => void;

}

export default function SearchIndex({ searchForIndex, onItemSelect }: SearchIndexProps) {

    const [query, setQuery] = useState("");

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const selectWidth = windowWidth < 768 ? 200 : 400;


    const combinedData = useMemo(() => {
        if (!searchForIndex) return [];

        return [
            ...(searchForIndex.clinics ?? []).map((clinic: any) => ({
                ...clinic,
                type: "Clínica"
            })),
            ...(searchForIndex.doctors ?? []).map((doctor: any) => ({
                ...doctor,
                id: doctor.id,
                fullName: `${doctor.name ?? ""} ${doctor.surname ?? ""}`.trim(),
                type: "Profissional"
            })),
            ...(searchForIndex.specialities ?? []).map((spec: any) => ({
                ...spec,
                type: "Especialidade"
            })),
            ...(searchForIndex.extraSpecialities ?? []).map((spec: any) => ({
                ...spec,
                type: "Especialidade"
            })),
            ...(searchForIndex.exams ?? []).flatMap((examGroup: any) =>
                (examGroup.exams ?? []).map((exam: any) => ({
                    ...exam,
                    examTypeName: examGroup.name,
                    examTypeDescription: examGroup.description,
                    type: "Exame",
                }))
            )
        ];
    }, [searchForIndex]);

    const fuse = useMemo(() => {
        return new Fuse(combinedData, {
            keys: [
                "type",
                "name",
                "fullName",
                "about",
                "specialty",
                "description",
                "locations.city",
                "locations.state",
                "locations.address",
                "clinicName",
                "serviceCategoryName"
            ],
            threshold: 0.3,
        });
    }, [combinedData]);

    const filteredData = useMemo(() => {
        if (!query) return combinedData;

        const terms = query.split(/\s+/).filter(Boolean);

        let results = combinedData;
        for (const term of terms) {
            results = fuse.search(term).map((r) => r.item).filter(item => results.includes(item));
        }

        return results;
    }, [query, fuse, combinedData]);

    // Lógica para agrupar os dados por tipo
    const groupedData = useMemo(() => {
        const dataToGroup = query === "" ? filteredData.filter((item) => item.type === "Especialidade") : filteredData;

        return dataToGroup.reduce((acc, item) => {
            const type = item.type || "Outros";
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(item);
            return acc;
        }, {});
    }, [filteredData, query]);

    return (
        <Select
            showSearch
            placeholder="especialidade, médico, exame ou clínica"
            style={{ width: selectWidth }} // Largura do campo de entrada é responsiva
            dropdownStyle={{ width: selectWidth }} // Largura do dropdown igual à do campo de entrada
            onSearch={(value) => setQuery(value)}
            filterOption={false}
            optionLabelProp="label"
            onChange={(value) => {
                const selected = combinedData.find(item => item.id === value);
                onItemSelect?.(selected);
            }}
        >
            {Object.entries(groupedData).map(([type, items]) => (
                <OptGroup key={type} label={type}>
                    {(items as any[]).map((item: any) => (
                        <Option
                            key={item.id}
                            value={item.id}
                            label={`${item.name} ${item.surname ?? ""}`.trim()}
                        >
                            {item.name}{" "}
                            {item.surname && <span>{item.surname} </span>}{" "}
                            <span style={{ color: "#999" }}>
                                {item.type}
                                {item.locations?.[0]?.city && (
                                    <>
                                        {" "}
                                        <EnvironmentOutlined style={{ marginRight: 4 }} />
                                        {item.locations[0].city}
                                    </>
                                )}
                            </span>
                        </Option>
                    ))}
                </OptGroup>
            ))}
        </Select>
    );
}