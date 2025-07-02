import React, { useState } from "react";
import { Card, Typography, Space } from "antd";
import { ReactSortable } from "react-sortablejs";
import QuestionForm from "./QuestionForm";
import { useTheme } from "../../context/ThemeContext";

const { Title, Text } = Typography;

const CreateTemplate = () => {
  const theme = useTheme()

  return (
    <div className="create-template" style={{ padding: 24, maxWidth: 900, margin: "40px auto" }}>
      <QuestionForm theme={theme}/>
    </div>
  );
};

export default CreateTemplate;