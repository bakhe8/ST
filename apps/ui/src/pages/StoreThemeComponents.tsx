import React from "react";
import { useParams } from "react-router-dom";
import PageComponentsEditor from "../components/PageComponentsEditor";

const StoreThemeComponents = () => {
  const { storeId } = useParams();

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        مكونات الصفحات
      </h1>
      <div style={{ color: "#94a3b8", marginBottom: 20 }}>
        تحرير ترتيب وخصائص المكونات المؤثرة على المعاينة البصرية.
      </div>
      <PageComponentsEditor selectedStoreId={storeId || null} />
    </div>
  );
};

export default StoreThemeComponents;
