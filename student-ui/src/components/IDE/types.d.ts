type TerminalProps = {
    currentValue: "testCases" | "output";
    output: string;
    testCases: {
      description: string;
      expectedOutput: string;
      output: string;
      passed: boolean;
    }[];
    maximized: boolean;
    handleOutputReset: () => unknown;
  }

type IDEProps = {
    readOnly: boolean,
    handleChange: (value: string | undefined, _event: unknown) => void,
    value: string,
    langauge: string,
    terminalOptions: TerminalProps
}
export {
    TerminalProps,
    IDEProps
}
