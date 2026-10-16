import { SdkFinishStatus } from "@facephi/sdk-core-react-native";
import { selphi, SelphiCamera, SelphiCompressFormat, SelphiConfiguration, SelphiFaceLivenessMode, SelphiResult } from "@facephi/sdk-selphi-react-native";
import { drawError } from "./core";

export const defaultSelphiConfiguration = (): SelphiConfiguration => ({
  livenessMode: SelphiFaceLivenessMode.Passive,
  cameraPreferred: SelphiCamera.Front,
  enableGenerateTemplateRaw: true,
  showResultAfterCapture: true,
  showTutorial: true,
  showPreviousTip: true,
  showDiagnostic: true,
  iadEnabled: false,
  jpgQuality: 95,
  compressFormat: SelphiCompressFormat.JPEG,
});

export const startSelphi = async (
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>,
    setSelphiResult: React.Dispatch<React.SetStateAction<SelphiResult|null>>,
    config: SelphiConfiguration,
) => 
{ 
    try 
    {
      console.log("Starting startSelphi...", config);
      return await selphi(config)
      .then((result: SelphiResult) => 
      {
        console.log("SelphiResult", result)
        setSelphiResult(result);
        processSelphiResult(result, setMessage, setTextColorMessage, setShowError);
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