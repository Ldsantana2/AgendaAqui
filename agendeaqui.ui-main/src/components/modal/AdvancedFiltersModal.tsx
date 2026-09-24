import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface AdvancedFiltersModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  initialFilters?: {
    neighborhood?: string;
  };
}

const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({
  isVisible,
  onClose,
  onApplyFilters,
  initialFilters = {},
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    onApplyFilters(values);
    onClose();
  };

  return (
    <Modal
      title="Recursos Avançados"
      open={isVisible}
      onCancel={onClose}
      footer={[
        <Button
          key="cancel"
          onClick={onClose}
          className="!border-gray-300 !text-gray-700 hover:!border-[#2D39A6] hover:!text-[#2D39A6]"
        >
          Cancelar
        </Button>,
        <Button
          key="apply"
          type="primary"
          onClick={handleSubmit}
          className="!bg-[#2D39A6] !border-[#2D39A6] hover:!bg-[#283277] hover:!border-[#283277]"
        >
          Aplicar Filtros
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={initialFilters}>
        <Form.Item name="neighborhood" label="Bairro">
          <Input
            placeholder="Digite o bairro"
            className="!border-[#2D39A6] focus:!border-[#2D39A6] focus:!ring-[#2D39A6]"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AdvancedFiltersModal;
