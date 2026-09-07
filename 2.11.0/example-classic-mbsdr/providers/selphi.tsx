import { SdkFinishStatus } from "@facephi/sdk-core-react-native";
import { selphi, SelphiConfiguration, SelphiResult } from "@facephi/sdk-selphi-iad-react-native";
import { SdkCompressFormat, SdkLivenessMode } from "@facephi/sdk-selphi-iad-react-native";
import { drawError } from "./core";
import { apiPost } from "../apiRest";

  const getSelphiConfiguration = () => {
    let config: SelphiConfiguration = {
      fullscreen: true,
      livenessMode: SdkLivenessMode.PassiveMode,
      resourcesPath: "fphi-selphi-widget-resources-sdk.zip",
      enableGenerateTemplateRaw: true,
      showResultAfterCapture: true,
      jpgQuality: 0.95,
      compressFormat: SdkCompressFormat.JPEG,
      showDiagnostic: true,
      params: { "IADPayloadSize": "Small" }
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

        //apiPost('/check_capture_liveness', toByteArray(result.iad!!)).then((r1) => {
        apiPost('/check_capture_liveness',  result.iad!!).then((r1) => {
          console.log("Response from API:", r1);
        }).catch((error) => {
          console.error("Error calling API:", error);
        });
        
        break;

      case SdkFinishStatus.Error: // Error
        if (result.errorType) {
          drawError(setMessage, setTextColorMessage, setShowError, result);
        }
        break;
    }
};