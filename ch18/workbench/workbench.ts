function evalCode(codeString: string) {
  const functionObj = Function(codeString);
  if (functionObj) {
    try {
      return functionObj().toString();
    } catch (e) {
      return e.toString();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("button")?.addEventListener("click", () => {
    const codeInput = document.querySelector("textarea");
    codeInput && codeInput.parentElement?.append(evalCode(codeInput.value));
  });
});
