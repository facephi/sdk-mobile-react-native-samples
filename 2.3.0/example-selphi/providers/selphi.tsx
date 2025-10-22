import { SdkFinishStatus } from "@facephi/sdk-core-react-native/src/SdkCoreEnums";
import { selphi, SelphiConfiguration, SelphiResult } from "@facephi/sdk-selphi-react-native/src";
import { SdkCompressFormat, SdkLivenessMode } from "@facephi/sdk-selphi-react-native/src/SdkSelphiEnums";
import { drawError } from "./core";

  const getSelphiConfiguration = () => {
    let config: SelphiConfiguration = {
      debug: false,
      fullscreen: true,
      livenessMode: SdkLivenessMode.PassiveMode,
      resourcesPath: "fphi-selphi-widget-resources-sdk.zip",
      enableGenerateTemplateRaw: true,
      showResultAfterCapture: true,
      jpgQuality: 0.95,
      compressFormat: SdkCompressFormat.JPEG,
      showDiagnostic: true
    };
    return config;
  };

export const startSelphi = async (
    operationId: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>,
    setSelphiResult: React.Dispatch<React.SetStateAction<SelphiResult|null>>
) => 
{ 
    try 
    {
      if (operationId == "") {
        console.log("OPERATION ID MUST BE GENERATED FIRST")
        return
      }

      console.log("Starting startSelphi...");
      
      return await selphi(getSelphiConfiguration())
      .then((result: SelphiResult) => 
      {
        console.log("SelphiResult", result)
        setSelphiResult(result);
        processSelphiResult(
            result, 
            setMessage, 
            setTextColorMessage, 
            setShowError
        );
      })
      .finally(()=> {
        console.log("End startSelphi...");
      });
    } 
    catch (error) {
        console.log(error);
    }
};

const processSelphiResult = (
    result: SelphiResult,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>
) => 
{
    switch (result.finishStatus) 
    {
      case SdkFinishStatus.Ok: // OK
        setMessage('Preview selfie');
        setTextColorMessage('#777777');
        setShowError(false);
        break;

      case SdkFinishStatus.Error: // Error
        if (result.errorType) {
          drawError(setMessage, setTextColorMessage, setShowError, result);
        }
        break;
    }
};