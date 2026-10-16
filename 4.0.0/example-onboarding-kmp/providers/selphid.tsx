import { SdkFinishStatus } from "@facephi/sdk-core-react-native";
import { selphid, SelphIDCaptureMode, SelphIDCompressFormat, SelphIDDocumentType, SelphIDTimeout, SelphidConfiguration, SelphidResult } from "@facephi/sdk-selphid-react-native";
import { drawError } from "./core";

export const defaultSelphidConfiguration = (): SelphidConfiguration => ({
  showResultAfterCapture: true,
  showTutorial: false,
  showPreviousTip: true,
  showDiagnostic: true,
  compressFormat: SelphIDCompressFormat.jpeg,
  jpgQuality: 95,
  timeout: SelphIDTimeout.Short,
  captureMode: SelphIDCaptureMode.Front,
  defaultDocumentType: SelphIDDocumentType.IdCard,
});

export const startSelphid = async (
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setSelphidResult: React.Dispatch<React.SetStateAction<SelphidResult|null>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>,
    config: SelphidConfiguration,
) => 
{ 
    try 
    {
      console.log("Starting startSelphid...", config);
      setSelphidResult(null);

      return await selphid(config)
      .then((result: SelphidResult) => 
      {
        console.log("SelphidResult", result)
        setSelphidResult(result);
        processSelphidResult(result, setMessage, setTextColorMessage, setShowError);
      })
      .finally(()=> {
        console.log("End startSelphid...");
      });
    } 
    catch (error) 
    {
      console.log(error);
    }
};

const processSelphidResult = (
    result: SelphidResult,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>
) => 
{
    switch (result.finishStatus) 
    {
      case SdkFinishStatus.Ok: // OK
          setShowError(false);
          setTextColorMessage('#777777');
        break;

      // Shows the result operation.
      case SdkFinishStatus.Error: // Error
        if (result.errorType) {
            drawError(setMessage, setTextColorMessage, setShowError, result);
        }
        break;
    }
};