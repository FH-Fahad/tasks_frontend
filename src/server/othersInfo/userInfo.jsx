import { useState, useEffect } from "react";
import UAParser from "ua-parser-js";

export function MyComponent() {
  const [result, setResult] = useState(null);
  useEffect(() => {
    const parser = new UAParser();
    const parsedResult = parser.getResult();
    setResult(parsedResult);
  }, []);

  // console.log(result);

  return result;

  // return (
  //   <div>
  //     {result && (
  //       <div>
  //         <p>
  //           Browser: {result.browser.name}, Version: {result.browser.major} (
  //           {result.browser.version})
  //         </p>
  //         <p>CPU Architecture: {result.cpu.architecture}</p>
  //         <p>
  //           Device: Name: {result.device.vendor || "N/A"}, Model:{" "}
  //           {result.device.model || "N/A"}, Type: {result.device.type || "N/A"}
  //         </p>
  //         <p>
  //           Engine: Name: {result.engine.name}, Version: {result.engine.version}
  //         </p>
  //         <p>
  //           OS: Name: {result.os.name}, Version:{result.os.version}
  //         </p>
  //         <p>UA: {result.ua}</p>
  //       </div>
  //     )}
  //   </div>
  // );
}
