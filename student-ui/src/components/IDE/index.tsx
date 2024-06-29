import Terminal from "./terminal";
import { Editor } from "@monaco-editor/react";
import { IDEProps } from "./types";
import React from "react";
export default function Ide({
  handleChange,
  readOnly,
  value,
  langauge = "python",
  terminalOptions,
}: IDEProps) {
  const [theme, setTheme] = React.useState<"light" | "vs-dark">('light');
  React.useEffect(() => {
    const isDark = document.body.classList.contains('dark');
    setTheme(isDark ? 'vs-dark' : 'light')
  }, [])
  return (
    <>
      <Editor
        height={"100vh"}
        width="100%"
        defaultLanguage={langauge.toLowerCase()}
        theme={theme}
        onChange={handleChange}
        options={{
          readOnly,
        }}
        value={value}
      />
      <Terminal {...terminalOptions} />
    </>
  );
}
