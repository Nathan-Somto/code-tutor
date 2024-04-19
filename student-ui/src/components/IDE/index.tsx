import Terminal from "./terminal";
import { Editor } from "@monaco-editor/react";
import { IDEProps } from "./types";
export default function Ide({
  handleChange,
  readOnly,
  value,
  langauge = "python",
  terminalOptions,
}: IDEProps) {
  return (
    <>
      <Editor
        height={"100vh"}
        width="100%"
        defaultLanguage={langauge.toLowerCase()}
        theme="vs-dark"
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
