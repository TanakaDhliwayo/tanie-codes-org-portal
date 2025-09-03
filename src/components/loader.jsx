//src\components\loader.jsx
const Loader = ({ title }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // stack vertically
        justifyContent: "flex-start",
        alignItems: "center", // true horizontal centering
        minHeight: "100vh",
        paddingTop: "20vh", // push down from top
        textTransform: "uppercase",
        fontSize: "24px",
      }}
    >
      <p style={{ marginBottom: "1em", textAlign: "center", width: "100%" }}>
        {title ? title : "Loading Data..."}
      </p>

      <div style={{ position: "relative", width: "80px", height: "80px" }}>
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};
export default Loader;
