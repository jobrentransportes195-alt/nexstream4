import Header from "./components/Header";

export default function App() {
  function fakeLogout() {
    console.log("logout");
  }

  return (
    <>
      <Header onLogout={fakeLogout} />
      <div style={{ marginTop: 120, color: "white" }}>
        HEADER OK
      </div>
    </>
  );
}